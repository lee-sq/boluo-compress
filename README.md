# BoLuo Image - 纯前端图片压缩库

一个纯前端的图片压缩库，专为浏览器环境设计，无需任何Node.js依赖。

## 特性

- 🌐 **纯前端实现** - 完全在浏览器中运行，无需服务器端处理
- 🎨 **Canvas技术** - 基于HTML5 Canvas API进行图片处理
- 📱 **移动端友好** - 支持移动设备的图片压缩需求
- 🔧 **TypeScript支持** - 完整的类型定义
- 📦 **零依赖** - 不依赖任何外部库
- 🚀 **轻量级** - 体积小，加载快

## 安装

```bash
npm install boluo-image
```

## 使用方法

### 基本用法

```javascript
import BoLuo from 'boluo-image';

// 创建压缩器实例
const compressor = new BoLuo();

// 压缩图片文件
const file = document.getElementById('fileInput').files[0];
const compressedBlob = await compressor.compress(file);

// 下载压缩后的图片
const url = URL.createObjectURL(compressedBlob);
const a = document.createElement('a');
a.href = url;
a.download = 'compressed-image.jpg';
a.click();
```

### 高级配置

```javascript
import { BoLuoBrowser } from 'boluo-image';

const compressor = new BoLuoBrowser({
  quality: 0.8,        // 压缩质量 (0-1)
  maxWidth: 1920,      // 最大宽度
  maxHeight: 1080,     // 最大高度
  format: 'jpeg'       // 输出格式
});

const compressedBlob = await compressor.compress(file);
```

## API 文档

### BoLuoBrowser 类

主要的图片压缩类。

#### 构造函数

```typescript
new BoLuoBrowser(options?: CompressionOptions)
```

#### 方法

- `compress(file: File | Blob): Promise<Blob>` - 压缩图片文件
- `compressFromUrl(url: string): Promise<Blob>` - 从URL压缩图片

#### 配置选项

```typescript
interface CompressionOptions {
  quality?: number;      // 压缩质量 (0-1)，默认 0.8
  maxWidth?: number;     // 最大宽度，默认 1920
  maxHeight?: number;    // 最大高度，默认 1080
  format?: string;       // 输出格式，默认 'jpeg'
}
```

## 浏览器兼容性

- Chrome 51+
- Firefox 50+
- Safari 10+
- Edge 79+

## 示例

查看 `demo-browser.html` 文件获取完整的使用示例。

## 许可证

MIT License

## 贡献

欢迎提交 Issue 和 Pull Request！