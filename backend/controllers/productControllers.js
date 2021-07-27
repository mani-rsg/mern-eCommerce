import Product from '../models/productModel.js';

// @desc Fetch all products
// @route GET /api/products
// @access Public
export const getProducts = async (req, res) => {
    try {
        const pageSize = 2
        const page = Number(req.query.pageNumber) || 1
        const keyword = req.query.keyword
            ? {
                name: {
                    $regex: req.query.keyword,
                    $options: 'i',
                },
            }
            : {}

        const count = await Product.countDocuments({ ...keyword })
        const products = await Product.find({ ...keyword }).limit(pageSize)
            .skip(pageSize * (page - 1))
        res.json({ products, page, pages: Math.ceil(count / pageSize) });
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

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
export const createProduct = async (req, res, next) => {
    const product = new Product({
        name: 'Sample name',
        price: 0,
        user: req.user._id,
        image: ' /images/sample.jpg',
        brand: 'Sample brand',
        category: 'Sample category',
        countInStock: 0,
        numReviews: 0,
        description: 'Sample description',
    })
    try {
        const createdProduct = await product.save()
        res.status(201).json(createdProduct)
    }
    catch (error) {
        console.error(error, 'DB error, unable to create product');
        next(new Error(error));
    }
}

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
export const updateProduct = async (req, res, next) => {
    const {
        name,
        price,
        description,
        image,
        brand,
        category,
        countInStock,
    } = req.body
    try {
        const product = await Product.findById(req.params.id)

        if (product) {
            product.name = name
            product.price = price
            product.description = description
            product.image = image
            product.brand = brand
            product.category = category
            product.countInStock = countInStock

            const updatedProduct = await product.save()
            res.json(updatedProduct)
        } else {
            res.status(404)
            next(new Error('Product not found'))
        }
    }
    catch (error) {
        console.error(error, 'DB error, unable to get/update product');
        next(new Error(error));
    }
}

// @desc    Create new review
// @route   POST /api/products/:id/reviews
// @access  Private
export const createProductReview = async (req, res, next) => {
    try {
        const { rating, comment } = req.body

        const product = await Product.findById(req.params.id)

        if (product) {
            const alreadyReviewed = product.reviews.find(
                (r) => r.user.toString() === req.user._id.toString()
            )

            if (alreadyReviewed) {
                res.status(400)
                next(new Error('Product already reviewed'))
                return;
            }

            const review = {
                name: req.user.name,
                rating: Number(rating),
                comment,
                user: req.user._id,
            }

            product.reviews.push(review)

            product.numReviews = product.reviews.length

            product.rating =
                product.reviews.reduce((acc, item) => item.rating + acc, 0) /
                product.reviews.length

            await product.save()
            res.status(201).json({ message: 'Review added' })
        } else {
            res.status(404)
            next(new Error('Product not found'))
        }
    }
    catch (error) {
        console.error(error, 'DB error, unable to add review to product');
        next(new Error(error));
    }
}

// @desc    Get top rated products
// @route   GET /api/products/top
// @access  Public
export const getTopProducts = async (req, res, next) => {
    try {
        const products = await Product.find({}).sort({ rating: -1 }).limit(3)
        res.json(products)
    }
    catch (error) {
        console.error(error, 'DB error, unable to get top product');
        next(new Error(error));
    }
}