const express = require('express');
const Order = require('../models/Order');
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

// Create new order (customer checkout)
router.post('/create', authMiddleware, [
    body('shop').notEmpty().withMessage('Shop ID is required'),
    body('items').isArray({ min: 1 }).withMessage('At least one item is required'),
    body('items.*.product.name').notEmpty().withMessage('Product name is required'),
    body('items.*.product.price').isNumeric().withMessage('Product price must be a number'),
    body('items.*.quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
    body('deliveryAddress.street').notEmpty().withMessage('Street address is required'),
    body('deliveryAddress.area').notEmpty().withMessage('Area is required'),
    body('deliveryAddress.city').notEmpty().withMessage('City is required'),
    body('deliveryAddress.pincode').notEmpty().withMessage('Pincode is required'),
    body('deliveryAddress.coordinates').isArray().withMessage('Delivery coordinates are required'),
    body('paymentMethod').isIn(['cod', 'online', 'upi', 'wallet']).withMessage('Invalid payment method'),
    body('estimatedDeliveryTime').notEmpty().withMessage('Estimated delivery time is required')
], async (req, res) => {
    try {
        // Check if user is a customer
        if (req.user.role !== 'customer') {
            return res.status(403).json({ message: 'Only customers can create orders' });
        }

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        // Calculate total amount
        const totalAmount = req.body.items.reduce((total, item) => {
            return total + (item.product.price * item.quantity);
        }, 0) + (req.body.deliveryFee || 0);

        // Create order with subtotals for each item
        const orderItems = req.body.items.map(item => ({
            product: item.product,
            quantity: item.quantity,
            subtotal: item.product.price * item.quantity
        }));

        const orderData = {
            customer: req.user.userId,
            shop: req.body.shop,
            items: orderItems,
            totalAmount,
            deliveryAddress: req.body.deliveryAddress,
            paymentMethod: req.body.paymentMethod,
            deliveryFee: req.body.deliveryFee || 0,
            estimatedDeliveryTime: req.body.estimatedDeliveryTime,
            specialInstructions: req.body.specialInstructions || ''
        };

        const order = new Order(orderData);
        await order.save();

        // Populate customer and shop details
        await order.populate([
            { path: 'customer', select: 'name email phone' },
            { path: 'shop', select: 'name address contact' }
        ]);

        res.status(201).json({
            message: 'Order created successfully! 🛒',
            order
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Get customer orders
router.get('/my-orders', authMiddleware, async (req, res) => {
    try {
        // Check if user is a customer
        if (req.user.role !== 'customer') {
            return res.status(403).json({ message: 'Only customers can view their orders' });
        }

        const orders = await Order.find({ customer: req.user.userId })
            .populate('shop', 'name address contact')
            .sort({ orderDate: -1 });

        res.json({
            message: `Found ${orders.length} orders`,
            orders
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Get shop orders (for merchants)
router.get('/shop-orders/:shopId', authMiddleware, async (req, res) => {
    try {
        // Check if user is a shop owner
        if (req.user.role !== 'shop_owner') {
            return res.status(403).json({ message: 'Only shop owners can view shop orders' });
        }

        // Find shop and verify ownership
        const Shop = require('../models/Shop');
        const shop = await Shop.findById(req.params.shopId);
        
        if (!shop) {
            return res.status(404).json({ message: 'Shop not found' });
        }

        // Check if user owns this shop
        if (shop.owner.toString() !== req.user.userId) {
            return res.status(403).json({ message: 'You can only view your own shop orders' });
        }

        const orders = await Order.find({ shop: req.params.shopId })
            .populate('customer', 'name email phone')
            .sort({ orderDate: -1 });

        res.json({
            message: `Found ${orders.length} orders for this shop`,
            orders
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Update order status (for merchants)
router.put('/update-status/:orderId', authMiddleware, [
    body('status').isIn(['pending', 'confirmed', 'preparing', 'out_for_delivery', 'delivered', 'cancelled']).withMessage('Invalid order status')
], async (req, res) => {
    try {
        // Check if user is a shop owner
        if (req.user.role !== 'shop_owner') {
            return res.status(403).json({ message: 'Only shop owners can update order status' });
        }

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        // Find order and verify shop ownership
        const order = await Order.findById(req.params.orderId).populate('shop');
        
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Check if user owns the shop for this order
        const Shop = require('../models/Shop');
        const shop = await Shop.findById(order.shop._id);
        
        if (shop.owner.toString() !== req.user.userId) {
            return res.status(403).json({ message: 'You can only update orders for your own shop' });
        }

        // Update order status with timestamps
        const updateData = { status: req.body.status };
        
        if (req.body.status === 'confirmed') {
            updateData.confirmedAt = new Date();
        } else if (req.body.status === 'delivered') {
            updateData.deliveredAt = new Date();
        }

        const updatedOrder = await Order.findByIdAndUpdate(
            req.params.orderId,
            updateData,
            { new: true }
        ).populate(['customer', 'shop']);

        res.status(200).json({
            message: 'Order status updated successfully! 📦',
            order: updatedOrder
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Get order by ID
router.get('/:orderId', authMiddleware, async (req, res) => {
    try {
        const order = await Order.findById(req.params.orderId)
            .populate('customer', 'name email phone')
            .populate('shop', 'name address contact');

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Check if user owns this order (customer or shop owner)
        if (order.customer._id.toString() !== req.user.userId && order.shop.owner.toString() !== req.user.userId) {
            return res.status(403).json({ message: 'You can only view your own orders' });
        }

        res.json({
            message: 'Order details',
            order
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Cancel order (for customers)
router.put('/cancel/:orderId', authMiddleware, async (req, res) => {
    try {
        // Check if user is a customer
        if (req.user.role !== 'customer') {
            return res.status(403).json({ message: 'Only customers can cancel orders' });
        }

        // Find order and verify customer ownership
        const order = await Order.findById(req.params.orderId);
        
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Check if user owns this order
        if (order.customer.toString() !== req.user.userId) {
            return res.status(403).json({ message: 'You can only cancel your own orders' });
        }

        // Check if order can be cancelled
        if (order.status === 'out_for_delivery' || order.status === 'delivered') {
            return res.status(400).json({ message: 'Order cannot be cancelled at this stage' });
        }

        const updatedOrder = await Order.findByIdAndUpdate(
            req.params.orderId,
            { 
                status: 'cancelled',
                paymentStatus: 'refunded'
            },
            { new: true }
        ).populate(['customer', 'shop']);

        res.status(200).json({
            message: 'Order cancelled successfully! ❌',
            order: updatedOrder
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;
