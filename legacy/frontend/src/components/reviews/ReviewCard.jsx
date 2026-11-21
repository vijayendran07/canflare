import React from 'react';
import { Star, CheckCircle } from 'lucide-react';

export default function ReviewCard({ review }) {
  return (
    <div className="p-6 rounded-sm bg-[#FFFFFF] border border-[#EAE5DE] shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
      <div>
        {/* Star Rating */}
        <div className="flex items-center gap-1 text-[#FAB507] mb-3">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="w-4 h-4 fill-[#FAB507]" />
          ))}
        </div>

        {/* Review Quote */}
        <p className="font-serif text-base text-[#1B1C1A] leading-relaxed italic mb-4">
          "{review.quote}"
        </p>
      </div>

      <div className="pt-4 border-t border-[#EAE5DE] flex items-center justify-between text-xs">
        <div>
          <span className="font-semibold text-[#1B1C1A] block">
            {review.author}
          </span>
          <span className="text-[11px] text-[#7B785F]">
            {review.location} • {review.productPurchased}
          </span>
        </div>
        <div className="flex items-center gap-1 text-[10px] uppercase tracking-wider text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-sm">
          <CheckCircle className="w-3 h-3" />
          <span>Verified</span>
        </div>
      </div>
    </div>
  );
}

