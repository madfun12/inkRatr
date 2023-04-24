import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import postRoutes from "./routes/posts.js";
import { createPost } from "./controllers/posts.js";
import { register } from "./controllers/auth.js";
import { verifyToken } from "./middleware/auth.js";
import User from "./models/User.js";
import Post from "./models/Post.js";
import { users, posts } from "./data/index.js";

// Middleware configs

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());
app.use("/assets", express.static(path.join(__dirname, "public/assets")));

// File storage scripts

const pfpStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "public/assets/pfp");
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    },
});

const pfpUpload = multer({ storage: pfpStorage });

const postStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "public/assets/posts");
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    },
});

const postUpload = multer({ storage: postStorage });

// Image route

app.post("/auth/register", pfpUpload.single("picture"), register);
app.post("/posts", verifyToken, postUpload.single("picture"), createPost);

// Routes

app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/posts", postRoutes);

// MONGOOSE

const port = process.env.PORT || 6001;
mongoose
    .connect(process.env.MONGO_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        app.listen(port, () => console.log(`Server Port: ${port}`));

        // User.insertMany(users);
        // Post.insertMany(posts);
    })
    .catch((error) => console.log(error));
