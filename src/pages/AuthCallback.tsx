import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Loader2 } from 'lucide-react';

export const AuthCallback = () => {
  const navigate = useNavigate();
  const [processing, setProcessing] = useState(true);

  useEffect(() => {
    let mounted = true;
    let navigated = false;
    let authListenerUnsubscribe: (() => void) | null = null;

    const safeNavigate = (path: string) => {
      if (!mounted || navigated) return;
      navigated = true;
      console.log(`🚀 Navigating to: ${path}`);
      // Force immediate navigation
      setTimeout(() => {
        navigate(path, { replace: true });
      }, 0);
    };

    const handleCallback = async () => {
      try {
        console.log('🔄 Processing OAuth callback...');

        // Attempt explicit code exchange (safe even if already exchanged)
        const url = window.location.href;
        const hasCode = /[?&]code=/.test(url) || (url.includes('#') && url.includes('code='));
        if (hasCode) {
          try {
            const { data, error } = await supabase.auth.exchangeCodeForSession(url);
            if (error) {
              console.warn('⚠️ exchangeCodeForSession warning:', error.message);
            } else {
              console.log('🔐 Code exchange completed');
            }
          } catch (ex) {
            console.warn('⚠️ Code exchange attempt failed (may be already handled):', ex);
          }
        }

        // Give Supabase a brief moment to persist session
        await new Promise(resolve => setTimeout(resolve, 100));

        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          console.error('❌ getSession error:', error);
          safeNavigate('/auth?error=oauth_failed');
          return;
        }

        if (session) {
          console.log('✅ OAuth successful! User:', session.user.email);

          // Try to get user role with quick timeout
          try {
            const rolePromise = supabase
              .from('users')
              .select('role')
              .eq('id', session.user.id)
              .single();

            // Race against a 500ms timeout
            const timeoutPromise = new Promise((_, reject) => 
              setTimeout(() => reject(new Error('Profile fetch timeout')), 500)
            );

            const { data: userProfile } = await Promise.race([
              rolePromise,
              timeoutPromise
            ]) as any;

            console.log('→ Redirecting to dashboard');
            safeNavigate('/dashboard');
          } catch (profileError) {
            console.warn('⚠️ Could not fetch user profile quickly, using default redirect');
            safeNavigate('/dashboard');
          }
        } else {
          console.warn('⚠️ No session found after OAuth');
          safeNavigate('/auth');
        }
      } catch (err) {
        console.error('❌ Unexpected error during OAuth callback:', err);
        safeNavigate('/auth?error=unexpected');
      } finally {
        if (mounted) {
          setProcessing(false);
        }
      }
    };

    // Timeout fallback to avoid infinite loading
    const hardTimeout = setTimeout(() => {
      if (!navigated && mounted) {
        console.warn('⏳ OAuth processing timeout - forcing redirect to dashboard');
        safeNavigate('/dashboard');
      }
    }, 3000);

    handleCallback();

    return () => {
      mounted = false;
      clearTimeout(hardTimeout);
      if (authListenerUnsubscribe) {
        authListenerUnsubscribe();
      }
    };
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="text-center">
        <Loader2 className="w-16 h-16 animate-spin text-blue-600 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Signing you in...</h2>
        <p className="text-gray-600">Please wait while we complete your login</p>
      </div>
    </div>
  );
};

