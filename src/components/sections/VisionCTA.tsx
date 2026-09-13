import React from 'react';
import { ArrowRight, GraduationCap, Building2, CheckCircle2 } from 'lucide-react';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { FadeReveal } from '../motion/FadeReveal';

interface VisionCTAProps {
  onPartnerOpen: () => void;
  onRequestCampusOpen: () => void;
}

export const VisionCTA: React.FC<VisionCTAProps> = ({ onPartnerOpen, onRequestCampusOpen }) => {
  return (
    <section className="section-spacing" style={{ position: 'relative', overflow: 'hidden' }}>
      <div className="container">
        
        {/* Dual Conversion Block */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
            gap: '2rem'
          }}
        >
          {/* Card A: For Students */}
          <FadeReveal direction="left" delay={50}>
            <div
              style={{
                backgroundColor: 'var(--color-surface)',
                border: '1px solid rgba(28, 100, 242, 0.4)',
                borderRadius: 'var(--radius-xl)',
                padding: 'clamp(2rem, 4vw, 3rem)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                height: '100%',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  width: '200px',
                  height: '200px',
                  background: 'radial-gradient(circle at top right, var(--color-blue-glow), transparent 70%)',
                  pointerEvents: 'none'
                }}
              />

              <div>
                <Badge variant="blue" size="sm" icon={<GraduationCap size={12} />} style={{ marginBottom: '1.25rem' }}>
                  For University Students
                </Badge>

                <h3
                  style={{
                    fontSize: 'var(--text-h2)',
                    fontWeight: 800,
                    letterSpacing: '-0.03em',
                    lineHeight: 1.15,
                    marginBottom: '1rem',
                    color: 'var(--color-white)'
                  }}
                >
                  Reclaim your campus life today.
                </h3>

                <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', lineHeight: 1.6, marginBottom: '2rem' }}>
                  No more landlord arguments or unhygienic meals. Subscribe to your campus living pass or book individual verified services with one tap.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', marginBottom: '2.5rem' }}>
                  {[
                    'Instant move-in verification & deposit return shield',
                    'FSSAI-audited daily healthy student tiffins',
                    'Single monthly bill for all campus essentials'
                  ].map((feat, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: 'var(--text-xs)', color: 'var(--color-text-primary)' }}>
                      <CheckCircle2 size={15} color="var(--color-blue-light)" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <Button
                  variant="primary"
                  size="lg"
                  fullWidth
                  icon={<ArrowRight size={18} />}
                  onClick={() => {
                    const el = document.getElementById('bundles');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  Get Student Access Pass
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  fullWidth
                  onClick={onRequestCampusOpen}
                >
                  Don't see your college? Request your campus
                </Button>
              </div>
            </div>
          </FadeReveal>

          {/* Card B: For Campus Service Providers */}
          <FadeReveal direction="right" delay={100}>
            <div
              style={{
                backgroundColor: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-xl)',
                padding: 'clamp(2rem, 4vw, 3rem)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                height: '100%',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              <div>
                <Badge variant="neutral" size="sm" icon={<Building2 size={12} />} style={{ marginBottom: '1.25rem' }}>
                  For Verified Partners & Landlords
                </Badge>

                <h3
                  style={{
                    fontSize: 'var(--text-h2)',
                    fontWeight: 800,
                    letterSpacing: '-0.03em',
                    lineHeight: 1.15,
                    marginBottom: '1rem',
                    color: 'var(--color-white)'
                  }}
                >
                  Serve thousands of verified students.
                </h3>

                <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', lineHeight: 1.6, marginBottom: '2rem' }}>
                  Fill 100% of your student PG rooms, expand meal subscriber volume, and automate payment collections through the EaseHub partner portal.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', marginBottom: '2.5rem' }}>
                  {[
                    'Zero listing fees for high-quality verified partners',
                    'Direct payouts with guaranteed on-time student settlements',
                    'Official EaseHub Verification Badge & credibility stamp'
                  ].map((feat, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: 'var(--text-xs)', color: 'var(--color-text-primary)' }}>
                      <CheckCircle2 size={15} color="var(--color-red)" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Button
                  variant="outline"
                  size="lg"
                  fullWidth
                  icon={<ArrowRight size={18} />}
                  onClick={onPartnerOpen}
                >
                  Apply as a Verified Partner
                </Button>
              </div>
            </div>
          </FadeReveal>

        </div>

      </div>
    </section>
  );
};
