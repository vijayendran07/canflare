import React from 'react';
import { SlidersHorizontal, RotateCcw } from 'lucide-react';

export default function FilterSidebar({
  selectedFamily,
  onSelectFamily,
  selectedIntensity,
  onSelectIntensity,
  inStockOnly,
  onToggleInStock,
  priceTier,
  onSelectPriceTier,
  onResetFilters,
  activeFilterCount = 0,
}) {
  const families = [
    { name: 'Woody & Resinous', count: 6 },
    { name: 'Floral & Botanical', count: 5 },
    { name: 'Fresh & Herbaceous', count: 3 },
    { name: 'Gourmand & Sweet', count: 4 },
    { name: 'Oriental & Spiced', count: 2 },
  ];

  const intensities = [
    { id: 'Subtle', label: 'Subtle & Calming (Intimate throw)' },
    { id: 'Balanced', label: 'Balanced (Medium room throw)' },
    { id: 'Rich', label: 'Rich & Enveloping (Grand sanctuary)' },
  ];

  const priceTiers = [
    { id: 'under-499', label: 'Under ₹499', min: 0, max: 499 },
    { id: '500-799', label: '₹500 – ₹799', min: 500, max: 799 },
    { id: '800-1299', label: '₹800 – ₹1,299', min: 800, max: 1299 },
    { id: '1300-plus', label: '₹1,300 & Above', min: 1300, max: 99999 },
  ];

  return (
    <aside className="w-full lg:w-72 shrink-0 flex flex-col gap-6">
      {/* 1. Header with Reset Action */}
      <div className="flex items-center justify-between pb-3 bg-[#FFFFFF] px-4 py-3 rounded-sm border border-[#EAE5DE] shadow-xs">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-[#7B5800]" />
          <span className="text-xs font-semibold tracking-wider uppercase text-[#1B1C1A]">
            Refine Scent
          </span>
          {activeFilterCount > 0 && (
            <span className="w-4 h-4 rounded-full bg-[#FAB507] text-[#1B1C1A] text-[10px] font-bold flex items-center justify-center">
              {activeFilterCount}
            </span>
          )}
        </div>
        <button
          type="button"
          onClick={onResetFilters}
          className="text-[11px] font-medium tracking-wide uppercase text-[#7B5800] hover:text-[#1B1C1A] underline underline-offset-2 transition-colors flex items-center gap-1 cursor-pointer"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset</span>
        </button>
      </div>

      {/* 2. Active Filter Badges */}
      {(selectedFamily || selectedIntensity || inStockOnly || priceTier) && (
        <div className="flex flex-wrap gap-1.5">
          {selectedFamily && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-sm bg-[#EFEEEA] text-[#1B1C1A] text-[11px] font-medium border border-[#EAE5DE]">
              <span>{selectedFamily}</span>
              <button
                type="button"
                onClick={() => onSelectFamily(null)}
                className="hover:text-[#BA1A1A] transition-colors cursor-pointer"
              >
                ×
              </button>
            </span>
          )}
          {selectedIntensity && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-sm bg-[#EFEEEA] text-[#1B1C1A] text-[11px] font-medium border border-[#EAE5DE]">
              <span>Intensity: {selectedIntensity}</span>
              <button
                type="button"
                onClick={() => onSelectIntensity(null)}
                className="hover:text-[#BA1A1A] transition-colors cursor-pointer"
              >
                ×
              </button>
            </span>
          )}
          {priceTier && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-sm bg-[#EFEEEA] text-[#1B1C1A] text-[11px] font-medium border border-[#EAE5DE]">
              <span>{priceTier.label}</span>
              <button
                type="button"
                onClick={() => onSelectPriceTier(null)}
                className="hover:text-[#BA1A1A] transition-colors cursor-pointer"
              >
                ×
              </button>
            </span>
          )}
          {inStockOnly && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-sm bg-[#EFEEEA] text-[#1B1C1A] text-[11px] font-medium border border-[#EAE5DE]">
              <span>In Stock Only</span>
              <button
                type="button"
                onClick={onToggleInStock}
                className="hover:text-[#BA1A1A] transition-colors cursor-pointer"
              >
                ×
              </button>
            </span>
          )}
        </div>
      )}

      {/* 3. Filter Accordion 1: Fragrance Family */}
      <div className="bg-[#FFFFFF] p-5 rounded-sm border border-[#EAE5DE] shadow-xs space-y-3">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-[#1B1C1A] flex items-center justify-between">
          <span>Fragrance Family</span>
          <span className="text-[10px] text-[#7B785F] font-normal">5 families</span>
        </h3>
        <div className="space-y-2.5 pt-1">
          {families.map((fam) => {
            const isChecked = selectedFamily === fam.name;
            return (
              <label
                key={fam.name}
                className="flex items-center justify-between text-xs text-[#4A4731] hover:text-[#1B1C1A] cursor-pointer select-none"
              >
                <span className="flex items-center gap-2.5">
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => onSelectFamily(isChecked ? null : fam.name)}
                    className="w-3.5 h-3.5 rounded-xs accent-[#FAB507] cursor-pointer"
                  />
                  <span className={isChecked ? 'font-semibold text-[#1B1C1A]' : ''}>
                    {fam.name}
                  </span>
                </span>
                <span className="text-[11px] text-[#7B785F]">{fam.count}</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* 4. Filter Accordion 2: Olfactory Intensity */}
      <div className="bg-[#FFFFFF] p-5 rounded-sm border border-[#EAE5DE] shadow-xs space-y-3">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-[#1B1C1A]">
          Olfactory Intensity
        </h3>
        <div className="space-y-2.5 pt-1">
          {intensities.map((item) => {
            const isSelected = selectedIntensity === item.id;
            return (
              <label
                key={item.id}
                className="flex items-center gap-2.5 text-xs text-[#4A4731] hover:text-[#1B1C1A] cursor-pointer select-none"
              >
                <input
                  type="radio"
                  name="intensity"
                  checked={isSelected}
                  onChange={() => onSelectIntensity(isSelected ? null : item.id)}
                  className="w-3.5 h-3.5 accent-[#FAB507] cursor-pointer"
                />
                <span className={isSelected ? 'font-semibold text-[#1B1C1A]' : ''}>
                  {item.label}
                </span>
              </label>
            );
          })}
        </div>
      </div>

      {/* 5. Filter Accordion 3: Price Tier */}
      <div className="bg-[#FFFFFF] p-5 rounded-sm border border-[#EAE5DE] shadow-xs space-y-3">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-[#1B1C1A]">
          Price Tier
        </h3>
        <div className="space-y-2.5 pt-1">
          {priceTiers.map((tier) => {
            const isSelected = priceTier?.id === tier.id;
            return (
              <label
                key={tier.id}
                className="flex items-center justify-between text-xs text-[#4A4731] hover:text-[#1B1C1A] cursor-pointer select-none"
              >
                <span className="flex items-center gap-2.5">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => onSelectPriceTier(isSelected ? null : tier)}
                    className="w-3.5 h-3.5 rounded-xs accent-[#FAB507] cursor-pointer"
                  />
                  <span className={isSelected ? 'font-semibold text-[#1B1C1A]' : ''}>
                    {tier.label}
                  </span>
                </span>
              </label>
            );
          })}
        </div>
      </div>

      {/* 6. Availability Toggle (iOS-style switch) */}
      <div className="bg-[#FFFFFF] p-5 rounded-sm border border-[#EAE5DE] shadow-xs flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#1B1C1A]">
            In Stock Only
          </span>
          <span className="text-[10px] text-[#7B785F]">
            Hide out of harvest blends
          </span>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={inStockOnly}
            onChange={onToggleInStock}
            className="sr-only peer"
          />
          <div className="w-9 h-5 bg-[#EAE8E4] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#FAB507]" />
        </label>
      </div>
    </aside>
  );
}

