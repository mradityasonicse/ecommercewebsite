import React, { useState } from 'react';
import {
  Zap,
  AlertCircle,
  Search,
  ArrowRight,
  Sparkles,
  Sliders,
  Layers,
  Type,
  Maximize2,
  Bell,
  Heart,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';

import { Container, Stack, Grid, GridCol, Heading, Text, Link, Divider } from '../components/primitives';
import {
  Button,
  IconButton,
  Badge,
  CategoryTag,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Input,
  SearchInput,
  Select,
  Textarea,
  Checkbox,
  Switch,
  QuantitySelector,
  Avatar,
  Skeleton,
  Spinner,
  Tooltip,
  Toast,
  Tabs,
  Breadcrumb,
} from '../components/ui';

export const DesignSystemPage: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('colors');
  
  // Interactive test states
  const [btnLoading, setBtnLoading] = useState<boolean>(false);
  const [inputVal, setInputVal] = useState<string>('NIT Trichy Main Campus');
  const [searchVal, setSearchVal] = useState<string>('Express Laundry');
  const [selectVal, setSelectVal] = useState<string>('hostel');
  const [checkboxVal, setCheckboxVal] = useState<boolean>(true);
  const [switchVal, setSwitchVal] = useState<boolean>(true);
  const [qtyVal, setQtyVal] = useState<number>(2);
  const [activeTabVal, setActiveTabVal] = useState<string>('all');
  const [showToast, setShowToast] = useState<boolean>(false);
  const [reducedMotionSim, setReducedMotionSim] = useState<boolean>(false);

  const categories = [
    { id: 'colors', label: 'Color System', icon: <Layers size={16} /> },
    { id: 'typography', label: 'Typography', icon: <Type size={16} /> },
    { id: 'spacing-radius', label: 'Spacing & Radius', icon: <Maximize2 size={16} /> },
    { id: 'shadows-motion', label: 'Shadows & Motion', icon: <Zap size={16} /> },
    { id: 'buttons', label: 'Buttons', icon: <Sparkles size={16} /> },
    { id: 'inputs', label: 'Form Controls', icon: <Sliders size={16} /> },
    { id: 'cards', label: 'Card Variants', icon: <Layers size={16} /> },
    { id: 'badges-feedback', label: 'Badges & Feedback', icon: <Bell size={16} /> },
  ];

  return (
    <div
      className={`easehub-design-system-root ${reducedMotionSim ? 'simulate-reduced-motion' : ''}`}
      style={{
        minHeight: '100vh',
        backgroundColor: 'var(--color-bg-primary)',
        color: 'var(--color-text-primary)',
        fontFamily: 'var(--font-body)',
        paddingBottom: 'var(--space-30)',
      }}
    >
      {reducedMotionSim && (
        <style>{`
          .simulate-reduced-motion * {
            animation-duration: 0.001ms !important;
            transition-duration: 0.001ms !important;
          }
        `}</style>
      )}

      {/* Top Header Bar */}
      <header
        style={{
          borderBottom: '1px solid var(--color-border-default)',
          backgroundColor: 'rgba(5, 5, 5, 0.9)',
          backdropFilter: 'blur(16px)',
          position: 'sticky',
          top: 0,
          zIndex: 50,
        }}
      >
        <Container variant="wide">
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              height: '70px',
            }}
          >
            <Stack direction="row" align="center" gap={3}>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: 'var(--color-surface-2)',
                  border: '1px solid var(--color-border-hover)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <div style={{ width: '12px', height: '12px', borderRadius: '3px', backgroundColor: 'var(--color-brand-blue)' }} />
              </div>
              <div>
                <Stack direction="row" align="center" gap={2}>
                  <Heading level="heading-sm" as="h1" style={{ fontSize: '1rem', letterSpacing: '-0.02em' }}>
                    EaseHub Design System
                  </Heading>
                  <Badge variant="verified" size="sm">Phase 1 Locked</Badge>
                </Stack>
                <Text variant="caption" color="muted">
                  Production Design Specification & Token Inspector
                </Text>
              </div>
            </Stack>

            <Stack direction="row" align="center" gap={3}>
              <Switch
                checked={reducedMotionSim}
                onChange={setReducedMotionSim}
                label="Simulate Reduced Motion"
              />
              <Divider orientation="vertical" spacing={2} style={{ height: '24px' }} />
              <Button
                variant="secondary"
                size="sm"
                icon={<ExternalLink size={14} />}
                onClick={() => {
                  window.location.hash = '';
                  window.location.reload();
                }}
              >
                View App Homepage
              </Button>
            </Stack>
          </div>
        </Container>
      </header>

      {/* Main Showcase Layout */}
      <Container variant="wide" style={{ marginTop: 'var(--space-8)' }}>
        <Grid cols={12} gap={8}>
          {/* Left Navigation Sidebar */}
          <GridCol span={3} spanTablet={8} spanMobile={4}>
            <div
              style={{
                position: 'sticky',
                top: '90px',
                backgroundColor: 'var(--color-surface-1)',
                border: '1px solid var(--color-border-subtle)',
                borderRadius: 'var(--radius-lg)',
                padding: 'var(--space-4)',
              }}
            >
              <Text variant="eyebrow" color="muted" style={{ marginBottom: 'var(--space-3)', paddingLeft: 'var(--space-2)' }}>
                System Architecture
              </Text>
              <Stack direction="column" gap={1}>
                {categories.map((cat) => {
                  const isActive = activeCategory === cat.id;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setActiveCategory(cat.id)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '0.6rem 0.85rem',
                        borderRadius: 'var(--radius-sm)',
                        backgroundColor: isActive ? 'var(--color-blue-subtle)' : 'transparent',
                        color: isActive ? '#FFFFFF' : 'var(--color-text-secondary)',
                        border: isActive ? '1px solid rgba(255, 255, 255, 0.25)' : '1px solid transparent',
                        fontSize: 'var(--text-body-xs)',
                        fontFamily: 'var(--font-display)',
                        fontWeight: isActive ? 700 : 500,
                        cursor: 'pointer',
                        textAlign: 'left',
                        transition: 'all var(--duration-fast)',
                      }}
                    >
                      <Stack direction="row" align="center" gap={2}>
                        {cat.icon}
                        <span>{cat.label}</span>
                      </Stack>
                      {isActive && <ChevronRight size={14} />}
                    </button>
                  );
                })}
              </Stack>

              <Divider spacing={4} />

              <div style={{ padding: 'var(--space-2)' }}>
                <Text variant="caption" color="muted" style={{ marginBottom: '0.4rem' }}>
                  Core Technology Stack:
                </Text>
                <Stack direction="column" gap={1}>
                  <Text variant="body-xs" color="secondary">• Pure CSS Custom Properties</Text>
                  <Text variant="body-xs" color="secondary">• Single TS Token Source</Text>
                  <Text variant="body-xs" color="secondary">• Plus Jakarta Sans & Inter</Text>
                  <Text variant="body-xs" color="secondary">• WCAG AA Accessible Contrast</Text>
                </Stack>
              </div>
            </div>
          </GridCol>

          {/* Right Main Showcase Panels */}
          <GridCol span={9} spanTablet={8} spanMobile={4}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-12)' }}>

              {/* ==================== 1. COLOR SYSTEM ==================== */}
              {(activeCategory === 'colors' || activeCategory === 'all') && (
                <section id="colors">
                  <div style={{ marginBottom: 'var(--space-6)' }}>
                    <Text variant="eyebrow" color="blue">Foundation & Accents</Text>
                    <Heading level="heading-xl">Color System & Tokens</Heading>
                    <Text variant="body-md" color="secondary">
                      Strict contrast hierarchy: Pure Obsidian foundation (`#080A0F`), Platinum White primary accents (`#FFFFFF`), Signal Red alerts & housing (`#E52425`), and neutral/semantic palettes.
                    </Text>
                  </div>

                  {/* Brand Accents */}
                  <div style={{ marginBottom: 'var(--space-8)' }}>
                    <Heading level="heading-sm" style={{ marginBottom: 'var(--space-3)' }}>Brand Accents</Heading>
                    <Grid cols={3} colsTablet={3} colsMobile={1} gap={4}>
                      <Card style={{ backgroundColor: '#080A0F', border: '1px solid var(--color-border-strong)' }}>
                        <div style={{ height: '48px', borderRadius: 'var(--radius-xs)', backgroundColor: '#080A0F', border: '1px solid rgba(255,255,255,0.1)', marginBottom: 'var(--space-3)' }} />
                        <Heading level="heading-sm">Pure Obsidian</Heading>
                        <Text variant="caption" color="muted">--color-bg-primary: #080A0F</Text>
                        <Text variant="body-xs" color="secondary" style={{ marginTop: 'var(--space-2)' }}>Main surface foundation, high-impact background</Text>
                      </Card>

                      <Card style={{ backgroundColor: 'var(--color-surface-1)', border: '1px solid var(--color-border-subtle)' }}>
                        <div style={{ height: '48px', borderRadius: 'var(--radius-xs)', backgroundColor: '#FFFFFF', boxShadow: '0 4px 16px rgba(255, 255, 255, 0.2)', marginBottom: 'var(--space-3)' }} />
                        <Heading level="heading-sm">Platinum White</Heading>
                        <Text variant="caption" color="blue">--color-brand-blue: #FFFFFF</Text>
                        <Text variant="body-xs" color="secondary" style={{ marginTop: 'var(--space-2)' }}>Primary CTA, active navigation, tactile touch physics</Text>
                      </Card>

                      <Card style={{ backgroundColor: 'var(--color-surface-1)', border: '1px solid var(--color-border-subtle)' }}>
                        <div style={{ height: '48px', borderRadius: 'var(--radius-xs)', backgroundColor: '#E52425', boxShadow: '0 4px 16px rgba(229, 36, 37, 0.4)', marginBottom: 'var(--space-3)' }} />
                        <Heading level="heading-sm">Signal Red</Heading>
                        <Text variant="caption" color="red">--color-brand-red: #E52425</Text>
                        <Text variant="body-xs" color="secondary" style={{ marginTop: 'var(--space-2)' }}>Urgent alerts, live radar indicators, verified status</Text>
                      </Card>
                    </Grid>
                  </div>

                  {/* Neutrals Scale */}
                  <div style={{ marginBottom: 'var(--space-8)' }}>
                    <Heading level="heading-sm" style={{ marginBottom: 'var(--space-3)' }}>12-Step Neutral Scale</Heading>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(80px, 1fr))', gap: '0.5rem' }}>
                      {[
                        { label: 'White', hex: '#FFFFFF', color: '#050505' },
                        { label: '50', hex: '#F8FAFC', color: '#050505' },
                        { label: '100', hex: '#F1F5F9', color: '#050505' },
                        { label: '200', hex: '#E2E8F0', color: '#050505' },
                        { label: '300', hex: '#CBD5E1', color: '#050505' },
                        { label: '400', hex: '#94A3B8', color: '#050505' },
                        { label: '500', hex: '#64748B', color: '#FFFFFF' },
                        { label: '600', hex: '#475569', color: '#FFFFFF' },
                        { label: '700', hex: '#334155', color: '#FFFFFF' },
                        { label: '800', hex: '#1E293B', color: '#FFFFFF' },
                        { label: '850', hex: '#151C28', color: '#FFFFFF' },
                        { label: '900', hex: '#0F172A', color: '#FFFFFF' },
                        { label: 'Black', hex: '#000000', color: '#FFFFFF' },
                      ].map((n) => (
                        <div
                          key={n.label}
                          style={{
                            backgroundColor: n.hex,
                            color: n.color,
                            padding: '0.6rem 0.4rem',
                            borderRadius: 'var(--radius-xs)',
                            textAlign: 'center',
                            fontSize: '0.7rem',
                            fontWeight: 600,
                            border: '1px solid rgba(255,255,255,0.08)',
                          }}
                        >
                          <div>{n.label}</div>
                          <div style={{ fontSize: '0.6rem', opacity: 0.8 }}>{n.hex}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Semantic Feedback Tokens */}
                  <div>
                    <Heading level="heading-sm" style={{ marginBottom: 'var(--space-3)' }}>Semantic Feedback System (Independent from Brand)</Heading>
                    <Grid cols={4} colsTablet={2} colsMobile={1} gap={4}>
                      {[
                        { title: 'Success', hex: '#10B981', bg: 'var(--color-semantic-success-bg)', text: 'var(--color-semantic-success-text)', desc: 'Confirmed orders, verified campus partners' },
                        { title: 'Warning', hex: '#F59E0B', bg: 'var(--color-semantic-warning-bg)', text: 'var(--color-semantic-warning-text)', desc: 'Expiring bookings, slot availability low' },
                        { title: 'Error', hex: '#EF4444', bg: 'var(--color-semantic-error-bg)', text: 'var(--color-semantic-error-text)', desc: 'Payment failed, invalid student roll no.' },
                        { title: 'Info', hex: '#38BDF8', bg: 'var(--color-semantic-info-bg)', text: 'var(--color-semantic-info-text)', desc: 'Gate hours schedule, campus announcements' },
                      ].map((sem) => (
                        <div
                          key={sem.title}
                          style={{
                            backgroundColor: sem.bg,
                            border: `1px solid ${sem.hex}40`,
                            borderRadius: 'var(--radius-md)',
                            padding: 'var(--space-4)',
                          }}
                        >
                          <Stack direction="row" align="center" gap={2} style={{ marginBottom: '0.4rem' }}>
                            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: sem.hex }} />
                            <Heading level="heading-sm" style={{ color: sem.text, fontSize: '0.9rem' }}>{sem.title}</Heading>
                          </Stack>
                          <Text variant="caption" style={{ color: sem.text, opacity: 0.9 }}>{sem.hex}</Text>
                          <Text variant="caption" color="secondary" style={{ marginTop: '0.4rem' }}>{sem.desc}</Text>
                        </div>
                      ))}
                    </Grid>
                  </div>
                </section>
              )}

              {/* ==================== 2. TYPOGRAPHY ==================== */}
              {(activeCategory === 'typography' || activeCategory === 'all') && (
                <section id="typography">
                  <div style={{ marginBottom: 'var(--space-6)' }}>
                    <Text variant="eyebrow" color="blue">Type Proportions & Scales</Text>
                    <Heading level="heading-xl">Typography Hierarchy</Heading>
                    <Text variant="body-md" color="secondary">
                      Plus Jakarta Sans (Headings & Labels) + Inter (Body & Data Numerals). Fluid clamp scales maintain balance across mobile to wide desktop.
                    </Text>
                  </div>

                  <Card padding={6} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
                    {[
                      { level: 'display-xl', label: 'Display XL', spec: 'clamp(3rem, 6vw+1rem, 5.5rem) / 800 weight / -0.035em' },
                      { level: 'display-lg', label: 'Display LG', spec: 'clamp(2.5rem, 4.5vw+1rem, 4.25rem) / 800 weight / -0.03em' },
                      { level: 'display-md', label: 'Display MD', spec: 'clamp(2rem, 3.2vw+0.8rem, 3.25rem) / 700 weight / -0.025em' },
                      { level: 'heading-xl', label: 'Heading XL', spec: 'clamp(1.75rem, 2.4vw+0.6rem, 2.5rem) / 700 weight / -0.02em' },
                      { level: 'heading-lg', label: 'Heading LG', spec: 'clamp(1.5rem, 1.8vw+0.5rem, 2rem) / 700 weight / -0.02em' },
                      { level: 'heading-md', label: 'Heading MD', spec: 'clamp(1.25rem, 1.2vw+0.4rem, 1.625rem) / 600 weight / -0.015em' },
                      { level: 'heading-sm', label: 'Heading SM', spec: '18px / 600 weight / -0.01em' },
                    ].map((item) => (
                      <div key={item.level} style={{ borderBottom: '1px solid var(--color-border-subtle)', paddingBottom: 'var(--space-4)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 'var(--space-1)' }}>
                          <Text variant="eyebrow" color="muted">{item.label}</Text>
                          <Text variant="caption" color="muted" style={{ fontFamily: 'var(--font-mono)' }}>{item.spec}</Text>
                        </div>
                        <Heading level={item.level as any}>
                          One Platform. Every Student Need.
                        </Heading>
                      </div>
                    ))}

                    {/* Body Typography Specimens */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 'var(--space-4)', paddingTop: 'var(--space-2)' }}>
                      <div>
                        <Text variant="eyebrow" color="muted">Body LG (18px / 1.6)</Text>
                        <Text variant="body-lg" color="secondary" style={{ marginTop: '0.4rem' }}>
                          Verified campus essentials curated for university students across housing, food, laundry, and fast logistics.
                        </Text>
                      </div>
                      <div>
                        <Text variant="eyebrow" color="muted">Body MD (16px / 1.55)</Text>
                        <Text variant="body-md" color="secondary" style={{ marginTop: '0.4rem' }}>
                          Standard UI paragraphs, card descriptions, and review content calibrated for high legibility on dark surfaces.
                        </Text>
                      </div>
                      <div>
                        <Text variant="eyebrow" color="muted">Body SM & Caption (14px & 12px)</Text>
                        <Text variant="body-sm" color="secondary" style={{ marginTop: '0.4rem' }}>
                          Input helper text, timestamps, table cells, and metadata badges.
                        </Text>
                        <Text variant="caption" color="muted" style={{ marginTop: '0.3rem' }}>
                          Caption note: All prices inclusive of university campus gate delivery.
                        </Text>
                      </div>
                    </div>
                  </Card>
                </section>
              )}

              {/* ==================== 3. SPACING & RADIUS ==================== */}
              {(activeCategory === 'spacing-radius' || activeCategory === 'all') && (
                <section id="spacing-radius">
                  <div style={{ marginBottom: 'var(--space-6)' }}>
                    <Text variant="eyebrow" color="blue">Geometric Rhythm</Text>
                    <Heading level="heading-xl">Spacing & Radius Architecture</Heading>
                    <Text variant="body-md" color="secondary">
                      Strict 4px geometric scale eliminates random padding values. Restrained corner radii preserve clean modern architectural aesthetics.
                    </Text>
                  </div>

                  <Grid cols={2} colsTablet={1} gap={6}>
                    {/* Spacing Scale */}
                    <Card padding={5}>
                      <Heading level="heading-sm" style={{ marginBottom: 'var(--space-4)' }}>Spacing Scale (4px Rhythm)</Heading>
                      <Stack direction="column" gap={3}>
                        {[
                          { token: '--space-1', px: '4px', bar: '4px' },
                          { token: '--space-2', px: '8px', bar: '8px' },
                          { token: '--space-3', px: '12px', bar: '12px' },
                          { token: '--space-4', px: '16px', bar: '16px' },
                          { token: '--space-6', px: '24px', bar: '24px' },
                          { token: '--space-8', px: '32px', bar: '32px' },
                          { token: '--space-12', px: '48px', bar: '48px' },
                          { token: '--space-16', px: '64px', bar: '64px' },
                        ].map((sp) => (
                          <div key={sp.token} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <span style={{ width: '90px', fontSize: 'var(--text-caption)', fontFamily: 'var(--font-mono)', color: 'var(--color-text-muted)' }}>
                              {sp.token}
                            </span>
                            <span style={{ width: '40px', fontSize: 'var(--text-caption)', color: 'var(--color-text-secondary)' }}>
                              {sp.px}
                            </span>
                            <div
                              style={{
                                height: '10px',
                                width: sp.bar,
                                backgroundColor: 'var(--color-brand-blue)',
                                borderRadius: '2px',
                              }}
                            />
                          </div>
                        ))}
                      </Stack>
                    </Card>

                    {/* Radius Scale */}
                    <Card padding={5}>
                      <Heading level="heading-sm" style={{ marginBottom: 'var(--space-4)' }}>Restrained Radius Tokens</Heading>
                      <Stack direction="column" gap={3}>
                        {[
                          { token: '--radius-xs', px: '4px', label: 'Chips & key hints' },
                          { token: '--radius-sm', px: '6px', label: 'Inputs & small buttons' },
                          { token: '--radius-md', px: '8px', label: 'Standard buttons & controls' },
                          { token: '--radius-lg', px: '12px', label: 'Cards & panels' },
                          { token: '--radius-xl', px: '16px', label: 'Modals & drawers' },
                          { token: '--radius-pill', px: '9999px', label: 'Tags & status badges' },
                        ].map((r) => (
                          <div
                            key={r.token}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              padding: '0.5rem 0.75rem',
                              backgroundColor: 'var(--color-surface-2)',
                              borderRadius: `var(${r.token})`,
                              border: '1px solid var(--color-border-default)',
                            }}
                          >
                            <Stack direction="row" align="center" gap={2}>
                              <span style={{ fontSize: 'var(--text-caption)', fontFamily: 'var(--font-mono)', color: 'var(--color-blue-light)' }}>
                                {r.token} ({r.px})
                              </span>
                            </Stack>
                            <span style={{ fontSize: 'var(--text-caption)', color: 'var(--color-text-muted)' }}>
                              {r.label}
                            </span>
                          </div>
                        ))}
                      </Stack>
                    </Card>
                  </Grid>
                </section>
              )}

              {/* ==================== 4. SHADOWS & MOTION ==================== */}
              {(activeCategory === 'shadows-motion' || activeCategory === 'all') && (
                <section id="shadows-motion">
                  <div style={{ marginBottom: 'var(--space-6)' }}>
                    <Text variant="eyebrow" color="blue">Depth & Physics</Text>
                    <Heading level="heading-xl">Elevation & Motion Tokens</Heading>
                    <Text variant="body-md" color="secondary">
                      Subtle dark elevations prevent muddy floating effects. Physics-based cubic-bezier easing gives tactile, snappy micro-interactions.
                    </Text>
                  </div>

                  <Grid cols={3} colsTablet={3} colsMobile={1} gap={4}>
                    <Card style={{ boxShadow: 'var(--shadow-sm)', border: '1px solid var(--color-border-subtle)' }}>
                      <Heading level="heading-sm">--shadow-sm</Heading>
                      <Text variant="caption" color="muted">0 1px 3px rgba(0,0,0,0.45)</Text>
                      <Text variant="body-xs" color="secondary" style={{ marginTop: 'var(--space-3)' }}>Resting cards, table rows</Text>
                    </Card>

                    <Card style={{ boxShadow: 'var(--shadow-md)', border: '1px solid var(--color-border-default)' }}>
                      <Heading level="heading-sm">--shadow-md</Heading>
                      <Text variant="caption" color="muted">0 4px 14px rgba(0,0,0,0.55)</Text>
                      <Text variant="body-xs" color="secondary" style={{ marginTop: 'var(--space-3)' }}>Dropdowns, active card hover</Text>
                    </Card>

                    <Card style={{ boxShadow: 'var(--shadow-lg)', border: '1px solid var(--color-border-strong)' }}>
                      <Heading level="heading-sm">--shadow-lg</Heading>
                      <Text variant="caption" color="muted">0 10px 28px rgba(0,0,0,0.65)</Text>
                      <Text variant="body-xs" color="secondary" style={{ marginTop: 'var(--space-3)' }}>Modals, floating overlays</Text>
                    </Card>
                  </Grid>

                  {/* Motion Physics Demonstration */}
                  <Card padding={5} style={{ marginTop: 'var(--space-6)' }}>
                    <Heading level="heading-sm" style={{ marginBottom: 'var(--space-3)' }}>Motion Tokens & Interactive Physics</Heading>
                    <Grid cols={3} colsTablet={1} gap={4}>
                      {[
                        { name: 'Fast (150ms)', token: '--duration-fast', desc: 'Hover, focus rings, switches', ease: 'ease-standard' },
                        { name: 'Normal (240ms)', token: '--duration-normal', desc: 'Modal reveal, drawer expands', ease: 'ease-emphasized' },
                        { name: 'Slow (450ms)', token: '--duration-slow', desc: 'Page transitions, ambient states', ease: 'ease-enter' },
                      ].map((m) => (
                        <div
                          key={m.name}
                          style={{
                            padding: 'var(--space-4)',
                            backgroundColor: 'var(--color-surface-2)',
                            borderRadius: 'var(--radius-md)',
                            border: '1px solid var(--color-border-default)',
                          }}
                        >
                          <Heading level="heading-sm" style={{ fontSize: '0.95rem' }}>{m.name}</Heading>
                          <Text variant="caption" color="blue" style={{ fontFamily: 'var(--font-mono)' }}>{m.token}</Text>
                          <Text variant="body-xs" color="secondary" style={{ margin: '0.4rem 0 0.8rem' }}>{m.desc}</Text>
                          <div
                            className="interactive-card"
                            style={{
                              padding: '0.5rem',
                              textAlign: 'center',
                              backgroundColor: 'var(--color-surface-3)',
                              borderRadius: 'var(--radius-sm)',
                              border: '1px solid var(--color-border-subtle)',
                              fontSize: '0.75rem',
                              cursor: 'pointer',
                            }}
                          >
                            Hover to test physics
                          </div>
                        </div>
                      ))}
                    </Grid>
                  </Card>
                </section>
              )}

              {/* ==================== 5. BUTTON SYSTEM ==================== */}
              {(activeCategory === 'buttons' || activeCategory === 'all') && (
                <section id="buttons">
                  <div style={{ marginBottom: 'var(--space-6)' }}>
                    <Text variant="eyebrow" color="blue">Action Primitives</Text>
                    <Heading level="heading-xl">Button System</Heading>
                    <Text variant="body-md" color="secondary">
                      Full variant matrix across Primary (Electric Blue), Secondary, Tertiary, Ghost, and Danger. Supports sizes, loading states, and icon configurations.
                    </Text>
                  </div>

                  <Card padding={6} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
                    {/* Controls Bar for Testing */}
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '0.75rem 1rem',
                        backgroundColor: 'var(--color-surface-2)',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--color-border-default)',
                        flexWrap: 'wrap',
                        gap: '0.75rem',
                      }}
                    >
                      <Stack direction="row" align="center" gap={3}>
                        <Switch checked={btnLoading} onChange={setBtnLoading} label="Toggle Loading State" />
                      </Stack>
                      <Text variant="caption" color="muted">
                        Test keyboard focus with <kbd style={{ padding: '0.1rem 0.3rem', background: '#334155', borderRadius: '3px' }}>Tab</kbd>
                      </Text>
                    </div>

                    {/* Sizing Matrix */}
                    <div>
                      <Heading level="heading-sm" style={{ marginBottom: 'var(--space-3)' }}>Sizes (sm, md, lg)</Heading>
                      <Stack direction="row" align="center" gap={3} wrap>
                        <Button size="sm" loading={btnLoading} icon={<ArrowRight size={14} />}>
                          Small Button (32px)
                        </Button>
                        <Button size="md" loading={btnLoading} icon={<ArrowRight size={16} />}>
                          Medium / Standard (40px)
                        </Button>
                        <Button size="lg" loading={btnLoading} icon={<ArrowRight size={18} />}>
                          Large Button (48px)
                        </Button>
                      </Stack>
                    </div>

                    {/* Variants Matrix */}
                    <div>
                      <Heading level="heading-sm" style={{ marginBottom: 'var(--space-3)' }}>Variants</Heading>
                      <Stack direction="row" align="center" gap={3} wrap>
                        <Button variant="primary" loading={btnLoading} icon={<Sparkles size={16} />}>
                          Primary CTA
                        </Button>
                        <Button variant="secondary" loading={btnLoading}>
                          Secondary Outline
                        </Button>
                        <Button variant="tertiary" loading={btnLoading}>
                          Tertiary Subtle
                        </Button>
                        <Button variant="ghost" loading={btnLoading}>
                          Ghost Action
                        </Button>
                        <Button variant="danger" loading={btnLoading} icon={<AlertCircle size={16} />}>
                          Danger Action
                        </Button>
                        <Button variant="white" loading={btnLoading}>
                          High Contrast White
                        </Button>
                      </Stack>
                    </div>

                    {/* Disabled States */}
                    <div>
                      <Heading level="heading-sm" style={{ marginBottom: 'var(--space-3)' }}>Disabled States</Heading>
                      <Stack direction="row" align="center" gap={3} wrap>
                        <Button variant="primary" disabled>Primary Disabled</Button>
                        <Button variant="secondary" disabled>Secondary Disabled</Button>
                        <Button variant="danger" disabled>Danger Disabled</Button>
                      </Stack>
                    </div>

                    {/* IconButtons */}
                    <div>
                      <Heading level="heading-sm" style={{ marginBottom: 'var(--space-3)' }}>Icon Buttons (Accessible aria-labels)</Heading>
                      <Stack direction="row" align="center" gap={3}>
                        <IconButton aria-label="Search" variant="primary" size="md">
                          <Search size={16} />
                        </IconButton>
                        <IconButton aria-label="Favorite" variant="secondary" size="md" shape="rounded">
                          <Heart size={16} />
                        </IconButton>
                        <IconButton aria-label="Alerts" variant="secondary" size="md" shape="circle">
                          <Bell size={16} />
                        </IconButton>
                        <IconButton aria-label="Settings" variant="ghost" size="md">
                          <Sliders size={16} />
                        </IconButton>
                        <IconButton aria-label="Close" variant="danger" size="sm" shape="circle">
                          <AlertCircle size={14} />
                        </IconButton>
                      </Stack>
                    </div>
                  </Card>
                </section>
              )}

              {/* ==================== 6. INPUT SYSTEM ==================== */}
              {(activeCategory === 'inputs' || activeCategory === 'all') && (
                <section id="inputs">
                  <div style={{ marginBottom: 'var(--space-6)' }}>
                    <Text variant="eyebrow" color="blue">Form System</Text>
                    <Heading level="heading-xl">Inputs & Selectors</Heading>
                    <Text variant="body-md" color="secondary">
                      Accessible, high-contrast form controls with integrated labels, helper text, error states, and keyboard navigation.
                    </Text>
                  </div>

                  <Card padding={6} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
                    <Grid cols={2} colsTablet={1} gap={6}>
                      <Input
                        label="University Campus"
                        value={inputVal}
                        onChange={(e) => setInputVal(e.target.value)}
                        helperText="Select your registered university campus hub"
                        required
                      />

                      <Input
                        label="Student ID / Roll No."
                        placeholder="e.g. 106121045"
                        errorMessage="Student ID not found in campus database"
                        required
                      />
                    </Grid>

                    <Grid cols={2} colsTablet={1} gap={6}>
                      <SearchInput
                        label="Global Campus Search"
                        value={searchVal}
                        onChange={(e) => setSearchVal(e.target.value)}
                        onClear={() => setSearchVal('')}
                        placeholder="Search rooms, mess, laundry..."
                      />

                      <Select
                        label="Accommodation Type"
                        value={selectVal}
                        onChange={(e) => setSelectVal(e.target.value)}
                        options={[
                          { value: 'hostel', label: 'On-Campus University Hostel' },
                          { value: 'pg-single', label: 'Private PG (Single Occupancy)' },
                          { value: 'pg-shared', label: 'Private PG (Shared 2-Bed)' },
                          { value: 'flat', label: 'Student Apartment / Flat' },
                        ]}
                      />
                    </Grid>

                    <Textarea
                      label="Special Instructions for Vendor"
                      placeholder="e.g. Please ring bell twice or leave laundry bag at Gate 2 security desk."
                      rows={3}
                      helperText="Max 250 characters. Communicated directly to verified provider."
                    />

                    {/* Boolean Controls: Checkbox, Switch, Quantity */}
                    <Divider spacing={2} />
                    <Heading level="heading-sm">Toggles & Steppers</Heading>
                    <Grid cols={3} colsTablet={1} gap={4}>
                      <Checkbox
                        label="Verified Student Badge"
                        description="Access exclusive discounts"
                        checked={checkboxVal}
                        onChange={(e) => setCheckboxVal(e.target.checked)}
                      />

                      <Switch
                        label="Instant WhatsApp Updates"
                        description="Real-time delivery status"
                        checked={switchVal}
                        onChange={setSwitchVal}
                      />

                      <div>
                        <Text variant="body-xs" color="secondary" style={{ marginBottom: '0.4rem', fontWeight: 600 }}>
                          Order Quantity
                        </Text>
                        <QuantitySelector
                          value={qtyVal}
                          onChange={setQtyVal}
                          min={1}
                          max={10}
                        />
                      </div>
                    </Grid>
                  </Card>
                </section>
              )}

              {/* ==================== 7. CARD VARIANTS ==================== */}
              {(activeCategory === 'cards' || activeCategory === 'all') && (
                <section id="cards">
                  <div style={{ marginBottom: 'var(--space-6)' }}>
                    <Text variant="eyebrow" color="blue">Content Architecture</Text>
                    <Heading level="heading-xl">Card System</Heading>
                    <Text variant="body-md" color="secondary">
                      Restrained, purpose-built card containers. Avoids the "every section is an identical card grid" anti-pattern.
                    </Text>
                  </div>

                  <Grid cols={3} colsTablet={2} colsMobile={1} gap={6}>
                    {/* Provider Card Specimen */}
                    <Card variant="provider" hoverable>
                      <CardHeader>
                        <Badge variant="verified">Verified Partner</Badge>
                        <Text variant="caption" color="muted">4.9 ★ (420+)</Text>
                      </CardHeader>
                      <CardBody>
                        <Heading level="heading-sm">Sri Balaji Deluxe Mess</Heading>
                        <Text variant="body-xs" color="secondary">
                          Pure South Indian unlimited meals, monthly subscriptions with campus delivery.
                        </Text>
                        <Text variant="caption" color="blue" style={{ fontWeight: 600, marginTop: '0.2rem' }}>
                          From ₹2,800 / month
                        </Text>
                      </CardBody>
                      <CardFooter>
                        <Text variant="caption" color="muted">Gate 1 • 200m away</Text>
                        <Button variant="primary" size="sm">Book Slot</Button>
                      </CardFooter>
                    </Card>

                    {/* Stat Card Specimen */}
                    <Card variant="stat">
                      <CardHeader>
                        <Text variant="eyebrow" color="blue">Campus Reach</Text>
                        <Badge variant="live">Live</Badge>
                      </CardHeader>
                      <CardBody>
                        <Heading level="display-md" gradient="electric">14,200+</Heading>
                        <Text variant="body-sm" color="secondary">
                          Active monthly student subscriptions managed across 4 premier universities.
                        </Text>
                      </CardBody>
                    </Card>

                    {/* Bundle Highlight Card */}
                    <Card variant="bundle" hoverable style={{ border: '1px solid rgba(255, 255, 255, 0.25)' }}>
                      <CardHeader>
                        <Badge variant="discount">Save ₹1,400</Badge>
                        <Badge variant="popular">Most Popular</Badge>
                      </CardHeader>
                      <CardBody>
                        <Heading level="heading-sm">The All-In Freshman Pack</Heading>
                        <Text variant="body-xs" color="secondary">
                          Includes Deluxe Mess + 4x Laundry Wash & Iron + High-Speed Hostel Wi-Fi SIM.
                        </Text>
                        <Stack direction="row" align="baseline" gap={2} style={{ marginTop: '0.4rem' }}>
                          <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#FFFFFF' }}>₹4,999</span>
                          <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', textDecoration: 'line-through' }}>₹6,400</span>
                        </Stack>
                      </CardBody>
                      <CardFooter>
                        <Button variant="primary" size="sm" fullWidth>Claim Student Deal</Button>
                      </CardFooter>
                    </Card>
                  </Grid>
                </section>
              )}

              {/* ==================== 8. BADGES & FEEDBACK ==================== */}
              {(activeCategory === 'badges-feedback' || activeCategory === 'all') && (
                <section id="badges-feedback">
                  <div style={{ marginBottom: 'var(--space-6)' }}>
                    <Text variant="eyebrow" color="blue">Indicators & Micro-feedback</Text>
                    <Heading level="heading-xl">Badges, Tabs & Feedback Primitives</Heading>
                    <Text variant="body-md" color="secondary">
                      Semantically tuned compact badges, animated skeleton loaders, avatars with presence rings, and accessible tab groups.
                    </Text>
                  </div>

                  <Card padding={6} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
                    {/* Badge Matrix */}
                    <div>
                      <Heading level="heading-sm" style={{ marginBottom: 'var(--space-3)' }}>Semantic & Brand Badges</Heading>
                      <Stack direction="row" align="center" gap={2} wrap>
                        <Badge variant="brand">Brand Tech</Badge>
                        <Badge variant="verified">Verified Partner</Badge>
                        <Badge variant="live">Live Tracking</Badge>
                        <Badge variant="popular">Popular</Badge>
                        <Badge variant="new">New Listing</Badge>
                        <Badge variant="discount">20% Off</Badge>
                        <Badge variant="success">Confirmed</Badge>
                        <Badge variant="warning">Low Capacity</Badge>
                        <Badge variant="danger">High Demand</Badge>
                        <Badge variant="info">Gate 2 Pass</Badge>
                        <Badge variant="neutral">General Tag</Badge>
                      </Stack>
                    </div>

                    {/* Category Filter Tags */}
                    <div>
                      <Heading level="heading-sm" style={{ marginBottom: 'var(--space-3)' }}>Category Filter Tags</Heading>
                      <Stack direction="row" align="center" gap={2} wrap>
                        <CategoryTag active count={12}>All Services</CategoryTag>
                        <CategoryTag count={5}>Housing & PGs</CategoryTag>
                        <CategoryTag count={8}>Mess & Food</CategoryTag>
                        <CategoryTag count={3}>Laundry Express</CategoryTag>
                        <CategoryTag count={4}>Gym & Fitness</CategoryTag>
                        <CategoryTag disabled count={0}>Campus Shuttle (Coming Soon)</CategoryTag>
                      </Stack>
                    </div>

                    {/* Avatars & Skeletons */}
                    <Grid cols={2} colsTablet={1} gap={6}>
                      <div>
                        <Heading level="heading-sm" style={{ marginBottom: 'var(--space-3)' }}>Avatars with Presence</Heading>
                        <Stack direction="row" align="center" gap={3}>
                          <Avatar name="Rahul Sharma" size="sm" status="online" />
                          <Avatar name="Priya Patel" size="md" status="online" />
                          <Avatar name="Aman Verma" size="lg" status="busy" />
                          <Avatar name="Dr. Swaminathan" size="xl" status="offline" />
                        </Stack>
                      </div>

                      <div>
                        <Heading level="heading-sm" style={{ marginBottom: 'var(--space-3)' }}>Skeleton Shimmer Placeholders</Heading>
                        <Stack direction="column" gap={2}>
                          <Skeleton height={20} width="65%" />
                          <Skeleton height={14} width="100%" />
                          <Skeleton height={14} width="85%" />
                        </Stack>
                      </div>
                    </Grid>

                    {/* Tabs & Breadcrumb Primitives */}
                    <div>
                      <Heading level="heading-sm" style={{ marginBottom: 'var(--space-3)' }}>Navigation Tabs & Breadcrumbs</Heading>
                      <Stack direction="column" gap={4}>
                        <Tabs
                          activeTab={activeTabVal}
                          onChange={setActiveTabVal}
                          tabs={[
                            { id: 'all', label: 'All Listings', count: 24 },
                            { id: 'verified', label: 'Guaranteed Verified', count: 18 },
                            { id: 'discounted', label: 'Student Discounts', count: 6 },
                          ]}
                        />
                        <Breadcrumb
                          items={[
                            { label: 'EaseHub', href: '#' },
                            { label: 'NIT Trichy', href: '#' },
                            { label: 'Hostels & Accommodations' },
                          ]}
                        />
                      </Stack>
                    </div>

                    {/* Spinners & Micro-loaders */}
                    <div>
                      <Heading level="heading-sm" style={{ marginBottom: 'var(--space-3)' }}>Spinners & Links</Heading>
                      <Stack direction="row" align="center" gap={4} wrap>
                        <Stack direction="row" align="center" gap={2}>
                          <Spinner size="sm" />
                          <Text variant="caption" color="muted">Small (16px)</Text>
                        </Stack>
                        <Stack direction="row" align="center" gap={2}>
                          <Spinner size="md" />
                          <Text variant="caption" color="muted">Medium (22px)</Text>
                        </Stack>
                        <Stack direction="row" align="center" gap={2}>
                          <Spinner size="lg" color="var(--color-brand-red)" />
                          <Text variant="caption" color="muted">Large Red (32px)</Text>
                        </Stack>
                        <Divider orientation="vertical" spacing={2} style={{ height: '24px' }} />
                        <Link variant="blue" href="#typography">
                          <span>Explore Typography Tokens</span>
                          <ArrowRight size={13} />
                        </Link>
                      </Stack>
                    </div>

                    {/* Toast & Tooltip Live Trigger */}
                    <div>
                      <Heading level="heading-sm" style={{ marginBottom: 'var(--space-3)' }}>Toast & Tooltip Micro-interactions</Heading>
                      <Stack direction="row" align="center" gap={4} wrap>
                        <Tooltip content="Verified by EaseHub Campus Student Reps" position="top">
                          <Button variant="secondary" size="sm">
                            Hover for Tooltip
                          </Button>
                        </Tooltip>

                        <Button variant="primary" size="sm" onClick={() => setShowToast(!showToast)}>
                          {showToast ? 'Hide Toast' : 'Trigger Notification Toast'}
                        </Button>
                      </Stack>

                      {showToast && (
                        <div style={{ marginTop: 'var(--space-4)' }}>
                          <Toast
                            type="success"
                            title="Subscription Activated"
                            message="Your daily lunch mess pass has been synchronized with the campus kiosk."
                            onClose={() => setShowToast(false)}
                          />
                        </div>
                      )}
                    </div>
                  </Card>
                </section>
              )}

            </div>
          </GridCol>
        </Grid>
      </Container>
    </div>
  );
};
