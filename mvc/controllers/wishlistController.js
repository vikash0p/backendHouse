import Wishlist from "../models/wishlistSchema.js";
import Product from "../models/productSchema.js";

// Add product to wishlist
export const addToWishlist = async (req, res) => {
    const { userId, productId } = req.body;

    try {
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        let wishlist = await Wishlist.findOne({ userId });

        if (!wishlist) {
            wishlist = new Wishlist({ userId, products: [] });
        }

        if (wishlist.products.includes(productId)) {
            return res.status(400).json({ message: "Product already in wishlist" });
        }

        wishlist.products.push(productId);

        await wishlist.save();
        res.status(200).json(wishlist);
    } catch (error) {
        res.status(500).json({ message: "Failed to add product to wishlist", error });
    }
};

// Remove product from wishlist
export const removeFromWishlist = async (req, res) => {
    const { userId, productId } = req.body;

    try {
        const wishlist = await Wishlist.findOne({ userId });

        if (!wishlist) {
            return res.status(404).json({ message: "Wishlist not found" });
        }

        wishlist.products = wishlist.products.filter(
            (product) => product.toString() !== productId
        );

        await wishlist.save();
        res.status(200).json(wishlist);
    } catch (error) {
        res.status(500).json({ message: "Failed to remove product from wishlist", error });
    }
};
