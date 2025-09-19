"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Engine = void 0;
const sharp_1 = __importDefault(require("sharp"));
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
const checker_1 = require("./checker");
/**
 * 压缩引擎，负责执行图片压缩算法
 */
class Engine {
    constructor(srcImg, targetPath, focusAlpha = false) {
        this.srcWidth = 0;
        this.srcHeight = 0;
        this.srcImg = srcImg;
        this.targetPath = targetPath;
        this.focusAlpha = focusAlpha;
        this.checker = checker_1.Checker.getInstance();
    }
    /**
     * 初始化图片信息
     */
    async initImageInfo() {
        const buffer = await this.srcImg.getBuffer();
        const metadata = await (0, sharp_1.default)(buffer).metadata();
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
            // 图片比例在 [1:1 ~ 9:16) 范围内
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
                const ratio = Math.floor(longSide / 1280);
                return ratio === 0 ? 1 : ratio;
            }
        }
        else if (scale <= 0.5625 && scale > 0.5) {
            // 图片比例在 [9:16 ~ 1:2) 范围内
            const ratio = Math.floor(longSide / 1280);
            return ratio === 0 ? 1 : ratio;
        }
        else {
            // 图片比例在 [1:2 ~ 1:∞) 范围内
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
        if (angle === 0) {
            return imageBuffer;
        }
        return await (0, sharp_1.default)(imageBuffer)
            .rotate(angle)
            .toBuffer();
    }
    /**
     * 执行压缩
     */
    async compress() {
        try {
            await this.initImageInfo();
            const buffer = await this.srcImg.getBuffer();
            const targetSize = this.computeTargetSize();
            let processedBuffer = buffer;
            // 检查是否需要旋转（基于EXIF信息）
            if (this.checker.isJPG(buffer)) {
                const orientation = this.checker.getOrientation(buffer);
                if (orientation !== 0) {
                    processedBuffer = await this.rotateImage(buffer, orientation);
                }
            }
            // 确保目标目录存在
            const targetDir = path.dirname(this.targetPath);
            if (!fs.existsSync(targetDir)) {
                fs.mkdirSync(targetDir, { recursive: true });
            }
            // 检测原始文件格式
            const originalExt = await this.checker.getExtSuffix(buffer);
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
                    await sharpInstance
                        .webp({ quality: 60 })
                        .toFile(this.targetPath);
                }
                else {
                    await sharpInstance
                        .png({ quality: 60 })
                        .toFile(this.targetPath);
                }
            }
            else {
                // 其他格式转为JPEG
                await sharpInstance
                    .jpeg({ quality: 60 })
                    .toFile(this.targetPath);
            }
            return this.targetPath;
        }
        catch (error) {
            throw new Error(`Compression failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
        finally {
            this.srcImg.close();
        }
    }
    /**
     * 获取压缩后的文件信息
     */
    async getCompressedInfo() {
        if (!fs.existsSync(this.targetPath)) {
            throw new Error('Compressed file not found');
        }
        const buffer = fs.readFileSync(this.targetPath);
        const metadata = await (0, sharp_1.default)(buffer).metadata();
        const stats = fs.statSync(this.targetPath);
        return {
            width: metadata.width || 0,
            height: metadata.height || 0,
            format: metadata.format || 'unknown',
            size: stats.size
        };
    }
}
exports.Engine = Engine;
//# sourceMappingURL=engine.js.map