import React, { useEffect, useState } from "react";
import { Plus, Eye, Users, Star, Crown, Trash2 } from "lucide-react";
import axios from "axios";

const ReligionManagementPanel = () => {
  const [religions, setReligions] = useState([]);
  const [castes, setCastes] = useState([]);
  const [subcastes, setSubcastes] = useState([]);

  const [religionInput, setReligionInput] = useState("");
  const [casteInput, setCasteInput] = useState("");
  const [subcasteInput, setSubcasteInput] = useState("");

  const [selectedReligionForCaste, setSelectedReligionForCaste] = useState("");
  const [selectedReligionForSubcaste, setSelectedReligionForSubcaste] =
    useState("");
  const [selectedCasteForSubcaste, setSelectedCasteForSubcaste] = useState("");

  const [showReligionView, setShowReligionView] = useState(false);
  const [showCasteView, setShowCasteView] = useState(false);
  const [showSubcasteView, setShowSubcasteView] = useState(false);

  const [religionView, setReligionView] = useState([]);
  const [casteView, setCasteView] = useState([]);
  const [subcasteView, setSubcasteView] = useState([]);

  // Fetch functions
  const viewReligion = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/api/admin/get-religion"
      );
      setReligionView(response.data.result || []);
    } catch (error) {
      console.error("Error fetching religions:", error);
    }
  };

  const viewCaste = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/api/admin/get-all-castes"
      );
      setCasteView(response.data.result || []);
    } catch (error) {
      console.error("Error fetching castes:", error);
    }
  };

  const viewSubcaste = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/api/admin/get-all-subcastes"
      );
      console.log(response.data.result);
      setSubcasteView(response.data.result || []);
    } catch (error) {
      console.error("Error fetching subcastes:", error);
    }
  };

  // Initial data fetch
  useEffect(() => {
    viewReligion();
    viewCaste();
    viewSubcaste();
  }, []);

  // Religion operations
  const addReligion = async () => {
    if (religionInput.trim()) {
      const mappedData = {
        religion: religionInput.trim(),
      };

      try {
        const response = await axios.post(
          "http://localhost:8000/api/admin/add-religion",
          mappedData
        );
        if (response.data.status) {
          alert(response.data.message);
          setReligionInput("");
          // Refresh the view data immediately after successful addition
          await viewReligion();
        }
      } catch (error) {
        console.error("Error adding religion:", error);
        alert("Error adding religion");
      }
    }
  };

  const deleteReligion = async (religion) => {
    try {
      const response = await axios.delete(
        "http://localhost:8000/api/admin/delete-religion",
        { data: { religion } }
      );
      alert(response.data.message);

      // For now, just refresh the data
      await viewReligion();
      await viewCaste(); // Refresh castes as well since they might be affected
      await viewSubcaste(); // Refresh subcastes as well since they might be affected
    } catch (error) {
      console.error("Error deleting religion:", error);
    }
  };

  // Caste operations
  const addCaste = async () => {
    if (casteInput.trim() && selectedReligionForCaste) {
      const mappedData = {
        caste: casteInput.trim(),
        religion: selectedReligionForCaste,
      };

      try {
        const response = await axios.post(
          "http://localhost:8000/api/admin/add-caste",
          mappedData
        );
        if (response.status === 200) {
          alert("Caste added successfully!");
          setCasteInput("");
          // Refresh the view data immediately after successful addition
          await viewCaste();
        } else {
          alert("Something went wrong");
        }
      } catch (error) {
        console.error("Error adding caste:", error);
        alert("Error adding caste");
      }
    }
  };

  const deleteCaste = async (caste, religion) => {
    try {
      // Add your delete API call here
      const response = await axios.delete(
        "http://localhost:8000/api/admin/delete-caste",
        { data: { religion, caste } }
      );
      alert(response.data.message);
      // For now, just refresh the data
      await viewCaste();
      await viewSubcaste(); // Refresh subcastes as well since they might be affected

      // Also clean up local state
      setSubcastes(subcastes.filter((subcaste) => subcaste.caste !== caste));
      setCastes(castes.filter((caste) => caste.caste !== caste));
    } catch (error) {
      console.error("Error deleting caste:", error);
    }
  };

  // Subcaste operations
  const addSubcaste = async () => {
    if (
      subcasteInput.trim() &&
      selectedReligionForSubcaste &&
      selectedCasteForSubcaste
    ) {
      const mappedData = {
        caste: selectedCasteForSubcaste,
        religion: selectedReligionForSubcaste,
        subCaste: subcasteInput.trim(),
      };
      console.log(mappedData);
      try {
        const response = await axios.post(
          "http://localhost:8000/api/admin/add-subcaste",
          mappedData
        );
        console.log(response.data);

        alert(response.data.message);
        setSubcasteInput("");
        // Refresh the view data immediately after successful addition
        await viewSubcaste();
      } catch (error) {
        console.error("Error adding subcaste:", error);
        alert("Error adding subcaste");
      }
    }
  };

  const deleteSubcaste = async (religion, caste, subcaste) => {
    try {
      // Add your delete API call here
      const response = await axios.delete(
        "http://localhost:8000/api/admin/delete-subcaste",
        { data: { religion, subcaste, caste } }
      );
      alert(response.data.message);
      // For now, just refresh the data
      await viewSubcaste();

      // Also clean up local state
      setSubcastes(subcastes.filter((subcaste) => subcaste !== subcaste));
    } catch (error) {
      console.error("Error deleting subcaste:", error);
    }
  };

  // Get combined hierarchical data in alphabetical order
  const getCombinedData = () => {
    const combined = [];

    // Add religions
    religions
      .sort((a, b) => a.name.localeCompare(b.name))
      .forEach((religion) => {
        combined.push({
          id: `religion-${religion.id}`,
          type: "religion",
          name: religion.name,
          fullPath: religion.name,
          level: 0,
          data: religion,
        });

        // Add castes for this religion
        castes
          .filter((caste) => caste.religionId === religion.id)
          .sort((a, b) => a.name.localeCompare(b.name))
          .forEach((caste) => {
            combined.push({
              id: `caste-${caste.id}`,
              type: "caste",
              name: caste.name,
              fullPath: `${religion.name} → ${caste.name}`,
              level: 1,
              data: caste,
            });

            // Add subcastes for this caste
            subcastes
              .filter((subcaste) => subcaste.casteId === caste.id)
              .sort((a, b) => a.name.localeCompare(b.name))
              .forEach((subcaste) => {
                combined.push({
                  id: `subcaste-${subcaste.id}`,
                  type: "subcaste",
                  name: subcaste.name,
                  fullPath: `${religion.name} → ${caste.name} → ${subcaste.name}`,
                  level: 2,
                  data: subcaste,
                });
              });
          });
      });

    return combined;
  };

  // Get castes for selected religion
  const getCastesForReligion = (religion) => {
    return casteView.filter((caste) => caste.religion === religion);
  };

  const handleKeyPress = (e, action) => {
    if (e.key === "Enter") {
      action();
    }
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-full mx-auto">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-6 space-y-8">
            {/* Religions Section */}
            <div className="border border-gray-200 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <h2 className="text-xl font-semibold text-gray-800">
                  Religion
                </h2>
              </div>

              <div className="flex gap-4 items-end">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Religion Name
                  </label>
                  <input
                    type="text"
                    value={religionInput}
                    onChange={(e) => setReligionInput(e.target.value)}
                    onKeyPress={(e) => handleKeyPress(e, addReligion)}
                    placeholder="Enter religion name"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7d0a0a] focus:border-transparent outline-none transition-all"
                  />
                </div>
                <button
                  onClick={addReligion}
                  className="bg-[#7d0a0a] text-white px-6 py-2 rounded-lg hover:bg-red-800 transition-colors flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add
                </button>
                <button
                  onClick={() => setShowReligionView(!showReligionView)}
                  className="bg-white border-2 border-[#7d0a0a] text-[#7d0a0a] px-6 py-2 rounded-lg hover:bg-red-50 transition-colors flex items-center gap-2"
                >
                  <Eye className="w-4 h-4" />
                  View
                </button>
              </div>

              {showReligionView && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-medium text-gray-800 mb-3">
                    Religion List ({religionView.length})
                  </h3>
                  {religionView.length === 0 ? (
                    <p className="text-gray-500 italic">
                      No religions added yet
                    </p>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-2">
                      {religionView.map((ele, index) => (
                        <div
                          key={index}
                          className="bg-white p-3 rounded border border-[#7d0a0a] flex justify-between items-center"
                        >
                          <span className="text-gray-800 font-medium">
                            {ele.religion}
                          </span>
                          <button
                            onClick={() => deleteReligion(ele.id)}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1 rounded transition-colors"
                            title="Delete religion"
                          >
                            <Trash2
                              className="w-4 h-4"
                              onClick={() => deleteReligion(ele.religion)}
                            />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Castes Section */}
            <div className="border border-gray-200 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <h2 className="text-xl font-semibold text-gray-800">Caste</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Religion
                  </label>
                  <select
                    value={selectedReligionForCaste}
                    onChange={(e) =>
                      setSelectedReligionForCaste(e.target.value)
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7d0a0a] focus:border-transparent outline-none transition-all"
                  >
                    <option value="">Choose a religion</option>
                    {religionView.map((religion, index) => (
                      <option key={index} value={religion.id}>
                        {religion.religion}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Caste Name
                  </label>
                  <input
                    type="text"
                    value={casteInput}
                    onChange={(e) => setCasteInput(e.target.value)}
                    onKeyPress={(e) => handleKeyPress(e, addCaste)}
                    placeholder="Enter caste name"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7d0a0a] focus:border-transparent outline-none transition-all"
                  />
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={addCaste}
                  disabled={!selectedReligionForCaste || !casteInput.trim()}
                  className="bg-[#7d0a0a] text-white px-6 py-2 rounded-lg hover:bg-red-800 transition-colors flex items-center gap-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  <Plus className="w-4 h-4" />
                  Add
                </button>
                <button
                  onClick={() => setShowCasteView(!showCasteView)}
                  className="bg-white border-2 border-[#7d0a0a] text-[#7d0a0a] px-6 py-2 rounded-lg hover:bg-red-50 transition-colors flex items-center gap-2"
                >
                  <Eye className="w-4 h-4" />
                  View
                </button>
              </div>

              {showCasteView && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-medium text-gray-800 mb-3">
                    Caste List ({casteView.length})
                  </h3>
                  {casteView.length === 0 ? (
                    <p className="text-gray-500 italic">No castes added yet</p>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      {casteView.map((ele, index) => (
                        <div
                          key={index}
                          className="bg-white p-3 rounded border flex justify-between items-center"
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-gray-800 font-medium capitalize">
                              {ele.caste + ","}
                            </span>
                            <span className="text-gray-800 font-medium capitalize">
                              {ele.religion}
                            </span>
                          </div>
                          <button
                            onClick={() => deleteCaste(ele.caste, ele.religion)}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1 rounded transition-colors"
                            title="Delete caste"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Subcastes Section */}
            <div className="border border-gray-200 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <h2 className="text-xl font-semibold text-gray-800">
                  Subcaste
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Religion
                  </label>
                  <select
                    value={selectedReligionForSubcaste}
                    onChange={(e) => {
                      setSelectedReligionForSubcaste(e.target.value);
                      setSelectedCasteForSubcaste(""); // Reset caste when religion changes
                    }}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7d0a0a] focus:border-transparent outline-none transition-all"
                  >
                    <option value="">Choose a religion</option>
                    {religionView.map((religion, index) => (
                      <option key={index} value={religion.religion}>
                        {religion.religion}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Caste
                  </label>
                  <select
                    value={selectedCasteForSubcaste}
                    onChange={(e) =>
                      setSelectedCasteForSubcaste(e.target.value)
                    }
                    disabled={!selectedReligionForSubcaste}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7d0a0a] focus:border-transparent outline-none transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
                  >
                    <option value="">Choose a caste</option>
                    {getCastesForReligion(selectedReligionForSubcaste).map(
                      (caste, index) => (
                        <option key={index} value={caste.caste}>
                          {caste.caste}
                        </option>
                      )
                    )}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subcaste Name
                  </label>
                  <input
                    type="text"
                    value={subcasteInput}
                    onChange={(e) => setSubcasteInput(e.target.value)}
                    onKeyPress={(e) => handleKeyPress(e, addSubcaste)}
                    placeholder="Enter subcaste name"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7d0a0a] focus:border-transparent outline-none transition-all"
                  />
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={addSubcaste}
                  disabled={
                    !selectedReligionForSubcaste ||
                    !selectedCasteForSubcaste ||
                    !subcasteInput.trim()
                  }
                  className="bg-[#7d0a0a] text-white px-6 py-2 rounded-lg hover:bg-red-800 transition-colors flex items-center gap-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  <Plus className="w-4 h-4" />
                  Add
                </button>
                <button
                  onClick={() => setShowSubcasteView(!showSubcasteView)}
                  className="bg-white border-2 border-[#7d0a0a] text-[#7d0a0a] px-6 py-2 rounded-lg hover:bg-red-50 transition-colors flex items-center gap-2"
                >
                  <Eye className="w-4 h-4" />
                  View
                </button>
              </div>

              {showSubcasteView && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-medium text-gray-800 mb-3">
                    Subcaste List ({subcasteView.length})
                  </h3>
                  {subcasteView.length === 0 ? (
                    <p className="text-gray-500 italic">
                      No subcaste added yet
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {subcasteView.map((subcaste, index) => (
                        <div
                          key={index}
                          className="bg-white p-3 rounded border"
                        >
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-3">
                              <span className="text-gray-800 font-medium capitalize">
                                {subcaste.subCaste + ","}
                              </span>
                              <div className="flex gap-2">
                                <span className="text-gray-800 font-medium capitalize">
                                  {subcaste?.casteReligion?.caste + ","}
                                </span>
                                <span className="text-gray-800 font-medium capitalize">
                                    {subcaste?.casteReligion?.religion + ","}
                                </span>
                              </div>
                            </div>
                            <button
                              onClick={() =>
                                deleteSubcaste(
                                  subcaste.subcaste,
                                  subcaste.caste,
                                  subcaste.religion
                                )
                              }
                              className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1 rounded transition-colors"
                              title="Delete subcaste"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
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

export default ReligionManagementPanel;
