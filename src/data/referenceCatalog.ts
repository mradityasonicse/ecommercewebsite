// Real catalog data extracted from reference site https://luminous-baklava-6113b3.netlify.app/
export interface CatalogItem {
  id: string;
  name: string;
  category: 'pg' | 'meals' | 'laundry' | 'extra';
  badgeText: string;
  badge?: string;
  badgeType?: 'male' | 'female' | 'unisex' | 'veg' | 'non-veg' | 'verified';
  badgeVariant?: 'male' | 'female' | 'unisex' | 'veg' | 'non-veg' | 'verified' | string;
  gender?: 'male' | 'female' | 'unisex';
  description: string;
  price: number;
  priceText?: string;
  periodText?: string;
  address: string;
  city: string;
  image: string;
  features?: string[];
  turnaroundTime?: string;
}

export const REFERENCE_PGS: CatalogItem[] = [
  {
    "id": "fallback-1",
    "name": "Mourya PG (Room Available)",
    "category": "pg",
    "badgeText": "MALE",
    "badge": "MALE",
    "badgeType": "male",
    "badgeVariant": "male",
    "description": "Comfortable PG accommodation near Rungta College.",
    "price": 2200,
    "priceText": "₹2,200",
    "periodText": "/ month",
    "address": "Kurud Rd, near Rungta College",
    "city": "Bhilai",
    "image": "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800",
    "gender": "male",
    "features": [
      "24/7 Security",
      "High-Speed Wi-Fi",
      "Power Backup",
      "RO Water"
    ]
  },
  {
    "id": "fallback-2",
    "name": "SAFFRON PG",
    "category": "pg",
    "badgeText": "MALE",
    "badge": "MALE",
    "badgeType": "male",
    "badgeVariant": "male",
    "description": "Sharing rooms available at affordable rates.",
    "price": 2500,
    "priceText": "₹2,500",
    "periodText": "/ month",
    "address": "Kurud Rd, Kohka",
    "city": "Bhilai",
    "image": "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800",
    "gender": "male",
    "features": [
      "24/7 Security",
      "High-Speed Wi-Fi",
      "Power Backup",
      "RO Water"
    ]
  },
  {
    "id": "fallback-3",
    "name": "PRAKASH PG & MESS",
    "category": "pg",
    "badgeText": "MALE",
    "badge": "MALE",
    "badgeType": "male",
    "badgeVariant": "male",
    "description": "PG with mess facility included.",
    "price": 3000,
    "priceText": "₹3,000",
    "periodText": "/ month",
    "address": "Avanti bai chowk kurud, Street 3",
    "city": "Bhilai",
    "image": "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800",
    "gender": "male",
    "features": [
      "24/7 Security",
      "High-Speed Wi-Fi",
      "Power Backup",
      "RO Water"
    ]
  },
  {
    "id": "fallback-4",
    "name": "Shrishti Niwas - Boys PG",
    "category": "pg",
    "badgeText": "MALE",
    "badge": "MALE",
    "badgeType": "male",
    "badgeVariant": "male",
    "description": "Boys PG near Rungta College.",
    "price": 2600,
    "priceText": "₹2,600",
    "periodText": "/ month",
    "address": "1st floor, Rudraksh residency, Near Rungta college, Kurud Rd",
    "city": "Bhilai",
    "image": "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=800",
    "gender": "male",
    "features": [
      "24/7 Security",
      "High-Speed Wi-Fi",
      "Power Backup",
      "RO Water"
    ]
  },
  {
    "id": "fallback-5",
    "name": "Sai Boy's Hostel",
    "category": "pg",
    "badgeText": "MALE",
    "badge": "MALE",
    "badgeType": "male",
    "badgeVariant": "male",
    "description": "Boys hostel in Shivaji Nagar.",
    "price": 2400,
    "priceText": "₹2,400",
    "periodText": "/ month",
    "address": "65JW+2M2, sivaji Nagar, Bhilai, Kurud Rd",
    "city": "Bhilai",
    "image": "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800",
    "gender": "male",
    "features": [
      "24/7 Security",
      "High-Speed Wi-Fi",
      "Power Backup",
      "RO Water"
    ]
  },
  {
    "id": "fallback-6",
    "name": "Sanskar Hostel",
    "category": "pg",
    "badgeText": "UNISEX",
    "badge": "UNISEX",
    "badgeType": "unisex",
    "badgeVariant": "unisex",
    "description": "Hostel accommodation near P.T.M.M School.",
    "price": 2700,
    "priceText": "₹2,700",
    "periodText": "/ month",
    "address": "Kurud Road Kohka, Near Ujjwal Mangal Bhawan, behind P.T.M.M.M School, WARD-7, Kohka",
    "city": "Bhilai",
    "image": "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800",
    "gender": "unisex",
    "features": [
      "24/7 Security",
      "High-Speed Wi-Fi",
      "Power Backup",
      "RO Water"
    ]
  },
  {
    "id": "fallback-7",
    "name": "RAVI HOUSE : PG FOR STUDENT / BACHELOR SERVICE MAN",
    "category": "pg",
    "badgeText": "MALE",
    "badge": "MALE",
    "badgeType": "male",
    "badgeVariant": "male",
    "description": "PG for students and working bachelors.",
    "price": 3000,
    "priceText": "₹3,000",
    "periodText": "/ month",
    "address": "Priyadarshani Parisar West",
    "city": "Bhilai",
    "image": "https://images.unsplash.com/photo-1540518614846-7eded433c457?w=800",
    "gender": "male",
    "features": [
      "24/7 Security",
      "High-Speed Wi-Fi",
      "Power Backup",
      "RO Water"
    ]
  },
  {
    "id": "fallback-8",
    "name": "Matruchhaya Hostel",
    "category": "pg",
    "badgeText": "UNISEX",
    "badge": "UNISEX",
    "badgeType": "unisex",
    "badgeVariant": "unisex",
    "description": "Hostel at Kurud Road.",
    "price": 2500,
    "priceText": "₹2,500",
    "periodText": "/ month",
    "address": "Kurud Road Between ujjwal mangal bhawan and Madan malviya school, Near avantibai chowk, Ward -7, Kohka",
    "city": "Bhilai",
    "image": "https://images.unsplash.com/photo-1556020685-ae41abfc9365?w=800",
    "gender": "unisex",
    "features": [
      "24/7 Security",
      "High-Speed Wi-Fi",
      "Power Backup",
      "RO Water"
    ]
  },
  {
    "id": "fallback-9",
    "name": "Girls pg B462 Smriti nagar Bhilai",
    "category": "pg",
    "badgeText": "FEMALE",
    "badge": "FEMALE",
    "badgeType": "female",
    "badgeVariant": "female",
    "description": "Girls PG in Smriti Nagar.",
    "price": 3500,
    "priceText": "₹3,500",
    "periodText": "/ month",
    "address": "B-462, Cross Street 23, Smriti Nagar",
    "city": "Bhilai",
    "image": "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800",
    "gender": "female",
    "features": [
      "24/7 Security",
      "High-Speed Wi-Fi",
      "Power Backup",
      "RO Water"
    ]
  },
  {
    "id": "fallback-10",
    "name": "Galax Boys Hostel",
    "category": "pg",
    "badgeText": "MALE",
    "badge": "MALE",
    "badgeType": "male",
    "badgeVariant": "male",
    "description": "Boys hostel above Gopal Dairy.",
    "price": 2800,
    "priceText": "₹2,800",
    "periodText": "/ month",
    "address": "above Gopal Dairy, near Central Bank Of India, Ward 07, Radhika Nagar",
    "city": "Bhilai",
    "image": "https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=800",
    "gender": "male",
    "features": [
      "24/7 Security",
      "High-Speed Wi-Fi",
      "Power Backup",
      "RO Water"
    ]
  },
  {
    "id": "fallback-11",
    "name": "OM NIRMAL SAI KRIPA BOYS HOSTEL & PG",
    "category": "pg",
    "badgeText": "MALE",
    "badge": "MALE",
    "badgeType": "male",
    "badgeVariant": "male",
    "description": "Boys hostel near Ekta Chowk.",
    "price": 3200,
    "priceText": "₹3,200",
    "periodText": "/ month",
    "address": "NEAR EKTA CHOWK, INFRONT OF SAI KRIPA CHOWK, KAILASH NAGAR INDUSTRIAL ESTATE",
    "city": "Bhilai",
    "image": "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800",
    "gender": "male",
    "features": [
      "24/7 Security",
      "High-Speed Wi-Fi",
      "Power Backup",
      "RO Water"
    ]
  },
  {
    "id": "fallback-12",
    "name": "Aayushi's - Hostel & PG for Girls",
    "category": "pg",
    "badgeText": "FEMALE",
    "badge": "FEMALE",
    "badgeType": "female",
    "badgeVariant": "female",
    "description": "Girls hostel in Pragati Nagar.",
    "price": 3000,
    "priceText": "₹3,000",
    "periodText": "/ month",
    "address": "Plot No 93-94, Street-1A, Pragati Nagar, Ajad Market, Risali",
    "city": "Bhilai",
    "image": "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800",
    "gender": "female",
    "features": [
      "24/7 Security",
      "High-Speed Wi-Fi",
      "Power Backup",
      "RO Water"
    ]
  },
  {
    "id": "fallback-13",
    "name": "Das Residency N Boyz PG",
    "category": "pg",
    "badgeText": "MALE",
    "badge": "MALE",
    "badgeType": "male",
    "badgeVariant": "male",
    "description": "Boys PG near Science College ground.",
    "price": 2800,
    "priceText": "₹2,800",
    "periodText": "/ month",
    "address": "behind Green bee Residency, beside govt. Science college ground, Deepak Nagar, Malviya Nagar",
    "city": "Durg",
    "image": "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800",
    "gender": "male",
    "features": [
      "24/7 Security",
      "High-Speed Wi-Fi",
      "Power Backup",
      "RO Water"
    ]
  },
  {
    "id": "fallback-14",
    "name": "Pratap Boys PG",
    "category": "pg",
    "badgeText": "MALE",
    "badge": "MALE",
    "badgeType": "male",
    "badgeVariant": "male",
    "description": "Boys PG in Nehru Nagar East.",
    "price": 3500,
    "priceText": "₹3,500",
    "periodText": "/ month",
    "address": "STREET-12 plot, no-75/7, Nehru Nagar East, Nehru Nagar",
    "city": "Bhilai",
    "image": "https://images.unsplash.com/photo-1502672023488-70e25813eb80?w=800",
    "gender": "male",
    "features": [
      "24/7 Security",
      "High-Speed Wi-Fi",
      "Power Backup",
      "RO Water"
    ]
  },
  {
    "id": "fallback-15",
    "name": "Maruti hostel",
    "category": "pg",
    "badgeText": "UNISEX",
    "badge": "UNISEX",
    "badgeType": "unisex",
    "badgeVariant": "unisex",
    "description": "Hostel at Smriti Nagar Road.",
    "price": 2600,
    "priceText": "₹2,600",
    "periodText": "/ month",
    "address": "STREET NO. 22, PLOT NO. 701/B, Raipur Naka - Smriti Nagar Rd",
    "city": "Bhilai",
    "image": "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800",
    "gender": "unisex",
    "features": [
      "24/7 Security",
      "High-Speed Wi-Fi",
      "Power Backup",
      "RO Water"
    ]
  },
  {
    "id": "fallback-16",
    "name": "FOLK HOSTEL",
    "category": "pg",
    "badgeText": "UNISEX",
    "badge": "UNISEX",
    "badgeType": "unisex",
    "badgeVariant": "unisex",
    "description": "Hostel in Priyadarshini Parisar.",
    "price": 3200,
    "priceText": "₹3,200",
    "periodText": "/ month",
    "address": "7, 11, Nehru Nagar Main Rd, Priyadarshani Parisar West",
    "city": "Bhilai",
    "image": "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800",
    "gender": "unisex",
    "features": [
      "24/7 Security",
      "High-Speed Wi-Fi",
      "Power Backup",
      "RO Water"
    ]
  },
  {
    "id": "fallback-17",
    "name": "The Pavilion Hostel",
    "category": "pg",
    "badgeText": "UNISEX",
    "badge": "UNISEX",
    "badgeType": "unisex",
    "badgeVariant": "unisex",
    "description": "Hostel in Kohka.",
    "price": 2900,
    "priceText": "₹2,900",
    "periodText": "/ month",
    "address": "69P2+38F, Kohka",
    "city": "Bhilai",
    "image": "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800",
    "gender": "unisex",
    "features": [
      "24/7 Security",
      "High-Speed Wi-Fi",
      "Power Backup",
      "RO Water"
    ]
  },
  {
    "id": "fallback-18",
    "name": "Qureshi PG",
    "category": "pg",
    "badgeText": "UNISEX",
    "badge": "UNISEX",
    "badgeType": "unisex",
    "badgeVariant": "unisex",
    "description": "PG in Smriti Nagar.",
    "price": 2800,
    "priceText": "₹2,800",
    "periodText": "/ month",
    "address": "688C+GHJ, Smriti Nagar",
    "city": "Bhilai",
    "image": "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800",
    "gender": "unisex",
    "features": [
      "24/7 Security",
      "High-Speed Wi-Fi",
      "Power Backup",
      "RO Water"
    ]
  },
  {
    "id": "fallback-19",
    "name": "Maa karma niwas",
    "category": "pg",
    "badgeText": "UNISEX",
    "badge": "UNISEX",
    "badgeType": "unisex",
    "badgeVariant": "unisex",
    "description": "PG near new govt high school.",
    "price": 2500,
    "priceText": "₹2,500",
    "periodText": "/ month",
    "address": "Near by new govt. high secondary school, Kurud",
    "city": "Bhilai",
    "image": "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=800",
    "gender": "unisex",
    "features": [
      "24/7 Security",
      "High-Speed Wi-Fi",
      "Power Backup",
      "RO Water"
    ]
  },
  {
    "id": "fallback-20",
    "name": "BHARDWAJ HOSTEL- CLASSES - FOOD POINT",
    "category": "pg",
    "badgeText": "UNISEX",
    "badge": "UNISEX",
    "badgeType": "unisex",
    "badgeVariant": "unisex",
    "description": "Hostel with food point.",
    "price": 3500,
    "priceText": "₹3,500",
    "periodText": "/ month",
    "address": "95/B-9, Nehru Nagar East",
    "city": "Bhilai",
    "image": "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800",
    "gender": "unisex",
    "features": [
      "24/7 Security",
      "High-Speed Wi-Fi",
      "Power Backup",
      "RO Water"
    ]
  },
  {
    "id": "fallback-21",
    "name": "Ved Hostel",
    "category": "pg",
    "badgeText": "UNISEX",
    "badge": "UNISEX",
    "badgeType": "unisex",
    "badgeVariant": "unisex",
    "description": "Hostel in Smriti Nagar.",
    "price": 3000,
    "priceText": "₹3,000",
    "periodText": "/ month",
    "address": "Smriti Nagar",
    "city": "Bhilai",
    "image": "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800",
    "gender": "unisex",
    "features": [
      "24/7 Security",
      "High-Speed Wi-Fi",
      "Power Backup",
      "RO Water"
    ]
  },
  {
    "id": "fallback-22",
    "name": "Sharma boy's PG",
    "category": "pg",
    "badgeText": "MALE",
    "badge": "MALE",
    "badgeType": "male",
    "badgeVariant": "male",
    "description": "Boys PG in Risali.",
    "price": 3200,
    "priceText": "₹3,200",
    "periodText": "/ month",
    "address": "Cross street, 10, Shakti Vihar Rd, Risali",
    "city": "Bhilai",
    "image": "https://images.unsplash.com/photo-1540518614846-7eded433c457?w=800",
    "gender": "male",
    "features": [
      "24/7 Security",
      "High-Speed Wi-Fi",
      "Power Backup",
      "RO Water"
    ]
  },
  {
    "id": "fallback-23",
    "name": "Sawai Girls PG",
    "category": "pg",
    "badgeText": "FEMALE",
    "badge": "FEMALE",
    "badgeType": "female",
    "badgeVariant": "female",
    "description": "Girls PG in Nehru Nagar West.",
    "price": 3800,
    "priceText": "₹3,800",
    "periodText": "/ month",
    "address": "House 08, Block 23, Street 08, Nehru Nagar West, Vidya Vihar Colony",
    "city": "Bhilai",
    "image": "https://images.unsplash.com/photo-1556020685-ae41abfc9365?w=800",
    "gender": "female",
    "features": [
      "24/7 Security",
      "High-Speed Wi-Fi",
      "Power Backup",
      "RO Water"
    ]
  },
  {
    "id": "fallback-24",
    "name": "Adarsh girls hostel",
    "category": "pg",
    "badgeText": "FEMALE",
    "badge": "FEMALE",
    "badgeType": "female",
    "badgeVariant": "female",
    "description": "Girls hostel in Nehru Nagar East.",
    "price": 3600,
    "priceText": "₹3,600",
    "periodText": "/ month",
    "address": "Street-9, Nehru Nagar East",
    "city": "Bhilai",
    "image": "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800",
    "gender": "female",
    "features": [
      "24/7 Security",
      "High-Speed Wi-Fi",
      "Power Backup",
      "RO Water"
    ]
  },
  {
    "id": "fallback-25",
    "name": "Raja Bhaiya PG(paying Guest/hostel)",
    "category": "pg",
    "badgeText": "MALE",
    "badge": "MALE",
    "badgeType": "male",
    "badgeVariant": "male",
    "description": "PG and hostel in Sector 10.",
    "price": 3000,
    "priceText": "₹3,000",
    "periodText": "/ month",
    "address": "58MJ+HWB, Sector 10",
    "city": "Bhilai",
    "image": "https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=800",
    "gender": "male",
    "features": [
      "24/7 Security",
      "High-Speed Wi-Fi",
      "Power Backup",
      "RO Water"
    ]
  },
  {
    "id": "fallback-26",
    "name": "RAO PG",
    "category": "pg",
    "badgeText": "UNISEX",
    "badge": "UNISEX",
    "badgeType": "unisex",
    "badgeVariant": "unisex",
    "description": "PG in Shakti Vihar.",
    "price": 2800,
    "priceText": "₹2,800",
    "periodText": "/ month",
    "address": "151/G, Street-6, Shakti Vihar Rd",
    "city": "Bhilai",
    "image": "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800",
    "gender": "unisex",
    "features": [
      "24/7 Security",
      "High-Speed Wi-Fi",
      "Power Backup",
      "RO Water"
    ]
  },
  {
    "id": "fallback-27",
    "name": "Shivaay P.G for girls",
    "category": "pg",
    "badgeText": "FEMALE",
    "badge": "FEMALE",
    "badgeType": "female",
    "badgeVariant": "female",
    "description": "Girls PG in Anand Nagar.",
    "price": 3400,
    "priceText": "₹3,400",
    "periodText": "/ month",
    "address": "Plot 1 302/18 street 3 Anand nagar, in front of shivam boys pg, Smriti Nagar",
    "city": "Bhilai",
    "image": "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800",
    "gender": "female",
    "features": [
      "24/7 Security",
      "High-Speed Wi-Fi",
      "Power Backup",
      "RO Water"
    ]
  },
  {
    "id": "fallback-28",
    "name": "KALYAN PG COLLEGE BHILAI",
    "category": "pg",
    "badgeText": "UNISEX",
    "badge": "UNISEX",
    "badgeType": "unisex",
    "badgeVariant": "unisex",
    "description": "PG College hostel.",
    "price": 2500,
    "priceText": "₹2,500",
    "periodText": "/ month",
    "address": "58WM+753, Sector 7",
    "city": "Bhilai",
    "image": "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800",
    "gender": "unisex",
    "features": [
      "24/7 Security",
      "High-Speed Wi-Fi",
      "Power Backup",
      "RO Water"
    ]
  },
  {
    "id": "fallback-29",
    "name": "Pradeep Rastogi",
    "category": "pg",
    "badgeText": "UNISEX",
    "badge": "UNISEX",
    "badgeType": "unisex",
    "badgeVariant": "unisex",
    "description": "Accommodation in Shanti Nagar.",
    "price": 3000,
    "priceText": "₹3,000",
    "periodText": "/ month",
    "address": "68HW+8HP, Shanti Nagar",
    "city": "Bhilai",
    "image": "https://images.unsplash.com/photo-1502672023488-70e25813eb80?w=800",
    "gender": "unisex",
    "features": [
      "24/7 Security",
      "High-Speed Wi-Fi",
      "Power Backup",
      "RO Water"
    ]
  },
  {
    "id": "fallback-30",
    "name": "Arham Girls PG HOSTEL",
    "category": "pg",
    "badgeText": "FEMALE",
    "badge": "FEMALE",
    "badgeType": "female",
    "badgeVariant": "female",
    "description": "Girls hostel near new govt high school.",
    "price": 3200,
    "priceText": "₹3,200",
    "periodText": "/ month",
    "address": "Near by new govt. high secondary school, Kurud",
    "city": "Bhilai",
    "image": "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800",
    "gender": "female",
    "features": [
      "24/7 Security",
      "High-Speed Wi-Fi",
      "Power Backup",
      "RO Water"
    ]
  },
  {
    "id": "fallback-31",
    "name": "Agrawal's Girls Pg St-10",
    "category": "pg",
    "badgeText": "FEMALE",
    "badge": "FEMALE",
    "badgeType": "female",
    "badgeVariant": "female",
    "description": "Girls PG in Smriti Nagar.",
    "price": 3500,
    "priceText": "₹3,500",
    "periodText": "/ month",
    "address": "House A11, Street 10, Smriti Nagar",
    "city": "Bhilai",
    "image": "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800",
    "gender": "female",
    "features": [
      "24/7 Security",
      "High-Speed Wi-Fi",
      "Power Backup",
      "RO Water"
    ]
  },
  {
    "id": "fallback-32",
    "name": "Keshri kunj boys pg",
    "category": "pg",
    "badgeText": "MALE",
    "badge": "MALE",
    "badgeType": "male",
    "badgeVariant": "male",
    "description": "Boys PG in Priyadarshini Nagar.",
    "price": 3100,
    "priceText": "₹3,100",
    "periodText": "/ month",
    "address": "111/2a, Priyadarshini Nagar, Maitri Nagar, Risali",
    "city": "Bhilai",
    "image": "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800",
    "gender": "male",
    "features": [
      "24/7 Security",
      "High-Speed Wi-Fi",
      "Power Backup",
      "RO Water"
    ]
  },
  {
    "id": "fallback-33",
    "name": "Vishwakarma niwas P.G for boys",
    "category": "pg",
    "badgeText": "MALE",
    "badge": "MALE",
    "badgeType": "male",
    "badgeVariant": "male",
    "description": "Boys PG in Hari Nagar.",
    "price": 2800,
    "priceText": "₹2,800",
    "periodText": "/ month",
    "address": "48/22, Hari Nagar Main Rd, Asha Nagar, Gandhi Nagar, Katulbod, Durg, Hanuman Nagar",
    "city": "Durg",
    "image": "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800",
    "gender": "male",
    "features": [
      "24/7 Security",
      "High-Speed Wi-Fi",
      "Power Backup",
      "RO Water"
    ]
  },
  {
    "id": "fallback-34",
    "name": "Poonam Girls PG & Tiffin Service at Risali, Bhilai",
    "category": "pg",
    "badgeText": "FEMALE",
    "badge": "FEMALE",
    "badgeType": "female",
    "badgeVariant": "female",
    "description": "Girls PG with Tiffin Service in Risali.",
    "price": 4000,
    "priceText": "₹4,000",
    "periodText": "/ month",
    "address": "Plot No. 16, Daya Nagar, Risali",
    "city": "Bhilai",
    "image": "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=800",
    "gender": "female",
    "features": [
      "24/7 Security",
      "High-Speed Wi-Fi",
      "Power Backup",
      "RO Water"
    ]
  },
  {
    "id": "fallback-35",
    "name": "A1 Girls hostel",
    "category": "pg",
    "badgeText": "FEMALE",
    "badge": "FEMALE",
    "badgeType": "female",
    "badgeVariant": "female",
    "description": "Girls hostel in Shanti Nagar.",
    "price": 3300,
    "priceText": "₹3,300",
    "periodText": "/ month",
    "address": "68GW+8H8, Shanti Nagar",
    "city": "Bhilai",
    "image": "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800",
    "gender": "female",
    "features": [
      "24/7 Security",
      "High-Speed Wi-Fi",
      "Power Backup",
      "RO Water"
    ]
  },
  {
    "id": "fallback-36",
    "name": "Anandi Bhawan",
    "category": "pg",
    "badgeText": "UNISEX",
    "badge": "UNISEX",
    "badgeType": "unisex",
    "badgeVariant": "unisex",
    "description": "Accommodation in Kosa Nagar.",
    "price": 2600,
    "priceText": "₹2,600",
    "periodText": "/ month",
    "address": "Kosa Nagar, Dixit Colony",
    "city": "Bhilai",
    "image": "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800",
    "gender": "unisex",
    "features": [
      "24/7 Security",
      "High-Speed Wi-Fi",
      "Power Backup",
      "RO Water"
    ]
  }
];

export const REFERENCE_MEALS: CatalogItem[] = [
  {
    "id": "1",
    "name": "Basic Plan",
    "category": "meals",
    "badgeText": "VEG",
    "badge": "VEG",
    "badgeType": "veg",
    "badgeVariant": "veg",
    "description": "Essential meals for students on a budget",
    "price": 3500,
    "priceText": "₹3,500",
    "periodText": "/ month",
    "address": "Partner Mess Network, Bhilai",
    "city": "Bhilai",
    "image": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800",
    "features": [
      "2 meals per day",
      "Home-style cooking",
      "Unlimited rice & roti",
      "Weekly menu rotation"
    ]
  },
  {
    "id": "2",
    "name": "Standard Plan",
    "category": "meals",
    "badgeText": "VEG",
    "badge": "VEG",
    "badgeType": "veg",
    "badgeVariant": "veg",
    "description": "Complete nutrition with variety",
    "price": 4500,
    "priceText": "₹4,500",
    "periodText": "/ month",
    "address": "Partner Mess Network, Bhilai",
    "city": "Bhilai",
    "image": "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800",
    "features": [
      "3 meals per day",
      "Fresh vegetables",
      "Weekly special dishes",
      "Customizable menu",
      "Free delivery"
    ]
  },
  {
    "id": "3",
    "name": "Premium Plan",
    "category": "meals",
    "badgeText": "BOTH",
    "badge": "BOTH",
    "badgeType": "veg",
    "badgeVariant": "veg",
    "description": "Gourmet meals with premium ingredients",
    "price": 6000,
    "priceText": "₹6,000",
    "periodText": "/ month",
    "address": "Partner Mess Network, Bhilai",
    "city": "Bhilai",
    "image": "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800",
    "features": [
      "3 meals + snacks",
      "Veg & Non-veg options",
      "Premium ingredients",
      "Chef special weekly",
      "Personalized diet plans"
    ]
  },
  {
    "id": "4",
    "name": "Non-Veg Delight",
    "category": "meals",
    "badgeText": "NON-VEG",
    "badge": "NON-VEG",
    "badgeType": "non-veg",
    "badgeVariant": "non-veg",
    "description": "For chicken and egg lovers",
    "price": 5500,
    "priceText": "₹5,500",
    "periodText": "/ month",
    "address": "Partner Mess Network, Bhilai",
    "city": "Bhilai",
    "image": "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=800",
    "features": [
      "Chicken 4 days/week",
      "Eggs daily",
      "Fish twice a week",
      "Home-style cooking",
      "Hygienic preparation"
    ]
  },
  {
    "id": "5",
    "name": "Daily Veg Meal",
    "category": "meals",
    "badgeText": "VEG",
    "badge": "VEG",
    "badgeType": "veg",
    "badgeVariant": "veg",
    "description": "Pay per day, no commitment",
    "price": 150,
    "priceText": "₹150",
    "periodText": "/ day",
    "address": "Partner Mess Network, Bhilai",
    "city": "Bhilai",
    "image": "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800",
    "features": [
      "2 meals included",
      "No monthly commitment",
      "Fresh daily",
      "Cancel anytime"
    ]
  },
  {
    "id": "6",
    "name": "Breakfast Special",
    "category": "meals",
    "badgeText": "VEG",
    "badge": "VEG",
    "badgeType": "veg",
    "badgeVariant": "veg",
    "description": "Start your day right",
    "price": 1500,
    "priceText": "₹1,500",
    "periodText": "/ month",
    "address": "Partner Mess Network, Bhilai",
    "city": "Bhilai",
    "image": "https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?w=800",
    "features": [
      "Healthy breakfast",
      "Variety of options",
      "Fresh juice included",
      "Early delivery"
    ]
  }
];

export const REFERENCE_LAUNDRY: CatalogItem[] = [
  {
    "id": "1",
    "name": "Per-KG Plan",
    "category": "laundry",
    "badgeText": "PER-KG",
    "badge": "PER-KG",
    "badgeType": "verified",
    "badgeVariant": "verified",
    "description": "Pay only for what you wash - perfect for occasional use",
    "price": 40,
    "priceText": "₹40",
    "periodText": "/ kg",
    "address": "Express Hub & Doorstep Pickup",
    "city": "Bhilai",
    "image": "https://images.unsplash.com/photo-1517677208171-0bc6725a3e60?w=800",
    "turnaroundTime": "24-48 hours",
    "features": [
      "Wash + Dry + Iron",
      "Eco-friendly detergents",
      "Stain removal",
      "Doorstep pickup & delivery"
    ]
  },
  {
    "id": "2",
    "name": "Monthly Unlimited",
    "category": "laundry",
    "badgeText": "MONTHLY",
    "badge": "MONTHLY",
    "badgeType": "verified",
    "badgeVariant": "verified",
    "description": "Unlimited laundry for a fixed monthly price",
    "price": 1200,
    "priceText": "₹1,200",
    "periodText": "/ month",
    "address": "Express Hub & Doorstep Pickup",
    "city": "Bhilai",
    "image": "https://images.unsplash.com/photo-1582735689369-4fe89db7114c?w=800",
    "turnaroundTime": "24 hours",
    "features": [
      "Unlimited clothes",
      "Priority service",
      "Free pickup twice a week",
      "Express delivery option",
      "Premium fabric care"
    ]
  },
  {
    "id": "3",
    "name": "Premium Care",
    "category": "laundry",
    "badgeText": "PER-ITEM",
    "badge": "PER-ITEM",
    "badgeType": "verified",
    "badgeVariant": "verified",
    "description": "Special care for delicate and premium fabrics",
    "price": 80,
    "priceText": "₹80",
    "periodText": "/ item",
    "address": "Express Hub & Doorstep Pickup",
    "city": "Bhilai",
    "image": "https://images.unsplash.com/photo-1489274495757-95c7c837b101?w=800",
    "turnaroundTime": "48 hours",
    "features": [
      "Hand wash available",
      "Dry cleaning",
      "Special fabric treatment",
      "Careful handling",
      "Quality guarantee"
    ]
  }
];

export const REFERENCE_EXTRA_SERVICES: CatalogItem[] = [
  {
    "id": "extra-1",
    "name": "Room Deep Cleaning",
    "category": "extra",
    "badgeText": "HYGIENE",
    "badge": "HYGIENE",
    "badgeType": "verified",
    "badgeVariant": "verified",
    "description": "Thorough sanitization, floor scrubbing, bathroom deep clean and dust removal by verified staff.",
    "price": 499,
    "priceText": "₹499",
    "periodText": "/ visit",
    "address": "At Your Doorstep, Bhilai",
    "city": "Bhilai",
    "image": "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800",
    "features": [
      "Professional Equipment",
      "Eco-Friendly Detergents",
      "Bathroom & Kitchen",
      "100% Satisfaction"
    ]
  },
  {
    "id": "extra-2",
    "name": "Campus Luggage Relocation",
    "category": "extra",
    "badgeText": "MOVING",
    "badge": "MOVING",
    "badgeType": "verified",
    "badgeVariant": "verified",
    "description": "Effortless shifting of baggage, books, and bedding between hostels, PGs, and railway stations.",
    "price": 349,
    "priceText": "₹349",
    "periodText": "/ trip",
    "address": "Campus-wide & Railway Station",
    "city": "Bhilai",
    "image": "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800",
    "features": [
      "Careful Handling",
      "Doorstep Pickup & Drop",
      "Tracked Shifting",
      "Same-day Service"
    ]
  },
  {
    "id": "extra-3",
    "name": "High-Speed Student WiFi Setup",
    "category": "extra",
    "badgeText": "INTERNET",
    "badge": "INTERNET",
    "badgeType": "verified",
    "badgeVariant": "verified",
    "description": "Dedicated fiber connection with zero installation fee and student-friendly month-to-month plans.",
    "price": 499,
    "priceText": "₹499",
    "periodText": "/ month",
    "address": "Direct PG / Flat Installation",
    "city": "Bhilai",
    "image": "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=800",
    "features": [
      "Up to 100 Mbps",
      "Unlimited Data",
      "24hr Fault Resolution",
      "Zero Setup Cost"
    ]
  }
];
