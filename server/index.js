import express from "express";
import cors from "cors";
import { createServer } from 'http';
import { Server } from "socket.io";
import connectMongoDb from "./config/db.js";
import router from './routes/router.js';
import canvasSocket from "./sockets/canvasSocket.js";
import "dotenv/config";

const port = process.env.PORT || 3000;

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: { origin: process.env.CLIENT_URL || "http://localhost:5173" }
});

connectMongoDb();

app.use(express.json());
app.use('/uploads', express.static('uploads'));
app.use(cors());

app.use('/api', router);

canvasSocket(io);

httpServer.listen(port, () => {
    console.log('The app is listening on port: ', port);
});