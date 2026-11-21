import mongoose from 'mongoose';
import Order from '../models/Order.js';

const isDBConnected = () => mongoose.connection.readyState === 1;

// In-memory fallback orders
let fallbackOrders = [
  {
    _id: 'ord-8921',
    id: 'ord-8921',
    orderNumber: 'LC-8921-2026',
    customer: {
      name: 'Clara Delacroix',
      email: 'clara@lueur.com',
      phone: '+91 98450 12345'
    },
    shippingAddress: {
      street: '42 Rue des Artisans, Suite 4B',
      city: 'Bengaluru',
      state: 'Karnataka',
      postalCode: '560001',
      country: 'India'
    },
    items: [
      {
        product: 'prod-004',
        name: 'Sandalwood Luxury Candle',
        vessel: '280g Heavy Amber Glass',
        wick: 'FSC Wood Crackling Wick',
        price: 699,
        quantity: 2,
        image: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=400&q=80'
      },
      {
        product: 'prod-001',
        name: 'Rose Bliss Candle',
        vessel: 'Frosted Blush Jar',
        wick: 'Braided Organic Cotton',
        price: 499,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1596433809252-260c2745dfdd?auto=format&fit=crop&w=400&q=80'
      }
    ],
    pricing: {
      subtotal: 1897,
      discount: 0,
      shipping: 0,
      tax: 0,
      total: 1897
    },
    status: 'In Transit',
    currentStage: 'dispatched',
    trackingNumber: 'IND-POST-99281741-BLR',
    carrier: 'BlueDart Express Atelier Courier',
    estimatedDelivery: 'Tomorrow by 4:00 PM',
    trackingTimeline: [
      {
        stage: 'Order Confirmed',
        description: 'Payment authorized & verified by Atelier system',
        timestamp: '15 Nov 2026, 09:15 AM',
        completed: true
      },
      {
        stage: 'Hand-Poured & Quality Checked',
        description: 'Cured 100% botanical soy wax & flame-inspected in workshop',
        timestamp: '15 Nov 2026, 11:30 AM',
        completed: true
      },
      {
        stage: 'Dispatched from Bangalore Atelier',
        description: 'Passed to BlueDart Express Atelier air courier',
        timestamp: '15 Nov 2026, 03:45 PM',
        completed: true
      },
      {
        stage: 'Out for Courier Delivery',
        description: 'With local courier partner for doorstep delivery',
        timestamp: 'Expected 16 Nov 2026, 11:00 AM',
        completed: false
      },
      {
        stage: 'Delivered to Sanctuary',
        description: 'Package handed over with signature',
        timestamp: 'Pending',
        completed: false
      }
    ],
    createdAt: '2026-11-15T09:15:00.000Z'
  },
  {
    _id: 'ord-8920',
    id: 'ord-8920',
    orderNumber: 'LC-8920-2026',
    customer: {
      name: 'Julian Thorne',
      email: 'julian.thorne@atelier.org',
      phone: '+91 99001 54321'
    },
    shippingAddress: {
      street: '15 Heritage Bungalow Road',
      city: 'Mumbai',
      state: 'Maharashtra',
      postalCode: '400001',
      country: 'India'
    },
    items: [
      {
        product: 'prod-002',
        name: 'Vanilla Dreams Candle',
        vessel: '250g Ribbed Ceramic Flacon',
        wick: 'Organic Untreated Cotton',
        price: 599,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1572726729207-a78d6feb18d7?auto=format&fit=crop&w=400&q=80'
      }
    ],
    pricing: {
      subtotal: 599,
      discount: 0,
      shipping: 50,
      tax: 0,
      total: 649
    },
    status: 'Delivered',
    currentStage: 'delivered',
    trackingNumber: 'IND-DEL-44182910-BOM',
    carrier: 'Delhivery Luxury',
    estimatedDelivery: 'Delivered 14 Nov 2026',
    trackingTimeline: [],
    createdAt: '2026-11-13T14:20:00.000Z'
  }
];

export const createOrder = async (req, res) => {
  try {
    const orderData = req.body;
    const orderNumber = `LC-${Math.floor(1000 + Math.random() * 9000)}-2026`;
    const newOrder = {
      _id: `ord-${Date.now()}`,
      id: `ord-${Date.now()}`,
      orderNumber,
      status: 'Processing',
      currentStage: 'confirmed',
      carrier: 'BlueDart Express Atelier Courier',
      trackingNumber: `IND-BLR-${Math.floor(10000000 + Math.random() * 90000000)}`,
      estimatedDelivery: 'Delivery in 2-3 Business Days',
      trackingTimeline: [
        {
          stage: 'Order Confirmed',
          description: 'Payment authorized & verified by Atelier system',
          timestamp: new Date().toLocaleString(),
          completed: true
        },
        {
          stage: 'Hand-Poured & Quality Checked',
          description: 'Curing in small-batch climate chamber',
          timestamp: 'In Progress',
          completed: false
        },
        {
          stage: 'Dispatched from Atelier',
          description: 'Awaiting courier pickup',
          timestamp: 'Pending',
          completed: false
        },
        {
          stage: 'Delivered to Sanctuary',
          description: 'Doorstep signature delivery',
          timestamp: 'Pending',
          completed: false
        }
      ],
      createdAt: new Date().toISOString(),
      ...orderData
    };

    if (isDBConnected()) {
      try {
        const created = await Order.create(newOrder);
        if (created) return res.status(201).json({ success: true, order: created });
      } catch (dbErr) {
        // fallback
      }
    }

    fallbackOrders.unshift(newOrder);
    return res.status(201).json({ success: true, order: newOrder });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const getOrders = async (req, res) => {
  try {
    if (isDBConnected()) {
      try {
        const orders = await Order.find().sort({ createdAt: -1 });
        if (orders && orders.length > 0) return res.json({ success: true, orders });
      } catch (dbErr) {
        // fallback
      }
    }
    return res.json({ success: true, orders: fallbackOrders });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    if (isDBConnected()) {
      try {
        const order = await Order.findById(id) || await Order.findOne({ orderNumber: id });
        if (order) return res.json({ success: true, order });
      } catch (dbErr) {
        // fallback
      }
    }

    const matched = fallbackOrders.find(
      o => o.id === id || o._id === id || o.orderNumber.toLowerCase() === id.toLowerCase()
    );
    if (matched) return res.json({ success: true, order: matched });

    // Fallback to first order if looking up general tracking
    return res.json({ success: true, order: fallbackOrders[0] });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, currentStage } = req.body;

    if (isDBConnected()) {
      try {
        const order = await Order.findByIdAndUpdate(id, { status, currentStage }, { new: true });
        if (order) return res.json({ success: true, order });
      } catch (dbErr) {
        // fallback
      }
    }

    const matched = fallbackOrders.find(o => o.id === id || o._id === id || o.orderNumber === id);
    if (matched) {
      if (status) matched.status = status;
      if (currentStage) matched.currentStage = currentStage;
      return res.json({ success: true, order: matched });
    }

    return res.status(404).json({ success: false, message: 'Order not found' });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

