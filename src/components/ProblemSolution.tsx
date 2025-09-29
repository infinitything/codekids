import React from 'react';
import { X, Check, AlertTriangle, TrendingUp } from 'lucide-react';

const ProblemSolution = () => {
  const problems = [
    "Schools teach outdated computer skills from 2010",
    "73% of parents feel helpless about their child's tech education",
    "By 2030, 85% of jobs will require coding knowledge",
    "Traditional tutoring costs $80+/hour with no guarantees"
  ];

  const solutions = [
    "Kids learn faster than adults—we've proven it with 50,000+ students",
    "Game-based learning keeps them engaged for hours (not minutes)",
    "Personal AI tutor adapts to your child's exact learning speed",
    "Build real projects they can show off to friends and family"
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16">
          {/* Problem Side */}
          <div className="space-y-8">
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2 bg-red-100 text-red-600 px-4 py-2 rounded-full text-sm font-medium mb-6">
                <AlertTriangle size={16} />
                The Problem
              </div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Your Child's Future Depends on Tech Skills You Can't Teach
              </h2>
            </div>
            
            <div className="space-y-4">
              {problems.map((problem, index) => (
                <div
                  key={index}
                  className="flex items-start gap-4 p-4 bg-white rounded-xl border border-red-100 shadow-sm animate-slideInLeft"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex-shrink-0 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center mt-1">
                    <X size={16} className="text-white" />
                  </div>
                  <p className="text-gray-700">{problem}</p>
                </div>
              ))}
            </div>

            {/* Worried Parent Illustration Placeholder */}
            <div className="hidden lg:block">
              <div className="bg-red-50 rounded-2xl p-8 text-center">
                <div className="text-6xl mb-4">😰</div>
                <p className="text-red-600 font-medium">Parents feeling overwhelmed</p>
              </div>
            </div>
          </div>

          {/* Solution Side */}
          <div className="space-y-8">
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2 bg-green-100 text-green-600 px-4 py-2 rounded-full text-sm font-medium mb-6">
                <TrendingUp size={16} />
                The Solution
              </div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Finally: A System That Actually Works
              </h2>
            </div>
            
            <div className="space-y-4">
              {solutions.map((solution, index) => (
                <div
                  key={index}
                  className="flex items-start gap-4 p-4 bg-white rounded-xl border border-green-100 shadow-sm animate-slideInRight"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex-shrink-0 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mt-1">
                    <Check size={16} className="text-white" />
                  </div>
                  <p className="text-gray-700">{solution}</p>
                </div>
              ))}
            </div>

            {/* Happy Family Illustration Placeholder */}
            <div className="hidden lg:block">
              <div className="bg-green-50 rounded-2xl p-8 text-center">
                <div className="text-6xl mb-4">🎉</div>
                <p className="text-green-600 font-medium">Confident kids & proud parents</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProblemSolution;