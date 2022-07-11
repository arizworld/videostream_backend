import{ GridFsStorage }from 'multer-gridfs-storage'
import multer from 'multer'
import { Request } from 'express';
import path from 'path';
const storage = new GridFsStorage({
    url: "mongodb+srv://ArizWorld:Ariz.1234@shopping-cart.0f8ai2b.mongodb.net/dankmemezone?retryWrites=true&w=majority",
    file: (req:Request, file) => {
      return new Promise((resolve, reject) => {
        const fileTypes = /png|jpg|jpeg|webp|gif|mp4|3gp|mkv|flv|mpg|avi|wav/
        const mimetype = fileTypes.test(file.mimetype);
        const extname = fileTypes.test(path.extname(file.originalname));
        console.log(mimetype,extname);
        if(mimetype && extname){
            const filename = file.originalname;
            const fileInfo = {
              filename: filename,
              bucketName: "uploads"
            };
            return resolve(fileInfo);
        }
        reject('this extenstion is not supported');
      });
    }
  });

export default multer({storage});