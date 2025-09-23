# BoLuo Image - 纯前端图片压缩库

一个纯前端的图片压缩库，专为浏览器环境设计，无需任何Node.js依赖。

## 特性

- 🌐 **纯前端实现** - 完全在浏览器中运行，无需服务器端处理
- 🎨 **Canvas技术** - 基于HTML5 Canvas API进行图片处理
- 📱 **移动端友好** - 支持移动设备的图片压缩需求
- 🔧 **TypeScript支持** - 完整的类型定义
- 📦 **零依赖** - 不依赖任何外部库
- 🚀 **轻量级** - 体积小，加载快
- ⚡ **简化API** - 提供静态方法，无需创建实例

## 安装

```bash
npm install boluo-image
```

## 快速开始

### 最简单的用法（推荐）

```javascript
import { BoLuoBrowser } from 'boluo-image';

// 直接压缩文件，无需创建实例
const file = document.getElementById('fileInput').files[0];
const compressedBlob = await BoLuoBrowser.compress(file, 0.8);

// 下载压缩后的图片
const url = URL.createObjectURL(compressedBlob);
const a = document.createElement('a');
a.href = url;
a.download = 'compressed-image.jpg';
a.click();
```

### 从Blob URL压缩

```javascript
import { BoLuoBrowser } from 'boluo-image';

// 如果你有blob://路径
const blobUrl = 'blob:http://localhost:3000/xxx-xxx-xxx';
const compressor = await BoLuoBrowser.fromBlobUrl(blobUrl);
const compressedBlob = await compressor.compressToBlob({ quality: 0.6 });
```

## API 文档

### 静态方法（推荐使用）

#### `BoLuoBrowser.compress(file, quality?)`

最简单的压缩方法，直接返回压缩后的Blob。

```typescript
static async compress(file: File | Blob, quality: number = 0.8): Promise<Blob>
```

**参数：**
- `file`: 要压缩的文件或Blob
- `quality`: 压缩质量 (0-1)，默认 0.8

**示例：**
```javascript
const compressedBlob = await BoLuoBrowser.compress(file, 0.6);
```

#### `BoLuoBrowser.compressToBuffer(file, quality?)`

压缩并返回Buffer格式。

```typescript
static async compressToBuffer(file: File | Blob, quality: number = 0.8): Promise<Buffer>
```

#### `BoLuoBrowser.compressMultiple(files, quality?)`

批量压缩多个文件。

```typescript
static async compressMultiple(files: (File | Blob)[], quality: number = 0.8): Promise<Blob[]>
```

**示例：**
```javascript
const files = Array.from(document.getElementById('fileInput').files);
const compressedBlobs = await BoLuoBrowser.compressMultiple(files, 0.7);
```

### 实例方法（高级用法）

当你需要更精细的控制时，可以创建实例：

```javascript
import { BoLuoBrowser } from 'boluo-image';

// 从文件创建实例
const compressor = await BoLuoBrowser.fromFile(file);

// 从Blob创建实例
const compressor = await BoLuoBrowser.fromBlob(blob);

// 从Blob URL创建实例
const compressor = await BoLuoBrowser.fromBlobUrl(blobUrl);

// 高级压缩配置
const compressedBlob = await compressor.compressToBlob({
  quality: 0.8,        // 压缩质量 (0-1)
  maxWidth: 1920,      // 最大宽度
  maxHeight: 1080,     // 最大高度
  ignoreBy: 10,        // 忽略小于指定KB的文件
  focusAlpha: false    // 是否关注透明度
});
```

### 配置选项

```typescript
interface CompressionOptions {
  quality?: number;      // 压缩质量 (0-1)，默认 0.8
  maxWidth?: number;     // 最大宽度
  maxHeight?: number;    // 最大高度
  ignoreBy?: number;     // 忽略小于指定KB的文件，默认 10
  focusAlpha?: boolean;  // 是否关注透明度，默认 false
}
```

### 质量参数说明

质量参数范围为 0-1：
- **0.1-0.3**: 高压缩率，文件最小，适合缩略图
- **0.4-0.6**: 平衡压缩，适合一般用途
- **0.7-0.9**: 高质量，文件较大，适合重要图片
- **1.0**: 最高质量，压缩率最低

## 实际使用示例

### 文件上传压缩

```javascript
document.getElementById('fileInput').addEventListener('change', async (e) => {
  const file = e.target.files[0];
  if (!file) return;
  
  console.log('原文件大小:', (file.size / 1024 / 1024).toFixed(2) + 'MB');
  
  // 压缩图片
  const compressedBlob = await BoLuoBrowser.compress(file, 0.8);
  
  console.log('压缩后大小:', (compressedBlob.size / 1024 / 1024).toFixed(2) + 'MB');
  
  // 预览压缩后的图片
  const previewUrl = URL.createObjectURL(compressedBlob);
  document.getElementById('preview').src = previewUrl;
});
```

### 批量处理

```javascript
async function compressImages(files) {
  const results = [];
  
  for (const file of files) {
    try {
      const compressed = await BoLuoBrowser.compress(file, 0.7);
      results.push({
        original: file,
        compressed: compressed,
        ratio: ((1 - compressed.size / file.size) * 100).toFixed(1) + '%'
      });
    } catch (error) {
      console.error('压缩失败:', file.name, error);
    }
  }
  
  return results;
}
```

### 动态质量调整

```javascript
async function smartCompress(file, targetSizeKB = 200) {
  let quality = 0.8;
  let compressed;
  
  do {
    compressed = await BoLuoBrowser.compress(file, quality);
    if (compressed.size / 1024 <= targetSizeKB) break;
    quality -= 0.1;
  } while (quality > 0.1);
  
  return compressed;
}
```

## 浏览器兼容性

- Chrome 51+
- Firefox 50+
- Safari 10+
- Edge 79+

## 示例

查看 `demo-browser.html` 文件获取完整的使用示例。

## 更新日志

### v2.3.0
- ✨ 新增静态方法API，使用更简单
- 🔧 质量参数标准化为0-1范围
- 📦 新增批量压缩功能
- 🎯 改进压缩算法和默认参数

## 许可证

MIT License

## 贡献

欢迎提交 Issue 和 Pull Request！

## 支持

如果这个项目对你有帮助，请给个 ⭐️ Star！