require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const initialPort = process.env.PORT || 3000;
const products = require('./routes/products');
const connectDb = require('./db/app');

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use('/api/v1', products);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Internal Server Error',
        error: process.env.NODE_ENV === 'development' ? err : {}
    });
});

// Validate required environment variables
const requiredEnvVars = ['CONNECT'];
for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
        console.error(`Error: ${envVar} environment variable is required`);
        process.exit(1);
    }
}

// Function to try starting server on a port
const tryPort = (port) => {
    return new Promise((resolve, reject) => {
        const server = app.listen(port)
            .on('listening', () => {
                resolve(server);
            })
            .on('error', (err) => {
                if (err.code === 'EADDRINUSE') {
                    resolve(false);
                } else {
                    reject(err);
                }
            });
    });
};

// Start the server
const start = async () => {
    try {
        // Connect to the database
        await connectDb(process.env.CONNECT);
        console.log('Connected to the database successfully.');

        // Try ports until one works
        let currentPort = initialPort;
        let server = false;
        
        while (!server && currentPort < 65536) {
            server = await tryPort(currentPort);
            if (!server) {
                console.log(`Port ${currentPort} is in use, trying ${currentPort + 1}...`);
                currentPort++;
            }
        }

        if (server) {
            console.log(`Server is running on port ${currentPort}`);
        } else {
            throw new Error('No available ports found');
        }
    } catch (err) {
        console.error('Failed to start the server:', err.message);
        process.exit(1); // Exit process with failure
    }
};

// Graceful shutdown for cleanup
process.on('SIGINT', () => {
    console.log('Shutting down gracefully...');
    process.exit(0);
});

start();
