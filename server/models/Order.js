const mongoose = require('mongoose');

// Order Schema - like a customer order form
const orderSchema = new mongoose.Schema({
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    shop: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Shop',
        required: true
    },
    items: [{
        product: {
            name: {
                type: String,
                required: true
            },
            price: {
                type: Number,
                required: true,
                min: 0
            },
            quantity: {
                type: Number,
                required: true,
                min: 1
            },
            image: String,
            category: String
        },
        quantity: {
            type: Number,
            required: true,
            min: 1
        },
        subtotal: {
            type: Number,
            required: true,
            min: 0
        }
    }],
    totalAmount: {
        type: Number,
        required: true,
        min: 0
    },
    deliveryAddress: {
        street: {
            type: String,
            required: true
        },
        area: {
            type: String,
            required: true
        },
        city: {
            type: String,
            required: true
        },
        pincode: {
            type: String,
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'preparing', 'out_for_delivery', 'delivered', 'cancelled'],
        default: 'pending'
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'paid', 'failed', 'refunded'],
        default: 'pending'
    },
    paymentMethod: {
        type: String,
        enum: ['cod', 'online', 'upi', 'wallet'],
        required: true
    },
    deliveryFee: {
        type: Number,
        default: 0,
        min: 0
    },
    estimatedDeliveryTime: {
        type: String,
        required: true
    },
    specialInstructions: String,
    orderDate: {
        type: Date,
        default: Date.now
    },
    deliveryDate: Date,
    confirmedAt: Date,
    deliveredAt: Date
});

// Create Order model from schema
const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
