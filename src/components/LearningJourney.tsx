import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Sparkles,
  Code2,
  Brain,
  Rocket,
  Zap,
  Trophy,
  Target,
  Star,
  Award,
  Smartphone,
  Database,
  Cloud,
  Shield,
  TrendingUp
} from 'lucide-react';

const LearningJourney = () => {
  const [selectedMilestone, setSelectedMilestone] = useState<number | null>(null);

  const milestones = [
    {
      week: "Week 1",
      phase: "Phase 1",
      icon: Sparkles,
      title: "First AI Creation",
      description: "Use ChatGPT & DALL-E to create viral social media posts",
      project: "AI-Generated Brand Campaign",
      skills: ["Prompt Engineering", "AI Tools", "Creative Thinking"],
      color: "from-purple-500 to-pink-500",
      emoji: "✨"
    },
    {
      week: "Week 2",
      phase: "Phase 1",
      icon: Code2,
      title: "Visual Design with AI",
      description: "Create professional graphics using Midjourney & Canva AI",
      project: "Product Mockups & Presentations",
      skills: ["AI Art Generation", "Design Principles", "Visual Storytelling"],
      color: "from-blue-500 to-cyan-500",
      emoji: "🎨"
    },
    {
      week: "Week 4",
      phase: "Phase 1",
      icon: Trophy,
      title: "First Playable Game",
      description: "Build interactive games with no-code tools",
      project: "Platformer Game Friends Can Play",
      skills: ["Game Logic", "UX Design", "Problem Solving"],
      color: "from-green-500 to-emerald-500",
      emoji: "🎮"
    },
    {
      week: "Week 8",
      phase: "Phase 1",
      icon: Target,
      title: "AI Fundamentals",
      description: "Understand how AI actually works under the hood",
      project: "AI Ethics Research Paper",
      skills: ["Machine Learning Basics", "AI Ethics", "Critical Thinking"],
      color: "from-orange-500 to-red-500",
      emoji: "🧠"
    },
    {
      week: "Week 12",
      phase: "Phase 1",
      icon: Award,
      title: "First Portfolio Website",
      description: "Showcase all your projects in a professional portfolio",
      project: "Personal Brand Website",
      skills: ["Web Design", "Portfolio Building", "Public Speaking"],
      color: "from-indigo-500 to-purple-500",
      emoji: "🌐"
    },
    {
      week: "Month 4",
      phase: "Phase 2",
      icon: Brain,
      title: "First AI Chatbot",
      description: "Build an intelligent assistant that solves real problems",
      project: "Customer Service Bot",
      skills: ["Conversational AI", "User Flow", "Testing"],
      color: "from-pink-500 to-rose-500",
      emoji: "💬"
    },
    {
      week: "Month 5",
      phase: "Phase 2",
      icon: Zap,
      title: "Business Automation",
      description: "Create tools that automate real work",
      project: "Email Organizer & Auto-Responder",
      skills: ["Workflow Automation", "API Integration", "Efficiency"],
      color: "from-yellow-500 to-orange-500",
      emoji: "⚡"
    },
    {
      week: "Month 6",
      phase: "Phase 2",
      icon: Smartphone,
      title: "Mobile App Creator",
      description: "Build apps that work on phones and tablets",
      project: "Task Manager App",
      skills: ["Mobile Design", "Responsive Layouts", "App Publishing"],
      color: "from-teal-500 to-cyan-500",
      emoji: "📱"
    },
    {
      week: "Month 7",
      phase: "Phase 2",
      icon: Cloud,
      title: "Deploy Live Apps",
      description: "Put your apps online with real URLs",
      project: "8 Apps Deployed & Shareable",
      skills: ["Cloud Hosting", "Deployment", "Version Control"],
      color: "from-blue-600 to-indigo-600",
      emoji: "☁️"
    },
    {
      week: "Month 8",
      phase: "Phase 2",
      icon: TrendingUp,
      title: "Advanced Automation",
      description: "Build systems that run 24/7 automatically",
      project: "E-commerce Price Tracker",
      skills: ["Scheduling", "Data Scraping", "Meta-Prompting"],
      color: "from-green-600 to-teal-600",
      emoji: "📊"
    },
    {
      week: "Month 10",
      phase: "Phase 3",
      icon: Code2,
      title: "Real Python Programming",
      description: "Write actual code from scratch",
      project: "Stock Market Analyzer",
      skills: ["Python Fundamentals", "Variables", "Functions", "Loops"],
      color: "from-purple-600 to-pink-600",
      emoji: "🐍"
    },
    {
      week: "Month 12",
      phase: "Phase 3",
      icon: Database,
      title: "Database Management",
      description: "Store and retrieve data like a pro",
      project: "Personal Finance Tracker",
      skills: ["SQL", "Data Modeling", "CRUD Operations"],
      color: "from-orange-600 to-red-600",
      emoji: "🗄️"
    },
    {
      week: "Month 15",
      phase: "Phase 3",
      icon: TrendingUp,
      title: "Data Science Basics",
      description: "Analyze data and find patterns",
      project: "Social Media Analytics Dashboard",
      skills: ["Statistics", "Data Visualization", "Pandas", "NumPy"],
      color: "from-cyan-600 to-blue-600",
      emoji: "📈"
    },
    {
      week: "Month 18",
      phase: "Phase 3",
      icon: Brain,
      title: "Machine Learning",
      description: "Build AI models that learn from data",
      project: "Movie Recommendation System",
      skills: ["Supervised Learning", "Model Training", "Scikit-learn"],
      color: "from-pink-600 to-purple-600",
      emoji: "🤖"
    },
    {
      week: "Month 22",
      phase: "Phase 3",
      icon: Shield,
      title: "Deep Learning & Neural Networks",
      description: "Create advanced AI models",
      project: "Image Recognition App",
      skills: ["Neural Networks", "TensorFlow", "Computer Vision"],
      color: "from-indigo-600 to-purple-600",
      emoji: "🧬"
    },
    {
      week: "Month 26",
      phase: "Phase 3",
      icon: Sparkles,
      title: "Natural Language Processing",
      description: "Teach AI to understand human language",
      project: "Sentiment Analysis Tool",
      skills: ["NLP", "Text Processing", "Language Models"],
      color: "from-green-600 to-emerald-600",
      emoji: "💭"
    },
    {
      week: "Month 30",
      phase: "Phase 3",
      icon: Rocket,
      title: "Generative AI & LLMs",
      description: "Build systems like ChatGPT",
      project: "Custom AI Assistant",
      skills: ["Large Language Models", "Fine-tuning", "Prompt Engineering"],
      color: "from-yellow-600 to-orange-600",
      emoji: "🚀"
    },
    {
      week: "Month 32",
      phase: "Phase 3",
      icon: Trophy,
      title: "AI Research Capstone",
      description: "Original research project and publication",
      project: "Published Research Paper",
      skills: ["Research Methodology", "Scientific Writing", "Peer Review"],
      color: "from-red-600 to-pink-600",
      emoji: "🏆"
    }
  ];

  const phaseColors = {
    "Phase 1": "bg-blue-100 text-blue-700 border-blue-300",
    "Phase 2": "bg-purple-100 text-purple-700 border-purple-300",
    "Phase 3": "bg-orange-100 text-orange-700 border-orange-300"
  };

  return (
    <section className="py-24 bg-gradient-to-br from-gray-50 via-white to-blue-50 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-200 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-200 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-100 to-blue-100 text-purple-700 px-4 py-2 rounded-full text-sm font-semibold mb-6">
            <Rocket size={16} />
            Complete Learning Journey
          </div>
          <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            The Complete Journey • From First Click to{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600">
              AI Professional
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            See exactly what your child will build at each milestone over 32 months. Every project is real, shareable, and portfolio-ready.
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical Line */}
          <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-purple-200 via-blue-200 to-orange-200" />

          {/* Milestones */}
          <div className="space-y-12">
            {milestones.map((milestone, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`relative flex items-center ${
                  index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                }`}
              >
                {/* Timeline Dot */}
                <div className="absolute left-8 md:left-1/2 w-4 h-4 bg-white border-4 border-blue-600 rounded-full transform -translate-x-1/2 z-10" />

                {/* Content Card */}
                <div className={`flex-1 ml-20 md:ml-0 ${index % 2 === 0 ? 'md:pr-12' : 'md:pl-12'}`}>
                  <motion.div
                    whileHover={{ scale: 1.02, y: -5 }}
                    onClick={() => setSelectedMilestone(selectedMilestone === index ? null : index)}
                    className={`bg-white rounded-2xl shadow-xl p-6 cursor-pointer border-2 border-transparent hover:border-blue-400 transition-all ${
                      selectedMilestone === index ? 'ring-4 ring-blue-200' : ''
                    }`}
                  >
                    <div className="flex items-start gap-4 mb-4">
                      <div className={`p-3 rounded-xl bg-gradient-to-br ${milestone.color} text-white`}>
                        <milestone.icon className="w-6 h-6" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-sm font-bold text-gray-500">{milestone.week}</span>
                          <span className={`text-xs px-2 py-1 rounded-full border ${phaseColors[milestone.phase as keyof typeof phaseColors]}`}>
                            {milestone.phase}
                          </span>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2 flex items-center gap-2">
                          <span className="text-3xl">{milestone.emoji}</span>
                          {milestone.title}
                        </h3>
                        <p className="text-gray-600 mb-3">{milestone.description}</p>
                        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-3 mb-3">
                          <div className="text-sm font-semibold text-blue-900 mb-1">Project:</div>
                          <div className="text-blue-700">{milestone.project}</div>
                        </div>
                      </div>
                    </div>

                    {/* Skills - Always visible */}
                    <div className="flex flex-wrap gap-2">
                      {milestone.skills.map((skill, i) => (
                        <span
                          key={i}
                          className="text-xs px-3 py-1 bg-gray-100 text-gray-700 rounded-full font-medium"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                </div>

                {/* Empty space on the other side (for desktop) */}
                <div className="hidden md:block flex-1" />
              </motion.div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <button
            onClick={() => window.location.href = '/auth?mode=signup'}
            className="group bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold px-12 py-5 rounded-2xl transform hover:scale-105 transition-all duration-200 shadow-2xl hover:shadow-3xl text-lg inline-flex items-center gap-3"
          >
            <Rocket className="w-6 h-6 group-hover:animate-bounce" />
            Start Your Child's 32-Month Journey
            <Rocket className="w-6 h-6 group-hover:animate-bounce" />
          </button>
          <p className="text-sm text-gray-500 mt-4">
            ✨ Week 1 projects start immediately after signup
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default LearningJourney;

