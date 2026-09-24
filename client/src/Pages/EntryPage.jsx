import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createUser } from "../api/client.js";
import { useUser } from "../context/UserContext.jsx";

const EntryPage = () => {
    const [username, setUsername] = useState("");
    const [avatarFile, setAvatarFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const { loginUser } = useUser();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (username.trim().length < 2) {
            setError("Username must be at least 2 characters.");
            return;
        }

        setLoading(true);
        try {
            const user = await createUser({ username: username.trim(), avatarFile });
            loginUser({
                id: user._id,
                username: user.username,
                avatarUrl: user.avatarUrl
            });
            navigate("/rooms");
        } catch (err) {
            console.error(err);
            setError("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="entry-page">
            <h1>Collective Canvas</h1>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Pick a username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    maxLength={20}
                />

                <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setAvatarFile(e.target.files[0])}
                />

                {error && <p className="error">{error}</p>}

                <button type="submit" disabled={loading}>
                    {loading ? "Joining..." : "Enter"}
                </button>
            </form>
        </div>
    );
};

export default EntryPage;