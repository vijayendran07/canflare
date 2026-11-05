import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import ToastNotification from '../components/layout/ToastNotification';

export default function MainLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FBF9F5] text-[#1B1C1A] font-sans antialiased selection:bg-[#FFDEA4] selection:text-[#1B1C1A]">
      {/* Persistent Sticky Navbar */}
      <Navbar />

      {/* Main Content View with top offset for fixed navbar */}
      <main className="flex-1 w-full pt-28">
        <Outlet />
      </main>

      {/* Persistent Global Footer */}
      <Footer />

      {/* Notification Toast */}
      <ToastNotification />
    </div>
  );
}

