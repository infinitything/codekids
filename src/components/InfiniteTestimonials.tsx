import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Sparkles, TrendingUp, Award } from 'lucide-react';

interface Testimonial {
  id: number;
  name: string;
  age: number;
  photo: string;
  parentName: string;
  role: string;
  location: string;
  story: string;
  achievement: string;
  projectImage: string;
  rating: number;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Emma Chen",
    age: 10,
    photo: "👧",
    parentName: "Sarah Chen",
    role: "Marketing Director",
    location: "San Francisco, CA",
    story: "Completed Phase 1 and 2. Built a chatbot that helps her dad organize emails—he actually uses it every day at his startup! Now advancing to Phase 3 to learn Python.",
    achievement: "Phase 2 Graduate • 15 Apps Built",
    projectImage: "🤖",
    rating: 5
  },
  {
    id: 2,
    name: "Marcus Johnson",
    age: 12,
    photo: "👦",
    parentName: "Jennifer Williams",
    role: "Software Engineer",
    location: "Austin, TX",
    story: "Started with zero coding knowledge. After Phase 1, he built 5 games. Now in Phase 2, he's creating apps that solve real problems. His automation workflow saves me 3 hours a week!",
    achievement: "Phase 2 • Freelancing at $50/hr",
    projectImage: "🌦️",
    rating: 5
  },
  {
    id: 3,
    name: "Sophia Park",
    age: 14,
    photo: "👧",
    parentName: "Dr. Lisa Park",
    role: "Pediatrician",
    location: "Boston, MA",
    story: "Completed all 3 phases! Built an AI diagnostic helper for my clinic. Got accepted to MIT's AI4ALL summer program thanks to her portfolio. Now consulting for startups on weekends.",
    achievement: "Elite Graduate • $12K earned",
    projectImage: "✨",
    rating: 5
  },
  {
    id: 4,
    name: "Liam",
    age: 11,
    photo: "👦",
    parentName: "Michael Johnson",
    role: "Dad",
    location: "Seattle, WA",
    story: "Built a game that teaches kids about recycling. His school now uses it in class!",
    achievement: "Published on school website",
    projectImage: "♻️",
    rating: 5
  },
  {
    id: 5,
    name: "Olivia",
    age: 13,
    photo: "👧",
    parentName: "Amanda Rodriguez",
    role: "Teacher",
    location: "Miami, FL",
    story: "Created an AI art generator that combines her photos into unique styles. Sold prints online!",
    achievement: "Youngest seller in local art market",
    projectImage: "🎨",
    rating: 5
  },
  {
    id: 6,
    name: "Noah",
    age: 10,
    photo: "👦",
    parentName: "David Kim",
    role: "Engineer",
    location: "San Diego, CA",
    story: "Built a voice assistant for his grandma who has trouble with technology.",
    achievement: "Family's favorite helper",
    projectImage: "🎤",
    rating: 5
  }
];

const InfiniteTestimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setDirection(1);
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0
    })
  };

  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset: number, velocity: number) => {
    return Math.abs(offset) * velocity;
  };

  const paginate = (newDirection: number) => {
    setDirection(newDirection);
    setCurrentIndex((prev) => (prev + newDirection + testimonials.length) % testimonials.length);
  };

  const current = testimonials[currentIndex];
  const next = testimonials[(currentIndex + 1) % testimonials.length];
  const prev = testimonials[(currentIndex - 1 + testimonials.length) % testimonials.length];

  return (
    <section className="py-20 bg-gradient-to-b from-white to-purple-50 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(147,51,234,0.1),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_70%,rgba(59,130,246,0.1),transparent_50%)]"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-700 px-4 py-2 rounded-full text-sm font-semibold mb-6">
            <TrendingUp size={16} />
            Real Transformation Stories
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Watch Your Child <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">Transform</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            These kids started with zero coding experience. Here's what they built in just weeks.
          </p>
        </motion.div>

        {/* Testimonial Carousel */}
        <div className="relative h-[500px] mb-12">
          <AnimatePresence initial={false} custom={direction}>
            <motion.div
              key={currentIndex}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 }
              }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={1}
              onDragEnd={(e, { offset, velocity }) => {
                const swipe = swipePower(offset.x, velocity.x);

                if (swipe < -swipeConfidenceThreshold) {
                  paginate(1);
                } else if (swipe > swipeConfidenceThreshold) {
                  paginate(-1);
                }
              }}
              className="absolute w-full"
            >
              <div className="max-w-5xl mx-auto">
                <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
                  <div className="grid md:grid-cols-2">
                    {/* Left Side - Story */}
                    <div className="p-8 md:p-12 flex flex-col justify-between">
                      <div>
                        {/* Rating */}
                        <div className="flex gap-1 mb-6">
                          {[...Array(current.rating)].map((_, i) => (
                            <motion.div
                              key={i}
                              initial={{ opacity: 0, scale: 0 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: i * 0.1 }}
                            >
                              <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                            </motion.div>
                          ))}
                        </div>

                        {/* Quote */}
                        <div className="mb-8">
                          <p className="text-2xl font-bold text-gray-900 mb-4 leading-relaxed">
                            "{current.story}"
                          </p>
                          
                          {/* Achievement Badge */}
                          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-100 to-blue-100 px-4 py-2 rounded-full">
                            <Award size={16} className="text-purple-600" />
                            <span className="text-sm font-semibold text-purple-700">
                              {current.achievement}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Parent Info */}
                      <div className="flex items-center gap-4">
                        <div className="flex-1">
                          <div className="font-bold text-gray-900">{current.parentName}</div>
                          <div className="text-sm text-gray-600">{current.role}</div>
                          <div className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                            <span>📍</span> {current.location}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Right Side - Project Showcase */}
                    <div className="bg-gradient-to-br from-purple-500 via-blue-500 to-cyan-500 p-8 md:p-12 flex flex-col items-center justify-center text-white relative overflow-hidden">
                      {/* Animated Background */}
                      <motion.div
                        className="absolute inset-0 opacity-20"
                        animate={{
                          backgroundPosition: ['0% 0%', '100% 100%'],
                        }}
                        transition={{
                          duration: 20,
                          repeat: Infinity,
                          repeatType: "reverse"
                        }}
                        style={{
                          backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
                          backgroundSize: '50px 50px',
                        }}
                      />

                      <div className="relative z-10 text-center">
                        {/* Child Avatar */}
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: "spring", stiffness: 200 }}
                          className="text-8xl mb-6 animate-bounce"
                          style={{ animationDuration: '3s' }}
                        >
                          {current.photo}
                        </motion.div>

                        {/* Child Name & Age */}
                        <h3 className="text-3xl font-bold mb-2">{current.name}, age {current.age}</h3>

                        {/* Project Preview */}
                        <div className="mt-8 bg-white/20 backdrop-blur-sm rounded-2xl p-6 border border-white/30">
                          <div className="text-sm uppercase tracking-wider font-semibold mb-3 opacity-90">
                            Built This Project:
                          </div>
                          <div className="text-6xl mb-4">{current.projectImage}</div>
                          <div className="flex items-center justify-center gap-2">
                            <Sparkles size={16} />
                            <span className="text-sm font-medium">AI-Powered</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation Arrows */}
          <div className="absolute inset-y-0 left-0 flex items-center">
            <button
              onClick={() => paginate(-1)}
              className="ml-4 bg-white hover:bg-gray-100 text-gray-800 p-3 rounded-full shadow-lg transition-all hover:scale-110 active:scale-95"
              aria-label="Previous testimonial"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          </div>
          <div className="absolute inset-y-0 right-0 flex items-center">
            <button
              onClick={() => paginate(1)}
              className="mr-4 bg-white hover:bg-gray-100 text-gray-800 p-3 rounded-full shadow-lg transition-all hover:scale-110 active:scale-95"
              aria-label="Next testimonial"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        {/* Progress Dots */}
        <div className="flex justify-center gap-2">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setDirection(index > currentIndex ? 1 : -1);
                setCurrentIndex(index);
              }}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? 'w-8 bg-gradient-to-r from-purple-600 to-blue-600'
                  : 'w-2 bg-gray-300 hover:bg-gray-400'
              }`}
              aria-label={`Go to testimonial ${index + 1}`}
            />
          ))}
        </div>

        {/* Preview Cards */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-3 gap-4 opacity-50">
          {[prev, next].map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 0.5, y: 0 }}
              className="bg-white rounded-xl p-4 shadow-md cursor-pointer hover:opacity-100 transition-opacity"
              onClick={() => paginate(index === 0 ? -1 : 1)}
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="text-3xl">{testimonial.photo}</div>
                <div>
                  <div className="font-semibold text-sm">{testimonial.name}, {testimonial.age}</div>
                  <div className="text-xs text-gray-500">{testimonial.location}</div>
                </div>
              </div>
              <div className="text-xs text-gray-600 line-clamp-2">{testimonial.story}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default InfiniteTestimonials;

