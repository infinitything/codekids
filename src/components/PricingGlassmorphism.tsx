import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Check, 
  Sparkles, 
  Shield, 
  Zap, 
  Crown,
  Users,
  TrendingUp,
  Star
} from 'lucide-react';

interface PricingTier {
  name: string;
  phase: string;
  duration: string;
  popularCount: number;
  monthlyPrice: number;
  bundlePrice: number;
  features: string[];
  outcomes: string[];
  color: string;
  gradient: string;
  icon: React.ReactNode;
  badge?: string;
  nextPhase?: string;
}

const PricingGlassmorphism = () => {
  const [isAnnual, setIsAnnual] = useState(false);

  const pricingTiers: PricingTier[] = [
    {
      name: 'AI Explorer',
      phase: 'Phase 1',
      duration: '3 Months',
      popularCount: 4283,
      monthlyPrice: 47,
      bundlePrice: 127,
      color: 'from-blue-500 to-cyan-500',
      gradient: 'from-blue-500/10 to-cyan-500/10',
      icon: <Sparkles className="w-6 h-6" />,
      badge: 'EVERYONE STARTS HERE',
      nextPhase: 'Phase 2',
      features: [
        'Master 20+ Professional AI Tools',
        'Build 5 No-Code Games',
        'AI Fundamentals & Ethics',
        'Prompt Engineering Basics',
        'Portfolio Website Creation',
        '24 Live Group Sessions (2x/week)',
        'Private Discord Community',
        'Parent Progress Dashboard',
        'Weekly Challenges with Prizes',
        'Certificate of Completion'
      ],
      outcomes: [
        '10+ shareable projects',
        'Confidence using pro AI tools',
        'Foundation for real apps',
        'Public speaking practice'
      ]
    },
    {
      name: 'AI Builder Pro',
      phase: 'Phase 2',
      duration: '5 Months',
      popularCount: 2847,
      monthlyPrice: 147,
      bundlePrice: 625,
      color: 'from-purple-500 to-pink-500',
      gradient: 'from-purple-500/10 to-pink-500/10',
      icon: <Crown className="w-6 h-6" />,
      badge: 'MOST ADVANCE TO HERE',
      nextPhase: 'Phase 3',
      features: [
        'Build 15+ Production-Ready Apps',
        'Master Automation Systems',
        'Advanced Prompt Engineering',
        'Host 5-8 Live Applications',
        'Professional GitHub Portfolio',
        '4 Live 1-on-1 Mentorship Sessions',
        'Access to Premium AI Tools ($200+/mo value)',
        'Weekly Office Hours',
        'Networking Events',
        'Freelance Opportunities Board',
        'Letter of Recommendation'
      ],
      outcomes: [
        '25+ working applications',
        '8 apps hosted with real URLs',
        'Automation skills worth $75-200/hr',
        'Ready for real freelance work'
      ]
    },
    {
      name: 'AI Engineer Elite',
      phase: 'Phase 3',
      duration: '15 Months',
      popularCount: 1094,
      monthlyPrice: 297,
      bundlePrice: 3775,
      color: 'from-orange-500 to-red-500',
      gradient: 'from-orange-500/10 to-red-500/10',
      icon: <Zap className="w-6 h-6" />,
      badge: 'CAREER TRACK',
      nextPhase: 'Alumni Network',
      features: [
        'Real Programming: Python & SQL',
        'Data Science & Analytics',
        'Machine Learning Foundations',
        'Deep Learning & Neural Networks',
        'Build 50+ Advanced Projects',
        'Original AI Research Capstone',
        '12 Private 1-on-1 Mentorship Sessions',
        'Dedicated Career Coach',
        'Founder Network Access',
        'Internship Placement Assistance',
        'College Essay & Resume Review',
        'Annual Tech Company Tour',
        'Lifetime Alumni Community'
      ],
      outcomes: [
        '50+ projects, full ML/DL portfolio',
        'Skills worth $80-120K/year',
        'Original research paper',
        'Career & college ready'
      ]
    }
  ];

  const [selectedPayment, setSelectedPayment] = useState<'monthly' | 'bundle' | 'complete'>('monthly');

  return (
    <section id="pricing" className="py-20 relative overflow-hidden">
      {/* Animated Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-blue-50 to-cyan-50">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(147,51,234,0.15),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_60%,rgba(59,130,246,0.15),transparent_50%)]"></div>
      </div>

      {/* Floating Particles */}
      {[...Array(10)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-gradient-to-r from-purple-400 to-blue-400"
          style={{
            width: Math.random() * 4 + 2,
            height: Math.random() * 4 + 2,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{
            duration: Math.random() * 10 + 10,
            repeat: Infinity,
            delay: Math.random() * 5,
          }}
        />
      ))}

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 bg-white/60 backdrop-blur-sm border border-purple-200 text-purple-700 px-4 py-2 rounded-full text-sm font-semibold mb-6 shadow-lg">
            <TrendingUp size={16} />
            Transparent Pricing
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            The Complete{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600">
              32-Month Journey
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-4">
            One connected path from complete beginner to professional AI engineer. Start Phase 1, see results in week 1, then advance at your child's pace.
          </p>
          <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-semibold">
            <Check size={16} />
            14-Day Money-Back Guarantee on All Phases
          </div>
        </motion.div>

        {/* Payment Options */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto mb-12"
        >
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-2 shadow-lg border-2 border-gray-200">
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => setSelectedPayment('monthly')}
                className={`
                  px-6 py-4 rounded-xl font-semibold transition-all duration-300
                  ${selectedPayment === 'monthly' 
                    ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg scale-105' 
                    : 'text-gray-600 hover:bg-gray-100'}
                `}
              >
                <div className="text-sm">Monthly</div>
                <div className="text-xs opacity-75">Pay per month</div>
              </button>
              <button
                onClick={() => setSelectedPayment('bundle')}
                className={`
                  relative px-6 py-4 rounded-xl font-semibold transition-all duration-300
                  ${selectedPayment === 'bundle' 
                    ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg scale-105' 
                    : 'text-gray-600 hover:bg-gray-100'}
                `}
              >
                {selectedPayment !== 'bundle' && (
                  <div className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                    Save 10%
                  </div>
                )}
                <div className="text-sm">Phase Bundle</div>
                <div className="text-xs opacity-75">Upfront savings</div>
              </button>
              <button
                onClick={() => setSelectedPayment('complete')}
                className={`
                  relative px-6 py-4 rounded-xl font-semibold transition-all duration-300
                  ${selectedPayment === 'complete' 
                    ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg scale-105' 
                    : 'text-gray-600 hover:bg-gray-100'}
                `}
              >
                {selectedPayment !== 'complete' && (
                  <div className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs px-2 py-1 rounded-full">
                    Save 25%
                  </div>
                )}
                <div className="text-sm">Full Journey</div>
                <div className="text-xs opacity-75">Best value</div>
              </button>
            </div>
          </div>
          <p className="text-center text-sm text-gray-600 mt-4">
            {selectedPayment === 'monthly' && '🔄 Flexible - Cancel anytime, advance at your pace'}
            {selectedPayment === 'bundle' && '💰 Save 10-15% per phase with upfront payment'}
            {selectedPayment === 'complete' && '🎉 Save $1,333 on the complete 32-month journey!'}
          </p>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {pricingTiers.map((tier, index) => {
            let price, priceLabel, totalCost;
            
            if (selectedPayment === 'monthly') {
              price = tier.monthlyPrice;
              priceLabel = '/month';
              totalCost = `${tier.monthlyPrice} × ${tier.duration === '3 Months' ? 3 : tier.duration === '5 Months' ? 5 : 15} = $${tier.monthlyPrice * (tier.duration === '3 Months' ? 3 : tier.duration === '5 Months' ? 5 : 15)}`;
            } else if (selectedPayment === 'bundle') {
              price = tier.bundlePrice;
              priceLabel = ` (${tier.duration})`;
              const monthlyCost = tier.monthlyPrice * (tier.duration === '3 Months' ? 3 : tier.duration === '5 Months' ? 5 : 15);
              const savings = monthlyCost - tier.bundlePrice;
              totalCost = `Save $${savings}!`;
            } else {
              // Complete journey pricing
              if (index === 0) {
                price = 3998;
                priceLabel = ' (All 3 Phases)';
                totalCost = 'Save $1,333 total!';
              } else {
                price = null; // Won't show for individual phases in complete mode
              }
            }
            
            const isFirstPhase = tier.name === 'AI Explorer';

            return (
              <motion.div
                key={tier.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -10, scale: 1.02 }}
                className="relative"
              >
                {/* Pulsing Border for Most Popular */}
                {isPro && (
                  <motion.div
                    animate={{
                      opacity: [0.5, 1, 0.5],
                      scale: [1, 1.02, 1],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                    }}
                    className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl blur-xl"
                  />
                )}

                {/* Glass Card */}
                <div
                  className={`
                    relative bg-white/70 backdrop-blur-xl rounded-3xl overflow-hidden
                    border-2 ${isPro ? 'border-purple-300' : 'border-white/50'}
                    shadow-2xl h-full flex flex-col
                  `}
                >
                  {/* Badge */}
                  {tier.badge && (
                    <div className="absolute top-0 right-0 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs font-bold px-4 py-2 rounded-bl-2xl rounded-tr-2xl shadow-lg">
                      {tier.badge}
                    </div>
                  )}

                  {/* Header */}
                  <div className={`bg-gradient-to-r ${tier.color} p-8 text-white`}>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl">
                        {tier.icon}
                      </div>
                      <h3 className="text-2xl font-bold">{tier.name}</h3>
                    </div>
                    
                    <div className="mb-4">
                      <div className="flex items-baseline gap-2">
                        <span className="text-5xl font-bold">${price}</span>
                        <span className="text-white/80">/{isAnnual ? 'year' : 'month'}</span>
                      </div>
                      {isAnnual && (
                        <div className="text-sm text-white/90 mt-1">
                          ${Math.round(price / 12)}/month billed annually
                        </div>
                      )}
                    </div>

                    {/* Social Proof */}
                    <div className="flex items-center gap-2 text-sm bg-white/20 backdrop-blur-sm rounded-lg px-3 py-2">
                      <Users size={16} />
                      <span>{tier.popularCount.toLocaleString()} families chose this</span>
                    </div>
                  </div>

                  {/* Features */}
                  <div className="flex-1 p-8 space-y-4">
                    {tier.features.map((feature, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 + i * 0.05 }}
                        className="flex items-start gap-3"
                      >
                        <div className={`bg-gradient-to-r ${tier.color} p-1 rounded-full flex-shrink-0 mt-0.5`}>
                          <Check size={14} className="text-white" />
                        </div>
                        <span className="text-gray-700 text-sm">{feature}</span>
                      </motion.div>
                    ))}
                  </div>

                  {/* CTA Button */}
                  <div className="p-8 pt-0">
                    <motion.button
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => window.location.href = '/auth?mode=signup'}
                      className={`
                        w-full py-4 rounded-xl font-bold text-white shadow-lg
                        bg-gradient-to-r ${tier.color}
                        hover:shadow-2xl transition-all duration-300
                      `}
                    >
                      Start Free Trial
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Money-Back Guarantee Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white/80 backdrop-blur-xl rounded-2xl p-8 shadow-2xl border-2 border-green-200"
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                className="bg-gradient-to-r from-green-500 to-emerald-500 p-4 rounded-full"
              >
                <Shield size={32} className="text-white" />
              </motion.div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-1">
                  14-Day Money-Back Guarantee
                </h3>
                <p className="text-gray-600">
                  Try risk-free for 14 days. Cancel anytime. Full refund if your child doesn't love it.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Star className="text-yellow-400 fill-yellow-400" size={20} />
              <span className="font-semibold text-gray-700">4.9/5 from 12,847 parents</span>
            </div>
          </div>
        </motion.div>

        {/* Trust Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <p className="text-gray-600 text-sm max-w-2xl mx-auto">
            <strong>No credit card required for trial.</strong> Join 100,000+ families who trust CodeKid. 
            Cancel anytime with one click. Questions? Chat with us 24/7.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default PricingGlassmorphism;

