import mongoose from "mongoose";

const connectDB = async () => {
    try {
        // Event listener for a successful connection
        mongoose.connection.on('connected', () => {
            console.log("DB Connected Successfully ✅");
        });

        // Event listener for active connection drops or handshaking errors
        mongoose.connection.on('error', (err) => {
            console.error("MongoDB Connection Error ❌: ", err);
        });

        console.log("Trying to connect MongoDB...");

        await mongoose.connect(`${process.env.MONGODB_URI}`, {
            serverSelectionTimeoutMS: 5000, // Drop out quickly in 5s if blocked to print errors clearly
            socketTimeoutMS: 45000,         
        });

    } catch (error) {
        console.error("MongoDB Initialization Failed 🚨: ", error.message);
    }
};

export default connectDB;