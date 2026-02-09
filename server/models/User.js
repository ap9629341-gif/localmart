const mongoose = require('mongoose');

// User Schema - like a registration form template
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    phone: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['customer', 'shop_owner'],
        default: 'customer'
    },
    location: {
        latitude: Number,
        longitude: Number
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Create the User model from the schema
const User = mongoose.model('User', userSchema);

module.exports = User;
