import mongoose from "mongoose";

const MONGO_IP = process.env.MONGO_IP || 'mongo';
const MONGO_PORT = process.env.MONGO_PORT || 27017;
const MONGO_USER = process.env.MONGO_USER;
const MONGO_PASS = process.env.MONGO_PASS;

const mongoURL = `mongodb://${MONGO_USER}:${MONGO_PASS}@${MONGO_IP}:${MONGO_PORT}/?authSource=admin`;

async function connectMongoDb () {
    try {
        await mongoose.connect(mongoURL);
        console.log('Successfully connected to db.');
    } catch (error) {
        console.error('Error connecting to db: ', error);
    }
}

export default connectMongoDb;