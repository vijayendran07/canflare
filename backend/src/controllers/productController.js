import mongoose from 'mongoose';
import Product from '../models/Product.js';
import { candleProducts } from '../data/products.js';
import { categoriesList } from '../data/categories.js';

const isDBConnected = () => mongoose.connection.readyState === 1;

const slugify = (text) =>
  text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-');

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
          p.title?.toLowerCase().includes(q) ||
          p.subtitle?.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q)
      );
    }

    if (category && category !== 'All Aromatics') {
      filtered = filtered.filter(
        (p) => p.category?.toLowerCase() === category.toLowerCase()
      );
    }

    if (fragranceFamily) {
      filtered = filtered.filter(
        (p) => p.fragranceFamily?.toLowerCase() === fragranceFamily.toLowerCase()
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

/**
 * @desc    Create a new candle product (Admin)
 * @route   POST /api/products
 * @access  Private/Admin
 */
export const createProduct = async (req, res) => {
  try {
    const {
      title,
      subtitle = '',
      description = '',
      price,
      originalPrice,
      category = 'Scented Candles',
      fragranceFamily = 'Woody & Resinous',
      olfactoryIntensity = 'Balanced',
      burnTime = '50-55 Hours',
      vesselType = '220g Amber Glass Jar',
      waxType = '100% Pure Botanical Soy Wax',
      wickType = 'Braided Organic Cotton',
      countInStock = 20,
      inStock = true,
      badge = 'New Pour',
      isFeatured = false,
      isBestSeller = false,
      isNewArrival = true,
      image,
      images,
      topNotes,
      heartNotes,
      baseNotes,
    } = req.body;

    if (!title || price === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Please provide candle title and price',
      });
    }

    const newId = `prod-${Date.now()}`;
    const slug = slugify(title) + `-${Math.floor(100 + Math.random() * 900)}`;

    const primaryImgUrl =
      image ||
      images?.[0]?.url ||
      'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=800&q=80';

    const formattedImages =
      images && images.length > 0
        ? images
        : [{ url: primaryImgUrl, alt: title, isPrimary: true }];

    const scentPyramid = {
      top: Array.isArray(topNotes)
        ? topNotes
        : typeof topNotes === 'string'
        ? topNotes.split(',').map((s) => s.trim())
        : ['Bergamot', 'Sweet Orange'],
      heart: Array.isArray(heartNotes)
        ? heartNotes
        : typeof heartNotes === 'string'
        ? heartNotes.split(',').map((s) => s.trim())
        : ['Damask Rose', 'Jasmine'],
      base: Array.isArray(baseNotes)
        ? baseNotes
        : typeof baseNotes === 'string'
        ? baseNotes.split(',').map((s) => s.trim())
        : ['Mysore Sandalwood', 'Warm Amber'],
    };

    const numPrice = Number(price);
    const numOriginalPrice = originalPrice ? Number(originalPrice) : numPrice;
    const discountPercentage =
      numOriginalPrice > numPrice
        ? Math.round(((numOriginalPrice - numPrice) / numOriginalPrice) * 100)
        : 0;

    const newProduct = {
      _id: newId,
      id: newId,
      title: title.trim(),
      subtitle: subtitle.trim(),
      slug,
      description: description.trim() || `Hand-poured artisan candle with ${fragranceFamily} notes.`,
      price: numPrice,
      originalPrice: numOriginalPrice,
      discountPercentage,
      category,
      fragranceFamily,
      olfactoryIntensity,
      burnTime,
      vesselType,
      waxType,
      wickType,
      countInStock: Number(countInStock),
      inStock: Boolean(inStock),
      badge,
      isFeatured: Boolean(isFeatured),
      isBestSeller: Boolean(isBestSeller),
      isNewArrival: Boolean(isNewArrival),
      rating: 5.0,
      numReviews: 1,
      images: formattedImages,
      scentPyramid,
      createdAt: new Date().toISOString(),
    };

    if (isDBConnected()) {
      try {
        const createdInDB = await Product.create(newProduct);
        if (createdInDB) {
          candleProducts.unshift(createdInDB);
          return res.status(201).json({ success: true, data: createdInDB });
        }
      } catch (dbErr) {
        console.warn('DB create failed, using memory store:', dbErr.message);
      }
    }

    candleProducts.unshift(newProduct);
    return res.status(201).json({ success: true, data: newProduct });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Update candle product & details (Admin)
 * @route   PUT /api/products/:id
 * @access  Private/Admin
 */
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (isDBConnected() && mongoose.Types.ObjectId.isValid(id)) {
      try {
        const updated = await Product.findByIdAndUpdate(id, updates, {
          new: true,
          runValidators: true,
        });
        if (updated) {
          const index = candleProducts.findIndex((p) => p.id === id || p._id === id);
          if (index !== -1) candleProducts[index] = updated;
          return res.status(200).json({ success: true, data: updated });
        }
      } catch (dbErr) {
        console.warn('DB update failed, using memory fallback:', dbErr.message);
      }
    }

    // In-memory update
    const index = candleProducts.findIndex((p) => p.id === id || p._id === id || p.slug === id);
    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Candle formulation not found' });
    }

    // If image was provided as flat string
    if (updates.image) {
      updates.images = [{ url: updates.image, alt: updates.title || candleProducts[index].title, isPrimary: true }];
      delete updates.image;
    }

    // Recalculate discount if prices updated
    if (updates.price !== undefined || updates.originalPrice !== undefined) {
      const price = updates.price !== undefined ? Number(updates.price) : candleProducts[index].price;
      const originalPrice = updates.originalPrice !== undefined ? Number(updates.originalPrice) : candleProducts[index].originalPrice;
      if (originalPrice > price) {
        updates.discountPercentage = Math.round(((originalPrice - price) / originalPrice) * 100);
      } else {
        updates.discountPercentage = 0;
      }
    }

    candleProducts[index] = {
      ...candleProducts[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    return res.status(200).json({ success: true, data: candleProducts[index] });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Delete candle product (Admin)
 * @route   DELETE /api/products/:id
 * @access  Private/Admin
 */
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    if (isDBConnected() && mongoose.Types.ObjectId.isValid(id)) {
      try {
        await Product.findByIdAndDelete(id);
      } catch (dbErr) {
        console.warn('DB delete error:', dbErr.message);
      }
    }

    const index = candleProducts.findIndex((p) => p.id === id || p._id === id || p.slug === id);
    if (index !== -1) {
      candleProducts.splice(index, 1);
      return res.status(200).json({
        success: true,
        message: 'Product formulation decommissioned from catalog',
      });
    }

    return res.status(404).json({ success: false, message: 'Product not found' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Get all categories with product counts (Public/Admin)
 * @route   GET /api/products/categories/all
 * @access  Public
 */
export const getCategories = async (req, res) => {
  try {
    const enriched = categoriesList.map((cat) => {
      const count = candleProducts.filter(
        (p) => p.category?.toLowerCase() === cat.name.toLowerCase()
      ).length;
      return {
        ...cat,
        productCount: count,
      };
    });

    res.status(200).json({
      success: true,
      count: enriched.length,
      data: enriched,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Create a new product category (Admin)
 * @route   POST /api/products/categories
 * @access  Private/Admin
 */
export const createCategory = async (req, res) => {
  try {
    const { name, tag = 'Aromatics', description = '', image } = req.body;
    if (!name) {
      return res.status(400).json({ success: false, message: 'Please provide category name' });
    }

    const existing = categoriesList.find((c) => c.name.toLowerCase() === name.trim().toLowerCase());
    if (existing) {
      return res.status(400).json({ success: false, message: 'Category already exists' });
    }

    const newCategory = {
      id: `cat-${Date.now()}`,
      name: name.trim(),
      tag: tag.trim(),
      description: description.trim(),
      image:
        image ||
        'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=600&q=80',
      displayOrder: categoriesList.length + 1,
      isActive: true,
      productCount: 0,
    };

    categoriesList.push(newCategory);
    return res.status(201).json({ success: true, data: newCategory });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Update a category (Admin)
 * @route   PUT /api/products/categories/:id
 * @access  Private/Admin
 */
export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, tag, description, image, isActive } = req.body;

    const index = categoriesList.findIndex((c) => c.id === id || c.name.toLowerCase() === id.toLowerCase());
    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    const oldName = categoriesList[index].name;

    // If category name is updated, also update products associated with it
    if (name && name.trim() !== oldName) {
      const newName = name.trim();
      candleProducts.forEach((p) => {
        if (p.category?.toLowerCase() === oldName.toLowerCase()) {
          p.category = newName;
        }
      });
      categoriesList[index].name = newName;
    }

    if (tag !== undefined) categoriesList[index].tag = tag;
    if (description !== undefined) categoriesList[index].description = description;
    if (image !== undefined) categoriesList[index].image = image;
    if (isActive !== undefined) categoriesList[index].isActive = Boolean(isActive);

    return res.status(200).json({ success: true, data: categoriesList[index] });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Delete category (Admin)
 * @route   DELETE /api/products/categories/:id
 * @access  Private/Admin
 */
export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const index = categoriesList.findIndex((c) => c.id === id || c.name.toLowerCase() === id.toLowerCase());

    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    const deleted = categoriesList.splice(index, 1)[0];
    return res.status(200).json({
      success: true,
      message: `Category "${deleted.name}" decommissioned`,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
