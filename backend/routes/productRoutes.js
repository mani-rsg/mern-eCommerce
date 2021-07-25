import express from 'express';
const router = express.Router();
import { createProduct, createProductReview, deleteProduct, getProducts, getProductsById, updateProduct } from '../controllers/productControllers.js'
import { admin, protect } from '../middleware/authMiddelware.js';

router.route('/').get(getProducts).post(protect, admin, createProduct)
router.route('/:id/reviews').post(protect, createProductReview)
router.route('/:id').get(getProductsById).delete(protect, admin, deleteProduct).put(protect, admin, updateProduct)

export default router;