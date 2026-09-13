import React, { useState } from 'react';
import { Drawer } from '../ui/Drawer';
import { Button } from '../ui/Button';
import { CheckCircle2, ShieldCheck } from 'lucide-react';

interface PartnerOnboardingDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PartnerOnboardingDrawer: React.FC<PartnerOnboardingDrawerProps> = ({ isOpen, onClose }) => {
  const [submitted, setSubmitted] = useState(false);
  const [businessName, setBusinessName] = useState('');
  const [serviceType, setServiceType] = useState('food');
  const [contactName, setContactName] = useState('');
  const [phone, setPhone] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!businessName.trim() || !phone.trim()) return;
    setSubmitted(true);
  };

  return (
    <Drawer isOpen={isOpen} onClose={onClose} title="Partner Application" position="right" width="460px">
      {!submitted ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--color-brand-blue, #0F382C)', fontSize: 'var(--text-xs)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.4rem' }}>
              <ShieldCheck size={14} color="var(--color-brand-blue, #0F382C)" />
              <span>Verified Partner Network</span>
            </div>
            <h4 style={{ fontSize: '1.25rem', fontFamily: 'Domine, serif', fontWeight: 700, color: 'var(--color-brand-blue, #0F382C)', marginBottom: '0.4rem' }}>
              Join EaseHub as an Inspected Vendor
            </h4>
            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary, #414845)', lineHeight: 1.55 }}>
              Receive direct university student inquiries, zero broker deductions, and guaranteed automated payments.
            </p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--color-text-secondary, #414845)', marginBottom: '0.4rem' }}>
                Business or Property Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Royal PG for Boys, Gupta Ji Tiffins"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  backgroundColor: '#FFFFFF',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--color-border-subtle, #E8E4D5)',
                  color: 'var(--color-text-primary, #151D1A)',
                  fontSize: 'var(--text-xs)',
                  outline: 'none',
                  boxShadow: '0 1px 2px rgba(15, 56, 44, 0.04)'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--color-text-secondary, #414845)', marginBottom: '0.4rem' }}>
                Service Category *
              </label>
              <select
                value={serviceType}
                onChange={(e) => setServiceType(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  backgroundColor: '#FFFFFF',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--color-border-subtle, #E8E4D5)',
                  color: 'var(--color-text-primary, #151D1A)',
                  fontSize: 'var(--text-xs)',
                  outline: 'none',
                  boxShadow: '0 1px 2px rgba(15, 56, 44, 0.04)'
                }}
              >
                <option value="food">Food & Tiffin Service</option>
                <option value="stay">Student Housing / PG / Hostel</option>
                <option value="laundry">Laundry & Dry Clean Service</option>
                <option value="fitness">Gym & Fitness Center</option>
                <option value="transport">Campus Shuttle / Mobility</option>
                <option value="cleaning">Room Cleaning & Housekeeping</option>
                <option value="maintenance">Repairs / Electrician / Plumber</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--color-text-secondary, #414845)', marginBottom: '0.4rem' }}>
                Contact Person Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Ramesh Kumar"
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  backgroundColor: '#FFFFFF',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--color-border-subtle, #E8E4D5)',
                  color: 'var(--color-text-primary, #151D1A)',
                  fontSize: 'var(--text-xs)',
                  outline: 'none',
                  boxShadow: '0 1px 2px rgba(15, 56, 44, 0.04)'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--color-text-secondary, #414845)', marginBottom: '0.4rem' }}>
                WhatsApp Mobile Number *
              </label>
              <input
                type="tel"
                required
                placeholder="+91 98765 43210"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  backgroundColor: '#FFFFFF',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--color-border-subtle, #E8E4D5)',
                  color: 'var(--color-text-primary, #151D1A)',
                  fontSize: 'var(--text-xs)',
                  outline: 'none',
                  boxShadow: '0 1px 2px rgba(15, 56, 44, 0.04)'
                }}
              />
            </div>

            <Button variant="accent" size="md" fullWidth type="submit" style={{ marginTop: '0.5rem' }}>
              Submit For Physical Verification Audit
            </Button>
          </form>
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '2.5rem 1rem' }}>
          <CheckCircle2 size={48} color="#2E7D32" style={{ margin: '0 auto 1rem auto' }} />
          <h3 style={{ fontSize: 'var(--text-h4)', fontFamily: 'Domine, serif', fontWeight: 700, color: 'var(--color-brand-blue, #0F382C)', marginBottom: '0.5rem' }}>
            Application Submitted!
          </h3>
          <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary, #414845)', lineHeight: 1.6, marginBottom: '1.5rem' }}>
            Thank you, <strong style={{ color: 'var(--color-brand-blue, #0F382C)' }}>{contactName}</strong>.
            Our campus partner auditor will reach out to <strong style={{ color: 'var(--color-brand-blue, #0F382C)' }}>{phone}</strong> within 24 hours to schedule the premise inspection.
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSubmitted(false);
              onClose();
            }}
          >
            Done
          </Button>
        </div>
      )}
    </Drawer>
  );
};
