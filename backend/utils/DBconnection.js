import mongoose from "mongoose";

const dbconnect = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log(`MongoDB connected and host name is : ${mongoose.connection.host}`);
  } catch (error) {
    console.log("Error connecting to database:", error);
  }
};

export default dbconnect;
