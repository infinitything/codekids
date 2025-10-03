import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Code2, 
  Sparkles, 
  Brain, 
  Rocket, 
  Zap, 
  Trophy,
  Play,
  CheckCircle,
  Heart,
  Target
} from 'lucide-react';

interface Feature {
  id: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  demoContent: React.ReactNode;
  color: string;
  gradient: string;
}

const InteractiveFeatures = () => {
  const [selectedFeature, setSelectedFeature] = useState<string | null>(null);
  const [hoveredFeature, setHoveredFeature] = useState<string | null>(null);

  const features: Feature[] = [
    {
      id: 'week1',
      icon: <Sparkles className="w-8 h-8" />,
      title: 'Week 1: First Animation',
      description: 'Your child creates their first moving character',
      color: 'from-purple-500 to-pink-500',
      gradient: 'bg-gradient-to-br from-purple-50 to-pink-50',
      demoContent: (
        <div className="relative h-full flex items-center justify-center bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl p-8">
          <motion.div
            animate={{
              x: [-20, 20, -20],
              rotate: [0, 360, 0]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="text-6xl"
          >
            🚀
          </motion.div>
          <div className="absolute bottom-4 left-4 right-4">
            <div className="bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
              <div className="text-xs font-mono text-gray-700">
                <span className="text-purple-600">move</span>(rocket, <span className="text-green-600">"left"</span>)
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'week4',
      icon: <Code2 className="w-8 h-8" />,
      title: 'Week 4: Interactive Game',
      description: 'Building a game with scoring and levels',
      color: 'from-blue-500 to-cyan-500',
      gradient: 'bg-gradient-to-br from-blue-50 to-cyan-50',
      demoContent: (
        <div className="relative h-full flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 to-cyan-100 rounded-xl p-8">
          <div className="text-5xl mb-4">🎮</div>
          <div className="bg-white rounded-lg p-4 shadow-xl w-full max-w-xs">
            <div className="flex justify-between items-center mb-3">
              <div className="text-sm font-bold text-gray-700">Score: 1250</div>
              <div className="text-sm font-bold text-blue-600">Level 5</div>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[...Array(9)].map((_, i) => (
                <motion.div
                  key={i}
                  whileHover={{ scale: 1.1 }}
                  className="aspect-square bg-gradient-to-br from-blue-400 to-purple-400 rounded-lg cursor-pointer"
                />
              ))}
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'week8',
      icon: <Brain className="w-8 h-8" />,
      title: 'Week 8: Smart Chatbot',
      description: 'AI-powered assistant that answers questions',
      color: 'from-green-500 to-emerald-500',
      gradient: 'bg-gradient-to-br from-green-50 to-emerald-50',
      demoContent: (
        <div className="relative h-full flex flex-col bg-gradient-to-br from-green-100 to-emerald-100 rounded-xl p-8">
          <div className="flex-1 space-y-3 overflow-auto">
            <div className="bg-white rounded-xl p-3 shadow-md">
              <div className="text-sm text-gray-600">User:</div>
              <div className="text-sm font-medium">What's the weather?</div>
            </div>
            <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl p-3 shadow-md ml-8">
              <div className="text-xs opacity-90">AI Bot:</div>
              <div className="text-sm font-medium">It's sunny, 72°F! Perfect for coding outside! ☀️</div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'week12',
      icon: <Rocket className="w-8 h-8" />,
      title: 'Week 12: AI-Powered App',
      description: 'Full application solving real problems',
      color: 'from-orange-500 to-red-500',
      gradient: 'bg-gradient-to-br from-orange-50 to-red-50',
      demoContent: (
        <div className="relative h-full flex flex-col items-center justify-center bg-gradient-to-br from-orange-100 to-red-100 rounded-xl p-8">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden">
            <div className="bg-gradient-to-r from-orange-500 to-red-500 p-4 text-white">
              <div className="text-lg font-bold">📸 Photo Detective</div>
              <div className="text-xs opacity-90">AI Image Recognition</div>
            </div>
            <div className="p-4 space-y-3">
              <div className="text-4xl text-center">🌸</div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Detected:</span>
                  <span className="font-bold text-orange-600">Sunflower</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Confidence:</span>
                  <span className="font-bold text-green-600">97%</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Colors:</span>
                  <span className="font-bold">Yellow, Green</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'gamified',
      icon: <Zap className="w-8 h-8" />,
      title: 'Gamified Learning',
      description: 'Badges, points & streaks make it fun',
      color: 'from-yellow-400 to-orange-500',
      gradient: 'bg-gradient-to-br from-yellow-50 to-orange-50',
      demoContent: (
        <div className="h-full flex flex-col justify-center items-center bg-gradient-to-br from-yellow-100 to-orange-100 rounded-xl p-6 space-y-4">
          <div className="grid grid-cols-3 gap-4 w-full">
            <div className="bg-white/70 backdrop-blur-sm p-3 rounded-lg shadow text-center">
              <div className="text-4xl">🏅</div>
              <div className="text-xs font-bold mt-1 leading-tight">First App</div>
            </div>
            <div className="bg-white/70 backdrop-blur-sm p-3 rounded-lg shadow text-center">
              <div className="text-4xl">🔥</div>
              <div className="text-xs font-bold mt-1 leading-tight">7 Day Streak</div>
            </div>
            <div className="bg-white/70 backdrop-blur-sm p-3 rounded-lg shadow text-center">
              <div className="text-4xl">🏆</div>
              <div className="text-xs font-bold mt-1 leading-tight">AI Pro</div>
            </div>
          </div>
          <div className="w-full bg-white/70 backdrop-blur-sm p-4 rounded-lg shadow text-center">
             <div className="text-sm font-bold text-orange-600">Total XP: 15,000</div>
          </div>
        </div>
      )
    },
    {
      id: 'skills',
      icon: <Trophy className="w-8 h-8" />,
      title: 'Beyond Coding',
      description: 'Problem-solving, creativity & logical thinking',
      color: 'from-indigo-500 to-purple-500',
      gradient: 'bg-gradient-to-br from-indigo-50 to-purple-50',
      demoContent: (
        <div className="relative h-full flex flex-col justify-center bg-gradient-to-br from-indigo-100 to-purple-100 rounded-xl p-8">
          <div className="space-y-4">
            {[
              { icon: '🧠', skill: 'Critical Thinking', value: 95 },
              { icon: '💡', skill: 'Creative Problem-Solving', value: 88 },
              { icon: '🎯', skill: 'Logical Reasoning', value: 92 },
              { icon: '❤️', skill: 'Confidence & Persistence', value: 97 }
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl">{item.icon}</span>
                  <span className="text-sm font-medium text-gray-700">{item.skill}</span>
                </div>
                <div className="bg-white/50 rounded-full h-2 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${item.value}%` }}
                    transition={{ duration: 1, delay: i * 0.1 + 0.3 }}
                    className="h-full bg-gradient-to-r from-indigo-500 to-purple-500"
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )
    },
    {
      id: 'portfolio',
      icon: <Target className="w-8 h-8" />,
      title: 'Real Portfolio',
      description: 'Projects your child can showcase',
      color: 'from-pink-500 to-rose-500',
      gradient: 'bg-gradient-to-br from-pink-50 to-rose-50',
      demoContent: (() => {
        const statusColors: { [key: string]: string } = {
          Live: 'bg-green-100 text-green-700',
          Published: 'bg-blue-100 text-blue-700',
          Complete: 'bg-sky-100 text-sky-700',
          'New!': 'bg-purple-100 text-purple-700',
          Demo: 'bg-orange-100 text-orange-700',
        };

        const portfolioProjects = [
          { emoji: '🤖', title: 'AI Chatbot', status: 'Live' },
          { emoji: '🎮', title: 'Space Game', status: 'Published' },
          { emoji: '📱', title: 'Weather App', status: 'Complete' },
          { emoji: '🎨', title: 'Art Generator', status: 'New!' },
          { emoji: '📰', title: 'News Summarizer', status: 'Live' },
          { emoji: '🛒', title: 'E‑commerce Store', status: 'Demo' },
          { emoji: '🎭', title: 'Meme Creator', status: 'Complete' },
          { emoji: '📚', title: 'AI Story Writer', status: 'New!' }
        ];

        return (
          <div className="relative h-full flex flex-col bg-gradient-to-br from-pink-100 to-rose-100 rounded-xl p-6">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {portfolioProjects.map((project, i) => (
                <motion.div
                  key={i}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-lg cursor-pointer flex flex-col text-center"
                >
                  <div className="text-4xl mb-3 flex-grow flex items-center justify-center">{project.emoji}</div>
                  <div className="text-sm font-bold text-gray-800 leading-tight mb-3 h-10 flex items-center justify-center">{project.title}</div>
                  <div className={`inline-block px-2 py-1 ${statusColors[project.status as keyof typeof statusColors] || 'bg-gray-100 text-gray-700'} text-xs rounded-full self-center`}>
                    {project.status}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        );
      })()
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-white via-purple-50/30 to-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-100 to-blue-100 text-purple-700 px-4 py-2 rounded-full text-sm font-semibold mb-6">
            <Play size={16} />
            Interactive Learning Journey
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Watch Your Child's{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600">
              Transformation
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            From Week 1 animations to Week 48 professional AI apps. Click each milestone to see what your child will build—every project is real, shareable, and portfolio-worthy.
          </p>
        </motion.div>

        {/* Bento Box Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">
          {features.map((feature, index) => {
            const isSelected = selectedFeature === feature.id;
            const isHovered = hoveredFeature === feature.id;
            const isLarge = index === 0 || index === 3;

            return (
              <motion.div
                key={feature.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`
                  ${isLarge ? 'md:col-span-2 lg:col-span-2' : ''}
                  ${isSelected ? 'md:col-span-2 lg:col-span-3' : ''}
                  relative
                `}
              >
                <motion.div
                  whileHover={{ scale: isSelected ? 1 : 1.02, y: isSelected ? 0 : -5 }}
                  onHoverStart={() => setHoveredFeature(feature.id)}
                  onHoverEnd={() => setHoveredFeature(null)}
                  onClick={() => setSelectedFeature(isSelected ? null : feature.id)}
                  className={`
                    ${feature.gradient}
                    rounded-3xl p-6 cursor-pointer
                    border-2 transition-all duration-300
                    ${isSelected ? 'border-purple-400 shadow-2xl' : 'border-transparent shadow-lg hover:shadow-xl'}
                    ${isSelected ? 'h-[500px]' : 'h-[300px]'}
                  `}
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <motion.div
                        animate={{
                          rotate: isHovered ? 360 : 0,
                          scale: isHovered ? 1.1 : 1
                        }}
                        className={`bg-gradient-to-r ${feature.color} text-white p-3 rounded-xl shadow-lg`}
                      >
                        {feature.icon}
                      </motion.div>
                      <div>
                        <h3 className="font-bold text-lg text-gray-900">{feature.title}</h3>
                        <p className="text-sm text-gray-600">{feature.description}</p>
                      </div>
                    </div>
                    {!isSelected && (
                      <motion.div
                        animate={{ scale: isHovered ? 1.2 : 1 }}
                        className="text-gray-400"
                      >
                        <Play size={20} />
                      </motion.div>
                    )}
                  </div>

                  {/* Demo Content */}
                  <AnimatePresence>
                    {(isSelected || !isLarge) && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="flex-1 h-full"
                      >
                        {feature.demoContent}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Click to Expand Hint */}
                  {!isSelected && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: isHovered ? 1 : 0 }}
                      className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium text-gray-700 shadow-lg"
                    >
                      Click to explore →
                    </motion.div>
                  )}
                </motion.div>
              </motion.div>
            );
          })}
        </div>

        {/* This is the blue banner that was moved */}
      </div>
    </section>
  );
};

export default InteractiveFeatures;

