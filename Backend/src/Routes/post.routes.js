import {Router} from 'express'
import {
    getAllPosts,
    pulishedPost,
    getPostById,
    updatePost,
    deletePost
} from "../Controllers/post.controller.js";
import {verifyJWT} from '../Middlewares/auth.middleware.js'
import {upload} from '../Middlewares/multer.middleware.js'
const router = Router();
router.use(verifyJWT);
router
    .route("/")
    .get(getAllPosts)
    .post(
        upload.single("postImage"),
        pulishedPost
    );

router
    .route("/:postId")
    .get(getPostById)
    .delete(deletePost)
    .patch(upload.single("postImage"), updatePost);