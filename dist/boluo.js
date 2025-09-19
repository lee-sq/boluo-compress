"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BoLuoBuilder = exports.BoLuo = void 0;
const engine_1 = require("./engine");
const checker_1 = require("./checker");
/**
 * 前端图片压缩库 - BoLuo
 * 专为浏览器环境设计，只处理Blob/Buffer对象
 */
class BoLuo {
    /**
     * 压缩单个Blob/Buffer
     * @param input - 输入的Blob或Buffer
     * @param options - 压缩选项
     * @returns 压缩后的Buffer
     */
    static async compress(input, options = {}) {
        const mergedOptions = { ...BoLuo.defaultOptions, ...options };
        // 将Blob转换为Buffer
        let buffer;
        if (input instanceof Blob) {
            const arrayBuffer = await input.arrayBuffer();
            buffer = Buffer.from(arrayBuffer);
        }
        else {
            buffer = input;
        }
        // 检查是否为支持的图片格式
        const checker = checker_1.Checker.getInstance();
        try {
            const ext = await checker.getExtSuffix(buffer);
            if (!['.jpg', '.jpeg', '.png', '.webp'].includes(ext.toLowerCase())) {
                throw new Error('Unsupported image format. Only JPG, PNG, and WebP are supported.');
            }
        }
        catch (error) {
            throw new Error('Invalid image data');
        }
        // 检查文件大小是否需要压缩
        if (buffer.length <= mergedOptions.ignoreBy * 1024) { // 转换为字节
            return buffer; // 返回原始buffer
        }
        // 使用Engine进行压缩
        const engine = new engine_1.Engine(buffer, mergedOptions.focusAlpha || false);
        return await engine.compress();
    }
    /**
     * 压缩多个Blob/Buffer
     * @param inputs - 输入的Blob或Buffer数组
     * @param options - 压缩选项
     * @returns 压缩后的Buffer数组
     */
    static async compressMultiple(inputs, options = {}) {
        const results = [];
        for (const input of inputs) {
            try {
                const compressed = await BoLuo.compress(input, options);
                results.push(compressed);
            }
            catch (error) {
                console.warn('Failed to compress one image:', error);
                // 压缩失败时，返回原始数据
                if (input instanceof Blob) {
                    const arrayBuffer = await input.arrayBuffer();
                    results.push(Buffer.from(arrayBuffer));
                }
                else {
                    results.push(input);
                }
            }
        }
        return results;
    }
    /**
     * 获取图片信息
     * @param input - 输入的Blob或Buffer
     * @returns 图片信息
     */
    static async getImageInfo(input) {
        let buffer;
        if (input instanceof Blob) {
            const arrayBuffer = await input.arrayBuffer();
            buffer = Buffer.from(arrayBuffer);
        }
        else {
            buffer = input;
        }
        const engine = new engine_1.Engine(buffer);
        return await engine.getOriginalInfo();
    }
    /**
     * 检查是否为支持的图片格式
     * @param input - 输入的Blob或Buffer
     * @returns 是否为支持的格式
     */
    static async isValidImage(input) {
        try {
            let buffer;
            if (input instanceof Blob) {
                const arrayBuffer = await input.arrayBuffer();
                buffer = Buffer.from(arrayBuffer);
            }
            else {
                buffer = input;
            }
            const checker = checker_1.Checker.getInstance();
            const ext = await checker.getExtSuffix(buffer);
            return ['.jpg', '.jpeg', '.png', '.webp'].includes(ext.toLowerCase());
        }
        catch {
            return false;
        }
    }
    /**
     * 创建Builder实例
     */
    static create() {
        return new BoLuoBuilder();
    }
}
exports.BoLuo = BoLuo;
BoLuo.defaultOptions = {
    quality: 60,
    ignoreBy: 100, // 100KB以下不压缩
    focusAlpha: false
};
/**
 * BoLuo Builder类，提供链式调用API
 */
class BoLuoBuilder {
    constructor() {
        this.inputs = [];
        this.options = { ...BoLuo['defaultOptions'] };
    }
    /**
     * 加载输入数据
     */
    load(input) {
        if (Array.isArray(input)) {
            this.inputs = [...input];
        }
        else {
            this.inputs = [input];
        }
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
     * 设置最小压缩阈值（KB）
     */
    ignoreBy(sizeKB) {
        this.options.ignoreBy = sizeKB;
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
     * 压缩单个输入（仅支持单个输入）
     */
    async compress() {
        if (this.inputs.length !== 1) {
            throw new Error('compress() method only supports single input. Use compressAll() for multiple inputs.');
        }
        return await BoLuo.compress(this.inputs[0], this.options);
    }
    /**
     * 压缩所有输入
     */
    async compressAll() {
        if (this.inputs.length === 0) {
            throw new Error('No inputs loaded. Use load() method first.');
        }
        return await BoLuo.compressMultiple(this.inputs, this.options);
    }
    /**
     * 获取第一个输入的图片信息
     */
    async getImageInfo() {
        if (this.inputs.length === 0) {
            throw new Error('No inputs loaded. Use load() method first.');
        }
        return await BoLuo.getImageInfo(this.inputs[0]);
    }
}
exports.BoLuoBuilder = BoLuoBuilder;
//# sourceMappingURL=boluo.js.map