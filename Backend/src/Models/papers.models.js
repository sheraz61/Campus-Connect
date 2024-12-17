import mongoose ,{Schema} from "mongoose";
import  mongooseAggregatePaginate from 'mongoose-aggregate-paginate-v2'
const paperSchema= new Schema({
title:{
    type:String,
    required:true
},
discription:{
    type:String,
    required:true
},
semester:{
    type:String,
    required:true,

},
paperImage:{
    type:String,
},
owner:{
    type:Schema.Types.ObjectId,
    ref:"User"
}
},{timestamps:true})
paperSchema.plugin(mongooseAggregatePaginate)
export const Paper = mongoose.model("Paper",paperSchema)