import React, { useEffect, useState } from "react";
import { Plus, Eye, BookOpen, GraduationCap, Trash2 } from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";

const EducationSetting = () => {
  const [viewStreams, setViewStreams] = useState([]);
  const [viewdegrees, setViewdegrees] = useState([]);
  const [streamInput, setStreamInput] = useState("");
  const [degreeInput, setDegreeInput] = useState("");
  const [selectedStream, setSelectedStream] = useState("");
  const [showView, setShowView] = useState(true); // Show table by default
  const [isLoading, setIsLoading] = useState(false);

  const StreamView = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/admin/get-streams");
      setViewStreams(response.data.data || response.data);
    } catch (error) {
      console.error("Error fetching streams:", error);
    }
  };

  const DegreeView = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/admin/get-all-degrees");
      console.log("Degree API response:", response.data);
      setViewdegrees(response.data.data || response.data);
    } catch (error) {
      console.error("Error fetching degrees:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [streamResponse, degreeResponse] = await Promise.all([
          axios.get("http://localhost:8000/api/admin/get-streams"),
          axios.get("http://localhost:8000/api/admin/get-all-degrees"),
        ]);
        setViewStreams(streamResponse.data.data || streamResponse.data);
        setViewdegrees(degreeResponse.data.data || degreeResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const addStream = async () => {
    if (streamInput.trim()) {
      const newStream = {
        id: Date.now(),
        stream: streamInput.trim(), // Match API response structure
      };
      setViewStreams([...viewStreams, newStream]); // Update viewStreams for immediate UI feedback
      setStreamInput("");
      try {
        const response = await axios.post("http://localhost:8000/api/admin/add-stream", {
          stream: newStream.stream,
        });
        alert(response.data.message);
        await StreamView(); // Refresh streams from API
      } catch (error) {
        console.error("Error adding stream:", error);
        // Revert optimistic update if API call fails
        setViewStreams(viewStreams.filter((s) => s.id !== newStream.id));
      }
    }
  };

  const addDegree = async () => {
    if (degreeInput.trim() && selectedStream) {
      const newDegree = {
        id: Date.now(),
        degree: degreeInput.trim(),
        stream: selectedStream,
      };
      setViewdegrees([...viewdegrees, newDegree]); // Optimistic update
      setDegreeInput("");
      setSelectedStream("");
      try {
        const response = await axios.post("http://localhost:8000/api/admin/add-degree", {
          degree: newDegree.degree,
          stream: selectedStream,
        });
        alert(response.data.message);
        await DegreeView(); // Refresh degrees from API
      } catch (error) {
        console.error("Error adding degree:", error);
        // Revert optimistic update if API call fails
        setViewdegrees(viewdegrees.filter((d) => d.id !== newDegree.id));
      }
    }
  };

 const deleteDegree = async (degreeName, streamName) => {
  console.log(degreeName, streamName)
  try {
    const response = await axios.delete(
      "http://localhost:8000/api/admin/delete-degree",
      {
        headers: { "Content-Type": "application/json" },
        data: { stream: streamName, degree: degreeName }, // ✅ send JSON body
      }
    );
    if(response.data.status){
      toast.success(response.data.message)
      setViewdegrees(viewdegrees.filter((d) => d.degree !== degreeName));
    }else{
      toast.error(response.data.error)
    }
    console.log(response.data);
  } catch (error) {
    console.error("Error deleting degree:", error);
  }
};


const deleteStream = async (streamName) => {
  try {
    const response = await axios.delete(
      "http://localhost:8000/api/admin/delete-stream",
      {
        headers: {
          "Content-Type": "application/json",
        },
        data: { stream: streamName }, // ✅ body
      }
    );

    console.log("Response:", response.data);

    if (response.data.status) { // ✅ use response.data.status, not response.status
      toast.success(response.data.message);
      setViewStreams(viewStreams.filter((s) => s.stream !== streamName));
      setViewdegrees(viewdegrees.filter((d) => d.stream !== streamName));
    } else {
      toast.error(response.data.message || "Something went wrong!");
    }
  } catch (error) {
    console.error("Error deleting stream:", error);
  }
};

  const handleKeyPress = (e, action) => {
    if (e.key === "Enter") {
      action();
    }
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-6 space-y-8">
            {/* Streams Section */}
            <div className="border border-gray-200 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <BookOpen className="w-6 h-6 text-[#7d0a0a]" />
                <h2 className="text-xl font-semibold text-gray-800">Add Stream</h2>
              </div>
              <div className="flex gap-4 items-end">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Stream Name</label>
                  <input
                    type="text"
                    value={streamInput}
                    onChange={(e) => setStreamInput(e.target.value)}
                    onKeyPress={(e) => handleKeyPress(e, addStream)}
                    placeholder="Enter stream name (e.g., Engineering, Arts, Commerce)"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7d0a0a] focus:border-transparent outline-none transition-all"
                  />
                </div>
                <button
                  onClick={addStream}
                  disabled={!streamInput.trim()}
                  className="bg-[#7d0a0a] text-white px-6 py-2 rounded-lg hover:bg-red-800 transition-colors flex items-center gap-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  <Plus className="w-4 h-4" />
                  Add
                </button>
                <button
                  onClick={() => setShowView(!showView)}
                  className="bg-white border-2 border-[#7d0a0a] text-[#7d0a0a] px-6 py-2 rounded-lg hover:bg-red-50 transition-colors flex items-center gap-2"
                >
                  <Eye className="w-4 h-4" />
                  {showView ? "Hide" : "View"}
                </button>
              </div>
              {viewStreams.length > 0 && (
                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-2">Available Streams:</p>
                  <div className="flex flex-wrap gap-2">
                    {viewStreams.map((stream, index) => (
                      <span
                        key={index}
                        className="flex justify-between gap-4 items-center text-[#7d0a0a] px-3 py-2 border border-gray-300 rounded-lg text-md"
                      >
                        {stream.stream}
                        <Trash2
                          className="w-5 cursor-pointer"
                          onClick={() => deleteStream(stream.stream)}
                        />
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Degrees Section */}
            <div className="border border-gray-200 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <GraduationCap className="w-6 h-6 text-[#7d0a0a]" />
                <h2 className="text-xl font-semibold text-gray-800">Add Degree</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Select Stream</label>
                  <select
                    value={selectedStream}
                    onChange={(e) => setSelectedStream(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7d0a0a] focus:border-transparent outline-none transition-all"
                  >
                    <option value="">Choose a stream</option>
                    {viewStreams.map((stream, index) => (
                      <option key={index} value={stream.stream}>
                        {stream.stream}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Degree Name</label>
                  <input
                    type="text"
                    value={degreeInput}
                    onChange={(e) => setDegreeInput(e.target.value)}
                    onKeyPress={(e) => handleKeyPress(e, addDegree)}
                    placeholder="Enter degree name (e.g., B.Tech, BA, B.Com)"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7d0a0a] focus:border-transparent outline-none transition-all"
                  />
                </div>
              </div>
              <div className="flex gap-4">
                <button
                  onClick={addDegree}
                  disabled={!selectedStream || !degreeInput.trim()}
                  className="bg-[#7d0a0a] text-white px-6 py-2 rounded-lg hover:bg-red-800 transition-colors flex items-center gap-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  <Plus className="w-4 h-4" />
                  Add
                </button>
                <button
                  onClick={() => setShowView(!showView)}
                  className="bg-white border-2 border-[#7d0a0a] text-[#7d0a0a] px-6 py-2 rounded-lg hover:bg-red-50 transition-colors flex items-center gap-2"
                >
                  <Eye className="w-4 h-4" />
                  {showView ? "Hide" : "View"}
                </button>
              </div>
            </div>

            {/* View Degrees Table */}
            {showView && (
              <div className="border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Streams and Degrees Table</h3>
                {isLoading ? (
                  <div className="text-center py-8">Loading...</div>
                ) : viewdegrees.length === 0 ? (
                  <div className="text-center py-8">
                    <GraduationCap className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500 italic">No degrees available</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse bg-white">
                      <thead>
                        <tr className="bg-[#7d0a0a]">
                          <th className="border border-gray-300 px-4 py-3 text-left text-white font-semibold">S.No</th>
                          <th className="border border-gray-300 px-4 py-3 text-left text-white font-semibold">Degree Name</th>
                          <th className="border border-gray-300 px-4 py-3 text-left text-white font-semibold">Stream</th>
                          <th className="border border-gray-300 px-4 py-3 text-left text-white font-semibold">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {viewdegrees.map((degree, index) => (
                          <tr key={index} className="hover:bg-gray-50 transition-colors">
                            <td className="border border-gray-300 px-4 py-3 text-gray-800">{index + 1}</td>
                            <td className="border border-gray-300 px-4 py-3">
                              <span className="font-medium text-gray-800">{degree.degree}</span>
                            </td>
                            <td className="border border-gray-300 px-4 py-3">
                              <span className="bg-[#7d0a0a] text-white px-3 py-1 rounded-full text-sm">{degree.stream}</span>
                            </td>
                            <td className="border border-gray-300 px-4 py-3">
                              <Trash2
                                className="w-5 cursor-pointer"
                                onClick={() => deleteDegree(degree.degree,degree.stream)}
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
                {viewdegrees.length > 0 && (
                  <div className="mt-4 text-sm text-gray-600">
                    Total Degrees: <span className="font-semibold text-[#7d0a0a]">{viewdegrees.length}</span>
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

export default EducationSetting;