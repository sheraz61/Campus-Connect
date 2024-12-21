import mongoose from 'mongoose';
import {Post} from '../Models/posts.models.js'
import {Subscriptions} from '../Models/subscriptions.models.js'
import asyncHandler from '../Utils/asyncHandler.js';
import {apiError} from '../Utils/apiError.js';
import {apiResponse} from '../Utils/apiResponse.js';
const getChannelStats = asyncHandler(async (req, res) => {
    const userId = req.user?._id;
  
    // Total Posts Count
    const postCount = await Post.aggregate([
      {
        $match: {
          owner: new mongoose.Types.ObjectId(userId),
        },
      },
      {
        $group: {
          _id: null,
          totalPosts: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          totalPosts: 1,
        },
      },
    ]);
  
    // Total Subscribers
    const subsCount = await Subscriptions.aggregate([
      {
        $match: {
          channel: new mongoose.Types.ObjectId(userId),
        },
      },
      {
        $group: {
          _id: null,
          totalSubscribers: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          totalSubscribers: 1,
        },
      },
    ]);
  
    // Total Subscribed Channels
    const subscribedCount = await Subscriptions.aggregate([
      {
        $match: {
          subscriber: new mongoose.Types.ObjectId(userId),
        },
      },
      {
        $group: {
          _id: null,
          totalSubscribedChannels: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          totalSubscribedChannels: 1,
        },
      },
    ]);
  
    const info = {
      totalPosts: postCount[0]?.totalPosts || 0,
      totalSubscribers: subsCount[0]?.totalSubscribers || 0,
      totalSubscribedChannels: subscribedCount[0]?.totalSubscribedChannels || 0,
    };
  
    return res
      .status(200)
      .json(new apiResponse(200, info, "Channel Stats Fetched"));
  });
  

const getChannelPosts = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const posts = await Post.aggregate([
      {
        $match: {
          owner: new mongoose.Types.ObjectId(userId),
        },
      },
      {
        $project: {
          title: 1,
          discription: 1,
          postImage: 1,
          owner: 1,
          createdAt: 1,
          updatedAt: 1,
        },
      },
    ]);
  
    return res
      .status(200)
      .json(new apiResponse(200, posts, "Channel Posts Fetched"));
  });

  export {
    getChannelStats,
    getChannelPosts,
  }