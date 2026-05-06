import React, { useState, useMemo } from 'react';
import { Search, MapPin, Heart } from 'lucide-react';

const FranchiseSelecter = () => {
  const [searchLocation, setSearchLocation] = useState('');
  const [selectedFranchises, setSelectedFranchises] = useState(new Set());

  // Dummy franchise data
  const franchises = [
    { id: 1, location: 'Mumbai, Maharashtra', area: 'Bandra West' },
    { id: 2, location: 'Delhi, NCR', area: 'Connaught Place' },
    { id: 3, location: 'Bangalore, Karnataka', area: 'Koramangala' },
    { id: 4, location: 'Pune, Maharashtra', area: 'Koregaon Park' },
    { id: 5, location: 'Chennai, Tamil Nadu', area: 'T. Nagar' },
    { id: 6, location: 'Hyderabad, Telangana', area: 'Banjara Hills' },
    { id: 7, location: 'Kolkata, West Bengal', area: 'Salt Lake City' },
    { id: 8, location: 'Ahmedabad, Gujarat', area: 'Satellite' },
    { id: 9, location: 'Jaipur, Rajasthan', area: 'Malviya Nagar' },
    { id: 10, location: 'Lucknow, Uttar Pradesh', area: 'Gomti Nagar' },
    { id: 11, location: 'Indore, Madhya Pradesh', area: 'Vijay Nagar' },
    { id: 12, location: 'Nagpur, Maharashtra', area: 'Civil Lines' }
  ];

  // Filter franchises based on search
  const filteredFranchises = useMemo(() => {
    if (!searchLocation.trim()) return franchises;
    
    return franchises.filter(franchise =>
      franchise.location.toLowerCase().includes(searchLocation.toLowerCase()) ||
      franchise.area.toLowerCase().includes(searchLocation.toLowerCase())
    );
  }, [searchLocation]);

  const handleFranchiseClick = (franchiseId) => {
    const newSelected = new Set(selectedFranchises);
    if (newSelected.has(franchiseId)) {
      newSelected.delete(franchiseId);
    } else {
      newSelected.add(franchiseId);
      if (selectedFranchises.size > 0) {
        alert("You can select one Franchisee at a time");
        newSelected.delete(franchiseId);
        return;
      }
    }
    setSelectedFranchises(newSelected);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-lg border-b border-rose-100">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-center mb-6">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-red-600 to-red-800 bg-clip-text text-transparent">
              Select Franchisee Near You
            </h1>
          </div>
          
          {/* Search Bar */}
          <div className="relative max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search by city, state, or area..."
                value={searchLocation}
                onChange={(e) => setSearchLocation(e.target.value)}
                className="w-full outline-none pl-12 pr-4 py-4 text-lg border-2 border-rose-200 rounded-2xl focus:border-rose-400 focus:ring-4 focus:ring-rose-100 transition-all duration-200 bg-white shadow-md"
              />
            </div>
            <div className="absolute -bottom-5 left-1/2 transform -translate-x-1/2 text-sm text-gray-500">
              {filteredFranchises.length} franchise{filteredFranchises.length !== 1 ? 's' : ''} found
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Selected Counter */}
        {selectedFranchises.size > 0 && (
          <div className="mb-6 text-center">
            <div className="inline-flex items-center bg-rose-100 text-rose-700 px-4 py-2 rounded-full">
              <Heart className="h-4 w-4 mr-2 fill-current" />
              {selectedFranchises.size} franchise{selectedFranchises.size !== 1 ? 's' : ''} selected
            </div>
          </div>
        )}

        {/* Franchise Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFranchises.map((franchise) => {
            const isSelected = selectedFranchises.has(franchise.id);
            
            return (
              <div
                key={franchise.id}
                onClick={() => handleFranchiseClick(franchise.id)}
                className={`
                  bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1
                  ${isSelected 
                    ? 'border-2 border-rose-400 ring-4 ring-rose-100 bg-gradient-to-br from-rose-50 to-pink-50' 
                    : 'border-2 border-gray-100 hover:border-rose-200'
                  }
                `}
              >
                <div className="p-6">
                  {/* Card Header */}
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-gray-800">
                      Manomilan Marriage Bureau
                    </h3>
                    <div className={`
                      w-6 h-6 rounded-full border-2 transition-all duration-200
                      ${isSelected 
                        ? 'bg-rose-500 border-rose-500' 
                        : 'border-gray-300 hover:border-rose-400'
                      }
                    `}>
                      {isSelected && (
                        <div className="w-full h-full flex items-center justify-center">
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Location */}
                  <div className="flex items-start text-gray-600 mb-2">
                    <MapPin className="h-5 w-5 mt-0.5 mr-3 text-rose-400 flex-shrink-0" />
                    <div>
                      <div className="font-medium text-gray-800">{franchise.area}</div>
                      <div className="text-sm">{franchise.location}</div>
                    </div>
                  </div>
                  
                  {/* Status Badge */}
                  <div className="mt-4 flex justify-between items-center">
                    {/* <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                      Available
                    </span> */}
                    <span className={`
                      text-sm font-medium transition-colors duration-200
                      ${isSelected ? 'text-rose-600' : 'text-gray-400'}
                    `}>
                      {isSelected ? 'Selected' : 'Click to select'}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* No Results */}
        {filteredFranchises.length === 0 && (
          <div className="text-center py-12">
            <MapPin className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-600 mb-2">No franchises found</h3>
            <p className="text-gray-500">Try searching with a different location or area name</p>
          </div>
        )}

        {/* Action Button */}
        {selectedFranchises.size > 0 && (
          <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-10">
            <button className="bg-gradient-to-r from-rose-500 to-pink-600 text-white px-8 py-4 rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 font-semibold text-lg hover:scale-105">
              Proceed with {selectedFranchises.size} franchise{selectedFranchises.size !== 1 ? 's' : ''}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FranchiseSelecter;