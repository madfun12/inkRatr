import Post from "../models/Post.js";
import User from "../models/User.js";

export const createPost = async (req, res) => {
    try {
        const { userId, description, picturePath } = req.body;
        const date = new Date();
        const user = await User.findById(userId);
        const newPost = new Post({
            userId,
            userName: user.userName,
            firstName: user.firstName,
            lastName: user.lastName,
            location: user.location,
            description,
            pfpPath: user.pfpPath,
            picturePath,
            likes: [],
            comments: [],
            dateCreated: date,
        });
        await newPost.save();

        const post = await Post.find();
        res.status(201).json(post);
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
};

export const getFeedPosts = async (req, res) => {
    try {
        const post = await Post.find();
        res.status(200).json(post);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

export const getUserPosts = async (req, res) => {
    try {
        const { userId } = req.params;
        const post = await Post.find({ userId });
        res.status(200).json(post);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

export const likePost = async (req, res) => {
    try {
        const { id } = req.params;
        const { userId } = req.body;
        const post = await Post.findById(id);
        const isLiked = post.likes.get(userId);

        if (isLiked) {
            post.likes.delete(userId);
        } else {
            post.likes.set(userId, true);
        }

        const updatedPost = await Post.findByIdAndUpdate(
            id,
            { likes: post.likes },
            { new: true }
        );
        res.status(200).json(updatedPost);
    } catch (error) {
        console.log("error liking post");
        res.status(404).json({ message: error.message });
    }
};

export const commentPost = async (req, res) => {
    try {
        const { id } = req.params;
        const postBody = req.body;
        console.log(postBody);

        const post = await Post.findById(id);
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }
        post.comments.push(postBody);

        const updatedPost = await post.save();
        res.status(200).json(updatedPost);
    } catch (error) {
        console.log("ah nuts");
        res.status(404).json({ message: error.message });
    }
};

export const likeComment = async (req, res) => {
    try {
        const { id, commentId } = req.params;
        const { userId } = req.body;
        const post = await Post.findById(id);

        console.log(post);

        const comment = post.comments.find(
            (comment) => comment._id.toString() === commentId.toString()
        );

        const isLiked = comment.likes.get(userId);

        if (isLiked) {
            comment.likes.delete(userId);
        } else {
            comment.likes.set(userId, true);
        }

        console.log("made it here!");
        const updatedPost = await Post.findOneAndUpdate(
            { _id: id, "comments._id": commentId },
            { $set: { "comments.$": comment } },
            { new: true }
        );

        res.status(200).json(updatedPost);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
