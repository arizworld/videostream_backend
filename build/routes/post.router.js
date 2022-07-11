"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const RouterBudler_1 = require("./../RouterBudler");
const post_controller_1 = __importDefault(require("../controller/post.controller"));
const RouterBudler_2 = __importDefault(require("../RouterBudler"));
const videoUpload_middleware_1 = __importDefault(require("../middleware/videoUpload.middleware"));
const post = new post_controller_1.default();
exports.default = [
    new RouterBudler_2.default('/post/upload', RouterBudler_1.HTTPMethods.post, post.uploadVideo, [videoUpload_middleware_1.default.single('video')]),
    new RouterBudler_2.default('/post/:id/video', RouterBudler_1.HTTPMethods.get, post.streamVideo)
];
