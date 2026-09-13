import React, { useState } from 'react';
import { Drawer } from '../ui/Drawer';
import { Button } from '../ui/Button';
import { CheckCircle2, Building2 } from 'lucide-react';

interface RequestCampusDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RequestCampusDrawer: React.FC<RequestCampusDrawerProps> = ({ isOpen, onClose }) => {
  const [submitted, setSubmitted] = useState(false);
  const [collegeName, setCollegeName] = useState('');
  const [city, setCity] = useState('');
  const [email, setEmail] = useState('');
  const [studentCohort, setStudentCohort] = useState('50-200');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!collegeName.trim()) return;
    setSubmitted(true);
  };

  return (
    <Drawer isOpen={isOpen} onClose={onClose} title="Request Campus Hub" position="right" width="460px">
      {!submitted ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--color-brand-blue, #0F382C)', fontSize: 'var(--text-xs)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.4rem' }}>
              <Building2 size={14} color="var(--color-brand-blue, #0F382C)" />
              <span>Campus Expansion Pipeline</span>
            </div>
            <h4 style={{ fontSize: '1.25rem', fontFamily: 'Domine, serif', fontWeight: 700, color: 'var(--color-brand-blue, #0F382C)', marginBottom: '0.4rem' }}>
              Bring EaseHub to Your University
            </h4>
            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary, #414845)', lineHeight: 1.55 }}>
              When 200 students from a campus register interest, our on-ground team conducts audits and onboards verified mess, PG, and laundry partners in under 3 weeks.
            </p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--color-text-secondary, #414845)', marginBottom: '0.4rem' }}>
                University / College Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. SRM University, Ashoka, IIT Roorkee"
                value={collegeName}
                onChange={(e) => setCollegeName(e.target.value)}
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
                Campus City / State *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Sonipat, Haryana"
                value={city}
                onChange={(e) => setCity(e.target.value)}
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
                Your Student Email *
              </label>
              <input
                type="email"
                required
                placeholder="rollno@college.ac.in"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                Estimated Campus Hostellers
              </label>
              <select
                value={studentCohort}
                onChange={(e) => setStudentCohort(e.target.value)}
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
                <option value="50-200">50 - 200 Students</option>
                <option value="200-1000">200 - 1,000 Students</option>
                <option value="1000-5000">1,000 - 5,000 Students</option>
                <option value="5000+">5,000+ Students</option>
              </select>
            </div>

            <Button variant="accent" size="md" fullWidth type="submit" style={{ marginTop: '0.5rem' }}>
              Submit Campus Hub Nomination
            </Button>
          </form>
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '2.5rem 1rem' }}>
          <CheckCircle2 size={48} color="#2E7D32" style={{ margin: '0 auto 1rem auto' }} />
          <h3 style={{ fontSize: 'var(--text-h4)', fontFamily: 'Domine, serif', fontWeight: 700, color: 'var(--color-brand-blue, #0F382C)', marginBottom: '0.5rem' }}>
            Nomination Recorded!
          </h3>
          <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary, #414845)', lineHeight: 1.6, marginBottom: '1.5rem' }}>
            We’ve added <strong style={{ color: 'var(--color-brand-blue, #0F382C)' }}>{collegeName}</strong> to our expansion watch list.
            We will alert <strong style={{ color: 'var(--color-brand-blue, #0F382C)' }}>{email}</strong> the moment verification audits begin.
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
