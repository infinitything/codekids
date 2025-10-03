import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Sparkles, 
  Crown, 
  Zap, 
  Clock, 
  Users,
  CheckCircle,
  ArrowRight,
  Target,
  Rocket,
  Brain
} from 'lucide-react';

const CurriculumJourney = () => {
  const [activePhase, setActivePhase] = useState(0);

  const phases = [
    {
      id: 1,
      phase: "Phase 1",
      title: "AI Explorer",
      duration: "2 Weeks (Starter Sprint)",
      ageRange: "Ages 8-14",
      icon: Sparkles,
      color: "from-blue-500 to-cyan-500",
      bgColor: "from-blue-50 to-cyan-50",
      description: "Master AI tools, build games, and discover your superpowers",
      weeks: [
        {
          range: "Weeks 1-4",
          title: "Master the AI Toolkit",
          details: [
            "Learn 20+ professional AI tools (ChatGPT, Midjourney, Claude, DALL-E, etc.)",
            "Create viral social media campaigns",
            "Design product mockups and presentations",
            "Build personal brand portfolio"
          ]
        },
        {
          range: "Weeks 5-8",
          title: "No-Code Game Development",
          details: [
            "Build 5 playable games (platformer, puzzle, strategy, endless runner)",
            "Learn game mechanics and UX design",
            "Publish games friends can actually play",
            "Master visual design basics"
          ]
        },
        {
          range: "Weeks 9-12",
          title: "AI Fundamentals & Prompt Engineering",
          details: [
            "Understand how AI actually works",
            "Master prompt engineering basics",
            "Create AI-powered portfolio website",
            "Present final project to cohort"
          ]
        }
      ],
      outcomes: [
        "10+ shareable projects",
        "Confidence using professional AI tools",
        "Foundation for real applications",
        "Certificate: AI Explorer Certified"
      ],
      students: "4,283 students completed"
    },
    {
      id: 2,
      phase: "Phase 2",
      title: "AI Builder Pro",
      duration: "5 Months (20 Weeks)",
      ageRange: "Ages 10-16",
      icon: Crown,
      color: "from-purple-500 to-pink-500",
      bgColor: "from-purple-50 to-pink-50",
      description: "Build production apps, master automation, and create real solutions",
      weeks: [
        {
          range: "Months 1-3",
          title: "Professional App Development",
          details: [
            "Build 15+ production-ready applications",
            "AI Customer Service Chatbot",
            "Automated Content Generator",
            "Smart Email Assistant & Meeting Summarizer",
            "Invoice Tracker & Price Comparison Tool",
            "Social Media Analyzer & more"
          ]
        },
        {
          range: "Months 4-5",
          title: "Automation & Advanced Prompts",
          details: [
            "Create business automation systems",
            "Build workflows that run 24/7",
            "Master meta-prompting and custom GPTs",
            "E-commerce, content, and lead automation",
            "Deploy full-stack application online"
          ]
        }
      ],
      outcomes: [
        "25+ working applications in portfolio",
        "8 apps hosted online with real URLs",
        "Automation skills worth $75-200/hr",
        "Certificate: AI Builder Professional"
      ],
      students: "2,847 students advanced here"
    },
    {
      id: 3,
      phase: "Phase 3",
      title: "AI Engineer Elite",
      duration: "15 Months (60 Weeks)",
      ageRange: "Ages 12-18",
      icon: Zap,
      color: "from-orange-500 to-red-500",
      bgColor: "from-orange-50 to-red-50",
      description: "Master real programming, data science, and machine learning",
      weeks: [
        {
          range: "Months 1-4",
          title: "Real Programming Foundations",
          details: [
            "Python from scratch (fundamentals to advanced)",
            "SQL & Database Management",
            "Build 20+ applications (stock analyzer, weather predictor, finance tracker)",
            "Object-oriented programming & design patterns"
          ]
        },
        {
          range: "Months 5-8",
          title: "Data Science & Analytics",
          details: [
            "Statistics, probability, and hypothesis testing",
            "Data cleaning, analysis, and visualization",
            "Business analytics dashboard",
            "Social media, sports, and climate data projects",
            "Time series & predictive analytics"
          ]
        },
        {
          range: "Months 9-15",
          title: "Machine Learning & Deep Learning",
          details: [
            "Machine Learning: Supervised & unsupervised learning",
            "Deep Learning: Neural networks, CNNs, RNNs",
            "Natural Language Processing",
            "Computer Vision & Generative AI",
            "Original AI Research Capstone Project"
          ]
        }
      ],
      outcomes: [
        "50+ projects including full ML/DL portfolio",
        "Skills worth $80-120K/year entry-level",
        "Published research paper",
        "Certificate: AI Engineer Elite"
      ],
      students: "1,094 students became AI engineers"
    }
  ];

  // Resolve active phase icon component for safe JSX usage
  const ActiveIcon = phases[activePhase].icon;

  return (
    <section id="curriculum" className="py-20 bg-gradient-to-b from-white via-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-100 to-blue-100 text-purple-700 px-4 py-2 rounded-full text-sm font-semibold mb-6">
            <Target size={16} />
            Complete Curriculum
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            The Complete{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-blue-600 to-orange-600">
              32-Month Roadmap
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            A proven, step-by-step curriculum where every phase builds on the last. See exactly what your child will learn and build at each stage.
          </p>
        </motion.div>

        {/* Phase Selector Tabs */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {phases.map((phase, index) => {
            const Icon = phase.icon;
            return (
              <motion.button
                key={phase.id}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActivePhase(index)}
                className={`
                  px-6 py-4 rounded-2xl font-bold transition-all duration-300 flex items-center gap-3
                  ${activePhase === index
                    ? `bg-gradient-to-r ${phase.color} text-white shadow-lg scale-105`
                    : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-gray-300'}
                `}
              >
                <Icon size={24} />
                <div className="text-left">
                  <div className="text-xs font-semibold opacity-90">{phase.phase}</div>
                  <div className="text-base">{phase.title}</div>
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* Active Phase Content */}
        <motion.div
          key={activePhase}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-3xl shadow-2xl overflow-hidden border-2 border-gray-100"
        >
          {/* Phase Header */}
          <div className={`bg-gradient-to-r ${phases[activePhase].color} p-8 text-white`}>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="flex items-center gap-4">
                <div className="bg-white/20 backdrop-blur-sm p-4 rounded-2xl">
                  <ActiveIcon size={40} />
                </div>
                <div>
                  <div className="text-sm font-semibold opacity-90 mb-1">{phases[activePhase].phase}</div>
                  <h3 className="text-4xl font-bold mb-2">{phases[activePhase].title}</h3>
                  <p className="text-lg opacity-90">{phases[activePhase].description}</p>
                </div>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 text-center min-w-[180px]">
                <div className="flex items-center gap-2 mb-2">
                  <Clock size={20} />
                  <span className="font-bold">{phases[activePhase].duration}</span>
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <Users size={20} />
                  <span className="text-sm">{phases[activePhase].ageRange}</span>
                </div>
                <div className="text-xs opacity-90 mt-2">{phases[activePhase].students}</div>
              </div>
            </div>
          </div>

          {/* Curriculum Details */}
          <div className="p-8">
            <div className="space-y-8">
              {phases[activePhase].weeks.map((week, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className={`bg-gradient-to-r ${phases[activePhase].bgColor} rounded-2xl p-6 border-2 border-gray-100`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`bg-gradient-to-r ${phases[activePhase].color} text-white px-4 py-2 rounded-xl font-bold text-sm whitespace-nowrap`}>
                      {week.range}
                    </div>
                    <div className="flex-1">
                      <h4 className="text-2xl font-bold text-gray-900 mb-4">{week.title}</h4>
                      <ul className="space-y-3">
                        {week.details.map((detail, i) => (
                          <li key={i} className="flex items-start gap-3">
                            <CheckCircle size={20} className={`flex-shrink-0 mt-0.5 text-green-600`} />
                            <span className="text-gray-700">{detail}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Phase Outcomes */}
            <div className="mt-8 bg-gray-50 rounded-2xl p-6 border-2 border-gray-200">
              <h4 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Rocket size={24} className="text-green-600" />
                What Your Child Will Achieve:
              </h4>
              <div className="grid md:grid-cols-2 gap-4">
                {phases[activePhase].outcomes.map((outcome, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className={`bg-gradient-to-r ${phases[activePhase].color} p-2 rounded-lg`}>
                      <CheckCircle size={16} className="text-white" />
                    </div>
                    <span className="text-gray-700 font-medium">{outcome}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Next Phase Teaser */}
            {activePhase < phases.length - 1 && (
              <div className="mt-8 bg-gradient-to-r from-purple-100 to-blue-100 rounded-2xl p-6 border-2 border-purple-200">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-semibold text-purple-700 mb-1">NEXT PHASE</div>
                    <h4 className="text-2xl font-bold text-gray-900">{phases[activePhase + 1].title}</h4>
                    <p className="text-gray-600 mt-2">{phases[activePhase + 1].description}</p>
                  </div>
                  <button
                    onClick={() => setActivePhase(activePhase + 1)}
                    className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:scale-105 transition-transform"
                  >
                    Preview
                    <ArrowRight size={20} />
                  </button>
                </div>
              </div>
            )}

            {/* Alumni Network Teaser (after Phase 3) */}
            {activePhase === phases.length - 1 && (
              <div className="mt-8 bg-gradient-to-r from-green-100 to-emerald-100 rounded-2xl p-6 border-2 border-green-200">
                <div className="flex items-center gap-4">
                  <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-4 rounded-2xl">
                    <Brain size={32} className="text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-2xl font-bold text-gray-900 mb-2">Lifetime Alumni Network</h4>
                    <p className="text-gray-700">
                      After completing Phase 3, join our exclusive alumni community with internship placement, 
                      freelance opportunities, continued learning, and networking events. Your journey doesn't end—it evolves!
                    </p>
                  </div>
                </div>
              </div>
            )}
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
            Ready to start your child's journey? Everyone begins with Phase 1.
          </p>
          <motion.button
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => window.location.href = '/auth?mode=signup'}
            className="bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 text-white font-bold px-8 py-4 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300"
          >
            Start Phase 1 Free Trial
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default CurriculumJourney;

