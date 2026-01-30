import { Router } from 'express';
import { register, login, logout, getCurrentUser } from '../controllers/authController';
import { authenticateToken } from '../middlewares/auth';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', authenticateToken, logout);
router.get('/me', authenticateToken, getCurrentUser);

export default router;
