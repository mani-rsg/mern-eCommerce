import express from 'express';
const router = express.Router();
import Product from '../models/productModel.js'

// @desc Fetch all products
// @route GET /api/products
// @access Public
router.get('/', async (req, res) => {
    try {
        const products = await Product.find({});
        res.json(products);
    }
    catch(error){
        console.error(error, 'DB Error, unable to get products');
        res.status(500).json({message: "Internal Server Error"});
    }
})

// @desc Fetch single products
// @route GET /api/products/:id
// @access Public  
router.get('/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (product) {
            res.json(product);
        }
        else {
            res.status(404).json({ message: 'Product not found..!' });
        }
    }
    catch (error) {
        console.error(error, 'DB error, unable to get product');
        res.status(500).json({ message: 'Internal Server Error' });
    }

})

export default router;