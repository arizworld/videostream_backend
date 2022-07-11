"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
class PostController {
    constructor() {
        this.uploadVideo = function (req, res) {
            var _a;
            return __awaiter(this, void 0, void 0, function* () {
                // console.log(req.body);
                res.status(200).json({ success: true, id: (_a = req.file) === null || _a === void 0 ? void 0 : _a.id });
            });
        };
        this.streamVideo = function (req, res) {
            return __awaiter(this, void 0, void 0, function* () {
                const { id } = req.params;
                if (!id) {
                    return res.json({ success: false, message: "No Id found" });
                }
                const range = req.headers.range || '0';
                mongoose_1.default.connection.db.collection('uploads.files').findOne({ _id: new mongoose_1.default.Types.ObjectId(id) }, (err, video) => {
                    if (!video) {
                        return res.json({ success: false, message: "No File found" });
                    }
                    const videoSize = video.length;
                    const start = Number(range.replace(/\D/g, ""));
                    const end = videoSize - 1;
                    const contentLength = end - start + 1;
                    const headers = {
                        "Content-Range": `bytes ${start}-${end}/${videoSize}`,
                        "Accept-Ranges": "bytes",
                        "Content-Length": contentLength,
                        "Content-Type": "video/mp4",
                    };
                    // HTTP Status 206 for Partial Content
                    res.set(Object.assign({}, headers));
                    const bucket = new mongoose_1.default.mongo.GridFSBucket(mongoose_1.default.connection.db, {
                        bucketName: "uploads",
                    });
                    const downloadStream = bucket.openDownloadStreamByName(video.filename, {
                        start
                    });
                    downloadStream.pipe(res);
                    downloadStream.on('error', (err) => {
                        res.sendStatus(404).json({ err });
                    });
                });
            });
        };
    }
}
exports.default = PostController;
