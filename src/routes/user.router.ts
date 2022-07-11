import UserController from "../controller/user.controller";
import authMiddleware from "../middleware/auth.middleware";
import RouterBundler from "../RouterBudler";
import { upload } from "../middleware/upload.middleware";
import { HTTPMethods } from "../RouterBudler";
const user = new UserController();

export default [
    new RouterBundler('/user',HTTPMethods.post,user.signup),
    new RouterBundler('/user/login',HTTPMethods.post,user.login),
    new RouterBundler('/user/logout',HTTPMethods.post,user.logout,[authMiddleware]),
    new RouterBundler('/user',HTTPMethods.del,user.deleteAccount,[authMiddleware]),   
    new RouterBundler('/user/avatar',HTTPMethods.put,user.setProfilePic,[upload.single('avatar'),authMiddleware]),
    new RouterBundler('/:id/avatar',HTTPMethods.get,user.showProfilePic)   
]
