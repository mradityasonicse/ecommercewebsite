import React, { useState, useMemo, useEffect } from 'react';
import {
  MapPin,
  MessageCircle,
  Clock,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  FilterX,
  Building,
  Phone,
  Compass,
  Shirt,
} from 'lucide-react';
import {
  PgLivingIcon,
  MessCulinaryIcon,
  LaundryAquaIcon,
  ExtraServicesGridIcon,
  VerifiedSupportIcon,
  BoysResidenceBadgeIcon,
  GirlsResidenceBadgeIcon,
  IndependentLivingBadgeIcon,
} from '../../icons/ProfessionalCategoryIcons';
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
import { HomepageSearch } from '../../search/HomepageSearch';
import {
  CampusStateService,
  type MessLiveState,
  type LaundryLiveState,
  type PgVacancyInfo,
} from '../../../services/campusStateService';

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
  onOpenTracker?: (tab?: 'mess' | 'laundry' | 'pg', orderId?: string) => void;
}

type ActiveCategory = 'pg' | 'meals' | 'laundry' | 'extra' | 'contact';
type GenderFilter = 'all' | 'male' | 'female' | 'unisex';
type AreaFilter = 'all' | 'kurud' | 'kohka' | 'smriti' | 'shivaji' | 'nehru';

const NEIGHBORHOOD_AREAS: Array<{ id: AreaFilter; label: string; subtext?: string }> = [
  { id: 'all', label: 'All Campus Areas' },
  { id: 'kurud', label: 'Kurud Rd (Near Rungta)' },
  { id: 'kohka', label: 'Kohka' },
  { id: 'smriti', label: 'Smriti Nagar' },
  { id: 'shivaji', label: 'Shivaji Nagar' },
  { id: 'nehru', label: 'Nehru Nagar' },
];

export const CoreServicesSection: React.FC<CoreServicesSectionProps> = ({
  selectedCampus: _selectedCampus,
  onOpenBooking,
  onOpenTracker,
}) => {
  const [activeCategory, setActiveCategory] = useState<ActiveCategory>('pg');
  const [genderFilter, setGenderFilter] = useState<GenderFilter>('all');
  const [areaFilter, setAreaFilter] = useState<AreaFilter>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Contact form state
  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [contactSubmitted, setContactSubmitted] = useState(false);

  // Campus Real-Time Operations State (Mess menu & stage, Laundry stage, PG vacancies)
  const [messState, setMessState] = useState<MessLiveState>(CampusStateService.getMessState());
  const [laundryState, setLaundryState] = useState<LaundryLiveState>(CampusStateService.getLaundryState());
  const [pgVacancies, setPgVacancies] = useState<PgVacancyInfo[]>(CampusStateService.getPgVacancies());

  useEffect(() => {
    const handleStatusUpdate = () => {
      setMessState(CampusStateService.getMessState());
      setLaundryState(CampusStateService.getLaundryState());
      setPgVacancies(CampusStateService.getPgVacancies());
    };
    window.addEventListener('easehub_campus_status_updated', handleStatusUpdate);
    return () => {
      window.removeEventListener('easehub_campus_status_updated', handleStatusUpdate);
    };
  }, []);

  const totalVacantBeds = pgVacancies.reduce((acc, curr) => acc + curr.vacantBeds, 0);

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

  // Filtered PG items (with gender, neighborhood area, and search query filters)
  const filteredPGs = useMemo(() => {
    return REFERENCE_PGS.filter((item) => {
      // Gender filter
      if (genderFilter !== 'all' && item.badgeVariant !== genderFilter) {
        return false;
      }

      // Neighborhood Area filter
      if (areaFilter !== 'all') {
        const addr = item.address.toLowerCase();
        if (areaFilter === 'kurud' && !addr.includes('kurud')) return false;
        if (areaFilter === 'kohka' && !addr.includes('kohka')) return false;
        if (areaFilter === 'smriti' && !addr.includes('smriti')) return false;
        if (areaFilter === 'shivaji' && !addr.includes('shivaji') && !addr.includes('sivaji')) return false;
        if (areaFilter === 'nehru' && !addr.includes('nehru')) return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          item.name.toLowerCase().includes(q) ||
          item.address.toLowerCase().includes(q) ||
          item.city.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q) ||
          (item.badge ? item.badge.toLowerCase().includes(q) : false) ||
          (item.priceText ? item.priceText.toLowerCase().includes(q) : false) ||
          String(item.price).includes(q)
        );
      }
      return true;
    });
  }, [genderFilter, areaFilter, searchQuery]);

  // Divided PG Sub-sections (Boys, Girls, Independent/Single)
  const boysPGs = useMemo(() => {
    return filteredPGs.filter(
      (item) => item.gender === 'male' || item.badgeVariant === 'male' || item.badge?.toLowerCase().includes('male')
    );
  }, [filteredPGs]);

  const girlsPGs = useMemo(() => {
    return filteredPGs.filter(
      (item) => item.gender === 'female' || item.badgeVariant === 'female' || item.badge?.toLowerCase().includes('female')
    );
  }, [filteredPGs]);

  const unisexPGs = useMemo(() => {
    return filteredPGs.filter(
      (item) =>
        item.gender === 'unisex' ||
        item.badgeVariant === 'unisex' ||
        (!item.gender && !item.badgeVariant?.includes('male') && !item.badgeVariant?.includes('female'))
    );
  }, [filteredPGs]);

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
          (item.priceText ? item.priceText.toLowerCase().includes(q) : false) ||
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
          (item.priceText ? item.priceText.toLowerCase().includes(q) : false) ||
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

  const handleResetFilters = () => {
    setSearchQuery('');
    setGenderFilter('all');
    setAreaFilter('all');
  };

  const handleWhatsAppCustomInquiry = () => {
    const phone = '918102848776';
    const queryDetails = searchQuery ? `"${searchQuery}"` : 'student accommodation/services';
    const areaDetails = areaFilter !== 'all' ? ` in ${NEIGHBORHOOD_AREAS.find(a => a.id === areaFilter)?.label}` : '';
    const message = `Hello EaseHub Concierge! 👋\nI am looking for ${queryDetails}${areaDetails} near Bhilai/Rungta college, but could not find a matching verified listing on the homepage.\n\nCould you please help me find an available option or connect me with a provider?`;
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <section
      id="core-services"
      aria-label="Student Services Marketplace"
      style={{
        position: 'relative',
        backgroundColor: 'var(--color-bg-primary)',
        paddingTop: '6.5rem', // Offset for fixed navbar
        paddingBottom: '5rem',
        borderBottom: '1px solid var(--color-border-subtle)',
        minHeight: '100vh',
        transition: 'background-color 0.25s ease',
        overflow: 'hidden',
      }}
    >
      {/* Hypnotic Ambient Radial Glow Backdrop */}
      <div
        style={{
          position: 'absolute',
          top: '-100px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '1200px',
          height: '550px',
          background: 'radial-gradient(ellipse 65% 50% at 50% 20%, rgba(56, 189, 248, 0.22), rgba(99, 102, 241, 0.12), rgba(168, 85, 247, 0.05), transparent 75%)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      <Container variant="wide">
        {/* ========================================================================= */}
        {/* 1. HYPNOTIC HERO HEADER: Cinematic, High-Conversion Campus Super-App     */}
        {/* ========================================================================= */}
        <div
          style={{
            textAlign: 'center',
            marginBottom: '2rem',
            maxWidth: '820px',
            marginInline: 'auto',
            position: 'relative',
            zIndex: 1,
          }}
        >
          {/* Luminous Trust Badge */}
          {/* Luminous Pulsing Campus Live Badge */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.65rem',
              padding: '0.4rem 1.1rem',
              borderRadius: '9999px',
              backgroundColor: '#DCFCE7',
              border: '1px solid #86EFAC',
              boxShadow: '0 2px 10px rgba(22, 163, 74, 0.15)',
              marginBottom: '1.5rem',
            }}
          >
            <span
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: '#16A34A',
                display: 'inline-block',
                boxShadow: '0 0 10px #16A34A',
              }}
            />
            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#15803D', letterSpacing: '0.04em' }}>
              CAMPUS NETWORK ACTIVE • RUNGTA (R1/R2), BIT DURG &amp; BHILAI
            </span>
          </div>

          <h1
            style={{
              fontSize: 'clamp(2.4rem, 5vw, 3.8rem)',
              fontFamily: 'var(--font-display)',
              fontWeight: 800,
              letterSpacing: '-0.035em',
              lineHeight: 1.1,
              margin: '0 0 1.25rem 0',
              color: '#0F172A',
              textWrap: 'balance',
            }}
          >
            University Living,{' '}
            <span
              style={{
                display: 'block',
                background: 'linear-gradient(135deg, #14532D 0%, #15803D 55%, #16A34A 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Completely Simplified.
            </span>
          </h1>

          <p
            style={{
              fontSize: 'clamp(1rem, 1.35vw, 1.18rem)',
              fontFamily: 'var(--font-body)',
              color: '#475569',
              lineHeight: 1.65,
              maxWidth: '720px',
              margin: '0 auto 2rem',
              textWrap: 'pretty',
              fontWeight: 400,
            }}
          >
            Pre-inspected student rooms with zero brokerage, 30-min late-night mess delivery, and 24h doorstep steam laundry — unified in one intelligent campus operating system.
          </p>

          {/* 1. Category Switcher (Clean White Glass Pill) */}
          <div
            role="tablist"
            aria-label="Service Category Switcher"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              backgroundColor: '#FFFFFF',
              border: '1px solid rgba(22, 163, 74, 0.2)',
              borderRadius: '9999px',
              padding: '6px',
              boxShadow: '0 4px 20px -2px rgba(15, 81, 50, 0.08)',
              gap: '6px',
              flexWrap: 'wrap',
              justifyContent: 'center',
              margin: '0 auto 1.5rem',
              maxWidth: '100%',
            }}
          >
            {[
              {
                id: 'pg',
                label: 'Hostels & PGs',
                icon: PgLivingIcon,
                count: REFERENCE_PGS.length,
                themeColor: '#10B981',
                activeBg: 'linear-gradient(135deg, #10B981, #059669)',
                activeGlow: '0 4px 16px rgba(16, 185, 129, 0.35)',
              },
              {
                id: 'meals',
                label: 'Daily Mess',
                icon: MessCulinaryIcon,
                count: REFERENCE_MEALS.length,
                themeColor: '#F59E0B',
                activeBg: 'linear-gradient(135deg, #F59E0B, #D97706)',
                activeGlow: '0 4px 16px rgba(245, 158, 11, 0.35)',
              },
              {
                id: 'laundry',
                label: 'Doorstep Laundry',
                icon: LaundryAquaIcon,
                count: REFERENCE_LAUNDRY.length,
                themeColor: '#06B6D4',
                activeBg: 'linear-gradient(135deg, #06B6D4, #0284C7)',
                activeGlow: '0 4px 16px rgba(6, 182, 212, 0.35)',
              },
              {
                id: 'extra',
                label: 'Extra Services',
                icon: ExtraServicesGridIcon,
                count: REFERENCE_EXTRA_SERVICES.length,
                themeColor: '#818CF8',
                activeBg: 'linear-gradient(135deg, #6366F1, #4F46E5)',
                activeGlow: '0 4px 16px rgba(99, 102, 241, 0.35)',
              },
              {
                id: 'contact',
                label: 'Student Support',
                icon: VerifiedSupportIcon,
                themeColor: '#EC4899',
                activeBg: 'linear-gradient(135deg, #EC4899, #DB2777)',
                activeGlow: '0 4px 16px rgba(236, 72, 153, 0.35)',
              },
            ].map((tab) => {
              const isActive = activeCategory === tab.id;
              const IconComponent = tab.icon;
              return (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  className="easehub-tab-btn"
                  onClick={() => {
                    setActiveCategory(tab.id as ActiveCategory);
                  }}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.45rem',
                    padding: '0.48rem 1.15rem',
                    minHeight: '40px',
                    borderRadius: '9999px',
                    background: isActive ? tab.activeBg : 'transparent',
                    color: isActive ? '#FFFFFF' : 'var(--color-text-secondary)',
                    border: isActive ? '1px solid rgba(255, 255, 255, 0.2)' : '1px solid transparent',
                    fontSize: '0.82rem',
                    fontFamily: 'var(--font-family-button)',
                    fontWeight: isActive ? 700 : 500,
                    cursor: 'pointer',
                    boxShadow: isActive ? tab.activeGlow : 'none',
                    transition: 'all 0.18s ease',
                  }}
                >
                  <IconComponent
                    size={16}
                    color={isActive ? '#FFFFFF' : tab.themeColor}
                    secondaryColor={isActive ? '#FFFFFF' : undefined}
                  />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* 2. Unified Search Experience */}
          <HomepageSearch
            query={searchQuery}
            onQueryChange={setSearchQuery}
            selectedCategory={activeCategory}
            onSelectCategory={(cat) => {
              setActiveCategory(cat);
              setSearchQuery('');
            }}
            onSelectItem={(item) => {
              setActiveCategory(item.category);
              setSearchQuery(item.name);
            }}
          />

          {/* 3. Dribbble-Grade Sleek Trust Micro-Bar */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.6rem',
              flexWrap: 'wrap',
              marginTop: '1.25rem',
            }}
          >
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                color: '#15803D',
                backgroundColor: '#DCFCE7',
                border: '1px solid #86EFAC',
                padding: '0.3rem 0.75rem',
                borderRadius: '9999px',
                fontSize: '0.78rem',
                fontWeight: 700,
              }}
            >
              <ShieldCheck size={14} color="#15803D" /> 100% Zero Brokerage
            </span>

            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                color: '#854D0E',
                backgroundColor: '#FEF08A',
                border: '1px solid #FDE047',
                padding: '0.3rem 0.75rem',
                borderRadius: '9999px',
                fontSize: '0.78rem',
                fontWeight: 700,
              }}
            >
              <Clock size={14} color="#854D0E" /> 12-Min Midnight Delivery
            </span>

            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                color: '#0369A1',
                backgroundColor: '#E0F2FE',
                border: '1px solid #BAE6FD',
                padding: '0.3rem 0.75rem',
                borderRadius: '9999px',
                fontSize: '0.78rem',
                fontWeight: 700,
              }}
            >
              <Shirt size={14} color="#0369A1" /> 24h Doorstep Wash
            </span>

            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                color: '#6B21A8',
                backgroundColor: '#F3E8FF',
                border: '1px solid #DDD6FE',
                padding: '0.3rem 0.75rem',
                borderRadius: '9999px',
                fontSize: '0.78rem',
                fontWeight: 700,
              }}
            >
              <CheckCircle2 size={14} color="#6B21A8" /> Campus Verified Stays
            </span>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 2. DRIBBBLE-GRADE UNIFIED CATALOG DISCOVERY TOOLBAR                      */}
        {/* ========================================================================= */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '0.85rem',
            marginBottom: '1.75rem',
            padding: '0.65rem 1.1rem',
            background: '#FFFFFF',
            border: '1px solid rgba(22, 163, 74, 0.18)',
            borderRadius: '16px',
            boxShadow: '0 4px 18px -2px rgba(15, 81, 50, 0.06)',
          }}
        >
          {/* Left: Neighborhood Area Filter Pills */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', flexWrap: 'wrap' }}>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.25rem',
                fontSize: '0.72rem',
                fontWeight: 700,
                color: '#64748B',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                marginRight: '0.25rem',
              }}
            >
              <MapPin size={12} color="#EF4444" />
              Area:
            </span>
            {NEIGHBORHOOD_AREAS.map((area) => {
              const isSelected = areaFilter === area.id;
              return (
                <button
                  key={area.id}
                  type="button"
                  aria-pressed={isSelected}
                  onClick={() => setAreaFilter(area.id)}
                  style={{
                    padding: '0.32rem 0.75rem',
                    borderRadius: '9999px',
                    fontSize: '0.78rem',
                    fontWeight: isSelected ? 700 : 500,
                    backgroundColor: isSelected ? 'rgba(22, 163, 74, 0.12)' : '#F8FAF7',
                    color: isSelected ? '#15803D' : '#475569',
                    border: isSelected ? '1px solid #16A34A' : '1px solid rgba(0, 0, 0, 0.08)',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {area.label}
                </button>
              );
            })}
          </div>

          {/* Right: Category-specific Controls & Live Vacancy Badge */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap' }}>
            {activeCategory === 'pg' && (
              <div
                style={{
                  display: 'inline-flex',
                  padding: '3px',
                  backgroundColor: '#F8FAF7',
                  borderRadius: '9999px',
                  border: '1px solid rgba(22, 163, 74, 0.18)',
                }}
              >
                {[
                  { id: 'all', label: 'All PGs' },
                  { id: 'male', label: 'Boys' },
                  { id: 'female', label: 'Girls' },
                  { id: 'unisex', label: 'Co-ed' },
                ].map((pill) => {
                  const isSelected = genderFilter === pill.id;
                  return (
                    <button
                      key={pill.id}
                      type="button"
                      aria-pressed={isSelected}
                      onClick={() => setGenderFilter(pill.id as GenderFilter)}
                      style={{
                        padding: '0.28rem 0.75rem',
                        borderRadius: '9999px',
                        fontSize: '0.78rem',
                        fontWeight: isSelected ? 700 : 500,
                        backgroundColor: isSelected ? '#15803D' : 'transparent',
                        color: isSelected ? '#FFFFFF' : '#475569',
                        border: 'none',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      {pill.label}
                    </button>
                  );
                })}
              </div>
            )}

            {/* Live Room & Bed Vacancy Capsule (for PG) */}
            {activeCategory === 'pg' && (
              <button
                type="button"
                onClick={() => {
                  if (onOpenTracker) onOpenTracker('pg');
                  else window.dispatchEvent(new CustomEvent('easehub_open_order_tracker', { detail: { tab: 'pg' } }));
                }}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  padding: '0.35rem 0.85rem',
                  borderRadius: '9999px',
                  backgroundColor: 'rgba(22, 163, 74, 0.1)',
                  border: '1px solid rgba(22, 163, 74, 0.28)',
                  color: '#15803D',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                <span
                  style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    backgroundColor: '#10B981',
                    boxShadow: '0 0 8px #10B981',
                  }}
                />
                <span>{totalVacantBeds} Beds Vacant</span>
                <ArrowRight size={12} />
              </button>
            )}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 3. SERVICE CATALOG GRID & STATE PRESENTATION                             */}
        {/* ========================================================================= */}

        {/* PG / HOSTEL TAB */}
        {activeCategory === 'pg' && (
          <div>

            {filteredPGs.length === 0 ? (
              <div
                style={{
                  textAlign: 'center',
                  padding: '3.5rem 1.5rem',
                  backgroundColor: 'var(--color-surface-1)',
                  borderRadius: '16px',
                  border: '1px solid var(--color-border-subtle)',
                  maxWidth: '560px',
                  marginInline: 'auto',
                }}
              >
                <div
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: 'var(--radius-pill)',
                    backgroundColor: 'var(--color-surface-2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 1.25rem auto',
                    color: 'var(--color-text-muted)',
                  }}
                >
                  <FilterX size={24} />
                </div>
                <h3
                  style={{
                    fontSize: 'var(--text-h3)',
                    fontFamily: 'var(--font-family-h3)',
                    fontWeight: 700,
                    color: 'var(--color-text-primary)',
                    margin: '0 0 0.5rem 0',
                  }}
                >
                  No matching student accommodations
                </h3>
                <p
                  style={{
                    color: 'var(--color-text-secondary)',
                    fontSize: 'var(--text-body-sm)',
                    lineHeight: 1.5,
                    margin: '0 0 1.5rem 0',
                  }}
                >
                  {searchQuery
                    ? `No verified PGs matched "${searchQuery}"${areaFilter !== 'all' ? ` in ${NEIGHBORHOOD_AREAS.find(a => a.id === areaFilter)?.label}` : ''}.`
                    : `No verified PGs found in ${NEIGHBORHOOD_AREAS.find(a => a.id === areaFilter)?.label} matching your gender selection.`}
                </p>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.75rem',
                    flexWrap: 'wrap',
                  }}
                >
                  <button
                    type="button"
                    onClick={handleResetFilters}
                    style={{
                      padding: '0.65rem 1.25rem',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: 'var(--color-surface-2)',
                      color: 'var(--color-text-primary)',
                      border: '1px solid var(--color-border-subtle)',
                      fontSize: 'var(--text-body-sm)',
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'background-color var(--duration-fast)',
                    }}
                  >
                    Reset all filters
                  </button>

                  <button
                    type="button"
                    onClick={handleWhatsAppCustomInquiry}
                    style={{
                      padding: '0.65rem 1.25rem',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: 'var(--color-brand-green, #10B981)',
                      color: '#FFFFFF',
                      border: 'none',
                      fontSize: 'var(--text-body-sm)',
                      fontWeight: 600,
                      cursor: 'pointer',
                      boxShadow: '0 2px 8px rgba(16, 185, 129, 0.25)',
                    }}
                  >
                    Ask Concierge on WhatsApp
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <div
                  style={{
                    marginBottom: '1rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontSize: 'var(--text-caption)',
                    color: 'var(--color-text-muted)',
                  }}
                >
                  <span>Showing {filteredPGs.length} verified properties</span>
                  {(searchQuery || areaFilter !== 'all' || genderFilter !== 'all') && (
                    <button
                      type="button"
                      onClick={handleResetFilters}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: 'var(--color-brand-blue)',
                        cursor: 'pointer',
                        fontSize: 'var(--text-caption)',
                        fontWeight: 600,
                      }}
                    >
                      Clear active filters
                    </button>
                  )}
                </div>

                {/* DIVIDED SECTIONS RENDERING */}
                {genderFilter === 'all' ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
                    {/* SECTION 1: BOYS HOSTELS & PGS */}
                    {boysPGs.length > 0 && (
                      <div id="pg-boys">
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            marginBottom: '1.25rem',
                            paddingBottom: '0.75rem',
                            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <BoysResidenceBadgeIcon size={20} />
                            <div>
                              <div style={{ marginBottom: '2px' }}>
                                <span className="monograph-chip" style={{ color: '#0284C7', borderColor: 'rgba(2, 132, 199, 0.3)', backgroundColor: '#E0F2FE' }}>
                                  01 // BOYS RESIDENCES
                                </span>
                              </div>
                              <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800, color: '#0F172A' }}>
                                Verified Boys Hostels &amp; PGs
                              </h3>
                            </div>
                          </div>
                          <span style={{ fontSize: '0.8rem', color: '#475569', fontWeight: 600 }}>
                            {boysPGs.length} Verified Properties
                          </span>
                        </div>
                        <div
                          style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 300px), 1fr))',
                            gap: '1.75rem',
                          }}
                        >
                          {boysPGs.map((item) => (
                            <ReferenceServiceCard
                              key={item.id}
                              item={item}
                              onBookNow={handleCardBookNow}
                            />
                          ))}
                        </div>
                      </div>
                    )}

                    {/* SECTION 2: GIRLS HOSTELS & RESIDENCES */}
                    {girlsPGs.length > 0 && (
                      <div id="pg-girls">
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            marginBottom: '1.25rem',
                            paddingBottom: '0.75rem',
                            borderBottom: '1px solid rgba(22, 163, 74, 0.15)',
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <GirlsResidenceBadgeIcon size={20} />
                            <div>
                              <div style={{ marginBottom: '2px' }}>
                                <span className="monograph-chip" style={{ color: '#DB2777', borderColor: 'rgba(219, 39, 119, 0.3)', backgroundColor: '#FCE7F3' }}>
                                  02 // GIRLS RESIDENCES
                                </span>
                              </div>
                              <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800, color: '#0F172A' }}>
                                Verified Girls Hostels &amp; PGs (CCTV &amp; Warden Security)
                              </h3>
                            </div>
                          </div>
                          <span style={{ fontSize: '0.8rem', color: '#475569', fontWeight: 600 }}>
                            {girlsPGs.length} Verified Properties
                          </span>
                        </div>
                        <div
                          style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 300px), 1fr))',
                            gap: '1.75rem',
                          }}
                        >
                          {girlsPGs.map((item) => (
                            <ReferenceServiceCard
                              key={item.id}
                              item={item}
                              onBookNow={handleCardBookNow}
                            />
                          ))}
                        </div>
                      </div>
                    )}

                    {/* SECTION 3: INDEPENDENT ROOMS & SHARED FLATS */}
                    {unisexPGs.length > 0 && (
                      <div id="pg-independent">
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            marginBottom: '1.25rem',
                            paddingBottom: '0.75rem',
                            borderBottom: '1px solid rgba(22, 163, 74, 0.15)',
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <IndependentLivingBadgeIcon size={20} />
                            <div>
                              <div style={{ marginBottom: '2px' }}>
                                <span className="monograph-chip" style={{ color: '#4F46E5', borderColor: 'rgba(79, 70, 229, 0.3)', backgroundColor: '#EEF2FF' }}>
                                  03 // INDEPENDENT &amp; SHARING
                                </span>
                              </div>
                              <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800, color: '#0F172A' }}>
                                Single Rooms, 1BHK Flats &amp; Co-Living
                              </h3>
                            </div>
                          </div>
                          <span style={{ fontSize: '0.8rem', color: '#475569', fontWeight: 600 }}>
                            {unisexPGs.length} Verified Properties
                          </span>
                        </div>
                        <div
                          style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 300px), 1fr))',
                            gap: '1.75rem',
                          }}
                        >
                          {unisexPGs.map((item) => (
                            <ReferenceServiceCard
                              key={item.id}
                              item={item}
                              onBookNow={handleCardBookNow}
                            />
                          ))}
                        </div>
                      </div>
                    )}
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
          </div>
        )}

        {/* MEALS & MESS TAB */}
        {activeCategory === 'meals' && (
          <div>
            {/* Live Today's Kitchen Menu & Dispatch Banner */}
            <div
              style={{
                marginBottom: '1.5rem',
                padding: '1.25rem 1.5rem',
                backgroundColor: 'rgba(245, 158, 11, 0.08)',
                border: '1px solid rgba(245, 158, 11, 0.25)',
                borderRadius: '16px',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '0.75rem',
                  marginBottom: '1rem',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <div
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '10px',
                      backgroundColor: 'rgba(245, 158, 11, 0.2)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#F59E0B',
                    }}
                  >
                    <MessCulinaryIcon size={20} />
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <h4 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: '#0F172A' }}>
                        Today's Live Kitchen Menu &amp; Dispatch
                      </h4>
                      <span
                        style={{
                          fontSize: '0.68rem',
                          fontWeight: 800,
                          padding: '0.2rem 0.6rem',
                          borderRadius: '9999px',
                          backgroundColor: '#FEF08A',
                          color: '#854D0E',
                          border: '1px solid #FDE047',
                        }}
                      >
                        {messState.stageLabel}
                      </span>
                    </div>
                    <span style={{ fontSize: '0.8rem', color: '#475569', fontWeight: 600 }}>
                      {messState.stageDescription}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    if (onOpenTracker) onOpenTracker('mess');
                    else window.dispatchEvent(new CustomEvent('easehub_open_order_tracker', { detail: { tab: 'mess' } }));
                  }}
                  style={{
                    padding: '0.55rem 1.1rem',
                    backgroundColor: '#15803D',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: '10px',
                    fontSize: '0.82rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    boxShadow: '0 2px 8px rgba(21, 128, 61, 0.25)',
                  }}
                >
                  <Clock size={14} />
                  <span>Track Meal Arrival ({messState.estimatedTime})</span>
                </button>
              </div>

              {/* Menu Cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '0.85rem' }}>
                <div style={{ backgroundColor: '#FEF9C3', padding: '0.85rem 1rem', borderRadius: '12px', border: '1px solid #FDE047', borderLeft: '4px solid #EAB308' }}>
                  <span style={{ fontSize: '0.74rem', fontWeight: 800, color: '#854D0E', textTransform: 'uppercase' }}>
                    ☀️ Lunch Thali (12:30 PM - 02:30 PM)
                  </span>
                  <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.86rem', color: '#0F172A', fontWeight: 600, lineHeight: 1.45 }}>
                    {messState.todayMenu.lunch}
                  </p>
                </div>

                <div style={{ backgroundColor: '#EFF5EC', padding: '0.85rem 1rem', borderRadius: '12px', border: '1px solid #DCFCE7', borderLeft: '4px solid #16A34A' }}>
                  <span style={{ fontSize: '0.74rem', fontWeight: 800, color: '#15803D', textTransform: 'uppercase' }}>
                    🌙 Dinner Thali (07:45 PM - 10:00 PM)
                  </span>
                  <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.86rem', color: '#0F172A', fontWeight: 600, lineHeight: 1.45 }}>
                    {messState.todayMenu.dinner}
                  </p>
                </div>
              </div>
            </div>

            {filteredMeals.length === 0 ? (
              <div
                style={{
                  textAlign: 'center',
                  padding: '3.5rem 1.5rem',
                  backgroundColor: 'var(--color-surface-1)',
                  borderRadius: '16px',
                  border: '1px solid var(--color-border-subtle)',
                  maxWidth: '560px',
                  marginInline: 'auto',
                }}
              >
                <div
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: 'var(--radius-pill)',
                    backgroundColor: 'var(--color-surface-2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 1.25rem auto',
                    color: 'var(--color-text-muted)',
                  }}
                >
                  <FilterX size={24} />
                </div>
                <h3 style={{ fontSize: 'var(--text-h3)', fontWeight: 700, color: 'var(--color-text-primary)', margin: '0 0 0.5rem 0' }}>
                  No meal subscriptions found
                </h3>
                <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-body-sm)', margin: '0 0 1.5rem 0' }}>
                  No meal plans matched "{searchQuery}".
                </p>
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  style={{
                    padding: '0.65rem 1.25rem',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'var(--color-surface-2)',
                    color: 'var(--color-text-primary)',
                    border: '1px solid var(--color-border-subtle)',
                    fontSize: 'var(--text-body-sm)',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Clear search query
                </button>
              </div>
            ) : (
              <div>
                <div style={{ marginBottom: '1rem', fontSize: 'var(--text-caption)', color: 'var(--color-text-muted)' }}>
                  Showing {filteredMeals.length} verified mess packages & thali plans
                </div>
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
              </div>
            )}
          </div>
        )}

        {/* LAUNDRY TAB */}
        {activeCategory === 'laundry' && (
          <div>
            {/* Live Laundry Timeline Status Banner */}
            <div
              style={{
                marginBottom: '1.5rem',
                padding: '1.1rem 1.4rem',
                backgroundColor: 'rgba(6, 182, 212, 0.08)',
                border: '1px solid rgba(6, 182, 212, 0.25)',
                borderRadius: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '0.85rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '10px',
                    backgroundColor: 'rgba(6, 182, 212, 0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#06B6D4',
                  }}
                >
                  <LaundryAquaIcon size={20} />
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontSize: '0.92rem', fontWeight: 800, color: '#0F172A' }}>
                      Doorstep Laundry Hub Status:
                    </span>
                    <span
                      style={{
                        fontSize: '0.72rem',
                        fontWeight: 800,
                        color: '#0369A1',
                        backgroundColor: '#E0F2FE',
                        border: '1px solid #BAE6FD',
                        padding: '0.15rem 0.6rem',
                        borderRadius: '6px',
                      }}
                    >
                      {laundryState.stageLabel}
                    </span>
                  </div>
                  <span style={{ fontSize: '0.8rem', color: '#334155', fontWeight: 600 }}>
                    Batch <strong style={{ color: '#0F172A' }}>{laundryState.activeBatchCode}</strong> • Est. Doorstep Delivery {laundryState.estimatedDelivery}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  if (onOpenTracker) onOpenTracker('laundry');
                  else window.dispatchEvent(new CustomEvent('easehub_open_order_tracker', { detail: { tab: 'laundry' } }));
                }}
                style={{
                  padding: '0.55rem 1.1rem',
                  backgroundColor: '#0284C7',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '10px',
                  fontSize: '0.82rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  boxShadow: '0 2px 8px rgba(2, 132, 199, 0.3)',
                }}
              >
                <Clock size={14} />
                <span>Track 5-Step Process</span>
              </button>
            </div>

            {filteredLaundry.length === 0 ? (
              <div
                style={{
                  textAlign: 'center',
                  padding: '3.5rem 1.5rem',
                  backgroundColor: 'var(--color-surface-1)',
                  borderRadius: '16px',
                  border: '1px solid var(--color-border-subtle)',
                  maxWidth: '560px',
                  marginInline: 'auto',
                }}
              >
                <div
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: 'var(--radius-pill)',
                    backgroundColor: 'var(--color-surface-2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 1.25rem auto',
                    color: 'var(--color-text-muted)',
                  }}
                >
                  <FilterX size={24} />
                </div>
                <h3 style={{ fontSize: 'var(--text-h3)', fontWeight: 700, color: 'var(--color-text-primary)', margin: '0 0 0.5rem 0' }}>
                  No laundry plans found
                </h3>
                <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-body-sm)', margin: '0 0 1.5rem 0' }}>
                  No laundry packages matched "{searchQuery}".
                </p>
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  style={{
                    padding: '0.65rem 1.25rem',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'var(--color-surface-2)',
                    color: 'var(--color-text-primary)',
                    border: '1px solid var(--color-border-subtle)',
                    fontSize: 'var(--text-body-sm)',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Clear search query
                </button>
              </div>
            ) : (
              <div>
                <div style={{ marginBottom: '1rem', fontSize: 'var(--text-caption)', color: 'var(--color-text-muted)' }}>
                  Showing {filteredLaundry.length} doorstep laundry and steam iron packages
                </div>
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
                  padding: '3.5rem 1.5rem',
                  backgroundColor: 'var(--color-surface-1)',
                  borderRadius: '16px',
                  border: '1px solid var(--color-border-subtle)',
                  maxWidth: '560px',
                  marginInline: 'auto',
                }}
              >
                <div
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: 'var(--radius-pill)',
                    backgroundColor: 'var(--color-surface-2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 1.25rem auto',
                    color: 'var(--color-text-muted)',
                  }}
                >
                  <FilterX size={24} />
                </div>
                <h3
                  style={{
                    fontSize: 'var(--text-h3)',
                    fontWeight: 700,
                    color: 'var(--color-text-primary)',
                    margin: '0 0 0.5rem 0',
                  }}
                >
                  No extra services found
                </h3>
                <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-body-sm)', margin: '0 0 1.5rem 0' }}>
                  No campus services matched "{searchQuery}".
                </p>
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  style={{
                    padding: '0.65rem 1.25rem',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'var(--color-surface-2)',
                    color: 'var(--color-text-primary)',
                    border: '1px solid var(--color-border-subtle)',
                    fontSize: 'var(--text-body-sm)',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Clear search query
                </button>
              </div>
            ) : (
              <div>
                <div
                  style={{
                    marginBottom: '1rem',
                    fontSize: 'var(--text-caption)',
                    color: 'var(--color-text-muted)',
                  }}
                >
                  Showing {filteredExtra.length} student room cleaning, Wi-Fi, and moving services
                </div>
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
              </div>
            )}
          </div>
        )}

        {/* CONTACT / CONCIERGE HELP TAB */}
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
              }}
            >
              <div>
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.35rem 0.75rem',
                    borderRadius: '9999px',
                    backgroundColor: 'rgba(88, 169, 64, 0.15)',
                    color: '#58A940',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    marginBottom: '1rem',
                  }}
                >
                  <MessageCircle size={14} />
                  <span>Instant Response Desk</span>
                </div>
                <h3 style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--color-text-primary)', margin: '0 0 0.75rem 0' }}>
                  WhatsApp Concierge
                </h3>
                <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.92rem', lineHeight: 1.6, margin: '0 0 1.5rem 0' }}>
                  Need immediate help finding an AC PG, booking a trial mess lunch, or custom luggage shifting? Text our campus team directly.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--color-text-secondary)', fontSize: '0.88rem' }}>
                    <Clock size={16} color="var(--color-brand-blue)" />
                    <span>Active 9:00 AM – 9:00 PM Daily</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--color-text-secondary)', fontSize: '0.88rem' }}>
                    <ShieldCheck size={16} color="var(--color-brand-green)" />
                    <span>Zero Brokerage &amp; Pre-inspected Properties</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--color-text-secondary)', fontSize: '0.88rem' }}>
                    <Building size={16} color="#FAC908" />
                    <span>Serving Rungta (R1/R2), BIT Durg &amp; Bhilai Institutions</span>
                  </div>
                </div>
              </div>

              <a
                href="https://wa.me/918102848776?text=Hello%20EaseHub!%20I%20need%20assistance%20finding%20student%20services%20near%20Rungta%20Bhilai."
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  padding: '0.85rem 1.5rem',
                  backgroundColor: '#25D366', // WhatsApp Green
                  color: '#FFFFFF',
                  borderRadius: '9999px',
                  fontWeight: 700,
                  fontSize: '0.95rem',
                  textDecoration: 'none',
                  boxShadow: '0 4px 14px rgba(37, 211, 102, 0.3)',
                  transition: 'background-color 0.15s',
                }}
              >
                <MessageCircle size={18} />
                <span>Chat on WhatsApp (+91 81028 48776)</span>
              </a>
            </div>

            {/* Card 2: Request Instant Callback Form */}
            <div
              style={{
                backgroundColor: 'var(--color-surface-1)',
                borderRadius: '16px',
                border: '1px solid var(--color-border-subtle)',
                padding: '2rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.35rem 0.75rem',
                    borderRadius: '9999px',
                    backgroundColor: 'rgba(59, 130, 246, 0.15)',
                    color: 'var(--color-brand-blue)',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    marginBottom: '1rem',
                  }}
                >
                  <Phone size={14} />
                  <span>Callback Request</span>
                </div>
                <h3 style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--color-text-primary)', margin: '0 0 0.75rem 0' }}>
                  Request a Free Callback
                </h3>
                <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.92rem', lineHeight: 1.6, margin: '0 0 1.25rem 0' }}>
                  Leave your number and our student liaison will reach out to schedule site visits or arrange mess trials.
                </p>

                {contactSubmitted ? (
                  <div
                    style={{
                      padding: '1.5rem',
                      backgroundColor: 'rgba(88, 169, 64, 0.12)',
                      borderRadius: '12px',
                      border: '1px solid rgba(88, 169, 64, 0.3)',
                      textAlign: 'center',
                      color: '#58A940',
                    }}
                  >
                    <CheckCircle2 size={32} style={{ margin: '0 auto 0.5rem auto' }} />
                    <p style={{ fontWeight: 700, margin: '0 0 0.25rem 0' }}>Request Prepared!</p>
                    <p style={{ fontSize: '0.82rem', color: 'var(--color-text-secondary)', margin: 0 }}>
                      WhatsApp window opened with your pre-filled inquiry.
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
                        placeholder="e.g. Aditya Verma"
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
                        Mobile / WhatsApp Number <span style={{ color: '#EF4444' }}>*</span>
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="10-digit mobile number"
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

        {/* ========================================================================= */}
        {/* 5. CLEAR ROUTE TO BROWSE COMPLETE CATALOG                                */}
        {/* ========================================================================= */}
        <div
          style={{
            marginTop: '3.5rem',
            padding: '1.75rem',
            backgroundColor: 'var(--color-surface-1)',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--color-border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1.5rem',
            flexWrap: 'wrap',
          }}
        >
          <div style={{ maxWidth: '600px' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                color: '#15803D',
                fontSize: '1rem',
                fontWeight: 800,
                marginBottom: '0.35rem',
              }}
            >
              <Compass size={18} color="#15803D" />
              <span>Explore Full Campus Catalog</span>
            </div>
            <p
              style={{
                fontSize: '0.88rem',
                color: '#334155',
                lineHeight: 1.5,
                margin: 0,
                fontWeight: 500,
              }}
            >
              Need to see all verified service categories with full specifications and campus coverage?
            </p>
          </div>

          <button
            type="button"
            onClick={() => window.dispatchEvent(new CustomEvent('easehub_open_order_tracker'))}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.75rem 1.35rem',
              minHeight: '44px',
              backgroundColor: '#10B981',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: 'var(--radius-pill)',
              fontSize: 'var(--text-button)',
              fontFamily: 'var(--font-family-button)',
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(16, 185, 129, 0.35)',
              transition: 'all var(--duration-fast)',
            }}
          >
            <span>Launch Live Delivery Tracker</span>
            <ArrowRight size={16} />
          </button>
        </div>
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
