require('dotenv').config();
const connectdb = require('./db/app');
const Product = require('./models/app');
const Productjson = require('./products.json');

const start = async() => {
    try {
        console.log("start")
        await connectdb(process.env.CONNECT);
        await Product.deleteMany({});
        await Product.create(Productjson);
        console.log('Data imported successfully');
    } catch (error) {
        console.log('Data import failed');
    }
}
start();


