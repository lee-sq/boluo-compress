import * as fs from 'fs';
import { InputStreamProvider } from './types';

/**
 * 文件输入流提供者
 */
export class FileInputStreamProvider implements InputStreamProvider {
  private filePath: string;

  constructor(filePath: string) {
    this.filePath = filePath;
  }

  getPath(): string {
    return this.filePath;
  }

  async getBuffer(): Promise<Buffer> {
    return fs.readFileSync(this.filePath);
  }

  close(): void {
    // 文件流不需要特殊关闭操作
  }
}

/**
 * Buffer输入流提供者
 */
export class BufferInputStreamProvider implements InputStreamProvider {
  private buffer: Buffer;
  private path: string;

  constructor(buffer: Buffer, path: string = 'buffer') {
    this.buffer = buffer;
    this.path = path;
  }

  getPath(): string {
    return this.path;
  }

  async getBuffer(): Promise<Buffer> {
    return this.buffer;
  }

  close(): void {
    // Buffer不需要特殊关闭操作
  }
}