import { Router } from 'express';
import {
  placeOrder, getOrders, getOrderById,
  updateOrderStatus, updatePaymentStatus,
} from '../controllers/orderController.js';
import { protect, adminOnly } from '../middlewares/authMiddleware.js';

const router = Router();

// Public — anyone can place an order
router.post('/', placeOrder);

// Admin only
router.get ('/',                protect, adminOnly, getOrders);
router.get ('/:id',             protect, adminOnly, getOrderById);
router.patch('/:id/status',     protect, adminOnly, updateOrderStatus);
router.patch('/:id/payment',    protect, adminOnly, updatePaymentStatus);

export default router;
