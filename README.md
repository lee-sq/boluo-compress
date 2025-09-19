# BoLuo (菠萝) 📸

[![npm version](https://badge.fury.io/js/boluo.svg)](https://badge.fury.io/js/boluo)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)

## 🌍 Languages / 语言

- [🇨🇳 中文](#中文版本)
- [🇺🇸 English](#english-version)

---

## 中文版本

> 纯前端图片压缩库，基于微信朋友圈压缩算法，无需 Canvas，支持 Blob 直接压缩

BoLuo 是基于 [Android Luban](https://github.com/Curzibn/Luban) 压缩算法的纯前端 TypeScript 实现版本。Luban 算法通过逆向分析微信朋友圈的图片压缩策略而来，能够在保持视觉质量的同时显著减小图片文件大小。

## 🎯 关于 Luban 算法

Luban（鲁班）算法是通过在微信朋友圈发送近100张不同分辨率图片，对比原图与微信压缩后的图片逆向推算出来的压缩算法。虽然是逆向推算，但效果已经非常接近微信朋友圈压缩后的效果。

### 压缩效果对比

| 内容 | 原图 | Luban 压缩 | 微信压缩 |
|------|------|------------|----------|
| 截屏 720P | 720×1280, 390KB | 720×1280, 87KB | 720×1280, 56KB |
| 截屏 1080P | 1080×1920, 2.21MB | 1080×1920, 104KB | 1080×1920, 112KB |
| 拍照 13M(4:3) | 3096×4128, 3.12MB | 1548×2064, 141KB | 1548×2064, 147KB |
| 拍照 9.6M(16:9) | 4128×2322, 4.64MB | 1032×581, 97KB | 1032×581, 74KB |

*数据来源：Android Luban 项目测试结果*

## ✨ 特性

- 🚀 **微信级压缩算法** - 基于逆向分析微信朋友圈压缩策略
- 🌐 **纯前端实现** - 无需服务器，直接在浏览器中运行
- 📦 **TypeScript 原生支持** - 完整的类型定义，优秀的开发体验
- 🎯 **智能压缩策略** - 自动计算最佳压缩参数，平衡文件大小与图片质量
- 📁 **Blob 直接处理** - 支持 File/Blob 对象直接压缩，无需文件系统
- 🎨 **透明通道保持** - 可选择保留 PNG 图片的透明通道
- 📊 **详细压缩统计** - 提供压缩前后的详细对比数据
- 🚫 **无 Canvas 依赖** - 不依赖 Canvas API，兼容性更好

## 📦 安装

```bash
npm install boluo-image
```

或使用 yarn:

```bash
yarn add boluo-image
```

## 🚀 快速开始

### 基础用法

```typescript
import BoLuo from 'boluo-image';

// 压缩单个 Blob/File
const compressedBuffer = await BoLuo.compress(fileBlob);
console.log('压缩完成，返回 Buffer');

// 压缩多个 Blob/File
const compressedBuffers = await BoLuo.compressMultiple([blob1, blob2, blob3]);
console.log('批量压缩完成');
```

### 使用构建器模式

```typescript
import { BoLuo } from 'boluo-image';

// 从 File 对象压缩
const result = await BoLuo.create()
  .load(fileInput.files[0])       // 加载 File 对象
  .quality(80)                    // 设置压缩质量 (0-100)
  .ignoreBy(100)                  // 小于100KB的文件不压缩
  .setFocusAlpha(true)           // 保留透明通道
  .compress();

console.log('压缩结果:', result);

// 从 Blob 压缩
const buffer = await BoLuo.create()
  .load(imageBlob)
  .quality(75)
  .compressToBuffer();           // 返回 Buffer

// 转换为新的 Blob
const compressedBlob = new Blob([buffer], { type: 'image/jpeg' });
```

### Web 应用中的使用

```typescript
import { BoLuo } from 'boluo-image';

// 处理文件上传
const handleFileUpload = async (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (!file) return;

  try {
    const result = await BoLuo.create()
      .load(file)
      .quality(80)
      .compress();

    console.log(`原始大小: ${result.originalSize} bytes`);
    console.log(`压缩后大小: ${result.compressedSize} bytes`);
    console.log(`压缩比: ${result.compressionRatio.toFixed(2)}%`);

    // 创建压缩后的 Blob
    const compressedBuffer = await BoLuo.create()
      .load(file)
      .quality(80)
      .compressToBuffer();
    
    const compressedBlob = new Blob([compressedBuffer], { type: 'image/jpeg' });
    
    // 可以用于上传或显示
    const formData = new FormData();
    formData.append('image', compressedBlob, 'compressed.jpg');
    
  } catch (error) {
    console.error('压缩失败:', error);
  }
};

// 在 HTML 中
// <input type="file" accept="image/*" onChange={handleFileUpload} />
```

### 批量处理多个文件

```typescript
import { BoLuo } from 'boluo-image';

const handleMultipleFiles = async (files: FileList) => {
  const fileArray = Array.from(files);
  
  // 方法1：使用静态方法批量压缩
  const compressedBuffers = await BoLuo.compressMultiple(fileArray, {
    quality: 75,
    ignoreBy: 50
  });

  // 方法2：使用构建器逐个处理
  const results = [];
  for (const file of fileArray) {
    const result = await BoLuo.create()
      .load(file)
      .quality(75)
      .compress();
    results.push(result);
  }

  console.log('所有文件压缩完成:', results);
};
```

### React 组件示例

```tsx
import React, { useState } from 'react';
import { BoLuo } from 'boluo-image';

const ImageCompressor: React.FC = () => {
  const [compressing, setCompressing] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleCompress = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setCompressing(true);
    try {
      const compressionResult = await BoLuo.create()
        .load(file)
        .quality(80)
        .compress();

      setResult(compressionResult);
    } catch (error) {
      console.error('压缩失败:', error);
    } finally {
      setCompressing(false);
    }
  };

  return (
    <div>
      <input 
        type="file" 
        accept="image/*" 
        onChange={handleCompress}
        disabled={compressing}
      />
      
      {compressing && <p>压缩中...</p>}
      
      {result && (
        <div>
          <p>原始大小: {(result.originalSize / 1024).toFixed(2)} KB</p>
          <p>压缩后大小: {(result.compressedSize / 1024).toFixed(2)} KB</p>
          <p>压缩比: {result.compressionRatio.toFixed(2)}%</p>
          <p>尺寸: {result.width} × {result.height}</p>
        </div>
      )}
    </div>
  );
};

export default ImageCompressor;
```

## 📖 API 文档

### BoLuo 类

#### 静态方法

- `BoLuo.create()`: 创建 BoLuoBuilder 实例
- `BoLuo.compress(blob, options?)`: 压缩单个 Blob/File，返回 Buffer
- `BoLuo.compressMultiple(blobs, options?)`: 压缩多个 Blob/File，返回 Buffer 数组

### BoLuoBuilder 类

#### 配置方法

| 方法 | 参数 | 描述 |
|------|------|------|
| `load(input)` | `Blob \| File` | 加载 Blob 或 File 对象 |
| `quality(quality)` | `number (0-100)` | 设置压缩质量，默认 60 |
| `ignoreBy(size)` | `number` | 设置最小压缩阈值 (KB)，默认 100 |
| `setFocusAlpha(focusAlpha)` | `boolean` | 是否保留透明通道，默认 false |

#### 执行方法

- `compress()`: 压缩并返回详细结果信息
- `compressToBuffer()`: 压缩并返回 Buffer

### 类型定义

```typescript
interface CompressionOptions {
  quality?: number;           // 压缩质量 (0-100)
  ignoreBy?: number;         // 最小压缩阈值 (KB)
  focusAlpha?: boolean;      // 是否保留透明通道
}

interface CompressionResult {
  originalSize: number;      // 原始文件大小 (bytes)
  compressedSize: number;    // 压缩后文件大小 (bytes)
  compressionRatio: number;  // 压缩比例 (0-100)
  width: number;             // 图片宽度
  height: number;            // 图片高度
  format: string;            // 图片格式
}

interface ImageInfo {
  width: number;             // 图片宽度
  height: number;            // 图片高度
  format: string;            // 图片格式
  size: number;              // 文件大小
  orientation?: number;      // 旋转信息
}
```

## 🔧 配置选项

| 选项 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| `quality` | number | 60 | 压缩质量，范围 0-100，数值越高质量越好 |
| `ignoreBy` | number | 100 | 最小压缩阈值(KB)，小于此值的文件不进行压缩 |
| `focusAlpha` | boolean | false | 是否保留 PNG 图片的透明通道 |

## 🎯 使用场景

- **Web 前端应用** - 用户上传图片前进行压缩，减少上传时间和服务器存储
- **移动端 Web 应用** - 在移动设备上压缩图片，节省流量
- **图片编辑器** - 提供图片压缩功能
- **社交应用** - 类似微信朋友圈的图片压缩体验
- **电商平台** - 商品图片上传前压缩
- **内容管理系统** - 文章配图自动压缩

## 🌐 浏览器兼容性

- Chrome 50+
- Firefox 45+
- Safari 10+
- Edge 79+
- 移动端浏览器支持

## 🚫 不依赖的技术

- ❌ Canvas API
- ❌ Node.js 文件系统
- ❌ 服务器端处理
- ❌ WebAssembly

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

1. Fork 本仓库
2. 创建你的特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交你的修改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开一个 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 🙏 致谢

- 感谢 [Curzibn/Luban](https://github.com/Curzibn/Luban) 提供的原始 Android 压缩算法
- 感谢 [Sharp](https://sharp.pixelplumbing.com/) 提供的强大图片处理能力
- 感谢微信团队的优秀压缩算法设计

## 🔗 相关链接

- [原版 Android Luban](https://github.com/Curzibn/Luban) - 原始的 Android 图片压缩库
- [Sharp 文档](https://sharp.pixelplumbing.com/) - 底层图片处理引擎

---

如果这个项目对你有帮助，请给它一个 ⭐️！

---

## English Version

> Pure frontend image compression library based on WeChat Moments compression algorithm, Canvas-free, supports direct Blob compression

BoLuo is a pure frontend TypeScript implementation of the [Android Luban](https://github.com/Curzibn/Luban) compression algorithm. The Luban algorithm was reverse-engineered by analyzing WeChat Moments' image compression strategy, enabling significant file size reduction while maintaining visual quality.

## 🎯 About Luban Algorithm

The Luban algorithm was reverse-engineered by sending nearly 100 images of different resolutions through WeChat Moments and comparing the original images with WeChat's compressed versions. Although it's reverse-engineered, the results are very close to WeChat Moments' compression effects.

## ✨ Features

- 🚀 **WeChat-level compression algorithm** - Based on reverse analysis of WeChat Moments compression strategy
- 🌐 **Pure frontend implementation** - No server required, runs directly in browsers
- 📦 **Native TypeScript support** - Complete type definitions for excellent development experience
- 🎯 **Smart compression strategy** - Automatically calculates optimal compression parameters
- 📁 **Direct Blob processing** - Supports File/Blob objects directly, no file system needed
- 🎨 **Transparency preservation** - Optional preservation of PNG transparency channels
- 📊 **Detailed compression statistics** - Provides detailed comparison data
- 🚫 **Canvas-free** - No Canvas API dependency, better compatibility

## 📦 Installation

```bash
npm install boluo-image
```

## 🚀 Quick Start

### Basic Usage

```typescript
import BoLuo from 'boluo-image';

// Compress a single Blob/File
const compressedBuffer = await BoLuo.compress(fileBlob);
console.log('Compression completed, Buffer returned');

// Compress multiple Blob/File objects
const compressedBuffers = await BoLuo.compressMultiple([blob1, blob2, blob3]);
console.log('Batch compression completed');
```

### Using Builder Pattern

```typescript
import { BoLuo } from 'boluo-image';

// Compress from File object
const result = await BoLuo.create()
  .load(fileInput.files[0])       // Load File object
  .quality(80)                    // Set compression quality (0-100)
  .ignoreBy(100)                  // Don't compress files smaller than 100KB
  .setFocusAlpha(true)           // Preserve transparency channel
  .compress();

console.log('Compression result:', result);

// Compress from Blob
const buffer = await BoLuo.create()
  .load(imageBlob)
  .quality(75)
  .compressToBuffer();           // Return Buffer

// Convert to new Blob
const compressedBlob = new Blob([buffer], { type: 'image/jpeg' });
```

### Usage in Web Applications

```typescript
import { BoLuo } from 'boluo-image';

// Handle file upload
const handleFileUpload = async (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (!file) return;

  try {
    const result = await BoLuo.create()
      .load(file)
      .quality(80)
      .compress();

    console.log(`Original size: ${result.originalSize} bytes`);
    console.log(`Compressed size: ${result.compressedSize} bytes`);
    console.log(`Compression ratio: ${result.compressionRatio.toFixed(2)}%`);

    // Create compressed Blob
    const compressedBuffer = await BoLuo.create()
      .load(file)
      .quality(80)
      .compressToBuffer();
    
    const compressedBlob = new Blob([compressedBuffer], { type: 'image/jpeg' });
    
    // Can be used for upload or display
    const formData = new FormData();
    formData.append('image', compressedBlob, 'compressed.jpg');
    
  } catch (error) {
    console.error('Compression failed:', error);
  }
};
```

## 📖 API Documentation

### BoLuo Class

#### Static Methods

- `BoLuo.create()`: Create BoLuoBuilder instance
- `BoLuo.compress(blob, options?)`: Compress single Blob/File, returns Buffer
- `BoLuo.compressMultiple(blobs, options?)`: Compress multiple Blob/File objects, returns Buffer array

### BoLuoBuilder Class

#### Configuration Methods

| Method | Parameters | Description |
|--------|------------|-------------|
| `load(input)` | `Blob \| File` | Load Blob or File object |
| `quality(quality)` | `number (0-100)` | Set compression quality, default 60 |
| `ignoreBy(size)` | `number` | Set minimum compression threshold (KB), default 100 |
| `setFocusAlpha(focusAlpha)` | `boolean` | Whether to preserve transparency channel, default false |

#### Execution Methods

- `compress()`: Compress and return detailed result information
- `compressToBuffer()`: Compress and return Buffer

## 🌐 Browser Compatibility

- Chrome 50+
- Firefox 45+
- Safari 10+
- Edge 79+
- Mobile browsers supported

## 🚫 No Dependencies On

- ❌ Canvas API
- ❌ Node.js file system
- ❌ Server-side processing
- ❌ WebAssembly

## 🤝 Contributing

Issues and Pull Requests are welcome!

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Thanks to [Curzibn/Luban](https://github.com/Curzibn/Luban) for providing the original Android compression algorithm
- Thanks to [Sharp](https://sharp.pixelplumbing.com/) for providing powerful image processing capabilities
- Thanks to the WeChat team for their excellent compression algorithm design

---

If this project helps you, please give it a ⭐️!