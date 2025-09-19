import { Engine } from './engine';
import { Checker } from './checker';
import { CompressionOptions, ImageInfo } from './types';

/**
 * 前端图片压缩库 - BoLuo
 * 专为浏览器环境设计，只处理Blob/Buffer对象
 */
export class BoLuo {
  private static defaultOptions: CompressionOptions = {
    quality: 60,
    ignoreBy: 100, // 100KB以下不压缩
    focusAlpha: false
  };

  /**
   * 压缩单个Blob/Buffer
   * @param input - 输入的Blob或Buffer
   * @param options - 压缩选项
   * @returns 压缩后的Buffer
   */
  public static async compress(
    input: Blob | Buffer,
    options: CompressionOptions = {}
  ): Promise<Buffer> {
    const mergedOptions = { ...BoLuo.defaultOptions, ...options };
    
    // 将Blob转换为Buffer
    let buffer: Buffer;
    if (input instanceof Blob) {
      const arrayBuffer = await input.arrayBuffer();
      buffer = Buffer.from(arrayBuffer);
    } else {
      buffer = input;
    }

    // 检查是否为支持的图片格式
    const checker = Checker.getInstance();
    try {
      const ext = await checker.getExtSuffix(buffer);
      if (!['.jpg', '.jpeg', '.png', '.webp'].includes(ext.toLowerCase())) {
        throw new Error('Unsupported image format. Only JPG, PNG, and WebP are supported.');
      }
    } catch (error) {
      throw new Error('Invalid image data');
    }

    // 检查文件大小是否需要压缩
    if (buffer.length <= mergedOptions.ignoreBy! * 1024) { // 转换为字节
      return buffer; // 返回原始buffer
    }

    // 使用Engine进行压缩
    const engine = new Engine(buffer, mergedOptions.focusAlpha || false);
    return await engine.compress();
  }

  /**
   * 压缩多个Blob/Buffer
   * @param inputs - 输入的Blob或Buffer数组
   * @param options - 压缩选项
   * @returns 压缩后的Buffer数组
   */
  public static async compressMultiple(
    inputs: (Blob | Buffer)[],
    options: CompressionOptions = {}
  ): Promise<Buffer[]> {
    const results: Buffer[] = [];
    
    for (const input of inputs) {
      try {
        const compressed = await BoLuo.compress(input, options);
        results.push(compressed);
      } catch (error) {
        console.warn('Failed to compress one image:', error);
        // 压缩失败时，返回原始数据
        if (input instanceof Blob) {
          const arrayBuffer = await input.arrayBuffer();
          results.push(Buffer.from(arrayBuffer));
        } else {
          results.push(input);
        }
      }
    }
    
    return results;
  }

  /**
   * 获取图片信息
   * @param input - 输入的Blob或Buffer
   * @returns 图片信息
   */
  public static async getImageInfo(input: Blob | Buffer): Promise<ImageInfo> {
    let buffer: Buffer;
    if (input instanceof Blob) {
      const arrayBuffer = await input.arrayBuffer();
      buffer = Buffer.from(arrayBuffer);
    } else {
      buffer = input;
    }

    const engine = new Engine(buffer);
    return await engine.getOriginalInfo();
  }

  /**
   * 检查是否为支持的图片格式
   * @param input - 输入的Blob或Buffer
   * @returns 是否为支持的格式
   */
  public static async isValidImage(input: Blob | Buffer): Promise<boolean> {
    try {
      let buffer: Buffer;
      if (input instanceof Blob) {
        const arrayBuffer = await input.arrayBuffer();
        buffer = Buffer.from(arrayBuffer);
      } else {
        buffer = input;
      }

      const checker = Checker.getInstance();
      const ext = await checker.getExtSuffix(buffer);
      return ['.jpg', '.jpeg', '.png', '.webp'].includes(ext.toLowerCase());
    } catch {
      return false;
    }
  }

  /**
   * 创建Builder实例
   */
  public static create(): BoLuoBuilder {
    return new BoLuoBuilder();
  }
}

/**
 * BoLuo Builder类，提供链式调用API
 */
export class BoLuoBuilder {
  private inputs: (Blob | Buffer)[] = [];
  private options: CompressionOptions = { ...BoLuo['defaultOptions'] };

  /**
   * 加载输入数据
   */
  public load(input: Blob | Buffer | (Blob | Buffer)[]): BoLuoBuilder {
    if (Array.isArray(input)) {
      this.inputs = [...input];
    } else {
      this.inputs = [input];
    }
    return this;
  }

  /**
   * 设置压缩质量
   */
  public quality(quality: number): BoLuoBuilder {
    this.options.quality = quality;
    return this;
  }

  /**
   * 设置最小压缩阈值（KB）
   */
  public ignoreBy(sizeKB: number): BoLuoBuilder {
    this.options.ignoreBy = sizeKB;
    return this;
  }

  /**
   * 设置是否保留透明通道
   */
  public setFocusAlpha(focusAlpha: boolean): BoLuoBuilder {
    this.options.focusAlpha = focusAlpha;
    return this;
  }

  /**
   * 压缩单个输入（仅支持单个输入）
   */
  public async compress(): Promise<Buffer> {
    if (this.inputs.length !== 1) {
      throw new Error('compress() method only supports single input. Use compressAll() for multiple inputs.');
    }
    
    return await BoLuo.compress(this.inputs[0], this.options);
  }

  /**
   * 压缩所有输入
   */
  public async compressAll(): Promise<Buffer[]> {
    if (this.inputs.length === 0) {
      throw new Error('No inputs loaded. Use load() method first.');
    }
    
    return await BoLuo.compressMultiple(this.inputs, this.options);
  }

  /**
   * 获取第一个输入的图片信息
   */
  public async getImageInfo(): Promise<ImageInfo> {
    if (this.inputs.length === 0) {
      throw new Error('No inputs loaded. Use load() method first.');
    }
    
    return await BoLuo.getImageInfo(this.inputs[0]);
  }
}