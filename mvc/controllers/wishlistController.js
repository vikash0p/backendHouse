import Wishlist from "../models/wishlistSchema.js";
import Product from "../models/productSchema.js";


//! Add item to wishlist
export const addItemToWishlist = async (req, res) => {
    const { userId, productId, color } = req.body;

    if (!userId || !productId || !color) {
        return res.status(400).json({ message: "All fields are required." });
    }


    try {
        // Check if the product exists
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: "Product not found." });
        }

        // Validate the selected color
        if (!product.color.includes(color)) {
            return res.status(400).json({ message: "Invalid color selection." });
        }

        // Find or create wishlist for the user
        let wishlist = await Wishlist.findOne({ userId }).populate("items.productId", "title image finalPrice");
        console.log("🚀 ~ file: wishlistController.js:28 ~ wishlist:", wishlist);
        if (!wishlist) {
            wishlist = new Wishlist({ userId, items: [] });
        }

        // Check for duplicates in the wishlist
        const isDuplicate = wishlist.items.find((item) => item.productId._id.toString() === productId  && item.color === color );
        console.log("🚀 ~ file: wishlistController.js:34 ~ isDuplicate:", isDuplicate);

        if (isDuplicate) {
            return res.status(400).json({ message: "Product already exists in the wishlist." });


        }

        // Add the product to the wishlist
        wishlist.items.push({ productId, color });

        // Save the updated wishlist
        await wishlist.save();

        res.status(201).json({
            message: "Product added to wishlist successfully.",
            wishlistLength: wishlist.items.length,
            wishlist,
        });
    } catch (error) {
        res.status(500).json({
            message: "An error occurred while adding the item to the wishlist.",
            error: error.message,
        });
    }
};





//! Get wishlist
export const getWishlist = async (req, res) => {
    const { userId } = req.params;

    if (!userId) {
        return res.status(400).json({ message: "User ID is required." });
    }

    try {
        // Fetch wishlist for the user and populate product details
        const wishlist = await Wishlist.findOne({ userId }).populate("items.productId", "title image finalPrice color");
        console.log("🚀 ~ file: wishlistController.js:71 ~ wishlist:", wishlist);

        if (!wishlist || wishlist.items.length === 0) {
            return res.status(404).json({ message: "Wishlist is empty or not found." });
        }

        // Remove duplicate items based on productId and color
        const uniqueItemsMap = new Map();
        wishlist.items.forEach((item) => {
            const uniqueKey = `${item.productId?._id}-${item.color}`;
            if (!uniqueItemsMap.has(uniqueKey)) {
                uniqueItemsMap.set(uniqueKey, {
                    id: item._id,
                    productId: item.productId?._id,
                    title: item.productId?.title,
                    image: item.productId?.image,
                    price: item.productId?.finalPrice,
                    color: item.color,
                    addedAt: item.addedAt,
                });
            }
        });

        const uniqueItems = Array.from(uniqueItemsMap.values());

        console.log(uniqueItems);
        res.status(200).json({
            userId: wishlist.userId,
            items: uniqueItems,
        });
    } catch (error) {
        res.status(500).json({ message: "An error occurred while fetching the wishlist.", error: error.message });
    }
};




//! Remove item from wishlist
export const removeItemFromWishlist = async (req, res) => {
    const { wishlistItemId } = req.params;
    const { color } = req.body; // Optionally specify color for removal

    try {
        // Find the wishlist containing the specific item
        const wishlist = await Wishlist.findOne({ "items._id": wishlistItemId });
        if (!wishlist) {
            return res.status(404).json({ message: "Wishlist not found." });
        }

        // Find the specific item within the wishlist
        const item = wishlist.items.find(item => item._id.toString() === wishlistItemId);
        if (!item) {
            return res.status(404).json({ message: "Wishlist item not found." });
        }

        // Remove the specific item from the wishlist, optionally filtering by color
        if (color) {
            wishlist.items = wishlist.items.filter(
                (item) => item._id.toString() !== wishlistItemId || item.color !== color
            );
        } else {
            wishlist.items = wishlist.items.filter(
                (item) => item._id.toString() !== wishlistItemId
            );
        }

        // Save the updated wishlist
        await wishlist.save();

        res.status(200).json({
            message: "Item removed from wishlist successfully.",
            wishlist
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


