import mongoose, { isValidObjectId } from "mongoose";

import { User } from '../Models/users.models.js'
import { apiError } from '../Utils/apiError.js';
import { apiResponse } from '../Utils/apiResponse.js';
import asyncHandler from '../Utils/asyncHandler.js';
import { Subscription } from '../Models/subscriptions.models.js'

//toggle subscriptions

const toggleSubscription = asyncHandler(async (req, res) => {
    const { channelId } = req.params
    if (!isValidObjectId(channelId)) {
        throw new apiError(400, "Invalid channel ID")
    }
    const subscribed = await Subscription.findOne({
        $and: [{ channel: channelId }, { subscriber: req.user._id }],
    })
    if (!subscribed) {
        const subscribe = await Subscription.create({
            subscriber: req.user._id,
            channel: channelId
        });
        if (!subscribe) {
            throw new apiError(500, "Failed to subscribe to channel")
        }
        return res.status(200).json(
            new apiResponse(200, subscribe, "Subscribed successfully")
        )
    }

    const unsubscribe = await Subscription.findByIdAndDelete(subscribed._id)
    if (!unsubscribe) {
        throw new apiError(500, "Failed to unsubscribe to channel")
    }
    return res.status(200).json(
        new apiResponse(200, {}, "Unsubscribed successfully")
    )

})

//subscriber list of channel

const getUserChannelSubscriber = asyncHandler(async (req, res) => {
    const { subscriberId } = req.params;
    if (!isValidObjectId(subscriberId)) {
        throw new apiError(404, "invalid subscriber ID")
    }
    const subscriberList = await Subscription.aggregate([
        {
            $match: {
                channel: new mongoose.Types.ObjectId(subscriberId)
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "subscriber",
                foreignField: "_id",
                as: "subscriber",
                pipeline: [
                    {
                        $project: {
                            username: 1,
                            fullName: 1,
                            avatar: 1,
                        },
                    }
                ]
            }
        },
        {
            $addFields: {
                subscriber: {
                    $first: "$subscriber",
                },
            },
        },
        {
            $project: {
                subscriber: 1,
                createdAt: 1,
            },
        }
    ]);
    if (!subscriberList) {
        throw new apiError(404, "No subscriber found for this channel")
    }
    return res.status(200).json(
        new apiResponse(200, subscriberList, "Subscriber list fetched successfully")
    )
});


//controller to return channel list to which user has subscribed

const getSubscribedChannel = asyncHandler(async (req, res) => {
    const { channelId } = req.params;
    if (!isValidObjectId(channelId)) {
        throw new apiError(404, "Invalid Channel ID")
    }
    const channelList= await Subscription.aggregate([
        {
            $match: {
              subscriber: channelId,
            },
          },
          {
            $lookup: {
              from: "users",
              localField: "channel",
              foreignField: "_id",
              as: "channel",
              pipeline: [
                {
                  $project: {
                    fullName: 1,
                    username: 1,
                    avatar: 1,
                  },
                },
              ],
            },
          },
          {
            $addFields: {
              channel: {
                $first: "$channel",
              },
            },
          },
          {
            $project: {
              channel: 1,
              createdAt: 1,
            },
          },
    ]);
    if(!channelList){
        throw new apiError(404, "No subscribed channel found")
    }
    return res.status(200).json(
        new apiResponse(200, channelList, "Channel list fetched successfully")
    )
});

export{
    toggleSubscription,
    getSubscribedChannel,
    getUserChannelSubscriber
}