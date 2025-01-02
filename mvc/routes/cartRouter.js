import express from 'express';
import { addProductToCart, removeProductFromCart, getCart, updateCart, } from '../controllers/cartController.js';

const cartRouter = express.Router();

cartRouter.post('/add', addProductToCart);
cartRouter.post('/remove', removeProductFromCart);
cartRouter.get('/get', getCart);
cartRouter.post('/update', updateCart);

export default cartRouter;