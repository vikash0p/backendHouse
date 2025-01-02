import express from "express";
const wishlistRouter = express.Router();
import {addToWishlist,removeFromWishlist} from '../controllers/wishlistController.js'


wishlistRouter.post("/add", addToWishlist);
wishlistRouter.post("/remove", removeFromWishlist);

export default wishlistRouter;