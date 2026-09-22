import React, { useState, useEffect } from 'react';
import { ShoppingBag } from 'lucide-react';
import { useCart } from '../../context/CartContext';

export const FloatingCartButton: React.FC = () => {
  const { itemCount, toggleCart, grandTotal } = useCart();
  const [isMobile, setIsMobile] = useState<boolean>(() => typeof window !== 'undefined' && window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (itemCount === 0) return null;

  return (
    <button
      type="button"
      onClick={toggleCart}
      aria-label="Open Campus Shopping Cart"
      style={{
        position: 'fixed',
        bottom: isMobile ? '82px' : '24px',
        right: 'clamp(14px, 3vw, 24px)',
        zIndex: 9990,
        backgroundColor: '#16A34A',
        color: '#FFFFFF',
        border: '2px solid rgba(255, 255, 255, 0.4)',
        borderRadius: '9999px',
        padding: '0.6rem 1.1rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.65rem',
        boxShadow: '0 10px 25px -5px rgba(22, 163, 74, 0.5), 0 0 20px rgba(22, 163, 74, 0.25)',
        cursor: 'pointer',
        fontSize: '0.88rem',
        fontWeight: 800,
        transition: 'transform 0.18s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.18s ease, bottom 0.2s ease',
        touchAction: 'manipulation',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'scale(1.05) translateY(-2px)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'none';
      }}
    >
      <div style={{ position: 'relative' }}>
        <ShoppingBag size={20} />
        <span
          style={{
            position: 'absolute',
            top: '-8px',
            right: '-10px',
            backgroundColor: '#DC2626',
            color: '#FFFFFF',
            borderRadius: '9999px',
            fontSize: '0.66rem',
            fontWeight: 900,
            padding: '1px 5px',
            border: '2px solid #FFFFFF',
          }}
        >
          {itemCount}
        </span>
      </div>

      <span>Cart • ₹{grandTotal}</span>
    </button>
  );
};

