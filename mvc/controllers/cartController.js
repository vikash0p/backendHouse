import Cart from "../models/cartSchema.js";
import Product from "../models/productSchema.js";

// Add item to cart
export const addProductToCart = async (req, res) => {
    const { userId, productId, quantity } = req.body;
    console.log("🚀 ~ file: cartController.js:7 ~ req.body:", req.body);
    console.log("🚀 ~ file: cartController.js:7 ~ productId:", productId);

    try {
        // Validate product
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        // Get or create cart
        let cart = await Cart.findOne({ userId });
        if (!cart) {
            cart = new Cart({ userId, items: [], totalAmount: 0 });
        }

        // Check if item already exists in the cart
        const existingItem = cart.items.find((item) => item.productId.toString() === productId);

        if (existingItem) {
            // Update existing item
            existingItem.quantity += quantity;
            existingItem.price = product.finalPrice * existingItem.quantity;
        } else {
            // Add new item to the cart
            cart.items.push({
                productId,
                quantity,
                price: product.finalPrice * quantity,
            });
        }

        // Reverse the items array
        cart.items.reverse();

        // Update total amount
        cart.totalAmount = cart.items.reduce((sum, item) => sum + item.price, 0);

        await cart.save();
        res.status(200).json({
            message: "Item added to cart successfully",
            cartLength: cart.items.length,
            cart
        });
    } catch (error) {
        res.status(500).json({ message: "Failed to add item to cart", error });
    }
};


// Remove item from cart
export const removeProductFromCart = async (req, res) => {
    const { userId, productId } = req.body;

    try {
        // Find cart
        const cart = await Cart.findOne({ userId });
        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }

        // Remove the item
        const updatedItems = cart.items.filter((item) => item.productId.toString() !== productId);
        if (updatedItems.length === cart.items.length) {
            return res.status(404).json({ message: "Product not found in cart" });
        }

        cart.items = updatedItems;

        // Update total amount
        cart.totalAmount = cart.items.reduce((sum, item) => sum + item.price, 0);

        await cart.save();
        res.status(200).json({ message: "Item removed from cart successfully",cartLength: cart.items.length, cart });
    } catch (error) {
        res.status(500).json({ message: "Failed to remove item from cart", error });
    }
};

// Get cart
export const getCart = async (req, res) => {
    const { userId } = req.query;

    try {
        const cart = await Cart.findOne({ userId }).populate("items.productId", "title finalPrice image");
        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }

        res.status(200).json({
            message: "Cart fetched successfully",
            cartLength: cart.items.length,
            cart,
        });
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch cart", error });
    }
};

// Update cart
export const updateCart = async (req, res) => {
    const { userId, productId, quantity } = req.body;

    try {
        const cart = await Cart.findOne({ userId });
        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }

        const item = cart.items.find((item) => item.productId.toString() === productId);
        if (!item) {
            return res.status(404).json({ message: "Product not found in cart" });
        }

        // Update quantity or remove if quantity is 0
        if (quantity > 0) {
            item.quantity = quantity;
            const product = await Product.findById(productId);
            item.price = product.finalPrice * quantity;
        } else {
            cart.items = cart.items.filter((item) => item.productId.toString() !== productId);
        }

        // Update total amount
        cart.totalAmount = cart.items.reduce((sum, item) => sum + item.price, 0);

        await cart.save();
        res.status(200).json({ message: "Cart updated successfully", cart ,cartLength: cart.items.length});
    } catch (error) {
        res.status(500).json({ message: "Failed to update cart", error });
    }
};
