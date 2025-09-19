import sharp from 'sharp';
import * as path from 'path';
import * as fs from 'fs';
import { Checker } from './checker';
import { InputStreamProvider, ImageInfo } from './types';

/**
 * 压缩引擎，负责执行图片压缩算法
 */
export class Engine {
  private srcImg: InputStreamProvider;
  private targetPath: string;
  private srcWidth: number = 0;
  private srcHeight: number = 0;
  private focusAlpha: boolean;
  private checker: Checker;

  constructor(srcImg: InputStreamProvider, targetPath: string, focusAlpha: boolean = false) {
    this.srcImg = srcImg;
    this.targetPath = targetPath;
    this.focusAlpha = focusAlpha;
    this.checker = Checker.getInstance();
  }

  /**
   * 初始化图片信息
   */
  private async initImageInfo(): Promise<void> {
    const buffer = await this.srcImg.getBuffer();
    const metadata = await sharp(buffer).metadata();
    
    this.srcWidth = metadata.width || 0;
    this.srcHeight = metadata.height || 0;
  }

  /**
   * 计算压缩采样率
   * 这是BoLuo算法的核心部分，参考微信朋友圈压缩策略
   */
  private computeSize(): number {
    // 确保宽高为偶数
    this.srcWidth = this.srcWidth % 2 === 1 ? this.srcWidth + 1 : this.srcWidth;
    this.srcHeight = this.srcHeight % 2 === 1 ? this.srcHeight + 1 : this.srcHeight;

    const longSide = Math.max(this.srcWidth, this.srcHeight);
    const shortSide = Math.min(this.srcWidth, this.srcHeight);

    const scale = shortSide / longSide;

    if (scale <= 1 && scale > 0.5625) {
      // 图片比例在 [1:1 ~ 9:16) 范围内
      if (longSide < 1664) {
        return 1;
      } else if (longSide < 4990) {
        return 2;
      } else if (longSide > 4990 && longSide < 10240) {
        return 4;
      } else {
        const ratio = Math.floor(longSide / 1280);
        return ratio === 0 ? 1 : ratio;
      }
    } else if (scale <= 0.5625 && scale > 0.5) {
      // 图片比例在 [9:16 ~ 1:2) 范围内
      const ratio = Math.floor(longSide / 1280);
      return ratio === 0 ? 1 : ratio;
    } else {
      // 图片比例在 [1:2 ~ 1:∞) 范围内
      return Math.ceil(longSide / (1280.0 / scale));
    }
  }

  /**
   * 计算目标尺寸
   */
  private computeTargetSize(): { width: number; height: number } {
    const sampleSize = this.computeSize();
    
    return {
      width: Math.floor(this.srcWidth / sampleSize),
      height: Math.floor(this.srcHeight / sampleSize)
    };
  }

  /**
   * 旋转图片
   */
  private async rotateImage(imageBuffer: Buffer, angle: number): Promise<Buffer> {
    if (angle === 0) {
      return imageBuffer;
    }

    return await sharp(imageBuffer)
      .rotate(angle)
      .toBuffer();
  }

  /**
   * 执行压缩
   */
  public async compress(): Promise<string> {
    try {
      await this.initImageInfo();
      
      const buffer = await this.srcImg.getBuffer();
      const targetSize = this.computeTargetSize();
      
      let processedBuffer = buffer;

      // 检查是否需要旋转（基于EXIF信息）
      if (this.checker.isJPG(buffer)) {
        const orientation = this.checker.getOrientation(buffer);
        if (orientation !== 0) {
          processedBuffer = await this.rotateImage(buffer, orientation);
        }
      }

      // 确保目标目录存在
      const targetDir = path.dirname(this.targetPath);
      if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true });
      }

      // 检测原始文件格式
      const originalExt = await this.checker.getExtSuffix(buffer);
      
      // 使用Sharp进行压缩
      const sharpInstance = sharp(processedBuffer)
        .resize(targetSize.width, targetSize.height, {
          fit: 'inside',
          withoutEnlargement: true
        });

      // 根据原始格式和透明通道需求选择输出格式
      if (this.focusAlpha || originalExt === '.png' || originalExt === '.webp') {
        // 保留透明通道或原始为PNG/WebP格式
        if (originalExt === '.webp') {
          await sharpInstance
            .webp({ quality: 60 })
            .toFile(this.targetPath);
        } else {
          await sharpInstance
            .png({ quality: 60 })
            .toFile(this.targetPath);
        }
      } else {
        // 其他格式转为JPEG
        await sharpInstance
          .jpeg({ quality: 60 })
          .toFile(this.targetPath);
      }

      return this.targetPath;
    } catch (error) {
      throw new Error(`Compression failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      this.srcImg.close();
    }
  }

  /**
   * 获取压缩后的文件信息
   */
  public async getCompressedInfo(): Promise<ImageInfo> {
    if (!fs.existsSync(this.targetPath)) {
      throw new Error('Compressed file not found');
    }

    const buffer = fs.readFileSync(this.targetPath);
    const metadata = await sharp(buffer).metadata();
    const stats = fs.statSync(this.targetPath);

    return {
      width: metadata.width || 0,
      height: metadata.height || 0,
      format: metadata.format || 'unknown',
      size: stats.size
    };
  }
}