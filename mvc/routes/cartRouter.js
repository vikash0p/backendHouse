import express from 'express';
import { addProductToCart, removeProductFromCart, getCart, updateCart, } from '../controllers/cartController.js';

const cartRouter = express.Router();
// post request
cartRouter.post('/add', addProductToCart);
cartRouter.post('/remove', removeProductFromCart);
cartRouter.post('/update', updateCart);

// get request
cartRouter.get('/get', getCart);

export default cartRouter;