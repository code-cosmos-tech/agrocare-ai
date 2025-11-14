import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Icon, TrendingUp, Sprout, Bug, Droplets, Sun, AlertCircle, ArrowRight, Calendar, Gauge } from 'lucide-react';
import { farm } from '@lucide/lab';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalFarms: 0,
    activeCrops: 0,
    pestsDetected: 0,
    recommendations: 0
  });

  // Simulate loading stats (replace with actual API call)
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setStats({
        totalFarms: 2,
        activeCrops: 8,
        pestsDetected: 1,
        recommendations: 4
      });
    }, 500);
  }, []);

  const quickStats = [
    {
      title: 'Total Farms',
      value: stats.totalFarms,
      change: '+12%',
      icon: <Sprout className="w-6 h-6" />,
      color: 'from-emerald-500 to-emerald-600',
      bgColor: 'bg-emerald-50 dark:bg-emerald-900/20',
      textColor: 'text-emerald-600 dark:text-emerald-400'
    },
    {
      title: 'Active Crops',
      value: stats.activeCrops,
      change: '+8%',
      icon: <TrendingUp className="w-6 h-6" />,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      textColor: 'text-blue-600 dark:text-blue-400'
    },
    {
      title: 'Pests Detected',
      value: stats.pestsDetected,
      change: '-15%',
      icon: <Bug className="w-6 h-6" />,
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-50 dark:bg-orange-900/20',
      textColor: 'text-orange-600 dark:text-orange-400'
    },
    {
      title: 'AI Recommendations',
      value: stats.recommendations,
      change: '+23%',
      icon: <AlertCircle className="w-6 h-6" />,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20',
      textColor: 'text-purple-600 dark:text-purple-400'
    }
  ];

  const recentActivity = [
    {
      id: 1,
      action: 'Crop Recommendation Generated',
      crop: 'Wheat',
      time: '2 hours ago',
      status: 'success'
    },
    {
      id: 2,
      action: 'Pest Detected',
      crop: 'Rice Field A',
      time: '5 hours ago',
      status: 'warning'
    },
    {
      id: 3,
      action: 'Farm Added',
      crop: 'Cotton Farm',
      time: '1 day ago',
      status: 'info'
    },
    {
      id: 4,
      action: 'Weather Alert',
      crop: 'All Farms',
      time: '2 days ago',
      status: 'alert'
    }
  ];

  const weatherData = {
    temp: '28°C',
    condition: 'Partly Cloudy',
    humidity: '65%',
    rainfall: '12mm'
  };

  const quickActions = [
    {
      title: 'Manage Farms',
      description: 'View and edit your farm data',
      icon: <Icon iconNode={farm} className="w-8 h-8" />,
      link: '/my-farms',
      color: 'from-blue-500 to-blue-600'
    },
    {
      title: 'Yield Prediction',
      description: 'ML-based crop yield prediction',
      icon: <Gauge className="w-8 h-8" />,
      link: '/yield-prediction',
      color: 'from-yellow-500 to-yellow-600'
    },
    {
      title: 'Get Crop Recommendation',
      description: 'AI-powered crop suggestions',
      icon: <Sprout className="w-8 h-8" />,
      link: '/recommend',
      color: 'from-emerald-500 to-emerald-600'
    },
    {
      title: 'Identify Pest',
      description: 'Upload image for instant detection',
      icon: <Bug className="w-8 h-8" />,
      link: '/identify',
      color: 'from-red-500 to-red-600'
    },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 animate-fadeIn">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 dark:from-emerald-700 dark:to-emerald-800 rounded-2xl p-6 sm:p-8 text-white shadow-xl">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold mb-2">Welcome back, Farmer! 👋</h1>
            <p className="text-emerald-100">Here's what's happening with your farms today</p>
          </div>
          <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg">
            <Calendar className="w-5 h-5" />
            <span className="font-medium">{new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
          </div>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {quickStats.map((stat, index) => (
          <div
            key={index}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200 border border-gray-100 dark:border-gray-700"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                <div className={stat.textColor}>
                  {stat.icon}
                </div>
              </div>
              <span className={`text-sm font-semibold ${stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                {stat.change}
              </span>
            </div>
            <h3 className="text-gray-600 dark:text-gray-400 text-sm font-medium mb-1">{stat.title}</h3>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Quick Actions</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {quickActions.map((action, index) => (
                <Link
                  key={index}
                  to={action.link}
                  className="group relative overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 shadow-lg dark:from-gray-900 dark:to-gray-800 rounded-xl p-6 hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200 border border-gray-200 dark:border-gray-700"
                >
                  <div className={`inline-flex p-3 rounded-lg bg-gradient-to-br ${action.color} text-white mb-4 group-hover:scale-110 transition-transform`}>
                    {action.icon}
                  </div>
                  <h3 className="font-bold text-gray-900 dark:text-white mb-1">{action.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{action.description}</p>
                  <div className="flex items-center text-emerald-600 dark:text-emerald-400 text-sm font-semibold">
                    Start Now
                    <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Recent Activity</h2>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                  <div className={`w-2 h-2 mt-2 rounded-full ${
                    activity.status === 'success' ? 'bg-green-500' :
                    activity.status === 'warning' ? 'bg-yellow-500' :
                    activity.status === 'alert' ? 'bg-red-500' : 'bg-blue-500'
                  }`}></div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 dark:text-white">{activity.action}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{activity.crop}</p>
                  </div>
                  <span className="text-xs text-gray-500 dark:text-gray-500">{activity.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar - Weather & Tips */}
        <div className="space-y-6">
          {/* Weather Card */}
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold">Today's Weather</h3>
              <Sun className="w-8 h-8" />
            </div>
            <div className="space-y-3">
              <div className="text-4xl font-bold">{weatherData.temp}</div>
              <div className="text-blue-100">{weatherData.condition}</div>
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-blue-400/30">
                <div>
                  <div className="flex items-center space-x-2 text-blue-100 text-sm mb-1">
                    <Droplets className="w-4 h-4" />
                    <span>Humidity</span>
                  </div>
                  <div className="font-bold">{weatherData.humidity}</div>
                </div>
                <div>
                  <div className="flex items-center space-x-2 text-blue-100 text-sm mb-1">
                    <Droplets className="w-4 h-4" />
                    <span>Rainfall</span>
                  </div>
                  <div className="font-bold">{weatherData.rainfall}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Tips Card */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">💡 AI Tips</h3>
            <div className="space-y-4">
              <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg border-l-4 border-emerald-500">
                <p className="text-sm text-gray-700 dark:text-gray-300 font-medium">
                  Perfect weather for wheat planting in the next 3 days!
                </p>
              </div>
              <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border-l-4 border-yellow-500">
                <p className="text-sm text-gray-700 dark:text-gray-300 font-medium">
                  Monitor your rice field for potential pest activity
                </p>
              </div>
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border-l-4 border-blue-500">
                <p className="text-sm text-gray-700 dark:text-gray-300 font-medium">
                  Irrigation recommended for Farm B tomorrow
                </p>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Quick Links</h3>
            <div className="space-y-2">
              <Link to="/my-farms" className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors group">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">View All Farms</span>
                <ArrowRight className="w-4 h-4 text-gray-400 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/yield-prediction" className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors group">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Yield Prediction</span>
                <ArrowRight className="w-4 h-4 text-gray-400 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/recommend" className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors group">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Get Recommendations</span>
                <ArrowRight className="w-4 h-4 text-gray-400 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/identify" className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors group">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Identify Pests</span>
                <ArrowRight className="w-4 h-4 text-gray-400 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;