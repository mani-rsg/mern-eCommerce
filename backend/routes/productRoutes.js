import express from 'express';
const router = express.Router();
import { deleteProduct, getProducts, getProductsById } from '../controllers/productControllers.js'
import { admin, protect } from '../middleware/authMiddelware.js';

router.route('/').get(getProducts);

router.route('/:id').get(getProductsById).delete(protect, admin, deleteProduct)

export default router;