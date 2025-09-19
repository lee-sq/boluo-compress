"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BufferInputStreamProvider = exports.FileInputStreamProvider = exports.Engine = exports.Checker = exports.BoLuoBuilder = exports.BoLuo = void 0;
/**
 * BoLuo - TypeScript implementation of BoLuo image compression library
 *
 * 主要导出模块
 */
var boluo_1 = require("./boluo");
Object.defineProperty(exports, "BoLuo", { enumerable: true, get: function () { return boluo_1.BoLuo; } });
Object.defineProperty(exports, "BoLuoBuilder", { enumerable: true, get: function () { return boluo_1.BoLuoBuilder; } });
var checker_1 = require("./checker");
Object.defineProperty(exports, "Checker", { enumerable: true, get: function () { return checker_1.Checker; } });
var engine_1 = require("./engine");
Object.defineProperty(exports, "Engine", { enumerable: true, get: function () { return engine_1.Engine; } });
var input_stream_provider_1 = require("./input-stream-provider");
Object.defineProperty(exports, "FileInputStreamProvider", { enumerable: true, get: function () { return input_stream_provider_1.FileInputStreamProvider; } });
Object.defineProperty(exports, "BufferInputStreamProvider", { enumerable: true, get: function () { return input_stream_provider_1.BufferInputStreamProvider; } });
// 默认导出BoLuo类
const boluo_2 = require("./boluo");
exports.default = boluo_2.BoLuo;
//# sourceMappingURL=index.js.map