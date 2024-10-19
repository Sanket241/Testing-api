const Productdb = require('../models/app');

const getAllProducts = async (req, res) => {
    let queryObject = {};
    let { company, sort, select } = req.query;

    // Filter by company if provided
    if (company) {
        queryObject.company = { $regex: company, $options: 'i' }; // Case-insensitive regex match
    }

    // Initialize query with the filter (if any)
    let apidata = Productdb.find(queryObject);

    // Sort if sort query is provided
    if (sort) {
        let sortfix = sort.split(',').join(' '); // Convert commas to spaces for MongoDB syntax
        apidata = apidata.sort(sortfix);
    }

    // Select specific fields if select query is provided
    if (select) {
        let selectfix = select.split(',').join(' '); // Convert commas to spaces for MongoDB select syntax
        apidata = apidata.select(selectfix);
    }

    try {
        const mydata = await apidata;  // Await the query execution
        res.status(200).json({ mydata }); // Return the response with the data
    } catch (error) {
        res.status(500).json({ message: 'Error fetching products', error }); // Handle potential errors
    }
}

const getAllProductsTesting = async (req, res) => {
    try {
        const mydata = await Productdb.find(); // Get all products without filters
        res.status(200).json({ mydata });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching products', error }); // Handle potential errors
    }
}

module.exports = { getAllProducts, getAllProductsTesting };
