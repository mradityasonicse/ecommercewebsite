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
    <section id="discovery" className="section-spacing" style={{ backgroundColor: '#080A0F', borderBottom: '1px solid var(--color-border-subtle)' }}>
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
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.16)',
                marginBottom: 'var(--space-4)',
              }}
            >
              <Filter size={13} color="#FFFFFF" />
              <span
                style={{
                  fontSize: '0.74rem',
                  fontFamily: 'var(--font-display)',
                  fontWeight: 700,
                  color: '#FFFFFF',
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
                color: '#FFFFFF',
                margin: '0 0 var(--space-4) 0',
              }}
            >
              Verified Services at{' '}
              <span
                style={{
                  background: 'linear-gradient(180deg, #FFFFFF 0%, #CBD5E1 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                {selectedCampus.shortName}
              </span>
            </h2>

            <p
              style={{
                fontSize: 'clamp(1rem, 1.3vw, 1.15rem)',
                fontFamily: 'var(--font-body)',
                color: 'var(--color-text-secondary)',
                lineHeight: 1.6,
                maxWidth: '640px',
                margin: '0 auto',
              }}
            >
              Every vendor is physically inspected, background-checked, and rated directly by campus peers.
            </p>
          </FadeReveal>
        </div>

        {/* Category Filter Pills */}
        <FadeReveal direction="up" delay={120}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.6rem',
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
                    padding: '0.5rem 1.1rem',
                    borderRadius: 'var(--radius-full)',
                    fontSize: 'var(--text-xs)',
                    fontFamily: 'var(--font-display)',
                    fontWeight: 700,
                    cursor: 'pointer',
                    transition: 'all var(--duration-fast)',
                    backgroundColor: isActive ? '#FFFFFF' : 'rgba(255, 255, 255, 0.05)',
                    color: isActive ? '#080A0F' : '#CBD5E1',
                    border: isActive ? '1px solid #FFFFFF' : '1px solid rgba(255, 255, 255, 0.14)',
                    boxShadow: isActive ? '0 4px 16px rgba(255, 255, 255, 0.2)' : 'none'
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
            borderBottom: '1px solid rgba(255, 255, 255, 0.12)'
          }}
        >
          <div style={{ fontSize: 'var(--text-xs)', color: '#94A3B8' }}>
            Showing <strong style={{ color: '#FFFFFF' }}>{filteredProviders.length}</strong> inspected providers near {selectedCampus.hubLocation}
          </div>
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              style={{
                fontSize: 'var(--text-xs)',
                color: '#FF7B72',
                cursor: 'pointer',
                fontWeight: 600,
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
                  backgroundColor: '#111622',
                  border: '1px solid rgba(255, 255, 255, 0.14)',
                  borderRadius: 'var(--radius-xl)',
                  padding: '1.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  height: '100%',
                  cursor: 'pointer',
                  position: 'relative',
                  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)'
                }}
              >
                {/* Top Row: Verification + Rating */}
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
                    <Badge variant="verified" size="sm" icon={<ShieldCheck size={12} color="#FFFFFF" />}>
                      {providerBadge(prov)}
                    </Badge>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: 'var(--text-xs)', fontWeight: 700, color: '#FBBF24' }}>
                      <Star size={13} fill="#FBBF24" />
                      <span>{prov.rating}</span>
                      <span style={{ color: '#94A3B8', fontWeight: 500 }}>({prov.reviewsCount})</span>
                    </div>
                  </div>

                  {/* Title & Distance */}
                  <h3
                    style={{
                      fontSize: '1.15rem',
                      fontWeight: 700,
                      color: '#FFFFFF',
                      marginBottom: '0.35rem',
                      lineHeight: 1.3
                    }}
                  >
                    {prov.name}
                  </h3>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: 'var(--text-xs)', color: '#94A3B8', marginBottom: '0.85rem' }}>
                    <MapPin size={12} color="#94A3B8" />
                    <span>{prov.distanceFromCampus}</span>
                    <span style={{ margin: '0 4px' }}>•</span>
                    <Clock size={12} />
                    <span>{prov.responseTime}</span>
                  </div>

                  <p style={{ fontSize: 'var(--text-xs)', color: '#CBD5E1', lineHeight: 1.5, marginBottom: '1rem' }}>
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
                          backgroundColor: 'rgba(255, 255, 255, 0.06)',
                          border: '1px solid rgba(255, 255, 255, 0.12)',
                          borderRadius: 'var(--radius-xs)',
                          color: '#CBD5E1'
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
                    borderTop: '1px solid rgba(255, 255, 255, 0.12)'
                  }}
                >
                  <div>
                    <div style={{ fontSize: '0.7rem', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Pricing</div>
                    <div style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: '#FFFFFF' }}>
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
                      color: '#FFFFFF'
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
