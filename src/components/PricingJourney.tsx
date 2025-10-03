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
  Star,
  ArrowRight,
  CheckCircle
} from 'lucide-react';

interface Phase {
  name: string;
  phaseNumber: number;
  duration: string;
  studentsCompleted: number;
  monthlyPrice: number;
  bundlePrice: number;
  description: string;
  color: string;
  gradient: string;
  icon: React.ReactNode;
  badge?: string;
  features: string[];
  outcomes: string[];
  nextPhase?: string;
}

const PricingJourney = () => {
  const [selectedPayment, setSelectedPayment] = useState<'monthly' | 'bundle' | 'complete'>('monthly');

  const phases: Phase[] = [
    {
      name: 'AI Explorer',
      phaseNumber: 1,
      duration: '3 Months',
      studentsCompleted: 4283,
      monthlyPrice: 47,
      bundlePrice: 127,
      description: 'Master AI tools, build games, learn fundamentals',
      color: 'from-blue-500 to-cyan-500',
      gradient: 'from-blue-500/10 to-cyan-500/10',
      icon: <Sparkles className="w-8 h-8" />,
      badge: 'EVERYONE STARTS HERE',
      nextPhase: 'Phase 2',
      features: [
        'Master 20+ Professional AI Tools (ChatGPT, Midjourney, Claude, etc.)',
        'Build 5 No-Code Games You Can Play',
        'AI Fundamentals & Ethics Education',
        'Prompt Engineering Basics',
        'Create Portfolio Website',
        '24 Live Group Sessions (2x/week)',
        'Private Discord Community',
        'Parent Progress Dashboard',
        'Weekly Challenges with Prizes',
        'Certificate of Completion'
      ],
      outcomes: [
        '10+ shareable projects',
        'Confidence using professional AI tools',
        'Foundation for building real applications',
        'Public speaking & presentation skills'
      ]
    },
    {
      name: 'AI Builder Pro',
      phaseNumber: 2,
      duration: '5 Months',
      studentsCompleted: 2847,
      monthlyPrice: 147,
      bundlePrice: 625,
      description: 'Build production apps, master automation, advanced prompts',
      color: 'from-purple-500 to-pink-500',
      gradient: 'from-purple-500/10 to-pink-500/10',
      icon: <Crown className="w-8 h-8" />,
      badge: '68% ADVANCE HERE',
      nextPhase: 'Phase 3',
      features: [
        'Build 15+ Production-Ready Applications',
        'Master Business Automation Systems',
        'Advanced Prompt Engineering',
        'Host 5-8 Live Applications (Real URLs!)',
        'Professional GitHub Portfolio',
        '4 Private 1-on-1 Mentorship Sessions',
        'Access to Premium AI Tools ($200+/mo value)',
        'Weekly Office Hours for Help',
        'Networking Events with Young Builders',
        'Freelance Opportunities Board',
        'Letter of Recommendation'
      ],
      outcomes: [
        '25+ working applications in portfolio',
        '8 apps hosted online with real URLs',
        'Automation skills worth $75-200/hr',
        'Ready for real freelance work'
      ]
    },
    {
      name: 'AI Engineer Elite',
      phaseNumber: 3,
      duration: '15 Months',
      studentsCompleted: 1094,
      monthlyPrice: 297,
      bundlePrice: 3775,
      description: 'Real programming, data science, ML/DL mastery',
      color: 'from-orange-500 to-red-500',
      gradient: 'from-orange-500/10 to-red-500/10',
      icon: <Zap className="w-8 h-8" />,
      badge: 'CAREER TRACK',
      nextPhase: 'Alumni Network',
      features: [
        'Real Programming: Python & SQL from Scratch',
        'Data Science & Advanced Analytics',
        'Machine Learning Foundations',
        'Deep Learning & Neural Networks',
        'Build 50+ Advanced Projects',
        'Original AI Research Capstone Project',
        '12 Private 1-on-1 Mentorship Sessions',
        'Dedicated Career Coach Check-ins',
        'Founder Network Access',
        'Internship Placement Assistance',
        'College Essay & Resume Review',
        'Annual Tech Company Tour',
        'Lifetime Alumni Community Access'
      ],
      outcomes: [
        '50+ projects including full ML/DL portfolio',
        'Skills worth $80-120K/year entry-level',
        'Published research paper or technical blog',
        'Career-ready & college application boost'
      ]
    }
  ];

  const getPrice = (phase: Phase) => {
    if (selectedPayment === 'monthly') {
      return {
        price: phase.monthlyPrice,
        label: '/month',
        sublabel: `for ${phase.duration.toLowerCase()}`,
        total: `Total: $${phase.monthlyPrice * (phase.duration === '3 Months' ? 3 : phase.duration === '5 Months' ? 5 : 15)}`
      };
    } else if (selectedPayment === 'bundle') {
      const monthlyTotal = phase.monthlyPrice * (phase.duration === '3 Months' ? 3 : phase.duration === '5 Months' ? 5 : 15);
      const savings = monthlyTotal - phase.bundlePrice;
      return {
        price: phase.bundlePrice,
        label: '',
        sublabel: `for full ${phase.duration}`,
        total: `Save $${savings} vs monthly!`,
        showSavings: true
      };
    } else {
      return null;
    }
  };

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
            y: [-20, 20, -20],
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
            The Complete Journey
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            From Beginner to{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600">
              AI Engineer
            </span>
            {' '}in 32 Months
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-4">
            One connected path. Everyone starts with Phase 1, sees results in week 1, then advances at their own pace. 68% continue to Phase 2, 38% complete the full journey.
          </p>
          <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-semibold">
            <CheckCircle size={16} />
            14-Day Money-Back Guarantee • No Credit Card for Trial
          </div>
        </motion.div>

        {/* Payment Options Selector */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto mb-12"
        >
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-2 shadow-xl border-2 border-gray-200">
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
                <div className="text-base font-bold">Monthly</div>
                <div className="text-xs opacity-75 mt-1">Pay as you go</div>
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
                  <div className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full font-bold shadow-lg">
                    Save 10%
                  </div>
                )}
                <div className="text-base font-bold">Phase Bundle</div>
                <div className="text-xs opacity-75 mt-1">Best per-phase value</div>
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
                  <div className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs px-2 py-1 rounded-full font-bold shadow-lg">
                    Save 25%
                  </div>
                )}
                <div className="text-base font-bold">Complete Journey</div>
                <div className="text-xs opacity-75 mt-1">Maximum savings</div>
              </button>
            </div>
          </div>
          <p className="text-center text-sm text-gray-600 mt-4 font-medium">
            {selectedPayment === 'monthly' && '🔄 Flexible - Cancel anytime, no commitments, advance at your pace'}
            {selectedPayment === 'bundle' && '💰 Save 10-15% per phase with upfront payment'}
            {selectedPayment === 'complete' && '🎉 Save $1,333 on the complete 32-month journey + exclusive bonuses!'}
          </p>
        </motion.div>

        {/* Complete Journey Card (when selected) */}
        <AnimatePresence>
          {selectedPayment === 'complete' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="max-w-4xl mx-auto mb-12"
            >
              <div className="relative">
                <motion.div
                  animate={{
                    opacity: [0.5, 1, 0.5],
                    scale: [1, 1.02, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                  }}
                  className="absolute -inset-1 bg-gradient-to-r from-orange-600 via-purple-600 to-blue-600 rounded-3xl blur-xl"
                />
                <div className="relative bg-white rounded-3xl p-8 shadow-2xl border-2 border-orange-400">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <div className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-2 rounded-full text-sm font-bold mb-3">
                        <Star className="fill-current" size={16} />
                        BEST VALUE - COMPLETE JOURNEY
                      </div>
                      <h3 className="text-3xl font-bold text-gray-900">All 3 Phases • 32 Months</h3>
                      <p className="text-gray-600 mt-2">Beginner → Professional AI Engineer</p>
                    </div>
                    <div className="text-right">
                      <div className="text-5xl font-bold text-gray-900">$3,998</div>
                      <div className="text-green-600 font-bold">Save $1,333!</div>
                      <div className="text-sm text-gray-500 mt-1">or $199/mo × 24 months</div>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6 mb-6">
                    <div className="space-y-3">
                      <h4 className="font-bold text-gray-900 flex items-center gap-2">
                        <Check className="text-green-600" size={20} />
                        Everything from all 3 phases
                      </h4>
                      <ul className="space-y-2 text-sm text-gray-700">
                        <li>• 168 live sessions over 32 months</li>
                        <li>• 28 private 1-on-1 mentorship sessions</li>
                        <li>• 85+ projects built</li>
                        <li>• Full programming mastery</li>
                        <li>• Lifetime alumni access</li>
                      </ul>
                    </div>
                    <div className="space-y-3">
                      <h4 className="font-bold text-gray-900 flex items-center gap-2">
                        <Star className="text-yellow-500 fill-current" size={20} />
                        Exclusive Complete Journey Bonuses
                      </h4>
                      <ul className="space-y-2 text-sm text-gray-700">
                        <li>• Lock in current pricing forever</li>
                        <li>• Priority support (under 2hr response)</li>
                        <li>• Exclusive merch package</li>
                        <li>• Annual tech company tour included</li>
                        <li>• Free access to all future courses</li>
                      </ul>
                    </div>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => window.location.href = '/auth?mode=signup'}
                    className="w-full bg-gradient-to-r from-orange-600 via-purple-600 to-blue-600 text-white font-bold px-8 py-5 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 flex items-center justify-center gap-2 text-lg"
                  >
                    Start Complete Journey - First 2 Classes Free
                    <ArrowRight size={20} />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Phase Cards */}
        <div className={`grid ${selectedPayment === 'complete' ? 'md:grid-cols-3' : 'md:grid-cols-3'} gap-8 mb-12`}>
          {phases.map((phase, index) => {
            const priceInfo = getPrice(phase);
            
            if (!priceInfo && selectedPayment === 'complete') {
              // Show simplified cards in complete journey mode
              return (
                <motion.div
                  key={phase.name}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border-2 border-gray-200"
                >
                  <div className={`bg-gradient-to-r ${phase.color} text-white p-4 rounded-xl mb-4`}>
                    <div className="flex items-center gap-3">
                      {phase.icon}
                      <div>
                        <div className="text-sm font-semibold">Phase {phase.phaseNumber}</div>
                        <div className="text-lg font-bold">{phase.name}</div>
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-700 text-sm mb-3">{phase.description}</p>
                  <div className="text-xs text-gray-600">
                    <div className="flex items-center gap-1 mb-1">
                      <CheckCircle size={12} className="text-green-600" />
                      {phase.duration} duration
                    </div>
                    <div className="flex items-center gap-1">
                      <Users size={12} />
                      {phase.studentsCompleted.toLocaleString()} completed
                    </div>
                  </div>
                </motion.div>
              );
            }

            const isSecondPhase = index === 1;

            return (
              <motion.div
                key={phase.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -10, scale: 1.02 }}
                className="relative"
              >
                {/* Pulsing Border for Popular Phase */}
                {isSecondPhase && (
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
                    border-2 ${isSecondPhase ? 'border-purple-300' : 'border-white/50'}
                    shadow-2xl h-full flex flex-col
                  `}
                >
                  {/* Badge */}
                  {phase.badge && (
                    <div className={`absolute top-0 right-0 bg-gradient-to-r ${phase.color} text-white text-xs font-bold px-4 py-2 rounded-bl-2xl rounded-tr-2xl shadow-lg z-10`}>
                      {phase.badge}
                    </div>
                  )}

                  {/* Header */}
                  <div className={`bg-gradient-to-r ${phase.color} p-6 text-white`}>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl">
                        {phase.icon}
                      </div>
                      <div>
                        <div className="text-xs font-semibold opacity-90">PHASE {phase.phaseNumber}</div>
                        <h3 className="text-2xl font-bold">{phase.name}</h3>
                        <div className="text-sm opacity-90">{phase.duration}</div>
                      </div>
                    </div>
                    
                    {priceInfo && (
                      <div className="mb-4">
                        <div className="flex items-baseline gap-2">
                          <span className="text-5xl font-bold">${priceInfo.price}</span>
                          <span className="text-white/80">{priceInfo.label}</span>
                        </div>
                        <div className="text-sm text-white/90 mt-1">{priceInfo.sublabel}</div>
                        <div className={`text-sm font-bold mt-2 ${priceInfo.showSavings ? 'text-green-300' : 'text-white/70'}`}>
                          {priceInfo.total}
                        </div>
                      </div>
                    )}

                    {/* Social Proof */}
                    <div className="flex items-center gap-2 text-sm bg-white/20 backdrop-blur-sm rounded-lg px-3 py-2">
                      <Users size={16} />
                      <span>{phase.studentsCompleted.toLocaleString()} students completed</span>
                    </div>
                  </div>

                  {/* Features */}
                  <div className="flex-1 p-6 space-y-3">
                    <p className="text-gray-700 font-medium mb-4">{phase.description}</p>
                    {phase.features.slice(0, 6).map((feature, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 + i * 0.05 }}
                        className="flex items-start gap-3"
                      >
                        <div className={`bg-gradient-to-r ${phase.color} p-1 rounded-full flex-shrink-0 mt-0.5`}>
                          <Check size={12} className="text-white" />
                        </div>
                        <span className="text-gray-700 text-sm">{feature}</span>
                      </motion.div>
                    ))}
                    {phase.features.length > 6 && (
                      <div className="text-sm text-gray-600 italic">
                        + {phase.features.length - 6} more features...
                      </div>
                    )}

                    {/* Outcomes */}
                    <div className="mt-6 pt-6 border-t border-gray-200">
                      <div className="text-xs font-bold text-gray-500 uppercase mb-3">What You'll Achieve:</div>
                      {phase.outcomes.map((outcome, i) => (
                        <div key={i} className="flex items-center gap-2 text-sm text-gray-700 mb-2">
                          <Star size={14} className="text-yellow-500 fill-current flex-shrink-0" />
                          <span>{outcome}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* CTA Button */}
                  <div className="p-6 pt-0">
                    <motion.button
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => window.location.href = '/auth?mode=signup'}
                      className={`
                        w-full py-4 rounded-xl font-bold text-white shadow-lg
                        bg-gradient-to-r ${phase.color}
                        hover:shadow-2xl transition-all duration-300
                      `}
                    >
                      {phase.phaseNumber === 1 ? 'Start Free Trial' : `Advance to Phase ${phase.phaseNumber}`}
                    </motion.button>
                    {phase.nextPhase && (
                      <div className="text-center mt-3 text-xs text-gray-600">
                        → Then advance to {phase.nextPhase}
                      </div>
                    )}
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
                  Risk-Free Trial + Money-Back Guarantee
                </h3>
                <p className="text-gray-600">
                  Start with Phase 1 free (first 2 classes). Then 14-day money-back guarantee on any phase. Full refund if your child doesn't love it—no questions asked.
                </p>
              </div>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="text-yellow-400 fill-yellow-400" size={20} />
                ))}
              </div>
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
            Cancel anytime with one click. Questions? Live chat with us 24/7.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default PricingJourney;

