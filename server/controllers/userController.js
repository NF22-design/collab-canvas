import User from "../models/user.js";

export const createUser = async (req, res) => {
    try {
        const { username } = req.body;

        if (!username || username.trim().length < 2) {
            return res.status(400).json({ error: "Username must be at least 2 characters." });
        }

        const avatarUrl = req.file ? `/uploads/${req.file.filename}` : null;

        const user = await User.create({
            username: username.trim(),
            avatarUrl
        });

        res.status(201).json(user);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Could not create user." });
    }
};

export const getUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ error: "User not found." });
        res.json(user);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Could not fetch user." });
    }
};