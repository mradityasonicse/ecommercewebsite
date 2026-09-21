import React, { useState, useMemo } from 'react';
import {
  Sunrise,
  Sun,
  Moon,
  Clock,
  Sparkles,
  ChevronRight,
  Flame,
  CheckCircle2,
  Calendar,
} from 'lucide-react';
import { Container } from '../../primitives/Container';
import { ScrollReveal } from '../../motion/ScrollReveal';
import {
  CAMPUS_MESS_PROVIDERS,
  getCurrentMealStatus,
  getTodayDayName,
} from '../../../data/messMenuData';

export interface DailyMessMenuSectionProps {
  onOpenFullMenu?: () => void;
}

export const DailyMessMenuSection: React.FC<DailyMessMenuSectionProps> = ({
  onOpenFullMenu,
}) => {
  const todayDay = useMemo(() => getTodayDayName(), []);
  const [selectedDay, setSelectedDay] = useState<string>(todayDay);
  const currentMealStatus = useMemo(() => getCurrentMealStatus(), []);

  const provider = CAMPUS_MESS_PROVIDERS[0];
  const dayMenu = useMemo(() => {
    return provider.weeklyMenu.find((d) => d.dayName === selectedDay) || provider.weeklyMenu[0];
  }, [provider, selectedDay]);

  const daysList = [
    { name: 'Monday', short: 'Mon' },
    { name: 'Tuesday', short: 'Tue' },
    { name: 'Wednesday', short: 'Wed' },
    { name: 'Thursday', short: 'Thu' },
    { name: 'Friday', short: 'Fri' },
    { name: 'Saturday', short: 'Sat' },
    { name: 'Sunday', short: 'Sun' },
  ];

  const meals = [
    dayMenu.meals.breakfast,
    dayMenu.meals.lunch,
    dayMenu.meals.dinner,
  ];

  return (
    <section
      id="mess-menu"
      style={{
        padding: '5rem 0',
        backgroundColor: 'var(--color-surface-base)',
        position: 'relative',
        borderTop: '1.5px solid var(--color-border-subtle)',
        borderBottom: '1.5px solid var(--color-border-subtle)',
      }}
    >
      <Container variant="wide">
        {/* Section Header */}
        <ScrollReveal variant="fade-up">
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '1.5rem',
              marginBottom: '2.5rem',
            }}
          >
            <div>
              <div
                className="easehub-ambient-badge"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  backgroundColor: 'rgba(34, 197, 94, 0.12)',
                  border: '1px solid rgba(34, 197, 94, 0.3)',
                  color: '#16A34A',
                  padding: '0.25rem 0.75rem',
                  borderRadius: '9999px',
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  marginBottom: '0.75rem',
                }}
              >
                <Sparkles size={13} />
                <span>TODAY'S STUDENT MESS TIMETABLE</span>
              </div>
              <h2
                style={{
                  fontSize: 'clamp(1.75rem, 3vw, 2.35rem)',
                  fontWeight: 800,
                  color: 'var(--color-text-primary)',
                  letterSpacing: '-0.03em',
                  margin: 0,
                  lineHeight: 1.2,
                }}
              >
                What's Cooking Today? <span style={{ color: '#16A34A' }}>Breakfast, Lunch &amp; Dinner.</span>
              </h2>
              <p style={{ margin: '0.5rem 0 0 0', color: 'var(--color-text-secondary)', fontSize: '0.95rem', maxWidth: '560px' }}>
                Check today's freshly prepared menu from {provider.name}. Unlimited phulkas, zero oily curries, and pause-anytime flexibility.
              </p>
            </div>

            {/* Right Action & Day Switcher */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.75rem' }}>
              <div style={{ display: 'flex', gap: '0.35rem', overflowX: 'auto', maxWidth: '100%' }}>
                {daysList.map((d) => {
                  const isSelected = d.name === selectedDay;
                  const isToday = d.name === todayDay;
                  return (
                    <button
                      key={d.name}
                      type="button"
                      className="easehub-spring-btn"
                      onClick={() => setSelectedDay(d.name)}
                      style={{
                        padding: '0.35rem 0.65rem',
                        borderRadius: '0.5rem',
                        fontSize: '0.75rem',
                        fontWeight: isSelected ? 800 : 600,
                        backgroundColor: isSelected ? '#16A34A' : isToday ? '#FEF08A' : 'var(--color-surface-2)',
                        color: isSelected ? '#FFFFFF' : isToday ? '#854D0E' : 'var(--color-text-secondary)',
                        border: isSelected
                          ? '1px solid #15803D'
                          : isToday
                          ? '1px solid #FACC15'
                          : '1px solid var(--color-border-subtle)',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      <span>{d.short}</span>
                      {isToday && (
                        <span style={{ display: 'block', fontSize: '0.58rem', fontWeight: 800 }}>•</span>
                      )}
                    </button>
                  );
                })}
              </div>

              <button
                type="button"
                className="easehub-spring-btn"
                onClick={() => {
                  if (onOpenFullMenu) onOpenFullMenu();
                  else window.dispatchEvent(new CustomEvent('easehub_open_mess_menu'));
                }}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  backgroundColor: '#16A34A',
                  color: '#FFFFFF',
                  border: 'none',
                  padding: '0.55rem 1.1rem',
                  borderRadius: '0.5rem',
                  fontSize: '0.82rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  boxShadow: '0 4px 14px rgba(22, 163, 74, 0.3)',
                }}
              >
                <Calendar size={15} />
                <span>Open Interactive Mess Board &amp; Pause Meal</span>
                <ChevronRight size={15} />
              </button>
            </div>
          </div>
        </ScrollReveal>

        {/* 3-Column Meal Cards Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))',
            gap: '1.5rem',
          }}
        >
          {meals.map((meal, index) => {
            const isCurrentActive =
              todayDay === selectedDay &&
              currentMealStatus.currentMeal === meal.slotId;

            return (
              <ScrollReveal key={meal.slotId} variant="fade-up" delay={index * 100}>
                <div
                  className="easehub-hover-lift"
                  style={{
                    backgroundColor: 'var(--color-surface-1)',
                    borderRadius: '1.25rem',
                    border: isCurrentActive
                      ? '2px solid #16A34A'
                      : '1px solid var(--color-border-subtle)',
                    boxShadow: isCurrentActive
                      ? '0 12px 30px -5px rgba(22, 163, 74, 0.18)'
                      : 'var(--shadow-sm)',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100%',
                    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                  }}
                >
                {/* Header */}
                <div
                  style={{
                    padding: '1.25rem 1.5rem',
                    borderBottom: '1px solid var(--color-border-subtle)',
                    backgroundColor: isCurrentActive
                      ? 'rgba(34, 197, 94, 0.12)'
                      : 'var(--color-surface-2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div
                      style={{
                        width: '42px',
                        height: '42px',
                        borderRadius: '0.65rem',
                        backgroundColor:
                          meal.slotId === 'breakfast'
                            ? '#FEF08A'
                            : meal.slotId === 'lunch'
                            ? '#DCFCE7'
                            : 'var(--color-surface-1)',
                        color:
                          meal.slotId === 'breakfast'
                            ? '#854D0E'
                            : meal.slotId === 'lunch'
                            ? '#15803D'
                            : 'var(--color-text-secondary)',
                        border: '1px solid var(--color-border-subtle)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {meal.slotId === 'breakfast' ? (
                        <Sunrise size={22} />
                      ) : meal.slotId === 'lunch' ? (
                        <Sun size={22} />
                      ) : (
                        <Moon size={22} />
                      )}
                    </div>
                    <div>
                      <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, color: 'var(--color-text-primary)' }}>
                        {meal.title}
                      </h3>
                      <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>
                        {meal.hindiTitle}
                      </span>
                    </div>
                  </div>

                  {isCurrentActive ? (
                    <span
                      style={{
                        fontSize: '0.72rem',
                        fontWeight: 800,
                        backgroundColor: '#DCFCE7',
                        color: '#15803D',
                        padding: '0.25rem 0.65rem',
                        borderRadius: '9999px',
                        border: '1px solid #86EFAC',
                      }}
                    >
                      ● SERVING NOW
                    </span>
                  ) : (
                    <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <Clock size={13} />
                      <span>{meal.timing.split('-')[0].trim()}</span>
                    </span>
                  )}
                </div>

                {/* Highlight Special Dish Pill */}
                <div
                  style={{
                    padding: '0.75rem 1.5rem',
                    backgroundColor: 'rgba(234, 179, 8, 0.12)',
                    borderBottom: '1px solid rgba(234, 179, 8, 0.25)',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    color: '#EAB308',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.45rem',
                  }}
                >
                  <Sparkles size={15} color="#EAB308" />
                  <span>Highlight: {meal.highlightDish}</span>
                </div>

                {/* Dish Items */}
                <div style={{ padding: '1.25rem 1.5rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                  <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--color-text-secondary)', fontWeight: 800, letterSpacing: '0.05em' }}>
                    Scheduled Dishes
                  </div>

                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
                    {meal.items.map((item, idx) => (
                      <li
                        key={idx}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          fontSize: '0.88rem',
                          color: 'var(--color-text-primary)',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <CheckCircle2 size={15} color="#16A34A" />
                          <span style={{ fontWeight: item.isSpecial ? 700 : 500 }}>{item.name}</span>
                        </div>
                        {item.isSpecial && (
                          <span
                            style={{
                              fontSize: '0.65rem',
                              padding: '0.15rem 0.45rem',
                              borderRadius: '4px',
                              backgroundColor: '#FEF08A',
                              color: '#854D0E',
                              fontWeight: 800,
                            }}
                          >
                            SPECIAL
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>

                  {/* Nutrition & Timings Footer */}
                  <div
                    style={{
                      marginTop: 'auto',
                      paddingTop: '1rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      borderTop: '1px solid var(--color-border-subtle)',
                      fontSize: '0.78rem',
                      color: 'var(--color-text-secondary)',
                      fontWeight: 600,
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#D97706' }}>
                      <Flame size={14} color="#D97706" />
                      <span>~{meal.estimatedCalories} kcal</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <strong style={{ color: '#16A34A' }}>{meal.proteinGrams}g Protein</strong>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--color-text-muted)' }}>
                      <Clock size={13} />
                      <span>{meal.timing}</span>
                    </div>
                  </div>

                  {/* Pause / Refund Button Bar */}
                  <div
                    style={{
                      paddingTop: '0.75rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '0.5rem',
                    }}
                  >
                    <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontStyle: 'italic', maxWidth: '65%' }}>
                      "{meal.chefNote.length > 55 ? meal.chefNote.slice(0, 52) + '...' : meal.chefNote}"
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        if (onOpenFullMenu) onOpenFullMenu();
                        else window.dispatchEvent(new CustomEvent('easehub_open_mess_menu'));
                      }}
                      style={{
                        padding: '0.35rem 0.65rem',
                        borderRadius: '0.4rem',
                        backgroundColor: 'var(--color-surface-2)',
                        border: '1px solid var(--color-border-default)',
                        color: 'var(--color-text-primary)',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      Pause / Rate ➔
                    </button>
                  </div>
                </div>
              </div>
            </ScrollReveal>
            );
          })}
        </div>
      </Container>
    </section>
  );
};
