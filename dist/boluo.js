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
Object.defineProperty(exports, "__esModule", { value: true });
exports.BoLuoBuilder = exports.BoLuo = void 0;
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
const crypto = __importStar(require("crypto"));
const engine_1 = require("./engine");
const checker_1 = require("./checker");
const input_stream_provider_1 = require("./input-stream-provider");
/**
 * BoLuo图片压缩库主类
 */
class BoLuo {
    /**
     * 创建BoLuo实例
     */
    static create() {
        return new BoLuoBuilder();
    }
    /**
     * 压缩单个文件
     */
    static async compressFile(filePath, options = {}) {
        const builder = new BoLuoBuilder();
        return builder.load(filePath).setOptions(options).get();
    }
    /**
     * 压缩多个文件
     */
    static async compressFiles(filePaths, options = {}) {
        const builder = new BoLuoBuilder();
        return builder.load(filePaths).setOptions(options).getAll();
    }
}
exports.BoLuo = BoLuo;
BoLuo.defaultOptions = {
    quality: 60,
    ignoreBy: 100,
    focusAlpha: false,
    targetDir: './compressed',
    filter: (filePath) => {
        return !(filePath.toLowerCase().endsWith('.gif'));
    }
};
/**
 * BoLuo构建器类
 */
class BoLuoBuilder {
    constructor() {
        this.inputPaths = [];
        this.options = { ...BoLuo['defaultOptions'] };
        this.checker = checker_1.Checker.getInstance();
    }
    /**
     * 加载要压缩的文件
     */
    load(input) {
        if (typeof input === 'string') {
            this.inputPaths = [input];
        }
        else if (Array.isArray(input)) {
            this.inputPaths = input;
        }
        else {
            // Buffer类型，创建临时文件路径
            const tempPath = this.createTempPath();
            fs.writeFileSync(tempPath, input);
            this.inputPaths = [tempPath];
        }
        return this;
    }
    /**
     * 设置压缩选项
     */
    setOptions(options) {
        this.options = { ...this.options, ...options };
        return this;
    }
    /**
     * 设置压缩质量
     */
    quality(quality) {
        this.options.quality = quality;
        return this;
    }
    /**
     * 设置最小压缩阈值
     */
    ignoreBy(size) {
        this.options.ignoreBy = size;
        return this;
    }
    /**
     * 设置是否保留透明通道
     */
    setFocusAlpha(focusAlpha) {
        this.options.focusAlpha = focusAlpha;
        return this;
    }
    /**
     * 设置输出目录
     */
    setTargetDir(targetDir) {
        this.options.targetDir = targetDir;
        return this;
    }
    /**
     * 设置过滤器
     */
    filter(filter) {
        this.options.filter = filter;
        return this;
    }
    /**
     * 设置重命名监听器
     */
    setRenameListener(renameListener) {
        this.options.renameListener = renameListener;
        return this;
    }
    /**
     * 设置压缩监听器
     */
    setCompressListener(listener) {
        this.listener = listener;
        return this;
    }
    /**
     * 异步启动压缩
     */
    async launch() {
        try {
            this.listener?.onStart?.();
            for (const filePath of this.inputPaths) {
                const result = await this.compressFile(filePath);
                this.listener?.onSuccess?.(result.outputPath);
            }
        }
        catch (error) {
            this.listener?.onError?.(error);
        }
    }
    /**
     * 同步获取压缩结果（单个文件）
     */
    async get() {
        if (this.inputPaths.length === 0) {
            throw new Error('No input files specified');
        }
        return this.compressFile(this.inputPaths[0]);
    }
    /**
     * 同步获取压缩结果（多个文件）
     */
    async getAll() {
        const results = [];
        for (const filePath of this.inputPaths) {
            const result = await this.compressFile(filePath);
            results.push(result);
        }
        return results;
    }
    /**
     * 压缩单个文件的内部方法
     */
    async compressFile(filePath) {
        // 检查文件是否存在
        if (!fs.existsSync(filePath)) {
            throw new Error(`File not found: ${filePath}`);
        }
        // 获取原始文件信息
        const originalStats = fs.statSync(filePath);
        const originalSize = originalStats.size;
        // 应用过滤器
        if (this.options.filter && !this.options.filter(filePath)) {
            throw new Error(`File filtered out: ${filePath}`);
        }
        // 检查是否需要压缩
        if (!this.checker.needCompress(this.options.ignoreBy || 0, filePath)) {
            // 不需要压缩，直接返回原文件信息
            const buffer = fs.readFileSync(filePath);
            const sharp = await Promise.resolve().then(() => __importStar(require('sharp')));
            const metadata = await sharp.default(buffer).metadata();
            return {
                originalPath: filePath,
                outputPath: filePath,
                originalSize: originalSize,
                compressedSize: originalSize,
                compressionRatio: 1,
                width: metadata.width || 0,
                height: metadata.height || 0
            };
        }
        // 读取文件内容以检测格式
        const buffer = fs.readFileSync(filePath);
        const detectedExt = await this.checker.getExtSuffix(buffer);
        // 生成输出文件路径（使用检测到的扩展名）
        const outputPath = this.generateOutputPath(filePath, detectedExt);
        // 创建输入流提供者
        const inputProvider = new input_stream_provider_1.FileInputStreamProvider(filePath);
        // 创建压缩引擎并执行压缩
        const engine = new engine_1.Engine(inputProvider, outputPath, this.options.focusAlpha || false);
        const compressedPath = await engine.compress();
        // 获取压缩后的文件信息
        const compressedInfo = await engine.getCompressedInfo();
        const compressedStats = fs.statSync(compressedPath);
        return {
            originalPath: filePath,
            outputPath: compressedPath,
            originalSize: originalSize,
            compressedSize: compressedStats.size,
            compressionRatio: compressedStats.size / originalSize,
            width: compressedInfo.width,
            height: compressedInfo.height
        };
    }
    /**
     * 生成输出文件路径
     */
    generateOutputPath(filePath, detectedExt) {
        const targetDir = this.options.targetDir || './compressed';
        // 确保目标目录存在
        if (!fs.existsSync(targetDir)) {
            fs.mkdirSync(targetDir, { recursive: true });
        }
        let fileName = path.basename(filePath);
        // 应用重命名监听器
        if (this.options.renameListener) {
            const newName = this.options.renameListener(filePath);
            // 使用检测到的扩展名，如果没有则使用原始扩展名
            const ext = detectedExt || path.extname(filePath);
            fileName = newName + ext;
        }
        else if (detectedExt) {
            // 如果检测到的扩展名与原始不同，则更新文件名
            const baseName = path.basename(filePath, path.extname(filePath));
            fileName = baseName + detectedExt;
        }
        return path.join(targetDir, fileName);
    }
    /**
     * 创建临时文件路径
     */
    createTempPath() {
        const tempDir = './temp';
        if (!fs.existsSync(tempDir)) {
            fs.mkdirSync(tempDir, { recursive: true });
        }
        const hash = crypto.createHash('md5').update(Date.now().toString()).digest('hex');
        return path.join(tempDir, `temp_${hash}.jpg`);
    }
}
exports.BoLuoBuilder = BoLuoBuilder;
//# sourceMappingURL=boluo.js.map