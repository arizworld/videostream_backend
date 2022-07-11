import User from "../model/user.model";
import {Request,Response,NextFunction} from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import sharp from 'sharp'
export default class UserController{
    signup = async function(req:Request,res:Response){
        let {username,password} = req.body;
        const user = await User.findOne({username});
        if(user){
            return res.json({message : 'user already exists'})
        }
        password = await bcrypt.hash(password,10);
        const newUser = await User.create({username,password});
        const token = jwt.sign({id:newUser._id},'secretKey');
        res.cookie('token',token,{
            maxAge : 1 * 24 * 60 * 60 * 1000,
            httpOnly : true,
        })
        res.json({success:true,user:newUser});
    }
    login = async function(req:Request,res:Response){
        let {username,password} = req.body;
        const user = await User.findOne({username});
        if(!user){
            return res.json({success : false, message : 'Invalid Credentials'})
        }
        const isvalidPassword = await bcrypt.compare(password,user.password);
        if(!isvalidPassword){
            return res.json({success : false, message : 'Invalid Credentials'})
        }
        const token = jwt.sign({id: user._id},'secretKey');
        res.cookie('token',token,{
            maxAge : 1 * 24 * 60 * 60 * 1000,
            httpOnly : true,
        })
        res.json({success:true,user});
    }
    logout = async function(req:Request,res:Response){
        const { token } = req.cookies;
        console.log(token)
        if(!token){
            return res.json({success : false,message : 'Unable to Proccess'})
        }
        res.cookie('token','',{
            maxAge : 1,
            httpOnly : true,
        })
        res.json({success : true,message : 'Please Login'}) 
    }
    deleteAccount = async function(req:Request,res:Response){
        const userId = req.body.userID;
        const user = await User.findByIdAndDelete(userId);
        res.json({success : true,user})
    }
    setProfilePic = async function(req:Request,res:Response){
        try {
            const userId = req.body.userID;
        const user = await User.findById(userId)
        if(!req.file){
            return res.json({success : false,message : 'no file found'})
        }
        if(!user){
            return res.json({success : false,message : 'no user found'})
        }
        const imageData = await sharp(req.file.buffer).png().resize({width: 255,height:255}).toBuffer();
        user.image = {
            data : imageData,
            url : `${req.baseUrl}/${userId}/avatar`
        }
        await user.save();
        res.json({success : true,});
        } catch (error) {
            return res.send({error})
        }
        
    }
    removeProfilePic = async function(req:Request,res:Response){

    }
    showProfilePic = async function(req:Request,res:Response){
        const { id } = req.params;
        if(!id){
            return res.json({success : false, message : 'Invalid request'})
        }
        const user = await User.findById(id)
        if(!user){
            return res.json({success : false, message : 'No user found'})
        }
        if(!user.image){
            return res.json({success : false, message : 'please set profile pic first'})
        }
        res.setHeader('Content-Type','image/png')
        res.send(user.image.data);
    }
}