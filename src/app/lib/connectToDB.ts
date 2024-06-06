import mongoose from "mongoose";

let isConnected: unknown = null;

export const connectToDB = async () => {
    try {
        if (isConnected) {
            console.log("Using existing connection");
            return;
        }
        const db = await mongoose.connect(process.env.MONGODB_URI as string);
        isConnected = db.connections[0].readyState;
        console.log("connected...");
    } catch (err) {
        if (err instanceof Error) {
            console.error(err.message);
        }
    }
}