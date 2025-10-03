import React from 'react';
import { motion } from 'framer-motion';
import { Brain, Lightbulb, Target, Heart, Zap, Users } from 'lucide-react';

const SoftSkills = () => {
  const skills = [
    {
      icon: <Brain className="w-8 h-8" />,
      emoji: '🧠',
      title: 'Critical Thinking',
      description: 'Breaking down complex problems into manageable steps',
      example: 'Emma learned to debug her game by testing each function systematically',
      color: 'from-purple-500 to-indigo-500',
      bgGradient: 'from-purple-50 to-indigo-50'
    },
    {
      icon: <Lightbulb className="w-8 h-8" />,
      emoji: '💡',
      title: 'Creative Problem-Solving',
      description: 'Finding unique solutions to challenges',
      example: 'Lucas built a chatbot that helps his teacher organize class schedules',
      color: 'from-yellow-500 to-orange-500',
      bgGradient: 'from-yellow-50 to-orange-50'
    },
    {
      icon: <Target className="w-8 h-8" />,
      emoji: '🎯',
      title: 'Logical Reasoning',
      description: 'Understanding cause and effect, if-then thinking',
      example: 'Sophia designed an AI that predicts weather based on multiple data points',
      color: 'from-blue-500 to-cyan-500',
      bgGradient: 'from-blue-50 to-cyan-50'
    },
    {
      icon: <Heart className="w-8 h-8" />,
      emoji: '❤️',
      title: 'Resilience & Persistence',
      description: 'Learning that failure is part of the learning process',
      example: 'After 12 attempts, Jake finally got his animation to work perfectly',
      color: 'from-pink-500 to-rose-500',
      bgGradient: 'from-pink-50 to-rose-50'
    },
    {
      icon: <Zap className="w-8 h-8" />,
      emoji: '⚡',
      title: 'Growth Mindset',
      description: 'Believing abilities can be developed through dedication',
      example: 'Maya went from "I can\'t code" to building 3 AI apps in 10 weeks',
      color: 'from-green-500 to-emerald-500',
      bgGradient: 'from-green-50 to-emerald-50'
    },
    {
      icon: <Users className="w-8 h-8" />,
      emoji: '🤝',
      title: 'Confidence & Communication',
      description: 'Articulating ideas and presenting work proudly',
      example: 'Oliver presented his AI project to 100+ parents at our showcase',
      color: 'from-indigo-500 to-purple-500',
      bgGradient: 'from-indigo-50 to-purple-50'
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 px-4 py-2 rounded-full text-sm font-semibold mb-6">
            <Heart size={16} />
            Beyond Code
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            It's Not Just{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600">
              Coding
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            While your child builds AI apps, they're developing life skills that will help them succeed in any field—from problem-solving to confidence.
          </p>
        </motion.div>

        {/* Skills Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {skills.map((skill, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -10, scale: 1.02 }}
              className="relative group"
            >
              <div className={`absolute inset-0 bg-gradient-to-r ${skill.color} opacity-0 group-hover:opacity-10 rounded-3xl transition-opacity duration-300`}></div>
              
              <div className="relative bg-white rounded-3xl p-8 shadow-lg border-2 border-gray-100 hover:border-gray-200 transition-all duration-300 h-full flex flex-col">
                {/* Icon */}
                <motion.div
                  whileHover={{ rotate: 360, scale: 1.1 }}
                  transition={{ duration: 0.6 }}
                  className={`bg-gradient-to-r ${skill.color} text-white p-4 rounded-2xl w-fit mb-4 shadow-lg`}
                >
                  {skill.icon}
                </motion.div>

                {/* Emoji Badge */}
                <div className="absolute top-4 right-4 text-4xl opacity-20 group-hover:opacity-40 transition-opacity">
                  {skill.emoji}
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {skill.title}
                </h3>
                <p className="text-gray-600 mb-4 flex-grow">
                  {skill.description}
                </p>

                {/* Example */}
                <div className={`bg-gradient-to-r ${skill.bgGradient} rounded-xl p-4 border-2 border-transparent group-hover:border-gray-200 transition-all duration-300`}>
                  <div className="text-xs font-semibold text-gray-500 uppercase mb-1">Real Example:</div>
                  <div className="text-sm text-gray-700 italic">"{skill.example}"</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 rounded-3xl p-12 text-white shadow-2xl"
        >
          <div className="text-center mb-8">
            <h3 className="text-3xl font-bold mb-4">The Skills That Matter Most</h3>
            <p className="text-lg text-white/90 max-w-2xl mx-auto">
              According to the World Economic Forum, these are the top skills for 2025. Your child will master them all through coding.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              { stat: '94%', label: 'Parents see improved problem-solving' },
              { stat: '87%', label: 'Report increased confidence' },
              { stat: '91%', label: 'Notice better logical thinking' },
              { stat: '89%', label: 'See growth mindset development' }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-5xl font-bold mb-2">{item.stat}</div>
                <div className="text-white/90 text-sm">{item.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <p className="text-lg text-gray-700 mb-6">
            Give your child the skills they need to thrive—in coding and in life.
          </p>
          <motion.button
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => window.location.href = '/auth?mode=signup'}
            className="bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 text-white font-bold px-8 py-4 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300"
          >
            Start Building These Skills Today
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default SoftSkills;


