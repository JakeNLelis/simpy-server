import mongoose from "mongoose";

const connectToDb = async () => {
  try {
    const db = await mongoose.connect(process.env.MONGODB_URI).then(() => {
      console.log("Connected to MongoDB");
    });
  } catch (error) {
    console.log("Counld not connect to the database ", error);
    process.exit(1);
  }
};

export default connectToDb;
