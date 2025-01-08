
import mongoose from 'mongoose';

const addressSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        street: {
            type: String,
            required: true,
        },
        city: {
            type: String,
            required: true,
        },
        state: {
            type: String,
            required: true,
        },
        postalCode: {
            type: String,
            required: true,
        },
        country: {
            type: String,
            required: true,
        },
        addressType: {
            type: String,
            enum: ['Home', 'Work', 'Billing', 'Shipping'],
            default: 'Home',
        },
        name: {
            type: String,
            required: true
        },
        mobile: {
            type: Number,
            required: true
        }
    },
    {
        timestamps: true, // Automatically create createdAt and updatedAt fields
    }
);

const Address = mongoose.model('Address', addressSchema);

export default Address;
