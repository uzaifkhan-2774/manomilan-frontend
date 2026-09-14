import React, { useEffect } from "react";
import MultiStepForm from "./RegisterFresh";
import { useState, useMemo } from "react";
import { Search, MapPin, Heart, Mail } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [searchLocation, setSearchLocation] = useState("");
  const [selectedFranchises, setSelectedFranchises] = useState(new Set());
  const [fracnhsiee, setFranchisee] = useState(false);
  const [sendFranhchisee,setSendFranchisee]=useState({})
  const [totalFranchises,setTotalFranchises]=useState([])

  const navigate= useNavigate()

  // api to get all the franchises 
  const getFranchises=async()=>{
    try {
      const response= await axios.get("https://api.manomilan.com/api/user/get-franchises")
      if(response.data.status===true){
        setTotalFranchises(response.data.franchises)
        return
      }
    } catch (error) {
      console.log("Something went wrong")
    }
  }

  useEffect(()=>{
    getFranchises()
    const interval=setInterval(() => {
      getFranchises()
    }, 5000);

    return ()=>clearInterval(interval)
  },[])

  // Filter franchises based on search
  const filteredFranchises = useMemo(() => {
    if (!searchLocation.trim()) return totalFranchises;

    return totalFranchises.filter(
      (franchise) =>
        franchise.address.toLowerCase().includes(searchLocation.toLowerCase()) ||
        franchise.franchiseName.toLowerCase().includes(searchLocation.toLowerCase())
    );
  }, [searchLocation,totalFranchises]);

  const handleFranchiseClick = (franchiseId) => {
  const newSelected = new Set(selectedFranchises);

  // If user clicked the already-selected franchise, unselect it
  if (newSelected.has(franchiseId)) {
    newSelected.delete(franchiseId);
    setSelectedFranchises(newSelected);
    setSendFranchisee(null); // Clear the selected franchise info
    return;
  }

  // If there's already one selected, warn and replace it
  if (selectedFranchises.size > 0) {
    alert("Only one Franchisee can be selected. Replacing with the new selection.");
    newSelected.clear(); // Remove previous selection
  }

  newSelected.add(franchiseId);

  // Find the franchise object by ID
  const franchise = totalFranchises.find((f) => f._id === franchiseId);

  setSendFranchisee(franchise);
  setSelectedFranchises(newSelected);
  };

  return fracnhsiee ? (
    <MultiStepForm sendFranhchisee={sendFranhchisee}/>
  ) : (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-lg border-b border-rose-100">
        {/* login button */}
        <div className="w-full flex justify-end px-3 py-1">
          <button className="border-1 p-1 px-2 bg-red-500 text-white cursor-pointer font-semibold" onClick={()=>navigate('/')}>Login</button>
        </div>

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
              {filteredFranchises.length} franchise
              {filteredFranchises.length !== 1 ? "s" : ""} found
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
              {selectedFranchises.size} franchise
              {selectedFranchises.size !== 1 ? "s" : ""} selected
            </div>
          </div>
        )}

        {/* Franchise Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFranchises.map((franchise) => {
            const isSelected = selectedFranchises.has(franchise._id);
            return (
              <div
                key={franchise._id}
                onClick={() => handleFranchiseClick(franchise._id)}
                className={`
                      bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1
                      ${
                        isSelected
                          ? "border-2 border-rose-400 ring-4 ring-rose-100 bg-gradient-to-br from-rose-50 to-pink-50"
                          : "border-2 border-gray-100 hover:border-rose-200"
                      }
                    `}
              >
                <div className="p-6">
                  {/* Card Header */}
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-gray-800">
                      {franchise.franchiseName}
                    </h3>
                    <div
                      className={`
                          w-6 h-6 rounded-full border-2 transition-all duration-200
                          ${
                            isSelected
                              ? "bg-rose-500 border-rose-500"
                              : "border-gray-300 hover:border-rose-400"
                          }
                        `}
                    >
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
                      <div className="font-medium text-gray-800">
                        {franchise.location}
                      </div>
                      <div className="flex items-center gap-2">{franchise.address}</div>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div className="mt-4 flex justify-between items-center">
                    <span
                      className={`
                          text-sm font-medium transition-colors duration-200
                          ${isSelected ? "text-rose-600" : "text-gray-400"}
                        `}
                    >
                      {isSelected ? "Selected" : "Click to select"}
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
            <h3 className="text-xl font-medium text-gray-600 mb-2">
              No franchises found
            </h3>
            <p className="text-gray-500">
              Try searching with a different location or area name
            </p>
          </div>
        )}

        {/* Action Button */}
        {selectedFranchises.size > 0 && (
          <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-10">
            <button
              className="bg-gradient-to-r from-red-500 to-red-600 text-white px-8 py-4 rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 font-semibold text-lg hover:scale-105"
              onClick={() => setFranchisee(true)}
            >
              Proceed with {selectedFranchises.size} franchise
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Register;