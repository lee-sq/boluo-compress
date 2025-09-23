/**
 * 简化版本：处理 blob: 字符串路径
 */

// 🎯 最简单的处理方式
async function handleBlobString(imagePath: string) {
    // 检查是否为 blob URL
    if (imagePath.startsWith('blob:')) {
        console.log('✅ 这是一个 Blob URL:', imagePath);
        
        // 方法1: 直接使用 fetch 获取 Blob
        const response = await fetch(imagePath);
        const blob = await response.blob();
        
        console.log('📦 获取到的 Blob:', {
            size: blob.size,
            type: blob.type
        });
        
        return blob;
    } else {
        console.log('❌ 不是 Blob URL');
        return null;
    }
}

// 🔄 转换为不同格式
async function convertBlobUrl(blobUrl: string) {
    if (!blobUrl.startsWith('blob:')) {
        throw new Error('不是有效的 Blob URL');
    }

    // 获取 Blob
    const response = await fetch(blobUrl);
    const blob = await response.blob();

    // 转换为 File
    const file = new File([blob], 'image.jpg', { type: blob.type });

    // 转换为 Base64
    const base64 = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.readAsDataURL(blob);
    });

    // 转换为 ArrayBuffer
    const arrayBuffer = await blob.arrayBuffer();

    return {
        blob,
        file,
        base64,
        arrayBuffer
    };
}

// 🖼️ 在页面中使用
function displayBlobUrl(blobUrl: string, imgElement: HTMLImageElement) {
    if (blobUrl.startsWith('blob:')) {
        imgElement.src = blobUrl;
    }
}

// 💾 下载 Blob URL
function downloadBlobUrl(blobUrl: string, fileName: string = 'download.jpg') {
    if (blobUrl.startsWith('blob:')) {
        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = fileName;
        link.click();
    }
}

// 📤 上传到服务器
async function uploadBlobUrl(blobUrl: string, uploadUrl: string) {
    if (!blobUrl.startsWith('blob:')) {
        throw new Error('不是有效的 Blob URL');
    }

    // 获取 Blob
    const response = await fetch(blobUrl);
    const blob = await response.blob();

    // 创建 FormData
    const formData = new FormData();
    formData.append('file', blob, 'upload.jpg');

    // 上传
    return fetch(uploadUrl, {
        method: 'POST',
        body: formData
    });
}

// 🎯 结合 BoLuo 使用
async function compressBlobUrl(blobUrl: string) {
    if (!blobUrl.startsWith('blob:')) {
        throw new Error('不是有效的 Blob URL');
    }

    // 1. 获取 Blob
    const response = await fetch(blobUrl);
    const blob = await response.blob();

    // 2. 转换为 File
    const file = new File([blob], 'image.jpg', { type: blob.type });

    // 3. 使用 BoLuo 压缩
    // 注意：需要先导入 BoLuo
    // import { BoLuo } from './src/boluo';
    // const compressedBlob = await BoLuo.compressToBlob(file, { quality: 80 });
    
    // 4. 创建新的 Blob URL
    // const newBlobUrl = URL.createObjectURL(compressedBlob);
    
    // return newBlobUrl;
}

// ==================== 使用示例 ====================

// 示例1: 基本使用
async function example1() {
    const imagePath = "blob:null/550e8400-e29b-41d4-a716-446655440000";
    
    const blob = await handleBlobString(imagePath);
    if (blob) {
        console.log('成功获取 Blob:', blob);
    }
}

// 示例2: 转换格式
async function example2() {
    const blobUrl = "blob:null/550e8400-e29b-41d4-a716-446655440000";
    
    const converted = await convertBlobUrl(blobUrl);
    console.log('转换结果:', {
        blobSize: converted.blob.size,
        fileName: converted.file.name,
        base64Length: converted.base64.length,
        arrayBufferLength: converted.arrayBuffer.byteLength
    });
}

// 示例3: 页面显示
function example3() {
    const blobUrl = "blob:null/550e8400-e29b-41d4-a716-446655440000";
    const img = document.querySelector('img') as HTMLImageElement;
    
    if (img) {
        displayBlobUrl(blobUrl, img);
    }
}

// 示例4: 文件下载
function example4() {
    const blobUrl = "blob:null/550e8400-e29b-41d4-a716-446655440000";
    downloadBlobUrl(blobUrl, 'my-image.jpg');
}

// 示例5: 上传文件
async function example5() {
    const blobUrl = "blob:null/550e8400-e29b-41d4-a716-446655440000";
    
    try {
        const response = await uploadBlobUrl(blobUrl, '/api/upload');
        console.log('上传成功:', response.status);
    } catch (error) {
        console.error('上传失败:', error);
    }
}

export {
    handleBlobString,
    convertBlobUrl,
    displayBlobUrl,
    downloadBlobUrl,
    uploadBlobUrl,
    compressBlobUrl
};