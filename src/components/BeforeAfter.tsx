import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';

interface Project {
  before: {
    title: string;
    image: string;
    description: string;
    emoji: string;
  };
  after: {
    title: string;
    image: string;
    description: string;
    emoji: string;
  };
  studentName: string;
  age: number;
  timeframe: string;
}

const BeforeAfter = () => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [currentProjectIndex, setCurrentProjectIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  // Aligned with the 32-Month Roadmap milestones: 2 weeks, 2 months, 1 year, etc.
  const projects: Project[] = [
    {
      studentName: "Emma",
      age: 10,
      timeframe: "2 weeks",
      before: {
        title: "First Animation",
        emoji: "🟦",
        image: "A simple blue square",
        description: "Basic shapes moving left and right"
      },
      after: {
        title: "Interactive Space Game",
        emoji: "🚀",
        image: "Complete game with scoring",
        description: "Full game with collision detection, scoring, and multiple levels"
      }
    },
    {
      studentName: "Lucas",
      age: 12,
      timeframe: "2 months",
      before: {
        title: "Hello World",
        emoji: "👋",
        image: "Text on screen",
        description: "Simple text display program"
      },
      after: {
        title: "AI Chatbot Assistant",
        emoji: "🤖",
        image: "Smart AI interface",
        description: "Natural language processing chatbot that helps with homework"
      }
    },
    {
      studentName: "Sophia",
      age: 9,
      timeframe: "2 weeks",
      before: {
        title: "Color Changer",
        emoji: "🎨",
        image: "Button that changes colors",
        description: "Click button to change background color"
      },
      after: {
        title: "Art Generator App",
        emoji: "✨",
        image: "AI-powered art creation",
        description: "Uses AI to generate custom artwork based on descriptions"
      }
    },
    {
      studentName: "Aiden",
      age: 11,
      timeframe: "1 year",
      before: {
        title: "Simple Calculator",
        emoji: "🔢",
        image: "Basic math operations",
        description: "Calculator with add and subtract functions"
      },
      after: {
        title: "Smart Budget Tracker",
        emoji: "💰",
        image: "AI-powered expense manager",
        description: "Tracks expenses, sets budgets, and predicts spending patterns"
      }
    },
    {
      studentName: "Mia",
      age: 13,
      timeframe: "2 months",
      before: {
        title: "Photo Gallery",
        emoji: "📸",
        image: "Static image display",
        description: "Simple slideshow of images"
      },
      after: {
        title: "Social Media Platform",
        emoji: "📱",
        image: "Full-featured social app",
        description: "User profiles, posts, comments, likes, and real-time chat"
      }
    },
    {
      studentName: "Noah",
      age: 10,
      timeframe: "2 weeks",
      before: {
        title: "Music Player Buttons",
        emoji: "▶️",
        image: "Play and pause controls",
        description: "Simple music control buttons"
      },
      after: {
        title: "AI Music Recommender",
        emoji: "🎵",
        image: "Smart playlist generator",
        description: "AI analyzes mood and preferences to create custom playlists"
      }
    }
  ];

  const currentProject = projects[currentProjectIndex];

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = (x / rect.width) * 100;
    setSliderPosition(Math.min(Math.max(percentage, 0), 100));
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.touches[0].clientX - rect.left;
    const percentage = (x / rect.width) * 100;
    setSliderPosition(Math.min(Math.max(percentage, 0), 100));
  };

  const nextProject = () => {
    setCurrentProjectIndex((prev) => (prev + 1) % projects.length);
    setSliderPosition(50);
  };

  const prevProject = () => {
    setCurrentProjectIndex((prev) => (prev - 1 + projects.length) % projects.length);
    setSliderPosition(50);
  };

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
            Real Student Progress
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            From First Click to{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              Full Apps
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            See the transformation. Drag the slider to compare Day 1 with 2-4 weeks later—projects get advanced quickly, and there are many!
          </p>
        </motion.div>

        {/* Student Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center gap-3 bg-white rounded-2xl shadow-lg px-6 py-4">
            <div className="text-4xl">👨‍💻</div>
            <div className="text-left">
              <div className="font-bold text-lg text-gray-900">{currentProject.studentName}, age {currentProject.age}</div>
              <div className="text-sm text-gray-600">Progress in {currentProject.timeframe}</div>
            </div>
          </div>
        </motion.div>

        {/* Before/After Slider */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative max-w-4xl mx-auto"
        >
          <div
            className="relative w-full aspect-video bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl overflow-hidden shadow-2xl cursor-ew-resize select-none"
            onMouseMove={handleMouseMove}
            onTouchMove={handleTouchMove}
            onMouseDown={() => setIsDragging(true)}
            onMouseUp={() => setIsDragging(false)}
            onMouseLeave={() => setIsDragging(false)}
            onTouchStart={() => setIsDragging(true)}
            onTouchEnd={() => setIsDragging(false)}
          >
            {/* Before (Left Side) */}
            <div className="absolute inset-0 bg-gradient-to-br from-red-100 to-orange-100 flex flex-col items-center justify-center p-12">
              <div className="text-8xl mb-6">{currentProject.before.emoji}</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">{currentProject.before.title}</h3>
              <p className="text-gray-600 text-center">{currentProject.before.description}</p>
              <div className="absolute top-4 left-4 bg-red-500 text-white px-4 py-2 rounded-full font-bold text-sm shadow-lg">
                Week 1
              </div>
            </div>

            {/* After (Right Side) - Clipped */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-br from-green-100 to-emerald-100 flex flex-col items-center justify-center p-12"
              style={{
                clipPath: `inset(0 0 0 ${sliderPosition}%)`
              }}
            >
              <div className="text-8xl mb-6">{currentProject.after.emoji}</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">{currentProject.after.title}</h3>
              <p className="text-gray-600 text-center">{currentProject.after.description}</p>
              <div className="absolute top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-full font-bold text-sm shadow-lg">
                {currentProject.timeframe} later
              </div>
            </motion.div>

            {/* Slider Handle */}
            <div
              className="absolute top-0 bottom-0 w-1 bg-white shadow-2xl"
              style={{ left: `${sliderPosition}%` }}
            >
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-2xl flex items-center justify-center border-4 border-blue-500">
                <ChevronLeft size={16} className="text-blue-500 -ml-1" />
                <ChevronRight size={16} className="text-blue-500 -mr-1" />
              </div>
            </div>

            {/* Labels */}
            <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-lg shadow-lg">
              <div className="text-xs font-bold text-gray-500 uppercase">Before</div>
            </div>
            <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-lg shadow-lg">
              <div className="text-xs font-bold text-gray-500 uppercase">After</div>
            </div>
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={prevProject}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white hover:bg-gray-100 p-3 rounded-full shadow-lg transition-all duration-200 hover:scale-110"
            aria-label="Previous project"
          >
            <ChevronLeft size={24} className="text-gray-700" />
          </button>
          <button
            onClick={nextProject}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white hover:bg-gray-100 p-3 rounded-full shadow-lg transition-all duration-200 hover:scale-110"
            aria-label="Next project"
          >
            <ChevronRight size={24} className="text-gray-700" />
          </button>

          {/* Project Indicators */}
          <div className="flex justify-center gap-2 mt-6">
            {projects.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setCurrentProjectIndex(index);
                  setSliderPosition(50);
                }}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === currentProjectIndex
                    ? 'w-8 bg-blue-600'
                    : 'w-2 bg-gray-300 hover:bg-gray-400'
                }`}
                aria-label={`View project ${index + 1}`}
              />
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
            Your child could be next. Start their transformation today.
          </p>
          <motion.button
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => window.location.href = '/auth?mode=signup'}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold px-8 py-4 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300"
          >
            Begin Your Child's Journey
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default BeforeAfter;


