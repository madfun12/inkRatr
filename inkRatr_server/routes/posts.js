import express from "express";
import {
    commentPost,
    getFeedPosts,
    getUserPosts,
    likePost,
    likeComment,
} from "../controllers/posts.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

router.get("/", verifyToken, getFeedPosts);
router.get("/:userId/posts", verifyToken, getUserPosts);

router.patch("/:id/like", verifyToken, likePost);
router.patch("/:id/comment", verifyToken, commentPost);
router.patch("/:id/:commentId/like", verifyToken, likeComment);

export default router;
