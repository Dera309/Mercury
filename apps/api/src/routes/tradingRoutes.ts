import { Router } from 'express';
import { buy, sell, getHistory } from '../controllers/tradingController';
import { authenticateToken } from '../middlewares/auth';

const router = Router();

// All trading routes require authentication
router.use(authenticateToken);

router.post('/buy', buy);
router.post('/sell', sell);
router.get('/history', getHistory);

export default router;
