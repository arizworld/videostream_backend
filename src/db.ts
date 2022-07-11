import mongoose from "mongoose";
import { logger, LogType } from "./utils/logger";

export default class DB {
  private static bucket:any;
  constructor() {
    mongoose
      .connect(
        "mongodb+srv://ArizWorld:Ariz.1234@shopping-cart.0f8ai2b.mongodb.net/dankmemezone?retryWrites=true&w=majority"
      )
      .then(() => {
        logger("connected to mongodb", LogType.success);
      });
    let bucket;
    mongoose.connection.on("connected", () => {
      var db = mongoose.connections[0].db;
      bucket = new mongoose.mongo.GridFSBucket(db, {
        bucketName: "uploads",
      });
      DB.bucket = bucket;
      console.log(DB.bucket)
    });
  }
  static getBucket(){
    return DB.bucket;
  }
}
const bucket = DB.getBucket();
export {
  bucket, 
}

