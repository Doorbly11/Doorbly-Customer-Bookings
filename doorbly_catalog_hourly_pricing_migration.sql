-- ==============================================================================
-- DOORBLY MASTER SERVICE CATALOG + HOURLY PRICING MIGRATION
-- 50 Trade & Freelance Categories | 978 Unique Hourly Services
-- Hourly Pricing: customer_price = ROUND(base_hourly_rate * 1.20, 2)
-- Provider payout: agent_payout = base_hourly_rate
-- Doorbly margin: doorbly_commission = ROUND(base_hourly_rate * 0.20, 2)
-- Idempotent, zero DELETE/TRUNCATE, safe for production Supabase databases.
-- ==============================================================================

BEGIN;

-- 1. Ensure required columns exist on service_categories
ALTER TABLE public.service_categories
  ADD COLUMN IF NOT EXISTS display_order integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS sort_order integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS description text,
  ADD COLUMN IF NOT EXISTS is_active boolean DEFAULT true;

-- 2. Ensure required columns exist on services
ALTER TABLE public.services
  ADD COLUMN IF NOT EXISTS pricing_type text DEFAULT 'hourly',
  ADD COLUMN IF NOT EXISTS pricing_unit text DEFAULT 'hour',
  ADD COLUMN IF NOT EXISTS base_hourly_rate numeric,
  ADD COLUMN IF NOT EXISTS customer_price numeric,
  ADD COLUMN IF NOT EXISTS agent_payout numeric,
  ADD COLUMN IF NOT EXISTS doorbly_commission numeric,
  ADD COLUMN IF NOT EXISTS partner_hourly_rate numeric,
  ADD COLUMN IF NOT EXISTS customer_hourly_price numeric,
  ADD COLUMN IF NOT EXISTS commission_percentage numeric DEFAULT 20.00,
  ADD COLUMN IF NOT EXISTS verification_required boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS is_popular boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS is_active boolean DEFAULT true,
  ADD COLUMN IF NOT EXISTS slug text,
  ADD COLUMN IF NOT EXISTS minimum_hours integer DEFAULT 1,
  ADD COLUMN IF NOT EXISTS maximum_hours integer DEFAULT 8;

-- 3. Relax legacy constraints if present to guarantee safe migration
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'services' AND column_name = 'slug' AND is_nullable = 'NO'
  ) THEN
    ALTER TABLE public.services ALTER COLUMN slug DROP NOT NULL;
  END IF;
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'services' AND column_name = 'customer_hourly_price' AND is_nullable = 'NO'
  ) THEN
    ALTER TABLE public.services ALTER COLUMN customer_hourly_price DROP NOT NULL;
  END IF;
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'services' AND column_name = 'partner_hourly_rate' AND is_nullable = 'NO'
  ) THEN
    ALTER TABLE public.services ALTER COLUMN partner_hourly_rate DROP NOT NULL;
  END IF;
END $$;

-- 4. Temporary table with 50 Categories and Pipe-Separated Services
CREATE TEMP TABLE _doorbly_master_catalog (
  category_name text NOT NULL,
  category_slug text NOT NULL,
  category_order integer NOT NULL,
  services_text text NOT NULL
) ON COMMIT DROP;

INSERT INTO _doorbly_master_catalog(category_name, category_slug, category_order, services_text)
VALUES
('Home Repair & Maintenance', 'home-repair-maintenance', 1, 'Carpenter|Furniture Repair|Furniture Assembly|Door Repair|Door Installation|Window Repair|Window Installation|Lock Repair|Lock Installation|Curtain Installation|Curtain Rod Installation|Shelf Installation|Wall-Mount Installation|TV Wall Mounting|Drilling & Wall Mounting|Picture/Frame Installation|Mirror Installation|Furniture Shifting|Furniture Polishing|Wood Polishing|Wood Repair|Modular Furniture Repair|Kitchen Cabinet Repair|Wardrobe Repair|Bed Repair|Table Repair|Chair Repair|Sofa Frame Repair|False Ceiling Work|POP Work|Gypsum Work|Tile Work|Marble Work|Granite Work|Masonry|Plastering|Grouting|Waterproofing|Flooring|Wall Crack Repair|General Home Maintenance|Handyman Services'),
('Electrical Services', 'electrical-services', 2, 'Electrician|Electrical Helper|Switch Replacement|Socket Replacement|Switchboard Repair|Fan Installation|Fan Repair|Ceiling Fan Installation|Exhaust Fan Installation|Light Installation|LED Installation|Tube Light Installation|Chandelier Installation|Wiring|Rewiring|Electrical Fault Diagnosis|MCB Installation|MCB Repair|DB Installation|DB Repair|Fuse Repair|Inverter Installation|Inverter Repair|Battery Installation|Battery Maintenance|Generator Assistance|CCTV Installation|CCTV Maintenance|Doorbell Installation|Solar Panel Installation|Solar Panel Cleaning|Solar Maintenance|Earthing Work|Electrical Inspection|Home Electrical Maintenance'),
('Plumbing & Water Services', 'plumbing-water-services', 3, 'Plumber|Plumbing Helper|Tap Repair|Tap Installation|Pipe Fitting|Pipe Repair|Leakage Repair|Bathroom Plumbing|Kitchen Plumbing|Drain Cleaning|Drainage Repair|Toilet Repair|Toilet Installation|Shower Installation|Basin Installation|Sink Installation|Water Tank Cleaning|Water Tank Maintenance|Water Pump Installation|Water Pump Repair|Motor Repair|Borewell Assistance|Irrigation Pipe Installation|Water Filter Installation|Water Line Installation|Underground Pipe Repair|Rainwater Drainage Work'),
('Cleaning & Household Services', 'cleaning-household-services', 4, 'Home Cleaner|Housekeeping Worker|Bathroom Cleaner|Kitchen Cleaner|Floor Cleaner|Window Cleaner|Balcony Cleaner|Terrace Cleaner|Deep Cleaning|Dusting Service|Sofa Cleaning|Mattress Cleaning|Carpet Cleaning|Curtain Cleaning|Fan Cleaning|Kitchen Chimney Cleaning|Utensil Cleaning|Laundry Worker|Clothes Washing|Clothes Folding|Ironing|Shoe Cleaning|Bag Cleaning|Home Organization|Wardrobe Organization|Kitchen Organization|Packing Assistance|Unpacking Assistance|Household Helper|Senior Household Helper'),
('Painting & Decoration', 'painting-decoration', 5, 'Painter|Painter Helper|Wall Painting|Interior Painting|Exterior Painting|Wall Putty|Texture Painting|Spray Painting|Decorative Painting|Wood Painting|Metal Painting|Door Painting|Furniture Painting|Wallpaper Installation|Wallpaper Removal|Wall Sticker Installation|Decorative Wall Work|Festival Decoration|Home Decoration|Temporary Decoration Setup'),
('AC & Appliance Services', 'ac-appliance-services', 6, 'AC Technician|AC Helper|AC Installation|AC Uninstallation|AC Servicing|AC Cleaning|AC Repair|Refrigerator Technician|Refrigerator Repair|Washing Machine Technician|Washing Machine Repair|Geyser Technician|Geyser Installation|Geyser Repair|Water Purifier Technician|RO Technician|RO Installation|RO Servicing|Microwave Repair|Oven Repair|Air Cooler Repair|Mixer Grinder Repair|Small Appliance Repair|Appliance Installation|Appliance Maintenance'),
('Computer, Mobile & Technology', 'computer-mobile-technology', 7, 'Computer Technician|Laptop Technician|Desktop Technician|Printer Technician|Printer Installation|Printer Repair|Wi-Fi Setup|Router Installation|Network Setup|CCTV Technician|CCTV Helper|Mobile Phone Technician|Smartphone Setup|Smart TV Setup|TV Installation|Software Installation|Operating System Installation|Computer Formatting|Data Backup|Data Transfer|Basic Computer Training|Digital Literacy Training|Online Form Assistance|Email Setup|Digital Document Assistance|Cyber Café Assistance|Device Setup|Home Office Setup'),
('Vehicle Services', 'vehicle-services', 8, 'Bike Mechanic|Car Mechanic|Auto Mechanic|Tractor Mechanic|Bicycle Repair|Bike Servicing|Car Servicing|Vehicle Inspection|Battery Replacement|Battery Charging Assistance|Tyre Repair|Puncture Repair|Tyre Replacement Assistance|Vehicle Washing|Vehicle Cleaning|Car Detailing|Bike Cleaning|Car Interior Cleaning|Car AC Technician|Vehicle Electrical Repair|Vehicle Breakdown Assistance|Garage Helper|Tractor Assistance|Agricultural Vehicle Maintenance'),
('Moving, Loading & Manpower', 'moving-loading-manpower', 9, 'General Labourer|Loading Worker|Unloading Worker|Moving Helper|Furniture Moving|Packing Worker|Unpacking Worker|Warehouse Helper|Shop Helper|Construction Helper|Material Handling Worker|Market Loading Worker|Delivery Loading Assistant|Event Helper|Temporary Labour|Daily Wage Helper|House Shifting Helper|Office Shifting Helper|Storage Helper'),
('Driving & Local Assistance', 'driving-local-assistance', 10, 'Personal Driver|Car Driver|Delivery Driver|Pickup Driver|Van Driver|Tractor Driver|Commercial Driver|School Transport Driver|Local Errand Assistant|Shopping Assistant|Document Delivery Assistant|Parcel Delivery Assistant|Local Pickup Assistant|Vehicle Pickup/Drop Assistant|Loading Vehicle Helper'),
('Baby & Child Care', 'baby-child-care', 11, 'Babysitter|Child Caregiver|Infant Caregiver|Newborn Care Assistant|Toddler Caregiver|Preschool Child Caregiver|After-School Child Caregiver|Child Supervision Assistant|Baby Feeding Assistant|Child Feeding Assistant|Baby Bathing Assistant|Baby Dressing Assistant|Diaper Changing Assistant|Baby Sleep Assistant|Bedtime Assistant|Child Play Companion|Indoor Activity Assistant|Outdoor Activity Companion|Child Homework Assistant|Child Study Companion|Storytelling Assistant|Reading Assistant|Drawing Teacher|Craft Activity Assistant|Music & Rhymes Assistant|School Preparation Assistant|School Pickup/Drop Assistant|Child Meal Preparation|Baby Food Preparation|Child Clothing/Laundry Assistant|Baby Room Organization|Day Care Helper|Day Care Attendant|Evening Babysitter|Night Child Care Assistant|Emergency Child Care Assistant|Multiple-Child Caregiver|Twin Baby Care Assistant|Child Event Caregiver|Child Travel Companion|Weekend Babysitter|Family Child Care Assistant'),
('Elderly & Senior Citizen Care', 'elderly-senior-citizen-care', 12, 'Elderly Care Assistant|Senior Citizen Companion|Elderly Home Assistant|Elderly Meal Assistant|Elderly Feeding Assistant|Walking Companion|Mobility Assistant|Bathing Assistance|Dressing Assistance|Grooming Assistance|Toileting Assistance|Bedside Assistant|Bed Transfer Assistant|Exercise Companion|Reading Companion|Conversation Companion|Entertainment Companion|Shopping Assistant|Errand Assistant|Appointment Companion|Hospital Visit Companion|Medication Reminder Assistant|Meal Preparation Assistant|Household Assistance|Room Organization Assistant|Laundry Assistance|Day Companion|Evening Companion|Night Assistant|Emergency Assistance|Senior Citizen Travel Companion|Outdoor Companion|Religious Visit Companion|Market Companion|Social Companion|Family Elderly Care Assistant|Overnight Elderly Care Assistant'),
('Non-Medical Home Assistance', 'non-medical-home-assistance', 13, 'Patient Attendant|Hospital Attendant|Bedside Companion|Hospital Visit Companion|Appointment Assistant|Medical Report Pickup Assistant|Medicine Pickup/Delivery Assistant|Health Appointment Booking Assistant|Mobility Assistance|Recovery Support Assistant|Home Support Assistant|Family Care Assistant'),
('Agriculture & Farm Services', 'agriculture-farm-services', 14, 'Farm Labourer|Agricultural Helper|Field Preparation Worker|Ploughing Worker|Tractor Operator|Seed Sowing Worker|Transplanting Worker|Weeding Worker|Harvesting Worker|Crop Maintenance Worker|Fertilizer Application Worker|Pesticide Spraying Assistant|Irrigation Worker|Vegetable Farm Worker|Fruit Farm Worker|Flower Farm Worker|Nursery Worker|Greenhouse Worker|Organic Farming Worker|Farm Equipment Helper|Agricultural Machine Operator|Fencing Worker|Farm Cleaning Worker|Farm Watchman|Crop Sorting Worker|Crop Packing Worker|Agricultural Loading Worker|Farm Transport Helper'),
('Gardening & Landscaping', 'gardening-landscaping', 15, 'Gardener|Gardening Helper|Lawn Maintenance Worker|Tree Trimming Worker|Hedge Cutting Worker|Planting Worker|Plant Nursery Worker|Compost Worker|Terrace Garden Worker|Kitchen Garden Worker|Landscaping Worker|Garden Cleaning Worker|Plant Maintenance Worker|Plant Repotting Assistant|Garden Watering Assistant|Organic Garden Assistant|Tree Plantation Worker|Garden Waste Removal'),
('Livestock & Dairy', 'livestock-dairy', 16, 'Dairy Farm Worker|Cow Care Worker|Buffalo Care Worker|Goat Care Worker|Sheep Care Worker|Poultry Farm Worker|Poultry Care Worker|Animal Shed Cleaner|Animal Feeding Worker|Milking Assistant|Livestock Farm Helper|Farm Animal Care Assistant|Animal Shed Maintenance Worker|Feed Preparation Assistant|Dairy Cleaning Worker'),
('Fisheries & Aquaculture', 'fisheries-aquaculture', 17, 'Fish Farm Worker|Fish Pond Worker|Fish Feeding Worker|Pond Maintenance Worker|Net Handling Worker|Aquaculture Helper|Fish Sorting Worker|Fish Packing Worker|Pond Cleaning Worker|Fish Harvesting Assistant|Fish Loading Worker|Fish Farm Maintenance Worker'),
('Construction & Skilled Labour', 'construction-skilled-labour', 18, 'Mason|Mason Helper|Construction Labourer|Steel Worker|Welding Worker|Welder Helper|Shuttering Worker|Bar Bending Worker|Tile Worker|Brick Worker|Concrete Worker|Plaster Worker|Excavation Worker|Site Helper|Flooring Worker|Waterproofing Worker|Roofing Worker|Scaffolding Helper|Construction Cleaning Worker|Material Handling Worker'),
('Beauty & Personal Care', 'beauty-personal-care', 19, 'Beautician|Hairdresser|Hair Stylist|Makeup Artist|Bridal Makeup Artist|Mehndi Artist|Nail Technician|Grooming Assistant|Saree Draping Assistant|Beauty Assistant|Facial Service Provider|Hair Care Assistant|Home Salon Assistant|Grooming Assistant|Event Makeup Assistant'),
('Tailoring & Clothing', 'tailoring-clothing', 20, 'Tailor|Sewing Machine Operator|Stitching Worker|Clothing Repair Worker|Alteration Worker|Embroidery Worker|Hand Embroidery Worker|Fashion Design Assistant|Garment Finishing Worker|Ironing Worker|Saree Fall/Pico Worker|Blouse Stitching|Dress Stitching|Uniform Stitching|Clothing Modification|Zip Replacement|Button Replacement'),
('Laundry & Garment Care', 'laundry-garment-care', 21, 'Laundry Worker|Clothes Washing Assistant|Ironing Worker|Drying/Folding Worker|Garment Sorting Worker|Garment Packing Worker|Shoe Cleaning Worker|Bag Cleaning Worker|Curtain Washing Assistant|Blanket Cleaning Assistant|Household Linen Assistant|Garment Collection/Delivery Assistant'),
('Education & Tutoring', 'education-tutoring', 22, 'Primary School Tutor|Secondary School Tutor|Mathematics Tutor|Science Tutor|Physics Tutor|Chemistry Tutor|Biology Tutor|English Tutor|Odia Tutor|Hindi Tutor|Computer Tutor|Spoken English Trainer|School Homework Assistant|Exam Preparation Tutor|Drawing Teacher|Music Teacher|Dance Teacher|Basic Computer Trainer|Reading Tutor|Writing Tutor|Handwriting Trainer|School Project Assistant|Online Tutor|Home Tutor|Adult Education Tutor|Digital Literacy Trainer'),
('Creative & Freelance Design', 'creative-freelance-design', 23, 'Graphic Designer|Logo Designer|Poster Designer|Banner Designer|Visiting Card Designer|Brochure Designer|Flyer Designer|Social Media Designer|Thumbnail Designer|Invitation Card Designer|Wedding Card Designer|Menu Designer|Packaging Designer|Presentation Designer|Resume Designer|Photo Editor|Image Retoucher|Video Editor|Reels Editor|YouTube Editor|Motion Graphics Designer|Animation Assistant|Illustrator|Digital Artist'),
('Writing & Language Freelancing', 'writing-language-freelancing', 24, 'Content Writer|Blog Writer|Article Writer|Copywriter|Product Description Writer|Resume Writer|Cover Letter Writer|Social Media Writer|Script Writer|Caption Writer|Proofreader|Editor|Translator|Odia Translator|Hindi Translator|English Translator|Transcription Worker|Audio Transcription|Video Transcription|Data Researcher|Online Research Assistant'),
('Digital & Office Freelancing', 'digital-office-freelancing', 25, 'Data Entry Operator|Typist|Excel Operator|Word Processing Assistant|Presentation Designer|Virtual Assistant|Online Assistant|Administrative Assistant|Documentation Assistant|PDF-to-Word Assistant|PDF-to-Excel Assistant|Spreadsheet Assistant|Data Cleaning Assistant|Data Collection Assistant|Online Research Assistant|Email Assistant|Calendar Assistant|File Organization Assistant|Document Formatting Assistant|Form Filling Assistant|Online Application Assistant'),
('Digital Marketing & Social Media', 'digital-marketing-social-media', 26, 'Social Media Manager|Social Media Assistant|Facebook Page Manager|Instagram Manager|YouTube Channel Assistant|Content Scheduler|Social Media Designer|Caption Writer|Digital Marketing Assistant|SEO Assistant|Local SEO Assistant|Google Business Profile Assistant|Online Advertising Assistant|Lead Generation Assistant|Email Marketing Assistant|Influencer Outreach Assistant|Online Reputation Assistant'),
('Shop & Business Assistance', 'shop-business-assistance', 27, 'Shop Assistant|Sales Assistant|Billing Assistant|Cash Counter Assistant|Inventory Assistant|Stock Counting Worker|Packing Assistant|Warehouse Assistant|Sales Executive|Field Sales Assistant|Data Entry Assistant|Computer Operator|Office Assistant|Documentation Assistant|Customer Service Assistant|Store Helper|Merchandising Assistant|Delivery Coordination Assistant'),
('Delivery & Logistics', 'delivery-logistics', 28, 'Delivery Partner|Local Delivery Worker|Grocery Delivery Assistant|Food Delivery Assistant|Document Delivery|Medicine Delivery|Parcel Delivery|Pickup Assistant|Drop Assistant|Warehouse Picker|Warehouse Packer|Sorting Worker|Inventory Worker|Loading Worker|Unloading Worker|Logistics Assistant|Dispatch Assistant|Courier Assistant'),
('Event & Wedding Services', 'event-wedding-services', 29, 'Event Helper|Event Setup Worker|Decoration Helper|Stage Setup Worker|Chair/Table Setup Worker|Catering Helper|Serving Assistant|Kitchen Helper|Wedding Helper|Photography Assistant|Videography Assistant|Sound System Helper|Lighting Helper|Event Cleaning Worker|Guest Assistance|Registration Desk Assistant|Event Coordinator Assistant|Gift Packing Assistant|Return Gift Assistant|Venue Setup Worker'),
('Photography & Video', 'photography-video', 30, 'Photographer|Wedding Photographer|Event Photographer|Product Photographer|Portrait Photographer|Real Estate Photographer|Videographer|Wedding Videographer|Event Videographer|Drone Photography Operator|Video Editor|Photo Editor|Album Designer|Reels Creator|Short Video Creator'),
('Property & Real Estate Assistance', 'property-real-estate-assistance', 31, 'Property Inspection Assistant|Property Watchman|Site Watch Assistant|Rental Property Assistant|Property Cleaning Assistant|Property Maintenance Assistant|Property Photography|Property Documentation Assistant|House Inspection Assistant|Tenant Move-in Assistant|Tenant Move-out Assistant|Property Visit Assistant|Construction Site Watchman|Parking Assistant|Gate Assistant'),
('Security & Watch Services', 'security-watch-services', 32, 'Property Watchman|Site Watchman|Event Security Assistant|Gate Assistant|Parking Assistant|Night Watchman|Warehouse Watchman|Construction Site Watchman|Residential Security Assistant|Visitor Assistance'),
('Packing & Organization', 'packing-organization', 33, 'Home Packing Assistant|Office Packing Assistant|House Shifting Packing|Unpacking Assistant|Furniture Packing|Fragile Item Packing|Gift Packing|E-commerce Packing|Warehouse Packing|Garment Packing|Product Packing|Inventory Organization|Home Organization|Office Organization|Storage Organization'),
('Religious & Community Assistance', 'religious-community-assistance', 34, 'Puja Preparation Helper|Temple Event Helper|Religious Event Helper|Community Event Helper|Decoration Helper|Cleaning Helper|Seating Arrangement Worker|Food Distribution Helper|Prasad Packing Assistant|Religious Function Setup Worker|Community Program Helper|Festival Setup Helper'),
('Waste, Recycling & Cleaning Labour', 'waste-recycling-cleaning-labour', 35, 'Waste Collection Worker|Dry Waste Collector|Recycling Collection Worker|Scrap Sorting Worker|Scrap Collection Assistant|Garden Waste Worker|Waste Segregation Worker|Recycling Helper|Construction Waste Helper|Cleanup Worker|Post-Event Cleanup Worker|Property Cleanup Worker'),
('Rural & Village Services', 'rural-village-services', 36, 'Village General Helper|Farm Helper|Agricultural Labourer|Livestock Helper|Poultry Helper|Dairy Helper|Irrigation Helper|Pond Cleaning Helper|Fish Farm Helper|Nursery Worker|Village Construction Helper|Tractor Helper|Harvesting Worker|Weeding Worker|Fencing Worker|Rural Transport Helper|Market Loading Worker|Local Delivery Worker|Village House Maintenance Worker|Village Cleaning Worker|Rural Packing Worker|Rural Event Helper'),
('General Handyman / On-Demand Help', 'general-handyman-on-demand-help', 37, 'General Helper|Household Helper|Shop Helper|Farm Helper|Loading Helper|Unloading Helper|Packing Helper|Cleaning Helper|Event Helper|Construction Helper|Moving Helper|Delivery Helper|Warehouse Helper|Market Helper|Office Helper|Temporary Helper|Daily Labour|Emergency General Helper'),
('Emergency Assistance', 'emergency-assistance', 38, 'Emergency General Helper|Emergency Cleaning|Emergency Loading|Emergency Moving|Storm Cleanup|Flood Cleanup|Fallen Tree Cleanup|Emergency Property Cleanup|Emergency Transport Helper|Temporary Site Helper|Emergency Household Assistance'),
('Family Assistance', 'family-assistance', 39, 'Family Care Assistant|Child & Elderly Care Assistant|Household Assistant|Family Errand Assistant|Shopping Assistant|Cooking Assistant|Meal Preparation Assistant|Home Organization Assistant|Family Travel Assistant|School Assistance|Elderly Appointment Assistant|Household Support Assistant|Weekend Family Assistant|Overnight Family Assistant'),
('Cooking & Food Assistance', 'cooking-food-assistance', 40, 'Home Cook|Cooking Assistant|Meal Preparation Assistant|Kitchen Helper|Vegetable Cutting Assistant|Food Preparation Worker|Tiffin Preparation Assistant|Party Cooking Assistant|Event Kitchen Helper|Catering Helper|Serving Assistant|Dishwashing Assistant|Kitchen Cleaning Assistant|Food Packing Assistant|Home Meal Assistant'),
('Handicraft & Home-Based Earning', 'handicraft-home-based-earning', 41, 'Handicraft Worker|Bamboo Craft Worker|Cane Craft Worker|Pottery Worker|Decorative Craft Worker|Gift Packing Worker|Handmade Product Maker|Candle Maker|Decorative Item Maker|Artisan Assistant|Handmade Jewellery Maker|Basket Maker|Traditional Craft Worker|Festival Decoration Maker|Handmade Gift Maker'),
('E-Commerce & Home-Based Work', 'e-commerce-home-based-work', 42, 'Product Packing|Product Labelling|Product Sorting|Product Photography|Product Listing Assistant|Online Store Assistant|Order Processing Assistant|Inventory Assistant|Customer Chat Assistant|E-commerce Data Entry|Catalog Assistant|Marketplace Assistant|Social Commerce Assistant|Handmade Product Seller|Home-Based Product Maker'),
('Professional & Business Freelancing', 'professional-business-freelancing', 43, 'Accountant|Bookkeeping Assistant|GST Assistance|Tax Documentation Assistant|Business Documentation Assistant|Business Plan Assistant|HR Assistant|Recruitment Assistant|Resume Consultant|Career Guidance|Business Consultant|Marketing Consultant|Financial Documentation Assistant|Project Coordinator|Operations Consultant'),
('School & Institutional Support', 'school-institutional-support', 44, 'School Helper|Classroom Assistant|School Cleaning Worker|School Maintenance Worker|Library Assistant|Lab Assistant|Computer Lab Assistant|Office Assistant|School Event Helper|Exam Support Assistant|School Transport Assistant|School Grounds Maintenance|School Gardening Worker'),
('Office & Corporate Support', 'office-corporate-support', 45, 'Office Assistant|Reception Assistant|Data Entry Operator|Document Assistant|Filing Assistant|Office Cleaning|Pantry Assistant|Office Helper|Meeting Setup Assistant|Office Moving Helper|Inventory Assistant|Courier Assistant|Facility Assistant|Event/Conference Assistant|Temporary Office Staff'),
('Hospitality & Guest Assistance', 'hospitality-guest-assistance', 46, 'Hotel Helper|Housekeeping Assistant|Room Cleaning Assistant|Laundry Assistant|Kitchen Helper|Restaurant Helper|Serving Assistant|Dishwashing Assistant|Event Hall Helper|Guest Assistance|Luggage Assistant|Banquet Helper|Reception Assistant|Room Setup Assistant'),
('Pet & Animal Assistance', 'pet-animal-assistance', 47, 'Pet Care Assistant|Pet Walking|Pet Feeding Assistant|Pet Grooming Assistant|Pet Sitting|Pet Cleaning Assistant|Pet Travel Assistant|Animal Shelter Helper|Animal Feeding Worker|Animal Shed Cleaning|Livestock Assistance|Poultry Assistance'),
('Outdoor & Property Maintenance', 'outdoor-property-maintenance', 48, 'Lawn Worker|Garden Worker|Tree Plantation Worker|Tree Maintenance Assistant|Fencing Worker|Compound Cleaning|Terrace Cleaning|Outdoor Cleaning|Drain Cleaning|Property Cleanup|Parking Area Cleaning|Open Land Cleaning|Construction Site Cleanup'),
('Skilled Technical Freelancers', 'skilled-technical-freelancers', 49, 'Welder|Fabricator|Electrician|Plumber|Carpenter|Mason|Painter|AC Technician|Refrigerator Technician|Appliance Technician|Computer Technician|CCTV Technician|Solar Technician|Mechanic|Machine Operator|Electrical Technician|Network Technician|Furniture Technician|Tile Worker|Waterproofing Technician'),
('Earn With Your Time', 'earn-with-your-time', 50, 'General Helper|Household Helper|Shopping Assistant|Errand Assistant|Queue Assistant|Document Pickup Assistant|Document Drop Assistant|Local Delivery Assistant|Loading Assistant|Unloading Assistant|Packing Assistant|Unpacking Assistant|Moving Assistant|Event Helper|Shop Helper|Farm Helper|Warehouse Helper|Market Helper|Office Helper|Cleaning Helper|Gardening Helper|Construction Helper|Festival Helper|Temporary Worker|Daily Labour|Companion Assistant|Home Organization Assistant|Local Task Assistant|Personal Errand Assistant|General On-Demand Helper');

-- 5. Insert missing categories (Existing categories & icons are preserved)
INSERT INTO public.service_categories (name, slug, description, display_order, sort_order)
SELECT c.category_name,
       c.category_slug,
       'Doorbly service category',
       c.category_order,
       c.category_order
FROM _doorbly_master_catalog c
WHERE NOT EXISTS (
  SELECT 1
  FROM public.service_categories sc
  WHERE lower(trim(sc.name)) = lower(trim(c.category_name))
     OR lower(trim(sc.slug)) = lower(trim(c.category_slug))
);

-- Synchronize sort_order and display_order for all categories
UPDATE public.service_categories sc
SET display_order = COALESCE(sc.display_order, sc.sort_order, c.category_order),
    sort_order = COALESCE(sc.sort_order, sc.display_order, c.category_order)
FROM _doorbly_master_catalog c
WHERE lower(trim(sc.slug)) = lower(trim(c.category_slug));

-- 6. Expand, Deduplicate, and Calculate Hourly Rates for all 978 Unique Services
CREATE TEMP TABLE _doorbly_catalog_services ON COMMIT DROP AS
WITH expanded AS (
  SELECT c.category_name,
         c.category_slug,
         c.category_order,
         trim(x.service_name) AS service_name
  FROM _doorbly_master_catalog c
  CROSS JOIN LATERAL regexp_split_to_table(c.services_text, '\|') AS x(service_name)
), dedup AS (
  SELECT DISTINCT ON (lower(category_name), lower(service_name))
         category_name, category_slug, category_order, service_name
  FROM expanded
  WHERE service_name <> ''
  ORDER BY lower(category_name), lower(service_name)
)
SELECT d.category_name,
       d.category_slug,
       d.category_order,
       d.service_name,
       CASE
         WHEN lower(d.service_name) ~ '(accountant|bookkeeping|gst assistance|tax documentation|business documentation|business plan|consultant|career guidance|project coordinator|operations consultant|marketing consultant|financial documentation)' THEN 800
         WHEN lower(d.service_name) ~ '(graphic designer|logo designer|poster designer|banner designer|visiting card|brochure|flyer designer|social media designer|thumbnail|invitation card|wedding card|menu designer|packaging designer|presentation designer|resume designer|photo editor|image retoucher|video editor|reels editor|youtube editor|motion graphics|animation assistant|illustrator|digital artist|photographer|videographer|album designer|reels creator|short video creator|property photography|product photography)' THEN 600
         WHEN lower(d.service_name) ~ '(tutor|teacher|trainer|training|education|home tutor|online tutor|drawing teacher|music teacher|dance teacher|reading tutor|writing tutor|handwriting trainer|study companion|homework assistant|exam preparation)' THEN 400
         WHEN lower(d.service_name) ~ '(beautician|hairdresser|hair stylist|makeup|mehndi|nail technician|grooming|saree draping|beauty assistant|facial|hair care|salon)' THEN 500
         WHEN lower(d.service_name) ~ '(electrician|plumber|carpenter|welder|fabricator|mechanic|mason|painter|ac technician|refrigerator technician|appliance technician|solar technician|network technician|cctv technician|electrical technician|furniture technician|tile worker|waterproofing technician|computer technician|laptop technician|desktop technician|printer technician|bike mechanic|car mechanic|auto mechanic|tractor mechanic|steel worker|welding worker)' THEN 500
         WHEN lower(d.service_name) ~ '(driver|transport|vehicle pickup|vehicle pickup/drop|delivery driver|pickup driver|van driver|tractor driver)' THEN 350
         WHEN lower(d.service_name) ~ '(babysitter|child|baby|infant|newborn|toddler|preschool|after-school|elderly|senior citizen|caregiver|companion|patient attendant|hospital attendant|bedside|mobility assistance|family care)' THEN 300
         WHEN lower(d.service_name) ~ '(farm|agricultur|tractor operator|ploughing|sowing|transplanting|weeding|harvesting|crop|fertilizer|pesticide|irrigation|vegetable farm|fruit farm|flower farm|nursery|greenhouse|organic farming|livestock|dairy|cow care|buffalo|goat care|sheep|poultry|animal shed|milking|fish farm|fish pond|aquaculture|pond maintenance|net handling)' THEN 300
         WHEN lower(d.service_name) ~ '(cleaner|cleaning|housekeeping|laundry|washing|ironing|dusting|waste|recycling|scrap|cleanup|dishwashing|utensil cleaning|shoe cleaning|bag cleaning|curtain washing|blanket cleaning|garden waste|compound cleaning|terrace cleaning|outdoor cleaning)' THEN 300
         WHEN lower(d.service_name) ~ '(watchman|security|gate assistant|parking assistant|visitor assistance)' THEN 300
         WHEN lower(d.service_name) ~ '(helper|labourer|labour|worker|assistant|loading|unloading|packing|unpacking|moving helper|temporary worker|daily wage|daily labour)' THEN 250
         ELSE 350
       END::numeric AS base_hourly_rate,
       CASE
         WHEN lower(d.category_name) = 'security & watch services' THEN true
         WHEN lower(d.service_name) = 'drone photography operator' THEN true
         ELSE false
       END AS verification_required
FROM dedup d;

-- 7. Insert missing services (Generates slug and sets full hourly pricing)
INSERT INTO public.services (
  category_id,
  name,
  slug,
  description,
  customer_price,
  customer_hourly_price,
  agent_payout,
  partner_hourly_rate,
  doorbly_commission,
  commission_percentage,
  is_popular,
  is_active,
  image_url,
  created_at,
  pricing_type,
  pricing_unit,
  base_hourly_rate,
  verification_required
)
SELECT sc.id,
       cs.service_name,
       sc.slug || '--' || lower(regexp_replace(regexp_replace(cs.service_name, '[^a-zA-Z0-9]+', '-', 'g'), '^-|-$', '', 'g')),
       'Professional hourly ' || cs.service_name || ' service in Odisha. Verified provider, transparent pricing.',
       ROUND(cs.base_hourly_rate * 1.20, 2),
       ROUND(cs.base_hourly_rate * 1.20, 2),
       cs.base_hourly_rate,
       cs.base_hourly_rate,
       ROUND(cs.base_hourly_rate * 0.20, 2),
       20.00,
       false,
       true,
       NULL,
       NOW(),
       'hourly',
       'hour',
       cs.base_hourly_rate,
       cs.verification_required
FROM _doorbly_catalog_services cs
JOIN public.service_categories sc
  ON lower(trim(sc.name)) = lower(trim(cs.category_name))
WHERE NOT EXISTS (
  SELECT 1
  FROM public.services s
  WHERE s.category_id = sc.id
    AND lower(trim(s.name)) = lower(trim(cs.service_name))
);

-- 8. Update matching catalog services with requested hourly pricing formula
UPDATE public.services s
SET customer_price = ROUND(cs.base_hourly_rate * 1.20, 2),
    customer_hourly_price = ROUND(cs.base_hourly_rate * 1.20, 2),
    agent_payout = cs.base_hourly_rate,
    partner_hourly_rate = cs.base_hourly_rate,
    doorbly_commission = ROUND(cs.base_hourly_rate * 0.20, 2),
    commission_percentage = 20.00,
    pricing_type = 'hourly',
    pricing_unit = 'hour',
    base_hourly_rate = cs.base_hourly_rate,
    slug = COALESCE(s.slug, sc.slug || '--' || lower(regexp_replace(regexp_replace(cs.service_name, '[^a-zA-Z0-9]+', '-', 'g'), '^-|-$', '', 'g'))),
    verification_required = CASE
      WHEN cs.verification_required THEN true
      ELSE COALESCE(s.verification_required, false)
    END
FROM _doorbly_catalog_services cs
JOIN public.service_categories sc
  ON lower(trim(sc.name)) = lower(trim(cs.category_name))
WHERE s.category_id = sc.id
  AND lower(trim(s.name)) = lower(trim(cs.service_name));

-- 9. Recreate Secure Customer Catalog View
CREATE OR REPLACE VIEW public.customer_services_catalog AS
SELECT
    s.id,
    s.category_id,
    c.name AS category_name,
    c.slug AS category_slug,
    s.name,
    s.slug,
    s.description,
    s.pricing_type,
    s.pricing_unit,
    s.customer_price,
    s.customer_hourly_price,
    s.minimum_hours,
    s.maximum_hours,
    s.image_url,
    s.featured,
    s.is_popular,
    s.verification_required,
    s.is_active,
    s.created_at,
    s.updated_at
FROM public.services s
LEFT JOIN public.service_categories c ON s.category_id = c.id
WHERE s.is_active = true;

-- 10. Validation: expected 50 categories and 978 unique category/service pairs
DO $$
DECLARE
  expected_categories integer := 50;
  expected_services integer := 978;
  actual_categories integer;
  actual_services integer;
  missing_services integer;
BEGIN
  SELECT count(*) INTO actual_categories FROM _doorbly_master_catalog;

  SELECT count(*) INTO actual_services
  FROM _doorbly_catalog_services;

  SELECT count(*) INTO missing_services
  FROM _doorbly_catalog_services cs
  WHERE NOT EXISTS (
    SELECT 1
    FROM public.services s
    JOIN public.service_categories sc ON sc.id = s.category_id
    WHERE lower(trim(sc.name)) = lower(trim(cs.category_name))
      AND lower(trim(s.name)) = lower(trim(cs.service_name))
  );

  IF actual_categories <> expected_categories THEN
    RAISE EXCEPTION 'Catalog category definition count mismatch: expected %, got %', expected_categories, actual_categories;
  END IF;

  IF actual_services <> expected_services THEN
    RAISE EXCEPTION 'Catalog service definition count mismatch: expected %, got %', expected_services, actual_services;
  END IF;

  IF missing_services <> 0 THEN
    RAISE EXCEPTION 'Catalog validation failed: % services are missing after migration', missing_services;
  END IF;

  RAISE NOTICE 'Doorbly catalog migration validated: % categories, % unique services.', actual_categories, actual_services;
END $$;

COMMIT;

-- Optional verification query:
-- SELECT sc.name AS category, s.name AS service, s.customer_price, s.pricing_unit,
--        s.base_hourly_rate, s.agent_payout, s.doorbly_commission, s.verification_required
-- FROM public.services s
-- JOIN public.service_categories sc ON sc.id = s.category_id
-- WHERE s.pricing_type = 'hourly'
-- ORDER BY sc.display_order, s.name;
