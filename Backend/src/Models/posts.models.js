import mongoose ,{Schema} from "mongoose";
import  mongooseAggregatePaginate from 'mongoose-aggregate-paginate-v2'
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
postSchema.plugin(mongooseAggregatePaginate)
export const Post = mongoose.model("Post",postSchema)