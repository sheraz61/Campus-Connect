import { Paper } from "../Models/papers.models.js";
import { apiError } from "../Utils/apiError.js";
import { apiResponse } from "../Utils/apiResponse.js";
import { isValidObjectId } from "mongoose";
import asyncHandler from "../Utils/asyncHandler.js";
import { User } from "../Models/users.models.js";
import { uploadOnCloudinary,deleteInCloudinary } from "../Utils/cloudinary.js";
//create a new paper 
const uploadPaper= asyncHandler(async(req,res)=>{
    const {title,discription,semester} = req.body;
    const paperLocalPath= req.file?.path;
    if(!title || !discription){
        throw new apiError(400, 'Title and discription are required')
    }
    if(!paperLocalPath){
        throw new apiError(400, 'Paper file is required')
    }
    
    const cloudinaryResponse= await uploadOnCloudinary(paperLocalPath)
    if(!cloudinaryResponse.url){
        throw new apiError(500, 'Failed to upload paper')
    }
    const paper= await Paper.create({
        title,
        discription,
        semester,
        owner: req.user?._id,
        paperImage: cloudinaryResponse.url
    })
    if(!paper){
        throw new apiError(500, 'Failed to create paper')
    }
    return res.status(201).json(
        new apiResponse(201, paper, 'Paper created successfully')
    )
})
//get all papers
const getAllPapers= asyncHandler(async(req,res)=>{
    const {
        page=1,
        limit=10,
        query='',
        sortBy='createdAt',
        sortType,
        userId,
    }= req.query;
    const paper= await Paper.aggregate([
        {
            $match: {
                $or: [
                    {
                        title: { $regex: query, $options: 'i' },
                    },
                    {
                        discription: { $regex: query, $options: "i" },
                    }
                ]
            }
        }, {
            $lookup: {
                from: "users",
                localField: "owner",
                foreignField: "_id",
                as: "createdBy",
            },
        },
        {
            $unwind: "$createdBy",
        },
        {
            $project: {
                paperImage: 1,
                title: 1,
                discription: 1,
                semester:1,
                createdBy: {
                    _id: 1,
                    fullName: 1,
                    username: 1,
                    profileImage: 1,
                },
            },
        },
        {
            $sort: {
                [sortBy]: sortType === "asc" ? 1 : -1,
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
        new apiResponse(200, paper, 'Papers fetched successfully')
    )
})
//get paper by Id
const getPaperById= asyncHandler(async(req,res)=>{
    const {paperId} = req.params;
    if(!isValidObjectId(paperId)){
        throw new apiError(404, 'Invalid paper ID')
    }
    const paper= await Paper.findById(paperId);
    if(!paper){
        throw new apiError(404, 'Paper not found')
    }
    return res.status(200).json(
        new apiResponse(200, paper, 'Paper fetched successfully')
    )
})
//update paper 
const updatePaper= asyncHandler(async(req,res)=>{
    const {paperId}= req.params;
    const {title,discription,semester} = req.body;
    const paperLocalPath= req.file?.path;
    if(!isValidObjectId(paperId)){
        throw new apiError(404, 'Invalid paper ID')
    }
    if(!title || !discription){
        throw new apiError(400, 'Title and discription are required')
    }
    if(!paperLocalPath){
        throw new apiError(400, 'Paper file is required')
    }
    const paper= await Paper.findById(paperId);
    if(!paper){
        throw new apiError(404, 'Paper not found')
    }
    if(paper.owner.toString()!==req.user._id.toString()){
        throw new apiError(401, 'Unauthorized request')
    }
    let newPaperFile;
    let oldPaperDeleted=false;
    try{
        if(paper.paperImage){
            const deletePaperImage= await deleteInCloudinary(paper.paperImage);
            if(deletePaperImage!=="ok"){
                throw new apiError(500, 'Failed to delete old paper image')
            }
            oldPaperDeleted=true;
        }
        newPaperFile = await uploadOnCloudinary(paperLocalPath)
        if(!newPaperFile.url){
            throw new apiError(500, 'Failed to upload new paper')
        }
    }catch(err){
        if(!oldPaperDeleted){
            throw new apiError(500, `Image deletion failed: ${err.message}`)
        }
        throw new apiError(500, err.message)
    }
    const updatePaper= await Paper.findByIdAndUpdate(
        paperId,{
            $set:{
                title,
                discription,
                semester,
                paperImage: newPaperFile.url
            }
        },{
            new:true
        }
    )
    if(!updatePaper){
        throw new apiError(500, 'Failed to update paper')
    }
    return res.status(200).json(
        new apiResponse(200, updatePaper, 'Paper updated successfully')
    )
})

// delete Paper

const deletePaper= asyncHandler(async(req,res)=>{
    const {paperId}= req.params;
if(!isValidObjectId(paperId)){
    throw new apiError(404, 'Invalid paper ID')
}
const paper= await Paper.findById(paperId)
if(!paper){
    throw new apiError(404, 'Paper not found')
}
if(paper.owner.toString()!== req.user._id.toString()){
    throw new apiError(401, 'Unauthorized request')
}
const cloudinaryResponse= await deleteInCloudinary(paper.paperImage);
if(cloudinaryResponse!=="ok"){
    throw new apiError(500, 'Failed to delete paper image from cloudinary')
}
const deletePaper= await Paper.findByIdAndDelete(paperId);
    if(!deletePaper){
        throw new apiError(500, 'Failed to delete paper')
    }
    return res.status(200).json(
        new apiResponse(200, {}, 'Paper deleted successfully')
    )
})

export{
    getAllPapers,
    updatePaper,
    getPaperById,
    deletePaper,
    uploadPaper
}