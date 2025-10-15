import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DesignSelection from '../components/DesignSelection';
import DesignDebugInfo from '../components/DesignDebugInfo';

const DesignPage = () => {
  const [selectedDesign, setSelectedDesign] = useState(null);
  const navigate = useNavigate();

  const handleDesignSelect = (design) => {
    setSelectedDesign(design);
    console.log('Selected design:', design);
    
    // Navigate to try-on page with design ID
    // This will be implemented in the next phase
    navigate(`/tryon?designId=${design._id}`);
  };

  const handleBackToBrowse = () => {
    setSelectedDesign(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <button
                onClick={() => navigate('/')}
                className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Home
              </button>
            </div>
            
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-semibold text-gray-900">
                Design Library
              </h1>
            </div>
            
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">
                Browse and select your perfect design
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Choose Your Design
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl">
            Browse through our curated collection of designs and select the perfect outfit for your virtual try-on experience. 
            Each design is carefully crafted by our expert tailors and designers.
          </p>
        </div>

        {/* Debug Info */}
        <DesignDebugInfo />

        {/* Design Selection Component */}
        <DesignSelection 
          onDesignSelect={handleDesignSelect}
          selectedDesignId={selectedDesign?._id}
        />

        {/* Selected Design Preview */}
        {selectedDesign && (
          <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Selected Design
              </h3>
              <button
                onClick={handleBackToBrowse}
                className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
              >
                Change Selection
              </button>
            </div>
            
            <div className="flex items-start space-x-4">
              <img
                src={selectedDesign.image}
                alt={selectedDesign.name}
                className="w-24 h-32 object-cover rounded-lg"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/96x128?text=Design+Image';
                }}
              />
              
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900 mb-2">
                  {selectedDesign.name}
                </h4>
                <p className="text-sm text-gray-600 mb-2">
                  {selectedDesign.description}
                </p>
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <span className="capitalize">{selectedDesign.category}</span>
                  <span className="capitalize">{selectedDesign.difficulty}</span>
                  {selectedDesign.price && (
                    <span className="font-medium text-green-600">
                      ${selectedDesign.price}
                    </span>
                  )}
                </div>
              </div>
              
              <div className="flex flex-col space-y-2">
                <button
                  onClick={() => handleDesignSelect(selectedDesign)}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Try This Design
                </button>
                <button
                  onClick={handleBackToBrowse}
                  className="bg-gray-100 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Browse More
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Help Section */}
        <div className="mt-12 bg-blue-50 rounded-xl p-6">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-blue-900 mb-2">
                How to Use Design Selection
              </h3>
              <div className="text-blue-800 space-y-2">
                <p>
                  <strong>Browse Designs:</strong> Use the search and filter options to find designs that match your style and occasion.
                </p>
                <p>
                  <strong>Select a Design:</strong> Click on any design card to select it for virtual try-on.
                </p>
                <p>
                  <strong>Try It On:</strong> Once selected, you'll be taken to our virtual try-on experience where you can see how the design looks on you.
                </p>
                <p>
                  <strong>Difficulty Levels:</strong> Designs are marked with difficulty levels (Beginner, Intermediate, Advanced) to help you choose based on your tailoring experience.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DesignPage;
