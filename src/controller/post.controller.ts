import { upload } from './../middleware/upload.middleware';
import mongoose, { ObjectId }  from 'mongoose';
import { Request, Response } from "express";

export default class PostController {
  uploadVideo = async function (req: Request, res: Response) {
    // console.log(req.body);
    res.status(200).json({ success: true,id : req.file?.id });
  };
  streamVideo = async function (req: Request, res: Response) {
    const { id } = req.params;
    if (!id) {
      return res.json({ success: false, message: "No Id found" });
    }
    const range = req.headers.range || '0';
    mongoose.connection.db.collection('uploads.files').findOne({_id : new mongoose.Types.ObjectId(id)},(err,video)=>{
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
        res.set({...headers});
        const bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
            bucketName: "uploads",
        });
        const downloadStream = bucket.openDownloadStreamByName(video.filename, {
            start
        })
        downloadStream.pipe(res);
        downloadStream.on('error', (err) => {
            res.sendStatus(404).json({err});
        });
    })
  };
}
