import React, { useState } from 'react';
import { Plus, Minus, Search } from 'lucide-react';

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');

  const faqs = [
    {
      question: "Is my child too young/old to start?",
      answer: "Our youngest successful graduate was 6, our oldest started at 15. The curriculum adapts to any age and skill level. Our AI-powered learning system automatically adjusts the pace and complexity based on your child's progress and comprehension.",
      category: "Age & Prerequisites"
    },
    {
      question: "What if my child has no tech experience?",
      answer: "Perfect! 89% of our students start with zero coding knowledge. We designed this specifically for complete beginners. The first lessons use visual, drag-and-drop programming that feels more like playing a game than learning code.",
      category: "Getting Started"
    },
    {
      question: "How much time does this require daily?",
      answer: "Most kids spend 20-30 minutes per day, 4-5 days per week. The AI tutor adapts to your family's schedule. You can set custom time limits, and the system will pause automatically. Many parents report their kids asking for 'just 5 more minutes'!",
      category: "Time Commitment"
    },
    {
      question: "What devices do we need?",
      answer: "Any tablet, laptop, or desktop with internet connection. We work on iPad, Chromebook, Windows, and Mac. Our platform is web-based, so there's no software to install. Everything runs in your browser with automatic syncing across devices.",
      category: "Technical Requirements"
    },
    {
      question: "Can parents track progress?",
      answer: "Yes! Real-time dashboard shows completed lessons, time spent, projects built, and skills mastered. You'll receive weekly progress reports, and you can see exactly what your child is learning and building at any time.",
      category: "Parent Features"
    },
    {
      question: "What if my child gets stuck or frustrated?",
      answer: "Our 24/7 AI mentor provides instant help with hints and encouragement. If needed, live expert help is available within 15 minutes. We've designed the curriculum to prevent frustration with bite-sized lessons and immediate positive feedback.",
      category: "Support"
    },
    {
      question: "How is this different from free coding websites?",
      answer: "Free sites lack structure, personalization, and support. CodeKid provides a complete learning path, adaptive AI tutoring, real project portfolios, industry certifications, and dedicated parent support. It's the difference between scattered tutorials and a comprehensive education.",
      category: "Comparison"
    },
    {
      question: "Are the certificates and skills actually valuable?",
      answer: "Our curriculum is designed with input from Google, Microsoft, and other tech leaders. Students have used their CodeKid portfolios to get into top computer science programs, win coding competitions, and even land internships. The projects are real and impressive.",
      category: "Career Value"
    }
  ];

  const filteredFAQs = faqs.filter(
    faq =>
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const categories = [...new Set(faqs.map(faq => faq.category))];

  return (
    <section id="faq" className="py-20 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-gray-900 mb-6">
            Questions Every <span className="text-blue-600">Smart Parent</span> Asks
          </h2>
          <p className="text-xl text-gray-600">
            Get instant answers to the most common questions from families just like yours.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative mb-8">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search questions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Category Tags */}
        <div className="flex flex-wrap gap-2 mb-8 justify-center">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSearchTerm(category)}
              className="px-4 py-2 text-sm bg-white border border-gray-300 rounded-full hover:border-blue-500 hover:text-blue-600 transition-colors"
            >
              {category}
            </button>
          ))}
        </div>

        {/* FAQ Items */}
        <div className="space-y-4">
          {filteredFAQs.map((faq, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
            >
              <button
                className="w-full px-6 py-6 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                onClick={() => setOpenIndex(openIndex === index ? -1 : index)}
              >
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {faq.question}
                  </h3>
                  <div className="text-sm text-blue-600 font-medium">
                    {faq.category}
                  </div>
                </div>
                <div className="ml-4 flex-shrink-0">
                  {openIndex === index ? (
                    <Minus className="h-5 w-5 text-blue-600" />
                  ) : (
                    <Plus className="h-5 w-5 text-gray-400" />
                  )}
                </div>
              </button>
              
              {openIndex === index && (
                <div className="px-6 pb-6">
                  <div className="border-t border-gray-100 pt-4">
                    <p className="text-gray-700 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {filteredFAQs.length === 0 && (
          <div className="text-center py-12">
            <div className="text-4xl mb-4">🤔</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No matching questions found</h3>
            <p className="text-gray-600">Try a different search term or browse our categories above.</p>
          </div>
        )}

        {/* Still Have Questions CTA */}
        <div className="text-center mt-16">
          <div className="bg-blue-50 rounded-2xl p-8 inline-block">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Still Have Questions?
            </h3>
            <p className="text-gray-600 mb-6">
              Our parent success team is here to help. Get answers within 2 hours.
            </p>
            <button 
              onClick={() => window.location.href = 'mailto:support@codekid.com'}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
            >
              Chat with Parent Success Team
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
