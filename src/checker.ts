// 移除 file-type 依赖，使用纯前端实现

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
   * 获取图片方向信息
   */
  public getOrientation(buffer: Buffer): number {
    if (!this.isJPG(buffer)) {
      return 1; // 默认方向
    }

    try {
      // 查找EXIF数据
      for (let i = 0; i < buffer.length - 1; i++) {
        if (buffer[i] === 0xFF && buffer[i + 1] === 0xE1) {
          // 找到APP1段，包含EXIF数据
          const exifLength = (buffer[i + 2] << 8) | buffer[i + 3];
          const exifData = buffer.slice(i + 4, i + 4 + exifLength - 2);
          
          // 查找方向标签 (0x0112)
          return this.extractOrientation(exifData);
        }
      }
    } catch (error) {
      console.warn('Failed to extract orientation:', error);
    }

    return 1; // 默认方向
  }

  /**
   * 从EXIF数据中提取方向信息
   */
  private extractOrientation(exifData: Buffer): number {
    if (exifData.length < 14) return 1;

    // 检查EXIF标识符
    if (exifData[0] !== 0x45 || exifData[1] !== 0x78 || 
        exifData[2] !== 0x69 || exifData[3] !== 0x66) {
      return 1;
    }

    // 跳过EXIF标识符和空字节
    let offset = 6;
    
    // 检查字节序
    const littleEndian = exifData[offset] === 0x49 && exifData[offset + 1] === 0x49;
    offset += 2;

    // 跳过TIFF标识
    offset += 2;

    // 获取IFD偏移
    const ifdOffset = this.pack(exifData, offset, 4, littleEndian);
    offset = 6 + ifdOffset;

    if (offset >= exifData.length) return 1;

    // 读取IFD条目数量
    const numEntries = this.pack(exifData, offset, 2, littleEndian);
    offset += 2;

    // 遍历IFD条目查找方向标签
    for (let i = 0; i < numEntries; i++) {
      if (offset + 12 > exifData.length) break;
      
      const tag = this.pack(exifData, offset, 2, littleEndian);
      if (tag === 0x0112) { // 方向标签
        const orientation = this.pack(exifData, offset + 8, 2, littleEndian);
        return orientation;
      }
      offset += 12;
    }

    return 1;
  }

  /**
   * 获取文件扩展名后缀
   * 使用文件头部字节进行文件类型检测
   */
  public getExtSuffix(buffer: Buffer): string {
    try {
      // 检查文件头部字节来判断文件类型
      if (buffer.length < 4) {
        return '.jpg'; // 默认返回jpg
      }

      // JPEG: FF D8 FF
      if (buffer[0] === 0xFF && buffer[1] === 0xD8 && buffer[2] === 0xFF) {
        return '.jpg';
      }
      
      // PNG: 89 50 4E 47
      if (buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4E && buffer[3] === 0x47) {
        return '.png';
      }
      
      // WebP: 52 49 46 46 ... 57 45 42 50
      if (buffer[0] === 0x52 && buffer[1] === 0x49 && buffer[2] === 0x46 && buffer[3] === 0x46 &&
          buffer.length >= 12 && buffer[8] === 0x57 && buffer[9] === 0x45 && buffer[10] === 0x42 && buffer[11] === 0x50) {
        return '.webp';
      }
      
      // GIF: 47 49 46 38
      if (buffer[0] === 0x47 && buffer[1] === 0x49 && buffer[2] === 0x46 && buffer[3] === 0x38) {
        return '.gif';
      }
      
      // BMP: 42 4D
      if (buffer[0] === 0x42 && buffer[1] === 0x4D) {
        return '.bmp';
      }

      // 默认返回jpg
      return '.jpg';
      
    } catch (error) {
      console.warn('Failed to detect file type:', error);
      return '.jpg';
    }
  }

  /**
   * 判断是否需要压缩
   */
  public needCompress(leastCompressSize: number, buffer: Buffer): boolean {
    if (leastCompressSize > 0) {
      const sizeInKB = buffer.length / 1024;
      return sizeInKB >= leastCompressSize;
    }
    return true;
  }

  /**
   * 从buffer中按指定字节序读取数值
   */
  private pack(buffer: Buffer, offset: number, length: number, littleEndian: boolean): number {
    let result = 0;
    if (littleEndian) {
      for (let i = 0; i < length; i++) {
        result |= buffer[offset + i] << (i * 8);
      }
    } else {
      for (let i = 0; i < length; i++) {
        result = (result << 8) | buffer[offset + i];
      }
    }
    return result;
  }

  /**
   * 比较两个Uint8Array是否相等
   */
  private arraysEqual(a: Uint8Array, b: Uint8Array): boolean {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
      if (a[i] !== b[i]) return false;
    }
    return true;
  }
}