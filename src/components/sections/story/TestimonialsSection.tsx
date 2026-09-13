import React from 'react';
import { Star } from 'lucide-react';
import { Container } from '../../primitives/Container';

export const TestimonialsSection: React.FC = () => {
  const testimonials = [
    {
      name: 'Priya Sharma',
      role: 'Engineering Student',
      avatar: 'PS',
      avatarBg: '#0F382C',
      quote:
        'EaseHub made my college life so much easier! No more worrying about meals or laundry.',
      rating: 5,
    },
    {
      name: 'Rahul Verma',
      role: 'MBA Student',
      avatar: 'RV',
      avatarBg: '#164E3E',
      quote:
        'Found an amazing PG through EaseHub. The verification process gave me peace of mind.',
      rating: 5,
    },
    {
      name: 'Ananya Patel',
      role: 'Medical Student',
      avatar: 'AP',
      avatarBg: '#2E7D32',
      quote:
        'The food service is incredible. Fresh, home-style meals delivered right to my hostel!',
      rating: 5,
    },
  ];

  return (
    <section
      id="testimonials"
      aria-labelledby="testimonials-heading"
      style={{
        padding: '5rem 0',
        backgroundColor: 'var(--color-bg-primary, #FBF9F1)',
      }}
    >
      <Container>
        {/* Section Header */}
        <div
          style={{
            textAlign: 'center',
            maxWidth: '640px',
            margin: '0 auto 3.5rem',
          }}
        >
          <h2
            id="testimonials-heading"
            style={{
              fontFamily: 'Domine, serif',
              fontSize: 'clamp(2rem, 3.5vw, 2.75rem)',
              fontWeight: 700,
              letterSpacing: '-0.02em',
              color: 'var(--color-brand-blue, #0F382C)',
              marginBottom: '0.75rem',
            }}
          >
            What Students Say
          </h2>
          <p
            style={{
              fontSize: '1.1rem',
              color: 'var(--color-text-secondary, #414845)',
              lineHeight: 1.6,
            }}
          >
            Trusted by verified campus scholars across university hubs
          </p>
        </div>

        {/* 3 Testimonial Cards */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '2rem',
          }}
        >
          {testimonials.map((item, idx) => (
            <div
              key={idx}
              style={{
                backgroundColor: '#FFFFFF',
                border: '1px solid var(--color-border-subtle, #E8E4D5)',
                borderRadius: '16px',
                padding: '2.25rem 2rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxShadow: '0 4px 20px rgba(15, 56, 44, 0.05)',
                position: 'relative',
                transition: 'transform 0.25s ease, box-shadow 0.25s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-6px)';
                e.currentTarget.style.boxShadow = '0 16px 32px rgba(15, 56, 44, 0.12)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'none';
                e.currentTarget.style.boxShadow = '0 4px 20px rgba(15, 56, 44, 0.05)';
              }}
            >
              <div>
                {/* 5-Star Rating */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem',
                    marginBottom: '1.25rem',
                  }}
                >
                  {[...Array(item.rating)].map((_, i) => (
                    <Star
                      key={i}
                      size={18}
                      fill="#F59E0B"
                      color="#F59E0B"
                    />
                  ))}
                </div>

                {/* Quote text */}
                <p
                  style={{
                    fontSize: '1.025rem',
                    lineHeight: 1.6,
                    color: 'var(--color-text-primary, #151D1A)',
                    fontStyle: 'italic',
                    marginBottom: '2rem',
                  }}
                >
                  "{item.quote}"
                </p>
              </div>

              {/* Author info */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  borderTop: '1px solid var(--color-border-subtle, #E8E4D5)',
                  paddingTop: '1.25rem',
                }}
              >
                <div
                  style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '50%',
                    backgroundColor: item.avatarBg,
                    color: '#FFFFFF',
                    fontWeight: 700,
                    fontSize: '0.9rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  {item.avatar}
                </div>
                <div>
                  <h4
                    style={{
                      fontFamily: 'Domine, serif',
                      fontSize: '1rem',
                      fontWeight: 700,
                      color: 'var(--color-brand-blue, #0F382C)',
                      margin: '0 0 0.15rem 0',
                    }}
                  >
                    {item.name}
                  </h4>
                  <p
                    style={{
                      fontSize: '0.825rem',
                      color: 'var(--color-text-muted, #6B736D)',
                      margin: 0,
                    }}
                  >
                    {item.role}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
};
