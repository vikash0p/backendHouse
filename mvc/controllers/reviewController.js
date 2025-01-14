import Review from "../models/reviewSchema.js";

// Create a new review
export const createReview = async (req, res) => {
try {
    const { userId, productId, comment, rating } = req.body;

    // Validate input
    if (!userId || !productId || !comment || typeof rating !== "number") {
        return res.status(400).json({ success: false, message: "Invalid input" });
    }

    // Create and save the review
    const review = new Review({ userId, productId, comment, rating });
    await review.save();

    res.status(201).json({ success: true, message: "Review created successfully", review });
} catch (error) {
    res.status(500).json({ success: false, message: "Failed to create review", error: error.message });
}
};


// Get all reviews
export const getReviews = async (req, res) => {
    try {
        const reviews = (await Review.find()
            .populate("userId", "name email")
            .populate("productId", "title category"))
            .reverse(); // Reverse the order of reviews

        res.status(200).json({ success: true, reviews });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to fetch reviews", error: error.message });
    }
};


// Get a review by ID
export const getReviewById = async (req, res) => {
    try {
        const { id } = req.params;
        const review = await Review.findById(id)
            .populate("userId", "name email")
            .populate("productId", "title category");

        if (!review) {
            return res.status(404).json({ success: false, message: "Review not found" });
        }

        res.status(200).json({ success: true, review });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to fetch review", error: error.message });
    }
};


// Update a review by ID
export const updateReview = async (req, res) => {
    try {
        const { id } = req.params;
        const { comment, rating } = req.body;

        const review = await Review.findByIdAndUpdate(
            id,
            { comment, rating },
            { new: true, runValidators: true }
        );

        if (!review) {
            return res.status(404).json({ success: false, message: "Review not found" });
        }

        res.status(200).json({ success: true, message: "Review updated successfully", review });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to update review", error: error.message });
    }
};


// Delete a review by ID
export const deleteReview = async (req, res) => {
    try {
        const { id } = req.params;

        const review = await Review.findByIdAndDelete(id);

        if (!review) {
            return res.status(404).json({ success: false, message: "Review not found" });
        }

        res.status(200).json({ success: true, message: "Review deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to delete review", error: error.message });
    }
};


// Get reviews by Product ID
export const getReviewsByProductId = async (req, res) => {
    try {
        const { productId } = req.params;

        // Validate input
        if (!productId) {
            return res.status(400).json({ success: false, message: "Product ID is required" });
        }

        // Fetch reviews for the specified product ID, sorted by creation date (newest first)
        const reviews = await Review.find({ productId })
            .populate("userId", "name email")
            .populate("productId", "title category")
            .sort({ createdAt: -1 }); // Sort by `createdAt` in descending order

        if (reviews.length === 0) {
            return res.status(404).json({ success: false, message: "No reviews found for this product" });
        }

        // Calculate average rating
        const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
        const averageRating = (totalRating / reviews.length).toFixed(1);

        res.status(200).json({
            success: true,
            averageRating,
            message: "Reviews fetched successfully",
            reviews,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to fetch reviews", error: error.message });
    }
};



// Get reviews by User ID
export const getReviewsByUserId = async (req, res) => {
    try {
        const { userId } = req.params;

        // Validate input
        if (!userId) {
            return res.status(400).json({ success: false, message: "User ID is required" });
        }

        // Fetch reviews for the specified user ID
        const reviews = await Review.find({ userId })
            .populate("userId", "name email")
            .populate("productId", "title category image finalPrice")
            .sort({ createdAt: -1 }); // Sort by `createdAt` in descending order

        if (reviews.length === 0) {
            return res.status(404).json({ success: false, message: "No reviews found for this user" });
        }

        // Calculate average rating
        const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
        const averageRating = (totalRating / reviews.length).toFixed(1);

        res.status(200).json({
            success: true,
            averageRating,
            message: "Reviews fetched successfully",
            reviews,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to fetch reviews", error: error.message });
    }
};