import React from 'react';
import { Check, X } from 'lucide-react';

const Comparison = () => {
  const features = [
    { feature: 'Live AI Mentor', codekid: true, others: false, tutoring: false },
    { feature: 'Real Project Portfolio', codekid: true, others: false, tutoring: false },
    { feature: 'Industry Certifications', codekid: true, others: false, tutoring: false },
    { feature: '24/7 Parent Dashboard', codekid: true, others: false, tutoring: false },
    { feature: 'Job Placement Help', codekid: true, others: false, tutoring: false },
    { feature: 'Cost per Year', codekid: '$299', others: '$800+', tutoring: '$4,000+' }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-gray-900 mb-6">
            Why CodeKid Beats <span className="text-blue-600">Every Other Option</span>
          </h2>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="grid grid-cols-4 bg-gray-50 border-b border-gray-200">
            <div className="p-6">
              <h3 className="font-bold text-lg text-gray-900">Feature</h3>
            </div>
            <div className="p-6 bg-blue-600 text-white relative">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                BEST VALUE
              </div>
              <h3 className="font-bold text-lg text-center mt-2">CodeKid</h3>
            </div>
            <div className="p-6">
              <h3 className="font-bold text-lg text-gray-900 text-center">Other Platforms</h3>
            </div>
            <div className="p-6">
              <h3 className="font-bold text-lg text-gray-900 text-center">Private Tutoring</h3>
            </div>
          </div>

          {/* Feature Rows */}
          {features.map((row, index) => (
            <div key={index} className={`grid grid-cols-4 border-b border-gray-100 ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}>
              <div className="p-6">
                <span className="font-medium text-gray-900">{row.feature}</span>
              </div>
              <div className="p-6 bg-blue-50 text-center">
                {row.feature === 'Cost per Year' ? (
                  <span className="font-bold text-green-600 text-lg">{row.codekid}</span>
                ) : row.codekid ? (
                  <Check className="w-6 h-6 text-green-500 mx-auto" />
                ) : (
                  <X className="w-6 h-6 text-red-500 mx-auto" />
                )}
              </div>
              <div className="p-6 text-center">
                {row.feature === 'Cost per Year' ? (
                  <span className="font-medium text-red-600">{row.others}</span>
                ) : row.others ? (
                  <Check className="w-6 h-6 text-green-500 mx-auto" />
                ) : (
                  <X className="w-6 h-6 text-red-500 mx-auto" />
                )}
              </div>
              <div className="p-6 text-center">
                {row.feature === 'Cost per Year' ? (
                  <span className="font-medium text-red-600">{row.tutoring}</span>
                ) : row.tutoring ? (
                  <Check className="w-6 h-6 text-green-500 mx-auto" />
                ) : (
                  <X className="w-6 h-6 text-red-500 mx-auto" />
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-8">
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-12 py-4 rounded-xl transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl">
            Choose the Best Option - Start Free Trial
          </button>
        </div>
      </div>
    </section>
  );
};

export default Comparison;