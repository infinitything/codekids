import React, { useState, useEffect } from 'react';
import { AlertTriangle, Clock, Gift, Users } from 'lucide-react';

const Urgency = () => {
  const [spotsRemaining, setSpotsRemaining] = useState(47);
  const [timeRemaining, setTimeRemaining] = useState({
    days: 3,
    hours: 14,
    minutes: 27,
    seconds: 45
  });

  // Simulate countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else if (prev.days > 0) {
          return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Simulate spots decreasing
  useEffect(() => {
    const spotsTimer = setInterval(() => {
      setSpotsRemaining(prev => {
        if (prev > 20) {
          return prev - Math.floor(Math.random() * 2);
        }
        return prev;
      });
    }, 30000); // Decrease every 30 seconds

    return () => clearInterval(spotsTimer);
  }, []);

  const bonuses = [
    { item: "Free AI Programming Starter Kit", value: 197 },
    { item: "1-on-1 Parent Strategy Call", value: 150 },
    { item: "Lifetime Alumni Network Access", value: 99 }
  ];

  const totalBonusValue = bonuses.reduce((sum, bonus) => sum + bonus.value, 0);

  return (
    <section className="py-20 bg-gradient-to-br from-orange-100 to-red-100 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-32 h-32 bg-orange-300 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-48 h-48 bg-red-300 rounded-full opacity-20 animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-red-500 text-white px-6 py-3 rounded-full text-lg font-bold mb-6 animate-bounce">
            <AlertTriangle size={24} />
            LIMITED TIME OFFER
          </div>
          <h2 className="text-5xl font-bold text-gray-900 mb-6">
            Limited Spots Available <span className="text-red-600">This Month</span>
          </h2>
        </div>

        {/* Main Urgency Card */}
        <div className="bg-white rounded-3xl shadow-2xl border-4 border-orange-400 overflow-hidden mb-12">
          <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-6">
            <div className="flex items-center justify-center gap-4 text-xl font-bold">
              <Users size={28} />
              <span>Enrollment Status</span>
            </div>
          </div>

          <div className="p-8 lg:p-12">
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Left Side - Scarcity */}
              <div className="text-center lg:text-left">
                <div className="mb-6">
                  <div className="inline-flex items-center gap-2 bg-yellow-100 text-yellow-800 px-4 py-2 rounded-full font-bold mb-4">
                    <AlertTriangle size={20} />
                    Quality Control Notice
                  </div>
                  <p className="text-lg text-gray-700 mb-4">
                    We limit enrollment to maintain quality. Only <strong>500 new students</strong> 
                    accepted each month to ensure personalized attention.
                  </p>
                </div>

                <div className="bg-gray-100 rounded-2xl p-6 mb-6">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-red-600 mb-2">{spotsRemaining}</div>
                    <div className="text-gray-700 font-medium">Spots Remaining</div>
                    <div className="w-full bg-gray-300 rounded-full h-4 mt-4">
                      <div 
                        className="bg-gradient-to-r from-red-500 to-orange-500 h-4 rounded-full transition-all duration-1000"
                        style={{ width: `${(spotsRemaining / 500) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                <p className="text-gray-600">
                  <strong>Next enrollment opens:</strong> March 1st, 2024
                </p>
              </div>

              {/* Right Side - Countdown & Bonuses */}
              <div>
                <div className="bg-gradient-to-br from-blue-500 to-purple-600 text-white rounded-2xl p-6 mb-6">
                  <h3 className="text-xl font-bold text-center mb-4">Early Bird Bonus Expires In:</h3>
                  <div className="grid grid-cols-4 gap-2 text-center">
                    <div className="bg-white/20 rounded-lg p-3">
                      <div className="text-2xl font-bold">{timeRemaining.days}</div>
                      <div className="text-xs opacity-80">DAYS</div>
                    </div>
                    <div className="bg-white/20 rounded-lg p-3">
                      <div className="text-2xl font-bold">{timeRemaining.hours}</div>
                      <div className="text-xs opacity-80">HOURS</div>
                    </div>
                    <div className="bg-white/20 rounded-lg p-3">
                      <div className="text-2xl font-bold">{timeRemaining.minutes}</div>
                      <div className="text-xs opacity-80">MIN</div>
                    </div>
                    <div className="bg-white/20 rounded-lg p-3">
                      <div className="text-2xl font-bold">{timeRemaining.seconds}</div>
                      <div className="text-xs opacity-80">SEC</div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-lg font-bold text-gray-900">
                    <Gift className="text-green-500" size={24} />
                    <span>This Week Only - FREE Bonuses:</span>
                  </div>
                  
                  {bonuses.map((bonus, index) => (
                    <div key={index} className="flex items-center justify-between bg-green-50 rounded-lg p-3">
                      <span className="text-gray-800">✓ {bonus.item}</span>
                      <span className="font-bold text-green-600">${bonus.value}</span>
                    </div>
                  ))}
                  
                  <div className="border-t-2 border-green-200 pt-3">
                    <div className="flex items-center justify-between text-xl font-bold">
                      <span className="text-gray-900">Total Bonus Value:</span>
                      <span className="text-green-600">${totalBonusValue} FREE</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <button className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold px-12 py-6 rounded-2xl text-xl transform hover:scale-105 transition-all duration-200 shadow-2xl hover:shadow-3xl animate-pulse">
            <div className="flex items-center gap-3 justify-center">
              <Clock size={24} />
              Claim Your Spot + Bonuses NOW
            </div>
          </button>
          <p className="text-gray-600 mt-4">
            ⚠️ Bonuses expire when timer reaches zero • No extensions • Limited spots only
          </p>
        </div>
      </div>
    </section>
  );
};

export default Urgency;