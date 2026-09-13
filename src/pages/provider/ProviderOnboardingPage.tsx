import React, { useState, useEffect } from 'react';
import { OnboardingProgress } from '../../components/provider/onboarding/OnboardingProgress';
import { Step1Welcome } from '../../components/provider/onboarding/Step1Welcome';
import { Step2ProviderType } from '../../components/provider/onboarding/Step2ProviderType';
import { Step3BusinessInfo } from '../../components/provider/onboarding/Step3BusinessInfo';
import { Step4ContactInfo } from '../../components/provider/onboarding/Step4ContactInfo';
import { Step5Services } from '../../components/provider/onboarding/Step5Services';
import { Step6Location } from '../../components/provider/onboarding/Step6Location';
import { Step7Availability } from '../../components/provider/onboarding/Step7Availability';
import { Step8Review } from '../../components/provider/onboarding/Step8Review';
import { ProviderStatusView } from '../../components/provider/ProviderStatusView';
import type {
  ProviderApplication,
  ProviderBusinessInfo,
  ProviderContactInfo,
  ProviderServiceItem,
  ProviderLocationInfo,
  ProviderWeeklyAvailability,
  ProviderCategory,
} from '../../types/provider';
import { ProviderService, DEFAULT_WEEKLY_SCHEDULE } from '../../services/providerService';
import { useAuth } from '../../context/AuthContext';

interface ProviderOnboardingPageProps {
  initialCategory?: ProviderCategory;
  onNavigateToStatus?: () => void;
  onNavigateToLanding?: () => void;
  onNavigateToAuth?: () => void;
}

export const ProviderOnboardingPage: React.FC<ProviderOnboardingPageProps> = ({
  initialCategory = 'food',
  onNavigateToStatus,
  onNavigateToLanding,
  onNavigateToAuth,
}) => {
  const { user, isAuthenticated } = useAuth();

  const [currentStep, setCurrentStep] = useState<number>(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submittedApp, setSubmittedApp] = useState<ProviderApplication | null>(null);
  const [isLoadingDraft, setIsLoadingDraft] = useState<boolean>(true);

  // Application Form State
  const [businessInfo, setBusinessInfo] = useState<ProviderBusinessInfo>({
    businessName: '',
    description: '',
    primaryCategory: initialCategory,
  });

  const [contactInfo, setContactInfo] = useState<ProviderContactInfo>({
    contactPerson: user?.name || '',
    phone: user?.phone || '',
    email: user?.email || '',
    useWhatsappForAlerts: true,
    publicPhoneVisible: false,
  });

  const [services, setServices] = useState<ProviderServiceItem[]>([]);

  const [location, setLocation] = useState<ProviderLocationInfo>({
    campusId: 'campus-hub',
    campusName: 'Campus Living Hub',
    facilityAddress: '',
    landmark: '',
    serviceRadiusKm: 2.5,
    city: 'Student Area',
    state: '',
    pincode: '110001',
  });

  const [availability, setAvailability] = useState<ProviderWeeklyAvailability>({
    schedule: DEFAULT_WEEKLY_SCHEDULE,
    holidayNotice: '',
    emergencySupport: false,
  });

  // Load existing draft if user is authenticated
  useEffect(() => {
    let isMounted = true;
    if (user?.id) {
      ProviderService.getApplication(user.id).then((app) => {
        if (!isMounted) return;
        if (app) {
          if (app.status === 'under_review' || app.status === 'approved' || app.status === 'submitted') {
            setSubmittedApp(app);
          } else {
            // Restore draft
            if (app.businessInfo) setBusinessInfo(app.businessInfo);
            if (app.contactInfo) setContactInfo(app.contactInfo);
            if (app.services && app.services.length > 0) setServices(app.services);
            if (app.location) setLocation(app.location);
            if (app.availability) setAvailability(app.availability);
            if (app.currentStep) setCurrentStep(app.currentStep);
          }
        }
        setIsLoadingDraft(false);
      });
    } else {
      setIsLoadingDraft(false);
    }
    return () => {
      isMounted = false;
    };
  }, [user]);

  // Persist draft on step advance
  const saveProgress = async (nextStep: number) => {
    setCurrentStep(nextStep);
    setCompletedSteps((prev) => Array.from(new Set([...prev, currentStep])));
    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (user?.id) {
      try {
        await ProviderService.saveDraft(user.id, {
          currentStep: nextStep,
          businessInfo,
          contactInfo,
          services,
          location,
          availability,
        });
      } catch {
        // non-blocking
      }
    }
  };

  const handleFinalSubmit = async () => {
    if (!isAuthenticated || !user?.id) {
      // If unauthenticated, redirect to sign-in / sign-up with returnTo
      if (onNavigateToAuth) {
        onNavigateToAuth();
      } else {
        window.location.hash = '#auth/sign-in?returnTo=#provider/onboarding';
      }
      return;
    }

    setIsSubmitting(true);
    try {
      const app = await ProviderService.submitApplication(user.id, {
        userId: user.id,
        currentStep: 8,
        businessInfo,
        contactInfo,
        services,
        location,
        availability,
      });
      setSubmittedApp(app);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setIsSubmitting(false);
    }
  };

  // If application is already submitted or under review, display Status screen
  if (submittedApp) {
    return (
      <div style={{ minHeight: '80vh', padding: '3rem 0 5rem' }}>
        <div className="container">
          <ProviderStatusView
            application={submittedApp}
            onResumeDraft={() => {
              setSubmittedApp(null);
              setCurrentStep(1);
            }}
            onRefresh={() => {
              if (user?.id) {
                ProviderService.getApplication(user.id).then(setSubmittedApp);
              }
            }}
            onNavigateToProfile={() => {
              window.location.hash = '#provider/profile';
            }}
            onNavigateToSettings={() => {
              window.location.hash = '#provider/settings';
            }}
          />
        </div>
      </div>
    );
  }

  if (isLoadingDraft) {
    return (
      <div style={{ padding: '6rem 0', textAlign: 'center', color: 'var(--color-text-secondary)' }}>
        Loading application progress...
      </div>
    );
  }

  return (
    <div className="easehub-provider-onboarding" style={{ minHeight: '100vh', paddingBottom: '5rem' }}>
      {/* Step Progress Tracker */}
      <OnboardingProgress
        currentStep={currentStep}
        completedSteps={completedSteps}
        onStepClick={(step) => {
          setCurrentStep(step);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Active Step Content */}
      <div className="container" style={{ padding: '3rem 1rem' }}>
        {currentStep === 1 && (
          <Step1Welcome
            onContinue={() => saveProgress(2)}
            onCheckStatus={onNavigateToStatus}
            onBackToLanding={onNavigateToLanding}
            hasExistingDraft={completedSteps.length > 0 || !!businessInfo.businessName}
          />
        )}

        {currentStep === 2 && (
          <Step2ProviderType
            selectedCategory={businessInfo.primaryCategory}
            onSelectCategory={(cat) => setBusinessInfo((prev) => ({ ...prev, primaryCategory: cat }))}
            onContinue={() => saveProgress(3)}
            onBack={() => setCurrentStep(1)}
          />
        )}

        {currentStep === 3 && (
          <Step3BusinessInfo
            businessInfo={businessInfo}
            onChange={(updates) => setBusinessInfo((prev) => ({ ...prev, ...updates }))}
            onContinue={() => saveProgress(4)}
            onBack={() => setCurrentStep(2)}
          />
        )}

        {currentStep === 4 && (
          <Step4ContactInfo
            contactInfo={contactInfo}
            onChange={(updates) => setContactInfo((prev) => ({ ...prev, ...updates }))}
            onContinue={() => saveProgress(5)}
            onBack={() => setCurrentStep(3)}
          />
        )}

        {currentStep === 5 && (
          <Step5Services
            category={businessInfo.primaryCategory}
            services={services}
            onChange={setServices}
            onContinue={() => saveProgress(6)}
            onBack={() => setCurrentStep(4)}
          />
        )}

        {currentStep === 6 && (
          <Step6Location
            location={location}
            onChange={(updates) => setLocation((prev) => ({ ...prev, ...updates }))}
            onContinue={() => saveProgress(7)}
            onBack={() => setCurrentStep(5)}
          />
        )}

        {currentStep === 7 && (
          <Step7Availability
            availability={availability}
            onChange={(updates) => setAvailability((prev) => ({ ...prev, ...updates }))}
            onContinue={() => saveProgress(8)}
            onBack={() => setCurrentStep(6)}
          />
        )}

        {currentStep === 8 && (
          <Step8Review
            applicationData={{
              userId: user?.id || 'guest',
              currentStep: 8,
              businessInfo,
              contactInfo,
              services,
              location,
              availability,
            }}
            onEditStep={(stepNum) => setCurrentStep(stepNum)}
            onSubmit={handleFinalSubmit}
            onBack={() => setCurrentStep(7)}
            isSubmitting={isSubmitting}
          />
        )}
      </div>
    </div>
  );
};
