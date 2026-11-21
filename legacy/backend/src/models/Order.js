import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false, // Optional for guest checkout
    },
    orderReference: {
      type: String,
      required: true,
      unique: true,
      default: () => `LC-${Math.floor(10000 + Math.random() * 90000)}`,
    },
    orderItems: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
          required: false,
        },
        title: { type: String, required: true },
        image: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true, default: 1 },
        vesselSize: { type: String, default: '220g Amber Glass' },
        wickType: { type: String, default: 'Organic Untreated Cotton Wick' },
      },
    ],
    shippingAddress: {
      fullName: { type: String, required: true },
      street: { type: String, required: true },
      apartment: { type: String, default: '' },
      city: { type: String, required: true },
      state: { type: String, required: true },
      postalCode: { type: String, required: true },
      phone: { type: String, required: true },
      email: { type: String, required: true },
    },
    packagingOption: {
      type: String,
      enum: ['Standard Protected Dispatch', 'Bespoke Gift Box with Wax Seal'],
      default: 'Standard Protected Dispatch',
    },
    giftNote: {
      type: String,
      default: '',
    },
    sampleMelt: {
      type: String,
      default: 'Lavender Calm (25g)',
    },
    paymentMethod: {
      type: String,
      required: true,
      enum: ['UPI', 'Credit/Debit Card', 'Net Banking', 'Cash on Delivery'],
      default: 'UPI',
    },
    paymentResult: {
      id: { type: String },
      status: { type: String },
      updateTime: { type: String },
      emailAddress: { type: String },
    },
    itemsPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },
    shippingPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },
    discountPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },
    totalPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },
    isPaid: {
      type: Boolean,
      required: true,
      default: false,
    },
    paidAt: {
      type: Date,
    },
    isDelivered: {
      type: Boolean,
      required: true,
      default: false,
    },
    deliveredAt: {
      type: Date,
    },
    tracking: {
      currentStage: {
        type: String,
        enum: [
          'Hand-Poured & Cured',
          'Artisan Packaging & Quality Inspection',
          'Dispatched via Express Courier',
          'In Transit to Destination',
          'Out for Hand-Delivery',
          'Delivered with Care',
        ],
        default: 'Hand-Poured & Cured',
      },
      courierPartner: {
        type: String,
        default: 'BlueDart Express',
      },
      awbNumber: {
        type: String,
        default: () => `BD${Math.floor(100000000 + Math.random() * 900000000)}IN`,
      },
      estimatedDeliveryDate: {
        type: Date,
      },
      checkpoints: [
        {
          stageName: { type: String },
          location: { type: String },
          timestamp: { type: Date, default: Date.now },
          isCompleted: { type: Boolean, default: false },
        },
      ],
    },
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model('Order', orderSchema);
export default Order;

