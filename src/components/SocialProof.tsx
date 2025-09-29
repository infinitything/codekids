import React from 'react';
import { Star, MapPin } from 'lucide-react';

const SocialProof = () => {
  const testimonials = [
    {
      quote: "My 9-year-old built her first app in 2 weeks",
      description: "I never imagined Emma would be teaching ME about coding. She's more excited about her programming lessons than cartoons!",
      author: "Sarah Chen",
      role: "Mom of 3",
      location: "San Francisco",
      rating: 5,
      image: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400"
    },
    {
      quote: "From struggling with math to loving algorithms",
      description: "CodeKid didn't just teach him programming—it transformed how he thinks about problem-solving. His confidence soared.",
      author: "Marcus Johnson",
      role: "Dad",
      location: "Austin, TX",
      rating: 5,
      image: "https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=400"
    },
    {
      quote: "She got into MIT's summer program at 14",
      description: "The logical thinking skills from CodeKid gave her an edge in everything. She's now the youngest in her robotics team.",
      author: "Dr. Lisa Park",
      role: "Pediatric Surgeon",
      location: "Boston",
      rating: 5,
      image: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400"
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-gray-900 mb-6">
            Real Kids. Real Results. <span className="text-blue-600">Real Future.</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-white p-8 rounded-2xl border border-gray-100 shadow-lg hover:shadow-xl transform hover:-translate-y-2 transition-all duration-300 group"
            >
              {/* Quote Icon */}
              <div className="text-blue-600 text-4xl font-serif mb-4">"</div>
              
              {/* Quote */}
              <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors">
                {testimonial.quote}
              </h3>
              
              {/* Description */}
              <p className="text-gray-600 mb-6 leading-relaxed">
                {testimonial.description}
              </p>
              
              {/* Rating */}
              <div className="flex items-center gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                ))}
              </div>
              
              {/* Author Info */}
              <div className="flex items-center gap-4">
                <img
                  src={testimonial.image}
                  alt={testimonial.author}
                  className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
                />
                <div>
                  <div className="font-semibold text-gray-900">{testimonial.author}</div>
                  <div className="text-sm text-gray-600">{testimonial.role}</div>
                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    <MapPin size={12} />
                    {testimonial.location}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SocialProof;