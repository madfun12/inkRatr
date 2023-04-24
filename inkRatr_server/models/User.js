import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
    {
        userName: {
            type: String,
            required: true,
            min: 4,
            max: 50,
            unique: true,
        },
        firstName: {
            type: String,
            required: true,
            min: 2,
            max: 50,
        },
        lastName: {
            type: String,
            required: true,
            min: 2,
            max: 50,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            max: 50,
        },
        password: {
            type: String,
            required: true,
            unique: true,
            min: 8,
        },
        pfpPath: {
            type: String,
            default: "",
        },
        followers: {
            type: [],
            default: [],
        },
        location: String,
    },
    { timestamps: true }
);

const User = mongoose.model("User", UserSchema);

export default User;
