import { InputStreamProvider } from './types';
/**
 * 文件输入流提供者
 */
export declare class FileInputStreamProvider implements InputStreamProvider {
    private filePath;
    constructor(filePath: string);
    getPath(): string;
    getBuffer(): Promise<Buffer>;
    close(): void;
}
/**
 * Buffer输入流提供者
 */
export declare class BufferInputStreamProvider implements InputStreamProvider {
    private buffer;
    private path;
    constructor(buffer: Buffer, path?: string);
    getPath(): string;
    getBuffer(): Promise<Buffer>;
    close(): void;
}
//# sourceMappingURL=input-stream-provider.d.ts.map