import { Router } from 'express';
import { mockLogin, mockRegister, mockGetCurrentUser } from '../controllers/mockAuthController';

const router = Router();

// Use mock endpoints when database is not available
router.post('/login', mockLogin);
router.post('/register', mockRegister);
router.get('/me', mockGetCurrentUser);

export default router;
