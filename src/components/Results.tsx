import React, { useEffect, useRef, useState } from 'react';
import { TrendingUp, Target, DollarSign, Trophy, Smartphone, Building } from 'lucide-react';

const Results = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  const stats = [
    { number: 12000, suffix: '+', label: 'Kids started their AI journey', icon: TrendingUp },
    { number: 860, suffix: '', label: 'Completed Phase 1 (AI Explorer)', icon: Target },
    { number: 540, suffix: '', label: 'Advanced to Phase 2 (AI Builder)', icon: Smartphone },
    { number: 210, suffix: '', label: 'Became Elite AI Engineers (Phase 3)', icon: Trophy },
    { number: 68, suffix: '', label: 'Now working in tech or running startups', icon: Building },
    { number: 92, suffix: '%', label: 'Parent satisfaction rate', icon: TrendingUp }
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const AnimatedNumber = ({ number, duration = 2000 }) => {
    const [displayNumber, setDisplayNumber] = useState(0);

    useEffect(() => {
      if (!isVisible) return;

      let startTime = null;
      const animate = (currentTime) => {
        if (!startTime) startTime = currentTime;
        const progress = (currentTime - startTime) / duration;

        if (progress < 1) {
          setDisplayNumber(Math.floor(number * progress));
          requestAnimationFrame(animate);
        } else {
          setDisplayNumber(number);
        }
      };

      requestAnimationFrame(animate);
    }, [isVisible, number, duration]);

    return <span>{displayNumber.toLocaleString()}</span>;
  };

  return (
    <section id="results" className="py-20 bg-gray-900 text-white relative overflow-hidden" ref={sectionRef}>
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-32 h-32 bg-blue-500 rounded-full"></div>
        <div className="absolute bottom-20 right-20 w-48 h-48 bg-purple-500 rounded-full"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold mb-6">
            The Numbers Don't Lie: <span className="text-blue-400">Real Results, Real Impact</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            From first animation to professional AI engineer—here's what our students achieve on their 32-month journey
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className="text-center p-8 bg-gray-800 rounded-2xl border border-gray-700 hover:border-blue-500 transition-all duration-300"
              >
                <Icon className="w-12 h-12 text-blue-400 mx-auto mb-4" />
                <div className="text-4xl font-bold mb-2 text-blue-400">
                  {stat.prefix}
                  <AnimatedNumber number={stat.number} />
                  {stat.suffix}
                </div>
                <p className="text-gray-300">{stat.label}</p>
              </div>
            );
          })}
        </div>

        {/* Spotlight Story */}
        <div className="bg-gradient-to-r from-blue-800 to-purple-800 rounded-3xl p-8 lg:p-12">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center bg-yellow-500 text-black px-4 py-2 rounded-full font-bold mb-6">
                ⭐ SPOTLIGHT
              </div>
              <h3 className="text-3xl font-bold mb-4">Meet Alex, Age 16</h3>
              <p className="text-2xl text-blue-200 mb-6 font-semibold">
                "Started CodeKid at 10. Now interning at Google."
              </p>
              
              <div className="space-y-4 text-gray-300">
                <p>
                  Alex built his first mobile game at 11. By 13, he had created 
                  an AI tutoring app used by 10,000+ students. At 16, he became 
                  Google's youngest-ever summer intern.
                </p>
                <blockquote className="text-xl italic text-white pl-4 border-l-4 border-blue-400">
                  "CodeKid gave me the confidence to think like an engineer. 
                  The projects weren't just homework—they solved real problems."
                </blockquote>
              </div>
            </div>

            <div className="space-y-6">
              {/* Achievement Timeline */}
              <div className="space-y-4">
                <h4 className="text-xl font-bold text-blue-200">Achievement Timeline</h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-4 bg-gray-700/50 rounded-lg p-3">
                    <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                    <span><strong>Age 10:</strong> Started CodeKid</span>
                  </div>
                  <div className="flex items-center gap-4 bg-gray-700/50 rounded-lg p-3">
                    <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                    <span><strong>Age 11:</strong> First mobile game</span>
                  </div>
                  <div className="flex items-center gap-4 bg-gray-700/50 rounded-lg p-3">
                    <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                    <span><strong>Age 13:</strong> AI tutoring app (10k users)</span>
                  </div>
                  <div className="flex items-center gap-4 bg-yellow-600/50 rounded-lg p-3">
                    <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                    <span><strong>Age 16:</strong> Google internship</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Results;