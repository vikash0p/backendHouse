// addressController.js

import Address from "../models/addressSchema.js";



// Add a new address
export const addAddress = async (req, res) => {
    try {
        const { userId, street, city, state, postalCode, country, addressType } = req.body;

        // Create a new address document
        const newAddress = new Address({
            userId,
            street,
            city,
            state,
            postalCode,
            country,
            addressType,
        });

        // Save to database
        await newAddress.save();

        res.status(201).json({
            message: 'Address added successfully!',
            data: newAddress,
        });
    } catch (error) {
        res.status(500).json({ message: 'Error adding address', error: error.message });
    }
};

// Get all addresses for a user
export const getAddressesByUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const addresses = await Address.find({ userId });

        if (!addresses || addresses.length === 0) {
            return res.status(404).json({ message: 'No addresses found for this user' });
        }

        res.status(200).json(addresses);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching addresses', error: error.message });
    }
};

// Update an address
export const updateAddress = async (req, res) => {
    try {
        const { addressId } = req.params;
        const updatedData = req.body;

        const updatedAddress = await Address.findByIdAndUpdate(addressId, updatedData, {
            new: true,
        });

        if (!updatedAddress) {
            return res.status(404).json({ message: 'Address not found' });
        }

        res.status(200).json({
            message: 'Address updated successfully',
            data: updatedAddress,
        });
    } catch (error) {
        res.status(500).json({ message: 'Error updating address', error: error.message });
    }
};

// Delete an address
export const deleteAddress = async (req, res) => {
    try {
        const { addressId } = req.params;

        const deletedAddress = await Address.findByIdAndDelete(addressId);

        if (!deletedAddress) {
            return res.status(404).json({ message: 'Address not found' });
        }

        res.status(200).json({ message: 'Address deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting address', error: error.message });
    }
};
