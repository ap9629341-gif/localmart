const express = require('express');
const Shop = require('../models/Shop');
const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');

const router = express.Router();

// Middleware to protect routes (like a security guard)
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

// Register a new shop (only for shop owners)
router.post('/register', authMiddleware, [
    body('name').notEmpty().withMessage('Shop name is required'),
    body('description').notEmpty().withMessage('Description is required'),
    body('category').isIn(['grocery', 'electronics', 'clothing', 'food', 'pharmacy', 'other']).withMessage('Invalid category'),
    body('location.coordinates').isArray().withMessage('Location coordinates are required'),
    body('address.street').notEmpty().withMessage('Street address is required')
], async (req, res) => {
    try {
        // Check if user is a shop owner
        if (req.user.role !== 'shop_owner') {
            return res.status(403).json({ message: 'Only shop owners can register shops' });
        }

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const shopData = {
            ...req.body,
            owner: req.user.userId
        };

        const shop = new Shop(shopData);
        await shop.save();

        res.status(201).json({
            message: 'Shop registered successfully! 🏪',
            shop
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Get nearby shops (within 200 meters)
router.get('/nearby', async (req, res) => {
    try {
        const { lat, lng } = req.query;
        
        if (!lat || !lng) {
            return res.status(400).json({ message: 'Latitude and longitude are required' });
        }

        const userLat = parseFloat(lat);
        const userLng = parseFloat(lng);

        // Find shops within 200 meters (0.2 km)
        const shops = await Shop.find({
            isActive: true,
            location: {
                $near: {
                    $geometry: {
                        type: 'Point',
                        coordinates: [userLng, userLat]
                    },
                    $maxDistance: 200000 // 200km for testing (change back to 200 later)
                }
            }
        }).populate('owner', 'name email phone');

        res.json({
            message: `Found ${shops.length} nearby shops`,
            shops
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Get all shops (for browsing)
router.get('/', async (req, res) => {
    try {
        const shops = await Shop.find({ isActive: true })
            .populate('owner', 'name email phone')
            .sort({ createdAt: -1 });

        res.json({
            message: 'All active shops',
            shops
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Get shop by ID
router.get('/:id', async (req, res) => {
    try {
        const shop = await Shop.findById(req.params.id)
            .populate('owner', 'name email phone');

        if (!shop) {
            return res.status(404).json({ message: 'Shop not found' });
        }

        res.json({
            message: 'Shop details',
            shop
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Update shop information (merchant data update)
router.put('/update/:id', authMiddleware, [
    body('name').optional().notEmpty().withMessage('Shop name cannot be empty'),
    body('description').optional().notEmpty().withMessage('Description cannot be empty'),
    body('category').optional().isIn(['grocery', 'electronics', 'clothing', 'food', 'pharmacy', 'other']).withMessage('Invalid category'),
    body('address.street').optional().notEmpty().withMessage('Street address cannot be empty'),
    body('address.area').optional().notEmpty().withMessage('Area cannot be empty'),
    body('address.city').optional().notEmpty().withMessage('City cannot be empty'),
    body('address.pincode').optional().notEmpty().withMessage('Pincode cannot be empty'),
    body('contact.phone').optional().notEmpty().withMessage('Phone number cannot be empty'),
    body('contact.email').optional().isEmail().withMessage('Valid email is required'),
    body('timings.open').optional().notEmpty().withMessage('Opening time cannot be empty'),
    body('timings.close').optional().notEmpty().withMessage('Closing time cannot be empty')
], async (req, res) => {
    try {
        // Check if user is a shop owner
        if (req.user.role !== 'shop_owner') {
            return res.status(403).json({ message: 'Only shop owners can update shops' });
        }

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        // Find the shop and verify ownership
        const shop = await Shop.findById(req.params.id);
        
        if (!shop) {
            return res.status(404).json({ message: 'Shop not found' });
        }

        // Check if the user owns this shop
        if (shop.owner.toString() !== req.user.userId) {
            return res.status(403).json({ message: 'You can only update your own shop' });
        }

        // Update shop with new data
        const updatedShop = await Shop.findByIdAndUpdate(
            req.params.id,
            { 
                $set: {
                    name: req.body.name || shop.name,
                    description: req.body.description || shop.description,
                    category: req.body.category || shop.category,
                    address: {
                        street: req.body.address?.street || shop.address.street,
                        area: req.body.address?.area || shop.address.area,
                        city: req.body.address?.city || shop.address.city,
                        pincode: req.body.address?.pincode || shop.address.pincode
                    },
                    contact: {
                        phone: req.body.contact?.phone || shop.contact.phone,
                        email: req.body.contact?.email || shop.contact.email
                    },
                    timings: {
                        open: req.body.timings?.open || shop.timings.open,
                        close: req.body.timings?.close || shop.timings.close
                    },
                    // Update location if coordinates provided
                    ...(req.body.location?.coordinates && {
                        location: {
                            type: 'Point',
                            coordinates: req.body.location.coordinates
                        }
                    })
                }
            },
            { new: true, runValidators: true }
        ).populate('owner', 'name email phone');

        res.status(200).json({
            message: 'Shop updated successfully! 🏪',
            shop: updatedShop
        });

    } catch (error) {
        res.status(500).json({ 
            message: 'Server error while updating shop', 
            error: error.message 
        });
    }
});

// Add/Update shop products (merchant inventory management)
router.post('/products/:shopId', authMiddleware, [
    body('products').isArray().withMessage('Products must be an array'),
    body('products.*.name').notEmpty().withMessage('Product name is required'),
    body('products.*.price').isNumeric().withMessage('Product price must be a number'),
    body('products.*.category').notEmpty().withMessage('Product category is required'),
    body('products.*.stock').isInt({ min: 0 }).withMessage('Stock must be a positive integer')
], async (req, res) => {
    try {
        // Check if user is a shop owner
        if (req.user.role !== 'shop_owner') {
            return res.status(403).json({ message: 'Only shop owners can manage products' });
        }

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        // Find the shop and verify ownership
        const shop = await Shop.findById(req.params.shopId);
        
        if (!shop) {
            return res.status(404).json({ message: 'Shop not found' });
        }

        // Check if the user owns this shop
        if (shop.owner.toString() !== req.user.userId) {
            return res.status(403).json({ message: 'You can only manage your own shop products' });
        }

        // Update shop products and order statistics
        const updatedShop = await Shop.findByIdAndUpdate(
            req.params.shopId,
            { 
                $set: {
                    products: req.body.products,
                    updatedAt: new Date(),
                    // Update order statistics
                    $inc: {
                        totalOrders: 1,
                        customerVisits: 1
                    }
                }
            },
            { new: true, runValidators: true }
        ).populate('owner', 'name email phone');

        res.status(200).json({
            message: 'Shop products updated successfully! 📦',
            shop: updatedShop
        });

    } catch (error) {
        res.status(500).json({ 
            message: 'Server error while updating products', 
            error: error.message 
        });
    }
});

// Get shop analytics (merchant dashboard data)
router.get('/analytics/:shopId', authMiddleware, async (req, res) => {
    try {
        // Check if user is a shop owner
        if (req.user.role !== 'shop_owner') {
            return res.status(403).json({ message: 'Only shop owners can view analytics' });
        }

        // Find the shop and verify ownership
        const shop = await Shop.findById(req.params.shopId);
        
        if (!shop) {
            return res.status(404).json({ message: 'Shop not found' });
        }

        // Check if the user owns this shop
        if (shop.owner.toString() !== req.user.userId) {
            return res.status(403).json({ message: 'You can only view your own shop analytics' });
        }

        // Get basic analytics (you can expand this)
        const analytics = {
            shopInfo: {
                name: shop.name,
                category: shop.category,
                isActive: shop.isActive,
                rating: shop.rating,
                createdAt: shop.createdAt
            },
            products: shop.products || [],
            totalProducts: (shop.products || []).length,
            // You can add more analytics here:
            // - Sales data
            // - Customer visits
            // - Popular products
            // - Revenue data
        };

        res.status(200).json({
            message: 'Shop analytics retrieved successfully! 📊',
            analytics
        });

    } catch (error) {
        res.status(500).json({ 
            message: 'Server error while fetching analytics', 
            error: error.message 
        });
    }
});

// Create geospatial index for location-based queries
router.post('/create-index', async (req, res) => {
    try {
        await Shop.collection.createIndex({ location: "2dsphere" });
        res.json({ message: "Geospatial index created successfully! 🗺️" });
    } catch (error) {
        res.status(500).json({ message: "Error creating index", error: error.message });
    }
});

module.exports = router;
