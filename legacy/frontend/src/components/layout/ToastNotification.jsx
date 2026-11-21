import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { hideToast } from '../../redux/slices/uiSlice';

export default function ToastNotification() {
  const dispatch = useDispatch();
  const { visible, message, type } = useSelector((state) => state.ui?.toast || {});

  useEffect(() => {
    if (visible) {
      const timer = setTimeout(() => {
        dispatch(hideToast());
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [visible, dispatch]);

  if (!visible) return null;

  const iconMap = {
    success: <CheckCircle2 className="w-5 h-5 text-[#FAB507]" />,
    error: <AlertCircle className="w-5 h-5 text-[#BA1A1A]" />,
    info: <Info className="w-5 h-5 text-[#FFDEA4]" />,
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-[#1B1C1A] text-white px-5 py-3.5 rounded-xl shadow-2xl border border-[#7B785F]/30 animate-in fade-in slide-in-from-bottom-5 duration-300">
      {iconMap[type] || iconMap.success}
      <span className="text-xs font-sans text-slate-100">{message}</span>
      <button
        onClick={() => dispatch(hideToast())}
        className="ml-2 text-slate-400 hover:text-white"
        aria-label="Close notification"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

