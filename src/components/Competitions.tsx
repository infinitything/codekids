import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Award, Zap, Target, Sparkles, DollarSign, Users, Calendar } from 'lucide-react';

const Competitions = () => {
  const competitions = [
    {
      title: "Monthly AI Innovation Challenge",
      frequency: "Every Month",
      icon: Sparkles,
      prizes: ["1st: $1,000", "2nd: $500", "3rd: $250"],
      description: "Build the most creative AI application using tools from your phase",
      participants: "400+ students compete monthly",
      nextDate: "Next: December 15th",
      winners: ["Emma (12) - AI Email Organizer", "Marcus (14) - Study Buddy Chatbot", "Sophia (10) - Math Tutor Game"],
      color: "from-purple-600 to-blue-600"
    },
    {
      title: "CodeKid Annual Hackathon",
      frequency: "Once a Year",
      icon: Trophy,
      prizes: ["1st: $10,000", "2nd: $5,000", "3rd: $2,500", "Top 10: $500 each"],
      description: "48-hour coding marathon where students build real-world solutions to actual problems",
      participants: "1,500+ students from all phases",
      nextDate: "Next: March 2025",
      winners: ["2024: Liam (13) built AI for food waste reduction", "2023: Ava (11) created accessibility app for blind users", "2022: Noah (15) designed climate change tracker"],
      color: "from-yellow-500 to-orange-600"
    },
    {
      title: "Phase Completion Challenge",
      frequency: "Continuous",
      icon: Target,
      prizes: ["$200 Amazon Gift Card", "Official CodeKid Hoodie", "Featured on Website"],
      description: "Complete your phase within the target timeframe and showcase your best project",
      participants: "100+ monthly completions",
      nextDate: "Rolling deadline",
      winners: ["This month: 47 students qualified", "Average completion bonus: $150", "Top performer: Isabella (9) - 3 weeks early!"],
      color: "from-green-500 to-emerald-600"
    },
    {
      title: "AI Art & Design Contest",
      frequency: "Quarterly",
      icon: Award,
      prizes: ["1st: $2,000", "2nd: $1,000", "3rd: $500", "People's Choice: $750"],
      description: "Create stunning visuals, games, or interactive experiences using AI tools",
      participants: "600+ submissions per quarter",
      nextDate: "Next: January 30th",
      winners: ["Q3 2024: Charlotte (10) - AI-generated storybook", "Q2 2024: Oliver (13) - Interactive museum tour", "Q1 2024: Amelia (11) - Virtual art gallery"],
      color: "from-pink-500 to-rose-600"
    },
    {
      title: "Real-World Impact Award",
      frequency: "Twice a Year",
      icon: Users,
      prizes: ["1st: $5,000 + Mentorship", "2nd: $2,500", "3rd: $1,000"],
      description: "Build an AI solution that solves a real problem in your community or school",
      participants: "200+ projects submitted",
      nextDate: "Next: June 2025",
      winners: ["Jackson (15) - App helping homeless find resources", "Harper (12) - Tool for dyslexic students", "Aiden (9) - Food allergy scanner for cafeterias"],
      color: "from-blue-600 to-indigo-600"
    },
    {
      title: "Speed Coding Championship",
      frequency: "Monthly",
      icon: Zap,
      prizes: ["1st: $500", "2nd: $300", "3rd: $150", "Top 20: CodeKid Swag"],
      description: "30-minute challenge to build a working app from scratch - fastest and best wins",
      participants: "800+ speed demons",
      nextDate: "Next: Every 1st Saturday",
      winners: ["November: Evelyn (14) - 18 mins!", "October: Sebastian (16) - 22 mins", "September: Abigail (11) - 25 mins"],
      color: "from-red-500 to-orange-500"
    }
  ];

  const prizePool = {
    total: "$50,000+",
    awarded: "Annually",
    winners: "500+",
    avgWinning: "$175"
  };

  return (
    <section className="py-24 bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 -right-40 w-96 h-96 bg-purple-500 rounded-full opacity-20 blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 -left-40 w-96 h-96 bg-blue-500 rounded-full opacity-20 blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-pink-500 rounded-full opacity-10 blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-400/20 to-orange-400/20 backdrop-blur-sm text-yellow-300 px-4 py-2 rounded-full text-sm font-semibold mb-6 border border-yellow-400/30">
            <Trophy size={16} />
            Competitions & Prizes
          </div>
          <h2 className="text-5xl md:text-7xl font-bold text-white mb-6">
            Win While You{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-orange-300 to-red-300">
              Learn & Build
            </span>
          </h2>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto mb-8">
            Every month, we award over $4,000 in prizes to students who showcase creativity, innovation, and impact. Your child could be next!
          </p>

          {/* Prize Pool Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <DollarSign className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
              <div className="text-3xl font-bold text-white mb-1">{prizePool.total}</div>
              <div className="text-sm text-blue-200">Annual Prize Pool</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <Users className="w-8 h-8 text-green-400 mx-auto mb-2" />
              <div className="text-3xl font-bold text-white mb-1">{prizePool.winners}</div>
              <div className="text-sm text-blue-200">Winners Every Year</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <Trophy className="w-8 h-8 text-purple-400 mx-auto mb-2" />
              <div className="text-3xl font-bold text-white mb-1">{prizePool.avgWinning}</div>
              <div className="text-sm text-blue-200">Avg Prize Won</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <Calendar className="w-8 h-8 text-orange-400 mx-auto mb-2" />
              <div className="text-3xl font-bold text-white mb-1">6+</div>
              <div className="text-sm text-blue-200">Events Annually</div>
            </div>
          </div>
        </motion.div>

        {/* Competition Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {competitions.map((comp, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group"
            >
              <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105 hover:shadow-2xl h-full flex flex-col">
                {/* Icon & Title */}
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${comp.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <comp.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">{comp.title}</h3>
                <div className="flex items-center gap-2 mb-4">
                  <Calendar className="w-4 h-4 text-blue-300" />
                  <span className="text-sm text-blue-200 font-medium">{comp.frequency}</span>
                </div>
                
                <p className="text-blue-100 mb-4 leading-relaxed">{comp.description}</p>

                {/* Prizes */}
                <div className="bg-white/5 rounded-xl p-4 mb-4 border border-white/10">
                  <div className="text-yellow-300 font-bold text-sm mb-2 flex items-center gap-2">
                    <DollarSign size={16} />
                    Prize Pool:
                  </div>
                  <ul className="space-y-1">
                    {comp.prizes.map((prize, i) => (
                      <li key={i} className="text-white text-sm flex items-center gap-2">
                        <Trophy className="w-3 h-3 text-yellow-400" />
                        {prize}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Stats */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="w-4 h-4 text-purple-300" />
                    <span className="text-purple-200">{comp.participants}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="w-4 h-4 text-green-300" />
                    <span className="text-green-200">{comp.nextDate}</span>
                  </div>
                </div>

                {/* Recent Winners */}
                <div className="mt-auto pt-4 border-t border-white/10">
                  <div className="text-xs text-blue-300 font-semibold mb-2">Recent Winners:</div>
                  <ul className="space-y-1">
                    {comp.winners.slice(0, 2).map((winner, i) => (
                      <li key={i} className="text-xs text-blue-100 flex items-start gap-2">
                        <Award className="w-3 h-3 text-yellow-400 mt-0.5 flex-shrink-0" />
                        <span>{winner}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center bg-gradient-to-r from-yellow-500/20 to-orange-500/20 backdrop-blur-md rounded-3xl p-12 border border-yellow-400/30"
        >
          <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Your Child Could Win Next Month
          </h3>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Every CodeKid student is automatically entered into competitions based on their phase. No extra fees, no catch—just build and win!
          </p>
          <button
            onClick={() => window.location.href = '/auth?mode=signup'}
            className="group bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-300 hover:to-orange-400 text-gray-900 font-bold px-12 py-5 rounded-2xl transform hover:scale-105 transition-all duration-200 shadow-2xl hover:shadow-3xl text-lg inline-flex items-center gap-3"
          >
            <Trophy className="w-6 h-6 group-hover:animate-bounce" />
            Start Competing & Winning
            <Trophy className="w-6 h-6 group-hover:animate-bounce" />
          </button>
          <p className="text-sm text-blue-200 mt-4">
            💰 First month students are eligible for all prizes
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default Competitions;

