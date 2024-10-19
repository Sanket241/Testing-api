require('dotenv').config();
const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
const products = require('./routes/products');
const connectDb = require('./db/app')


app.use('/api/vi',products);

const start= async()=>{
    try{
        await connectDb(process.env.CONNECT);
        app.listen(port,()=>{
            console.log(`Server is running on port ${port}`);
        })
    }catch(err){
        console.log(err);
    }
}
start();
