import React from 'react';
import { Routes, Route } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import HomePage from '../pages/HomePage';
import CatalogPage from '../pages/CatalogPage';
import ProductDetailsPage from '../pages/ProductDetailsPage';
import CartPage from '../pages/CartPage';
import WishlistPage from '../pages/WishlistPage';
import TestSetupPage from '../pages/TestSetupPage';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        {/* Screen 1: Storefront / Homepage */}
        <Route index element={<HomePage />} />

        {/* Screen 2: Product Catalog & Filters */}
        <Route path="shop" element={<CatalogPage />} />

        {/* Screen 4: Product Details Page (PDP) */}
        <Route path="product/:id" element={<ProductDetailsPage />} />

        {/* Screen 6: Shopping Cart */}
        <Route path="cart" element={<CartPage />} />

        {/* Screen 9: Wishlist & Saved Reserves */}
        <Route path="wishlist" element={<WishlistPage />} />

        {/* Foundation Diagnostic Route */}
        <Route path="test" element={<TestSetupPage />} />

        {/* 404 Fallback */}
        <Route path="*" element={<HomePage />} />
      </Route>
    </Routes>
  );
}
