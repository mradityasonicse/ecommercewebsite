import React, { useState, useMemo } from 'react';
import { Search, Filter, ShieldCheck, MapPin, Clock, Star, ArrowUpRight } from 'lucide-react';
import type { Campus } from '../../data/campuses';
import { PROVIDERS, type Provider } from '../../data/providers';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { FadeReveal } from '../motion/FadeReveal';

interface DiscoverySectionProps {
  selectedCampus: Campus;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onSelectProvider: (provider: Provider) => void;
}

export const DiscoverySection: React.FC<DiscoverySectionProps> = ({
  selectedCampus,
  searchQuery,
  onSearchChange,
  onSelectProvider
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'All Services' },
    { id: 'food', label: 'Food & Mess' },
    { id: 'stay', label: 'Housing & PG' },
    { id: 'laundry', label: 'Laundry' },
    { id: 'fitness', label: 'Gym & Fitness' },
    { id: 'transport', label: 'Campus Transport' },
    { id: 'maintenance', label: 'Repairs & Electrician' }
  ];

  const filteredProviders = useMemo(() => {
    return PROVIDERS.filter((provider) => {
      // Filter by category
      if (activeCategory !== 'all' && provider.serviceId !== activeCategory) {
        return false;
      }
      // Filter by search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = provider.name.toLowerCase().includes(q);
        const matchesBio = provider.bio.toLowerCase().includes(q);
        const matchesTags = provider.tags.some(t => t.toLowerCase().includes(q));
        const matchesBadge = provider.verificationBadge.toLowerCase().includes(q);
        if (!matchesName && !matchesBio && !matchesTags && !matchesBadge) {
          return false;
        }
      }
      return true;
    });
  }, [activeCategory, searchQuery]);

  return (
    <section id="discovery" className="section-spacing" style={{ backgroundColor: '#FFFFFF', borderBottom: '1px solid #E2E8F0' }}>
      <div className="container">
        
        {/* Section Header */}
        <div className="section-header text-center" style={{ marginBottom: 'var(--space-12)' }}>
          <FadeReveal direction="up" delay={50}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                padding: '0.35rem 0.9rem',
                borderRadius: 'var(--radius-pill)',
                backgroundColor: '#DCFCE7',
                border: '1px solid #86EFAC',
                marginBottom: 'var(--space-4)',
              }}
            >
              <Filter size={13} color="#15803D" />
              <span
                style={{
                  fontSize: '0.74rem',
                  fontFamily: 'var(--font-display)',
                  fontWeight: 800,
                  color: '#15803D',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                }}
              >
                Instant Campus Discovery
              </span>
            </div>

            <h2
              style={{
                fontSize: 'clamp(2rem, 3.5vw, 3rem)',
                fontFamily: 'var(--font-display)',
                fontWeight: 800,
                lineHeight: 1.15,
                letterSpacing: '-0.025em',
                color: '#0F172A',
                margin: '0 0 var(--space-4) 0',
              }}
            >
              Verified Services at{' '}
              <span style={{ color: '#16A34A' }}>
                {selectedCampus.shortName}
              </span>
            </h2>

            <p
              style={{
                fontSize: 'clamp(1rem, 1.3vw, 1.15rem)',
                fontFamily: 'var(--font-body)',
                color: '#475569',
                lineHeight: 1.6,
                maxWidth: '640px',
                margin: '0 auto',
              }}
            >
              Every vendor is physically inspected, background-checked, and rated directly by campus peers.
            </p>
          </FadeReveal>
        </div>

        {/* Category Filter Controls */}
        <FadeReveal direction="up" delay={120}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              flexWrap: 'wrap',
              marginBottom: '2rem'
            }}
          >
            {categories.map((cat) => {
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  style={{
                    padding: '0.45rem 0.95rem',
                    borderRadius: 'var(--radius-md)',
                    fontSize: 'var(--text-xs)',
                    fontFamily: 'var(--font-display)',
                    fontWeight: 700,
                    cursor: 'pointer',
                    transition: 'all var(--duration-fast)',
                    backgroundColor: isActive ? '#16A34A' : '#F8FAF7',
                    color: isActive ? '#FFFFFF' : '#475569',
                    border: isActive ? '1px solid #16A34A' : '1px solid #E2E8F0',
                    boxShadow: isActive ? '0 4px 12px rgba(22, 163, 74, 0.25)' : 'none'
                  }}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>
        </FadeReveal>

        {/* Real-time Status Bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '1.5rem',
            paddingBottom: '0.75rem',
            borderBottom: '1px solid #E2E8F0'
          }}
        >
          <div style={{ fontSize: 'var(--text-xs)', color: '#64748B' }}>
            Showing <strong style={{ color: '#0F172A' }}>{filteredProviders.length}</strong> inspected providers near {selectedCampus.hubLocation}
          </div>
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              style={{
                fontSize: 'var(--text-xs)',
                color: '#DC2626',
                cursor: 'pointer',
                fontWeight: 700,
                background: 'none',
                border: 'none',
              }}
            >
              Clear Search ("{searchQuery}")
            </button>
          )}
        </div>

        {/* Provider Cards Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
            gap: '1.5rem'
          }}
        >
          {filteredProviders.map((prov, index) => (
            <FadeReveal key={prov.id} direction="up" delay={index * 60}>
              <div
                className="interactive-card"
                onClick={() => onSelectProvider(prov)}
                style={{
                  backgroundColor: '#FFFFFF',
                  border: '1.5px solid #E2E8F0',
                  borderRadius: 'var(--radius-lg)',
                  padding: '1.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  height: '100%',
                  cursor: 'pointer',
                  position: 'relative',
                  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.04)'
                }}
              >
                {/* Top Row: Verification + Rating */}
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
                    <Badge variant="verified" size="sm" icon={<ShieldCheck size={12} color="#15803D" />}>
                      {providerBadge(prov)}
                    </Badge>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: 'var(--text-xs)', fontWeight: 700, color: '#CA8A04' }}>
                      <Star size={13} fill="#CA8A04" />
                      <span>{prov.rating}</span>
                      <span style={{ color: '#64748B', fontWeight: 500 }}>({prov.reviewsCount})</span>
                    </div>
                  </div>

                  {/* Title & Distance */}
                  <h3
                    style={{
                      fontSize: '1.15rem',
                      fontWeight: 800,
                      color: '#0F172A',
                      marginBottom: '0.35rem',
                      lineHeight: 1.3
                    }}
                  >
                    {prov.name}
                  </h3>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: 'var(--text-xs)', color: '#64748B', marginBottom: '0.85rem' }}>
                    <MapPin size={12} color="#16A34A" />
                    <span>{prov.distanceFromCampus}</span>
                    <span style={{ margin: '0 4px' }}>•</span>
                    <Clock size={12} color="#CA8A04" />
                    <span>{prov.responseTime}</span>
                  </div>

                  <p style={{ fontSize: 'var(--text-xs)', color: '#475569', lineHeight: 1.5, marginBottom: '1rem' }}>
                    {prov.bio}
                  </p>

                  {/* Tags */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginBottom: '1.25rem' }}>
                    {prov.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        style={{
                          fontSize: '0.7rem',
                          padding: '0.2rem 0.5rem',
                          backgroundColor: '#DCFCE7',
                          border: '1px solid #86EFAC',
                          borderRadius: 'var(--radius-xs)',
                          color: '#15803D',
                          fontWeight: 600,
                        }}
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Bottom Row: Price + View CTA */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingTop: '1rem',
                    borderTop: '1px solid #F1F5F9'
                  }}
                >
                  <div>
                    <div style={{ fontSize: '0.7rem', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 600 }}>Pricing</div>
                    <div style={{ fontSize: 'var(--text-xs)', fontWeight: 800, color: '#0F172A' }}>
                      {prov.priceHighlight}
                    </div>
                  </div>

                  <div
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      fontSize: 'var(--text-xs)',
                      fontWeight: 700,
                      color: '#16A34A'
                    }}
                  >
                    <span>View Details</span>
                    <ArrowUpRight size={14} />
                  </div>
                </div>
              </div>
            </FadeReveal>
          ))}
        </div>

        {filteredProviders.length === 0 && (
          <div
            style={{
              textAlign: 'center',
              padding: '4rem 1.5rem',
              backgroundColor: 'var(--color-surface)',
              borderRadius: 'var(--radius-lg)',
              border: '1px dashed var(--color-border)'
            }}
          >
            <Search size={32} color="var(--color-text-muted)" style={{ margin: '0 auto 1rem auto' }} />
            <h3 style={{ fontSize: 'var(--text-h4)', marginBottom: '0.5rem' }}>No matching providers found</h3>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', marginBottom: '1.5rem' }}>
              We could not find providers matching "{searchQuery}" under this category.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setActiveCategory('all');
                onSearchChange('');
              }}
            >
              Reset Filters
            </Button>
          </div>
        )}

      </div>
    </section>
  );
};

function providerBadge(prov: Provider) {
  return prov.verificationBadge;
}
