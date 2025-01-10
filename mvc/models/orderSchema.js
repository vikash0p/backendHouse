import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    color: { type: String, required: true },
    quantity: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true }, // Price at the time of order
});

const orderSchema = new mongoose.Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        items: [orderItemSchema],
        totalAmount: { type: Number, required: true }, // Total order value
        status: {
            type: String,
            enum: ["Pending", "Confirmed", "Shipped", "Delivered", "Cancelled"],
            default: "Pending",
        },
        shippingAddress: { type: mongoose.Schema.Types.ObjectId, ref: "Address", required: true },
        paymentMethod: {
            type: String,
            enum: ["COD", "Card", "NetBanking", "UPI" ,"Wallet","GiftCard"],
            required: true,
        },
    },
    { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);

export default Order;
