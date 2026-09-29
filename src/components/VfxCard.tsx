import React from 'react';

export type GlowColor = 'emerald' | 'cyan' | 'indigo' | 'amber' | 'yellow-blue' | 'purple' | string;

interface VfxCardProps {
  children: React.ReactNode;
  id?: string;
  className?: string;
  onClick?: () => void;
  glowColor?: GlowColor;
  enableTilt?: boolean;
  interactiveTilt?: boolean;
}

export const VfxCard: React.FC<VfxCardProps> = ({
  children,
  id,
  className = '',
  onClick,
}) => {
  return (
    <div
      id={id}
      onClick={onClick}
      className={`group relative rounded-2xl bg-white border border-slate-200/90 hover:border-emerald-500 hover:shadow-lg hover:shadow-emerald-950/5 hover:-translate-y-1 transition-all duration-200 ease-out overflow-hidden flex flex-col justify-between ${
        onClick ? 'cursor-pointer active:scale-[0.99] active:translate-y-0' : ''
      } ${className}`}
    >
      {/* Clean Green Top Accent Highlight on Hover */}
      <div className="absolute top-0 inset-x-0 h-[2.5px] bg-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-20 pointer-events-none" />

      {/* Card Content */}
      {children}
    </div>
  );
};


