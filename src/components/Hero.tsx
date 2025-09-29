import React from 'react';
import { Play, Star, Award } from 'lucide-react';

const Hero = () => {
  return (
    <section className="min-h-screen bg-gradient-to-b from-gray-50 to-white pt-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Text Content */}
          <div className="space-y-8 animate-fadeInUp">
            <div className="space-y-6">
              <h1 className="text-5xl lg:text-7xl font-bold text-gray-900 leading-tight">
                Your Child Will <span className="text-blue-600">Code AI</span> by Age 12
              </h1>
              <p className="text-xl text-gray-600 max-w-xl">
                Join 50,000+ kids already building tomorrow's technology. 
                From zero to coding genius in just 3 months.
              </p>
              <p className="text-lg text-gray-700 max-w-2xl">
                While other kids play games, your child will <strong>CREATE</strong> them. 
                Our proven system transforms curious minds into confident coders 
                through fun, interactive lessons designed specifically for young learners.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-4 rounded-xl transform hover:scale-105 hover:-translate-y-1 transition-all duration-200 shadow-lg hover:shadow-xl">
                Start Free 7-Day Trial
              </button>
              <button className="border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white font-semibold px-8 py-4 rounded-xl flex items-center justify-center gap-2 transition-all duration-200">
                <Play size={20} />
                Watch Success Stories
              </button>
            </div>

            {/* Trust Bar */}
            <div className="pt-8">
              <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                <Star className="text-yellow-400 fill-yellow-400" size={16} />
                <span>As seen on:</span>
              </div>
              <div className="flex items-center gap-8 text-gray-400 text-sm font-medium">
                <span>CNN</span>
                <span>TechCrunch</span>
                <span>Forbes</span>
                <div className="flex items-center gap-1">
                  <Award size={16} />
                  <span>Parent's Choice Gold Winner</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Visual */}
          <div className="relative animate-fadeInRight">
            <div className="relative z-10 bg-gray-900 rounded-2xl p-6 shadow-2xl">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-gray-400 text-sm ml-4">my-first-game.py</span>
              </div>
              <div className="text-green-400 font-mono text-sm space-y-2">
                <div className="animate-typing">
                  <span className="text-purple-400">import</span> pygame
                </div>
                <div className="animate-typing" style={{animationDelay: '0.5s'}}>
                  <span className="text-purple-400">class</span> <span className="text-yellow-400">Hero</span>:
                </div>
                <div className="animate-typing" style={{animationDelay: '1s'}}>
                  &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-purple-400">def</span> <span className="text-blue-400">move</span>(self):
                </div>
                <div className="animate-typing" style={{animationDelay: '1.5s'}}>
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;print(<span className="text-green-300">"Hero moves!"</span>)
                </div>
              </div>
            </div>

            {/* Floating Elements */}
            <div className="absolute -top-4 -right-4 bg-blue-600 text-white p-4 rounded-xl shadow-lg animate-float">
              <div className="text-sm font-semibold">AI Project</div>
              <div className="text-xs opacity-90">99% Complete</div>
            </div>
            
            <div className="absolute -bottom-4 -left-4 bg-orange-500 text-white p-4 rounded-xl shadow-lg animate-float" style={{animationDelay: '1s'}}>
              <div className="text-sm font-semibold">Level Up!</div>
              <div className="text-xs opacity-90">Junior Developer</div>
            </div>

            {/* Background Shapes */}
            <div className="absolute -z-10 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div className="w-96 h-96 bg-blue-200 rounded-full opacity-20 animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;