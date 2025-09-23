"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Engine = exports.Checker = exports.BoLuo = void 0;
/**
 * BoLuo - Pure frontend image compression library
 *
 * 主要导出模块
 */
var boluo_1 = require("./boluo");
Object.defineProperty(exports, "BoLuo", { enumerable: true, get: function () { return boluo_1.Boluo; } });
var checker_1 = require("./checker");
Object.defineProperty(exports, "Checker", { enumerable: true, get: function () { return checker_1.Checker; } });
var engine_1 = require("./engine");
Object.defineProperty(exports, "Engine", { enumerable: true, get: function () { return engine_1.Engine; } });
// 默认导出BoLuo类
const boluo_2 = require("./boluo");
exports.default = boluo_2.Boluo;
//# sourceMappingURL=index.js.map