/**
 * 压缩配置选项
 */
export interface CompressionOptions {
  /** 压缩质量 (0-100) */
  quality?: number;
  /** 最小压缩阈值，单位KB，小于此值不压缩 */
  ignoreBy?: number;
  /** 是否保留透明通道 */
  focusAlpha?: boolean;
  /** 输出目录 */
  targetDir?: string;
  /** 压缩前重命名回调 */
  renameListener?: (filePath: string) => string;
  /** 压缩过滤器，返回true则压缩 */
  filter?: (filePath: string) => boolean;
}

/**
 * 压缩监听器
 */
export interface CompressionListener {
  /** 压缩开始 */
  onStart?: () => void;
  /** 压缩成功 */
  onSuccess?: (outputPath: string) => void;
  /** 压缩失败 */
  onError?: (error: Error) => void;
}

/**
 * 图片信息
 */
export interface ImageInfo {
  width: number;
  height: number;
  format: string;
  size: number;
  orientation?: number;
}

/**
 * 压缩结果
 */
export interface CompressionResult {
  originalPath: string;
  outputPath: string;
  originalSize: number;
  compressedSize: number;
  compressionRatio: number;
  width: number;
  height: number;
}

/**
 * 输入流提供者接口
 */
export interface InputStreamProvider {
  getPath(): string;
  getBuffer(): Promise<Buffer>;
  close(): void;
}