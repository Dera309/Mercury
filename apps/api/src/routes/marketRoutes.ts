import { Router } from 'express';
import {
  getIndices,
  getStocksList,
  getStockDetails,
  searchStocksList,
  getSectorsList,
} from '../controllers/marketController';

const router = Router();

router.get('/indices', getIndices);
router.get('/stocks', getStocksList);
router.get('/stocks/:symbol', getStockDetails);
router.get('/search', searchStocksList);
router.get('/sectors', getSectorsList);

export default router;
