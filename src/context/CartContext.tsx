import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

export interface CartItem {
  id: string;
  slug: string;
  name: string;
  category: 'meals' | 'laundry' | 'pg' | 'canteen' | 'extra' | string;
  priceText: string;
  numericPrice: number;
  periodText?: string;
  quantity: number;
  imageUrl?: string;
  providerName?: string;
  optionName?: string;
}

export interface DeliveryDetails {
  hostelBlock: string;
  roomNumber: string;
  studentName: string;
  studentPhone: string;
  specialInstructions?: string;
}

interface CartContextType {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  discountAmount: number;
  deliveryFee: number;
  grandTotal: number;
  appliedCoupon: string | null;
  isCartOpen: boolean;
  deliveryDetails: DeliveryDetails;
  addItem: (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, delta: number) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  setDeliveryDetails: React.Dispatch<React.SetStateAction<DeliveryDetails>>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const STORAGE_KEY_CART = 'easehub_commerce_cart_v1';
const STORAGE_KEY_COUPON = 'easehub_commerce_coupon_v1';

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();

  const [items, setItems] = useState<CartItem[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const saved = localStorage.getItem(STORAGE_KEY_CART);
      if (saved) return JSON.parse(saved);
    } catch {}
    // Initial starter demo item so user sees immediate shopping cart capability
    return [
      {
        id: 'cart-mess-starter',
        slug: 'mess',
        name: 'Annapurna Deluxe Student Thali (Daily)',
        category: 'meals',
        priceText: '₹95',
        numericPrice: 95,
        periodText: 'per meal',
        quantity: 1,
        imageUrl: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=300&auto=format&fit=crop&q=80',
        providerName: 'Annapurna Royal Dining',
        optionName: 'Lunch Deluxe Thali',
      },
    ];
  });

  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(() => {
    if (typeof window === 'undefined') return null;
    try {
      return localStorage.getItem(STORAGE_KEY_COUPON);
    } catch {
      return null;
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);

  const [deliveryDetails, setDeliveryDetails] = useState<DeliveryDetails>(() => ({
    hostelBlock: user?.hostelBlock || 'Block B',
    roomNumber: user?.roomNumber || '304',
    studentName: user?.name || 'Campus Resident',
    studentPhone: user?.phone || '+91 98765 43210',
    specialInstructions: 'Hostel gate arrival call',
  }));

  // Update delivery details when user profile updates
  useEffect(() => {
    if (user) {
      setDeliveryDetails((prev) => ({
        ...prev,
        hostelBlock: user.hostelBlock || prev.hostelBlock,
        roomNumber: user.roomNumber || prev.roomNumber,
        studentName: user.name || prev.studentName,
        studentPhone: user.phone || prev.studentPhone,
      }));
    }
  }, [user]);

  // Sync with localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_CART, JSON.stringify(items));
    } catch {}
  }, [items]);

  useEffect(() => {
    try {
      if (appliedCoupon) localStorage.setItem(STORAGE_KEY_COUPON, appliedCoupon);
      else localStorage.removeItem(STORAGE_KEY_COUPON);
    } catch {}
  }, [appliedCoupon]);

  const addItem = (itemToAdd: Omit<CartItem, 'quantity'> & { quantity?: number }) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.id === itemToAdd.id);
      if (existing) {
        return prev.map((i) =>
          i.id === itemToAdd.id ? { ...i, quantity: i.quantity + (itemToAdd.quantity || 1) } : i
        );
      }
      return [...prev, { ...itemToAdd, quantity: itemToAdd.quantity || 1 }];
    });
    setIsCartOpen(true);
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const updateQuantity = (id: string, delta: number) => {
    setItems((prev) =>
      prev
        .map((i) => {
          if (i.id === id) {
            const newQty = i.quantity + delta;
            return newQty > 0 ? { ...i, quantity: newQty } : null;
          }
          return i;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const clearCart = () => {
    setItems([]);
    try {
      localStorage.removeItem(STORAGE_KEY_CART);
    } catch {}
  };

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);
  const toggleCart = () => setIsCartOpen((prev) => !prev);

  // Totals calculations
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + item.numericPrice * item.quantity, 0);

  // Campus coupons
  let discountAmount = 0;
  if (appliedCoupon === 'CAMPUS50') {
    discountAmount = Math.min(50, subtotal * 0.2);
  } else if (appliedCoupon === 'FRESHER100' || appliedCoupon === 'EASEHUBVIP') {
    discountAmount = Math.min(100, subtotal * 0.3);
  }

  const deliveryFee = 0; // Free on-campus hostel delivery
  const grandTotal = Math.max(0, subtotal - discountAmount + deliveryFee);

  const applyCoupon = (code: string) => {
    const clean = code.trim().toUpperCase();
    if (clean === 'CAMPUS50' || clean === 'FRESHER100' || clean === 'EASEHUBVIP') {
      setAppliedCoupon(clean);
      return { success: true, message: `Promo code ${clean} successfully applied!` };
    }
    return { success: false, message: 'Invalid promo code. Try: CAMPUS50 or FRESHER100' };
  };

  const removeCoupon = () => setAppliedCoupon(null);

  return (
    <CartContext.Provider
      value={{
        items,
        itemCount,
        subtotal,
        discountAmount,
        deliveryFee,
        grandTotal,
        appliedCoupon,
        isCartOpen,
        deliveryDetails,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        openCart,
        closeCart,
        toggleCart,
        applyCoupon,
        removeCoupon,
        setDeliveryDetails,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
