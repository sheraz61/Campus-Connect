import { Comment } from '../Models/comment.models.js'
import { Post } from '../Models/post.models.js'
import { User } from '../Models/user.models.js'
import { apiError } from '../Utils/apiError.js'
import asyncHandler from '../Utils/asyncHandler.js'
import { apiResponse } from '../Utils/apiResponse.js'
import mongoose from 'mongoose'


// get all comments of post 

const getAllPostComments = asyncHandler(async (req, res) => {
    const { postId } = req.params
    const { page = 1, limit = 10 } = req.query;
    if (!postId) {
        throw new apiError(400, 'Post ID is required')
    }
const post= await Post.findById(postId)
if(!post){
    throw new apiError(404, 'Post not found')
}
const options={
    page,
    limit
}
const comments= await mongoose.Aggregate([
    {
        $match:{
            post:new mongoose.Types.ObjectId(postId)
        },
    },{
        $lookup:{
            from: "users",
            localField: "owner",
            foreignField: "_id",
            as: "createdBy",
            pipeline:[
                {

                    $project : {
                        userName:1,
                        fullName:1,
                        profileImage:1,
                    },
                },
            ]
        }
    },
    {
        $addFields:{
            createdBy:{
                $first: "$createdBy",
            }
        }
    },
    {
        $unwind: "$createdBy",
      },
      {
        $project: {
          content: 1,
          createdBy: 1,
        },
      },
      {
        $skip: (page - 1) * limit,
      },
      {
        $limit: parseInt(limit),
      },
])

return res.status(200).json(
    new apiResponse(200, comments, "Comments retrieved successfully")
)
});


//createComment

const addComment=asyncHandler(async(req,res)=>{
    const {postId}= req.params;
    const {content}= req.body;
    const user= req.user._id;
    if(!content){
        throw new apiError(404,"Comment content is missing")
    }
    const post= await Post.findById(postId);
    if(!post){
        throw new apiError(404,"post not found")
    }
    const comment= new Comment.create({
        content,
        post:postId,
        owner:user
    })
    if(!comment){
        throw new apiError(500,"Error creating comment")
    }
return res.status(200).json(
    new apiResponse(200,comment,"Comment created successfully")
)
});

//updateComment

const updateComment= asyncHandler(async(req,res)=>{
    const {commentId}= req.params;
    const {content} = req.body;
    const user= req.user._id;
    if(!content){
        throw new apiError(404,"Comment content is missing")
    }
    const orignalComment= await Comment.findById(commentId);
    if(!orignalComment){
        throw new apiError(404,"Comment not found")
    }
if(orignalComment.owner.toStringify()!== user.toStringify()){
    throw new apiError(401,"You don't have permission to update this comment")
}
const updateComment= await Comment.findByIdAndUpdate(
    commentId,
    {
    $set:{
content
    }
},{
    new:true
})

if(!updateComment){
    throw new apiError(500,"Error updating comment")
}

return res.status(200).json(
    new apiResponse(200,updateComment,"Comment updated successfully")
)
});



// deleteComment

const deleteComment= asyncHandler(async(req,res)=>{
    const {commentId}= req.params;
    const user= req.user._id;
    const comment= await Comment.findById(commentId);
    if(!comment){
        throw new apiError(404,"Comment not found")
    }
    if(comment.owner.toStringify()!== user.toStringify()){
        throw new apiError(401,"You don't have permission to delete this comment")
    }

    const deletedComment= await Comment.findByIdAndDelete(commentId);
    if(!deletedComment){
        throw new apiError(500,"Error deleting comment")
    }
    return res.status(200).json(
        new apiResponse(200,{},"Comment deleted successfully")
    )
});

//