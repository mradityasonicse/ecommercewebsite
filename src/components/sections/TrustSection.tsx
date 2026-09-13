import React from 'react';
import { ShieldCheck, Lock, Zap, CheckCircle2, Star } from 'lucide-react';
import { SITE_CONFIG } from '../../data/site-config';
import { STUDENT_STORIES } from '../../data/stories';
import { Badge } from '../ui/Badge';
import { FadeReveal } from '../motion/FadeReveal';

export const TrustSection: React.FC = () => {
  const getGuaranteeIcon = (iconName: string) => {
    switch (iconName) {
      case 'ShieldCheck': return <ShieldCheck size={24} color="var(--color-blue-light)" />;
      case 'Lock': return <Lock size={24} color="var(--color-blue-light)" />;
      case 'Zap': return <Zap size={24} color="var(--color-red-light)" />;
      case 'CheckCircle2': return <CheckCircle2 size={24} color="var(--color-blue-light)" />;
      default: return <ShieldCheck size={24} />;
    }
  };

  return (
    <section id="trust" className="section-spacing" style={{ position: 'relative' }}>
      <div className="container">
        
        {/* Section Header */}
        <div className="section-header text-center">
          <FadeReveal direction="up" delay={50}>
            <div className="section-eyebrow">
              <ShieldCheck size={14} />
              <span>Act 5 • The Verification Standard</span>
            </div>
            <h2 className="section-title">
              Why Campus Students Trust EaseHub
            </h2>
            <p className="section-desc">
              We don’t allow random public listings. Every provider must pass our 4-point verification audit before taking a single order.
            </p>
          </FadeReveal>
        </div>

        {/* 4 Trust Pillars */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '1.5rem',
            marginBottom: '4.5rem'
          }}
        >
          {SITE_CONFIG.trustGuarantees.map((item, idx) => (
            <FadeReveal key={idx} direction="up" delay={idx * 60}>
              <div
                style={{
                  backgroundColor: 'var(--color-surface)',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '1.75rem',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem'
                }}
              >
                <div
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'rgba(255, 255, 255, 0.04)',
                    border: '1px solid var(--color-border)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  {getGuaranteeIcon(item.icon)}
                </div>

                <div>
                  <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--color-white)', marginBottom: '0.4rem' }}>
                    {item.title}
                  </h4>
                  <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
                    {item.desc}
                  </p>
                </div>
              </div>
            </FadeReveal>
          ))}
        </div>

        {/* Student Testimonials Story Block */}
        <div id="stories">
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <h3 style={{ fontSize: 'var(--text-h3)', fontWeight: 800 }}>
              Peer-Reviewed by University Residents
            </h3>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '1.5rem'
            }}
          >
            {STUDENT_STORIES.map((story, idx) => (
              <FadeReveal key={story.id} direction="up" delay={idx * 80}>
                <div
                  style={{
                    backgroundColor: 'var(--color-surface)',
                    border: '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-lg)',
                    padding: '1.75rem',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    height: '100%'
                  }}
                >
                  <div>
                    {/* Stars + University */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                      <div style={{ display: 'flex', gap: '2px', color: '#FBBF24' }}>
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={14} fill="#FBBF24" />
                        ))}
                      </div>
                      <Badge variant="verified" size="sm">
                        Verified Student
                      </Badge>
                    </div>

                    {/* Quote */}
                    <p
                      style={{
                        fontSize: 'var(--text-sm)',
                        color: 'var(--color-text-secondary)',
                        fontStyle: 'italic',
                        lineHeight: 1.6,
                        marginBottom: '1.5rem'
                      }}
                    >
                      "{story.quote}"
                    </p>
                  </div>

                  <div>
                    {/* Impact Metric Pill */}
                    <div
                      style={{
                        padding: '0.45rem 0.75rem',
                        backgroundColor: 'var(--color-blue-subtle)',
                        borderRadius: 'var(--radius-sm)',
                        border: '1px solid rgba(28, 100, 242, 0.25)',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        color: 'var(--color-blue-light)',
                        marginBottom: '1.25rem',
                        display: 'inline-block'
                      }}
                    >
                      {story.metricsSaved}
                    </div>

                    {/* Student Info */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div
                        style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '50%',
                          backgroundColor: 'var(--color-surface-elevated)',
                          border: '1px solid var(--color-border-hover)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 700,
                          fontSize: 'var(--text-xs)',
                          color: 'var(--color-white)',
                          fontFamily: 'var(--font-display)'
                        }}
                      >
                        {story.avatarText}
                      </div>
                      <div>
                        <div style={{ fontSize: 'var(--text-sm)', fontWeight: 700, color: 'var(--color-white)' }}>
                          {story.studentName}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                          {story.university} • {story.course}
                        </div>
                      </div>
                    </div>
                  </div>

                </div>
              </FadeReveal>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};
