import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        auto: true,
    },
    userId: {
        type: String,
        required: true,
    },
    userName: {
        type: String,
        required: true,
    },
    comment: {
        type: String,
        required: true,
    },
    likes: {
        type: Map,
        of: Boolean,
    },
    dateCreated: String,
});

const postSchema = mongoose.Schema(
    {
        userId: {
            type: String,
            required: true,
        },
        userName: {
            type: String,
            required: true,
        },
        firstName: {
            type: String,
            required: true,
        },
        lastName: {
            type: String,
            required: true,
        },
        location: String,
        description: String,
        picturePath: String,
        pfpPath: String,
        likes: {
            type: Map,
            of: Boolean,
        },
        comments: {
            type: [commentSchema],
            default: [],
        },
        dateCreated: String,
    },
    { timestamps: true }
);

const Post = mongoose.model("Post", postSchema);

export default Post;
