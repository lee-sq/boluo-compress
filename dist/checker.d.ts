/**
 * 图片检测器，用于检测图片格式、EXIF信息等
 */
export declare class Checker {
    private static instance;
    private readonly JPEG_SIGNATURE;
    static getInstance(): Checker;
    /**
     * 判断是否为JPG格式
     */
    isJPG(buffer: Buffer): boolean;
    /**
     * 获取图片方向信息
     */
    getOrientation(buffer: Buffer): number;
    /**
     * 从EXIF数据中提取方向信息
     */
    private extractOrientation;
    /**
     * 获取文件扩展名后缀
     * 使用文件头部字节进行文件类型检测
     */
    getExtSuffix(buffer: Buffer): string;
    /**
     * 判断是否需要压缩
     */
    needCompress(leastCompressSize: number, buffer: Buffer): boolean;
    /**
     * 从buffer中按指定字节序读取数值
     */
    private pack;
    /**
     * 比较两个Uint8Array是否相等
     */
    private arraysEqual;
}
//# sourceMappingURL=checker.d.ts.map