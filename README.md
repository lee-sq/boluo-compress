# BoLuo (菠萝) 📸

[![npm version](https://badge.fury.io/js/boluo.svg)](https://badge.fury.io/js/boluo)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)

## 🌍 Languages / 语言

- [🇨🇳 中文](#中文版本)
- [🇺🇸 English](#english-version)
- [🇯🇵 日本語](#日本語版)
- [🇰🇷 한국어](#한국어-버전)

---

## 中文版本

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
import { BoLuo } from 'boluo-image';

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
import { BoLuo } from 'boluo-image';

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
import { BoLuo } from 'boluo-image';

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

---

## English Version

> TypeScript implementation of Luban image compression library, based on WeChat Moments compression algorithm

BoLuo is a TypeScript implementation of the [Android Luban](https://github.com/Curzibn/Luban) compression algorithm, designed specifically for Node.js environments. The Luban algorithm was reverse-engineered by analyzing WeChat Moments' image compression strategy, enabling significant file size reduction while maintaining visual quality.

## 🎯 About Luban Algorithm

The Luban algorithm was reverse-engineered by sending nearly 100 images of different resolutions through WeChat Moments and comparing the original images with WeChat's compressed versions. Although it's reverse-engineered, the results are very close to WeChat Moments' compression effects.

### Compression Performance Comparison

| Content | Original | Luban Compressed | WeChat Compressed |
|---------|----------|------------------|-------------------|
| Screenshot 720P | 720×1280, 390KB | 720×1280, 87KB | 720×1280, 56KB |
| Screenshot 1080P | 1080×1920, 2.21MB | 1080×1920, 104KB | 1080×1920, 112KB |
| Photo 13M(4:3) | 3096×4128, 3.12MB | 1548×2064, 141KB | 1548×2064, 147KB |
| Photo 9.6M(16:9) | 4128×2322, 4.64MB | 1032×581, 97KB | 1032×581, 74KB |

*Data source: Android Luban project test results*

## ✨ Features

- 🚀 **WeChat-level compression algorithm** - Based on reverse analysis of WeChat Moments compression strategy
- 📦 **Native TypeScript support** - Complete type definitions for excellent development experience
- 🔧 **High-performance processing** - Based on Sharp engine for fast image processing
- 🎯 **Smart compression strategy** - Automatically calculates optimal compression parameters, balancing file size and image quality
- 📁 **Batch processing support** - Supports single file and batch file compression
- 🎨 **Transparency preservation** - Optional preservation of PNG transparency channels
- 📊 **Detailed compression statistics** - Provides detailed comparison data before and after compression
- 🔍 **Flexible filtering mechanism** - Supports custom file filtering and renaming rules

## 📦 Installation

```bash
npm install boluo-image
```

Or using yarn:

```bash
yarn add boluo-image
```

## 🚀 Quick Start

### Basic Usage

```typescript
import BoLuo from 'boluo-image';

// Compress a single file
const result = await BoLuo.compressFile('./input/image.jpg');
console.log(`Compression completed: ${result.originalSize} -> ${result.compressedSize} bytes`);
console.log(`Compression ratio: ${result.compressionRatio.toFixed(2)}%`);

// Compress multiple files
const results = await BoLuo.compressFiles([
  './input/image1.jpg',
  './input/image2.png'
]);
```

### Using Builder Pattern

```typescript
import { BoLuo } from 'boluo-image';

const result = await BoLuo.create()
  .load('./input/image.jpg')
  .quality(80)                    // Set compression quality (0-100)
  .ignoreBy(100)                  // Don't compress files smaller than 100KB
  .setTargetDir('./output')       // Set output directory
  .setFocusAlpha(true)           // Preserve transparency channel
  .get();

console.log('Compression result:', result);
```

### Batch Compression with Listeners

```typescript
import { BoLuo } from 'boluo-image';

await BoLuo.create()
  .load(['./images/*.jpg', './images/*.png'])
  .quality(75)
  .setTargetDir('./compressed')
  .filter(filePath => !filePath.includes('thumbnail')) // Filter files
  .setCompressListener({
    onStart: () => console.log('Starting compression...'),
    onSuccess: (outputPath) => console.log(`Compression successful: ${outputPath}`),
    onError: (error) => console.error('Compression failed:', error)
  })
  .launch();
```

## 📖 API Documentation

### BoLuo Class

#### Static Methods

- `BoLuo.create()`: Create BoLuoBuilder instance
- `BoLuo.compressFile(filePath, options?)`: Compress single file
- `BoLuo.compressFiles(filePaths, options?)`: Compress multiple files

### BoLuoBuilder Class

#### Configuration Methods

| Method | Parameters | Description |
|--------|------------|-------------|
| `load(input)` | `string \| string[] \| Buffer` | Load file path, path array, or Buffer |
| `quality(quality)` | `number (0-100)` | Set compression quality, default 60 |
| `ignoreBy(size)` | `number` | Set minimum compression threshold (KB), default 100 |
| `setFocusAlpha(focusAlpha)` | `boolean` | Whether to preserve transparency channel, default false |
| `setTargetDir(targetDir)` | `string` | Set output directory, default './compressed' |
| `filter(filterFn)` | `(filePath: string) => boolean` | Set file filter |
| `setRenameListener(renameFn)` | `(filePath: string) => string` | Set rename callback |
| `setCompressListener(listener)` | `CompressionListener` | Set compression listener |

#### Execution Methods

- `get()`: Compress and return single result
- `getAll()`: Compress and return all results
- `launch()`: Execute compression (no return value)

### Type Definitions

```typescript
interface CompressionOptions {
  quality?: number;           // Compression quality (0-100)
  ignoreBy?: number;         // Minimum compression threshold (KB)
  focusAlpha?: boolean;      // Whether to preserve transparency channel
  targetDir?: string;        // Output directory
  renameListener?: (filePath: string) => string;
  filter?: (filePath: string) => boolean;
}

interface CompressionResult {
  originalPath: string;      // Original file path
  outputPath: string;        // Output file path
  originalSize: number;      // Original file size (bytes)
  compressedSize: number;    // Compressed file size (bytes)
  compressionRatio: number;  // Compression ratio (0-100)
  width: number;             // Image width
  height: number;            // Image height
}

interface CompressionListener {
  onStart?: () => void;                    // Compression start
  onSuccess?: (outputPath: string) => void; // Compression success
  onError?: (error: Error) => void;        // Compression failure
}
```

## 🔧 Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `quality` | number | 60 | Compression quality, range 0-100, higher values mean better quality |
| `ignoreBy` | number | 100 | Minimum compression threshold (KB), files smaller than this won't be compressed |
| `focusAlpha` | boolean | false | Whether to preserve PNG transparency channels |
| `targetDir` | string | './compressed' | Output directory path for compressed images |
| `filter` | function | Exclude GIF | File filter function, files returning true will be compressed |

## 🎯 Use Cases

- **Web Backend Services** - Process user-uploaded images, reduce storage space and transfer time
- **Content Management Systems** - Automatically compress uploaded image resources
- **Image Processing Services** - Provide image compression API services
- **Batch Image Processing** - Batch compress large amounts of historical images
- **Build Tool Integration** - Automatically optimize image resources during project builds
- **Mobile Backend** - Provide suitable image compression services for mobile applications

## 🤝 Contributing

Issues and Pull Requests are welcome!

1. Fork this repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Thanks to [Curzibn/Luban](https://github.com/Curzibn/Luban) for providing the original Android compression algorithm
- Thanks to [Sharp](https://sharp.pixelplumbing.com/) for providing powerful image processing capabilities
- Thanks to the WeChat team for their excellent compression algorithm design

## 🔗 Related Links

- [Original Android Luban](https://github.com/Curzibn/Luban) - The original Android image compression library
- [Sharp Documentation](https://sharp.pixelplumbing.com/) - Underlying image processing engine
- [WeChat Moments Image Compression Algorithm Analysis](https://github.com/Curzibn/Luban#项目描述) - Algorithm principle explanation

---

If this project helps you, please give it a ⭐️!

---

## 日本語版

> WeChat モーメンツ圧縮アルゴリズムに基づく Luban 画像圧縮ライブラリの TypeScript 版

BoLuo は [Android Luban](https://github.com/Curzibn/Luban) 圧縮アルゴリズムの TypeScript 実装版で、Node.js 環境専用に設計されています。Luban アルゴリズムは WeChat モーメンツの画像圧縮戦略をリバースエンジニアリングして開発され、視覚的品質を保ちながら画像ファイルサイズを大幅に削減できます。

## 🎯 Luban アルゴリズムについて

Luban アルゴリズムは、WeChat モーメンツに約100枚の異なる解像度の画像を送信し、元画像と WeChat 圧縮後の画像を比較してリバースエンジニアリングで算出された圧縮アルゴリズムです。リバースエンジニアリングですが、効果は WeChat モーメンツ圧縮後の効果に非常に近いです。

### 圧縮効果比較

| 内容 | 元画像 | Luban 圧縮 | WeChat 圧縮 |
|------|--------|------------|-------------|
| スクリーンショット 720P | 720×1280, 390KB | 720×1280, 87KB | 720×1280, 56KB |
| スクリーンショット 1080P | 1080×1920, 2.21MB | 1080×1920, 104KB | 1080×1920, 112KB |
| 写真 13M(4:3) | 3096×4128, 3.12MB | 1548×2064, 141KB | 1548×2064, 147KB |
| 写真 9.6M(16:9) | 4128×2322, 4.64MB | 1032×581, 97KB | 1032×581, 74KB |

*データソース：Android Luban プロジェクトテスト結果*

## ✨ 特徴

- 🚀 **WeChat レベル圧縮アルゴリズム** - WeChat モーメンツ圧縮戦略のリバースエンジニアリングに基づく
- 📦 **TypeScript ネイティブサポート** - 完全な型定義で優れた開発体験
- 🔧 **高性能処理** - Sharp エンジンベースで高速画像処理
- 🎯 **スマート圧縮戦略** - 最適な圧縮パラメータを自動計算、ファイルサイズと画質のバランス
- 📁 **バッチ処理サポート** - 単一ファイルとバッチファイル圧縮をサポート
- 🎨 **透明チャンネル保持** - PNG 画像の透明チャンネルを選択的に保持
- 📊 **詳細圧縮統計** - 圧縮前後の詳細比較データを提供
- 🔍 **柔軟なフィルタリング機構** - カスタムファイルフィルタリングとリネーミングルールをサポート

## 📦 インストール

```bash
npm install boluo-image
```

または yarn を使用：

```bash
yarn add boluo-image
```

## 🚀 クイックスタート

### 基本的な使用法

```typescript
import BoLuo from 'boluo-image';

// 単一ファイルの圧縮
const result = await BoLuo.compressFile('./input/image.jpg');
console.log(`圧縮完了: ${result.originalSize} -> ${result.compressedSize} bytes`);
console.log(`圧縮率: ${result.compressionRatio.toFixed(2)}%`);

// 複数ファイルの圧縮
const results = await BoLuo.compressFiles([
  './input/image1.jpg',
  './input/image2.png'
]);
```

### ビルダーパターンの使用

```typescript
import { BoLuo } from 'boluo-image';

const result = await BoLuo.create()
  .load('./input/image.jpg')
  .quality(80)                    // 圧縮品質を設定 (0-100)
  .ignoreBy(100)                  // 100KB未満のファイルは圧縮しない
  .setTargetDir('./output')       // 出力ディレクトリを設定
  .setFocusAlpha(true)           // 透明チャンネルを保持
  .get();

console.log('圧縮結果:', result);
```

## 📖 API ドキュメント

### BoLuo クラス

#### 静的メソッド

- `BoLuo.create()`: BoLuoBuilder インスタンスを作成
- `BoLuo.compressFile(filePath, options?)`: 単一ファイルを圧縮
- `BoLuo.compressFiles(filePaths, options?)`: 複数ファイルを圧縮

### 設定オプション

| オプション | 型 | デフォルト | 説明 |
|-----------|---|-----------|------|
| `quality` | number | 60 | 圧縮品質、範囲 0-100、値が高いほど品質が良い |
| `ignoreBy` | number | 100 | 最小圧縮閾値(KB)、この値未満のファイルは圧縮されない |
| `focusAlpha` | boolean | false | PNG 画像の透明チャンネルを保持するかどうか |
| `targetDir` | string | './compressed' | 圧縮後画像の出力ディレクトリパス |

## 🎯 使用ケース

- **Web バックエンドサービス** - ユーザーアップロード画像の処理、ストレージ容量と転送時間の削減
- **コンテンツ管理システム** - アップロード画像リソースの自動圧縮
- **画像処理サービス** - 画像圧縮 API サービスの提供
- **バッチ画像処理** - 大量の履歴画像のバッチ圧縮
- **ビルドツール統合** - プロジェクトビルド過程での画像リソース自動最適化

## 🤝 貢献

Issue と Pull Request を歓迎します！

1. このリポジトリをフォーク
2. 機能ブランチを作成 (`git checkout -b feature/AmazingFeature`)
3. 変更をコミット (`git commit -m 'Add some AmazingFeature'`)
4. ブランチにプッシュ (`git push origin feature/AmazingFeature`)
5. Pull Request を開く

## 📄 ライセンス

このプロジェクトは MIT ライセンスの下でライセンスされています - 詳細は [LICENSE](LICENSE) ファイルをご覧ください。

## 🙏 謝辞

- 元の Android 圧縮アルゴリズムを提供してくれた [Curzibn/Luban](https://github.com/Curzibn/Luban) に感謝
- 強力な画像処理機能を提供してくれた [Sharp](https://sharp.pixelplumbing.com/) に感謝
- 優秀な圧縮アルゴリズム設計をした WeChat チームに感謝

---

このプロジェクトがお役に立てば、⭐️ をお願いします！

---

## 한국어 버전

> WeChat 모멘트 압축 알고리즘 기반 Luban 이미지 압축 라이브러리의 TypeScript 버전

BoLuo는 [Android Luban](https://github.com/Curzibn/Luban) 압축 알고리즘의 TypeScript 구현 버전으로, Node.js 환경을 위해 특별히 설계되었습니다. Luban 알고리즘은 WeChat 모멘트의 이미지 압축 전략을 역공학하여 개발되었으며, 시각적 품질을 유지하면서 이미지 파일 크기를 크게 줄일 수 있습니다.

## 🎯 Luban 알고리즘에 대해

Luban 알고리즘은 WeChat 모멘트에 약 100장의 서로 다른 해상도 이미지를 전송하고, 원본 이미지와 WeChat 압축 후 이미지를 비교하여 역공학으로 산출된 압축 알고리즘입니다. 역공학이지만 효과는 WeChat 모멘트 압축 후 효과와 매우 유사합니다.

### 압축 효과 비교

| 내용 | 원본 이미지 | Luban 압축 | WeChat 압축 |
|------|------------|------------|-------------|
| 스크린샷 720P | 720×1280, 390KB | 720×1280, 87KB | 720×1280, 56KB |
| 스크린샷 1080P | 1080×1920, 2.21MB | 1080×1920, 104KB | 1080×1920, 112KB |
| 사진 13M(4:3) | 3096×4128, 3.12MB | 1548×2064, 141KB | 1548×2064, 147KB |
| 사진 9.6M(16:9) | 4128×2322, 4.64MB | 1032×581, 97KB | 1032×581, 74KB |

*데이터 출처: Android Luban 프로젝트 테스트 결과*

## ✨ 특징

- 🚀 **WeChat 수준 압축 알고리즘** - WeChat 모멘트 압축 전략의 역공학 분석 기반
- 📦 **TypeScript 네이티브 지원** - 완전한 타입 정의로 우수한 개발 경험
- 🔧 **고성능 처리** - Sharp 엔진 기반으로 빠른 이미지 처리
- 🎯 **스마트 압축 전략** - 최적의 압축 매개변수 자동 계산, 파일 크기와 이미지 품질의 균형
- 📁 **배치 처리 지원** - 단일 파일 및 배치 파일 압축 지원
- 🎨 **투명도 채널 유지** - PNG 이미지의 투명도 채널 선택적 유지
- 📊 **상세 압축 통계** - 압축 전후의 상세 비교 데이터 제공
- 🔍 **유연한 필터링 메커니즘** - 사용자 정의 파일 필터링 및 이름 변경 규칙 지원

## 📦 설치

```bash
npm install boluo-image
```

또는 yarn 사용:

```bash
yarn add boluo-image
```

## 🚀 빠른 시작

### 기본 사용법

```typescript
import BoLuo from 'boluo-image';

// 단일 파일 압축
const result = await BoLuo.compressFile('./input/image.jpg');
console.log(`압축 완료: ${result.originalSize} -> ${result.compressedSize} bytes`);
console.log(`압축률: ${result.compressionRatio.toFixed(2)}%`);

// 여러 파일 압축
const results = await BoLuo.compressFiles([
  './input/image1.jpg',
  './input/image2.png'
]);
```

### 빌더 패턴 사용

```typescript
import { BoLuo } from 'boluo-image';

const result = await BoLuo.create()
  .load('./input/image.jpg')
  .quality(80)                    // 압축 품질 설정 (0-100)
  .ignoreBy(100)                  // 100KB 미만 파일은 압축하지 않음
  .setTargetDir('./output')       // 출력 디렉토리 설정
  .setFocusAlpha(true)           // 투명도 채널 유지
  .get();

console.log('압축 결과:', result);
```

## 📖 API 문서

### BoLuo 클래스

#### 정적 메서드

- `BoLuo.create()`: BoLuoBuilder 인스턴스 생성
- `BoLuo.compressFile(filePath, options?)`: 단일 파일 압축
- `BoLuo.compressFiles(filePaths, options?)`: 여러 파일 압축

### 설정 옵션

| 옵션 | 타입 | 기본값 | 설명 |
|------|------|--------|------|
| `quality` | number | 60 | 압축 품질, 범위 0-100, 값이 높을수록 품질이 좋음 |
| `ignoreBy` | number | 100 | 최소 압축 임계값(KB), 이 값 미만의 파일은 압축되지 않음 |
| `focusAlpha` | boolean | false | PNG 이미지의 투명도 채널 유지 여부 |
| `targetDir` | string | './compressed' | 압축된 이미지의 출력 디렉토리 경로 |

## 🎯 사용 사례

- **웹 백엔드 서비스** - 사용자 업로드 이미지 처리, 저장 공간 및 전송 시간 단축
- **콘텐츠 관리 시스템** - 업로드된 이미지 리소스 자동 압축
- **이미지 처리 서비스** - 이미지 압축 API 서비스 제공
- **배치 이미지 처리** - 대량의 기존 이미지 배치 압축
- **빌드 도구 통합** - 프로젝트 빌드 과정에서 이미지 리소스 자동 최적화

## 🤝 기여

Issue와 Pull Request를 환영합니다!

1. 이 저장소를 포크
2. 기능 브랜치 생성 (`git checkout -b feature/AmazingFeature`)
3. 변경 사항 커밋 (`git commit -m 'Add some AmazingFeature'`)
4. 브랜치에 푸시 (`git push origin feature/AmazingFeature`)
5. Pull Request 열기

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 라이선스가 부여됩니다 - 자세한 내용은 [LICENSE](LICENSE) 파일을 참조하세요.

## 🙏 감사의 말

- 원본 Android 압축 알고리즘을 제공해 준 [Curzibn/Luban](https://github.com/Curzibn/Luban)에 감사
- 강력한 이미지 처리 기능을 제공해 준 [Sharp](https://sharp.pixelplumbing.com/)에 감사
- 우수한 압축 알고리즘 설계를 한 WeChat 팀에 감사

---

이 프로젝트가 도움이 되셨다면 ⭐️를 부탁드립니다!