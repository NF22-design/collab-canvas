import { useState } from "react";
import { createRoom } from "../api/client.js";
import { useUser } from "../context/UserContext.jsx";

const CreateRoomForm = ({ onRoomCreated }) => {
    const [theme, setTheme] = useState("");
    const [description, setDescription] = useState("");
    const [loading, setLoading] = useState(false);
    const { user } = useUser();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!theme.trim()) return;

        setLoading(true);
        try {
            await createRoom({ theme: theme.trim(), description: description.trim(), userId: user.id });
            setTheme("");
            setDescription("");
            onRoomCreated(); // tells the parent to refresh the room list
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="create-room-form">
            <input
                type="text"
                placeholder="Theme (e.g. 'Underwater city')"
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
                maxLength={40}
            />
            <input
                type="text"
                placeholder="Description (optional)"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                maxLength={200}
            />
            <button type="submit" disabled={loading || !theme.trim()}>
                {loading ? "Creating..." : "Create Room"}
            </button>
        </form>
    );
};

export default CreateRoomForm;