import mongoose ,{Schema} from "mongoose";

const followersSchema=new Schema({
    society:{
        type:Schema.Types.ObjectId,
        ref:"User"
    },
    followers:{
        type:Schema.Types.ObjectId,
        ref:"User",
    }
},{timestamps:true})

export const Followers= mongoose.model("Follower",followersSchema)