import User from "../models/User.js";
// Read
export const getUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);
        res.status(200).json(user);
    } catch (error) {
        console.log("error getting user");
        res.status(404).json({ message: error.message });
    }
};

export const getUserFollowers = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);

        const followers = await Promise.all(
            user.followers.map((id) => User.findById(id))
        );

        const formattedfollowers = followers.map(
            ({ _id, firstName, lastName, pfpPath, location }) => {
                return { _id, firstName, lastName, pfpPath, location };
            }
        );
        res.status(200).json(formattedfollowers);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

export const addRemoveFollower = async (req, res) => {
    try {
        const { id, followerId } = req.params;
        const user = await User.findById(id);
        const follower = await User.findById(followerId);

        if (user.followers.includes(followerId)) {
            user.followers = user.followers.filter((id) => id !== followerId);
            follower.followers = user.followers.filter((id) => id !== id);
        } else {
            {
                user.followers.push(followerId);
                follower.followers.push(id);
            }
        }
        await user.save();
        await follower.save();

        const followers = await Promise.all(
            user.followers.map((id) => User.findById(id))
        );

        const formattedfollowers = followers.map(
            ({ _id, firstName, lastName, pfpPath }) => {
                return {
                    _id,
                    firstName,
                    lastName,
                    pfpPath,
                    location,
                };
            }
        );

        res.status(200).json(formattedfollowers);
    } catch (error) {
        console.log("error following user");
        res.status(404).json({ message: error.message });
    }
};

export const getUsers = async (req, res) => {
    try {
        const users = User.find();
        console.log(users);
        res.status(200).json(users);
    } catch (error) {}
};
