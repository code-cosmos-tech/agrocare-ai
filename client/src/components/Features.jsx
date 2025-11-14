import React from 'react';
import { Sprout, Bug, Cloud, TrendingUp, Shield, Smartphone } from 'lucide-react';

const Features = () => {
  const features = [
    {
      icon: <Sprout className="w-6 h-6" />,
      title: "Smart Crop Recommendation",
      description: "AI analyzes soil composition, climate patterns, and historical data to suggest the most profitable crops for your land.",
      gradient: "from-emerald-500 to-green-600"
    },
    {
      icon: <Bug className="w-6 h-6" />,
      title: "Instant Pest Identification",
      description: "Upload a photo and get instant pest detection with treatment recommendations powered by deep learning.",
      gradient: "from-red-500 to-pink-600"
    },
    {
      icon: <Cloud className="w-6 h-6" />,
      title: "Weather Intelligence",
      description: "Real-time weather forecasts and alerts help you plan irrigation, harvesting, and protect your crops.",
      gradient: "from-blue-500 to-cyan-600"
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: "Yield Optimization",
      description: "Data-driven insights to maximize productivity and reduce waste, increasing your farm's profitability.",
      gradient: "from-purple-500 to-violet-600"
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Disease Prevention",
      description: "Early warning system detects potential crop diseases before they spread, saving your harvest.",
      gradient: "from-orange-500 to-amber-600"
    },
    {
      icon: <Smartphone className="w-6 h-6" />,
      title: "Mobile & Web Access",
      description: "Access your farm data anywhere, anytime with our responsive web app and mobile application.",
      gradient: "from-teal-500 to-emerald-600"
    }
  ];

  return (
    <section id="features" className="py-20 bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16 animate-fadeIn">
          <div className="inline-flex items-center space-x-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 px-4 py-2 rounded-full mb-4">
            <span className="text-sm font-semibold">🚀 Powerful Features</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Everything You Need for
            <span className="text-emerald-600 dark:text-emerald-400"> Smart Farming</span>
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Comprehensive AI-powered tools designed to help modern farmers make better decisions
            and achieve sustainable growth
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group animate-fadeIn"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 h-full shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 border border-gray-100 dark:border-gray-700">
                {/* Icon */}
                <div className={`inline-flex p-4 rounded-xl bg-gradient-to-br ${feature.gradient} text-white mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300`}>
                  {feature.icon}
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  {feature.description}
                </p>

                {/* Hover Arrow */}
                <div className="mt-6 flex items-center text-emerald-600 dark:text-emerald-400 font-semibold opacity-0 group-hover:opacity-100 transform translate-x-0 group-hover:translate-x-2 transition-all duration-300">
                  Learn more
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Stats */}
        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md">
            <div className="text-4xl font-bold text-emerald-600 dark:text-emerald-400 mb-2">50+</div>
            <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">Crop Types Supported</div>
          </div>
          <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md">
            <div className="text-4xl font-bold text-emerald-600 dark:text-emerald-400 mb-2">1000+</div>
            <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">Pests Identified</div>
          </div>
          <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md">
            <div className="text-4xl font-bold text-emerald-600 dark:text-emerald-400 mb-2">99%</div>
            <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">Uptime Guarantee</div>
          </div>
          <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md">
            <div className="text-4xl font-bold text-emerald-600 dark:text-emerald-400 mb-2">24/7</div>
            <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">Support Available</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;