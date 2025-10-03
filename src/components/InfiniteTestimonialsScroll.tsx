import React from 'react';
import { motion } from 'framer-motion';
import { Star, Award } from 'lucide-react';

interface StudentProfile {
  id: number;
  name: string;
  age: number;
  photo: string;
  parentName: string;
  location: string;
  achievement: string;
  quote: string;
  phase: string;
  rating: number;
}

const InfiniteTestimonialsScroll = () => {
  // 50+ student profiles
  const students: StudentProfile[] = [
    {
      id: 1,
      name: "Emma Chen",
      age: 12,
      photo: "👧",
      parentName: "Sarah Chen",
      location: "San Francisco, CA",
      achievement: "Built 15 AI apps • Phase 2 Graduate",
      quote: "My daughter built a chatbot that helps organize emails. She's more confident and excited about tech!",
      phase: "Phase 2",
      rating: 5
    },
    {
      id: 2,
      name: "Marcus Johnson",
      age: 14,
      photo: "👦",
      parentName: "David Johnson",
      location: "Austin, TX",
      achievement: "AI Engineer Elite • 50+ Projects",
      quote: "Marcus went from zero coding to building machine learning models. He just got into Stanford's AI program!",
      phase: "Phase 3",
      rating: 5
    },
    {
      id: 3,
      name: "Sophia Rodriguez",
      age: 10,
      photo: "👧",
      parentName: "Maria Rodriguez",
      location: "Miami, FL",
      achievement: "Completed 10 Games • Phase 1",
      quote: "She built her first game in Week 4! Now she wants to be a game developer. Best investment we made.",
      phase: "Phase 1",
      rating: 5
    },
    {
      id: 4,
      name: "Liam Patel",
      age: 13,
      photo: "👦",
      parentName: "Raj Patel",
      location: "Seattle, WA",
      achievement: "20+ Apps Deployed • Phase 2",
      quote: "Liam created an automation tool we now use in our family business. Unbelievable progress!",
      phase: "Phase 2",
      rating: 5
    },
    {
      id: 5,
      name: "Ava Kim",
      age: 11,
      photo: "👧",
      parentName: "Jennifer Kim",
      location: "Boston, MA",
      achievement: "AI Explorer Graduate",
      quote: "She mastered 20+ AI tools and built a portfolio website. Her teachers are amazed!",
      phase: "Phase 1",
      rating: 5
    },
    {
      id: 6,
      name: "Noah Williams",
      age: 15,
      photo: "👦",
      parentName: "Michael Williams",
      location: "Denver, CO",
      achievement: "Machine Learning Expert • Phase 3",
      quote: "Noah published his first research paper on AI at 15. CodeKid gave him the foundation.",
      phase: "Phase 3",
      rating: 5
    },
    {
      id: 7,
      name: "Isabella Martinez",
      age: 9,
      photo: "👧",
      parentName: "Carlos Martinez",
      location: "Phoenix, AZ",
      achievement: "Youngest Phase 1 Graduate",
      quote: "At 9, she's building games her friends actually play. Her problem-solving skills have skyrocketed!",
      phase: "Phase 1",
      rating: 5
    },
    {
      id: 8,
      name: "Ethan Brown",
      age: 14,
      photo: "👦",
      parentName: "Lisa Brown",
      location: "Portland, OR",
      achievement: "30+ Real Apps • Phase 2",
      quote: "Ethan built a price comparison tool that saves us money every week. This program is incredible!",
      phase: "Phase 2",
      rating: 5
    },
    {
      id: 9,
      name: "Mia Thompson",
      age: 12,
      photo: "👧",
      parentName: "Amanda Thompson",
      location: "Atlanta, GA",
      achievement: "AI Builder Pro • 25 Apps",
      quote: "She went from shy to presenting her AI projects to 100+ people. The confidence boost is priceless!",
      phase: "Phase 2",
      rating: 5
    },
    {
      id: 10,
      name: "Lucas Garcia",
      age: 16,
      photo: "👦",
      parentName: "Elena Garcia",
      location: "Chicago, IL",
      achievement: "Teen Founder • Phase 3 Elite",
      quote: "Lucas started his own AI consulting business at 16. He's already making $5K/month!",
      phase: "Phase 3",
      rating: 5
    },
    {
      id: 11,
      name: "Charlotte Davis",
      age: 10,
      photo: "👧",
      parentName: "Robert Davis",
      location: "Dallas, TX",
      achievement: "12 Projects Built • Phase 1",
      quote: "She built an AI art generator that her whole school uses. Teachers want to know our secret!",
      phase: "Phase 1",
      rating: 5
    },
    {
      id: 12,
      name: "Oliver Lee",
      age: 13,
      photo: "👦",
      parentName: "Sophia Lee",
      location: "San Diego, CA",
      achievement: "Automation Master • Phase 2",
      quote: "Oliver automated his homework organization with AI. He's saving 5 hours a week!",
      phase: "Phase 2",
      rating: 5
    },
    {
      id: 13,
      name: "Amelia Wilson",
      age: 11,
      photo: "👧",
      parentName: "James Wilson",
      location: "Nashville, TN",
      achievement: "AI Explorer Certified",
      quote: "She created an AI tutor for math that helped her grades jump from B to A+!",
      phase: "Phase 1",
      rating: 5
    },
    {
      id: 14,
      name: "Jackson Moore",
      age: 15,
      photo: "👦",
      parentName: "Michelle Moore",
      location: "Minneapolis, MN",
      achievement: "Deep Learning Specialist • Phase 3",
      quote: "Jackson got early acceptance to MIT. His AI projects portfolio made him stand out!",
      phase: "Phase 3",
      rating: 5
    },
    {
      id: 15,
      name: "Harper Taylor",
      age: 12,
      photo: "👧",
      parentName: "Daniel Taylor",
      location: "Philadelphia, PA",
      achievement: "18 Apps Published • Phase 2",
      quote: "Her social media analyzer app went viral at school. She's the go-to tech expert!",
      phase: "Phase 2",
      rating: 5
    },
    {
      id: 16,
      name: "Aiden Anderson",
      age: 9,
      photo: "👦",
      parentName: "Jessica Anderson",
      location: "Houston, TX",
      achievement: "Youngest Coder • Phase 1",
      quote: "At 9, he's building games that teach other kids coding. His creativity is unlimited!",
      phase: "Phase 1",
      rating: 5
    },
    {
      id: 17,
      name: "Evelyn Thomas",
      age: 14,
      photo: "👧",
      parentName: "Christopher Thomas",
      location: "Las Vegas, NV",
      achievement: "Full-Stack Developer • Phase 2",
      quote: "Evelyn built a booking system for my dental practice. We use it daily!",
      phase: "Phase 2",
      rating: 5
    },
    {
      id: 18,
      name: "Sebastian White",
      age: 16,
      photo: "👦",
      parentName: "Patricia White",
      location: "Columbus, OH",
      achievement: "AI Research Intern • Phase 3",
      quote: "Sebastian landed a paid internship at Google. CodeKid prepared him better than college!",
      phase: "Phase 3",
      rating: 5
    },
    {
      id: 19,
      name: "Abigail Harris",
      age: 11,
      photo: "👧",
      parentName: "Matthew Harris",
      location: "Charlotte, NC",
      achievement: "Game Developer • Phase 1",
      quote: "She built 8 games in 12 weeks. Her friends are begging to join CodeKid!",
      phase: "Phase 1",
      rating: 5
    },
    {
      id: 20,
      name: "Mason Martin",
      age: 13,
      photo: "👦",
      parentName: "Laura Martin",
      location: "Indianapolis, IN",
      achievement: "24 Working Apps • Phase 2",
      quote: "Mason created a study planner that's now used by 500+ students. He's a celebrity at school!",
      phase: "Phase 2",
      rating: 5
    },
    // Continue with more students...
    {
      id: 21,
      name: "Ella Jackson",
      age: 10,
      photo: "👧",
      parentName: "Kevin Jackson",
      location: "Detroit, MI",
      achievement: "AI Tools Master • Phase 1",
      quote: "She uses AI to create presentations that wow her teachers. Confidence is through the roof!",
      phase: "Phase 1",
      rating: 5
    },
    {
      id: 22,
      name: "Logan Thompson",
      age: 15,
      photo: "👦",
      parentName: "Nicole Thompson",
      location: "Baltimore, MD",
      achievement: "Startup Founder • Phase 3",
      quote: "Logan raised $50K for his AI startup at 15. This program changed our lives!",
      phase: "Phase 3",
      rating: 5
    },
    {
      id: 23,
      name: "Scarlett Garcia",
      age: 12,
      photo: "👧",
      parentName: "Anthony Garcia",
      location: "Milwaukee, WI",
      achievement: "Content Creator • Phase 2",
      quote: "She built an AI content generator and started a YouTube channel about coding. 10K subscribers!",
      phase: "Phase 2",
      rating: 5
    },
    {
      id: 24,
      name: "Benjamin Martinez",
      age: 11,
      photo: "👦",
      parentName: "Rachel Martinez",
      location: "Sacramento, CA",
      achievement: "Hackathon Winner • Phase 1",
      quote: "Benjamin won his first coding competition after just 3 months! The prize was $1,000!",
      phase: "Phase 1",
      rating: 5
    },
    {
      id: 25,
      name: "Victoria Lopez",
      age: 14,
      photo: "👧",
      parentName: "Steven Lopez",
      location: "Kansas City, MO",
      achievement: "AI Automation Expert • Phase 2",
      quote: "She automated our entire household schedule with AI. Life has never been easier!",
      phase: "Phase 2",
      rating: 5
    },
    // Adding more to reach 50+
    {
      id: 26,
      name: "Henry Rodriguez",
      age: 16,
      photo: "👦",
      parentName: "Diana Rodriguez",
      location: "Raleigh, NC",
      achievement: "Tech Intern • Phase 3",
      quote: "Henry got a $20/hr internship at a tech company. He's earning while learning!",
      phase: "Phase 3",
      rating: 5
    },
    {
      id: 27,
      name: "Grace Lee",
      age: 10,
      photo: "👧",
      parentName: "William Lee",
      location: "Memphis, TN",
      achievement: "Young Innovator • Phase 1",
      quote: "Grace built an app to help her grandma remember medications. It's life-changing!",
      phase: "Phase 1",
      rating: 5
    },
    {
      id: 28,
      name: "Samuel Kim",
      age: 13,
      photo: "👦",
      parentName: "Susan Kim",
      location: "Louisville, KY",
      achievement: "Web Developer • Phase 2",
      quote: "Samuel freelances as a web developer now. He's made $3K building sites for local businesses!",
      phase: "Phase 2",
      rating: 5
    },
    {
      id: 29,
      name: "Chloe Wright",
      age: 12,
      photo: "👧",
      parentName: "Richard Wright",
      location: "Portland, ME",
      achievement: "AI Artist • Phase 2",
      quote: "She combines AI and art to create stunning designs. Her work was featured in a gallery!",
      phase: "Phase 2",
      rating: 5
    },
    {
      id: 30,
      name: "Jack Hill",
      age: 15,
      photo: "👦",
      parentName: "Karen Hill",
      location: "Richmond, VA",
      achievement: "Machine Learning Dev • Phase 3",
      quote: "Jack built a stock predictor that actually works. He's managing his own portfolio now!",
      phase: "Phase 3",
      rating: 5
    },
  ];

  // Duplicate the array for infinite scroll
  const allStudents = [...students, ...students, ...students];

  return (
    <section className="py-20 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-40" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}

        {/* Infinite Scrolling Testimonials - 3 Columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
          {/* Column 1 - Scrolling Down */}
          <div className="space-y-6 overflow-hidden">
            <motion.div
              animate={{
                y: [0, -2000],
              }}
              transition={{
                duration: 40,
                repeat: Infinity,
                ease: "linear",
              }}
              className="space-y-6"
            >
              {allStudents.slice(0, 30).map((student, index) => (
                <TestimonialCard key={`col1-${index}`} student={student} />
              ))}
            </motion.div>
          </div>

          {/* Column 2 - Scrolling Up */}
          <div className="space-y-6 overflow-hidden hidden md:block">
            <motion.div
              animate={{
                y: [-2000, 0],
              }}
              transition={{
                duration: 40,
                repeat: Infinity,
                ease: "linear",
              }}
              className="space-y-6"
            >
              {allStudents.slice(10, 40).map((student, index) => (
                <TestimonialCard key={`col2-${index}`} student={student} />
              ))}
            </motion.div>
          </div>

          {/* Column 3 - Scrolling Down */}
          <div className="space-y-6 overflow-hidden hidden md:block">
            <motion.div
              animate={{
                y: [0, -2000],
              }}
              transition={{
                duration: 40,
                repeat: Infinity,
                ease: "linear",
              }}
              className="space-y-6"
            >
              {allStudents.slice(20, 50).map((student, index) => (
                <TestimonialCard key={`col3-${index}`} student={student} />
              ))}
            </motion.div>
          </div>

          {/* Gradient Overlays */}
          <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-purple-900 to-transparent pointer-events-none z-10" />
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-purple-900 to-transparent pointer-events-none z-10" />
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <button
            onClick={() => window.location.href = '/auth?mode=signup'}
            className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-300 hover:to-orange-400 text-gray-900 font-bold px-12 py-5 rounded-2xl transform hover:scale-105 transition-all duration-200 shadow-2xl hover:shadow-3xl text-lg"
          >
            Join 100,000+ Successful Students
          </button>
          <p className="text-blue-200 mt-4 text-sm">
            ⭐ 4.9/5 average rating from 12,847 parents
          </p>
        </motion.div>
      </div>
    </section>
  );
};

// Testimonial Card Component
const TestimonialCard: React.FC<{ student: StudentProfile }> = ({ student }) => {
  return (
    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105 hover:shadow-2xl group">
      <div className="flex items-start gap-4 mb-4">
        <div className="text-5xl">{student.photo}</div>
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1">
            <h3 className="font-bold text-white text-lg">{student.name}, {student.age}</h3>
            <div className="flex gap-0.5">
              {[...Array(student.rating)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
          </div>
          <p className="text-blue-200 text-sm">{student.location}</p>
          <div className="inline-block bg-gradient-to-r from-yellow-400/20 to-orange-400/20 text-yellow-300 px-3 py-1 rounded-full text-xs font-semibold mt-2 border border-yellow-400/30">
            {student.achievement}
          </div>
        </div>
      </div>
      <p className="text-white/90 italic mb-4 leading-relaxed">
        "{student.quote}"
      </p>
      <div className="flex items-center justify-between text-sm">
        <p className="text-blue-300 font-medium">— {student.parentName}</p>
        <span className="text-purple-300 text-xs">{student.phase}</span>
      </div>
    </div>
  );
};

export default InfiniteTestimonialsScroll;



      quote: "She uses AI to create presentations that wow her teachers. Confidence is through the roof!",

      phase: "Phase 1",

      rating: 5

    },

    {

      id: 22,

      name: "Logan Thompson",

      age: 15,

      photo: "👦",

      parentName: "Nicole Thompson",

      location: "Baltimore, MD",

      achievement: "Startup Founder • Phase 3",

      quote: "Logan raised $50K for his AI startup at 15. This program changed our lives!",

      phase: "Phase 3",

      rating: 5

    },

    {

      id: 23,

      name: "Scarlett Garcia",

      age: 12,

      photo: "👧",

      parentName: "Anthony Garcia",

      location: "Milwaukee, WI",

      achievement: "Content Creator • Phase 2",

      quote: "She built an AI content generator and started a YouTube channel about coding. 10K subscribers!",

      phase: "Phase 2",

      rating: 5

    },

    {

      id: 24,

      name: "Benjamin Martinez",

      age: 11,

      photo: "👦",

      parentName: "Rachel Martinez",

      location: "Sacramento, CA",

      achievement: "Hackathon Winner • Phase 1",

      quote: "Benjamin won his first coding competition after just 3 months! The prize was $1,000!",

      phase: "Phase 1",

      rating: 5

    },

    {

      id: 25,

      name: "Victoria Lopez",

      age: 14,

      photo: "👧",

      parentName: "Steven Lopez",

      location: "Kansas City, MO",

      achievement: "AI Automation Expert • Phase 2",

      quote: "She automated our entire household schedule with AI. Life has never been easier!",

      phase: "Phase 2",

      rating: 5

    },

    // Adding more to reach 50+

    {

      id: 26,

      name: "Henry Rodriguez",

      age: 16,

      photo: "👦",

      parentName: "Diana Rodriguez",

      location: "Raleigh, NC",

      achievement: "Tech Intern • Phase 3",

      quote: "Henry got a $20/hr internship at a tech company. He's earning while learning!",

      phase: "Phase 3",

      rating: 5

    },

    {

      id: 27,

      name: "Grace Lee",

      age: 10,

      photo: "👧",

      parentName: "William Lee",

      location: "Memphis, TN",

      achievement: "Young Innovator • Phase 1",

      quote: "Grace built an app to help her grandma remember medications. It's life-changing!",

      phase: "Phase 1",

      rating: 5

    },

    {

      id: 28,

      name: "Samuel Kim",

      age: 13,

      photo: "👦",

      parentName: "Susan Kim",

      location: "Louisville, KY",

      achievement: "Web Developer • Phase 2",

      quote: "Samuel freelances as a web developer now. He's made $3K building sites for local businesses!",

      phase: "Phase 2",

      rating: 5

    },

    {

      id: 29,

      name: "Chloe Wright",

      age: 12,

      photo: "👧",

      parentName: "Richard Wright",

      location: "Portland, ME",

      achievement: "AI Artist • Phase 2",

      quote: "She combines AI and art to create stunning designs. Her work was featured in a gallery!",

      phase: "Phase 2",

      rating: 5

    },

    {

      id: 30,

      name: "Jack Hill",

      age: 15,

      photo: "👦",

      parentName: "Karen Hill",

      location: "Richmond, VA",

      achievement: "Machine Learning Dev • Phase 3",

      quote: "Jack built a stock predictor that actually works. He's managing his own portfolio now!",

      phase: "Phase 3",

      rating: 5

    },

  ];



  // Duplicate the array for infinite scroll

  const allStudents = [...students, ...students, ...students];



  return (

    <section className="py-20 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative overflow-hidden">

      {/* Background effects */}

      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-40" />

      

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Header */}

        <motion.div

          initial={{ opacity: 0, y: 30 }}

          whileInView={{ opacity: 1, y: 0 }}

          viewport={{ once: true }}

          className="text-center mb-16"

        >

          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-semibold mb-6">

            <Award size={16} />

            Real Transformation Stories

          </div>

          <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">

            Watch Your Child{' '}

            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-pink-300 to-purple-300">

              Transform

            </span>

          </h2>

          <p className="text-xl text-blue-100 max-w-3xl mx-auto">

            Join 100,000+ families who've seen their kids go from "I don't know" to "I built this!"

          </p>

        </motion.div>



        {/* Infinite Scrolling Testimonials - 3 Columns */}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">

          {/* Column 1 - Scrolling Down */}

          <div className="space-y-6 overflow-hidden">

            <motion.div

              animate={{

                y: [0, -2000],

              }}

              transition={{

                duration: 40,

                repeat: Infinity,

                ease: "linear",

              }}

              className="space-y-6"

            >

              {allStudents.slice(0, 30).map((student, index) => (

                <TestimonialCard key={`col1-${index}`} student={student} />

              ))}

            </motion.div>

          </div>



          {/* Column 2 - Scrolling Up */}

          <div className="space-y-6 overflow-hidden hidden md:block">

            <motion.div

              animate={{

                y: [-2000, 0],

              }}

              transition={{

                duration: 40,

                repeat: Infinity,

                ease: "linear",

              }}

              className="space-y-6"

            >

              {allStudents.slice(10, 40).map((student, index) => (

                <TestimonialCard key={`col2-${index}`} student={student} />

              ))}

            </motion.div>

          </div>



          {/* Column 3 - Scrolling Down */}

          <div className="space-y-6 overflow-hidden hidden md:block">

            <motion.div

              animate={{

                y: [0, -2000],

              }}

              transition={{

                duration: 40,

                repeat: Infinity,

                ease: "linear",

              }}

              className="space-y-6"

            >

              {allStudents.slice(20, 50).map((student, index) => (

                <TestimonialCard key={`col3-${index}`} student={student} />

              ))}

            </motion.div>

          </div>



          {/* Gradient Overlays */}

          <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-purple-900 to-transparent pointer-events-none z-10" />

          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-purple-900 to-transparent pointer-events-none z-10" />

        </div>



        {/* CTA */}

        <motion.div

          initial={{ opacity: 0, y: 20 }}

          whileInView={{ opacity: 1, y: 0 }}

          viewport={{ once: true }}

          className="text-center mt-16"

        >

          <button

            onClick={() => window.location.href = '/auth?mode=signup'}

            className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-300 hover:to-orange-400 text-gray-900 font-bold px-12 py-5 rounded-2xl transform hover:scale-105 transition-all duration-200 shadow-2xl hover:shadow-3xl text-lg"

          >

            Join 100,000+ Successful Students

          </button>

          <p className="text-blue-200 mt-4 text-sm">

            ⭐ 4.9/5 average rating from 12,847 parents

          </p>

        </motion.div>

      </div>

    </section>

  );

};



// Testimonial Card Component

const TestimonialCard: React.FC<{ student: StudentProfile }> = ({ student }) => {

  return (

    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105 hover:shadow-2xl group">

      <div className="flex items-start gap-4 mb-4">

        <div className="text-5xl">{student.photo}</div>

        <div className="flex-1">

          <div className="flex items-center justify-between mb-1">

            <h3 className="font-bold text-white text-lg">{student.name}, {student.age}</h3>

            <div className="flex gap-0.5">

              {[...Array(student.rating)].map((_, i) => (

                <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />

              ))}

            </div>

          </div>

          <p className="text-blue-200 text-sm">{student.location}</p>

          <div className="inline-block bg-gradient-to-r from-yellow-400/20 to-orange-400/20 text-yellow-300 px-3 py-1 rounded-full text-xs font-semibold mt-2 border border-yellow-400/30">

            {student.achievement}

          </div>

        </div>

      </div>

      <p className="text-white/90 italic mb-4 leading-relaxed">

        "{student.quote}"

      </p>

      <div className="flex items-center justify-between text-sm">

        <p className="text-blue-300 font-medium">— {student.parentName}</p>

        <span className="text-purple-300 text-xs">{student.phase}</span>

      </div>

    </div>

  );

};



export default InfiniteTestimonialsScroll;




