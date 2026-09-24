import { Router } from 'express';
import upload from '../middlewares/upload.js';
import { createUser, getUser } from '../controllers/userController.js';
import { createRoom, getRooms, getRoomById } from '../controllers/roomController.js';

const router = Router();

router.post('/users', upload.single('avatar'), createUser);
router.get('/users/:id', getUser);

router.get('/rooms', getRooms);
router.post('/rooms', createRoom);
router.get('/rooms/:id', getRoomById);

export default router;