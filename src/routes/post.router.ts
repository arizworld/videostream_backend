import { HTTPMethods } from './../RouterBudler';
import PostController from "../controller/post.controller";
import RouterBundler from "../RouterBudler";
import videoUploadMiddleware from '../middleware/videoUpload.middleware';
const post = new PostController()
export default [
    new RouterBundler('/post/upload',HTTPMethods.post,post.uploadVideo,[videoUploadMiddleware.single('video')]),
    new RouterBundler('/post/:id/video',HTTPMethods.get,post.streamVideo)
]