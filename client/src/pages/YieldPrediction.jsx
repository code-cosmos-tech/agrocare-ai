import React, { useState, useEffect } from "react";
import { useLanguage } from "../store/language";
import { useAuth } from "../store/Auth";
import { useNavigate } from "react-router";
import axios from "axios";
import { TrendingUp, Droplets, Sprout, Bug, Calendar, AlertCircle, Loader, Target, BarChart3 } from 'lucide-react';
import { toast } from 'react-toastify';

import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";

import { Doughnut, Line, Bar } from "react-chartjs-2";

// Register Chart.js components
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
  CategoryScale,
  LinearScale,
  BarElement
);

const YieldPrediction = () => {
  const { isLoggedIn } = useAuth();
  const { T, language } = useLanguage();
  const navigate = useNavigate();

  // Form state
  const [farmInfo, setFarmInfo] = useState({
    Crop: "",
    Season: "",
    State: "",
    Annual_Rainfall: "",
    Fertilizer_Per_Hectare: "",
    Pesticide_Per_Hectare: "",
  });

  const [prediction, setPrediction] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  // Redirect if not logged in
  useEffect(() => {
    if (!isLoggedIn) navigate("/login");
  }, [isLoggedIn, navigate]);

  // Handle input updates
  const handleInfoChange = (e) => {
    const { name, value } = e.target;
    setFarmInfo((prev) => ({ ...prev, [name]: value }));
  };

  // ML API base URL
  const ML_BASE = import.meta.env.VITE_ML_API_URL || "http://localhost:8000";

  // Robust parsing helper
  const parseNumber = (v) => {
    const n = Number(v);
    return Number.isFinite(n) ? n : 0;
  };

  // Prediction handler
  const handleGetEstimate = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);
    setPrediction(null);

    // Build payload
    const payload = {
      Crop: String(farmInfo.Crop || "").trim(),
      Season: String(farmInfo.Season || "").trim(),
      State: String(farmInfo.State || "Punjab").trim(),
      Annual_Rainfall: parseNumber(farmInfo.Annual_Rainfall),
      Fertilizer_Per_Hectare: parseNumber(farmInfo.Fertilizer_Per_Hectare),
      Pesticide_Per_Hectare: parseNumber(farmInfo.Pesticide_Per_Hectare),
    };

    console.log("Sending payload to ML API:", payload);

    try {
      const resp = await axios.post(
        `${ML_BASE}/api/v1/crops/predict/yield`,
        payload,
        { headers: { "Content-Type": "application/json" }, timeout: 20000 }
      );

      console.log("ML API raw response:", resp.data);

      const data = resp.data || {};
      let rawYield = null;

      if (data.success && data.data) {
        rawYield = data.data.yield ?? data.data.predicted_yield ?? null;
      }
      if (rawYield == null && typeof data.yield !== "undefined") {
        rawYield = data.yield;
      }
      if (rawYield == null && data.data && typeof data.data.yield !== "undefined") {
        rawYield = data.data.yield;
      }
      if (rawYield == null && typeof data === "number") {
        rawYield = data;
      }

      if (rawYield == null) {
        throw new Error("Invalid response format from ML API");
      }

      let finalYield = Number(rawYield);
      if (!Number.isFinite(finalYield)) throw new Error("Non-numeric yield returned");
      finalYield = Math.max(0, finalYield);

      const isCoconut = payload.Crop.toLowerCase() === "coconut";
      if (isCoconut) {
        setPrediction(Math.round(finalYield));
      } else {
        setPrediction(Number(finalYield.toFixed(2)));
      }

      toast.success('Yield prediction calculated successfully! 🌾', {
        position: 'top-right',
        autoClose: 3000,
      });
    } catch (err) {
      console.error("Error fetching prediction:", err);
      let errMsg = "";
      if (err.response) {
        errMsg = err.response.data?.msg || err.response.data?.error?.message || "Server error";
      } else if (err.request) {
        errMsg = "Server is not responding. Please try again later.";
      } else {
        errMsg = err.message || "Unknown error";
      }
      setErrorMessage(errMsg);
      
      toast.error(errMsg, {
        position: 'top-right',
        autoClose: 4000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Target calculation
  let targetYield = null;
  const cropLower = (farmInfo.Crop || "").trim().toLowerCase();
  if (cropLower !== "coconut") targetYield = 5;
  else targetYield = 5000;

  const yieldPercentage = prediction ? Math.round((prediction / targetYield) * 100) : 0;

  // Chart data with dark mode support
  const isDark = document.documentElement.classList.contains('dark');
  
  const doughnutData = {
    labels: ["Target Achieved", "Target Remaining"],
    datasets: [
      {
        data: [yieldPercentage, Math.max(0, 100 - yieldPercentage)],
        backgroundColor: ["#10b981", isDark ? "#374151" : "#e5e7eb"],
        borderWidth: 0,
      },
    ],
  };

  const lineData = {
    labels: ["2020", "2021", "2022", "2023", "2024"],
    datasets: [
      {
        label: "Yield",
        data: [4.2, 4.8, 3.9, 5.1, 4.7],
        borderColor: "#10b981",
        backgroundColor: "rgba(16, 185, 129, 0.1)",
        tension: 0.4,
        fill: true,
      },
      {
        label: "Rainfall",
        data: [800, 950, 720, 1100, 880],
        borderColor: "#3b82f6",
        backgroundColor: "rgba(59, 130, 246, 0.1)",
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const barData = {
    labels: ["Low", "Medium", "High"],
    datasets: [
      {
        label: "Impact on Yield",
        data: [3.2, 4.8, 5.4],
        backgroundColor: ["#10b981", "#10b981", "#10b981"],
        borderColor: ["#059669", "#059669", "#059669"],
        borderWidth: 1,
        borderRadius: 6,
      },
    ],
  };

  const textColor = isDark ? '#d1d5db' : '#374151';
  const gridColor = isDark ? '#374151' : '#e5e7eb';

  const commonChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { 
      legend: { 
        position: "bottom", 
        labels: { 
          color: textColor,
          font: { size: 12 },
          padding: 15,
        } 
      } 
    },
    scales: {
      x: { 
        ticks: { color: textColor },
        grid: { color: gridColor, display: false }
      },
      y: { 
        ticks: { color: textColor },
        grid: { color: gridColor }
      },
    },
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "75%",
    plugins: { 
      legend: { 
        display: true,
        position: 'bottom',
        labels: {
          color: textColor,
          padding: 15,
          font: { size: 12 }
        }
      } 
    },
  };

  const suggestions = [
    {
      icon: <Droplets className="w-6 h-6 text-blue-500" />,
      title: "Irrigation",
      text: "Next watering in 2-4 days"
    },
    {
      icon: <Sprout className="w-6 h-6 text-yellow-600" />,
      title: "Fertilization",
      text: "Apply NPK next week"
    },
    {
      icon: <Bug className="w-6 h-6 text-red-500" />,
      title: "Pest Control",
      text: "Monitor for aphids"
    }
  ];

  return (
    <div className="min-h-screen bg-green-50 dark:bg-gray-900 p-4 sm:p-6 transition-colors duration-200">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 dark:from-emerald-700 dark:to-emerald-800 rounded-xl p-6 sm:p-8 shadow-xl">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-white/20 backdrop-blur-sm rounded-lg">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1">
                  AgroCare AI
                </h1>
                <p className="text-emerald-100">Predict your crop yield using AI-powered analysis</p>
              </div>
            </div>
            <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg">
              <Calendar className="w-5 h-5 text-white" />
              <span className="font-medium text-white">
                {new Date().toLocaleDateString(
                  language === "hi" ? "hi-IN" : language === "or" ? "or-IN" : "en-IN"
                )}
              </span>
            </div>
          </div>
        </div>

        {/* Top Section - Form (3 cols) and Result (2 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Left Card - Form (3/5 width on desktop) */}
          <div className="lg:col-span-3 bg-white dark:bg-gray-800 shadow-md rounded-xl p-6 h-full flex flex-col justify-between border border-gray-100 dark:border-gray-700 transition-all duration-300">
            <div>
              <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-4 flex items-center">
                <Sprout className="w-5 h-5 mr-2 text-emerald-600" />
                Fill Your Farm Details
              </h2>

              <form onSubmit={handleGetEstimate} className="space-y-6">
                {/* 3x2 Grid for inputs */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Row 1 */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Crop 🌱
                    </label>
                    <input
                      name="Crop"
                      onChange={handleInfoChange}
                      value={farmInfo.Crop}
                      type="text"
                      placeholder="e.g., Wheat, Rice"
                      className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-3 focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-all"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      State 🏛️
                    </label>
                    <input
                      name="State"
                      onChange={handleInfoChange}
                      value={farmInfo.State}
                      type="text"
                      placeholder="e.g., Punjab"
                      className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-3 focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-all"
                      required
                    />
                  </div>

                  {/* Row 2 */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Season 🍂
                    </label>
                    <select
                      name="Season"
                      onChange={handleInfoChange}
                      value={farmInfo.Season}
                      className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-3 focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-all"
                      required
                    >
                      <option value="">Select Season</option>
                      <option value="Rabi">Rabi</option>
                      <option value="Kharif">Kharif</option>
                      <option value="Whole Year">Whole Year</option>
                      <option value="Summer">Summer</option>
                      <option value="Autumn">Autumn</option>
                      <option value="Winter">Winter</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Annual Rainfall 🌧️
                    </label>
                    <input
                      name="Annual_Rainfall"
                      onChange={handleInfoChange}
                      value={farmInfo.Annual_Rainfall}
                      type="number"
                      step="0.01"
                      placeholder="in mm, e.g., 1000"
                      className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-3 focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-all"
                      required
                    />
                  </div>

                  {/* Row 3 */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Fertilizer 💊
                    </label>
                    <input
                      name="Fertilizer_Per_Hectare"
                      onChange={handleInfoChange}
                      value={farmInfo.Fertilizer_Per_Hectare}
                      type="number"
                      step="0.01"
                      placeholder="kg/hectare, e.g., 50"
                      className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-3 focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-all"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Pesticide 🐛
                    </label>
                    <input
                      name="Pesticide_Per_Hectare"
                      onChange={handleInfoChange}
                      value={farmInfo.Pesticide_Per_Hectare}
                      type="number"
                      step="0.01"
                      placeholder="kg/hectare, e.g., 5"
                      className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-3 focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-all"
                      required
                    />
                  </div>
                </div>

                {/* Submit Button - Full Width Below Grid */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:scale-100 disabled:cursor-not-allowed flex items-center justify-center shadow-md hover:shadow-lg"
                >
                  {isLoading ? (
                    <>
                      <Loader className="w-5 h-5 mr-2 animate-spin" />
                      Calculating...
                    </>
                  ) : (
                    <>
                      <BarChart3 className="w-5 h-5 mr-2" />
                      Estimate Yield
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Right Card - Prediction Result (2/5 width on desktop) */}
          <div className="lg:col-span-2 bg-white dark:bg-gray-800 shadow-md rounded-xl p-6 flex flex-col items-center justify-center text-center min-h-[250px] border border-gray-100 dark:border-gray-700 transition-all duration-300">
            <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-6 flex items-center">
              <Target className="w-5 h-5 mr-2 text-emerald-600" />
              Your Estimated Yield 📊
            </h2>

            {errorMessage && (
              <div className="w-full bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-3 rounded-lg mb-4 animate-fadeIn">
                <div className="flex items-start">
                  <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400 mr-2 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-red-700 dark:text-red-300 text-left">{errorMessage}</p>
                </div>
              </div>
            )}

            {prediction !== null ? (
              <div className="animate-fadeIn transition-all duration-300">
                <div className="mb-4">
                  <p className="text-5xl font-bold text-green-600 dark:text-green-400 mb-2">
                    {prediction}
                  </p>
                  <p className="text-base text-gray-600 dark:text-gray-400 mb-3">
                    {cropLower !== "coconut" ? "tons per hectare" : "nuts per hectare"}
                  </p>
                </div>
                <div className="inline-flex items-center space-x-2 bg-green-50 dark:bg-green-900/20 px-3 py-1.5 rounded-lg border border-green-200 dark:border-green-800">
                  <span className="text-xs text-gray-700 dark:text-gray-300">
                    Target: {targetYield} {cropLower !== "coconut" ? "tons/ha" : "nuts/ha"}
                  </span>
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-400 dark:text-gray-500">
                <Target className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p className="text-sm px-4">Fill the form and click "Estimate Yield" to see your result</p>
              </div>
            )}
          </div>
        </div>

        {/* Middle Section - Two Charts Side by Side */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Doughnut Chart */}
          <div className="bg-white dark:bg-gray-800 shadow-md rounded-xl p-6 h-[350px] flex flex-col justify-between border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-shadow duration-200">
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-3 text-center">
              Target Comparison
            </h3>
            <div className="flex-1 relative">
              <Doughnut data={doughnutData} options={doughnutOptions} />
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="text-center -mt-8">
                  <p className="text-4xl font-bold text-green-600 dark:text-green-400">
                    {isLoading ? "..." : `${yieldPercentage}%`}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">of target</p>
                </div>
              </div>
            </div>
          </div>

          {/* Bar Chart */}
          <div className="bg-white dark:bg-gray-800 shadow-md rounded-xl p-6 h-[350px] flex flex-col justify-between border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-shadow duration-200">
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-3 text-center">
              Fertilizer, Pest & Rainfall Impact
            </h3>
            <div className="flex-1">
              <Bar data={barData} options={commonChartOptions} />
            </div>
          </div>
        </div>

        {/* Lower Section - Full Width Line Chart */}
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-xl p-6 border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-shadow duration-200">
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-4 text-center">
            Historical Yield (Crop-wise)
          </h3>
          <div className="h-[400px] md:h-[300px]">
            <Line data={lineData} options={commonChartOptions} />
          </div>
        </div>

        {/* Bottom Section - Suggestions */}
        <div>
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-4 flex items-center">
            💡 Suggestions
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {suggestions.map((suggestion, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 shadow-md rounded-xl p-4 flex items-start gap-4 hover:shadow-lg transition-shadow duration-200 border border-gray-100 dark:border-gray-700"
              >
                <div className="flex-shrink-0 p-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  {suggestion.icon}
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                    {suggestion.title}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {suggestion.text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default YieldPrediction;
