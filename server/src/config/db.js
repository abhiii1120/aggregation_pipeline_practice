import mongoose from "mongoose";
import { configDotenv } from "dotenv";

configDotenv();

export async function connectDB() {
  const mongoUri = process.env.MONGO_URI;
  await mongoose.connect(mongoUri);
  console.log("connected to database");
  return mongoose.connection;
}
