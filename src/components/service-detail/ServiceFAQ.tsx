import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';
import type { ServiceFAQ as FAQType } from '../../types/serviceDetail';

interface ServiceFAQProps {
  faqs: FAQType[];
  serviceName: string;
}

export const ServiceFAQ: React.FC<ServiceFAQProps> = ({ faqs, serviceName }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0); // First open by default

  if (!faqs || faqs.length === 0) return null;

  const toggleAccordion = (idx: number) => {
    setOpenIndex(prev => (prev === idx ? null : idx));
  };

  return (
    <section
      id="faq"
      aria-label={`${serviceName} Frequently Asked Questions`}
      style={{
        padding: 'var(--space-16) 0',
        borderBottom: '1px solid var(--color-border-subtle)',
      }}
    >
      <div style={{ maxWidth: '680px', marginBottom: 'var(--space-10)' }}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.45rem',
            padding: '0.35rem 0.85rem',
            borderRadius: 'var(--radius-pill)',
            backgroundColor: 'rgba(59, 130, 246, 0.06)',
            border: '1px solid rgba(59, 130, 246, 0.16)',
            fontSize: '0.72rem',
            fontFamily: 'var(--font-sans)',
            fontWeight: 700,
            color: 'var(--color-brand-blue)',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            marginBottom: 'var(--space-3)',
          }}
        >
          <HelpCircle size={13} color="var(--color-brand-blue)" />
          <span>Student Inquiries</span>
        </div>

        <h2
          style={{
            fontSize: 'clamp(1.8rem, 2.8vw, 2.4rem)',
            fontFamily: 'var(--font-serif, "Domine", serif)',
            fontWeight: 600,
            color: 'var(--color-text-primary)',
            lineHeight: 1.2,
            margin: '0 0 var(--space-3) 0',
          }}
        >
          Frequently Asked Questions.
        </h2>

        <p style={{ fontSize: '0.96rem', color: 'var(--color-text-secondary)', lineHeight: 1.6, margin: 0 }}>
          Everything you need to know about pausing, billing safeguards, and campus delivery rules.
        </p>
      </div>

      <div
        style={{
          maxWidth: '820px',
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--space-3)',
        }}
      >
        {faqs.map((faq, idx) => {
          const isOpen = openIndex === idx;
          const buttonId = `faq-btn-${idx}`;
          const panelId = `faq-panel-${idx}`;

          return (
            <div
              key={idx}
              style={{
                backgroundColor: isOpen ? 'var(--color-surface-2)' : '#FFFFFF',
                border: isOpen ? '1px solid var(--color-brand-blue)' : '1px solid var(--color-border-subtle)',
                borderRadius: 'var(--radius-xl)',
                overflow: 'hidden',
                boxShadow: 'var(--shadow-sm)',
                transition: 'all var(--duration-fast)',
              }}
            >
              <h3>
                <button
                  id={buttonId}
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => toggleAccordion(idx)}
                  style={{
                    width: '100%',
                    padding: '1.25rem 1.5rem',
                    backgroundColor: 'transparent',
                    border: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '1rem',
                    color: 'var(--color-text-primary)',
                    fontSize: '1.02rem',
                    fontFamily: 'var(--font-serif, "Domine", serif)',
                    fontWeight: 600,
                    textAlign: 'left',
                    cursor: 'pointer',
                    outline: 'none',
                  }}
                >
                  <span>{faq.question}</span>
                  <ChevronDown
                    size={18}
                    color={isOpen ? 'var(--color-brand-blue)' : 'var(--color-text-muted)'}
                    style={{
                      transform: isOpen ? 'rotate(180deg)' : 'none',
                      transition: 'transform var(--duration-fast)',
                      flexShrink: 0,
                    }}
                  />
                </button>
              </h3>

              <div
                id={panelId}
                role="region"
                aria-labelledby={buttonId}
                hidden={!isOpen}
                style={{
                  padding: isOpen ? '0 1.5rem 1.25rem 1.5rem' : '0 1.5rem',
                  display: isOpen ? 'block' : 'none',
                }}
              >
                <p
                  style={{
                    fontSize: '0.9rem',
                    fontFamily: 'var(--font-body)',
                    color: 'var(--color-text-secondary)',
                    lineHeight: 1.6,
                    margin: 0,
                  }}
                >
                  {faq.answer}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
