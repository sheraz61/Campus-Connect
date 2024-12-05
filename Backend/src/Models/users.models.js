import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
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
    refreshToken: {
        type: String,
    }

}, { timestamps: true })


//Encyption using bcrypt
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }
    this.password = await bcrypt.hash(this.password, 10);
    next();
})
//password Check
userSchema.methods.isPasswordCorrect = async function (password) {
    console.log("Password send by User", password);
    console.log("Password of User", this.password);
    const ismatch = await bcrypt.compare(password, this.password)
    console.log(ismatch);
    return ismatch
}
//Access token
userSchema.methods.generateAccessToken = function() {
    return jwt.sign({
        _id: this._id,
        email: this.email,
        userName: this.userName,
        fullName: this.fullName,
    },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}
//Refresh Token
userSchema.methods.generateRefreshToken = function() {
    return jwt.sign({
        _id: this._id,
    },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

export const User = mongoose.model("User", userSchema)
