import express, { Request, Response } from "express";
import AppRouter from "./AppRouter";
import RouterBundler from "./RouterBudler";
import { logger, LogType } from "./utils/logger";
import defaultRoute from "./routes/defaultRoute";
import userRoute from "./routes/user.router";
import DB from "./db";
import cookieParser from "cookie-parser";
import postRoute from "./routes/post.router";
export default class App {
  private app: express.Application;
  constructor(public port: number) {
    this.app = express();
    this.initialzeDatabase();
    this.initializeMiddlewares();
    this.initializeRoutes([defaultRoute,userRoute,postRoute]);
    this.app.listen(port, () => {
      logger(`app is listening at ${port} `, LogType.success);
    });
  }
  initializeRoutes(routeHandlers: RouterBundler[][]) {
    routeHandlers.forEach((routes) => {
      const router = AppRouter.getInstance();
      routes.forEach((route) => {
        const { path, middlewares, controller, method } = route;
        router[method]( path, middlewares || [], controller);
      });
      this.app.use(router);
    });
  }
  initialzeDatabase(){
    new DB();
  }
  initializeMiddlewares(){
    this.app.use(express.json());
    this.app.use(express.urlencoded({extended:false}));
    this.app.use(cookieParser());
  }
}
