import React from 'react';
import { useSelector } from 'react-redux';
import { ShoppingBag, Server, CheckCircle2, AlertCircle } from 'lucide-react';

export default function Navbar() {
  const { data: healthData, loading, error } = useSelector((state) => state.health);
  const { totalQuantity } = useSelector((state) => state.cart);

  const isHealthy = healthData && healthData.success && !error;

  return (
    <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
            <ShoppingBag className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="text-xl font-bold tracking-tight text-white">
              Apex<span className="text-cyan-400">Cart</span>
            </span>
            <span className="ml-2 text-xs uppercase px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 font-semibold border border-slate-700">
              MERN Stack
            </span>
          </div>
        </div>

        {/* Backend & Cart Indicator */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 text-xs px-3 py-1.5 rounded-full border border-slate-800 bg-slate-900">
            <Server className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-400">API:</span>
            {loading ? (
              <span className="text-amber-400 flex items-center gap-1 font-medium">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
                Checking...
              </span>
            ) : isHealthy ? (
              <span className="text-emerald-400 flex items-center gap-1 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5" /> Online
              </span>
            ) : (
              <span className="text-rose-400 flex items-center gap-1 font-medium">
                <AlertCircle className="w-3.5 h-3.5" /> Offline
              </span>
            )}
          </div>

          <div className="relative p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300">
            <ShoppingBag className="w-5 h-5" />
            {totalQuantity > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-cyan-500 text-black text-xs font-bold rounded-full flex items-center justify-center">
                {totalQuantity}
              </span>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

