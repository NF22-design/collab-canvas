import { useEffect, useState, useCallback } from "react";
import { fetchRooms } from "../api/client.js";
import { useUser } from "../context/UserContext.jsx";
import { useNavigate } from "react-router-dom";
import RoomTable from "../Components/RoomTable.jsx";
import CreateRoomForm from "../Components/CreateRoomForm.jsx";

const RoomsPage = () => {
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useUser();
    const navigate = useNavigate();

    const loadRooms = useCallback(async () => {
        try {
            const data = await fetchRooms();
            setRooms(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (!user) {
            navigate("/");
            return;
        }
        loadRooms();
    }, [user, navigate, loadRooms]);

    if (loading) return <p>Loading rooms...</p>;

    return (
        <div className="rooms-page">
            <h1>Rooms</h1>
            <p>Welcome, {user?.username}</p>

            <CreateRoomForm onRoomCreated={loadRooms} />
            <RoomTable rooms={rooms} />
        </div>
    );
};

export default RoomsPage;