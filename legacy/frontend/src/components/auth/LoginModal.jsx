import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { X, Mail, Lock, Eye, EyeOff, ArrowRight, ShieldCheck } from 'lucide-react';
import { closeLoginModal, showToast } from '../../redux/slices/uiSlice';
import { setUserCredentials, setAuthError } from '../../redux/slices/authSlice';
import apiClient from '../../services/apiClient';
import canflareLogo from '../../assets/canflare-logo.jpg';

export default function LoginModal() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const overlayRef = useRef(null);

  const { isLoginModalOpen, loginModalRedirectPath } = useSelector((s) => s.ui);

  const [tab, setTab] = useState('signin');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');

  // Reset form when modal opens
  useEffect(() => {
    if (isLoginModalOpen) {
      setFormData({ name: '', email: '', password: '' });
      setError('');
      setTab('signin');
      setShowPassword(false);
    }
  }, [isLoginModalOpen]);

  // Close on Escape
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') dispatch(closeLoginModal()); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [dispatch]);

  if (!isLoginModalOpen) return null;

  const handleChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const endpoint = tab === 'signin' ? '/auth/login' : '/auth/register';
      const res = await apiClient.post(endpoint, formData);

      dispatch(setUserCredentials({ user: res.user, token: res.token }));
      dispatch(showToast({ message: `Welcome, ${res.user.name}! 🕯️`, type: 'success' }));
      dispatch(closeLoginModal());

      // Route based on role
      if (res.user.isAdmin || res.user.role === 'admin') {
        navigate('/admin');
      } else {
        // Go to redirect path (e.g. /cart after trying to add) or account
        navigate(loginModalRedirectPath || '/account');
      }
    } catch (err) {
      setError(err.message || 'Invalid credentials. Please try again.');
      dispatch(setAuthError(err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target === overlayRef.current) dispatch(closeLoginModal());
  };

  return (
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="Sign in to Canflare"
    >
      <div className="relative w-full max-w-md bg-[#FBF9F5] rounded-2xl shadow-2xl border border-[#EAE5DE] overflow-hidden animate-[fadeSlideUp_0.2s_ease-out]">
        {/* Close Button */}
        <button
          onClick={() => dispatch(closeLoginModal())}
          className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-[#EFEEEA] hover:bg-[#EAE5DE] flex items-center justify-center transition-colors"
          aria-label="Close"
        >
          <X className="w-4 h-4 text-[#4A4731]" />
        </button>

        {/* Logo Header */}
        <div className="bg-[#1B1C1A] px-8 pt-8 pb-6 text-center">
          <div className="inline-flex items-center">
            <img
              src={canflareLogo}
              alt="Canflare — Let there be Light"
              className="h-10 w-auto object-contain"
            />
          </div>
          <p className="text-[#FFDEA4] text-[11px] tracking-[0.2em] uppercase mt-2 font-medium">
            {loginModalRedirectPath === '/cart'
              ? 'Sign in to continue shopping'
              : 'Your Artisan Account'}
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-[#EAE5DE] bg-white">
          {['signin', 'signup'].map((t) => (
            <button
              key={t}
              onClick={() => { setTab(t); setError(''); }}
              className={`flex-1 py-3 text-xs font-semibold uppercase tracking-wider transition-colors ${
                tab === t
                  ? 'text-[#1B1C1A] border-b-2 border-[#FAB507]'
                  : 'text-[#7B785F] hover:text-[#1B1C1A]'
              }`}
            >
              {t === 'signin' ? 'Sign In' : 'Create Account'}
            </button>
          ))}
        </div>

        {/* Form */}
        <div className="p-6 space-y-4">
          {/* Error Banner */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-xs text-red-700 flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5 text-red-500" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3">
            {/* Name field (sign up only) */}
            {tab === 'signup' && (
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-[#4A4731] mb-1.5 font-medium">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required={tab === 'signup'}
                  placeholder="Ananya Kapoor"
                  className="w-full bg-[#EFEEEA] rounded-lg px-4 py-2.5 text-sm text-[#1B1C1A] placeholder:text-[#7B785F] focus:outline-none focus:ring-2 focus:ring-[#FAB507] border border-transparent"
                />
              </div>
            )}

            {/* Email */}
            <div>
              <label className="block text-[11px] uppercase tracking-wider text-[#4A4731] mb-1.5 font-medium">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7B785F]" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="you@example.com"
                  autoFocus
                  className="w-full bg-[#EFEEEA] rounded-lg pl-10 pr-4 py-2.5 text-sm text-[#1B1C1A] placeholder:text-[#7B785F] focus:outline-none focus:ring-2 focus:ring-[#FAB507] border border-transparent"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-[11px] uppercase tracking-wider text-[#4A4731] mb-1.5 font-medium">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7B785F]" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder="••••••••"
                  className="w-full bg-[#EFEEEA] rounded-lg pl-10 pr-10 py-2.5 text-sm text-[#1B1C1A] placeholder:text-[#7B785F] focus:outline-none focus:ring-2 focus:ring-[#FAB507] border border-transparent"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7B785F] hover:text-[#1B1C1A]"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#1B1C1A] hover:bg-[#30312E] text-white font-semibold text-sm rounded-lg transition-colors flex items-center justify-center gap-2 mt-2 disabled:opacity-60 cursor-pointer"
            >
              {loading ? (
                <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>{tab === 'signin' ? 'Sign In' : 'Create Account'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

