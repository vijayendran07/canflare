import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please enter your name'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Please enter your email'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Please enter password'],
      minlength: 6,
    },
    phone: {
      type: String,
      default: '',
    },
    role: {
      type: String,
      enum: ['patron', 'admin'],
      default: 'patron',
    },
    patronTier: {
      type: String,
      default: 'Master Connoisseur • Tier III',
    },
    pourCredits: {
      type: Number,
      default: 150,
    },
    olfactoryPreferences: {
      woodyPercentage: { type: Number, default: 65 },
      floralPercentage: { type: Number, default: 20 },
      gourmandPercentage: { type: Number, default: 15 },
      favoriteNotes: [{ type: String }],
    },
    addresses: [
      {
        fullName: { type: String, required: true },
        street: { type: String, required: true },
        apartment: { type: String, default: '' },
        city: { type: String, required: true },
        state: { type: String, required: true },
        postalCode: { type: String, required: true },
        phone: { type: String, required: true },
        isDefault: { type: Boolean, default: false },
      },
    ],
    wishlist: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
      },
    ],
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model('User', userSchema);
export default User;

