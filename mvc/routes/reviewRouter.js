import express from "express";
import {createReview,getReviews,getReviewById,updateReview,deleteReview,getReviewsByProductId ,getReviewsByUserId} from "../controllers/reviewController.js";

const reviewRouter = express.Router();

// Create a new review
reviewRouter.post("/", createReview);

// Get all reviews
reviewRouter.get("/", getReviews);

// Get a review by ID
reviewRouter.get("/:id", getReviewById);

reviewRouter.get("/product/:productId", getReviewsByProductId);
reviewRouter.get("/user/:userId", getReviewsByUserId);


// Update a review by ID
reviewRouter.put("/:id", updateReview);

// Delete a review by ID
reviewRouter.delete("/:id", deleteReview);




export default reviewRouter;
