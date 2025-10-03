import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BarChart3, 
  Trophy, 
  Clock, 
  Target,
  TrendingUp,
  Award,
  CheckCircle,
  Play,
  Eye
} from 'lucide-react';

const ParentDashboardPreview = () => {
  const [showDemo, setShowDemo] = useState(false);
  const [activeTab, setActiveTab] = useState<'progress' | 'skills' | 'projects'>('progress');

  const progressData = [
    { week: 'Week 1', completion: 100, color: 'bg-green-500' },
    { week: 'Week 2', completion: 100, color: 'bg-green-500' },
    { week: 'Week 3', completion: 85, color: 'bg-blue-500' },
    { week: 'Week 4', completion: 40, color: 'bg-purple-500' },
  ];

  const skills = [
    { name: 'Problem Solving', level: 92, icon: '🧠', trend: '+12%' },
    { name: 'Logical Thinking', level: 88, icon: '🎯', trend: '+15%' },
    { name: 'Creativity', level: 95, icon: '🎨', trend: '+8%' },
    { name: 'Python Programming', level: 78, icon: '🐍', trend: '+22%' },
  ];

  const recentProjects = [
    { name: 'Space Invaders Game', status: 'completed', grade: 'A+', emoji: '🎮' },
    { name: 'Weather Dashboard', status: 'in-progress', grade: '-', emoji: '🌤️' },
    { name: 'AI Chat Assistant', status: 'completed', grade: 'A', emoji: '🤖' },
    { name: 'Portfolio Website', status: 'completed', grade: 'A+', emoji: '🌐' },
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-white via-indigo-50/30 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-700 px-4 py-2 rounded-full text-sm font-semibold mb-6">
            <Eye size={16} />
            Parent Dashboard
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Track Every Milestone,{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
              Celebrate Every Win
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Stay connected to your child's learning journey. Real-time insights, progress tracking, and weekly reports—all in one beautiful dashboard.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Benefits */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            {[
              {
                icon: <BarChart3 className="w-6 h-6" />,
                title: 'Real-Time Progress Tracking',
                description: 'See exactly what your child is learning, how they\'re progressing, and where they excel.',
                color: 'from-blue-500 to-cyan-500'
              },
              {
                icon: <Trophy className="w-6 h-6" />,
                title: 'Achievement Notifications',
                description: 'Get instant alerts when your child completes projects, earns badges, or reaches new milestones.',
                color: 'from-purple-500 to-pink-500'
              },
              {
                icon: <Clock className="w-6 h-6" />,
                title: 'Weekly Learning Reports',
                description: 'Detailed summaries delivered to your inbox every week. Know exactly how much time they\'re investing.',
                color: 'from-orange-500 to-red-500'
              },
              {
                icon: <Target className="w-6 h-6" />,
                title: 'Skill Development Insights',
                description: 'Beyond coding—track critical thinking, problem-solving, and creativity growth.',
                color: 'from-green-500 to-emerald-500'
              }
            ].map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex gap-4"
              >
                <div className={`bg-gradient-to-r ${benefit.color} p-3 rounded-xl text-white flex-shrink-0 h-fit`}>
                  {benefit.icon}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{benefit.title}</h3>
                  <p className="text-gray-600">{benefit.description}</p>
                </div>
              </motion.div>
            ))}

            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowDemo(true)}
              className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold px-8 py-4 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300"
            >
              <Play size={20} />
              See Dashboard Demo
            </motion.button>
          </motion.div>

          {/* Right Side - Dashboard Preview */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border-2 border-gray-100">
              {/* Dashboard Header */}
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-2xl font-bold">Emma's Progress</h3>
                    <p className="text-indigo-100 text-sm">Last updated: Today at 3:42 PM</p>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold">Level 12</div>
                    <div className="text-indigo-100 text-sm">AI Explorer</div>
                  </div>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 flex items-center justify-between">
                  <div className="text-sm">
                    <div className="text-white/80 text-xs mb-1">Current Streak</div>
                    <div className="font-bold text-lg">🔥 7 days</div>
                  </div>
                  <div className="text-sm">
                    <div className="text-white/80 text-xs mb-1">Total Time</div>
                    <div className="font-bold text-lg">14.5 hours</div>
                  </div>
                  <div className="text-sm">
                    <div className="text-white/80 text-xs mb-1">Projects</div>
                    <div className="font-bold text-lg">8 completed</div>
                  </div>
                </div>
              </div>

              {/* Tabs */}
              <div className="flex border-b border-gray-200">
                {[
                  { id: 'progress' as const, label: 'Progress', icon: <TrendingUp size={16} /> },
                  { id: 'skills' as const, label: 'Skills', icon: <Target size={16} /> },
                  { id: 'projects' as const, label: 'Projects', icon: <Trophy size={16} /> }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`
                      flex-1 flex items-center justify-center gap-2 py-4 font-semibold transition-colors
                      ${activeTab === tab.id 
                        ? 'text-indigo-600 border-b-2 border-indigo-600' 
                        : 'text-gray-500 hover:text-gray-700'}
                    `}
                  >
                    {tab.icon}
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              <div className="p-6 max-h-80 overflow-y-auto">
                <AnimatePresence mode="wait">
                  {activeTab === 'progress' && (
                    <motion.div
                      key="progress"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="space-y-4"
                    >
                      {progressData.map((week, i) => (
                        <div key={i}>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-semibold text-gray-700">{week.week}</span>
                            <span className="text-sm font-bold text-gray-900">{week.completion}%</span>
                          </div>
                          <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${week.completion}%` }}
                              transition={{ duration: 1, delay: i * 0.1 }}
                              className={`h-full ${week.color}`}
                            />
                          </div>
                        </div>
                      ))}
                    </motion.div>
                  )}

                  {activeTab === 'skills' && (
                    <motion.div
                      key="skills"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="space-y-4"
                    >
                      {skills.map((skill, i) => (
                        <div key={i} className="bg-gray-50 rounded-xl p-4">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <span className="text-2xl">{skill.icon}</span>
                              <span className="font-semibold text-gray-900">{skill.name}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-bold text-green-600">{skill.trend}</span>
                              <TrendingUp size={14} className="text-green-600" />
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${skill.level}%` }}
                                transition={{ duration: 1, delay: i * 0.1 }}
                                className="h-full bg-gradient-to-r from-indigo-500 to-purple-500"
                              />
                            </div>
                            <span className="text-sm font-bold text-gray-700 w-10">{skill.level}%</span>
                          </div>
                        </div>
                      ))}
                    </motion.div>
                  )}

                  {activeTab === 'projects' && (
                    <motion.div
                      key="projects"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="space-y-3"
                    >
                      {recentProjects.map((project, i) => (
                        <div
                          key={i}
                          className={`
                            rounded-xl p-4 border-2 transition-all
                            ${project.status === 'completed' ? 'bg-green-50 border-green-200' : ''}
                            ${project.status === 'in-progress' ? 'bg-blue-50 border-blue-200' : ''}
                            ${project.status === 'locked' ? 'bg-gray-50 border-gray-200 opacity-60' : ''}
                          `}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <span className="text-3xl">{project.emoji}</span>
                              <div>
                                <div className="font-semibold text-gray-900">{project.name}</div>
                                <div className="text-xs text-gray-600 capitalize">{project.status.replace('-', ' ')}</div>
                              </div>
                            </div>
                            {project.status === 'completed' && (
                              <div className="flex items-center gap-2">
                                <CheckCircle size={20} className="text-green-600" />
                                <span className="font-bold text-green-600">{project.grade}</span>
                              </div>
                            )}
                            {project.status === 'in-progress' && (
                              <div className="text-blue-600 font-semibold">65%</div>
                            )}
                          </div>
                        </div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Floating Achievement Badge */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              whileInView={{ scale: 1, rotate: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5, type: "spring" }}
              className="absolute -top-6 -right-6 bg-gradient-to-r from-yellow-400 to-orange-500 text-white p-4 rounded-2xl shadow-2xl"
            >
              <Award size={32} />
              <div className="text-xs font-bold mt-1">New Badge!</div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Demo Modal */}
      <AnimatePresence>
        {showDemo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
            onClick={() => setShowDemo(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="relative w-full max-w-5xl"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setShowDemo(false)}
                className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors text-sm"
              >
                Close ✕
              </button>
              <div className="bg-white rounded-2xl overflow-hidden shadow-2xl">
                <div className="aspect-video bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-6xl mb-4">📊</div>
                    <p className="text-gray-600">Interactive dashboard demo would play here</p>
                    <p className="text-sm text-gray-500 mt-2">(Video/GIF of the actual dashboard)</p>
                  </div>
                </div>
                <div className="p-6 bg-gray-50">
                  <h3 className="text-xl font-bold mb-2">See Your Child's Growth in Real-Time</h3>
                  <p className="text-gray-600">Track progress, celebrate wins, and stay involved—all from your phone or computer.</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default ParentDashboardPreview;
