// Curated Technician & Trade Visuals with Light Watermark Images

export interface TechnicianVisual {
  categorySlug: string;
  tradeRole: string;
  imageUrl: string;
  watermarkIconName: string;
  technicianTitle: string;
  badgeLabel: string;
  themeColor: string;
  bgTint: string;
}

// Category-level trade visuals and background watermark definitions
export const CATEGORY_TECHNICIAN_VISUALS: Record<string, {
  imageUrl: string;
  watermarkSvgPath: string;
  tradeRole: string;
  badgeLabel: string;
  accentColor: string;
  bgLight: string;
  lightCardBg: string;
  pillBg: string;
  pillText: string;
  pillBorder: string;
  watermarkColor: string;
  hoverBorder: string;
}> = {
  'baby': {
    imageUrl: 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&w=600&q=80',
    watermarkSvgPath: 'M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z',
    tradeRole: 'Hourly Babysitter & Child Caregiver',
    badgeLabel: 'Verified & Background-Checked',
    accentColor: 'rose',
    bgLight: 'from-rose-500/10 to-pink-500/5',
    lightCardBg: 'from-white via-rose-50/20 to-pink-50/10',
    pillBg: 'bg-rose-50/90',
    pillText: 'text-rose-800',
    pillBorder: 'border-rose-200/70',
    watermarkColor: 'text-rose-900',
    hoverBorder: 'hover:border-rose-400/50'
  },
  'elderly-care': {
    imageUrl: 'https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?auto=format&fit=crop&w=600&q=80',
    watermarkSvgPath: 'M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z',
    tradeRole: 'Compassionate Senior Companion',
    badgeLabel: 'Verified & Background-Checked',
    accentColor: 'emerald',
    bgLight: 'from-emerald-500/10 to-teal-500/5',
    lightCardBg: 'from-white via-emerald-50/20 to-teal-50/10',
    pillBg: 'bg-emerald-50/90',
    pillText: 'text-emerald-800',
    pillBorder: 'border-emerald-200/70',
    watermarkColor: 'text-emerald-900',
    hoverBorder: 'hover:border-emerald-400/50'
  },
  'baby-child-elderly-care': {
    imageUrl: 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&w=600&q=80',
    watermarkSvgPath: 'M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z',
    tradeRole: 'Compassionate Hourly Caregiver',
    badgeLabel: 'Verified & Background-Checked',
    accentColor: 'rose',
    bgLight: 'from-rose-500/10 to-pink-500/5',
    lightCardBg: 'from-white via-rose-50/20 to-pink-50/10',
    pillBg: 'bg-rose-50/90',
    pillText: 'text-rose-800',
    pillBorder: 'border-rose-200/70',
    watermarkColor: 'text-rose-900',
    hoverBorder: 'hover:border-rose-400/50'
  },
  'home-repair-maintenance': {
    imageUrl: 'https://images.unsplash.com/photo-1581244277943-fe4a9c77d389?auto=format&fit=crop&w=600&q=80',
    watermarkSvgPath: 'M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z',
    tradeRole: 'Skilled Carpenter & Repair Technician',
    badgeLabel: 'Certified Artisan',
    accentColor: 'amber',
    bgLight: 'from-amber-500/10 to-orange-500/5',
    lightCardBg: 'from-white via-amber-50/20 to-orange-50/10',
    pillBg: 'bg-amber-50/90',
    pillText: 'text-amber-800',
    pillBorder: 'border-amber-200/70',
    watermarkColor: 'text-amber-900',
    hoverBorder: 'hover:border-amber-400/50'
  },
  'electrical-services': {
    imageUrl: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=600&q=80',
    watermarkSvgPath: 'M13 2L3 14h9l-1 8 10-12h-9l1-8z',
    tradeRole: 'Licensed Wireman & Electrician',
    badgeLabel: 'Govt Licensed',
    accentColor: 'amber',
    bgLight: 'from-amber-500/10 to-yellow-500/5',
    lightCardBg: 'from-white via-yellow-50/25 to-amber-50/10',
    pillBg: 'bg-amber-50/90',
    pillText: 'text-amber-800',
    pillBorder: 'border-amber-200/70',
    watermarkColor: 'text-amber-900',
    hoverBorder: 'hover:border-amber-400/50'
  },
  'plumbing-water': {
    imageUrl: 'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?auto=format&fit=crop&w=600&q=80',
    watermarkSvgPath: 'M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z',
    tradeRole: 'Sanitary & Pipe Plumbing Expert',
    badgeLabel: 'Leak Specialist',
    accentColor: 'cyan',
    bgLight: 'from-cyan-500/10 to-blue-500/5',
    lightCardBg: 'from-white via-cyan-50/25 to-blue-50/10',
    pillBg: 'bg-cyan-50/90',
    pillText: 'text-cyan-800',
    pillBorder: 'border-cyan-200/70',
    watermarkColor: 'text-cyan-900',
    hoverBorder: 'hover:border-cyan-400/50'
  },
  'cleaning-household': {
    imageUrl: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=600&q=80',
    watermarkSvgPath: 'M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z',
    tradeRole: 'Deep Cleaning & Sanitization Pro',
    badgeLabel: 'Hygiene Verified',
    accentColor: 'emerald',
    bgLight: 'from-emerald-500/10 to-teal-500/5',
    lightCardBg: 'from-white via-emerald-50/25 to-teal-50/10',
    pillBg: 'bg-emerald-50/90',
    pillText: 'text-emerald-800',
    pillBorder: 'border-emerald-200/70',
    watermarkColor: 'text-emerald-900',
    hoverBorder: 'hover:border-emerald-400/50'
  },
  'painting-decoration': {
    imageUrl: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=600&q=80',
    watermarkSvgPath: 'm14.6 19.4 1.8-1.8a2 2 0 0 0 0-2.8l-8.5-8.5a2.1 2.1 0 0 0-2.8 0L3.3 8.1a2 2 0 0 0 0 2.8l8.5 8.5a2 2 0 0 0 2.8 0z M18 14l3.3-3.3a2 2 0 0 0 0-2.8l-2.2-2.2a2 2 0 0 0-2.8 0L13 9 M2 22h4',
    tradeRole: 'Wall Painting & Texture Artisan',
    badgeLabel: 'Master Finisher',
    accentColor: 'purple',
    bgLight: 'from-purple-500/10 to-pink-500/5',
    lightCardBg: 'from-white via-purple-50/25 to-pink-50/10',
    pillBg: 'bg-purple-50/90',
    pillText: 'text-purple-800',
    pillBorder: 'border-purple-200/70',
    watermarkColor: 'text-purple-900',
    hoverBorder: 'hover:border-purple-400/50'
  },
  'appliance-services': {
    imageUrl: 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=600&q=80',
    watermarkSvgPath: 'M2 8a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8z M17 14h.01 M17 10h.01 M7 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z',
    tradeRole: 'HVAC & Home Appliance Technician',
    badgeLabel: 'OEM Trained',
    accentColor: 'blue',
    bgLight: 'from-blue-500/10 to-sky-500/5',
    lightCardBg: 'from-white via-blue-50/25 to-sky-50/10',
    pillBg: 'bg-blue-50/90',
    pillText: 'text-blue-800',
    pillBorder: 'border-blue-200/70',
    watermarkColor: 'text-blue-900',
    hoverBorder: 'hover:border-blue-400/50'
  },
  'electronics-technology': {
    imageUrl: 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?auto=format&fit=crop&w=600&q=80',
    watermarkSvgPath: 'M20 16V7a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v9m16 0H4m16 0 1.28 2.55a1 1 0 0 1-.9 1.45H3.62a1 1 0 0 1-.9-1.45L4 16',
    tradeRole: 'IT Hardware & Network Specialist',
    badgeLabel: 'Hardware Expert',
    accentColor: 'indigo',
    bgLight: 'from-indigo-500/10 to-violet-500/5',
    lightCardBg: 'from-white via-indigo-50/25 to-violet-50/10',
    pillBg: 'bg-indigo-50/90',
    pillText: 'text-indigo-800',
    pillBorder: 'border-indigo-200/70',
    watermarkColor: 'text-indigo-900',
    hoverBorder: 'hover:border-indigo-400/50'
  },
  'agriculture-farm-work': {
    imageUrl: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=600&q=80',
    watermarkSvgPath: 'M7 20h10 M10 20c0-4.4 3.6-8 8-8V4c-6.6 0-12 5.4-12 12v4z M4 11a8 8 0 0 1 8-8v4a4 4 0 0 0-4 4H4z',
    tradeRole: 'Agronomist & Field Work Assistant',
    badgeLabel: 'Experienced Farmer',
    accentColor: 'emerald',
    bgLight: 'from-emerald-500/10 to-green-500/5',
    lightCardBg: 'from-white via-emerald-50/25 to-lime-50/10',
    pillBg: 'bg-emerald-50/90',
    pillText: 'text-emerald-800',
    pillBorder: 'border-emerald-200/70',
    watermarkColor: 'text-emerald-900',
    hoverBorder: 'hover:border-emerald-400/50'
  },
  'gardening-landscaping': {
    imageUrl: 'https://images.unsplash.com/photo-1592417817098-8f3d6910985b?auto=format&fit=crop&w=600&q=80',
    watermarkSvgPath: 'M12 22v-9 M9 9a3 3 0 0 1 6 0 3 3 0 0 1-6 0z M12 6a3 3 0 0 0-3-3 3 3 0 0 0-3 3c0 2 3 4 3 4s3-2 3-4z M18 6a3 3 0 0 0-3-3 3 3 0 0 0-3 3c0 2 3 4 3 4s3-2 3-4z',
    tradeRole: 'Horticulture & Landscape Caretaker',
    badgeLabel: 'Green Pro',
    accentColor: 'teal',
    bgLight: 'from-teal-500/10 to-emerald-500/5',
    lightCardBg: 'from-white via-teal-50/25 to-emerald-50/10',
    pillBg: 'bg-teal-50/90',
    pillText: 'text-teal-800',
    pillBorder: 'border-teal-200/70',
    watermarkColor: 'text-teal-900',
    hoverBorder: 'hover:border-teal-400/50'
  },
  'livestock-dairy': {
    imageUrl: 'https://images.unsplash.com/photo-1527153857715-3908f2bae5e8?auto=format&fit=crop&w=600&q=80',
    watermarkSvgPath: 'M4 16v-2.38C4 11.5 5.5 10 7.38 10h9.24c1.88 0 3.38 1.5 3.38 3.62V16 M4 20h16 M8 4h8 M12 4v6',
    tradeRole: 'Livestock & Animal Husbandry Assistant',
    badgeLabel: 'Dairy Skilled',
    accentColor: 'amber',
    bgLight: 'from-amber-500/10 to-yellow-500/5',
    lightCardBg: 'from-white via-amber-50/25 to-yellow-50/10',
    pillBg: 'bg-amber-50/90',
    pillText: 'text-amber-800',
    pillBorder: 'border-amber-200/70',
    watermarkColor: 'text-amber-900',
    hoverBorder: 'hover:border-amber-400/50'
  },
  'construction-skilled-labour': {
    imageUrl: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=600&q=80',
    watermarkSvgPath: 'm15 12-8.5 8.5c-.83.83-2.17.83-3 0 0 0 0 0 0 0a2.12 2.12 0 0 1 0-3L12 9 M17.64 15 22 10.64 M20.91 3.26a1.5 1.5 0 0 0-2.12 0l-5.66 5.66 2.12 2.12 5.66-5.66a1.5 1.5 0 0 0 0-2.12z',
    tradeRole: 'Certified Mason & Construction Specialist',
    badgeLabel: 'Heavy Skilled',
    accentColor: 'stone',
    bgLight: 'from-amber-600/10 to-orange-600/5',
    lightCardBg: 'from-white via-stone-50/30 to-amber-50/10',
    pillBg: 'bg-stone-100/90',
    pillText: 'text-stone-800',
    pillBorder: 'border-stone-200/70',
    watermarkColor: 'text-stone-900',
    hoverBorder: 'hover:border-stone-400/50'
  },
  'vehicle-services': {
    imageUrl: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=600&q=80',
    watermarkSvgPath: 'M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9C2.1 11.2 2 11.6 2 12v4c0 .6.4 1 1 1h2 M7 17a2 2 0 1 0 0-4 2 2 0 0 0 0 4z M17 17a2 2 0 1 0 0-4 2 2 0 0 0 0 4z',
    tradeRole: 'Automobile & Two-Wheeler Mechanic',
    badgeLabel: 'Roadside Pro',
    accentColor: 'rose',
    bgLight: 'from-rose-500/10 to-red-500/5',
    lightCardBg: 'from-white via-rose-50/25 to-red-50/10',
    pillBg: 'bg-rose-50/90',
    pillText: 'text-rose-800',
    pillBorder: 'border-rose-200/70',
    watermarkColor: 'text-rose-900',
    hoverBorder: 'hover:border-rose-400/50'
  },
  'driving-local-assistance': {
    imageUrl: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&w=600&q=80',
    watermarkSvgPath: 'M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8zm0-14a6 6 0 1 0 6 6 6 6 0 0 0-6-6zm0 10a4 4 0 1 1 4-4 4 4 0 0 1-4 4z',
    tradeRole: 'Verified Commercial Driver & Chauffeur',
    badgeLabel: 'DL Verified',
    accentColor: 'sky',
    bgLight: 'from-sky-500/10 to-blue-500/5',
    lightCardBg: 'from-white via-sky-50/25 to-blue-50/10',
    pillBg: 'bg-sky-50/90',
    pillText: 'text-sky-800',
    pillBorder: 'border-sky-200/70',
    watermarkColor: 'text-sky-900',
    hoverBorder: 'hover:border-sky-400/50'
  },
  'moving-manpower': {
    imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80',
    watermarkSvgPath: 'm16.5 9.4-9-5.19M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16zM3.27 6.96 12 12.01l8.73-5.05M12 22.08V12',
    tradeRole: 'Heavy Shifting & Logistics Helper',
    badgeLabel: 'Careful Mover',
    accentColor: 'indigo',
    bgLight: 'from-indigo-500/10 to-blue-500/5',
    lightCardBg: 'from-white via-indigo-50/25 to-slate-50/10',
    pillBg: 'bg-indigo-50/90',
    pillText: 'text-indigo-800',
    pillBorder: 'border-indigo-200/70',
    watermarkColor: 'text-indigo-900',
    hoverBorder: 'hover:border-indigo-400/50'
  },
  'home-tutors-education': {
    imageUrl: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=600&q=80',
    watermarkSvgPath: 'M22 10v6M2 10l10-5 10 5-10 5z M6 12v5c3 3 9 3 12 0v-5',
    tradeRole: 'Qualified Home Educator & Tutor',
    badgeLabel: 'Degree Verified',
    accentColor: 'violet',
    bgLight: 'from-violet-500/10 to-purple-500/5',
    lightCardBg: 'from-white via-violet-50/25 to-purple-50/10',
    pillBg: 'bg-violet-50/90',
    pillText: 'text-violet-800',
    pillBorder: 'border-violet-200/70',
    watermarkColor: 'text-violet-900',
    hoverBorder: 'hover:border-violet-400/50'
  },
  'graphics-digital-freelance': {
    imageUrl: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&w=600&q=80',
    watermarkSvgPath: 'M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.9 0 1.6-.7 1.6-1.6 0-.4-.2-.8-.5-1.1-.3-.3-.4-.7-.4-1.1 0-.9.7-1.6 1.6-1.6H16c3.3 0 6-2.7 6-6 0-4.4-4.5-8-10-8zm-5.5 9c-.8 0-1.5-.7-1.5-1.5S5.7 8 6.5 8s1.5.7 1.5 1.5S7.3 11 6.5 11zm3-4C8.7 7 8 6.3 8 5.5S8.7 4 9.5 4s1.5.7 1.5 1.5S10.3 7 9.5 7zm5 0c-.8 0-1.5-.7-1.5-1.5S13.7 4 14.5 4s1.5.7 1.5 1.5S15.3 7 14.5 7zm3 4c-.8 0-1.5-.7-1.5-1.5S16.7 8 17.5 8s1.5.7 1.5 1.5-.7 1.5-1.5 1.5z',
    tradeRole: 'Digital Designer & Creative Operator',
    badgeLabel: 'Creative Pro',
    accentColor: 'pink',
    bgLight: 'from-pink-500/10 to-rose-500/5',
    lightCardBg: 'from-white via-pink-50/25 to-rose-50/10',
    pillBg: 'bg-pink-50/90',
    pillText: 'text-pink-800',
    pillBorder: 'border-pink-200/70',
    watermarkColor: 'text-pink-900',
    hoverBorder: 'hover:border-pink-400/50'
  },
  'business-shop-assistance': {
    imageUrl: 'https://images.unsplash.com/photo-1556742049-0a67e55722c6?auto=format&fit=crop&w=600&q=80',
    watermarkSvgPath: 'm2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7 M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8 M10 12h4',
    tradeRole: 'Retail & Commercial Operations Assistant',
    badgeLabel: 'Point of Sale Pro',
    accentColor: 'blue',
    bgLight: 'from-blue-500/10 to-indigo-500/5',
    lightCardBg: 'from-white via-blue-50/25 to-indigo-50/10',
    pillBg: 'bg-blue-50/90',
    pillText: 'text-blue-800',
    pillBorder: 'border-blue-200/70',
    watermarkColor: 'text-blue-900',
    hoverBorder: 'hover:border-blue-400/50'
  },
  'event-services': {
    imageUrl: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=600&q=80',
    watermarkSvgPath: 'M5.8 11.3 2 22l10.7-3.79 M4 3h.01 M22 8h.01 M15 2h.01 M22 20h.01 M20 13h.01 M9 7h.01',
    tradeRole: 'Event Management & Hospitality Crew',
    badgeLabel: 'Event Specialist',
    accentColor: 'amber',
    bgLight: 'from-amber-500/10 to-pink-500/5',
    lightCardBg: 'from-white via-amber-50/25 to-pink-50/10',
    pillBg: 'bg-amber-50/90',
    pillText: 'text-amber-800',
    pillBorder: 'border-amber-200/70',
    watermarkColor: 'text-amber-900',
    hoverBorder: 'hover:border-amber-400/50'
  },
  'personal-family-assistance': {
    imageUrl: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=600&q=80',
    watermarkSvgPath: 'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2 M9 7a4 4 0 1 0 0-8 4 4 0 0 0 0 8z M23 21v-2a4 4 0 0 0-3-3.87 M16 3.13a4 4 0 0 1 0 7.75',
    tradeRole: 'Domestic Assistant & Cooking Specialist',
    badgeLabel: 'Trusted Helper',
    accentColor: 'rose',
    bgLight: 'from-rose-500/10 to-orange-500/5',
    lightCardBg: 'from-white via-rose-50/25 to-orange-50/10',
    pillBg: 'bg-rose-50/90',
    pillText: 'text-rose-800',
    pillBorder: 'border-rose-200/70',
    watermarkColor: 'text-rose-900',
    hoverBorder: 'hover:border-rose-400/50'
  },
  'beauty-personal-services': {
    imageUrl: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=600&q=80',
    watermarkSvgPath: 'M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z',
    tradeRole: 'Professional Beautician & Stylist',
    badgeLabel: 'Certified Salon Pro',
    accentColor: 'pink',
    bgLight: 'from-pink-500/10 to-purple-500/5',
    lightCardBg: 'from-white via-pink-50/25 to-purple-50/10',
    pillBg: 'bg-pink-50/90',
    pillText: 'text-pink-800',
    pillBorder: 'border-pink-200/70',
    watermarkColor: 'text-pink-900',
    hoverBorder: 'hover:border-pink-400/50'
  },
  'tailoring-clothing': {
    imageUrl: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=600&q=80',
    watermarkSvgPath: 'M6 9a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm0 12a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm14.8-15.8L8.12 11.9 M8.12 12.1l12.68 6.7',
    tradeRole: 'Master Tailor & Stitching Artisan',
    badgeLabel: 'Fit & Pattern Master',
    accentColor: 'indigo',
    bgLight: 'from-indigo-500/10 to-violet-500/5',
    lightCardBg: 'from-white via-indigo-50/25 to-violet-50/10',
    pillBg: 'bg-indigo-50/90',
    pillText: 'text-indigo-800',
    pillBorder: 'border-indigo-200/70',
    watermarkColor: 'text-indigo-900',
    hoverBorder: 'hover:border-indigo-400/50'
  },
  'handicraft-home-based-skills': {
    imageUrl: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=600&q=80',
    watermarkSvgPath: 'M20 12v10H4V12 M2 7h20v5H2z M12 22V7 M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z',
    tradeRole: 'Traditional Odia Artisan & Craftsman',
    badgeLabel: 'Heritage Craft',
    accentColor: 'amber',
    bgLight: 'from-amber-500/10 to-yellow-500/5',
    lightCardBg: 'from-white via-amber-50/25 to-yellow-50/10',
    pillBg: 'bg-amber-50/90',
    pillText: 'text-amber-800',
    pillBorder: 'border-amber-200/70',
    watermarkColor: 'text-amber-900',
    hoverBorder: 'hover:border-amber-400/50'
  },
  'laundry-garment-care': {
    imageUrl: 'https://images.unsplash.com/photo-1545173168-9f1947eebb7f?auto=format&fit=crop&w=600&q=80',
    watermarkSvgPath: 'M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z',
    tradeRole: 'Garment Steam Ironing & Care Master',
    badgeLabel: 'Fabric Safe',
    accentColor: 'sky',
    bgLight: 'from-sky-500/10 to-indigo-500/5',
    lightCardBg: 'from-white via-sky-50/25 to-indigo-50/10',
    pillBg: 'bg-sky-50/90',
    pillText: 'text-sky-800',
    pillBorder: 'border-sky-200/70',
    watermarkColor: 'text-sky-900',
    hoverBorder: 'hover:border-sky-400/50'
  },
  'waste-recycling': {
    imageUrl: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=600&q=80',
    watermarkSvgPath: 'M7 19H4.815a1.83 1.83 0 0 1-1.57-.881 1.785 1.785 0 0 1-.004-1.784L7.196 9.5 M11 19h8.203a1.83 1.83 0 0 0 1.556-.89 1.784 1.784 0 0 0 0-1.775l-1.226-2.12 M14 16.5 16.5 12 19 16.5 M17 3h2.185a1.83 1.83 0 0 1 1.57.881 1.785 1.785 0 0 1 .004 1.784L16.804 14.5',
    tradeRole: 'Eco-Waste & Recycling Specialist',
    badgeLabel: 'Green Certified',
    accentColor: 'emerald',
    bgLight: 'from-emerald-500/10 to-teal-500/5',
    lightCardBg: 'from-white via-emerald-50/25 to-teal-50/10',
    pillBg: 'bg-emerald-50/90',
    pillText: 'text-emerald-800',
    pillBorder: 'border-emerald-200/70',
    watermarkColor: 'text-emerald-900',
    hoverBorder: 'hover:border-emerald-400/50'
  },
  'rural-village-services': {
    imageUrl: 'https://images.unsplash.com/photo-1509099836639-18ba1795216d?auto=format&fit=crop&w=600&q=80',
    watermarkSvgPath: 'M10 10v.2A3 3 0 0 1 8.9 16v0H5v0h0a3 3 0 0 1-1.1-5.8V10a3 3 0 0 1 6 0z M7 16v6 M18 14v.2A3 3 0 0 1 16.9 20v0H13v0h0a3 3 0 0 1-1.1-5.8V14a3 3 0 0 1 6 0z M15 20v2',
    tradeRole: 'Rural Community & Logistics Assistant',
    badgeLabel: 'Gramin Helper',
    accentColor: 'amber',
    bgLight: 'from-amber-500/10 to-lime-500/5',
    lightCardBg: 'from-white via-amber-50/25 to-lime-50/10',
    pillBg: 'bg-amber-50/90',
    pillText: 'text-amber-800',
    pillBorder: 'border-amber-200/70',
    watermarkColor: 'text-amber-900',
    hoverBorder: 'hover:border-amber-400/50'
  },
  'fishing-aquaculture': {
    imageUrl: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=600&q=80',
    watermarkSvgPath: 'M6.5 12c.94-3.46 4.94-6 8.5-6 3.56 0 6.06 2.54 7 6-.94 3.47-3.44 6-7 6s-7.56-2.53-8.5-6z M18 10a1 1 0 1 0 0 2 1 1 0 0 0 0-2z',
    tradeRole: 'Aquaculture & Fisheries Technician',
    badgeLabel: 'Pond Certified',
    accentColor: 'blue',
    bgLight: 'from-blue-500/10 to-cyan-500/5',
    lightCardBg: 'from-white via-blue-50/25 to-cyan-50/10',
    pillBg: 'bg-blue-50/90',
    pillText: 'text-blue-800',
    pillBorder: 'border-blue-200/70',
    watermarkColor: 'text-blue-900',
    hoverBorder: 'hover:border-blue-400/50'
  },
  'security-property-assistance': {
    imageUrl: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=600&q=80',
    watermarkSvgPath: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z',
    tradeRole: 'Trained Security Guard & Watchman',
    badgeLabel: 'Background Checked',
    accentColor: 'slate',
    bgLight: 'from-slate-500/10 to-slate-700/5',
    lightCardBg: 'from-white via-slate-50/40 to-slate-100/20',
    pillBg: 'bg-slate-100/90',
    pillText: 'text-slate-800',
    pillBorder: 'border-slate-200/70',
    watermarkColor: 'text-slate-900',
    hoverBorder: 'hover:border-slate-400/50'
  },
  'religious-community-assistance': {
    imageUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80',
    watermarkSvgPath: 'M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z',
    tradeRole: 'Puja & Community Event Helper',
    badgeLabel: 'Sewa Verified',
    accentColor: 'amber',
    bgLight: 'from-amber-500/10 to-orange-500/5',
    lightCardBg: 'from-white via-amber-50/25 to-orange-50/10',
    pillBg: 'bg-amber-50/90',
    pillText: 'text-amber-800',
    pillBorder: 'border-amber-200/70',
    watermarkColor: 'text-amber-900',
    hoverBorder: 'hover:border-amber-400/50'
  },
  'emergency-general-assistance': {
    imageUrl: 'https://images.unsplash.com/photo-1584467735815-f778f274e296?auto=format&fit=crop&w=600&q=80',
    watermarkSvgPath: 'M12 2v20 M2 12h20 M4.93 4.93l14.14 14.14 M4.93 19.07l14.14-14.14',
    tradeRole: 'Emergency Rapid Response Helper',
    badgeLabel: '24/7 Rapid Action',
    accentColor: 'rose',
    bgLight: 'from-rose-500/10 to-red-500/5',
    lightCardBg: 'from-white via-rose-50/25 to-red-50/10',
    pillBg: 'bg-rose-50/90',
    pillText: 'text-rose-800',
    pillBorder: 'border-rose-200/70',
    watermarkColor: 'text-rose-900',
    hoverBorder: 'hover:border-rose-400/50'
  },
  'general-hourly-work': {
    imageUrl: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=600&q=80',
    watermarkSvgPath: 'M12 2v20 M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6',
    tradeRole: 'Multi-Task Hourly Helper & Handyman',
    badgeLabel: 'Versatile Pro',
    accentColor: 'indigo',
    bgLight: 'from-indigo-500/10 to-slate-500/5',
    lightCardBg: 'from-white via-indigo-50/20 to-slate-50/10',
    pillBg: 'bg-indigo-50/90',
    pillText: 'text-indigo-800',
    pillBorder: 'border-indigo-200/70',
    watermarkColor: 'text-indigo-900',
    hoverBorder: 'hover:border-indigo-400/50'
  }
};

// Trade specific images for exact skills
export const SPECIFIC_SKILL_IMAGES: Record<string, string> = {
  'carpenter': 'https://images.unsplash.com/photo-1581244277943-fe4a9c77d389?auto=format&fit=crop&w=600&q=80',
  'furniture-repair-worker': 'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?auto=format&fit=crop&w=600&q=80',
  'electrician': 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=600&q=80',
  'fan-light-fitting': 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=600&q=80',
  'inverter-technician': 'https://images.unsplash.com/photo-1558441719-aa34bbe5f340?auto=format&fit=crop&w=600&q=80',
  'plumber': 'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?auto=format&fit=crop&w=600&q=80',
  'water-tank-cleaner': 'https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?auto=format&fit=crop&w=600&q=80',
  'home-cleaner': 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=600&q=80',
  'deep-cleaner': 'https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?auto=format&fit=crop&w=600&q=80',
  'painter': 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=600&q=80',
  'ac-technician': 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=600&q=80',
  'refrigerator-technician': 'https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?auto=format&fit=crop&w=600&q=80',
  'washing-machine-tech': 'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?auto=format&fit=crop&w=600&q=80',
  'laptop-repair': 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?auto=format&fit=crop&w=600&q=80',
  'cctv-technician': 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=600&q=80',
  'gardener': 'https://images.unsplash.com/photo-1592417817098-8f3d6910985b?auto=format&fit=crop&w=600&q=80',
  'mason': 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=600&q=80',
  'bike-mechanic': 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=600&q=80',
  'car-mechanic': 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=600&q=80',
  'driver': 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&w=600&q=80',
  'packer-mover': 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80',
  'tutor': 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=600&q=80',
  'beautician': 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=600&q=80',
  'tailor': 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=600&q=80',
  'security-guard': 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=600&q=80'
};

export function getTechnicianVisual(categorySlug: string, serviceSlug?: string) {
  const cat = CATEGORY_TECHNICIAN_VISUALS[categorySlug] || CATEGORY_TECHNICIAN_VISUALS['home-repair-maintenance'];
  
  // Specific match if available
  let matchedImage = cat.imageUrl;
  if (serviceSlug) {
    for (const key in SPECIFIC_SKILL_IMAGES) {
      if (serviceSlug.includes(key)) {
        matchedImage = SPECIFIC_SKILL_IMAGES[key];
        break;
      }
    }
  }

  return {
    ...cat,
    imageUrl: matchedImage
  };
}
