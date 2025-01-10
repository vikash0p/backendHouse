// addressController.js

import Address from "../models/addressSchema.js";



// Add a new address
export const addAddress = async (req, res) => {
    try {
        const { userId, street, city, state, postalCode, country, addressType, name, mobile } = req.body;

        if (mobile.length != 10) {
            return res.status(400).json({ message: 'Mobile number should be 10 digits' });
        }


        const existaddress = await Address.findOne({ mobile: mobile });

        if (existaddress) {
            return res.status(400).json({ message: 'Address already exists' });
        }

        // Create a new address document
        const newAddress = new Address({
            userId,
            street,
            city,
            state,
            postalCode,
            country,
            addressType,
            name,
            mobile
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

        // Fetch addresses and populate user details
        const addresses = await Address.find({ userId }).sort({ createdAt: 1 }).populate('userId', 'name email phone');

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



// POST: Mark an address as chosen
export const chooseAddress = async (req, res) => {
    try {
        const { addressId } = req.params;
        const address = await Address.findById(addressId);

        if (!address) {
            return res.status(404).json({ message: 'Address not found' });
        }

        // Logic to mark the address as chosen (you can store this in the database or handle it in the client)
        res.status(200).json({ message: 'Address chosen successfully', address });
    } catch (error) {
        res.status(500).json({ message: 'Error choosing address', error: error.message });
    }
};


// Get a single address by ID
export const getSingleAddress = async (req, res) => {
    try {
        const { addressId } = req.params;

        const address = await Address.findById(addressId);

        if (!address) {
            return res.status(404).json({ message: 'Address not found' });
        }

        res.status(200).json({
            message: 'Address retrieved successfully',
            data: address,
        });
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving address', error: error.message });
    }
};