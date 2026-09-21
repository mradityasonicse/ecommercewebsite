import type { BazaarItem, BazaarCategory, ItemCondition, OfferItem } from '../types/bazaar';

const BAZAAR_ITEMS_KEY = 'easehub_bazaar_items';
const OFFERS_KEY = 'easehub_bazaar_offers';

export const SEED_BAZAAR_ITEMS: BazaarItem[] = [
  {
    id: 'bz_item_1',
    title: 'Symphony Touch 35L Personal Air Cooler',
    description: 'Perfect for hostel summer months. Low power consumption, honeycomb pads, completely clean and serviced. Includes 2 ice packs.',
    price: 2199,
    originalPrice: 5499,
    category: 'hostel-living',
    condition: 'like-new',
    sellerId: 'user_rahul_99',
    sellerName: 'Rahul Verma (4th Sem CSE)',
    sellerPhone: '+91 98270 11223',
    sellerHostel: 'Hostel Block B, Room 314',
    campusId: 'rungta-bhilai',
    images: [
      'https://images.unsplash.com/photo-1585771724684-38269d6639fd?auto=format&fit=crop&w=600&q=80',
    ],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
    status: 'active',
    viewsCount: 142,
    offersCount: 3,
    isFeatured: true,
    rentalAvailable: true,
    rentalRate: '₹350/mo',
  },
  {
    id: 'bz_item_2',
    title: 'Engineering Graphics Drafter + Omega Mini Drafter Board',
    description: 'Essential for 1st & 2nd Year Mechanical & Civil students. Perfect scale calibration, free carrying cover and clips included.',
    price: 450,
    originalPrice: 1200,
    category: 'stationery-tools',
    condition: 'like-new',
    sellerId: 'user_sneha_21',
    sellerName: 'Sneha Roy (6th Sem Mech)',
    sellerPhone: '+91 94250 44556',
    sellerHostel: 'Girls Hostel 1, Room 202',
    campusId: 'rungta-bhilai',
    images: [
      'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80',
    ],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    status: 'active',
    viewsCount: 98,
    offersCount: 2,
    isFeatured: true,
  },
  {
    id: 'bz_item_3',
    title: 'Hero Sprint Pro 21-Speed Alloy Bicycle',
    description: 'Dual disc brakes, front suspension, smooth Shimano gear shifting. Great for commuting between campus gates and local market.',
    price: 2899,
    originalPrice: 7500,
    category: 'vehicles-cycles',
    condition: 'good',
    sellerId: 'user_aditya_11',
    sellerName: 'Aditya Soni (Final Year)',
    sellerPhone: '+91 91790 60786',
    sellerHostel: 'Hostel Block C, Room 108',
    campusId: 'rungta-bhilai',
    images: [
      'https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=600&q=80',
    ],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    status: 'active',
    viewsCount: 215,
    offersCount: 5,
    isFeatured: true,
  },
  {
    id: 'bz_item_4',
    title: 'Cengage Advanced Mathematics Set (5 Books)',
    description: 'Calculus, Algebra, Coordinate Geometry, Vectors & Trigonometry. Clean pages with pencil notes, zero tears. Complete set.',
    price: 850,
    originalPrice: 3200,
    category: 'books-notes',
    condition: 'good',
    sellerId: 'user_priya_44',
    sellerName: 'Priya Sharma (ECE)',
    sellerPhone: '+91 99887 66554',
    sellerHostel: 'Girls Hostel 2, Room 405',
    campusId: 'rungta-bhilai',
    images: [
      'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=600&q=80',
    ],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
    status: 'active',
    viewsCount: 88,
    offersCount: 1,
  },
  {
    id: 'bz_item_5',
    title: 'Pigeon Cruise 1800W Induction Cooktop',
    description: 'Hostel late night Maggi, tea & eggs lifesaver. Auto shut-off, 7 Indian preset menus. 100% working condition.',
    price: 1099,
    originalPrice: 2495,
    category: 'electronics',
    condition: 'like-new',
    sellerId: 'user_karan_55',
    sellerName: 'Karan Mehra (IT)',
    sellerPhone: '+91 97711 22334',
    sellerHostel: 'Hostel Block A, Room 215',
    campusId: 'rungta-bhilai',
    images: [
      'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=600&q=80',
    ],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 80).toISOString(),
    status: 'active',
    viewsCount: 173,
    offersCount: 4,
  },
  {
    id: 'bz_item_6',
    title: 'Portronics Foldable Ergonomic Laptop Bed Table',
    description: 'Adjustable angle with tablet/phone slot and cup holder. Anti-skid rubber feet. Sturdy for long night study sessions.',
    price: 399,
    originalPrice: 1199,
    category: 'hostel-living',
    condition: 'like-new',
    sellerId: 'user_vikram_82',
    sellerName: 'Vikram Singh (Civil)',
    sellerPhone: '+91 93456 78901',
    sellerHostel: 'Hostel Block B, Room 112',
    campusId: 'rungta-bhilai',
    images: [
      'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=600&q=80',
    ],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 96).toISOString(),
    status: 'active',
    viewsCount: 64,
    offersCount: 1,
  },
];

export class BazaarService {
  public static getItems(params?: {
    category?: BazaarCategory | 'all';
    condition?: ItemCondition | 'all';
    search?: string;
    campusId?: string;
    status?: string;
  }): BazaarItem[] {
    if (typeof window === 'undefined') return SEED_BAZAAR_ITEMS;
    let items: BazaarItem[] = [];
    try {
      const saved = localStorage.getItem(BAZAAR_ITEMS_KEY);
      if (saved) {
        items = JSON.parse(saved);
      } else {
        items = [...SEED_BAZAAR_ITEMS];
        localStorage.setItem(BAZAAR_ITEMS_KEY, JSON.stringify(items));
      }
    } catch {
      items = [...SEED_BAZAAR_ITEMS];
    }

    if (!params) return items;

    return items.filter(item => {
      if (params.category && params.category !== 'all' && item.category !== params.category) {
        return false;
      }
      if (params.condition && params.condition !== 'all' && item.condition !== params.condition) {
        return false;
      }
      if (params.status && params.status !== 'all' && item.status !== params.status) {
        return false;
      }
      if (params.search && params.search.trim()) {
        const query = params.search.toLowerCase().trim();
        const matchesTitle = item.title.toLowerCase().includes(query);
        const matchesDesc = item.description.toLowerCase().includes(query);
        const matchesSeller = item.sellerName.toLowerCase().includes(query);
        const matchesHostel = item.sellerHostel.toLowerCase().includes(query);
        if (!matchesTitle && !matchesDesc && !matchesSeller && !matchesHostel) return false;
      }
      return true;
    });
  }

  public static getItemById(id: string): BazaarItem | null {
    const items = this.getItems();
    const found = items.find(i => i.id === id);
    return found ? { ...found } : null;
  }

  public static createItem(itemData: Omit<BazaarItem, 'id' | 'createdAt' | 'viewsCount' | 'offersCount' | 'status'>): BazaarItem {
    const newItem: BazaarItem = {
      ...itemData,
      id: `bz_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      createdAt: new Date().toISOString(),
      viewsCount: 1,
      offersCount: 0,
      status: 'active',
    };

    const current = this.getItems();
    const updated = [newItem, ...current];
    try {
      localStorage.setItem(BAZAAR_ITEMS_KEY, JSON.stringify(updated));
    } catch {
      // Storage unavailable
    }
    return newItem;
  }

  public static updateItem(id: string, updates: Partial<BazaarItem>): BazaarItem | null {
    const items = this.getItems();
    const idx = items.findIndex(i => i.id === id);
    if (idx === -1) return null;

    items[idx] = { ...items[idx], ...updates };
    try {
      localStorage.setItem(BAZAAR_ITEMS_KEY, JSON.stringify(items));
    } catch {
      // Storage unavailable
    }
    return items[idx];
  }

  public static deleteItem(id: string): boolean {
    const items = this.getItems();
    const filtered = items.filter(i => i.id !== id);
    try {
      localStorage.setItem(BAZAAR_ITEMS_KEY, JSON.stringify(filtered));
      return true;
    } catch {
      return false;
    }
  }

  public static getOffers(itemId?: string): OfferItem[] {
    if (typeof window === 'undefined') return [];
    try {
      const saved = localStorage.getItem(OFFERS_KEY);
      const list: OfferItem[] = saved ? JSON.parse(saved) : [];
      if (itemId) return list.filter(o => o.itemId === itemId);
      return list;
    } catch {
      return [];
    }
  }

  public static createOffer(offerData: Omit<OfferItem, 'id' | 'timestamp' | 'status'>): OfferItem {
    const newOffer: OfferItem = {
      ...offerData,
      id: `off_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
      status: 'pending',
      timestamp: new Date().toISOString(),
    };

    const offers = this.getOffers();
    const updated = [newOffer, ...offers];
    try {
      localStorage.setItem(OFFERS_KEY, JSON.stringify(updated));
      // Also increment offer count on item
      const item = this.getItemById(offerData.itemId);
      if (item) {
        this.updateItem(item.id, { offersCount: (item.offersCount || 0) + 1 });
      }
    } catch {
      // Storage unavailable
    }
    return newOffer;
  }

  public static updateOfferStatus(offerId: string, status: 'accepted' | 'declined' | 'countered', counterAmount?: number): OfferItem | null {
    const offers = this.getOffers();
    const idx = offers.findIndex(o => o.id === offerId);
    if (idx === -1) return null;

    offers[idx] = {
      ...offers[idx],
      status,
      counterAmount: counterAmount !== undefined ? counterAmount : offers[idx].counterAmount,
    };

    try {
      localStorage.setItem(OFFERS_KEY, JSON.stringify(offers));
      if (status === 'accepted') {
        this.updateItem(offers[idx].itemId, { status: 'negotiating' });
      }
    } catch {
      // Storage unavailable
    }
    return offers[idx];
  }
}
