import React from 'react';
import { ArrowRight, Shield, Clock, CreditCard, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const FinalCTA = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleCTAClick = () => {
    if (user) {
      navigate('/dashboard');
    } else {
      navigate('/auth?mode=signup');
    }
  };

  return (
    <section className="py-20 bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800 text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-64 h-64 bg-white/10 rounded-full"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-white/5 rounded-full"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <div className="mb-12">
          <h2 className="text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            This Is Your Child's <span className="text-yellow-400">Turning Point</span>
          </h2>
          
          <div className="space-y-6 text-xl text-blue-100 mb-8">
            <p>Imagine your child walking into school with confidence, knowing they can build anything they imagine.</p>
            <p className="text-white font-medium">
              While other parents wonder "Is my child ready for the future?"—
              you'll know <strong>your child is creating it</strong>.
            </p>
            <p>This isn't just about coding. It's about giving your child the confidence, creativity, and critical thinking skills that will set them apart for life.</p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mb-8 inline-block">
            <p className="text-2xl font-semibold text-yellow-300 mb-2">
              12,000+ kids have started their journey
            </p>
            <p className="text-blue-100">Will yours be next?</p>
          </div>
        </div>

        {/* Main CTA Button */}
        <div className="mb-12">
          <button
            onClick={handleCTAClick}
            className="group bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-300 hover:to-orange-400 text-gray-900 font-bold px-12 py-6 rounded-2xl text-2xl transform hover:scale-105 transition-all duration-300 shadow-2xl hover:shadow-3xl"
          >
            <div className="flex items-center gap-3 justify-center">
              <span>Start Your Child's Journey Today</span>
              <ArrowRight className="group-hover:translate-x-1 transition-transform" size={28} />
            </div>
          </button>
        </div>

        {/* Risk Reversal */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-3xl mx-auto">
          <div className="flex items-center gap-2 text-green-300">
            <CheckCircle size={20} />
            <span className="font-medium">Start free for 7 days</span>
          </div>
          <div className="flex items-center gap-2 text-green-300">
            <Clock size={20} />
            <span className="font-medium">Cancel anytime</span>
          </div>
          <div className="flex items-center gap-2 text-green-300">
            <Shield size={20} />
            <span className="font-medium">14-day money-back</span>
          </div>
          <div className="flex items-center gap-2 text-green-300">
            <CreditCard size={20} />
            <span className="font-medium">No setup fees</span>
          </div>
        </div>

        {/* Urgency Reminder */}
        <div className="mt-12 bg-orange-500/20 border border-orange-400 rounded-xl p-6 backdrop-blur-sm">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="w-3 h-3 bg-orange-400 rounded-full animate-pulse"></div>
            <span className="font-bold text-orange-200">THE BEST TIME WAS YESTERDAY</span>
          </div>
          <p className="text-white">
            The second best time is right now. Start your child's free trial today—
            <strong className="text-yellow-300"> no credit card required</strong>.
          </p>
        </div>

        {/* Success Story Callout */}
        <div className="mt-16 text-left max-w-2xl mx-auto bg-white/10 backdrop-blur-sm rounded-2xl p-8">
          <div className="text-center mb-6">
            <div className="text-4xl mb-2">🚀</div>
            <h3 className="text-xl font-bold text-yellow-300">Success Story Preview</h3>
          </div>
          
          <blockquote className="text-lg italic text-blue-100 mb-4">
            "My daughter started CodeKid at 8. She's now 12 and just got accepted 
            into Stanford's AI summer program. The confidence and skills she gained 
            have changed her entire trajectory."
          </blockquote>
          
          <div className="text-right">
            <div className="font-semibold text-white">— Jennifer Martinez</div>
            <div className="text-sm text-blue-200">CodeKid Parent, Class of 2023</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FinalCTA;