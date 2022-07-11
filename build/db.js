"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bucket = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const logger_1 = require("./utils/logger");
class DB {
    constructor() {
        mongoose_1.default
            .connect("mongodb+srv://ArizWorld:Ariz.1234@shopping-cart.0f8ai2b.mongodb.net/dankmemezone?retryWrites=true&w=majority")
            .then(() => {
            (0, logger_1.logger)("connected to mongodb", logger_1.LogType.success);
        });
        let bucket;
        mongoose_1.default.connection.on("connected", () => {
            var db = mongoose_1.default.connections[0].db;
            bucket = new mongoose_1.default.mongo.GridFSBucket(db, {
                bucketName: "uploads",
            });
            DB.bucket = bucket;
            console.log(DB.bucket);
        });
    }
    static getBucket() {
        return DB.bucket;
    }
}
exports.default = DB;
const bucket = DB.getBucket();
exports.bucket = bucket;
