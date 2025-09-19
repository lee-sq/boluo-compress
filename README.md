# BoLuo (菠萝) 📸

[![npm version](https://badge.fury.io/js/boluo.svg)](https://badge.fury.io/js/boluo)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)

> TypeScript 版本的 Luban 图片压缩库，基于微信朋友圈压缩算法

BoLuo 是 [Android Luban](https://github.com/Curzibn/Luban) 压缩算法的 TypeScript 实现版本，专为 Node.js 环境设计。Luban 算法通过逆向分析微信朋友圈的图片压缩策略而来，能够在保持视觉质量的同时显著减小图片文件大小。<mcreference link="https://github.com/Curzibn/Luban" index="0">0</mcreference>

## 🎯 关于 Luban 算法

Luban（鲁班）算法是通过在微信朋友圈发送近100张不同分辨率图片，对比原图与微信压缩后的图片逆向推算出来的压缩算法。<mcreference link="https://github.com/Curzibn/Luban" index="0">0</mcreference> 虽然是逆向推算，但效果已经非常接近微信朋友圈压缩后的效果。

### 压缩效果对比

| 内容 | 原图 | Luban 压缩 | 微信压缩 |
|------|------|------------|----------|
| 截屏 720P | 720×1280, 390KB | 720×1280, 87KB | 720×1280, 56KB |
| 截屏 1080P | 1080×1920, 2.21MB | 1080×1920, 104KB | 1080×1920, 112KB |
| 拍照 13M(4:3) | 3096×4128, 3.12MB | 1548×2064, 141KB | 1548×2064, 147KB |
| 拍照 9.6M(16:9) | 4128×2322, 4.64MB | 1032×581, 97KB | 1032×581, 74KB |

*数据来源：Android Luban 项目测试结果*<mcreference link="https://github.com/Curzibn/Luban" index="0">0</mcreference>

## ✨ 特性

- 🚀 **微信级压缩算法** - 基于逆向分析微信朋友圈压缩策略
- 📦 **TypeScript 原生支持** - 完整的类型定义，优秀的开发体验
- 🔧 **高性能处理** - 基于 Sharp 引擎，提供快速的图片处理能力
- 🎯 **智能压缩策略** - 自动计算最佳压缩参数，平衡文件大小与图片质量
- 📁 **批量处理支持** - 支持单文件和批量文件压缩
- 🎨 **透明通道保持** - 可选择保留 PNG 图片的透明通道
- 📊 **详细压缩统计** - 提供压缩前后的详细对比数据
- 🔍 **灵活过滤机制** - 支持自定义文件过滤和重命名规则

## 📦 安装

```bash
npm install boluo
```

或使用 yarn:

```bash
yarn add boluo
```

## 🚀 快速开始

### 基础用法

```typescript
import BoLuo from 'boluo';

// 压缩单个文件
const result = await BoLuo.compressFile('./input/image.jpg');
console.log(`压缩完成: ${result.originalSize} -> ${result.compressedSize} bytes`);
console.log(`压缩比: ${result.compressionRatio.toFixed(2)}%`);

// 压缩多个文件
const results = await BoLuo.compressFiles([
  './input/image1.jpg',
  './input/image2.png'
]);
```

### 使用构建器模式

```typescript
import { BoLuo } from 'boluo';

const result = await BoLuo.create()
  .load('./input/image.jpg')
  .quality(80)                    // 设置压缩质量 (0-100)
  .ignoreBy(100)                  // 小于100KB的文件不压缩
  .setTargetDir('./output')       // 设置输出目录
  .setFocusAlpha(true)           // 保留透明通道
  .get();

console.log('压缩结果:', result);
```

### 批量压缩与监听

```typescript
import { BoLuo } from 'boluo';

await BoLuo.create()
  .load(['./images/*.jpg', './images/*.png'])
  .quality(75)
  .setTargetDir('./compressed')
  .filter(filePath => !filePath.includes('thumbnail')) // 过滤文件
  .setCompressListener({
    onStart: () => console.log('开始压缩...'),
    onSuccess: (outputPath) => console.log(`压缩成功: ${outputPath}`),
    onError: (error) => console.error('压缩失败:', error)
  })
  .launch();
```

### 高级用法 - 自定义重命名

```typescript
import { BoLuo } from 'boluo';

const result = await BoLuo.create()
  .load('./input/photo.jpg')
  .setTargetDir('./output')
  .setRenameListener((originalPath) => {
    const timestamp = Date.now();
    return `compressed_${timestamp}_${path.basename(originalPath)}`;
  })
  .get();
```

## 📖 API 文档

### BoLuo 类

#### 静态方法

- `BoLuo.create()`: 创建 BoLuoBuilder 实例
- `BoLuo.compressFile(filePath, options?)`: 压缩单个文件
- `BoLuo.compressFiles(filePaths, options?)`: 压缩多个文件

### BoLuoBuilder 类

#### 配置方法

| 方法 | 参数 | 描述 |
|------|------|------|
| `load(input)` | `string \| string[] \| Buffer` | 加载文件路径、路径数组或 Buffer |
| `quality(quality)` | `number (0-100)` | 设置压缩质量，默认 60 |
| `ignoreBy(size)` | `number` | 设置最小压缩阈值 (KB)，默认 100 |
| `setFocusAlpha(focusAlpha)` | `boolean` | 是否保留透明通道，默认 false |
| `setTargetDir(targetDir)` | `string` | 设置输出目录，默认 './compressed' |
| `filter(filterFn)` | `(filePath: string) => boolean` | 设置文件过滤器 |
| `setRenameListener(renameFn)` | `(filePath: string) => string` | 设置重命名回调 |
| `setCompressListener(listener)` | `CompressionListener` | 设置压缩监听器 |

#### 执行方法

- `get()`: 压缩并返回单个结果
- `getAll()`: 压缩并返回所有结果
- `launch()`: 执行压缩（无返回值）

### 类型定义

```typescript
interface CompressionOptions {
  quality?: number;           // 压缩质量 (0-100)
  ignoreBy?: number;         // 最小压缩阈值 (KB)
  focusAlpha?: boolean;      // 是否保留透明通道
  targetDir?: string;        // 输出目录
  renameListener?: (filePath: string) => string;
  filter?: (filePath: string) => boolean;
}

interface CompressionResult {
  originalPath: string;      // 原始文件路径
  outputPath: string;        // 输出文件路径
  originalSize: number;      // 原始文件大小 (bytes)
  compressedSize: number;    // 压缩后文件大小 (bytes)
  compressionRatio: number;  // 压缩比例 (0-100)
  width: number;             // 图片宽度
  height: number;            // 图片高度
}

interface CompressionListener {
  onStart?: () => void;                    // 压缩开始
  onSuccess?: (outputPath: string) => void; // 压缩成功
  onError?: (error: Error) => void;        // 压缩失败
}
```

## 🔧 配置选项

| 选项 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| `quality` | number | 60 | 压缩质量，范围 0-100，数值越高质量越好 |
| `ignoreBy` | number | 100 | 最小压缩阈值(KB)，小于此值的文件不进行压缩 |
| `focusAlpha` | boolean | false | 是否保留 PNG 图片的透明通道 |
| `targetDir` | string | './compressed' | 压缩后图片的输出目录路径 |
| `filter` | function | 排除 GIF | 文件过滤器函数，返回 true 的文件会被压缩 |

## 🎯 使用场景

- **Web 后端服务** - 处理用户上传的图片，减少存储空间和传输时间
- **内容管理系统** - 自动压缩上传的图片资源
- **图片处理服务** - 提供图片压缩 API 服务
- **批量图片处理** - 对大量历史图片进行批量压缩
- **构建工具集成** - 在项目构建过程中自动优化图片资源
- **移动端后台** - 为移动应用提供适合的图片压缩服务

## 🏗️ 架构说明

### 与前端的配合使用

```javascript
// 前端上传 (React/Vue/Angular 等)
const uploadImage = async (file) => {
  const formData = new FormData();
  formData.append('image', file);
  
  const response = await fetch('/api/upload-and-compress', {
    method: 'POST',
    body: formData
  });
  
  return response.json();
};

// 后端处理 (Node.js + Express)
app.post('/api/upload-and-compress', upload.single('image'), async (req, res) => {
  try {
    const result = await BoLuo.compressFile(req.file.path, {
      quality: 75,
      targetDir: './public/compressed'
    });
    
    res.json({
      success: true,
      original: {
        size: result.originalSize,
        path: req.file.path
      },
      compressed: {
        size: result.compressedSize,
        path: result.outputPath,
        ratio: result.compressionRatio
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

## 🔄 与原版 Android Luban 的对应关系

| Android Luban | BoLuo (TypeScript) | 说明 |
|---------------|-------------------|------|
| `load()` | `load()` | 加载图片文件 |
| `ignoreBy()` | `ignoreBy()` | 设置压缩阈值 |
| `setFocusAlpha()` | `setFocusAlpha()` | 保留透明通道 |
| `setTargetDir()` | `setTargetDir()` | 设置输出目录 |
| `filter()` | `filter()` | 文件过滤器 |
| `setCompressListener()` | `setCompressListener()` | 压缩监听器 |
| `setRenameListener()` | `setRenameListener()` | 重命名监听器 |
| `launch()` | `launch()` | 异步执行压缩 |
| `get()` | `get()` / `getAll()` | 同步获取结果 |

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

- 感谢 [Curzibn/Luban](https://github.com/Curzibn/Luban) 提供的原始 Android 压缩算法<mcreference link="https://github.com/Curzibn/Luban" index="0">0</mcreference>
- 感谢 [Sharp](https://sharp.pixelplumbing.com/) 提供的强大图片处理能力
- 感谢微信团队的优秀压缩算法设计

## 🔗 相关链接

- [原版 Android Luban](https://github.com/Curzibn/Luban) - 原始的 Android 图片压缩库
- [Sharp 文档](https://sharp.pixelplumbing.com/) - 底层图片处理引擎
- [微信朋友圈图片压缩算法分析](https://github.com/Curzibn/Luban#项目描述) - 算法原理说明

---

如果这个项目对你有帮助，请给它一个 ⭐️！