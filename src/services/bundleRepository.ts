/**
 * EASEHUB BUNDLE REPOSITORY
 * Dynamic storage and management service for Smart Bundles and Combo Passes.
 * Allows administrators to add, edit, customize, and delete student living combos.
 */

import { BUNDLES, type Bundle } from '../data/bundles';

const STORAGE_KEY = 'easehub_smart_bundles_v1';

export class BundleRepository {
  /**
   * Returns all active bundles, falling back to seed bundles.
   */
  public static getBundlesSync(): Bundle[] {
    if (typeof window === 'undefined') return [...BUNDLES];
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {
      // Storage unavailable
    }
    return [...BUNDLES];
  }

  /**
   * Saves or updates a bundle in storage and dispatches a reactive update event.
   */
  public static saveBundle(bundle: Bundle): Bundle {
    const bundles = this.getBundlesSync();
    const existingIndex = bundles.findIndex((b) => b.id.toLowerCase() === bundle.id.toLowerCase());

    if (existingIndex >= 0) {
      bundles[existingIndex] = bundle;
    } else {
      bundles.push(bundle);
    }

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(bundles));
      window.dispatchEvent(new CustomEvent('easehub_bundles_updated', { detail: bundles }));
    } catch {
      // Storage unavailable
    }
    return bundle;
  }

  /**
   * Deletes a bundle by its unique ID.
   */
  public static deleteBundle(bundleId: string): boolean {
    const bundles = this.getBundlesSync();
    const filtered = bundles.filter((b) => b.id.toLowerCase() !== bundleId.toLowerCase());

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
      window.dispatchEvent(new CustomEvent('easehub_bundles_updated', { detail: filtered }));
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Resets all bundles back to initial platform seed defaults.
   */
  public static resetBundles(): Bundle[] {
    try {
      localStorage.removeItem(STORAGE_KEY);
      window.dispatchEvent(new CustomEvent('easehub_bundles_updated', { detail: BUNDLES }));
    } catch {}
    return [...BUNDLES];
  }
}
