const mongoose = require('mongoose');

const start = (CONNECT) => {
    try {
        mongoose.connect(CONNECT);
        console.log('Connected to the database');
    } catch (error) {
        console.log(error);
    }
}
module.exports = start;