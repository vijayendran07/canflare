import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please enter product title'],
      trim: true,
    },
    subtitle: {
      type: String,
      trim: true,
      default: '',
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    description: {
      type: String,
      required: [true, 'Please enter product description'],
    },
    price: {
      type: Number,
      required: [true, 'Please enter price in INR'],
      min: 0,
    },
    originalPrice: {
      type: Number,
      default: 0,
    },
    discountPercentage: {
      type: Number,
      default: 0,
    },
    category: {
      type: String,
      required: true,
      trim: true,
      default: 'Scented Candles',
    },
    fragranceFamily: {
      type: String,
      required: true,
      trim: true,
      default: 'Woody & Resinous',
    },
    olfactoryIntensity: {
      type: String,
      enum: ['Subtle', 'Balanced', 'Rich'],
      default: 'Balanced',
    },
    burnTime: {
      type: String,
      default: '50-55 Hours',
    },
    vesselType: {
      type: String,
      default: '220g Amber Glass Jar',
    },
    waxType: {
      type: String,
      default: '100% Pure Botanical Soy Wax',
    },
    wickType: {
      type: String,
      default: 'Organic Untreated Cotton Wick',
    },
    scentPyramid: {
      top: [{ type: String }],
      heart: [{ type: String }],
      base: [{ type: String }],
    },
    rating: {
      type: Number,
      required: true,
      default: 4.8,
      min: 0,
      max: 5,
    },
    numReviews: {
      type: Number,
      required: true,
      default: 0,
    },
    images: [
      {
        url: { type: String, required: true },
        alt: { type: String, default: 'Canflare Artisan Candle' },
        isPrimary: { type: Boolean, default: false },
      },
    ],
    inStock: {
      type: Boolean,
      default: true,
    },
    countInStock: {
      type: Number,
      required: true,
      default: 15,
      min: 0,
    },
    badge: {
      type: String,
      enum: ['Bestseller', 'Popular', 'Top Rated', 'Limited Harvest', 'New Arrival', 'None'],
      default: 'None',
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    isBestSeller: {
      type: Boolean,
      default: false,
    },
    isNewArrival: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Calculate discount percentage automatically if originalPrice is provided
productSchema.pre('save', function (next) {
  if (this.originalPrice && this.originalPrice > this.price) {
    this.discountPercentage = Math.round(
      ((this.originalPrice - this.price) / this.originalPrice) * 100
    );
  }
  next();
});

const Product = mongoose.model('Product', productSchema);
export default Product;

