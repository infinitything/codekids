import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { env } from '../lib/env';
import { Loader2, CheckCircle, XCircle, CreditCard } from 'lucide-react';

interface CourseEnrollmentProps {
  courseId: string;
  courseTitle: string;
  coursePrice: number;
  courseDuration: string;
  onEnrollSuccess?: () => void;
  onCancel?: () => void;
}

export const CourseEnrollment = ({
  courseId,
  courseTitle,
  coursePrice,
  courseDuration,
  onEnrollSuccess,
  onCancel
}: CourseEnrollmentProps) => {
  const { user, userProfile } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleEnroll = async () => {
    if (!user) {
      setError('Please sign up to enroll in courses');
      navigate('/auth?mode=signup');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Check if already enrolled
      const { data: existing } = await supabase
        .from('enrollments')
        .select('id')
        .eq('user_id', user.id)
        .eq('course_id', courseId)
        .single();

      if (existing) {
        setError('You are already enrolled in this course!');
        setLoading(false);
        return;
      }

      // For free courses or demo mode
      if (coursePrice === 0 || env.demoMode) {
        const { error: enrollError } = await supabase
          .from('enrollments')
          .insert([
            {
              user_id: user.id,
              course_id: courseId,
              progress: 0,
              started_at: new Date().toISOString()
            }
          ]);

        if (enrollError) throw enrollError;

        setSuccess(true);
        setTimeout(() => {
          onEnrollSuccess?.();
          navigate(`/courses`);
        }, 2000);
        return;
      }

      // For paid courses - integrate with Stripe
      if (env.enablePayments) {
        // TODO: Implement Stripe checkout
        setError('Payment processing coming soon! For now, all courses are free.');
        // In production, you'd do:
        // const stripe = await loadStripe(env.stripePublishableKey);
        // const response = await fetch('/api/create-checkout-session', {...});
        // await stripe.redirectToCheckout({ sessionId: response.sessionId });
      } else {
        // Free enrollment
        const { error: enrollError } = await supabase
          .from('enrollments')
          .insert([
            {
              user_id: user.id,
              course_id: courseId,
              progress: 0,
              started_at: new Date().toISOString()
            }
          ]);

        if (enrollError) throw enrollError;

        setSuccess(true);
        setTimeout(() => {
          onEnrollSuccess?.();
        }, 2000);
      }
    } catch (err: any) {
      console.error('Enrollment error:', err);
      setError(err.message || 'Failed to enroll. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="bg-white rounded-2xl p-8 shadow-lg max-w-md mx-auto text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-10 h-10 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          🎉 Enrollment Successful!
        </h2>
        <p className="text-gray-600 mb-4">
          You're now enrolled in <strong>{courseTitle}</strong>
        </p>
        <p className="text-sm text-gray-500">
          Redirecting to your courses...
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-8 shadow-lg max-w-md mx-auto">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">
        Enroll in Course
      </h2>

      <div className="bg-blue-50 rounded-xl p-6 mb-6">
        <h3 className="font-semibold text-gray-900 mb-2">{courseTitle}</h3>
        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex justify-between">
            <span>Duration:</span>
            <span className="font-semibold">{courseDuration}</span>
          </div>
          <div className="flex justify-between">
            <span>Price:</span>
            <span className="font-semibold text-green-600">
              {coursePrice === 0 ? 'FREE' : `$${coursePrice}`}
            </span>
          </div>
          {userProfile && (
            <div className="flex justify-between border-t border-blue-200 pt-2 mt-2">
              <span>Student:</span>
              <span className="font-semibold">
                {userProfile.child_name || userProfile.full_name || 'You'}
              </span>
            </div>
          )}
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4 flex items-start gap-3">
          <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      <div className="space-y-3">
        <button
          onClick={handleEnroll}
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 rounded-lg flex items-center justify-center gap-2 transition-colors"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Processing...
            </>
          ) : coursePrice > 0 && !env.demoMode ? (
            <>
              <CreditCard className="w-5 h-5" />
              Pay ${coursePrice} & Enroll
            </>
          ) : (
            'Enroll Now - Free!'
          )}
        </button>

        {onCancel && (
          <button
            onClick={onCancel}
            disabled={loading}
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 rounded-lg transition-colors"
          >
            Cancel
          </button>
        )}
      </div>

      <p className="text-xs text-gray-500 text-center mt-4">
        By enrolling, you agree to our Terms of Service and Privacy Policy
      </p>
    </div>
  );
};

export default CourseEnrollment;
