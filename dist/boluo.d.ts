import { CompressionOptions } from './types';
/**
 * BoLuo 浏览器版本 - 纯前端图片压缩库
 * 提供简单易用的静态方法API
 */
export declare class Boluo {
    private engine;
    private checker;
    private srcBuffer;
    constructor(srcBuffer: Buffer);
    /**
     * 压缩图片到指定质量
     */
    compress(options?: CompressionOptions): Promise<Buffer>;
    /**
     * 压缩图片并返回 Blob
     */
    compressToBlob(options?: CompressionOptions): Promise<Blob>;
    /**
     * 获取图片信息
     */
    getImageInfo(): Promise<import("./types").ImageInfo>;
    /**
     * 检查是否为 JPG 格式
     */
    isJPG(): boolean;
    /**
     * 获取图片方向信息
     */
    getOrientation(): number;
    /**
     * 直接压缩 File 对象
     * @param file 图片文件
     * @param quality 压缩质量 (0-1)，默认 0.8
     * @returns 压缩后的 Blob
     */
    static compress(file: File | Blob, quality?: number): Promise<Blob>;
    /**
     * 压缩图片并返回 Buffer
     * @param file 图片文件
     * @param quality 压缩质量 (0-1)，默认 0.8
     * @returns 压缩后的 Buffer
     */
    static compressToBuffer(file: File | Blob, quality?: number): Promise<Buffer>;
    /**
     * 批量压缩多个文件
     * @param files 图片文件数组
     * @param quality 压缩质量 (0-1)，默认 0.8
     * @returns 压缩后的 Blob 数组
     */
    static compressMultiple(files: (File | Blob)[], quality?: number): Promise<Blob[]>;
    /**
     * 从 File 创建实例（保留原有API兼容性）
     */
    static fromFile(file: File): Promise<Boluo>;
    /**
     * 从 Blob 创建实例（保留原有API兼容性）
     */
    static fromBlob(blob: Blob): Promise<Boluo>;
    /**
     * 从 Blob URL 创建实例（保留原有API兼容性）
     */
    static fromBlobUrl(blobUrl: string): Promise<Boluo>;
}
export default Boluo;
//# sourceMappingURL=boluo.d.ts.map