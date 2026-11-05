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
    setFormData((prev) => {
      const updated = { ...prev, [field]: value };
      // If gender changes, ensure age respects new minimums
      if (field === "gender") {
        const ageNum = parseInt(updated.age, 10);
        const min = value === "Bride" ? 18 : value === "Groom" ? 21 : 18;
        if (!isNaN(ageNum) && ageNum < min) {
          updated.age = ""; // force user to re-enter valid age
        }
      }
      return updated;
    });
  };

  const handleAgeChange = (raw) => {
  const digits = (raw || "").toString().replace(/\D/g, "").slice(0, 2);
  setFormData((prev) => ({ ...prev, age: digits }));
};
const handleAgeBlur = () => {
  if (!formData.age) return;
  const min = formData.gender === "Bride" ? 18 : formData.gender === "Groom" ? 21 : 18;
  let ageNum = parseInt(formData.age, 10);
  if (isNaN(ageNum)) { setFormData((prev) => ({ ...prev, age: "" })); return; }
  if (ageNum < min) ageNum = min;
  if (ageNum > 99) ageNum = 99;
  setFormData((prev) => ({ ...prev, age: String(ageNum) }));
};

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    const payload={
     gender: formData.gender,
        caste: formData.caste,
        income: parseInt(formData.income, 10),
        age: parseInt(formData.age, 10),
        height: parseInt(formData.height, 10),
        Occupation: formData.Occupation,
        education: partnerEducation, 
    }
    console.log(payload)
    e.preventDefault();
    // const isEmpty = Object.values(formData).some((v) => v === "");
    // console.log(isEmpty)
    // if (isEmpty) {
    //   toast.warn("All fields are mandatory!");
    //   return;
    // }

    setLoading(true);
    try {
      const res = await axios.post("https://api.manomilan.com/api/user/quick-search", {
        gender: formData.gender,
        caste: formData.caste,
        income: parseInt(formData.income, 10),
        age: parseInt(formData.age, 10),
        height: parseInt(formData.height, 10),
        Occupation: formData.Occupation,
        education: partnerEducation,
      });

      if (res.data?.status) {
        const mapped = (res.data.result || []).map((c) => ({
          id: c._id,
          name:
            c.name ||
            [c.firstName, c.midname, c.lastName].filter(Boolean).join(" ") ||
            "Unknown",
          age:
            c.age ||
            (c.dob ? new Date().getFullYear() - new Date(c.dob).getFullYear() : "N/A"),
          religion: c.caste?.religion || c.caste?.caste || "",
          image: c.profilePic
            ? `https://api.manomilan.com/upload/${c.profilePic}`
            : "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face",
          occupation: c.occupation || "Not listed",
          city: c.city || c.nativeCity?.city || "",
          state: c.state || c.nativeCity?.state || "",
          monthlyIncome:
            typeof c.monthlyIncome === "number"
              ? c.monthlyIncome
              : c.monthlyIncome
              ? parseInt(c.monthlyIncome, 10)
              : null,
          education: Array.isArray(c.education)
            ? c.education
                .map((edu) => (typeof edu === "string" ? edu : edu?.degree))
                .filter(Boolean)
                .join(", ")
            : c.education || "",
          caste:
            c.caste && typeof c.caste === "object"
              ? [c.caste.subCaste, c.caste.caste, c.caste.religion]
                  .filter(Boolean)
                  .join(", ")
              : typeof c.caste === "string"
              ? c.caste
              : "",
        }));

        setFilteredCandidates(mapped);
        if (mapped.length === 0) {
          toast.info("No matches found. Try different filters.");
        }
      } else {
        toast.error(res.data?.message || "Search failed.");
      }
    } catch (error) {
      console.error("Quick search error:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
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
    // { name: "ANY", degrees: [] },
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
          const degreesInCategory = partnerEducationCategories
            .find((cat) => cat.name === categoryName)?.degrees || [];
          const filtered = prev.filter(
            (edu) => !degreesInCategory.includes(edu.degree)
          );
          return [...filtered, { degree, category: categoryName }];
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

  <input
  type="number"
  value={formData.age}
  onChange={(e) => handleAgeChange(e.target.value)}
  onBlur={handleAgeBlur}
  max={99}
  className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-red-500 focus:outline-none"
  placeholder={
    formData.gender === "Bride"
      ? "Enter age (18-99)"
      : formData.gender === "Groom"
      ? "Enter age (21-99)"
      : "Enter age (18-99)"
  }
/>

  {/* Validation Message */}
  {formData.age && (
    Number(formData.age) <
      (formData.gender === "Bride" ? 18 : 21) && (
      <p className="text-red-500 text-sm mt-1">
        Minimum age for{" "}
        {formData.gender === "Bride" ? "Bride" : "Groom"} is{" "}
        {formData.gender === "Bride" ? 18 : 21}
      </p>
    )
  )}
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
                      {heightOptions.map((h) => (
                        <option key={h.value} value={h.value}>
                          {h.label}
                        </option>
                      ))}
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
            <div className="max-w-6xl mx-auto p-6">
                  <div className="bg-white border border-red-200 rounded-lg overflow-hidden mb-4">
                    <div className="overflow-x-auto">
                      <table className="min-w-full">
                        <thead className="bg-red-50">
                          <tr>
                            <th className="px-4 py-3 text-left text-sm font-medium text-red-800 border-r border-red-200">
                              Category
                            </th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-red-800">
                              Education
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-red-200">
                          {partnerEducationCategories.map((category) => (
                            <tr
                              key={category.name}
                              className={`hover:bg-red-25 ${
                                category.name === "ANY" && isAnySelected
                                  ? "bg-white border-l-4 border-purple-400"
                                  : ""
                              }`}
                            >
                              <td
                                className={`px-4 py-3 font-bold border-r border-red-200 align-top ${
                                  category.name === "ANY" && isAnySelected
                                    ? "text-red-700 bg-white border-2 border-red-500"
                                    : category.name === "ANY"
                                      ? "text-red-700 border border-red-200 bg-gray-50"
                                      : "text-red-700 bg-red-25"
                                }`}
                              >
                                {category.name === "ANY" ? " " : category.name}
                              </td>
                              <td className="px-4 py-3 align-top">
                                <div className="flex flex-wrap gap-2">
                                   {
                                    category.degrees.map((degree) => {
                                      const isSelected = partnerEducation.some(
                                        (edu) => edu.degree === degree,
                                      );
                                      return (
                                        <button
                                          key={degree}
                                          type="button"
                                          onClick={() =>
                                            partnerDegreeToggle(
                                              degree,
                                              category.name,
                                            )
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
                                    }
                                  )}
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
              disabled={loading}
              className="bg-red-900 text-white px-8 py-3 rounded-full font-semibold text-lg hover:bg-red-800 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? "Searching..." : "Search"}
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
                  <div className="flex items-center text-gray-600">
                    <Briefcase className="w-3 h-3 text-red-600 mr-2" />
                    <span>{candidate.occupation}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <MapPin className="w-3 h-3 text-red-600 mr-2" />
                    <span>
                      {candidate.city || candidate.state
                        ? `${candidate.city || ""}${
                            candidate.city && candidate.state ? ", " : ""
                          }${candidate.state || ""}`
                        : "Location not listed"}
                    </span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <GraduationCap className="w-3 h-3 text-red-600 mr-2" />
                    <span>
                      {candidate.education || "Education not listed"}
                    </span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <span className="font-semibold">Income:</span>
                    <span className="ml-1">
                      {candidate.monthlyIncome
                        ? `₹ ${candidate.monthlyIncome.toLocaleString()}`
                        : "Not listed"}
                    </span>
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
