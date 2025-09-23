/**
 * 浏览器专用图像处理引擎
 * 使用 Canvas API 替代 Sharp，支持纯前端环境
 */
import { CompressionOptions, ImageInfo } from './types';
export declare class BrowserEngine {
    private srcBuffer;
    constructor(buffer: Buffer);
    /**
     * 获取图片信息
     */
    getImageInfo(): Promise<ImageInfo>;
    /**
     * 压缩图片
     */
    compress(options: CompressionOptions): Promise<Buffer>;
    /**
     * 旋转图片（基于EXIF）
     */
    rotateByExif(orientation: number): Promise<Buffer>;
    /**
     * 计算新尺寸
     */
    private calculateNewSize;
    /**
     * 应用EXIF方向变换
     */
    private applyOrientation;
    /**
     * 从Buffer获取图片格式
     */
    private getFormatFromBuffer;
    /**
     * 获取输出MIME类型
     */
    private getOutputMimeType;
}
//# sourceMappingURL=browser-engine.d.ts.map