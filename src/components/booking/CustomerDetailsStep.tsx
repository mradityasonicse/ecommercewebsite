import React from 'react';
import { User, Phone, Mail, Building, Home, FileText, AlertCircle } from 'lucide-react';
import type { CustomerDetails, ServiceActionConfig } from '../../types/booking';
import { CAMPUSES, type Campus } from '../../data/campuses';

interface CustomerDetailsStepProps {
  customer: CustomerDetails;
  onChange: (updated: Partial<CustomerDetails>) => void;
  errors: Record<string, string>;
  actionConfig?: ServiceActionConfig;
  activeCampus: Campus;
}

export const CustomerDetailsStep: React.FC<CustomerDetailsStepProps> = ({
  customer,
  onChange,
  errors,
  actionConfig,
  activeCampus,
}) => {
  const isHostelRequired = actionConfig?.requiresHostelRoom !== false;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)', width: '100%' }}>
      <div>
        <h2
          style={{
            fontSize: 'clamp(1.25rem, 2.5vw, 1.6rem)',
            fontFamily: 'var(--font-display)',
            fontWeight: 700,
            color: 'var(--color-text-primary)',
            margin: '0 0 var(--space-2) 0',
          }}
        >
          Student Contact & Room Address
        </h2>
        <p style={{ fontSize: '0.88rem', color: 'var(--color-text-secondary)', margin: 0 }}>
          Your details are encrypted and shared strictly with the verified campus provider servicing your request.
        </p>
      </div>

      {/* Form Fields Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 'var(--space-4)' }}>
        {/* Full Name */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
          <label
            htmlFor="cust-name"
            style={{
              fontSize: '0.72rem',
              fontFamily: 'var(--font-mono)',
              fontWeight: 700,
              color: errors.name ? 'var(--color-brand-red)' : 'var(--color-text-secondary)',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            Full Name <span style={{ color: 'var(--color-brand-red)' }}>*</span>
          </label>
          <div style={{ position: 'relative' }}>
            <div style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }}>
              <User size={16} />
            </div>
            <input
              id="cust-name"
              type="text"
              value={customer.name}
              onChange={(e) => onChange({ name: e.target.value })}
              placeholder="e.g. Aditya Soni"
              style={{
                width: '100%',
                padding: '0.75rem 1rem 0.75rem 2.4rem',
                backgroundColor: 'var(--color-surface-1)',
                border: `1px solid ${errors.name ? 'var(--color-brand-red)' : 'var(--color-border-subtle)'}`,
                borderRadius: 'var(--radius-md)',
                color: 'var(--color-text-primary)',
                fontSize: '0.9rem',
                outline: 'none',
                transition: 'all var(--duration-fast)',
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = 'var(--color-brand-blue)';
                e.currentTarget.style.boxShadow = '0 0 0 3px rgba(15, 56, 44, 0.1)';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = errors.name ? 'var(--color-brand-red)' : 'var(--color-border-subtle)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            />
          </div>
          {errors.name && (
            <span style={{ fontSize: '0.72rem', color: 'var(--color-brand-red)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <AlertCircle size={12} /> {errors.name}
            </span>
          )}
        </div>

        {/* Mobile Number */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
          <label
            htmlFor="cust-phone"
            style={{
              fontSize: '0.72rem',
              fontFamily: 'var(--font-mono)',
              fontWeight: 700,
              color: errors.phone ? 'var(--color-brand-red)' : 'var(--color-text-secondary)',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            Mobile Number (for SMS & OTP) <span style={{ color: 'var(--color-brand-red)' }}>*</span>
          </label>
          <div style={{ position: 'relative' }}>
            <div style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }}>
              <Phone size={16} />
            </div>
            <input
              id="cust-phone"
              type="tel"
              value={customer.phone}
              onChange={(e) => onChange({ phone: e.target.value })}
              placeholder="e.g. 9876543210"
              style={{
                width: '100%',
                padding: '0.75rem 1rem 0.75rem 2.4rem',
                backgroundColor: 'var(--color-surface-1)',
                border: `1px solid ${errors.phone ? 'var(--color-brand-red)' : 'var(--color-border-subtle)'}`,
                borderRadius: 'var(--radius-md)',
                color: 'var(--color-text-primary)',
                fontSize: '0.9rem',
                outline: 'none',
                transition: 'all var(--duration-fast)',
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = 'var(--color-brand-blue)';
                e.currentTarget.style.boxShadow = '0 0 0 3px rgba(15, 56, 44, 0.1)';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = errors.phone ? 'var(--color-brand-red)' : 'var(--color-border-subtle)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            />
          </div>
          {errors.phone && (
            <span style={{ fontSize: '0.72rem', color: 'var(--color-brand-red)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <AlertCircle size={12} /> {errors.phone}
            </span>
          )}
        </div>

        {/* Email Address */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
          <label
            htmlFor="cust-email"
            style={{
              fontSize: '0.72rem',
              fontFamily: 'var(--font-mono)',
              fontWeight: 700,
              color: errors.email ? 'var(--color-brand-red)' : 'var(--color-text-secondary)',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            University or Personal Email <span style={{ color: 'var(--color-brand-red)' }}>*</span>
          </label>
          <div style={{ position: 'relative' }}>
            <div style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }}>
              <Mail size={16} />
            </div>
            <input
              id="cust-email"
              type="email"
              value={customer.email}
              onChange={(e) => onChange({ email: e.target.value })}
              placeholder="student@university.edu or personal"
              style={{
                width: '100%',
                padding: '0.75rem 1rem 0.75rem 2.4rem',
                backgroundColor: 'var(--color-surface-1)',
                border: `1px solid ${errors.email ? 'var(--color-brand-red)' : 'var(--color-border-subtle)'}`,
                borderRadius: 'var(--radius-md)',
                color: 'var(--color-text-primary)',
                fontSize: '0.9rem',
                outline: 'none',
                transition: 'all var(--duration-fast)',
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = 'var(--color-brand-blue)';
                e.currentTarget.style.boxShadow = '0 0 0 3px rgba(15, 56, 44, 0.1)';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = errors.email ? 'var(--color-brand-red)' : 'var(--color-border-subtle)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            />
          </div>
          {errors.email && (
            <span style={{ fontSize: '0.72rem', color: 'var(--color-brand-red)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <AlertCircle size={12} /> {errors.email}
            </span>
          )}
        </div>

        {/* University Campus */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
          <label
            htmlFor="cust-campus"
            style={{
              fontSize: '0.72rem',
              fontFamily: 'var(--font-mono)',
              fontWeight: 700,
              color: 'var(--color-text-secondary)',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            Campus Perimeter
          </label>
          <div style={{ position: 'relative' }}>
            <div style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }}>
              <Building size={16} />
            </div>
            <select
              id="cust-campus"
              value={customer.campusId || activeCampus.id}
              onChange={(e) => {
                const found = CAMPUSES.find((c) => c.id === e.target.value);
                onChange({
                  campusId: e.target.value,
                  campusName: found?.name || activeCampus.name,
                });
              }}
              style={{
                width: '100%',
                padding: '0.75rem 1rem 0.75rem 2.4rem',
                backgroundColor: 'var(--color-surface-1)',
                border: '1px solid var(--color-border-subtle)',
                borderRadius: 'var(--radius-md)',
                color: 'var(--color-text-primary)',
                fontSize: '0.9rem',
                outline: 'none',
                cursor: 'pointer',
              }}
            >
              {CAMPUSES.map((c) => (
                <option key={c.id} value={c.id} style={{ backgroundColor: '#FFFFFF', color: '#151D1A' }}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Hostel / PG Block */}
        {isHostelRequired && (
          <>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              <label
                htmlFor="cust-hostel"
                style={{
                  fontSize: '0.72rem',
                  fontFamily: 'var(--font-mono)',
                  fontWeight: 700,
                  color: errors.hostelBlock ? 'var(--color-brand-red)' : 'var(--color-text-secondary)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}
              >
                Hostel Block / PG Name <span style={{ color: 'var(--color-brand-red)' }}>*</span>
              </label>
              <div style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }}>
                  <Home size={16} />
                </div>
                <input
                  id="cust-hostel"
                  type="text"
                  value={customer.hostelBlock || ''}
                  onChange={(e) => onChange({ hostelBlock: e.target.value })}
                  placeholder="e.g. Block B / Aryabhatta Hostel"
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem 0.75rem 2.4rem',
                    backgroundColor: 'var(--color-surface-1)',
                    border: `1px solid ${errors.hostelBlock ? 'var(--color-brand-red)' : 'var(--color-border-subtle)'}`,
                    borderRadius: 'var(--radius-md)',
                    color: 'var(--color-text-primary)',
                    fontSize: '0.9rem',
                    outline: 'none',
                    transition: 'all var(--duration-fast)',
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = 'var(--color-brand-blue)';
                    e.currentTarget.style.boxShadow = '0 0 0 3px rgba(15, 56, 44, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = errors.hostelBlock ? 'var(--color-brand-red)' : 'var(--color-border-subtle)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                />
              </div>
              {errors.hostelBlock && (
                <span style={{ fontSize: '0.72rem', color: 'var(--color-brand-red)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <AlertCircle size={12} /> {errors.hostelBlock}
                </span>
              )}
            </div>

            {/* Room Number */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              <label
                htmlFor="cust-room"
                style={{
                  fontSize: '0.72rem',
                  fontFamily: 'var(--font-mono)',
                  fontWeight: 700,
                  color: errors.roomNumber ? 'var(--color-brand-red)' : 'var(--color-text-secondary)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}
              >
                Room / Flat Number <span style={{ color: 'var(--color-brand-red)' }}>*</span>
              </label>
              <input
                id="cust-room"
                type="text"
                value={customer.roomNumber || ''}
                onChange={(e) => onChange({ roomNumber: e.target.value })}
                placeholder="e.g. Room 204 or Flat 3B"
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  backgroundColor: 'var(--color-surface-1)',
                  border: `1px solid ${errors.roomNumber ? 'var(--color-brand-red)' : 'var(--color-border-subtle)'}`,
                  borderRadius: 'var(--radius-md)',
                  color: 'var(--color-text-primary)',
                  fontSize: '0.9rem',
                  outline: 'none',
                  transition: 'all var(--duration-fast)',
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = 'var(--color-brand-blue)';
                  e.currentTarget.style.boxShadow = '0 0 0 3px rgba(15, 56, 44, 0.1)';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = errors.roomNumber ? 'var(--color-brand-red)' : 'var(--color-border-subtle)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              />
              {errors.roomNumber && (
                <span style={{ fontSize: '0.72rem', color: 'var(--color-brand-red)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <AlertCircle size={12} /> {errors.roomNumber}
                </span>
              )}
            </div>
          </>
        )}
      </div>

      {/* Special Instructions / Delivery Notes */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
        <label
          htmlFor="cust-notes"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.35rem',
            fontSize: '0.72rem',
            fontFamily: 'var(--font-mono)',
            fontWeight: 700,
            color: 'var(--color-text-secondary)',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
          }}
        >
          <FileText size={14} color="var(--color-brand-blue)" />
          <span>Special Instructions or Room Landmarks (Optional)</span>
        </label>
        <textarea
          id="cust-notes"
          rows={3}
          value={customer.notes || ''}
          onChange={(e) => onChange({ notes: e.target.value })}
          placeholder="e.g. Call when outside the hostel gate, keep clothes in separate bag, leave with roommate if in lab..."
          style={{
            width: '100%',
            padding: '0.75rem 1rem',
            backgroundColor: 'var(--color-surface-1)',
            border: '1px solid var(--color-border-subtle)',
            borderRadius: 'var(--radius-md)',
            color: 'var(--color-text-primary)',
            fontSize: '0.88rem',
            outline: 'none',
            resize: 'vertical',
            fontFamily: 'inherit',
            transition: 'all var(--duration-fast)',
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = 'var(--color-brand-blue)';
            e.currentTarget.style.boxShadow = '0 0 0 3px rgba(15, 56, 44, 0.1)';
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = 'var(--color-border-subtle)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        />
      </div>
    </div>
  );
};
