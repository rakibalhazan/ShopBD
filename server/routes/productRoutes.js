import { Router }  from 'express';
import {
  getProducts, getProductById,
  createProduct, updateProduct, deleteProduct, updateStock,
} from '../controllers/productController.js';
import { protect, adminOnly } from '../middlewares/authMiddleware.js';

const router = Router();

router.get ('/',            getProducts);
router.get ('/:id',         getProductById);
router.post('/',            protect, adminOnly, createProduct);
router.put ('/:id',         protect, adminOnly, updateProduct);
router.delete('/:id',       protect, adminOnly, deleteProduct);
router.patch('/:id/stock',  protect, adminOnly, updateStock);

export default router;
