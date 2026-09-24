import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        trim: true,
        minlength: 2,
        maxlength: 20
    },
    avatarUrl: {
        type: String,
        default: null
    }
}, { timestamps: true });

const User = mongoose.model("User", userSchema);

export default User;