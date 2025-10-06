import React, { useState, useEffect } from 'react';
import { Play, X, Sparkles, Zap, Code2, Rocket } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { motion, useScroll, useTransform } from 'framer-motion';

const Hero = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [typedCode, setTypedCode] = useState('');
  const [codeLineIndex, setCodeLineIndex] = useState(0);
  const [showOutput, setShowOutput] = useState(false);
  const [liveCount, setLiveCount] = useState(2847);

  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 300], [0, -50]);
  const y2 = useTransform(scrollY, [0, 300], [0, 50]);
  const opacity = useTransform(scrollY, [0, 200], [1, 0]);

  // Code lines for the animated playground
  const codeLines = [
    'import ai_helper',
    '',
    'def analyze_image(image):',
    '    result = ai_helper.detect_objects(image)',
    '    return f"Found: {result}"',
    '',
    'photo = "my_dog.jpg"',
    'print(analyze_image(photo))'
  ];

  const fullCode = codeLines.join('\n');

  // Typing animation effect
  useEffect(() => {
    if (typedCode.length < fullCode.length) {
      const timeout = setTimeout(() => {
        setTypedCode(fullCode.slice(0, typedCode.length + 1));
      }, 50);
      return () => clearTimeout(timeout);
    } else if (!showOutput) {
      setTimeout(() => setShowOutput(true), 500);
    }
  }, [typedCode, fullCode, showOutput]);

  // Live counter animation
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveCount(prev => prev + Math.floor(Math.random() * 3));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleGetStarted = () => {
    if (user) {
      navigate('/dashboard');
    } else {
      navigate('/auth?mode=signup');
    }
  };

  const handleWatchStories = () => {
    setShowVideoModal(true);
  };

  // Particle animation
  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    size: Math.random() * 4 + 2,
    x: Math.random() * 100,
    y: Math.random() * 100,
    duration: Math.random() * 20 + 10,
    delay: Math.random() * 5
  }));

  return (
    <section className="relative min-h-screen pt-20 overflow-hidden">
      {/* Animated Gradient Mesh Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-blue-50 to-cyan-50">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(147,51,234,0.1),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_60%,rgba(59,130,246,0.1),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_80%,rgba(6,182,212,0.1),transparent_50%)]"></div>
      </div>

      {/* Floating Particles */}
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full bg-gradient-to-r from-purple-400 to-blue-400 opacity-30"
          style={{
            width: particle.size,
            height: particle.size,
            left: `${particle.x}%`,
            top: `${particle.y}%`,
          }}
          animate={{
            y: [0, -30, 0],
            x: [0, Math.random() * 20 - 10, 0],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            delay: particle.delay,
          }}
        />
      ))}

      <motion.div 
        className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20"
        style={{ opacity }}
      >
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Text Content */}
          <motion.div 
            className="space-y-8 z-10"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Live Counter Badge */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
              className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-green-200 rounded-full px-4 py-2 shadow-lg"
            >
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-semibold text-gray-700">
                <span className="text-green-600">{liveCount.toLocaleString()}</span> kids coding right now
              </span>
            </motion.div>

            <div className="space-y-6">
              <motion.h1 
                className="text-4xl sm:text-5xl lg:text-7xl font-bold text-gray-900 leading-tight"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
              >
                Your Child's First{' '}
                <span className="relative inline-block">
                  <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600">
                    AI Project
                  </span>
                  <motion.span
                    className="absolute inset-0 bg-gradient-to-r from-purple-200 via-blue-200 to-cyan-200 blur-xl"
                    animate={{
                      opacity: [0.5, 0.8, 0.5],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                    }}
                  />
                </span>
                {' '}in 30 Minutes
              </motion.h1>

              <motion.p 
                className="text-lg sm:text-xl text-gray-600 max-w-xl leading-relaxed"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.6 }}
              >
                The coding platform where <strong className="text-purple-600">100,000+ kids</strong> have built real AI applications—no experience needed
              </motion.p>

              <motion.p 
                className="text-base text-gray-700 max-w-2xl leading-relaxed"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8, duration: 0.6 }}
              >
                While other kids watch videos, <strong className="text-blue-600">your child will build:</strong> AI chatbots, personalized games, and apps that solve real problems
              </motion.p>
            </div>

            {/* CTA Buttons */}
            <motion.div 
              className="flex flex-col sm:flex-row gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.6 }}
            >
              <motion.button
                onClick={handleGetStarted}
                className="group relative bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 text-white font-bold px-8 py-4 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  <Rocket size={20} />
                  Build Your First AI Project
                </span>
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600"
                  initial={{ x: '100%' }}
                  whileHover={{ x: 0 }}
                  transition={{ duration: 0.3 }}
                />
              </motion.button>

              <motion.button
                onClick={handleWatchStories}
                className="group border-2 border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white font-semibold px-8 py-4 rounded-xl flex items-center justify-center gap-2 transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                <Play size={20} className="group-hover:animate-pulse" />
                <span>Watch Success Stories</span>
              </motion.button>
            </motion.div>

            {/* Trust Indicators */}
            <motion.div 
              className="pt-8 space-y-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2, duration: 0.6 }}
            >
              <div className="flex items-center gap-4 flex-wrap">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 1.3 + i * 0.1 }}
                    >
                      <Sparkles className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                    </motion.div>
                  ))}
                  <span className="ml-2 text-sm font-semibold text-gray-700">4.9/5.0 from 12,847 parents</span>
                </div>
            </div>

              <div className="flex items-center gap-6 text-gray-400 text-sm font-medium flex-wrap">
                <div className="flex items-center gap-2">
                  <img src="/logos/cnn.svg" alt="CNN" className="h-6 opacity-60" onError={(e) => e.currentTarget.style.display = 'none'} />
                  <span>CNN</span>
              </div>
                <div className="flex items-center gap-2">
                  <Code2 size={16} />
                <span>TechCrunch</span>
                </div>
                <div className="flex items-center gap-2">
                  <Zap size={16} />
                <span>Forbes</span>
                </div>
                <div className="flex items-center gap-1 text-orange-600">
                  <span className="text-xl">🏆</span>
                  <span className="font-semibold">Parent's Choice Gold</span>
              </div>
            </div>
            </motion.div>
          </motion.div>

          {/* Right Column - Interactive Code Playground */}
          <motion.div 
            className="relative z-10"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            style={{ y: y1 }}
          >
            {/* Main Code Editor */}
            <div className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-2xl p-6 shadow-2xl border border-gray-700">
              {/* Editor Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-gray-400 text-sm ml-4 font-mono">my_first_ai.py</span>
              </div>
                <motion.div
                  animate={{ opacity: [1, 0.5, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-green-400 text-xs flex items-center gap-1"
                >
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  Running...
                </motion.div>
            </div>

              {/* Code Area */}
              <div className="bg-black/30 rounded-lg p-4 font-mono text-sm min-h-[300px]">
                <pre className="text-green-400 whitespace-pre-wrap">
                  {typedCode.split('\n').map((line, i) => (
                    <div key={i} className="leading-relaxed">
                      <span className="text-gray-600 select-none mr-4">{i + 1}</span>
                      <span className={
                        line.includes('import') || line.includes('def') ? 'text-purple-400' :
                        line.includes('return') || line.includes('print') ? 'text-pink-400' :
                        line.includes('"') || line.includes("'") ? 'text-green-300' :
                        line.includes('analyze_image') || line.includes('detect_objects') ? 'text-blue-400' :
                        'text-green-400'
                      }>
                        {line}
                      </span>
                      {i === typedCode.split('\n').length - 1 && typedCode.length < fullCode.length && (
                        <motion.span
                          animate={{ opacity: [1, 0] }}
                          transition={{ duration: 0.5, repeat: Infinity }}
                          className="inline-block w-2 h-4 bg-green-400 ml-1"
                        />
                      )}
                    </div>
                  ))}
                </pre>
            </div>
            
              {/* Output Panel */}
              {showOutput && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mt-4 bg-black/40 rounded-lg p-4 border-t border-green-400/30"
                >
                  <div className="text-gray-400 text-xs mb-2">Output:</div>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="flex items-start gap-3"
                  >
                    <div className="text-2xl">🐕</div>
                    <div className="flex-1">
                      <div className="text-green-400 font-mono text-sm">Found: Golden Retriever (98% confidence)</div>
                      <div className="text-blue-400 font-mono text-xs mt-1">✨ AI detection complete!</div>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </div>

            {/* Floating Achievement Cards */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="absolute -top-6 -right-6 bg-gradient-to-r from-purple-600 to-blue-600 text-white p-4 rounded-xl shadow-2xl"
            >
              <div className="flex items-center gap-2">
                <Sparkles size={20} />
                <div>
                  <div className="text-sm font-bold">Just completed!</div>
                  <div className="text-xs opacity-90">Image Recognition AI</div>
            </div>
          </div>
            </motion.div>

            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 3, repeat: Infinity, delay: 1 }}
              className="absolute -bottom-6 -left-6 bg-gradient-to-r from-orange-500 to-pink-500 text-white p-4 rounded-xl shadow-2xl"
            >
              <div className="flex items-center gap-2">
                <Zap size={20} />
                <div>
                  <div className="text-sm font-bold">Level 12 Unlocked!</div>
                  <div className="text-xs opacity-90">AI Engineer Track</div>
        </div>
      </div>
            </motion.div>

            {/* Background Glow Effect */}
            <motion.div
              className="absolute -z-10 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
              animate={{
                scale: [1, 1.1, 1],
                opacity: [0.3, 0.5, 0.3],
              }}
              transition={{ duration: 4, repeat: Infinity }}
            >
              <div className="w-96 h-96 bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 rounded-full blur-3xl"></div>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      {/* Video Modal */}
      {showVideoModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4"
          onClick={() => setShowVideoModal(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="relative w-full max-w-4xl bg-gray-900 rounded-2xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowVideoModal(false)}
              className="absolute top-4 right-4 z-10 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all hover:scale-110"
              aria-label="Close video"
            >
              <X size={24} />
            </button>
            
            <div className="aspect-video">
              <iframe
                width="100%"
                height="100%"
                src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1"
                title="CodeKid Success Stories"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              ></iframe>
            </div>
            
            <div className="p-6 bg-gradient-to-r from-purple-900/50 to-blue-900/50 backdrop-blur-sm">
              <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                <Sparkles className="text-yellow-400" />
                Real Kids, Real Results
              </h3>
              <p className="text-gray-300">Watch how 100,000+ kids went from "What's coding?" to building real AI apps!</p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </section>
  );
};

export default Hero;
