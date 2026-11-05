import express from 'express';
import {
  getProducts,
  getBestSellers,
  getNewArrivals,
  getProductById,
} from '../controllers/productController.js';

const router = express.Router();

router.get('/', getProducts);
router.get('/bestsellers', getBestSellers);
router.get('/new-arrivals', getNewArrivals);
router.get('/:id', getProductById);

export default router;

