import Room from "../models/room.js";

const activeRooms = new Map();

const canvasSocket = (io) => {
    io.on("connection", (socket) => {
        console.log("Client connected:", socket.id);

        let currentRoomId = null;
        let currentUserId = null;

        socket.on("join-room", async ({ roomId, userId, username }) => {
            try {
                const room = await Room.findById(roomId);
                if (!room) {
                    return socket.emit("join-error", { message: "Room not found." });
                }

                if (!activeRooms.has(roomId)) {
                    activeRooms.set(roomId, new Set());
                }
                const liveUsers = activeRooms.get(roomId);

                if (liveUsers.size >= 3 && !liveUsers.has(socket.id)) {
                    return socket.emit("join-error", { message: "Room is full." });
                }

                socket.join(roomId);
                liveUsers.add(socket.id);
                currentRoomId = roomId;
                currentUserId = userId;
                socket.data.username = username;

                if (!room.participants.includes(userId)) {
                    room.participants.push(userId);
                    await room.save();
                }

                socket.emit("canvas-state", room.canvasState);
                socket.emit("chat-history", room.messages);

                socket.to(roomId).emit("user-joined", { userId, username, socketId: socket.id });

                io.to(roomId).emit("participant-count", liveUsers.size);

            } catch (err) {
                console.error("join-room error:", err);
                socket.emit("join-error", { message: "Could not join room." });
            }
        });

        socket.on("draw", ({ roomId, stroke }) => {
            if (roomId !== currentRoomId) return; // basic guard: ignore if they're not actually in this room

            socket.to(roomId).emit("draw", stroke);

            Room.findByIdAndUpdate(roomId, {
                $push: { canvasState: stroke }
            }).catch(err => console.error("Failed to persist stroke:", err));
        });

        socket.on("chat-message", ({ roomId, text }) => {
            if (roomId !== currentRoomId || !text?.trim()) return;

            const message = {
                userId: currentUserId,
                username: socket.data.username,
                text: text.trim().slice(0, 500),
                createdAt: new Date()
            };

            io.to(roomId).emit("chat-message", message);

            Room.findByIdAndUpdate(roomId, {
                $push: { messages: message }
            }).catch(err => console.error("Failed to persist message:", err));
        });

        socket.on("leave-room", () => {
            handleLeave(socket, currentRoomId, currentUserId, io);
            currentRoomId = null;
            currentUserId = null;
        });

        socket.on("disconnect", () => {
            console.log("Client disconnected:", socket.id);
            handleLeave(socket, currentRoomId, currentUserId, io);
        });
    });
};

const handleLeave = async (socket, roomId, userId, io) => {
    if (!roomId) return;

    const liveUsers = activeRooms.get(roomId);
    if (liveUsers) {
        liveUsers.delete(socket.id);
        if (liveUsers.size === 0) {
            activeRooms.delete(roomId);
        }
    }

    socket.leave(roomId);
    socket.to(roomId).emit("user-left", { userId, socketId: socket.id });
    io.to(roomId).emit("participant-count", liveUsers ? liveUsers.size : 0);

    if (userId) {
        try {
            await Room.findByIdAndUpdate(roomId, {
                $pull: { participants: userId }
            });
        } catch (err) {
            console.error("Failed to remove participant from DB:", err);
        }
    }
};

export default canvasSocket;