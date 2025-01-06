
import mongoose from "mongoose";
const salesSchema = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    salesCount: {
        type: Number,
        default: 0,
    },
}, { timestamps: true });

const Sales = mongoose.model("Sales", salesSchema);
export default Sales;