import { useEffect, useRef, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext.jsx";
import socket from "../api/socket";
import { drawStroke, redrawAll } from "../utils/canvasUtils.js";
import ChatPanel from "../Components/ChatPanel.jsx";

const COLORS = ["#000000", "#e03131", "#2f9e44", "#1971c2", "#f08c00"];

const CanvasPage = () => {
    const { roomId } = useParams();
    const { user } = useUser();
    const navigate = useNavigate();

    const canvasRef = useRef(null);
    const ctxRef = useRef(null);
    const isDrawing = useRef(false);
    const currentStroke = useRef(null);
    const strokesRef = useRef([]); // full history for redraws (e.g. on resize)

    const [color, setColor] = useState(COLORS[0]);
    const [brushWidth, setBrushWidth] = useState(3);
    const [participants, setParticipants] = useState(1);
    const [joinError, setJoinError] = useState("");

    useEffect(() => {
        if (!user) navigate("/");
    }, [user, navigate]);

    useEffect(() => {
        const canvas = canvasRef.current;
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
        ctxRef.current = canvas.getContext("2d");
    }, []);

    useEffect(() => {
        if (!user) return;

        socket.connect();

        socket.emit("join-room", {
            roomId,
            userId: user.id,
            username: user.username
        });

        socket.on("join-error", ({ message }) => {
            setJoinError(message);
        });

        socket.on("canvas-state", (strokes) => {
            strokesRef.current = strokes;
            redrawAll(ctxRef.current, canvasRef.current, strokes);
        });

        socket.on("draw", (stroke) => {
            strokesRef.current.push(stroke);
            drawStroke(ctxRef.current, stroke);
        });

        socket.on("participant-count", (count) => {
            setParticipants(count);
        });

        socket.on("user-joined", ({ username }) => {
            console.log(`${username} joined`);
        });

        socket.on("user-left", ({ userId }) => {
            console.log(`User ${userId} left`);
        });

        socket.on("connect", () => {
            socket.emit("join-room", { roomId, userId: user.id, username: user.username });
        });

        return () => {
            socket.emit("leave-room");
            socket.off("join-error");
            socket.off("canvas-state");
            socket.off("draw");
            socket.off("participant-count");
            socket.off("user-joined");
            socket.off("user-left");
            socket.off("connect");
            socket.disconnect();
        };
    }, [roomId, user]);

    const getPos = (e) => {
        const rect = canvasRef.current.getBoundingClientRect();
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        return { x: clientX - rect.left, y: clientY - rect.top };
    };

    const startDrawing = (e) => {
        isDrawing.current = true;
        const pos = getPos(e);
        currentStroke.current = {
            id: `${user.id}-${Date.now()}`,
            userId: user.id,
            points: [pos],
            color,
            width: brushWidth
        };
    };

    const draw = (e) => {
        if (!isDrawing.current) return;
        const pos = getPos(e);
        currentStroke.current.points.push(pos);

        const ctx = ctxRef.current;
        const pts = currentStroke.current.points;
        const len = pts.length;
        if (len >= 2) {
            ctx.strokeStyle = color;
            ctx.lineWidth = brushWidth;
            ctx.lineCap = "round";
            ctx.beginPath();
            ctx.moveTo(pts[len - 2].x, pts[len - 2].y);
            ctx.lineTo(pts[len - 1].x, pts[len - 1].y);
            ctx.stroke();
        }
    };

    const stopDrawing = useCallback(() => {
        if (!isDrawing.current) return;
        isDrawing.current = false;

        const stroke = currentStroke.current;
        if (stroke && stroke.points.length > 1) {
            strokesRef.current.push(stroke);
            socket.emit("draw", { roomId, stroke });
        }
        currentStroke.current = null;
    }, [roomId]);

    if (joinError) {
        return (
            <div className="canvas-page-error">
                <p>{joinError}</p>
                <button onClick={() => navigate("/rooms")}>Back to rooms</button>
            </div>
        );
    }

    return (
        <div className="canvas-page">
            <div className="canvas-half">
                <div className="toolbar">
                <button onClick={() => navigate("/rooms")}>← Leave</button>

                <div className="colors">
                    {COLORS.map((c) => (
                        <button
                            key={c}
                            className={`color-swatch ${color === c ? "selected" : ""}`}
                            style={{ backgroundColor: c }}
                            onClick={() => setColor(c)}
                        />
                    ))}
                </div>

                <input
                    type="range"
                    min="1"
                    max="15"
                    value={brushWidth}
                    onChange={(e) => setBrushWidth(Number(e.target.value))}
                />

                <span className="participant-count">{participants}/3 in room</span>
                </div>

                <canvas
                    ref={canvasRef}
                    className="drawing-canvas"
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}
                    onTouchStart={startDrawing}
                    onTouchMove={draw}
                    onTouchEnd={stopDrawing}
                />
            </div>
            <div className="chat-half">
                <ChatPanel roomId={roomId} currentUserId={user.id} />
            </div>
        </div>
    );
};

export default CanvasPage;