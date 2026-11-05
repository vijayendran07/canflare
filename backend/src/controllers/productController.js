import mongoose from 'mongoose';
import Product from '../models/Product.js';
import { candleProducts } from '../data/products.js';

const isDBConnected = () => mongoose.connection.readyState === 1;

/**
 * @desc    Fetch all products with optional filters, search, and sorting
 * @route   GET /api/products
 * @access  Public
 */
export const getProducts = async (req, res) => {
  try {
    const {
      search,
      category,
      fragranceFamily,
      intensity,
      minPrice,
      maxPrice,
      inStock,
      sort,
    } = req.query;

    if (isDBConnected()) {
      let query = {};

      if (search) {
        query.$or = [
          { title: { $regex: search, $options: 'i' } },
          { subtitle: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
        ];
      }

      if (category && category !== 'All Aromatics') {
        query.category = category;
      }

      if (fragranceFamily) {
        query.fragranceFamily = fragranceFamily;
      }

      if (intensity) {
        query.olfactoryIntensity = intensity;
      }

      if (inStock === 'true') {
        query.inStock = true;
      }

      if (minPrice || maxPrice) {
        query.price = {};
        if (minPrice) query.price.$gte = Number(minPrice);
        if (maxPrice) query.price.$lte = Number(maxPrice);
      }

      let sortOptions = {};
      if (sort === 'price-asc') sortOptions = { price: 1 };
      else if (sort === 'price-desc') sortOptions = { price: -1 };
      else if (sort === 'best-rated') sortOptions = { rating: -1 };
      else if (sort === 'newest') sortOptions = { createdAt: -1 };
      else sortOptions = { isBestSeller: -1, rating: -1 };

      const products = await Product.find(query).sort(sortOptions);
      if (products.length > 0) {
        return res.status(200).json({
          success: true,
          count: products.length,
          data: products,
        });
      }
    }

    // In-memory fallback if MongoDB is not populated yet
    let filtered = [...candleProducts];

    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.subtitle.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
      );
    }

    if (category && category !== 'All Aromatics') {
      filtered = filtered.filter(
        (p) => p.category.toLowerCase() === category.toLowerCase()
      );
    }

    if (fragranceFamily) {
      filtered = filtered.filter(
        (p) => p.fragranceFamily.toLowerCase() === fragranceFamily.toLowerCase()
      );
    }

    if (intensity) {
      filtered = filtered.filter((p) => p.olfactoryIntensity === intensity);
    }

    if (inStock === 'true') {
      filtered = filtered.filter((p) => p.inStock);
    }

    if (minPrice) {
      filtered = filtered.filter((p) => p.price >= Number(minPrice));
    }
    if (maxPrice) {
      filtered = filtered.filter((p) => p.price <= Number(maxPrice));
    }

    if (sort === 'price-asc') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sort === 'price-desc') {
      filtered.sort((a, b) => b.price - a.price);
    } else if (sort === 'best-rated') {
      filtered.sort((a, b) => b.rating - a.rating);
    }

    res.status(200).json({
      success: true,
      count: filtered.length,
      data: filtered,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching products',
    });
  }
};

/**
 * @desc    Fetch best seller candles for Storefront
 * @route   GET /api/products/bestsellers
 * @access  Public
 */
export const getBestSellers = async (req, res) => {
  try {
    if (isDBConnected()) {
      const items = await Product.find({ isBestSeller: true }).limit(4);
      if (items.length > 0) {
        return res.status(200).json({ success: true, data: items });
      }
    }

    const items = candleProducts.filter((p) => p.isBestSeller).slice(0, 4);
    res.status(200).json({ success: true, data: items });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Fetch new arrivals for Storefront
 * @route   GET /api/products/new-arrivals
 * @access  Public
 */
export const getNewArrivals = async (req, res) => {
  try {
    if (isDBConnected()) {
      const items = await Product.find({ isNewArrival: true }).limit(4);
      if (items.length > 0) {
        return res.status(200).json({ success: true, data: items });
      }
    }

    const items = candleProducts.filter((p) => p.isNewArrival).slice(0, 4);
    res.status(200).json({ success: true, data: items });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Fetch single product by ID or Slug
 * @route   GET /api/products/:id
 * @access  Public
 */
export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    if (isDBConnected() && mongoose.Types.ObjectId.isValid(id)) {
      const product = await Product.findById(id);
      if (product) {
        return res.status(200).json({ success: true, data: product });
      }
    }

    const product = candleProducts.find(
      (p) => p.id === id || p._id === id || p.slug === id
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Candle formulation not found in archive',
      });
    }

    res.status(200).json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

