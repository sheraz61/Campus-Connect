import {User} from '../Models/users.models.js'
import { apiError } from '../Utils/apiError.js'
import asyncHandler from '../Utils/asyncHandler.js'
import jwt from 'jsonwebtoken'
export const verifyJWT= asyncHandler(async(req,_,next)=>{
    try {
        const token= req.cookie?.accessToken || req.header("Authorization")?.replace("Bearer ","")
        if(!token){
            throw new apiError(401,"Unauthorized request")
        }
        const decodedToken= jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        const user= await User.findById(decodedToken?._id).select("-password -refreshToken")
        if(!user){
            throw new apiError(401,"Invalid access token")
        }
        req.user=user;
        next()
    } catch (error) {
        throw new apiError(401,error?.message || "Invalid access Token")
    }
})