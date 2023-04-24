import express from "express";
import {
    getUser,
    getUserFollowers,
    addRemoveFollower,
    getUsers,
} from "../controllers/users.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

router.get("/", verifyToken, getUsers);
router.get("/:id", verifyToken, getUser);
router.get("/:id/followers", verifyToken, getUserFollowers);

router.patch("/:id/:followerId", verifyToken, addRemoveFollower);

export default router;
