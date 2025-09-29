import React from 'react';
import { Shield, Clock, DollarSign, Heart, Headphones } from 'lucide-react';

const ParentFocused = () => {
  const concerns = [
    {
      worry: "Is my child falling behind in tech?",
      solution: "Get weekly progress reports showing exactly what they've mastered",
      icon: Shield,
      color: "from-blue-500 to-cyan-500"
    },
    {
      worry: "Too much screen time worries me",
      solution: "Set custom time limits. Learning pauses automatically.",
      icon: Clock,
      color: "from-purple-500 to-pink-500"
    },
    {
      worry: "Coding classes are so expensive",
      solution: "One low monthly fee. No hidden costs. Cancel anytime.",
      icon: DollarSign,
      color: "from-green-500 to-emerald-500"
    },
    {
      worry: "What if they lose interest?",
      solution: "98% of kids ask for 'just 5 more minutes' every session",
      icon: Heart,
      color: "from-orange-500 to-red-500"
    },
    {
      worry: "Will they have support when stuck?",
      solution: "24/7 AI mentor + live expert help within 15 minutes",
      icon: Headphones,
      color: "from-indigo-500 to-purple-500"
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-gray-900 mb-6">
            Designed by Parents, <span className="text-blue-600">for Parents</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We understand every concern because we're parents too. Here's how we've addressed 
            the top worries from 50,000+ families.
          </p>
        </div>

        <div className="space-y-8">
          {concerns.map((concern, index) => {
            const Icon = concern.icon;
            return (
              <div
                key={index}
                className="group relative overflow-hidden bg-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300"
              >
                <div className="grid lg:grid-cols-2 items-center">
                  {/* Worry Side */}
                  <div className="p-8 lg:p-12 bg-gray-50 relative">
                    <div className="flex items-start gap-4">
                      <div className="text-4xl">😰</div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-4">
                          "{concern.worry}"
                        </h3>
                        <div className="w-12 h-1 bg-gray-300 rounded-full"></div>
                      </div>
                    </div>
                  </div>

                  {/* Solution Side */}
                  <div className="p-8 lg:p-12 relative">
                    <div className={`absolute inset-0 bg-gradient-to-r ${concern.color} opacity-5 group-hover:opacity-10 transition-opacity duration-300`}></div>
                    <div className="relative z-10">
                      <div className="flex items-start gap-4">
                        <div className={`p-3 rounded-xl bg-gradient-to-r ${concern.color} shadow-lg`}>
                          <Icon className="text-white" size={24} />
                        </div>
                        <div>
                          <div className="text-sm text-green-600 font-semibold mb-2">
                            ✓ SOLVED
                          </div>
                          <p className="text-lg text-gray-900 font-medium">
                            {concern.solution}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Arrow Connector */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 hidden lg:block">
                  <div className="w-8 h-8 bg-white border-2 border-gray-300 rotate-45 shadow-lg group-hover:border-blue-500 group-hover:bg-blue-50 transition-all duration-300">
                    <div className="absolute inset-0 flex items-center justify-center transform -rotate-45">
                      <div className="w-2 h-2 bg-blue-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <div className="bg-blue-50 rounded-2xl p-8 inline-block">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Ready to Give Your Child the Future They Deserve?
            </h3>
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-4 rounded-xl transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl">
              Start Your Free Trial Today
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ParentFocused;