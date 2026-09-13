import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, Plus, Trash2, AlertCircle } from 'lucide-react';
import { Button } from '../../ui/Button';
import type { ProviderServiceItem, ProviderCategory } from '../../../types/provider';
import { CATEGORY_METADATA } from '../../../services/providerService';

interface Step5ServicesProps {
  category: ProviderCategory;
  services: ProviderServiceItem[];
  onChange: (services: ProviderServiceItem[]) => void;
  onContinue: () => void;
  onBack: () => void;
}

export const Step5Services: React.FC<Step5ServicesProps> = ({
  category,
  services,
  onChange,
  onContinue,
  onBack,
}) => {
  const [error, setError] = useState<string>('');

  const catMeta = CATEGORY_METADATA[category] || CATEGORY_METADATA.other;

  // Initialize with sample if empty
  React.useEffect(() => {
    if (services.length === 0) {
      onChange([
        {
          id: `srv-${Date.now()}-1`,
          name: catMeta.sampleService,
          description: `Standard high-grade campus service tailored for university students with transparent pricing.`,
          category,
          price: catMeta.samplePrice,
          pricingUnit: catMeta.sampleUnit,
          turnaround: 'Same day / within 24 hours',
          status: 'active',
        },
      ]);
    }
  }, [category, services.length, onChange, catMeta]);

  const handleAddService = () => {
    setError('');
    const newService: ProviderServiceItem = {
      id: `srv-${Date.now()}-${services.length + 1}`,
      name: '',
      description: '',
      category,
      price: 0,
      pricingUnit: catMeta.sampleUnit,
      turnaround: '',
      status: 'active',
    };
    onChange([...services, newService]);
  };

  const handleRemoveService = (index: number) => {
    if (services.length <= 1) {
      setError('You must configure at least one service offering.');
      return;
    }
    setError('');
    const updated = [...services];
    updated.splice(index, 1);
    onChange(updated);
  };

  const handleUpdateItem = (index: number, updates: Partial<ProviderServiceItem>) => {
    setError('');
    const updated = [...services];
    updated[index] = { ...updated[index], ...updates };
    onChange(updated);
  };

  const validate = (): boolean => {
    if (services.length === 0) {
      setError('Please add at least one service offering to proceed.');
      return false;
    }
    for (let i = 0; i < services.length; i++) {
      const s = services[i];
      if (!s.name.trim()) {
        setError(`Service #${i + 1} must have a name.`);
        return false;
      }
      if (s.price <= 0 || isNaN(s.price)) {
        setError(`Service "${s.name || `#${i + 1}`}" must have a valid price greater than 0.`);
        return false;
      }
    }
    setError('');
    return true;
  };

  const handleNext = () => {
    if (validate()) {
      onContinue();
    }
  };

  return (
    <div style={{ maxWidth: '780px', margin: '0 auto' }}>
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
          Configure Your Services & Pricing
        </h2>
        <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}>
          Define the packages, plans, or individual services students will be able to book from your storefront.
        </p>
      </div>

      {error && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.85rem 1rem',
            backgroundColor: 'rgba(255, 43, 43, 0.12)',
            border: '1px solid rgba(255, 43, 43, 0.3)',
            borderRadius: 'var(--radius-md)',
            color: '#FF7B72',
            fontSize: '0.84rem',
            marginBottom: '1.5rem',
          }}
        >
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}

      {/* Services List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginBottom: '2rem' }}>
        {services.map((service, index) => (
          <div
            key={service.id || index}
            style={{
              padding: '1.5rem',
              backgroundColor: 'var(--color-surface-1)',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--color-border-subtle)',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
              position: 'relative',
            }}
          >
            {/* Header: Service Index & Delete Button */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span
                style={{
                  fontSize: '0.78rem',
                  fontFamily: 'var(--font-mono)',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  color: '#FFFFFF',
                  padding: '0.2rem 0.6rem',
                  borderRadius: 'var(--radius-pill)',
                  backgroundColor: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.16)',
                }}
              >
                Service Offering #{index + 1}
              </span>

              {services.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleRemoveService(index)}
                  aria-label="Remove this service"
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--color-text-muted)',
                    cursor: 'pointer',
                    padding: '0.3rem',
                    borderRadius: 'var(--radius-xs)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontSize: '0.75rem',
                    transition: 'color 0.15s ease',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#FF7B72')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--color-text-muted)')}
                >
                  <Trash2 size={15} />
                  <span>Remove</span>
                </button>
              )}
            </div>

            {/* Service Name */}
            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  color: 'var(--color-text-primary)',
                  marginBottom: '0.35rem',
                }}
              >
                Service Title *
              </label>
              <input
                type="text"
                placeholder="e.g. Monthly 2-Meal Plan, Wash + Steam Press 6kg, Single Room Deluxe"
                value={service.name}
                onChange={(e) => handleUpdateItem(index, { name: e.target.value })}
                style={{
                  width: '100%',
                  padding: '0.65rem 0.85rem',
                  backgroundColor: 'var(--color-surface-2)',
                  border: '1px solid var(--color-border-default)',
                  borderRadius: 'var(--radius-sm)',
                  color: '#FFFFFF',
                  fontSize: '0.88rem',
                  outline: 'none',
                }}
              />
            </div>

            {/* Price & Billing Unit & Turnaround */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.85rem' }}>
              <div>
                <label
                  style={{
                    display: 'block',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    color: 'var(--color-text-primary)',
                    marginBottom: '0.35rem',
                  }}
                >
                  Price (INR ₹) *
                </label>
                <div style={{ position: 'relative' }}>
                  <span
                    style={{
                      position: 'absolute',
                      left: '10px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: 'var(--color-text-muted)',
                      fontWeight: 700,
                    }}
                  >
                    ₹
                  </span>
                  <input
                    type="number"
                    min={1}
                    placeholder="250"
                    value={service.price || ''}
                    onChange={(e) => handleUpdateItem(index, { price: parseFloat(e.target.value) || 0 })}
                    style={{
                      width: '100%',
                      padding: '0.65rem 0.85rem 0.65rem 1.8rem',
                      backgroundColor: 'var(--color-surface-2)',
                      border: '1px solid var(--color-border-default)',
                      borderRadius: 'var(--radius-sm)',
                      color: '#FFFFFF',
                      fontSize: '0.88rem',
                      outline: 'none',
                    }}
                  />
                </div>
              </div>

              <div>
                <label
                  style={{
                    display: 'block',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    color: 'var(--color-text-primary)',
                    marginBottom: '0.35rem',
                  }}
                >
                  Billing Unit / Term
                </label>
                <input
                  type="text"
                  placeholder="e.g. per month, per bag, per visit"
                  value={service.pricingUnit}
                  onChange={(e) => handleUpdateItem(index, { pricingUnit: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.65rem 0.85rem',
                    backgroundColor: 'var(--color-surface-2)',
                    border: '1px solid var(--color-border-default)',
                    borderRadius: 'var(--radius-sm)',
                    color: '#FFFFFF',
                    fontSize: '0.88rem',
                    outline: 'none',
                  }}
                />
              </div>

              <div>
                <label
                  style={{
                    display: 'block',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    color: 'var(--color-text-primary)',
                    marginBottom: '0.35rem',
                  }}
                >
                  Estimated Turnaround
                </label>
                <input
                  type="text"
                  placeholder="e.g. Within 2 hours, Next morning"
                  value={service.turnaround || ''}
                  onChange={(e) => handleUpdateItem(index, { turnaround: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.65rem 0.85rem',
                    backgroundColor: 'var(--color-surface-2)',
                    border: '1px solid var(--color-border-default)',
                    borderRadius: 'var(--radius-sm)',
                    color: '#FFFFFF',
                    fontSize: '0.88rem',
                    outline: 'none',
                  }}
                />
              </div>
            </div>

            {/* Service Short Description */}
            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  color: 'var(--color-text-primary)',
                  marginBottom: '0.35rem',
                }}
              >
                Service Details & Inclusions
              </label>
              <textarea
                rows={2}
                placeholder="Specific items included, meal timings, fabric limits, or room facilities..."
                value={service.description}
                onChange={(e) => handleUpdateItem(index, { description: e.target.value })}
                style={{
                  width: '100%',
                  padding: '0.65rem 0.85rem',
                  backgroundColor: 'var(--color-surface-2)',
                  border: '1px solid var(--color-border-default)',
                  borderRadius: 'var(--radius-sm)',
                  color: '#FFFFFF',
                  fontSize: '0.85rem',
                  outline: 'none',
                  resize: 'vertical',
                }}
              />
            </div>
          </div>
        ))}

        {/* Add Another Service Button */}
        <button
          type="button"
          onClick={handleAddService}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            padding: '0.85rem',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'rgba(255, 255, 255, 0.02)',
            border: '1px dashed var(--color-border-default)',
            color: '#FFFFFF',
            fontSize: '0.85rem',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'background-color 0.15s ease',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.08)')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.02)')}
        >
          <Plus size={16} />
          <span>+ Add Another Service Offering</span>
        </button>
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
          Back: Contact Info
        </Button>
        <Button variant="primary" size="md" onClick={handleNext} icon={<ArrowRight size={16} />}>
          Continue: Campus Location
        </Button>
      </div>
    </div>
  );
};
