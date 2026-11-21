import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export default function CategoryCard({ category }) {
  return (
    <Link
      to={`/shop?category=${encodeURIComponent(category.name)}`}
      className="group flex flex-col bg-[#FFFFFF] rounded-sm overflow-hidden border border-[#EAE5DE] shadow-xs hover:shadow-xl transition-all duration-500 hover:-translate-y-1"
    >
      {/* Image Container (4:5 Ratio) */}
      <div className="relative w-full aspect-[4/5] overflow-hidden bg-[#EFEEEA]">
        <img
          src={category.image}
          alt={category.title}
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          loading="lazy"
        />
        {/* Subtle Dark Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#1B1C1A]/70 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

        {/* Floating Pill Tag */}
        <span className="absolute top-4 left-4 bg-[#FBF9F5]/90 backdrop-blur-sm text-[#1B1C1A] px-3 py-1 rounded-full text-[10px] uppercase tracking-wider font-semibold border border-[#EAE5DE]/80">
          {category.tag}
        </span>
      </div>

      {/* Content Container */}
      <div className="p-5 flex flex-col flex-1 justify-between bg-[#FFFFFF]">
        <div>
          <h3 className="font-serif text-xl text-[#1B1C1A] group-hover:text-[#7B5800] transition-colors">
            {category.title}
          </h3>
          <p className="text-xs text-[#4A4731] mt-1 line-clamp-2">
            {category.description}
          </p>
        </div>
        <div className="pt-4 flex items-center text-xs font-semibold uppercase tracking-wider text-[#7B5800] group-hover:text-[#1B1C1A] transition-colors">
          <span>Explore</span>
          <ArrowRight className="w-3.5 h-3.5 ml-1 transition-transform group-hover:translate-x-1" />
        </div>
      </div>
    </Link>
  );
}

