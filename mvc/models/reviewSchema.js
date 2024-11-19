import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId, // Correct the `type` property here
        ref: "User", // Reference the `User` model
        required: true // Ensure this field is mandatory
    },
    productId:{
        type: mongoose.Schema.Types.ObjectId, // Correct the `type` property here
        ref: "Product", // Reference the `Product` model
        required: true // Ensure this field is mandatory
    },
    comment: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        min: 0,
        max: 5,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
});

const Review = mongoose.model("Review", reviewSchema);
export default Review;
4