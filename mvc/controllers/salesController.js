import User from '../models/userSchema.js';
import Product from '../models/productSchema.js';
import Sales from '../models/salesSchema.js';

// Increment sales
export const incrementSales = async (req, res) => {
    try {
        const { productId, userId } = req.body;

        const product = await Product.findById(productId);
        const user = await User.findById(userId);

        if (!product || !user) {
            return res.status(404).json({ message: "Product or User not found" });
        }

        let sales = await Sales.findOne({ productId, userId });

        if (!sales) {
            sales = new Sales({ productId, userId, salesCount: 1 });
        } else {
            sales.salesCount += 1;
        }

        await sales.save();
        res.status(200).json({ message: "Sales incremented", sales });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Decrement sales
export const decrementSales = async (req, res) => {
    try {
        const { productId, userId } = req.body;

        const sales = await Sales.findOne({ productId, userId });

        if (!sales) {
            return res.status(404).json({ message: "Sales record not found" });
        }

        if (sales.salesCount > 0) {
            sales.salesCount -= 1;
        }

        await sales.save();
        res.status(200).json({ message: "Sales decremented", sales });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Reset sales
export const resetSales = async (req, res) => {
    try {
        const { productId, userId } = req.body;

        const sales = await Sales.findOne({ productId, userId });

        if (!sales) {
            return res.status(404).json({ message: "Sales record not found" });
        }

        sales.salesCount = 0;

        await sales.save();
        res.status(200).json({ message: "Sales reset", sales });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get total sales
export const getTotalSales = async (req, res) => {
    try {
        const totalSales = await Sales.aggregate([
            {
                $group: {
                    _id: null,
                    total: { $sum: "$salesCount" },
                },
            },
        ]);

        res.status(200).json({ totalSales: totalSales[0]?.total || 0 });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get user sales
export const getUserSales = async (req, res) => {
    try {
        const { userId } = req.params;

        const user = await User.findById(userId).select("-password");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Fetch user sales where salesCount > 0 and sort by salesCount in descending order
        const userSales = await Sales.find({ userId, salesCount: { $gt: 0 } })
            .sort({ salesCount: -1 })
            .populate("productId", "title finalPrice image color category quantity material brand");

        const totalSalesCount = userSales.reduce((total, sale) => total + sale.salesCount, 0);

        res.status(200).json({
            message: "User sales data fetched successfully",
            userSalesLength: userSales.length,
            totalSalesCount,
            user,
            userSales
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


export const getTotalProductsBySales = async (req, res) => {
    try {
        // Get total sales
        const totalSalesResult = await Sales.aggregate([
            {
                $group: {
                    _id: null,
                    total: { $sum: "$salesCount" },
                },
            },
        ]);
        const totalSales = totalSalesResult[0]?.total || 0;

        // Return early if totalSales is 0
        if (totalSales === 0) {
            return res.status(200).json({
                message: "No sales data available",
                totalSales: 0,
                productsBySales: [],
            });
        }

        // Get products by sales, including salesData
        const productsBySales = await Product.aggregate([
            {
                $lookup: {
                    from: "sales",
                    localField: "_id",
                    foreignField: "productId",
                    as: "salesData",
                },
            },
            {
                $addFields: {
                    filteredSalesData: {
                        $filter: {
                            input: "$salesData",
                            as: "sale",
                            cond: { $gt: ["$$sale.salesCount", 0] },
                        },
                    },
                },
            },
            {
                $addFields: {
                    totalSales: { $sum: "$filteredSalesData.salesCount" },
                },
            },
            {
                $match: {
                    totalSales: { $gt: 0 }, // Only include products with totalSales > 0
                },
            },
            {
                $sort: { totalSales: -1 },
            },
            {
                $limit: 10, // Limit the results to the top 10 products
            },
            {
                $project: {
                    _id: 1,
                    title: 1,
                    description: 1,
                    category: 1,
                    image: 1,
                    origin: 1,
                    originalPrice: 1,
                    discount: 1,
                    finalPrice: 1,
                    material: 1,
                    stock: 1,
                    brand: 1,
                    updatedAt: 1,
                    filteredSalesData: 1,
                    totalSales: 1,
                },
            },
        ]);

        res.status(200).json({
            message: "Sales data fetched successfully",
            totalSales,
            productsBySales,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
