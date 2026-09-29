export interface OdishaLocation {
  district: string;
  majorCities: string[];
  popularAreas: string[];
  pincodes: string[];
  coords?: { lat: number; lng: number };
}

export const ODISHA_DISTRICTS: OdishaLocation[] = [
  {
    district: "Khordha",
    majorCities: ["Bhubaneswar", "Khordha Town", "Jatni", "Balipatna"],
    popularAreas: ["Saheed Nagar", "Patia", "Nayapalli", "Chandrasekharpur", "Khandagiri", "Jayadev Vihar", "Old Town", "Infocity", "Baramunda", "Unit 1-9", "Rasulgarh", "Sundarpada"],
    pincodes: ["751001", "751002", "751003", "751010", "751012", "751013", "751015", "751019", "751024", "751030", "752050"],
    coords: { lat: 20.2961, lng: 85.8245 }
  },
  {
    district: "Cuttack",
    majorCities: ["Cuttack", "Choudwar", "Athagarh", "Banki", "Salipur"],
    popularAreas: ["CDA Sector 1-11", "Badambadi", "Jagatpur", "Link Road", "Buxi Bazaar", "Madhupatna", "Tulasipur", "Ranihat", "Mangalabag", "Jobra"],
    pincodes: ["753001", "753002", "753003", "753004", "753009", "753010", "753012", "753014", "754025"],
    coords: { lat: 20.4625, lng: 85.8830 }
  },
  {
    district: "Puri",
    majorCities: ["Puri", "Konark", "Pipili", "Nimapada", "Satyabadi"],
    popularAreas: ["Grand Road (Bada Danda)", "VIP Road", "Sea Beach Road", "Chakratirtha Road", "Balighai", "Talabania"],
    pincodes: ["752001", "752002", "752104", "752106", "752110"],
    coords: { lat: 19.8135, lng: 85.8312 }
  },
  {
    district: "Ganjam",
    majorCities: ["Berhampur", "Chhatrapur", "Gopalpur", "Aska", "Bhanjanagar", "Hinjilicut"],
    popularAreas: ["Bhavani Nagar", "Engineering School Road", "Kamapalli", "Gate Bazar", "Goilundi", "Giri Market", "Ankuli"],
    pincodes: ["760001", "760002", "760004", "760005", "760008", "761020"],
    coords: { lat: 19.3150, lng: 84.7941 }
  },
  {
    district: "Sundargarh",
    majorCities: ["Rourkela", "Sundargarh", "Rajgangpur", "Birmitrapur"],
    popularAreas: ["Civil Township", "Sector 1-21", "Uditnagar", "Panposh", "Koel Nagar", "Chhend Colony", "Basanti Nagar"],
    pincodes: ["769001", "769002", "769004", "769012", "769015", "770001"],
    coords: { lat: 22.2604, lng: 84.8536 }
  },
  {
    district: "Sambalpur",
    majorCities: ["Sambalpur", "Burla", "Hirakud", "Rengali", "Kuchinda"],
    popularAreas: ["Budharaja", "Ainthapali", "Dhanupali", "Khetrajpur", "Fatak", "VSSUT Campus Area"],
    pincodes: ["768001", "768002", "768003", "768004", "768018"],
    coords: { lat: 21.4669, lng: 83.9812 }
  },
  {
    district: "Balasore",
    majorCities: ["Balasore", "Jaleswar", "Soro", "Nilagiri", "Basta"],
    popularAreas: ["Motiganj", "Cinema Chhak", "Sahadevkhunta", "OT Road", "Station Bazar", "Remuna Golei"],
    pincodes: ["756001", "756002", "756003", "756019", "756032"],
    coords: { lat: 21.4934, lng: 86.9135 }
  },
  {
    district: "Bhadrak",
    majorCities: ["Bhadrak", "Dhamnagar", "Basudevpur", "Chandbali"],
    popularAreas: ["Charampa", "Bonth Chhak", "Puruna Bazar", "Apartibindha"],
    pincodes: ["756100", "756101", "756125", "756133"],
    coords: { lat: 21.0574, lng: 86.4959 }
  },
  {
    district: "Jajpur",
    majorCities: ["Jajpur Town", "Jajpur Road (Vyasanagar)", "Chandikhole", "Dharmasala"],
    popularAreas: ["Chorda Chhak", "Bus Stand Area", "Industrial Corridor", "Kalinga Nagar"],
    pincodes: ["755001", "755019", "755043", "755044"],
    coords: { lat: 20.8504, lng: 86.3371 }
  },
  {
    district: "Angul",
    majorCities: ["Angul", "Talcher", "NTPC Kaniha", "Athmallik"],
    popularAreas: ["Amalapada", "Hulurisingha", "Similipada", "Turang", "Coal City Talcher"],
    pincodes: ["759122", "759100", "759107", "759125"],
    coords: { lat: 20.8398, lng: 85.1013 }
  },
  {
    district: "Jharsuguda",
    majorCities: ["Jharsuguda", "Brajarajnagar", "Belpahar"],
    popularAreas: ["Beheramal", "Sarbahal", "Industrial Area", "Mangalbazar"],
    pincodes: ["768201", "768202", "768216", "768218"],
    coords: { lat: 21.8554, lng: 84.0064 }
  },
  {
    district: "Mayurbhanj",
    majorCities: ["Baripada", "Rairangpur", "Karanjia", "Betnoti"],
    popularAreas: ["Baghra Road", "Deulasahi", "Station Road", "Lal Bazar"],
    pincodes: ["757001", "757002", "757043", "757037"],
    coords: { lat: 21.9348, lng: 86.7267 }
  },
  {
    district: "Bargarh",
    majorCities: ["Bargarh", "Padampur", "Attabira", "Barpali"],
    popularAreas: ["Canal Colony", "Main Market", "Bhatli Road"],
    pincodes: ["768028", "768036", "768027"],
    coords: { lat: 21.3331, lng: 83.6195 }
  },
  {
    district: "Bolangir",
    majorCities: ["Bolangir", "Titilagarh", "Patnagarh", "Kantabanji"],
    popularAreas: ["Rugudipada", "Palace Line", "Tikrapara", "Station Road"],
    pincodes: ["767001", "767033", "767025"],
    coords: { lat: 20.7107, lng: 83.4854 }
  },
  {
    district: "Kalahandi",
    majorCities: ["Bhawanipatna", "Kesinga", "Dharamgarh", "Junagarh"],
    popularAreas: ["Paradeshi Pada", "College Road", "Main Town"],
    pincodes: ["766001", "766012", "766015"],
    coords: { lat: 19.9137, lng: 83.1649 }
  },
  {
    district: "Koraput",
    majorCities: ["Koraput", "Jeypore", "Sunabeda", "Damanjodi"],
    popularAreas: ["HAL Township", "NALCO Nagar", "MG Road Jeypore", "Parabeda"],
    pincodes: ["764020", "764001", "764002", "763008"],
    coords: { lat: 18.8135, lng: 82.7123 }
  },
  {
    district: "Rayagada",
    majorCities: ["Rayagada", "Gunupur", "Muniguda"],
    popularAreas: ["JK Pur", "Gandhi Nagar", "Raniguda Farm"],
    pincodes: ["765001", "765017", "765022"],
    coords: { lat: 19.1675, lng: 83.4163 }
  },
  {
    district: "Dhenkanal",
    majorCities: ["Dhenkanal", "Bhuban", "Kamakhyanagar", "Hindol"],
    popularAreas: ["Kunjakant", "Ganesh Bazar", "Jubilee Town"],
    pincodes: ["759001", "759017", "759018"],
    coords: { lat: 20.6593, lng: 85.5960 }
  },
  {
    district: "Kendrapada",
    majorCities: ["Kendrapada", "Pattamundai", "Aul", "Marsaghai"],
    popularAreas: ["Tinna Chhak", "Duhuria", "Kakat Chhak"],
    pincodes: ["754211", "754215", "754219"],
    coords: { lat: 20.5015, lng: 86.4229 }
  },
  {
    district: "Jagatsinghpur",
    majorCities: ["Jagatsinghpur", "Paradeep", "Kujang", "Tirtol"],
    popularAreas: ["Port Township", "Nehru Bungalow Area", "Main Town"],
    pincodes: ["754103", "754142", "754137"],
    coords: { lat: 20.2573, lng: 86.1685 }
  },
  {
    district: "Keonjhar",
    majorCities: ["Keonjhar", "Barbil", "Joda", "Anandapur"],
    popularAreas: ["Mining Colony", "DD College Area", "Old Town"],
    pincodes: ["758001", "758035", "758034"],
    coords: { lat: 21.6289, lng: 85.5817 }
  },
  {
    district: "Nayagarh",
    majorCities: ["Nayagarh", "Ranpur", "Khandapada", "Odagaon"],
    popularAreas: ["College Road", "Rajabagicha", "Main Market"],
    pincodes: ["752069", "752026", "752077"],
    coords: { lat: 20.1264, lng: 85.1051 }
  },
  {
    district: "Gajapati",
    majorCities: ["Paralakhemundi", "Kashinagara", "Mohana"],
    popularAreas: ["Palace Area", "Brundaban Palace", "Station Road"],
    pincodes: ["761200", "761205", "761015"],
    coords: { lat: 18.8148, lng: 84.1678 }
  },
  {
    district: "Nabarangpur",
    majorCities: ["Nabarangpur", "Umerkote", "Khatiguda"],
    popularAreas: ["Main Market", "LIC Colony", "Hospital Road"],
    pincodes: ["764059", "764073", "764085"],
    coords: { lat: 19.2314, lng: 82.5513 }
  },
  {
    district: "Malkangiri",
    majorCities: ["Malkangiri", "Balimela", "Mathili"],
    popularAreas: ["DNK Colony", "Collectorate Road", "Power House Area"],
    pincodes: ["764045", "764051"],
    coords: { lat: 18.3436, lng: 81.9037 }
  },
  {
    district: "Nuapada",
    majorCities: ["Nuapada", "Khariar", "Khariar Road", "Komna"],
    popularAreas: ["Main Road", "Railway Station Road", "Bazaar Line"],
    pincodes: ["766105", "766107", "766104"],
    coords: { lat: 20.8359, lng: 82.5273 }
  },
  {
    district: "Subarnapur (Sonepur)",
    majorCities: ["Sonepur", "Biramaharajpur", "Tarbha"],
    popularAreas: ["Manamunda Road", "Gokarneswar Temple Area", "Main Bazar"],
    pincodes: ["767017", "767018", "767016"],
    coords: { lat: 20.8427, lng: 83.9168 }
  },
  {
    district: "Boudh",
    majorCities: ["Boudh", "Harbhanga", "Kantamal"],
    popularAreas: ["Bridge Chhak", "Collectorate Area", "Main Market"],
    pincodes: ["762014", "762024", "762017"],
    coords: { lat: 20.8407, lng: 84.3262 }
  },
  {
    district: "Kandhamal",
    majorCities: ["Phulbani", "G. Udayagiri", "Baliguda", "Daringbadi"],
    popularAreas: ["Hill Town", "Daringbadi Valley Area", "Main Phulbani Market"],
    pincodes: ["762001", "762100", "762104", "762101"],
    coords: { lat: 20.4735, lng: 84.2343 }
  },
  {
    district: "Deogarh",
    majorCities: ["Deogarh", "Barkote", "Reamal"],
    popularAreas: ["Palace Road", "Pradhanpat Waterfalls Area", "Bus Stand Road"],
    pincodes: ["768108", "768110", "768109"],
    coords: { lat: 21.5364, lng: 84.7314 }
  }
];

export function getNearestOdishaDistrict(lat: number, lng: number): OdishaLocation {
  let closest = ODISHA_DISTRICTS[0];
  let minDistance = Infinity;

  for (const d of ODISHA_DISTRICTS) {
    if (d.coords) {
      const dLat = d.coords.lat - lat;
      const dLng = d.coords.lng - lng;
      const dist = dLat * dLat + dLng * dLng;
      if (dist < minDistance) {
        minDistance = dist;
        closest = d;
      }
    }
  }
  return closest;
}

export const DEFAULT_ODISHA_LOCATION = {
  address_line: "Plot No. 124, Saheed Nagar",
  area: "Saheed Nagar",
  city: "Bhubaneswar",
  district: "Khordha",
  state: "Odisha",
  pincode: "751007",
  is_default: true
};
