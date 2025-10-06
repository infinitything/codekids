import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Video,
  FileText,
  MessageSquare,
  Code,
  BookOpen,
  Trophy,
  Play,
  Sparkles,
  CheckCircle
} from 'lucide-react';

const PlatformFeatures = () => {
  const [activeFeature, setActiveFeature] = useState<'videos' | 'notes' | 'ai' | 'practice'>('videos');

  const features = [
    {
      id: 'videos' as const,
      title: 'Interactive Videos',
      subtitle: 'Learn by Watching & Doing',
      icon: <Video className="w-6 h-6" />,
      color: 'from-blue-500 to-cyan-500',
      description: 'Engaging video lessons that break down complex concepts into bite-sized, easy-to-understand chunks.',
      highlights: [
        'Step-by-step tutorials',
        'Real-world examples',
        'Pause and practice anytime',
        'Track your progress'
      ]
    },
    {
      id: 'notes' as const,
      title: 'Study Resources',
      subtitle: 'Everything You Need, One Place',
      icon: <FileText className="w-6 h-6" />,
      color: 'from-green-500 to-emerald-500',
      description: 'Comprehensive notes, cheat sheets, and documentation to support your learning journey.',
      highlights: [
        'Detailed course notes',
        'Quick reference guides',
        'Downloadable resources',
        'Code snippets library'
      ]
    },
    {
      id: 'ai' as const,
      title: 'AI Mentor',
      subtitle: '24/7 Coding Assistant',
      icon: <MessageSquare className="w-6 h-6" />,
      color: 'from-purple-500 to-pink-500',
      description: 'Get instant help from our AI-powered coding mentor. Ask questions, debug code, and learn faster.',
      highlights: [
        'Instant code help',
        'Explain complex concepts',
        'Debug assistance',
        'Available anytime'
      ]
    },
    {
      id: 'practice' as const,
      title: 'Hands-On Practice',
      subtitle: 'Build Real Projects',
      icon: <Code className="w-6 h-6" />,
      color: 'from-orange-500 to-red-500',
      description: 'Apply what you learn with interactive coding exercises and real-world projects.',
      highlights: [
        'Interactive code editor',
        'Instant feedback',
        'Build portfolio projects',
        'Earn badges & certificates'
      ]
    }
  ];

  const activeFeatureData = features.find(f => f.id === activeFeature)!;

  return (
    <section className="py-20 bg-gradient-to-b from-white via-blue-50/30 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold mb-6">
            <Sparkles size={16} />
            All-in-One Learning Platform
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Everything You Need to{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              Master Coding
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Videos, notes, AI assistance, and hands-on practice—all in one place. Learn at your own pace with tools designed for success.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left Side - Feature Tabs */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            {features.map((feature, index) => (
              <motion.button
                key={feature.id}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                onClick={() => setActiveFeature(feature.id)}
                className={`
                  w-full text-left p-6 rounded-2xl transition-all duration-300 border-2
                  ${activeFeature === feature.id
                    ? 'bg-white shadow-xl border-blue-200 scale-105'
                    : 'bg-white/50 border-gray-100 hover:bg-white hover:shadow-md'
                  }
                `}
              >
                <div className="flex items-start gap-4">
                  <div className={`bg-gradient-to-r ${feature.color} p-3 rounded-xl text-white flex-shrink-0`}>
                    {feature.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900 mb-1">{feature.title}</h3>
                    <p className="text-sm text-gray-600">{feature.subtitle}</p>
                  </div>
                  {activeFeature === feature.id && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="text-blue-600"
                    >
                      <CheckCircle size={24} />
                    </motion.div>
                  )}
                </div>
              </motion.button>
            ))}
          </motion.div>

          {/* Right Side - Feature Details */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:sticky lg:top-24"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={activeFeature}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-3xl shadow-2xl overflow-hidden border-2 border-gray-100"
              >
                {/* Header */}
                <div className={`bg-gradient-to-r ${activeFeatureData.color} p-8 text-white`}>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="bg-white/20 backdrop-blur-sm p-4 rounded-xl">
                      {activeFeatureData.icon}
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold">{activeFeatureData.title}</h3>
                      <p className="text-white/90">{activeFeatureData.subtitle}</p>
                    </div>
                  </div>
                  <p className="text-white/90 text-lg">{activeFeatureData.description}</p>
                </div>

                {/* Content */}
                <div className="p-8">
                  <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Sparkles size={20} className="text-yellow-500" />
                    Key Features
                  </h4>
                  <div className="space-y-3 mb-6">
                    {activeFeatureData.highlights.map((highlight, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center gap-3 bg-gray-50 p-4 rounded-xl"
                      >
                        <CheckCircle size={20} className="text-green-600 flex-shrink-0" />
                        <span className="text-gray-700 font-medium">{highlight}</span>
                      </motion.div>
                    ))}
                  </div>

                  {/* Demo Preview */}
                  <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-8 text-center">
                    <div className="text-6xl mb-4">
                      {activeFeature === 'videos' && '🎥'}
                      {activeFeature === 'notes' && '📚'}
                      {activeFeature === 'ai' && '🤖'}
                      {activeFeature === 'practice' && '💻'}
                    </div>
                    <p className="text-gray-600 mb-4">
                      {activeFeature === 'videos' && 'Watch interactive coding tutorials'}
                      {activeFeature === 'notes' && 'Access comprehensive study materials'}
                      {activeFeature === 'ai' && 'Get instant help from AI mentor'}
                      {activeFeature === 'practice' && 'Build projects with live coding'}
                    </p>
                    <button 
                      onClick={() => window.location.href = '/auth?mode=signup'}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold px-6 py-3 rounded-xl hover:shadow-lg transition-all flex items-center gap-2 mx-auto"
                    >
                      <Play size={20} />
                      Try It Now
                    </button>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-12 text-white shadow-2xl">
            <BookOpen className="w-16 h-16 mx-auto mb-6 opacity-90" />
            <h3 className="text-3xl font-bold mb-4">Ready to Start Learning?</h3>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Join thousands of students already using our platform to master coding skills.
            </p>
            <button
              onClick={() => window.location.href = '/auth?mode=signup'}
              className="bg-white text-blue-600 font-bold px-10 py-4 rounded-xl hover:bg-blue-50 transition-all shadow-lg hover:shadow-xl inline-flex items-center gap-3"
            >
              Get Started Free
              <Trophy size={24} />
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default PlatformFeatures;

