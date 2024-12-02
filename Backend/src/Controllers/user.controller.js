import { User } from '../Models/users.models.js'
import asyncHandler from '../Utils/asyncHandler.js'
import { apiResonse, apiResponse } from '../Utils/apiResponse.js'
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


    const avatarLocalPath = req.files?.avatar[0]?.path;

    let coverImagePath;
    if (req.files && Array.isArray(req.files.coverimage) && req.files.coverimage.length > 0) {
        coverImagePath = req.files.coverimage[0].path;
    }
    if (!avatarLocalPath) {
        throw new apiError(400, 'Avatar not found')
    }
    //upload them to cloudinary, avatar check after upload
    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverimage = await uploadOnCloudinary(coverImagePath)
    if (!avatar) {
        throw new apiError(400, 'Avatar not found')
    }
    const user = await User.create({
        fullName,
        email,
        userName: userName.toLowerCase(),
        password,
        avatar: avatar.url,
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