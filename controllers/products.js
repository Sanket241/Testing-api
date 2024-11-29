const Product = require('../models/app');

const getAllProducts = async (req, res, next) => {
    try {
        const { company, sort, select, page = 1, limit = 10 } = req.query;
        
        // Validate pagination parameters
        const pageNum = Math.max(1, parseInt(page));
        const limitNum = Math.min(100, Math.max(1, parseInt(limit)));
        const skip = (pageNum - 1) * limitNum;

        // Build query
        let queryObject = {};
        if (company) {
            queryObject.company = { $regex: company, $options: 'i' };
        }

        // Build query chain
        let query = Product.find(queryObject);

        // Apply sorting
        if (sort) {
            const sortList = sort.split(',').join(' ');
            query = query.sort(sortList);
        } else {
            query = query.sort('createdAt'); // Default sort
        }

        // Select fields
        if (select) {
            const selectList = select.split(',').join(' ');
            query = query.select(selectList);
        }

        // Get total count for pagination
        const totalItems = await Product.countDocuments(queryObject);
        const totalPages = Math.ceil(totalItems / limitNum);

        // Apply pagination
        query = query.skip(skip).limit(limitNum);

        // Execute query
        const products = await query;

        res.status(200).json({
            success: true,
            count: products.length,
            pagination: {
                currentPage: pageNum,
                totalPages,
                totalItems,
                itemsPerPage: limitNum,
                hasNextPage: pageNum < totalPages,
                hasPrevPage: pageNum > 1
            },
            data: products
        });
    } catch (error) {
        next(error);
    }
};

const getAllProductsTesting = async (req, res, next) => {
    try {
        const products = await Product.find()
            .select('name price rating')
            .sort('-rating');

        res.status(200).json({
            success: true,
            count: products.length,
            data: products
        });
    } catch (error) {
        next(error);
    }
};

module.exports = { getAllProducts, getAllProductsTesting };
