import { BrowserEngine } from './browser-engine';
import { Checker } from './checker';
import { CompressionOptions } from './types';

/**
 * BoLuo 浏览器版本 - 纯前端图片压缩库
 * 提供简单易用的静态方法API
 */
export class BoLuoBrowser {
  private engine: BrowserEngine;
  private checker: Checker;
  private srcBuffer: Buffer;

  constructor(srcBuffer: Buffer) {
    this.srcBuffer = srcBuffer;
    this.engine = new BrowserEngine(srcBuffer);
    this.checker = Checker.getInstance();
  }

  /**
   * 压缩图片到指定质量
   */
  async compress(options: CompressionOptions = {}): Promise<Buffer> {
    const defaultOptions: CompressionOptions = {
      quality: 0.8,
      ignoreBy: 10,
      focusAlpha: false,
      ...options
    };

    // 检查是否需要压缩
    const info = await this.engine.getImageInfo();
    const sizeInKB = info.size / 1024;
    
    if (defaultOptions.ignoreBy && sizeInKB < defaultOptions.ignoreBy) {
      return this.srcBuffer;
    }

    return this.engine.compress(defaultOptions);
  }

  /**
   * 压缩图片并返回 Blob
   */
  async compressToBlob(options: CompressionOptions = {}): Promise<Blob> {
    const buffer = await this.compress(options);
    return new Blob([new Uint8Array(buffer)], { type: 'image/jpeg' });
  }

  /**
   * 获取图片信息
   */
  async getImageInfo() {
    return this.engine.getImageInfo();
  }

  /**
   * 检查是否为 JPG 格式
   */
  isJPG(): boolean {
    return this.checker.isJPG(this.srcBuffer);
  }

  /**
   * 获取图片方向信息
   */
  getOrientation(): number {
    return this.checker.getOrientation(this.srcBuffer);
  }

  // ==================== 静态方法 API ====================

  /**
   * 直接压缩 File 对象
   * @param file 图片文件
   * @param quality 压缩质量 (0-1)，默认 0.8
   * @returns 压缩后的 Blob
   */
  static async compress(file: File | Blob, quality: number = 0.8): Promise<Blob> {
    const buffer = Buffer.from(await file.arrayBuffer());
    const compressor = new BoLuoBrowser(buffer);
    return compressor.compressToBlob({ quality });
  }

  /**
   * 压缩图片并返回 Buffer
   * @param file 图片文件
   * @param quality 压缩质量 (0-1)，默认 0.8
   * @returns 压缩后的 Buffer
   */
  static async compressToBuffer(file: File | Blob, quality: number = 0.8): Promise<Buffer> {
    const buffer = Buffer.from(await file.arrayBuffer());
    const compressor = new BoLuoBrowser(buffer);
    return compressor.compress({ quality });
  }

  /**
   * 批量压缩多个文件
   * @param files 图片文件数组
   * @param quality 压缩质量 (0-1)，默认 0.8
   * @returns 压缩后的 Blob 数组
   */
  static async compressMultiple(files: (File | Blob)[], quality: number = 0.8): Promise<Blob[]> {
    const results: Blob[] = [];
    for (const file of files) {
      const compressed = await BoLuoBrowser.compress(file, quality);
      results.push(compressed);
    }
    return results;
  }

  /**
   * 从 File 创建实例（保留原有API兼容性）
   */
  static async fromFile(file: File): Promise<BoLuoBrowser> {
    const buffer = Buffer.from(await file.arrayBuffer());
    return new BoLuoBrowser(buffer);
  }

  /**
   * 从 Blob 创建实例（保留原有API兼容性）
   */
  static async fromBlob(blob: Blob): Promise<BoLuoBrowser> {
    const buffer = Buffer.from(await blob.arrayBuffer());
    return new BoLuoBrowser(buffer);
  }

  /**
   * 从 Blob URL 创建实例（保留原有API兼容性）
   */
  static async fromBlobUrl(blobUrl: string): Promise<BoLuoBrowser> {
    const response = await fetch(blobUrl);
    const blob = await response.blob();
    return BoLuoBrowser.fromBlob(blob);
  }
}

export default BoLuoBrowser;