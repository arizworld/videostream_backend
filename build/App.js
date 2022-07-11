"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const AppRouter_1 = __importDefault(require("./AppRouter"));
const logger_1 = require("./utils/logger");
const defaultRoute_1 = __importDefault(require("./routes/defaultRoute"));
const user_router_1 = __importDefault(require("./routes/user.router"));
const db_1 = __importDefault(require("./db"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const post_router_1 = __importDefault(require("./routes/post.router"));
class App {
    constructor(port) {
        this.port = port;
        this.app = (0, express_1.default)();
        this.initialzeDatabase();
        this.initializeMiddlewares();
        this.initializeRoutes([defaultRoute_1.default, user_router_1.default, post_router_1.default]);
        this.app.listen(port, () => {
            (0, logger_1.logger)(`app is listening at ${port} `, logger_1.LogType.success);
        });
    }
    initializeRoutes(routeHandlers) {
        routeHandlers.forEach((routes) => {
            const router = AppRouter_1.default.getInstance();
            routes.forEach((route) => {
                const { path, middlewares, controller, method } = route;
                router[method](path, middlewares || [], controller);
            });
            this.app.use(router);
        });
    }
    initialzeDatabase() {
        new db_1.default();
    }
    initializeMiddlewares() {
        this.app.use(express_1.default.json());
        this.app.use(express_1.default.urlencoded({ extended: false }));
        this.app.use((0, cookie_parser_1.default)());
    }
}
exports.default = App;
