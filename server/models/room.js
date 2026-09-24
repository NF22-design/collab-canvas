import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    username: {
        type: String,
        required: true
    },
    text: {
        type: String,
        required: true,
        maxlength: 500
    }
}, { timestamps: true, _id: false });

const strokeSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    points: [{
        x: Number,
        y: Number
    }],
    color: {
        type: String,
        default: "#000000"
    },
    width: {
        type: Number,
        default: 3
    }
}, { timestamps: true, _id: false });

const roomSchema = new mongoose.Schema({
    theme: {
        type: String,
        required: true,
        trim: true,
        maxlength: 40
    },
    description: {
        type: String,
        trim: true,
        maxlength: 200,
        default: ""
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    participants: {
        type: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
        default: [],
        validate: {
            validator: (arr) => arr.length <= 3,
            message: "A room can have at most 3 participants."
        }
    },
    canvasState: {
        type: [strokeSchema],
        default: []
    },
    messages: {
        type: [messageSchema],
        default: []
    }
}, { timestamps: true });

const Room = mongoose.model("Room", roomSchema);

export default Room;