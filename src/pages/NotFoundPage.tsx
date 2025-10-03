import { useNavigate } from 'react-router-dom';
import { Home, ArrowLeft, Search } from 'lucide-react';

export const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center px-4">
      <div className="max-w-2xl w-full text-center">
        {/* 404 Illustration */}
        <div className="mb-8">
          <div className="text-9xl font-bold text-blue-600 mb-4">404</div>
          <div className="text-6xl">🤔</div>
        </div>

        {/* Error Message */}
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Oops! Page Not Found
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          The page you're looking for seems to have gone on an adventure. 
          Let's get you back on track!
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-900 rounded-lg font-semibold transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Go Back
          </button>
          
          <button
            onClick={() => navigate('/')}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
          >
            <Home className="w-5 h-5" />
            Back to Home
          </button>
          
          <button
            onClick={() => navigate('/courses')}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold transition-colors"
          >
            <Search className="w-5 h-5" />
            Browse Courses
          </button>
        </div>

        {/* Helpful Links */}
        <div className="mt-12 pt-8 border-t border-gray-300">
          <p className="text-gray-600 mb-4">Popular pages:</p>
          <div className="flex flex-wrap gap-3 justify-center">
            <button
              onClick={() => navigate('/student-dashboard')}
              className="text-blue-600 hover:text-blue-700 font-semibold"
            >
              Student Dashboard
            </button>
            <span className="text-gray-400">•</span>
            <button
              onClick={() => navigate('/parent-dashboard')}
              className="text-blue-600 hover:text-blue-700 font-semibold"
            >
              Parent Dashboard
            </button>
            <span className="text-gray-400">•</span>
            <button
              onClick={() => navigate('/auth?mode=signup')}
              className="text-blue-600 hover:text-blue-700 font-semibold"
            >
              Sign Up
            </button>
            <span className="text-gray-400">•</span>
            <button
              onClick={() => navigate('/#faq')}
              className="text-blue-600 hover:text-blue-700 font-semibold"
            >
              FAQ
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

