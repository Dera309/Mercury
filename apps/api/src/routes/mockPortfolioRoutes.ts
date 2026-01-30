import { Router } from 'express';
import { mockGetPortfolio, mockGetHoldings, mockGetAssetAllocation, mockGetTransactions } from '../controllers/mockPortfolioController';

const router = Router();

// Use mock endpoints when database is not available
router.get('/', mockGetPortfolio);
router.get('/holdings', mockGetHoldings);
router.get('/allocation', mockGetAssetAllocation);
router.get('/transactions', mockGetTransactions);

export default router;
