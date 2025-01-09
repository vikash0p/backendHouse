import Order from "../models/orderSchema.js";
import Cart from "../models/cartSchema.js";
import Address from "../models/addressSchema.js";

// Place an Order
export const placeOrder = async (req, res) => {
    try {
        const { userId, shippingAddressId, paymentMethod } = req.body;

        // Validate required fields
        if (!userId || !shippingAddressId || !paymentMethod) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        // Fetch the user's cart
        const cart = await Cart.findOne({ userId }).populate("items.productId");
        if (!cart || cart.items.length === 0) {
            return res.status(400).json({ message: "Cart is empty" });
        }

        // Fetch the shipping address
        const address = await Address.findById(shippingAddressId);
        if (!address) {
            return res.status(404).json({ message: "Shipping address not found" });
        }

        // Calculate total amount
        const totalAmount = cart.items.reduce(
            (acc, item) => acc + item.quantity * item.price,
            0
        );

        // Create the order
        const order = new Order({
            userId,
            items: cart.items,
            totalAmount,
            shippingAddress: shippingAddressId,
            paymentMethod,
        });

        // Save the order
        await order.save();

        // Clear the user's cart
        cart.items = [];
        await cart.save();

        res.status(201).json({ message: "Order placed successfully", order });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "An error occurred while placing the order", error });
    }
};

// Get all orders for a user
export const getUserOrders = async (req, res) => {
    try {
        const { userId } = req.params;

        const orders = await Order.find({ userId })
            .populate("items.productId")
            .populate("shippingAddress")
            .sort({ createdAt: -1 });

        res.status(200).json({ orders });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "An error occurred while fetching orders", error });
    }
};

// Get a single order
export const getOrderById = async (req, res) => {
    try {
        const { orderId } = req.params;

        const order = await Order.findById(orderId)
            .populate("items.productId")
            .populate("shippingAddress");

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        res.status(200).json({ order });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "An error occurred while fetching the order", error });
    }
};
