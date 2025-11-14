import React from 'react';
import { Upload, Brain, BarChart3, CheckCircle } from 'lucide-react';

const HowItWorks = () => {
  const steps = [
    {
      icon: <Upload className="w-8 h-8" />,
      title: "Upload Data",
      description: "Share your soil parameters, climate data, or upload pest images through our intuitive interface.",
      color: "from-blue-500 to-blue-600"
    },
    {
      icon: <Brain className="w-8 h-8" />,
      title: "AI Analysis",
      description: "Our advanced machine learning models process your data in real-time for accurate predictions.",
      color: "from-purple-500 to-purple-600"
    },
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: "Get Insights",
      description: "Receive detailed recommendations, predictions, and actionable insights tailored to your farm.",
      color: "from-emerald-500 to-emerald-600"
    },
    {
      icon: <CheckCircle className="w-8 h-8" />,
      title: "Take Action",
      description: "Implement AI-driven strategies to optimize yield, reduce costs, and improve sustainability.",
      color: "from-orange-500 to-orange-600"
    }
  ];

  return (
    <section id="how-it-works" className="py-20 bg-white dark:bg-gray-800 transition-colors duration-200">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16 animate-fadeIn">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            How It Works
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Four simple steps to transform your farming with AI-powered intelligence
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {/* Connection Lines (Desktop) */}
          <div className="hidden lg:block absolute top-20 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 via-purple-500 via-emerald-500 to-orange-500 opacity-20"></div>

          {steps.map((step, index) => (
            <div
              key={index}
              className="relative group animate-fadeIn"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Card */}
              <div className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-8 h-full transform hover:-translate-y-2 transition-all duration-300 hover:shadow-xl border border-gray-200 dark:border-gray-700">
                {/* Step Number */}
                <div className="absolute -top-4 -right-4 w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-lg">{index + 1}</span>
                </div>

                {/* Icon */}
                <div className={`inline-flex p-4 rounded-xl bg-gradient-to-br ${step.color} text-white mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  {step.icon}
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                  {step.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Ready to revolutionize your farming practices?
          </p>
          <button className="px-8 py-4 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200">
            Start Your Free Trial
          </button>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;