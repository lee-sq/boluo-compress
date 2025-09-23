/**
 * 浏览器专用图像处理引擎
 * 使用 Canvas API 替代 Sharp，支持纯前端环境
 */

import { CompressionOptions, ImageInfo } from './types';

export class BrowserEngine {
  private srcBuffer: Buffer;

  constructor(buffer: Buffer) {
    this.srcBuffer = buffer;
  }

  /**
   * 获取图片信息
   */
  async getImageInfo(): Promise<ImageInfo> {
    return new Promise((resolve, reject) => {
      const blob = new Blob([new Uint8Array(this.srcBuffer)]);
      const url = URL.createObjectURL(blob);
      const img = new window.Image();

      img.onload = () => {
        URL.revokeObjectURL(url);
        resolve({
          width: img.naturalWidth,
          height: img.naturalHeight,
          format: this.getFormatFromBuffer(),
          size: this.srcBuffer.length
        });
      };

      img.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error('Failed to load image'));
      };

      img.src = url;
    });
  }

  /**
   * 压缩图片
   */
  async compress(options: CompressionOptions): Promise<Buffer> {
    const { quality = 80, maxWidth, maxHeight } = options;

    return new Promise((resolve, reject) => {
      const blob = new Blob([new Uint8Array(this.srcBuffer)]);
      const url = URL.createObjectURL(blob);
      const img = new window.Image();

      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          
          if (!ctx) {
            throw new Error('Cannot get canvas context');
          }

          // 计算新尺寸
          let { width, height } = this.calculateNewSize(
            img.naturalWidth, 
            img.naturalHeight, 
            maxWidth, 
            maxHeight
          );

          canvas.width = width;
          canvas.height = height;

          // 绘制图片
          ctx.drawImage(img, 0, 0, width, height);

          // 转换为 Blob
          canvas.toBlob((blob: Blob | null) => {
            if (!blob) {
              reject(new Error('Failed to compress image'));
              return;
            }

            // 转换为 Buffer
            blob.arrayBuffer().then((arrayBuffer: ArrayBuffer) => {
              const buffer = Buffer.from(arrayBuffer);
              URL.revokeObjectURL(url);
              resolve(buffer);
            }).catch(reject);

          }, this.getOutputMimeType(), quality / 100);

        } catch (error) {
          URL.revokeObjectURL(url);
          reject(error);
        }
      };

      img.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error('Failed to load image'));
      };

      img.src = url;
    });
  }

  /**
   * 旋转图片（基于EXIF）
   */
  async rotateByExif(orientation: number): Promise<Buffer> {
    if (orientation <= 1) {
      return this.srcBuffer; // 不需要旋转
    }

    return new Promise((resolve, reject) => {
      const blob = new Blob([new Uint8Array(this.srcBuffer)]);
      const url = URL.createObjectURL(blob);
      const img = new window.Image();

      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          
          if (!ctx) {
            throw new Error('Cannot get canvas context');
          }

          const { width, height } = img;
          
          // 根据orientation设置canvas尺寸和变换
          if (orientation >= 5 && orientation <= 8) {
            canvas.width = height;
            canvas.height = width;
          } else {
            canvas.width = width;
            canvas.height = height;
          }

          // 应用变换
          this.applyOrientation(ctx, orientation, width, height);
          
          // 绘制图片
          ctx.drawImage(img, 0, 0);

          // 转换为 Buffer
          canvas.toBlob((blob: Blob | null) => {
            if (!blob) {
              reject(new Error('Failed to rotate image'));
              return;
            }

            blob.arrayBuffer().then((arrayBuffer: ArrayBuffer) => {
              const buffer = Buffer.from(arrayBuffer);
              URL.revokeObjectURL(url);
              resolve(buffer);
            }).catch(reject);

          }, this.getOutputMimeType());

        } catch (error) {
          URL.revokeObjectURL(url);
          reject(error);
        }
      };

      img.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error('Failed to load image'));
      };

      img.src = url;
    });
  }

  /**
   * 计算新尺寸
   */
  private calculateNewSize(
    originalWidth: number, 
    originalHeight: number, 
    maxWidth?: number, 
    maxHeight?: number
  ): { width: number; height: number } {
    let width = originalWidth;
    let height = originalHeight;

    if (maxWidth && width > maxWidth) {
      height = (height * maxWidth) / width;
      width = maxWidth;
    }

    if (maxHeight && height > maxHeight) {
      width = (width * maxHeight) / height;
      height = maxHeight;
    }

    return { width: Math.round(width), height: Math.round(height) };
  }

  /**
   * 应用EXIF方向变换
   */
  private applyOrientation(
    ctx: CanvasRenderingContext2D, 
    orientation: number, 
    width: number, 
    height: number
  ): void {
    switch (orientation) {
      case 2:
        ctx.transform(-1, 0, 0, 1, width, 0);
        break;
      case 3:
        ctx.transform(-1, 0, 0, -1, width, height);
        break;
      case 4:
        ctx.transform(1, 0, 0, -1, 0, height);
        break;
      case 5:
        ctx.transform(0, 1, 1, 0, 0, 0);
        break;
      case 6:
        ctx.transform(0, 1, -1, 0, height, 0);
        break;
      case 7:
        ctx.transform(0, -1, -1, 0, height, width);
        break;
      case 8:
        ctx.transform(0, -1, 1, 0, 0, width);
        break;
    }
  }

  /**
   * 从Buffer获取图片格式
   */
  private getFormatFromBuffer(): string {
    const header = this.srcBuffer.slice(0, 12);
    
    if (header[0] === 0xFF && header[1] === 0xD8) {
      return 'jpeg';
    } else if (header[0] === 0x89 && header[1] === 0x50 && header[2] === 0x4E && header[3] === 0x47) {
      return 'png';
    } else if (header[0] === 0x52 && header[1] === 0x49 && header[2] === 0x46 && header[3] === 0x46) {
      return 'webp';
    }
    
    return 'jpeg'; // 默认
  }

  /**
   * 获取输出MIME类型
   */
  private getOutputMimeType(): string {
    const format = this.getFormatFromBuffer();
    switch (format) {
      case 'png':
        return 'image/png';
      case 'webp':
        return 'image/webp';
      default:
        return 'image/jpeg';
    }
  }
}