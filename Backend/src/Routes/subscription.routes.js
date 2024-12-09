import { Router } from 'express';
import {
    toggleSubscription,
    getSubscribedChannel,
    getUserChannelSubscriber
} from "../controllers/subscription.controller.js"
import { verifyJWT } from '../Middlewares/auth.middleware.js'

const router = Router();
router.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file

router
    .route("/c/:channelId")
    .get(getSubscribedChannel)
    .post(toggleSubscription);

router.route("/u/:subscriberId").get(getUserChannelSubscriber);

export default router