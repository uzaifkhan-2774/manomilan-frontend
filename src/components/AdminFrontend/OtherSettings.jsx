import React, { useEffect, useState } from "react";
import {
  Plus,
  Utensils,
  Users,
  Heart,
  Palette,
  User,
  Home,
  Briefcase,
  Languages,
  X,
  ChevronDown,
} from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";

const UserPreferencesManager = () => {
  // State for all categories
  const [expandedCategory, setExpandedCategory] = useState(null);
  const [foodPreferences, setFoodPreferences] = useState([]);
  const [sects, setSects] = useState([]);
  const [manglikStatus, setManglikStatus] = useState([]);
  const [complexions, setComplexions] = useState([]);
  const [bodyTypes, setBodyTypes] = useState([]);
  const [familyBackgrounds, setFamilyBackgrounds] = useState([]);
  const [positions, setPositions] = useState([]);
  const [motherTongues, setMotherTongues] = useState([]);

  // Input states
  const [foodPreferenceInput, setFoodPreferenceInput] = useState("");
  const [sectInput, setSectInput] = useState("");
  const [manglikInput, setManglikInput] = useState("");
  const [complexionInput, setComplexionInput] = useState("");
  const [bodyTypeInput, setBodyTypeInput] = useState("");
  const [familyBackgroundInput, setFamilyBackgroundInput] = useState("");
  const [positionInput, setPositionInput] = useState("");
  const [motherTongueInput, setMotherTongueInput] = useState("");

  // Getting the values
  const getMotherTongues = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/api/admin/get-mother-tongue"
      );
      if (response.data.status === true) {
        const fetched = response.data.result.map((item) => ({
          id: item._id || Date.now(),
          name: item.motherTongue,
          type: "Mother Tongue",
        }));
        setMotherTongues(fetched);
      }
    } catch (error) {
      console.error("Error fetching mother tongues:", error);
    }
  };

  const getFoodPref = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/api/admin/get-foodPref"
      );
      const fetched = response.data.result.map((item) => ({
        id: Date.now(),
        name: item.foodPreference,
        type: "Food Preference",
      }));
      setFoodPreferences(fetched);
    } catch (error) {
      console.log(error);
    }
  };

  const getSect = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/api/admin/get-sect"
      );
      if (response.data.status === true) {
        const fetched = response.data.result.map((item) => ({
          id: Date.now(),
          name: item.sect,
          type: "Sect",
        }));
        setSects(fetched);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getManglik = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/api/admin/get-manglik"
      );
      if (response.data.status === true) {
        const fetched = response.data.result.map((item) => ({
          id: Date.now(),
          name: item.manglik,
          type: "Manglik Status",
        }));
        setManglikStatus(fetched);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getComplexion = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/api/admin/get-complexion"
      );
      if (response.data.status === true) {
        const fetched = response.data.result.map((item) => ({
          id: Date.now(),
          name: item.complexion,
          type: "Complexion",
        }));
        setComplexions(fetched);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getBodyType = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/api/admin/get-bodytype"
      );
      if (response.data.status === true) {
        const fetched = response.data.result.map((item) => ({
          id: Date.now(),
          name: item.bodyType,
          type: "Body Type",
        }));
        setBodyTypes(fetched);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getPosition = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/api/admin/get-position"
      );
      if (response.data.status === true) {
        const fetched = response.data.result.map((item) => ({
          id: Date.now(),
          name: item.position,
          type: "Position",
        }));
        setPositions(fetched);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getFamBg = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/api/admin/get-familybg"
      );
      if (response.data.status === true) {
        const fetched = response.data.result.map((item) => ({
          id: Date.now(),
          name: item.familyBg,
          type: "Family Background",
        }));
        setFamilyBackgrounds(fetched);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getMotherTongues();
    getFoodPref();
    getSect();
    getManglik();
    getComplexion();
    getBodyType();
    getFamBg();
    getPosition();
  }, []);

  // Add functions for each category
  const addFoodPreference = async () => {
    try {
      const response = await axios.post(
        "http://localhost:8000/api/admin/add-foodPref",
        { foodPreference: foodPreferenceInput }
      );
      if (response.data.status === true) {
        toast.success(response.data.message);
        setFoodPreferenceInput("");
        getFoodPref();
        return;
      }
      toast.error(response.data.message);
    } catch (error) {
      console.log("something went wrong");
    }
  };

  const addSect = async () => {
    try {
      const response = await axios.post(
        "http://localhost:8000/api/admin/add-sect",
        { sect: sectInput }
      );
      if (response.data.status === true) {
        toast.success(response.data.message);
        setSectInput("");
        getSect();
        return;
      }
      toast.error(response.data.message);
    } catch (error) {
      console.log(error);
    }
  };

  const addManglik = async () => {
    try {
      const response = await axios.post(
        "http://localhost:8000/api/admin/add-manglik",
        { manglik: manglikInput }
      );
      if (response.data.status === true) {
        toast.success(response.data.message);
        setManglikInput("");
        getManglik();
        return;
      }
      toast.error(response.data.message);
    } catch (error) {
      console.log(error);
    }
  };

  const addComplexion = async () => {
    try {
      const response = await axios.post(
        "http://localhost:8000/api/admin/add-complexion",
        { complexion: complexionInput }
      );
      if (response.data.status === true) {
        toast.success(response.data.message);
        setComplexionInput("");
        getComplexion();
        return;
      }
      toast.error(response.data.message);
    } catch (error) {
      console.log(error);
    }
  };

  const addBodyType = async () => {
    try {
      const response = await axios.post(
        "http://localhost:8000/api/admin/add-bodytype",
        { bodyType: bodyTypeInput }
      );
      if (response.data.status === true) {
        toast.success(response.data.message);
        setBodyTypeInput("");
        getBodyType();
        return;
      }
      toast.error(response.data.message);
    } catch (error) {
      console.log(error);
    }
  };

  const addFamilyBackground = async () => {
    try {
      const response = await axios.post(
        "http://localhost:8000/api/admin/add-familybg",
        { familyBg: familyBackgroundInput }
      );
      if (response.data.status === true) {
        toast.success(response.data.message);
        setFamilyBackgroundInput("");
        getFamBg();
        return;
      }
      toast.error(response.data.message);
    } catch (error) {
      console.log(error);
    }
  };

  const addPosition = async () => {
    try {
      const response = await axios.post(
        "http://localhost:8000/api/admin/add-position",
        { position: positionInput }
      );
      if (response.data.status === true) {
        toast.success(response.data.message);
        setPositionInput("");
        getPosition();
        return;
      }
      toast.error(response.data.message);
    } catch (error) {
      console.log(error);
    }
  };

  const addMotherTongue = async () => {
    try {
      const response = await axios.post(
        "http://localhost:8000/api/admin/add-mother-tongue",
        { motherTongue: motherTongueInput }
      );
      if (response.data.status === true) {
        toast.success(response.data.message);
        setMotherTongueInput("");
        getMotherTongues();
        return;
      }
      toast.error(response.data.message);
    } catch (error) {
      console.log(error);
    }
  };

  const handleKeyPress = (e, action) => {
    if (e.key === "Enter") {
      action();
    }
  };

  // Get all items for category
  const getItemsForCategory = (category) => {
    switch (category) {
      case "Food Preferences":
        return foodPreferences;
      case "Mother Tongue":
        return motherTongues;
      case "Sect":
        return sects;
      case "Manglik Status":
        return manglikStatus;
      case "Complexion":
        return complexions;
      case "Body Type":
        return bodyTypes;
      case "Family Background":
        return familyBackgrounds;
      case "Positions":
        return positions;
      default:
        return [];
    }
  };

  // Handle delete
  const handleDelete = async (item) => {
    let endpoint = "";

    switch (expandedCategory) {
      case "Food Preferences":
        endpoint = "/api/admin/delete-foodPref";
        break;
      case "Mother Tongue":
        endpoint = "/api/admin/delete-mother-tongue";
        break;
      case "Sect":
        endpoint = "/api/admin/delete-sect";
        break;
      case "Manglik Status":
        endpoint = "/api/admin/delete-manglik";
        break;
      case "Complexion":
        endpoint = "/api/admin/delete-complexion";
        break;
      case "Body Type":
        endpoint = "/api/admin/delete-bodyType";
        break;
      case "Family Background":
        endpoint = "/api/admin/delete-familyBackground";
        break;
      case "Positions":
        endpoint = "/api/admin/delete-position";
        break;
      default:
        toast.error("Unknown category");
        return;
    }

    try {
      const response = await axios.delete(`http://localhost:8000${endpoint}`, {
        data: item.name,
      });

      if (response.data.status === true) {
        toast.success(response.data.message);

        // Refresh data based on category
        switch (expandedCategory) {
          case "Food Preferences":
            getFoodPref();
            break;
          case "Mother Tongue":
            getMotherTongues();
            break;
          case "Sect":
            getSect();
            break;
          case "Manglik Status":
            getManglik();
            break;
          case "Complexion":
            getComplexion();
            break;
          case "Body Type":
            getBodyType();
            break;
          case "Family Background":
            getFamBg();
            break;
          case "Positions":
            getPosition();
            break;
          default:
            break;
        }
      }
    } catch (error) {
      console.error("Error deleting preference:", error);
      toast.error("Failed to delete preference");
    }
  };

  const categories = [
    {
      title: "Food Preferences",
      icon: Utensils,
      input: foodPreferenceInput,
      setInput: setFoodPreferenceInput,
      addFunction: addFoodPreference,
      placeholder: "e.g., Vegetarian, Non-Vegetarian",
    },
    {
      title: "Mother Tongue",
      icon: Languages,
      input: motherTongueInput,
      setInput: setMotherTongueInput,
      addFunction: addMotherTongue,
      placeholder: "e.g., Hindi, Marathi, Tamil",
    },
    {
      title: "Sect",
      icon: Users,
      input: sectInput,
      setInput: setSectInput,
      addFunction: addSect,
      placeholder: "e.g., Brahmin, Kshatriya",
    },
    {
      title: "Manglik Status",
      icon: Heart,
      input: manglikInput,
      setInput: setManglikInput,
      addFunction: addManglik,
      placeholder: "e.g., Manglik, Non-Manglik",
    },
    {
      title: "Complexion",
      icon: Palette,
      input: complexionInput,
      setInput: setComplexionInput,
      addFunction: addComplexion,
      placeholder: "e.g., Fair, Wheatish, Dark",
    },
    {
      title: "Body Type",
      icon: User,
      input: bodyTypeInput,
      setInput: setBodyTypeInput,
      addFunction: addBodyType,
      placeholder: "e.g., Slim, Average, Athletic",
    },
    {
      title: "Family Background",
      icon: Home,
      input: familyBackgroundInput,
      setInput: setFamilyBackgroundInput,
      addFunction: addFamilyBackground,
      placeholder: "e.g., Middle Class, Upper Middle",
    },
    {
      title: "Positions",
      icon: Briefcase,
      input: positionInput,
      setInput: setPositionInput,
      addFunction: addPosition,
      placeholder: "e.g., Manager, Director, CEO",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Preferences Manager
          </h1>
          <p className="text-gray-600">Manage and organize user preferences</p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category, index) => {
            const IconComponent = category.icon;
            const items = getItemsForCategory(category.title);
            const isExpanded = expandedCategory === category.title;

            return (
              <div
                key={index}
                className={`rounded-xl border-2 border-gray-200 transition-all duration-300 overflow-hidden shadow-sm hover:shadow-md bg-white`}
              >
                {/* Header */}
                <div className="bg-[#7d0a0a] p-4 text-white">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <IconComponent className="w-6 h-6" />
                      <h3 className="text-lg font-semibold">
                        {category.title}
                      </h3>
                    </div>
                    {items.length > 0 && (
                      <span className="bg-white bg-opacity-20 px-3 py-1 rounded-full text-sm font-semibold">
                        {items.length}
                      </span>
                    )}
                  </div>
                </div>

                {/* Content */}
                <div className="p-4">
                  {/* Input Section */}
                  <div className="space-y-3 mb-4 pb-4 border-b border-gray-200">
                    <input
                      type="text"
                      value={category.input}
                      onChange={(e) => category.setInput(e.target.value)}
                      onKeyPress={(e) => handleKeyPress(e, category.addFunction)}
                      placeholder={category.placeholder}
                      className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7d0a0a] focus:border-transparent outline-none transition-all text-sm"
                    />
                    <button
                      onClick={category.addFunction}
                      disabled={!category.input.trim()}
                      className="w-full bg-[#7d0a0a] text-white px-4 py-2.5 rounded-lg hover:bg-red-800 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed font-medium text-sm"
                    >
                      <Plus className="w-4 h-4" />
                      Add
                    </button>
                  </div>

                  {/* Items Display */}
                  {isExpanded ? (
                    <div className="space-y-2">
                      {items.length === 0 ? (
                        <div className="text-center py-6 text-gray-400">
                          <p className="text-sm italic">No items added yet</p>
                        </div>
                      ) : (
                        <>
                          {items.map((item, idx) => (
                            <div
                              key={idx}
                              className="flex items-center justify-between gap-2 p-3 bg-red-50 rounded-lg border border-gray-200 group hover:shadow-sm transition-all"
                            >
                              <span className="text-sm font-medium text-gray-800">
                                {item.name}
                              </span>
                              <button
                                onClick={() => handleDelete(item)}
                                className="text-gray-400 hover:text-red-600 transition-colors opacity-0 group-hover:opacity-100"
                                title="Delete"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                        </>
                      )}
                    </div>
                  ) : (
                    <button
                      onClick={() => setExpandedCategory(category.title)}
                      className={`w-full flex items-center justify-center gap-2 text-sm font-medium transition-all p-2 rounded-lg ${
                        items.length > 0
                          ? "text-[#7d0a0a] hover:bg-red-50"
                          : "text-gray-400"
                      }`}
                    >
                      {items.length > 0 ? (
                        <>
                          <span>View {items.length} items</span>
                          <ChevronDown className="w-4 h-4" />
                        </>
                      ) : (
                        <span>No items</span>
                      )}
                    </button>
                  )}

                  {/* Collapse Button */}
                  {isExpanded && (
                    <button
                      onClick={() => setExpandedCategory(null)}
                      className="w-full mt-4 text-sm font-medium text-[#7d0a0a] hover:text-red-900 py-2 flex items-center justify-center gap-1 transition-all"
                    >
                      <ChevronDown className="w-4 h-4 rotate-180" />
                      Collapse
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default UserPreferencesManager;