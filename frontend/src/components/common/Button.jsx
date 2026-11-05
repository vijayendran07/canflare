import React from 'react';

export default function Button({
  children,
  variant = 'primary',
  className = '',
  disabled = false,
  onClick,
  type = 'button',
  icon,
  ...props
}) {
  const baseClasses =
    'inline-flex items-center justify-center gap-2 rounded-sm font-sans text-xs uppercase tracking-wider font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer';

  const variants = {
    primary:
      'bg-[#FAB507] text-[#1B1C1A] hover:bg-[#e0a205] shadow-sm hover:shadow-md active:scale-[0.99] py-3 px-6',
    secondary:
      'border border-[#FAB507] text-[#7B5800] bg-transparent hover:bg-[#FAB507]/10 py-2.5 px-5',
    dark:
      'bg-[#1B1C1A] text-white hover:bg-[#30312E] py-3 px-6',
    ghost:
      'text-[#7B5800] hover:text-[#1B1C1A] hover:underline py-2 px-3',
  };

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`${baseClasses} ${variants[variant] || variants.primary} ${className}`}
      {...props}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
    </button>
  );
}

