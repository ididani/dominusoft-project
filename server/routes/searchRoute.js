const express = require('express');
const Product = require("../models/productModel");
const router = express.Router();

// Example Express.js route for product search
router.get('/', async (req, res) => {
  const query = req.query.q;

  try {
    const products = await Product.find({
      name: { $regex: query, $options: 'i' } // Case-insensitive search
    }).limit(3); // Limit to 3 results
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
