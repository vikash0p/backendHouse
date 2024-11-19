import express from "express";
import { createProduct,getAllProducts,getProductById,updateProduct,deleteProduct } from "../controllers/productController.js";


const productRouter = express.Router();

productRouter.post("/products", createProduct);
productRouter.get("/products", getAllProducts);
productRouter.get("/products/:id", getProductById);
productRouter.put("/products/:id", updateProduct);
productRouter.delete("/products/:id", deleteProduct);

export default productRouter;
