import express from "express";
import { createProduct, getAllProducts, getProductById, updateProduct, deleteProduct, getBestSellers, getNewArrivals, getTrendingProducts, getCategories, getProductsByCategory, getProductsByFilter, incrementProductViews, incrementProductSales, decrementProductSales, emptyProductSalesByUserAndProduct } from "../controllers/productController.js";


const productRouter = express.Router();

// post request
productRouter.post("/products", createProduct);

// get request
productRouter.get("/products", getAllProducts);
productRouter.get("/products/:id", getProductById);
productRouter.get("/trending", getTrendingProducts);
productRouter.get("/bestsellers", getBestSellers);
productRouter.get("/newArrivals", getNewArrivals);
productRouter.get("/category", getCategories);
productRouter.get("/category/:category", getProductsByCategory);
productRouter.get("/products/:filterType/:filterValue", getProductsByFilter);


// patch request
productRouter.patch('/products/:id/views', incrementProductViews);
productRouter.patch('/products/:id/sales', incrementProductSales);

productRouter.patch('/products/:id/decrement-sales', decrementProductSales);
productRouter.patch('/products/:productId/reset-sales', emptyProductSalesByUserAndProduct);

// put request
productRouter.put("/products/:id", updateProduct);

// delete request
productRouter.delete("/products/:id", deleteProduct);








export default productRouter;
