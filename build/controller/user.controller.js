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
const user_model_1 = __importDefault(require("../model/user.model"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const sharp_1 = __importDefault(require("sharp"));
class UserController {
    constructor() {
        this.signup = function (req, res) {
            return __awaiter(this, void 0, void 0, function* () {
                let { username, password } = req.body;
                const user = yield user_model_1.default.findOne({ username });
                if (user) {
                    return res.json({ message: 'user already exists' });
                }
                password = yield bcrypt_1.default.hash(password, 10);
                const newUser = yield user_model_1.default.create({ username, password });
                const token = jsonwebtoken_1.default.sign({ id: newUser._id }, 'secretKey');
                res.cookie('token', token, {
                    maxAge: 1 * 24 * 60 * 60 * 1000,
                    httpOnly: true,
                });
                res.json({ success: true, user: newUser });
            });
        };
        this.login = function (req, res) {
            return __awaiter(this, void 0, void 0, function* () {
                let { username, password } = req.body;
                const user = yield user_model_1.default.findOne({ username });
                if (!user) {
                    return res.json({ success: false, message: 'Invalid Credentials' });
                }
                const isvalidPassword = yield bcrypt_1.default.compare(password, user.password);
                if (!isvalidPassword) {
                    return res.json({ success: false, message: 'Invalid Credentials' });
                }
                const token = jsonwebtoken_1.default.sign({ id: user._id }, 'secretKey');
                res.cookie('token', token, {
                    maxAge: 1 * 24 * 60 * 60 * 1000,
                    httpOnly: true,
                });
                res.json({ success: true, user });
            });
        };
        this.logout = function (req, res) {
            return __awaiter(this, void 0, void 0, function* () {
                const { token } = req.cookies;
                console.log(token);
                if (!token) {
                    return res.json({ success: false, message: 'Unable to Proccess' });
                }
                res.cookie('token', '', {
                    maxAge: 1,
                    httpOnly: true,
                });
                res.json({ success: true, message: 'Please Login' });
            });
        };
        this.deleteAccount = function (req, res) {
            return __awaiter(this, void 0, void 0, function* () {
                const userId = req.body.userID;
                const user = yield user_model_1.default.findByIdAndDelete(userId);
                res.json({ success: true, user });
            });
        };
        this.setProfilePic = function (req, res) {
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    const userId = req.body.userID;
                    const user = yield user_model_1.default.findById(userId);
                    if (!req.file) {
                        return res.json({ success: false, message: 'no file found' });
                    }
                    if (!user) {
                        return res.json({ success: false, message: 'no user found' });
                    }
                    const imageData = yield (0, sharp_1.default)(req.file.buffer).png().resize({ width: 255, height: 255 }).toBuffer();
                    user.image = {
                        data: imageData,
                        url: `${req.baseUrl}/${userId}/avatar`
                    };
                    yield user.save();
                    res.json({ success: true, });
                }
                catch (error) {
                    return res.send({ error });
                }
            });
        };
        this.removeProfilePic = function (req, res) {
            return __awaiter(this, void 0, void 0, function* () {
            });
        };
        this.showProfilePic = function (req, res) {
            return __awaiter(this, void 0, void 0, function* () {
                const { id } = req.params;
                if (!id) {
                    return res.json({ success: false, message: 'Invalid request' });
                }
                const user = yield user_model_1.default.findById(id);
                if (!user) {
                    return res.json({ success: false, message: 'No user found' });
                }
                if (!user.image) {
                    return res.json({ success: false, message: 'please set profile pic first' });
                }
                res.setHeader('Content-Type', 'image/png');
                res.send(user.image.data);
            });
        };
    }
}
exports.default = UserController;
