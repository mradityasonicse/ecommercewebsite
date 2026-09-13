import React, { useState, useEffect } from 'react';
import type { Campus } from '../data/campuses';
import type { ServiceDetail, ServiceOption } from '../types/serviceDetail';
import type { Service } from '../types/service';
import type { Provider } from '../data/providers';
import { ServiceRepository } from '../services/serviceRepository';
import {
  ServiceBreadcrumb,
  ServiceHero,
  ServiceSummary,
  ServiceFeatures,
  ServiceOptions,
  ServiceLocation,
  ServiceProviderSection,
  ServiceReviews,
  ServiceFAQ,
  RelatedServices,
  StickyServiceAction,
  ServiceNotFound,
  ServiceLoadingSkeleton,
} from '../components/service-detail';

interface ServiceDetailPageProps {
  slug: string;
  selectedCampus: Campus;
  onNavigateToService?: (slug: string) => void;
  onBackToCatalog?: () => void;
  onSelectOption?: (option: ServiceOption) => void;
  onSelectProvider?: (provider: Provider) => void;
}

export const ServiceDetailPage: React.FC<ServiceDetailPageProps> = ({
  slug,
  selectedCampus,
  onNavigateToService,
  onBackToCatalog,
  onSelectOption,
  onSelectProvider,
}) => {
  const [service, setService] = useState<ServiceDetail | null>(null);
  const [relatedServices, setRelatedServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Load service details and related items asynchronously
  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    Promise.all([
      ServiceRepository.getServiceDetailBySlug(slug),
      ServiceRepository.getRelatedServices(slug),
    ]).then(([detail, related]) => {
      if (!isMounted) return;
      setService(detail);
      setRelatedServices(related);
      setIsLoading(false);
    });

    return () => {
      isMounted = false;
    };
  }, [slug]);

  const handleScrollToPlans = () => {
    const plansElem = document.getElementById('plans');
    if (plansElem) {
      plansElem.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleScrollToProviders = () => {
    const providersElem = document.getElementById('providers');
    if (providersElem) {
      providersElem.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  if (isLoading) {
    return <ServiceLoadingSkeleton />;
  }

  if (!service) {
    return (
      <ServiceNotFound
        slug={slug}
        onBackToServices={onBackToCatalog}
        onSelectCategory={onNavigateToService}
      />
    );
  }

  return (
    <div
      className="easehub-service-detail-root"
      style={{
        width: '100%',
        paddingTop: 'calc(var(--navbar-height, 72px) + 1.25rem)',
        paddingBottom: 'var(--space-32)',
        backgroundColor: 'var(--color-bg-primary)',
      }}
    >
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 var(--space-6)' }}>
        {/* Top Breadcrumb Navigation */}
        <ServiceBreadcrumb
          serviceName={service.name}
          onNavigateHome={() => {
            window.location.hash = '';
          }}
          onNavigateServices={() => {
            if (onBackToCatalog) onBackToCatalog();
            else window.location.hash = '#services';
          }}
        />

        {/* Main Service Hero Section */}
        <ServiceHero
          service={service}
          activeCampus={selectedCampus}
          onExploreOptions={handleScrollToPlans}
          onViewProviders={handleScrollToProviders}
        />

        {/* Service Highlights & Trust Metrics */}
        <ServiceSummary
          service={service}
          activeCampus={selectedCampus}
        />

        {/* Verified Features, Inclusions & Non-Inclusions */}
        <ServiceFeatures service={service} />

        {/* Tiered Options & Transparent Pricing Structure */}
        <div id="plans">
          <ServiceOptions
            options={service.options}
            onSelectOption={(option) => {
              if (onSelectOption) {
                onSelectOption(option);
              } else {
                window.location.hash = `#services/${service.slug}/book?option=${option.id}`;
              }
            }}
          />
        </div>

        {/* Perimeter, Hub Delivery & Campus Coverage */}
        <ServiceLocation
          service={service}
          activeCampus={selectedCampus}
        />

        {/* Verified On-Ground Operator & Provider Profiles */}
        <div id="providers">
          <ServiceProviderSection
            service={service}
            activeCampus={selectedCampus}
            onSelectProvider={(provider) => {
              if (onSelectProvider) onSelectProvider(provider);
            }}
          />
        </div>

        {/* Student Reviews & Verified Feedback */}
        <ServiceReviews service={service} />

        {/* Frequently Asked Student Questions Accordion */}
        <ServiceFAQ
          faqs={service.faqs}
          serviceName={service.name}
        />

        {/* Related Campus Essentials Cross-Navigation */}
        <RelatedServices
          services={relatedServices}
          onSelectService={(s) => {
            if (onNavigateToService) onNavigateToService(s.slug);
            else window.location.hash = `#services/${s.slug}`;
          }}
        />
      </div>

      {/* High-Impact Sticky Bottom Bar for Mobile & Desktop */}
      <StickyServiceAction
        service={service}
        onActionClick={handleScrollToPlans}
      />
    </div>
  );
};
