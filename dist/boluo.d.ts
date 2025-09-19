import { CompressionOptions, CompressionListener, CompressionResult } from './types';
/**
 * BoLuo图片压缩库主类
 */
export declare class BoLuo {
    private static defaultOptions;
    /**
     * 创建BoLuo实例
     */
    static create(): BoLuoBuilder;
    /**
     * 压缩单个文件
     */
    static compressFile(filePath: string, options?: CompressionOptions): Promise<CompressionResult>;
    /**
     * 压缩多个文件
     */
    static compressFiles(filePaths: string[], options?: CompressionOptions): Promise<CompressionResult[]>;
}
/**
 * BoLuo构建器类
 */
export declare class BoLuoBuilder {
    private inputPaths;
    private options;
    private listener?;
    private checker;
    constructor();
    /**
     * 加载要压缩的文件
     */
    load(input: string | string[] | Buffer): BoLuoBuilder;
    /**
     * 设置压缩选项
     */
    setOptions(options: CompressionOptions): BoLuoBuilder;
    /**
     * 设置压缩质量
     */
    quality(quality: number): BoLuoBuilder;
    /**
     * 设置最小压缩阈值
     */
    ignoreBy(size: number): BoLuoBuilder;
    /**
     * 设置是否保留透明通道
     */
    setFocusAlpha(focusAlpha: boolean): BoLuoBuilder;
    /**
     * 设置输出目录
     */
    setTargetDir(targetDir: string): BoLuoBuilder;
    /**
     * 设置过滤器
     */
    filter(filter: (filePath: string) => boolean): BoLuoBuilder;
    /**
     * 设置重命名监听器
     */
    setRenameListener(renameListener: (filePath: string) => string): BoLuoBuilder;
    /**
     * 设置压缩监听器
     */
    setCompressListener(listener: CompressionListener): BoLuoBuilder;
    /**
     * 异步启动压缩
     */
    launch(): Promise<void>;
    /**
     * 同步获取压缩结果（单个文件）
     */
    get(): Promise<CompressionResult>;
    /**
     * 同步获取压缩结果（多个文件）
     */
    getAll(): Promise<CompressionResult[]>;
    /**
     * 压缩单个文件的内部方法
     */
    private compressFile;
    /**
     * 生成输出文件路径
     */
    private generateOutputPath;
    /**
     * 创建临时文件路径
     */
    private createTempPath;
}
//# sourceMappingURL=boluo.d.ts.map