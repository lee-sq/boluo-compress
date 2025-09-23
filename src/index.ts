/**
 * BoLuo - Pure frontend image compression library
 * 
 * 主要导出模块
 */
export { Boluo as BoLuo } from './boluo';
export type { CompressionOptions, CompressionResult, ImageInfo } from './types';
export { Checker } from './checker';
export { Engine as Engine } from './engine';

// 默认导出BoLuo类
import { Boluo } from './boluo';
export default Boluo;