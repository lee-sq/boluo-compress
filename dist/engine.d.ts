import { ImageInfo } from './types';
/**
 * 前端图片压缩引擎，专为浏览器环境设计
 * 只处理Buffer/Blob，不涉及文件系统操作
 */
export declare class Engine {
    private srcBuffer;
    private srcWidth;
    private srcHeight;
    private focusAlpha;
    private checker;
    constructor(srcBuffer: Buffer, focusAlpha?: boolean);
    /**
     * 初始化图片信息
     */
    private initImageInfo;
    /**
     * 计算压缩采样率
     * 这是BoLuo算法的核心部分，参考微信朋友圈压缩策略
     */
    private computeSize;
    /**
     * 计算目标尺寸
     */
    private computeTargetSize;
    /**
     * 旋转图片
     */
    private rotateImage;
    /**
     * 压缩图片并返回Buffer
     */
    compress(): Promise<Buffer>;
    /**
     * 获取压缩后的图片信息
     */
    getImageInfo(buffer: Buffer): Promise<ImageInfo>;
    /**
     * 获取原始图片信息
     */
    getOriginalInfo(): Promise<ImageInfo>;
}
//# sourceMappingURL=engine.d.ts.map