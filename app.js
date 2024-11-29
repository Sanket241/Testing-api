require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const app = express();
const products = require('./routes/products');

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
let cachedDb = null;
const connectDb = async () => {
    if (cachedDb) {
        return cachedDb;
    }
    try {
        const db = await mongoose.connect(process.env.CONNECT);
        cachedDb = db;
        console.log('Connected to MongoDB');
        return db;
    } catch (error) {
        console.error('MongoDB connection error:', error);
        throw error;
    }
};

// Welcome route
app.get('/', async (req, res) => {
    try {
        await connectDb();
        res.json({
            success: true,
            message: 'Welcome to Products API',
            version: '1.0.0',
            endpoints: {
                products: '/api/v1',
                testing: '/api/v1/testing'
            }
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: 'Database connection error' 
        });
    }
});

// API routes
app.use('/api/v1', async (req, res, next) => {
    try {
        await connectDb();
        next();
    } catch (error) {
        next(error);
    }
}, products);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Internal Server Error',
        error: process.env.NODE_ENV === 'development' ? err : {}
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found',
        endpoints: {
            root: '/',
            products: '/api/v1',
            testing: '/api/v1/testing'
        }
    });
});

// Export the app for serverless deployment
module.exports = app;

// Only listen if not in production (Vercel)
if (process.env.NODE_ENV !== 'production') {
    const port = process.env.PORT || 3000;
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
}
