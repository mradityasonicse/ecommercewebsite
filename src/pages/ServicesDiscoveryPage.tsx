import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Container } from '../components/primitives/Container';
import { 
  DiscoveryHeader, 
  SearchBar, 
  CategoryNavigation, 
  FilterToolbar, 
  FilterDrawer, 
  ServiceResults, 
  LoadingState, 
  EmptyState, 
  ErrorState 
} from '../components/discovery';
import { ServiceRepository } from '../services/serviceRepository';
import type { Service, ServiceFilterParams } from '../types/service';
import type { Campus } from '../data/campuses';
import { parseFilterParamsFromUrl, serializeFilterParamsToUrl } from '../utils/routes';

interface ServicesDiscoveryPageProps {
  selectedCampus: Campus;
  onCampusChange: (campus: Campus) => void;
  onRequestCampusOpen: () => void;
  onSelectService: (service: Service) => void;
  onNavigateHome?: () => void;
}

export const ServicesDiscoveryPage: React.FC<ServicesDiscoveryPageProps> = ({
  selectedCampus,
  onCampusChange,
  onRequestCampusOpen,
  onSelectService,
  onNavigateHome,
}) => {
  // Categories from centralized repository
  const categories = useMemo(() => ServiceRepository.getCategories(), []);

  // Initialize filters from URL if available
  const [filters, setFilters] = useState<ServiceFilterParams>(() => {
    if (typeof window !== 'undefined') {
      const initialParams = parseFilterParamsFromUrl(window.location.search || window.location.hash);
      return {
        category: initialParams.category || 'all',
        campusId: initialParams.campusId || selectedCampus.id,
        search: initialParams.search || '',
        sort: initialParams.sort || 'recommended',
        availability: initialParams.availability || 'all',
        maxPrice: initialParams.maxPrice,
      };
    }
    return {
      category: 'all',
      campusId: selectedCampus.id,
      search: '',
      sort: 'recommended',
      availability: 'all',
    };
  });

  const [allServices, setAllServices] = useState<Service[]>(() => {
    return ServiceRepository.filterAndSortServices([], {}).length ? [] : [...(window as any).__INITIAL_SERVICES__ || []];
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hasError, setHasError] = useState<boolean>(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);

  // Load all services initially
  const loadData = useCallback(async () => {
    try {
      setIsLoading(true);
      setHasError(false);
      const raw = await ServiceRepository.getServices();
      setAllServices(raw);
    } catch {
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Keep campusId in sync if parent selectedCampus changes
  useEffect(() => {
    setFilters(prev => {
      if (prev.campusId === selectedCampus.id) return prev;
      return { ...prev, campusId: selectedCampus.id };
    });
  }, [selectedCampus.id]);

  // Derive filtered and sorted services cleanly without cascading renders
  const services = useMemo(() => {
    return ServiceRepository.filterAndSortServices(allServices, filters);
  }, [allServices, filters]);

  // Sync with browser URL
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const query = serializeFilterParamsToUrl(filters);
      const hashBase = '#catalog';
      const newHash = query ? `${hashBase}?${query}` : hashBase;
      if (window.location.hash !== newHash) {
        window.history.replaceState(null, '', newHash);
      }
    }
  }, [filters]);

  // Compute live category item counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    allServices.forEach(s => {
      // Check if matches active campus
      const matchesCampus = !filters.campusId || filters.campusId === 'all' 
        ? true 
        : (s.campusIds || []).includes(filters.campusId);

      if (matchesCampus) {
        counts[s.category] = (counts[s.category] || 0) + 1;
      }
    });
    return counts;
  }, [allServices, filters.campusId]);

  // Check if any non-default filters are active
  const hasActiveFilters = useMemo(() => {
    return Boolean(
      (filters.category && filters.category !== 'all') ||
      (filters.search && filters.search.trim()) ||
      (filters.availability && filters.availability !== 'all') ||
      (filters.sort && filters.sort !== 'recommended')
    );
  }, [filters]);

  const handleClearFilters = () => {
    setFilters({
      category: 'all',
      campusId: selectedCampus.id,
      search: '',
      sort: 'recommended',
      availability: 'all',
    });
  };

  return (
    <div
      className="services-discovery-root"
      style={{
        minHeight: '100vh',
        backgroundColor: 'var(--color-bg-primary)',
        paddingBottom: 'var(--space-24)',
      }}
    >
      {/* 1. Editorial Header */}
      <DiscoveryHeader
        selectedCampus={selectedCampus}
        onCampusChange={onCampusChange}
        onRequestCampusOpen={onRequestCampusOpen}
      />

      <Container variant="wide">
        {/* Navigation Breadcrumb back to Home */}
        {onNavigateHome && (
          <div style={{ paddingTop: 'var(--space-6)' }}>
            <button
              type="button"
              onClick={onNavigateHome}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                backgroundColor: 'transparent',
                border: 'none',
                color: 'var(--color-text-muted)',
                fontSize: '0.82rem',
                fontFamily: 'var(--font-display)',
                cursor: 'pointer',
                padding: 0,
                transition: 'color var(--duration-fast)',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--color-blue-light)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--color-text-muted)'; }}
            >
              <span>← Back to Homepage Story</span>
            </button>
          </div>
        )}

        {/* 2. Search & Category Navigation Bar */}
        <div style={{ paddingTop: 'var(--space-6)', display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
          {/* Prominent Search Bar */}
          <div style={{ maxWidth: '720px' }}>
            <SearchBar
              value={filters.search || ''}
              onChange={(search) => setFilters(prev => ({ ...prev, search }))}
              onClear={() => setFilters(prev => ({ ...prev, search: '' }))}
            />
          </div>

          {/* Category Navigation Pills */}
          <CategoryNavigation
            categories={categories}
            activeCategoryId={filters.category || 'all'}
            onSelectCategory={(category) => setFilters(prev => ({ ...prev, category }))}
            categoryCounts={categoryCounts}
          />

          {/* Filter Toolbar (Count + Campus Dropdown + Sort + Mobile Button) */}
          <FilterToolbar
            totalCount={services.length}
            selectedCampus={selectedCampus}
            onCampusChange={onCampusChange}
            filters={filters}
            onFiltersChange={setFilters}
            onOpenMobileFilters={() => setIsDrawerOpen(true)}
            onClearFilters={handleClearFilters}
            hasActiveFilters={hasActiveFilters}
          />
        </div>

        {/* 3. Results Section / Dynamic States */}
        {isLoading ? (
          <LoadingState count={6} />
        ) : hasError ? (
          <ErrorState onRetry={loadData} />
        ) : services.length === 0 ? (
          <EmptyState
            onClearFilters={handleClearFilters}
            searchQuery={filters.search}
          />
        ) : (
          <ServiceResults
            services={services}
            onSelectService={onSelectService}
          />
        )}
      </Container>

      {/* 4. Accessible Mobile Filter Drawer */}
      <FilterDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        categories={categories}
        activeCampus={selectedCampus}
        onCampusChange={onCampusChange}
        filters={filters}
        onFiltersChange={setFilters}
        onClearFilters={handleClearFilters}
        totalResultsCount={services.length}
      />
    </div>
  );
};
