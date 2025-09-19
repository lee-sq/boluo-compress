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
exports.BufferInputStreamProvider = exports.FileInputStreamProvider = void 0;
const fs = __importStar(require("fs"));
/**
 * 文件输入流提供者
 */
class FileInputStreamProvider {
    constructor(filePath) {
        this.filePath = filePath;
    }
    getPath() {
        return this.filePath;
    }
    async getBuffer() {
        return fs.readFileSync(this.filePath);
    }
    close() {
        // 文件流不需要特殊关闭操作
    }
}
exports.FileInputStreamProvider = FileInputStreamProvider;
/**
 * Buffer输入流提供者
 */
class BufferInputStreamProvider {
    constructor(buffer, path = 'buffer') {
        this.buffer = buffer;
        this.path = path;
    }
    getPath() {
        return this.path;
    }
    async getBuffer() {
        return this.buffer;
    }
    close() {
        // Buffer不需要特殊关闭操作
    }
}
exports.BufferInputStreamProvider = BufferInputStreamProvider;
//# sourceMappingURL=input-stream-provider.js.map