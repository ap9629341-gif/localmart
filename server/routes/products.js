const express = require('express');
const Product = require('../models/Product');
const Shop = require('../models/Shop');
const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');

const router = express.Router();

// Middleware to protect routes
const authMiddleware = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Token is not valid' });
    }
};

// Add new product (shop owners only)
router.post('/add', authMiddleware, [
    body('name').notEmpty().withMessage('Product name is required'),
    body('description').notEmpty().withMessage('Description is required'),
    body('price').isFloat({ min: 0 }).withMessage('Valid price is required'),
    body('category').isIn(['grocery', 'electronics', 'clothing', 'food', 'pharmacy', 'other']).withMessage('Invalid category'),
    body('shop').isMongoId().withMessage('Valid shop ID is required'),
    body('stock').isInt({ min: 0 }).withMessage('Stock must be a non-negative integer')
], async (req, res) => {
    try {
        // Check if user is a shop owner
        if (req.user.role !== 'shop_owner') {
            return res.status(403).json({ message: 'Only shop owners can add products' });
        }

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        // Verify that the shop belongs to this user
        const shop = await Shop.findOne({ _id: req.body.shop, owner: req.user.userId });
        if (!shop) {
            return res.status(403).json({ message: 'You can only add products to your own shops' });
        }

        const productData = {
            ...req.body,
            shop: req.body.shop
        };

        const product = new Product(productData);
        await product.save();

        res.status(201).json({
            message: 'Product added successfully! 🛍️',
            product
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Get products by shop
router.get('/shop/:shopId', async (req, res) => {
    try {
        const { shopId } = req.params;
        
        const products = await Product.find({
            shop: shopId,
            isActive: true
        }).populate('shop', 'name address');

        res.json({
            message: `Found ${products.length} products`,
            products
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Get all products (with optional filters)
router.get('/', async (req, res) => {
    try {
        const { category, minPrice, maxPrice, search } = req.query;
        
        let filter = { isActive: true };
        
        if (category) {
            filter.category = category;
        }
        
        if (minPrice || maxPrice) {
            filter.price = {};
            if (minPrice) filter.price.$gte = parseFloat(minPrice);
            if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
        }
        
        if (search) {
            filter.$or = [
                { name: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
                { tags: { $in: [new RegExp(search, 'i')] } }
            ];
        }

        const products = await Product.find(filter)
            .populate('shop', 'name address location')
            .sort({ createdAt: -1 });

        res.json({
            message: `Found ${products.length} products`,
            products
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Get single product
router.get('/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id)
            .populate('shop', 'name address contact');

        if (!product || !product.isActive) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.json({
            message: 'Product details',
            product
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Update product (shop owner only)
router.put('/:id', authMiddleware, [
    body('name').optional().notEmpty().withMessage('Product name cannot be empty'),
    body('price').optional().isFloat({ min: 0 }).withMessage('Valid price is required'),
    body('stock').optional().isInt({ min: 0 }).withMessage('Stock must be a non-negative integer')
], async (req, res) => {
    try {
        const product = await Product.findById(req.params.id).populate('shop');
        
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Check if user owns this product's shop
        if (product.shop.owner.toString() !== req.user.userId) {
            return res.status(403).json({ message: 'You can only update your own products' });
        }

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        Object.assign(product, req.body);
        await product.save();

        res.json({
            message: 'Product updated successfully! ✅',
            product
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Delete product (shop owner only)
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        const product = await Product.findById(req.params.id).populate('shop');
        
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Check if user owns this product's shop
        if (product.shop.owner.toString() !== req.user.userId) {
            return res.status(403).json({ message: 'You can only delete your own products' });
        }

        product.isActive = false;
        await product.save();

        res.json({
            message: 'Product deleted successfully! 🗑️'
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;
