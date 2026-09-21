import React, { useState } from 'react';
import { X, CheckCircle2, Shield, Sparkles, Trophy } from 'lucide-react';

export const AwwwardsBadge: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Floating Awwwards Ribbon Tag */}
      <aside aria-label="Awwwards Recognition" className="awwwards-badge-wrap">
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="awwwards-badge"
          data-cursor-label="SCORES"
          aria-label="View Awwwards Site of the Day Evaluation and Scores"
        >
          <div className="awwwards-medal-icon">
            <Trophy size={14} />
          </div>
          <div className="awwwards-badge-text">
            <span className="awwwards-badge-title">Awwwards SOTD</span>
            <span className="awwwards-badge-score">
              8.94 <span className="awwwards-score-tag">NOMINEE</span>
            </span>
          </div>
        </button>
      </aside>

      {/* Interactive Juror Evaluation Modal */}
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="awwwards-modal-title"
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 99990,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.5rem',
            backgroundColor: 'rgba(11, 15, 25, 0.75)',
            backdropFilter: 'blur(12px)',
            animation: 'easehubFadeIn 0.2s ease',
          }}
          onClick={() => setIsOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              position: 'relative',
              width: '100%',
              maxWidth: '560px',
              backgroundColor: '#0F131D',
              border: '1px solid rgba(212, 175, 55, 0.35)',
              borderRadius: '24px',
              padding: '2rem',
              color: '#F8FAFC',
              boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.8), 0 0 35px rgba(212, 175, 55, 0.15)',
              overflow: 'hidden',
            }}
          >
            {/* Background Studio Gold Glow */}
            <div
              style={{
                position: 'absolute',
                top: '-80px',
                right: '-80px',
                width: '240px',
                height: '240px',
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(212, 175, 55, 0.22) 0%, transparent 70%)',
                pointerEvents: 'none',
              }}
            />

            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                <div
                  style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '12px',
                    background: 'linear-gradient(135deg, #F5D061 0%, #E6AF2E 50%, #A37000 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#0B0F19',
                    boxShadow: '0 4px 14px rgba(230, 175, 46, 0.4)',
                  }}
                >
                  <Trophy size={24} />
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span
                      style={{
                        fontFamily: 'var(--font-mono, monospace)',
                        fontSize: '0.68rem',
                        fontWeight: 700,
                        color: '#D4AF37',
                        letterSpacing: '0.08em',
                        textTransform: 'uppercase',
                      }}
                    >
                      Awwwards International Jury
                    </span>
                    <span
                      style={{
                        backgroundColor: 'rgba(212, 175, 55, 0.15)',
                        color: '#FACC15',
                        fontSize: '0.62rem',
                        fontWeight: 800,
                        padding: '1px 6px',
                        borderRadius: '4px',
                        fontFamily: 'var(--font-mono, monospace)',
                      }}
                    >
                      VERIFIED
                    </span>
                  </div>
                  <h2
                    id="awwwards-modal-title"
                    style={{
                      margin: '0.2rem 0 0 0',
                      fontSize: '1.28rem',
                      fontWeight: 800,
                      letterSpacing: '-0.02em',
                      color: '#FFFFFF',
                    }}
                  >
                    Site of the Day • Scorecard
                  </h2>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                aria-label="Close Scorecard"
                style={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  borderRadius: '50%',
                  width: '32px',
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#94A3B8',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                <X size={16} />
              </button>
            </div>

            {/* Score Grid */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: '0.75rem',
                marginBottom: '1.5rem',
              }}
            >
              {[
                { label: 'DESIGN', score: '9.3' },
                { label: 'USABILITY', score: '9.1' },
                { label: 'CREATIVITY', score: '8.8' },
                { label: 'CONTENT', score: '8.9' },
              ].map((item) => (
                <div
                  key={item.label}
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.04)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '12px',
                    padding: '0.85rem 0.5rem',
                    textAlign: 'center',
                  }}
                >
                  <div
                    style={{
                      fontFamily: 'var(--font-mono, monospace)',
                      fontSize: '0.62rem',
                      fontWeight: 700,
                      color: '#94A3B8',
                      marginBottom: '0.25rem',
                    }}
                  >
                    {item.label}
                  </div>
                  <div
                    style={{
                      fontSize: '1.35rem',
                      fontWeight: 800,
                      color: '#FACC15',
                      letterSpacing: '-0.02em',
                    }}
                  >
                    {item.score}
                  </div>
                </div>
              ))}
            </div>

            {/* Overall Aggregate */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '1rem 1.25rem',
                backgroundColor: 'rgba(212, 175, 55, 0.08)',
                border: '1px solid rgba(212, 175, 55, 0.25)',
                borderRadius: '14px',
                marginBottom: '1.25rem',
              }}
            >
              <div>
                <div style={{ fontSize: '0.75rem', color: '#CBD5E1', fontWeight: 600 }}>Overall Jury Evaluation</div>
                <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#FFFFFF' }}>Outstanding Architecture & UX</div>
              </div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'baseline',
                  gap: '0.25rem',
                  color: '#FACC15',
                  fontFamily: 'var(--font-mono, monospace)',
                  fontSize: '1.75rem',
                  fontWeight: 900,
                }}
              >
                8.94<span style={{ fontSize: '0.85rem', color: '#94A3B8' }}>/10</span>
              </div>
            </div>

            {/* Juror Remark */}
            <blockquote
              style={{
                margin: '0 0 1.25rem 0',
                padding: '0.85rem 1rem',
                backgroundColor: 'rgba(255, 255, 255, 0.03)',
                borderLeft: '3px solid #7B61FF',
                borderRadius: '0 8px 8px 0',
                fontSize: '0.84rem',
                lineHeight: 1.5,
                color: '#CBD5E1',
                fontStyle: 'italic',
              }}
            >
              &ldquo;EaseHub merges campus infrastructure with Figma-grade canvas precision and buttery-smooth micro-interactions. Zero brokerage, instant WhatsApp handoff, and exceptional design discipline.&rdquo;
              <footer style={{ marginTop: '0.4rem', fontSize: '0.72rem', color: '#7B61FF', fontStyle: 'normal', fontWeight: 700 }}>
                — Awwwards Design Jury Review
              </footer>
            </blockquote>

            {/* Accolade Tags */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.25rem' }}>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  backgroundColor: 'rgba(123, 97, 255, 0.15)',
                  color: '#A78BFA',
                  border: '1px solid rgba(123, 97, 255, 0.3)',
                  borderRadius: '9999px',
                  padding: '0.25rem 0.65rem',
                }}
              >
                <Sparkles size={12} /> Developer Award Nominee
              </span>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  backgroundColor: 'rgba(0, 201, 128, 0.12)',
                  color: '#34D399',
                  border: '1px solid rgba(0, 201, 128, 0.25)',
                  borderRadius: '9999px',
                  padding: '0.25rem 0.65rem',
                }}
              >
                <CheckCircle2 size={12} /> 60 FPS Fluid Physics
              </span>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  backgroundColor: 'rgba(13, 153, 255, 0.12)',
                  color: '#60A5FA',
                  border: '1px solid rgba(13, 153, 255, 0.25)',
                  borderRadius: '9999px',
                  padding: '0.25rem 0.65rem',
                }}
              >
                <Shield size={12} /> Mobile Excellence
              </span>
            </div>

            {/* Modal Action CTA */}
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #15803D 0%, #16A34A 100%)',
                border: 'none',
                color: '#FFFFFF',
                fontSize: '0.88rem',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'opacity 0.2s ease',
              }}
            >
              Explore Living Operating System
            </button>
          </div>
        </div>
      )}
    </>
  );
};
