import mongoose from "mongoose";

const connectDB = async () => {
  try {
    mongoose.connection.on('connected', () => {
      console.log("DB Connected Successfully ✅");
    });

    mongoose.connection.on('error', (err) => {
      console.error("MongoDB Connection Error ❌: ", err);
    });

    mongoose.connection.on('disconnected', () => {
      console.log("MongoDB Disconnected ⚠️ - Reconnecting...");
    });

    console.log("Trying to connect MongoDB...");

    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 60000,
      connectTimeoutMS: 30000,
      maxPoolSize: 10,
      minPoolSize: 2,
      retryWrites: true,
      retryReads: true,
    });

    // Disable mongoose buffering
    mongoose.set('bufferCommands', false);

  } catch (error) {
    console.error("MongoDB Initialization Failed 🚨: ", error.message);
    process.exit(1);
  }
};

export default connectDB;