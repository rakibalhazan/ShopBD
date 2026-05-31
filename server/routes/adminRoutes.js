import { Router }         from 'express';
import { getDashboardStats, getUsers } from '../controllers/adminController.js';
import { protect, adminOnly }          from '../middlewares/authMiddleware.js';

const router = Router();

router.use(protect, adminOnly); // All admin routes require auth

router.get('/stats', getDashboardStats);
router.get('/users', getUsers);

export default router;
