import React from 'react';
import { Shield, Target, Users, Clock } from 'lucide-react';

const Guarantee = () => {
  const guarantees = [
    {
      icon: Shield,
      title: "14-Day Money-Back Guarantee",
      description: "If your child hasn't built their first working program and fallen in love with coding within 14 days, get every penny back. No questions asked.",
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: Target,
      title: "Progress Promise",
      description: "If your child doesn't advance at least 2 skill levels in 90 days, we'll extend their access for FREE until they do.",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: Users,
      title: "Parent Satisfaction Guarantee",
      description: "Not happy with our parent dashboard or communication? Full refund within 60 days, plus a $50 credit for your trouble.",
      color: "from-purple-500 to-pink-500"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-green-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-green-100 text-green-600 px-6 py-3 rounded-full text-lg font-semibold mb-6">
            <Shield size={24} />
            Risk-Free Promise
          </div>
          <h2 className="text-5xl font-bold text-gray-900 mb-6">
            Try Risk-Free: Our <span className="text-green-600">Iron-Clad Promise</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We're so confident in CodeKid's results, we back it with not one, 
            but three different guarantees. Your satisfaction is 100% guaranteed.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {guarantees.map((guarantee, index) => {
            const Icon = guarantee.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 text-center hover:shadow-xl transform hover:-translate-y-2 transition-all duration-300"
              >
                <div className={`w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-r ${guarantee.color} flex items-center justify-center shadow-lg`}>
                  <Icon className="text-white" size={32} />
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  {guarantee.title}
                </h3>
                
                <p className="text-gray-600 leading-relaxed">
                  {guarantee.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Additional Trust Elements */}
        <div className="bg-white rounded-2xl p-8 shadow-xl border-2 border-green-200">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Why We Can Offer These Guarantees
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <div className="w-3 h-3 bg-white rounded-full"></div>
                  </div>
                  <span className="text-gray-700">50,000+ successful students</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <div className="w-3 h-3 bg-white rounded-full"></div>
                  </div>
                  <span className="text-gray-700">94% parent satisfaction rate</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <div className="w-3 h-3 bg-white rounded-full"></div>
                  </div>
                  <span className="text-gray-700">Less than 3% refund requests</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <div className="w-3 h-3 bg-white rounded-full"></div>
                  </div>
                  <span className="text-gray-700">Proven curriculum since 2019</span>
                </div>
              </div>
            </div>

            <div className="text-center">
              <div className="text-6xl mb-4">🛡️</div>
              <h4 className="text-xl font-bold text-gray-900 mb-2">
                Your Investment is Protected
              </h4>
              <p className="text-gray-600">
                Join thousands of families who've already transformed their child's future 
                with complete confidence and zero risk.
              </p>
            </div>
          </div>
        </div>

        <div className="text-center mt-12">
          <div className="inline-flex items-center gap-2 bg-green-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-green-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl cursor-pointer">
            <Clock size={20} />
            Start Your Risk-Free Trial Now
          </div>
          <p className="text-sm text-gray-600 mt-4">
            No credit card required • Cancel anytime • Full refund guarantee
          </p>
        </div>
      </div>
    </section>
  );
};

export default Guarantee;