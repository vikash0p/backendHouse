import express from "express";
import {
    incrementSales,
    decrementSales,
    resetSales,
    getTotalSales,
    getUserSales,
    getTotalProductsBySales
} from "../controllers/salesController.js";

const salesRouter = express.Router();

salesRouter.post("/increment", incrementSales);
salesRouter.post("/decrement", decrementSales);
salesRouter.post("/reset", resetSales);
salesRouter.get("/total", getTotalSales);
salesRouter.get("/user/:userId", getUserSales);
salesRouter.get("/products/by-sales", getTotalProductsBySales);



export default salesRouter;