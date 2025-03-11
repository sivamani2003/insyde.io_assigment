import React, { useState } from "react";

const Header = () => {
  const [showTooltip, setShowTooltip] = useState(false);
  
  return (
    <header className="bg-white shadow-sm sticky top-0 z-10">
      <div className="container mx-auto px-4 py-3 max-w-7xl flex items-center justify-between">
        <div className="flex items-center">
          <svg
            className="w-8 h-8 text-blue-600 mr-2 transform hover:rotate-12 transition-transform duration-500"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9"
            />
          </svg>
          <div className="flex flex-col">
            <h1 className="text-xl font-semibold text-gray-800">Insyde .IO</h1>
            <span className="text-xs text-gray-500 -mt-1">3D Model Viewer</span>
          </div>
        </div>

        <div className="flex space-x-4 items-center">
          <div 
            className="relative"
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
          >
            <button className="text-sm rounded-full bg-blue-100 text-blue-600 w-6 h-6 flex items-center justify-center font-medium hover:bg-blue-200 transition-colors">
              ?
            </button>
            
            {showTooltip && (
              <div className="absolute right-0 top-8 w-64 p-3 bg-white rounded-md shadow-lg border border-gray-100 text-xs text-gray-600 z-20">
                <div className="font-semibold text-gray-700 mb-1">Welcome to Insyde.IO</div>
                <p>Upload your STL models and view them in 3D. Rotate, pan, and zoom to inspect every detail.</p>
                <div className="mt-2 text-blue-600 font-medium">Need help? Contact support</div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600 h-1"></div>
    </header>
  );
};

export default Header;
