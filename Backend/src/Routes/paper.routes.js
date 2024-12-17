import {Router} from 'express'
import {
    getAllPapers,
    updatePaper,
    getPaperById,
    deletePaper,
    uploadPaper
} from "../Controllers/paper.controller.js";
import {verifyJWT} from '../Middlewares/auth.middleware.js'
import {upload} from '../Middlewares/multer.middleware.js'
const router = Router();
router.use(verifyJWT);
router
    .route("/")
    .get(getAllPapers)
    .post(
        upload.single("paperImage"),
        uploadPaper
    );

router
    .route("/:paperId")
    .get(getPaperById)
    .delete(deletePaper)
    .patch(upload.single("paperImage"), updatePaper);

    export default router