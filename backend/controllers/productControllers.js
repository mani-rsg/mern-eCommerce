import Product from '../models/productModel.js';

// @desc Fetch all products
// @route GET /api/products
// @access Public
export const getProducts = async (req, res) => {
    try {
        const products = await Product.find({});
        res.json(products);
    }
    catch (error) {
        console.error(error, 'DB Error, unable to get products');
        res.status(500).json({ message: "Internal Server Error" });
    }
}
// @desc Fetch single products
// @route GET /api/products/:id
// @access Public
export const getProductsById = async (req, res, next) => {

    try {
        const product = await Product.findById(req.params.id);
        if (product) res.json(product);
        else {
            res.status(404);
            // throw new Error('Product not found..!');
            next(new Error('Product not found..!'));
        };
    }
    catch (error) {
        console.error(error, 'DB error, unable to get product');
        next(new Error(error));
    }
}

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
export const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id)

        if (product) {
            await product.remove()
            res.json({ message: 'Product removed' })
        } else {
            res.status(404)
            next(new Error('Product not found'));
        }
    }
    catch (error) {
        console.error(error, 'DB error, unable to get product');
        next(new Error(error));
    }

}
