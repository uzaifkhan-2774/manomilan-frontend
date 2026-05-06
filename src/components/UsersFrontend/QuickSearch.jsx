import React, { useEffect, useState } from "react";
import {
  Heart,
  MapPin,
  Briefcase,
  GraduationCap,
  Calendar,
  Filter,
} from "lucide-react";
import ManomilanLogo from "../../assets/ManomilanLogo.png";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const QuickSearchCards = () => {
  const navigate = useNavigate();

  // 🔸 New mandatory fields state
  const [formData, setFormData] = useState({
    gender: "",
    caste: "",
    education: "",
    Occupation: "",
    income: "",
    age: "",
    height: "",
  });

  const [filters, setFilters] = useState({
    ageFrom: "",
    ageTo: "",
    religion: "",
    heightFrom: "",
    heightTo: "",
  });

  const [caste, setCaste] = useState([]);

  const [candidates] = useState([
    {
      id: 1,
      name: "Priyansh Sharma",
      age: 26,
      profession: "Software Engineer",
      location: "Mumbai, Maharashtra",
      education: "B.Tech Computer Science",
      religion: "Hindu",
      image:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face",
    },
    {
      id: 2,
      name: "Rahul Patel",
      age: 29,
      profession: "Doctor",
      location: "Ahmedabad, Gujarat",
      education: "MBBS, MD",
      religion: "Hindu",
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face",
    },
  ]);

  const [filteredCandidates, setFilteredCandidates] = useState(
    candidates.slice(0, 2)
  );

  const handleFilterChange = (filterType, value) => {
    const newFilters = { ...filters, [filterType]: value };
    setFilters(newFilters);

    let filtered = candidates;

    // Age range support
    if (newFilters.ageFrom || newFilters.ageTo) {
      filtered = filtered.filter((candidate) => {
        const age = candidate.age;
        if (newFilters.ageFrom && newFilters.ageTo) {
          return (
            age >= parseInt(newFilters.ageFrom) &&
            age <= parseInt(newFilters.ageTo)
          );
        }
        if (newFilters.ageFrom) return age >= parseInt(newFilters.ageFrom);
        if (newFilters.ageTo) return age <= parseInt(newFilters.ageTo);
        return true;
      });
    }

    // Height range support (if candidate has height in cm)
    if (newFilters.heightFrom || newFilters.heightTo) {
      filtered = filtered.filter((candidate) => {
        const h = candidate.height || 0;
        if (newFilters.heightFrom && newFilters.heightTo) {
          return (
            h >= parseInt(newFilters.heightFrom) &&
            h <= parseInt(newFilters.heightTo)
          );
        }
        if (newFilters.heightFrom) return h >= parseInt(newFilters.heightFrom);
        if (newFilters.heightTo) return h <= parseInt(newFilters.heightTo);
        return true;
      });
    }

    if (newFilters.religion) {
      filtered = filtered.filter(
        (candidate) =>
          candidate.religion.toLowerCase() === newFilters.religion.toLowerCase()
      );
    }

    setFilteredCandidates(filtered.slice(0, 2));
  };

  const findCaste = async () => {
    try {
      const res = await axios.get(
        "https://api.manomilan.com/api/user/get-all-subcaste"
      );
      console.log(res.data.result);
      setCaste(res?.data?.result);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    findCaste();
  }, []);

  const resetFilters = () => {
    setFilters({
      ageFrom: "",
      ageTo: "",
      religion: "",
      location: "",
      heightFrom: "",
      heightTo: "",
    });
    setFilteredCandidates(candidates.slice(0, 2));
  };

  // 🔸 Handle mandatory field changes
  const handleMandatoryChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const isEmpty = Object.values(formData).some((v) => v === "");
    if (isEmpty) {
      toast.warn("All fields are mandatory!");
      return;
    }
    navigate("/register-user");
  };

  // education table (partner-style with ANY option)
  const [streams, setStreams] = useState([]);
  const [degreesByStream, setDegreesByStream] = useState({});
  const [partnerEducation, setPartnerEducation] = useState([]);

  const educationCategories = streams.map((stream) => ({
    name: stream.stream,
    degrees: (degreesByStream[stream.stream] || []).map(
      (degree) => degree.degree
    ),
  }));

  const partnerEducationCategories = [
    { name: "ANY", degrees: [] },
    ...educationCategories,
  ];

  const partnerDegreeToggle = (degree, categoryName) => {
    if (categoryName === "ANY") {
      const allDegrees = partnerEducationCategories
        .filter((cat) => cat.name !== "ANY")
        .flatMap((cat) => cat.degrees)
        .filter((deg, index, self) => self.indexOf(deg) === index);

      const allSelected = allDegrees.every((deg) =>
        partnerEducation.some((edu) => edu.degree === deg)
      );

      if (allSelected) {
        setPartnerEducation([]);
      } else {
        setPartnerEducation(allDegrees.map((deg) => ({ degree: deg })));
      }
    } else {
      setPartnerEducation((prev) => {
        const exists = prev.some((edu) => edu.degree === degree);
        if (exists) {
          return prev.filter((edu) => edu.degree !== degree);
        } else {
          return [...prev, { degree }];
        }
      });
    }
  };

  const isAnySelected = partnerEducationCategories
    .filter((cat) => cat.name !== "ANY")
    .flatMap((cat) => cat.degrees)
    .filter((deg, index, self) => self.indexOf(deg) === index)
    .every((deg) => partnerEducation.some((edu) => edu.degree === deg));

  // Height generator (same as RegisterFresh)
  const generateHeightOptions = () => {
    const options = [];
    for (let feet = 4; feet <= 7; feet++) {
      for (let inches = 0; inches <= 11; inches++) {
        if (feet === 7 && inches > 6) break; // stop at 7'6"
        const cm = Math.round((feet * 12 + inches) * 2.54);
        options.push({ label: `${feet}'${inches}\"`, value: cm });
      }
    }
    return options;
  };

  const heightOptions = generateHeightOptions();

  const fetchStreams = async () => {
    try {
      const response = await axios.get(
        "https://api.manomilan.com/api/admin/get-streams"
      );
      if (response.data.status) {
        setStreams(response.data.data);
        // also fetch degrees for these streams
        await fetchDegreesForStreams(response.data.data);
      }
    } catch (err) {
      console.error("Failed to fetch streams:", err);
    }
  };

  const fetchDegreesForStreams = async (streamsArr) => {
    if (!Array.isArray(streamsArr)) return;
    const degreesData = {};
    for (const stream of streamsArr) {
      try {
        const response = await axios.get(
          "https://api.manomilan.com/api/admin/get-degrees-by-stream",
          { params: { stream: stream.stream } }
        );
        if (response.data.status) {
          degreesData[stream.stream] = response.data.data;
        }
      } catch (err) {
        console.error(`Failed to fetch degrees for ${stream.stream}:`, err);
      }
    }
    setDegreesByStream(degreesData);
  };

  useEffect(() => {
    fetchStreams();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-red-900 to-red-800 shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2 w-[14%] max-w-200">
              <img src={ManomilanLogo} alt="" />
            </div>
            <div className="flex space-x-4">
              <button
                className="bg-white cursor-pointer text-red-900 px-6 py-2 rounded-full font-semibold hover:bg-gray-100 transition-all duration-200 shadow-lg"
                onClick={() => navigate("/")}
              >
                Login
              </button>
              <button
                className="border-2 cursor-pointer border-white text-white px-6 py-2 rounded-full font-semibold hover:bg-white hover:text-red-900 transition-all duration-200"
                onClick={() => navigate("/register-user")}
              >
                Register
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* ✅ Original Filter Section (untouched) */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8 border border-red-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-red-900 flex items-center">
              <Filter className="mr-2" />
              Search Your Perfect Match
            </h2>
            <button
              onClick={resetFilters}
              className="text-red-600 hover:text-red-800 font-medium"
            >
              Clear Search
            </button>
          </div>
          {/* Age, Religion, Profession, Location Filters */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            {/* Age From */}
            <div>
              <label className="block text-sm font-medium text-red-700 mb-2">
                Age From
              </label>
              <select
                value={filters.ageFrom}
                onChange={(e) => handleFilterChange("ageFrom", e.target.value)}
                className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-red-500 focus:outline-none"
              >
                <option value="">From</option>
                {Array.from({ length: 43 }, (_, i) => 18 + i).map((age) => (
                  <option key={age} value={age}>
                    {age}
                  </option>
                ))}
              </select>
            </div>

            {/* Age To */}
            <div>
              <label className="block text-sm font-medium text-red-700 mb-2">
                Age To
              </label>
              <select
                value={filters.ageTo}
                onChange={(e) => handleFilterChange("ageTo", e.target.value)}
                className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-red-500 focus:outline-none"
              >
                <option value="">To</option>
                {Array.from({ length: 43 }, (_, i) => 18 + i).map((age) => (
                  <option
                    key={age}
                    value={age}
                    disabled={
                      filters.ageFrom && age <= parseInt(filters.ageFrom)
                    }
                  >
                    {age}
                  </option>
                ))}
              </select>
            </div>

            {/* Height From */}
            <div>
              <label className="block text-sm font-medium text-red-700 mb-2">
                Height From
              </label>
              <select
                value={filters.heightFrom}
                onChange={(e) =>
                  handleFilterChange("heightFrom", e.target.value)
                }
                className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-red-500 focus:outline-none"
              >
                <option value="">From</option>
                {heightOptions.map((h) => (
                  <option key={h.value} value={h.value}>
                    {h.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Height To */}
            <div>
              <label className="block text-sm font-medium text-red-700 mb-2">
                Height To
              </label>
              <select
                value={filters.heightTo}
                onChange={(e) => handleFilterChange("heightTo", e.target.value)}
                className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-red-500 focus:outline-none"
              >
                <option value="">To</option>
                {heightOptions.map((h) => (
                  <option
                    key={h.value}
                    value={h.value}
                    disabled={
                      filters.heightFrom &&
                      parseInt(h.value) < parseInt(filters.heightFrom)
                    }
                  >
                    {h.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-end">
              <button
                onClick={resetFilters}
                className="text-red-600 hover:text-red-800 font-medium"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>
        {/* ✅ Mandatory Fields Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-xl p-6 mb-8 border border-red-100"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {/* Bride / Groom */}
            <div>
              <label className="block text-red-900 font-semibold mb-2">
                Looking For
              </label>
              <div className="flex space-x-4">
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="gender"
                    value="Bride"
                    className="accent-red-900"
                    checked={formData.gender === "Bride"}
                    onChange={(e) =>
                      handleMandatoryChange("gender", e.target.value)
                    }
                  />
                  <span>Bride</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="gender"
                    value="Groom"
                    className="accent-red-900"
                    checked={formData.gender === "Groom"}
                    onChange={(e) =>
                      handleMandatoryChange("gender", e.target.value)
                    }
                  />
                  <span>Groom</span>
                </label>
              </div>
            </div>

            {/* Caste */}
            <div>
              <label className="block text-red-900 font-semibold mb-2">
                Community
              </label>
              <select
                value={formData.caste}
                onChange={(e) => handleMandatoryChange("caste", e.target.value)}
                className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-red-500 focus:outline-none"
              >
                <option value="">Select Caste</option>
                {caste.map((cas, idx) => (
                  <option key={idx}>
                    {cas.subCaste}, {cas.casteReligion.caste},{" "}
                    {cas.casteReligion.religion},
                  </option>
                ))}
              </select>
            </div>

            {/* Education */}
            {/* <div>
              <label className="block text-red-900 font-semibold mb-2">
                Education
              </label>
              <select
                value={formData.education}
                onChange={(e) =>
                  handleMandatoryChange("education", e.target.value)
                }
                className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-red-500 focus:outline-none"
              >
                <option value="">Select Education</option>
                <option value="Bachelors">Bachelor's</option>
                <option value="Masters">Master's</option>
                <option value="PhD">Ph.D</option>
                <option value="Other">Other</option>
              </select>
            </div> */}

            {/* Income */}
            <div>
              <label className="block text-red-900 font-semibold mb-2">
                Income
              </label>
              <select
                value={formData.income}
                onChange={(e) =>
                  handleMandatoryChange("income", e.target.value)
                }
                className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-red-500 focus:outline-none"
              >
                <option value="">Select Income</option>
                <option value="10000">Above ₹10,000</option>
                <option value="20000">Above ₹20,000</option>
                <option value="30000">Above ₹30,000</option>
                <option value="40000">Above ₹40,000</option>
                <option value="50000">Above ₹50,000</option>
                <option value="70000">Above ₹70,000</option>
                <option value="80000">Above ₹80,000</option>
                <option value="100000">Above ₹1,00,000</option>
                <option value="150000">Above ₹1,50,000</option>
                <option value="200000">Above ₹2,00,000</option>
                <option value="300000">Above ₹3,00,000</option>
                <option value="400000">Above ₹4,00,000</option>
                <option value="500000">Above ₹5,00,000</option>
              </select>
            </div>

            {/* Age */}
            <div>
              <label className="block text-red-900 font-semibold mb-2">
                Age
              </label>
              <select
                value={formData.age}
                onChange={(e) => handleMandatoryChange("age", e.target.value)}
                className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-red-500 focus:outline-none"
              >
                <option value="">Select Age</option>
                <option value="18">18</option>
                <option value="19">19</option>
                <option value="20">20</option>
                <option value="21">21</option>
              </select>
            </div>

            {/* Height */}
            <div>
              <label className="block text-red-900 font-semibold mb-2">
                Height
              </label>
              <select
                value={formData.height}
                onChange={(e) =>
                  handleMandatoryChange("height", e.target.value)
                }
                className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-red-500 focus:outline-none"
              >
                <option value="">Select Height</option>
                <option value="5'0 - 5'5">5'0 - 5'5"</option>
                <option value="5'6 - 5'10">5'6 - 5'10"</option>
                <option value="5'11 - 6'2">5'11 - 6'2"</option>
                <option value="6'3+">6'3+"</option>
              </select>
            </div>

            {/* Occupation */}
            <div>
              <label className="block text-red-900 font-semibold mb-2">
                Occupation
              </label>
              <select
                value={formData.Occupation}
                onChange={(e) =>
                  handleMandatoryChange("Occupation", e.target.value)
                }
                className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-red-500 focus:outline-none"
              >
                <option value="">Select Occupation</option>
                <option value="Private Service">Private Service</option>
                <option value="Goverment Service">Goverment Service</option>
                <option value="Service + Business / Practice">
                  Service + Business / Practice
                </option>
                <option value="Student / Internship">
                  Student / Internship
                </option>
                <option value="Business">Business</option>
                <option value="Not Working">Not Working</option>
              </select>
            </div>

          </div>
            <div className="w-full  mx-auto p-6">
              <div className="bg-white border border-red-200 rounded-lg overflow-hidden mb-4">
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead className="bg-red-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-medium text-red-800 border-r border-red-200">
                          Category
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-red-800">
                          Degrees
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-red-200">
                      {partnerEducationCategories.map((category) => (
                        <tr
                          key={category.name}
                          className={`hover:bg-red-25 ${
                            category.name === "ANY" && isAnySelected
                              ? "bg-white border-l-4 border-purple-400 cursor-pointer"
                              : ""
                          }`}
                        >
                          <td
                            className={`px-4 py-3 font-bold border-r border-red-200 align-top ${
                              category.name === "ANY" && isAnySelected
                                ? "text-red-700 bg-white border-2 border-red-500"
                                : category.name === "ANY"
                                ? "text-red-700 bg-white border border-red-200 hover:bg-red-50 cursor-pointer"
                                : "text-red-700 bg-red-25"
                            }`}
                            onClick={() =>
                              partnerDegreeToggle(null, category.name)
                            }
                          >
                            {category.name === "ANY" && isAnySelected && (
                              <span className="mr-2">🌟</span>
                            )}
                            {category.name}
                          </td>
                          <td className="px-4 py-3 align-top">
                            <div className="flex flex-wrap gap-2">
                              {category.degrees.map((degree) => {
                                const isSelected = partnerEducation.some(
                                  (edu) => edu.degree === degree
                                );
                                return (
                                  <button
                                    key={degree}
                                    type="button"
                                    onClick={() =>
                                      partnerDegreeToggle(degree, category.name)
                                    }
                                    className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors ${
                                      isSelected
                                        ? "bg-red-600 text-white hover:bg-red-700"
                                        : "bg-gray-100 text-gray-700 hover:bg-red-100 hover:text-red-700 border border-gray-300"
                                    }`}
                                  >
                                    {degree}
                                    {isSelected && (
                                      <span className="ml-1">✓</span>
                                    )}
                                  </button>
                                );
                              })}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

          <div className="text-center mt-6">
            <button
              type="submit"
              className="bg-red-900 text-white px-8 py-3 rounded-full font-semibold text-lg hover:bg-red-800 transition-all"
            >
              Search
            </button>
          </div>
        </form>

        {/* ✅ Profile Cards Section */}
        <div className="mb-6">
          <h3 className="text-xl font-bold text-red-900 mb-4">
            Showing {filteredCandidates.length} matches
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredCandidates.map((candidate) => (
            <div
              key={candidate.id}
              className="bg-white rounded-xl shadow-lg overflow-hidden border border-red-100 hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 max-w-sm"
            >
              <div className="relative">
                <img
                  src={candidate.image}
                  alt={candidate.name}
                  className="w-full h-50 object-cover"
                />
                <div className="absolute top-2 right-2">
                  <div className="bg-red-900 text-white px-2 py-1 rounded-full text-xs font-semibold">
                    {candidate.religion}
                  </div>
                </div>
              </div>

              <div className="p-4">
                <h3 className="text-lg font-bold text-red-900 mb-2">
                  {candidate.name}
                </h3>

                <div className="space-y-1 text-sm">
                  <div className="flex items-center text-gray-600">
                    <Calendar className="w-3 h-3 text-red-600 mr-2" />
                    <span>{candidate.age} years</span>
                  </div>
                  
                  
                </div>

                <div className="flex space-x-2 mt-4">
                  <button className="flex-1 bg-red-900 text-white py-2 px-3 rounded-lg text-sm font-semibold hover:bg-red-800">
                    View
                  </button>
                  <button className="flex-1 border border-red-900 text-red-900 py-2 px-3 rounded-lg text-sm font-semibold hover:bg-red-900 hover:text-white">
                    Interest
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredCandidates.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500 text-xl mb-4">No matches found</div>
            <div className="text-gray-400">
              Try adjusting your filters to see more results
            </div>
          </div>
        )}

        <div className="w-full my-6 flex flex-col gap-3">
          <p className="font-bold text-lg text-center">For More Matches</p>
          <div className="w-full max-w-md mx-auto mb-4">
            <button
              onClick={() => navigate("/register-user")}
              className="w-full bg-red-900 font-bold text-white py-2 rounded transition-colors duration-200"
            >
              Register FREE (Create New Profile)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickSearchCards;
