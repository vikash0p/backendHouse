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
            .sort({ views: -1 })
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



// Get all unique brands
export const getBrands = async (req, res) => {
    try {
        const brands = await Product.distinct("brand");
        if (!brands.length) {
            return res.status(404).json({ success: false, message: "No brands found" });
        }
        res.status(200).json({ success: true, message: "Brands fetched successfully", brands });
    } catch (error) {
        console.error("Error fetching brands:", error.message);
        res.status(500).json({ success: false, message: "Failed to fetch brands", error: error.message });
    }
};
// Get all unique materials
export const getMaterials = async (req, res) => {
    try {
        const materials = await Product.distinct("material");
        if (!materials.length) {
            return res.status(404).json({ success: false, message: "No materials found" });
        }
        res.status(200).json({ success: true, message: "Materials fetched successfully", materials });
    } catch (error) {
        console.error("Error fetching materials:", error.message);
        res.status(500).json({ success: false, message: "Failed to fetch materials", error: error.message });
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


// Get products by brand
export const getProductsByBrand = async (req, res) => {
    try {
        const { brand } = req.params;
        const { page = 1, limit = 12 } = req.query;

        const filter = { brand };

        const options = {
            skip: (page - 1) * limit,
            limit: parseInt(limit),
        };

        const [products, totalProducts] = await Promise.all([
            Product.find(filter, null, options),
            Product.countDocuments(filter),
        ]);

        if (!products.length) {
            return res.status(404).json({ success: false, message: `No products found for brand: ${brand}` });
        }

        res.status(200).json({
            success: true,
            message: `Products for brand: ${brand} fetched successfully`,
            totalProducts,
            totalPages: Math.ceil(totalProducts / limit),
            currentPage: parseInt(page),
            products,
        });
    } catch (error) {
        console.error("Error fetching products by brand:", error.message);
        res.status(500).json({ success: false, message: "Failed to fetch products by brand", error: error.message });
    }
};

// Get products by material
export const getProductsByMaterial = async (req, res) => {
    try {
        const { material } = req.params;
        const { page = 1, limit = 12 } = req.query;

        const filter = { material };

        const options = {
            skip: (page - 1) * limit,
            limit: parseInt(limit),
        };

        const [products, totalProducts] = await Promise.all([
            Product.find(filter, null, options),
            Product.countDocuments(filter),
        ]);

        if (!products.length) {
            return res.status(404).json({ success: false, message: `No products found with material: ${material}` });
        }

        res.status(200).json({
            success: true,
            message: `Products with material: ${material} fetched successfully`,
            totalProducts,
            totalPages: Math.ceil(totalProducts / limit),
            currentPage: parseInt(page),
            products,
        });
    } catch (error) {
        console.error("Error fetching products by material:", error.message);
        res.status(500).json({ success: false, message: "Failed to fetch products by material", error: error.message });
    }
};




// Simplified API to get products by category, brand, or material
export const getProductsByFilter = async (req, res) => {
    try {
        const { filterType, filterValue } = req.params; // Extract filter type and value from route params
        const { page = 1, limit = 12 } = req.query;

        // Validate filter type
        if (!["category", "brand", "material"].includes(filterType)) {
            return res.status(400).json({ success: false, message: `Invalid filter type: ${filterType}` });
        }

        const filter = { [filterType]: filterValue };
        const skip = (page - 1) * limit;
        const limitParsed = parseInt(limit);

        const products = await Product.find(filter).skip(skip).limit(limitParsed);
        const totalProducts = await Product.countDocuments(filter);

        if (!products.length) {
            return res.status(404).json({ success: false, message: `No products found for ${filterType}: ${filterValue}` });
        }

        res.status(200).json({
            success: true,
            message: `Products for ${filterType}: ${filterValue} fetched successfully`,
            totalProducts,
            totalPages: Math.ceil(totalProducts / limitParsed),
            currentPage: parseInt(page),
            products,
        });
    } catch (error) {

        console.error(`Error fetching products by ${req.params.filterType}:`, error.message);
        res.status(500).json({ success: false, message: "Failed to fetch products", error: error.message });
    }
};



export const incrementProductViews = async (req, res) => {
    try {
        const { id } = req.params;

        // Increment views by 1
        const updatedProduct = await Product.findByIdAndUpdate(
            id,
            { $inc: { views: 1 } },
            { new: true }
        );

        if (!updatedProduct) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }

        res.status(200).json({
            success: true,
            message: "Product views incremented successfully",
            product: updatedProduct,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to increment views", error: error.message });
    }
};

export const incrementProductSales = async (req, res) => {
    try {
        const { id } = req.params;

        // Increment sales by 1
        const updatedProduct = await Product.findByIdAndUpdate(
            id,
            { $inc: { sales: 1 } },
            { new: true }
        );

        if (!updatedProduct) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }

        res.status(200).json({
            success: true,
            message: "Product sales incremented successfully",
            product: updatedProduct,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to increment sales", error: error.message });
    }
};

// export const decrementProductSales = async (req, res) => {
//     try {
//         const { id } = req.params;

//         // Decrement sales by 1
//         const updatedProduct = await Product.findByIdAndUpdate(
//             id,
//             { $inc: { sales: -1 } },
//             { new: true }
//         );

//         if (!updatedProduct) {
//             return res.status(404).json({ success: false, message: "Product not found" });
//         }

//         res.status(200).json({
//             success: true,
//             message: "Product sales decremented successfully",
//             product: updatedProduct,
//         });
//     } catch (error) {
//         res.status(500).json({ success: false, message: "Failed to decrement sales", error: error.message });
//     }
// };


export const decrementProductSales = async (req, res) => {
    try {
        const { id } = req.params;

        // Find product to check current sales value
        const product = await Product.findById(id);

        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }

        if (product.sales <= 0) {
            return res.status(400).json({ success: false, message: "Product sales cannot be decremented below zero" });
        }

        // Decrement sales by 1
        product.sales -= 1;
        await product.save();

        res.status(200).json({
            success: true,
            message: "Product sales decremented successfully",
            product,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to decrement sales", error: error.message });
    }
};

export const emptyProductSalesByUserAndProduct = async (req, res) => {
    try {
        const { userId, productId } = req.params;

        // Reset sales to 0 for a specific product by the user
        const updatedProduct = await Product.findOneAndUpdate(
            { userId: userId, _id: productId },
            { $set: { sales: 0 } },
            { new: true }
        );

        if (!updatedProduct) {
            return res.status(404).json({ success: false, message: "Product not found for this user" });
        }

        res.status(200).json({
            success: true,
            message: "Product sales reset to zero successfully",
            product: updatedProduct,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to reset product sales", error: error.message });
    }
};



