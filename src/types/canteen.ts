export type CanteenCategory = 'all' | 'maggi' | 'beverages' | 'snacks' | 'exam_fuel';

export interface CanteenItem {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: 'maggi' | 'beverages' | 'snacks' | 'exam_fuel';
  tag?: string;
  isVeg: boolean;
  isPopular?: boolean;
  iconName: string;
  prepTimeMinutes: number;
  calories?: string;
}

export interface CanteenCartItem {
  item: CanteenItem;
  quantity: number;
}

export interface HostelDropPoint {
  id: string;
  name: string;
  area: string;
  avgMinutes: number;
}
