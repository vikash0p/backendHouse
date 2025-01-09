import express from "express";
import { placeOrder, getUserOrders, getOrderById, } from "../controllers/orderController.js";

const orderRouter = express.Router();

// Route to place an order
orderRouter.post("/place", placeOrder);

// Route to get all orders for a user
orderRouter.get("/user/:userId", getUserOrders);

// Route to get a single order by ID
orderRouter.get("/:orderId", getOrderById);

export default orderRouter;
