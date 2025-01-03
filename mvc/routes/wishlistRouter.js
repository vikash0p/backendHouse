import express from "express";
const wishlistRouter = express.Router();
import { addItemToWishlist, getWishlist, removeItemFromWishlist } from '../controllers/wishlistController.js'


wishlistRouter.post("/add", addItemToWishlist);
wishlistRouter.get("/get/:userId", getWishlist);
wishlistRouter.delete("/delete/:wishlistItemId", removeItemFromWishlist);
export default wishlistRouter;