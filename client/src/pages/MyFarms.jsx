import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { Sprout, Plus, Edit2, Trash2, MapPin, Calendar, TrendingUp, Droplets, X, Save } from 'lucide-react';

const MyFarms = () => {
  const [farms, setFarms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingFarm, setEditingFarm] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    area: '',
    soilType: '',
    cropType: '',
    irrigationType: ''
  });

  // Fetch farms from API (replace with your actual API endpoint)
  useEffect(() => {
    fetchFarms();
  }, []);

  const fetchFarms = async () => {
    setLoading(true);
    try {
      // Replace with your actual API call
      // const response = await fetch('http://localhost:5000/api/farms', {
      //   headers: {
      //     'Authorization': `Bearer ${token}`
      //   }
      // });
      // const data = await response.json();
      // setFarms(data);

      // Dummy data for demonstration
      setTimeout(() => {
        setFarms([
          {
            id: 1,
            name: 'Green Valley Farm',
            location: 'Punjab, India',
            area: '25 acres',
            soilType: 'Loamy',
            cropType: 'Wheat',
            irrigationType: 'Drip',
            createdAt: '2024-01-15'
          },
          {
            id: 2,
            name: 'Sunrise Fields',
            location: 'Maharashtra, India',
            area: '15 acres',
            soilType: 'Clay',
            cropType: 'Cotton',
            irrigationType: 'Sprinkler',
            createdAt: '2024-02-20'
          }
        ]);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error fetching farms:', error);
      toast.error('Failed to load farms', {
        position: 'top-right',
        autoClose: 3000,
      });
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleAddFarm = () => {
    setEditingFarm(null);
    setFormData({
      name: '',
      location: '',
      area: '',
      soilType: '',
      cropType: '',
      irrigationType: ''
    });
    setShowModal(true);
  };

  const handleEditFarm = (farm) => {
    setEditingFarm(farm);
    setFormData({
      name: farm.name,
      location: farm.location,
      area: farm.area,
      soilType: farm.soilType,
      cropType: farm.cropType,
      irrigationType: farm.irrigationType
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (editingFarm) {
        // Update farm API call
        // await fetch(`http://localhost:5000/api/farms/${editingFarm.id}`, {
        //   method: 'PUT',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify(formData)
        // });
        
        setFarms(farms.map(f => f.id === editingFarm.id ? { ...f, ...formData } : f));
        toast.success('Farm updated successfully! ✅', {
          position: 'top-right',
          autoClose: 3000,
        });
      } else {
        // Add farm API call
        const newFarm = {
          id: Date.now(),
          ...formData,
          createdAt: new Date().toISOString().split('T')[0]
        };
        setFarms([...farms, newFarm]);
        toast.success('Farm added successfully! 🎉', {
          position: 'top-right',
          autoClose: 3000,
        });
      }
      setShowModal(false);
    } catch (error) {
      console.error('Error saving farm:', error);
      toast.error('Failed to save farm', {
        position: 'top-right',
        autoClose: 3000,
      });
    }
  };

  const handleDeleteFarm = async (farmId) => {
    if (window.confirm('Are you sure you want to delete this farm?')) {
      try {
        // Delete farm API call
        // await fetch(`http://localhost:5000/api/farms/${farmId}`, {
        //   method: 'DELETE'
        // });
        
        setFarms(farms.filter(f => f.id !== farmId));
        toast.success('Farm deleted successfully! 🗑️', {
          position: 'top-right',
          autoClose: 3000,
        });
      } catch (error) {
        console.error('Error deleting farm:', error);
        toast.error('Failed to delete farm', {
          position: 'top-right',
          autoClose: 3000,
        });
      }
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 dark:from-emerald-700 dark:to-emerald-800 rounded-2xl p-6 sm:p-8 text-white shadow-xl">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center space-x-4">
            <div className="p-4 bg-white/20 backdrop-blur-sm rounded-xl">
              <Sprout className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold mb-2">My Farms</h1>
              <p className="text-emerald-100">Manage all your farm properties in one place</p>
            </div>
          </div>
          <button
            onClick={handleAddFarm}
            className="flex items-center space-x-2 px-6 py-3 bg-white text-emerald-700 font-semibold rounded-xl hover:bg-emerald-50 transition-colors duration-200 shadow-lg"
          >
            <Plus className="w-5 h-5" />
            <span>Add New Farm</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Farms</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{farms.length}</p>
            </div>
            <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
              <Sprout className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Area</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {farms.reduce((acc, farm) => acc + parseInt(farm.area), 0)} acres
              </p>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <TrendingUp className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Active Crops</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{farms.length}</p>
            </div>
            <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
              <Droplets className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Farms Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="spinner border-emerald-600"></div>
        </div>
      ) : farms.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-12 text-center shadow-lg border border-gray-100 dark:border-gray-700">
          <div className="flex justify-center mb-4">
            <div className="p-6 bg-gray-100 dark:bg-gray-700 rounded-full">
              <Sprout className="w-16 h-16 text-gray-400" />
            </div>
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No Farms Yet</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">Start by adding your first farm property</p>
          <button
            onClick={handleAddFarm}
            className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg transition-colors duration-200"
          >
            Add Your First Farm
          </button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {farms.map((farm, index) => (
            <div
              key={farm.id}
              className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 border border-gray-100 dark:border-gray-700 animate-fadeIn"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Card Header */}
              <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 p-6 text-white">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-xl font-bold">{farm.name}</h3>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEditFarm(farm)}
                      className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors duration-200"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteFarm(farm.id)}
                      className="p-2 bg-white/20 hover:bg-red-500 rounded-lg transition-colors duration-200"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="flex items-center space-x-2 text-emerald-100">
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm">{farm.location}</span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Area</p>
                    <p className="font-semibold text-gray-900 dark:text-white">{farm.area}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Soil Type</p>
                    <p className="font-semibold text-gray-900 dark:text-white">{farm.soilType}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Crop</p>
                    <p className="font-semibold text-gray-900 dark:text-white">{farm.cropType}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Irrigation</p>
                    <p className="font-semibold text-gray-900 dark:text-white">{farm.irrigationType}</p>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                    <Calendar className="w-4 h-4" />
                    <span>Added {farm.createdAt}</span>
                  </div>
                  <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-semibold rounded-full">
                    Active
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Farm Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-gradient-to-r from-emerald-600 to-emerald-700 p-6 text-white flex items-center justify-between">
              <h2 className="text-2xl font-bold">
                {editingFarm ? 'Edit Farm' : 'Add New Farm'}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors duration-200"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Farm Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="input-field w-full"
                    placeholder="e.g., Green Valley Farm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Location *
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    required
                    className="input-field w-full"
                    placeholder="e.g., Punjab, India"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Area (acres) *
                  </label>
                  <input
                    type="number"
                    name="area"
                    value={formData.area}
                    onChange={handleInputChange}
                    required
                    className="input-field w-full"
                    placeholder="e.g., 25"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Soil Type *
                  </label>
                  <select
                    name="soilType"
                    value={formData.soilType}
                    onChange={handleInputChange}
                    required
                    className="input-field w-full"
                  >
                    <option value="">Select soil type</option>
                    <option value="Loamy">Loamy</option>
                    <option value="Clay">Clay</option>
                    <option value="Sandy">Sandy</option>
                    <option value="Silty">Silty</option>
                    <option value="Peaty">Peaty</option>
                    <option value="Chalky">Chalky</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Current Crop *
                  </label>
                  <input
                    type="text"
                    name="cropType"
                    value={formData.cropType}
                    onChange={handleInputChange}
                    required
                    className="input-field w-full"
                    placeholder="e.g., Wheat"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Irrigation Type *
                  </label>
                  <select
                    name="irrigationType"
                    value={formData.irrigationType}
                    onChange={handleInputChange}
                    required
                    className="input-field w-full"
                  >
                    <option value="">Select irrigation type</option>
                    <option value="Drip">Drip</option>
                    <option value="Sprinkler">Sprinkler</option>
                    <option value="Surface">Surface</option>
                    <option value="Subsurface">Subsurface</option>
                    <option value="Rainfed">Rainfed</option>
                  </select>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
                <button
                  type="submit"
                  className="flex-1 flex items-center justify-center px-6 py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
                >
                  <Save className="w-5 h-5 mr-2" />
                  {editingFarm ? 'Update Farm' : 'Add Farm'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-semibold rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyFarms;