import mongoose from "mongoose";

const houseSchema = new mongoose.Schema({
    id:String,
    title: String,
    category:String,
    location: String,
    price: Number,
    image: String,
    description: String,
});

const House=mongoose.model("House", houseSchema);
export default House;
