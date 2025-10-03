/**
 * Accessibility Utilities - WCAG 2.1 AA Compliance
 */

/**
 * Focus Management - Handle keyboard focus
 */
export const focusManagement = {
  /**
   * Trap focus within an element (for modals, dialogs)
   */
  trapFocus(element: HTMLElement): () => void {
    const focusableElements = element.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    const firstFocusable = focusableElements[0];
    const lastFocusable = focusableElements[focusableElements.length - 1];

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === firstFocusable) {
          lastFocusable?.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === lastFocusable) {
          firstFocusable?.focus();
          e.preventDefault();
        }
      }
    };

    element.addEventListener('keydown', handleKeyDown);

    // Focus first element
    firstFocusable?.focus();

    // Return cleanup function
    return () => {
      element.removeEventListener('keydown', handleKeyDown);
    };
  },

  /**
   * Focus first error in form
   */
  focusFirstError(formElement: HTMLElement): void {
    const errorElement = formElement.querySelector<HTMLElement>('[aria-invalid="true"]');
    errorElement?.focus();
  },

  /**
   * Announce to screen readers
   */
  announce(message: string, priority: 'polite' | 'assertive' = 'polite'): void {
    const announcement = document.createElement('div');
    announcement.setAttribute('role', 'status');
    announcement.setAttribute('aria-live', priority);
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only'; // Screen reader only
    announcement.textContent = message;

    document.body.appendChild(announcement);

    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  },
};

/**
 * Keyboard Navigation - Handle keyboard shortcuts
 */
export class KeyboardNavigationHandler {
  private shortcuts: Map<string, () => void> = new Map();

  /**
   * Register keyboard shortcut
   */
  register(key: string, handler: () => void, ctrlKey = false, shiftKey = false): void {
    const shortcutKey = `${ctrlKey ? 'ctrl+' : ''}${shiftKey ? 'shift+' : ''}${key}`;
    this.shortcuts.set(shortcutKey, handler);
  }

  /**
   * Initialize keyboard listener
   */
  init(): () => void {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      const shortcutKey = `${e.ctrlKey || e.metaKey ? 'ctrl+' : ''}${e.shiftKey ? 'shift+' : ''}${key}`;

      const handler = this.shortcuts.get(shortcutKey);
      if (handler) {
        e.preventDefault();
        handler();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }

  /**
   * Remove shortcut
   */
  unregister(key: string, ctrlKey = false, shiftKey = false): void {
    const shortcutKey = `${ctrlKey ? 'ctrl+' : ''}${shiftKey ? 'shift+' : ''}${key}`;
    this.shortcuts.delete(shortcutKey);
  }
}

/**
 * Color Contrast - Check WCAG color contrast ratios
 */
export const colorContrast = {
  /**
   * Calculate relative luminance
   */
  getLuminance(r: number, g: number, b: number): number {
    const [rs, gs, bs] = [r, g, b].map((c) => {
      c = c / 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
  },

  /**
   * Calculate contrast ratio between two colors
   */
  getContrastRatio(rgb1: [number, number, number], rgb2: [number, number, number]): number {
    const lum1 = this.getLuminance(...rgb1);
    const lum2 = this.getLuminance(...rgb2);
    const brightest = Math.max(lum1, lum2);
    const darkest = Math.min(lum1, lum2);
    return (brightest + 0.05) / (darkest + 0.05);
  },

  /**
   * Check if contrast meets WCAG AA standards
   */
  meetsWCAG_AA(
    foreground: [number, number, number],
    background: [number, number, number],
    isLargeText = false
  ): boolean {
    const ratio = this.getContrastRatio(foreground, background);
    return isLargeText ? ratio >= 3 : ratio >= 4.5;
  },

  /**
   * Check if contrast meets WCAG AAA standards
   */
  meetsWCAG_AAA(
    foreground: [number, number, number],
    background: [number, number, number],
    isLargeText = false
  ): boolean {
    const ratio = this.getContrastRatio(foreground, background);
    return isLargeText ? ratio >= 4.5 : ratio >= 7;
  },
};

/**
 * ARIA Helpers - Manage ARIA attributes
 */
export const aria = {
  /**
   * Set ARIA expanded state
   */
  setExpanded(element: HTMLElement, expanded: boolean): void {
    element.setAttribute('aria-expanded', String(expanded));
  },

  /**
   * Set ARIA selected state
   */
  setSelected(element: HTMLElement, selected: boolean): void {
    element.setAttribute('aria-selected', String(selected));
  },

  /**
   * Set ARIA invalid state
   */
  setInvalid(element: HTMLElement, invalid: boolean, errorId?: string): void {
    element.setAttribute('aria-invalid', String(invalid));
    if (invalid && errorId) {
      element.setAttribute('aria-describedby', errorId);
    } else {
      element.removeAttribute('aria-describedby');
    }
  },

  /**
   * Set ARIA busy state
   */
  setBusy(element: HTMLElement, busy: boolean): void {
    element.setAttribute('aria-busy', String(busy));
  },

  /**
   * Set ARIA live region
   */
  setLive(element: HTMLElement, live: 'off' | 'polite' | 'assertive'): void {
    element.setAttribute('aria-live', live);
  },
};

/**
 * Screen Reader - Utilities for screen reader support
 */
export const screenReader = {
  /**
   * Add screen reader only text
   */
  addSROnly(text: string): HTMLElement {
    const span = document.createElement('span');
    span.className = 'sr-only';
    span.textContent = text;
    return span;
  },

  /**
   * Check if screen reader is active (heuristic)
   */
  isActive(): boolean {
    // This is a heuristic check - not 100% accurate
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  },

  /**
   * Skip link for keyboard users
   */
  createSkipLink(targetId: string, text: string = 'Skip to main content'): HTMLElement {
    const skipLink = document.createElement('a');
    skipLink.href = `#${targetId}`;
    skipLink.className = 'sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:bg-blue-600 focus:text-white focus:px-4 focus:py-2 focus:rounded';
    skipLink.textContent = text;
    return skipLink;
  },
};

/**
 * Form Accessibility - Enhance form accessibility
 */
export const formAccessibility = {
  /**
   * Auto-associate label with input
   */
  associateLabelWithInput(label: HTMLLabelElement, input: HTMLInputElement): void {
    if (!input.id) {
      input.id = `input-${Math.random().toString(36).substr(2, 9)}`;
    }
    label.setAttribute('for', input.id);
  },

  /**
   * Add required field indicator
   */
  markRequired(input: HTMLInputElement, label?: HTMLLabelElement): void {
    input.setAttribute('required', 'true');
    input.setAttribute('aria-required', 'true');

    if (label) {
      const requiredIndicator = document.createElement('span');
      requiredIndicator.setAttribute('aria-label', 'required');
      requiredIndicator.className = 'text-red-500';
      requiredIndicator.textContent = ' *';
      label.appendChild(requiredIndicator);
    }
  },

  /**
   * Show form error with ARIA
   */
  showError(input: HTMLInputElement, errorMessage: string): void {
    const errorId = `${input.id}-error`;
    let errorElement = document.getElementById(errorId);

    if (!errorElement) {
      errorElement = document.createElement('div');
      errorElement.id = errorId;
      errorElement.className = 'text-red-600 text-sm mt-1';
      errorElement.setAttribute('role', 'alert');
      input.parentElement?.appendChild(errorElement);
    }

    errorElement.textContent = errorMessage;
    input.setAttribute('aria-invalid', 'true');
    input.setAttribute('aria-describedby', errorId);
  },

  /**
   * Clear form error
   */
  clearError(input: HTMLInputElement): void {
    const errorId = `${input.id}-error`;
    const errorElement = document.getElementById(errorId);

    if (errorElement) {
      errorElement.remove();
    }

    input.setAttribute('aria-invalid', 'false');
    input.removeAttribute('aria-describedby');
  },
};

/**
 * Motion Preferences - Respect reduced motion preference
 */
export const motionPreferences = {
  /**
   * Check if user prefers reduced motion
   */
  prefersReducedMotion(): boolean {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  },

  /**
   * Get safe animation duration (respects reduced motion)
   */
  getSafeAnimationDuration(normalDuration: number): number {
    return this.prefersReducedMotion() ? 0 : normalDuration;
  },

  /**
   * Apply animation if safe
   */
  applySafeAnimation(
    element: HTMLElement,
    animation: () => void,
    fallback?: () => void
  ): void {
    if (this.prefersReducedMotion() && fallback) {
      fallback();
    } else {
      animation();
    }
  },
};

/**
 * Accessible Modal - Create accessible modal dialog
 */
export class AccessibleModal {
  private element: HTMLElement;
  private previousFocus: HTMLElement | null = null;
  private cleanupFocusTrap?: () => void;

  constructor(element: HTMLElement) {
    this.element = element;
  }

  open(): void {
    // Store current focus
    this.previousFocus = document.activeElement as HTMLElement;

    // Set ARIA attributes
    this.element.setAttribute('role', 'dialog');
    this.element.setAttribute('aria-modal', 'true');
    this.element.style.display = 'block';

    // Trap focus
    this.cleanupFocusTrap = focusManagement.trapFocus(this.element);

    // Announce to screen readers
    focusManagement.announce('Modal dialog opened', 'assertive');

    // Handle escape key
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        this.close();
      }
    };
    document.addEventListener('keydown', handleEscape);
  }

  close(): void {
    // Remove ARIA attributes
    this.element.removeAttribute('role');
    this.element.removeAttribute('aria-modal');
    this.element.style.display = 'none';

    // Cleanup focus trap
    if (this.cleanupFocusTrap) {
      this.cleanupFocusTrap();
    }

    // Restore focus
    if (this.previousFocus) {
      this.previousFocus.focus();
    }

    // Announce to screen readers
    focusManagement.announce('Modal dialog closed', 'assertive');
  }
}

/**
 * Text Alternatives - Generate accessible text
 */
export const textAlternatives = {
  /**
   * Generate alt text for decorative images
   */
  decorativeImageAlt: '',

  /**
   * Generate descriptive alt text for functional images
   */
  generateImageAlt(purpose: string, context: string): string {
    return `${purpose} - ${context}`;
  },

  /**
   * Generate label for icon-only buttons
   */
  generateIconButtonLabel(action: string, noun: string): string {
    return `${action} ${noun}`;
  },
};

// Add global CSS for screen reader only content
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = `
    .sr-only {
      position: absolute;
      width: 1px;
      height: 1px;
      padding: 0;
      margin: -1px;
      overflow: hidden;
      clip: rect(0, 0, 0, 0);
      white-space: nowrap;
      border-width: 0;
    }

    .sr-only-focusable:active,
    .sr-only-focusable:focus {
      position: static;
      width: auto;
      height: auto;
      overflow: visible;
      clip: auto;
      white-space: normal;
    }
  `;
  document.head.appendChild(style);
}

