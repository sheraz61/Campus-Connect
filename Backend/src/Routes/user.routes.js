import {Router} from 'express'
import {
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
} from '../Controllers/user.controller.js'

import { upload } from '../Middlewares/multer.middleware.js'
import  {verifyJWT} from '../Middlewares/auth.middleware.js'

const router =Router();
router.route('/register').post(
    upload.fields([
        {
            name:'profileImage',
            maxCount:1
        },{
            name:'coverImage',
            maxCount:1
        }
    ]),registerUser
)
router.route('/login').post(loginUser)
//secured routes
router.route('/logout').post(verifyJWT,logOutUser)
router.route('/refresh-token').post(refreshAccessToken)
router.route('/change-password').post(verifyJWT,changePassword)
router.route('/current-user').get(verifyJWT,getCurrentUser)
router.route('/update-details').patch(verifyJWT,updateAccountDetails)
router.route('/profile-image').patch(verifyJWT,upload.single("avatar"),updateUserProfileImage)
router.route('/cover-image').patch(verifyJWT,upload.single("coverImage"),updateCoverImage)
router.route('/c/:username').get(verifyJWT,getUserProfile)
export default router