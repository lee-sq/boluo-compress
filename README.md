# BoLuo Compress 🖼️

[![npm version](https://badge.fury.io/js/boluo-compress.svg)](https://badge.fury.io/js/boluo-compress)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

[English](#english) | [中文](#中文) | [한국어](#한국어) | [日本語](#日本語)

---

## English

### Pure Frontend Image Compression Library

A lightweight, high-performance browser-side image compression solution built entirely with frontend technologies, requiring no server-side support.

#### ✨ Features

- 🚀 **Pure Frontend**: Built with Canvas API, no server required
- 📦 **TypeScript Support**: Full type definitions included
- 🎛️ **Flexible Options**: Quality control, dimensions, alpha channel preservation
- 📊 **Smart Compression**: Intelligent thresholds to avoid over-compression
- 🔄 **Batch Processing**: Handle multiple files simultaneously
- 📱 **EXIF Support**: Automatic orientation handling
- 🎯 **Multiple Outputs**: Buffer, Blob, and File formats

#### 🚀 Quick Start

```bash
npm install boluo-compress
```

```typescript
import BoLuo from 'boluo-compress';

// Simple compression
const compressedBlob = await BoLuo.compress(file, 0.8);

// Advanced options
const boluo = await BoLuo.fromFile(file);
const result = await boluo.compress({
  quality: 0.8,
  maxWidth: 1920,
  maxHeight: 1080,
  ignoreBy: 10 // Skip files smaller than 10KB
});
```

#### 📖 API Reference

##### Static Methods
- `BoLuo.compress(file, quality)` - Quick compression
- `BoLuo.compressToBuffer(file, quality)` - Returns Buffer
- `BoLuo.compressMultiple(files, quality)` - Batch processing
- `BoLuo.fromFile(file)` - Create instance from File
- `BoLuo.fromBlob(blob)` - Create instance from Blob

##### Instance Methods
- `compress(options)` - Compress with options
- `compressToBlob(options)` - Returns Blob
- `getImageInfo()` - Get image metadata
- `isJPG()` - Check if JPEG format
- `getOrientation()` - Get EXIF orientation

#### 🛠️ Tech Stack
TypeScript | Canvas API | Buffer | Webpack

---

## 中文

### 纯前端图片压缩库

一个轻量级、高性能的浏览器端图片压缩解决方案，完全基于前端技术实现，无需服务器端支持。

#### ✨ 特性

- 🚀 **纯前端实现**: 基于Canvas API，无需服务器
- 📦 **TypeScript支持**: 包含完整类型定义
- 🎛️ **灵活配置**: 质量控制、尺寸限制、透明通道保留
- 📊 **智能压缩**: 智能阈值避免过度压缩
- 🔄 **批量处理**: 同时处理多个文件
- 📱 **EXIF支持**: 自动处理图片方向
- 🎯 **多种输出**: Buffer、Blob、File格式

#### 🚀 快速开始

```bash
npm install boluo-compress
```

```typescript
import BoLuo from 'boluo-compress';

// 简单压缩
const compressedBlob = await BoLuo.compress(file, 0.8);

// 高级选项
const boluo = await BoLuo.fromFile(file);
const result = await boluo.compress({
  quality: 0.8,
  maxWidth: 1920,
  maxHeight: 1080,
  ignoreBy: 10 // 跳过小于10KB的文件
});
```

#### 📖 API参考

##### 静态方法
- `BoLuo.compress(file, quality)` - 快速压缩
- `BoLuo.compressToBuffer(file, quality)` - 返回Buffer
- `BoLuo.compressMultiple(files, quality)` - 批量处理
- `BoLuo.fromFile(file)` - 从File创建实例
- `BoLuo.fromBlob(blob)` - 从Blob创建实例

##### 实例方法
- `compress(options)` - 使用选项压缩
- `compressToBlob(options)` - 返回Blob
- `getImageInfo()` - 获取图片元数据
- `isJPG()` - 检查是否为JPEG格式
- `getOrientation()` - 获取EXIF方向信息

---

## 한국어

### 순수 프론트엔드 이미지 압축 라이브러리

서버 지원 없이 프론트엔드 기술만으로 구축된 가볍고 고성능의 브라우저 측 이미지 압축 솔루션입니다.

#### ✨ 특징

- 🚀 **순수 프론트엔드**: Canvas API 기반, 서버 불필요
- 📦 **TypeScript 지원**: 완전한 타입 정의 포함
- 🎛️ **유연한 옵션**: 품질 제어, 크기 제한, 알파 채널 보존
- 📊 **스마트 압축**: 과도한 압축을 피하는 지능형 임계값
- 🔄 **배치 처리**: 여러 파일 동시 처리
- 📱 **EXIF 지원**: 자동 방향 처리
- 🎯 **다중 출력**: Buffer, Blob, File 형식

#### 🚀 빠른 시작

```bash
npm install boluo-compress
```

```typescript
import BoLuo from 'boluo-compress';

// 간단한 압축
const compressedBlob = await BoLuo.compress(file, 0.8);

// 고급 옵션
const boluo = await BoLuo.fromFile(file);
const result = await boluo.compress({
  quality: 0.8,
  maxWidth: 1920,
  maxHeight: 1080,
  ignoreBy: 10 // 10KB 미만 파일 건너뛰기
});
```

---

## 日本語

### 純粋なフロントエンド画像圧縮ライブラリ

サーバーサイドのサポートを必要とせず、フロントエンド技術のみで構築された軽量で高性能なブラウザサイド画像圧縮ソリューションです。

#### ✨ 特徴

- 🚀 **純粋なフロントエンド**: Canvas API ベース、サーバー不要
- 📦 **TypeScript サポート**: 完全な型定義を含む
- 🎛️ **柔軟なオプション**: 品質制御、寸法制限、アルファチャンネル保持
- 📊 **スマート圧縮**: 過度な圧縮を避けるインテリジェントな閾値
- 🔄 **バッチ処理**: 複数ファイルの同時処理
- 📱 **EXIF サポート**: 自動方向処理
- 🎯 **複数出力**: Buffer、Blob、File 形式

#### 🚀 クイックスタート

```bash
npm install boluo-compress
```

```typescript
import BoLuo from 'boluo-compress';

// シンプルな圧縮
const compressedBlob = await BoLuo.compress(file, 0.8);

// 高度なオプション
const boluo = await BoLuo.fromFile(file);
const result = await boluo.compress({
  quality: 0.8,
  maxWidth: 1920,
  maxHeight: 1080,
  ignoreBy: 10 // 10KB未満のファイルをスキップ
});
```

---

## 📄 License

MIT © [lee-sq](https://github.com/lee-sq)

## 🤝 Contributing

Contributions, issues and feature requests are welcome!

## 📞 Support

If you like this project, please give it a ⭐️!

---

**Repository**: [https://github.com/lee-sq/boluo-compress](https://github.com/lee-sq/boluo-compress)