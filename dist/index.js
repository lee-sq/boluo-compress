"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Engine = exports.Checker = exports.BoLuo = void 0;
/**
 * BoLuo - Pure frontend image compression library
 *
 * 主要导出模块
 */
var boluo_browser_1 = require("./boluo-browser");
Object.defineProperty(exports, "BoLuo", { enumerable: true, get: function () { return boluo_browser_1.BoLuoBrowser; } });
var checker_1 = require("./checker");
Object.defineProperty(exports, "Checker", { enumerable: true, get: function () { return checker_1.Checker; } });
var browser_engine_1 = require("./browser-engine");
Object.defineProperty(exports, "Engine", { enumerable: true, get: function () { return browser_engine_1.BrowserEngine; } });
// 默认导出BoLuo类
const boluo_browser_2 = require("./boluo-browser");
exports.default = boluo_browser_2.BoLuoBrowser;
//# sourceMappingURL=index.js.map