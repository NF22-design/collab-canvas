import Room from "../models/room.js";

export const getRooms = async (req, res) => {
    try {
        const rooms = await Room.find()
            .select("theme description participants createdAt")
            .sort({ createdAt: -1 });

        const shaped = rooms.map(room => ({
            id: room._id,
            theme: room.theme,
            description: room.description,
            participantCount: room.participants.length,
            maxParticipants: 3,
            createdAt: room.createdAt
        }));

        res.json(shaped);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Could not fetch rooms." });
    }
};

export const createRoom = async (req, res) => {
    try {
        const { theme, description, userId } = req.body;

        if (!theme || theme.trim().length === 0) {
            return res.status(400).json({ error: "Theme is required." });
        }
        if (!userId) {
            return res.status(400).json({ error: "userId is required." });
        }

        const room = await Room.create({
            theme: theme.trim(),
            description: description?.trim() || "",
            createdBy: userId,
            participants: [userId]
        });

        res.status(201).json(room);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Could not create room." });
    }
};

export const getRoomById = async (req, res) => {
    try {
        const room = await Room.findById(req.params.id).populate("participants", "username avatarUrl");
        if (!room) return res.status(404).json({ error: "Room not found." });
        res.json(room);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Could not fetch room." });
    }
};