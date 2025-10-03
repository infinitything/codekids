import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { SignUpForm } from '../components/auth/SignUpForm';
import { LoginForm } from '../components/auth/LoginForm';
import { OAuthButtons } from '../components/auth/OAuthButtons';
import { CreateChildProfile } from '../components/auth/CreateChildProfile';
import { ArrowLeft } from 'lucide-react';

export const AuthPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [mode, setMode] = useState<'login' | 'signup'>('signup');
  const [step, setStep] = useState<'parent' | 'child'>('parent');
  const [parentData, setParentData] = useState<any>(null);

  // Check URL params for mode
  useEffect(() => {
    const urlMode = searchParams.get('mode');
    if (urlMode === 'login' || urlMode === 'signup') {
      setMode(urlMode);
    }
  }, [searchParams]);

  const handleParentSignupSuccess = (data: any) => {
    setParentData(data);
    setStep('child');
  };

  const handleChildProfileComplete = (childData: any) => {
    // Navigate to parent dashboard after complete signup
    navigate('/parent-dashboard');
  };

  const handleLoginSuccess = () => {
    // Navigate to student dashboard after login
    navigate('/student-dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl">
        {/* Back to Home Button */}
        <button
          onClick={() => navigate('/')}
          className="mb-4 flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft size={20} />
          <span>Back to Home</span>
        </button>

        {mode === 'signup' && step === 'child' ? (
          // Child Profile Creation
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8">
              <h1 className="text-3xl font-bold mb-2">Create Child Profile</h1>
              <p className="text-blue-100">Tell us about your young coder!</p>
            </div>
            <div className="p-12">
              <CreateChildProfile
                parentId={parentData?.id || 'temp'}
                onComplete={handleChildProfileComplete}
                onBack={() => setStep('parent')}
              />
            </div>
          </div>
        ) : (
          // Parent Signup/Login
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8">
              <h1 className="text-3xl font-bold mb-2">
                {mode === 'signup' ? 'Start Your Journey' : 'Welcome Back'}
              </h1>
              <p className="text-blue-100">
                {mode === 'signup'
                  ? 'Join thousands of families teaching their kids to code'
                  : 'Continue your learning adventure'}
              </p>
            </div>

            <div className="p-12">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {mode === 'signup' ? 'Get Started Free' : 'Welcome Back'}
                </h2>
                <p className="text-gray-600">
                  {mode === 'signup'
                    ? 'Create your parent account and add your child'
                    : 'Log in to continue your learning journey'}
                </p>
              </div>

              {mode === 'signup' ? (
                <>
                  <SignUpForm
                    onSuccess={handleParentSignupSuccess}
                    onSwitchToLogin={() => setMode('login')}
                  />
                  <div className="mt-6">
                    <OAuthButtons />
                  </div>
                </>
              ) : (
                <>
                  <LoginForm
                    onSuccess={handleLoginSuccess}
                    onSwitchToSignUp={() => setMode('signup')}
                    onForgotPassword={() => console.log('Forgot password')}
                  />
                  <div className="mt-6">
                    <OAuthButtons />
                  </div>
                </>
              )}

              <div className="mt-8 pt-6 border-t text-center text-sm text-gray-600">
                ✨ Start with 3 free lessons • No credit card required
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
