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
      
      console.log('压缩完成:', {
        originalSize: file.size,
        compressedSize: compressedBlob.size,
        compressionRatio: ((file.size - compressedBlob.size) / file.size * 100).toFixed(2) + '%'
      });
      
      // 🎯 创建Blob URL用于显示和下载
      const blobUrl = URL.createObjectURL(compressedBlob);
      
      // 1. 显示压缩后的图片
      const img = document.createElement('img');
      img.src = blobUrl;
      img.style.maxWidth = '300px';
      document.body.appendChild(img);
      
      // 2. 创建下载链接
      const downloadLink = document.createElement('a');
      downloadLink.href = blobUrl;
      downloadLink.download = `compressed_${file.name}`;
      downloadLink.textContent = '下载压缩图片';
      downloadLink.style.display = 'block';
      downloadLink.style.marginTop = '10px';
      document.body.appendChild(downloadLink);
      
      // 3. 用于FormData上传
      const formData = new FormData();
      formData.append('image', compressedBlob, `compressed_${file.name}`);
      
      // 4. 清理URL（可选，浏览器会自动清理）
      setTimeout(() => {
        URL.revokeObjectURL(blobUrl);
        console.log('Blob URL已清理');
      }, 60000); // 1分钟后清理
      
      return { compressedBlob, blobUrl };
      
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

// 示例5: Blob URL 完整使用场景
async function example5_blobUrlUseCases() {
  const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
  const file = fileInput.files?.[0];
  
  if (!file) {
    console.log('请先选择一个图片文件');
    return;
  }

  try {
    // 🎯 压缩获取Blob
    const compressedBlob = await BoLuo.compressToBlob(file, { quality: 75 });
    
    // 📱 场景1: 图片预览
    function createImagePreview(blob: Blob, title: string) {
      const container = document.createElement('div');
      container.style.margin = '10px';
      container.style.padding = '10px';
      container.style.border = '1px solid #ddd';
      container.style.borderRadius = '8px';
      
      const titleEl = document.createElement('h3');
      titleEl.textContent = title;
      container.appendChild(titleEl);
      
      const img = document.createElement('img');
      img.src = URL.createObjectURL(blob);
      img.style.maxWidth = '200px';
      img.style.borderRadius = '4px';
      container.appendChild(img);
      
      const info = document.createElement('p');
      info.textContent = `大小: ${(blob.size / 1024).toFixed(2)} KB`;
      container.appendChild(info);
      
      document.body.appendChild(container);
      return img.src; // 返回Blob URL
    }
    
    // 📥 场景2: 文件下载
    function createDownloadLink(blob: Blob, filename: string) {
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = filename;
      link.textContent = `📥 下载 ${filename}`;
      link.style.display = 'inline-block';
      link.style.margin = '10px';
      link.style.padding = '8px 16px';
      link.style.background = '#007AFF';
      link.style.color = 'white';
      link.style.textDecoration = 'none';
      link.style.borderRadius = '4px';
      
      document.body.appendChild(link);
      return blobUrl;
    }
    
    // 🚀 场景3: 上传到服务器
    async function uploadToServer(blob: Blob, filename: string) {
      const formData = new FormData();
      formData.append('image', blob, filename);
      formData.append('quality', '75');
      formData.append('timestamp', Date.now().toString());
      
      console.log('📤 准备上传:', {
        filename,
        size: blob.size,
        type: blob.type
      });
      
      // 模拟上传请求
      // const response = await fetch('/api/upload', {
      //   method: 'POST',
      //   body: formData
      // });
      
      return formData;
    }
    
    // 🎨 场景4: Canvas 操作
    function drawToCanvas(blobUrl: string) {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        
        // 绘制图片
        ctx?.drawImage(img, 0, 0);
        
        // 添加水印
        if (ctx) {
          ctx.font = '20px Arial';
          ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
          ctx.fillText('BoLuo Compressed', 10, 30);
        }
        
        document.body.appendChild(canvas);
        URL.revokeObjectURL(blobUrl); // 使用完后清理
      };
      
      img.src = blobUrl;
    }
    
    // 执行所有场景
    console.log('🎯 开始演示Blob URL使用场景...');
    
    // 原图预览
    const originalUrl = createImagePreview(file, '📷 原图');
    
    // 压缩图预览
    const compressedUrl = createImagePreview(compressedBlob, '🎯 压缩后');
    
    // 下载链接
    const downloadUrl = createDownloadLink(compressedBlob, `compressed_${file.name}`);
    
    // 上传准备
    const uploadData = await uploadToServer(compressedBlob, `compressed_${file.name}`);
    
    // Canvas操作
    drawToCanvas(compressedUrl);
    
    // 📊 显示对比信息
    const comparison = document.createElement('div');
    comparison.style.margin = '20px';
    comparison.style.padding = '15px';
    comparison.style.background = '#f5f5f5';
    comparison.style.borderRadius = '8px';
    comparison.innerHTML = `
      <h3>📊 压缩效果对比</h3>
      <p><strong>原始大小:</strong> ${(file.size / 1024).toFixed(2)} KB</p>
      <p><strong>压缩后大小:</strong> ${(compressedBlob.size / 1024).toFixed(2)} KB</p>
      <p><strong>压缩比:</strong> ${((file.size - compressedBlob.size) / file.size * 100).toFixed(1)}%</p>
      <p><strong>节省空间:</strong> ${((file.size - compressedBlob.size) / 1024).toFixed(2)} KB</p>
    `;
    document.body.appendChild(comparison);
    
    // 🧹 清理资源（延迟清理，确保用户有时间使用）
    setTimeout(() => {
      URL.revokeObjectURL(originalUrl);
      URL.revokeObjectURL(downloadUrl);
      console.log('🧹 Blob URLs 已清理');
    }, 300000); // 5分钟后清理
    
    return {
      original: file,
      compressed: compressedBlob,
      urls: { originalUrl, compressedUrl, downloadUrl },
      uploadData
    };
    
  } catch (error) {
    console.error('❌ 处理失败:', error);
  }
}

export {
  example1_staticMethod,
  example2_builderPattern,
  example3_batchCompress,
  ReactImageCompressorExample,
  example5_blobUrlUseCases
};