import React from 'react';
import { Routes, Route } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import HomePage from '../pages/HomePage';
import CatalogPage from '../pages/CatalogPage';
import ProductDetailsPage from '../pages/ProductDetailsPage';
import CartPage from '../pages/CartPage';
import WishlistPage from '../pages/WishlistPage';
import CheckoutPage from '../pages/CheckoutPage';
import TrackingPage from '../pages/TrackingPage';
import LoginPage from '../pages/LoginPage';
import AccountProfilePage from '../pages/AccountProfilePage';
import SearchResultsPage from '../pages/SearchResultsPage';
import AdminDashboardPage from '../pages/AdminDashboardPage';
import TestSetupPage from '../pages/TestSetupPage';
import AboutPage from '../pages/AboutPage';
import ContactPage from '../pages/ContactPage';

export default function AppRoutes() {
  return (
    <Routes>
      {/* Admin Dashboard: Standalone with its own full-width layout */}
      <Route path="/admin" element={<AdminDashboardPage />} />

      {/* Checkout: Dedicated minimalist header layout */}
      <Route path="/checkout" element={<CheckoutPage />} />

      {/* Member Login / Register */}
      <Route path="/login" element={<LoginPage />} />

      {/* Main Storefront & Client App Layout */}
      <Route path="/" element={<MainLayout />}>
        {/* Screen 1: Storefront / Homepage */}
        <Route index element={<HomePage />} />

        {/* Screen 2: Product Catalog & Filters */}
        <Route path="shop" element={<CatalogPage />} />

        {/* Screen 4: Product Details Page (PDP) */}
        <Route path="product/:id" element={<ProductDetailsPage />} />

        {/* Screen 5: Search Results (Amber & Sandalwood / Any Query) */}
        <Route path="search" element={<SearchResultsPage />} />

        {/* Screen 6: Shopping Cart */}
        <Route path="cart" element={<CartPage />} />

        {/* Screen 8: Live Order Tracking & Dispatch Status */}
        <Route path="track" element={<TrackingPage />} />
        <Route path="track/:orderId" element={<TrackingPage />} />

        {/* Screen 9: Wishlist & Saved Reserves */}
        <Route path="wishlist" element={<WishlistPage />} />

        {/* Screen 10 & 11: Member Atelier Account & Olfactory Profile */}
        <Route path="account" element={<AccountProfilePage />} />

        {/* Brand Story & Atelier Information */}
        <Route path="about" element={<AboutPage />} />

        {/* Contact Atelier & Custom Order Inquiries */}
        <Route path="contact" element={<ContactPage />} />

        {/* Foundation Diagnostic Route */}
        <Route path="test" element={<TestSetupPage />} />

        {/* 404 Fallback */}
        <Route path="*" element={<HomePage />} />
      </Route>
    </Routes>
  );
}
