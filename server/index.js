const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

// Load environment variables (like secret passwords and settings)
dotenv.config();

// Map Configuration
const MAP_PROVIDER = process.env.MAP_PROVIDER || 'openstreetmap';
const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY;

// Create our app (like opening our restaurant)
const app = express();

// Middlewares (like kitchen helpers)
app.use(cors()); // Allows different parts to talk to each other
app.use(express.json()); // Understands JSON data (like reading orders)

// Health check endpoint for Render
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    message: 'Local Mart API is running',
    timestamp: new Date().toISOString()
  });
});

// Connect to database (like connecting to our food storage)
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/localmart', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('Connected to database! 🎉'))
.catch(err => {
    console.log('Database connection failed, continuing without database...');
    console.log('Please install and start MongoDB for full functionality');
});

// Import routes
const authRoutes = require('./routes/auth');
const shopRoutes = require('./routes/shops');
const productRoutes = require('./routes/products');
const orderRoutes = require('./routes/orders');

// Basic route to test our server
app.get('/', (req, res) => {
    res.json({ message: 'Welcome to LocalMart API! 🏪' });
});

// Map API Routes
app.get('/api/map/config', (req, res) => {
    if (MAP_PROVIDER === 'google') {
        res.json({
            provider: 'google',
            googleApiKey: GOOGLE_API_KEY,
            googleMapsApiKey: GOOGLE_MAPS_API_KEY
        });
    } else {
        res.json({
            provider: 'openstreetmap',
            tileUrl: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
            attribution: '© OpenStreetMap contributors'
        });
    }
});

// Use our routes
app.use('/api/auth', authRoutes);
app.use('/api/shops', shopRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);

// Start our server (like opening the restaurant for business)
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT} 🚀`);
    console.log(`Visit http://localhost:${PORT} to test the API`);
});
