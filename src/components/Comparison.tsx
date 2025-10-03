import React from 'react';
import { motion } from 'framer-motion';
import { Check, X, Star, Award, Zap, Shield, Trophy, Target } from 'lucide-react';

const Comparison = () => {
  const features = [
    { 
      feature: '1-on-1 AI-Powered Live Mentor', 
      icon: Zap,
      codekid: true, 
      others: false, 
      tutoring: 'Limited',
      description: 'Real-time personalized guidance'
    },
    { 
      feature: 'Real Project Portfolio (30+ Apps)', 
      icon: Trophy,
      codekid: true, 
      others: 'Basic', 
      tutoring: false,
      description: 'Shareable, portfolio-ready projects'
    },
    { 
      feature: 'Industry-Recognized Certifications', 
      icon: Award,
      codekid: true, 
      others: false, 
      tutoring: false,
      description: 'Verified by tech companies'
    },
    { 
      feature: '24/7 Parent Progress Dashboard', 
      icon: Target,
      codekid: true, 
      others: false, 
      tutoring: false,
      description: 'Real-time tracking & insights'
    },
    { 
      feature: 'Job Placement & Career Support', 
      icon: Shield,
      codekid: true, 
      others: false, 
      tutoring: false,
      description: 'Internship & job connections'
    },
    { 
      feature: 'Weekly Live Group Sessions', 
      icon: Star,
      codekid: '2x per week', 
      others: '1x per month', 
      tutoring: false,
      description: 'Collaborate with peers'
    },
    { 
      feature: 'Private Discord Community', 
      codekid: true, 
      others: false, 
      tutoring: false,
      description: '1000+ student network'
    },
    { 
      feature: 'Lifetime Access to Materials', 
      codekid: true, 
      others: false, 
      tutoring: false,
      description: 'Never lose your progress'
    },
    { 
      feature: 'AI Tools Access (ChatGPT, Midjourney, etc)', 
      codekid: '20+ Tools', 
      others: 'Limited', 
      tutoring: false,
      description: 'Professional-grade tools'
    },
    { 
      feature: 'Competition & Hackathon Entry', 
      codekid: true, 
      others: false, 
      tutoring: false,
      description: '$50K+ in prizes annually'
    },
    { 
      feature: 'College Application Support', 
      codekid: true, 
      others: false, 
      tutoring: false,
      description: 'Portfolio review & guidance'
    },
    { 
      feature: 'Monthly 1-on-1 Parent Calls', 
      codekid: true, 
      others: false, 
      tutoring: 'Extra cost',
      description: 'Personalized roadmap discussions'
    },
    { 
      feature: 'Real-World Business Projects', 
      codekid: true, 
      others: false, 
      tutoring: false,
      description: 'Build for actual clients'
    },
    { 
      feature: 'Money-Back Guarantee', 
      codekid: '14 days', 
      others: '7 days', 
      tutoring: false,
      description: 'Risk-free trial'
    },
  ];

  const costComparison = {
    feature: 'Total Cost (32 months)',
    codekid: '$2,697',
    codekidMonthly: '$84/month',
    others: '$9,600+',
    othersMonthly: '$300/month',
    tutoring: '$38,400+',
    tutoringMonthly: '$1,200/month',
  };

  const renderValue = (value: any) => {
    if (value === true) {
      return <Check className="w-7 h-7 text-green-500 mx-auto drop-shadow-lg" strokeWidth={3} />;
    }
    if (value === false) {
      return <X className="w-7 h-7 text-red-400 mx-auto opacity-50" strokeWidth={2} />;
    }
    return <span className="font-semibold text-gray-700 text-sm">{value}</span>;
  };

  return (
    <section className="py-24 bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -right-20 w-96 h-96 bg-blue-200 rounded-full opacity-20 blur-3xl" />
        <div className="absolute bottom-1/4 -left-20 w-96 h-96 bg-purple-200 rounded-full opacity-20 blur-3xl" />
        </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold mb-6">
            <Award size={16} />
            Side-by-Side Comparison
          </div>
          <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Why CodeKid Destroys{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600">
              Every Other Option
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            See exactly what you get with CodeKid vs. expensive alternatives. Spoiler: We win on every metric.
          </p>
        </motion.div>

        {/* Comparison Table */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-200"
        >
          {/* Table Header */}
          <div className="grid grid-cols-1 md:grid-cols-4 bg-gradient-to-r from-gray-900 to-gray-800 text-white">
            <div className="p-6 border-b md:border-b-0 md:border-r border-gray-700">
              <h3 className="font-bold text-lg">Feature</h3>
            </div>
            <div className="p-6 bg-gradient-to-br from-blue-600 to-purple-600 relative border-b md:border-b-0 md:border-r border-white/20">
              <div className="absolute top-2 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 px-4 py-1.5 rounded-full text-xs font-black shadow-lg z-10">
                ⭐ BEST VALUE
              </div>
              <h3 className="font-bold text-xl text-center mt-2">CodeKid</h3>
            </div>
            <div className="p-6 border-b md:border-b-0 md:border-r border-gray-700">
              <h3 className="font-bold text-lg text-center">Other Platforms</h3>
            </div>
            <div className="p-6">
              <h3 className="font-bold text-lg text-center">Private Tutoring</h3>
            </div>
          </div>

          {/* Feature Rows */}
          {features.map((row, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className={`grid grid-cols-1 md:grid-cols-4 border-b border-gray-100 hover:bg-blue-50/50 transition-colors ${
                index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
              }`}
            >
              <div className="p-6 border-b md:border-b-0 md:border-r border-gray-100">
                <div className="flex items-start gap-3">
                  {row.icon && <row.icon className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />}
                  <div>
                    <span className="font-semibold text-gray-900 block">{row.feature}</span>
                    {row.description && (
                      <span className="text-xs text-gray-500 mt-1 block">{row.description}</span>
                )}
              </div>
            </div>
              </div>
              <div className="p-6 bg-blue-50/50 text-center flex items-center justify-center border-b md:border-b-0 md:border-r border-gray-100">
                {renderValue(row.codekid)}
              </div>
              <div className="p-6 text-center flex items-center justify-center border-b md:border-b-0 md:border-r border-gray-100">
                {renderValue(row.others)}
              </div>
              <div className="p-6 text-center flex items-center justify-center">
                {renderValue(row.tutoring)}
              </div>
            </motion.div>
          ))}

          {/* Cost Comparison Row (Highlighted) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-4 bg-gradient-to-r from-yellow-50 to-orange-50 border-t-4 border-yellow-400"
          >
            <div className="p-6 border-b md:border-b-0 md:border-r border-yellow-200">
              <div className="flex items-center gap-3">
                <Trophy className="w-6 h-6 text-yellow-600" />
                <div>
                  <span className="font-bold text-gray-900 text-lg block">{costComparison.feature}</span>
                  <span className="text-sm text-gray-600">Full AI Engineer journey</span>
        </div>
        </div>
            </div>
            <div className="p-6 bg-gradient-to-br from-green-100 to-emerald-100 text-center border-b md:border-b-0 md:border-r border-yellow-200">
              <div className="font-black text-3xl text-green-700 mb-1">{costComparison.codekid}</div>
              <div className="text-sm text-green-600 font-semibold">{costComparison.codekidMonthly}</div>
              <div className="text-xs text-green-600 mt-1">💰 Save $125,303</div>
            </div>
            <div className="p-6 text-center border-b md:border-b-0 md:border-r border-yellow-200">
              <div className="font-bold text-2xl text-red-600 mb-1 line-through opacity-75">
                {costComparison.others}
              </div>
              <div className="text-sm text-red-500 font-medium">{costComparison.othersMonthly}</div>
            </div>
            <div className="p-6 text-center">
              <div className="font-bold text-2xl text-red-600 mb-1 line-through opacity-75">
                {costComparison.tutoring}
              </div>
              <div className="text-sm text-red-500 font-medium">{costComparison.tutoringMonthly}</div>
            </div>
          </motion.div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="text-center mt-12"
        >
          <button
            onClick={() => window.location.href = '/auth?mode=signup'}
            className="group bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold px-12 py-5 rounded-2xl transform hover:scale-105 transition-all duration-200 shadow-2xl hover:shadow-3xl text-lg"
          >
            <span className="flex items-center gap-3 justify-center">
              <Trophy className="w-6 h-6 group-hover:animate-bounce" />
              Choose the Winner - Start Free Trial
              <Trophy className="w-6 h-6 group-hover:animate-bounce" />
            </span>
          </button>
          <p className="text-sm text-gray-500 mt-4">
            14-day money-back guarantee • No credit card required
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default Comparison;
