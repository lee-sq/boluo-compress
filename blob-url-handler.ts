/**
 * Blob URL 处理工具类
 * 处理 blob: 开头的字符串路径
 */

export class BlobUrlHandler {
    
    /**
     * 检查字符串是否为有效的 Blob URL
     * @param imagePath - 图片路径字符串
     * @returns 是否为有效的 Blob URL
     */
    static isBlobUrl(imagePath: string): boolean {
        return typeof imagePath === 'string' && imagePath.startsWith('blob:');
    }

    /**
     * 从 Blob URL 获取 Blob 对象
     * @param blobUrl - blob: 开头的 URL 字符串
     * @returns Promise<Blob>
     */
    static async getBlobFromUrl(blobUrl: string): Promise<Blob> {
        if (!this.isBlobUrl(blobUrl)) {
            throw new Error('提供的不是有效的 Blob URL');
        }

        try {
            const response = await fetch(blobUrl);
            if (!response.ok) {
                throw new Error(`获取 Blob 失败: ${response.status}`);
            }
            return await response.blob();
        } catch (error) {
            throw new Error(`从 Blob URL 获取数据失败: ${error}`);
        }
    }

    /**
     * 将 Blob URL 转换为 File 对象
     * @param blobUrl - blob: 开头的 URL 字符串
     * @param fileName - 文件名（可选）
     * @returns Promise<File>
     */
    static async blobUrlToFile(blobUrl: string, fileName: string = 'image.jpg'): Promise<File> {
        const blob = await this.getBlobFromUrl(blobUrl);
        return new File([blob], fileName, { type: blob.type });
    }

    /**
     * 将 Blob URL 转换为 Base64 字符串
     * @param blobUrl - blob: 开头的 URL 字符串
     * @returns Promise<string> Base64 字符串
     */
    static async blobUrlToBase64(blobUrl: string): Promise<string> {
        const blob = await this.getBlobFromUrl(blobUrl);
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });
    }

    /**
     * 将 Blob URL 转换为 ArrayBuffer
     * @param blobUrl - blob: 开头的 URL 字符串
     * @returns Promise<ArrayBuffer>
     */
    static async blobUrlToArrayBuffer(blobUrl: string): Promise<ArrayBuffer> {
        const blob = await this.getBlobFromUrl(blobUrl);
        return await blob.arrayBuffer();
    }

    /**
     * 下载 Blob URL 对应的文件
     * @param blobUrl - blob: 开头的 URL 字符串
     * @param fileName - 下载的文件名
     */
    static downloadFromBlobUrl(blobUrl: string, fileName: string = 'download'): void {
        if (!this.isBlobUrl(blobUrl)) {
            throw new Error('提供的不是有效的 Blob URL');
        }

        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    /**
     * 在 img 元素中显示 Blob URL
     * @param blobUrl - blob: 开头的 URL 字符串
     * @param imgElement - img DOM 元素
     */
    static displayInImage(blobUrl: string, imgElement: HTMLImageElement): void {
        if (!this.isBlobUrl(blobUrl)) {
            throw new Error('提供的不是有效的 Blob URL');
        }
        imgElement.src = blobUrl;
    }

    /**
     * 将 Blob URL 上传到服务器
     * @param blobUrl - blob: 开头的 URL 字符串
     * @param uploadUrl - 上传接口地址
     * @param fieldName - 表单字段名
     * @param fileName - 文件名
     * @returns Promise<Response>
     */
    static async uploadBlobUrl(
        blobUrl: string, 
        uploadUrl: string, 
        fieldName: string = 'file',
        fileName: string = 'upload.jpg'
    ): Promise<Response> {
        const blob = await this.getBlobFromUrl(blobUrl);
        const formData = new FormData();
        formData.append(fieldName, blob, fileName);

        return fetch(uploadUrl, {
            method: 'POST',
            body: formData
        });
    }
}

// ==================== 使用示例 ====================

/**
 * 示例：处理 imagePath 为 blob URL 字符串的情况
 */
export async function handleImagePath(imagePath: string) {
    console.log('🔍 处理图片路径:', imagePath);

    // 1. 检查是否为 Blob URL
    if (BlobUrlHandler.isBlobUrl(imagePath)) {
        console.log('✅ 这是一个 Blob URL');

        try {
            // 2. 获取 Blob 对象
            const blob = await BlobUrlHandler.getBlobFromUrl(imagePath);
            console.log('📦 Blob 信息:', {
                size: blob.size,
                type: blob.type
            });

            // 3. 转换为 File 对象（如果需要）
            const file = await BlobUrlHandler.blobUrlToFile(imagePath, 'image.jpg');
            console.log('📄 File 对象:', file);

            // 4. 使用 BoLuo 压缩（如果需要）
            // const compressedBlob = await BoLuo.compressToBlob(file, { quality: 80 });
            // console.log('🎯 压缩后的 Blob:', compressedBlob);

            return {
                originalBlob: blob,
                file: file,
                blobUrl: imagePath
            };

        } catch (error) {
            console.error('❌ 处理 Blob URL 失败:', error);
            throw error;
        }
    } else {
        console.log('ℹ️ 这不是 Blob URL，可能是普通的图片路径');
        // 处理普通路径的逻辑...
        return null;
    }
}

/**
 * 完整的使用示例
 */
export async function exampleUsage() {
    // 假设你有一个 blob URL 字符串
    const imagePath = "blob:null/550e8400-e29b-41d4-a716-446655440000";
    
    console.log('🚀 开始处理 Blob URL...');

    try {
        // 方法1: 直接获取 Blob
        const blob = await BlobUrlHandler.getBlobFromUrl(imagePath);
        console.log('方法1 - 获取 Blob:', blob);

        // 方法2: 转换为 File
        const file = await BlobUrlHandler.blobUrlToFile(imagePath, 'my-image.jpg');
        console.log('方法2 - 转换为 File:', file);

        // 方法3: 转换为 Base64
        const base64 = await BlobUrlHandler.blobUrlToBase64(imagePath);
        console.log('方法3 - Base64:', base64.substring(0, 50) + '...');

        // 方法4: 在页面中显示
        const img = document.createElement('img');
        BlobUrlHandler.displayInImage(imagePath, img);
        console.log('方法4 - 显示图片:', img);

        // 方法5: 下载文件
        // BlobUrlHandler.downloadFromBlobUrl(imagePath, 'downloaded-image.jpg');

        // 方法6: 上传到服务器
        // const response = await BlobUrlHandler.uploadBlobUrl(
        //     imagePath, 
        //     '/api/upload', 
        //     'image', 
        //     'uploaded-image.jpg'
        // );

    } catch (error) {
        console.error('❌ 处理失败:', error);
    }
}

// ==================== 类型定义 ====================

export interface BlobUrlInfo {
    url: string;
    blob: Blob;
    file: File;
    size: number;
    type: string;
}

export interface BlobUrlOptions {
    fileName?: string;
    quality?: number;
    maxWidth?: number;
    maxHeight?: number;
}

/**
 * 高级处理函数：结合 BoLuo 压缩
 */
export async function processBlobUrlWithCompression(
    imagePath: string, 
    options: BlobUrlOptions = {}
): Promise<BlobUrlInfo | null> {
    
    if (!BlobUrlHandler.isBlobUrl(imagePath)) {
        return null;
    }

    const {
        fileName = 'processed-image.jpg',
        quality = 80
    } = options;

    try {
        // 1. 获取原始 Blob
        const originalBlob = await BlobUrlHandler.getBlobFromUrl(imagePath);
        
        // 2. 转换为 File
        const file = await BlobUrlHandler.blobUrlToFile(imagePath, fileName);
        
        // 3. 使用 BoLuo 压缩（需要导入 BoLuo）
        // import { BoLuo } from './src/boluo';
        // const compressedBlob = await BoLuo.compressToBlob(file, { quality });
        
        return {
            url: imagePath,
            blob: originalBlob,
            file: file,
            size: originalBlob.size,
            type: originalBlob.type
        };

    } catch (error) {
        console.error('处理 Blob URL 失败:', error);
        throw error;
    }
}

// ==================== 实用工具函数 ====================

/**
 * 批量处理多个 Blob URL
 */
export async function processBatchBlobUrls(imagePaths: string[]): Promise<BlobUrlInfo[]> {
    const results: BlobUrlInfo[] = [];
    
    for (const path of imagePaths) {
        const result = await processBlobUrlWithCompression(path);
        if (result) {
            results.push(result);
        }
    }
    
    return results;
}

/**
 * 检查 Blob URL 是否仍然有效
 */
export async function isBlobUrlValid(blobUrl: string): Promise<boolean> {
    if (!BlobUrlHandler.isBlobUrl(blobUrl)) {
        return false;
    }
    
    try {
        const response = await fetch(blobUrl);
        return response.ok;
    } catch {
        return false;
    }
}