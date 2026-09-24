import { useNavigate } from "react-router-dom";

const RoomTable = ({ rooms }) => {
    const navigate = useNavigate();

    if (rooms.length === 0) {
        return <p>No rooms yet — create the first one.</p>;
    }

    return (
        <table>
            <thead>
                <tr>
                    <th>Theme</th>
                    <th>Description</th>
                    <th>Players</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                {rooms.map((room) => {
                    const isFull = room.participantCount >= room.maxParticipants;
                    return (
                        <tr key={room.id}>
                            <td>{room.theme}</td>
                            <td>{room.description || "—"}</td>
                            <td>{room.participantCount}/{room.maxParticipants}</td>
                            <td>
                                <button
                                    disabled={isFull}
                                    onClick={() => navigate(`/canvas/${room.id}`)}
                                >
                                    {isFull ? "Full" : "Join"}
                                </button>
                            </td>
                        </tr>
                    );
                })}
            </tbody>
        </table>
    );
};

export default RoomTable;