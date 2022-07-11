import multer from 'multer'
import path from 'path'
import { Request } from 'express'

export const upload = multer({
    limits: {
      fileSize: 1000000 // 1000000 Bytes = 1 MB
    },
    fileFilter(req:Request, file:Express.Multer.File, cb:multer.FileFilterCallback) {
      if (!file.originalname.match(/\.(png|jpg)$/)) { 
         // upload only png and jpg format
         return cb(new Error('Please upload a Image'))
       }
     cb(null, true)
  }
}); 