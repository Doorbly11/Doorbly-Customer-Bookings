// ==============================================================================
// DOORBLY MASTER SERVICE CATALOG (50 Categories, 978 Unique Services)
// Rate calculation logic:
// Customer Price = ROUND(base_hourly_rate * 1.20, 2)
// Agent Payout   = base_hourly_rate
// Doorbly Comm   = ROUND(base_hourly_rate * 0.20, 2)
// ==============================================================================

export interface MasterCatalogCategory {
  name: string;
  slug: string;
  order: number;
  servicesText: string;
  icon?: string;
}

export interface MasterCatalogItem {
  categoryName: string;
  categorySlug: string;
  categoryOrder: number;
  serviceName: string;
  slug: string;
  baseHourlyRate: number;
  customerPrice: number;
  agentPayout: number;
  doorblyCommission: number;
  verificationRequired: boolean;
  pricingType: 'hourly';
  pricingUnit: 'hour';
}

export const MASTER_CATALOG_RAW: MasterCatalogCategory[] = [
  { name: 'Home Repair & Maintenance', slug: 'home-repair-maintenance', order: 1, servicesText: 'Carpenter|Furniture Repair|Furniture Assembly|Door Repair|Door Installation|Window Repair|Window Installation|Lock Repair|Lock Installation|Curtain Installation|Curtain Rod Installation|Shelf Installation|Wall-Mount Installation|TV Wall Mounting|Drilling & Wall Mounting|Picture/Frame Installation|Mirror Installation|Furniture Shifting|Furniture Polishing|Wood Polishing|Wood Repair|Modular Furniture Repair|Kitchen Cabinet Repair|Wardrobe Repair|Bed Repair|Table Repair|Chair Repair|Sofa Frame Repair|False Ceiling Work|POP Work|Gypsum Work|Tile Work|Marble Work|Granite Work|Masonry|Plastering|Grouting|Waterproofing|Flooring|Wall Crack Repair|General Home Maintenance|Handyman Services' },
  { name: 'Electrical Services', slug: 'electrical-services', order: 2, servicesText: 'Electrician|Electrical Helper|Switch Replacement|Socket Replacement|Switchboard Repair|Fan Installation|Fan Repair|Ceiling Fan Installation|Exhaust Fan Installation|Light Installation|LED Installation|Tube Light Installation|Chandelier Installation|Wiring|Rewiring|Electrical Fault Diagnosis|MCB Installation|MCB Repair|DB Installation|DB Repair|Fuse Repair|Inverter Installation|Inverter Repair|Battery Installation|Battery Maintenance|Generator Assistance|CCTV Installation|CCTV Maintenance|Doorbell Installation|Solar Panel Installation|Solar Panel Cleaning|Solar Maintenance|Earthing Work|Electrical Inspection|Home Electrical Maintenance' },
  { name: 'Plumbing & Water Services', slug: 'plumbing-water-services', order: 3, servicesText: 'Plumber|Plumbing Helper|Tap Repair|Tap Installation|Pipe Fitting|Pipe Repair|Leakage Repair|Bathroom Plumbing|Kitchen Plumbing|Drain Cleaning|Drainage Repair|Toilet Repair|Toilet Installation|Shower Installation|Basin Installation|Sink Installation|Water Tank Cleaning|Water Tank Maintenance|Water Pump Installation|Water Pump Repair|Motor Repair|Borewell Assistance|Irrigation Pipe Installation|Water Filter Installation|Water Line Installation|Underground Pipe Repair|Rainwater Drainage Work' },
  { name: 'Cleaning & Household Services', slug: 'cleaning-household-services', order: 4, servicesText: 'Home Cleaner|Housekeeping Worker|Bathroom Cleaner|Kitchen Cleaner|Floor Cleaner|Window Cleaner|Balcony Cleaner|Terrace Cleaner|Deep Cleaning|Dusting Service|Sofa Cleaning|Mattress Cleaning|Carpet Cleaning|Curtain Cleaning|Fan Cleaning|Kitchen Chimney Cleaning|Utensil Cleaning|Laundry Worker|Clothes Washing|Clothes Folding|Ironing|Shoe Cleaning|Bag Cleaning|Home Organization|Wardrobe Organization|Kitchen Organization|Packing Assistance|Unpacking Assistance|Household Helper|Senior Household Helper' },
  { name: 'Painting & Decoration', slug: 'painting-decoration', order: 5, servicesText: 'Painter|Painter Helper|Wall Painting|Interior Painting|Exterior Painting|Wall Putty|Texture Painting|Spray Painting|Decorative Painting|Wood Painting|Metal Painting|Door Painting|Furniture Painting|Wallpaper Installation|Wallpaper Removal|Wall Sticker Installation|Decorative Wall Work|Festival Decoration|Home Decoration|Temporary Decoration Setup' },
  { name: 'AC & Appliance Services', slug: 'ac-appliance-services', order: 6, servicesText: 'AC Technician|AC Helper|AC Installation|AC Uninstallation|AC Servicing|AC Cleaning|AC Repair|Refrigerator Technician|Refrigerator Repair|Washing Machine Technician|Washing Machine Repair|Geyser Technician|Geyser Installation|Geyser Repair|Water Purifier Technician|RO Technician|RO Installation|RO Servicing|Microwave Repair|Oven Repair|Air Cooler Repair|Mixer Grinder Repair|Small Appliance Repair|Appliance Installation|Appliance Maintenance' },
  { name: 'Computer, Mobile & Technology', slug: 'computer-mobile-technology', order: 7, servicesText: 'Computer Technician|Laptop Technician|Desktop Technician|Printer Technician|Printer Installation|Printer Repair|Wi-Fi Setup|Router Installation|Network Setup|CCTV Technician|CCTV Helper|Mobile Phone Technician|Smartphone Setup|Smart TV Setup|TV Installation|Software Installation|Operating System Installation|Computer Formatting|Data Backup|Data Transfer|Basic Computer Training|Digital Literacy Training|Online Form Assistance|Email Setup|Digital Document Assistance|Cyber Café Assistance|Device Setup|Home Office Setup' },
  { name: 'Vehicle Services', slug: 'vehicle-services', order: 8, servicesText: 'Bike Mechanic|Car Mechanic|Auto Mechanic|Tractor Mechanic|Bicycle Repair|Bike Servicing|Car Servicing|Vehicle Inspection|Battery Replacement|Battery Charging Assistance|Tyre Repair|Puncture Repair|Tyre Replacement Assistance|Vehicle Washing|Vehicle Cleaning|Car Detailing|Bike Cleaning|Car Interior Cleaning|Car AC Technician|Vehicle Electrical Repair|Vehicle Breakdown Assistance|Garage Helper|Tractor Assistance|Agricultural Vehicle Maintenance' },
  { name: 'Moving, Loading & Manpower', slug: 'moving-loading-manpower', order: 9, servicesText: 'General Labourer|Loading Worker|Unloading Worker|Moving Helper|Furniture Moving|Packing Worker|Unpacking Worker|Warehouse Helper|Shop Helper|Construction Helper|Material Handling Worker|Market Loading Worker|Delivery Loading Assistant|Event Helper|Temporary Labour|Daily Wage Helper|House Shifting Helper|Office Shifting Helper|Storage Helper' },
  { name: 'Driving & Local Assistance', slug: 'driving-local-assistance', order: 10, servicesText: 'Personal Driver|Car Driver|Delivery Driver|Pickup Driver|Van Driver|Tractor Driver|Commercial Driver|School Transport Driver|Local Errand Assistant|Shopping Assistant|Document Delivery Assistant|Parcel Delivery Assistant|Local Pickup Assistant|Vehicle Pickup/Drop Assistant|Loading Vehicle Helper' },
  { name: 'Baby & Child Care', slug: 'baby-child-care', order: 11, servicesText: 'Babysitter|Child Caregiver|Infant Caregiver|Newborn Care Assistant|Toddler Caregiver|Preschool Child Caregiver|After-School Child Caregiver|Child Supervision Assistant|Baby Feeding Assistant|Child Feeding Assistant|Baby Bathing Assistant|Baby Dressing Assistant|Diaper Changing Assistant|Baby Sleep Assistant|Bedtime Assistant|Child Play Companion|Indoor Activity Assistant|Outdoor Activity Companion|Child Homework Assistant|Child Study Companion|Storytelling Assistant|Reading Assistant|Drawing Teacher|Craft Activity Assistant|Music & Rhymes Assistant|School Preparation Assistant|School Pickup/Drop Assistant|Child Meal Preparation|Baby Food Preparation|Child Clothing/Laundry Assistant|Baby Room Organization|Day Care Helper|Day Care Attendant|Evening Babysitter|Night Child Care Assistant|Emergency Child Care Assistant|Multiple-Child Caregiver|Twin Baby Care Assistant|Child Event Caregiver|Child Travel Companion|Weekend Babysitter|Family Child Care Assistant' },
  { name: 'Elderly & Senior Citizen Care', slug: 'elderly-senior-citizen-care', order: 12, servicesText: 'Elderly Care Assistant|Senior Citizen Companion|Elderly Home Assistant|Elderly Meal Assistant|Elderly Feeding Assistant|Walking Companion|Mobility Assistant|Bathing Assistance|Dressing Assistance|Grooming Assistance|Toileting Assistance|Bedside Assistant|Bed Transfer Assistant|Exercise Companion|Reading Companion|Conversation Companion|Entertainment Companion|Shopping Assistant|Errand Assistant|Appointment Companion|Hospital Visit Companion|Medication Reminder Assistant|Meal Preparation Assistant|Household Assistance|Room Organization Assistant|Laundry Assistance|Day Companion|Evening Companion|Night Assistant|Emergency Assistance|Senior Citizen Travel Companion|Outdoor Companion|Religious Visit Companion|Market Companion|Social Companion|Family Elderly Care Assistant|Overnight Elderly Care Assistant' },
  { name: 'Non-Medical Home Assistance', slug: 'non-medical-home-assistance', order: 13, servicesText: 'Patient Attendant|Hospital Attendant|Bedside Companion|Hospital Visit Companion|Appointment Assistant|Medical Report Pickup Assistant|Medicine Pickup/Delivery Assistant|Health Appointment Booking Assistant|Mobility Assistance|Recovery Support Assistant|Home Support Assistant|Family Care Assistant' },
  { name: 'Agriculture & Farm Services', slug: 'agriculture-farm-services', order: 14, servicesText: 'Farm Labourer|Agricultural Helper|Field Preparation Worker|Ploughing Worker|Tractor Operator|Seed Sowing Worker|Transplanting Worker|Weeding Worker|Harvesting Worker|Crop Maintenance Worker|Fertilizer Application Worker|Pesticide Spraying Assistant|Irrigation Worker|Vegetable Farm Worker|Fruit Farm Worker|Flower Farm Worker|Nursery Worker|Greenhouse Worker|Organic Farming Worker|Farm Equipment Helper|Agricultural Machine Operator|Fencing Worker|Farm Cleaning Worker|Farm Watchman|Crop Sorting Worker|Crop Packing Worker|Agricultural Loading Worker|Farm Transport Helper' },
  { name: 'Gardening & Landscaping', slug: 'gardening-landscaping', order: 15, servicesText: 'Gardener|Gardening Helper|Lawn Maintenance Worker|Tree Trimming Worker|Hedge Cutting Worker|Planting Worker|Plant Nursery Worker|Compost Worker|Terrace Garden Worker|Kitchen Garden Worker|Landscaping Worker|Garden Cleaning Worker|Plant Maintenance Worker|Plant Repotting Assistant|Garden Watering Assistant|Organic Garden Assistant|Tree Plantation Worker|Garden Waste Removal' },
  { name: 'Livestock & Dairy', slug: 'livestock-dairy', order: 16, servicesText: 'Dairy Farm Worker|Cow Care Worker|Buffalo Care Worker|Goat Care Worker|Sheep Care Worker|Poultry Farm Worker|Poultry Care Worker|Animal Shed Cleaner|Animal Feeding Worker|Milking Assistant|Livestock Farm Helper|Farm Animal Care Assistant|Animal Shed Maintenance Worker|Feed Preparation Assistant|Dairy Cleaning Worker' },
  { name: 'Fisheries & Aquaculture', slug: 'fisheries-aquaculture', order: 17, servicesText: 'Fish Farm Worker|Fish Pond Worker|Fish Feeding Worker|Pond Maintenance Worker|Net Handling Worker|Aquaculture Helper|Fish Sorting Worker|Fish Packing Worker|Pond Cleaning Worker|Fish Harvesting Assistant|Fish Loading Worker|Fish Farm Maintenance Worker' },
  { name: 'Construction & Skilled Labour', slug: 'construction-skilled-labour', order: 18, servicesText: 'Mason|Mason Helper|Construction Labourer|Steel Worker|Welding Worker|Welder Helper|Shuttering Worker|Bar Bending Worker|Tile Worker|Brick Worker|Concrete Worker|Plaster Worker|Excavation Worker|Site Helper|Flooring Worker|Waterproofing Worker|Roofing Worker|Scaffolding Helper|Construction Cleaning Worker|Material Handling Worker' },
  { name: 'Beauty & Personal Care', slug: 'beauty-personal-care', order: 19, servicesText: 'Beautician|Hairdresser|Hair Stylist|Makeup Artist|Bridal Makeup Artist|Mehndi Artist|Nail Technician|Grooming Assistant|Saree Draping Assistant|Beauty Assistant|Facial Service Provider|Hair Care Assistant|Home Salon Assistant|Grooming Assistant|Event Makeup Assistant' },
  { name: 'Tailoring & Clothing', slug: 'tailoring-clothing', order: 20, servicesText: 'Tailor|Sewing Machine Operator|Stitching Worker|Clothing Repair Worker|Alteration Worker|Embroidery Worker|Hand Embroidery Worker|Fashion Design Assistant|Garment Finishing Worker|Ironing Worker|Saree Fall/Pico Worker|Blouse Stitching|Dress Stitching|Uniform Stitching|Clothing Modification|Zip Replacement|Button Replacement' },
  { name: 'Laundry & Garment Care', slug: 'laundry-garment-care', order: 21, servicesText: 'Laundry Worker|Clothes Washing Assistant|Ironing Worker|Drying/Folding Worker|Garment Sorting Worker|Garment Packing Worker|Shoe Cleaning Worker|Bag Cleaning Worker|Curtain Washing Assistant|Blanket Cleaning Assistant|Household Linen Assistant|Garment Collection/Delivery Assistant' },
  { name: 'Education & Tutoring', slug: 'education-tutoring', order: 22, servicesText: 'Primary School Tutor|Secondary School Tutor|Mathematics Tutor|Science Tutor|Physics Tutor|Chemistry Tutor|Biology Tutor|English Tutor|Odia Tutor|Hindi Tutor|Computer Tutor|Spoken English Trainer|School Homework Assistant|Exam Preparation Tutor|Drawing Teacher|Music Teacher|Dance Teacher|Basic Computer Trainer|Reading Tutor|Writing Tutor|Handwriting Trainer|School Project Assistant|Online Tutor|Home Tutor|Adult Education Tutor|Digital Literacy Trainer' },
  { name: 'Creative & Freelance Design', slug: 'creative-freelance-design', order: 23, servicesText: 'Graphic Designer|Logo Designer|Poster Designer|Banner Designer|Visiting Card Designer|Brochure Designer|Flyer Designer|Social Media Designer|Thumbnail Designer|Invitation Card Designer|Wedding Card Designer|Menu Designer|Packaging Designer|Presentation Designer|Resume Designer|Photo Editor|Image Retoucher|Video Editor|Reels Editor|YouTube Editor|Motion Graphics Designer|Animation Assistant|Illustrator|Digital Artist' },
  { name: 'Writing & Language Freelancing', slug: 'writing-language-freelancing', order: 24, servicesText: 'Content Writer|Blog Writer|Article Writer|Copywriter|Product Description Writer|Resume Writer|Cover Letter Writer|Social Media Writer|Script Writer|Caption Writer|Proofreader|Editor|Translator|Odia Translator|Hindi Translator|English Translator|Transcription Worker|Audio Transcription|Video Transcription|Data Researcher|Online Research Assistant' },
  { name: 'Digital & Office Freelancing', slug: 'digital-office-freelancing', order: 25, servicesText: 'Data Entry Operator|Typist|Excel Operator|Word Processing Assistant|Presentation Designer|Virtual Assistant|Online Assistant|Administrative Assistant|Documentation Assistant|PDF-to-Word Assistant|PDF-to-Excel Assistant|Spreadsheet Assistant|Data Cleaning Assistant|Data Collection Assistant|Online Research Assistant|Email Assistant|Calendar Assistant|File Organization Assistant|Document Formatting Assistant|Form Filling Assistant|Online Application Assistant' },
  { name: 'Digital Marketing & Social Media', slug: 'digital-marketing-social-media', order: 26, servicesText: 'Social Media Manager|Social Media Assistant|Facebook Page Manager|Instagram Manager|YouTube Channel Assistant|Content Scheduler|Social Media Designer|Caption Writer|Digital Marketing Assistant|SEO Assistant|Local SEO Assistant|Google Business Profile Assistant|Online Advertising Assistant|Lead Generation Assistant|Email Marketing Assistant|Influencer Outreach Assistant|Online Reputation Assistant' },
  { name: 'Shop & Business Assistance', slug: 'shop-business-assistance', order: 27, servicesText: 'Shop Assistant|Sales Assistant|Billing Assistant|Cash Counter Assistant|Inventory Assistant|Stock Counting Worker|Packing Assistant|Warehouse Assistant|Sales Executive|Field Sales Assistant|Data Entry Assistant|Computer Operator|Office Assistant|Documentation Assistant|Customer Service Assistant|Store Helper|Merchandising Assistant|Delivery Coordination Assistant' },
  { name: 'Delivery & Logistics', slug: 'delivery-logistics', order: 28, servicesText: 'Delivery Partner|Local Delivery Worker|Grocery Delivery Assistant|Food Delivery Assistant|Document Delivery|Medicine Delivery|Parcel Delivery|Pickup Assistant|Drop Assistant|Warehouse Picker|Warehouse Packer|Sorting Worker|Inventory Worker|Loading Worker|Unloading Worker|Logistics Assistant|Dispatch Assistant|Courier Assistant' },
  { name: 'Event & Wedding Services', slug: 'event-wedding-services', order: 29, servicesText: 'Event Helper|Event Setup Worker|Decoration Helper|Stage Setup Worker|Chair/Table Setup Worker|Catering Helper|Serving Assistant|Kitchen Helper|Wedding Helper|Photography Assistant|Videography Assistant|Sound System Helper|Lighting Helper|Event Cleaning Worker|Guest Assistance|Registration Desk Assistant|Event Coordinator Assistant|Gift Packing Assistant|Return Gift Assistant|Venue Setup Worker' },
  { name: 'Photography & Video', slug: 'photography-video', order: 30, servicesText: 'Photographer|Wedding Photographer|Event Photographer|Product Photographer|Portrait Photographer|Real Estate Photographer|Videographer|Wedding Videographer|Event Videographer|Drone Photography Operator|Video Editor|Photo Editor|Album Designer|Reels Creator|Short Video Creator' },
  { name: 'Property & Real Estate Assistance', slug: 'property-real-estate-assistance', order: 31, servicesText: 'Property Inspection Assistant|Property Watchman|Site Watch Assistant|Rental Property Assistant|Property Cleaning Assistant|Property Maintenance Assistant|Property Photography|Property Documentation Assistant|House Inspection Assistant|Tenant Move-in Assistant|Tenant Move-out Assistant|Property Visit Assistant|Construction Site Watchman|Parking Assistant|Gate Assistant' },
  { name: 'Security & Watch Services', slug: 'security-watch-services', order: 32, servicesText: 'Property Watchman|Site Watchman|Event Security Assistant|Gate Assistant|Parking Assistant|Night Watchman|Warehouse Watchman|Construction Site Watchman|Residential Security Assistant|Visitor Assistance' },
  { name: 'Packing & Organization', slug: 'packing-organization', order: 33, servicesText: 'Home Packing Assistant|Office Packing Assistant|House Shifting Packing|Unpacking Assistant|Furniture Packing|Fragile Item Packing|Gift Packing|E-commerce Packing|Warehouse Packing|Garment Packing|Product Packing|Inventory Organization|Home Organization|Office Organization|Storage Organization' },
  { name: 'Religious & Community Assistance', slug: 'religious-community-assistance', order: 34, servicesText: 'Puja Preparation Helper|Temple Event Helper|Religious Event Helper|Community Event Helper|Decoration Helper|Cleaning Helper|Seating Arrangement Worker|Food Distribution Helper|Prasad Packing Assistant|Religious Function Setup Worker|Community Program Helper|Festival Setup Helper' },
  { name: 'Waste, Recycling & Cleaning Labour', slug: 'waste-recycling-cleaning-labour', order: 35, servicesText: 'Waste Collection Worker|Dry Waste Collector|Recycling Collection Worker|Scrap Sorting Worker|Scrap Collection Assistant|Garden Waste Worker|Waste Segregation Worker|Recycling Helper|Construction Waste Helper|Cleanup Worker|Post-Event Cleanup Worker|Property Cleanup Worker' },
  { name: 'Rural & Village Services', slug: 'rural-village-services', order: 36, servicesText: 'Village General Helper|Farm Helper|Agricultural Labourer|Livestock Helper|Poultry Helper|Dairy Helper|Irrigation Helper|Pond Cleaning Helper|Fish Farm Helper|Nursery Worker|Village Construction Helper|Tractor Helper|Harvesting Worker|Weeding Worker|Fencing Worker|Rural Transport Helper|Market Loading Worker|Local Delivery Worker|Village House Maintenance Worker|Village Cleaning Worker|Rural Packing Worker|Rural Event Helper' },
  { name: 'General Handyman / On-Demand Help', slug: 'general-handyman-on-demand-help', order: 37, servicesText: 'General Helper|Household Helper|Shop Helper|Farm Helper|Loading Helper|Unloading Helper|Packing Helper|Cleaning Helper|Event Helper|Construction Helper|Moving Helper|Delivery Helper|Warehouse Helper|Market Helper|Office Helper|Temporary Helper|Daily Labour|Emergency General Helper' },
  { name: 'Emergency Assistance', slug: 'emergency-assistance', order: 38, servicesText: 'Emergency General Helper|Emergency Cleaning|Emergency Loading|Emergency Moving|Storm Cleanup|Flood Cleanup|Fallen Tree Cleanup|Emergency Property Cleanup|Emergency Transport Helper|Temporary Site Helper|Emergency Household Assistance' },
  { name: 'Family Assistance', slug: 'family-assistance', order: 39, servicesText: 'Family Care Assistant|Child & Elderly Care Assistant|Household Assistant|Family Errand Assistant|Shopping Assistant|Cooking Assistant|Meal Preparation Assistant|Home Organization Assistant|Family Travel Assistant|School Assistance|Elderly Appointment Assistant|Household Support Assistant|Weekend Family Assistant|Overnight Family Assistant' },
  { name: 'Cooking & Food Assistance', slug: 'cooking-food-assistance', order: 40, servicesText: 'Home Cook|Cooking Assistant|Meal Preparation Assistant|Kitchen Helper|Vegetable Cutting Assistant|Food Preparation Worker|Tiffin Preparation Assistant|Party Cooking Assistant|Event Kitchen Helper|Catering Helper|Serving Assistant|Dishwashing Assistant|Kitchen Cleaning Assistant|Food Packing Assistant|Home Meal Assistant' },
  { name: 'Handicraft & Home-Based Earning', slug: 'handicraft-home-based-earning', order: 41, servicesText: 'Handicraft Worker|Bamboo Craft Worker|Cane Craft Worker|Pottery Worker|Decorative Craft Worker|Gift Packing Worker|Handmade Product Maker|Candle Maker|Decorative Item Maker|Artisan Assistant|Handmade Jewellery Maker|Basket Maker|Traditional Craft Worker|Festival Decoration Maker|Handmade Gift Maker' },
  { name: 'E-Commerce & Home-Based Work', slug: 'e-commerce-home-based-work', order: 42, servicesText: 'Product Packing|Product Labelling|Product Sorting|Product Photography|Product Listing Assistant|Online Store Assistant|Order Processing Assistant|Inventory Assistant|Customer Chat Assistant|E-commerce Data Entry|Catalog Assistant|Marketplace Assistant|Social Commerce Assistant|Handmade Product Seller|Home-Based Product Maker' },
  { name: 'Professional & Business Freelancing', slug: 'professional-business-freelancing', order: 43, servicesText: 'Accountant|Bookkeeping Assistant|GST Assistance|Tax Documentation Assistant|Business Documentation Assistant|Business Plan Assistant|HR Assistant|Recruitment Assistant|Resume Consultant|Career Guidance|Business Consultant|Marketing Consultant|Financial Documentation Assistant|Project Coordinator|Operations Consultant' },
  { name: 'School & Institutional Support', slug: 'school-institutional-support', order: 44, servicesText: 'School Helper|Classroom Assistant|School Cleaning Worker|School Maintenance Worker|Library Assistant|Lab Assistant|Computer Lab Assistant|Office Assistant|School Event Helper|Exam Support Assistant|School Transport Assistant|School Grounds Maintenance|School Gardening Worker' },
  { name: 'Office & Corporate Support', slug: 'office-corporate-support', order: 45, servicesText: 'Office Assistant|Reception Assistant|Data Entry Operator|Document Assistant|Filing Assistant|Office Cleaning|Pantry Assistant|Office Helper|Meeting Setup Assistant|Office Moving Helper|Inventory Assistant|Courier Assistant|Facility Assistant|Event/Conference Assistant|Temporary Office Staff' },
  { name: 'Hospitality & Guest Assistance', slug: 'hospitality-guest-assistance', order: 46, servicesText: 'Hotel Helper|Housekeeping Assistant|Room Cleaning Assistant|Laundry Assistant|Kitchen Helper|Restaurant Helper|Serving Assistant|Dishwashing Assistant|Event Hall Helper|Guest Assistance|Luggage Assistant|Banquet Helper|Reception Assistant|Room Setup Assistant' },
  { name: 'Pet & Animal Assistance', slug: 'pet-animal-assistance', order: 47, servicesText: 'Pet Care Assistant|Pet Walking|Pet Feeding Assistant|Pet Grooming Assistant|Pet Sitting|Pet Cleaning Assistant|Pet Travel Assistant|Animal Shelter Helper|Animal Feeding Worker|Animal Shed Cleaning|Livestock Assistance|Poultry Assistance' },
  { name: 'Outdoor & Property Maintenance', slug: 'outdoor-property-maintenance', order: 48, servicesText: 'Lawn Worker|Garden Worker|Tree Plantation Worker|Tree Maintenance Assistant|Fencing Worker|Compound Cleaning|Terrace Cleaning|Outdoor Cleaning|Drain Cleaning|Property Cleanup|Parking Area Cleaning|Open Land Cleaning|Construction Site Cleanup' },
  { name: 'Skilled Technical Freelancers', slug: 'skilled-technical-freelancers', order: 49, servicesText: 'Welder|Fabricator|Electrician|Plumber|Carpenter|Mason|Painter|AC Technician|Refrigerator Technician|Appliance Technician|Computer Technician|CCTV Technician|Solar Technician|Mechanic|Machine Operator|Electrical Technician|Network Technician|Furniture Technician|Tile Worker|Waterproofing Technician' },
  { name: 'Earn With Your Time', slug: 'earn-with-your-time', order: 50, servicesText: 'General Helper|Household Helper|Shopping Assistant|Errand Assistant|Queue Assistant|Document Pickup Assistant|Document Drop Assistant|Local Delivery Assistant|Loading Assistant|Unloading Assistant|Packing Assistant|Unpacking Assistant|Moving Assistant|Event Helper|Shop Helper|Farm Helper|Warehouse Helper|Market Helper|Office Helper|Cleaning Helper|Gardening Helper|Construction Helper|Festival Helper|Temporary Worker|Daily Labour|Companion Assistant|Home Organization Assistant|Local Task Assistant|Personal Errand Assistant|General On-Demand Helper' }
];

export function calculateBaseHourlyRate(serviceName: string): number {
  const s = serviceName.toLowerCase();
  if (/(accountant|bookkeeping|gst assistance|tax documentation|business documentation|business plan|consultant|career guidance|project coordinator|operations consultant|marketing consultant|financial documentation)/.test(s)) {
    return 800;
  }
  if (/(graphic designer|logo designer|poster designer|banner designer|visiting card|brochure|flyer designer|social media designer|thumbnail|invitation card|wedding card|menu designer|packaging designer|presentation designer|resume designer|photo editor|image retoucher|video editor|reels editor|youtube editor|motion graphics|animation assistant|illustrator|digital artist|photographer|videographer|album designer|reels creator|short video creator|property photography|product photography)/.test(s)) {
    return 600;
  }
  if (/(beautician|hairdresser|hair stylist|makeup|mehndi|nail technician|grooming|saree draping|beauty assistant|facial|hair care|salon|electrician|plumber|carpenter|welder|fabricator|mechanic|mason|painter|ac technician|refrigerator technician|appliance technician|solar technician|network technician|cctv technician|electrical technician|furniture technician|tile worker|waterproofing technician|computer technician|laptop technician|desktop technician|printer technician|bike mechanic|car mechanic|auto mechanic|tractor mechanic|steel worker|welding worker)/.test(s)) {
    return 500;
  }
  if (/(tutor|teacher|trainer|training|education|home tutor|online tutor|drawing teacher|music teacher|dance teacher|reading tutor|writing tutor|handwriting trainer|study companion|homework assistant|exam preparation)/.test(s)) {
    return 400;
  }
  if (/(driver|transport|vehicle pickup|vehicle pickup\/drop|delivery driver|pickup driver|van driver|tractor driver)/.test(s)) {
    return 350;
  }
  if (/(babysitter|child|baby|infant|newborn|toddler|preschool|after-school|elderly|senior citizen|caregiver|companion|patient attendant|hospital attendant|bedside|mobility assistance|family care|farm|agricultur|tractor operator|ploughing|sowing|transplanting|weeding|harvesting|crop|fertilizer|pesticide|irrigation|vegetable farm|fruit farm|flower farm|nursery|greenhouse|organic farming|livestock|dairy|cow care|buffalo|goat care|sheep|poultry|animal shed|milking|fish farm|fish pond|aquaculture|pond maintenance|net handling|cleaner|cleaning|housekeeping|laundry|washing|ironing|dusting|waste|recycling|scrap|cleanup|dishwashing|utensil cleaning|shoe cleaning|bag cleaning|curtain washing|blanket cleaning|garden waste|compound cleaning|terrace cleaning|outdoor cleaning|watchman|security|gate assistant|parking assistant|visitor assistance)/.test(s)) {
    return 300;
  }
  if (/(helper|labourer|labour|worker|assistant|loading|unloading|packing|unpacking|moving helper|temporary worker|daily wage|daily labour)/.test(s)) {
    return 250;
  }
  return 350;
}

export function isVerificationRequired(categoryName: string, serviceName: string): boolean {
  if (categoryName.toLowerCase().includes('security & watch services')) return true;
  if (serviceName.toLowerCase() === 'drone photography operator') return true;
  return false;
}

/**
 * Returns all 978 unique deduplicated services across all 50 categories
 */
export function getExpandedMasterServices(): MasterCatalogItem[] {
  const seen = new Set<string>();
  const items: MasterCatalogItem[] = [];

  for (const cat of MASTER_CATALOG_RAW) {
    const names = cat.servicesText.split('|').map(s => s.trim()).filter(Boolean);
    for (const name of names) {
      const dedupKey = `${cat.name.toLowerCase()}:::${name.toLowerCase()}`;
      if (seen.has(dedupKey)) continue;
      seen.add(dedupKey);

      const baseRate = calculateBaseHourlyRate(name);
      const customerPrice = Math.round(baseRate * 1.20 * 100) / 100;
      const agentPayout = baseRate;
      const doorblyCommission = Math.round(baseRate * 0.20 * 100) / 100;
      const slugSuffix = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
      const slug = `${cat.slug}--${slugSuffix}`;

      items.push({
        categoryName: cat.name,
        categorySlug: cat.slug,
        categoryOrder: cat.order,
        serviceName: name,
        slug,
        baseHourlyRate: baseRate,
        customerPrice,
        agentPayout,
        doorblyCommission,
        verificationRequired: isVerificationRequired(cat.name, name),
        pricingType: 'hourly',
        pricingUnit: 'hour'
      });
    }
  }

  return items;
}
