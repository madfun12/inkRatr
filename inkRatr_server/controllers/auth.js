import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

// Register
export const register = async (req, res) => {
    try {
        const {
            userName,
            firstName,
            lastName,
            email,
            password,
            pfpPath,
            location,
            friends,
        } = req.body;
        const salt = await bcrypt.genSalt();
        const passwordHash = await bcrypt.hash(password, salt);

        const newUser = new User({
            userName,
            firstName,
            lastName,
            email,
            password: passwordHash,
            pfpPath,
            location,
            friends,
        });

        const savedUser = await newUser.save();
        res.status(201).json(savedUser);
    } catch (error) {
        console.log(error);
        console.log(req.body);
        res.status(500).json({ error: error.message });
    }
};

//Logging in
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email: email });
        if (!user) {
            console.log("User does not exist");

            return res.status(400).json({ msg: "User does not exist. " });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            console.log("Invalid credentials");
            return res.status(400).json({ msg: "Invalid credentials. " });
        }
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
        delete user.password;
        res.status(200).json({ token, user });
    } catch (error) {
        console.log("Error logging in");
        res.status(500).json({ error: error.message });
    }
};
