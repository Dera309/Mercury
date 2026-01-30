import { Router } from 'express';
import {
  getPortfolio,
  getHoldings,
  getAssetAllocation,
} from '../controllers/portfolioController';
import { authenticateToken } from '../middlewares/auth';

const router = Router();

// All portfolio routes require authentication
router.use(authenticateToken);

router.get('/', getPortfolio);
router.get('/holdings', getHoldings);
router.get('/allocation', getAssetAllocation);

export default router;
