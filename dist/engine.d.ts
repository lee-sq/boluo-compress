import { InputStreamProvider, ImageInfo } from './types';
/**
 * 压缩引擎，负责执行图片压缩算法
 */
export declare class Engine {
    private srcImg;
    private targetPath;
    private srcWidth;
    private srcHeight;
    private focusAlpha;
    private checker;
    constructor(srcImg: InputStreamProvider, targetPath: string, focusAlpha?: boolean);
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
     * 执行压缩
     */
    compress(): Promise<string>;
    /**
     * 获取压缩后的文件信息
     */
    getCompressedInfo(): Promise<ImageInfo>;
}
//# sourceMappingURL=engine.d.ts.map