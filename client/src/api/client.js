const BASE_URL = "http://localhost:3000";

export const createUser = async ({ username, avatarFile }) => {
    const formData = new FormData();
    formData.append("username", username);
    if (avatarFile) {
        formData.append("avatar", avatarFile);
    }

    const res = await fetch(`${BASE_URL}/api/users`, {
        method: "POST",
        body: formData
    });

    if (!res.ok) throw new Error("Failed to create user.");
    return res.json();
};

export const fetchRooms = async () => {
    const res = await fetch(`${BASE_URL}/api/rooms`);
    if (!res.ok) throw new Error("Failed to fetch rooms.");
    return res.json();
};

export const createRoom = async ({ theme, description, userId }) => {
    const res = await fetch(`${BASE_URL}/api/rooms`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ theme, description, userId })
    });

    if (!res.ok) throw new Error("Failed to create room.");
    return res.json();
};

export { BASE_URL };