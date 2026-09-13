import React from 'react';
import { Home, Utensils, Shirt, Zap, Check, ArrowRight } from 'lucide-react';
import { Container } from '../../primitives/Container';

export interface ServiceCardData {
  id: string;
  slug: string;
  title: string;
  icon: React.ComponentType<{ size?: number; className?: string; style?: React.CSSProperties }>;
  iconBg: string;
  iconColor: string;
  description: string;
  features: string[];
  ctaLabel: string;
}

export const CORE_SERVICES_DATA: ServiceCardData[] = [
  {
    id: 'pg',
    slug: 'pg',
    title: 'PG/Hostel',
    icon: Home,
    iconBg: 'rgba(34, 197, 94, 0.12)',
    iconColor: '#16A34A',
    description: 'Find verified, safe, and affordable accommodations near your college',
    features: [
      'Verified listings',
      '24/7 security',
      'Modern amenities',
      'Flexible pricing',
    ],
    ctaLabel: 'Explore PG/Hostel',
  },
  {
    id: 'meals',
    slug: 'mess',
    title: 'Meal Plans',
    icon: Utensils,
    iconBg: 'rgba(234, 179, 8, 0.14)',
    iconColor: '#CA8A04',
    description: 'Healthy, home-cooked meals delivered fresh to your doorstep',
    features: [
      'Daily & monthly plans',
      'Veg & non-veg options',
      'Fresh ingredients',
      'On-time delivery',
    ],
    ctaLabel: 'Explore Meal Plans',
  },
  {
    id: 'laundry',
    slug: 'laundry',
    title: 'Laundry Service',
    icon: Shirt,
    iconBg: 'rgba(59, 130, 246, 0.12)',
    iconColor: '#2563EB',
    description: 'Hassle-free laundry pickup, wash, iron, and delivery',
    features: [
      'Doorstep pickup',
      'Fast turnaround',
      'Premium care',
      'Affordable pricing',
    ],
    ctaLabel: 'Explore Laundry Service',
  },
  {
    id: 'extra',
    slug: 'room-cleaning',
    title: 'Extra Services',
    icon: Zap,
    iconBg: 'rgba(168, 85, 247, 0.12)',
    iconColor: '#9333EA',
    description: 'From room cleaning to repairs - everything you need',
    features: [
      'Verified professionals',
      'Quick response',
      'Transparent pricing',
      'Quality assured',
    ],
    ctaLabel: 'Explore Extra Services',
  },
];

export interface EverythingYouNeedSectionProps {
  onSelectService?: (slug: string) => void;
}

export const EverythingYouNeedSection: React.FC<EverythingYouNeedSectionProps> = ({
  onSelectService,
}) => {
  const handleServiceClick = (slug: string) => {
    if (onSelectService) {
      onSelectService(slug);
    } else {
      window.location.hash = `#services/${slug}`;
    }
  };

  return (
    <section
      id="services"
      aria-labelledby="services-heading"
      style={{
        padding: '5rem 0',
        backgroundColor: 'var(--color-bg-primary, #FFFFFF)',
        position: 'relative',
      }}
    >
      <Container variant="wide">
        {/* Section Header */}
        <div
          style={{
            textAlign: 'center',
            maxWidth: '680px',
            margin: '0 auto 3.5rem',
          }}
        >
          <h2
            id="services-heading"
            style={{
              fontFamily: 'var(--font-display, inherit)',
              fontSize: 'clamp(2rem, 3.5vw, 2.75rem)',
              fontWeight: 800,
              letterSpacing: '-0.03em',
              color: 'var(--color-text-primary, #0F172A)',
              marginBottom: '0.75rem',
            }}
          >
            Everything You Need
          </h2>
          <p
            style={{
              fontSize: '1.1rem',
              color: 'var(--color-text-secondary, #475569)',
              lineHeight: 1.6,
            }}
          >
            All essential student services in one platform
          </p>
        </div>

        {/* 4 Cards Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '1.5rem',
          }}
        >
          {CORE_SERVICES_DATA.map((service) => {
            const IconComponent = service.icon;
            return (
              <div
                key={service.id}
                className="easehub-service-card"
                style={{
                  backgroundColor: 'var(--color-surface-1, #FFFFFF)',
                  border: '1px solid var(--color-border-default, #E2E8F0)',
                  borderRadius: '16px',
                  padding: '2rem 1.75rem',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease',
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.04)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-6px)';
                  e.currentTarget.style.boxShadow = '0 16px 32px rgba(0, 0, 0, 0.08)';
                  e.currentTarget.style.borderColor = 'var(--color-brand-blue, #0F382C)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'none';
                  e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.04)';
                  e.currentTarget.style.borderColor = 'var(--color-border-default, #E2E8F0)';
                }}
              >
                {/* Icon Badge */}
                <div
                  style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: '14px',
                    backgroundColor: service.iconBg,
                    color: service.iconColor,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '1.5rem',
                  }}
                >
                  <IconComponent size={28} />
                </div>

                {/* Title */}
                <h3
                  style={{
                    fontFamily: 'var(--font-display, inherit)',
                    fontSize: '1.35rem',
                    fontWeight: 700,
                    color: 'var(--color-text-primary, #0F172A)',
                    marginBottom: '0.65rem',
                    letterSpacing: '-0.02em',
                  }}
                >
                  {service.title}
                </h3>

                {/* Description */}
                <p
                  style={{
                    fontSize: '0.925rem',
                    color: 'var(--color-text-secondary, #64748B)',
                    lineHeight: 1.55,
                    marginBottom: '1.5rem',
                    minHeight: '44px',
                  }}
                >
                  {service.description}
                </p>

                {/* Features Checklist */}
                <ul
                  style={{
                    listStyle: 'none',
                    padding: 0,
                    margin: '0 0 2rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.65rem',
                    flex: 1,
                  }}
                >
                  {service.features.map((feature, idx) => (
                    <li
                      key={idx}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.6rem',
                        fontSize: '0.88rem',
                        color: 'var(--color-text-primary, #334155)',
                        fontWeight: 500,
                      }}
                    >
                      <span
                        style={{
                          width: '18px',
                          height: '18px',
                          borderRadius: '50%',
                          backgroundColor: 'rgba(34, 197, 94, 0.15)',
                          color: '#16A34A',
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                        }}
                      >
                        <Check size={12} strokeWidth={3} />
                      </span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* Explore Action Button */}
                <button
                  type="button"
                  onClick={() => handleServiceClick(service.slug)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    width: '100%',
                    padding: '0.85rem 1rem',
                    borderRadius: '12px',
                    border: '1px solid var(--color-border-default, #E2E8F0)',
                    backgroundColor: 'transparent',
                    color: 'var(--color-text-primary, #0F172A)',
                    fontFamily: 'var(--font-display, inherit)',
                    fontWeight: 600,
                    fontSize: '0.92rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--color-brand-blue, #0F382C)';
                    e.currentTarget.style.color = '#FFFFFF';
                    e.currentTarget.style.borderColor = 'var(--color-brand-blue, #0F382C)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = 'var(--color-text-primary, #0F172A)';
                    e.currentTarget.style.borderColor = 'var(--color-border-default, #E2E8F0)';
                  }}
                >
                  <span>{service.ctaLabel}</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
};
