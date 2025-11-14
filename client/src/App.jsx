import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Link, useNavigate, Navigate } from 'react-router-dom';
import { ToastContainer } from "react-toastify";
import { Home } from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import MyFarms from './pages/MyFarms';
import CropRecommender from './pages/CropRecommender';
import Dashboard from './pages/Dashboard';
import PestIdentifier from './pages/PestIdentifier';
import YieldPrediction from './pages/YieldPrediction';
import { useAuth } from './store/Auth';
import { useLanguage } from './store/language';
import { Icon, Sun, Moon, Menu, X, LayoutDashboard, Sprout, Bug, Gauge, LogOut, Settings } from 'lucide-react';
import { farm } from '@lucide/lab';

// Header Component
const Header = ({ darkMode, toggleDarkMode }) => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const getPageTitle = (pathname) => {
    switch (pathname) {
      case '/dashboard':
        return 'Dashboard';
      case '/my-farms':
        return 'My Farms';
      case '/recommend':
        return 'Crop Recommender';
      case '/identify':
        return 'Pest Identifier';
      case '/yield-prediction':
        return 'Yield Prediction';
      default:
        return 'Farm Management';
    }
  };

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 transition-colors duration-200">
      <div className="px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white">
            {getPageTitle(location.pathname)}
          </h1>
          <div className="flex items-center space-x-3">
            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
              aria-label="Toggle dark mode"
            >
              {darkMode ? (
                <Sun className="w-5 h-5 text-yellow-500" />
              ) : (
                <Moon className="w-5 h-5 text-gray-700" />
              )}
            </button>

            {/* User Avatar */}
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center shadow-md">
              <span className="text-white text-sm font-semibold">U</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

// Sidebar Component
const Sidebar = ({ darkMode }) => {
  const location = useLocation();
  const { logout } = useAuth();
  const navigate = useNavigate();
  const { T, language, setLanguage } = useLanguage();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const menuItems = [
    { path: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
    { path: '/my-farms', label: 'My Farms', icon: <Icon iconNode={farm} className="w-5 h-5" /> },
    { path: '/yield-prediction', label: 'Yield Prediction', icon: <Gauge className="w-5 h-5" /> },
    { path: '/recommend', label: 'Crop Recommender', icon: <Sprout className="w-5 h-5" /> },
    { path: '/identify', label: 'Pest Identifier', icon: <Bug className="w-5 h-5" /> },
  ];

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-emerald-600 text-white rounded-lg shadow-lg"
      >
        {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-40
          w-72 bg-gradient-to-b from-emerald-600 to-emerald-700 dark:from-emerald-700 dark:to-emerald-800
          text-white shadow-xl transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        <div className="flex flex-col h-full">
          {/* Logo Section */}
          <div className="p-6 border-b border-emerald-500/30">
            <h2 className="text-2xl font-bold mb-1">🌾 AgroCare AI</h2>
            <p className="text-emerald-100 text-sm">Smart Agriculture Platform</p>
          </div>

          {/* Language Selector */}
          <div className="px-6 py-4">
            <div className="flex space-x-2 bg-white/10 rounded-lg p-1">
              {['en', 'hi', 'or'].map((lang) => (
                <button
                  key={lang}
                  onClick={() => setLanguage(lang)}
                  className={`
                    flex-1 text-xs font-medium px-3 py-2 rounded-md transition-all duration-200
                    ${language === lang
                      ? 'bg-white text-emerald-700 shadow-md'
                      : 'text-white hover:bg-white/20'
                    }
                  `}
                >
                  {lang === 'en' ? 'English' : lang === 'hi' ? 'हिन्दी' : 'ଓଡ଼ିଆ'}
                </button>
              ))}
            </div>
          </div>

          {/* Navigation Menu */}
          <nav className="flex-1 px-4 py-4 space-y-2 overflow-y-auto">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`
                  flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200
                  ${location.pathname === item.path
                    ? 'bg-white text-emerald-700 shadow-lg'
                    : 'text-emerald-50 hover:bg-white/10 hover:translate-x-1'
                  }
                `}
              >
                {item.icon}
                <span className="font-medium">{item.label}</span>
              </Link>
            ))}
          </nav>

          {/* Bottom Actions */}
          <div className="p-4 border-t border-emerald-500/30 space-y-2">
            <button
              onClick={() => navigate('/settings')}
              className="flex items-center space-x-3 px-4 py-3 w-full text-left text-emerald-50 hover:bg-white/10 rounded-lg transition-all duration-200"
            >
              <Settings className="w-5 h-5" />
              <span className="font-medium">Settings</span>
            </button>

            <button
              onClick={() => { logout(); navigate(0); }}
              className="flex items-center space-x-3 px-4 py-3 w-full text-left text-emerald-50 hover:bg-red-500/20 rounded-lg transition-all duration-200"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </>
  );
};

const UnProtected = ({ children }) => {
  const { isLoggedIn } = useAuth();
  if (isLoggedIn) {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
};

const ProtectedRoute = ({ children }) => {
  const { isLoggedIn } = useAuth();
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

// Main Layout Component
const MainLayout = ({ children, darkMode, toggleDarkMode }) => {
  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <Sidebar darkMode={darkMode} />
      <div className="flex-1 flex flex-col min-w-0">
        <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

// App Content Component
const AppContent = () => {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const savedMode = localStorage.getItem('darkMode') === 'true';
    setDarkMode(savedMode);
    if (savedMode) {
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem('darkMode', newMode);
    if (newMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  return (
    <>
      <Routes>
        {/* Authentication pages without layout */}
        <Route path='/' element={<UnProtected><Home darkMode={darkMode} toggleDarkMode={toggleDarkMode} /></UnProtected>} />
        <Route path="/login" element={<UnProtected><Login darkMode={darkMode} /></UnProtected>} />
        <Route path="/signup" element={<UnProtected><Signup darkMode={darkMode} /></UnProtected>} />

        {/* Protected pages with layout */}
        <Route path="/dashboard" element={<ProtectedRoute><MainLayout darkMode={darkMode} toggleDarkMode={toggleDarkMode}><Dashboard /></MainLayout></ProtectedRoute>} />
        <Route path="/my-farms" element={<ProtectedRoute><MainLayout darkMode={darkMode} toggleDarkMode={toggleDarkMode}><MyFarms /></MainLayout></ProtectedRoute>} />
        <Route path="/yield-prediction" element={<ProtectedRoute><MainLayout darkMode={darkMode} toggleDarkMode={toggleDarkMode}><YieldPrediction /></MainLayout></ProtectedRoute>} />
        <Route path="/recommend" element={<ProtectedRoute><MainLayout darkMode={darkMode} toggleDarkMode={toggleDarkMode}><CropRecommender /></MainLayout></ProtectedRoute>} />
        <Route path="/identify" element={<ProtectedRoute><MainLayout darkMode={darkMode} toggleDarkMode={toggleDarkMode}><PestIdentifier /></MainLayout></ProtectedRoute>} />

        {/* Default redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme={darkMode ? "dark" : "light"}
      />
    </>
  );
};

// Main App Component
const App = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default App;