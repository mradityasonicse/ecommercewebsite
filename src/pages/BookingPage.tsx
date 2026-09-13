import React, { useState, useEffect, useMemo } from 'react';
import { ArrowLeft, ArrowRight, Check, ShieldCheck, AlertCircle } from 'lucide-react';
import type { Campus } from '../data/campuses';
import type { ServiceDetail, ServiceOption } from '../types/serviceDetail';
import type { BookingState, CustomerDetails, ScheduleDetails, ServiceActionConfig } from '../types/booking';
import { ServiceRepository } from '../services/serviceRepository';
import { ServiceRequestRepository } from '../services/serviceRequestRepository';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';
import {
  BookingProgress,
  ServiceSelectionStep,
  DatePicker,
  TimeSlotSelector,
  CustomerDetailsStep,
  BookingReview,
  BookingPriceSummary,
  BookingConfirmation,
  BookingUnavailable,
} from '../components/booking';

interface BookingPageProps {
  slug: string;
  selectedCampus: Campus;
  preselectedOptionId?: string;
  onBackToService?: () => void;
  onNavigateToAccount?: () => void;
  onNavigateToServices?: () => void;
}

export const BookingPage: React.FC<BookingPageProps> = ({
  slug,
  selectedCampus,
  preselectedOptionId,
  onBackToService,
  onNavigateToAccount,
  onNavigateToServices,
}) => {
  const { user } = useAuth();

  const [service, setService] = useState<ServiceDetail | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [loadError, setLoadError] = useState<boolean>(false);

  // Form & validation state
  const [bookingState, setBookingState] = useState<BookingState>({
    step: 1,
    serviceSlug: slug,
    selectedOptionId: preselectedOptionId || '',
    schedule: {
      date: '',
      timeSlot: '',
    },
    customer: {
      name: user?.name || '',
      phone: user?.phone || '',
      email: user?.email || '',
      studentId: user?.studentId || '',
      campusId: selectedCampus.id,
      campusName: selectedCampus.name,
      hostelBlock: '',
      roomNumber: '',
      notes: '',
    },
    notes: '',
    isSubmitting: false,
    submitError: null,
    completedRequest: null,
  });

  const [stepErrors, setStepErrors] = useState<Record<string, string>>({});

  // Fetch service detail on mount or slug change
  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    setLoadError(false);

    ServiceRepository.getServiceDetailBySlug(slug)
      .then((detail) => {
        if (!isMounted) return;
        if (!detail) {
          setLoadError(true);
        } else {
          setService(detail);
          // Set initial option if available
          const defaultOpt = preselectedOptionId
            ? detail.options?.find((o) => o.id === preselectedOptionId)?.id
            : detail.options?.[0]?.id;

          setBookingState((prev) => ({
            ...prev,
            selectedOptionId: defaultOpt || prev.selectedOptionId || '',
            customer: {
              ...prev.customer,
              name: prev.customer.name || user?.name || '',
              email: prev.customer.email || user?.email || '',
              phone: prev.customer.phone || user?.phone || '',
              studentId: prev.customer.studentId || user?.studentId || '',
            },
          }));
        }
        setIsLoading(false);
      })
      .catch(() => {
        if (isMounted) {
          setLoadError(true);
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [slug, preselectedOptionId, user]);

  // Derive active action config
  const actionConfig: ServiceActionConfig = useMemo(() => {
    if (service?.actionConfig) return service.actionConfig;

    const canonical = ServiceRepository.resolveCanonicalSlug(slug);
    if (canonical === 'hostel' || canonical === 'hostel-pg') {
      return {
        actionType: 'inquiry',
        requiresDate: true,
        requiresTime: false,
        requiresHostelRoom: false,
        submitButtonText: 'Submit Room Inquiry',
        successTitle: 'Hostel Inquiry Submitted',
        successMessage: 'The warden and residence manager have received your inquiry. Expect verification within 24 hours.',
      };
    }
    if (canonical === 'mess' || canonical === 'fitness' || canonical === 'wifi') {
      return {
        actionType: 'booking',
        requiresDate: true,
        requiresTime: false,
        requiresHostelRoom: canonical !== 'fitness',
        submitButtonText: 'Confirm Subscription Request',
        successTitle: 'Subscription Requested',
      };
    }
    // Default scheduled booking (laundry, repair, transport, cleaning)
    return {
      actionType: 'booking',
      requiresDate: true,
      requiresTime: true,
      requiresHostelRoom: true,
      submitButtonText: 'Confirm Booking Request',
      successTitle: 'Booking Request Confirmed',
    };
  }, [service, slug]);

  const selectedOption: ServiceOption | undefined = useMemo(() => {
    return service?.options?.find((opt) => opt.id === bookingState.selectedOptionId) || service?.options?.[0];
  }, [service, bookingState.selectedOptionId]);

  // Validation logic per step
  const validateStep = (currentStep: number): boolean => {
    const errors: Record<string, string> = {};

    if (currentStep === 1) {
      if (service?.options && service.options.length > 0 && !bookingState.selectedOptionId) {
        errors.option = 'Please choose a service package or plan to continue.';
      }
    } else if (currentStep === 2) {
      if (actionConfig.requiresDate && !bookingState.schedule.date) {
        errors.date = 'Please select a date for your service.';
      }
      if (actionConfig.requiresTime && !bookingState.schedule.timeSlot) {
        errors.timeSlot = 'Please select an available time window.';
      }
    } else if (currentStep === 3) {
      if (!bookingState.customer.name.trim()) {
        errors.name = 'Full name is required.';
      }
      if (!bookingState.customer.phone.trim()) {
        errors.phone = 'Mobile number is required for campus delivery updates.';
      } else if (!/^[0-9+ -]{10,15}$/.test(bookingState.customer.phone.trim())) {
        errors.phone = 'Please enter a valid phone number.';
      }
      if (!bookingState.customer.email.trim()) {
        errors.email = 'Email address is required.';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(bookingState.customer.email.trim())) {
        errors.email = 'Please enter a valid email address.';
      }
      if (actionConfig.requiresHostelRoom && !bookingState.customer.roomNumber?.trim()) {
        errors.roomNumber = 'Room number or address is required for on-campus service.';
      }
    }

    setStepErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNextStep = () => {
    if (!validateStep(bookingState.step)) return;

    let nextStep = bookingState.step + 1;
    // Skip schedule step if date is not required
    if (nextStep === 2 && !actionConfig.requiresDate) {
      nextStep = 3;
    }

    setBookingState((prev) => ({ ...prev, step: nextStep }));
    window.scrollTo({ top: 120, behavior: 'smooth' });
  };

  const handlePrevStep = () => {
    let prevStep = bookingState.step - 1;
    // Skip schedule step back if not required
    if (prevStep === 2 && !actionConfig.requiresDate) {
      prevStep = 1;
    }

    setBookingState((prev) => ({ ...prev, step: Math.max(1, prevStep) }));
    window.scrollTo({ top: 120, behavior: 'smooth' });
  };

  const handleOptionSelect = (optionId: string) => {
    setBookingState((prev) => ({ ...prev, selectedOptionId: optionId }));
    setStepErrors((prev) => ({ ...prev, option: '' }));
  };

  const handleScheduleChange = (schedule: Partial<ScheduleDetails>) => {
    setBookingState((prev) => ({
      ...prev,
      schedule: { ...prev.schedule, ...schedule },
    }));
    setStepErrors((prev) => ({ ...prev, date: '', timeSlot: '' }));
  };

  const handleCustomerChange = (customer: Partial<CustomerDetails>) => {
    setBookingState((prev) => ({
      ...prev,
      customer: { ...prev.customer, ...customer },
    }));
    // Clear errors for edited fields
    const updatedKeys = Object.keys(customer);
    setStepErrors((prev) => {
      const next = { ...prev };
      updatedKeys.forEach((k) => delete next[k]);
      return next;
    });
  };

  const handleSubmitRequest = async () => {
    if (!service) return;

    setBookingState((prev) => ({ ...prev, isSubmitting: true, submitError: null }));

    try {
      const created = await ServiceRequestRepository.createRequest({
        serviceSlug: service.slug,
        serviceName: service.name,
        actionType: actionConfig.actionType,
        optionId: selectedOption?.id,
        optionName: selectedOption?.name,
        customer: bookingState.customer,
        schedule: bookingState.schedule,
        notes: bookingState.customer.notes || bookingState.notes,
        estimatedPrice: selectedOption ? `${selectedOption.price.currency}${selectedOption.price.amount} ${selectedOption.price.period || ''}` : undefined,
      });

      setBookingState((prev) => ({
        ...prev,
        isSubmitting: false,
        completedRequest: created,
        step: 5, // Confirmation step
      }));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'An error occurred while transmitting your request.';
      setBookingState((prev) => ({
        ...prev,
        isSubmitting: false,
        submitError: msg,
      }));
    }
  };

  // State: Loading skeleton / Fallback
  if (isLoading) {
    return (
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: 'var(--space-12) var(--space-6)' }}>
        <div style={{ height: '32px', width: '200px', backgroundColor: 'var(--color-surface-2)', borderRadius: '8px', marginBottom: '2rem' }} />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '2rem' }}>
          <div style={{ height: '400px', backgroundColor: 'var(--color-surface-1)', borderRadius: '16px' }} />
          <div style={{ height: '300px', backgroundColor: 'var(--color-surface-2)', borderRadius: '16px' }} />
        </div>
      </div>
    );
  }

  // State: Not found / load error
  if (loadError || !service) {
    return (
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: 'var(--space-12) var(--space-6)' }}>
        <BookingUnavailable
          serviceName={service?.name || slug}
          onBackToServices={onNavigateToServices || onBackToService}
        />
      </div>
    );
  }

  // State: Step 5 Confirmation
  if (bookingState.step === 5 && bookingState.completedRequest) {
    return (
      <BookingConfirmation
        request={bookingState.completedRequest}
        onViewAccountRequests={onNavigateToAccount}
        onBackToServices={onNavigateToServices}
      />
    );
  }

  return (
    <div
      style={{
        maxWidth: '1240px',
        margin: '0 auto',
        padding: 'calc(var(--navbar-height, 72px) + 2rem) var(--space-6) var(--space-24)',
      }}
    >
      {/* Top Bar: Back to service & verified badge */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 'var(--space-6)',
          flexWrap: 'wrap',
          gap: 'var(--space-3)',
        }}
      >
        <button
          type="button"
          onClick={onBackToService}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--color-text-secondary)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            fontSize: '0.85rem',
            fontWeight: 600,
            cursor: 'pointer',
            padding: 0,
            transition: 'color 0.15s ease',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-brand-blue)')}
          onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--color-text-secondary)')}
        >
          <ArrowLeft size={16} /> Back to {service.name} Details
        </button>

        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            fontSize: '0.72rem',
            fontFamily: 'var(--font-mono)',
            fontWeight: 700,
            color: 'var(--color-brand-blue)',
            backgroundColor: 'var(--color-surface-2)',
            border: '1px solid var(--color-border-subtle)',
            padding: '0.25rem 0.75rem',
            borderRadius: 'var(--radius-pill)',
          }}
        >
          <ShieldCheck size={13} color="var(--color-brand-blue)" /> {selectedCampus.shortName} Geofenced Flow
        </div>
      </div>

      {/* Booking Step Progress Indicator */}
      <div style={{ marginBottom: 'var(--space-8)' }}>
        <BookingProgress
          steps={[
            { number: 1, id: 'option', label: 'Choose Plan' },
            { number: 2, id: 'schedule', label: 'Schedule' },
            { number: 3, id: 'details', label: 'Room & Details' },
            { number: 4, id: 'review', label: 'Review' },
          ]}
          currentStepNumber={bookingState.step}
          onStepClick={(stepNum) => {
            if (stepNum < bookingState.step) {
              setBookingState((prev) => ({ ...prev, step: stepNum }));
            }
          }}
        />
      </div>

      {/* Main Two-Column Layout */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1fr) minmax(300px, 380px)',
          gap: 'var(--space-8)',
          alignItems: 'start',
        }}
      >
        {/* Left Column: Active Step Content */}
        <div
          style={{
            backgroundColor: 'var(--color-surface-1)',
            border: '1px solid var(--color-border-subtle)',
            borderRadius: 'var(--radius-2xl)',
            boxShadow: 'var(--shadow-sm)',
            padding: 'clamp(var(--space-5), 3vw, var(--space-8))',
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--space-6)',
          }}
        >
          {/* Step 1: Package Selection */}
          {bookingState.step === 1 && (
            <div>
              <ServiceSelectionStep
                service={service}
                selectedOptionId={bookingState.selectedOptionId}
                onOptionSelect={handleOptionSelect}
              />
              {stepErrors.option && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--color-brand-red)', fontSize: '0.8rem', marginTop: '0.5rem' }}>
                  <AlertCircle size={14} /> {stepErrors.option}
                </div>
              )}
            </div>
          )}

          {/* Step 2: Schedule & Time Window */}
          {bookingState.step === 2 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
              <div>
                <h2
                  style={{
                    fontSize: 'clamp(1.25rem, 2.5vw, 1.6rem)',
                    fontFamily: 'var(--font-display)',
                    fontWeight: 700,
                    color: 'var(--color-text-primary)',
                    margin: '0 0 var(--space-2) 0',
                  }}
                >
                  Select Date & Time Window
                </h2>
                <p style={{ fontSize: '0.88rem', color: 'var(--color-text-secondary)', margin: 0 }}>
                  Select your preferred hostel pickup or delivery slot. Operators sync with campus gate timings.
                </p>
              </div>

              {actionConfig.requiresDate && (
                <div>
                  <DatePicker
                    selectedDate={bookingState.schedule.date}
                    onDateChange={(date: string) => handleScheduleChange({ date })}
                  />
                  {stepErrors.date && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--color-brand-red)', fontSize: '0.8rem', marginTop: '0.5rem' }}>
                      <AlertCircle size={14} /> {stepErrors.date}
                    </div>
                  )}
                </div>
              )}

              {actionConfig.requiresTime && (
                <div>
                  <TimeSlotSelector
                    selectedSlot={bookingState.schedule.timeSlot}
                    onSlotChange={(slot: string) => handleScheduleChange({ timeSlot: slot })}
                  />
                  {stepErrors.timeSlot && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--color-brand-red)', fontSize: '0.8rem', marginTop: '0.5rem' }}>
                      <AlertCircle size={14} /> {stepErrors.timeSlot}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Step 3: Customer Details & Hostel Room */}
          {bookingState.step === 3 && (
            <CustomerDetailsStep
              customer={bookingState.customer}
              onChange={handleCustomerChange}
              errors={stepErrors}
              actionConfig={actionConfig}
              activeCampus={selectedCampus}
            />
          )}

          {/* Step 4: Final Review */}
          {bookingState.step === 4 && (
            <div>
              <BookingReview
                state={bookingState}
                service={service}
                selectedOption={selectedOption}
                onEditStep={(step) => setBookingState((prev) => ({ ...prev, step }))}
              />

              {bookingState.submitError && (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    backgroundColor: 'rgba(211, 69, 46, 0.08)',
                    border: '1px solid rgba(211, 69, 46, 0.25)',
                    color: 'var(--color-brand-red)',
                    padding: '0.75rem 1rem',
                    borderRadius: 'var(--radius-md)',
                    marginTop: 'var(--space-4)',
                    fontSize: '0.85rem',
                  }}
                >
                  <AlertCircle size={16} /> {bookingState.submitError}
                </div>
              )}
            </div>
          )}

          {/* Step Action Buttons */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingTop: 'var(--space-6)',
              borderTop: '1px solid var(--color-border-subtle)',
              marginTop: 'var(--space-2)',
            }}
          >
            {bookingState.step > 1 ? (
              <Button
                variant="ghost"
                size="md"
                onClick={handlePrevStep}
                disabled={bookingState.isSubmitting}
              >
                Back
              </Button>
            ) : (
              <div />
            )}

            {bookingState.step < 4 ? (
              <Button
                variant="primary"
                size="md"
                icon={<ArrowRight size={16} />}
                iconPosition="right"
                onClick={handleNextStep}
              >
                Continue
              </Button>
            ) : (
              <Button
                variant="accent"
                size="lg"
                icon={<Check size={18} />}
                iconPosition="right"
                loading={bookingState.isSubmitting}
                onClick={handleSubmitRequest}
              >
                {actionConfig.submitButtonText || 'Confirm & Submit'}
              </Button>
            )}
          </div>
        </div>

        {/* Right Column: Sticky Price & Inclusions Card */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <BookingPriceSummary
            service={service}
            selectedOption={selectedOption}
          />
        </div>
      </div>
    </div>
  );
};
