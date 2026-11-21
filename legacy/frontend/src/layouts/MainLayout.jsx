import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import BottomNav from '../components/layout/BottomNav';
import Footer from '../components/layout/Footer';
import ToastNotification from '../components/layout/ToastNotification';
import LoginModal from '../components/auth/LoginModal';

export default function MainLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FBF9F5] text-[#1B1C1A] font-sans antialiased selection:bg-[#FFDEA4] selection:text-[#1B1C1A]">
      {/* Persistent Sticky Navbar */}
      <Navbar />

      {/* Main Content View with top offset for fixed navbar and bottom padding on mobile for BottomNav */}
      <main className="flex-1 w-full pt-20 sm:pt-28 pb-16 md:pb-0">
        <Outlet />
      </main>

      {/* Persistent Global Footer */}
      <Footer />

      {/* Fixed Bottom Navigation for Mobile (Flipkart style) */}
      <BottomNav />

      {/* Notification Toast */}
      <ToastNotification />

      {/* Global Auth Modal */}
      <LoginModal />
    </div>
  );
}

