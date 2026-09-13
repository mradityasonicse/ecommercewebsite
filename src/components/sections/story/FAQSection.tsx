import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { Container } from '../../primitives/Container';

export interface FAQItem {
  question: string;
  answer: string;
}

export const FAQS_DATA: FAQItem[] = [
  {
    question: 'How does EaseHub work?',
    answer:
      'EaseHub connects students with verified service providers for PG/Hostel, meals, laundry, and other essential services. Simply browse, select, and request - we handle the rest!',
  },
  {
    question: 'Is EaseHub free to use?',
    answer:
      'Yes! Creating an account and browsing services is completely free. You only pay for the services you use.',
  },
  {
    question: 'Are all service providers verified?',
    answer:
      'Absolutely! We thoroughly verify all service providers to ensure safety, quality, and reliability for our students.',
  },
  {
    question: 'What cities is EaseHub available in?',
    answer:
      'We are currently available in major college cities across India and expanding rapidly. Check our services page for your city!',
  },
];

export const FAQSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section
      id="faq"
      aria-labelledby="faq-heading"
      style={{
        padding: '5.5rem 0',
        backgroundColor: 'var(--color-bg-secondary, #F8FAFC)',
        borderTop: '1px solid var(--color-border-subtle, #E2E8F0)',
        position: 'relative',
      }}
    >
      <Container variant="narrow">
        {/* Header */}
        <div
          style={{
            textAlign: 'center',
            maxWidth: '640px',
            margin: '0 auto 3.5rem',
          }}
        >
          <h2
            id="faq-heading"
            style={{
              fontFamily: 'var(--font-display, inherit)',
              fontSize: 'clamp(2rem, 3.5vw, 2.75rem)',
              fontWeight: 800,
              letterSpacing: '-0.03em',
              color: 'var(--color-text-primary, #0F172A)',
              marginBottom: '0.75rem',
            }}
          >
            Frequently Asked Questions
          </h2>
          <p
            style={{
              fontSize: '1.1rem',
              color: 'var(--color-text-secondary, #475569)',
              lineHeight: 1.6,
            }}
          >
            Got questions? We've got answers.
          </p>
        </div>

        {/* Accordion List */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
          }}
        >
          {FAQS_DATA.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                style={{
                  backgroundColor: 'var(--color-surface-1, #FFFFFF)',
                  border: '1px solid var(--color-border-default, #E2E8F0)',
                  borderRadius: '14px',
                  overflow: 'hidden',
                  transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
                  boxShadow: isOpen
                    ? '0 6px 20px rgba(0, 0, 0, 0.05)'
                    : '0 2px 8px rgba(0, 0, 0, 0.02)',
                  borderColor: isOpen
                    ? 'var(--color-brand-blue, #0F382C)'
                    : 'var(--color-border-default, #E2E8F0)',
                }}
              >
                <button
                  type="button"
                  onClick={() => toggleAccordion(index)}
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${index}`}
                  style={{
                    width: '100%',
                    padding: '1.35rem 1.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '1rem',
                    background: 'none',
                    border: 'none',
                    textAlign: 'left',
                    cursor: 'pointer',
                  }}
                >
                  <span
                    style={{
                      fontFamily: 'var(--font-display, inherit)',
                      fontSize: '1.08rem',
                      fontWeight: 700,
                      color: 'var(--color-text-primary, #0F172A)',
                      letterSpacing: '-0.01em',
                    }}
                  >
                    {faq.question}
                  </span>
                  <span
                    style={{
                      transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 0.25s ease',
                      color: 'var(--color-text-secondary, #64748B)',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <ChevronDown size={20} />
                  </span>
                </button>

                {isOpen && (
                  <div
                    id={`faq-answer-${index}`}
                    style={{
                      padding: '0 1.5rem 1.5rem',
                      color: 'var(--color-text-secondary, #475569)',
                      fontSize: '0.96rem',
                      lineHeight: 1.65,
                      borderTop: '1px solid var(--color-border-subtle, #F1F5F9)',
                      paddingTop: '1rem',
                    }}
                  >
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
};
