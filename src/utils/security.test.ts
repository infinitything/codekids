/**
 * Security Utilities Tests
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { rateLimiter, sanitizeInput, validate, csrf } from './security';

describe('RateLimiter', () => {
  beforeEach(() => {
    rateLimiter.clear('test-key');
  });

  it('should allow requests within rate limit', () => {
    expect(rateLimiter.isRateLimited('test-key', 3, 1000)).toBe(false);
    expect(rateLimiter.isRateLimited('test-key', 3, 1000)).toBe(false);
    expect(rateLimiter.isRateLimited('test-key', 3, 1000)).toBe(false);
  });

  it('should block requests exceeding rate limit', () => {
    rateLimiter.isRateLimited('test-key', 2, 1000);
    rateLimiter.isRateLimited('test-key', 2, 1000);
    expect(rateLimiter.isRateLimited('test-key', 2, 1000)).toBe(true);
  });

  it('should return correct remaining attempts', () => {
    expect(rateLimiter.getRemainingAttempts('test-key', 3)).toBe(3);
    rateLimiter.isRateLimited('test-key', 3, 1000);
    expect(rateLimiter.getRemainingAttempts('test-key', 3)).toBe(2);
  });
});

describe('sanitizeInput', () => {
  it('should sanitize HTML to prevent XSS', () => {
    const input = '<script>alert("xss")</script>';
    const expected = '&lt;script&gt;alert(&quot;xss&quot;)&lt;&#x2F;script&gt;';
    expect(sanitizeInput.html(input)).toBe(expected);
  });

  it('should sanitize dangerous code patterns', () => {
    const input = 'eval("malicious code")';
    const result = sanitizeInput.code(input);
    expect(result).toContain('/* blocked */');
  });

  it('should sanitize display names', () => {
    const input = '  Test<User>Name  ';
    const expected = 'TestUserName';
    expect(sanitizeInput.displayName(input)).toBe(expected);
  });
});

describe('validate', () => {
  it('should validate email addresses', () => {
    expect(validate.email('test@example.com')).toBe(true);
    expect(validate.email('invalid-email')).toBe(false);
    expect(validate.email('@example.com')).toBe(false);
  });

  it('should validate password strength', () => {
    expect(validate.password('weak').valid).toBe(false);
    expect(validate.password('StrongPass123').valid).toBe(true);
    expect(validate.password('NoNumbers!').valid).toBe(false);
  });

  it('should validate age with COPPA compliance', () => {
    const result12 = validate.age(12);
    expect(result12.valid).toBe(true);
    expect(result12.requiresParent).toBe(true);

    const result14 = validate.age(14);
    expect(result14.valid).toBe(true);
    expect(result14.requiresParent).toBe(false);

    const result3 = validate.age(3);
    expect(result3.valid).toBe(false);
  });

  it('should validate display names', () => {
    expect(validate.displayName('John').valid).toBe(true);
    expect(validate.displayName('J').valid).toBe(false);
    expect(validate.displayName('Valid_Name-123').valid).toBe(true);
    expect(validate.displayName('Invalid@Name').valid).toBe(false);
  });
});

describe('csrf', () => {
  it('should generate valid CSRF tokens', () => {
    const token = csrf.generateToken();
    expect(token).toHaveLength(64); // 32 bytes * 2 (hex)
    expect(token).toMatch(/^[a-f0-9]+$/);
  });

  it('should validate stored tokens correctly', () => {
    const token = csrf.generateToken();
    csrf.storeToken(token);
    expect(csrf.validateToken(token)).toBe(true);
    expect(csrf.validateToken('invalid-token')).toBe(false);
  });
});

