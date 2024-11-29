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
        const {
            page = 1,
            limit = 12,
            sortBy = 'finalPrice',
            search = '',
            minPrice,
            maxPrice,
            minRating,
            location, // Extract location
            ...filters
        } = req.query;

        const skip = (page - 1) * limit;
        const filter = {};

        // Search filters
        if (search) {
            filter.$or = ['title', 'description', 'category', 'brand', 'material'].map((field) => ({
                [field]: { $regex: search, $options: 'i' },
            }));
        }

        // Dynamic filter generation for array-based filters
        ['category', 'brand', 'material', 'color'].forEach((key) => {
            if (filters[key] && Array.isArray(filters[key])) {
                filter[key] = { $in: filters[key] };
            }
        });

        // Location filter (handles both string and array)
        if (location) {
            if (Array.isArray(location)) {
                filter.location = { $in: location }; // For arrays, match any location in the array
            } else {
                filter.location = location; // For strings, match the exact location
            }
        }

        // Price filter
        if (minPrice || maxPrice) {
            filter.finalPrice = {
                ...(minPrice && { $gte: parseFloat(minPrice) }),
                ...(maxPrice && { $lte: parseFloat(maxPrice) }),
            };
        }

        // Rating filter
        if (minRating) {
            filter.rating = { $gte: parseFloat(minRating) };
        }

        // Sorting options
        const sortOptions = {
            priceHighToLow: { finalPrice: -1 },
            priceLowToHigh: { finalPrice: 1 },
            ratingHighToLow: { rating: -1 },
            ratingLowToHigh: { rating: 1 },
            alphabeticalAZ: { title: 1 },
            alphabeticalZA: { title: -1 },
        }[sortBy] || { [sortBy]: 1 };

        // Fetch data
        const [products, totalProducts] = await Promise.all([
            Product.find(filter).skip(skip).limit(parseInt(limit)).sort(sortOptions),
            Product.countDocuments(filter),
        ]);

        if (!products.length) {
            return res.status(404).json({ success: false, message: "No products found", products, totalProducts });
        }

        res.status(200).json({
            success: true,
            message: 'Products fetched successfully',
            totalProducts,
            totalPages: Math.ceil(totalProducts / limit),
            currentPage: parseInt(page),
            products,
        });
    } catch (error) {
        console.error('Error fetching products:', error.message);
        res.status(500).json({ success: false, message: "Failed to fetch products", error: error.message });
    }
};





// Get a single product by ID
export const getProductById = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findById(id);
        const review = await Review.find({ productId: id })

        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }
        res.status(200).json({ success: true, message: "Product fetched successfully", product, review });
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
