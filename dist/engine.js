"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Engine = void 0;
const sharp_1 = __importDefault(require("sharp"));
const checker_1 = require("./checker");
/**
 * 前端图片压缩引擎，专为浏览器环境设计
 * 只处理Buffer/Blob，不涉及文件系统操作
 */
class Engine {
    constructor(srcBuffer, focusAlpha = false) {
        this.srcWidth = 0;
        this.srcHeight = 0;
        this.srcBuffer = srcBuffer;
        this.focusAlpha = focusAlpha;
        this.checker = checker_1.Checker.getInstance();
    }
    /**
     * 初始化图片信息
     */
    async initImageInfo() {
        const metadata = await (0, sharp_1.default)(this.srcBuffer).metadata();
        this.srcWidth = metadata.width || 0;
        this.srcHeight = metadata.height || 0;
    }
    /**
     * 计算压缩采样率
     * 这是BoLuo算法的核心部分，参考微信朋友圈压缩策略
     */
    computeSize() {
        // 确保宽高为偶数
        this.srcWidth = this.srcWidth % 2 === 1 ? this.srcWidth + 1 : this.srcWidth;
        this.srcHeight = this.srcHeight % 2 === 1 ? this.srcHeight + 1 : this.srcHeight;
        const longSide = Math.max(this.srcWidth, this.srcHeight);
        const shortSide = Math.min(this.srcWidth, this.srcHeight);
        const scale = shortSide / longSide;
        if (scale <= 1 && scale > 0.5625) {
            if (longSide < 1664) {
                return 1;
            }
            else if (longSide < 4990) {
                return 2;
            }
            else if (longSide > 4990 && longSide < 10240) {
                return 4;
            }
            else {
                return Math.max(1, longSide / 1280);
            }
        }
        else if (scale <= 0.5625 && scale > 0.5) {
            return Math.max(1, longSide / 1280);
        }
        else {
            return Math.ceil(longSide / (1280.0 / scale));
        }
    }
    /**
     * 计算目标尺寸
     */
    computeTargetSize() {
        const sampleSize = this.computeSize();
        return {
            width: Math.floor(this.srcWidth / sampleSize),
            height: Math.floor(this.srcHeight / sampleSize)
        };
    }
    /**
     * 旋转图片
     */
    async rotateImage(imageBuffer, angle) {
        return (0, sharp_1.default)(imageBuffer).rotate(angle).toBuffer();
    }
    /**
     * 压缩图片并返回Buffer
     */
    async compress() {
        try {
            await this.initImageInfo();
            const targetSize = this.computeTargetSize();
            let processedBuffer = this.srcBuffer;
            // 检查是否需要旋转（基于EXIF信息）
            if (this.checker.isJPG(this.srcBuffer)) {
                const orientation = this.checker.getOrientation(this.srcBuffer);
                if (orientation !== 0) {
                    processedBuffer = await this.rotateImage(this.srcBuffer, orientation);
                }
            }
            // 检测原始文件格式
            const originalExt = await this.checker.getExtSuffix(this.srcBuffer);
            // 使用Sharp进行压缩
            const sharpInstance = (0, sharp_1.default)(processedBuffer)
                .resize(targetSize.width, targetSize.height, {
                fit: 'inside',
                withoutEnlargement: true
            });
            // 根据原始格式和透明通道需求选择输出格式
            if (this.focusAlpha || originalExt === '.png' || originalExt === '.webp') {
                // 保留透明通道或原始为PNG/WebP格式
                if (originalExt === '.webp') {
                    return await sharpInstance
                        .webp({ quality: 60 })
                        .toBuffer();
                }
                else {
                    return await sharpInstance
                        .png({ quality: 60 })
                        .toBuffer();
                }
            }
            else {
                // 其他格式转为JPEG
                return await sharpInstance
                    .jpeg({ quality: 60 })
                    .toBuffer();
            }
        }
        catch (error) {
            throw new Error(`Compression failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    /**
     * 获取压缩后的图片信息
     */
    async getImageInfo(buffer) {
        const metadata = await (0, sharp_1.default)(buffer).metadata();
        return {
            width: metadata.width || 0,
            height: metadata.height || 0,
            format: metadata.format || 'unknown',
            size: buffer.length
        };
    }
    /**
     * 获取原始图片信息
     */
    async getOriginalInfo() {
        return this.getImageInfo(this.srcBuffer);
    }
}
exports.Engine = Engine;
//# sourceMappingURL=engine.js.map