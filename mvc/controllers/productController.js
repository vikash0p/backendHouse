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
            order = 'asc',
            search = '',
            minPrice,
            maxPrice,
            minRating,
            ...filters
        } = req.query;

        const skip = (page - 1) * limit;
        const limitValue = parseInt(limit);
        const sortOrder = order === 'desc' ? -1 : 1;

        const filter = {};

        // Search filters
        if (search) {
            filter.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
                { category: { $regex: search, $options: 'i' } },
                { brand: { $regex: search, $options: 'i' } },
                { material: { $regex: search, $options: 'i' } },
            ];
        }

        // Category filter
        if (filters.category) {
            filter.category = { $in: Array.isArray(filters.category) ? filters.category : filters.category.split(',') };
        }

        // Brand filter
        if (filters.brand) {
            filter.brand = { $in: Array.isArray(filters.brand) ? filters.brand : filters.brand.split(',') };
        }

        // Material filter
        if (filters.material) {
            filter.material = { $in: Array.isArray(filters.material) ? filters.material : filters.material.split(',') };
        }

        // Color filter
        if (filters.color) {
            const color = Array.isArray(filters.color) ? filters.color : filters.color.split(',');
            filter.color = { $in: color };
        }

        // Location filter
        if (filters.location) {
            const location = Array.isArray(filters.location) ? filters.location : filters.location.split(',');
            filter.location = { $in: location };
        }

        // Price filter
        if (minPrice || maxPrice) {
            const priceFilter = {};
            if (minPrice) priceFilter.$gte = parseFloat(minPrice);
            if (maxPrice) priceFilter.$lte = parseFloat(maxPrice);
            filter.finalPrice = priceFilter;
        }

        // Rating filter
        if (minRating) {
            filter.rating = { $gte: parseFloat(minRating) };
        }

        // Sorting logic
        const sortOptions = {};
        switch (sortBy) {
            case 'priceHighToLow':
                sortOptions.finalPrice = -1;
                break;
            case 'priceLowToHigh':
                sortOptions.finalPrice = 1;
                break;
            case 'ratingHighToLow':
                sortOptions.rating = -1;
                break;
            case 'ratingLowToHigh':
                sortOptions.rating = 1;
                break;
            case 'alphabeticalAZ':
                sortOptions.title = 1;
                break;
            case 'alphabeticalZA':
                sortOptions.title = -1;
                break;
            default:
                sortOptions[sortBy] = sortOrder; // Fallback to original sorting mechanism
        }

        console.log('Filter:', filter);
        console.log('Sort Options:', sortOptions);

        // Fetch filtered products
        const products = await Product.find(filter)
            .skip(skip)
            .limit(limitValue)
            .sort(sortOptions);

        const totalProducts = await Product.countDocuments(filter);

        if (products.length === 0) {
            return res.status(404).json({ success: false, message: "No products found", products, totalProducts });
        }

        // Send response
        res.status(200).json({
            success: true,
            message: 'Products fetched successfully',
            totalProducts,
            totalPages: Math.ceil(totalProducts / limitValue),
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
