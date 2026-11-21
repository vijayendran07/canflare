import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [],
  totalQuantity: 0,
  subtotal: 0,
  freeShippingThreshold: 1499,
  giftWrapIncluded: false,
  giftMessage: '',
  selectedSampleMelt: null,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const item = action.payload;
      const existing = state.items.find((i) => i.id === item.id);
      if (existing) {
        existing.quantity += item.quantity || 1;
      } else {
        state.items.push({
          ...item,
          quantity: item.quantity || 1,
        });
      }
      state.totalQuantity = state.items.reduce((total, i) => total + i.quantity, 0);
      state.subtotal = state.items.reduce((sum, i) => sum + i.price * i.quantity, 0);
    },
    removeFromCart: (state, action) => {
      const id = action.payload;
      state.items = state.items.filter((i) => i.id !== id);
      state.totalQuantity = state.items.reduce((total, i) => total + i.quantity, 0);
      state.subtotal = state.items.reduce((sum, i) => sum + i.price * i.quantity, 0);
    },
    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const existing = state.items.find((i) => i.id === id);
      if (existing && quantity > 0) {
        existing.quantity = quantity;
      } else if (existing && quantity <= 0) {
        state.items = state.items.filter((i) => i.id !== id);
      }
      state.totalQuantity = state.items.reduce((total, i) => total + i.quantity, 0);
      state.subtotal = state.items.reduce((sum, i) => sum + i.price * i.quantity, 0);
    },
    toggleGiftWrap: (state, action) => {
      state.giftWrapIncluded = action.payload ?? !state.giftWrapIncluded;
    },
    setGiftMessage: (state, action) => {
      state.giftMessage = action.payload;
    },
    selectSampleMelt: (state, action) => {
      state.selectedSampleMelt = action.payload;
    },
    clearCart: (state) => {
      state.items = [];
      state.totalQuantity = 0;
      state.subtotal = 0;
      state.giftWrapIncluded = false;
      state.giftMessage = '';
      state.selectedSampleMelt = null;
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  updateQuantity,
  toggleGiftWrap,
  setGiftMessage,
  selectSampleMelt,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;

