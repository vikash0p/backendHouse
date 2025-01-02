import Product from "../models/productSchema.js";
import Cart from '../models/cartSchema.js'


export const addItemToCart = async (req, res) => {
    const { userId, productId, color, quantity } = req.body;

    // Validate request body
    if (!userId || !productId || !color || !quantity) {
        return res.status(400).json({ message: "All fields are required." });
    }

    if (quantity <= 0 || quantity > 5) {
        return res.status(400).json({ message: "Quantity must be between 1 and 5." });
    }

    try {
        // Check if the product exists
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: "Product not found." });
        }

        // Validate selected color
        if (!product.color.includes(color)) {
            return res.status(400).json({ message: "Invalid color selection." });
        }

        const price = product.finalPrice;

        // Find or create cart for the user
        let cart = await Cart.findOne({ userId }).populate("items.productId", "title image finalPrice");
        if (!cart) {
            cart = new Cart({ userId, items: [], totalAmount: 0 });
        }

        // Restrict the number of items in the cart to 10
        if (cart.items.length >= 10) {
            return res.status(400).json({ message: "You can only add up to 10 items to the cart." });
        }

        // Check if the item already exists in the cart
        const existingItem = cart.items.find(
            (item) => item.productId._id.toString() === productId && item.color === color
        );

        if (existingItem) {
            // Check if the updated quantity exceeds the limit
            if (existingItem.quantity + quantity > 5) {
                return res.status(400).json({ message: "Quantity for each product cannot exceed 5." });
            }
            // Update quantity if the item already exists
            existingItem.quantity += quantity;
        } else {
            // Add new item to the cart
            cart.items.push({ productId, color, quantity, price });
        }

        // Recalculate total amount
        cart.totalAmount = calculateTotalAmount(cart.items);

        // Save the cart
        await cart.save();

        // Fetch updated cart with populated data
        const updatedCart = await Cart.findOne({ userId }).populate("items.productId", "title image finalPrice");

        res.status(201).json({
            message: "Item added to cart successfully.",
            cartLength: updatedCart.items.length,
            cart: updatedCart
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Helper function to calculate total amount
const calculateTotalAmount = (items) => {
    return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
};




// Get cart for a user
export const getCart = async (req, res) => {
    const { userId } = req.params;

    try {
        // Fetch cart for the given user and populate product details
        const cart = await Cart.findOne({ userId }).populate("items.productId", "title image finalPrice color");

        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }

        // Calculate total products and total amount
        const totalProducts = cart.items.reduce((count, item) => count + item.quantity, 0);
        const totalAmount = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

        // Construct response
        const response = {
            cartId: cart._id,
            userId: cart.userId,
            totalProducts,
            totalQuantity:cart.items.length,
            totalAmount,
            items: cart.items.map((item) => ({
                id: item._id,
                productId: item.productId._id,
                title: item.productId.title,
                image: item.productId.image,
                color: item.color,
                quantity: item.quantity,
                price: item.price,
                total: item.price * item.quantity, // Total for this item
            })),

        };

        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// Update cart item
export const updateCartItem = async (req, res) => {
    const { cartItemId } = req.params;
    const { quantity, color } = req.body;

    // Validate request body
    if (quantity !== undefined && (quantity <= 0 || quantity > 5)) {
        return res.status(400).json({ message: "Quantity must be between 1 and 5." });
    }

    try {
        const cart = await Cart.findOne({ "items._id": cartItemId });
        if (!cart) {
            return res.status(404).json({ message: "Cart item not found." });
        }

        const item = cart.items.find((item) => item._id.toString() === cartItemId);
        if (!item) {
            return res.status(404).json({ message: "Cart item not found in cart." });
        }

        // Update the item's properties if valid
        if (quantity !== undefined) item.quantity = quantity;
        if (color) {
            const product = await Product.findById(item.productId);
            if (!product.color.includes(color)) {
                return res.status(400).json({ message: "Invalid color selection." });
            }
            item.color = color;
        }

        // Recalculate total amount
        cart.totalAmount = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

        // Save the updated cart
        await cart.save();

        res.status(200).json({
            message: "Cart item updated successfully.",
            cart
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// Delete cart item
export const deleteCartItem = async (req, res) => {
    const { cartItemId } = req.params;

    try {
        // Find the cart containing the specific item
        const cart = await Cart.findOne({ "items._id": cartItemId });
        if (!cart) {
            return res.status(404).json({ message: "Cart item not found" });
        }

        // Remove the specific item from the cart's items array
        cart.items = cart.items.filter((item) => item._id.toString() !== cartItemId);

        // Recalculate the total amount
        cart.totalAmount = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

        // Save the updated cart
        await cart.save();

        res.status(200).json({
            message: "Item removed from cart successfully.",
            cart
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
