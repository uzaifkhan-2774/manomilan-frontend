import React, { useEffect, useState } from 'react';
import { Plus, Eye, MapPin, Globe, Building2, Trash, Trash2 } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-toastify';

const CountrySettings = () => {
    const [countries, setCountries] = useState([]);
    const [states, setStates] = useState([]);
    const [cities, setCities] = useState([]);

    const [countryInput, setCountryInput] = useState('');
    const [stateInput, setStateInput] = useState('');
    const [cityInput, setCityInput] = useState('');

    const [selectedCountryForState, setSelectedCountryForState] = useState('');
    const [selectedCountryForCity, setSelectedCountryForCity] = useState('');
    const [selectedStateForCity, setSelectedStateForCity] = useState('');

    const [showCountryView, setShowCountryView] = useState(false);
    const [showStateView, setShowStateView] = useState(false);
    const [showCityView, setShowCityView] = useState(false);

    // getting the values here 
    const [countriesView, setCountriesView] = useState([]) //getting the countries
    const [statesView, setstatesView] = useState([]) //getting the states
    const [cityView, setCityView] = useState([]) //getting the cities

    // Fetch functions
    const viewCountries = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/admin/get-country')
            setCountriesView(response.data.result || [])
        } catch (error) {
            console.error('Error fetching countries:', error)
        }
    }

    const viewStates = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/admin/get-all-states')
            setstatesView(response.data.allStates || [])
        } catch (error) {
            console.error('Error fetching states:', error)
        }
    }

    const viewCity = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/admin/get-all-cities')
            setCityView(response.data.allLocations || [])
        } catch (error) {
            console.error('Error fetching cities:', error)
        }
    }

    // Country operations
    const addCountry = async () => {
        if (countryInput.trim()) {
            const newCountry = {
                id: Date.now(),
                name: countryInput.trim()
            };
            setCountries([...countries, newCountry]);
            
            try {
                const mappedData = {
                    country: newCountry.name
                }
                console.log(mappedData)
                const response = await axios.post('http://localhost:8000/api/admin/add-country', mappedData)
                if (response.status === 200) {
                    setCountryInput('');
                    toast.success("Country added successfully!")
                    // Refresh the countries view immediately after successful addition
                    await viewCountries();
                    return
                }
                toast.error("something went wrong")
            } catch (error) {
                console.error(error)
            }
        }
    };

    const DeleteCountry = async (country) => {
        try {
            const response = await axios.delete('http://localhost:8000/api/admin/delete-country', { data: { country } })
            // Refresh the view immediately after successful deletion
            await viewCountries()
        } catch (error) {
            console.log(error)
        }
    }

    // State operations
    const addState = async () => {
        if (stateInput.trim() && selectedCountryForState) {
            const newState = {
                id: Date.now(),
                name: stateInput.trim(),
                countryId: parseInt(selectedCountryForState),
                countryName: countries.find(c => c.id === parseInt(selectedCountryForState))?.name
            };
            setStates([...states, newState]);
            // setSelectedCountryForState('');
            
            try {
                const mappedData = {
                    state: newState.name,
                    country: selectedCountryForState
                }
                const response = await axios.post('http://localhost:8000/api/admin/add-state-country', mappedData)
                if (response.data.status === true) {
                    setStateInput('');
                    toast.success("State added successfully")
                    // Refresh the states view immediately after successful addition
                    await viewStates();
                    return
                }
                alert(response.data.message)
            } catch (error) {
                console.error(error)
                alert("Something went wrong")
            }
        }
    };

    const handleDelete = async (state, country) => {
        try {
            const response = await axios.delete('http://localhost:8000/api/admin/delete-state-country', { data: { state, country } })
            if (response.status === 200) {
                alert(response.data.message)
                // Refresh both states and countries view after deletion
                await viewStates();
                await viewCountries();
            }
        } catch (error) {
            console.log(error)
        }
    }

    // City operations
    const addCity = async () => {
        if (cityInput.trim() && selectedCountryForCity && selectedStateForCity) {
            const newCity = {
                id: Date.now(),
                name: cityInput.trim(),
                countryId: parseInt(selectedCountryForCity),
                stateId: parseInt(selectedStateForCity),
                countryName: countries.find(c => c.id === parseInt(selectedCountryForCity))?.name,
                stateName: states.find(s => s.id === parseInt(selectedStateForCity))?.name
            };
            setCities([...cities, newCity]);
            // setCityInput('');
            // setSelectedCountryForCity('');
            
            const mappedData = {
                country: selectedCountryForCity,
                state: selectedStateForCity,
                city: newCity.name
            }
            
            try {
                const response = await axios.post('http://localhost:8000/api/admin/add-state-city', mappedData)
                if (response.data.status) {
                    setSelectedStateForCity('');
                    toast.success("New city added")
                    // Refresh the cities view immediately after successful addition
                    await viewCity();
                    return
                }
                toast.error("Failed to add new city!")
            } catch (error) {
                console.error(error)
            }
        }
    };

    const deleteCity= async (city,state,country)=>{
        try {
            const response = await axios.delete('http://localhost:8000/api/admin/delete-city', { data: { state, country,city } })
            alert(response.data.message)
            await viewCountries()
            await viewStates()
            await viewCity()
        } catch (error) {
            console.log(error)
        }
    }

    // Initial load
    useEffect(() => {
        viewCountries()
        viewStates()
        viewCity()
    }, [])

    // Get states for selected country
    const getStatesForCountry = (countryName) => {
        return statesView.filter(state => state.country === countryName);
    };

    const handleKeyPress = (e, action) => {
        if (e.key === 'Enter') {
            action();
        }
    };

    return (
        <div className="min-h-screen p-6">
            <div className="max-w-full mx-auto">
                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                    <div className="p-6 space-y-8">
                        {/* Countries Section */}
                        <div className="border border-gray-200 rounded-lg p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <h2 className="text-xl font-semibold text-gray-800">Countries</h2>
                            </div>

                            <div className="flex gap-4 items-end">
                                <div className="flex-1">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Country Name
                                    </label>
                                    <input
                                        type="text"
                                        value={countryInput}
                                        onChange={(e) => setCountryInput(e.target.value)}
                                        onKeyPress={(e) => handleKeyPress(e, addCountry)}
                                        placeholder="Enter country name"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7d0a0a] focus:border-transparent outline-none transition-all"
                                    />
                                </div>
                                <button
                                    onClick={addCountry}
                                    className="bg-[#7d0a0a] text-white px-6 py-2 rounded-lg hover:bg-red-800 transition-colors flex items-center gap-2"
                                >
                                    <Plus className="w-4 h-4" />
                                    Add
                                </button>
                                <button
                                    onClick={() => setShowCountryView(!showCountryView)}
                                    className="bg-white border-2 border-[#7d0a0a] text-[#7d0a0a] px-6 py-2 rounded-lg hover:bg-red-50 transition-colors flex items-center gap-2"
                                >
                                    <Eye className="w-4 h-4" />
                                    View
                                </button>
                            </div>

                            {showCountryView && (
                                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                                    <h3 className="font-medium text-gray-800 mb-3">Countries List ({countriesView.length})</h3>
                                    {countriesView.length === 0 ? (
                                        <p className="text-gray-500 italic">No countries added yet</p>
                                    ) : (
                                        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-2">
                                            {
                                                countriesView.map((ele, index) => (
                                                    <p key={index} className='p-2 flex justify-between border-1 border-black rounded font-semibold text-[#7d0a0a]'>
                                                        {ele.country} 
                                                        <Trash2 className='w-4 cursor-pointer' onClick={() => DeleteCountry(ele.country)} />
                                                    </p>
                                                ))
                                            }
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* States Section */}
                        <div className="border border-gray-200 rounded-lg p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <h2 className="text-xl font-semibold text-gray-800">States</h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Select Country
                                    </label>
                                    <select
                                        value={selectedCountryForState}
                                        onChange={(e) => setSelectedCountryForState(e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7d0a0a] focus:border-transparent outline-none transition-all"
                                    >
                                        <option value="">Choose a country</option>
                                        {
                                            countriesView.map((ele, index) => (
                                                <option key={index} value={ele.country}>
                                                    {ele.country}
                                                </option>
                                            ))
                                        }
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        State Name
                                    </label>
                                    <input
                                        type="text"
                                        value={stateInput}
                                        onChange={(e) => setStateInput(e.target.value)}
                                        onKeyPress={(e) => handleKeyPress(e, addState)}
                                        placeholder="Enter state name"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7d0a0a] focus:border-transparent outline-none transition-all"
                                    />
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <button
                                    onClick={addState}
                                    disabled={!selectedCountryForState || !stateInput.trim()}
                                    className="bg-[#7d0a0a] text-white px-6 py-2 rounded-lg hover:bg-red-800 transition-colors flex items-center gap-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
                                >
                                    <Plus className="w-4 h-4" />
                                    Add
                                </button>
                                <button
                                    onClick={() => setShowStateView(!showStateView)}
                                    className="bg-white border-2 border-[#7d0a0a] text-[#7d0a0a] px-6 py-2 rounded-lg hover:bg-red-50 transition-colors flex items-center gap-2"
                                >
                                    <Eye className="w-4 h-4" />
                                    View
                                </button>
                            </div>

                            {showStateView && (
                                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                                    <h3 className="font-medium text-gray-800 mb-3">States List ({statesView.length})</h3>
                                    {statesView.length === 0 ? (
                                        <p className="text-gray-500 italic">No states added yet</p>
                                    ) : (
                                        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-2">
                                            {
                                                statesView.map((ele, index) => (
                                                    <div key={index} className='border-1 border-black rounded flex justify-between items-center px-2'>
                                                        <p className='p-2 font-semibold text-[#7d0a0a]'>{ele.country}, {ele.state}</p>
                                                        <Trash2 className='text-red-600 w-5 cursor-pointer' onClick={() => handleDelete(ele.state, ele.country)} />
                                                    </div>
                                                ))
                                            }
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Cities Section */}
                        <div className="border border-gray-200 rounded-lg p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <h2 className="text-xl font-semibold text-gray-800">Cities</h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Select Country
                                    </label>
                                    <select
                                        value={selectedCountryForCity}
                                        onChange={(e) => {
                                            setSelectedCountryForCity(e.target.value);
                                            setSelectedStateForCity(''); // Reset state when country changes
                                        }}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7d0a0a] focus:border-transparent outline-none transition-all"
                                    >
                                        <option value="">Choose a country</option>
                                        {
                                            countriesView.map((ele, index) => (
                                                <option key={index} value={ele.country}>
                                                    {ele.country}
                                                </option>
                                            ))
                                        }
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Select State
                                    </label>
                                    <select
                                        value={selectedStateForCity}
                                        onChange={(e) => setSelectedStateForCity(e.target.value)}
                                        disabled={!selectedCountryForCity}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7d0a0a] focus:border-transparent outline-none transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
                                    >
                                        <option value="">Choose a state</option>
                                        {getStatesForCountry(selectedCountryForCity).map((state, index) => (
                                            <option key={index} value={state.state}>
                                                {state.state}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        City Name
                                    </label>
                                    <input
                                        type="text"
                                        value={cityInput}
                                        onChange={(e) => setCityInput(e.target.value)}
                                        onKeyPress={(e) => handleKeyPress(e, addCity)}
                                        placeholder="Enter city name"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7d0a0a] focus:border-transparent outline-none transition-all"
                                    />
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <button
                                    onClick={addCity}
                                    disabled={!selectedCountryForCity || !selectedStateForCity || !cityInput.trim()}
                                    className="bg-[#7d0a0a] text-white px-6 py-2 rounded-lg hover:bg-red-800 transition-colors flex items-center gap-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
                                >
                                    <Plus className="w-4 h-4" />
                                    Add
                                </button>
                                <button
                                    onClick={() => setShowCityView(!showCityView)}
                                    className="bg-white border-2 border-[#7d0a0a] text-[#7d0a0a] px-6 py-2 rounded-lg hover:bg-red-50 transition-colors flex items-center gap-2"
                                >
                                    <Eye className="w-4 h-4" />
                                    View
                                </button>
                            </div>

                            {showCityView && (
                                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                                    <h3 className="font-medium text-gray-800 mb-3">Cities List ({cityView.length})</h3>
                                    {cityView.length === 0 ? (
                                        <p className="text-gray-500 italic">No cities added yet</p>
                                    ) : (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                            {cityView.map((city, index) => (
                                                <div key={index} className="bg-white p-3 rounded border">
                                                    <div className="flex justify-between items-center">
                                                        <span className="text-gray-800 font-medium">{city.city}</span>
                                                        <div className="flex gap-2">
                                                            <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                                                {city.stateCountry.state}
                                                            </span>
                                                            <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                                                {city.stateCountry.country}
                                                            </span>
                                                            <span>
                                                                <Trash2 className='w-5 text-red-600 cursor-pointer' onClick={()=>deleteCity(city.city,city.stateCountry.state,city.stateCountry.country)}/>
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CountrySettings;