const mongoose = require('mongoose');

// Shop Schema - like a shop registration form template
const shopSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    description: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true,
        enum: ['grocery', 'electronics', 'clothing', 'food', 'pharmacy', 'other']
    },
    address: {
        street: String,
        area: String,
        city: String,
        pincode: String
    },
    location: {
        type: {
            type: String,
            enum: ['Point'],
            default: 'Point'
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    contact: {
        phone: String,
        email: String
    },
    timings: {
        open: String,
        close: String
    },
    products: [{
        name: {
            type: String,
            required: true
        },
        price: {
            type: Number,
            required: true,
            min: 0
        },
        category: {
            type: String,
            required: true
        },
        stock: {
            type: Number,
            required: true,
            min: 0,
            default: 0
        },
        description: String,
        image: String,
        isActive: {
            type: Boolean,
            default: true
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    }],
    isActive: {
        type: Boolean,
        default: true
    },
    rating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5
    },
    totalSales: {
        type: Number,
        default: 0,
        min: 0
    },
    customerVisits: {
        type: Number,
        default: 0,
        min: 0
    },
    totalOrders: {
        type: Number,
        default: 0,
        min: 0
    },
    totalRevenue: {
        type: Number,
        default: 0,
        min: 0
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Create the Shop model from the schema
const Shop = mongoose.model('Shop', shopSchema);

module.exports = Shop;
