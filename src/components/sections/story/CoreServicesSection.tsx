import React, { useState, useMemo, useEffect } from 'react';
import {
  Search,
  Home,
  Utensils,
  Shirt,
  Layers,
  Phone,
  MapPin,
  MessageCircle,
  Mail,
  Clock,
  ShieldCheck,
  Building,
  CheckCircle2,
  X
} from 'lucide-react';
import { Container } from '../../primitives/Container';
import type { Campus } from '../../../data/campuses';
import {
  type CatalogItem,
  REFERENCE_PGS,
  REFERENCE_MEALS,
  REFERENCE_LAUNDRY,
  REFERENCE_EXTRA_SERVICES,
} from '../../../data/referenceCatalog';
import { ReferenceServiceCard } from '../../cards/ReferenceServiceCard';

export interface BookingTargetPayload {
  serviceId: string;
  serviceName: string;
  optionId?: string;
  optionName?: string;
  price?: number | string;
  period?: string;
}

interface CoreServicesSectionProps {
  selectedCampus?: Campus;
  onOpenBooking: (payload: BookingTargetPayload) => void;
}

type ActiveCategory = 'pg' | 'meals' | 'laundry' | 'extra' | 'contact';
type GenderFilter = 'all' | 'male' | 'female' | 'unisex';

export const CoreServicesSection: React.FC<CoreServicesSectionProps> = ({
  selectedCampus: _selectedCampus,
  onOpenBooking,
}) => {
  const [activeCategory, setActiveCategory] = useState<ActiveCategory>('pg');
  const [genderFilter, setGenderFilter] = useState<GenderFilter>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Contact form state
  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [contactSubmitted, setContactSubmitted] = useState(false);

  // Sync category selection with global navbar events or hash changes
  useEffect(() => {
    const handleCategoryEvent = (e: CustomEvent<{ category: string }>) => {
      if (!e.detail?.category) return;
      const cat = e.detail.category.toLowerCase();
      if (cat.includes('pg') || cat.includes('hostel')) setActiveCategory('pg');
      else if (cat.includes('meal') || cat.includes('mess')) setActiveCategory('meals');
      else if (cat.includes('laundry')) setActiveCategory('laundry');
      else if (cat.includes('extra')) setActiveCategory('extra');
      else if (cat.includes('contact')) setActiveCategory('contact');
    };

    const handleHash = () => {
      const hash = window.location.hash.toLowerCase();
      if (hash.includes('#services/pg') || hash === '#pg') setActiveCategory('pg');
      else if (hash.includes('#services/mess') || hash.includes('#services/meals') || hash === '#meals') setActiveCategory('meals');
      else if (hash.includes('#services/laundry') || hash === '#laundry') setActiveCategory('laundry');
      else if (hash.includes('#services/extra') || hash.includes('#extra') || hash.includes('#services/room-cleaning')) setActiveCategory('extra');
      else if (hash === '#contact' || hash.includes('contact')) setActiveCategory('contact');
    };

    window.addEventListener('easehub:select-category' as any, handleCategoryEvent);
    window.addEventListener('hashchange', handleHash);
    handleHash();

    return () => {
      window.removeEventListener('easehub:select-category' as any, handleCategoryEvent);
      window.removeEventListener('hashchange', handleHash);
    };
  }, []);

  // Filtered PG items (all 36 PGs from reference site)
  const filteredPGs = useMemo(() => {
    return REFERENCE_PGS.filter((item) => {
      // Gender filter
      if (genderFilter !== 'all' && item.badgeVariant !== genderFilter) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          item.name.toLowerCase().includes(q) ||
          item.address.toLowerCase().includes(q) ||
          item.city.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q) ||
          String(item.price).includes(q)
        );
      }
      return true;
    });
  }, [genderFilter, searchQuery]);

  // Filtered Meals items
  const filteredMeals = useMemo(() => {
    return REFERENCE_MEALS.filter((item) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          item.name.toLowerCase().includes(q) ||
          item.address.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q) ||
          (item.badge ? item.badge.toLowerCase().includes(q) : false) ||
          String(item.price).includes(q)
        );
      }
      return true;
    });
  }, [searchQuery]);

  // Filtered Laundry items
  const filteredLaundry = useMemo(() => {
    return REFERENCE_LAUNDRY.filter((item) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          item.name.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q) ||
          (item.badge ? item.badge.toLowerCase().includes(q) : false) ||
          String(item.price).includes(q)
        );
      }
      return true;
    });
  }, [searchQuery]);

  // Filtered Extra Services items
  const filteredExtra = useMemo(() => {
    return REFERENCE_EXTRA_SERVICES.filter((item) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          item.name.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q) ||
          (item.badge ? item.badge.toLowerCase().includes(q) : false) ||
          (item.priceText ? item.priceText.toLowerCase().includes(q) : false) ||
          String(item.price).includes(q)
        );
      }
      return true;
    });
  }, [searchQuery]);

  const handleCardBookNow = (item: CatalogItem) => {
    onOpenBooking({
      serviceId: item.id,
      serviceName: item.name,
      optionId: item.id,
      optionName: `${item.name} (${item.badge || 'Verified'})`,
      price: typeof item.price === 'number' ? item.price : 2200,
      period: item.periodText || 'per month',
    });
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactPhone.trim()) return;
    const phone = '918102848776';
    const message = `Hello EaseHub! 📞 Callback Request\n• Name: ${contactName || 'Student'}\n• Phone: ${contactPhone}\n• Note: ${contactMessage || 'General inquiry regarding student services near Rungta college, Bhilai'}`;
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, '_blank');
    setContactSubmitted(true);
  };

  return (
    <section
      id="core-services"
      aria-label="Student Services Catalog"
      style={{
        position: 'relative',
        backgroundColor: 'var(--color-bg-primary)',
        paddingTop: '6.5rem', // Offset for fixed navbar
        paddingBottom: '5rem',
        borderBottom: '1px solid var(--color-border-subtle)',
        minHeight: '100vh',
        transition: 'background-color 0.25s ease',
      }}
    >
      <Container variant="wide">
        {/* ========================================================================= */}
        {/* 1. TOP CATEGORY SWITCHER TABS (Exact Layout from Reference Site)            */}
        {/* ========================================================================= */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            marginBottom: '2.5rem',
          }}
        >
          {/* Centered Pill Bar */}
          <div
            role="tablist"
            aria-label="Service Category Switcher"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              backgroundColor: 'var(--color-surface-2)',
              border: '1px solid var(--color-border-subtle)',
              borderRadius: '9999px',
              padding: '6px',
              boxShadow: '0 4px 20px -2px rgba(0, 0, 0, 0.45)',
              gap: '6px',
              flexWrap: 'wrap',
              justifyContent: 'center',
              maxWidth: '100%',
            }}
          >
            {[
              { id: 'pg', label: 'PG/Hostel', icon: Home },
              { id: 'meals', label: 'Meals', icon: Utensils },
              { id: 'laundry', label: 'Laundry', icon: Shirt },
              { id: 'extra', label: 'Extra Services', icon: Layers },
              { id: 'contact', label: 'Contact', icon: Phone },
            ].map((tab) => {
              const isActive = activeCategory === tab.id;
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  className="easehub-tab-btn"
                  onClick={() => {
                    setActiveCategory(tab.id as ActiveCategory);
                    setSearchQuery('');
                  }}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.45rem',
                    padding: '0.55rem 1.35rem',
                    borderRadius: '9999px',
                    backgroundColor: isActive ? '#2563EB' : 'transparent',
                    color: isActive ? '#FFFFFF' : 'var(--color-text-secondary)',
                    border: isActive ? '1px solid #3B82F6' : '1px solid transparent',
                    fontSize: '0.9rem',
                    fontFamily: 'var(--font-display, sans-serif)',
                    fontWeight: isActive ? 700 : 500,
                    cursor: 'pointer',
                    boxShadow: isActive ? '0 4px 12px rgba(0, 0, 0, 0.25)' : 'none',
                    transition: 'all var(--duration-fast, 200ms) var(--ease-smooth)',
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.backgroundColor = 'var(--color-surface-1)';
                      e.currentTarget.style.color = 'var(--color-text-primary)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.color = 'var(--color-text-secondary)';
                    }
                  }}
                >
                  <Icon size={16} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Sub-Filters: Gender Pills (Only for PG/Hostel tab) */}
          {activeCategory === 'pg' && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                marginTop: '1.25rem',
                flexWrap: 'wrap',
                justifyContent: 'center',
              }}
            >
              {[
                { id: 'all', label: 'All PGs' },
                { id: 'male', label: 'Boys / Male' },
                { id: 'female', label: 'Girls / Female' },
                { id: 'unisex', label: 'Unisex / Co-ed' },
              ].map((pill) => {
                const isSelected = genderFilter === pill.id;
                return (
                  <button
                    key={pill.id}
                    type="button"
                    className="easehub-tab-btn"
                    onClick={() => setGenderFilter(pill.id as GenderFilter)}
                    style={{
                      padding: '0.38rem 1rem',
                      borderRadius: '9999px',
                      fontSize: '0.82rem',
                      fontFamily: 'var(--font-body, sans-serif)',
                      fontWeight: isSelected ? 700 : 500,
                      backgroundColor: isSelected
                        ? 'var(--color-brand-green, #59A83E)'
                        : 'var(--color-surface-1)',
                      color: isSelected ? '#FFFFFF' : 'var(--color-text-secondary)',
                      border: isSelected
                        ? '1px solid var(--color-brand-green, #59A83E)'
                        : '1px solid var(--color-border-subtle)',
                      cursor: 'pointer',
                      transition: 'all var(--duration-fast, 200ms) var(--ease-smooth)',
                      boxShadow: isSelected ? '0 2px 8px rgba(89, 168, 62, 0.25)' : 'none',
                    }}
                  >
                    {pill.label}
                  </button>
                );
              })}
            </div>
          )}

          {/* Live Search Input Bar */}
          {activeCategory !== 'contact' && (
            <div
              style={{
                marginTop: '1.25rem',
                width: '100%',
                maxWidth: '560px',
                position: 'relative',
              }}
            >
              <Search
                size={18}
                color="var(--color-text-muted)"
                style={{
                  position: 'absolute',
                  left: '1.1rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                }}
              />
              <input
                type="text"
                placeholder={
                  activeCategory === 'pg'
                    ? 'Search PG by name, Kurud Rd, Kohka, Shivaji Nagar, rent...'
                    : activeCategory === 'meals'
                    ? 'Search meals, veg, non-veg, daily tiffin, breakfast...'
                    : activeCategory === 'laundry'
                    ? 'Search laundry plans, per-kg, unlimited, dry clean...'
                    : 'Search extra services, water can, room cleaning, electrician...'
                }
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.8rem 3rem 0.8rem 2.85rem',
                  backgroundColor: 'var(--color-surface-1)',
                  border: '1px solid var(--color-border-subtle)',
                  borderRadius: '9999px',
                  color: 'var(--color-text-primary)',
                  fontSize: '0.9rem',
                  outline: 'none',
                  boxSizing: 'border-box',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
                  transition: 'border-color var(--duration-fast, 200ms) var(--ease-smooth), box-shadow var(--duration-fast, 200ms) var(--ease-smooth)',
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = 'var(--color-brand-blue)';
                  e.currentTarget.style.boxShadow = '0 0 0 3px var(--color-blue-subtle, rgba(59, 130, 246, 0.25))';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = 'var(--color-border-subtle)';
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.3)';
                }}
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  aria-label="Clear search"
                  style={{
                    position: 'absolute',
                    right: '1rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: 'var(--color-text-muted)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <X size={16} />
                </button>
              )}
            </div>
          )}
        </div>

        {/* ========================================================================= */}
        {/* 2. THE 3-COLUMN CARD GRID (Exact Copy of Reference Site Card Arranging)   */}
        {/* ========================================================================= */}
        {activeCategory === 'pg' && (
          <div>
            {filteredPGs.length === 0 ? (
              <div
                style={{
                  textAlign: 'center',
                  padding: '3rem 1rem',
                  backgroundColor: 'var(--color-surface-1)',
                  borderRadius: '16px',
                  border: '1px solid var(--color-border-subtle)',
                }}
              >
                <p style={{ color: 'var(--color-text-muted)', fontSize: '1rem', margin: 0 }}>
                  No PGs matched your search query "{searchQuery}".
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setGenderFilter('all');
                  }}
                  style={{
                    marginTop: '1rem',
                    color: 'var(--color-brand-gold)',
                    fontWeight: 600,
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                >
                  Reset filters
                </button>
              </div>
            ) : (
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 300px), 1fr))',
                  gap: '1.75rem',
                }}
              >
                {filteredPGs.map((item) => (
                  <ReferenceServiceCard
                    key={item.id}
                    item={item}
                    onBookNow={handleCardBookNow}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* MEALS TAB */}
        {activeCategory === 'meals' && (
          <div>
            {filteredMeals.length === 0 ? (
              <div
                style={{
                  textAlign: 'center',
                  padding: '3rem 1rem',
                  backgroundColor: 'var(--color-surface-1)',
                  borderRadius: '16px',
                  border: '1px solid var(--color-border-subtle)',
                }}
              >
                <p style={{ color: 'var(--color-text-muted)', fontSize: '1rem', margin: 0 }}>
                  No meal plans matched your query.
                </p>
              </div>
            ) : (
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 300px), 1fr))',
                  gap: '1.75rem',
                }}
              >
                {filteredMeals.map((item) => (
                  <ReferenceServiceCard
                    key={item.id}
                    item={item}
                    onBookNow={handleCardBookNow}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* LAUNDRY TAB */}
        {activeCategory === 'laundry' && (
          <div>
            {filteredLaundry.length === 0 ? (
              <div
                style={{
                  textAlign: 'center',
                  padding: '3rem 1rem',
                  backgroundColor: 'var(--color-surface-1)',
                  borderRadius: '16px',
                  border: '1px solid var(--color-border-subtle)',
                }}
              >
                <p style={{ color: 'var(--color-text-muted)', fontSize: '1rem', margin: 0 }}>
                  No laundry services found.
                </p>
              </div>
            ) : (
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 300px), 1fr))',
                  gap: '1.75rem',
                }}
              >
                {filteredLaundry.map((item) => (
                  <ReferenceServiceCard
                    key={item.id}
                    item={item}
                    onBookNow={handleCardBookNow}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* EXTRA SERVICES TAB */}
        {activeCategory === 'extra' && (
          <div>
            {filteredExtra.length === 0 ? (
              <div
                style={{
                  textAlign: 'center',
                  padding: '3rem 1rem',
                  backgroundColor: 'var(--color-surface-1)',
                  borderRadius: '16px',
                  border: '1px solid var(--color-border-subtle)',
                }}
              >
                <p style={{ color: 'var(--color-text-muted)', fontSize: '1rem', margin: 0 }}>
                  No extra services found.
                </p>
              </div>
            ) : (
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 300px), 1fr))',
                  gap: '1.75rem',
                }}
              >
                {filteredExtra.map((item) => (
                  <ReferenceServiceCard
                    key={item.id}
                    item={item}
                    onBookNow={handleCardBookNow}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* CONTACT TAB */}
        {activeCategory === 'contact' && (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))',
              gap: '1.75rem',
              alignItems: 'stretch',
            }}
          >
            {/* Card 1: Direct WhatsApp Concierge */}
            <div
              style={{
                backgroundColor: 'var(--color-surface-1)',
                borderRadius: '16px',
                border: '1px solid var(--color-border-subtle)',
                padding: '2rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.4)',
              }}
            >
              <div>
                <div
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '12px',
                    backgroundColor: 'rgba(34, 197, 94, 0.15)',
                    border: '1px solid rgba(34, 197, 94, 0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '1.25rem',
                  }}
                >
                  <MessageCircle size={24} color="#22C55E" />
                </div>
                <h3
                  style={{
                    fontSize: '1.25rem',
                    fontWeight: 700,
                    color: 'var(--color-text-primary)',
                    margin: '0 0 0.5rem 0',
                  }}
                >
                  WhatsApp Concierge
                </h3>
                <p
                  style={{
                    color: 'var(--color-text-secondary)',
                    fontSize: '0.9rem',
                    lineHeight: 1.5,
                    marginBottom: '1.5rem',
                  }}
                >
                  Chat with our on-ground campus team in Bhilai for instant PG availability, meal customization, or laundry pickups.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
                    <Clock size={16} color="#58A940" />
                    <span>Average response time: <strong>&lt; 15 mins</strong></span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
                    <ShieldCheck size={16} color="#58A940" />
                    <span>Official EaseHub Verified Desk</span>
                  </div>
                </div>
              </div>

              <a
                href="https://wa.me/918102848776?text=Hello%20EaseHub!%20I%20need%20assistance%20with%20services%20near%20Rungta%20College."
                target="_blank"
                rel="noopener noreferrer"
                className="easehub-btn-tactile"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  padding: '0.85rem 1.5rem',
                  backgroundColor: '#16A34A',
                  color: '#FFFFFF',
                  borderRadius: '10px',
                  fontWeight: 700,
                  fontSize: '0.92rem',
                  textDecoration: 'none',
                  boxShadow: '0 4px 14px rgba(22, 163, 74, 0.3)',
                  transition: 'all var(--duration-fast, 200ms) var(--ease-smooth)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#15803D';
                  e.currentTarget.style.transform = 'translateY(-1.5px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#16A34A';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
                onMouseDown={(e) => {
                  e.currentTarget.style.transform = 'translateY(0.5px) scale(0.985)';
                }}
                onMouseUp={(e) => {
                  e.currentTarget.style.transform = 'translateY(-1.5px)';
                }}
              >
                <MessageCircle size={18} />
                <span>Chat on WhatsApp (+91 81028 48776)</span>
              </a>
            </div>

            {/* Card 2: Physical Campus Desk & Support */}
            <div
              style={{
                backgroundColor: 'var(--color-surface-1)',
                borderRadius: '16px',
                border: '1px solid var(--color-border-subtle)',
                padding: '2rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.4)',
              }}
            >
              <div>
                <div
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '12px',
                    backgroundColor: 'rgba(59, 130, 246, 0.15)',
                    border: '1px solid rgba(59, 130, 246, 0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '1.25rem',
                  }}
                >
                  <Building size={24} color="#3B82F6" />
                </div>
                <h3
                  style={{
                    fontSize: '1.25rem',
                    fontWeight: 700,
                    color: 'var(--color-text-primary)',
                    margin: '0 0 0.5rem 0',
                  }}
                >
                  Campus Operations Desk
                </h3>
                <p
                  style={{
                    color: 'var(--color-text-secondary)',
                    fontSize: '0.9rem',
                    lineHeight: 1.5,
                    marginBottom: '1.5rem',
                  }}
                >
                  Visit our local student operations desk or reach out via official phone and email channels.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginBottom: '1.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.65rem', fontSize: '0.86rem', color: 'var(--color-text-secondary)' }}>
                    <MapPin size={18} color="#EF4444" style={{ flexShrink: 0, marginTop: '2px' }} />
                    <span>Kurud Road, Near Rungta College of Engineering &amp; Tech, Bhilai, Chhattisgarh 490023</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', fontSize: '0.86rem', color: 'var(--color-text-secondary)' }}>
                    <Phone size={18} color="var(--color-brand-gold)" style={{ flexShrink: 0 }} />
                    <span><strong>+91 81028 48776</strong> (Call &amp; WhatsApp)</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', fontSize: '0.86rem', color: 'var(--color-text-secondary)' }}>
                    <Mail size={18} color="var(--color-brand-gold)" style={{ flexShrink: 0 }} />
                    <span>support@easehub.in</span>
                  </div>
                </div>
              </div>

              <a
                href="tel:+918102848776"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  padding: '0.85rem 1.5rem',
                  backgroundColor: '#2563EB',
                  color: '#FFFFFF',
                  borderRadius: '10px',
                  fontWeight: 700,
                  fontSize: '0.92rem',
                  textDecoration: 'none',
                  boxShadow: '0 4px 14px rgba(0, 0, 0, 0.3)',
                  transition: 'all 0.15s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#1D4ED8';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#2563EB';
                }}
              >
                <Phone size={18} />
                <span>Call Helpline Directly</span>
              </a>
            </div>

            {/* Card 3: Instant Request Callback Form */}
            <div
              style={{
                backgroundColor: 'var(--color-surface-1)',
                borderRadius: '16px',
                border: '1px solid var(--color-border-subtle)',
                padding: '2rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.4)',
              }}
            >
              <div>
                <h3
                  style={{
                    fontSize: '1.25rem',
                    fontWeight: 700,
                    color: 'var(--color-text-primary)',
                    margin: '0 0 0.5rem 0',
                  }}
                >
                  Request Fast Callback
                </h3>
                <p
                  style={{
                    color: 'var(--color-text-secondary)',
                    fontSize: '0.88rem',
                    lineHeight: 1.5,
                    marginBottom: '1.25rem',
                  }}
                >
                  Leave your number and an EaseHub advisor will call you back within 10 minutes to help you pick the right PG or mess.
                </p>

                {contactSubmitted ? (
                  <div
                    style={{
                      padding: '1.5rem',
                      backgroundColor: 'rgba(34, 197, 94, 0.15)',
                      border: '1px solid #16A34A',
                      borderRadius: '12px',
                      textAlign: 'center',
                    }}
                  >
                    <CheckCircle2 size={32} color="#16A34A" style={{ margin: '0 auto 0.5rem auto' }} />
                    <h4 style={{ margin: '0 0 0.25rem 0', color: '#4ADE80', fontWeight: 700 }}>
                      Request Dispatched!
                    </h4>
                    <p style={{ margin: 0, fontSize: '0.82rem', color: '#86EFAC' }}>
                      Our student advisor has received your request on WhatsApp and is reviewing room vacancies.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleContactSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: '0.25rem' }}>
                        Your Full Name
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Rahul Sharma"
                        value={contactName}
                        onChange={(e) => setContactName(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '0.65rem 0.85rem',
                          borderRadius: '8px',
                          border: '1px solid var(--color-border-subtle)',
                          backgroundColor: 'var(--color-surface-2)',
                          color: 'var(--color-text-primary)',
                          fontSize: '0.88rem',
                          boxSizing: 'border-box',
                          outline: 'none',
                        }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: '0.25rem' }}>
                        WhatsApp / Phone Number *
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="e.g. 9876543210"
                        value={contactPhone}
                        onChange={(e) => setContactPhone(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '0.65rem 0.85rem',
                          borderRadius: '8px',
                          border: '1px solid var(--color-border-subtle)',
                          backgroundColor: 'var(--color-surface-2)',
                          color: 'var(--color-text-primary)',
                          fontSize: '0.88rem',
                          boxSizing: 'border-box',
                          outline: 'none',
                        }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: '0.25rem' }}>
                        What do you need?
                      </label>
                      <textarea
                        rows={2}
                        placeholder="Looking for AC PG near Rungta college / 2-Meal plan..."
                        value={contactMessage}
                        onChange={(e) => setContactMessage(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '0.65rem 0.85rem',
                          borderRadius: '8px',
                          border: '1px solid var(--color-border-subtle)',
                          backgroundColor: 'var(--color-surface-2)',
                          color: 'var(--color-text-primary)',
                          fontSize: '0.88rem',
                          boxSizing: 'border-box',
                          outline: 'none',
                          resize: 'none',
                        }}
                      />
                    </div>

                    <button
                      type="submit"
                      style={{
                        marginTop: '0.5rem',
                        padding: '0.85rem',
                        backgroundColor: '#58A940', // Brand Leaf Green
                        color: '#FFFFFF',
                        border: 'none',
                        borderRadius: '8px',
                        fontWeight: 700,
                        fontSize: '0.92rem',
                        cursor: 'pointer',
                        boxShadow: '0 4px 12px rgba(88, 169, 64, 0.25)',
                        transition: 'background-color 0.15s',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#478933';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = '#58A940';
                      }}
                    >
                      Submit &amp; Open WhatsApp
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        )}
      </Container>

      <style>{`
        @media (max-width: 640px) {
          .easehub-tab-btn {
            padding: 0.45rem 0.85rem !important;
            font-size: 0.82rem !important;
            gap: 0.35rem !important;
          }
        }
      `}</style>
    </section>
  );
};
