export type BazaarCategory =
  | 'books-notes'
  | 'electronics'
  | 'hostel-living'
  | 'vehicles-cycles'
  | 'gym-sports'
  | 'stationery-tools';

export type ItemCondition = 'brand-new' | 'like-new' | 'good' | 'fair';

export type ListingStatus = 'active' | 'negotiating' | 'sold' | 'rejected';

export interface BazaarItem {
  id: string;
  title: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: BazaarCategory;
  condition: ItemCondition;
  sellerId: string;
  sellerName: string;
  sellerEmail?: string;
  sellerPhone: string;
  sellerHostel: string;
  campusId: string;
  images: string[];
  createdAt: string;
  status: ListingStatus;
  viewsCount: number;
  offersCount: number;
  isFeatured?: boolean;
  rentalAvailable?: boolean;
  rentalRate?: string;
}

export interface OfferItem {
  id: string;
  itemId: string;
  itemTitle: string;
  itemPrice: number;
  offeredAmount: number;
  buyerId: string;
  buyerName: string;
  buyerPhone: string;
  sellerId: string;
  sellerName: string;
  status: 'pending' | 'accepted' | 'declined' | 'countered';
  counterAmount?: number;
  timestamp: string;
}

export interface ChatMessage {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: string;
  isOffer?: boolean;
  offerData?: {
    offeredAmount: number;
    status: 'pending' | 'accepted' | 'declined';
    offerId?: string;
  };
  exchangeLocation?: string;
}

export interface Conversation {
  id: string;
  itemId: string;
  itemTitle: string;
  itemPrice: number;
  itemImage: string;
  buyerId: string;
  buyerName: string;
  sellerId: string;
  sellerName: string;
  sellerPhone: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  messages: ChatMessage[];
  currentOffer?: {
    amount: number;
    status: 'pending' | 'accepted' | 'declined';
  };
}
