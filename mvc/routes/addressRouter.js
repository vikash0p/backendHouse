import express from 'express';
import { addAddress, getAddressesByUser, updateAddress, deleteAddress,getSingleAddress,chooseAddress } from '../controllers/addressController.js';

const addressRouter = express.Router();

// POST /addresses - Add a new address
addressRouter.post('/', addAddress);

// GET /addresses/:userId - Get all addresses for a user
addressRouter.get('/:userId', getAddressesByUser);

// PUT /addresses/:addressId - Update an address
addressRouter.put('/:addressId', updateAddress);

// DELETE /addresses/:addressId - Delete an address
addressRouter.delete('/:addressId', deleteAddress);

addressRouter.get('/single/:addressId', getSingleAddress);


addressRouter.post('/choose/:addressId', chooseAddress);


export default addressRouter;
