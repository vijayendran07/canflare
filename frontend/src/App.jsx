import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { checkBackendHealth } from './store/slices/healthSlice';
import Navbar from './components/Navbar';
import HealthCard from './components/HealthCard';
import ArchitectureCard from './components/ArchitectureCard';
import { ArrowRight, ShoppingBag, ShieldCheck, Zap } from 'lucide-react';

export default function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    // Initial health check call on load
    dispatch(checkBackendHealth());
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-4">
            <Zap className="w-3.5 h-3.5" /> Full-Stack MERN E-Commerce Foundation
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white mb-4">
            Production-Ready <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">MERN Workspace</span>
          </h1>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            Frontend (React + Vite + Tailwind CSS + Redux Toolkit + Axios) and Backend (Node.js + Express + MongoDB) have been scaffolded independently with clean separation of concerns and live health verification.
          </p>
        </div>

        {/* Live Connectivity Test */}
        <HealthCard />

        {/* Architectural Overview */}
        <ArchitectureCard />

        {/* Quick Start Commands */}
        <div className="mt-8 p-6 rounded-2xl bg-gradient-to-r from-slate-900 to-slate-900/90 border border-slate-800">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h4 className="text-sm font-semibold text-slate-200">Ready to build e-commerce features?</h4>
              <p className="text-xs text-slate-400 mt-0.5">
                Next modules to add: Auth (JWT), Product Catalog, Cart & Checkout, Order Management, Payment Gateway (Stripe/PayPal).
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono px-3 py-1.5 rounded-lg bg-slate-800 text-cyan-400 border border-slate-700">
                npm run dev
              </span>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 py-6 text-center text-xs text-slate-500">
        MERN E-Commerce Scaffold • Configured with Vite, React, Redux Toolkit, Tailwind CSS, Express, and Mongoose
      </footer>
    </div>
  );
}
