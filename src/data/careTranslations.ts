// English and Odia Translations for Baby, Child & Elderly Care

export interface CareTranslation {
  name_en: string;
  name_or: string;
  desc_en: string;
  desc_or: string;
}

export const CARE_CATEGORY_TRANSLATION: CareTranslation = {
  name_en: "Baby, Child & Elderly Care",
  name_or: "ଶିଶୁ, ପିଲା ଓ ବରିଷ୍ଠ ନାଗରିକ ସେବା",
  desc_en: "Hourly non-medical care, companionship and everyday assistance for babies, children and senior citizens.",
  desc_or: "ଶିଶୁ, ପିଲା ଏବଂ ବୟସ୍କ ନାଗରିକମାନଙ୍କ ପାଇଁ ଘଣ୍ଟା ଅନୁସାରେ ଅଣ-ଚିକିତ୍ସା ଯତ୍ନ, ସାହଚର୍ଯ୍ୟ ଏବଂ ଦୈନନ୍ଦିନ ସହାୟତା।"
};

export const CARE_SERVICES_TRANSLATIONS: Record<string, CareTranslation> = {
  // Baby & Child Care (1-35)
  "babysitter-child-caregiver": {
    name_en: "Babysitter / Child Caregiver",
    name_or: "ଶିଶୁ ଯତ୍ନକାରୀ / ବେବିସିଟର୍",
    desc_en: "Hourly supervision, playtime companionship, and everyday child care assistance at home.",
    desc_or: "ଘରେ ପିଲାମାନଙ୍କର ଘଣ୍ଟା ପ୍ରତି ତତ୍ତ୍ୱାବଧାନ, ଖେଳ ସାଥୀ ଏବଂ ଦୈନନ୍ଦିନ ଯତ୍ନ ସହାୟତା।"
  },
  "infant-caregiver": {
    name_en: "Infant Caregiver",
    name_or: "ଛୋଟ ଶିଶୁ ଯତ୍ନକାରୀ",
    desc_en: "Gentle, attentive hourly care and comforting assistance for infants and babies under 1 year.",
    desc_or: "୧ ବର୍ଷରୁ କମ୍ ଶିଶୁଙ୍କ ପାଇଁ ସ୍ନେହପୂର୍ଣ୍ଣ ଏବଂ ସତର୍କ ଘଣ୍ଟା ଅନୁଯାୟୀ ଯତ୍ନ।"
  },
  "newborn-care-assistant": {
    name_en: "Newborn Care Assistant",
    name_or: "ନବଜାତ ଶିଶୁ ଯତ୍ନ ସହାୟକ",
    desc_en: "Specialized non-medical newborn support, swaddling, burping, and mother assistance.",
    desc_or: "ନବଜାତ ଶିଶୁର କୋଳେଇବା, ହାକୁଟି କଢ଼ାଇବା ଏବଂ ମାଆଙ୍କୁ ଦୈନନ୍ଦିନ ସହାୟତା।"
  },
  "toddler-caregiver": {
    name_en: "Toddler Caregiver",
    name_or: "ଟଡଲର / ଚଞ୍ଚଳ ଶିଶୁ ଯତ୍ନକାରୀ",
    desc_en: "Active, watchful hourly care, interactive play, and safe home supervision for toddlers.",
    desc_or: "ଚାଲି ଶିଖୁଥିବା ପିଲାଙ୍କ ପାଇଁ ସୁରକ୍ଷିତ ତତ୍ତ୍ୱାବଧାନ ଓ ସକ୍ରିୟ ଖେଳାଖେଳି।"
  },
  "preschool-child-caregiver": {
    name_en: "Preschool Child Caregiver",
    name_or: "ପ୍ରାକ୍-ବିଦ୍ୟାଳୟ ଶିଶୁ ଯତ୍ନକାରୀ",
    desc_en: "Nurturing care, learning games, and basic routine guidance for preschool-age children.",
    desc_or: "ପ୍ରାକ୍-ସ୍କୁଲ୍ ପିଲାଙ୍କ ପାଇଁ ଶିକ୍ଷଣୀୟ ଖେଳ ଏବଂ ଶୃଙ୍ଖଳିତ ଦୈନନ୍ଦିନ ଅଭ୍ୟାସ ସହାୟତା।"
  },
  "after-school-child-caregiver": {
    name_en: "After-School Child Caregiver",
    name_or: "ସ୍କୁଲ୍ ପରବର୍ତ୍ତୀ ଶିଶୁ ଯତ୍ନକାରୀ",
    desc_en: "Reliable afternoon supervision, snack serving, and safe home companion after school.",
    desc_or: "ସ୍କୁଲ୍ ଫେରିବା ପରେ ଘରେ ସୁରକ୍ଷିତ ସାଙ୍ଗ, ଜଳଖିଆ ଖୁଆଇବା ଏବଂ ତଦାରଖ।"
  },
  "child-supervision-assistant": {
    name_en: "Child Supervision Assistant",
    name_or: "ଶିଶୁ ସୁରକ୍ଷା ଓ ତତ୍ତ୍ୱାବଧାନ ସହାୟକ",
    desc_en: "Dedicated home safety supervision, engagement, and watchful presence while parents are busy.",
    desc_or: "ଅଭିଭାବକ ବ୍ୟସ୍ତ ଥିବା ସମୟରେ ଘରେ ନିଷ୍ଠାପର ନିରାପତ୍ତା ଓ ଯତ୍ନ।"
  },
  "baby-feeding-assistant": {
    name_en: "Baby Feeding Assistant",
    name_or: "ଶିଶୁ ଖାଦ୍ୟ ଖୁଆଇବା ସହାୟକ",
    desc_en: "Bottle preparation, paced feeding, burping, and clean-up assistance for babies.",
    desc_or: "ବୋତଲ ପ୍ରସ୍ତୁତି, ସମୟାନୁସାରେ କ୍ଷୀର/ଖାଦ୍ୟ ଖୁଆଇବା ଏବଂ ସଫାସୁତୁରା।"
  },
  "child-feeding-assistant": {
    name_en: "Child Feeding Assistant",
    name_or: "ପିଲାଙ୍କ ଖାଦ୍ୟ ସହାୟକ",
    desc_en: "Patient mealtime support, encouraging nutritious eating, and meal cleanup for young children.",
    desc_or: "ଧୈର୍ଯ୍ୟର ସହିତ ପୁଷ୍ଟିକର ଖାଦ୍ୟ ଖୁଆଇବା ଏବଂ ଖାଇବା ଥାଳି ସଫେଇ।"
  },
  "baby-bathing-assistant": {
    name_en: "Baby Bathing Assistant",
    name_or: "ଶିଶୁ ଗାଧୁଆ ସହାୟକ",
    desc_en: "Gentle lukewarm bathing, towel drying, moisturizing, and delicate skin care support.",
    desc_or: "ଉଷୁମ ପାଣିରେ କୋମଳ ଗାଧୁଆ, ତେଲ ମାଲିସ୍ ଓ କୋମଳ ଚର୍ମ ଯତ୍ନ।"
  },
  "baby-dressing-assistant": {
    name_en: "Baby Dressing Assistant",
    name_or: "ଶିଶୁ ପୋଷାକ ପିନ୍ଧାଇବା ସହାୟକ",
    desc_en: "Assistance with comfortable dressing, seasonal clothes changing, and grooming for infants.",
    desc_or: "ଋତୁ ଅନୁସାରେ ଆରାମଦାୟକ ପୋଷାକ ପରିଧାନ ଏବଂ ସଫାସୁତୁରା।"
  },
  "diaper-changing-assistant": {
    name_en: "Diaper Changing Assistant",
    name_or: "ଡାଏପର ବଦଳାଇବା ସହାୟକ",
    desc_en: "Hygienic diaper changing, barrier cream application, and sanitized diaper disposal.",
    desc_or: "ପରିଷ୍କାର ଭାବେ ଡାଏପର ବଦଳାଇବା, କ୍ରିମ୍ ଲଗାଇବା ଓ ସୁରକ୍ଷିତ ଫୋପାଡ଼ିବା।"
  },
  "baby-sleep-bedtime-assistant": {
    name_en: "Baby Sleep/Bedtime Assistant",
    name_or: "ଶିଶୁ ଶୋଇବା / ଶୋଇବା ସମୟ ସହାୟକ",
    desc_en: "Soothing bedtime routines, rocking, lullabies, and safe sleep environment supervision.",
    desc_or: "ଲୋରି ଗାଇ ଶୁଆଇବା, ଦୋଳାଇବା ଏବଂ ଶାନ୍ତିପୂର୍ଣ୍ଣ ନିଦ ପାଇଁ ପରିବେଶ।"
  },
  "child-play-companion": {
    name_en: "Child Play Companion",
    name_or: "ଶିଶୁ ଖେଳ ସାଥୀ",
    desc_en: "Engaging indoor and outdoor developmental games, building blocks, and playful bonding.",
    desc_or: "ଘରେ ଏବଂ ବାହାରେ ବିକାଶମୂଳକ ଖେଳ, ବ୍ଲକ ଖେଳ ଏବଂ ଆନନ୍ଦଦାୟକ ସାଥୀ।"
  },
  "indoor-activity-assistant": {
    name_en: "Indoor Activity Assistant",
    name_or: "ଘରୋଇ କ୍ରିୟାକଳାପ ସହାୟକ",
    desc_en: "Creative board games, puzzles, screen-free engagement, and interactive indoor play.",
    desc_or: "ମୋବାଇଲ୍/ସ୍କ୍ରିନ୍ ମୁକ୍ତ ଇଣ୍ଡୋର ଖେଳ, ପଜଲ୍ ଓ ବୋର୍ଡ ଗେମ୍ ସହାୟତା।"
  },
  "outdoor-activity-companion": {
    name_en: "Outdoor Activity Companion",
    name_or: "ବାହାର ଖେଳ ସାଥୀ",
    desc_en: "Supervised outdoor play in park or yard, cycling safety, and energetic physical games.",
    desc_or: "ପାର୍କରେ ବୁଲାଇବା, ସାଇକେଲ୍ ଚଲାଇବା ବେଳେ ନିରାପତ୍ତା ଓ ବାହାର ଖେଳ।"
  },
  "child-homework-assistant": {
    name_en: "Child Homework Assistant",
    name_or: "ଶିଶୁ ହୋମୱାର୍କ ସହାୟକ",
    desc_en: "Help with daily school homework assignments, reading practice, and writing guidance.",
    desc_or: "ଦୈନନ୍ଦିନ ବିଦ୍ୟାଳୟ ହୋମୱାର୍କ, ପାଠପଢ଼ା ଏବଂ ହସ୍ତାକ୍ଷର ଅଭ୍ୟାସ ସହାୟତା।"
  },
  "child-study-companion": {
    name_en: "Child Study Companion",
    name_or: "ଶିଶୁ ଅଧ୍ୟୟନ ସାଥୀ",
    desc_en: "Focused study support, textbook revision, and maintaining good study habits at home.",
    desc_or: "ନିୟମିତ ଅଧ୍ୟୟନ ଅଭ୍ୟାସ, ପାଠ୍ୟପୁସ୍ତକ ପୁନରାବୃତ୍ତି ଏବଂ ମନୋଯୋଗ ସହାୟତା।"
  },
  "storytelling-reading-assistant": {
    name_en: "Storytelling & Reading Assistant",
    name_or: "ଗଳ୍ପ କହିବା ଓ ପଠନ ସହାୟକ",
    desc_en: "Expressive story reading in English, Odia, or Hindi, fostering imagination and vocabulary.",
    desc_or: "ଓଡ଼ିଆ, ଇଂରାଜୀ ବା ହିନ୍ଦୀରେ ଆନନ୍ଦଦାୟକ ଗପ କହିବା ଏବଂ ବହି ପଢ଼ି ଶୁଣାଇବା।"
  },
  "drawing-craft-activity-assistant": {
    name_en: "Drawing & Craft Activity Assistant",
    name_or: "ଚିତ୍ରାଙ୍କନ ଓ ହସ୍ତଶିଳ୍ପ ସହାୟକ",
    desc_en: "Coloring, sketching, paper craft, origami, and creative art sessions for children.",
    desc_or: "ରଙ୍ଗ ଦେବା, କାଗଜ କଳା (ଓରିଗାମି) ଏବଂ ସୃଜନଶୀଳ ଶିଳ୍ପ କାର୍ଯ୍ୟକଳାପ।"
  },
  "school-preparation-assistant": {
    name_en: "School Preparation Assistant",
    name_or: "ସ୍କୁଲ୍ ପ୍ରସ୍ତୁତି ସହାୟକ",
    desc_en: "Morning school bag packing, uniform assistance, shoes, and cheerful morning routine help.",
    desc_or: "ସକାଳେ ୟୁନିଫର୍ମ, ବ୍ୟାଗ୍ ସଜାଡ଼ିବା ଓ ଖୁସିମନରେ ସ୍କୁଲ୍ ଯିବା ପ୍ରସ୍ତୁତି।"
  },
  "school-pickup-drop-assistant": {
    name_en: "School Pickup/Drop Assistant",
    name_or: "ସ୍କୁଲ୍ ପିକଅପ୍ ଓ ଡ୍ରପ୍ ସହାୟକ",
    desc_en: "Safe doorstep walking or transit companion to and from school bus stops or nearby schools.",
    desc_or: "ସ୍କୁଲ୍ ବସ୍ ଷ୍ଟପ୍ ବା ସ୍କୁଲରୁ ପିଲାଙ୍କୁ ସୁରକ୍ଷିତ ଆଣିବା ଓ ଛାଡ଼ିବା ସହାୟତା।"
  },
  "child-meal-preparation-assistant": {
    name_en: "Child Meal Preparation Assistant",
    name_or: "ଶିଶୁ ଖାଦ୍ୟ ପ୍ରସ୍ତୁତି ସହାୟକ",
    desc_en: "Preparing kid-friendly healthy meals, snacks, fruit bowls, and gentle kitchen hygiene.",
    desc_or: "ପିଲାଙ୍କ ଉପଯୋଗୀ ପୁଷ୍ଟିକର ସ୍ୱାସ୍ଥ୍ୟପ୍ରଦ ଖାଦ୍ୟ, ସ୍ନାକ୍ସ ଓ ଫଳ ପ୍ରସ୍ତୁତି।"
  },
  "baby-food-preparation-assistant": {
    name_en: "Baby Food Preparation Assistant",
    name_or: "ନରମ ଶିଶୁ ଖାଦ୍ୟ ପ୍ରସ୍ତୁତି ସହାୟକ",
    desc_en: "Sterilizing utensils, preparing purees, porridge, khichdi, and fresh wholesome baby food.",
    desc_or: "ଖେଚୁଡ଼ି, ସୁଜି, ଫଳ ପ୍ୟୁରି ପ୍ରସ୍ତୁତ କରିବା ଏବଂ ବାସନ ଜୀବାଣୁମୁକ୍ତ କରିବା।"
  },
  "child-clothing-laundry-assistant": {
    name_en: "Child Clothing/Laundry Assistant",
    name_or: "ପିଲାଙ୍କ ପୋଷାକ ସଫେଇ ସହାୟକ",
    desc_en: "Gentle washing, baby-safe detergent rinse, drying, ironing, and neatly folding children's clothes.",
    desc_or: "ଶିଶୁ ପୋଷାକ ଧୋଇବା, ଶୁଖାଇବା, ଇସ୍ତ୍ରୀ କରିବା ଏବଂ ସଜାଡ଼ି ରଖିବା।"
  },
  "baby-room-organization-assistant": {
    name_en: "Baby Room Organization Assistant",
    name_or: "ଶିଶୁ ରୁମ୍ ସଂଗଠନ ସହାୟକ",
    desc_en: "Sanitizing toys, organizing nursery cribs, wardrobe sorting, and neat playroom upkeep.",
    desc_or: "ଖେଳନା ସଫା କରିବା, ଖଟ ସଜାଡ଼ିବା ଏବଂ ଶିଶୁ କୋଠରୀ ସଫେଇ।"
  },
  "day-care-helper": {
    name_en: "Day Care Helper",
    name_or: "ଦିବା ଯତ୍ନ ସହାୟକ",
    desc_en: "Full daytime child care assistance, routine monitoring, feeding, and afternoon naps.",
    desc_or: "ଦିନସାରା ଘରେ ଶିଶୁ ଯତ୍ନ, ଖାଇବା ଓ ଶୋଇବା କାର୍ଯ୍ୟର ସମ୍ପୂର୍ଣ୍ଣ ଦାୟିତ୍ୱ।"
  },
  "day-care-attendant": {
    name_en: "Day Care Attendant",
    name_or: "ଦିବା ଯତ୍ନ ଆଟେଣ୍ଡାଣ୍ଟ",
    desc_en: "Hourly home attendant for ongoing child vigilance, light snack preparation, and care.",
    desc_or: "ଘଣ୍ଟା ହିସାବରେ ପିଲାଙ୍କ ତଦାରଖ ଓ ସାମଗ୍ରିକ ସୁରକ୍ଷା।"
  },
  "evening-babysitter": {
    name_en: "Evening Babysitter",
    name_or: "ସନ୍ଧ୍ୟାକାଳୀନ ବେବିସିଟର୍",
    desc_en: "Evening babysitting, dinner companionship, calming play, and bedtime supervision.",
    desc_or: "ସନ୍ଧ୍ୟା ସମୟରେ ପିଲାଙ୍କ ଯତ୍ନ, ରାତ୍ରିଭୋଜନ ସହାୟତା ଏବଂ ଶୋଇବା ପୂର୍ବର ଯତ୍ନ।"
  },
  "night-child-care-assistant": {
    name_en: "Night Child Care Assistant",
    name_or: "ରାତ୍ରିକାଳୀନ ଶିଶୁ ଯତ୍ନ ସହାୟକ",
    desc_en: "Overnight alert child supervision, night feeding assistance, and peaceful sleep support.",
    desc_or: "ରାତିରେ ଶିଶୁର ନିଦ୍ରା ସୁରକ୍ଷା, ଉଠିଲେ କ୍ଷୀର ଖୁଆଇବା ଓ ଶାନ୍ତ ରଖିବା।"
  },
  "emergency-child-care-assistant": {
    name_en: "Emergency Child Care Assistant",
    name_or: "ଜରୁରୀକାଳୀନ ଶିଶୁ ଯତ୍ନ ସହାୟକ",
    desc_en: "Rapid on-demand dispatch for urgent, short-notice child care and immediate family support.",
    desc_or: "ଜରୁରୀ ପରିସ୍ଥିତିରେ ତୁରନ୍ତ ପହଞ୍ଚି ଶିଶୁର ଦାୟିତ୍ୱ ନେବା ସହାୟତା।"
  },
  "multiple-child-caregiver": {
    name_en: "Multiple-Child Caregiver",
    name_or: "ଏକାଧିକ ଶିଶୁ ଯତ୍ନକାରୀ",
    desc_en: "Experienced supervision and simultaneous care for two or more siblings at home.",
    desc_or: "ଦୁଇ କିମ୍ବା ଅଧିକ ପିଲାଙ୍କର ଏକାସାଙ୍ଗରେ ଦକ୍ଷ ତତ୍ତ୍ୱାବଧାନ ଓ ଯତ୍ନ।"
  },
  "twin-baby-care-assistant": {
    name_en: "Twin Baby Care Assistant",
    name_or: "ଯାଆଁଳା ଶିଶୁ ଯତ୍ନ ସହାୟକ",
    desc_en: "Dedicated support for twins, coordinated feeding schedules, diapering, and soothing.",
    desc_or: "ଯମଜ ଶିଶୁଙ୍କ ପାଇଁ ସମନ୍ୱିତ ଖାଦ୍ୟ, ଡାଏପର ଓ ଶୁଆଇବା ସହାୟତା।"
  },
  "child-event-caregiver": {
    name_en: "Child Event Caregiver",
    name_or: "ଉତ୍ସବ ଶିଶୁ ଯତ୍ନକାରୀ",
    desc_en: "Supervising and keeping kids entertained and safe during family functions, weddings, or parties.",
    desc_or: "ବିବାହ, ପାର୍ଟି ବା ପାରିବାରିକ ଉତ୍ସବରେ ପିଲାଙ୍କୁ ସୁରକ୍ଷିତ ଓ ଆନନ୍ଦିତ ରଖିବା।"
  },
  "child-travel-companion": {
    name_en: "Child Travel Companion",
    name_or: "ଶିଶୁ ଯାତ୍ରା ସାଥୀ",
    desc_en: "Accompanying family trips, airport or railway station child assistance, and travel safety.",
    desc_or: "ରେଳ ଷ୍ଟେସନ, ବିମାନବନ୍ଦର ବା ଯାତ୍ରା ସମୟରେ ପିଲାଙ୍କ ଦାୟିତ୍ୱ ଓ ସହାୟତା।"
  },

  // Elderly / Senior Citizen Care (36-70)
  "elderly-care-assistant": {
    name_en: "Elderly Care Assistant",
    name_or: "ବରିଷ୍ଠ ନାଗରିକ ଯତ୍ନ ସହାୟକ",
    desc_en: "Comprehensive non-medical senior care, daily routine support, and caring home assistance.",
    desc_or: "ବରିଷ୍ଠ ନାଗରିକଙ୍କ ପାଇଁ ସମ୍ପୂର୍ଣ୍ଣ ଘରୋଇ ସେବା, ଦୈନନ୍ଦିନ ନିୟମ ଓ ସ୍ନେହପୂର୍ଣ୍ଣ ଯତ୍ନ।"
  },
  "senior-citizen-companion": {
    name_en: "Senior Citizen Companion",
    name_or: "ବରିଷ୍ଠ ନାଗରିକ ସାଥୀ",
    desc_en: "Warm companionship, reading the newspaper, pleasant conversations, and emotional wellness.",
    desc_or: "ଖବରକାଗଜ ପଢ଼ି ଶୁଣାଇବା, ମନଖୋଲା କଥାବାର୍ତ୍ତା ଓ ମାନସିକ ଶାନ୍ତି।"
  },
  "elderly-home-assistance": {
    name_en: "Elderly Home Assistance",
    name_or: "ବରିଷ୍ଠ ଘରୋଇ ସହାୟତା",
    desc_en: "Day-to-day domestic support, fetch-and-carry assistance, and helping seniors navigate the home.",
    desc_or: "ଘରେ ଜିନିଷ ଆଣିଦେବା, ଚଲାବୁଲାରେ ସାହାଯ୍ୟ କରିବା ଓ ଘରୋଇ ସହଯୋଗ।"
  },
  "elderly-meal-assistance": {
    name_en: "Elderly Meal Assistance",
    name_or: "ବରିଷ୍ଠ ଖାଦ୍ୟ ପରଷିବା ସହାୟତା",
    desc_en: "Serving warm meals, cutting food, ensuring proper hydration, and comfortable dining support.",
    desc_or: "ଉଷୁମ ଖାଦ୍ୟ ପରଷିବା, ପାଣି ଦେବା ଏବଂ ସୁବିଧାରେ ଖାଇବା ସହାୟତା।"
  },
  "elderly-feeding-assistant": {
    name_en: "Elderly Feeding Assistant",
    name_or: "ବରିଷ୍ଠ ଖାଦ୍ୟ ଖୁଆଇବା ସହାୟକ",
    desc_en: "Patient, dignified spoon-feeding assistance and beverage intake support for seniors.",
    desc_or: "ଧୈର୍ଯ୍ୟ ଓ ସମ୍ମାନର ସହ ଚାମଚରେ ଖୁଆଇବା ଏବଂ ପାନୀୟ ଦେବା।"
  },
  "elderly-walking-companion": {
    name_en: "Elderly Walking Companion",
    name_or: "ବରିଷ୍ଠ ପ୍ରାତଃ/ସନ୍ଧ୍ୟା ଭ୍ରମଣ ସାଥୀ",
    desc_en: "Assisted morning and evening walks in neighborhood parks or verandas with steady arm support.",
    desc_or: "ହାତ ଧରି ସୁରକ୍ଷିତ ଭାବେ ପାର୍କ କିମ୍ବା ବାରଣ୍ଡାରେ ବୁଲାଇବା।"
  },
  "elderly-mobility-assistant": {
    name_en: "Elderly Mobility Assistant",
    name_or: "ବରିଷ୍ଠ ଚଳପ୍ରଚଳ ସହାୟକ",
    desc_en: "Assisting with walking stick, walker, wheelchair navigation, and steady balance support.",
    desc_or: "ବାଡ଼ି, ୱାକର୍ କିମ୍ବା ହ୍ୱିଲଚେୟାର୍ ଚଳାଇବାରେ ନିରାପଦ ସହାୟତା।"
  },
  "elderly-bathing-assistance": {
    name_en: "Elderly Bathing Assistance",
    name_or: "ବରିଷ୍ଠ ସ୍ନାନ ସହାୟତା",
    desc_en: "Safe, slip-free sponge or bathroom bathing assistance with dignity and warm water care.",
    desc_or: "ଗୋପନୀୟତା ରକ୍ଷା କରି ଉଷୁମ ପାଣିରେ ନିରାପଦ ସ୍ପଞ୍ଜ ବା ଗାଧୁଆ ସହାୟତା।"
  },
  "elderly-dressing-assistance": {
    name_en: "Elderly Dressing Assistance",
    name_or: "ବରିଷ୍ଠ ପୋଷାକ ପରିଧାନ ସହାୟତା",
    desc_en: "Helping seniors button clothes, wear comfortable slippers, socks, and daily garments.",
    desc_or: "ବୋତାମ ଲଗାଇବା, ଜୋତା-ମୋଜା ପିନ୍ଧାଇବା ଓ ସୁବିଧାଜନକ ପୋଷାକ ପରିଧାନ।"
  },
  "elderly-grooming-assistant": {
    name_en: "Elderly Grooming Assistant",
    name_or: "ବରିଷ୍ଠ ପ୍ରସାଧନ ଓ ଶୃଙ୍ଗାର ସହାୟକ",
    desc_en: "Hair combing, gentle face washing, nail trimming, skin lotion, and tidy personal grooming.",
    desc_or: "ମୁଣ୍ଡ କୁଣ୍ଡାଇବା, ନଖ କାଟିବା, ତେଲ/ଲୋସନ୍ ଲଗାଇବା ଓ ପରିଷ୍କାର ରଖିବା।"
  },
  "elderly-toileting-assistance": {
    name_en: "Elderly Toileting Assistance",
    name_or: "ବରିଷ୍ଠ ଶୌଚାଳୟ ସହାୟତା",
    desc_en: "Dignified assistance with commode, bathroom transfers, hygiene cleanup, and adult diapers.",
    desc_or: "ଶୌଚାଳୟକୁ ନେବା, ସଫା କରିବା ଓ ଆଡଲ୍ଟ ଡାଏପର ବ୍ୟବହାରରେ ସମ୍ମାନଜନକ ସେବା।"
  },
  "elderly-bedside-assistant": {
    name_en: "Elderly Bedside Assistant",
    name_or: "ବରିଷ୍ଠ ଶଯ୍ୟାପାଶ୍ୱର୍ ସହାୟକ",
    desc_en: "Attentive bedside companionship, prompt call response, water serving, and comfort checks.",
    desc_or: "ଖଟ ପାଖରେ ରହି ଡାକିବା ମାତ୍ରେ ପାଣି, ଔଷଧ ଓ ଆବଶ୍ୟକ ସେବା ପ୍ରଦାନ।"
  },
  "elderly-bed-transfer-assistant": {
    name_en: "Elderly Bed Transfer Assistant",
    name_or: "ବରିଷ୍ଠ ଉଠାବସା ଓ ସ୍ଥାନାନ୍ତର ସହାୟକ",
    desc_en: "Safe, ergonomic physical assistance moving between bed, wheelchair, recliner, and sofa.",
    desc_or: "ଖଟରୁ ହ୍ୱିଲଚେୟାର କିମ୍ବା ଚୌକିକୁ ନିରାପଦରେ ସ୍ଥାନାନ୍ତର କରିବା।"
  },
  "elderly-exercise-companion": {
    name_en: "Elderly Exercise Companion",
    name_or: "ବରିଷ୍ଠ ବ୍ୟାୟାମ ସାଥୀ",
    desc_en: "Supervised gentle stretches, prescribed physiotherapy movement prompts, and light yoga.",
    desc_or: "ହାଲୁକା ବ୍ୟାୟାମ, ଫିଜିଓଥେରାପି ଅଭ୍ୟାସ ଓ ପ୍ରାଣାୟାମରେ ସହାୟତା।"
  },
  "elderly-reading-companion": {
    name_en: "Elderly Reading Companion",
    name_or: "ବରିଷ୍ଠ ପଠନ ସାଥୀ",
    desc_en: "Reading daily Odia, English, or Hindi newspapers, magazines, novels, and religious texts aloud.",
    desc_or: "ଓଡ଼ିଆ ଖବରକାଗଜ, ଭାଗବତ, ଗୀତା କିମ୍ବା ପୁସ୍ତକ ପଢ଼ି ଶୁଣାଇବା।"
  },
  "elderly-conversation-companion": {
    name_en: "Elderly Conversation Companion",
    name_or: "ବରିଷ୍ଠ କଥାବାର୍ତ୍ତା ସାଥୀ",
    desc_en: "Engaging discussions about life stories, culture, news, and empathetic, listening presence.",
    desc_or: "ଅତୀତର ସ୍ମୃତି, ଧର୍ମ, ସଂସ୍କୃତି ବିଷୟରେ ଶ୍ରଦ୍ଧାର ସହ କଥାବାର୍ତ୍ତା କରିବା।"
  },
  "elderly-entertainment-companion": {
    name_en: "Elderly Entertainment Companion",
    name_or: "ବରିଷ୍ଠ ମନୋରଞ୍ଜନ ସାଥୀ",
    desc_en: "Playing cards, carrom, chess, listening to bhajans, or watching favorite classic shows together.",
    desc_or: "ଭଜନ ଶୁଣିବା, କ୍ୟାରମ୍, ତାସ୍ ଖେଳିବା ଓ ଟିଭି କାର୍ଯ୍ୟକ୍ରମ ସାଙ୍ଗ ହୋଇ ଦେଖିବା।"
  },
  "elderly-shopping-assistant": {
    name_en: "Elderly Shopping Assistant",
    name_or: "ବରିଷ୍ଠ ବଜାର ସହାୟକ",
    desc_en: "Accompanying seniors to local markets, grocery stores, or carrying shopping bags safely.",
    desc_or: "ଦୋକାନ ବଜାର ଯିବା ବେଳେ ସାଙ୍ଗରେ ରହିବା ଓ ବ୍ୟାଗ୍ ଧରିବା।"
  },
  "elderly-errand-assistant": {
    name_en: "Elderly Errand Assistant",
    name_or: "ବରିଷ୍ଠ ଛୋଟମୋଟ କାର୍ଯ୍ୟ ସହାୟକ",
    desc_en: "Running neighborhood errands, collecting bills, picking up laundry, or banking accompaniment.",
    desc_or: "ବିଲ୍ ଦେବା, ଔଷଧ ଆଣିବା କିମ୍ବା ବ୍ୟାଙ୍କ୍ କାମରେ ସାଥୀ ହେବା।"
  },
  "elderly-appointment-companion": {
    name_en: "Elderly Appointment Companion",
    name_or: "ବରିଷ୍ଠ ଡାକ୍ତର ସାକ୍ଷାତ ସାଥୀ",
    desc_en: "Accompanying seniors to doctor appointments, clinics, diagnostic centers, and eye checkups.",
    desc_or: "ଡାକ୍ତରଖାନା, କ୍ଲିନିକ୍ କିମ୍ବା ଟେଷ୍ଟ୍ ସେଣ୍ଟରକୁ ନିରାପଦରେ ନେଇଯିବା।"
  },
  "elderly-hospital-visit-companion": {
    name_en: "Elderly Hospital Visit Companion",
    name_or: "ବରିଷ୍ଠ ହସ୍ପିଟାଲ୍ ଭିଜିଟ୍ ସାଥୀ",
    desc_en: "Hospital visit support, queue waiting, wheelchair assistance, and holding medical reports.",
    desc_or: "ହସ୍ପିଟାଲରେ ଧାଡ଼ିରେ ଛିଡ଼ା ହେବା, ରିପୋର୍ଟ ଧରିବା ଓ ଚେୟାର ସହାୟତା।"
  },
  "elderly-medication-reminder-assistant": {
    name_en: "Elderly Medication Reminder Assistant",
    name_or: "ବରିଷ୍ଠ ଔଷଧ ସମୟ ସୂଚକ ସହାୟକ",
    desc_en: "Timely reminders for prescribed medicines, glass of water assistance, and keeping medicine log.",
    desc_or: "ସମୟ ଅନୁସାରେ ଡାକ୍ତରୀ ଔଷଧ ମନେ ପକାଇବା ଓ ପାଣି ଦେବା।"
  },
  "elderly-meal-preparation-assistant": {
    name_en: "Elderly Meal Preparation Assistant",
    name_or: "ବରିଷ୍ଠ ଉପଯୋଗୀ ଖାଦ୍ୟ ପ୍ରସ୍ତୁତି ସହାୟକ",
    desc_en: "Preparing soft, low-oil, diabetic-friendly, or doctor-recommended home-cooked meals.",
    desc_or: "କମ୍ ତେଲ-ମସଲା, ନରମ ଓ ମଧୁମେହ ଉପଯୋଗୀ ଘରୋଇ ଖାଦ୍ୟ ରନ୍ଧନ।"
  },
  "elderly-household-assistance": {
    name_en: "Elderly Household Assistance",
    name_or: "ବରିଷ୍ଠ ଗୃହ ପରିଚାଳନା ସହାୟତା",
    desc_en: "Light housekeeping, tidying living room, bed making, and ensuring clean, hazard-free walkways.",
    desc_or: "ଘର ପରିଷ୍କାର ରଖିବା ଯେପରି ଗୋଡ଼ ଖସି ନଯାଏ, ବିଛଣା ସଜାଡ଼ିବା।"
  },
  "elderly-room-organization-assistant": {
    name_en: "Elderly Room Organization Assistant",
    name_or: "ବରିଷ୍ଠ କୋଠରୀ ସଜାଡ଼ିବା ସହାୟକ",
    desc_en: "Organizing bedside table, medicine shelves, wardrobe, and keeping essentials easily accessible.",
    desc_or: "ଔଷଧ ବାକ୍ସ, ଚଷମା ଓ ଆବଶ୍ୟକ ଜିନିଷ ସୁବିଧାରେ ମିଳିବା ପରି ସଜାଇବା।"
  },
  "elderly-laundry-assistance": {
    name_en: "Elderly Laundry Assistance",
    name_or: "ବରିଷ୍ଠ ଲୁଗାପଟା ସଫେଇ ସହାୟତା",
    desc_en: "Washing, sun-drying, ironing, and neatly storing senior citizens' clothes and bed linens.",
    desc_or: "ବୟସ୍କଙ୍କ ପୋଷାକ ଓ ଚାଦର ସଫା କରି ଖରାରେ ଶୁଖାଇ ସଜାଇବା।"
  },
  "elderly-day-companion": {
    name_en: "Elderly Day Companion",
    name_or: "ବରିଷ୍ଠ ଦିବା ସାଥୀ",
    desc_en: "Full day companionship, routine supervision, lunchtime company, and peaceful afternoon support.",
    desc_or: "ଦିନସାରା ଘରେ ବୟସ୍କଙ୍କ ସହ ରହି ଦେଖାଶୁଣା ଓ ସାଥୀ ହେବା।"
  },
  "elderly-evening-companion": {
    name_en: "Elderly Evening Companion",
    name_or: "ବରିଷ୍ଠ ସନ୍ଧ୍ୟା ସାଥୀ",
    desc_en: "Evening tea, veranda relaxation, spiritual discourses, and dinner accompaniment.",
    desc_or: "ସନ୍ଧ୍ୟା ଚାହା, ବାରଣ୍ଡାରେ ବସିବା, ଆଧ୍ୟାତ୍ମିକ ଚର୍ଚ୍ଚା ଓ ରାତ୍ରିଭୋଜନ ସାଥୀ।"
  },
  "elderly-night-assistant": {
    name_en: "Elderly Night Assistant",
    name_or: "ବରିଷ୍ଠ ରାତ୍ରି ସହାୟକ",
    desc_en: "Overnight alert support, nocturnal bathroom accompaniment, and soothing emergency readiness.",
    desc_or: "ରାତିରେ ଶୌଚାଳୟ ଯିବା ବେଳେ ଧରିବା ଓ କୌଣସି ଜରୁରୀ ପାଇଁ ଜାଗ୍ରତ ରହିବା।"
  },
  "elderly-emergency-assistance": {
    name_en: "Elderly Emergency Assistance",
    name_or: "ବରିଷ୍ଠ ଜରୁରୀକାଳୀନ ସହାୟତା",
    desc_en: "Rapid-response hourly helper for sudden senior care assistance and home emergencies.",
    desc_or: "ହଠାତ୍ ଅସୁସ୍ଥତା ବା ଜରୁରୀ ସମୟରେ ତୁରନ୍ତ ଘରୋଇ ସହାୟତା।"
  },
  "senior-citizen-travel-companion": {
    name_en: "Senior Citizen Travel Companion",
    name_or: "ବରିଷ୍ଠ ନାଗରିକ ଯାତ୍ରା ସାଥୀ",
    desc_en: "Station or airport escort, luggage assistance, ticketing queue help, and traveling peace of mind.",
    desc_or: "ରେଳବାଇ, ବିମାନ କିମ୍ବା ବସ୍ ଯାତ୍ରାରେ ଲଗେଜ୍ ଧରିବା ଓ ସମ୍ପୂର୍ଣ୍ଣ ସହାୟତା।"
  },
  "senior-citizen-outdoor-companion": {
    name_en: "Senior Citizen Outdoor Companion",
    name_or: "ବରିଷ୍ଠ ନାଗରିକ ବାହାର ସାଥୀ",
    desc_en: "Supervised visits to parks, community halls, relative visits, and fresh air strolls.",
    desc_or: "ପାର୍କ, ସମ୍ପର୍କୀୟଙ୍କ ଘର କିମ୍ବା ସମାଜ ମଙ୍ଗଳ କାର୍ଯ୍ୟକ୍ରମକୁ ନେଇଯିବା।"
  },
  "senior-citizen-religious-visit-companion": {
    name_en: "Senior Citizen Religious Visit Companion",
    name_or: "ବରିଷ୍ଠ ତୀର୍ଥ ଓ ମନ୍ଦିର ଦର୍ଶନ ସାଥୀ",
    desc_en: "Escorting to temples, shrines, religious discourses, puja pandals, and sacred gatherings in Odisha.",
    desc_or: "ମନ୍ଦିର, ପ୍ରବଚନ, ମଠ କିମ୍ବା ପୂଜା ପଣ୍ଡାଲ୍ ଦର୍ଶନରେ ଶ୍ରଦ୍ଧାର ସହ ସାଥୀ ହେବା।"
  },
  "senior-citizen-market-companion": {
    name_en: "Senior Citizen Market Companion",
    name_or: "ବରିଷ୍ଠ ହାଟ-ବଜାର ସାଥୀ",
    desc_en: "Accompanying to vegetable and fish markets, bargaining assistance, and carrying heavy bags.",
    desc_or: "ପନିପରିବା ହାଟ କିମ୍ବା ବଜାରରେ ସାଙ୍ଗରେ ଯାଇ ଭାରୀ ବ୍ୟାଗ୍ ବୋହିବା।"
  },
  "senior-citizen-social-companion": {
    name_en: "Senior Citizen Social Companion",
    name_or: "ବରିଷ୍ଠ ସାମାଜିକ ଉତ୍ସବ ସାଥୀ",
    desc_en: "Accompanying to weddings, family feasts, society meetings, and social gatherings.",
    desc_or: "ବିବାହ ଉତ୍ସବ, ଭୋଜି କିମ୍ବା ସଭାସମିତିରେ ସମ୍ମାନପୂର୍ବକ ସହଯୋଗ କରିବା।"
  },

  // Family Care (71-75)
  "family-care-assistant-child": {
    name_en: "Family Care Assistant — Child",
    name_or: "ପାରିବାରିକ ଶିଶୁ ଯତ୍ନ ସହାୟକ",
    desc_en: "Dedicated family assistant focusing on child supervision, activity support, and home peace.",
    desc_or: "ପରିବାରରେ ଶିଶୁର ସୁରକ୍ଷା ଓ ଶୃଙ୍ଖଳା ପାଇଁ ସ୍ୱତନ୍ତ୍ର ପାରିବାରିକ ସହାୟକ।"
  },
  "family-care-assistant-elderly": {
    name_en: "Family Care Assistant — Elderly",
    name_or: "ପାରିବାରିକ ବରିଷ୍ଠ ଯତ୍ନ ସହାୟକ",
    desc_en: "Dedicated family assistant catering to elder routine support, medication reminders, and comfort.",
    desc_or: "ପରିବାରର ବୟସ୍କ ବ୍ୟକ୍ତିଙ୍କ ସେବା, ଔଷଧ ଓ ଶାନ୍ତି ପାଇଁ ଘରୋଇ ସହାୟକ।"
  },
  "family-care-assistant-child-elderly": {
    name_en: "Family Care Assistant — Child & Elderly",
    name_or: "ଉଭୟ ଶିଶୁ ଓ ବରିଷ୍ଠ ଯତ୍ନ ସହାୟକ",
    desc_en: "Dual-generation household support assisting both young children and elder family members.",
    desc_or: "ଉଭୟ କୋମଳମତି ଶିଶୁ ଓ ବୃଦ୍ଧ ପିତାମାତାଙ୍କ ଯତ୍ନ ପାଇଁ ଦକ୍ଷ ସହାୟକ।"
  },
  "daytime-family-caregiver": {
    name_en: "Daytime Family Caregiver",
    name_or: "ଦିବାକାଳୀନ ପାରିବାରିକ ସେବାକାରୀ",
    desc_en: "Comprehensive daytime family care assistance, managing schedules, and household harmony.",
    desc_or: "ଦିନସାରା ପରିବାରର ସମସ୍ତ ଯତ୍ନ ଓ ସହାୟତା ପରିଚାଳନା।"
  },
  "overnight-family-care-assistant": {
    name_en: "Overnight Family Care Assistant",
    name_or: "ରାତ୍ରିକାଳୀନ ପାରିବାରିକ ସେବାକାରୀ",
    desc_en: "Reliable nighttime family care assistant for restful sleep, infant feeds, or elder nocturnal needs.",
    desc_or: "ରାତିରେ ନିର୍ଭରଯୋଗ୍ୟ ପାରିବାରିକ ସେବା, ଶିଶୁ ଓ ବରିଷ୍ଠଙ୍କ ରାତ୍ରି ଆବଶ୍ୟକତା।"
  }
};
