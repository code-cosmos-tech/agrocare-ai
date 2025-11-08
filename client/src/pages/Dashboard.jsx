import React, { useState, useEffect } from 'react';
import { useLanguage } from '../store/language';
import { useAuth } from '../store/Auth';
import { useNavigate } from "react-router";
import axios from 'axios';

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
} from 'chart.js';

import { Doughnut, Line, Bar } from 'react-chartjs-2';

// Register Chart.js components once
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

// --- Icon Components (for better visual understanding) ---
const TractorIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 h-6 w-6"><path d="M3 4h18" /><path d="M11 4v10h10" /><path d="m3 14 4 6" /><path d="M18 20 14 14" /><circle cx="18" cy="18" r="2" /><circle cx="7" cy="18" r="4" /></svg>;
const SunIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 h-5 w-5"><circle cx="12" cy="12" r="4" /><path d="M12 2v2" /><path d="M12 20v2" /><path d="m4.93 4.93 1.41 1.41" /><path d="m17.66 17.66 1.41 1.41" /><path d="M2 12h2" /><path d="M20 12h2" /><path d="m6.34 17.66-1.41 1.41" /><path d="m19.07 4.93-1.41 1.41" /></svg>;
const WaterDropIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-blue-500"><path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C5 11.1 4 13 4 15a7 7 0 0 0 7 7z" /></svg>;
const FertilizerIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-yellow-600"><path d="M21 11V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h6" /><path d="m16 12 4 4-2.5 2.5-4-4 2.5-2.5z" /></svg>;
const BugIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-red-500"><path d="M20 10c0-4.4-3.6-8-8-8s-8 3.6-8 8v10h16V10z" /><path d="m12 10-2-4h4l-2 4Z" /><path d="M12 10v10" /><path d="M6 14h-2" /><path d="M18 14h2" /><path d="M6 18H4" /><path d="M18 18h2" /></svg>;


// --- Main Dashboard Component ---
const FarmerDashboard = () => {
  const { isLoggedIn } = useAuth();
  const { T, language, setLanguage } = useLanguage();
  const navigate = useNavigate();

  // State to hold all the farm information from the form
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
    if (!isLoggedIn) {
      return navigate("/login");
    }
  }, [isLoggedIn, navigate]);

  // A single function to update farm info when the user types
  const handleInfoChange = (e) => {
    const { name, value } = e.target;
    setFarmInfo((prevInfo) => ({
      ...prevInfo,
      [name]: value,
    }));
  };

  // Function to run when the "Get Estimate" button is clicked
  const handleGetEstimate = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);
    setPrediction(null);

    try {
      const payload = {
        Crop: farmInfo.Crop.trim(),
        Season: farmInfo.Season.trim(),
        State: farmInfo.State.trim(),
        Annual_Rainfall: parseFloat(farmInfo.Annual_Rainfall),
        Fertilizer_Per_Hectare: parseFloat(farmInfo.Fertilizer_Per_Hectare),
        Pesticide_Per_Hectare: parseFloat(farmInfo.Pesticide_Per_Hectare),
      };

      console.log("Sending payload to API:", payload); // Debug log

      const response = await axios.post(
        "http://127.0.0.1:5000/api/v1/crops/predict/yield",
        payload,
        {
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );

      console.log("API Response:", response.data);

      // Handle response
      if (response.data.success && response.data.data) {
        (farmInfo.Crop.trim().toLowerCase() != 'coconut') ? setPrediction(response.data.data.yield.toFixed(2)) : setPrediction(response.data.data.yield.toFixed(0));
      } else if (response.data.yield) {
        setPrediction(response.data.yield.toFixed(2));
      } else {
        throw new Error("Invalid response format");
      }
    } catch (err) {
      console.error("Error fetching prediction:", err);

      // Better error handling
      if (err.response) {
        // Server responded with error
        setErrorMessage(err.response.data?.error?.message || err.response.data?.msg || T.error);
      } else if (err.request) {
        // Request made but no response
        setErrorMessage("Server is not responding. Please try again later.");
      } else {
        // Something else happened
        setErrorMessage(err.message || T.error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  let targetYield = null;
  if (farmInfo.Crop.trim().toLowerCase() != 'coconut')
    targetYield = 5;     // 1 ton/hectare is our target
  else
    targetYield = 5000;    // 2000 nuts/hectare is out target
  const yieldPercentage = prediction ? Math.round((prediction / targetYield) * 100) : 0;

  const doughnutData = {
    labels: [T.targetAchieved, T.targetRemaining],
    datasets: [
      {
        data: [yieldPercentage, 100 - yieldPercentage],
        backgroundColor: ["#22C55E", "#E5E7EB"], // Green and Gray
        borderWidth: 0,
      },
    ],
  };

  const lineData = {
    labels: ['2020', '2021', '2022', '2023', '2024'],
    datasets: [
      {
        label: T.yieldLabel,
        data: [4.2, 4.8, 3.9, 5.1, 4.7],
        borderColor: '#8B5CF6', // Purple
        backgroundColor: 'rgba(139, 92, 246, 0.2)',
        tension: 0.3,
      },
      {
        label: T.rainfallLabel,
        data: [800, 950, 720, 1100, 880],
        borderColor: '#3B82F6', // Blue
        backgroundColor: 'rgba(59, 130, 246, 0.2)',
        tension: 0.3,
      }
    ]
  };

  const barData = {
    labels: [T.low, T.medium, T.high],
    datasets: [
      {
        label: T.impactOnYield,
        data: [3.2, 4.8, 5.4],
        backgroundColor: 'rgba(245, 158, 11, 0.8)', // Amber
        borderColor: 'rgba(245, 158, 11, 1)',
        borderWidth: 1,
      }
    ]
  };

  const commonChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { position: 'bottom', labels: { color: '#374151' } } },
    scales: {
      x: { ticks: { color: '#374151' } },
      y: { ticks: { color: '#374151' } }
    }
  };

  const doughnutOptions = { ...commonChartOptions, cutout: "70%", plugins: { ...commonChartOptions.plugins, legend: { display: false } } };


  return (
    <div className="min-h-screen bg-green-50 p-4 sm:p-6 font-sans">
      <div className="max-w-7xl mx-auto">

        {/* --- Header --- */}
        <header className="mb-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center">
              <TractorIcon />
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
                {T.dashboard.title}
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <div className="bg-white px-4 py-2 rounded-lg shadow-sm text-center sm:text-left">
                <span className="text-sm text-gray-600">{T.dashboard.todaysDate}:</span>
                <span className="ml-2 font-semibold text-gray-900">
                  {new Date().toLocaleDateString(language === 'hi' ? 'hi-IN' : language === 'or' ? 'or-IN' : 'en-IN')}
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* --- Main Section: Form and Prediction Result --- */}
        <main className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* --- Left Side: Input Form --- */}
          <div className="lg:col-span-2">
            <form onSubmit={handleGetEstimate} className="bg-white p-6 rounded-xl shadow-lg space-y-4">
              <h2 className="text-xl font-bold text-gray-800 border-b pb-2">
                {T.dashboard.fillDetails}
              </h2>

              {/* Simplified Form Fields */}
              {/* Each field has a clear label and an emoji */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{T.dashboard.crop} 🌱</label>
                <input name='Crop' onChange={handleInfoChange} value={farmInfo.Crop} type="text" placeholder={T.dashboard.cropPlaceholder} className="w-full input-style" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{T.dashboard.season} 🍂</label>
                <select name='Season' onChange={handleInfoChange} value={farmInfo.Season} className="w-full input-style" required>
                  <option value="">{T.dashboard.selectSeason}</option>
                  <option value="Rabi">{T.dashboard.rabi}</option>
                  <option value="Kharif">{T.dashboard.kharif}</option>
                  <option value="Whole Year">{T.dashboard.wholeYear}</option>
                  <option value="Summer">{T.dashboard.summer}</option>
                  <option value="Autumn">{T.dashboard.autumn}</option>
                  <option value="Winter">{T.dashboard.winter}</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{T.dashboard.state} 🏕️</label>
                <input name='State' onChange={handleInfoChange} value={farmInfo.State} type="text" placeholder={T.dashboard.statePlaceholder} className="w-full input-style" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{T.dashboard.rainfall} 🌧️</label>
                <input name='Annual_Rainfall' onChange={handleInfoChange} value={farmInfo.Annual_Rainfall} type="number" step="0.01" placeholder={T.dashboard.rainfallPlaceholder} className="w-full input-style" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{T.dashboard.fertilizer} 💊</label>
                <input name='Fertilizer_Per_Hectare' onChange={handleInfoChange} value={farmInfo.Fertilizer_Per_Hectare} type="number" step="0.01" placeholder={T.dashboard.fertilizerPlaceholder} className="w-full input-style" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{T.dashboard.pesticide} 🐛</label>
                <input name='Pesticide_Per_Hectare' onChange={handleInfoChange} value={farmInfo.Pesticide_Per_Hectare} type="number" step="0.01" placeholder={T.dashboard.pesticidePlaceholder} className="w-full input-style" required />
              </div>

              <button type="submit" disabled={isLoading} className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition-transform transform hover:scale-105 disabled:opacity-50 disabled:scale-100 flex items-center justify-center">
                {isLoading ? T.dashboard.calculating : T.dashboard.estimateYield}
              </button>
            </form>

            {/* --- Suggestions Area --- */}
            <div className="mt-6 space-y-3">
              <h3 className="text-lg font-bold text-gray-800">{T.dashboard.suggestions}</h3>
              <div className="suggestion-card">
                <WaterDropIcon />
                <div>
                  <h4 className="font-semibold text-gray-900">{T.common.irrigation}</h4>
                  <p className="text-sm text-gray-600">{T.dashboard.irrigationText}</p>
                </div>
              </div>
              <div className="suggestion-card">
                <FertilizerIcon />
                <div>
                  <h4 className="font-semibold text-gray-900">{T.dashboard.fertilization}</h4>
                  <p className="text-sm text-gray-600">{T.dashboard.fertilizationText}</p>
                </div>
              </div>
              <div className="suggestion-card">
                <BugIcon />
                <div>
                  <h4 className="font-semibold text-gray-900">{T.dashboard.pestControl}</h4>
                  <p className="text-sm text-gray-600">{T.dashboard.pestControlText}</p>
                </div>
              </div>
            </div>
          </div>

          {/* --- Right Side: Prediction and Charts --- */}
          <div className="lg:col-span-3">
            {/* --- Charts Grid --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Doughnut Chart */}
              <div className="chart-card">
                <h3 className="chart-title">{T.dashboard.targetComparison}</h3>
                <div className="relative h-48 sm:h-64">
                  <Doughnut data={doughnutData} options={doughnutOptions} />
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="text-center">
                      <p className="text-4xl font-bold text-green-600">{isLoading ? "..." : `${yieldPercentage}%`}</p>
                      <p className="text-sm text-gray-600">{T.dashboard.ofTarget}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bar Chart */}
              <div className="chart-card">
                <h3 className="chart-title">{T.dashboard.fertilizerImpact}</h3>
                <div className="h-48 sm:h-64"><Bar data={barData} options={commonChartOptions} /></div>
              </div>

              {/* --- Prediction Result Card --- */}
              {errorMessage && <div className="p-4 mb-4 text-center bg-red-100 text-red-700 rounded-lg shadow-md">{errorMessage}</div>}

              {prediction !== null && (
                <div className="bg-white p-6 rounded-xl shadow-lg mb-8 text-center">
                  <h3 className="text-lg font-semibold text-gray-500 mb-2">{T.dashboard.estimatedYield}</h3>
                  <p className="text-5xl font-bold text-green-600">{prediction}</p>
                  <p className="text-lg text-gray-700">{(farmInfo.Crop.trim().toLowerCase() != 'coconut') ? T.dashboard.tonsPerHectare : T.dashboard.nutsPerHectare}</p>
                  <p>{`Our target was ${targetYield} ${(farmInfo.Crop.trim().toLowerCase() != 'coconut') ? T.dashboard.tonsPerHectare : T.dashboard.nutsPerHectare}`} </p>
                </div>
              )}

              {/* Line Chart */}
              <div className="md:col-span-2 chart-card">
                <h3 className="chart-title">{T.dashboard.historicalYieldRainfall}</h3>
                <div className="h-64 sm:h-80"><Line data={lineData} options={commonChartOptions} /></div>
              </div>
            </div>
          </div>
        </main>

      </div>
    </div>
  );
};

// Add some basic CSS styles directly in the JSX for reusability
const App = () => {
  return (
    <>
      <style>{`
                .input-style {
                    padding: 0.75rem 1rem;
                    border-radius: 0.5rem;
                    border: 1px solid #D1D5DB;
                    background-color: #FFFFFF;
                    color: #111827;
                    transition: border-color 0.2s, box-shadow 0.2s;
                }
                .input-style:focus {
                    outline: none;
                    border-color: #10B981;
                    box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.5);
                }
                .chart-card {
                    background-color: white;
                    padding: 1.5rem;
                    border-radius: 0.75rem;
                    box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
                }
                .chart-title {
                    font-size: 1.125rem; /* 18px */
                    font-weight: 700;
                    color: #1F2937; /* text-gray-800 */
                    margin-bottom: 1rem;
                }
                .suggestion-card {
                    background-color: white;
                    padding: 1rem;
                    border-radius: 0.75rem;
                    box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                }
                .lang-button {
                    padding: 0.5rem 1rem;
                    border-radius: 0.375rem;
                    font-weight: 600;
                    border: none;
                    cursor: pointer;
                    transition: background-color 0.2s, color 0.2s;
                }
            `}</style>
      <FarmerDashboard />
    </>
  );
};

export default App;
