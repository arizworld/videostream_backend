import mongoose from "mongoose";

export interface UserModel extends mongoose.Document{
    username : string;
    password : string;
    image ?: {data:Buffer,url:string}
}

const UserSchema = new mongoose.Schema({
    username : {
        type : String,
        required : [true,'please provide name'],
        unique : true
    },
    password : {
        type : String,
        required : [true,'please provide password']    
    },
    image : {
        data : {
            type : Buffer,
        },
        url : {
            type : String,            
        }
    }
})

const User = mongoose.model<UserModel>('User',UserSchema);
export default User;