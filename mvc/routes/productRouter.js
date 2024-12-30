import express from "express";
import { createProduct,getAllProducts,getProductById,updateProduct,deleteProduct,getBestSellers,getNewArrivals,getTrendingProducts,getCategories,getProductsByCategory,getProductsByFilter } from "../controllers/productController.js";


const productRouter = express.Router();

productRouter.post("/products", createProduct);
productRouter.get("/products", getAllProducts);
productRouter.get("/products/:id", getProductById);
productRouter.put("/products/:id", updateProduct);
productRouter.delete("/products/:id", deleteProduct);

productRouter.get("/trending", getTrendingProducts);
productRouter.get("/bestsellers", getBestSellers);
productRouter.get("/newArrivals", getNewArrivals);
productRouter.get("/category", getCategories);
productRouter.get("/category/:category", getProductsByCategory);


productRouter.get("/products/:filterType/:filterValue", getProductsByFilter);









export default productRouter;
