/**
 * Performance Utilities - Optimization helpers
 */

/**
 * Debounce function - Prevent excessive function calls
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };

    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Throttle function - Limit function execution rate
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;

  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/**
 * Memoization - Cache expensive function results
 */
export function memoize<T extends (...args: any[]) => any>(
  func: T
): (...args: Parameters<T>) => ReturnType<T> {
  const cache = new Map<string, ReturnType<T>>();

  return function memoized(...args: Parameters<T>): ReturnType<T> {
    const key = JSON.stringify(args);

    if (cache.has(key)) {
      return cache.get(key)!;
    }

    const result = func(...args);
    cache.set(key, result);
    return result;
  };
}

/**
 * Local Storage Cache - Persistent caching with TTL
 */
export class LocalCache {
  private prefix: string;

  constructor(prefix: string = 'cache_') {
    this.prefix = prefix;
  }

  /**
   * Set cache with TTL (time to live in seconds)
   */
  set(key: string, value: any, ttl: number = 3600): void {
    const item = {
      value,
      expiry: Date.now() + ttl * 1000,
    };

    try {
      localStorage.setItem(this.prefix + key, JSON.stringify(item));
    } catch (error) {
      console.error('LocalCache set error:', error);
    }
  }

  /**
   * Get cached value
   */
  get<T = any>(key: string): T | null {
    try {
      const itemStr = localStorage.getItem(this.prefix + key);
      if (!itemStr) return null;

      const item = JSON.parse(itemStr);

      if (Date.now() > item.expiry) {
        localStorage.removeItem(this.prefix + key);
        return null;
      }

      return item.value;
    } catch (error) {
      console.error('LocalCache get error:', error);
      return null;
    }
  }

  /**
   * Remove cached value
   */
  remove(key: string): void {
    localStorage.removeItem(this.prefix + key);
  }

  /**
   * Clear all cache with this prefix
   */
  clear(): void {
    const keysToRemove: string[] = [];

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(this.prefix)) {
        keysToRemove.push(key);
      }
    }

    keysToRemove.forEach((key) => localStorage.removeItem(key));
  }
}

/**
 * Image Optimization - Lazy load images
 */
export const imageOptimization = {
  /**
   * Lazy load image when it enters viewport
   */
  lazyLoad(img: HTMLImageElement): void {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const target = entry.target as HTMLImageElement;
            target.src = target.dataset.src || '';
            observer.unobserve(target);
          }
        });
      },
      { rootMargin: '50px' }
    );

    observer.observe(img);
  },

  /**
   * Generate srcset for responsive images
   */
  generateSrcSet(baseUrl: string, sizes: number[]): string {
    return sizes.map((size) => `${baseUrl}?w=${size} ${size}w`).join(', ');
  },
};

/**
 * Code Splitting Helpers - Dynamic imports
 */
export const codeSplitting = {
  /**
   * Preload component for faster loading
   */
  preloadComponent(importFunc: () => Promise<any>): void {
    // Create link element for preload
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'script';
    document.head.appendChild(link);

    // Trigger import
    importFunc().catch((err) => console.error('Preload failed:', err));
  },

  /**
   * Lazy load component with retry logic
   */
  lazyLoadWithRetry<T>(
    importFunc: () => Promise<T>,
    retries: number = 3
  ): Promise<T> {
    return new Promise((resolve, reject) => {
      importFunc()
        .then(resolve)
        .catch((error) => {
          if (retries === 1) {
            reject(error);
            return;
          }

          setTimeout(() => {
            this.lazyLoadWithRetry(importFunc, retries - 1)
              .then(resolve)
              .catch(reject);
          }, 1000);
        });
    });
  },
};

/**
 * Performance Monitoring - Track performance metrics
 */
export class PerformanceMonitor {
  private marks: Map<string, number> = new Map();

  /**
   * Start measuring performance
   */
  start(label: string): void {
    this.marks.set(label, performance.now());
  }

  /**
   * End measurement and get duration
   */
  end(label: string): number | null {
    const startTime = this.marks.get(label);
    if (!startTime) return null;

    const duration = performance.now() - startTime;
    this.marks.delete(label);

    if (import.meta.env.DEV) {
      console.log(`⏱️ ${label}: ${duration.toFixed(2)}ms`);
    }

    return duration;
  }

  /**
   * Measure async function execution
   */
  async measureAsync<T>(
    label: string,
    func: () => Promise<T>
  ): Promise<{ result: T; duration: number }> {
    this.start(label);
    const result = await func();
    const duration = this.end(label) || 0;

    return { result, duration };
  }

  /**
   * Get page load metrics
   */
  getPageLoadMetrics(): {
    domContentLoaded: number;
    loadComplete: number;
    firstPaint: number | null;
  } | null {
    const perfData = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;

    if (!perfData) return null;

    return {
      domContentLoaded: perfData.domContentLoadedEventEnd - perfData.fetchStart,
      loadComplete: perfData.loadEventEnd - perfData.fetchStart,
      firstPaint: this.getFirstPaint(),
    };
  }

  /**
   * Get First Paint timing
   */
  private getFirstPaint(): number | null {
    const paintEntries = performance.getEntriesByType('paint');
    const firstPaint = paintEntries.find((entry) => entry.name === 'first-paint');
    return firstPaint ? firstPaint.startTime : null;
  }

  /**
   * Get memory usage (if available)
   */
  getMemoryUsage(): { used: number; total: number; percentage: number } | null {
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      return {
        used: Math.round(memory.usedJSHeapSize / 1048576), // MB
        total: Math.round(memory.totalJSHeapSize / 1048576), // MB
        percentage: Math.round((memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100),
      };
    }
    return null;
  }
}

/**
 * Request Batching - Batch multiple requests
 */
export class RequestBatcher<T> {
  private queue: Array<{
    key: string;
    resolve: (value: T) => void;
    reject: (error: any) => void;
  }> = [];
  private timeout: NodeJS.Timeout | null = null;
  private batchHandler: (keys: string[]) => Promise<Map<string, T>>;

  constructor(
    batchHandler: (keys: string[]) => Promise<Map<string, T>>,
    private waitMs: number = 50
  ) {
    this.batchHandler = batchHandler;
  }

  /**
   * Add request to batch
   */
  request(key: string): Promise<T> {
    return new Promise((resolve, reject) => {
      this.queue.push({ key, resolve, reject });

      if (this.timeout) clearTimeout(this.timeout);

      this.timeout = setTimeout(() => {
        this.flush();
      }, this.waitMs);
    });
  }

  /**
   * Flush queue and execute batch
   */
  private async flush(): void {
    if (this.queue.length === 0) return;

    const batch = this.queue.splice(0);
    const keys = batch.map((item) => item.key);

    try {
      const results = await this.batchHandler(keys);

      batch.forEach((item) => {
        const result = results.get(item.key);
        if (result !== undefined) {
          item.resolve(result);
        } else {
          item.reject(new Error('Result not found'));
        }
      });
    } catch (error) {
      batch.forEach((item) => item.reject(error));
    }
  }
}

/**
 * Virtual Scroll Helper - For long lists
 */
export class VirtualScroll {
  private itemHeight: number;
  private containerHeight: number;
  private buffer: number = 5;

  constructor(itemHeight: number, containerHeight: number) {
    this.itemHeight = itemHeight;
    this.containerHeight = containerHeight;
  }

  /**
   * Calculate visible items based on scroll position
   */
  getVisibleRange(
    scrollTop: number,
    totalItems: number
  ): { start: number; end: number } {
    const start = Math.max(0, Math.floor(scrollTop / this.itemHeight) - this.buffer);
    const visibleItems = Math.ceil(this.containerHeight / this.itemHeight);
    const end = Math.min(totalItems, start + visibleItems + this.buffer * 2);

    return { start, end };
  }

  /**
   * Get total scroll height
   */
  getTotalHeight(itemCount: number): number {
    return itemCount * this.itemHeight;
  }

  /**
   * Get offset for item
   */
  getItemOffset(index: number): number {
    return index * this.itemHeight;
  }
}

/**
 * Web Worker Pool - Manage multiple workers
 */
export class WorkerPool {
  private workers: Worker[] = [];
  private availableWorkers: Worker[] = [];
  private queue: Array<{
    task: any;
    resolve: (value: any) => void;
    reject: (error: any) => void;
  }> = [];

  constructor(workerScript: string, poolSize: number = 4) {
    for (let i = 0; i < poolSize; i++) {
      const worker = new Worker(workerScript);
      this.workers.push(worker);
      this.availableWorkers.push(worker);
    }
  }

  /**
   * Execute task in worker
   */
  execute<T>(task: any): Promise<T> {
    return new Promise((resolve, reject) => {
      const worker = this.availableWorkers.pop();

      if (worker) {
        this.runTask(worker, task, resolve, reject);
      } else {
        this.queue.push({ task, resolve, reject });
      }
    });
  }

  /**
   * Run task in worker
   */
  private runTask(
    worker: Worker,
    task: any,
    resolve: (value: any) => void,
    reject: (error: any) => void
  ): void {
    const handleMessage = (e: MessageEvent) => {
      worker.removeEventListener('message', handleMessage);
      worker.removeEventListener('error', handleError);
      this.availableWorkers.push(worker);
      this.processQueue();
      resolve(e.data);
    };

    const handleError = (error: ErrorEvent) => {
      worker.removeEventListener('message', handleMessage);
      worker.removeEventListener('error', handleError);
      this.availableWorkers.push(worker);
      this.processQueue();
      reject(error);
    };

    worker.addEventListener('message', handleMessage);
    worker.addEventListener('error', handleError);
    worker.postMessage(task);
  }

  /**
   * Process queued tasks
   */
  private processQueue(): void {
    if (this.queue.length === 0 || this.availableWorkers.length === 0) {
      return;
    }

    const { task, resolve, reject } = this.queue.shift()!;
    const worker = this.availableWorkers.pop()!;
    this.runTask(worker, task, resolve, reject);
  }

  /**
   * Terminate all workers
   */
  terminate(): void {
    this.workers.forEach((worker) => worker.terminate());
    this.workers = [];
    this.availableWorkers = [];
    this.queue = [];
  }
}

// Export singleton instances
export const performanceMonitor = new PerformanceMonitor();
export const localCache = new LocalCache();

