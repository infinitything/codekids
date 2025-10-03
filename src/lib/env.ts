// Environment variable helpers with validation

export const env = {
  // Supabase
  supabaseUrl: import.meta.env.VITE_SUPABASE_URL || 'https://demo.supabase.co',
  supabaseAnonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || 'demo_key',
  
  // OpenRouter (replaces OpenAI)
  openrouterApiKey: import.meta.env.VITE_OPENROUTER_API_KEY || '',
  
  // App
  appUrl: import.meta.env.VITE_APP_URL || 'http://localhost:5173',
  appName: import.meta.env.VITE_APP_NAME || 'CodeKid',
  
  // Feature Flags
  enableAIMentor: import.meta.env.VITE_ENABLE_AI_MENTOR === 'true',
  enablePayments: import.meta.env.VITE_ENABLE_PAYMENTS === 'true',
  enableForum: import.meta.env.VITE_ENABLE_FORUM === 'true',
  demoMode: import.meta.env.VITE_DEMO_MODE === 'true',
  
  // Stripe
  stripePublishableKey: import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '',
  
  // Email
  emailApiKey: import.meta.env.VITE_EMAIL_API_KEY || '',
  emailFrom: import.meta.env.VITE_EMAIL_FROM || 'noreply@codekid.com',
} as const;

// Validation helper
export function validateEnv() {
  const errors: string[] = [];
  
  if (!env.demoMode) {
    if (!env.supabaseUrl || env.supabaseUrl === 'https://demo.supabase.co') {
      errors.push('VITE_SUPABASE_URL is required in production mode');
    }
    
    if (!env.supabaseAnonKey || env.supabaseAnonKey === 'demo_key') {
      errors.push('VITE_SUPABASE_ANON_KEY is required in production mode');
    }
  }
  
  if (env.enableAIMentor && !env.openrouterApiKey) {
    console.warn('⚠️  AI Mentor enabled but VITE_OPENROUTER_API_KEY not set');
  }
  
  if (env.enablePayments && !env.stripePublishableKey) {
    console.warn('⚠️  Payments enabled but VITE_STRIPE_PUBLISHABLE_KEY not set');
  }
  
  if (errors.length > 0) {
    console.error('❌ Environment validation failed:');
    errors.forEach(err => console.error(`  - ${err}`));
    return false;
  }
  
  console.log('✅ Environment validated successfully');
  console.log(`📍 Mode: ${env.demoMode ? 'DEMO' : 'PRODUCTION'}`);
  
  return true;
}
