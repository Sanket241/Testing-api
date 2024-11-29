const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Product name is required'],
        trim: true,
        maxLength: [100, 'Name cannot be more than 100 characters']
    },
    price: {
        type: Number,
        required: [true, 'Product price is required'],
        min: [0, 'Price cannot be negative']
    },
    feature: {
        type: Boolean,
        required: true,
        default: false
    },
    company:{
        type: String,
        required: [true, 'Company name is required'],
        trim: true,
        maxLength: [50, 'Company name cannot be more than 50 characters']
    },
    rating: {
        type: Number,
        default: 4.9,
        min: [0, 'Rating must be at least 0'],
        max: [5, 'Rating cannot be more than 5']
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
})

// Add index for better query performance
productSchema.index({ company: 1 });
productSchema.index({ price: 1 });

const Product = mongoose.model('Product', productSchema);

module.exports = Product;