import { configureStore } from '@reduxjs/toolkit';
import healthReducer from './slices/healthSlice';
import cartReducer from './slices/cartSlice';
import authReducer from './slices/authSlice';

export const store = configureStore({
  reducer: {
    health: healthReducer,
    cart: cartReducer,
    auth: authReducer,
  },
  devTools: process.env.NODE_ENV !== 'production',
});

export default store;

