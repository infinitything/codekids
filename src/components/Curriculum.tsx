import React, { useState } from 'react';
import { Gamepad2, Smartphone, Bot, Award, Clock, Users } from 'lucide-react';

const Curriculum = () => {
  const [activeLevel, setActiveLevel] = useState(0);

  const levels = [
    {
      id: 1,
      title: "FOUNDATIONS",
      subtitle: "Game Creator Track",
      ageRange: "Ages 5-8",
      duration: "12 weeks",
      icon: Gamepad2,
      color: "from-purple-500 to-pink-500",
      description: "Visual programming with drag-and-drop blocks",
      projects: [
        "Create animated stories and simple games",
        "Build a virtual pet that responds to commands",
        "Interactive adventure game"
      ],
      skills: "Logic, sequences, loops, events",
      certificate: "Junior Game Designer"
    },
    {
      id: 2,
      title: "BUILDER",
      subtitle: "App Developer Track",
      ageRange: "Ages 8-12",
      duration: "16 weeks",
      icon: Smartphone,
      color: "from-blue-500 to-cyan-500",
      description: "Introduction to real programming languages",
      projects: [
        "Build mobile apps and websites",
        "Create AI chatbots and voice assistants",
        "Social media app for kids"
      ],
      skills: "Python, HTML/CSS, APIs, databases",
      certificate: "Certified Young Developer"
    },
    {
      id: 3,
      title: "INNOVATOR",
      subtitle: "AI Engineer Track",
      ageRange: "Ages 12-16",
      duration: "20 weeks",
      icon: Bot,
      color: "from-green-500 to-emerald-500",
      description: "Machine learning and artificial intelligence",
      projects: [
        "Build recommendation systems and smart apps",
        "Create neural networks and train AI models",
        "AI-powered solution to real-world problem"
      ],
      skills: "TensorFlow, data science, cloud computing",
      certificate: "AI Engineering Graduate"
    }
  ];

  return (
    <section id="curriculum" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-gray-900 mb-6">
            The Complete Roadmap: <span className="text-blue-600">Beginner to AI Engineer</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto">
            Our curriculum isn't just lessons—it's a journey. Every child follows a personalized 
            path that adapts to their interests, learning speed, and goals.
          </p>
        </div>

        {/* Desktop Timeline View */}
        <div className="hidden lg:block">
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 via-blue-500 to-green-500 rounded-full transform -translate-y-1/2"></div>
            
            {/* Level Cards */}
            <div className="relative grid grid-cols-3 gap-8">
              {levels.map((level, index) => {
                const Icon = level.icon;
                return (
                  <div
                    key={level.id}
                    className={`relative bg-white rounded-2xl p-8 shadow-lg border-2 transition-all duration-300 cursor-pointer ${
                      activeLevel === index 
                        ? 'border-blue-500 shadow-xl transform -translate-y-4' 
                        : 'border-gray-200 hover:border-gray-300 hover:shadow-xl hover:-translate-y-2'
                    }`}
                    onClick={() => setActiveLevel(index)}
                  >
                    {/* Timeline Dot */}
                    <div className={`absolute -top-6 left-1/2 transform -translate-x-1/2 w-12 h-12 rounded-full bg-gradient-to-r ${level.color} flex items-center justify-center shadow-lg`}>
                      <Icon className="text-white" size={24} />
                    </div>

                    <div className="pt-8 space-y-4">
                      <div className="text-center">
                        <h3 className="text-2xl font-bold text-gray-900">LEVEL {level.id}: {level.title}</h3>
                        <p className={`text-lg font-semibold bg-gradient-to-r ${level.color} bg-clip-text text-transparent`}>
                          {level.subtitle}
                        </p>
                        <div className="flex items-center justify-center gap-4 text-sm text-gray-600 mt-2">
                          <div className="flex items-center gap-1">
                            <Users size={16} />
                            {level.ageRange}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock size={16} />
                            {level.duration}
                          </div>
                        </div>
                      </div>

                      <p className="text-gray-600 text-center">{level.description}</p>

                      {activeLevel === index && (
                        <div className="space-y-4 animate-fadeIn">
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-2">Projects:</h4>
                            <ul className="space-y-1 text-sm text-gray-600">
                              {level.projects.map((project, i) => (
                                <li key={i} className="flex items-start gap-2">
                                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                                  {project}
                                </li>
                              ))}
                            </ul>
                          </div>
                          
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-1">Skills Unlocked:</h4>
                            <p className="text-sm text-gray-600">{level.skills}</p>
                          </div>

                          <div className="flex items-center gap-2 justify-center pt-4">
                            <Award className="text-yellow-500" size={20} />
                            <span className="font-semibold text-gray-900">{level.certificate}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Mobile Stacked View */}
        <div className="lg:hidden space-y-6">
          {levels.map((level, index) => {
            const Icon = level.icon;
            return (
              <div key={level.id} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
                <div className="flex items-center gap-4 mb-4">
                  <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${level.color} flex items-center justify-center`}>
                    <Icon className="text-white" size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">LEVEL {level.id}: {level.title}</h3>
                    <p className={`font-semibold bg-gradient-to-r ${level.color} bg-clip-text text-transparent`}>
                      {level.subtitle}
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Users size={16} />
                      {level.ageRange}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock size={16} />
                      {level.duration}
                    </div>
                  </div>

                  <p className="text-gray-600">{level.description}</p>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Key Projects:</h4>
                    <ul className="space-y-1 text-sm text-gray-600">
                      {level.projects.map((project, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                          {project}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex items-center gap-2 pt-2">
                    <Award className="text-yellow-500" size={16} />
                    <span className="font-medium text-gray-900">{level.certificate}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Curriculum;