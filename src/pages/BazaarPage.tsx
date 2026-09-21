import React, { useState, useEffect } from 'react';
import {
  ShoppingBag,
  Plus,
  Search,
  ShieldCheck,
  MessageCircle,
  QrCode,
  MapPin,
  Sparkles,
  X,
} from 'lucide-react';
import { BazaarService } from '../services/bazaarService';
import type { BazaarItem, BazaarCategory, ItemCondition } from '../types/bazaar';
import { BazaarChatModal } from '../components/chat/BazaarChatModal';
import { UpiPaymentModal } from '../components/payment/UpiPaymentModal';

const CATEGORIES: { id: BazaarCategory | 'all'; label: string; icon: string }[] = [
  { id: 'all', label: 'All Items', icon: '🛍️' },
  { id: 'hostel-living', label: 'Hostel & Room', icon: '❄️' },
  { id: 'books-notes', label: 'Books & Notes', icon: '📚' },
  { id: 'electronics', label: 'Electronics', icon: '⚡' },
  { id: 'vehicles-cycles', label: 'Bicycles & Rides', icon: '🚲' },
  { id: 'stationery-tools', label: 'Lab & Drafters', icon: '📐' },
];

export const BazaarPage: React.FC = () => {
  const [items, setItems] = useState<BazaarItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<BazaarCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeItemForChat, setActiveItemForChat] = useState<BazaarItem | null>(null);
  const [activeItemForPay, setActiveItemForPay] = useState<BazaarItem | null>(null);
  const [isPostAdOpen, setIsPostAdOpen] = useState(false);

  // New Item Form State
  const [newTitle, setNewTitle] = useState('');
  const [newPrice, setNewPrice] = useState<number | ''>('');
  const [newOriginalPrice, setNewOriginalPrice] = useState<number | ''>('');
  const [newCategory, setNewCategory] = useState<BazaarCategory>('hostel-living');
  const [newCondition, setNewCondition] = useState<ItemCondition>('like-new');
  const [newDescription, setNewDescription] = useState('');
  const [newHostel, setNewHostel] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newSellerName, setNewSellerName] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  const loadItems = () => {
    const list = BazaarService.getItems({
      category: selectedCategory,
      search: searchQuery,
      status: 'active',
    });
    setItems(list);
  };

  useEffect(() => {
    loadItems();
  }, [selectedCategory, searchQuery]);

  const handlePostAd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newPrice || !newPhone.trim()) return;

    BazaarService.createItem({
      title: newTitle.trim(),
      description: newDescription.trim() || 'Genuine student item in clean working condition.',
      price: Number(newPrice),
      originalPrice: newOriginalPrice ? Number(newOriginalPrice) : undefined,
      category: newCategory,
      condition: newCondition,
      sellerId: `user_${Date.now()}`,
      sellerName: newSellerName.trim() || 'Campus Student',
      sellerPhone: newPhone.trim(),
      sellerHostel: newHostel.trim() || 'Hostel Campus',
      campusId: 'rungta-bhilai',
      images: [
        imageUrl.trim() ||
          'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=600&q=80',
      ],
    });

    setIsPostAdOpen(false);
    // Reset Form
    setNewTitle('');
    setNewPrice('');
    setNewOriginalPrice('');
    setNewDescription('');
    setImageUrl('');
    loadItems();
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F8FAF7', color: '#0F172A', paddingBottom: '5rem' }}>
      {/* Hero Header */}
      <section
        style={{
          background: 'linear-gradient(180deg, #EFF5EC 0%, #F8FAF7 100%)',
          padding: '7rem 1.5rem 2.5rem',
          textAlign: 'center',
          borderBottom: '1px solid #E2E8F0',
        }}
      >
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              backgroundColor: '#DCFCE7',
              border: '1px solid #86EFAC',
              borderRadius: '9999px',
              padding: '0.35rem 0.9rem',
              fontSize: '0.8rem',
              fontWeight: 700,
              color: '#15803D',
              marginBottom: '1rem',
            }}
          >
            <Sparkles size={14} />
            <span>EaseHub Campus Bazaar • Student-to-Student Marketplace</span>
          </div>

          <h1
            style={{
              fontSize: 'clamp(2rem, 4.5vw, 3.2rem)',
              fontWeight: 900,
              letterSpacing: '-0.02em',
              marginBottom: '0.85rem',
              lineHeight: 1.15,
              color: '#0F172A',
            }}
          >
            Buy & Sell Pre-Loved Essentials{' '}
            <span style={{ color: '#15803D', textDecoration: 'underline decoration-[#86EFAC]' }}>
              Inside Your Campus
            </span>
          </h1>

          <p style={{ fontSize: '1rem', color: '#475569', maxWidth: '580px', margin: '0 auto 2rem' }}>
            Direct senior-to-junior handovers. Negotiate in real-time, pay securely via UPI Escrow, or meet at your hostel gate!
          </p>

          {/* Search Bar + Post Ad CTA */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              gap: '0.75rem',
              maxWidth: '640px',
              margin: '0 auto',
            }}
          >
            <div
              style={{
                flex: 1,
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <Search
                size={18}
                color="#64748B"
                style={{ position: 'absolute', left: '1rem', pointerEvents: 'none' }}
              />
              <input
                type="text"
                placeholder="Search coolers, drafters, cycles, books, kettles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.85rem 1rem 0.85rem 2.75rem',
                  borderRadius: '0.75rem',
                  backgroundColor: '#FFFFFF',
                  border: '1.5px solid #CBD5E1',
                  color: '#0F172A',
                  fontSize: '0.9rem',
                  outline: 'none',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.05)',
                }}
              />
            </div>

            <button
              type="button"
              onClick={() => setIsPostAdOpen(true)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                backgroundColor: '#16A34A',
                color: '#FFFFFF',
                padding: '0.85rem 1.4rem',
                borderRadius: '0.75rem',
                border: 'none',
                fontWeight: 800,
                fontSize: '0.9rem',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                boxShadow: '0 4px 16px rgba(22, 163, 74, 0.3)',
              }}
            >
              <Plus size={18} />
              <span>+ Post Ad</span>
            </button>
          </div>
        </div>
      </section>

      {/* Category Filter Pills */}
      <section style={{ maxWidth: '1200px', margin: '2rem auto', padding: '0 1.5rem' }}>
        <div
          style={{
            display: 'flex',
            gap: '0.6rem',
            overflowX: 'auto',
            paddingBottom: '0.5rem',
          }}
        >
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.45rem',
                padding: '0.55rem 1rem',
                borderRadius: '9999px',
                backgroundColor: selectedCategory === cat.id ? '#15803D' : '#FFFFFF',
                border: selectedCategory === cat.id ? '1px solid #15803D' : '1px solid #E2E8F0',
                color: selectedCategory === cat.id ? '#FFFFFF' : '#475569',
                fontWeight: 700,
                fontSize: '0.82rem',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.15s ease',
                boxShadow: selectedCategory === cat.id ? '0 2px 8px rgba(21, 128, 61, 0.25)' : 'none',
              }}
            >
              <span>{cat.icon}</span>
              <span>{cat.label}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Items Grid */}
      <section style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0, color: '#0F172A' }}>
            Featured Student Listings ({items.length})
          </h2>
          <span style={{ fontSize: '0.75rem', color: '#64748B' }}>
            Instant handover • No shipping delay
          </span>
        </div>

        {items.length === 0 ? (
          <div
            style={{
              textAlign: 'center',
              padding: '4rem 1rem',
              backgroundColor: '#FFFFFF',
              borderRadius: '1rem',
              border: '1.5px dashed #CBD5E1',
            }}
          >
            <ShoppingBag size={48} color="#94A3B8" style={{ margin: '0 auto 1rem' }} />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0F172A' }}>No listings found</h3>
            <p style={{ fontSize: '0.85rem', color: '#64748B', marginBottom: '1.25rem' }}>
              Be the first student to post an item in this category!
            </p>
            <button
              onClick={() => setIsPostAdOpen(true)}
              style={{
                padding: '0.65rem 1.25rem',
                backgroundColor: '#16A34A',
                border: 'none',
                borderRadius: '0.5rem',
                color: '#FFFFFF',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              Post an Ad Now
            </button>
          </div>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '1.5rem',
            }}
          >
            {items.map((item) => {
              const discount = item.originalPrice
                ? Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)
                : 0;

              return (
                <div
                  key={item.id}
                  style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '1rem',
                    border: '1px solid #E2E8F0',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.borderColor = '#86EFAC';
                    e.currentTarget.style.boxShadow = '0 10px 24px -6px rgba(22, 163, 74, 0.12)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'none';
                    e.currentTarget.style.borderColor = '#E2E8F0';
                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.04)';
                  }}
                >
                  {/* Image Container */}
                  <div style={{ position: 'relative', height: '190px', width: '100%', overflow: 'hidden' }}>
                    <img
                      src={item.images[0]}
                      alt={item.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    {discount > 0 && (
                      <span
                        style={{
                          position: 'absolute',
                          top: '10px',
                          left: '10px',
                          backgroundColor: '#EF4444',
                          color: '#FFFFFF',
                          fontSize: '0.7rem',
                          fontWeight: 800,
                          padding: '0.2rem 0.5rem',
                          borderRadius: '9999px',
                        }}
                      >
                        {discount}% OFF
                      </span>
                    )}
                    <span
                      style={{
                        position: 'absolute',
                        top: '10px',
                        right: '10px',
                        backgroundColor: '#FFFFFF',
                        backdropFilter: 'blur(4px)',
                        color: '#15803D',
                        fontSize: '0.68rem',
                        fontWeight: 700,
                        padding: '0.2rem 0.55rem',
                        borderRadius: '9999px',
                        border: '1px solid #86EFAC',
                        textTransform: 'capitalize',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.08)',
                      }}
                    >
                      {item.condition.replace('-', ' ')}
                    </span>
                  </div>

                  {/* Card Content */}
                  <div style={{ padding: '1.1rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <h3
                      style={{
                        fontSize: '0.98rem',
                        fontWeight: 700,
                        color: '#0F172A',
                        marginBottom: '0.4rem',
                        lineHeight: 1.3,
                      }}
                    >
                      {item.title}
                    </h3>

                    <p
                      style={{
                        fontSize: '0.78rem',
                        color: '#475569',
                        marginBottom: '0.85rem',
                        lineHeight: 1.4,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        flex: 1,
                      }}
                    >
                      {item.description}
                    </p>

                    {/* Price & Location */}
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginBottom: '0.6rem' }}>
                      <span style={{ fontSize: '1.35rem', fontWeight: 900, color: '#15803D' }}>
                        ₹{item.price}
                      </span>
                      {item.originalPrice && (
                        <span style={{ fontSize: '0.85rem', color: '#94A3B8', textDecoration: 'line-through' }}>
                          ₹{item.originalPrice}
                        </span>
                      )}
                    </div>

                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        fontSize: '0.72rem',
                        color: '#64748B',
                        marginBottom: '0.85rem',
                        borderTop: '1px solid #F1F5F9',
                        paddingTop: '0.6rem',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <MapPin size={13} color="#15803D" />
                        <span>{item.sellerHostel}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <ShieldCheck size={13} color="#16A34A" />
                        <span style={{ color: '#475569', fontWeight: 600 }}>{item.sellerName.split(' ')[0]}</span>
                      </div>
                    </div>

                    {/* Action Buttons: Chat/Bargain + Buy via UPI */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                      <button
                        type="button"
                        onClick={() => setActiveItemForChat(item)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '0.35rem',
                          padding: '0.6rem 0.5rem',
                          borderRadius: '0.5rem',
                          backgroundColor: '#FEF08A',
                          border: '1px solid #FDE047',
                          color: '#854D0E',
                          fontWeight: 700,
                          fontSize: '0.8rem',
                          cursor: 'pointer',
                        }}
                      >
                        <MessageCircle size={15} color="#854D0E" />
                        <span>Offer / Chat</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setActiveItemForPay(item)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '0.35rem',
                          padding: '0.6rem 0.5rem',
                          borderRadius: '0.5rem',
                          backgroundColor: '#16A34A',
                          border: 'none',
                          color: '#FFFFFF',
                          fontWeight: 800,
                          fontSize: '0.8rem',
                          cursor: 'pointer',
                          boxShadow: '0 2px 8px rgba(22, 163, 74, 0.3)',
                        }}
                      >
                        <QrCode size={15} />
                        <span>Buy (UPI)</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Post An Ad Modal */}
      {isPostAdOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 99998,
            backgroundColor: 'rgba(15, 23, 42, 0.5)',
            backdropFilter: 'blur(6px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
          }}
          onClick={() => setIsPostAdOpen(false)}
        >
          <div
            style={{
              width: '100%',
              maxWidth: '520px',
              backgroundColor: '#FFFFFF',
              border: '1px solid #E2E8F0',
              borderRadius: '1.25rem',
              boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
              overflow: 'hidden',
              maxHeight: '90vh',
              display: 'flex',
              flexDirection: 'column',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div
              style={{
                padding: '1.2rem 1.5rem',
                borderBottom: '1px solid #E2E8F0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800, color: '#0F172A' }}>
                  Post an Ad on Campus Bazaar
                </h3>
                <p style={{ margin: 0, fontSize: '0.75rem', color: '#64748B' }}>
                  Reach 5,000+ students inside your campus instantly
                </p>
              </div>
              <button
                onClick={() => setIsPostAdOpen(false)}
                style={{ background: 'none', border: 'none', color: '#64748B', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handlePostAd} style={{ padding: '1.25rem 1.5rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#334155', marginBottom: '0.25rem' }}>
                  Item Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Hero Sprint Cycle or Engineering Drafter Set"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  style={inputStyle}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#334155', marginBottom: '0.25rem' }}>
                    Selling Price (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    placeholder="e.g. 500"
                    value={newPrice}
                    onChange={(e) => setNewPrice(e.target.value ? Number(e.target.value) : '')}
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#334155', marginBottom: '0.25rem' }}>
                    Original Price (Optional ₹)
                  </label>
                  <input
                    type="number"
                    placeholder="e.g. 1200"
                    value={newOriginalPrice}
                    onChange={(e) => setNewOriginalPrice(e.target.value ? Number(e.target.value) : '')}
                    style={inputStyle}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#334155', marginBottom: '0.25rem' }}>
                    Category
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as BazaarCategory)}
                    style={inputStyle}
                  >
                    <option value="hostel-living">Hostel Living / Coolers</option>
                    <option value="books-notes">Books & Study Notes</option>
                    <option value="electronics">Electronics & Kettles</option>
                    <option value="vehicles-cycles">Bicycles & Vehicles</option>
                    <option value="stationery-tools">Lab & Drafters</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#334155', marginBottom: '0.25rem' }}>
                    Condition
                  </label>
                  <select
                    value={newCondition}
                    onChange={(e) => setNewCondition(e.target.value as ItemCondition)}
                    style={inputStyle}
                  >
                    <option value="like-new">Like New / Barely Used</option>
                    <option value="brand-new">Brand New Sealed</option>
                    <option value="good">Good Working Condition</option>
                    <option value="fair">Fair / Functional</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#334155', marginBottom: '0.25rem' }}>
                  Image URL (Paste any photo link or Unsplash preview)
                </label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  style={inputStyle}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#334155', marginBottom: '0.25rem' }}>
                  Description & Item Highlights
                </label>
                <textarea
                  rows={3}
                  placeholder="Mention condition, accessories included, reason for selling..."
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  style={{ ...inputStyle, resize: 'none' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#334155', marginBottom: '0.25rem' }}>
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Anshu Kumar"
                    value={newSellerName}
                    onChange={(e) => setNewSellerName(e.target.value)}
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#334155', marginBottom: '0.25rem' }}>
                    Hostel & Room *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Block B, Room 204"
                    value={newHostel}
                    onChange={(e) => setNewHostel(e.target.value)}
                    style={inputStyle}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#334155', marginBottom: '0.25rem' }}>
                  WhatsApp Phone Number *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="+91 91790 60786"
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  style={inputStyle}
                />
              </div>

              <button
                type="submit"
                style={{
                  marginTop: '0.5rem',
                  padding: '0.8rem',
                  backgroundColor: '#16A34A',
                  border: 'none',
                  borderRadius: '0.5rem',
                  color: '#FFFFFF',
                  fontWeight: 800,
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  boxShadow: '0 4px 14px rgba(22, 163, 74, 0.3)',
                }}
              >
                Publish Listing Instantly
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Interactive Chat Modal */}
      {activeItemForChat && (
        <BazaarChatModal
          isOpen={true}
          onClose={() => setActiveItemForChat(null)}
          itemId={activeItemForChat.id}
          itemTitle={activeItemForChat.title}
          itemPrice={activeItemForChat.price}
          itemImage={activeItemForChat.images[0]}
          sellerId={activeItemForChat.sellerId}
          sellerName={activeItemForChat.sellerName}
          sellerPhone={activeItemForChat.sellerPhone}
        />
      )}

      {/* Direct UPI Payment Modal */}
      {activeItemForPay && (
        <UpiPaymentModal
          isOpen={true}
          onClose={() => setActiveItemForPay(null)}
          itemTitle={activeItemForPay.title}
          amount={activeItemForPay.price}
          category="bazaar"
          payerName=""
          payerPhone=""
        />
      )}
    </div>
  );
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '0.65rem 0.85rem',
  borderRadius: '0.5rem',
  backgroundColor: '#F8FAF7',
  border: '1.5px solid #CBD5E1',
  color: '#0F172A',
  fontSize: '0.88rem',
  outline: 'none',
};
