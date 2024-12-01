import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcrypt'
import  jwt from 'jsonwebtoken'
const userSchema = new Schema({
    userName: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        index: true, //for searching in database
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,

    },
    fullName: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
        index: true, //for searching in database
    },
    profileImage: {
        type: String, //cloudnary url
        required: true,
    },
    coverImage: {
        type: String, //cloudnary url
    },
    password: {
        type: String,
        required: [true, 'Password is required'],

    },
    refreshtoken: {
        type: String,
    }

}, { timestamps: true })

export const User = mongoose.model("User", userSchema)

//Encyption using bcrypt
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next()
    this.password = await bcrypt.hash(this.password, 10)
    next()
})
//password Check
userSchema.methods.isPasswordCorrect=async function(password){
return await this.password.compare(password,this.password)
}
//Access token
userSchema.methods.generateAccessToken=()=>{
    return jwt.sign({
        _id:this._id,
        email:this.email,
        username:this.username,
        fullname:this.fullname,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
        expiresIn:process.env.ACCESS_TOKEN_EXPIRY
    }
)
}
    //Refresh Token
userSchema.methods.generateRefreshToken=()=>{
    return jwt.sign({
        _id:this.id,
    },
process.env.REFRESH_TOKEN_SECRET,
{
    expiresIn:process.env.REFRESH_TOKEN_EXPIRY
}
)
}
