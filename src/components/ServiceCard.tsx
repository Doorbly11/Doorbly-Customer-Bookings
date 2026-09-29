import React, { useState } from 'react';
import { Service } from '../types';
import { getTechnicianVisual } from '../data/technicianVisuals';
import { VfxCard } from './VfxCard';
import { Check, Star, Clock, ShieldCheck, Sparkles, ShoppingCart } from 'lucide-react';

interface ServiceCardProps {
  service: Service;
  onBook: (service: Service) => void;
  onAddToCart?: (service: Service) => void;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({
  service,
  onBook,
  onAddToCart
}) => {
  const [imageError, setImageError] = useState(false);

  // Retrieve curated technician image & visual assets for this exact trade
  const techVisual = getTechnicianVisual(service.category_slug || 'home-repair-maintenance', service.slug);

  // Active image URL (custom admin image or curated technician trade photo)
  const displayImageUrl = (!imageError && service.image_url) 
    ? service.image_url 
    : techVisual.imageUrl;

  // Format customer hourly rate
  const price = service.customer_price ?? service.customer_hourly_price;
  const formattedPrice = Number.isInteger(price)
    ? `₹${price}`
    : `₹${price.toFixed(2)}`;

  return (
    <VfxCard
      id={`service-card-${service.slug}`}
      glowColor="emerald"
      className="h-full cursor-pointer hover:border-emerald-400 active:scale-[0.99] transition-all"
      onClick={() => onBook(service)}
    >
      {/* ========================================================
          MOBILE VIEW (< 640px): High-Density App-Style Card Layout
          Optimized for thumb reach, fast scanning, and visual beauty
         ======================================================== */}
      <div className="flex sm:hidden p-3 xs:p-3.5 gap-3 items-center w-full bg-white relative">
        {/* Left: Modern Rounded Image Container */}
        <div className="relative w-24 h-24 xs:w-28 xs:h-28 rounded-2xl overflow-hidden shrink-0 bg-slate-100 border border-slate-200/80 shadow-2xs">
          <img
            src={displayImageUrl}
            alt={service.name}
            onError={() => setImageError(true)}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            referrerPolicy="no-referrer"
            loading="lazy"
          />

          {/* Gentle vignette */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/15 to-transparent pointer-events-none" />

          {/* Role badge */}
          <span className={`absolute bottom-1.5 inset-x-1.5 text-center text-[9px] font-bold ${techVisual.pillText} ${techVisual.pillBg} backdrop-blur-md py-0.5 rounded-lg border ${techVisual.pillBorder} shadow-2xs truncate block`}>
            {techVisual.badgeLabel}
          </span>

          {/* Featured star badge */}
          {service.featured && (
            <span className="absolute top-1.5 left-1.5 text-[9px] font-bold text-amber-900 bg-amber-300/95 backdrop-blur-md px-1.5 py-0.2 rounded-md border border-amber-400 shadow-2xs flex items-center gap-0.5">
              <Star className="w-2.5 h-2.5 fill-amber-500 text-amber-600" />
            </span>
          )}
        </div>

        {/* Right: Content & Quick Book Button */}
        <div className="flex-1 min-w-0 flex flex-col justify-between h-24 xs:h-28 py-0.5">
          <div>
            {/* Trust rating & trade subtitle */}
            <div className="flex items-center gap-1.5 text-[11px] mb-0.5">
              <span className="inline-flex items-center gap-0.5 text-amber-600 font-extrabold bg-amber-50 px-1.5 py-0.2 rounded-md border border-amber-200/60 text-[10px]">
                <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-500" />
                <span>4.9</span>
              </span>
              <span className="text-slate-300">•</span>
              <span className="text-[11px] font-semibold text-emerald-700 truncate">
                {techVisual.tradeRole}
              </span>
            </div>

            {/* Service Name */}
            <h3 className="text-slate-900 text-sm font-bold leading-snug line-clamp-2 group-hover:text-emerald-700 transition-colors">
              {service.name}
            </h3>

            {/* Description brief */}
            <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5 font-normal">
              {service.description}
            </p>
          </div>

          {/* Bottom row: Price & Thumb-Friendly Action */}
          <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-100/90 mt-auto">
            <div className="shrink-0">
              <div className="flex items-baseline gap-0.5">
                <span className="text-base font-black text-slate-950 tracking-tight">
                  {formattedPrice}
                </span>
                <span className="text-[10px] text-slate-500 font-normal">/hr</span>
              </div>
              <span className="text-[9px] text-slate-500 font-medium block">
                Min {service.minimum_hours}h booking
              </span>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              {onAddToCart && (
                <button
                  type="button"
                  id={`btn-cart-mobile-${service.slug}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    onAddToCart(service);
                  }}
                  className="p-1.5 rounded-xl bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 border border-slate-200 transition-all cursor-pointer active:scale-95"
                  title="Add to Cart"
                >
                  <ShoppingCart className="w-3.5 h-3.5" />
                </button>
              )}
              <button
                type="button"
                id={`btn-book-mobile-${service.slug}`}
                onClick={(e) => {
                  e.stopPropagation();
                  onBook(service);
                }}
                className="inline-flex items-center justify-center gap-1 px-3 py-1.5 text-xs font-bold rounded-xl transition-all shadow-xs cursor-pointer active:scale-95 shrink-0 bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20 hover:shadow-md"
              >
                <span>Book Now</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================
          DESKTOP VIEW (>= 640px): Full-Featured Card Layout
         ======================================================== */}
      <div className="hidden sm:flex sm:flex-col h-full justify-between">
        {/* Top Image Banner */}
        <div className="relative h-44 w-full bg-slate-50 overflow-hidden shrink-0 border-b border-slate-100/80">
          <img
            src={displayImageUrl}
            alt={service.name}
            onError={() => setImageError(true)}
            className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
            referrerPolicy="no-referrer"
            loading="lazy"
          />

          {/* Soft ambient gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/55 via-slate-900/10 to-transparent pointer-events-none group-hover:opacity-75 transition-opacity duration-200" />

          {/* Technician Role Badge */}
          <div className={`absolute top-2.5 left-3 text-[10px] font-bold ${techVisual.pillText} ${techVisual.pillBg} backdrop-blur-md px-2.5 py-0.5 rounded-full border ${techVisual.pillBorder} shadow-xs`}>
            <span>{techVisual.badgeLabel}</span>
          </div>

          {/* Featured Tag */}
          {service.featured && (
            <span className="absolute top-2.5 right-3 text-[10px] font-bold tracking-wide text-emerald-950 bg-emerald-100/95 backdrop-blur-md px-2.5 py-0.5 rounded-full border border-emerald-300 shadow-xs flex items-center gap-1">
              <Star className="w-3 h-3 fill-amber-400 text-amber-500" />
              Featured
            </span>
          )}
        </div>

        {/* Card Body */}
        <div className="p-5 flex-1 flex flex-col justify-between relative bg-white transition-colors duration-200">
          <div className="relative z-10">
            <div className="flex items-start justify-between gap-3 mb-2">
              <div>
                <h3 className="text-slate-900 text-base font-bold leading-snug card-title group-hover:text-emerald-700 transition-colors duration-200">
                  {service.name}
                </h3>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="inline-flex items-center gap-0.5 text-amber-500 font-extrabold text-[11px]">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-500" />
                    <span>4.9</span>
                  </span>
                  <span className="text-slate-300">•</span>
                  <p className="text-[11px] text-slate-500 card-subtext">
                    {techVisual.tradeRole}
                  </p>
                </div>
              </div>
              <div className="text-right shrink-0">
                <div className="text-xl font-black text-slate-900 tracking-tight card-price group-hover:text-emerald-700 transition-colors duration-200 origin-right">
                  {formattedPrice}
                </div>
                <span className="text-xs text-slate-500 font-normal block card-subtext">/ hour</span>
              </div>
            </div>

            <p className="text-slate-600 text-xs sm:text-sm line-clamp-2 leading-relaxed mb-4 card-text">
              {service.description}
            </p>
          </div>

          {/* Footer Action & Minimum Hours */}
          <div className="pt-3.5 border-t border-slate-100/90 flex items-center justify-between gap-2 mt-auto relative z-10">
            <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium card-subtext">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>Min booking: {service.minimum_hours} {service.minimum_hours === 1 ? 'hour' : 'hours'}</span>
            </div>

            <div className="flex items-center gap-2">
              {onAddToCart && (
                <button
                  type="button"
                  id={`btn-cart-${service.slug}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    onAddToCart(service);
                  }}
                  className="inline-flex items-center justify-center gap-1 px-2.5 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer active:scale-95 bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 border border-slate-200 hover:border-emerald-300"
                  title="Add to Cart"
                >
                  <ShoppingCart className="w-3.5 h-3.5" />
                  <span>Cart</span>
                </button>
              )}
              <button
                type="button"
                id={`btn-book-${service.slug}`}
                onClick={(e) => {
                  e.stopPropagation();
                  onBook(service);
                }}
                className="inline-flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl transition-all shadow-xs cursor-pointer active:scale-95 bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20 hover:shadow-md"
              >
                <span>Book Now</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </VfxCard>
  );
};


