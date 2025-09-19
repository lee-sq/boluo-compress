import { CompressionOptions, ImageInfo } from './types';
/**
 * 前端图片压缩库 - BoLuo
 * 专为浏览器环境设计，只处理Blob/Buffer对象
 */
export declare class BoLuo {
    private static defaultOptions;
    /**
     * 压缩单个Blob/Buffer，返回Buffer
     * @param input - 输入的Blob或Buffer
     * @param options - 压缩选项
     * @returns 压缩后的Buffer
     */
    static compress(input: Blob | Buffer, options?: CompressionOptions): Promise<Buffer>;
    /**
     * 压缩单个Blob/Buffer，返回Blob（推荐用于前端）
     * @param input - 输入的Blob或Buffer
     * @param options - 压缩选项
     * @returns 压缩后的Blob
     */
    static compressToBlob(input: Blob | Buffer, options?: CompressionOptions): Promise<Blob>;
    /**
     * 压缩多个Blob/Buffer
     * @param inputs - 输入的Blob或Buffer数组
     * @param options - 压缩选项
     * @returns 压缩后的Buffer数组
     */
    static compressMultiple(inputs: (Blob | Buffer)[], options?: CompressionOptions): Promise<Buffer[]>;
    /**
     * 获取图片信息
     * @param input - 输入的Blob或Buffer
     * @returns 图片信息
     */
    static getImageInfo(input: Blob | Buffer): Promise<ImageInfo>;
    /**
     * 检查是否为支持的图片格式
     * @param input - 输入的Blob或Buffer
     * @returns 是否为支持的格式
     */
    static isValidImage(input: Blob | Buffer): Promise<boolean>;
    /**
     * 创建Builder实例
     */
    static create(): BoLuoBuilder;
}
/**
 * BoLuo Builder类，提供链式调用API
 */
export declare class BoLuoBuilder {
    private inputs;
    private options;
    /**
     * 加载输入数据
     */
    load(input: Blob | Buffer | (Blob | Buffer)[]): BoLuoBuilder;
    /**
     * 设置压缩质量
     */
    quality(quality: number): BoLuoBuilder;
    /**
     * 设置最小压缩阈值（KB）
     */
    ignoreBy(sizeKB: number): BoLuoBuilder;
    /**
     * 设置是否保留透明通道
     */
    setFocusAlpha(focusAlpha: boolean): BoLuoBuilder;
    /**
     * 压缩单个输入，返回Buffer（仅支持单个输入）
     */
    compress(): Promise<Buffer>;
    /**
     * 压缩单个输入，返回Blob（推荐用于前端，仅支持单个输入）
     */
    compressToBlob(): Promise<Blob>;
    /**
     * 压缩所有输入，返回Buffer数组
     */
    compressAll(): Promise<Buffer[]>;
    /**
     * 压缩所有输入，返回Blob数组（推荐用于前端）
     */
    compressAllToBlobs(): Promise<Blob[]>;
    /**
     * 获取第一个输入的图片信息
     */
    getImageInfo(): Promise<ImageInfo>;
}
//# sourceMappingURL=boluo.d.ts.map