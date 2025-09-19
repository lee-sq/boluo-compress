/**
 * BoLuo 前端Blob压缩示例
 * 展示如何使用新的compressToBlob方法
 */

import { BoLuo } from './src/boluo';

// 示例1: 使用静态方法压缩并返回Blob
async function example1_staticMethod() {
  console.log('=== 示例1: 静态方法压缩返回Blob ===');
  
  // 假设从文件输入获取File对象
  const fileInput = document.querySelector('#fileInput') as HTMLInputElement;
  const file = fileInput.files?.[0];
  
  if (file) {
    try {
      // 🎯 新方法：直接返回Blob，更适合前端使用
      const compressedBlob = await BoLuo.compressToBlob(file, {
        quality: 80,
        ignoreBy: 100
      });
      
      console.log('原始文件大小:', file.size, 'bytes');
      console.log('压缩后大小:', compressedBlob.size, 'bytes');
      console.log('压缩比:', ((1 - compressedBlob.size / file.size) * 100).toFixed(2) + '%');
      
      // 🚀 直接使用Blob进行各种操作
      
      // 1. 创建下载链接
      const downloadUrl = URL.createObjectURL(compressedBlob);
      const downloadLink = document.createElement('a');
      downloadLink.href = downloadUrl;
      downloadLink.download = 'compressed-image.jpg';
      downloadLink.click();
      URL.revokeObjectURL(downloadUrl);
      
      // 2. 预览图片
      const previewUrl = URL.createObjectURL(compressedBlob);
      const imgElement = document.createElement('img');
      imgElement.src = previewUrl;
      document.body.appendChild(imgElement);
      
      // 3. 上传到服务器
      const formData = new FormData();
      formData.append('image', compressedBlob, 'compressed.jpg');
      
      // fetch('/upload', {
      //   method: 'POST',
      //   body: formData
      // });
      
    } catch (error) {
      console.error('压缩失败:', error);
    }
  }
}

// 示例2: 使用构建器模式压缩并返回Blob
async function example2_builderPattern() {
  console.log('=== 示例2: 构建器模式压缩返回Blob ===');
  
  const fileInput = document.querySelector('#fileInput') as HTMLInputElement;
  const file = fileInput.files?.[0];
  
  if (file) {
    try {
      // 🎯 新方法：构建器模式返回Blob
      const compressedBlob = await BoLuo.create()
        .load(file)
        .quality(75)
        .ignoreBy(50)
        .setFocusAlpha(true)  // 保留PNG透明通道
        .compressToBlob();    // 返回Blob而不是Buffer
      
      console.log('压缩完成，返回Blob对象');
      console.log('MIME类型:', compressedBlob.type);
      console.log('文件大小:', compressedBlob.size, 'bytes');
      
      // 直接使用Blob
      const objectUrl = URL.createObjectURL(compressedBlob);
      console.log('对象URL:', objectUrl);
      
    } catch (error) {
      console.error('压缩失败:', error);
    }
  }
}

// 示例3: 批量压缩返回Blob数组
async function example3_batchCompress() {
  console.log('=== 示例3: 批量压缩返回Blob数组 ===');
  
  const fileInput = document.querySelector('#multipleFileInput') as HTMLInputElement;
  const files = Array.from(fileInput.files || []);
  
  if (files.length > 0) {
    try {
      // 🎯 新方法：批量压缩返回Blob数组
      const compressedBlobs = await BoLuo.create()
        .load(files)
        .quality(80)
        .compressAllToBlobs();  // 返回Blob数组
      
      console.log(`成功压缩 ${compressedBlobs.length} 个文件`);
      
      // 为每个压缩后的Blob创建下载链接
      compressedBlobs.forEach((blob, index) => {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `compressed-${index + 1}.jpg`;
        link.textContent = `下载压缩图片 ${index + 1}`;
        document.body.appendChild(link);
        document.body.appendChild(document.createElement('br'));
      });
      
    } catch (error) {
      console.error('批量压缩失败:', error);
    }
  }
}

// 示例4: React组件中的使用（伪代码示例）
function ReactImageCompressorExample() {
  // 这是一个React组件的示例代码，展示如何使用新的Blob API
  
  const handleFileChange = async (event: Event) => {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];
    if (!file) return;
    
    try {
      // 🎯 使用新的compressToBlob方法
      const blob = await BoLuo.compressToBlob(file, { quality: 80 });
      
      // 创建预览URL
      const url = URL.createObjectURL(blob);
      
      // 更新预览图片
      const previewImg = document.querySelector('#preview') as HTMLImageElement;
      if (previewImg) {
        previewImg.src = url;
      }
      
      // 设置下载链接
      const downloadLink = document.querySelector('#download') as HTMLAnchorElement;
      if (downloadLink) {
        downloadLink.href = url;
        downloadLink.download = 'compressed-image.jpg';
      }
      
    } catch (error) {
      console.error('压缩失败:', error);
    }
  };
  
  // HTML结构示例：
  // <input type="file" accept="image/*" onchange="handleFileChange(event)" />
  // <img id="preview" alt="压缩预览" style="max-width: 300px;" />
  // <a id="download" href="#" download="compressed-image.jpg">下载压缩图片</a>
}

// 示例5: 对比Buffer和Blob的使用
async function example5_bufferVsBlob() {
  console.log('=== 示例5: Buffer vs Blob 对比 ===');
  
  const fileInput = document.querySelector('#fileInput') as HTMLInputElement;
  const file = fileInput.files?.[0];
  
  if (file) {
    // 旧方法：返回Buffer（需要手动转换）
    const buffer = await BoLuo.compress(file);
    const blobFromBuffer = new Blob([buffer], { type: 'image/jpeg' }); // 需要手动指定MIME类型
    
    // 🎯 新方法：直接返回Blob（自动检测MIME类型）
    const blob = await BoLuo.compressToBlob(file);
    
    console.log('Buffer方法 - 需要手动转换:', blobFromBuffer);
    console.log('Blob方法 - 直接可用:', blob);
    console.log('自动检测的MIME类型:', blob.type);
  }
}

export {
  example1_staticMethod,
  example2_builderPattern,
  example3_batchCompress,
  ReactImageCompressorExample,
  example5_bufferVsBlob
};