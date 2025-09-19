import * as path from 'path';
import * as fs from 'fs';
import * as crypto from 'crypto';
import { Engine } from './engine';
import { Checker } from './checker';
import { FileInputStreamProvider, BufferInputStreamProvider } from './input-stream-provider';
import { 
  CompressionOptions, 
  CompressionListener, 
  CompressionResult, 
  InputStreamProvider 
} from './types';

/**
 * BoLuo图片压缩库主类
 */
export class BoLuo {
  private static defaultOptions: CompressionOptions = {
    quality: 60,
    ignoreBy: 100,
    focusAlpha: false,
    targetDir: './compressed',
    filter: (filePath: string) => {
      return !(filePath.toLowerCase().endsWith('.gif'));
    }
  };

  /**
   * 创建BoLuo实例
   */
  public static create(): BoLuoBuilder {
    return new BoLuoBuilder();
  }

  /**
   * 压缩单个文件
   */
  public static async compressFile(
    filePath: string, 
    options: CompressionOptions = {}
  ): Promise<CompressionResult> {
    const builder = new BoLuoBuilder();
    return builder.load(filePath).setOptions(options).get();
  }

  /**
   * 压缩多个文件
   */
  public static async compressFiles(
    filePaths: string[], 
    options: CompressionOptions = {}
  ): Promise<CompressionResult[]> {
    const builder = new BoLuoBuilder();
    return builder.load(filePaths).setOptions(options).getAll();
  }
}

/**
 * BoLuo构建器类
 */
export class BoLuoBuilder {
  private inputPaths: string[] = [];
  private options: CompressionOptions = { ...BoLuo['defaultOptions'] };
  private listener?: CompressionListener;
  private checker: Checker;

  constructor() {
    this.checker = Checker.getInstance();
  }

  /**
   * 加载要压缩的文件
   */
  public load(input: string | string[] | Buffer): BoLuoBuilder {
    if (typeof input === 'string') {
      this.inputPaths = [input];
    } else if (Array.isArray(input)) {
      this.inputPaths = input;
    } else {
      // Buffer类型，创建临时文件路径
      const tempPath = this.createTempPath();
      fs.writeFileSync(tempPath, input);
      this.inputPaths = [tempPath];
    }
    return this;
  }

  /**
   * 设置压缩选项
   */
  public setOptions(options: CompressionOptions): BoLuoBuilder {
    this.options = { ...this.options, ...options };
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
   * 设置最小压缩阈值
   */
  public ignoreBy(size: number): BoLuoBuilder {
    this.options.ignoreBy = size;
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
   * 设置输出目录
   */
  public setTargetDir(targetDir: string): BoLuoBuilder {
    this.options.targetDir = targetDir;
    return this;
  }

  /**
   * 设置过滤器
   */
  public filter(filter: (filePath: string) => boolean): BoLuoBuilder {
    this.options.filter = filter;
    return this;
  }

  /**
   * 设置重命名监听器
   */
  public setRenameListener(renameListener: (filePath: string) => string): BoLuoBuilder {
    this.options.renameListener = renameListener;
    return this;
  }

  /**
   * 设置压缩监听器
   */
  public setCompressListener(listener: CompressionListener): BoLuoBuilder {
    this.listener = listener;
    return this;
  }

  /**
   * 异步启动压缩
   */
  public async launch(): Promise<void> {
    try {
      this.listener?.onStart?.();
      
      for (const filePath of this.inputPaths) {
        const result = await this.compressFile(filePath);
        this.listener?.onSuccess?.(result.outputPath);
      }
    } catch (error) {
      this.listener?.onError?.(error as Error);
    }
  }

  /**
   * 同步获取压缩结果（单个文件）
   */
  public async get(): Promise<CompressionResult> {
    if (this.inputPaths.length === 0) {
      throw new Error('No input files specified');
    }
    return this.compressFile(this.inputPaths[0]);
  }

  /**
   * 同步获取压缩结果（多个文件）
   */
  public async getAll(): Promise<CompressionResult[]> {
    const results: CompressionResult[] = [];
    
    for (const filePath of this.inputPaths) {
      const result = await this.compressFile(filePath);
      results.push(result);
    }
    
    return results;
  }

  /**
   * 压缩单个文件的内部方法
   */
  private async compressFile(filePath: string): Promise<CompressionResult> {
    // 检查文件是否存在
    if (!fs.existsSync(filePath)) {
      throw new Error(`File not found: ${filePath}`);
    }

    // 获取原始文件信息
    const originalStats = fs.statSync(filePath);
    const originalSize = originalStats.size;

    // 应用过滤器
    if (this.options.filter && !this.options.filter(filePath)) {
      throw new Error(`File filtered out: ${filePath}`);
    }

    // 检查是否需要压缩
    if (!this.checker.needCompress(this.options.ignoreBy || 0, filePath)) {
      // 不需要压缩，直接返回原文件信息
      const buffer = fs.readFileSync(filePath);
      const sharp = await import('sharp');
      const metadata = await sharp.default(buffer).metadata();
      
      return {
        originalPath: filePath,
        outputPath: filePath,
        originalSize: originalSize,
        compressedSize: originalSize,
        compressionRatio: 1,
        width: metadata.width || 0,
        height: metadata.height || 0
      };
    }

    // 读取文件内容以检测格式
    const buffer = fs.readFileSync(filePath);
    const detectedExt = await this.checker.getExtSuffix(buffer);
    
    // 生成输出文件路径（使用检测到的扩展名）
    const outputPath = this.generateOutputPath(filePath, detectedExt);
    
    // 创建输入流提供者
    const inputProvider: InputStreamProvider = new FileInputStreamProvider(filePath);
    
    // 创建压缩引擎并执行压缩
    const engine = new Engine(inputProvider, outputPath, this.options.focusAlpha || false);
    const compressedPath = await engine.compress();
    
    // 获取压缩后的文件信息
    const compressedInfo = await engine.getCompressedInfo();
    const compressedStats = fs.statSync(compressedPath);
    
    return {
      originalPath: filePath,
      outputPath: compressedPath,
      originalSize: originalSize,
      compressedSize: compressedStats.size,
      compressionRatio: compressedStats.size / originalSize,
      width: compressedInfo.width,
      height: compressedInfo.height
    };
  }

  /**
   * 生成输出文件路径
   */
  private generateOutputPath(filePath: string, detectedExt?: string): string {
    const targetDir = this.options.targetDir || './compressed';
    
    // 确保目标目录存在
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }

    let fileName = path.basename(filePath);
    
    // 应用重命名监听器
    if (this.options.renameListener) {
      const newName = this.options.renameListener(filePath);
      // 使用检测到的扩展名，如果没有则使用原始扩展名
      const ext = detectedExt || path.extname(filePath);
      fileName = newName + ext;
    } else if (detectedExt) {
      // 如果检测到的扩展名与原始不同，则更新文件名
      const baseName = path.basename(filePath, path.extname(filePath));
      fileName = baseName + detectedExt;
    }

    return path.join(targetDir, fileName);
  }

  /**
   * 创建临时文件路径
   */
  private createTempPath(): string {
    const tempDir = './temp';
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }
    
    const hash = crypto.createHash('md5').update(Date.now().toString()).digest('hex');
    return path.join(tempDir, `temp_${hash}.jpg`);
  }
}