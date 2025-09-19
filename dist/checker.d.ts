/**
 * 图片检测器，用于检测图片格式、EXIF信息等
 */
export declare class Checker {
    private static instance;
    private readonly JPEG_SIGNATURE;
    private readonly JPG_EXT;
    static getInstance(): Checker;
    /**
     * 判断是否为JPG格式
     */
    isJPG(buffer: Buffer): boolean;
    /**
     * 获取图片旋转角度
     * 返回值: 0, 90, 180, 270
     */
    getOrientation(buffer: Buffer): number;
    /**
     * 获取文件扩展名
     * 使用file-type库进行更准确的文件类型检测
     */
    getExtSuffix(buffer: Buffer): Promise<string>;
    /**
     * 检查是否需要压缩
     */
    needCompress(leastCompressSize: number, buffer: Buffer): boolean;
    /**
     * 打包字节数据
     */
    private pack;
    /**
     * 比较两个数组是否相等
     */
    private arraysEqual;
}
//# sourceMappingURL=checker.d.ts.map