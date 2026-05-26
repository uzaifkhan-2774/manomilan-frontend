import React, { useEffect, useState } from "react";
import {
  Plus,
  Eye,
  Utensils,
  Users,
  Heart,
  Palette,
  User,
  Home,
  Briefcase,
  Languages,
} from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";

const UserPreferencesManager = () => {
  // State for all categories
  const [viewCategory, setViewCategory] = useState(null);
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

  //   getting the values
  const getMotherTongues = async () => {
    try {
      const response = await axios.get(
        "https://api.manomilan.com/api/admin/get-mother-tongue"
      );
      if (response.data.status === true) {
        // Assuming your API returns an array like [{ id: 1, name: 'Hindi' }, ...]
        const fetched = response.data.result.map((item) => ({
          id: item._id || Date.now(), // fallback if _id missing
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
        "https://api.manomilan.com/api/admin/get-foodPref"
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
        "https://api.manomilan.com/api/admin/get-sect"
      );
      if (response.data.status === true) {
        const fetched = response.data.result.map((item) => ({
          id: Date.now(),
          name: item.sect,
          type: "Manglik",
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
        "https://api.manomilan.com/api/admin/get-manglik"
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
        "https://api.manomilan.com/api/admin/get-complexion"
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
        "https://api.manomilan.com/api/admin/get-bodytype"
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
        "https://api.manomilan.com/api/admin/get-position"
      );
      if (response.data.status === true) {
        const fetched = response.data.result.map((item) => ({
          id: Date.now(),
          name: item.position,
          type: "Position",
        }));
        console.log(response.data)
        setPositions(fetched);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getFamBg = async () => {
    try {
      const response = await axios.get(
        "https://api.manomilan.com/api/admin/get-familybg"
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
    getComplexion()
    getBodyType()
    getFamBg()
    getPosition()
    // const interval = setInterval(() => {
    //   getMotherTongues();
    //   getFoodPref();
    //   getSect();
    //   getManglik();
    //   getComplexion()
    //   getBodyType()
    //   getFamBg()
    //   getPosition()
    // }, 5000);

    // return () => clearInterval(interval);
  }, []);

  // Add functions for each category
  const addFoodPreference = async () => {
    try {
      const response = await axios.post(
        "https://api.manomilan.com/api/admin/add-foodPref",
        { foodPreference: foodPreferenceInput }
      );
      if (response.data.status === true) {
        toast.success(response.data.message);
        setFoodPreferenceInput("");
        return
      }
      toast.error(response.data.message)
    } catch (error) {
      console.log("something went wrong");
    }
  };
  const addSect = async () => {
    try {
      const response = await axios.post(
        "https://api.manomilan.com/api/admin/add-sect",
        { sect: sectInput }
      );
      if (response.data.status === true) {
        toast.success(response.data.message);
        setSectInput("")
        return
      }
      toast.error(response.data.message)
    } catch (error) {
      console.log(error);
    }
  };
  const addManglik = async () => {
    try {
      const response = await axios.post(
        "https://api.manomilan.com/api/admin/add-manglik",
        { manglik: manglikInput }
      );
      if (response.data.status === true) {
        toast.success(response.data.message);
        setManglikInput("");
        return
      }
      toast.error(response.data.message)
    } catch (error) {
      console.log(error);
    }
  };
  const addComplexion = async () =>{
    try {
      const response= await axios.post('https://api.manomilan.com/api/admin/add-complexion',{complexion:complexionInput})
      if(response.data.status===true){
        toast.success(response.data.message)
        setComplexionInput("")
        return
      }
      toast.error(response.data.message)
    } catch (error) {
      console.log(error)
    }
  }
  const addBodyType = async () =>{
    try {
      const response= await axios.post("https://api.manomilan.com/api/admin/add-bodytype",{bodyType:bodyTypeInput})
      console.log(response.data)
      if(response.data.status===true){
        toast.success(response.data.message)
      setBodyTypeInput("")
      return
      }
      toast.error(response.data.message)
    } catch (error) {
      console.log(error)
    }
  }
  const addFamilyBackground =async () =>{
    try {
      const response= await axios.post("https://api.manomilan.com/api/admin/add-familybg",{familyBg:familyBackgroundInput})
      console.log(response.data)
      if(response.data.status===true){
        toast.success(response.data.message)
        setFamilyBackgroundInput("")
        return
      }
      toast.error(response.data.message)
    } catch (error) {
      console.log(error)
    }
  }
  const addPosition = async() =>{
    try {
      const response= await axios.post("https://api.manomilan.com/api/admin/add-position",{position:positionInput})
      console.log(positionInput)
      console.log(response.data)
      if(response.data.status===true){
        toast.success(response.data.message)
        setPositionInput("")
        return
      }
      toast.error(response.data.message)
    } catch (error) {
      console.log(error)
    }
  }
  const addMotherTongue = async () => {
    try {
      const response = await axios.post(
        "https://api.manomilan.com/api/admin/add-mother-tongue",
        { motherTongue: motherTongueInput }
      );
      if (response.data.status === true) {
        toast.success(response.data.message);
        setMotherTongueInput("");
        return
      }
      toast.error(response.data.message)
    } catch (error) {
      console.log(error);
    }
  };

  const handleKeyPress = (e, action) => {
    if (e.key === "Enter") {
      action();
    }
  };

  // Get all items for table display
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

  // handle delete
  const handleDelete = async (item) => {
    let endpoint = "";

    switch (viewCategory) {
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
      const response = await axios.delete(`https://api.manomilan.com${endpoint}`, {
        data: item.name,
      });

      if (response.data.status === true) {
        toast.success(response.data.message);

        // Remove from state
        switch (viewCategory) {
          case "Food Preferences":
            setFoodPreferences((prev) =>
              prev.filter((i) => i.name !== item.name)
            );
            break;
          case "Mother Tongue":
            setMotherTongues((prev) =>
              prev.filter((i) => i.name !== item.name)
            );
            break;
          case "Sect":
            setSects((prev) => prev.filter((i) => i.name !== item.name));
            break;
          case "Manglik Status":
            setManglikStatus((prev) =>
              prev.filter((i) => i.name !== item.name)
            );
            break;
          case "Complexion":
            setComplexions((prev) => prev.filter((i) => i.name !== item.name));
            break;
          case "Body Type":
            setBodyTypes((prev) => prev.filter((i) => i.name !== item.name));
            break;
          case "Family Background":
            setFamilyBackgrounds((prev) =>
              prev.filter((i) => i.name !== item.name)
            );
            break;
          case "Positions":
            setPositions((prev) => prev.filter((i) => i.name !== item.name));
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
      placeholder: "e.g., Vegetarian, Non-Vegetarian, Vegan, Jain",
    },
    {
      title: "Mother Tongue",
      icon: Languages, // or pick a better icon like Languages or Globe if you have
      input: motherTongueInput,
      setInput: setMotherTongueInput,
      addFunction: addMotherTongue,
      placeholder: "e.g., Hindi, Marathi, Tamil, Telugu",
    },
    {
      title: "Sect",
      icon: Users,
      input: sectInput,
      setInput: setSectInput,
      addFunction: addSect,
      placeholder: "e.g., Brahmin, Kshatriya, Vaishya, Shudra",
    },
    {
      title: "Manglik Status",
      icon: Heart,
      input: manglikInput,
      setInput: setManglikInput,
      addFunction: addManglik,
      placeholder: "e.g., Manglik, Non-Manglik, Anshik Manglik",
    },
    {
      title: "Complexion",
      icon: Palette,
      input: complexionInput,
      setInput: setComplexionInput,
      addFunction: addComplexion,
      placeholder: "e.g., Fair, Wheatish, Dark, Very Fair",
    },
    {
      title: "Body Type",
      icon: User,
      input: bodyTypeInput,
      setInput: setBodyTypeInput,
      addFunction: addBodyType,
      placeholder: "e.g., Slim, Average, Athletic, Heavy",
    },
    {
      title: "Family Background",
      icon: Home,
      input: familyBackgroundInput,
      setInput: setFamilyBackgroundInput,
      addFunction: addFamilyBackground,
      placeholder: "e.g., Middle Class, Upper Middle Class, Rich",
    },
    {
      title: "Positions",
      icon: Briefcase,
      input: positionInput,
      setInput: setPositionInput,
      addFunction: addPosition,
      placeholder: "e.g., Manager, Director, CEO, Engineer",
    },
  ];

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-6">
            {/* Categories Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {categories.map((category, index) => {
                const IconComponent = category.icon;
                return (
                  <div
                    key={index}
                    className="border border-gray-200 rounded-lg p-4"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <IconComponent className="w-5 h-5 text-[#7d0a0a]" />
                      <h3 className="text-lg font-semibold text-gray-800">
                        {category.title}
                      </h3>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <input
                          type="text"
                          value={category.input}
                          onChange={(e) => category.setInput(e.target.value)}
                          onKeyPress={(e) =>
                            handleKeyPress(e, category.addFunction)
                          }
                          placeholder={category.placeholder}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7d0a0a] focus:border-transparent outline-none transition-all text-sm"
                        />
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={category.addFunction}
                          disabled={!category.input.trim()}
                          className="flex-1 bg-[#7d0a0a] text-white px-3 py-2 rounded-lg hover:bg-red-800 transition-colors flex items-center justify-center gap-2 disabled:bg-gray-400 disabled:cursor-not-allowed text-sm"
                        >
                          <Plus className="w-4 h-4" />
                          Add
                        </button>
                        <button
                          onClick={() => setViewCategory(category.title)}
                          className="flex-1 bg-white border-2 border-[#7d0a0a] text-[#7d0a0a] px-3 py-2 rounded-lg hover:bg-red-50 transition-colors flex items-center justify-center gap-2 text-sm"
                        >
                          <Eye className="w-4 h-4" />
                          View
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* View All Items Table */}
            {viewCategory && (
              <div className="border border-gray-200 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  {viewCategory} Table
                </h3>
                {getItemsForCategory(viewCategory).length === 0 ? (
                  <div className="text-center py-8">
                    <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500 italic">
                      No preferences added yet
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse bg-white">
                      <thead>
                        <tr className="bg-[#7d0a0a]">
                          <th className="border border-gray-300 px-4 py-3 text-left text-white font-semibold">
                            S.No
                          </th>
                          <th className="border border-gray-300 px-4 py-3 text-left text-white font-semibold">
                            Category
                          </th>
                          <th className="border border-gray-300 px-4 py-3 text-left text-white font-semibold">
                            Preference
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {getItemsForCategory(viewCategory).map(
                          (item, index) => (
                            <tr
                              key={index}
                              className="hover:bg-gray-50 transition-colors"
                            >
                              <td className="border border-gray-300 px-4 py-3 text-gray-800">
                                {index + 1}
                              </td>
                              <td className="border border-gray-300 px-4 py-3">
                                <span className="bg-[#7d0a0a] text-white px-3 py-1 rounded-full text-sm">
                                  {item.type}
                                </span>
                              </td>
                              <td className="border border-gray-300 px-4 py-3 flex items-center justify-between gap-2">
                                <span className="font-medium text-gray-800">
                                  {item.name}
                                </span>
                                <button
                                  onClick={() => handleDelete(item)}
                                  className="text-red-600 hover:text-red-800 transition-colors"
                                  title="Delete"
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-5 w-5"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M6 18L18 6M6 6l12 12"
                                    />
                                  </svg>
                                </button>
                              </td>
                            </tr>
                          )
                        )}
                      </tbody>
                    </table>
                  </div>
                )}
                {/* counts at bottom */}
                {getItemsForCategory(viewCategory).length > 0 && (
                  <div className="mt-4 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 text-sm">
                    <div className="text-center p-2 bg-gray-50 rounded">
                      <div className="text-[#7d0a0a] font-bold text-lg">
                        {getItemsForCategory(viewCategory).length}
                      </div>
                      <div className="text-gray-600">{viewCategory}</div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserPreferencesManager;
