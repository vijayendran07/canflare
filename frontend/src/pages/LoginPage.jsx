import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Lock, Sparkles, Mail, Key, ShieldCheck, ArrowRight } from 'lucide-react';
import { setUserCredentials, setAuthError } from '../redux/slices/authSlice';
import { showToast } from '../redux/slices/uiSlice';
import apiClient from '../services/apiClient';
import canflareLogo from '../assets/canflare-logo.jpg';

export default function LoginPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [tab, setTab] = useState('signin'); // 'signin' or 'signup'
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'customer'
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const endpoint = tab === 'signin' ? '/auth/login' : '/auth/register';
      const res = await apiClient.post(endpoint, formData);

      dispatch(setUserCredentials({ user: res.user, token: res.token }));
      dispatch(showToast({ message: `Welcome to the Atelier, ${res.user.name}!`, type: 'success' }));

      if (res.user.isAdmin || res.user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/account');
      }
    } catch (err) {
      dispatch(setAuthError(err.message));
      dispatch(showToast({ message: err.message || 'Authentication error', type: 'error' }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#FBF9F5] text-[#1B1C1A] flex flex-col justify-between py-12 px-4 sm:px-6">
      <div className="w-full max-w-lg mx-auto">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-block">
            <div className="bg-[#1B1C1A] rounded-lg px-6 py-3 inline-flex items-center mx-auto">
              <img
                src={canflareLogo}
                alt="Canflare — Let there be Light"
                className="h-10 w-auto object-contain"
              />
            </div>
          </Link>
        </div>

        {/* Auth Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-[#EAE8E4] overflow-hidden">
          {/* Tabs */}
          <div className="grid grid-cols-2 p-1.5 bg-[#F5F3EF] border-b border-[#EAE8E4] text-xs font-semibold uppercase tracking-wider text-center">
            <button
              type="button"
              onClick={() => setTab('signin')}
              className={`py-3 rounded-xl transition-all ${
                tab === 'signin' ? 'bg-white text-[#1B1C1A] shadow-xs' : 'text-[#7B785F] hover:text-[#1B1C1A]'
              }`}
            >
              Member Sign In
            </button>
            <button
              type="button"
              onClick={() => setTab('signup')}
              className={`py-3 rounded-xl transition-all ${
                tab === 'signup' ? 'bg-white text-[#1B1C1A] shadow-xs' : 'text-[#7B785F] hover:text-[#1B1C1A]'
              }`}
            >
              Create Atelier Account
            </button>
          </div>

          <div className="p-6 sm:p-10 space-y-6">
            <div className="text-center">
              <span className="text-[10px] uppercase tracking-[0.25em] text-[#7B5800] font-semibold">
                Sanctuary of Scent
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl text-[#1B1C1A] mt-1">
                {tab === 'signin' ? 'Welcome to the Atelier' : 'Join the Olfactory Salon'}
              </h2>
              <p className="text-xs text-[#7B785F] mt-1.5 max-w-sm mx-auto leading-relaxed">
                Access your private aromatic orders, curated reserves, and small-batch patron privileges.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {tab === 'signup' && (
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#7B785F] mb-1 font-medium">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full bg-[#F5F3EF] px-3.5 py-2.5 rounded-lg text-xs text-[#1B1C1A] outline-none border border-transparent focus:border-[#FAB507] focus:bg-white transition-all"
                  />
                </div>
              )}

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-[#7B785F] mb-1 font-medium">
                  Email Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full bg-[#F5F3EF] px-3.5 py-2.5 rounded-lg text-xs text-[#1B1C1A] outline-none border border-transparent focus:border-[#FAB507] focus:bg-white transition-all pr-9"
                  />
                  <Mail className="w-4 h-4 text-[#7B785F] absolute right-3 top-3" />
                </div>
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-[#7B785F] mb-1 font-medium">
                  Passphrase
                </label>
                <div className="relative">
                  <input
                    type="password"
                    name="password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full bg-[#F5F3EF] px-3.5 py-2.5 rounded-lg text-xs text-[#1B1C1A] outline-none border border-transparent focus:border-[#FAB507] focus:bg-white transition-all pr-9"
                  />
                  <Key className="w-4 h-4 text-[#7B785F] absolute right-3 top-3" />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#FAB507] hover:bg-[#E5A506] text-[#1B1C1A] py-3 rounded-lg text-xs uppercase tracking-widest font-bold shadow-xs hover:shadow-md transition-all flex items-center justify-center gap-2"
              >
                <span>{loading ? 'Consulting Atelier Registry...' : tab === 'signin' ? 'Sign In to Sanctum' : 'Create Atelier Account'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            <div className="pt-2 text-center text-xs text-[#7B785F]">
              <Link to="/shop" className="hover:text-[#1B1C1A] underline">
                Continue browsing candles as guest
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

