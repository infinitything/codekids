/**
 * Performance Utilities Tests
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { debounce, throttle, memoize, LocalCache } from './performance';

describe('debounce', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  it('should delay function execution', () => {
    const fn = vi.fn();
    const debouncedFn = debounce(fn, 100);

    debouncedFn();
    expect(fn).not.toHaveBeenCalled();

    vi.advanceTimersByTime(100);
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('should only execute once for multiple calls', () => {
    const fn = vi.fn();
    const debouncedFn = debounce(fn, 100);

    debouncedFn();
    debouncedFn();
    debouncedFn();

    vi.advanceTimersByTime(100);
    expect(fn).toHaveBeenCalledTimes(1);
  });
});

describe('throttle', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  it('should limit function execution rate', () => {
    const fn = vi.fn();
    const throttledFn = throttle(fn, 100);

    throttledFn();
    expect(fn).toHaveBeenCalledTimes(1);

    throttledFn();
    expect(fn).toHaveBeenCalledTimes(1);

    vi.advanceTimersByTime(100);
    throttledFn();
    expect(fn).toHaveBeenCalledTimes(2);
  });
});

describe('memoize', () => {
  it('should cache function results', () => {
    const expensiveFn = vi.fn((a: number, b: number) => a + b);
    const memoizedFn = memoize(expensiveFn);

    expect(memoizedFn(1, 2)).toBe(3);
    expect(expensiveFn).toHaveBeenCalledTimes(1);

    expect(memoizedFn(1, 2)).toBe(3);
    expect(expensiveFn).toHaveBeenCalledTimes(1); // Still 1, from cache
  });

  it('should calculate new result for different arguments', () => {
    const expensiveFn = vi.fn((a: number, b: number) => a + b);
    const memoizedFn = memoize(expensiveFn);

    expect(memoizedFn(1, 2)).toBe(3);
    expect(memoizedFn(2, 3)).toBe(5);
    expect(expensiveFn).toHaveBeenCalledTimes(2);
  });
});

describe('LocalCache', () => {
  let cache: LocalCache;

  beforeEach(() => {
    cache = new LocalCache('test_');
    localStorage.clear();
  });

  it('should set and get values', () => {
    cache.set('key1', { data: 'value1' }, 3600);
    const result = cache.get('key1');
    expect(result).toEqual({ data: 'value1' });
  });

  it('should return null for expired values', () => {
    vi.useFakeTimers();
    cache.set('key1', 'value1', 1); // 1 second TTL

    vi.advanceTimersByTime(2000); // Advance 2 seconds

    expect(cache.get('key1')).toBeNull();
    vi.useRealTimers();
  });

  it('should remove values', () => {
    cache.set('key1', 'value1');
    cache.remove('key1');
    expect(cache.get('key1')).toBeNull();
  });

  it('should clear all cache with prefix', () => {
    cache.set('key1', 'value1');
    cache.set('key2', 'value2');
    cache.clear();

    expect(cache.get('key1')).toBeNull();
    expect(cache.get('key2')).toBeNull();
  });
});

