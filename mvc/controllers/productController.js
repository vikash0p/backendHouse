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
            discount,
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
        // ['category', 'brand', 'material', 'color'].forEach((key) => {
        //     if (filters[key] && Array.isArray(filters[key])) {
        //         filter[key] = { $in: filters[key] };
        //     }
        // });

        ['category', 'brand', 'material', 'color','location'].forEach((key) => {
            if (filters[key]) {
                if (Array.isArray(filters[key])) {
                    // Handle multi-value (array) case
                    filter[key] = { $in: filters[key] };
                } else {
                    // Handle single-value case
                    filter[key] = filters[key];
                }
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

        if(discount) {
            filter.discount = { $gte: parseFloat(discount) };
        }
        console.log(filter)

        // Sorting options
        const sortOptions = {
            default: { _id: -1 },
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



// Get trending products
export const getTrendingProducts = async (req, res) => {
    try {
        const { limit = 10 } = req.query;

        // Trending logic: Sort by most views, purchases, or other relevant metric
        const trendingProducts = await Product.find({})
            .sort({ views: -1 }) // Assuming a 'views' field exists
            .limit(parseInt(limit));

        if (!trendingProducts.length) {
            return res.status(404).json({ success: false, message: "No trending products found" });
        }

        res.status(200).json({
            success: true,
            message: "Trending products fetched successfully",
            totalProducts: trendingProducts.length,
            products: trendingProducts,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to fetch trending products", error: error.message });
    }
};

// Get best seller products
export const getBestSellers = async (req, res) => {
    try {
        const { limit = 10 } = req.query;

        // Best seller logic: Sort by highest sales
        const bestSellers = await Product.find({})
            .sort({ sales: -1 }) // Assuming a 'sales' field exists
            .limit(parseInt(limit));

        if (!bestSellers.length) {
            return res.status(404).json({ success: false, message: "No best sellers found" });
        }

        res.status(200).json({
            success: true,
            message: "Best sellers fetched successfully",
            products: bestSellers,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to fetch best sellers", error: error.message });
    }
};

// Get new arrival products
export const getNewArrivals = async (req, res) => {
    try {
        const { limit = 10 } = req.query;

        // New arrival logic: Sort by creation date
        const newArrivals = await Product.find({})
            .sort({ createdAt: -1 }) // Assuming a 'createdAt' field exists
            .limit(parseInt(limit));

        if (!newArrivals.length) {
            return res.status(404).json({ success: false, message: "No new arrivals found" });
        }

        res.status(200).json({
            success: true,
            message: "New arrivals fetched successfully",
            products: newArrivals,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to fetch new arrivals", error: error.message });
    }
};


export const getCategories = async (req, res) => {
    try {
        const categories = await Product.distinct("category");
        if (!categories.length) {
            return res.status(404).json({ success: false, message: "No categories found" });
        }
        res.status(200).json({ success: true, message: "Categories fetched successfully", categories });
    } catch (error) {
        console.error("Error fetching categories:", error.message);
        res.status(500).json({ success: false, message: "Failed to fetch categories", error: error.message });
    }
};

// Get products by category
export const getProductsByCategory = async (req, res) => {
    try {
        const { category } = req.params;
        const { page = 1, limit = 12 } = req.query;

        const skip = (page - 1) * limit;
        const filter = { category };

        const [products, totalProducts] = await Promise.all([
            Product.find(filter).skip(skip).limit(parseInt(limit)),
            Product.countDocuments(filter),
        ]);

        if (!products.length) {
            return res.status(404).json({ success: false, message: `No products found in category: ${category}` });
        }

        res.status(200).json({
            success: true,
            message: `Products in category: ${category} fetched successfully`,
            totalProducts,
            totalPages: Math.ceil(totalProducts / limit),
            currentPage: parseInt(page),
            products,
        });
    } catch (error) {
        console.error("Error fetching products by category:", error.message);
        res.status(500).json({ success: false, message: "Failed to fetch products by category", error: error.message });
    }
};