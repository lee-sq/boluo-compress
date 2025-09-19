import * as fs from 'fs';
import * as FileType from 'file-type';

/**
 * 图片检测器，用于检测图片格式、EXIF信息等
 */
export class Checker {
  private static instance: Checker;
  
  private readonly JPEG_SIGNATURE = new Uint8Array([0xFF, 0xD8, 0xFF]);
  private readonly JPG_EXT = '.jpg';

  public static getInstance(): Checker {
    if (!Checker.instance) {
      Checker.instance = new Checker();
    }
    return Checker.instance;
  }

  /**
   * 判断是否为JPG格式
   */
  public isJPG(buffer: Buffer): boolean {
    if (!buffer || buffer.length < 3) {
      return false;
    }
    
    const signature = new Uint8Array([buffer[0], buffer[1], buffer[2]]);
    return this.arraysEqual(this.JPEG_SIGNATURE, signature);
  }

  /**
   * 获取图片旋转角度
   * 返回值: 0, 90, 180, 270
   */
  public getOrientation(buffer: Buffer): number {
    if (!buffer) {
      return 0;
    }

    let offset = 0;
    let length = 0;

    // ISO/IEC 10918-1:1993(E)
    while (offset + 3 < buffer.length && (buffer[offset++] & 0xFF) === 0xFF) {
      const marker = buffer[offset] & 0xFF;

      // 检查是否为填充标记
      if (marker === 0xFF) {
        continue;
      }
      offset++;

      // 检查是否为SOI或TEM标记
      if (marker === 0xD8 || marker === 0x01) {
        continue;
      }
      
      // 检查是否为EOI或SOS标记
      if (marker === 0xD9 || marker === 0xDA) {
        break;
      }

      // 获取长度并检查是否合理
      length = this.pack(buffer, offset, 2, false);
      if (length < 2 || offset + length > buffer.length) {
        console.error('Invalid length');
        return 0;
      }

      // 如果是APP1中的EXIF标记则跳出
      if (marker === 0xE1 && length >= 8
          && this.pack(buffer, offset + 2, 4, false) === 0x45786966
          && this.pack(buffer, offset + 6, 2, false) === 0) {
        offset += 8;
        length -= 8;
        break;
      }

      // 跳过其他标记
      offset += length;
      length = 0;
    }

    // JEITA CP-3451 Exif Version 2.2
    if (length > 8) {
      // 识别字节序
      const tag = this.pack(buffer, offset, 4, false);
      if (tag !== 0x49492A00 && tag !== 0x4D4D002A) {
        console.error('Invalid byte order');
        return 0;
      }
      const littleEndian = (tag === 0x49492A00);

      // 获取偏移量并检查是否合理
      let count = this.pack(buffer, offset + 4, 4, littleEndian) + 2;
      if (count < 10 || count > length) {
        console.error('Invalid offset');
        return 0;
      }
      offset += count;
      length -= count;

      // 获取计数并遍历所有元素
      count = this.pack(buffer, offset - 2, 2, littleEndian);
      while (count-- > 0 && length >= 12) {
        // 获取标签并检查是否为方向标签
        const orientationTag = this.pack(buffer, offset, 2, littleEndian);
        if (orientationTag === 0x0112) {
          const orientation = this.pack(buffer, offset + 8, 2, littleEndian);
          switch (orientation) {
            case 1:
              return 0;
            case 3:
              return 180;
            case 6:
              return 90;
            case 8:
              return 270;
            default:
              console.error('Unsupported orientation');
              return 0;
          }
        }
        offset += 12;
        length -= 12;
      }
    }

    console.error('Orientation not found');
    return 0;
  }

  /**
   * 获取文件扩展名
   * 使用file-type库进行更准确的文件类型检测
   */
  public async getExtSuffix(buffer: Buffer): Promise<string> {
    try {
      // 使用file-type库进行文件类型检测
      const fileType = await FileType.fromBuffer(buffer);
      
      if (fileType) {
        // 支持的图片格式映射
        const supportedFormats: { [key: string]: string } = {
          'jpg': '.jpg',
          'jpeg': '.jpg', 
          'png': '.png',
          'webp': '.webp',
          'gif': '.gif',
          'bmp': '.bmp',
          'tiff': '.tiff',
          'avif': '.avif',
          'heic': '.heic',
          'heif': '.heif'
        };
        
        const extension = supportedFormats[fileType.ext];
        if (extension) {
          return extension;
        }
      }
      
      // 如果file-type检测失败，回退到原有的简单检测
      if (this.isJPG(buffer)) {
        return '.jpg';
      }
      
      // PNG检测
      if (buffer.length >= 8 && 
          buffer[0] === 0x89 && buffer[1] === 0x50 && 
          buffer[2] === 0x4E && buffer[3] === 0x47) {
        return '.png';
      }
      
      // WebP检测
      if (buffer.length >= 12 && 
          buffer[0] === 0x52 && buffer[1] === 0x49 && 
          buffer[2] === 0x46 && buffer[3] === 0x46 &&
          buffer[8] === 0x57 && buffer[9] === 0x45 && 
          buffer[10] === 0x42 && buffer[11] === 0x50) {
        return '.webp';
      }
      
      // 默认返回jpg
      return this.JPG_EXT;
    } catch (error) {
      // 发生错误时回退到jpg格式
      return this.JPG_EXT;
    }
  }

  /**
   * 检查是否需要压缩
   */
  public needCompress(leastCompressSize: number, filePath: string): boolean {
    if (leastCompressSize > 0) {
      try {
        const stats = fs.statSync(filePath);
        return stats.size > (leastCompressSize * 1024);
      } catch (error) {
        return false;
      }
    }
    return true;
  }

  /**
   * 打包字节数据
   */
  private pack(buffer: Buffer, offset: number, length: number, littleEndian: boolean): number {
    let step = 1;
    if (littleEndian) {
      offset += length - 1;
      step = -1;
    }

    let value = 0;
    while (length-- > 0) {
      value = (value << 8) | (buffer[offset] & 0xFF);
      offset += step;
    }
    return value;
  }

  /**
   * 比较两个数组是否相等
   */
  private arraysEqual(a: Uint8Array, b: Uint8Array): boolean {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
      if (a[i] !== b[i]) return false;
    }
    return true;
  }
}