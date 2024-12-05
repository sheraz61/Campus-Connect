import { User } from '../Models/users.models.js'
import asyncHandler from '../Utils/asyncHandler.js'
import { apiResponse } from '../Utils/apiResponse.js'
import { apiError } from '../Utils/apiError.js'
import { uploadOnCloudinary, deleteInCloudinary } from '../Utils/cloudinary.js'
import jwt from 'jsonwebtoken'


// access and refresh tokens
const generateAccessAndRefreshToken = async (userId) => {
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()
        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })
        return { accessToken, refreshToken }
    } catch (error) {
        throw new apiError(500, "something went wrong while generating refresh and access token")
    }
}

//register user

const registerUser = asyncHandler(async (req, res) => {
    const { fullName, email, userName, password } = req.body;
    if (
        [fullName, email, userName, password].some((value) => value?.trim() === "")
    ) {
        throw new apiError(400, 'All fields are required')
    }
    const existingUser = await User.findOne({
        $or: [
            { email }, { userName }
        ]
    })
    if (existingUser) {
        throw new apiError(409, 'User already exists')
    }

    const avatarLocalPath = req.files?.profileImage?.[0]?.path;
    let coverImagePath;
    if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
        coverImagePath = req.files.coverImage[0].path;
    }
    
    if (!avatarLocalPath) {
        throw new apiError(400, 'Avatar not found');
    }
    //upload them to cloudinary, avatar check after upload
    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverimage = await uploadOnCloudinary(coverImagePath)
    if (!avatar || !coverimage) {
        throw new apiError(500, 'Error uploading images');
    }
    if (!avatar) {
        throw new apiError(400, 'Avatar not found')
    }
    const user = await User.create({
        fullName,
        email,
        userName: userName.toLowerCase(),
        password,
        profileImage: avatar.url,
        coverImage: coverimage.url || ''
    })

    //remove password and  refresh token from response
    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if (!createdUser) {
        throw new apiError(500, 'User not created')
    }

    return res.status(200).json(
        new apiResponse(200, createdUser, 'user created successfully')
    )
})
//loginUser

const loginUser = asyncHandler(async (req, res) => {
   

    const { email, userName, password } = req.body;


    if (!userName && !email) {
        throw new apiError(400, 'Email or username is required')
    }
    const user = await User.findOne({
        $or: [
            { email }, { userName }
        ]
    })
    if (!user) {
        throw new apiError(401, 'Invalid credentials')
    }
    //password varification
    const isValidPassword = await user.isPasswordCorrect(password)
    if (!isValidPassword) {
        throw new apiError(401, 'Invalid Password')
    }
    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id)
    //hide refresh token and password from user response
    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")
    //send cookies options
    const options = {
        httpOnly: true,
        secure: true
    }

    //response 
    return res.status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new apiResponse(
                200,
                {
                    user: loggedInUser, accessToken, refreshToken
                },
                'User logged in successfully'
            )
        )
})

//logOut user

const logOutUser = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(req.user._id, {
        $unset: {
            refreshToken: 1
        }
    },
        {
            new: true
        }
    )

    const options = {
        httpOnly: true,
        secure: true
    }

    res.status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(
            new apiResponse(200, {}, "User logged out successfully")
        )
})


//refreshAccessToken

const refreshAccessToken = asyncHandler(async (req, res) => {
    const inComingRefreshToken = req.cookie?.refreshToken || req.body?.refreshToken
    if (!inComingRefreshToken) {
        throw new apiError(401, "Unautherized request")
    }
    try {
        const decodeToken = jwt.verify(inComingRefreshToken, process.env.REFRESH_TOKEN_SECRET)
        const user = await User.findById(decodeToken?._id)
        if (!user) {
            throw new apiError(401, "Unautherized request")
        }
        if (inComingRefreshToken !== user?.refreshToken) {
            throw new apiError(401, "Refresh token is expired or Used")
        }
        const options = {
            httpOnly: true,
            secure: true
        }
        const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id)
        return res.status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", refreshToken, options)
            .json(
                new apiResponse(200, { accessToken, refreshToken }, "User access token refreshed successfully")
            )
    } catch (error) {
        throw new apiError(401, error?.message || "Unautherized request")
    }
})

//Change Password

const changePassword = asyncHandler(async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    const user = await User.findById(req.user?._id)
    if (!user) {
        throw new apiError(401, "User not found")
    }
    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword)
    if (!isPasswordCorrect) {
        throw new apiError(400, "Incorrect old password")
    }
    user.password = newPassword
    await user.save({ validateBeforeSave: false })

    return res.status(200).json(
        new apiResponse(200, {}, "Password changed successfully")
    )
})

//get Current User

const getCurrentUser = asyncHandler(async (req, res) => {
    return res.status(200).json(
        new apiResponse(200, req.user, "User retrieved successfully")
    )
})


//updata Account Details

const updateAccountDetails = asyncHandler(async (req, res) => {
    const { fullName, email } = req.body
    if (!fullName || !email) {
        throw new apiError(400, "Full Name and Email are required")
    }
    const user = await User.findOneAndUpdate(req.user?._id, {
        $set: {
            fullName,
            email
        }
    },
        { new: true }
    ).select("-password")
    return res.status(200).json(
        new apiResponse(200, user, "User details updated successfully")
    )
})

// update user Profile Image

const updateUserProfileImage = asyncHandler(async (req, res) => {
    const profileImageLocalPath = req.file?.path
    if (!profileImageLocalPath) {
        throw new apiError(400, "Profile image not found")
    }
    const userForProfileImage = await User.findById(req.user?._id)
    if (!userForProfileImage) {
        throw new apiError(400, "User not found")
    }
    const oldProfileImage = await deleteInCloudinary(userForProfileImage.profileImage)
    if (!oldProfileImage) {
        throw new apiError(500, "Failed to delete old profile image")
    }
    const profileImg = await uploadOnCloudinary(profileImageLocalPath)
    if (!profileImg) {
        throw new apiError(500, "Failed to upload profile image")
    }
    const user = await User.findByIdAndUpdate(req.user?._id, {
        $set: {
            profileImage: profileImg.url
        }
    }, 
    {
        new:true
    }
).select("-password")
    return res.status(200).json(
        new apiError(200, user, "Profile updated Successfully")
    )
})


// update cover Image

const updateCoverImage = asyncHandler(async (req, res) => {
    const coverImageLocalPath = req.file?.path
    if (!coverImageLocalPath) {
        throw new apiError(400, "Cover image not found")
    }
    const userForCoverImage = await User.findById(req.user?._id)
    if (!userForCoverImage) {
        throw new apiError(400, "User not found")
    }
    const oldCoverImage = await deleteInCloudinary(userForCoverImage.coverImage)
    if (!oldCoverImage) {
        throw new apiError(500, "Failed to delete old cover image")
    }
    const coverImg = await uploadOnCloudinary(coverImageLocalPath)
    if (!coverImg.url) {
        throw new apiError(500, "Failed to upload cover image")
    }
    const user = await User.findByIdAndUpdate(req.user?._id, {
        $set: {
            coverImage: coverImg.url
        }
    }, {
        new: true
    }).select("-password")
    return res.status(200).json(
        new apiResponse(200, user, "Cover updated successfully")
    )
})

//get user profile

const getUserProfile = asyncHandler(async (req, res) => {
    const { username : userName } = req.params
    if (!userName?.trim()) {
        throw new apiError(400, 'Username is required')
    }

    const channel = await User.aggregate([
        {
            $match: {
                userName: userName?.toLowerCase()
            }
        },
        {
            $lookup: {
                from: "subscriptions",
                localField: "_id",
                foreignField: "channel",
                as: "subscribers"
            }
        },
        {
            $lookup: {
                from: "subscriptions",
                localField: "_id",
                foreignField: "subscriber",
                as: "subscribedTo"
            }
        },
        {
            $addFields: {
                subscriberCount: {
                    $size: "$subscribers"
                },
                channelSubscribedToCount: {
                    $size: "$subscribedTo"
                },
                isSubscribed: {
                    $cond: {
                        if: { $in: [req.user?._id, "$subscribers.subscriber"] },
                        then: true,
                        else: false
                    }
                }
            }
        },
        {
            $project: {
                fullName: 1,
                userName: 1,
                profileImage: 1,
                coverImage: 1,
                subscriberCount: 1,
                channelSubscribedToCount: 1,
                isSubscribed: 1,
                email: 1,

            }
        }
    ])
    if (!channel?.length) {
        throw new apiError(404, "channel does not exist")
    }

    return res.status(200)
        .json(
            new apiResponse(200, channel[0], "User channel fetched successfully")
        )
})
//export async function
export {
    registerUser,
    loginUser,
    logOutUser,
    refreshAccessToken,
    getCurrentUser,
    changePassword,
    updateAccountDetails,
    updateCoverImage,
    updateUserProfileImage,
    getUserProfile
}