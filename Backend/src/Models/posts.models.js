import mongoose ,{Schema} from "mongoose";

const postSchema= new Schema({
title:{
    type:String,
    required:true
},
discription:{
    type:String,
    required:true
},
postImage:{
    type:String,
},
owner:{
    type:Schema.Types.ObjectId,
    ref:"User"
}
},{timestampsL:true})

export const Post = mongoose.model("Post",postSchema)