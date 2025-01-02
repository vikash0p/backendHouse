import express from 'express';
import {addItemToCart,deleteCartItem,updateCartItem,getCart } from '../controllers/cartController.js';

const cartRouter = express.Router();
cartRouter.post("/add", addItemToCart);

// Get cart for a user
cartRouter.get("/get/:userId", getCart);

// Update item in cart
cartRouter.put("/update/:cartItemId", updateCartItem);

// Delete item from cart
cartRouter.delete("/delete/:cartItemId", deleteCartItem);

export default cartRouter;