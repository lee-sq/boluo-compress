import { BrowserEngine } from './browser-engine';
import { Checker } from './checker';
import { CompressionOptions, CompressionResult } from './types';

/**
 * BoLuo 浏览器版本 - 纯前端图片压缩库
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
      quality: 80,
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
    return new Blob([buffer], { type: 'image/jpeg' });
  }

  /**
   * 获取图片信息
   */
  async getImageInfo() {
    return this.engine.getImageInfo();
  }

  /**
   * 检查是否为JPG格式
   */
  isJPG(): boolean {
    return this.checker.isJPG(this.srcBuffer);
  }

  /**
   * 获取图片方向
   */
  getOrientation(): number {
    return this.checker.getOrientation(this.srcBuffer);
  }

  /**
   * 静态方法：从 File 对象创建 BoLuo 实例
   */
  static async fromFile(file: File): Promise<BoLuoBrowser> {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    return new BoLuoBrowser(buffer);
  }

  /**
   * 静态方法：从 Blob 对象创建 BoLuo 实例
   */
  static async fromBlob(blob: Blob): Promise<BoLuoBrowser> {
    const arrayBuffer = await blob.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    return new BoLuoBrowser(buffer);
  }

  /**
   * 静态方法：从 Blob URL 创建 BoLuo 实例
   */
  static async fromBlobUrl(blobUrl: string): Promise<BoLuoBrowser> {
    if (!blobUrl.startsWith('blob:')) {
      throw new Error('Invalid blob URL');
    }

    const response = await fetch(blobUrl);
    if (!response.ok) {
      throw new Error('Failed to fetch blob data');
    }

    const blob = await response.blob();
    return BoLuoBrowser.fromBlob(blob);
  }
}

export default BoLuoBrowser;