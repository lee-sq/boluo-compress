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
  originalSize: number;
  compressedSize: number;
  compressionRatio: number;
  width: number;
  height: number;
  format: string;
}