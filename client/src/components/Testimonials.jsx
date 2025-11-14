import React from 'react';
import { Star, Quote } from 'lucide-react';

const Testimonials = () => {
  const testimonials = [
    {
      name: "Rajesh Kumar",
      role: "Wheat Farmer, Punjab",
      image: "👨‍🌾",
      rating: 5,
      text: "AgroCare AI transformed my farming! The crop recommendations increased my yield by 35%. The pest detection feature saved my entire harvest last season."
    },
    {
      name: "Priya Sharma",
      role: "Organic Farmer, Maharashtra",
      image: "👩‍🌾",
      rating: 5,
      text: "As an organic farmer, the AI insights help me maintain sustainability while maximizing profits. The weather predictions are incredibly accurate!"
    },
    {
      name: "Mohammed Ali",
      role: "Rice Farmer, West Bengal",
      image: "👨‍🌾",
      rating: 5,
      text: "The mobile app is so easy to use! I can check my farm data anywhere. The pest identifier saved me thousands of rupees in crop losses."
    },
    {
      name: "Lakshmi Devi",
      role: "Vegetable Farmer, Tamil Nadu",
      image: "👩‍🌾",
      rating: 5,
      text: "Best investment for my farm! The AI recommendations helped me diversify crops and increase income. Customer support is excellent too!"
    },
    {
      name: "Suresh Patel",
      role: "Cotton Farmer, Gujarat",
      image: "👨‍🌾",
      rating: 5,
      text: "Revolutionary platform! The soil analysis feature helped me understand my land better. My cotton quality improved significantly this year."
    },
    {
      name: "Anita Reddy",
      role: "Fruit Farmer, Andhra Pradesh",
      image: "👩‍🌾",
      rating: 5,
      text: "AgroCare AI is a game-changer! The disease prevention alerts helped me protect my mango orchard. Highly recommend to all farmers!"
    }
  ];

  return (
    <section className="py-20 bg-white dark:bg-gray-800 transition-colors duration-200 overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16 animate-fadeIn">
          <div className="inline-flex items-center space-x-2 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 px-4 py-2 rounded-full mb-4">
            <Star className="w-4 h-4 fill-current" />
            <span className="text-sm font-semibold">Trusted by Farmers</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            What Farmers Say About Us
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Join thousands of satisfied farmers who've transformed their agriculture with AgroCare AI
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="group animate-fadeIn"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-8 h-full shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 border border-gray-200 dark:border-gray-700 relative">
                {/* Quote Icon */}
                <div className="absolute top-6 right-6 opacity-10 dark:opacity-5">
                  <Quote className="w-16 h-16 text-emerald-600" />
                </div>

                {/* Rating */}
                <div className="flex space-x-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>

                {/* Testimonial Text */}
                <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed relative z-10">
                  "{testimonial.text}"
                </p>

                {/* User Info */}
                <div className="flex items-center space-x-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center text-2xl shadow-md">
                    {testimonial.image}
                  </div>
                  <div>
                    <div className="font-bold text-gray-900 dark:text-white">{testimonial.name}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Trust Badges */}
        <div className="mt-20 flex flex-wrap justify-center items-center gap-8 opacity-60">
          <div className="text-center">
            <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">4.9/5</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Average Rating</div>
          </div>
          <div className="w-px h-12 bg-gray-300 dark:bg-gray-700"></div>
          <div className="text-center">
            <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">10,000+</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Happy Farmers</div>
          </div>
          <div className="w-px h-12 bg-gray-300 dark:bg-gray-700"></div>
          <div className="text-center">
            <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">500K+</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Acres Managed</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;