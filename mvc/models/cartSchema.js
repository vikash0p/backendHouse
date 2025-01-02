import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema({
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    color: { type: String, required: true }, // Added for selecting one color
    quantity: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true }, // Price of the item at the time of adding to cart
});

const cartSchema = new mongoose.Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        items: [cartItemSchema],
        totalAmount: { type: Number, required: true, default: 0 }, // Calculated value
    },
    { timestamps: true }
);

const Cart = mongoose.model("Cart", cartSchema);

export default Cart;
