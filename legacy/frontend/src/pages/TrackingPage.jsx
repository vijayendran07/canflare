import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Truck,
  CheckCircle2,
  Clock,
  Package,
  Home,
  FileText,
  Search,
  Sparkles,
  MapPin,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { formatCurrency } from '../utils/formatters';
import apiClient from '../services/apiClient';

export default function TrackingPage() {
  const { orderId } = useParams();
  const [searchVal, setSearchVal] = useState(orderId || 'LC-8921-2026');
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchOrderDetails = async (idToSearch) => {
    setLoading(true);
    try {
      const res = await apiClient.get(`/orders/${idToSearch || 'LC-8921-2026'}`);
      setOrder(res.order || res);
    } catch (err) {
      // Fallback presentation
      setOrder({
        orderNumber: idToSearch || 'LC-8921-2026',
        carrier: 'BlueDart Air Express (AWB: 9841029410)',
        trackingNumber: 'IND-POST-99281741-BLR',
        estimatedDelivery: 'Tomorrow by 4:00 PM IST',
        status: 'In Transit',
        customer: {
          name: 'Clara Delacroix',
          email: 'clara@lueur.com'
        },
        shippingAddress: {
          street: '42 Rue des Artisans, Suite 4B',
          city: 'Bengaluru',
          state: 'Karnataka',
          postalCode: '560001'
        },
        items: [
          {
            name: 'Sandalwood Luxury Candle',
            price: 699,
            quantity: 2,
            image: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=400&q=80'
          },
          {
            name: 'Rose Bliss Candle',
            price: 499,
            quantity: 1,
            image: 'https://images.unsplash.com/photo-1596433809252-260c2745dfdd?auto=format&fit=crop&w=400&q=80'
          }
        ],
        pricing: {
          subtotal: 1897,
          total: 1897
        },
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
        ]
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrderDetails(orderId);
  }, [orderId]);

  const handleLookup = (e) => {
    e.preventDefault();
    if (searchVal.trim()) {
      fetchOrderDetails(searchVal.trim());
    }
  };

  return (
    <div className="w-full bg-[#FBF9F5] text-[#1B1C1A] min-h-screen">
      {/* Quick Search Accent Bar */}
      <section className="w-full bg-[#F5F3EF] px-4 sm:px-6 lg:px-8 py-3 border-b border-[#EAE8E4]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-[#7B785F]">
            <Link to="/" className="hover:text-[#1B1C1A]">Home</Link>
            <span>/</span>
            <span className="text-[#1B1C1A] font-medium">Consignment Tracking #{order?.orderNumber || 'LC-8921'}</span>
          </div>

          <form onSubmit={handleLookup} className="flex items-center gap-2 w-full md:w-auto">
            <div className="relative flex-1 md:w-72 bg-white rounded-lg border border-[#EAE8E4] px-3 py-1.5 flex items-center">
              <Truck className="w-4 h-4 text-[#7B785F] mr-2" />
              <input
                type="text"
                value={searchVal}
                onChange={(e) => setSearchVal(e.target.value)}
                placeholder="Enter Order # (e.g. LC-8921-2026)"
                className="bg-transparent text-xs text-[#1B1C1A] placeholder:text-[#7B785F] focus:outline-none w-full uppercase font-medium"
              />
            </div>
            <button
              type="submit"
              className="bg-[#1B1C1A] text-white px-4 py-1.5 text-xs uppercase tracking-wider font-semibold rounded-lg hover:bg-[#333] transition-all flex items-center gap-1 shadow-xs"
            >
              Search
            </button>
          </form>
        </div>
      </section>

      {/* Hero Header */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-8 border-b border-[#EAE8E4]">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFDEA4] text-[#261900] text-[11px] font-semibold tracking-widest uppercase">
              <span className="w-2 h-2 rounded-full bg-[#FAB507] animate-pulse" />
              Live Atelier Consignment Status
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#1B1C1A]">
              Tracking Order <span className="italic font-normal">#{order?.orderNumber || 'LC-8921'}</span>
            </h1>
            <p className="text-xs sm:text-sm text-[#7B785F] flex items-center gap-2 flex-wrap">
              <span>Status: <strong className="text-[#7B5800] uppercase font-semibold">{order?.status || 'In Transit'}</strong></span>
              <span>•</span>
              <span className="text-[#1B1C1A] font-medium">Est. Arrival: {order?.estimatedDelivery || 'Tomorrow'}</span>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => window.print()}
              className="bg-white border border-[#EAE8E4] text-[#1B1C1A] px-4 py-2 rounded-lg text-xs uppercase tracking-wider font-semibold hover:bg-[#F5F3EF] transition-all flex items-center gap-2 shadow-xs"
            >
              <FileText className="w-4 h-4 text-[#7B785F]" />
              <span>Download Tax Invoice</span>
            </button>
            <Link
              to="/shop"
              className="bg-[#FAB507] text-[#1B1C1A] px-4 py-2 rounded-lg text-xs uppercase tracking-wider font-semibold hover:bg-[#E5A506] transition-all shadow-xs"
            >
              Back to Catalog
            </Link>
          </div>
        </div>

        {/* Carrier Info Card */}
        <div className="mt-8 bg-white border border-[#EAE8E4] rounded-xl p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-[#FFDEA4]/30 text-[#7B5800] flex items-center justify-center shrink-0">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-widest text-[#7B785F] font-semibold block">
                Expedited Logistics Partner
              </span>
              <p className="text-sm font-semibold text-[#1B1C1A] mt-0.5">
                {order?.carrier || 'BlueDart Air Express'} •{' '}
                <span className="font-mono text-xs text-[#7B785F]">AWB: {order?.trackingNumber || '9841029410'}</span>
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs text-[#7B5800] bg-[#FFDEA4]/20 px-3 py-1.5 rounded-lg font-medium">
            <ShieldCheck className="w-4 h-4" />
            <span>Fragile Botanical Wax Packaging Verified</span>
          </div>
        </div>

        {/* Tracking Timeline & Order Breakdown */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Timeline Column */}
          <div className="lg:col-span-7 bg-white border border-[#EAE8E4] rounded-xl p-6 sm:p-8 shadow-xs">
            <h3 className="font-serif text-xl text-[#1B1C1A] mb-6">Atelier Preparation &amp; Transit Milestones</h3>

            <div className="space-y-6 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-[#EAE8E4]">
              {(order?.trackingTimeline || []).map((step, idx) => (
                <div key={idx} className="relative flex items-start gap-4">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 z-10 transition-colors ${
                      step.completed
                        ? 'bg-[#FAB507] text-[#1B1C1A] ring-4 ring-[#FFDEA4]/40'
                        : 'bg-[#F5F3EF] text-[#7B785F] border border-[#EAE8E4]'
                    }`}
                  >
                    {step.completed ? <CheckCircle2 className="w-4 h-4" /> : <Clock className="w-3.5 h-3.5" />}
                  </div>
                  <div className="flex-1 pb-4">
                    <div className="flex items-baseline justify-between flex-wrap gap-1">
                      <h4 className={`text-xs sm:text-sm font-semibold ${step.completed ? 'text-[#1B1C1A]' : 'text-[#7B785F]'}`}>
                        {step.stage}
                      </h4>
                      <span className="text-[11px] font-mono text-[#7B785F]">{step.timestamp}</span>
                    </div>
                    <p className="text-xs text-[#4A4731] mt-1 leading-relaxed">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Delivery Destination & Manifest Column */}
          <div className="lg:col-span-5 space-y-6">
            {/* Address */}
            <div className="bg-white border border-[#EAE8E4] rounded-xl p-6 shadow-xs space-y-3">
              <div className="flex items-center gap-2 pb-2 border-b border-[#EAE8E4]">
                <MapPin className="w-4 h-4 text-[#7B5800]" />
                <h4 className="font-serif text-base text-[#1B1C1A]">Sanctuary Address</h4>
              </div>
              <p className="text-xs text-[#1B1C1A] font-semibold">{order?.customer?.name || 'Clara Delacroix'}</p>
              <p className="text-xs text-[#4A4731] leading-relaxed">
                {order?.shippingAddress?.street || '42 Rue des Artisans, Suite 4B'}<br />
                {order?.shippingAddress?.city || 'Bengaluru'}, {order?.shippingAddress?.state || 'Karnataka'} - {order?.shippingAddress?.postalCode || '560001'}
              </p>
            </div>

            {/* Consignment Items */}
            <div className="bg-white border border-[#EAE8E4] rounded-xl p-6 shadow-xs space-y-4">
              <h4 className="font-serif text-base text-[#1B1C1A] pb-2 border-b border-[#EAE8E4]">
                Manifest Items ({order?.items?.length || 0})
              </h4>
              <div className="space-y-3">
                {(order?.items || []).map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-12 h-12 rounded-lg object-cover bg-[#F5F3EF] border border-[#EAE8E4]"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-[#1B1C1A] truncate">{item.name}</p>
                      <p className="text-[11px] text-[#7B785F]">Qty: {item.quantity}</p>
                    </div>
                    <span className="text-xs font-semibold text-[#1B1C1A]">
                      {formatCurrency(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="pt-3 border-t border-[#EAE8E4] flex justify-between items-center text-xs">
                <span className="font-medium text-[#4A4731]">Total Consignment Value</span>
                <span className="font-serif text-sm font-bold text-[#1B1C1A]">
                  {formatCurrency(order?.pricing?.total || 1897)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

