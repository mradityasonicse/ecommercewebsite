export interface MealItem {
  name: string;
  category: 'main' | 'bread' | 'rice' | 'dal' | 'side' | 'sweet' | 'beverage';
  isSpecial?: boolean;
  tags?: string[];
}

export interface MealSlot {
  slotId: 'breakfast' | 'lunch' | 'dinner';
  title: string;
  hindiTitle: string;
  icon: string;
  timing: string;
  startTime: string; // "07:30"
  endTime: string;   // "10:00"
  estimatedCalories: number;
  proteinGrams: number;
  chefNote: string;
  items: MealItem[];
  highlightDish: string;
}

export interface DayMenu {
  dayName: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
  shortDay: 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun';
  meals: {
    breakfast: MealSlot;
    lunch: MealSlot;
    dinner: MealSlot;
  };
}

export interface MessProviderMenu {
  id: string;
  name: string;
  campusArea: string;
  fssaiNumber: string;
  hygieneScore: string;
  monthlyPlanPrice: number;
  rating: number;
  totalSubscribers: number;
  dietaryType: 'Pure Veg' | 'Veg + Egg Options' | 'Jain & Veg';
  weeklyMenu: DayMenu[];
}

export const CAMPUS_MESS_PROVIDERS: MessProviderMenu[] = [
  {
    id: 'mess_annapurna',
    name: 'Annapurna Student Rasoi',
    campusArea: 'Hostel Gate 2 • Near Library Block',
    fssaiNumber: 'FSSAI Lic. 104230009182',
    hygieneScore: '4.9/5.0 (Audited Yesterday)',
    monthlyPlanPrice: 2400,
    rating: 4.9,
    totalSubscribers: 420,
    dietaryType: 'Pure Veg',
    weeklyMenu: [
      {
        dayName: 'Monday',
        shortDay: 'Mon',
        meals: {
          breakfast: {
            slotId: 'breakfast',
            title: 'Breakfast (Nashta)',
            hindiTitle: 'सुबह का नाश्ता',
            icon: 'Sunrise',
            timing: '07:30 AM - 10:00 AM',
            startTime: '07:30',
            endTime: '10:00',
            estimatedCalories: 410,
            proteinGrams: 14,
            chefNote: 'Poha made with fresh curry leaves, roasted groundnuts & pomegranate seeds.',
            highlightDish: 'Indori Poha & Hot Jalebi',
            items: [
              { name: 'Indori Sev Poha with Roasted Peanuts', category: 'main', isSpecial: true },
              { name: 'Crispy Hot Jalebi (2 pcs)', category: 'sweet', isSpecial: true },
              { name: 'Boiled Chana & Moong Sprouts Bowl', category: 'side' },
              { name: 'Fresh Ginger Masala Chai / Milk', category: 'beverage' },
              { name: 'Sweet Banana / Seasonal Fruit', category: 'side' },
            ],
          },
          lunch: {
            slotId: 'lunch',
            title: 'Lunch (Dopahar Bhojan)',
            hindiTitle: 'दोपहर का खाना',
            icon: 'Sun',
            timing: '12:30 PM - 03:30 PM',
            startTime: '12:30',
            endTime: '15:30',
            estimatedCalories: 680,
            proteinGrams: 24,
            chefNote: 'Unlimited fresh tawa phulkas directly from stove with homemade fresh butter.',
            highlightDish: 'Paneer Butter Masala & Dal Tadka',
            items: [
              { name: 'Rich Paneer Butter Masala', category: 'main', isSpecial: true },
              { name: 'Yellow Dal Tadka with Desi Ghee', category: 'dal' },
              { name: 'Unlimited Tawa Butter Phulkas', category: 'bread' },
              { name: 'Fragrant Jeera Rice', category: 'rice' },
              { name: 'Chilled Boondi Raita', category: 'side' },
              { name: 'Green Salad, Lemon & Crispy Papad', category: 'side' },
              { name: 'Gulab Jamun (1 pc)', category: 'sweet', isSpecial: true },
            ],
          },
          dinner: {
            slotId: 'dinner',
            title: 'Dinner (Raat ka Khana)',
            hindiTitle: 'रात का भोजन',
            icon: 'Moon',
            timing: '07:30 PM - 10:15 PM',
            startTime: '19:30',
            endTime: '22:15',
            estimatedCalories: 620,
            proteinGrams: 21,
            chefNote: 'Light and wholesome dinner with high-protein Rajma & hot phulkas for sound sleep.',
            highlightDish: 'Punjabi Rajma Masala & Aloo Jeera',
            items: [
              { name: 'Punjabi Masaledar Rajma', category: 'main', isSpecial: true },
              { name: 'Crispy Jeera Aloo Sukha', category: 'side' },
              { name: 'Steamed Basmati Rice', category: 'rice' },
              { name: 'Hot Tawa Rotis (Unlimited)', category: 'bread' },
              { name: 'Panchmel Dal', category: 'dal' },
              { name: 'Onion-Tomato Kachumber Salad', category: 'side' },
              { name: 'Hot Sevaiyan Kheer', category: 'sweet' },
            ],
          },
        },
      },
      {
        dayName: 'Tuesday',
        shortDay: 'Tue',
        meals: {
          breakfast: {
            slotId: 'breakfast',
            title: 'Breakfast (Nashta)',
            hindiTitle: 'सुबह का नाश्ता',
            icon: 'Sunrise',
            timing: '07:30 AM - 10:00 AM',
            startTime: '07:30',
            endTime: '10:00',
            estimatedCalories: 430,
            proteinGrams: 16,
            chefNote: 'Crispy stuffed parathas with homemade mint curd and lemon pickle.',
            highlightDish: 'Aloo-Pyaza Paratha with Mint Curd',
            items: [
              { name: 'Stuffed Aloo-Pyaz Parathas (2 pcs)', category: 'main', isSpecial: true },
              { name: 'Fresh Mint Curd (Pudina Dahi)', category: 'side' },
              { name: 'Mango & Lime Pickle', category: 'side' },
              { name: 'Boiled Sprouts Salad', category: 'side' },
              { name: 'Kadak Masala Chai / Bournvita Milk', category: 'beverage' },
            ],
          },
          lunch: {
            slotId: 'lunch',
            title: 'Lunch (Dopahar Bhojan)',
            hindiTitle: 'दोपहर का खाना',
            icon: 'Sun',
            timing: '12:30 PM - 03:30 PM',
            startTime: '12:30',
            endTime: '15:30',
            estimatedCalories: 660,
            proteinGrams: 22,
            chefNote: 'Authentic Punjabi Chole slow-cooked with tea leaf infusion & spices.',
            highlightDish: 'Amritsari Chole Masala & Palak Dal',
            items: [
              { name: 'Amritsari Pindi Chole Masala', category: 'main', isSpecial: true },
              { name: 'Palak Moong Dal with Garlic Tadka', category: 'dal' },
              { name: 'Unlimited Butter Tawa Rotis', category: 'bread' },
              { name: 'Peas Pulao (Matar Pulao)', category: 'rice' },
              { name: 'Cucumber Mint Raita', category: 'side' },
              { name: 'Spicy Sirka Pyaz & Fried Green Chillies', category: 'side' },
              { name: 'Moong Dal Halwa', category: 'sweet', isSpecial: true },
            ],
          },
          dinner: {
            slotId: 'dinner',
            title: 'Dinner (Raat ka Khana)',
            hindiTitle: 'रात का भोजन',
            icon: 'Moon',
            timing: '07:30 PM - 10:15 PM',
            startTime: '19:30',
            endTime: '22:15',
            estimatedCalories: 590,
            proteinGrams: 19,
            chefNote: 'Comforting home-style dinner with Dum Aloo and rich Dal Fry.',
            highlightDish: 'Kashmiri Dum Aloo & Dhaba Dal Fry',
            items: [
              { name: 'Kashmiri Shahi Dum Aloo', category: 'main', isSpecial: true },
              { name: 'Dhaba Style Toor Dal Fry', category: 'dal' },
              { name: 'Tawa Phulkas with Desi Ghee', category: 'bread' },
              { name: 'Jeera Steam Rice', category: 'rice' },
              { name: 'Roasted Bikaneri Papad', category: 'side' },
              { name: 'Beetroot Carrot Salad', category: 'side' },
              { name: 'Custard Fruit Salad', category: 'sweet' },
            ],
          },
        },
      },
      {
        dayName: 'Wednesday',
        shortDay: 'Wed',
        meals: {
          breakfast: {
            slotId: 'breakfast',
            title: 'Breakfast (Nashta)',
            hindiTitle: 'सुबह का नाश्ता',
            icon: 'Sunrise',
            timing: '07:30 AM - 10:00 AM',
            startTime: '07:30',
            endTime: '10:00',
            estimatedCalories: 450,
            proteinGrams: 15,
            chefNote: 'South Indian Wednesday special with steaming hot Sambhar and 2 fresh chutneys.',
            highlightDish: 'Masala Dosa & Steamed Idli',
            items: [
              { name: 'Crispy Butter Masala Dosa', category: 'main', isSpecial: true },
              { name: 'Soft Steamed Idli (2 pcs)', category: 'main' },
              { name: 'Hot Vegetable Sambhar (Unlimited)', category: 'dal' },
              { name: 'Coconut Chutney & Tomato Chutney', category: 'side' },
              { name: 'Filter Coffee / Adrak Chai', category: 'beverage' },
            ],
          },
          lunch: {
            slotId: 'lunch',
            title: 'Lunch (Dopahar Bhojan)',
            hindiTitle: 'दोपहर का खाना',
            icon: 'Sun',
            timing: '12:30 PM - 03:30 PM',
            startTime: '12:30',
            endTime: '15:30',
            estimatedCalories: 710,
            proteinGrams: 26,
            chefNote: 'Student favorite Kadai Paneer cooked in bell peppers & hand-ground kadai masala.',
            highlightDish: 'Kadai Paneer & Dal Makhani',
            items: [
              { name: 'Kadai Paneer with Bell Peppers', category: 'main', isSpecial: true },
              { name: 'Slow-Cooked Creamy Dal Makhani', category: 'dal', isSpecial: true },
              { name: 'Hot Tawa Butter Rotis', category: 'bread' },
              { name: 'Basmati Jeera Rice', category: 'rice' },
              { name: 'Sweet Mango Chutney & Pickle', category: 'side' },
              { name: 'Lauki Raita with Roasted Cumin', category: 'side' },
              { name: 'Rasgulla (2 pcs)', category: 'sweet', isSpecial: true },
            ],
          },
          dinner: {
            slotId: 'dinner',
            title: 'Dinner (Raat ka Khana)',
            hindiTitle: 'रात का भोजन',
            icon: 'Moon',
            timing: '07:30 PM - 10:15 PM',
            startTime: '19:30',
            endTime: '22:15',
            estimatedCalories: 600,
            proteinGrams: 20,
            chefNote: 'Wholesome mix veg kofta with soft rotis and lemon rice.',
            highlightDish: 'Malai Kofta & Moong Dal Tadka',
            items: [
              { name: 'Creamy Shahi Malai Kofta', category: 'main', isSpecial: true },
              { name: 'Yellow Moong Dal Tadka', category: 'dal' },
              { name: 'Hot Desi Phulkas', category: 'bread' },
              { name: 'Lemon Turmeric Rice', category: 'rice' },
              { name: 'Kachumber Salad', category: 'side' },
              { name: 'Roasted Masala Papad', category: 'side' },
              { name: 'Rice Kheer with Almonds', category: 'sweet' },
            ],
          },
        },
      },
      {
        dayName: 'Thursday',
        shortDay: 'Thu',
        meals: {
          breakfast: {
            slotId: 'breakfast',
            title: 'Breakfast (Nashta)',
            hindiTitle: 'सुबह का नाश्ता',
            icon: 'Sunrise',
            timing: '07:30 AM - 10:00 AM',
            startTime: '07:30',
            endTime: '10:00',
            estimatedCalories: 390,
            proteinGrams: 15,
            chefNote: 'Healthy roasted vermicelli upma & sprouts chaat.',
            highlightDish: 'Veg Vermicelli Upma & Boiled Sprouts',
            items: [
              { name: 'Veggie Vermicelli Upma with Cashews', category: 'main', isSpecial: true },
              { name: 'High-Protein Moong Sprouts Chaat', category: 'side' },
              { name: 'Coconut Podi Chutney', category: 'side' },
              { name: 'Seasonal Fruit (Papaya / Banana)', category: 'side' },
              { name: 'Hot Elaichi Chai / Warm Milk', category: 'beverage' },
            ],
          },
          lunch: {
            slotId: 'lunch',
            title: 'Lunch (Dopahar Bhojan)',
            hindiTitle: 'दोपहर का खाना',
            icon: 'Sun',
            timing: '12:30 PM - 03:30 PM',
            startTime: '12:30',
            endTime: '15:30',
            estimatedCalories: 670,
            proteinGrams: 23,
            chefNote: 'Authentic Rajasthani Gatte ki Sabji with Panchmel Dal.',
            highlightDish: 'Govind Gatte ki Sabji & Dal Bikaneri',
            items: [
              { name: 'Rajasthani Gatte ki Sabji in Curd Gravy', category: 'main', isSpecial: true },
              { name: 'Panchratna Bikaneri Dal', category: 'dal' },
              { name: 'Unlimited Butter Rotis', category: 'bread' },
              { name: 'Veg Corn Pulao', category: 'rice' },
              { name: 'Mint Cucumber Raita', category: 'side' },
              { name: 'Kachumber Salad & Lemon', category: 'side' },
              { name: 'Besan Ladoo (1 pc)', category: 'sweet' },
            ],
          },
          dinner: {
            slotId: 'dinner',
            title: 'Dinner (Raat ka Khana)',
            hindiTitle: 'रात का भोजन',
            icon: 'Moon',
            timing: '07:30 PM - 10:15 PM',
            startTime: '19:30',
            endTime: '22:15',
            estimatedCalories: 620,
            proteinGrams: 20,
            chefNote: 'Crispy Bhindi fry with rich Chana Dal.',
            highlightDish: 'Bhindi Do Pyaza & Chana Dal Masala',
            items: [
              { name: 'Crispy Bhindi Do Pyaza', category: 'main', isSpecial: true },
              { name: 'Chana Dal with Desi Ghee & Hing', category: 'dal' },
              { name: 'Hot Tawa Phulkas', category: 'bread' },
              { name: 'Steamed Rice', category: 'rice' },
              { name: 'Roasted Papad & Pickle', category: 'side' },
              { name: 'Fresh Green Salad', category: 'side' },
              { name: 'Warm Gajar ka Halwa', category: 'sweet', isSpecial: true },
            ],
          },
        },
      },
      {
        dayName: 'Friday',
        shortDay: 'Fri',
        meals: {
          breakfast: {
            slotId: 'breakfast',
            title: 'Breakfast (Nashta)',
            hindiTitle: 'सुबह का नाश्ता',
            icon: 'Sunrise',
            timing: '07:30 AM - 10:00 AM',
            startTime: '07:30',
            endTime: '10:00',
            estimatedCalories: 460,
            proteinGrams: 16,
            chefNote: 'Crispy Puri with Halwai style Aloo Tamatar rasedaar sabji.',
            highlightDish: 'Bedmi Puri & Mathura Aloo Rasedaar',
            items: [
              { name: 'Hot Fluffy Puris (4 pcs)', category: 'bread', isSpecial: true },
              { name: 'Mathura Ke Aloo Tamatar Sabji', category: 'main', isSpecial: true },
              { name: 'Sweet Sooji Kesari Halwa', category: 'sweet' },
              { name: 'Mixed Pickle & Green Chilli', category: 'side' },
              { name: 'Adrak Elaichi Chai', category: 'beverage' },
            ],
          },
          lunch: {
            slotId: 'lunch',
            title: 'Lunch (Dopahar Bhojan)',
            hindiTitle: 'दोपहर का खाना',
            icon: 'Sun',
            timing: '12:30 PM - 03:30 PM',
            startTime: '12:30',
            endTime: '15:30',
            estimatedCalories: 700,
            proteinGrams: 25,
            chefNote: 'Friday special Mattar Paneer with aromatic Jeera Rice & Dal Tadka.',
            highlightDish: 'Mattar Paneer & Lasooni Dal Tadka',
            items: [
              { name: 'Rich Mattar Paneer Gravy', category: 'main', isSpecial: true },
              { name: 'Lasooni Dal Tadka (Garlic Infused)', category: 'dal' },
              { name: 'Hot Tawa Rotis with Butter', category: 'bread' },
              { name: 'Royal Jeera Basmati Rice', category: 'rice' },
              { name: 'Dahi Vada with Sweet Tamarind Chutney', category: 'side', isSpecial: true },
              { name: 'Green Salad with Lemon', category: 'side' },
              { name: 'Angoori Rasgulla', category: 'sweet' },
            ],
          },
          dinner: {
            slotId: 'dinner',
            title: 'Dinner (Raat ka Khana)',
            hindiTitle: 'रात का भोजन',
            icon: 'Moon',
            timing: '07:30 PM - 10:15 PM',
            startTime: '19:30',
            endTime: '22:15',
            estimatedCalories: 640,
            proteinGrams: 21,
            chefNote: 'Warm comfort meal with high-protein soya chaap masala.',
            highlightDish: 'Soya Chaap Curry & Dal Makhani',
            items: [
              { name: 'Punjabi Soya Chaap Masala Gravy', category: 'main', isSpecial: true },
              { name: 'Slow Cooked Dal Makhani', category: 'dal' },
              { name: 'Hot Butter Phulkas', category: 'bread' },
              { name: 'Peas Pulao', category: 'rice' },
              { name: 'Onion Rings with Chaat Masala', category: 'side' },
              { name: 'Crispy Masala Papad', category: 'side' },
              { name: 'Vanilla Ice Cream Cup', category: 'sweet', isSpecial: true },
            ],
          },
        },
      },
      {
        dayName: 'Saturday',
        shortDay: 'Sat',
        meals: {
          breakfast: {
            slotId: 'breakfast',
            title: 'Breakfast (Nashta)',
            hindiTitle: 'सुबह का नाश्ता',
            icon: 'Sunrise',
            timing: '07:30 AM - 10:00 AM',
            startTime: '07:30',
            endTime: '10:00',
            estimatedCalories: 430,
            proteinGrams: 15,
            chefNote: 'Crispy onion uttapam with piping hot sambhar & coconut chutney.',
            highlightDish: 'Veg Onion Uttapam & Medu Vada',
            items: [
              { name: 'Crispy Veg Onion Uttapam (2 pcs)', category: 'main', isSpecial: true },
              { name: 'Crispy Medu Vada (1 pc)', category: 'side' },
              { name: 'South Indian Veg Sambhar', category: 'dal' },
              { name: 'Fresh Coconut & Red Chilli Chutneys', category: 'side' },
              { name: 'Filter Coffee / Chai', category: 'beverage' },
            ],
          },
          lunch: {
            slotId: 'lunch',
            title: 'Lunch (Dopahar Bhojan)',
            hindiTitle: 'दोपहर का खाना',
            icon: 'Sun',
            timing: '12:30 PM - 03:30 PM',
            startTime: '12:30',
            endTime: '15:30',
            estimatedCalories: 690,
            proteinGrams: 22,
            chefNote: 'Saturday festive special Gujarati Kadhi with Khichdi & Aloo Sukha.',
            highlightDish: 'Kadhi Pakoda & Hyderabadi Veg Biryani',
            items: [
              { name: 'Dahi Pakoda Kadhi (Sweet & Sour)', category: 'main', isSpecial: true },
              { name: 'Aromatic Hyderabadi Veg Dum Biryani', category: 'rice', isSpecial: true },
              { name: 'Jeera Aloo Fry', category: 'side' },
              { name: 'Tawa Butter Rotis', category: 'bread' },
              { name: 'Burani Garlic Raita', category: 'side' },
              { name: 'Fried Papad & Pickle', category: 'side' },
              { name: 'Kala Jamun', category: 'sweet' },
            ],
          },
          dinner: {
            slotId: 'dinner',
            title: 'Dinner (Raat ka Khana)',
            hindiTitle: 'रात का भोजन',
            icon: 'Moon',
            timing: '07:30 PM - 10:15 PM',
            startTime: '19:30',
            endTime: '22:15',
            estimatedCalories: 650,
            proteinGrams: 23,
            chefNote: 'Paneer Do Pyaza with garlic naan/rotis for the weekend kickoff.',
            highlightDish: 'Paneer Do Pyaza & Yellow Dal Fry',
            items: [
              { name: 'Paneer Do Pyaza Gravy', category: 'main', isSpecial: true },
              { name: 'Toor Dal Fry with Kashmiri Chilli', category: 'dal' },
              { name: 'Tawa Phulkas with Pure Ghee', category: 'bread' },
              { name: 'Steamed Basmati Rice', category: 'rice' },
              { name: 'Cucumber Salad', category: 'side' },
              { name: 'Papad', category: 'side' },
              { name: 'Hot Brownie / Sweet Halwa', category: 'sweet', isSpecial: true },
            ],
          },
        },
      },
      {
        dayName: 'Sunday',
        shortDay: 'Sun',
        meals: {
          breakfast: {
            slotId: 'breakfast',
            title: 'Breakfast (Nashta)',
            hindiTitle: 'सुबह का नाश्ता',
            icon: 'Sunrise',
            timing: '08:00 AM - 10:30 AM',
            startTime: '08:00',
            endTime: '10:30',
            estimatedCalories: 520,
            proteinGrams: 18,
            chefNote: 'Grand Sunday Feast! Bhature with authentic Amritsari Chole.',
            highlightDish: 'Chole Bhature & Sweet Lassi',
            items: [
              { name: 'Puffy Crispy Bhature (2 pcs)', category: 'bread', isSpecial: true },
              { name: 'Amritsari Spicy Chole (Unlimited)', category: 'main', isSpecial: true },
              { name: 'Chilled Sweet Punjabi Lassi Glass', category: 'beverage', isSpecial: true },
              { name: 'Sirka Pyaz, Pickle & Green Chilli', category: 'side' },
              { name: 'Boiled Sprouts Salad Bowl', category: 'side' },
            ],
          },
          lunch: {
            slotId: 'lunch',
            title: 'Lunch (Dopahar Bhojan)',
            hindiTitle: 'दोपहर का खाना',
            icon: 'Sun',
            timing: '12:30 PM - 03:30 PM',
            startTime: '12:30',
            endTime: '15:30',
            estimatedCalories: 740,
            proteinGrams: 28,
            chefNote: 'Sunday Grand Thali with Shahi Paneer, Veg Korma & Gulab Jamun.',
            highlightDish: 'Shahi Paneer, Veg Korma & Dal Makhani',
            items: [
              { name: 'Royal Shahi Paneer Gravy', category: 'main', isSpecial: true },
              { name: 'Mix Veg Mughlai Korma', category: 'side' },
              { name: 'Dal Makhani with Fresh Cream', category: 'dal', isSpecial: true },
              { name: 'Butter Tawa Naan / Phulkas', category: 'bread' },
              { name: 'Jeera Fried Rice', category: 'rice' },
              { name: 'Pineapple Sweet Raita', category: 'side' },
              { name: 'Warm Gulab Jamun (2 pcs)', category: 'sweet', isSpecial: true },
            ],
          },
          dinner: {
            slotId: 'dinner',
            title: 'Dinner (Raat ka Khana)',
            hindiTitle: 'रात का भोजन',
            icon: 'Moon',
            timing: '07:30 PM - 10:15 PM',
            startTime: '19:30',
            endTime: '22:15',
            estimatedCalories: 610,
            proteinGrams: 20,
            chefNote: 'Light comfort dinner before Monday classes start.',
            highlightDish: 'Veg Kofta Curry & Moong Dal Tadka',
            items: [
              { name: 'Spiced Veg Kofta Curry', category: 'main', isSpecial: true },
              { name: 'Moong Dal with Hing & Jeera', category: 'dal' },
              { name: 'Fresh Soft Tawa Phulkas', category: 'bread' },
              { name: 'Steamed Rice', category: 'rice' },
              { name: 'Bikaneri Roasted Papad', category: 'side' },
              { name: 'Green Salad', category: 'side' },
              { name: 'Matka Kulfi / Ice Cream', category: 'sweet', isSpecial: true },
            ],
          },
        },
      },
    ],
  },
  {
    id: 'mess_shivaay',
    name: 'Shivaay Royal Dining & Mess',
    campusArea: 'Cross Street 23, Smriti Nagar • 200m from CS Dept',
    fssaiNumber: 'FSSAI Lic. 104210004519',
    hygieneScore: '4.8/5.0 (Audited This Week)',
    monthlyPlanPrice: 2600,
    rating: 4.8,
    totalSubscribers: 310,
    dietaryType: 'Jain & Veg',
    weeklyMenu: [], // Can fallback to Annapurna with Jain indicators
  },
  {
    id: 'mess_mahalaxmi',
    name: 'Mahalaxmi South & North Indian Mess',
    campusArea: 'Nehru Nagar East • Near Girls Hostel Gate',
    fssaiNumber: 'FSSAI Lic. 104240003112',
    hygieneScore: '4.9/5.0 (Audited Today)',
    monthlyPlanPrice: 2500,
    rating: 4.9,
    totalSubscribers: 280,
    dietaryType: 'Pure Veg',
    weeklyMenu: [],
  },
];

/**
 * Helper to determine current active meal based on time of day
 */
export function getCurrentMealStatus(): {
  currentMeal: 'breakfast' | 'lunch' | 'dinner' | 'closed';
  label: string;
  badgeColor: string;
} {
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  // Breakfast: 07:00 (420) to 10:30 (630)
  if (currentMinutes >= 420 && currentMinutes <= 630) {
    return { currentMeal: 'breakfast', label: 'Breakfast (Nashta) Serving Now', badgeColor: '#16A34A' };
  }
  // Transition to lunch: 10:31 to 12:29
  if (currentMinutes > 630 && currentMinutes < 750) {
    return { currentMeal: 'lunch', label: 'Lunch Cooking in Kitchen (Starts 12:30 PM)', badgeColor: '#EAB308' };
  }
  // Lunch: 12:30 (750) to 15:45 (945)
  if (currentMinutes >= 750 && currentMinutes <= 945) {
    return { currentMeal: 'lunch', label: 'Lunch Serving Now', badgeColor: '#16A34A' };
  }
  // Transition to dinner: 15:46 to 19:29
  if (currentMinutes > 945 && currentMinutes < 1170) {
    return { currentMeal: 'dinner', label: 'Dinner Being Prepared (Starts 7:30 PM)', badgeColor: '#EAB308' };
  }
  // Dinner: 19:30 (1170) to 22:30 (1350)
  if (currentMinutes >= 1170 && currentMinutes <= 1350) {
    return { currentMeal: 'dinner', label: 'Dinner Serving Now', badgeColor: '#16A34A' };
  }

  // Late night / early morning
  return { currentMeal: 'breakfast', label: 'Kitchen Prepping Tomorrow Breakfast', badgeColor: '#64748B' };
}

/**
 * Helper to get today's day name
 */
export function getTodayDayName(): 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday' {
  const days: ('Sunday' | 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday')[] = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];
  return days[new Date().getDay()];
}
