/**
 * EASEHUB SERVICE REPOSITORY LAYER
 * Abstracted data access boundary isolating UI components from the underlying data source.
 * Fully prepared for future drop-in REST / GraphQL API replacement.
 */

import { ECOSYSTEM_SERVICES, SERVICE_CATEGORIES } from '../data/services';
import { SERVICE_DETAILS } from '../data/serviceDetails';
import type { Service, ServiceCategory, ServiceFilterParams } from '../types/service';
import type { ServiceDetail } from '../types/serviceDetail';

export class ServiceRepository {
  /**
   * Resolves canonical slug from potential aliases.
   * e.g. 'food-mess' -> 'mess', 'hostel-pg' -> 'hostel', 'gym-fitness' -> 'fitness'
   */
  public static resolveCanonicalSlug(slugOrAlias: string): string {
    const s = slugOrAlias.toLowerCase().trim();
    if (s === 'food' || s === 'food-mess') return 'mess';
    if (s === 'stay' || s === 'hostel-pg') return 'hostel';
    if (s === 'fitness' || s === 'gym-fitness') return 'fitness';
    return s;
  }

  /**
   * Reads services with admin overrides from localStorage.
   */
  public static getBaseServices(): Service[] {
    if (typeof window === 'undefined') return [...ECOSYSTEM_SERVICES];
    try {
      const saved = localStorage.getItem('easehub_custom_services');
      if (saved) return JSON.parse(saved);
    } catch {
      // Fallback
    }
    return [...ECOSYSTEM_SERVICES];
  }

  /**
   * Admin: Saves or updates a service definition.
   */
  public static saveService(updated: Service): void {
    const services = this.getBaseServices();
    const idx = services.findIndex(s => s.id === updated.id || s.slug === updated.slug);
    if (idx !== -1) {
      services[idx] = updated;
    } else {
      services.push(updated);
    }
    try {
      localStorage.setItem('easehub_custom_services', JSON.stringify(services));
      window.dispatchEvent(new CustomEvent('easehub_services_updated'));
    } catch {
      // Storage unavailable
    }
  }

  /**
   * Admin: Resets all services to factory defaults.
   */
  public static resetServices(): void {
    try {
      localStorage.removeItem('easehub_custom_services');
      window.dispatchEvent(new CustomEvent('easehub_services_updated'));
    } catch {
      // Storage unavailable
    }
  }

  /**
   * Fetches all services matching optional filter, search, and sorting criteria.
   */
  public static async getServices(params?: ServiceFilterParams): Promise<Service[]> {
    const services = this.getBaseServices();
    if (!params) return services;
    return this.filterAndSortServices(services, params);
  }

  /**
   * Synchronous accessor for immediate render hydration.
   */
  public static getServicesSync(params?: ServiceFilterParams): Service[] {
    const services = this.getBaseServices();
    if (!params) return services;
    return this.filterAndSortServices(services, params);
  }

  /**
   * Fetches a single service by canonical slug (e.g. 'mess', 'hostel', 'laundry').
   */
  public static async getServiceBySlug(slug: string): Promise<Service | null> {
    const canonical = this.resolveCanonicalSlug(slug);
    const services = this.getBaseServices();
    const service = services.find(
      s => s.slug.toLowerCase() === canonical || s.id.toLowerCase() === canonical
    );
    return service ? { ...service } : null;
  }

  /**
   * Fetches full service detail by canonical slug or alias.
   */
  public static async getServiceDetailBySlug(slugOrAlias: string): Promise<ServiceDetail | null> {
    const canonical = this.resolveCanonicalSlug(slugOrAlias);
    const detail = SERVICE_DETAILS[canonical];
    if (detail) {
      return { ...detail };
    }

    // Fallback: resolve from ECOSYSTEM_SERVICES if not yet enriched
    const baseService = await this.getServiceBySlug(slugOrAlias);
    if (!baseService) return null;

    return {
      ...baseService,
      tagline: baseService.shortDescription,
      heroVisualBadge: baseService.badgeText,
      keyHighlights: [
        { number: '01', title: 'Verified Service Standard', description: baseService.shortDescription },
        { number: '02', title: 'Transparent Rate Card', description: `Starting from ${baseService.startingPrice} ${baseService.pricingUnit}.` },
        { number: '03', title: 'Campus Geofenced', description: 'Audited and available directly around your university perimeter.' },
      ],
      inclusions: baseService.popularFeatures,
      exclusions: ['Non-standard custom requests'],
      options: [
        {
          id: `opt-${baseService.slug}-standard`,
          name: `${baseService.name} Standard Plan`,
          description: baseService.shortDescription,
          price: {
            type: 'fixed',
            amount: baseService.numericStartingPrice,
            currency: '₹',
            period: baseService.pricingUnit,
          },
          features: baseService.popularFeatures,
          isPopular: true,
          availabilityStatus: baseService.availabilityStatus,
        },
      ],
      providerIds: [],
      faqs: [
        {
          question: `How do I access ${baseService.name} on my campus?`,
          answer: `Select your university hub and explore verified local operators providing ${baseService.name}.`,
        },
      ],
      relatedSlugs: ['mess', 'laundry', 'hostel'].filter(s => s !== baseService.slug),
    };
  }

  /**
   * Fetches curated cross-vertical related services.
   */
  public static async getRelatedServices(slug: string): Promise<Service[]> {
    const detail = await this.getServiceDetailBySlug(slug);
    if (!detail || !detail.relatedSlugs || detail.relatedSlugs.length === 0) {
      const canonical = this.resolveCanonicalSlug(slug);
      return ECOSYSTEM_SERVICES.filter(s => s.slug !== canonical).slice(0, 3);
    }

    const related: Service[] = [];
    for (const relSlug of detail.relatedSlugs) {
      const canonical = this.resolveCanonicalSlug(relSlug);
      const service = ECOSYSTEM_SERVICES.find(s => s.slug === canonical || s.id === canonical);
      if (service && !related.some(r => r.id === service.id)) {
        related.push({ ...service });
      }
    }
    return related;
  }

  /**
   * Fetches a single service by ID.
   */
  public static async getServiceById(id: string): Promise<Service | null> {
    const service = ECOSYSTEM_SERVICES.find(s => s.id.toLowerCase() === id.toLowerCase());
    return service ? { ...service } : null;
  }

  /**
   * Returns the list of centralized service categories.
   */
  public static getCategories(): ServiceCategory[] {
    return [...SERVICE_CATEGORIES];
  }

  /**
   * Fetches the designated featured anchor service.
   */
  public static async getFeaturedService(): Promise<Service | null> {
    const featured = ECOSYSTEM_SERVICES.find(s => s.isFeatured);
    return featured ? { ...featured } : null;
  }

  /**
   * Deterministic client-side filter and sort engine.
   * Tolerant to casing, whitespace, and multi-word token matches.
   */
  public static filterAndSortServices(
    services: Service[],
    params: ServiceFilterParams
  ): Service[] {
    let result = [...services];

    // 1. Category Filter
    if (params.category && params.category !== 'all') {
      const cat = params.category.toLowerCase();
      result = result.filter(s => s.category.toLowerCase() === cat || s.slug.toLowerCase() === cat);
    }

    // 2. Campus Filter
    if (params.campusId && params.campusId !== 'all') {
      const camp = params.campusId.toLowerCase();
      result = result.filter(s => {
        if (!s.campusIds || s.campusIds.length === 0) return true;
        return s.campusIds.some(cid => cid.toLowerCase() === camp);
      });
    }

    // 3. Availability Filter
    if (params.availability && params.availability !== 'all') {
      result = result.filter(s => s.availabilityStatus === params.availability);
    }

    // 4. Max Price Filter
    if (params.maxPrice !== undefined && params.maxPrice > 0) {
      result = result.filter(s => s.numericStartingPrice <= params.maxPrice!);
    }

    // 5. Search Query Filter (Noise-tolerant search)
    if (params.search && params.search.trim()) {
      const terms = params.search
        .toLowerCase()
        .trim()
        .split(/\s+/)
        .filter(Boolean);

      result = result.filter(service => {
        const searchableText = [
          service.name,
          service.shortDescription,
          service.category,
          service.badgeText,
          service.slug,
          ...(service.tags || []),
          ...(service.popularFeatures || []),
        ]
          .join(' ')
          .toLowerCase();

        return terms.every(term => searchableText.includes(term));
      });
    }

    // 6. Deterministic Sorting
    const sort = params.sort || 'recommended';
    switch (sort) {
      case 'price-asc':
        result.sort((a, b) => a.numericStartingPrice - b.numericStartingPrice);
        break;
      case 'price-desc':
        result.sort((a, b) => b.numericStartingPrice - a.numericStartingPrice);
        break;
      case 'newest':
        result.sort((a, b) => (b.priorityOrder || 0) - (a.priorityOrder || 0));
        break;
      case 'recommended':
      default:
        result.sort((a, b) => {
          if (a.isFeatured && !b.isFeatured) return -1;
          if (!a.isFeatured && b.isFeatured) return 1;
          return (a.priorityOrder || 99) - (b.priorityOrder || 99);
        });
        break;
    }

    return result;
  }
}
