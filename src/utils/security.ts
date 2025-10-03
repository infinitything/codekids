/**
 * Security Utilities - Production-grade security features
 */

/**
 * Rate Limiter - Prevent abuse of API calls
 */
class RateLimiter {
  private attempts: Map<string, { count: number; resetTime: number }> = new Map();

  /**
   * Check if action is rate limited
   */
  isRateLimited(key: string, maxAttempts: number, windowMs: number): boolean {
    const now = Date.now();
    const record = this.attempts.get(key);

    if (!record || now > record.resetTime) {
      this.attempts.set(key, {
        count: 1,
        resetTime: now + windowMs,
      });
      return false;
    }

    if (record.count >= maxAttempts) {
      return true;
    }

    record.count++;
    return false;
  }

  /**
   * Clear rate limit for a key
   */
  clear(key: string): void {
    this.attempts.delete(key);
  }

  /**
   * Get remaining attempts
   */
  getRemainingAttempts(key: string, maxAttempts: number): number {
    const record = this.attempts.get(key);
    if (!record || Date.now() > record.resetTime) {
      return maxAttempts;
    }
    return Math.max(0, maxAttempts - record.count);
  }
}

export const rateLimiter = new RateLimiter();

/**
 * Input Sanitization - Prevent XSS and injection attacks
 */
export const sanitizeInput = {
  /**
   * Sanitize HTML to prevent XSS
   */
  html(input: string): string {
    const map: Record<string, string> = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#x27;',
      '/': '&#x2F;',
    };
    return input.replace(/[&<>"'/]/g, (char) => map[char]);
  },

  /**
   * Sanitize code input (allow code but prevent malicious patterns)
   */
  code(input: string): string {
    // Remove potentially dangerous patterns
    const dangerous = [
      /eval\s*\(/gi,
      /Function\s*\(/gi,
      /__proto__/gi,
      /constructor\s*\(/gi,
      /document\s*\.\s*cookie/gi,
      /localStorage/gi,
      /sessionStorage/gi,
      /import\s*\(/gi,
      /require\s*\(/gi,
    ];

    let sanitized = input;
    dangerous.forEach((pattern) => {
      sanitized = sanitized.replace(pattern, '/* blocked */');
    });

    return sanitized;
  },

  /**
   * Sanitize user display name
   */
  displayName(input: string): string {
    return input
      .trim()
      .substring(0, 50) // Max length
      .replace(/[<>]/g, '') // Remove angle brackets
      .replace(/\s+/g, ' '); // Normalize whitespace
  },

  /**
   * Sanitize email
   */
  email(input: string): string {
    return input.trim().toLowerCase().substring(0, 255);
  },
};

/**
 * Input Validation - Validate user inputs
 */
export const validate = {
  /**
   * Validate email format
   */
  email(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  /**
   * Validate password strength
   */
  password(password: string): { valid: boolean; message?: string } {
    if (password.length < 8) {
      return { valid: false, message: 'Password must be at least 8 characters' };
    }
    if (!/[A-Z]/.test(password)) {
      return { valid: false, message: 'Password must contain an uppercase letter' };
    }
    if (!/[a-z]/.test(password)) {
      return { valid: false, message: 'Password must contain a lowercase letter' };
    }
    if (!/[0-9]/.test(password)) {
      return { valid: false, message: 'Password must contain a number' };
    }
    return { valid: true };
  },

  /**
   * Validate age (COPPA compliance)
   */
  age(age: number): { valid: boolean; requiresParent: boolean; message?: string } {
    if (age < 5 || age > 18) {
      return { valid: false, requiresParent: false, message: 'Age must be between 5 and 18' };
    }
    return { valid: true, requiresParent: age < 13 };
  },

  /**
   * Validate code length (prevent abuse)
   */
  codeLength(code: string, maxLength: number = 10000): boolean {
    return code.length <= maxLength;
  },

  /**
   * Validate display name
   */
  displayName(name: string): { valid: boolean; message?: string } {
    if (name.length < 2) {
      return { valid: false, message: 'Name must be at least 2 characters' };
    }
    if (name.length > 50) {
      return { valid: false, message: 'Name must be less than 50 characters' };
    }
    if (!/^[a-zA-Z0-9\s-_]+$/.test(name)) {
      return { valid: false, message: 'Name can only contain letters, numbers, spaces, hyphens, and underscores' };
    }
    return { valid: true };
  },
};

/**
 * CSRF Protection - Generate and validate tokens
 */
export const csrf = {
  /**
   * Generate CSRF token
   */
  generateToken(): string {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return Array.from(array, (byte) => byte.toString(16).padStart(2, '0')).join('');
  },

  /**
   * Store token in session
   */
  storeToken(token: string): void {
    sessionStorage.setItem('csrf_token', token);
  },

  /**
   * Get stored token
   */
  getToken(): string | null {
    return sessionStorage.getItem('csrf_token');
  },

  /**
   * Validate token
   */
  validateToken(token: string): boolean {
    const storedToken = this.getToken();
    return storedToken === token;
  },
};

/**
 * Content Security - Check for inappropriate content
 */
export const contentSecurity = {
  /**
   * Check for inappropriate words (basic implementation)
   */
  containsInappropriateContent(text: string): boolean {
    // Basic profanity filter - in production, use a proper service
    const inappropriateWords = [
      // Add your list here
      // For production, use a library like 'bad-words' or an API
    ];

    const lowerText = text.toLowerCase();
    return inappropriateWords.some((word) => lowerText.includes(word));
  },

  /**
   * Check for personal information leaks
   */
  containsPersonalInfo(text: string): boolean {
    // Check for email addresses
    if (/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/.test(text)) {
      return true;
    }

    // Check for phone numbers
    if (/\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/.test(text)) {
      return true;
    }

    // Check for SSN-like patterns
    if (/\b\d{3}-\d{2}-\d{4}\b/.test(text)) {
      return true;
    }

    return false;
  },

  /**
   * Check for URLs (prevent phishing)
   */
  containsURLs(text: string): boolean {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    return urlRegex.test(text);
  },
};

/**
 * Session Security - Manage secure sessions
 */
export const sessionSecurity = {
  /**
   * Check if session is valid
   */
  isSessionValid(): boolean {
    const lastActivity = sessionStorage.getItem('last_activity');
    if (!lastActivity) return false;

    const now = Date.now();
    const lastActivityTime = parseInt(lastActivity, 10);
    const timeout = 30 * 60 * 1000; // 30 minutes

    return now - lastActivityTime < timeout;
  },

  /**
   * Update last activity timestamp
   */
  updateActivity(): void {
    sessionStorage.setItem('last_activity', Date.now().toString());
  },

  /**
   * Clear session
   */
  clearSession(): void {
    sessionStorage.clear();
    localStorage.removeItem('supabase.auth.token');
  },

  /**
   * Get session timeout remaining (in seconds)
   */
  getTimeoutRemaining(): number {
    const lastActivity = sessionStorage.getItem('last_activity');
    if (!lastActivity) return 0;

    const now = Date.now();
    const lastActivityTime = parseInt(lastActivity, 10);
    const timeout = 30 * 60 * 1000; // 30 minutes
    const remaining = timeout - (now - lastActivityTime);

    return Math.max(0, Math.floor(remaining / 1000));
  },
};

/**
 * API Key Security - Validate and manage API keys
 */
export const apiKeySecurity = {
  /**
   * Validate API key format
   */
  isValidFormat(key: string, prefix: string): boolean {
    return key.startsWith(prefix) && key.length > 20;
  },

  /**
   * Mask API key for display
   */
  maskKey(key: string): string {
    if (key.length < 8) return '****';
    return key.substring(0, 4) + '****' + key.substring(key.length - 4);
  },

  /**
   * Check if key is in environment (not hardcoded)
   */
  isFromEnvironment(key: string): boolean {
    return import.meta.env.VITE_OPENROUTER_API_KEY === key ||
           import.meta.env.VITE_SUPABASE_ANON_KEY === key;
  },
};

/**
 * Security Headers - Recommendations for server configuration
 */
export const securityHeaders = {
  recommendations: [
    'Content-Security-Policy: default-src \'self\'; script-src \'self\' \'unsafe-inline\'; style-src \'self\' \'unsafe-inline\';',
    'X-Frame-Options: DENY',
    'X-Content-Type-Options: nosniff',
    'Referrer-Policy: strict-origin-when-cross-origin',
    'Permissions-Policy: geolocation=(), microphone=(), camera=()',
  ],

  /**
   * Check if running in secure context
   */
  isSecureContext(): boolean {
    return window.isSecureContext;
  },

  /**
   * Get security recommendations
   */
  getRecommendations(): string[] {
    const recommendations: string[] = [];

    if (!window.isSecureContext) {
      recommendations.push('Use HTTPS in production');
    }

    if (!sessionStorage.getItem('csrf_token')) {
      recommendations.push('Initialize CSRF protection');
    }

    return recommendations;
  },
};

/**
 * Error Messages - Secure error handling (don't leak system info)
 */
export const secureErrors = {
  /**
   * Get user-friendly error message (hides technical details in production)
   */
  getMessage(error: any): string {
    if (import.meta.env.DEV) {
      return error.message || String(error);
    }

    // In production, return generic messages
    const errorMap: Record<string, string> = {
      'Failed to fetch': 'Network error. Please check your connection.',
      'Unauthorized': 'Please log in to continue.',
      'Forbidden': 'You don\'t have permission to do that.',
      'Not Found': 'The requested resource was not found.',
      'Internal Server Error': 'Something went wrong. Please try again.',
    };

    const errorString = String(error.message || error);
    for (const [key, message] of Object.entries(errorMap)) {
      if (errorString.includes(key)) {
        return message;
      }
    }

    return 'An error occurred. Please try again.';
  },
};

