import express from 'express';
import { addAddress, getAddressesByUser, updateAddress, deleteAddress } from '../controllers/addressController.js';

const addressRouter = express.Router();

// POST /addresses - Add a new address
addressRouter.post('/', addAddress);

// GET /addresses/:userId - Get all addresses for a user
addressRouter.get('/:userId', getAddressesByUser);

// PUT /addresses/:addressId - Update an address
addressRouter.put('/:addressId', updateAddress);

// DELETE /addresses/:addressId - Delete an address
addressRouter.delete('/:addressId', deleteAddress);

export default addressRouter;
