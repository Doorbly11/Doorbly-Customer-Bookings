// ==============================================================================
// DOORBLY AUTHORITATIVE SERVICE CATALOG MASTER
// 50 Categories & 978 Unique Hourly Services
// Rate Formula:
//   customer_price = ROUND(base_hourly_rate * 1.20, 2)
//   agent_payout = base_hourly_rate
//   doorbly_commission = ROUND(base_hourly_rate * 0.20, 2)
// ==============================================================================

import { MASTER_CATALOG_RAW, getExpandedMasterServices } from './masterCatalog50';

export interface ServiceDefinition {
  name: string;
  slug: string;
  category_name: string;
  category_slug: string;
  description: string;
  pricing_type: 'hourly';
  pricing_unit: 'hour';
  base_hourly_rate: number;
  partner_hourly_rate: number;
  customer_price: number;
  customer_hourly_price: number;
  agent_payout: number;
  partner_payout: number;
  doorbly_commission: number;
  commission_percentage: number;
  minimum_hours: number;
  maximum_hours: number;
  verification_required: boolean;
}

export interface CategoryDefinition {
  name: string;
  slug: string;
  description: string;
  icon: string;
  sort_order: number;
}

// Category icon & description metadata for all 50 categories
const CATEGORY_META: Record<string, { icon: string; description: string }> = {
  'home-repair-maintenance': {
    icon: 'Wrench',
    description: 'Carpentry, furniture repair/assembly, masonry, drilling, wall mounting, and general structural fixes.'
  },
  'electrical-services': {
    icon: 'Zap',
    description: 'Certified electricians, switches, wiring, fans, inverters, solar installation, and CCTV.'
  },
  'plumbing-water-services': {
    icon: 'Droplets',
    description: 'Tap repair, pipe fitting, water tank cleaning, pumps, drainage, and bathroom/kitchen plumbing.'
  },
  'cleaning-household-services': {
    icon: 'Sparkles',
    description: 'Deep home cleaning, bathroom/kitchen sanitization, sofa cleaning, dusting, and housekeeping.'
  },
  'painting-decoration': {
    icon: 'Paintbrush',
    description: 'Wall putty, interior/exterior painting, texture coats, wallpaper, and festival decoration.'
  },
  'ac-appliance-services': {
    icon: 'Tv',
    description: 'AC servicing, refrigerator, washing machine, microwave, geyser, and RO purifier repairs.'
  },
  'computer-mobile-technology': {
    icon: 'Monitor',
    description: 'Laptop/desktop repair, printer setup, Wi-Fi router, CCTV, data backup, and OS installation.'
  },
  'vehicle-services': {
    icon: 'Car',
    description: 'Two-wheeler and car mechanics, tractor repair, puncture fixes, car AC, and vehicle washing.'
  },
  'moving-loading-manpower': {
    icon: 'Package',
    description: 'Loading/unloading helpers, furniture shifting, packing, warehouse, and temporary manpower.'
  },
  'driving-local-assistance': {
    icon: 'Navigation',
    description: 'Personal drivers, delivery drivers, local errand assistants, and vehicle pickup/drop.'
  },
  'baby-child-care': {
    icon: 'Baby',
    description: 'Hourly babysitters, infant care, feeding, bathing, child homework, and study companions.'
  },
  'elderly-senior-citizen-care': {
    icon: 'HeartHandshake',
    description: 'Hourly senior companionship, walking, mobility, meal assistance, and personal care.'
  },
  'non-medical-home-assistance': {
    icon: 'Heart',
    description: 'Hospital attendant, bedside companion, medical report pickup, and patient recovery support.'
  },
  'agriculture-farm-services': {
    icon: 'Sprout',
    description: 'Field preparation, seed sowing, weeding, harvesting, crop maintenance, and tractor operators.'
  },
  'gardening-landscaping': {
    icon: 'Flower2',
    description: 'Lawn maintenance, tree trimming, hedge cutting, terrace gardens, and compost care.'
  },
  'livestock-dairy': {
    icon: 'Footprints',
    description: 'Dairy milking assistants, cow/goat/poultry care, animal shed cleaning, and feed prep.'
  },
  'fisheries-aquaculture': {
    icon: 'Fish',
    description: 'Fish farm technicians, pond feeding, net handling, fish sorting, and pond maintenance.'
  },
  'construction-skilled-labour': {
    icon: 'Hammer',
    description: 'Masons, steel & bar bending workers, shuttering, concrete pouring, and site helpers.'
  },
  'beauty-personal-care': {
    icon: 'Scissors',
    description: 'Doorstep beauticians, bridal makeup, mehndi artists, hair stylists, and personal grooming.'
  },
  'tailoring-clothing': {
    icon: 'Scissors',
    description: 'Custom tailors, stitching workers, clothing alterations, embroidery, and blouse/dress stitching.'
  },
  'laundry-garment-care': {
    icon: 'Shirt',
    description: 'Washing, ironing, drying/folding, garment sorting, and doorstep shoe/bag cleaning.'
  },
  'education-tutoring': {
    icon: 'GraduationCap',
    description: 'Primary/secondary tutors, Math, Science, English, Odia, Hindi, computer, and drawing teachers.'
  },
  'creative-freelance-design': {
    icon: 'Palette',
    description: 'Graphic designers, logo designers, video/photo editors, reels creators, and illustrators.'
  },
  'writing-language-freelancing': {
    icon: 'FileText',
    description: 'Content writers, copywriters, Odia/Hindi/English translators, proofreaders, and transcription.'
  },
  'digital-office-freelancing': {
    icon: 'Laptop',
    description: 'Data entry operators, typists, Excel operators, virtual assistants, and document formatters.'
  },
  'digital-marketing-social-media': {
    icon: 'Share2',
    description: 'Social media managers, Instagram/YouTube assistants, SEO, and Google Business setup.'
  },
  'shop-business-assistance': {
    icon: 'Store',
    description: 'Retail billing assistants, inventory & stock counting, cash counter, and store helpers.'
  },
  'delivery-logistics': {
    icon: 'Truck',
    description: 'Local delivery partners, grocery/food delivery, parcel delivery, warehouse pickers, and dispatch.'
  },
  'event-wedding-services': {
    icon: 'PartyPopper',
    description: 'Event helpers, stage & seating setup, decoration helpers, catering, and wedding staff.'
  },
  'photography-video': {
    icon: 'Camera',
    description: 'Event/wedding photographers, product photography, drone camera operators, and videographers.'
  },
  'property-real-estate-assistance': {
    icon: 'Home',
    description: 'Property inspection, rental assistance, site watch, tenant move-in/out, and property cleaning.'
  },
  'security-watch-services': {
    icon: 'Shield',
    description: 'Property watchmen, event security assistants, parking assistants, gate watchers, and night guards.'
  },
  'packing-organization': {
    icon: 'Box',
    description: 'Home/office packing, fragile item packing, gift packing, and wardrobe/storage organization.'
  },
  'religious-community-assistance': {
    icon: 'Flame',
    description: 'Puja preparation helpers, temple event staff, seating arrangement, and food distribution.'
  },
  'waste-recycling-cleaning-labour': {
    icon: 'Recycle',
    description: 'Dry waste collection, recycling sorting, scrap collection, garden waste, and post-event cleanup.'
  },
  'rural-village-services': {
    icon: 'Trees',
    description: 'Village general helpers, pond cleaning, rural fencing, tractor assistance, and rural logistics.'
  },
  'general-handyman-on-demand-help': {
    icon: 'Wrench',
    description: 'On-demand general helpers, household helpers, loading, packing, and temporary helpers.'
  },
  'emergency-assistance': {
    icon: 'AlertCircle',
    description: 'Emergency storm/flood cleanup, emergency moving/loading, fallen tree cleanup, and rapid help.'
  },
  'family-assistance': {
    icon: 'Users',
    description: 'Family care assistants, shopping assistants, cooking helpers, and household support.'
  },
  'cooking-food-assistance': {
    icon: 'Utensils',
    description: 'Home cooks, cooking assistants, meal preparation, vegetable cutting, and kitchen helpers.'
  },
  'handicraft-home-based-earning': {
    icon: 'Gift',
    description: 'Handicraft artisans, bamboo/cane craft, pottery, candle making, and handmade gift makers.'
  },
  'e-commerce-home-based-work': {
    icon: 'ShoppingBag',
    description: 'Product packing, labelling, listing assistants, customer chat support, and order processing.'
  },
  'professional-business-freelancing': {
    icon: 'Briefcase',
    description: 'Accountants, bookkeeping, GST/tax documentation, business plans, and career consulting.'
  },
  'school-institutional-support': {
    icon: 'Building2',
    description: 'School helpers, classroom assistants, lab assistants, exam support, and grounds maintenance.'
  },
  'office-corporate-support': {
    icon: 'Building',
    description: 'Office assistants, reception support, document filing, pantry helpers, and meeting setup.'
  },
  'hospitality-guest-assistance': {
    icon: 'Coffee',
    description: 'Hotel helpers, housekeeping assistants, room cleaning, banquet helpers, and guest service.'
  },
  'pet-animal-assistance': {
    icon: 'Cat',
    description: 'Pet walking, pet feeding, pet grooming assistants, pet sitting, and animal care helpers.'
  },
  'outdoor-property-maintenance': {
    icon: 'Sun',
    description: 'Lawn care, compound cleaning, outdoor drain cleaning, and property exterior cleanup.'
  },
  'skilled-technical-freelancers': {
    icon: 'Cpu',
    description: 'Welders, fabricators, solar technicians, machine operators, and specialized repair pros.'
  },
  'earn-with-your-time': {
    icon: 'Clock',
    description: 'On-demand personal assistants, queue standing, document errands, and flexible time-based tasks.'
  }
};

// 50 Authoritative Categories
export const CATEGORIES_MASTER: CategoryDefinition[] = MASTER_CATALOG_RAW.map(cat => {
  const meta = CATEGORY_META[cat.slug] || {
    icon: 'Wrench',
    description: `Professional hourly ${cat.name} doorstep services in Odisha.`
  };
  return {
    name: cat.name,
    slug: cat.slug,
    description: meta.description,
    icon: meta.icon,
    sort_order: cat.order
  };
});

// 978 Authoritative Services with Hourly Pricing
export const SERVICES_MASTER: ServiceDefinition[] = getExpandedMasterServices().map(item => ({
  name: item.serviceName,
  slug: item.slug,
  category_name: item.categoryName,
  category_slug: item.categorySlug,
  description: `Professional hourly ${item.serviceName} service in Odisha. Verified provider, transparent pricing.`,
  pricing_type: 'hourly',
  pricing_unit: 'hour',
  base_hourly_rate: item.baseHourlyRate,
  partner_hourly_rate: item.agentPayout,
  customer_price: item.customerPrice,
  customer_hourly_price: item.customerPrice,
  agent_payout: item.agentPayout,
  partner_payout: item.agentPayout,
  doorbly_commission: item.doorblyCommission,
  commission_percentage: 20,
  minimum_hours: 1,
  maximum_hours: 8,
  verification_required: item.verificationRequired
}));
