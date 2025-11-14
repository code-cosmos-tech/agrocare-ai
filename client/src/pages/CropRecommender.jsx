import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { Sprout, Droplets, Thermometer, Zap, Wind, TrendingUp, AlertCircle, CheckCircle, Loader } from 'lucide-react';

const CropRecommender = () => {
  const [formData, setFormData] = useState({
    nitrogen: '',
    phosphorus: '',
    potassium: '',
    temperature: '',
    humidity: '',
    ph: '',
    rainfall: ''
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch('http://localhost:8000/recommend', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        setResult(data);
        toast.success('Recommendation generated successfully! 🌾', {
          position: 'top-right',
          autoClose: 3000,
        });
      } else {
        toast.error(data.error || 'Failed to get recommendation', {
          position: 'top-right',
          autoClose: 4000,
        });
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Connection error. Please ensure the ML API is running.', {
        position: 'top-right',
        autoClose: 4000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      nitrogen: '',
      phosphorus: '',
      potassium: '',
      temperature: '',
      humidity: '',
      ph: '',
      rainfall: ''
    });
    setResult(null);
  };

  const inputFields = [
    {
      name: 'nitrogen',
      label: 'Nitrogen (N)',
      placeholder: 'e.g., 90',
      icon: <Zap className="w-5 h-5" />,
      info: 'Nitrogen content in soil (0-140 kg/ha)',
      color: 'text-blue-600 dark:text-blue-400'
    },
    {
      name: 'phosphorus',
      label: 'Phosphorus (P)',
      placeholder: 'e.g., 42',
      icon: <Zap className="w-5 h-5" />,
      info: 'Phosphorus content in soil (5-145 kg/ha)',
      color: 'text-purple-600 dark:text-purple-400'
    },
    {
      name: 'potassium',
      label: 'Potassium (K)',
      placeholder: 'e.g., 43',
      icon: <Zap className="w-5 h-5" />,
      info: 'Potassium content in soil (5-205 kg/ha)',
      color: 'text-orange-600 dark:text-orange-400'
    },
    {
      name: 'temperature',
      label: 'Temperature',
      placeholder: 'e.g., 25.5',
      icon: <Thermometer className="w-5 h-5" />,
      info: 'Average temperature in °C (8-45°C)',
      color: 'text-red-600 dark:text-red-400'
    },
    {
      name: 'humidity',
      label: 'Humidity',
      placeholder: 'e.g., 80',
      icon: <Droplets className="w-5 h-5" />,
      info: 'Relative humidity percentage (14-100%)',
      color: 'text-cyan-600 dark:text-cyan-400'
    },
    {
      name: 'ph',
      label: 'pH Level',
      placeholder: 'e.g., 6.5',
      icon: <Wind className="w-5 h-5" />,
      info: 'Soil pH level (3.5-9.5)',
      color: 'text-emerald-600 dark:text-emerald-400'
    },
    {
      name: 'rainfall',
      label: 'Rainfall',
      placeholder: 'e.g., 202',
      icon: <Droplets className="w-5 h-5" />,
      info: 'Annual rainfall in mm (20-300mm)',
      color: 'text-blue-600 dark:text-blue-400'
    }
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 dark:from-emerald-700 dark:to-emerald-800 rounded-2xl p-6 sm:p-8 text-white shadow-xl">
        <div className="flex items-center space-x-4">
          <div className="p-4 bg-white/20 backdrop-blur-sm rounded-xl">
            <Sprout className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold mb-2">Crop Recommender</h1>
            <p className="text-emerald-100">Get AI-powered crop suggestions based on your soil and climate data</p>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Form Section */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 sm:p-8 shadow-lg border border-gray-100 dark:border-gray-700">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
              <TrendingUp className="w-6 h-6 mr-2 text-emerald-600" />
              Enter Your Farm Data
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                {inputFields.map((field, index) => (
                  <div key={field.name} className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className={field.color}>{field.icon}</span>
                        <span>{field.label}</span>
                      </div>
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      name={field.name}
                      value={formData[field.name]}
                      onChange={handleChange}
                      placeholder={field.placeholder}
                      required
                      className="input-field w-full"
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400 flex items-start">
                      <AlertCircle className="w-3 h-3 mr-1 mt-0.5 flex-shrink-0" />
                      {field.info}
                    </p>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-6">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 flex items-center justify-center px-6 py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {loading ? (
                    <>
                      <Loader className="w-5 h-5 mr-2 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Sprout className="w-5 h-5 mr-2" />
                      Get Recommendation
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={handleReset}
                  className="px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-semibold rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
                >
                  Reset Form
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Info & Result Section */}
        <div className="space-y-6">
          {/* Info Card */}
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center">
              <AlertCircle className="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400" />
              How It Works
            </h3>
            <ul className="space-y-3 text-sm text-gray-700 dark:text-gray-300">
              <li className="flex items-start">
                <CheckCircle className="w-4 h-4 mr-2 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                <span>Enter your soil nutrient values (N, P, K)</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-4 h-4 mr-2 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                <span>Provide climate data (temperature, humidity, rainfall)</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-4 h-4 mr-2 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                <span>Our AI analyzes the data using machine learning</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-4 h-4 mr-2 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                <span>Get the best crop recommendation for your farm</span>
              </li>
            </ul>
          </div>

          {/* Result Card */}
          {result && (
            <div className="bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-xl p-6 text-white shadow-xl animate-fadeIn">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-3 bg-white/20 backdrop-blur-sm rounded-lg">
                  <Sprout className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold">Recommended Crop</h3>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
                <div className="text-center">
                  <div className="text-5xl mb-4">🌾</div>
                  <h2 className="text-3xl font-bold mb-2">{result.recommended_crop}</h2>
                  <p className="text-emerald-100 mb-4">
                    Best suited for your farm conditions
                  </p>
                  {result.confidence && (
                    <div className="inline-flex items-center space-x-2 bg-white/20 px-4 py-2 rounded-lg">
                      <TrendingUp className="w-4 h-4" />
                      <span className="font-semibold">{result.confidence}% Confidence</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Tips Card */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">💡 Pro Tips</h3>
            <ul className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
              <li className="flex items-start">
                <span className="text-emerald-600 dark:text-emerald-400 mr-2">•</span>
                <span>Test your soil regularly for accurate nutrient levels</span>
              </li>
              <li className="flex items-start">
                <span className="text-emerald-600 dark:text-emerald-400 mr-2">•</span>
                <span>Consider seasonal variations in climate data</span>
              </li>
              <li className="flex items-start">
                <span className="text-emerald-600 dark:text-emerald-400 mr-2">•</span>
                <span>Monitor pH levels and adjust if necessary</span>
              </li>
              <li className="flex items-start">
                <span className="text-emerald-600 dark:text-emerald-400 mr-2">•</span>
                <span>Consult local agricultural experts for best results</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CropRecommender;