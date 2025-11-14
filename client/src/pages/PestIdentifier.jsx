import React, { useState, useRef } from 'react';
import { toast } from 'react-toastify';
import { Bug, Upload, X, Camera, AlertTriangle, CheckCircle, Loader, Info } from 'lucide-react';

const PestIdentifier = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileSelect = (file) => {
    if (file && file.type.startsWith('image/')) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
      setResult(null);
    } else {
      toast.error('Please select a valid image file', {
        position: 'top-right',
        autoClose: 3000,
      });
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    handleFileSelect(file);
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    handleFileSelect(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedImage) {
      toast.error('Please select an image first', {
        position: 'top-right',
        autoClose: 3000,
      });
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append('file', selectedImage);

    try {
      const response = await fetch('http://localhost:8000/identify', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();

      if (response.ok) {
        setResult(data);
        toast.success('Pest identified successfully! 🐛', {
          position: 'top-right',
          autoClose: 3000,
        });
      } else {
        toast.error(data.error || 'Failed to identify pest', {
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
    setSelectedImage(null);
    setPreviewUrl(null);
    setResult(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-600 to-red-700 dark:from-red-700 dark:to-red-800 rounded-2xl p-6 sm:p-8 text-white shadow-xl">
        <div className="flex items-center space-x-4">
          <div className="p-4 bg-white/20 backdrop-blur-sm rounded-xl">
            <Bug className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold mb-2">Pest Identifier</h1>
            <p className="text-red-100">Upload an image to instantly detect and identify crop pests</p>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Upload Section */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 sm:p-8 shadow-lg border border-gray-100 dark:border-gray-700">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
              <Camera className="w-6 h-6 mr-2 text-red-600" />
              Upload Pest Image
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Drag & Drop Area */}
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 ${
                  isDragging
                    ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                    : 'border-gray-300 dark:border-gray-600 hover:border-red-400 dark:hover:border-red-500'
                }`}
              >
                {!previewUrl ? (
                  <div className="space-y-4">
                    <div className="flex justify-center">
                      <div className="p-6 bg-gray-100 dark:bg-gray-700 rounded-full">
                        <Upload className="w-12 h-12 text-gray-400" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        Drop your image here
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 mb-4">
                        or click to browse from your device
                      </p>
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors duration-200"
                      >
                        Choose Image
                      </button>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
                        Supports: JPG, PNG, JPEG (Max 10MB)
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="relative">
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="max-h-96 mx-auto rounded-lg shadow-lg"
                    />
                    <button
                      type="button"
                      onClick={handleReset}
                      className="absolute top-2 right-2 p-2 bg-red-600 hover:bg-red-700 text-white rounded-full shadow-lg transition-colors duration-200"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileInputChange}
                  className="hidden"
                />
              </div>

              {/* Action Buttons */}
              {previewUrl && (
                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 flex items-center justify-center px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {loading ? (
                      <>
                        <Loader className="w-5 h-5 mr-2 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <Bug className="w-5 h-5 mr-2" />
                        Identify Pest
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={handleReset}
                    className="px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-semibold rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
                  >
                    Upload New Image
                  </button>
                </div>
              )}
            </form>
          </div>

          {/* Result Section */}
          {result && (
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 sm:p-8 shadow-lg border border-gray-100 dark:border-gray-700 animate-fadeIn">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                <CheckCircle className="w-6 h-6 mr-2 text-green-600" />
                Detection Results
              </h2>

              <div className="space-y-6">
                {/* Pest Info */}
                <div className="bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 rounded-xl p-6 border border-red-200 dark:border-red-800">
                  <div className="flex items-start space-x-4">
                    <div className="p-3 bg-red-600 rounded-lg">
                      <Bug className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                        {result.predicted_pest || result.pest_name}
                      </h3>
                      {result.confidence && (
                        <div className="inline-flex items-center space-x-2 bg-white dark:bg-gray-800 px-3 py-1 rounded-lg">
                          <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                            Confidence: {result.confidence}%
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Description */}
                {result.description && (
                  <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Description</h4>
                    <p className="text-gray-600 dark:text-gray-400">{result.description}</p>
                  </div>
                )}

                {/* Treatment */}
                {result.treatment && (
                  <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border-l-4 border-green-500">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center">
                      <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
                      Recommended Treatment
                    </h4>
                    <p className="text-gray-600 dark:text-gray-400">{result.treatment}</p>
                  </div>
                )}

                {/* Prevention */}
                {result.prevention && (
                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border-l-4 border-blue-500">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center">
                      <Info className="w-5 h-5 mr-2 text-blue-600" />
                      Prevention Tips
                    </h4>
                    <p className="text-gray-600 dark:text-gray-400">{result.prevention}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Instructions */}
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center">
              <Info className="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400" />
              How to Use
            </h3>
            <ul className="space-y-3 text-sm text-gray-700 dark:text-gray-300">
              <li className="flex items-start">
                <CheckCircle className="w-4 h-4 mr-2 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                <span>Take a clear photo of the affected plant or pest</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-4 h-4 mr-2 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                <span>Upload the image using drag & drop or file selector</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-4 h-4 mr-2 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                <span>Our AI will analyze and identify the pest instantly</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-4 h-4 mr-2 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                <span>Get treatment recommendations and prevention tips</span>
              </li>
            </ul>
          </div>

          {/* Tips for Best Results */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center">
              <AlertTriangle className="w-5 h-5 mr-2 text-yellow-600 dark:text-yellow-400" />
              Tips for Best Results
            </h3>
            <ul className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
              <li className="flex items-start">
                <span className="text-red-600 dark:text-red-400 mr-2">•</span>
                <span>Ensure good lighting and focus on the pest</span>
              </li>
              <li className="flex items-start">
                <span className="text-red-600 dark:text-red-400 mr-2">•</span>
                <span>Capture the pest from a close distance</span>
              </li>
              <li className="flex items-start">
                <span className="text-red-600 dark:text-red-400 mr-2">•</span>
                <span>Include surrounding plant damage if visible</span>
              </li>
              <li className="flex items-start">
                <span className="text-red-600 dark:text-red-400 mr-2">•</span>
                <span>Avoid blurry or low-quality images</span>
              </li>
            </ul>
          </div>

          {/* Common Pests */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">🐛 Common Pests</h3>
            <div className="space-y-2 text-sm">
              <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">Aphids</div>
              <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">Caterpillars</div>
              <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">Beetles</div>
              <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">Whiteflies</div>
              <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">And many more...</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PestIdentifier;