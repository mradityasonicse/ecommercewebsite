import React from 'react';
import {
  Utensils,
  Home,
  Shirt,
  Dumbbell,
  Bike,
  Wifi,
  SprayCan,
  Wrench,
  Briefcase,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
} from 'lucide-react';
import { Button } from '../../ui/Button';
import type { ProviderCategory } from '../../../types/provider';
import { CATEGORY_METADATA } from '../../../services/providerService';

interface Step2ProviderTypeProps {
  selectedCategory: ProviderCategory;
  onSelectCategory: (cat: ProviderCategory) => void;
  onContinue: () => void;
  onBack: () => void;
}

const CATEGORY_ICONS: Record<ProviderCategory, React.ReactNode> = {
  food: <Utensils size={24} />,
  stay: <Home size={24} />,
  laundry: <Shirt size={24} />,
  fitness: <Dumbbell size={24} />,
  transport: <Bike size={24} />,
  wifi: <Wifi size={24} />,
  cleaning: <SprayCan size={24} />,
  maintenance: <Wrench size={24} />,
  other: <Briefcase size={24} />,
};

export const Step2ProviderType: React.FC<Step2ProviderTypeProps> = ({
  selectedCategory,
  onSelectCategory,
  onContinue,
  onBack,
}) => {
  const categories = Object.keys(CATEGORY_METADATA) as ProviderCategory[];

  return (
    <div style={{ maxWidth: '840px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h2
          style={{
            fontSize: 'var(--text-h3)',
            fontFamily: 'var(--font-display)',
            fontWeight: 800,
            color: '#FFFFFF',
            marginBottom: '0.5rem',
          }}
        >
          Select Your Primary Service Category
        </h2>
        <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)', maxWidth: '580px', margin: '0 auto' }}>
          Choose the service type that best represents your core business. You will be able to specify exact catalog offerings in Step 5.
        </p>
      </div>

      {/* Selectable Cards Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '1rem',
          marginBottom: '2.5rem',
        }}
        role="radiogroup"
        aria-label="Provider service categories"
      >
        {categories.map((catKey) => {
          const cat = CATEGORY_METADATA[catKey];
          const isSelected = selectedCategory === catKey;

          return (
            <div
              key={catKey}
              role="radio"
              aria-checked={isSelected}
              tabIndex={0}
              onClick={() => onSelectCategory(catKey)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onSelectCategory(catKey);
                }
              }}
              style={{
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem',
                padding: '1.25rem',
                borderRadius: 'var(--radius-md)',
                backgroundColor: isSelected ? 'var(--color-surface-3)' : 'var(--color-surface-2)',
                border: isSelected
                  ? '2px solid #FFFFFF'
                  : '1px solid var(--color-border-subtle)',
                boxShadow: isSelected ? '0 0 20px rgba(255, 255, 255, 0.15)' : 'none',
                cursor: 'pointer',
                transition: 'all 0.18s ease',
                outline: 'none',
              }}
            >
              {/* Top Row: Icon and Selection Badge */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div
                  style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: isSelected ? '#FFFFFF' : 'rgba(255, 255, 255, 0.05)',
                    color: isSelected ? '#080A0F' : 'var(--color-text-secondary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.18s ease',
                  }}
                >
                  {CATEGORY_ICONS[catKey]}
                </div>

                {isSelected ? (
                  <CheckCircle2 size={20} color="#10B981" />
                ) : (
                  <div
                    style={{
                      width: '18px',
                      height: '18px',
                      borderRadius: '50%',
                      border: '1.5px solid var(--color-border-default)',
                    }}
                  />
                )}
              </div>

              {/* Text Info */}
              <div>
                <h3
                  style={{
                    fontSize: '0.95rem',
                    fontWeight: 700,
                    color: isSelected ? '#FFFFFF' : 'var(--color-text-primary)',
                    marginBottom: '0.35rem',
                  }}
                >
                  {cat.label}
                </h3>
                <p style={{ fontSize: '0.78rem', color: 'var(--color-text-secondary)', lineHeight: 1.45, margin: 0 }}>
                  {cat.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Navigation Controls */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderTop: '1px solid var(--color-border-subtle)',
          paddingTop: '1.5rem',
        }}
      >
        <Button variant="ghost" size="md" onClick={onBack} icon={<ArrowLeft size={16} />}>
          Back
        </Button>
        <Button variant="primary" size="md" onClick={onContinue} icon={<ArrowRight size={16} />}>
          Continue: Business Details
        </Button>
      </div>
    </div>
  );
};
