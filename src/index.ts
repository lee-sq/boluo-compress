/**
 * BoLuo - Pure frontend image compression library
 * 
 * 主要导出模块
 */
export { BoLuo, BoLuoBuilder } from './boluo';
export type { CompressionOptions, CompressionResult, ImageInfo } from './types';
export { Checker } from './checker';
export { Engine } from './engine';

// 默认导出BoLuo类
import { BoLuo } from './boluo';
export default BoLuo;