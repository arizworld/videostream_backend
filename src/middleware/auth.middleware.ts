import { UserModel } from './../model/user.model';
import {Request,Response,NextFunction} from 'express';
import User from '../model/user.model';
import jwt from 'jsonwebtoken'

export default async function(req:Request,res:Response,next:NextFunction){
    const { token } = req.cookies;
        if(!token){
            return res.json({success : false, message : "please provide valid credentials"})
        }
        const data = jwt.verify(token,'secretKey')
        if(typeof data === 'object'){
            const user : UserModel | null = await User.findById(data.id) 
            if(user){
                req.body.userID = user._id;
                console.log('here',user._id)
                console.log(req.body)
                return next();
            }
            return res.json({success : false, message : 'No User Found'})
        }
        res.json({success : false, message : 'Invalid Token'})
}