import mongoose, { Schema } from 'mongoose';

const userSchema = new Schema({
societyName:{
    type: String,
    required: true,
},
userName:{
    type: String,
    required: true,
    unique: true,
},
profilePicture:{
    type: String,
    required: true,
},
email:{
    type: String,
    required: true,
    
},
password:{
    type: String,
    required: true,
},
refreshToken:{
    type: String,
}

}, { timestamps: true })

export const User = mongoose.model("User", userSchema)