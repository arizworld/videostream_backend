"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = exports.chalkColor = exports.LogType = void 0;
const chalk_1 = __importDefault(require("chalk"));
var LogType;
(function (LogType) {
    LogType["info"] = "info";
    LogType["danger"] = "danger";
    LogType["success"] = "success";
    LogType["warning"] = "warning";
})(LogType = exports.LogType || (exports.LogType = {}));
var chalkColor;
(function (chalkColor) {
    chalkColor["info"] = "blue";
    chalkColor["danger"] = "red";
    chalkColor["success"] = "green";
    chalkColor["warning"] = "yellow";
})(chalkColor = exports.chalkColor || (exports.chalkColor = {}));
const logger = function (message, logType) {
    for (let key in LogType) {
        if (logType === LogType[key]) {
            const color = chalkColor[key];
            console.log(chalk_1.default[color].bold(`${key.toUpperCase()}:: `) + chalk_1.default[color](message.toSentanceCase()) + ' At ' + chalk_1.default.white(new Date()));
        }
    }
};
exports.logger = logger;
String.prototype.toSentanceCase = function () {
    return this.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
};
