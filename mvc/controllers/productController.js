import Product from "../models/productSchema.js";
import Review from "../models/reviewSchema.js";


// Create a new product
export const createProduct = async (req, res) => {
    try {
        const productData = req.body; // Expecting product data in the request body
        const product = new Product(productData);
        await product.save();
        res.status(201).json({ success: true, message: "Product created successfully", product });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to create product", error: error.message });
    }
};

// Get all products
export const getAllProducts = async (req, res) => {
    try {
        // Get query parameters
        const { page = 1, limit = 12, sortBy = 'price', order = 'asc', ...filters } = req.query;

        // Set pagination options
        const skip = (page - 1) * limit;
        const limitValue = parseInt(limit);
        const sortOrder = order === 'desc' ? -1 : 1;

        // Build the filter object dynamically
        const filter = {};

        if (filters.category) filter.category = filters.category;
        if (filters.brand) filter.brand = filters.brand;
        if (filters.rating) filter.rating = { $gte: parseFloat(filters.rating) };
        if (filters.material) filter.material = filters.material;

        // Fetch the products with filtering, sorting, and pagination
        const products = await Product.find(filter)
            .skip(skip)
            .limit(limitValue)
            .sort({ [sortBy]: sortOrder });

        // Count the total number of products for pagination
        const totalProducts = await Product.countDocuments(filter);

        if (products.length === 0) {
            return res.status(404).json({ success: false, message: "No products found" });
        }

        res.status(200).json({
            success: true,
            message: 'Products fetched successfully',
            totalProducts,
            totalPages: Math.ceil(totalProducts / limitValue),
            currentPage: parseInt(page),
            products,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to fetch products", error: error.message });
    }
};


// Get a single product by ID
export const getProductById = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findById(id);
        const review= await Review.find({ productId:id})

        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }
        res.status(200).json({ success: true, message: "Product fetched successfully", product,review });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to fetch product", error: error.message });
    }
};
// Update a product by ID
export const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedData = req.body;
        const product = await Product.findByIdAndUpdate(id, updatedData, { new: true, runValidators: true });
        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }
        res.status(200).json({ success: true, message: "Product updated successfully", product });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to update product", error: error.message });
    }
};

// Delete a product by ID
export const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findByIdAndDelete(id);
        await Review.deleteMany({ productId: id });
        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }
        res.status(200).json({ success: true, message: "Product deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to delete product", error: error.message });
    }
};
