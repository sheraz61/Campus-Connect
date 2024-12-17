import { isValidObjectId } from "mongoose";
import mongoose from "mongoose";
import { Post } from "../Models/posts.models.js";
import { User } from "../Models/users.models.js"
import { apiError } from "../Utils/apiError.js"
import asyncHandler from "../Utils/asyncHandler.js"
import { apiResponse } from "../Utils/apiResponse.js"
import {
    uploadOnCloudinary,
    deleteInCloudinary,
} from "../Utils/cloudinary.js"
//get all posts
const getAllPosts = asyncHandler(async (req, res) => {
    const {
        page = 1,
        limit = 10,
        query = "",
        sortBy = "createdAt",
        sortType,
        userId,
    } = req.query;

    const post = await Post.aggregate([
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
        },
        {
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
                postImage: 1,
                title: 1,
                discription: 1,
                createdBy: {
                    fullName: 1,
                    userName: 1,
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
        new apiResponse(200, post, "Posts fetched successfully")
    )
});
//create post

const pulishedPost = asyncHandler(async (req, res) => {
    const { title, discription } = req.body;
    if (!title || !discription) {
        throw new apiError(404, "All fields are required")
    }
    const postLocalFilePath = req.file?.path;
    if (!postLocalFilePath) {
        throw new apiError(404, "Post Image not found")
    }
    const postImg = await uploadOnCloudinary(postLocalFilePath)
    if (!postImg.url) {
        throw new apiError(404, "error while uploading image")
    }
    const newPost = await Post.create({
        postImage: postImg.url,
        title,
        discription,
        owner: req.user._id,
    })
    if (!newPost) {
        throw new apiError(404, "Failed to create post")
    }
    return res.status(200).json(
        new apiResponse(200, newPost, "Post created successfully")
    )
});
//get post 
const getPostById = asyncHandler(async (req, res) => {
    const { postId } = req.params;
    if (!isValidObjectId(postId)) {
        throw new apiError(404, "Invalid post ID")
    }
    const post = await Post.findById(postId)
    if (!post) {
        throw new apiError(404, "Post not found")
    }
    return res.status(200).json(
        new apiResponse(200, post, "Post fetched successfully")
    )
});

const updatePost = asyncHandler(async (req, res) => {
    const { postId } = req.params;
    const { title, discription } = req.body;
    const newPostImgLocalPath = req.file?.path;

    if (!isValidObjectId(postId)) {
        throw new apiError(404, "Invalid post ID")
    }
    if (!title || !discription) {
        throw new apiError(404, "All fields are required")
    }
    if (!newPostImgLocalPath) {
        throw new apiError(404, "Provide Post Image")
    }
    const post = await Post.findById(postId);
    if (!post) {
        throw new apiError(404, "Post not found")
    }
    if (post.owner.toString() !== req.user._id.toString()) {
        throw new apiError(401, "Unauthorized request");
    }

    let newPostImg;
    let oldImageDeleted = false;

    try {
        // Check if post has an existing image before attempting to delete
        if (post.postImage) {
            const deletePostImage = await deleteInCloudinary(post.postImage);

            // Verify deletion was successful
            if (deletePostImage !== "ok") {
                throw new apiError(500, "Failed to delete existing post image");
            }
            oldImageDeleted = true;
        }

        // Upload the new post image
        newPostImg = await uploadOnCloudinary(newPostImgLocalPath);
        if (!newPostImg.url) {
            // If upload fails and old image was deleted, we need to handle this
            throw new apiError(500, "Error while uploading new post image");
        }
    } catch (error) {
        // If image deletion failed, throw the specific error
        if (!oldImageDeleted) {
            throw new apiError(500, `Image deletion failed: ${error.message}`);
        }

        // If new image upload failed after deleting old image
        throw new apiError(500, error.message);
    }
    const updatePost = await Post.findByIdAndUpdate(
        postId,
        {
            $set: {
                title,
                discription,
                postImage: newPostImg.url,
            }
        },
        {
            new: true
        }
    );
    return res.status(200).json(
        new apiResponse(200, updatePost, "Post updated successfully")
    )
});
//delete post

const deletePost = asyncHandler(async (req, res) => {
    const { postId } = req.params;
    if (!isValidObjectId(postId)) {
        throw new apiError("invalid post id");
    }
    const post = await Post.findById(postId);
    if (!post) {
        throw new apiError("post not found");
    }
    if (post.owner.toString() !== req.user._id.toString()) {
        throw new apiError(401, "Unauthorized request");
    }
    const cloudinaryDeletePostResponse = await deleteInCloudinary(post.postImage);
    if (cloudinaryDeletePostResponse !== "ok") {
        throw new apiError("Error while deleting cloudinary image")
    }
    const deletedPost = await Post.findByIdAndDelete(postId);
    if (!deletedPost) {
        throw new apiError("Failed to delete post")
    }
    return res.status(200).json(
        new apiResponse(200, {}, "Post deleted successfully")
    )
});

export {
    getAllPosts,
    pulishedPost,
    getPostById,
    updatePost,
    deletePost
}

