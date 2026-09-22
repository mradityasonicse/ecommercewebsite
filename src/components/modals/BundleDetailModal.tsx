import React, { useState } from 'react';
import type { Bundle } from '../../data/bundles';
import { Modal } from '../ui/Modal';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Check, Zap, CheckCircle2, MessageCircle, ShoppingCart } from 'lucide-react';
import { useCart } from '../../context/CartContext';

interface BundleDetailModalProps {
  bundle: Bundle | null;
  onClose: () => void;
  onViewPass?: () => void;
}

export const BundleDetailModal: React.FC<BundleDetailModalProps> = ({ bundle, onClose, onViewPass }) => {
  const { addItem, openCart } = useCart();
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [studentEmail, setStudentEmail] = useState('');

  if (!bundle) return null;

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentEmail) return;

    // Direct WhatsApp Dispatch with configured phone number
    const phone = '918102848776';
    const lines = [
      '🎓 *NEW EASEHUB STUDENT PASS ACTIVATION*',
      '━━━━━━━━━━━━━━━━━━━━━',
      `📦 *Pass:* ${bundle.name}`,
      `💰 *Price:* ₹${bundle.bundlePrice.toLocaleString()} /${bundle.billingPeriod} (Save ${bundle.savingsPercentage}%)`,
      `✉️ *Student Email:* ${studentEmail.trim()}`,
      `✨ *Included Services:* ${bundle.servicesIncluded.join(', ')}`,
      `🎁 *Perks:* ${bundle.perks.join(', ')}`,
      '━━━━━━━━━━━━━━━━━━━━━',
      'Please verify my student pass and generate my digital ID card.',
      'Sent via EaseHub Student Living Platform',
    ];

    const message = lines.join('\n');
    const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');

    setIsSubscribed(true);
  };

  return (
    <Modal
      isOpen={!!bundle}
      onClose={() => {
        setIsSubscribed(false);
        onClose();
      }}
      title={bundle.name}
      maxWidth="600px"
    >
      {!isSubscribed ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
            <Badge variant="verified" size="md">
              Save {bundle.savingsPercentage}% Monthly
            </Badge>
            <div style={{ fontSize: '1.45rem', fontFamily: 'var(--font-display, "Domine", serif)', fontWeight: 700, color: 'var(--color-brand-gold, #FAC908)' }}>
              ₹{bundle.bundlePrice.toLocaleString()}{' '}
              <span style={{ fontSize: '0.8rem', fontFamily: 'var(--font-body, sans-serif)', color: 'var(--color-text-muted)', fontWeight: 500 }}>
                /{bundle.billingPeriod}
              </span>
            </div>
          </div>

          <p style={{ fontSize: '0.95rem', color: 'var(--color-text-secondary)', lineHeight: 1.6, margin: 0 }}>
            {bundle.tagline}
          </p>

          {/* Included Services */}
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-brand-gold, #FAC908)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.75rem' }}>
              Included in this Pass
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {bundle.servicesIncluded.map((s, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', color: 'var(--color-text-primary)' }}>
                  <Check size={16} color="var(--color-brand-green)" />
                  <span>{s}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Perks */}
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-brand-gold, #FAC908)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.75rem' }}>
              Exclusive Perks
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {bundle.perks.map((p, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}>
                  <Zap size={14} color="var(--color-brand-gold, #FAC908)" />
                  <span>{p}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Checkout Form */}
          <form onSubmit={handleSubscribe} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginTop: '0.5rem' }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text-secondary)' }}>
              Enter university email to claim student verification pricing:
            </div>
            <input
              type="email"
              required
              placeholder="e.g. student@university.edu or yourname@gmail.com"
              value={studentEmail}
              onChange={(e) => setStudentEmail(e.target.value)}
              style={{
                padding: '0.8rem 1rem',
                backgroundColor: 'var(--color-surface-2)',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--color-border-subtle)',
                color: 'var(--color-text-primary)',
                fontSize: '0.9rem',
                outline: 'none',
                boxShadow: 'inset 0 1px 3px rgba(0, 0, 0, 0.3)',
                transition: 'border-color var(--duration-fast, 200ms) var(--ease-smooth), box-shadow var(--duration-fast, 200ms) var(--ease-smooth)',
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = 'var(--color-brand-gold, #FAC908)';
                e.currentTarget.style.boxShadow = '0 0 0 3px var(--color-gold-subtle, rgba(250, 201, 8, 0.2))';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = 'var(--color-border-subtle)';
                e.currentTarget.style.boxShadow = 'inset 0 1px 3px rgba(0, 0, 0, 0.3)';
              }}
            />
            {/* Add to Cart Primary CTA */}
            <Button
              variant="primary"
              size="md"
              fullWidth
              type="button"
              className="easehub-btn-tactile"
              onClick={() => {
                addItem({
                  id: `bundle_${bundle.id}`,
                  slug: bundle.id,
                  name: bundle.name,
                  category: 'extra',
                  priceText: `₹${bundle.bundlePrice.toLocaleString()}/${bundle.billingPeriod}`,
                  numericPrice: bundle.bundlePrice,
                  periodText: bundle.billingPeriod,
                  imageUrl: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=600&auto=format&fit=crop&q=80',
                  providerName: 'EaseHub Smart All-in-One Pass',
                  optionName: bundle.tagline,
                });
                openCart();
                onClose();
              }}
              style={{
                background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                fontWeight: 700,
                boxShadow: '0 4px 14px rgba(37, 99, 235, 0.35)',
                padding: '0.85rem 1rem',
              }}
            >
              <ShoppingCart size={18} />
              <span>Add Combo to Cart & Checkout (₹{bundle.bundlePrice.toLocaleString()})</span>
            </Button>

            <div style={{ textAlign: 'center', fontSize: '0.75rem', color: 'var(--color-text-muted)', margin: '0.1rem 0' }}>
              — or activate directly via student email / WhatsApp pass ID —
            </div>

            <Button variant="accent" size="md" fullWidth type="submit" className="easehub-btn-tactile">
              Activate Pass & Generate Digital ID Card
            </Button>
          </form>

        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '1.5rem 1rem' }}>
          <CheckCircle2 size={48} color="var(--color-brand-green)" style={{ margin: '0 auto 1rem auto' }} />
          <h3 style={{ fontSize: '1.4rem', fontFamily: 'var(--font-display, "Domine", serif)', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: '0.5rem' }}>
            Pass Reservation Dispatched!
          </h3>
          <p style={{ fontSize: '0.92rem', color: 'var(--color-text-secondary)', marginBottom: '1.5rem', lineHeight: 1.6 }}>
            Your activation details have been routed directly to the student concierge at WhatsApp (<strong style={{ color: 'var(--color-brand-gold, #FAC908)' }}>+91 81028 48776</strong>).
          </p>
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button
              variant="accent"
              size="md"
              className="easehub-btn-tactile"
              onClick={() => {
                const phone = '918102848776';
                const message = `Hello EaseHub! 👋 I requested activation for ${bundle.name} (${studentEmail}). Please confirm my pass ID.`;
                window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer');
              }}
            >
              <MessageCircle size={16} style={{ marginRight: '6px' }} />
              <span>Connect on WhatsApp</span>
            </Button>
            {onViewPass && (
              <Button
                variant="primary"
                size="md"
                className="easehub-btn-tactile"
                onClick={() => {
                  setIsSubscribed(false);
                  onViewPass();
                }}
              >
                View in Student Account
              </Button>
            )}
            <Button
              variant="outline"
              size="md"
              className="easehub-btn-tactile"
              onClick={() => {
                setIsSubscribed(false);
                onClose();
              }}
            >
              Back to Catalog
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
};
