import mongoose from "mongoose";
const productSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    about: { type: String, default: "" },
    category: { type: String, required: true },
    image: { type: String, required: true },
    origin: { type: String, default: "" },
    originalPrice: { type: Number, required: true, default: 0 },
    discount: { type: Number, default: 0 },
    finalPrice: { type: Number, required: true },
    quantity: { type: Number, default: 0 },
    material: { type: String, default: "" },
    color: { type: [String], default: [] },
    stock: { type: Number, default: 0 },
    dimension: {
        length: { type: String, default: "" },
        width: { type: String, default: "" },
        height: { type: String, default: "" },
    },
    rating: { type: Number, min: 0, max: 5, default: 0 },
    brand: { type: String, default: "" },
    weight: { type: Number, default: 0 },
    location: { type: [String], default: [] },
    views: { type: Number, default: 0 }, // Added for tracking trending products
    sales: { type: Number, default: 0 }, // Added for tracking best sellers
}, { timestamps: true });

const Product = mongoose.model("Product", productSchema);
export default Product;
