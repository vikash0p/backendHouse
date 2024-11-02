import mongoose from "mongoose";
const uri ='mongodb+srv://vikash2000158:vikash2000158@cluster0.yjmjfvh.mongodb.net/house';

const connectDB = async () => {
    try {
        await mongoose.connect(uri);
        console.log("Database Connected");
    } catch (error) {
        console.log(error);
    }
};

export default connectDB;