/**
 * EaseHub Security & Anti-Copy Protection System
 * Protects platform design, images, copy, and source assets from casual scraping and inspection.
 */

export function initContentProtection() {
  if (typeof window === 'undefined') return;

  // 1. Console Warning Watermark
  try {
    console.log(
      '%c🛡️ EASEHUB INTELLECTUAL PROPERTY & SECURITY SHIELD\n%cAll platform assets, proprietary workflows, design tokens, and student service data are protected under copyright and IP laws.\nUnauthorized reproduction, scraping, reverse-engineering, or extraction is strictly prohibited.',
      'color: #FAC908; font-size: 16px; font-weight: 800; background: #112758; padding: 8px 14px; border-radius: 6px; text-shadow: 0 1px 2px rgba(0,0,0,0.5);',
      'color: #94A3B8; font-size: 12px; line-height: 1.5; font-family: sans-serif;'
    );
  } catch {
    // Ignore console errors
  }

  // 2. Disable Right-Click Context Menu on entire document
  document.addEventListener('contextmenu', (e: MouseEvent) => {
    // Allow right click inside form inputs and textareas for convenience
    const target = e.target as HTMLElement | null;
    if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA')) {
      return;
    }
    e.preventDefault();
  }, { passive: false });

  // 3. Prevent Drag & Drop of Images / Cards
  document.addEventListener('dragstart', (e: DragEvent) => {
    const target = e.target as HTMLElement | null;
    if (target && target.tagName === 'IMG') {
      e.preventDefault();
    }
  }, { passive: false });

  // 4. Disable DevTools & Source Viewing Keyboard Shortcuts
  document.addEventListener('keydown', (e: KeyboardEvent) => {
    const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
    const modifier = isMac ? e.metaKey : e.ctrlKey;

    // F12 -> DevTools
    if (e.key === 'F12') {
      e.preventDefault();
      return;
    }

    if (modifier) {
      const key = e.key.toLowerCase();

      // Ctrl + U -> View Source
      if (key === 'u') {
        e.preventDefault();
        return;
      }

      // Ctrl + S -> Save Webpage
      if (key === 's') {
        e.preventDefault();
        return;
      }

      // Ctrl + Shift + I / J / C -> DevTools / Console / Inspector
      if (e.shiftKey && (key === 'i' || key === 'j' || key === 'c')) {
        e.preventDefault();
        return;
      }
    }
  }, { passive: false });

  // 5. Anti-Clickjacking Frame Busting
  // If embedded in an unauthorized external iframe, break out to top window
  try {
    if (window.top && window.top !== window.self) {
      window.top.location.href = window.self.location.href;
    }
  } catch {
    // Access denied by cross-origin policy -> force navigation
    try {
      window.self.location.href = 'about:blank';
    } catch {
      // no-op
    }
  }
}
