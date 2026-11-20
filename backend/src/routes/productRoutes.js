import express from 'express';
import {
  getProducts,
  getBestSellers,
  getNewArrivals,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from '../controllers/productController.js';

const router = express.Router();

// Categories endpoints (placed before /:id)
router.get('/categories/all', getCategories);
router.post('/categories', createCategory);
router.put('/categories/:id', updateCategory);
router.delete('/categories/:id', deleteCategory);

// Product queries
router.get('/', getProducts);
router.get('/bestsellers', getBestSellers);
router.get('/new-arrivals', getNewArrivals);
router.get('/:id', getProductById);

// Product mutations (Admin)
router.post('/', createProduct);
router.put('/:id', updateProduct);
router.delete('/:id', deleteProduct);

export default router;
