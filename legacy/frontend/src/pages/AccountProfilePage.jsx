import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  User,
  Package,
  Heart,
  Settings,
  Sparkles,
  LogOut,
  Flame,
  Award,
  Calendar,
  CheckCircle2,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { logoutUser } from '../redux/slices/authSlice';
import { showToast } from '../redux/slices/uiSlice';
import { formatCurrency } from '../utils/formatters';

export default function AccountProfilePage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const authUser = useSelector((state) => state.auth?.user);

  const [activeTab, setActiveTab] = useState('profile');

  const user = authUser || {
    name: 'Ananya Kapoor',
    email: 'ananya.kapoor@atelier.in',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80',
    title: 'Atelier Connoisseur (Tier 2)',
    memberSince: 'October 2023',
    points: 850,
    credit: 170
  };

  const archivedOrders = [
    {
      orderNumber: 'LC-8921-2026',
      date: '15 Nov 2026',
      total: 1897,
      status: 'In Transit',
      itemsCount: 3,
      primaryItem: 'Sandalwood Luxury Candle (x2)'
    },
    {
      orderNumber: 'LC-8920-2026',
      date: '13 Nov 2026',
      total: 649,
      status: 'Delivered',
      itemsCount: 1,
      primaryItem: 'Vanilla Dreams Candle (x1)'
    }
  ];

  const handleLogout = () => {
    dispatch(logoutUser());
    dispatch(showToast({ message: 'Logged out from Atelier session', type: 'info' }));
    navigate('/login');
  };

  return (
    <div className="w-full bg-[#FBF9F5] text-[#1B1C1A] min-h-screen pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Top Greeting Atelier Banner */}
        <section className="relative rounded-2xl overflow-hidden bg-white border border-[#EAE8E4] p-6 sm:p-8 shadow-xs mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="flex items-center gap-4 sm:gap-6">
              <div className="w-20 h-20 rounded-full overflow-hidden bg-[#F5F3EF] border-2 border-[#FAB507] shrink-0">
                <img
                  src={user.avatar || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80'}
                  alt={user.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] uppercase tracking-[0.24em] font-semibold text-[#7B5800]">
                    Salon Privé
                  </span>
                  <span className="text-xs text-[#7B785F]">• Member since {user.memberSince || '2024'}</span>
                </div>
                <h1 className="font-serif text-2xl sm:text-3xl text-[#1B1C1A]">Namaste, {user.name}</h1>
                <p className="text-xs text-[#7B785F]">Welcome back to your sensory sanctum and curated reserves.</p>
              </div>
            </div>

            {/* Metrics Ribbon */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="bg-[#F5F3EF] px-4 py-2.5 rounded-xl border border-[#EAE8E4] flex items-center gap-3">
                <Award className="w-5 h-5 text-[#7B5800]" />
                <div>
                  <span className="text-[10px] uppercase tracking-wider block text-[#7B785F]">Patron Tier</span>
                  <span className="text-xs font-semibold text-[#1B1C1A]">{user.title || 'Connoisseur'}</span>
                </div>
              </div>

              <div className="bg-[#F5F3EF] px-4 py-2.5 rounded-xl border border-[#EAE8E4] flex items-center gap-3">
                <Flame className="w-5 h-5 text-[#FAB507]" />
                <div>
                  <span className="text-[10px] uppercase tracking-wider block text-[#7B785F]">Atelier Sol Rewards</span>
                  <span className="text-xs font-semibold text-[#1B1C1A]">850 Pts (₹170 Credit)</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Dashboard Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Navigation */}
          <aside className="lg:col-span-3 space-y-2">
            <div className="bg-white border border-[#EAE8E4] rounded-xl p-2 shadow-xs space-y-1">
              <button
                onClick={() => setActiveTab('profile')}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-medium transition-all ${
                  activeTab === 'profile'
                    ? 'bg-[#FAB507] text-[#1B1C1A] font-semibold shadow-xs'
                    : 'text-[#4A4731] hover:bg-[#F5F3EF]'
                }`}
              >
                <Sparkles className="w-4 h-4" />
                <span>Olfactory Scent Identity</span>
              </button>

              <button
                onClick={() => setActiveTab('orders')}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-medium transition-all ${
                  activeTab === 'orders'
                    ? 'bg-[#FAB507] text-[#1B1C1A] font-semibold shadow-xs'
                    : 'text-[#4A4731] hover:bg-[#F5F3EF]'
                }`}
              >
                <Package className="w-4 h-4" />
                <span>Archived Dispatches</span>
              </button>

              <Link
                to="/wishlist"
                className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-medium text-[#4A4731] hover:bg-[#F5F3EF] transition-all"
              >
                <Heart className="w-4 h-4" />
                <span>Saved Reserves</span>
              </Link>

              {authUser?.isAdmin && (
                <Link
                  to="/admin"
                  className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-semibold text-[#7B5800] bg-[#FFDEA4]/30 hover:bg-[#FFDEA4]/50 transition-all"
                >
                  <Award className="w-4 h-4" />
                  <span>Atelier Merchant Portal</span>
                </Link>
              )}

              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-medium text-rose-700 hover:bg-rose-50 transition-all"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out of Atelier</span>
              </button>
            </div>
          </aside>

          {/* Right Main Content */}
          <main className="lg:col-span-9 space-y-6">
            {activeTab === 'profile' ? (
              <div className="space-y-6">
                {/* Scent DNA Card */}
                <div className="bg-white border border-[#EAE8E4] rounded-xl p-6 sm:p-8 shadow-xs space-y-6">
                  <div className="flex items-center justify-between pb-3 border-b border-[#EAE8E4]">
                    <div>
                      <h3 className="font-serif text-xl text-[#1B1C1A]">Bespoke Olfactory Profile</h3>
                      <p className="text-xs text-[#7B785F]">Your curated sensory preferences based on small-batch tastings</p>
                    </div>
                    <span className="text-xs px-2.5 py-1 bg-[#FFDEA4] text-[#7B5800] font-semibold rounded-full">
                      98% Accord Resonance
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-[#F5F3EF] p-4 rounded-xl border border-[#EAE8E4]">
                      <span className="text-[10px] uppercase tracking-wider text-[#7B785F] font-semibold block mb-1">
                        Primary Family
                      </span>
                      <p className="text-sm font-semibold text-[#1B1C1A]">Woody &amp; Earthy</p>
                      <p className="text-xs text-[#7B785F] mt-1">Mysore Sandalwood, Smoky Amber</p>
                    </div>

                    <div className="bg-[#F5F3EF] p-4 rounded-xl border border-[#EAE8E4]">
                      <span className="text-[10px] uppercase tracking-wider text-[#7B785F] font-semibold block mb-1">
                        Diffusion Intensity
                      </span>
                      <p className="text-sm font-semibold text-[#1B1C1A]">Rich &amp; Contemplative</p>
                      <p className="text-xs text-[#7B785F] mt-1">Ideal for spacious evening salons</p>
                    </div>

                    <div className="bg-[#F5F3EF] p-4 rounded-xl border border-[#EAE8E4]">
                      <span className="text-[10px] uppercase tracking-wider text-[#7B785F] font-semibold block mb-1">
                        Preferred Wick Craft
                      </span>
                      <p className="text-sm font-semibold text-[#1B1C1A]">FSC Crackling Wood Wick</p>
                      <p className="text-xs text-[#7B785F] mt-1">Organic soothing auditory flame</p>
                    </div>
                  </div>

                  {/* Chord Visualizer */}
                  <div className="space-y-3 pt-2">
                    <h4 className="text-xs uppercase tracking-wider font-semibold text-[#4A4731]">
                      Fragrance Chord Distribution
                    </h4>
                    <div className="space-y-2 text-xs">
                      <div>
                        <div className="flex justify-between mb-1">
                          <span>Aged Mysore Sandalwood</span>
                          <span className="font-semibold">45%</span>
                        </div>
                        <div className="w-full h-2 bg-[#F5F3EF] rounded-full overflow-hidden">
                          <div className="h-full bg-[#FAB507] rounded-full" style={{ width: '45%' }} />
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span>Damask Rose Petals &amp; Cassis</span>
                          <span className="font-semibold">30%</span>
                        </div>
                        <div className="w-full h-2 bg-[#F5F3EF] rounded-full overflow-hidden">
                          <div className="h-full bg-[#7B5800] rounded-full" style={{ width: '30%' }} />
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span>Warm Golden Amber &amp; Tonka Bean</span>
                          <span className="font-semibold">25%</span>
                        </div>
                        <div className="w-full h-2 bg-[#F5F3EF] rounded-full overflow-hidden">
                          <div className="h-full bg-[#FFDEA4] rounded-full" style={{ width: '25%' }} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white border border-[#EAE8E4] rounded-xl p-6 shadow-xs space-y-4">
                <h3 className="font-serif text-xl text-[#1B1C1A] pb-3 border-b border-[#EAE8E4]">
                  Archived Consignments
                </h3>
                <div className="space-y-3">
                  {archivedOrders.map((ord) => (
                    <div
                      key={ord.orderNumber}
                      className="p-4 rounded-xl border border-[#EAE8E4] bg-[#F5F3EF] flex items-center justify-between gap-4 flex-wrap"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-[#1B1C1A]">#{ord.orderNumber}</span>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#FFDEA4] text-[#7B5800] font-semibold">
                            {ord.status}
                          </span>
                        </div>
                        <p className="text-xs text-[#7B785F] mt-1">{ord.primaryItem} • {ord.date}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-semibold text-[#1B1C1A]">{formatCurrency(ord.total)}</span>
                        <Link
                          to={`/track/${ord.orderNumber}`}
                          className="bg-white border border-[#EAE8E4] px-3 py-1.5 rounded-lg text-xs font-medium text-[#1B1C1A] hover:bg-[#EAE8E4] transition-all flex items-center gap-1"
                        >
                          <span>Track Live</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

