import React, { useState, useMemo } from 'react';
import {
  X,
  Sunrise,
  Sun,
  Moon,
  Clock,
  ShieldCheck,
  Sparkles,
  Share2,
  CheckCircle2,
  PauseCircle,
  ThumbsUp,
  UtensilsCrossed,
  Flame,
  Award,
} from 'lucide-react';
import {
  CAMPUS_MESS_PROVIDERS,
  getCurrentMealStatus,
  getTodayDayName,
  type MealSlot,
  type MessProviderMenu,
} from '../../data/messMenuData';

export interface DailyMessMenuModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultProviderId?: string;
}

export const DailyMessMenuModal: React.FC<DailyMessMenuModalProps> = ({
  isOpen,
  onClose,
  defaultProviderId = 'mess_annapurna',
}) => {
  const todayDay = useMemo(() => getTodayDayName(), []);
  const [selectedDay, setSelectedDay] = useState<string>(todayDay);
  const [selectedProviderId, setSelectedProviderId] = useState<string>(defaultProviderId);
  const [filterMealSlot, setFilterMealSlot] = useState<'all' | 'breakfast' | 'lunch' | 'dinner'>('all');
  
  // Interactive features state
  const [pausedMeals, setPausedMeals] = useState<Record<string, boolean>>({});
  const [ratedMeals, setRatedMeals] = useState<Record<string, number>>({});
  const [feedbackToast, setFeedbackToast] = useState<string | null>(null);

  const provider: MessProviderMenu = useMemo(() => {
    return (
      CAMPUS_MESS_PROVIDERS.find((p) => p.id === selectedProviderId) ||
      CAMPUS_MESS_PROVIDERS[0]
    );
  }, [selectedProviderId]);

  const currentMealStatus = useMemo(() => getCurrentMealStatus(), []);

  // Find menu for selected day
  const dayMenu = useMemo(() => {
    const weekly = provider.weeklyMenu.length > 0
      ? provider.weeklyMenu
      : CAMPUS_MESS_PROVIDERS[0].weeklyMenu; // fallback if provider uses standard menu
    return weekly.find((d) => d.dayName === selectedDay) || weekly[0];
  }, [provider, selectedDay]);

  if (!isOpen) return null;

  const handleTogglePauseMeal = (slotId: string, mealTitle: string) => {
    const key = `${selectedDay}_${slotId}`;
    const willPause = !pausedMeals[key];
    setPausedMeals((prev) => ({ ...prev, [key]: willPause }));
    
    if (willPause) {
      setFeedbackToast(`✅ ${mealTitle} for ${selectedDay} paused! ₹80 refunded to your EaseHub Wallet.`);
    } else {
      setFeedbackToast(`🔄 Resumed ${mealTitle} for ${selectedDay}! Kitchen informed.`);
    }
    setTimeout(() => setFeedbackToast(null), 4000);
  };

  const handleRateMeal = (slotId: string, rating: number) => {
    const key = `${selectedDay}_${slotId}`;
    setRatedMeals((prev) => ({ ...prev, [key]: rating }));
    setFeedbackToast(`⭐ Thanks for rating ${rating}/5! Head Chef has received your feedback.`);
    setTimeout(() => setFeedbackToast(null), 3500);
  };

  const handleShareOnWhatsApp = () => {
    const menuSummary = `🍽️ *EaseHub Daily Mess Menu (${selectedDay})*
🏢 *${provider.name}* (${provider.campusArea})

☀️ *BREAKFAST (${dayMenu.meals.breakfast.timing}):*
${dayMenu.meals.breakfast.items.map((i) => `• ${i.name}`).join('\n')}

🍲 *LUNCH (${dayMenu.meals.lunch.timing}):*
${dayMenu.meals.lunch.items.map((i) => `• ${i.name}`).join('\n')}

🌙 *DINNER (${dayMenu.meals.dinner.timing}):*
${dayMenu.meals.dinner.items.map((i) => `• ${i.name}`).join('\n')}

✨ *Verified FSSAI Grade A+ Mess* • View full menu & pause meals on EaseHub!`;

    const url = `https://wa.me/?text=${encodeURIComponent(menuSummary)}`;
    window.open(url, '_blank');
  };

  const daysList: { name: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday'; short: string }[] = [
    { name: 'Monday', short: 'Mon' },
    { name: 'Tuesday', short: 'Tue' },
    { name: 'Wednesday', short: 'Wed' },
    { name: 'Thursday', short: 'Thu' },
    { name: 'Friday', short: 'Fri' },
    { name: 'Saturday', short: 'Sat' },
    { name: 'Sunday', short: 'Sun' },
  ];

  const mealsToDisplay: MealSlot[] = [];
  if (filterMealSlot === 'all' || filterMealSlot === 'breakfast') {
    mealsToDisplay.push(dayMenu.meals.breakfast);
  }
  if (filterMealSlot === 'all' || filterMealSlot === 'lunch') {
    mealsToDisplay.push(dayMenu.meals.lunch);
  }
  if (filterMealSlot === 'all' || filterMealSlot === 'dinner') {
    mealsToDisplay.push(dayMenu.meals.dinner);
  }

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99990,
        backgroundColor: 'rgba(15, 23, 42, 0.45)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'clamp(0.5rem, 2vw, 1rem)',
        animation: 'fadeIn 0.2s ease-out',
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '980px',
          maxHeight: 'min(94vh, calc(100dvh - 1.5rem))',
          backgroundColor: 'var(--color-surface-1)',
          border: '1.5px solid var(--color-border-subtle)',
          borderRadius: '1.25rem',
          boxShadow: 'var(--shadow-2xl)',
          color: 'var(--color-text-primary)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div
          style={{
            padding: '1rem clamp(0.75rem, 2.5vw, 1.5rem)',
            borderBottom: '1px solid var(--color-border-subtle)',
            backgroundColor: 'var(--color-surface-2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '0.75rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <div
              style={{
                width: '46px',
                height: '46px',
                borderRadius: '0.75rem',
                backgroundColor: 'rgba(34, 197, 94, 0.15)',
                border: '1.5px solid rgba(34, 197, 94, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#16A34A',
              }}
            >
              <UtensilsCrossed size={24} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                <h2 style={{ margin: 0, fontSize: '1.35rem', fontWeight: 800, color: 'var(--color-text-primary)', letterSpacing: '-0.02em' }}>
                  Live Campus Mess Menu Board
                </h2>
                <span
                  style={{
                    backgroundColor: 'rgba(234, 179, 8, 0.18)',
                    color: '#CA8A04',
                    border: '1px solid rgba(234, 179, 8, 0.35)',
                    fontSize: '0.72rem',
                    fontWeight: 800,
                    padding: '0.15rem 0.55rem',
                    borderRadius: '9999px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.3rem',
                  }}
                >
                  <Sparkles size={12} />
                  <span>दैनिक मेस मेनू</span>
                </span>
              </div>
              <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.78rem', color: 'var(--color-text-secondary)' }}>
                Real-time 3-meal timetable for subscribed students • Unlimited fresh phulkas &amp; daily hygiene logs
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <button
              type="button"
              onClick={handleShareOnWhatsApp}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                backgroundColor: 'rgba(34, 197, 94, 0.15)',
                border: '1px solid rgba(34, 197, 94, 0.3)',
                color: '#16A34A',
                padding: '0.45rem 0.85rem',
                borderRadius: '0.5rem',
                fontSize: '0.78rem',
                fontWeight: 700,
                cursor: 'pointer',
              }}
              title="Share today's menu on WhatsApp"
            >
              <Share2 size={14} />
              <span>Share with Roommates</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close modal"
              style={{
                background: 'var(--color-surface-3, rgba(255, 255, 255, 0.08))',
                border: '1px solid var(--color-border-subtle)',
                color: 'var(--color-text-primary)',
                cursor: 'pointer',
                padding: '0.45rem',
                borderRadius: '0.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Live Serving Banner */}
        <div
          style={{
            backgroundColor: 'rgba(22, 163, 74, 0.1)',
            padding: '0.6rem 1.75rem',
            borderBottom: '1px solid var(--color-border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '0.75rem',
            fontSize: '0.78rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <span
              style={{
                display: 'inline-flex',
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: '#16A34A',
                boxShadow: '0 0 0 3px rgba(22, 163, 74, 0.25)',
              }}
            />
            <strong style={{ color: 'var(--color-text-primary)' }}>Kitchen Status:</strong>
            <span style={{ color: '#16A34A', fontWeight: 700 }}>{currentMealStatus.label}</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: 'var(--color-text-secondary)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <ShieldCheck size={14} color="#16A34A" />
              <span>{provider.fssaiNumber}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Award size={14} color="#CA8A04" />
              <span>{provider.hygieneScore}</span>
            </div>
          </div>
        </div>

        {/* Provider Selector & Day Selector Bar */}
        <div
          style={{
            padding: '0.75rem clamp(0.75rem, 2.5vw, 1.5rem)',
            backgroundColor: 'var(--color-surface-1)',
            borderBottom: '1px solid var(--color-border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '0.75rem',
          }}
        >
          {/* Provider Select Dropdown */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>
              Your Subscribed Mess:
            </span>
            <select
              value={selectedProviderId}
              onChange={(e) => setSelectedProviderId(e.target.value)}
              style={{
                padding: '0.4rem 0.8rem',
                borderRadius: '0.5rem',
                border: '1.5px solid #16A34A',
                backgroundColor: 'var(--color-surface-2)',
                color: 'var(--color-text-primary)',
                fontWeight: 700,
                fontSize: '0.84rem',
                outline: 'none',
                cursor: 'pointer',
              }}
            >
              {CAMPUS_MESS_PROVIDERS.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.dietaryType}) • ₹{p.monthlyPlanPrice}/mo
                </option>
              ))}
            </select>
          </div>

          {/* Days of Week Tabs */}
          <div style={{ display: 'flex', gap: '0.3rem', overflowX: 'auto', paddingBottom: '2px' }}>
            {daysList.map((d) => {
              const isToday = d.name === todayDay;
              const isSelected = d.name === selectedDay;
              return (
                <button
                  key={d.name}
                  type="button"
                  onClick={() => setSelectedDay(d.name)}
                  style={{
                    padding: '0.4rem 0.75rem',
                    borderRadius: '0.5rem',
                    fontSize: '0.78rem',
                    fontWeight: isSelected ? 800 : 600,
                    backgroundColor: isSelected ? '#16A34A' : isToday ? 'rgba(234, 179, 8, 0.2)' : 'var(--color-surface-2)',
                    color: isSelected ? '#FFFFFF' : isToday ? '#CA8A04' : 'var(--color-text-secondary)',
                    border: isSelected
                      ? '1px solid #15803D'
                      : isToday
                      ? '1px solid rgba(234, 179, 8, 0.4)'
                      : '1px solid var(--color-border-subtle)',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    minWidth: '54px',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <span>{d.short}</span>
                  {isToday && (
                    <span style={{ fontSize: '0.6rem', fontWeight: 800, textTransform: 'uppercase' }}>
                      Today
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Meal Filter Tabs (All / Breakfast / Lunch / Dinner) */}
        <div
          style={{
            padding: '0.5rem 1.75rem',
            backgroundColor: 'var(--color-surface-1)',
            borderBottom: '1px solid var(--color-border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '0.5rem',
          }}
        >
          <div style={{ display: 'flex', gap: '0.4rem' }}>
            {(
              [
                { id: 'all', label: 'All 3 Meals' },
                { id: 'breakfast', label: '☀️ Breakfast (Nashta)' },
                { id: 'lunch', label: '🍲 Lunch (Bhojan)' },
                { id: 'dinner', label: '🌙 Dinner (Raat)' },
              ] as const
            ).map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setFilterMealSlot(t.id)}
                style={{
                  padding: '0.35rem 0.75rem',
                  borderRadius: '9999px',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  backgroundColor: filterMealSlot === t.id ? '#16A34A' : 'var(--color-surface-2)',
                  color: filterMealSlot === t.id ? '#FFFFFF' : 'var(--color-text-secondary)',
                  border: filterMealSlot === t.id ? '1px solid #16A34A' : '1px solid var(--color-border-subtle)',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
            Showing menu for <strong style={{ color: 'var(--color-text-primary)' }}>{selectedDay}</strong> at{' '}
            <strong style={{ color: '#16A34A' }}>{provider.name}</strong>
          </div>
        </div>

        {/* Feedback Toast Notification */}
        {feedbackToast && (
          <div
            style={{
              padding: '0.65rem 1.5rem',
              backgroundColor: 'rgba(34, 197, 94, 0.15)',
              borderBottom: '1.5px solid rgba(34, 197, 94, 0.3)',
              color: '#16A34A',
              fontSize: '0.82rem',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              animation: 'fadeIn 0.2s ease',
            }}
          >
            <span>{feedbackToast}</span>
            <button
              onClick={() => setFeedbackToast(null)}
              style={{ background: 'none', border: 'none', color: '#16A34A', cursor: 'pointer' }}
            >
              ✕
            </button>
          </div>
        )}

        {/* Scrollable Body Containing the 3 Meal Cards */}
        <div
          style={{
            padding: '1rem clamp(0.75rem, 2.5vw, 1.5rem)',
            overflowY: 'auto',
            flex: 1,
            backgroundColor: 'var(--color-surface-base)',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.25rem',
          }}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: mealsToDisplay.length === 3 ? 'repeat(auto-fit, minmax(min(100%, 270px), 1fr))' : '1fr',
              gap: '1.25rem',
              alignItems: 'start',
            }}
          >
            {mealsToDisplay.map((meal) => {
              const isPaused = pausedMeals[`${selectedDay}_${meal.slotId}`];
              const studentRating = ratedMeals[`${selectedDay}_${meal.slotId}`] || 0;
              const isCurrentActive =
                todayDay === selectedDay &&
                currentMealStatus.currentMeal === meal.slotId;

              return (
                <div
                  key={meal.slotId}
                  style={{
                    backgroundColor: 'var(--color-surface-1)',
                    borderRadius: '1rem',
                    border: isCurrentActive
                      ? '2px solid #16A34A'
                      : isPaused
                      ? '1.5px dashed var(--color-border-subtle)'
                      : '1.5px solid var(--color-border-subtle)',
                    boxShadow: isCurrentActive
                      ? '0 10px 25px -5px rgba(22, 163, 74, 0.25)'
                      : 'var(--shadow-sm)',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'transform 0.15s ease, box-shadow 0.15s ease',
                    opacity: isPaused ? 0.65 : 1,
                  }}
                >
                  {/* Card Header */}
                  <div
                    style={{
                      padding: '1rem 1.25rem',
                      borderBottom: '1px solid var(--color-border-subtle)',
                      backgroundColor: isCurrentActive
                        ? 'rgba(22, 163, 74, 0.1)'
                        : 'var(--color-surface-2)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                      <div
                        style={{
                          width: '36px',
                          height: '36px',
                          borderRadius: '0.5rem',
                          backgroundColor:
                            meal.slotId === 'breakfast'
                              ? 'rgba(234, 179, 8, 0.2)'
                              : meal.slotId === 'lunch'
                              ? 'rgba(34, 197, 94, 0.2)'
                              : 'var(--color-surface-3, rgba(255, 255, 255, 0.08))',
                          color:
                            meal.slotId === 'breakfast'
                              ? '#CA8A04'
                              : meal.slotId === 'lunch'
                              ? '#16A34A'
                              : 'var(--color-text-secondary)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        {meal.slotId === 'breakfast' ? (
                          <Sunrise size={20} />
                        ) : meal.slotId === 'lunch' ? (
                          <Sun size={20} />
                        ) : (
                          <Moon size={20} />
                        )}
                      </div>
                      <div>
                        <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 800, color: 'var(--color-text-primary)' }}>
                          {meal.title}
                        </h3>
                        <span style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>
                          {meal.hindiTitle}
                        </span>
                      </div>
                    </div>

                    {isCurrentActive ? (
                      <span
                        style={{
                          fontSize: '0.68rem',
                          fontWeight: 800,
                          backgroundColor: 'rgba(34, 197, 94, 0.15)',
                          color: '#16A34A',
                          padding: '0.2rem 0.55rem',
                          borderRadius: '9999px',
                          border: '1px solid rgba(34, 197, 94, 0.3)',
                        }}
                      >
                        ● SERVING NOW
                      </span>
                    ) : isPaused ? (
                      <span
                        style={{
                          fontSize: '0.68rem',
                          fontWeight: 800,
                          backgroundColor: 'var(--color-surface-2)',
                          color: 'var(--color-text-muted)',
                          padding: '0.2rem 0.55rem',
                          borderRadius: '9999px',
                        }}
                      >
                        PAUSED
                      </span>
                    ) : (
                      <span style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <Clock size={12} />
                        <span>{meal.timing.split('-')[0].trim()}</span>
                      </span>
                    )}
                  </div>

                  {/* Highlights Pill */}
                  <div
                    style={{
                      padding: '0.6rem 1.25rem',
                      backgroundColor: 'rgba(234, 179, 8, 0.12)',
                      borderBottom: '1px solid rgba(234, 179, 8, 0.25)',
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      color: '#CA8A04',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                    }}
                  >
                    <Sparkles size={14} color="#EAB308" />
                    <span>Special: {meal.highlightDish}</span>
                  </div>

                  {/* Dish List */}
                  <div style={{ padding: '1rem 1.25rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                    <div style={{ fontSize: '0.74rem', textTransform: 'uppercase', color: 'var(--color-text-muted)', fontWeight: 800, letterSpacing: '0.05em' }}>
                      Items on Menu
                    </div>

                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      {meal.items.map((item, idx) => (
                        <li
                          key={idx}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            fontSize: '0.84rem',
                            color: 'var(--color-text-primary)',
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                            <span style={{ color: '#16A34A', fontSize: '0.7rem' }}>✔</span>
                            <span style={{ fontWeight: item.isSpecial ? 700 : 500 }}>{item.name}</span>
                          </div>
                          {item.isSpecial && (
                            <span
                              style={{
                                fontSize: '0.65rem',
                                padding: '0.1rem 0.4rem',
                                borderRadius: '4px',
                                backgroundColor: 'rgba(234, 179, 8, 0.2)',
                                color: '#CA8A04',
                                fontWeight: 800,
                              }}
                            >
                              CHEF PICK
                            </span>
                          )}
                        </li>
                      ))}
                    </ul>

                    {/* Nutrition Breakdown & Timing Pill */}
                    <div
                      style={{
                        marginTop: '0.85rem',
                        padding: '0.6rem 0.8rem',
                        borderRadius: '0.5rem',
                        backgroundColor: 'var(--color-surface-2)',
                        border: '1px solid var(--color-border-subtle)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        fontSize: '0.72rem',
                        color: 'var(--color-text-secondary)',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                        <Flame size={13} color="#EAB308" />
                        <span>~{meal.estimatedCalories} kcal</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                        <strong style={{ color: '#16A34A' }}>{meal.proteinGrams}g Protein</strong>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', color: 'var(--color-text-muted)' }}>
                        <Clock size={12} />
                        <span>{meal.timing}</span>
                      </div>
                    </div>

                    {/* Chef Note */}
                    <div
                      style={{
                        fontSize: '0.74rem',
                        color: 'var(--color-text-muted)',
                        fontStyle: 'italic',
                        lineHeight: 1.4,
                        paddingTop: '0.25rem',
                      }}
                    >
                      "{meal.chefNote}"
                    </div>
                  </div>

                  {/* Student Actions: Pause Meal & Rate Today */}
                  <div
                    style={{
                      padding: '0.85rem 1.25rem',
                      borderTop: '1px solid var(--color-border-subtle)',
                      backgroundColor: 'var(--color-surface-2)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: '0.5rem',
                    }}
                  >
                    {/* Pause Toggle Button */}
                    <button
                      type="button"
                      onClick={() => handleTogglePauseMeal(meal.slotId, meal.title)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                        padding: '0.4rem 0.7rem',
                        borderRadius: '0.4rem',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        backgroundColor: isPaused ? '#16A34A' : 'var(--color-surface-1)',
                        color: isPaused ? '#FFFFFF' : 'var(--color-text-secondary)',
                        border: isPaused ? '1px solid #15803D' : '1px solid var(--color-border-subtle)',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      {isPaused ? (
                        <>
                          <CheckCircle2 size={13} />
                          <span>Resume Meal</span>
                        </>
                      ) : (
                        <>
                          <PauseCircle size={13} color="#EAB308" />
                          <span>Pause (Refund ₹80)</span>
                        </>
                      )}
                    </button>

                    {/* 5-Star Feedback Widget */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <span style={{ fontSize: '0.68rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>Rate:</span>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => handleRateMeal(meal.slotId, star)}
                          style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            fontSize: '0.85rem',
                            padding: '0 1px',
                            color: studentRating >= star ? '#EAB308' : 'var(--color-border-subtle)',
                            transition: 'transform 0.1s ease',
                          }}
                          title={`Rate ${star} Stars`}
                        >
                          ★
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Student Help & Mess Rules Info Card */}
          <div
            style={{
              backgroundColor: 'var(--color-surface-1)',
              borderRadius: '0.85rem',
              border: '1.5px solid var(--color-border-subtle)',
              padding: '1rem 1.25rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '1rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(34, 197, 94, 0.15)',
                  color: '#16A34A',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <ThumbsUp size={18} />
              </div>
              <div>
                <strong style={{ fontSize: '0.88rem', color: 'var(--color-text-primary)', display: 'block' }}>
                  Student Pause Guarantee
                </strong>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>
                  Pause before 6:00 AM for Breakfast, 11:00 AM for Lunch, and 6:00 PM for Dinner to get 100% wallet credit.
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <button
                type="button"
                onClick={onClose}
                style={{
                  backgroundColor: '#16A34A',
                  color: '#FFFFFF',
                  border: 'none',
                  padding: '0.5rem 1.2rem',
                  borderRadius: '0.5rem',
                  fontSize: '0.82rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  boxShadow: '0 2px 8px rgba(22, 163, 74, 0.3)',
                }}
              >
                Done / Close ✕
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
