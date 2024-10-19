const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    feature: {
        type: Boolean,
        required: true
    },
    company:{
        type: String,
        required: true
    },
    rating: {
        type: Number,
        default: 4.9
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
})

const userModel = mongoose.model('Data', userSchema);

module.exports = userModel;