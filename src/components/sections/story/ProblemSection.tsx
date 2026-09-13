import React from 'react';
import { MessageSquare, PhoneCall, AlertTriangle, Clock, FileSpreadsheet, ArrowDown } from 'lucide-react';
import { Container } from '../../primitives/Container';

export const ProblemSection: React.FC = () => {
  const frictionPoints = [
    {
      icon: <MessageSquare size={16} color="var(--color-brand-red)" />,
      label: '5+ WhatsApp Groups',
      detail: 'Mess menus lost in chat feeds',
    },
    {
      icon: <PhoneCall size={16} color="var(--color-brand-red)" />,
      label: 'Unverified Contacts',
      detail: 'Calling random laundry numbers',
    },
    {
      icon: <AlertTriangle size={16} color="var(--color-brand-red)" />,
      label: 'Security Deposit Disputes',
      detail: 'Hostel & PG broker friction',
    },
    {
      icon: <Clock size={16} color="var(--color-brand-red)" />,
      label: 'Delayed Campus Commute',
      detail: 'Missing morning lectures',
    },
    {
      icon: <FileSpreadsheet size={16} color="var(--color-brand-red)" />,
      label: 'Fragmented UPI Payments',
      detail: 'No single student rate card',
    },
  ];

  return (
    <section
      id="problem"
      aria-label="The Reality of Student Living Fragmentation"
      style={{
        position: 'relative',
        backgroundColor: 'var(--color-bg-secondary)',
        paddingTop: 'var(--space-20)',
        paddingBottom: 'var(--space-20)',
        borderBottom: '1px solid var(--color-border-subtle)',
        overflow: 'hidden',
      }}
    >
      <Container variant="wide">
        {/* Section Header */}
        <div style={{ maxWidth: '820px', margin: '0 auto', textAlign: 'center', marginBottom: 'var(--space-12)' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              padding: '0.3rem 0.75rem',
              borderRadius: 'var(--radius-pill)',
              backgroundColor: 'var(--color-semantic-error-bg, rgba(239, 68, 68, 0.18))',
              border: '1px solid var(--color-semantic-error-border, rgba(239, 68, 68, 0.35))',
              marginBottom: 'var(--space-4)',
            }}
          >
            <span
              style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                backgroundColor: 'var(--color-brand-red)',
              }}
            />
            <span
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: 'var(--text-eyebrow)',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.12em',
                color: 'var(--color-brand-red)',
              }}
            >
              The Reality of Campus Living
            </span>
          </div>

          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'var(--text-heading-xl)',
              fontWeight: 700,
              letterSpacing: '-0.02em',
              lineHeight: 1.2,
              color: 'var(--color-text-primary)',
              margin: '0 0 var(--space-4) 0',
            }}
          >
            So Many Daily Needs.{' '}
            <span style={{ color: 'var(--color-text-secondary)', fontWeight: 600 }}>
              Too Many Disconnected Systems.
            </span>
          </h2>

          <p
            style={{
              fontSize: 'var(--text-body-lg)',
              color: 'var(--color-text-secondary)',
              lineHeight: 1.6,
              maxWidth: '680px',
              margin: '0 auto',
            }}
          >
            University students navigate 8 essential services every single day. Yet each service lives in a separate WhatsApp group, an unverified phone number, or a cash slip with zero accountability.
          </p>
        </div>

        {/* Editorial Visual Composition: The Fragmentation Field */}
        <div
          style={{
            position: 'relative',
            maxWidth: '1000px',
            margin: '0 auto',
            padding: 'var(--space-8)',
            backgroundColor: 'var(--color-surface-1)',
            border: '1px solid var(--color-border-default)',
            borderRadius: 'var(--radius-xl)',
            overflow: 'hidden',
          }}
        >
          {/* Subtle warning backdrop glow */}
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '480px',
              height: '240px',
              background: 'radial-gradient(ellipse at center, rgba(255, 43, 43, 0.05) 0%, transparent 70%)',
              pointerEvents: 'none',
            }}
          />

          {/* Left / Right Comparison Flow */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: 'var(--space-8)',
              alignItems: 'center',
              position: 'relative',
              zIndex: 2,
            }}
          >
            {/* Left Column: Everyday Student Friction */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              <span
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'var(--text-eyebrow)',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  color: 'var(--color-text-muted)',
                  marginBottom: 'var(--space-1)',
                }}
              >
                The Typical Semester Struggle
              </span>

              {frictionPoints.map((item) => (
                <div
                  key={item.label}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: '0.65rem 0.85rem',
                    backgroundColor: 'var(--color-surface-2)',
                    border: '1px solid var(--color-border-subtle)',
                    borderRadius: 'var(--radius-md)',
                  }}
                >
                  <div
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: 'var(--radius-sm)',
                      backgroundColor: 'rgba(255, 43, 43, 0.08)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    {item.icon}
                  </div>
                  <div>
                    <div style={{ fontSize: 'var(--text-body-xs)', fontWeight: 700, color: 'var(--color-text-primary)' }}>
                      {item.label}
                    </div>
                    <div style={{ fontSize: 'var(--text-caption)', color: 'var(--color-text-muted)' }}>
                      {item.detail}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Right Column: Narrative Stat & Impact */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                padding: 'var(--space-6)',
                backgroundColor: 'var(--color-surface-2)',
                border: '1px solid var(--color-border-default)',
                borderRadius: 'var(--radius-lg)',
              }}
            >
              <span
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'var(--text-eyebrow)',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.12em',
                  color: 'var(--color-brand-red)',
                  marginBottom: 'var(--space-2)',
                }}
              >
                The Hidden Cost
              </span>

              <div
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(2.5rem, 4vw, 3.5rem)',
                  fontWeight: 700,
                  color: 'var(--color-brand-red)',
                  lineHeight: 1,
                  letterSpacing: '-0.02em',
                  marginBottom: 'var(--space-2)',
                }}
              >
                18+ Hours
              </div>
              <div style={{ fontSize: 'var(--text-body-sm)', color: 'var(--color-text-secondary)', fontWeight: 600, marginBottom: 'var(--space-4)' }}>
                Wasted per student every month chasing basic campus services
              </div>

              <p style={{ fontSize: 'var(--text-body-xs)', color: 'var(--color-text-muted)', lineHeight: 1.55, margin: 0 }}>
                Between exams, assignment deadlines, and campus life, students should not be spending weekends arguing with local laundries, testing unhygienic tiffins, or fighting over unreturned security deposits.
              </p>
            </div>
          </div>

          {/* Converging Story Transition Indicator */}
          <div
            style={{
              marginTop: 'var(--space-8)',
              paddingTop: 'var(--space-6)',
              borderTop: '1px solid var(--color-border-subtle)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              color: 'var(--color-brand-blue)',
              fontSize: 'var(--text-body-xs)',
              fontFamily: 'var(--font-body)',
              fontWeight: 700,
            }}
          >
            <span>EaseHub was engineered to replace this fragmentation</span>
            <ArrowDown size={14} />
          </div>
        </div>
      </Container>
    </section>
  );
};
