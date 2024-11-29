require('dotenv').config();
const connectdb = require('./db/app');
const Product = require('./models/app');
const products = require('./products.json');

const start = async () => {
    try {
        console.log('Connecting to database...')
        await connectdb(process.env.CONNECT);
        
        console.log('Clearing existing products...')
        await Product.deleteMany({});
        
        console.log('Importing new products...')
        await Product.create(products);
        
        console.log('Data import completed successfully!')
        process.exit(0);
    } catch (error) {
        console.error('Error during data import:', error.message);
        process.exit(1);
    }
};

// Handle process termination
process.on('SIGINT', () => {
    console.log('Import interrupted');
    process.exit(1);
});

start();

