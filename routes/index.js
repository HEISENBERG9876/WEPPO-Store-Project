const express = require('express');
const pool = require('../config/db');

const router = express.Router();

router.get('/', async (req, res) => {
    const searchQuery = req.query.search || '';

    try {
        const result = await pool.query("SELECT * FROM Products");
        let products = result.rows;

        if (searchQuery) {
            products = products.filter(product => {
                return product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                       product.description.toLowerCase().includes(searchQuery.toLowerCase());
            });
        }

        res.render('index', { 
            products, 
            searchQuery,
            user: req.session.user 
        });
    } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).send("Error fetching products.");
    }
});

module.exports = router;
