import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { codeExecutionService } from './services/code-execution.service';

// Pre-load Python runtime for faster first execution
codeExecutionService.preloadPython().catch(console.error);

// Optional: Sentry error monitoring via CDN (avoids bundler resolution issues)
try {
  const dsn = (import.meta as any).env?.VITE_SENTRY_DSN as string | undefined;
  if (dsn) {
    const sentryScript = document.createElement('script');
    sentryScript.async = true;
    sentryScript.src = 'https://browser.sentry-cdn.com/7.106.1/bundle.tracing.min.js';
    sentryScript.crossOrigin = 'anonymous';
    sentryScript.onload = () => {
      try {
        (window as any).Sentry?.init({ dsn });
      } catch (e) {
        console.warn('Sentry init failed:', e);
      }
    };
    document.head.appendChild(sentryScript);
  }
} catch {}

// Optional: Simple GA pageview tracking (no-op if ID not set)
try {
  const gaId = (import.meta as any).env?.VITE_GA_ID as string | undefined;
  if (gaId) {
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
    document.head.appendChild(script);
    (window as any).dataLayer = (window as any).dataLayer || [];
    function gtag(){(window as any).dataLayer.push(arguments);}
    (gtag as any)('js', new Date());
    (gtag as any)('config', gaId);
  }
} catch {}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
