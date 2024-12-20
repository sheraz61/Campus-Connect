import { Router } from "express";
import {
  getChannelStats,
  getChannelPosts,
} from "../Controllers/dashboard.controller.js"; // Adjust path as needed
import { verifyJWT } from "../Middlewares/auth.middleware.js"; // Adjust path as needed

const router = Router();

router.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file

// Route for fetching channel stats
router.route("/stats").get(getChannelStats);

// Route for fetching channel posts
router.route("/posts").get(getChannelPosts);

export default router;
