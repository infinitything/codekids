import { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Loader2 } from 'lucide-react';

interface OAuthButtonsProps {
  mode?: 'signin' | 'signup';
  onError?: (error: string) => void;
}

export const OAuthButtons = ({ mode = 'signup', onError }: OAuthButtonsProps) => {
  const [loading, setLoading] = useState<string | null>(null);

  const handleOAuthSignIn = async (provider: 'google' | 'github' | 'apple') => {
    try {
      setLoading(provider);
      
      // Get the current URL for redirect
      const redirectUrl = `${window.location.origin}/auth/callback`;
      
      console.log('🔐 OAuth Sign In:', { provider, redirectUrl });
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: redirectUrl,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
          skipBrowserRedirect: false,
        },
      });

      if (error) {
        console.error('❌ OAuth Error:', error);
        throw error;
      }
      
      // The page will redirect, so we don't need to handle success here
    } catch (err: any) {
      console.error(`${provider} OAuth error:`, err);
      onError?.(err.message || `Failed to sign in with ${provider}. Please try again.`);
      setLoading(null);
    }
  };

  const ButtonContent = ({ provider, icon }: { provider: string; icon: string }) => {
    const isLoading = loading === provider.toLowerCase();
    
    return (
      <>
        {isLoading ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          <span className="text-xl">{icon}</span>
        )}
        <span className="font-medium">
          {isLoading ? 'Connecting...' : `${mode === 'signin' ? 'Sign in' : 'Sign up'} with ${provider}`}
        </span>
      </>
    );
  };

  return (
    <div className="space-y-3">
      <button
        onClick={() => handleOAuthSignIn('google')}
        disabled={loading !== null}
        className="w-full flex items-center justify-center gap-3 px-4 py-3 border-2 border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        <ButtonContent provider="Google" icon="🔍" />
      </button>

      <button
        onClick={() => handleOAuthSignIn('github')}
        disabled={loading !== null}
        className="w-full flex items-center justify-center gap-3 px-4 py-3 border-2 border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        <ButtonContent provider="GitHub" icon="🐙" />
      </button>

      <button
        onClick={() => handleOAuthSignIn('apple')}
        disabled={loading !== null}
        className="w-full flex items-center justify-center gap-3 px-4 py-3 border-2 border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        <ButtonContent provider="Apple" icon="🍎" />
      </button>

      <div className="text-xs text-gray-500 text-center mt-2">
        Note: OAuth providers must be configured in Supabase Dashboard
      </div>
    </div>
  );
};

export default OAuthButtons;
