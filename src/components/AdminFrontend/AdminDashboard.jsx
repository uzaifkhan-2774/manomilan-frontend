import React, { useEffect, useState, useRef } from "react";
import {
  Home,
  Package,
  User,
  Settings,
  Lock,
  Mail,
  MessageSquare,
  Inbox,
  Send,
  Edit3,
  Users2,
  Eye,
  File,
  Video,
  Coins,
  PlayCircle,
  Heart,
  Settings2,
  Menu,
  X,
  ChevronDown,
  ChevronRight,
  EyeClosed,
  Rows,
  EyeOff,
  Shield,
  AlertCircle,
  CheckCircle,
  LogOut,
  Pen,
} from "lucide-react";
import axios from "axios";
import DistributorRegistrationForm from "../DistributorFrontend/DistributorRegister";
import TableGenerator from "../CommonComponents/TabelGenerator";
import MemberTable from "../CommonComponents/MemberTable";
import ReportsMemberTable from "./ReportsMemberTable";
import { toast } from "react-toastify";
import * as XLSX from "xlsx";
import CountrySettings from "./CountrySetting";
import ReligionSetting from "./ReligionSetting";
import EducationSetting from "./EducationSetting";
import OtherSettings from "./OtherSettings";
import { saveAs } from "file-saver";
import FranchiseeTable from "./FranchiseeTable";
import AdminRegister from "./AdminRegister";
import EditMemberTable from "./EditMemberTable";

const MatrimonialForm = () => {
  const token = localStorage.getItem("adminToken");
  const [reportsData, setReportsData] = useState([]);
  const [formData, setFormData] = useState({
    memberId: "",
    memberName: "",
    nativeCountry: "",
    nativeState: "",
    nativeCity: "",
    workingCountry: "",
    workingState: "",
    workingCity: "",
    religion: "",
    caste: "",
    subCaste: "",
    motherTongue: "",
    education: "",
    occupation: "",
    monthlyInc: "",
    maritalSts: "",
    nationality: "",
    distributor: "",
    franchise: "",
    packageType: "",
    status: "",
    gender: "",
    phyAbnormality: "",
  });
  const occupations = [
    "Government Service",
    "Private Service",
    "Service + Business / Practice",
    "Business",
    "Student / Internship",
    "Not Working",
  ];
  const [selectedColumns, setSelectedColumns] = useState({});
  const maritalStsOptions = [
    { value: "Unmarried", label: "Unmarried" },
    { value: "divorced", label: "Divorced" },
    { value: "widowed", label: "Widowed" },
    {
      value: "divorce_in_process",
      label: "Divorce in Process",
    },
  ];
  const checkboxes = [
    {
      label: "User Information",
      boxes: ["Email", "Mobile Number"],
      name: "userInformation",
    },
    {
      label: "Candidates General Information",
      boxes: [
        "First Name",
        "Middle Name",
        "Last Name",
        "Gender",
        "Date Of Birth",
        "Marital Status",
        "Nationality",
      ],
      name: "generalInfo",
    },
    {
      label: "Native Location",
      boxes: ["District,State,Country"],
      name: "nativeInfo",
    },
    {
      label: "Working Location",
      boxes: ["City,State,Country"],
      name: "workingInfo",
    },
    {
      label: "Community Information",
      boxes: ["Subcaste,Caste,Religion", "Mother Tongue"],
      name: "communityInfo",
    },
    {
      label: "Career",
      boxes: ["Education / Degree", "Monthly Income"],
      name: "career",
    },
    {
      label: "Health",
      boxes: [
        "Blood Group",
        "Height",
        "Body Type",
        "Complexion",
        "Physical Abnormality",
      ],
      name: "health",
    },
    {
      label: "Parents Address",
      boxes: [
        "Address Line",
        "City,State,Country",
        "WhatsApp Number",
        "Alternate Number",
        "Parents Contact Number"
      ],
      name: "parentsAddress",
    },
    {
      label: "Relatives Information",
      boxes: ["Mamkul"],
      name: "relativesInfo",
    },
    {
      label: "Family Members",
      boxes: ["No. of Brothers", "No. of Sisters"],
      name: "familyMem",
    },
    {
      label: "Other",
      boxes: [
        "Distributor",
        "Franchisee",
        "Status",
        "Member Id",
        "Package Name",
      ],
      name: "other",
    },
  ];

  // compose msg ddm closer
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isFranchiseDropdownOpen, setIsFranchiseDropdownOpen] = useState(false);
  const [isDistDropdownOpen, setIsDistDropdownOpen] = useState(false);

  const memberDropdownRef = useRef(null);
  const franchiseDropdownRef = useRef(null);
  const distDropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        memberDropdownRef.current &&
        !memberDropdownRef.current.contains(event.target)
      ) {
        setIsDropdownOpen(false);
      }
      if (
        franchiseDropdownRef.current &&
        !franchiseDropdownRef.current.contains(event.target)
      ) {
        setIsFranchiseDropdownOpen(false);
      }
      if (
        distDropdownRef.current &&
        !distDropdownRef.current.contains(event.target)
      ) {
        setIsDistDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleChange = (prop, value) => {
    setFormData((prev) => ({
      ...prev,
      [prop]: value,
    }));
  };

  const handleCheck = (sectionName, value, checked) => {
    setSelectedColumns((prev) => {
      const existing = prev[sectionName] || [];
      let updated = checked
        ? [...existing, value]
        : existing.filter((v) => v !== value);
      return {
        ...prev,
        [sectionName]: updated,
      };
    });
  };

  const handleClick = async () => {
    try {
      const filters = {
        nativeCountry: formData.nativeCountry || "",
        nativeState: formData.nativeState || "",
        nativeCity: formData.nativeCity || "",
        workCountry: formData.workingCountry || "",
        workState: formData.workingState || "",
        workCity: formData.workingCity || "",
        religion: formData.religion || "",
        caste: formData.caste || "",
        subCaste: formData.subCaste || "",
        motherTongue: formData.motherTongue || "",
        education: formData.education ? [formData.education] : [],
        occupation: formData.occupation || formData.occuptaion || "",
        monthlyIncome: formData.monthlyInc
          ? parseInt(formData.monthlyInc)
          : undefined,
        maritalStatus: formData.maritalSts || "",
        divyang: formData.phyAbnormality || "",
        distributor: formData.distributor || "",
        franchise: formData.franchise || "",
      };

      Object.keys(filters).forEach((key) => {
        if (
          !filters[key] ||
          (Array.isArray(filters[key]) && filters[key].length === 0)
        ) {
          delete filters[key];
        }
      });

      const fields = Object.values(selectedColumns).flat();
      const payload = { filters, fields };

      const response = await axios.post(
        "http://localhost:8000/api/admin/get-reports",
        payload,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log(payload, "payload");
      console.log(response.data);

      const rawData = response.data?.data || [];
      const flatData = flattenData(rawData);

      setReportsData(rawData); // Original nested data
      setExportData(flatData); // Flattened data for export
    } catch (error) {
      console.error("API Error:", error);
    }
  };

  const flattenData = (data) => {
    return data.map((item) => {
      const flatItem = { ...item };

      // Flatten caste
      if (item.caste) {
        flatItem.caste_religion = item.caste.religion || "";
        flatItem.caste_caste = item.caste.caste || "";
        flatItem.caste_subCaste = item.caste.subCaste || "";
      }

      // Flatten nativeCity
      if (item.nativeCity) {
        flatItem.nativeCountry = item.nativeCity.country || "";
        flatItem.nativeState = item.nativeCity.state || "";
        flatItem.nativeCityName = item.nativeCity.city || "";
      }

      // Flatten expectedReligion (array of objects)
      if (Array.isArray(item.expectedReligion)) {
        flatItem.expectedReligion = item.expectedReligion
          .map(
            (r) =>
              `${r.religion || ""} - ${r.caste || ""} - ${r.subCaste || ""}`
          )
          .join(", ");
      }

      // Flatten expectedNativeLocation
      if (Array.isArray(item.expectedNativeLocation)) {
        flatItem.expectedNativeLocation = item.expectedNativeLocation
          .map((loc) => `${loc.city}, ${loc.state}, ${loc.country}`)
          .join("; ");
      }

      // Flatten expectedWorkingLocation
      if (Array.isArray(item.expectedWorkingLocation)) {
        flatItem.expectedWorkingLocation = item.expectedWorkingLocation
          .map((loc) => `${loc.city}, ${loc.state}, ${loc.country}`)
          .join("; ");
      }

      // Flatten nationality and education
      flatItem.nationality = (item.nationality || []).join(", ");
      flatItem.education = (item.education || []).join(", ");

      return flatItem;
    });
  };

  const handleExport = () => {
    const data = exportData || [];
    console.log(data)
    if (!Array.isArray(data) || data.length === 0) {
      alert("No data to export.");
      return;
    }

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "ExportedData");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    saveAs(blob, "user_filtered_report.xlsx");
  };

  // api calls to get the data of countries, religions etc
  // Fetch functions
  const [streams, setStreams] = useState([]);
  const [degreesByStream, setDegreesByStream] = useState({});
  const [selectedEducation, setSelectedEducation] = useState([]);

  const educationCategories = streams.map((stream) => ({
    name: stream.stream,
    degrees: (degreesByStream[stream.stream] || []).map(
      (degree) => degree.degree
    ),
  }));

  const handleDegreeToggle = (degree, category) => {
    const isSelected = selectedEducation.some((edu) => edu.degree === degree);

    let updated;
    if (isSelected) {
      updated = selectedEducation.filter((edu) => edu.degree !== degree);
    } else {
      if (selectedEducation.length >= 5) return;
      updated = [...selectedEducation, { degree, category }];
    }

    // update both local state and react-hook-form
    setSelectedEducation(updated);
    setValue("education", updated); // THIS ensures formData.education is NOT empty
  };
  const fetchStreams = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/api/admin/get-streams"
      );
      if (response.data.status) {
        setStreams(response.data.data);
      }
    } catch (err) {
      console.error("Failed to fetch streams:", err);
    }
  };

  const fetchDegreesForStreams = async (streams) => {
    if (!Array.isArray(streams)) {
      console.error("Expected 'streams' to be an array but got:", streams);
      return;
    }

    const degreesData = {};

    for (const stream of streams) {
      try {
        const response = await axios.get(
          "http://localhost:8000/api/admin/get-degrees-by-stream",
          {
            params: { stream: stream.stream }, // assuming stream is like { stream: 'Engineering' }
          }
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
    const fetchData = async () => {
      await fetchStreams(); // Sets streams state
    };
    fetchData();
  }, []);
  useEffect(() => {
    if (Array.isArray(streams) && streams.length > 0) {
      fetchDegreesForStreams(streams);
    }
  }, [streams]);

  const [countriesView, setCountriesView] = useState([]); //getting the countries
  const [statesView, setstatesView] = useState([]); //getting the states
  const [cityView, setCityView] = useState([]); //getting the cities
  const [religionView, setReligionView] = useState([]);
  const [casteView, setCasteView] = useState([]);
  const [subcasteView, setSubcasteView] = useState([]);
  const [viewdegrees, setViewdegrees] = useState([]);
  const [franchises, setFranchises] = useState([]);
  const [distributor, setDistributor] = useState([]);
  const [motherTongue, setMotherTongue] = useState([]);
  const [exportData, setExportData] = useState([]);
  const [sect, setSect] = useState([]);
  const [manglik, setManglik] = useState([]);
  const [foodPref, setFoodPref] = useState([]);
  const [complexion, setComplexions] = useState([]);
  const [bodyType, setBodyType] = useState([]);
  const [familyBg, setFamilyBg] = useState([]);
  const [positions, setPositions] = useState([]);
  const viewCountries = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/api/admin/get-country"
      );
      setCountriesView(response.data.result || []);
    } catch (error) {
      console.error("Error fetching countries:", error);
    }
  };

  const viewStates = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/api/admin/get-all-states"
      );
      setstatesView(response.data.allStates || []);
    } catch (error) {
      console.error("Error fetching states:", error);
    }
  };

  const viewCity = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/api/admin/get-all-cities"
      );
      setCityView(response.data.allLocations || []);
    } catch (error) {
      console.error("Error fetching cities:", error);
    }
  };

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
      setSubcasteView(response.data.result || []);
    } catch (error) {
      console.error("Error fetching subcastes:", error);
    }
  };

  // const DegreeView = async () => {
  //   try {
  //     const response = await axios.get(
  //       "http://localhost:8000/api/admin/get-all-degrees"
  //     );
  //     setViewdegrees(response.data.data);
  //     await DegreeView();
  //   } catch (error) {
  //     console.error("Error fetching degrees:", error);
  //   }
  // };

  const getFranchises = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/api/user/get-franchises",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data.status === true) {
        setFranchises(response.data.franchises);
        return;
      }
      setFranchises([]);
    } catch (error) {
      console.log("something went wrong", error);
    }
  };
  const fetchMotherTongue = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/api/admin/get-mother-tongue"
      );
      if (response.data.status === true) {
        setMotherTongue(response.data.result);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getDistributors = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/api/admin/get-distributors",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data.status === true) {
        setDistributor(response.data.result);
        return;
      }
      setDistributor([]);
    } catch (error) {
      console.log("something went wrong", error);
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
          type: "Manglik",
        }));
        setSect(fetched);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getManglik = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/api/user/get-manglik"
      );
      if (response.data.status === true) {
        const fetched = response.data.result.map((item) => ({
          id: Date.now(),
          name: item.manglik,
          type: "Manglik",
        }));
        setManglik(fetched);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const getFoodPref = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/api/user/food-choices"
      );
      if (response.data.status === false) {
        const fetched = response.data.result.map((item) => ({
          id: Date.now(),
          name: item.foodPreference,
          type: "foodPreference",
        }));
        setFoodPref(fetched);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const getComplexion = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/api/user/get-complexion"
      );
      if (response.data.status) {
        setComplexions(response.data?.result);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const getBodyType = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/api/user/get-bodytype"
      );
      if (response.data.status) {
        setBodyType(response.data?.result);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const getFamilyBg = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/api/user/get-familybg"
      );
      if (response.data.status) {
        setFamilyBg(response.data?.result);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const getPosition = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/api/user/get-position"
      );
      if (response.data.status) {
        setPositions(response.data?.result);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getFamilyBg();
    getPosition();
    viewCountries();
    viewStates();
    viewCity();
    viewCaste();
    viewReligion();
    viewSubcaste();
    // DegreeView();
    getManglik();
    getBodyType();
    getComplexion();
    getSect();
    getDistributors();
    getFranchises();
    fetchMotherTongue();
    getFoodPref();
    // setInterval(() => {
    //   viewCountries();
    //   viewStates();
    //   viewCity();
    //   viewCaste();
    //   viewReligion();
    //   viewSubcaste();
    //   // DegreeView();
    //   getDistributors();
    //   getFranchises();
    //   fetchMotherTongue();
    // }, 5000);
  }, []);

  return (
    <>
      <div className="w-full space-y-4">
        {/* Top Bar */}
        <div className="w-full flex gap-6 items-center border border-gray-500 rounded-md p-4">
          <p className="font-semibold">Search By : </p>
          <input
            type="text"
            className="border border-gray-500 px-2 py-1 rounded-md"
            placeholder="Enter Member Id"
            onChange={(e) => handleChange("memberId", e.target.value)}
          />
          <input
            type="text"
            className="border border-gray-500 px-2 py-1 rounded-md"
            placeholder="Enter Member Name"
            onChange={(e) => handleChange("memberName", e.target.value)}
          />
          <button
            className="border text-white font-semibold bg-[#7d0a0a] border-#7d0a0a p-1 rounded-md cursor-pointer"
            onClick={handleClick}
          >
            Search
          </button>
          <button
            className="border text-white font-semibold bg-[#7d0a0a] border-#7d0a0a p-1 rounded-md cursor-pointer"
            onClick={handleExport}
          >
            Export To Excel
          </button>
        </div>

        <div className="w-full flex justify-center">
          <div className="flex flex-col gap-2 w-1/2">
            <p className="font-semibold text-lg">Native Location</p>
            <div className="space-x-4">
              <label htmlFor="nativeCountry">Country </label>
              <select
                className="w-1/3 border border-gray-400 rounded-md p-1"
                onChange={(e) => {
                  handleChange("nativeCountry", e.target.value);
                }}
              >
                <option value="Select Country">Select Country</option>
                {countriesView.map((ele, index) => (
                  <option value={ele.country} key={index}>
                    {ele.country}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-x-10">
              <label htmlFor="nativeState">State</label>
              <select
                className="w-1/3 border border-gray-400 rounded-md p-1"
                onChange={(e) => {
                  handleChange("nativeState", e.target.value);
                }}
              >
                <option value="Select State">Select State</option>
                {statesView.map((ele, index) => (
                  <option value={ele.state} key={index}>
                    {ele.state}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-x-11">
              <label htmlFor="nativeCity">City </label>
              <select
                className="w-1/3 border border-gray-400 rounded-md p-1"
                onChange={(e) => {
                  handleChange("nativeCity", e.target.value);
                }}
              >
                <option value="Select City">Select City</option>
                {cityView.map((ele, index) => (
                  <option value={ele.city} key={index}>
                    {ele.city}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex flex-col gap-2 w-1/2">
            <p className="font-semibold text-lg">Working Location</p>
            <div className="space-x-4">
              <label htmlFor="workingCountry">Country </label>
              <select
                className="w-1/3 border border-gray-400 rounded-md p-1"
                onChange={(e) => {
                  handleChange("workingCountry", e.target.value);
                }}
              >
                <option value="Select Country">Select Country</option>
                {countriesView.map((ele, index) => (
                  <option value={ele.country} key={index}>
                    {ele.country}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-x-10">
              <label htmlFor="workingState">State</label>
              <select
                className="w-1/3 border border-gray-400 rounded-md p-1"
                onChange={(e) => {
                  handleChange("workingState", e.target.value);
                }}
              >
                <option value="Select State">Select State</option>
                {statesView.map((ele, index) => (
                  <option value={ele.state} key={index}>
                    {ele.state}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-x-11">
              <label htmlFor="workingCity">City </label>
              <select
                className="w-1/3 border border-gray-400 rounded-md p-1"
                onChange={(e) => {
                  handleChange("workingCity", e.target.value);
                }}
              >
                <option value="Select City">Select City</option>
                {cityView.map((ele, index) => (
                  <option value={ele.city} key={index}>
                    {ele.city}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
        <hr />
        <div className="w-full flex">
          <div className="flex flex-col gap-2 w-1/2">
            <p className="font-semibold text-lg">Community Info</p>
            <div className="space-x-4">
              <label htmlFor="religion">Religion </label>
              <select
                className="w-1/3 border border-gray-400 rounded-md p-1"
                onChange={(e) => {
                  handleChange("religion", e.target.value);
                }}
              >
                <option value="Select Religion">Select Religion</option>
                {religionView.map((ele, index) => (
                  <option value={ele.religion} key={index}>
                    {ele.religion}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-x-10">
              <label htmlFor="caste">Caste</label>
              <select
                className="w-1/3 border border-gray-400 rounded-md p-1"
                onChange={(e) => {
                  handleChange("caste", e.target.value);
                }}
              >
                <option value="Select Caste">Select Caste</option>
                {casteView.map((ele, index) => (
                  <option value={ele.caste} key={index}>
                    {ele.caste}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-x-3">
              <label htmlFor="subCaste">Subcaste </label>
              <select
                className="w-1/3 border border-gray-400 rounded-md p-1"
                onChange={(e) => {
                  handleChange("subCaste", e.target.value);
                }}
              >
                <option value="Select subcaste">Select Subcaste</option>
                {subcasteView.map((ele, index) => (
                  <option value={ele.subCaste} key={index}>
                    {ele.subCaste}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-x-4">
              <label htmlFor="motherTongue">Mother Tongue</label>
              <select
                className="w-1/3 border border-gray-400 rounded-md p-1"
                onChange={(e) => {
                  handleChange("motherTongue", e.target.value);
                }}
              >
                <option value="Select City">Select Language</option>
                {motherTongue.map((ele) => (
                  <option key={ele.motherTongue}>{ele.motherTongue}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex flex-col gap-2 w-1/2">
            <p className="font-semibold text-lg">Career</p>
            <div className="space-x-14">
              <label htmlFor="education">Education </label>
              <select
                className="w-1/3 border border-gray-400 rounded-md p-1"
                onChange={(e) => {
                  handleChange("education", e.target.value);
                }}
              >
                <option value="Select education">Select Education</option>
                {viewdegrees.map((ele, index) => (
                  <option value={ele.degree} key={index}>
                    {ele.degree}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-x-12">
              <label htmlFor="occupation">Occuptaion</label>
              <select
                className="w-1/3 border border-gray-400 rounded-md p-1"
                onChange={(e) => {
                  handleChange("occuptaion", e.target.value);
                }}
              >
                <option value="Select occuptaion">Select Occupation</option>
                {occupations.map((ele, index) => (
                  <option value={ele} key={index}>
                    {ele}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-x-3">
              <label htmlFor="monthlyInc">Monthly Income </label>
              <select
                className="w-1/3 border border-gray-400 rounded-md p-1"
                onChange={(e) => {
                  handleChange("monthlyInc", e.target.value);
                }}
              >
                <option value="Select monthlyInc">Select Income</option>
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
          </div>
        </div>
        <div>
          <div className="flex justify-between items-center mb-4">
            <span className="text-xl font-bold text-gray-600">
              ( Maximum 1 field )
            </span>
          </div>

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
                  {educationCategories.map((category) => (
                    <tr key={category.name} className="hover:bg-red-25">
                      <td className="px-4 py-3 font-medium text-red-700 border-r border-red-200 bg-red-25">
                        {category.name}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-2">
                          {category.degrees.map((degree) => {
                            const isSelected = selectedEducation.some(
                              (edu) =>
                                edu.degree === degree &&
                                edu.category === category.name
                            );
                            const isDisabled =
                              !isSelected && selectedEducation.length >= 1;

                            return (
                              <button
                                key={degree}
                                type="button"
                                onClick={() =>
                                  handleDegreeToggle(degree, category.name)
                                }
                                disabled={isDisabled}
                                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                                  isSelected
                                    ? "bg-red-600 text-white hover:bg-red-700"
                                    : isDisabled
                                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                                    : "bg-gray-100 text-gray-700 hover:bg-red-100 hover:text-red-700 border border-gray-300"
                                }`}
                              >
                                {degree}
                                {isSelected ? (
                                  <span className="ml-1">✓</span>
                                ) : null}
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
        <hr />
        <div className="w-full flex">
          <div className="flex flex-col gap-2 w-1/2">
            <p className="font-semibold text-lg">Other</p>
            <div className="space-x-22">
              <label htmlFor="maritalSts">Marital Status </label>
              <select
                className="w-1/3 border border-gray-400 rounded-md p-1"
                onChange={(e) => {
                  handleChange("maritalSts", e.target.value);
                }}
              >
                <option value="Select MStatus">Select Status</option>
                {maritalStsOptions.map((ele, index) => (
                  <option value={ele.value} key={index}>
                    {ele.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-x-10 flex">
              <label htmlFor="phyAbnormality">Physical Abnormality</label>
              <div className="flex gap-3">
                <input
                  type="radio"
                  name="phyAbnormality"
                  value={"yes"}
                  onSelect={(e) =>
                    handleChange("phyAbnormality", e.target.value)
                  }
                />{" "}
                Yes
                <input
                  type="radio"
                  name="phyAbnormality"
                  value={"no"}
                  onSelect={(e) =>
                    handleChange("phyAbnormality", e.target.value)
                  }
                />{" "}
                No
              </div>
            </div>
            <div className="space-x-26">
              <label htmlFor="nationality">Nationality </label>
              <select
                className="w-1/3 border border-gray-400 rounded-md p-1"
                onChange={(e) => {
                  handleChange("nationality", e.target.value);
                }}
              >
                <option value="Select nationality">Select Nationality</option>
                {countriesView.map((ele, index) => (
                  <option value={ele.country} key={index}>
                    {ele.country}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex flex-col gap-2 w-1/2">
            <p className="font-semibold text-lg">Hierarchy</p>
            <div className="space-x-8">
              <label htmlFor="distributor">Distributor </label>
              <select
                className="w-1/3 border border-gray-400 rounded-md p-1"
                onChange={(e) => {
                  handleChange("distributor", e.target.value);
                }}
              >
                <option value="Select distributor">Select Distributor</option>
                {distributor.map((ele, index) => (
                  <option value={ele.distributorName} key={index}>
                    {ele.distributorName}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-x-12">
              <label htmlFor="franchise">Franchise</label>
              <select
                className="w-1/3 border border-gray-400 rounded-md p-1"
                onChange={(e) => {
                  handleChange("franchise", e.target.value);
                }}
              >
                <option value="Select franchise">Select Franchise</option>
                {franchises.map((ele, index) => (
                  <option value={ele.franchiseName} key={index}>
                    {ele.franchiseName}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-x-5">
              <label htmlFor="packageType">Package Type</label>
              <select
                className="w-1/3 border border-gray-400 rounded-md p-1"
                onChange={(e) => {
                  handleChange("packageType", e.target.value);
                }}
              >
                <option value="Select packageType">Select Package Type</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
            <div className="space-x-17">
              <label htmlFor="status">Status </label>
              <select
                className="w-1/3 border border-gray-400 rounded-md p-1"
                onChange={(e) => {
                  handleChange("status", e.target.value);
                }}
              >
                <option value="Select status">Select Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
            <div className="space-x-5 flex">
              <label htmlFor="gender">Select Gender</label>
              <div className="flex gap-3">
                <input
                  type="radio"
                  name="gender"
                  value={"male"}
                  onSelect={(e) => handleChange("gender", e.target.value)}
                />{" "}
                Male
                <input
                  type="radio"
                  name="gender"
                  value={"female"}
                  onSelect={(e) => handleChange("gender", e.target.value)}
                />{" "}
                Female
              </div>
            </div>
          </div>
          <hr />
          <hr />
        </div>
        <div className="w-full flex">
          <div className="flex flex-col gap-2 w-1/2">
            <p className="font-semibold text-lg">Special</p>
            <div className="space-x-22">
              <label htmlFor="sect">Sect</label>
              <select
                className="w-1/3 border border-gray-400 rounded-md p-1"
                onChange={(e) => {
                  handleChange("sect", e.target.value);
                }}
              >
                <option value="Select Sect">Select Sect</option>
                {sect.map((ele, index) => (
                  <option value={ele.name} key={index}>
                    {ele.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-x-22">
              <label htmlFor="manglik">Manglik</label>
              <select
                className="w-1/3 border border-gray-400 rounded-md p-1"
                onChange={(e) => {
                  handleChange("manglik", e.target.value);
                }}
              >
                <option value="Select Manglik">Select Manglik</option>
                {manglik.map((ele, index) => (
                  <option value={ele.name} key={index}>
                    {ele.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-x-26">
              <label htmlFor="FoodChoices">Food Choices </label>
              <select
                className="w-1/3 border border-gray-400 rounded-md p-1"
                onChange={(e) => {
                  handleChange("foodChoices", e.target.value);
                }}
              >
                <option value="Select food">Select Food choices</option>
                {foodPref.map((ele, index) => (
                  <option value={ele.name} key={index}>
                    {ele.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-x-8">
              <label htmlFor="BloodGrp">Blood Group </label>
              <select
                className="w-1/3 border border-gray-400 rounded-md p-1"
                onChange={(e) => {
                  handleChange("bloodGroup", e.target.value);
                }}
              >
                <option value="Select Blood Group">Select Blood Group</option>
                {distributor.map((ele, index) => (
                  <option value={ele.distributorName} key={index}>
                    {ele.distributorName}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex flex-col gap-2 w-1/2">
            <div className="space-x-8">
              <label htmlFor="complexion">Complexion </label>
              <select
                className="w-1/3 border border-gray-400 rounded-md p-1"
                onChange={(e) => {
                  handleChange("complexion", e.target.value);
                }}
              >
                <option value="Select complexion">Select Complexion</option>
                {complexion.map((ele, index) => (
                  <option value={ele.complexion} key={index}>
                    {ele.complexion}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-x-8">
              <label htmlFor="bodyType">Body Type </label>
              <select
                className="w-1/3 border border-gray-400 rounded-md p-1"
                onChange={(e) => {
                  handleChange("bodyType", e.target.value);
                }}
              >
                <option value="Select bodyType">Select Body Type</option>
                {bodyType.map((ele, index) => (
                  <option value={ele.bodyType} key={index}>
                    {ele.bodyType}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-x-8">
              <label htmlFor="familyBackground">Family Background </label>
              <select
                className="w-1/3 border border-gray-400 rounded-md p-1"
                onChange={(e) => {
                  handleChange("familyBackground", e.target.value);
                }}
              >
                <option value="Select familyBackground">
                  Select Family Background
                </option>
                {familyBg.map((ele, index) => (
                  <option value={ele.familyBg} key={index}>
                    {ele.familyBg}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-x-8">
              <label htmlFor="features">Features </label>
              <select
                className="w-1/3 border border-gray-400 rounded-md p-1"
                onChange={(e) => {
                  handleChange("features", e.target.value);
                }}
              >
                <option value="Select features">Select Features</option>
                {distributor.map((ele, index) => (
                  <option value={ele.distributorName} key={index}>
                    {ele.distributorName}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-x-8">
              <label htmlFor="height">Height </label>
              <select
                className="w-1/3 border border-gray-400 rounded-md p-1"
                onChange={(e) => {
                  handleChange("height", e.target.value);
                }}
              >
                <option value="Select height">Select Height</option>
                {distributor.map((ele, index) => (
                  <option value={ele.distributorName} key={index}>
                    {ele.distributorName}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-x-8">
              <label htmlFor="position">Position </label>
              <select
                className="w-1/3 border border-gray-400 rounded-md p-1"
                onChange={(e) => {
                  handleChange("position", e.target.value);
                }}
              >
                <option value="Select position">Select Position</option>
                {positions.map((ele, index) => (
                  <option value={ele.position} key={index}>
                    {ele.position}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-x-8">
              <label htmlFor="vipReg">VIP Registration </label>
              <select
                className="w-1/3 border border-gray-400 rounded-md p-1"
                onChange={(e) => {
                  handleChange("vipReg", e.target.value);
                }}
              >
                <option value="Select vipReg">Select Vip Reg</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </div>
          </div>
        </div>
        <hr />
        {/* Checkboxes Section */}
        <div className="w-full space-y-6">
          <div className="w-full bg-[#7d0a0a] text-white text-lg font-semibold p-1">
            <p>Select required columns to be displayed</p>
          </div>
          <div className="w-full flex flex-wrap gap-y-5">
            {checkboxes.map((ele, index) => (
              <div className="w-1/3 flex flex-col" key={index}>
                <h1 className="font-semibold">{ele.label}</h1>
                <ul className="px-4 box-border border-dashed border-l-2 ml-2">
                  {ele.boxes.map((box, idx) => (
                    <li className="flex gap-2 items-center" key={idx}>
                      <input
                        type="checkbox"
                        name={ele.name}
                        className="w-4 h-4"
                        value={box}
                        onChange={(e) =>
                          handleCheck(ele.name, box, e.target.checked)
                        }
                      />
                      {box}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
      <ReportsMemberTable data={reportsData} />
    </>
  );
};

const PasswordChangeComponent = ({ currAdmin }) => {
  const [currentStep, setCurrentStep] = useState(1); // 1: Email, 2: OTP, 3: Password Change
  const [formData, setFormData] = useState({
    email: "",
    otp: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showPasswords, setShowPasswords] = useState({
    old: false,
    new: false,
    confirm: false,
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }

    // Clear success message when user starts typing
    if (successMessage) {
      setSuccessMessage("");
    }
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const validateEmail = async (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const emailValidate = currAdmin.email;
    if (emailValidate === email) {
      return emailRegex.test(email);
    }
    toast.error("Please send the valid email");
  };

  const handleEmailValidation = async (e) => {
    e.preventDefault();

    if (!formData.email) {
      setErrors({ email: "Email is required" });
      return;
    }
    if (formData.email !== currAdmin.email) {
      toast.error("Please send verified email");
      return;
    }
    if (!validateEmail(formData.email)) {
      setErrors({ email: "Please enter a valid email address" });
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      // Simulate API call to send OTP
      const response = await axios.post(
        "http://localhost:8000/api/admin/forgot-password-otp",
        {
          id: currAdmin._id,
        }
      );
      console.log(response.data);

      setSuccessMessage("OTP has been sent to your email!");
      setCurrentStep(2);
    } catch (error) {
      setErrors({ email: "Failed to send OTP. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  //  const handleOTPValidation = async (e) => {

  //   if (!formData.otp) {
  //     setErrors({ otp: 'OTP is required' });
  //     return;
  //   }

  //   if (formData.otp.length !== 4) {
  //     setErrors({ otp: 'OTP must be 4 digits' });
  //     return;
  //   }

  //   setIsLoading(true);
  //   setErrors({});
  //   setSuccessMessage('');

  //   try {
  //     const response = await axios.post('http://localhost:8000/api/admin/change-password', {
  //       id:currAdmin._id,
  //       otp:formData.otp,
  //       newpassword:formData.newPassword
  //     });
  //     console.log(response.data)
  //     if (response.data?.status) {
  //       setSuccessMessage(response.data.message || 'OTP verified successfully!');
  //       toast.success(response.data.message)
  //     } else {
  //       toast.error(response.data.message)
  //       setErrors({ otp: response.data.message || 'Invalid OTP. Please try again.' });
  //     }

  //   } catch (error) {
  //     setErrors({
  //       otp:
  //         error.response?.data?.message ||
  //         'Failed to verify OTP. Please try again.',
  //     });
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  const validatePasswordForm = () => {
    const newErrors = {};

    if (!formData.newPassword) {
      newErrors.newPassword = "New password is required";
    } else if (formData.newPassword.length < 6) {
      newErrors.newPassword = "Password must be at least 8 characters long";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your new password";
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();

    if (!validatePasswordForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:8000/api/admin/change-password",
        {
          id: currAdmin._id,
          otp: formData.otp,
          newPassword: formData.newPassword,
        }
      );
      if (response.data.status) {
        toast.success(response.data.message);
        return;
      }
      toast.error(response.data.message);
      console.log(response.data);
      // Simulate success
      setSuccessMessage("Password changed successfully!");
      setFormData({
        email: "",
        otp: "",
        newPassword: "",
        confirmPassword: "",
      });
      setCurrentStep(1);
    } catch (error) {
      setErrors({ submit: "Failed to change password. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setSuccessMessage("OTP has been resent to your email!");
    } catch (error) {
      setErrors({ otp: "Failed to resend OTP. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case 1:
        return "Verify Email";
      case 2:
        return "Enter OTP";
      default:
        return "Change Password";
    }
  };

  const getStepDescription = () => {
    switch (currentStep) {
      case 1:
        return "Enter your email to receive OTP";
      case 2:
        return "Enter the OTP sent to your email";
      default:
        return "Keep your account secure";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Header */}
          <div
            className="bg-gradient-to-r from-red-900 to-red-700 p-6 text-center"
            style={{
              background: `linear-gradient(135deg, #7d0a0a 0%, #a01414 100%)`,
            }}
          >
            <Shield className="w-12 h-12 text-white mx-auto mb-3" />
            <h2 className="text-2xl font-bold text-white">{getStepTitle()}</h2>
            <p className="text-red-100 mt-2">{getStepDescription()}</p>
          </div>

          {/* Progress Steps */}
          <div className="px-6 py-4 bg-gray-50 border-b">
            <div className="flex items-center justify-between">
              <div
                className={`flex items-center space-x-2 ${
                  currentStep >= 1 ? "text-red-900" : "text-gray-400"
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    currentStep >= 1
                      ? "bg-red-900 text-white"
                      : "bg-gray-300 text-gray-500"
                  }`}
                >
                  1
                </div>
                <span className="text-sm font-medium">Email</span>
              </div>
              <div
                className={`w-12 h-0.5 ${
                  currentStep >= 2 ? "bg-red-900" : "bg-gray-300"
                }`}
              ></div>
              <div
                className={`flex items-center space-x-2 ${
                  currentStep >= 2 ? "text-red-900" : "text-gray-400"
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    currentStep >= 2
                      ? "bg-red-900 text-white"
                      : "bg-gray-300 text-gray-500"
                  }`}
                >
                  2
                </div>
                <span className="text-sm font-medium">OTP</span>
              </div>
              <div
                className={`w-12 h-0.5 ${
                  currentStep >= 3 ? "bg-red-900" : "bg-gray-300"
                }`}
              ></div>
              <div
                className={`flex items-center space-x-2 ${
                  currentStep >= 3 ? "text-red-900" : "text-gray-400"
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    currentStep >= 3
                      ? "bg-red-900 text-white"
                      : "bg-gray-300 text-gray-500"
                  }`}
                >
                  3
                </div>
                <span className="text-sm font-medium">Password</span>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="p-6">
            {successMessage && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="text-green-700 font-medium">
                  {successMessage}
                </span>
              </div>
            )}

            {errors.submit && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-3">
                <AlertCircle className="w-5 h-5 text-red-600" />
                <span className="text-red-700">{errors.submit}</span>
              </div>
            )}

            <div className="space-y-6">
              {/* Step 1: Email Validation */}
              {currentStep === 1 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        handleInputChange("email", e.target.value)
                      }
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                        errors.email
                          ? "border-red-300 focus:ring-red-500"
                          : "border-gray-300 focus:ring-red-900"
                      }`}
                      placeholder="Enter your email address"
                    />
                  </div>
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                  )}
                </div>
              )}

              {/* Step 2: OTP Validation */}
              {currentStep === 2 && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Enter OTP
                    </label>
                    <div className="relative">
                      <MessageSquare className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        value={formData.otp}
                        onChange={(e) =>
                          handleInputChange(
                            "otp",
                            e.target.value.replace(/\D/g, "").slice(0, 6)
                          )
                        }
                        className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors text-center text-lg tracking-widest ${
                          errors.otp
                            ? "border-red-300 focus:ring-red-500"
                            : "border-gray-300 focus:ring-red-900"
                        }`}
                        placeholder="0 0 0 0"
                        maxLength="6"
                      />
                    </div>
                    {errors.otp && (
                      <p className="mt-1 text-sm text-red-600">{errors.otp}</p>
                    )}
                    <p className="mt-1 text-xs text-gray-500">
                      Enter the 6-digit code sent to {formData.email}
                    </p>
                    <button
                      type="button"
                      onClick={handleResendOTP}
                      disabled={isLoading}
                      className="mt-2 text-sm text-red-900 hover:text-red-700 underline disabled:opacity-50"
                    >
                      Resend OTP
                    </button>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      New Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type={showPasswords.new ? "text" : "password"}
                        value={formData.newPassword}
                        onChange={(e) =>
                          handleInputChange("newPassword", e.target.value)
                        }
                        className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                          errors.newPassword
                            ? "border-red-300 focus:ring-red-500"
                            : "border-gray-300 focus:ring-red-900"
                        }`}
                        placeholder="Enter your new password"
                      />
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility("new")}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPasswords.new ? (
                          <EyeOff size={20} />
                        ) : (
                          <Eye size={20} />
                        )}
                      </button>
                    </div>
                    {errors.newPassword && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.newPassword}
                      </p>
                    )}
                    <p className="mt-1 text-xs text-gray-500">
                      Password must be at least 8 characters long
                    </p>
                  </div>

                  {/* Confirm New Password */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type={showPasswords.confirm ? "text" : "password"}
                        value={formData.confirmPassword}
                        onChange={(e) =>
                          handleInputChange("confirmPassword", e.target.value)
                        }
                        className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                          errors.confirmPassword
                            ? "border-red-300 focus:ring-red-500"
                            : "border-gray-300 focus:ring-red-900"
                        }`}
                        placeholder="Confirm your new password"
                      />
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility("confirm")}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPasswords.confirm ? (
                          <EyeOff size={20} />
                        ) : (
                          <Eye size={20} />
                        )}
                      </button>
                    </div>
                    {errors.confirmPassword && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.confirmPassword}
                      </p>
                    )}
                  </div>
                </>
              )}

              {/* Step 3: Password Change */}
              {currentStep === 3 && <>{/* New Password */}</>}

              {/* Submit Button */}
              <div className="space-y-4">
                <button
                  type="button"
                  onClick={
                    currentStep === 1
                      ? handleEmailValidation
                      : currentStep === 2
                      ? handlePasswordChange
                      : null
                  }
                  disabled={isLoading}
                  className="w-full py-3 bg-red-900 text-white rounded-lg hover:bg-red-800 disabled:bg-red-400 disabled:cursor-not-allowed transition-colors font-medium flex items-center justify-center space-x-2"
                  style={{ backgroundColor: isLoading ? "#ef4444" : "#7d0a0a" }}
                >
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>
                        {currentStep === 1
                          ? "Sending OTP..."
                          : currentStep === 2
                          ? "Verifying OTP..."
                          : "Changing Password..."}
                      </span>
                    </>
                  ) : (
                    <>
                      {currentStep === 1 ? (
                        <Mail size={18} />
                      ) : currentStep === 2 ? (
                        <MessageSquare size={18} />
                      ) : (
                        <Shield size={18} />
                      )}
                      <span>
                        {currentStep === 1
                          ? "Send OTP"
                          : currentStep === 2
                          ? "Change Password"
                          : "Change Password"}
                      </span>
                    </>
                  )}
                </button>

                {currentStep > 1 && (
                  <button
                    type="button"
                    onClick={() => setCurrentStep(currentStep - 1)}
                    className="w-full py-3 border-2 border-red-900 text-red-900 rounded-lg hover:bg-red-50 transition-colors font-medium"
                    style={{ borderColor: "#7d0a0a", color: "#7d0a0a" }}
                  >
                    Back
                  </button>
                )}
              </div>
            </div>

            {/* Security Tips - Only show on password change step */}
            {currentStep === 3 && (
              <div className="mt-8 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-2 flex items-center space-x-2">
                  <Shield
                    className="w-4 h-4 text-red-900"
                    style={{ color: "#7d0a0a" }}
                  />
                  <span>Security Tips</span>
                </h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Use a strong, unique password</li>
                  <li>• Include uppercase, lowercase, numbers, and symbols</li>
                  <li>• Don't reuse passwords from other accounts</li>
                  <li>• Consider using a password manager</li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const TransactionPasswordChangeComponent = ({ adminId, token }) => {
  const [transactionFormData, setTransactionFormData] = useState({
    oldTransactionPassword: "",
    newTransactionPassword: "",
    confirmTransactionPassword: "",
  });

  const [showTransactionPasswords, setShowTransactionPasswords] = useState({
    oldTransaction: false,
    newTransaction: false,
    confirmTransaction: false,
  });

  const [transactionErrors, setTransactionErrors] = useState({});
  const [isTransactionLoading, setIsTransactionLoading] = useState(false);
  const [transactionSuccessMessage, setTransactionSuccessMessage] = useState("");

  // ✅ Handle Input Change
  const handleTransactionInputChange = (field, value) => {
    setTransactionFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    if (transactionErrors[field]) {
      setTransactionErrors((prev) => ({ ...prev, [field]: "" }));
    }

    if (transactionSuccessMessage) {
      setTransactionSuccessMessage("");
    }
  };

  // ✅ Toggle Password Visibility
  const toggleTransactionPasswordVisibility = (field) => {
    setShowTransactionPasswords((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  // ✅ Validation
  const validateTransactionForm = () => {
    const newTransactionErrors = {};

    if (!transactionFormData.oldTransactionPassword) {
      newTransactionErrors.oldTransactionPassword =
        "Current transaction password is required";
    }

    if (!transactionFormData.newTransactionPassword) {
      newTransactionErrors.newTransactionPassword =
        "New transaction password is required";
    } else if (transactionFormData.newTransactionPassword.length < 6) {
      newTransactionErrors.newTransactionPassword =
        "Transaction password must be at least 6 characters long";
    }

    if (!transactionFormData.confirmTransactionPassword) {
      newTransactionErrors.confirmTransactionPassword =
        "Please confirm your new transaction password";
    } else if (
      transactionFormData.newTransactionPassword !==
      transactionFormData.confirmTransactionPassword
    ) {
      newTransactionErrors.confirmTransactionPassword =
        "Transaction passwords do not match";
    }

    if (
      transactionFormData.oldTransactionPassword ===
        transactionFormData.newTransactionPassword &&
      transactionFormData.oldTransactionPassword
    ) {
      newTransactionErrors.newTransactionPassword =
        "New transaction password must be different from current transaction password";
    }

    setTransactionErrors(newTransactionErrors);
    return Object.keys(newTransactionErrors).length === 0;
  };

  // ✅ Handle Submit with Backend API
  const handleTransactionSubmit = async (e) => {
    e.preventDefault();

    if (!validateTransactionForm()) return;

    setIsTransactionLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:8000/api/admin/change-transactionPassword",
        {
          transactionPassword: transactionFormData.oldTransactionPassword,
          newTransactionPassword: transactionFormData.newTransactionPassword,
          id: adminId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.status) {
        setTransactionSuccessMessage("Transaction password changed successfully!");
        // toast.success("Transaction password changed successfully!");
        setTransactionFormData({
          oldTransactionPassword: "",
          newTransactionPassword: "",
          confirmTransactionPassword: "",
        });
      } else {
        toast.error(response.data.message || "Failed to change transaction password");
        setTransactionErrors({ submit: response.data.message });
      }
    } catch (error) {
      console.error("Error changing transaction password:", error);
      toast.error("Something went wrong. Please try again.");
      setTransactionErrors({
        submit: "Server error. Please try again.",
      });
    } finally {
      setIsTransactionLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Header */}
          <div
            className="bg-gradient-to-r from-red-900 to-red-700 p-6 text-center"
            style={{
              background: `linear-gradient(135deg, #7d0a0a 0%, #a01414 100%)`,
            }}
          >
            <Shield className="w-12 h-12 text-white mx-auto mb-3" />
            <h2 className="text-2xl font-bold text-white">
              Change Transaction Password <br /> (Points)
            </h2>
            <p className="text-red-100 mt-2">Secure your transactions</p>
          </div>

          {/* Form */}
          <div className="p-6">
            {transactionSuccessMessage && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="text-green-700 font-medium">
                  {transactionSuccessMessage}
                </span>
              </div>
            )}

            {transactionErrors.submit && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-3">
                <AlertCircle className="w-5 h-5 text-red-600" />
                <span className="text-red-700">{transactionErrors.submit}</span>
              </div>
            )}

            <div className="space-y-6">
              {/* Current Transaction Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Transaction Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type={
                      showTransactionPasswords.oldTransaction
                        ? "text"
                        : "password"
                    }
                    value={transactionFormData.oldTransactionPassword}
                    onChange={(e) =>
                      handleTransactionInputChange(
                        "oldTransactionPassword",
                        e.target.value
                      )
                    }
                    className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                      transactionErrors.oldTransactionPassword
                        ? "border-red-300 focus:ring-red-500"
                        : "border-gray-300 focus:ring-red-900"
                    }`}
                    placeholder="Enter your current transaction password"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      toggleTransactionPasswordVisibility("oldTransaction")
                    }
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showTransactionPasswords.oldTransaction ? (
                      <EyeOff size={20} />
                    ) : (
                      <Eye size={20} />
                    )}
                  </button>
                </div>
                {transactionErrors.oldTransactionPassword && (
                  <p className="mt-1 text-sm text-red-600">
                    {transactionErrors.oldTransactionPassword}
                  </p>
                )}
              </div>

              {/* New Transaction Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  New Transaction Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type={
                      showTransactionPasswords.newTransaction
                        ? "text"
                        : "password"
                    }
                    value={transactionFormData.newTransactionPassword}
                    onChange={(e) =>
                      handleTransactionInputChange(
                        "newTransactionPassword",
                        e.target.value
                      )
                    }
                    className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                      transactionErrors.newTransactionPassword
                        ? "border-red-300 focus:ring-red-500"
                        : "border-gray-300 focus:ring-red-900"
                    }`}
                    placeholder="Enter your new transaction password"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      toggleTransactionPasswordVisibility("newTransaction")
                    }
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showTransactionPasswords.newTransaction ? (
                      <EyeOff size={20} />
                    ) : (
                      <Eye size={20} />
                    )}
                  </button>
                </div>
                {transactionErrors.newTransactionPassword && (
                  <p className="mt-1 text-sm text-red-600">
                    {transactionErrors.newTransactionPassword}
                  </p>
                )}
              </div>

              {/* Confirm New Transaction Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm New Transaction Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type={
                      showTransactionPasswords.confirmTransaction
                        ? "text"
                        : "password"
                    }
                    value={transactionFormData.confirmTransactionPassword}
                    onChange={(e) =>
                      handleTransactionInputChange(
                        "confirmTransactionPassword",
                        e.target.value
                      )
                    }
                    className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                      transactionErrors.confirmTransactionPassword
                        ? "border-red-300 focus:ring-red-500"
                        : "border-gray-300 focus:ring-red-900"
                    }`}
                    placeholder="Confirm your new transaction password"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      toggleTransactionPasswordVisibility("confirmTransaction")
                    }
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showTransactionPasswords.confirmTransaction ? (
                      <EyeOff size={20} />
                    ) : (
                      <Eye size={20} />
                    )}
                  </button>
                </div>
                {transactionErrors.confirmTransactionPassword && (
                  <p className="mt-1 text-sm text-red-600">
                    {transactionErrors.confirmTransactionPassword}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <div className="space-y-4">
                <button
                  type="button"
                  onClick={handleTransactionSubmit}
                  disabled={isTransactionLoading}
                  className="w-full py-3 bg-red-900 text-white rounded-lg hover:bg-red-800 disabled:bg-red-400 disabled:cursor-not-allowed transition-colors font-medium flex items-center justify-center space-x-2"
                  style={{
                    backgroundColor: isTransactionLoading
                      ? "#ef4444"
                      : "#7d0a0a",
                  }}
                >
                  {isTransactionLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Changing Transaction Password...</span>
                    </>
                  ) : (
                    <>
                      <Shield size={18} />
                      <span>Change Transaction Password</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Security Tips */}
            <div className="mt-8 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-semibold text-gray-800 mb-2 flex items-center space-x-2">
                <Shield className="w-4 h-4 text-red-900" />
                <span>Transaction Security Tips</span>
              </h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Use a strong, unique transaction password</li>
                <li>• Make it different from your login password</li>
                <li>• Include numbers and special characters</li>
                <li>• Never share your transaction password</li>
                <li>• Change it regularly for better security</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const TransactionPasswordChangeComponentForDist = () => {
  const [transactionFormData, setTransactionFormData] = useState({
    oldTransactionPassword: "",
    newTransactionPassword: "",
    confirmTransactionPassword: "",
  });

  const [showTransactionPasswords, setShowTransactionPasswords] = useState({
    oldTransaction: false,
    newTransaction: false,
    confirmTransaction: false,
  });

  const [transactionErrors, setTransactionErrors] = useState({});
  const [isTransactionLoading, setIsTransactionLoading] = useState(false);
  const [transactionSuccessMessage, setTransactionSuccessMessage] =
    useState("");

  const handleTransactionInputChange = (field, value) => {
    setTransactionFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear error when user starts typing
    if (transactionErrors[field]) {
      setTransactionErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }

    // Clear success message when user starts typing
    if (transactionSuccessMessage) {
      setTransactionSuccessMessage("");
    }
  };

  const toggleTransactionPasswordVisibility = (field) => {
    setShowTransactionPasswords((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const validateTransactionForm = () => {
    const newTransactionErrors = {};

    if (!transactionFormData.oldTransactionPassword) {
      newTransactionErrors.oldTransactionPassword =
        "Current transaction password is required";
    }

    if (!transactionFormData.newTransactionPassword) {
      newTransactionErrors.newTransactionPassword =
        "New transaction password is required";
    } else if (transactionFormData.newTransactionPassword.length < 6) {
      newTransactionErrors.newTransactionPassword =
        "Transaction password must be at least 6 characters long";
    }

    if (!transactionFormData.confirmTransactionPassword) {
      newTransactionErrors.confirmTransactionPassword =
        "Please confirm your new transaction password";
    } else if (
      transactionFormData.newTransactionPassword !==
      transactionFormData.confirmTransactionPassword
    ) {
      newTransactionErrors.confirmTransactionPassword =
        "Transaction passwords do not match";
    }

    if (
      transactionFormData.oldTransactionPassword ===
        transactionFormData.newTransactionPassword &&
      transactionFormData.oldTransactionPassword
    ) {
      newTransactionErrors.newTransactionPassword =
        "New transaction password must be different from current transaction password";
    }

    setTransactionErrors(newTransactionErrors);
    return Object.keys(newTransactionErrors).length === 0;
  };

  const handleTransactionSubmit = async (e) => {
    e.preventDefault();

    if (!validateTransactionForm()) {
      return;
    }

    setIsTransactionLoading(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Simulate success
      setTransactionSuccessMessage(
        "Transaction password changed successfully!"
      );
      setTransactionFormData({
        oldTransactionPassword: "",
        newTransactionPassword: "",
        confirmTransactionPassword: "",
      });
    } catch (error) {
      setTransactionErrors({
        submit: "Failed to change transaction password. Please try again.",
      });
    } finally {
      setIsTransactionLoading(false);
    }
  };

  const handleForgotTransactionPassword = () => {
    // Simulate forgot transaction password action
    alert("Forgot transaction password link has been sent to your email!");
    console.log("Redirecting to forgot transaction password...");
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-900 to-blue-700 p-6 text-center">
            <Shield className="w-12 h-12 text-white mx-auto mb-3" />
            <h2 className="text-2xl font-bold text-white">
              Change Transaction Password <br /> (for distributor)
            </h2>
            <p className="text-red-100 mt-2">Secure your transactions</p>
          </div>

          {/* Form */}
          <div className="p-6">
            {transactionSuccessMessage && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="text-green-700 font-medium">
                  {transactionSuccessMessage}
                </span>
              </div>
            )}

            {transactionErrors.submit && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-3">
                <AlertCircle className="w-5 h-5 text-red-600" />
                <span className="text-red-700">{transactionErrors.submit}</span>
              </div>
            )}

            <div className="space-y-6">
              {/* Current Transaction Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Transaction Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type={
                      showTransactionPasswords.oldTransaction
                        ? "text"
                        : "password"
                    }
                    value={transactionFormData.oldTransactionPassword}
                    onChange={(e) =>
                      handleTransactionInputChange(
                        "oldTransactionPassword",
                        e.target.value
                      )
                    }
                    className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                      transactionErrors.oldTransactionPassword
                        ? "border-red-300 focus:ring-red-500"
                        : "border-gray-300 focus:ring-red-900"
                    }`}
                    placeholder="Enter your current transaction password"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      toggleTransactionPasswordVisibility("oldTransaction")
                    }
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showTransactionPasswords.oldTransaction ? (
                      <EyeOff size={20} />
                    ) : (
                      <Eye size={20} />
                    )}
                  </button>
                </div>
                {transactionErrors.oldTransactionPassword && (
                  <p className="mt-1 text-sm text-red-600">
                    {transactionErrors.oldTransactionPassword}
                  </p>
                )}
              </div>

              {/* New Transaction Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  New Transaction Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type={
                      showTransactionPasswords.newTransaction
                        ? "text"
                        : "password"
                    }
                    value={transactionFormData.newTransactionPassword}
                    onChange={(e) =>
                      handleTransactionInputChange(
                        "newTransactionPassword",
                        e.target.value
                      )
                    }
                    className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                      transactionErrors.newTransactionPassword
                        ? "border-red-300 focus:ring-red-500"
                        : "border-gray-300 focus:ring-red-900"
                    }`}
                    placeholder="Enter your new transaction password"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      toggleTransactionPasswordVisibility("newTransaction")
                    }
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showTransactionPasswords.newTransaction ? (
                      <EyeOff size={20} />
                    ) : (
                      <Eye size={20} />
                    )}
                  </button>
                </div>
                {transactionErrors.newTransactionPassword && (
                  <p className="mt-1 text-sm text-red-600">
                    {transactionErrors.newTransactionPassword}
                  </p>
                )}
                <p className="mt-1 text-xs text-gray-500">
                  Transaction password must be at least 6 characters long
                </p>
              </div>

              {/* Confirm New Transaction Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm New Transaction Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type={
                      showTransactionPasswords.confirmTransaction
                        ? "text"
                        : "password"
                    }
                    value={transactionFormData.confirmTransactionPassword}
                    onChange={(e) =>
                      handleTransactionInputChange(
                        "confirmTransactionPassword",
                        e.target.value
                      )
                    }
                    className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                      transactionErrors.confirmTransactionPassword
                        ? "border-red-300 focus:ring-red-500"
                        : "border-gray-300 focus:ring-red-900"
                    }`}
                    placeholder="Confirm your new transaction password"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      toggleTransactionPasswordVisibility("confirmTransaction")
                    }
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showTransactionPasswords.confirmTransaction ? (
                      <EyeOff size={20} />
                    ) : (
                      <Eye size={20} />
                    )}
                  </button>
                </div>
                {transactionErrors.confirmTransactionPassword && (
                  <p className="mt-1 text-sm text-red-600">
                    {transactionErrors.confirmTransactionPassword}
                  </p>
                )}
              </div>

              {/* Buttons */}
              <div className="space-y-4">
                <button
                  type="button"
                  onClick={handleTransactionSubmit}
                  disabled={isTransactionLoading}
                  className="w-full py-3 bg-blue-900 text-white rounded-lg hover:bg-blue-800 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors font-medium flex items-center justify-center space-x-2"
                >
                  {isTransactionLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Changing Transaction Password...</span>
                    </>
                  ) : (
                    <>
                      <Shield size={18} />
                      <span>Change Transaction Password</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleForgotTransactionPassword}
                  className="w-full py-3 border-2 border-red-900 text-red-900 rounded-lg hover:bg-red-50 transition-colors font-medium"
                  style={{ borderColor: "#7d0a0a", color: "#7d0a0a" }}
                >
                  Forgot Transaction Password?
                </button>
              </div>
            </div>

            {/* Transaction Security Tips */}
            <div className="mt-8 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-semibold text-gray-800 mb-2 flex items-center space-x-2">
                <Shield
                  className="w-4 h-4 text-red-900"
                  style={{ color: "#7d0a0a" }}
                />
                <span>Transaction Security Tips</span>
              </h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Use a strong, unique transaction password</li>
                <li>• Make it different from your login password</li>
                <li>• Include numbers and special characters</li>
                <li>• Never share your transaction password</li>
                <li>• Change it regularly for better security</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const PackageTable = ({ data }) => {
  // Combine all package types with a label
  const allPackages = [
    ...(data?.mainPackages?.map((p) => ({ ...p, type: "Main Package" })) || []),
    ...(data?.addOnPackages?.map((p) => ({ ...p, type: "Add-On Package" })) ||
      []),
    ...(data?.vipPackages?.map((p) => ({ ...p, type: "VIP Package" })) || []),
    ...(data?.freepackages?.map((p) => ({ ...p, type: "Free Package" })) || []),
  ];

  return (
    <div className="overflow-scroll md:overflow-hidden">
      <table className="w-full divide-y divide-gray-200">
        <thead style={{ backgroundColor: "#7d0a0a" }}>
          <tr className="text-white text-sm">
            <th className="px-4 py-2 text-left text-md font-medium text-white tracking-wider">
              Package ID
            </th>
            <th className="px-4 py-2 text-left text-md font-medium text-white tracking-wider">
              Address
            </th>
            <th className="px-4 py-2 text-left text-md font-medium text-white tracking-wider">
              Package Type
            </th>
            <th className="px-4 py-2 text-left text-md font-medium text-white tracking-wider">
              MembCost
            </th>
            <th className="px-4 py-2 text-left text-md font-medium text-white tracking-wider">
              DistShare
            </th>
            <th className="px-4 py-2 text-left text-md font-medium text-white tracking-wider">
              Franchise
            </th>
            <th className="px-4 py-2 text-left text-md font-medium text-white tracking-wider">
              Franchise Share
            </th>
            <th className="px-4 py-2 text-left text-md font-medium text-white tracking-wider">
              Status
            </th>
            <th className="px-4 py-2 text-left text-md font-medium text-white tracking-wider">
              Date of Creation
            </th>
          </tr>
        </thead>

        <tbody className="bg-white divide-y divide-gray-200">
          {allPackages.length > 0 ? (
            allPackages.map((pkg, index) => (
              <tr key={pkg._id || index}>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 border-r border-gray-200">
                  {pkg.packageId ?? "-"}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 border-r border-gray-200">
                  {pkg.numberOfAddresses || pkg.NumOfFreeAddress || "-"}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 border-r border-gray-200">
                  {pkg.type ?? "-"}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 border-r border-gray-200">
                  {pkg.memberCost ?? "-"}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 border-r border-gray-200">
                  {pkg.distributorShare ?? "-"}
                </td>
                <td className="capitalize px-4 py-4 whitespace-nowrap text-sm text-gray-900 border-r border-gray-200">
                  manomilan
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 border-r border-gray-200">
                  {pkg.franchiseShare ?? "-"}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 border-r border-gray-200">
                  {pkg.status ?? "-"}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 border-r border-gray-200">
                  {pkg.createdAt
                    ? new Date(pkg.createdAt).toLocaleDateString("en-GB")
                    : "-"}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan="9"
                className="text-center text-gray-500 py-4 text-sm"
              >
                No packages found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};
const AdminDashboard = () => {
  const dateChanger = (date) => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0"); // Months are 0-based
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // logout function
  const LogOutBtn = () => {
    const response = confirm("Do you want to log out?");
    if (response) {
      localStorage.removeItem("adminToken");
      window.location.href = "/"; // redirect to login or home page
    }
  };

  const token = localStorage.getItem("adminToken");
  const [activeSection, setActiveSection] = useState("home");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    account: true,
    admin: true,
    distributor: true,
    franchisee: true,
    settings: true,
    members: true,
    messageBox: true,
    advertiser: true,
    Reports: true,
    masters: true,
    logout: true,
  });
  const [franchises, setFranchises] = useState([]);
  const [distributor, setDistributor] = useState([]);
  const [members, setMembers] = useState([]);
  const [open, setOpen] = useState("one");
  const [isPassword, setIsPassword] = useState(false);
  const [addPoints, setAddPoints] = useState({
    points: "",
    password: "",
  });
  const [mainPackage, setMainPackage] = useState({
    name: "",
    address: "",
    adminShare: "",
    memberCost: "",
    validity: "",
  });
  const [freePackage, setFreePackage] = useState({
    addressCount: "",
    validity: null,
  });
  const [addOnPackage, setAddOnPackage] = useState({
    packageName: "",
    address: "",
    memberCost: "",
    distShare: "",
    franchiseShare: "",
    validity: "",
  });
  const [vipPackage, setVipPackage] = useState({
    name: "",
    address: "",
    adminShare: "",
    memberCost: "",
    validity: "",
  });

  // get states
  const [displayPoints, setDisplayPoints] = useState([]);
  const [displayFreePackage, setDisplayFreePackage] = useState([]);
  const [displayAddOnPackage, setDisplayAddOnPackage] = useState([]);
  const [displayMainPackage, setDisplayMainPackage] = useState([]);
  const [displayVipPackage, setDisplayVipPackage] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isDistDropdownOpen, setIsDistDropdownOpen] = useState(false);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [selectedDist, setSelectedDist] = useState([]);
  const [selectedFranchise, setSelectedFranchises] = useState([]);
  const [isFranchiseDropdownOpen, setIsFranchiseDropdownOpen] = useState(false);
  const isRecipientSelected = (recipient) => {
    return selectedRecipients.some((r) => r._id === recipient._id);
  };
  const [selectedRecipients, setSelectedRecipients] = useState([]);
  const [message, setMessage] = useState("");
  const [getSentMsg, setGetSentMsg] = useState([]);
  const [msgId, setMsgId] = useState(null);
  const hideModal = () => {
    setIsModalOpen(false);
  };
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [getInboxMsg, setGetInboxMsg] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [activeMessage, setActiveMessage] = useState(null);
  const handleOpenModal = (message) => {
    setActiveMessage(message);
    setModalVisible(true);
  };
  const [currAdmin, setCurrAdmin] = useState({});

  const getCurrentAdmin = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/api/admin/current-admin",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data.status) {
        setCurrAdmin(response.data?.admin);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getCurrentAdmin();
  }, []);

  const handleCloseModal = () => {
    setModalVisible(false);
    setActiveMessage(null);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && modalVisible) {
        handleCloseModal();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [modalVisible]);

  useEffect(() => {
    document.body.style.overflow = modalVisible ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [modalVisible]);
  // get all packages table
    const [tableData,setTableData]=useState(null)
    const getPackagesLog=async()=>{
      try {
        const response=await axios.get("http://localhost:8000/api/admin/get-all-packages")
        if(response.data.status){
          setTableData(response.data)
        }
      } catch (error) {
        console.log(error)
      }
    } 
    useEffect(()=>{
    getPackagesLog()
    },[])
  const getAdminInboxMsgs = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/api/admin/message/replies",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data?.status) {
        setGetInboxMsg(response.data?.data);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    // initial fetch
    getAdminInboxMsgs();
    // poll for new messages every 15 seconds
    const iv = setInterval(() => {
      getAdminInboxMsgs();
    }, 15000);
    return () => clearInterval(iv);
  }, []);
  // add points api here (admin)
  const addPts = async () => {
    const payload = {
      points: Number(addPoints.points),
      transactionPassword: addPoints.password,
    };
    try {
      const response = await axios.post(
        "http://localhost:8000/api/admin/add-points",
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data.status) {
        toast.success(response.data.message);
        setAddPoints({
          points: "",
          password: "",
        });
        getPoints();
      }else{
        toast.error(response.data.message)
      }
    } catch (error) {
      console.log;
    }
  };

  const getPoints = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/api/admin/get-points",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data.status) {
        // console.log(response.data.entries);
        setDisplayPoints(response.data.entries);
        toast.success(response.data.message);
      }
      toast.error(response.data.message);
    } catch (error) {
      toast.error("something went wrong");
    }
  };

  useEffect(() => {
    if (token !== null || token !== "") {
      getPoints();
      getFreePackage();
    }
  }, []);

  const showModal = (to, message, time) => {
    if (to || message || time) {
      setModalData({
        to: to || modalData.to,
        message: message || modalData.message,
        time: time || modalData.time,
      });
    }
    setIsModalOpen(true);
  };

  // packages api here
  const addMainPackage = async () => {
    const payload = {
      packageName: mainPackage.name,
      numberOfAddresses: mainPackage.address,
      memberCost: mainPackage.memberCost,
      adminShare: mainPackage.adminShare,
      validity: mainPackage.validity,
    };
    try {
      const response = await axios.post(
        "http://localhost:8000/api/admin/add-main-packages",
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data.status) {
        toast.success(response.data?.message || "Package added successfully");
        getMainPackage();
        return;
      }
      toast.error(response.data?.message || "something went wrong");
    } catch (error) {
      console.log(error);
    }
  };
  const getMainPackage = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/api/admin/get-main-packages",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data.status) {
        setDisplayMainPackage(response.data?.existingPackages || []);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const addVipPackage = async () => {
    const payload = {
      packageName: vipPackage.name,
      numberOfAddresses: vipPackage.address,
      memberCost: vipPackage.memberCost,
      adminShare: vipPackage.adminShare,
      validity: vipPackage.validity,
    };
    console.log(payload);
    try {
      const response = await axios.post(
        "http://localhost:8000/api/admin/add-vip-packages",
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data?.status) {
        toast.success(response.data?.message);
        getVipPackage();
        setVipPackage({
          name: "",
          address: "",
          adminShare: "",
          memberCost: "",
          validity: "",
        });
        return;
      }
    } catch (error) {
      console.log(error);
    }
  };
  const getVipPackage = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/api/admin/get-vip-packages",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setDisplayVipPackage(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (token !== null || token !== "") {
      getMainPackage();
      getVipPackage();
    }
  }, []);

  const createFreePackage = async () => {
    const payload = {
      NumOfFreeAddress: freePackage.addressCount,
      validity: Number(freePackage.validity),
    };
    console.log(payload);
    try {
      const response = await axios.post(
        "http://localhost:8000/api/admin/add-free-packages",
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data?.status) {
        toast.success(response.data?.message || "Package Added Successfully");
        setFreePackage({
          addressCount: "",
          validity: null,
        });
        getFreePackage();
        return;
      }
      toast.error(response.data?.message || "Something went wrong");
    } catch (error) {
      console.log(error);
    }
  };
  const getFreePackage = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/api/admin/get-free-packages",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data?.status) {
        setDisplayFreePackage(response.data?.freepackages || []);
      }
    } catch (error) {
      console.log(error);
    }
  };

  function timeAgo(date) {
    const now = new Date();
    const past = new Date(date);
    const seconds = Math.max(0, Math.floor((now - past) / 1000)); // prevent negative diff

    let interval = Math.floor(seconds / 31536000);
    if (interval >= 1) return `${interval} year${interval > 1 ? "s" : ""} ago`;

    interval = Math.floor(seconds / 2592000);
    if (interval >= 1) return `${interval} month${interval > 1 ? "s" : ""} ago`;

    interval = Math.floor(seconds / 86400);
    if (interval >= 1) return `${interval} day${interval > 1 ? "s" : ""} ago`;

    interval = Math.floor(seconds / 3600);
    if (interval >= 1) return `${interval} hour${interval > 1 ? "s" : ""} ago`;

    interval = Math.floor(seconds / 60);
    if (interval >= 1)
      return `${interval} minute${interval > 1 ? "s" : ""} ago`;

    return "Just now";
  }

  const createAddOnPackage = async () => {
    const payload = {
      packageName: addOnPackage.packageName,
      numberOfAddresses: Number(addOnPackage.address),
      memberCost: Number(addOnPackage.memberCost),
      distributorShare: Number(addOnPackage.distShare),
      franchiseShare: Number(addOnPackage.franchiseShare),
    };
    console.log(payload)
    try {
      const response = await axios.post(
        "http://localhost:8000/api/admin/add-addon-packages",
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response.data)
      if (response.data.status) {
        toast.success(response.data?.message || "Package created successfully");
        setAddOnPackage({
          packageName: "",
          address: "",
          memberCost: "",
          distShare: "",
          franchiseShare: "",
          validity: "",
        });
        getAddOnPackage();
        return;
      }
    } catch (error) {
      console.log(error);
    }
  };
  const getAddOnPackage = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/api/admin/get-addon-packages",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data?.status) {
        setDisplayAddOnPackage(response.data?.addOnPackages || []);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    if (token !== null || token !== "") {
      getFreePackage();
      getAddOnPackage();
    }
  }, []);

  // api calling
  // get franchises
  const getFranchises = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/api/user/get-franchises",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data.status === true) {
        setFranchises(response.data.franchises);
        return;
      }
    } catch (error) {
      console.log("something went wrong", error);
    }
  };

  const getDistributors = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/api/admin/get-distributors",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data.status === true) {
        setDistributor(response.data.result);
        return;
      }
      setDistributor([]);
    } catch (error) {
      console.log("something went wrong", error);
    }
  };

  const [page, setPage] = useState(0); // 0 = first page
  const pageSize = 20;
  const [totalUsers, setTotalUsers] = useState(0);

  const getMembers = async () => {
    const lowerLimit = 0;
    const upperLimit = 1000000;
    try {
      const response = await axios.get(
        `http://localhost:8000/api/admin/get-users?lowerLimit=${lowerLimit}&upperLimit=${upperLimit}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.status === true) {
        setMembers(response.data.users);
        setTotalUsers(response.data.users.length);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const loadMore = () => {
    setPage((prev) => prev + 1);
  };
  const seeLess = () => {
    setPage((prev) => prev - 1);
  };

  useEffect(() => {
    getFranchises();
    getDistributors();
    getMembers();
    // const interval = setInterval(() => {
    //   getFranchises();
    //   getDistributors();
    //   getMembers();
    // }, 5000);
    // return () => clearInterval(interval);
  }, []);

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  const togglePassword = () => {
    setIsPassword(!isPassword);
  };

  // message
  const sendMessage = async () => {
    const selected = selectedMembers.map((member) => member._id);
    const fran = selectedFranchise.map((franchise) => franchise._id);
    const dist = selectedDist.map((rec) => rec._id);
    const receiverIds = [...selected, ...fran, ...dist];
    console.log(receiverIds, message, token);
    try {
      const res = await axios.post(
        "http://localhost:8000/api/admin/message/send",
        {
          receiverIds,
          message,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (res.data?.status) {
        getAdminSentMsgs();
        toast.success(res.data?.message);
        setSelectedRecipients([]);
        setSelectedMembers([]);
        setSelectedFranchises([]);
        setMessage("");
        return;
      }
      toast.error(res.data?.message);
      console.log(res.data);
    } catch (error) {
      console.log(error);
    }
  };
  const isMemberSelected = (member) => {
    return selectedMembers.some((selected) => selected._id === member._id);
  };
  const isDistSelected = (member) => {
    return selectedDist.some((d) => d._id === member._id);
  };

  const handleSelectAllToggle = () => {
    if (selectedMembers.length === members.length) {
      // Deselect all
      setSelectedMembers([]);
    } else {
      // Select all
      setSelectedMembers(members);
    }
  };
  const handleSelectAllDistToggle = () => {
    if (selectedDist.length === distributor.length) {
      setSelectedDist([]); // unselect all
    } else {
      setSelectedDist(distributor); // select all
    }
  };

  const handleDistToggle = (member) => {
    setSelectedDist((prev) => {
      const alreadySelected = prev.some((d) => d._id === member._id);
      if (alreadySelected) {
        return prev.filter((d) => d._id !== member._id);
      } else {
        return [...prev, member];
      }
    });
  };

  const handleMemberToggle = (member) => {
    setSelectedMembers((prev) => {
      const isSelected = prev.some((selected) => selected._id === member._id);
      if (isSelected) {
        return prev.filter((selected) => selected._id !== member._id);
      } else {
        return [...prev, member];
      }
    });
  };
  const isFranchiseSelected = (franchise) => {
    return selectedFranchise.some((f) => f._id === franchise._id);
  };
  const handleFranchiseSelectAllToggle = () => {
    if (selectedFranchise.length === franchises.length) {
      setSelectedFranchises([]);
    } else {
      setSelectedFranchises(franchises);
    }
  };
  const handleFranchiseToggle = (franchise) => {
    setSelectedFranchises((prev) => {
      const isSelected = prev.some((f) => f._id === franchise._id);
      return isSelected
        ? prev.filter((f) => f._id !== franchise._id)
        : [...prev, franchise];
    });
  };

  const getAdminSentMsgs = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/api/admin/message/get-sendMessages",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data?.status) {
        setGetSentMsg(response.data?.data);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getAdminSentMsgs();
  }, []);

  const sidebarItems = {
    account: {
      title: "Account",
      icon: User,
      items: [
        { id: "home", label: "Home", icon: Home },
        { id: "addPoints", label: "Add Points", icon: Coins },
      ],
    },
    admin: {
      title: "Admin",
      icon: User,
      items: [
        { id: "createAdmin", label: "Create Admin", icon: User },
        { id: "viewAdmin", label: "View Admin", icon: Eye },
      ],
    },
    distributor: {
      title: "Distributor",
      icon: User,
      items: [
        { id: "createDistributor", label: "Create Distributor", icon: User },
        { id: "viewDistributor", label: "View Distributor", icon: Eye },
      ],
    },
    franchisee: {
      title: "Franchise",
      icon: User,
      items: [{ id: "viewFranchisee", label: "View Franchisee", icon: Eye }],
    },
    members: {
      title: "Members",
      icon: Users2,
      items: [
        { id: "viewMember", label: "View Member", icon: Eye },
        { id: "Memberpackages", label: "Packages", icon: Package },
        // { id: "editMember", label: "Edit Member", icon: Pen },
        // { id: "controlField", label: "Control Fields", icon: PlayCircle },
      ],
    },
    advertiser: {
      title: "Advertiser",
      icon: User,
      items: [
        { id: "viewAdvertiser", label: "View Advertiser", icon: Eye },
        { id: "packages", label: "Packages", icon: Package },
        { id: "advertisement", label: "Advertisement", icon: Video },
      ],
    },
    masters: {
      title: "Masters",
      icon: Users2,
      items: [
        { id: "freePackage", label: "Free Package", icon: Package },
        { id: "addOnPackages", label: "Add On Package", icon: Package },
        { id: "mainPackage", label: "Main Package", icon: Package },
        { id: "vipPackage", label: "VIP Package", icon: Package },
        { id: "listingPackage", label: "Listing Package", icon: Package },
        { id: "category", label: "Category / Services", icon: Heart },
        { id: "profileValidity", label: "Profile Validity", icon: User },
      ],
    },
    settings: {
      title: "Settings",
      icon: Settings,
      items: [
        { id: "changePassword", label: "Change Password", icon: Lock },
        {
          id: "TransactionPassword",
          label: "Transaction Password",
          icon: Lock,
        },
        // { id: "changeEmail", label: "Change Email", icon: Mail },
        { id: "settings", label: "Settings", icon: Settings2 },
      ],
    },
    messageBox: {
      title: "Message Box",
      icon: MessageSquare,
      items: [
        { id: "inbox", label: `Inbox ${getInboxMsg.length}`, icon: Inbox },
        { id: "sent", label: "Sent", icon: Send },
        { id: "compose", label: "Compose", icon: Edit3 },
      ],
    },
    Reports: {
      title: "Reports",
      icon: File,
      items: [
        // { id: "franchise", label: "Franchisee", icon: User },
        { id: "member", label: "Member", icon: User },
        { id: "advertiser", label: "Advertiser", icon: User },
      ],
    },
    Logout: {
      title: "Logout",
      icon: LogOut,
      items: [{ id: "logout", label: "Logout", icon: LogOut }],
    },
  };

  const renderContent = () => {
    const contentMap = {
      home: {
        title: "Dashboard Home",
        content: (
          <>
            <div className="mb-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              <div className="bg-white rounded-xl p-4 md:p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-[#7d0a0a] mb-2">
                  Total Members
                </h3>
                <p className="text-2xl md:text-3xl font-bold text-gray-800">
                  {members.length}
                </p>
              </div>
              <div className="bg-white rounded-xl p-4 md:p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-[#7d0a0a] mb-2">
                  Active Franchisee
                </h3>
                <p className="text-2xl md:text-3xl font-bold text-gray-800">
                  {franchises.length}
                </p>
              </div>
              <div className="bg-white rounded-xl p-4 md:p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-[#7d0a0a] mb-2">
                  Distributor
                </h3>
                <p className="text-2xl md:text-3xl font-bold text-gray-800">
                  {distributor.length}
                </p>
              </div>
            </div>
            <div className="w-full flex flex-col gap-4 rounded-md p-2 border border-gray-500">
              <div className="flex gap-3">
                <p className="font-semibold">Account Balance : </p>
                <p className="text-gray-500 font-semibold">
                  {currAdmin.points}
                </p>
              </div>
              {/* <div className="flex gap-3">
                  <p className="font-semibold">Member Registered By Me : </p>
                  <p className="text-gray-500 font-semibold">1</p>
                </div>
                <div className="flex gap-3">
                  <p className="font-semibold">
                    Advertisers Registered By Me :{" "}
                  </p>
                  <p className="text-gray-500 font-semibold">1</p>
                </div> */}
              <div className="flex gap-3">
                <p className="font-semibold">
                  Number of Free package subscribed member :{" "}
                </p>
                <p className="text-gray-500 font-semibold">1</p>
              </div>
              <div className="flex gap-3">
                <p className="font-semibold">
                  Number of Main package subscribed member :{" "}
                </p>
                <p className="text-gray-500 font-semibold">1</p>
              </div>
              <div className="flex gap-3">
                <p className="font-semibold">
                  Number of Add-on package subscribed member :{" "}
                </p>
                <p className="text-gray-500 font-semibold">1</p>
              </div>
              <div className="flex gap-3">
                <p className="font-semibold">
                  Number of VIP package subscribed member :{" "}
                </p>
                <p className="text-gray-500 font-semibold">1</p>
              </div>
            </div>
            <h2 className="w-full text-[#7d0a0a] my-3 mx-auto font-bold text-2xl text-center">Profile Details</h2>
            <div className="my-6 w-full flex flex-col gap-4 rounded-md p-2 border border-gray-500">
              <p>
                <span className="font-bold">Name : </span> {currAdmin.name}
              </p>
              <p>
                <span className="font-bold">Email : </span>
                {currAdmin.email}
              </p>
              <p>
                <span className="font-bold">Mobile Number : </span>
                <span>8208280085</span>
              </p>
              <div>
                <span className="font-bold">Address :</span>
                <p>
                  Manomilan Technologies Shop No. SF / 53, Vidarbha Sahitya
                  Sangh Sankul, Above Nilawar Saree Stores, Jhansi Rani Square,
                  Sitabuldi, Nagpur - 440012.
                </p>
              </div>
            </div>
          </>
        ),
      },
      addPoints: {
        title: "Add Points",
        content: (
          <div className="flex flex-col gap-4">
            <div className="bg-white rounded-xl p-4 md:p-6 shadow-sm flex flex-col gap-4">
              <table className="w-full flex flex-col gap-4 ">
                <tbody className="w-full flex flex-col gap-6 md:gap-8">
                  {/* Add Points */}
                  <tr className="flex flex-col md:flex-row md:items-center gap-2 md:gap-6 w-full">
                    <td className="font-semibold w-full md:w-1/3">
                      Add Points :
                    </td>
                    <td className="w-full md:flex-1">
                      <input
                        type="text"
                        placeholder="Enter Points"
                        className="w-full border border-gray-400 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                        onChange={(e) =>
                          setAddPoints((prev) => ({
                            ...prev,
                            points: e.target.value,
                          }))
                        }
                        value={addPoints.points}
                      />
                    </td>
                  </tr>

                  {/* Transaction Password */}
                  <tr className="flex flex-col md:flex-row md:items-center gap-2 md:gap-6 w-full">
                    <td className="font-semibold w-full md:w-1/3">
                      Enter Transaction Password :
                    </td>
                    <td className="w-full md:flex-1 flex items-center border border-gray-400 p-3 rounded-lg focus-within:ring-2 focus-within:ring-blue-500 transition">
                      <input
                        type={`${isPassword ? "text" : "password"}`}
                        placeholder="Enter Password"
                        className="flex-1 outline-none bg-transparent"
                        onChange={(e) =>
                          setAddPoints((prev) => ({
                            ...prev,
                            password: e.target.value,
                          }))
                        }
                        value={addPoints.password}
                      />
                      <span
                        className={`cursor-pointer ml-2 ${
                          isPassword ? "hidden" : "flex"
                        }`}
                        onClick={togglePassword}
                      >
                        <EyeClosed size={20} />
                      </span>
                      <span
                        className={`cursor-pointer ml-2 ${
                          isPassword ? "flex" : "hidden"
                        }`}
                        onClick={togglePassword}
                      >
                        <Eye size={20} />
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
              <div className="w-full text-end">
                <button
                  className="border px-3 py-2 rounded-xl font-semibold text-[#7d0a0a] cursor-pointer border-[#7d0a0a]"
                  onClick={addPts}
                >
                  Add Points
                </button>
              </div>
            </div>
            <div className="bg-white rounded-xl p-4 md:p-6 shadow-sm">
              <table className="w-full divide-y  divide-gray-200">
                <thead style={{ backgroundColor: "#7d0a0a" }}>
                  <tr>
                    <th className="px-6 py-2 text-left text-md font-medium text-white uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-2 text-left text-md font-medium text-white uppercase tracking-wider">
                      Points
                    </th>
                    <th className="px-6 py-2 text-left text-md font-medium text-white uppercase tracking-wider">
                      By
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {displayPoints.map((ele, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border-r border-gray-200">
                        {dateChanger(ele.createdAt)}
                      </td>
                      <td
                        className={`px-6 py-4 whitespace-nowrap text-sm ${
                          ele.points > 0 ? "text-green-600" : "text-red-600"
                        } text-gray-900 border-r border-gray-200`}
                      >
                        {ele.points}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border-r border-gray-200">
                        Admin
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ),
      },
      Memberpackages:{
        title:"Member Packages",
        content:(
          <PackageTable data={tableData}/>
        )
      },
      createAdmin: {
        title: "Create Admin",
        content: <AdminRegister />,
      },
      logout: {
        title: "Logout",
        content: (
          <>
            <div>Do You Want to logout?</div>
            <button
              onClick={() => LogOutBtn()}
              className="border-1 px-2 py-1 mt-4 font-bold cursor-pointer rounded-md border-red-500 bg-red-500 text-white "
            >
              LogOut
            </button>
          </>
        ),
      },
      viewAdmin: {
        title: "View Admin",
        content: (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <tr>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-[#7d0a0a] rounded-full flex items-center justify-center text-white text-sm font-medium">
                          S
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900">
                            Sudhanshu Mohod
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                      mymanomilan@gmail.com
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        Active
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                      <button className="text-[#7d0a0a] hover:text-[#6a0909] mr-3">
                        Edit
                      </button>
                      <button className="text-red-600 hover:text-red-900">
                        Delete
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        ),
      },
      packages: {
        title: "Packages",
        content: (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            <div className="bg-white rounded-xl p-4 md:p-6 shadow-sm border-2 border-blue-200">
              <h3 className="text-lg md:text-xl font-semibold mb-4 text-blue-600">
                Basic
              </h3>
              <p className="text-2xl md:text-3xl font-bold mb-4">
                ₹999
                <span className="text-sm md:text-lg font-normal">/month</span>
              </p>
              <ul className="space-y-2 mb-6 text-sm md:text-base">
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>10 Profile Views
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>Basic Matching
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>Email Support
                </li>
              </ul>
              <button className="w-full bg-blue-600 text-white py-2 md:py-3 rounded-lg hover:bg-blue-700 transition-colors text-sm md:text-base">
                Choose Plan
              </button>
            </div>

            <div className="bg-white rounded-xl p-4 md:p-6 shadow-sm border-2 border-purple-200">
              <h3 className="text-lg md:text-xl font-semibold mb-4 text-purple-600">
                Premium
              </h3>
              <p className="text-2xl md:text-3xl font-bold mb-4">
                ₹1999
                <span className="text-sm md:text-lg font-normal">/month</span>
              </p>
              <ul className="space-y-2 mb-6 text-sm md:text-base">
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>Unlimited
                  Profile Views
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>Advanced
                  Matching
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>Priority Support
                </li>
              </ul>
              <button className="w-full bg-purple-600 text-white py-2 md:py-3 rounded-lg hover:bg-purple-700 transition-colors text-sm md:text-base">
                Choose Plan
              </button>
            </div>

            <div className="bg-white rounded-xl p-4 md:p-6 shadow-sm border-2 border-yellow-200">
              <h3 className="text-lg md:text-xl font-semibold mb-4 text-yellow-600">
                Premium Plus
              </h3>
              <p className="text-2xl md:text-3xl font-bold mb-4">
                ₹2999
                <span className="text-sm md:text-lg font-normal">/month</span>
              </p>
              <ul className="space-y-2 mb-6 text-sm md:text-base">
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>Everything in
                  Premium
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>Personal
                  Consultant
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>24/7 Support
                </li>
              </ul>
              <button className="w-full bg-yellow-600 text-white py-2 md:py-3 rounded-lg hover:bg-yellow-700 transition-colors text-sm md:text-base">
                Choose Plan
              </button>
            </div>
          </div>
        ),
      },
      freePackage: {
        title: "Create Free Package",
        content: (
          <div className="flex flex-col gap-6">
            <div className="w-full flex gap-4 items-center">
              <label htmlFor="freePacakgeInp" className="font-semibold text-lg">
                Number Of FREE Address :{" "}
              </label>
              <input
                type="text"
                className="border border-gray-500 rounded-lg py-1 px-2 outline-0"
                placeholder="Enter Count"
                value={freePackage.addressCount || ""}
                onChange={(e) =>
                  setFreePackage((prev) => ({
                    ...prev,
                    addressCount: e.target.value,
                  }))
                }
              />
              <label htmlFor="freePacakgeInp" className="font-semibold text-lg">
                Validity :{" "}
              </label>
              <input
                type="number"
                className="border border-gray-500 text-black rounded-lg py-1 px-2 outline-0"
                placeholder="Enter Validity"
                value={
                  freePackage.validity === null ||
                  freePackage.validity === undefined
                    ? ""
                    : freePackage.validity
                }
                onChange={(e) => {
                  const val = e.target.value;
                  setFreePackage((prev) => ({
                    ...prev,
                    validity: val === "" ? null : Number(val),
                  }));
                }}
              />

              <button
                className="border bg-[#7d0a0a] border-[#7d0a0a] py-1 cursor-pointer px-4 rounded-lg font-semibold text-white"
                onClick={createFreePackage}
              >
                Add
              </button>
            </div>
            <div className="bg-white rounded-xl p-4 md:p-6 shadow-sm overflow-scroll md:overflow-scroll lg:overflow-scroll xl:overflow-hidden">
              <table className="w-full divide-y  divide-gray-200">
                <thead style={{ backgroundColor: "#7d0a0a" }}>
                  <tr>
                    <th className="px-6 py-2 text-left text-md font-medium text-white uppercase tracking-wider">
                      Package ID
                    </th>
                    <th className="text-center px-6 py-2 text-md font-medium text-white uppercase tracking-wider">
                      Addresses
                    </th>
                    <th className="text-center px-6 py-2 text-md font-medium text-white uppercase tracking-wider">
                      Validity
                    </th>
                    <th className="text-center px-6 py-2 text-md font-medium text-white uppercase tracking-wider">
                      Date of Creation
                    </th>
                    <th className="text-center px-6 py-2 text-md font-medium text-white uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {displayFreePackage.length > 0 ? (
                    displayFreePackage.map((ele, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border-r border-gray-200">
                          {ele.packageId}
                        </td>
                        <td className="px-6 text-center py-4 whitespace-nowrap text-sm text-gray-900 border-r border-gray-200">
                          {ele.NumOfFreeAddress}
                        </td>
                        <td className="px-6 text-center py-4 whitespace-nowrap text-sm text-gray-900 border-r border-gray-200">
                          {ele.validity}
                        </td>
                        <td className="px-6 text-center py-4 whitespace-nowrap text-sm text-gray-900 border-r border-gray-200">
                          {dateChanger(ele.createdAt)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-900 border-r border-gray-200">
                          <p
                            className={`px-3 py-1 font-semibold border rounded-lg ${
                              ele.status === "Active"
                                ? "text-green-500 border-green-500"
                                : "text-red-500 border-red-500"
                            } `}
                          >
                            {ele.status}
                          </p>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td className="p-3 w-full text-lg font-semibold">
                        No Data To Display
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        ),
      },
      mainPackage: {
        title: "Main Package",
        content: (
          <div className="flex flex-col gap-4">
            <div className="bg-white rounded-xl p-4 md:p-6 shadow-sm flex flex-col gap-4">
              {/* table generator  */}
              <table className="w-full flex flex-col gap-4 ">
                <tbody className="w-full flex flex-col gap-6 md:gap-8">
                  <tr className="flex flex-col md:flex-row md:items-center gap-2 md:gap-6 w-full">
                    <td className="font-semibold w-full md:w-1/3">
                      Package Name :
                    </td>
                    <td className="w-full md:flex-1">
                      <input
                        type="text"
                        placeholder="Enter Name"
                        className="w-full border border-gray-400 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                        onChange={(e) =>
                          setMainPackage((prev) => ({
                            ...prev,
                            name: e.target.value,
                          }))
                        }
                      />
                    </td>
                  </tr>
                  {/* Number of Addresses */}
                  <tr className="flex flex-col md:flex-row md:items-center gap-2 md:gap-6 w-full">
                    <td className="font-semibold w-full md:w-1/3">
                      Number of Addresses :
                    </td>
                    <td className="w-full md:flex-1">
                      <input
                        type="text"
                        placeholder="Enter Count"
                        className="w-full border border-gray-400 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                        onChange={(e) =>
                          setMainPackage((prev) => ({
                            ...prev,
                            address: e.target.value,
                          }))
                        }
                      />
                    </td>
                  </tr>

                  {/* Upper Limit */}
                  <tr className="flex flex-col md:flex-row md:items-center gap-2 md:gap-6 w-full">
                    <td className="font-semibold w-full md:w-1/3">
                      Member Cost :
                    </td>
                    <td className="w-full md:flex-1">
                      <input
                        type="text"
                        placeholder="Enter Limit"
                        className="w-full border border-gray-400 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                        onChange={(e) =>
                          setMainPackage((prev) => ({
                            ...prev,
                            memberCost: e.target.value,
                          }))
                        }
                      />
                    </td>
                  </tr>

                  {/* Admin Share */}
                  <tr className="flex flex-col md:flex-row md:items-center gap-2 md:gap-6 w-full">
                    <td className="font-semibold w-full md:w-1/3">
                      Admin Share :
                    </td>
                    <td className="w-full md:flex-1">
                      <input
                        type="text"
                        placeholder="Enter Share"
                        className="w-full border border-gray-400 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                        onChange={(e) =>
                          setMainPackage((prev) => ({
                            ...prev,
                            adminShare: e.target.value,
                          }))
                        }
                      />
                    </td>
                  </tr>

                  {/* Validity */}
                  <tr className="flex flex-col md:flex-row md:items-center gap-2 md:gap-6 w-full">
                    <td className="font-semibold w-full md:w-1/3">
                      Enter Validity ( in days ) :
                    </td>
                    <td className="w-full md:flex-1">
                      <input
                        type="text"
                        placeholder="Enter Validity"
                        className="w-full border border-gray-400 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                        onChange={(e) =>
                          setMainPackage((prev) => ({
                            ...prev,
                            validity: e.target.value,
                          }))
                        }
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
              <div className="w-full text-end">
                <button
                  className="border px-3 py-2 rounded-xl font-semibold text-[#7d0a0a] cursor-pointer border-[#7d0a0a]"
                  onClick={addMainPackage}
                >
                  Save
                </button>
              </div>
            </div>
            <div className="bg-white rounded-xl p-4 md:p-6 shadow-sm overflow-scroll md:overflow-scroll lg:overflow-scroll xl:overflow-hidden">
              <table className="w-full divide-y  divide-gray-200">
                <thead style={{ backgroundColor: "#7d0a0a" }}>
                  <tr>
                    <th className="px-6 py-2 text-left text-md font-medium text-white uppercase tracking-wider">
                      Package ID
                    </th>
                    <th className="px-6 py-2 text-left text-md font-medium text-white uppercase tracking-wider">
                      Package Name
                    </th>
                    <th className="px-6 py-2 text-left text-md font-medium text-white uppercase tracking-wider">
                      Date of Creation
                    </th>
                    <th className="px-6 py-2 text-left text-md font-medium text-white uppercase tracking-wider">
                      Addresses
                    </th>
                    <th className="px-6 py-2 text-left text-md font-medium text-white uppercase tracking-wider">
                      Admin Share
                    </th>
                    <th className="px-6 py-2 text-left text-md font-medium text-white uppercase tracking-wider">
                      Member Cost
                    </th>
                    <th className="px-6 py-2 text-left text-md font-medium text-white uppercase tracking-wider">
                      Validity
                    </th>
                    <th className="px-6 py-2 text-left text-md font-medium text-white uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {displayMainPackage.length > 0 ? (
                    displayMainPackage.map((ele) => (
                      <tr key={ele._id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border-r border-gray-200">
                          {ele.packageId}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border-r border-gray-200">
                          {ele.packageName}
                        </td>
                        <td className="px-6 text-center py-4 whitespace-nowrap text-sm text-gray-900 border-r border-gray-200">
                          {dateChanger(ele.createdAt)}
                        </td>
                        <td className="px-6 text-center py-4 whitespace-nowrap text-sm text-gray-900 border-r border-gray-200">
                          {ele.numberOfAddresses}
                        </td>
                        <td className="px-6 text-center py-4 whitespace-nowrap text-sm text-gray-900 border-r border-gray-200">
                          {ele.adminShare}
                        </td>
                        <td className="px-6 text-center py-4 whitespace-nowrap text-sm text-gray-900 border-r border-gray-200">
                          {ele.memberCost}
                        </td>
                        <td className="px-6 text-center py-4 whitespace-nowrap text-sm text-gray-900 border-r border-gray-200">
                          {ele.validity}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-900 border-r border-gray-200">
                          <p
                            className={`px-3 py-1 font-semibold border rounded-lg ${
                              ele.status === "Active"
                                ? "text-green-500 border-green-500"
                                : "text-red-500 border-red-500"
                            } `}
                          >
                            {ele.status}
                          </p>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td>No package to display</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        ),
      },
      vipPackage: {
        title: "VIP Package",
        content: (
          <div className="flex flex-col gap-4">
            <div className="bg-white rounded-xl p-4 md:p-6 shadow-sm flex flex-col gap-4">
              {/* table generator  */}
              <table className="w-full flex flex-col gap-4 ">
                <tbody className="w-full flex flex-col gap-6 md:gap-8">
                  <tr className="flex flex-col md:flex-row md:items-center gap-2 md:gap-6 w-full">
                    <td className="font-semibold w-full md:w-1/3">
                      Package Name :
                    </td>
                    <td className="w-full md:flex-1">
                      <input
                        type="text"
                        value={vipPackage.name || ""}
                        placeholder="Enter Name"
                        className="w-full border border-gray-400 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                        onChange={(e) =>
                          setVipPackage((prev) => ({
                            ...prev,
                            name: e.target.value,
                          }))
                        }
                      />
                    </td>
                  </tr>
                  {/* Number of Addresses */}
                  <tr className="flex flex-col md:flex-row md:items-center gap-2 md:gap-6 w-full">
                    <td className="font-semibold w-full md:w-1/3">
                      Number of Addresses :
                    </td>
                    <td className="w-full md:flex-1">
                      <input
                        type="text"
                        placeholder="Enter Count"
                        value={vipPackage.address || ""}
                        className="w-full border border-gray-400 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                        onChange={(e) =>
                          setVipPackage((prev) => ({
                            ...prev,
                            address: e.target.value,
                          }))
                        }
                      />
                    </td>
                  </tr>

                  {/* Upper Limit */}
                  <tr className="flex flex-col md:flex-row md:items-center gap-2 md:gap-6 w-full">
                    <td className="font-semibold w-full md:w-1/3">
                      Member Cost :
                    </td>
                    <td className="w-full md:flex-1">
                      <input
                        type="text"
                        value={vipPackage.memberCost || ""}
                        placeholder="Enter Cost"
                        className="w-full border border-gray-400 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                        onChange={(e) =>
                          setVipPackage((prev) => ({
                            ...prev,
                            memberCost: e.target.value,
                          }))
                        }
                      />
                    </td>
                  </tr>

                  {/* Admin Share */}
                  <tr className="flex flex-col md:flex-row md:items-center gap-2 md:gap-6 w-full">
                    <td className="font-semibold w-full md:w-1/3">
                      Admin Share :
                    </td>
                    <td className="w-full md:flex-1">
                      <input
                        type="text"
                        value={vipPackage.adminShare || ""}
                        placeholder="Enter Share"
                        className="w-full border border-gray-400 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                        onChange={(e) =>
                          setVipPackage((prev) => ({
                            ...prev,
                            adminShare: e.target.value,
                          }))
                        }
                      />
                    </td>
                  </tr>

                  {/* Validity */}
                  <tr className="flex flex-col md:flex-row md:items-center gap-2 md:gap-6 w-full">
                    <td className="font-semibold w-full md:w-1/3">
                      Enter Validity ( in days ) :
                    </td>
                    <td className="w-full md:flex-1">
                      <input
                        type="text"
                        value={vipPackage.validity || ""}
                        placeholder="Enter Validity"
                        className="w-full border border-gray-400 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                        onChange={(e) =>
                          setVipPackage((prev) => ({
                            ...prev,
                            validity: e.target.value,
                          }))
                        }
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
              <div className="w-full text-end">
                <button
                  className="border px-3 py-2 rounded-xl font-semibold text-[#7d0a0a] cursor-pointer border-[#7d0a0a]"
                  onClick={addVipPackage}
                >
                  Save
                </button>
              </div>
            </div>
            <div className="bg-white rounded-xl p-4 md:p-6 shadow-sm overflow-scroll md:overflow-scroll lg:overflow-scroll xl:overflow-hidden">
              <table className="w-full divide-y  divide-gray-200">
                <thead style={{ backgroundColor: "#7d0a0a" }}>
                  <tr>
                    <th className="px-6 py-2 text-left text-md font-medium text-white uppercase tracking-wider">
                      Package ID
                    </th>
                    <th className="px-6 py-2 text-left text-md font-medium text-white uppercase tracking-wider">
                      Package Name
                    </th>
                    <th className="px-6 py-2 text-left text-md font-medium text-white uppercase tracking-wider">
                      Date of Creation
                    </th>
                    <th className="px-6 py-2 text-left text-md font-medium text-white uppercase tracking-wider">
                      Addresses
                    </th>
                    <th className="px-6 py-2 text-left text-md font-medium text-white uppercase tracking-wider">
                      Admin Share
                    </th>
                    <th className="px-6 py-2 text-left text-md font-medium text-white uppercase tracking-wider">
                      Member Cost
                    </th>
                    <th className="px-6 py-2 text-left text-md font-medium text-white uppercase tracking-wider">
                      Validity
                    </th>
                    <th className="px-6 py-2 text-left text-md font-medium text-white uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {displayVipPackage.length > 0 ? (
                    displayVipPackage.map((pack) => (
                      <tr key={pack._id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border-r border-gray-200">
                          {pack.packageId}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border-r border-gray-200">
                          {pack.packageName}
                        </td>
                        <td className="px-6 text-center py-4 whitespace-nowrap text-sm text-gray-900 border-r border-gray-200">
                          {dateChanger(pack.createdAt)}
                        </td>
                        <td className="px-6 text-center py-4 whitespace-nowrap text-sm text-gray-900 border-r border-gray-200">
                          {pack.numberOfAddresses}
                        </td>
                        <td className="px-6 text-center py-4 whitespace-nowrap text-sm text-gray-900 border-r border-gray-200">
                          {pack.adminShare}
                        </td>
                        <td className="px-6 text-center py-4 whitespace-nowrap text-sm text-gray-900 border-r border-gray-200">
                          {pack.memberCost}
                        </td>
                        <td className="px-6 text-center py-4 whitespace-nowrap text-sm text-gray-900 border-r border-gray-200">
                          {pack.validity}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-900 border-r border-gray-200">
                          <p
                            className={`px-3 py-1 font-semibold border rounded-lg ${
                              pack.status === "Active"
                                ? "text-green-500 border-green-500"
                                : "text-red-500 border-red-500"
                            } `}
                          >
                            {pack.status}
                          </p>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td>No Vip Package to display</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        ),
      },
      addOnPackages: {
        title: "Add on Package",
        content: (
          <div className="w-full flex flex-col gap-6">
            <div className="bg-white rounded-xl p-4 md:p-6 shadow-sm flex flex-col gap-4">
              {/* table generator  */}
              <table className="w-full flex flex-col gap-4 ">
                <tbody className="w-full flex flex-col gap-6 md:gap-8">
                  {/* Package Name */}
                  <tr className="flex flex-col md:flex-row md:items-center gap-2 md:gap-6 w-full">
                    <td className="font-semibold w-full md:w-1/3">
                      Package Name :
                    </td>
                    <td className="w-full md:flex-1">
                      <input
                        type="text"
                        placeholder="Enter Name"
                        className="w-full border border-gray-400 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                        onChange={(e) =>
                          setAddOnPackage((prev) => ({
                            ...prev,
                            packageName: e.target.value,
                          }))
                        }
                        value={addOnPackage.packageName || ""}
                      />
                    </td>
                  </tr>

                  {/* Number of Addresses */}
                  <tr className="flex flex-col md:flex-row md:items-center gap-2 md:gap-6 w-full">
                    <td className="font-semibold w-full md:w-1/3">
                      Number of Addresses :
                    </td>
                    <td className="w-full md:flex-1">
                      <input
                        type="text"
                        placeholder="Enter Count"
                        className="w-full border border-gray-400 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                        onChange={(e) =>
                          setAddOnPackage((prev) => ({
                            ...prev,
                            address: e.target.value,
                          }))
                        }
                        value={addOnPackage.address || ""}
                      />
                    </td>
                  </tr>

                  {/* Member Cost */}
                  <tr className="flex flex-col md:flex-row md:items-center gap-2 md:gap-6 w-full">
                    <td className="font-semibold w-full md:w-1/3">
                      Member Cost :
                    </td>
                    <td className="w-full md:flex-1">
                      <input
                        type="text"
                        placeholder="Enter Cost"
                        className="w-full border border-gray-400 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                        onChange={(e) =>
                          setAddOnPackage((prev) => ({
                            ...prev,
                            memberCost: e.target.value,
                          }))
                        }
                        value={addOnPackage.memberCost || ""}
                      />
                    </td>
                  </tr>

                  {/* Distributor Share */}
                  <tr className="flex flex-col md:flex-row md:items-center gap-2 md:gap-6 w-full">
                    <td className="font-semibold w-full md:w-1/3">
                      Distributor Share :
                    </td>
                    <td className="w-full md:flex-1">
                      <input
                        type="text"
                        placeholder="Enter Share"
                        className="w-full border border-gray-400 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                        onChange={(e) =>
                          setAddOnPackage((prev) => ({
                            ...prev,
                            distShare: e.target.value,
                          }))
                        }
                        value={addOnPackage.distShare || ""}
                      />
                    </td>
                  </tr>

                  {/* Franchise Share */}
                  <tr className="flex flex-col md:flex-row md:items-center gap-2 md:gap-6 w-full">
                    <td className="font-semibold w-full md:w-1/3">
                      Franchise Share :
                    </td>
                    <td className="w-full md:flex-1">
                      <input
                        type="text"
                        placeholder="Enter Share"
                        className="w-full border border-gray-400 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                        onChange={(e) =>
                          setAddOnPackage((prev) => ({
                            ...prev,
                            franchiseShare: e.target.value,
                          }))
                        }
                        value={addOnPackage.franchiseShare || ""}
                      />
                    </td>
                  </tr>

                  {/* <tr className="flex flex-col md:flex-row md:items-center gap-2 md:gap-6 w-full">
                    <td className="font-semibold w-full md:w-1/3">
                      Validity :
                    </td>
                    <td className="w-full md:flex-1">
                      <input
                        type="text"
                        placeholder="Enter Validity"
                        className="w-full border border-gray-400 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                        onChange={(e) =>
                          setAddOnPackage((prev) => ({
                            ...prev,
                            validity: e.target.value,
                          }))
                        }
                        value={addOnPackage.validity || ""}
                      />
                    </td>
                  </tr> */}
                </tbody>
              </table>
              <div className="w-full text-end">
                <button
                  className="border px-3 py-2 rounded-xl font-semibold text-[#7d0a0a] cursor-pointer border-[#7d0a0a]"
                  onClick={createAddOnPackage}
                >
                  Save
                </button>
              </div>
            </div>
            <div className="bg-white rounded-xl p-4 md:p-6 shadow-sm overflow-scroll md:overflow-scroll lg:overflow-scroll xl:overflow-hidden">
              <table className="w-full divide-y  divide-gray-200">
                <thead style={{ backgroundColor: "#7d0a0a" }}>
                  <tr>
                    <th className="px-6 py-2 text-left text-md font-medium text-white uppercase tracking-wider">
                      ID
                    </th>
                    <th className="px-6 py-2 text-left text-md font-medium text-white uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-2 text-left text-md font-medium text-white uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-2 text-left text-md font-medium text-white uppercase tracking-wider">
                      Addresses
                    </th>
                    <th className="px-6 py-2 text-left text-md font-medium text-white uppercase tracking-wider">
                      Cost
                    </th>
                    <th className="px-6 py-2 text-left text-md font-medium text-white uppercase tracking-wider">
                      Distributor Share
                    </th>
                    <th className="px-6 py-2 text-left text-md font-medium text-white uppercase tracking-wider">
                      Franchise Share
                    </th>
                    <th className="px-6 py-2 text-left text-md font-medium text-white uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {displayAddOnPackage.length > 0 ? (
                    displayAddOnPackage.map((pack, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border-r border-gray-200">
                          {pack.packageId}
                        </td>
                        <td className="px-6 text-center py-4 whitespace-nowrap text-sm text-gray-900 border-r border-gray-200">
                          {dateChanger(pack.createdAt)}
                        </td>
                        <td className="px-6 text-center py-4 whitespace-nowrap text-sm text-gray-900 border-r border-gray-200">
                          {pack.packageName}
                        </td>
                        <td className="px-6 text-center py-4 whitespace-nowrap text-sm text-gray-900 border-r border-gray-200">
                          {pack.numberOfAddresses}
                        </td>
                        <td className="px-6 text-center py-4 whitespace-nowrap text-sm text-gray-900 border-r border-gray-200">
                          {pack.memberCost}
                        </td>
                        <td className="px-6 text-center py-4 whitespace-nowrap text-sm text-gray-900 border-r border-gray-200">
                          {pack.distributorShare}
                        </td>
                        <td className="px-6 text-center py-4 whitespace-nowrap text-sm text-gray-900 border-r border-gray-200">
                          {pack.franchiseShare}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-900 border-r border-gray-200">
                          <p
                            className={`px-3 py-1 font-semibold border rounded-lg ${
                              pack.status
                                ? "text-green-500 border-green-500"
                                : "text-red-500 border-red-500"
                            } `}
                          >
                            {pack.status}
                          </p>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>No data to Display</tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        ),
      },
      createDistributor: {
        title: "Create Distributor",
        content: <DistributorRegistrationForm />,
      },
      viewDistributor: {
        title: "View Distributor",
        content: (
          <TableGenerator data={distributor} activeTab="viewDistributor" />
        ),
      },
      viewFranchisee: {
        title: "View franchise",
        content: (
          <FranchiseeTable data={franchises} activeTab="viewFranchise" />
        ),
      },
      viewMember: {
        title: "View Member",
        content: (
          <MemberTable
            data={members}
            token={token}
            currentPage={page}
            pageSize={pageSize}
            totalUsers={totalUsers}
            onPageChange={(newPage) => setPage(newPage)}
          />
        ),
      },
      // editMember: {
      //   title: "Edit Member",
      //   content: (
      //     <EditMemberTable
      //       data={members}
      //       token={token}
      //       currentPage={page}
      //       pageSize={pageSize}
      //       totalUsers={totalUsers}
      //       onPageChange={(newPage) => setPage(newPage)}
      //     />
      //   ),
      // },
      settings: {
        title: "Settings",
        content: (
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4">
              <button
                className={`py-2 px-2 md:px-4 border border-[#7d0a0a] rounded-md shadow-md cursor-pointer font-semibold text-[#7d0a0a] text-xs md:text-sm ${
                  open === "one" ? "bg-[#7d0a0a] text-white" : ""
                }`}
                onClick={() => setOpen("one")}
              >
                Location
              </button>
              <button
                className={`py-2 px-2 md:px-4 border border-[#7d0a0a] rounded-md shadow-md cursor-pointer font-semibold text-[#7d0a0a] text-xs md:text-sm ${
                  open === "two" ? "bg-[#7d0a0a] text-white" : ""
                }`}
                onClick={() => setOpen("two")}
              >
                Castes
              </button>
              <button
                className={`py-2 px-2 md:px-4 border border-[#7d0a0a] rounded-md shadow-md cursor-pointer font-semibold text-[#7d0a0a] text-xs md:text-sm ${
                  open === "three" ? "bg-[#7d0a0a] text-white" : ""
                }`}
                onClick={() => setOpen("three")}
              >
                Education
              </button>
              <button
                className={`py-2 px-2 md:px-4 border border-[#7d0a0a] rounded-md shadow-md cursor-pointer font-semibold text-[#7d0a0a] text-xs md:text-sm ${
                  open === "four" ? "bg-[#7d0a0a] text-white" : ""
                }`}
                onClick={() => setOpen("four")}
              >
                Other Settings
              </button>
            </div>
            <div>
              {open === "one" && <CountrySettings />}
              {open === "two" && <ReligionSetting />}
              {open === "three" && <EducationSetting />}
              {open === "four" && <OtherSettings />}
            </div>
          </div>
        ),
      },
      sent: {
        title: "Sent",
        content: (
          <>
            <div className="p-5 bg-gray-100 min-h-screen">
              <div className="hover:bg-gray-50 cursor-pointer space-y-2">
                {getSentMsg.map((message) => (
                  <div
                    key={message._id}
                    onClick={() => handleOpenModal(message)}
                    className="border border-gray-500 p-4 rounded-md flex items-center space-x-3 hover:bg-gray-100 transition-colors duration-200"
                  >
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                      {message.to.length < 3
                        ? message.to.map((ele) => ele.charAt(0)).join("")
                        : `${message.to.length}`}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center">
                        <h4 className="font-semibold truncate">
                          {message.to.join(", ")}
                        </h4>
                        <span className="text-sm text-gray-500 whitespace-nowrap ml-2">
                          {timeAgo(message.createdAt)}
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm truncate">
                        {message.message}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {modalVisible && (
                <div
                  className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 transition-all duration-300"
                  onClick={handleCloseModal}
                >
                  <div
                    className="bg-white rounded-xl w-11/12 max-w-lg max-h-[80vh] overflow-hidden shadow-2xl transform transition-all duration-300"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="px-6 py-5 pb-4 border-b border-gray-200 flex justify-between items-center">
                      <h3 className="text-lg font-semibold text-gray-800">
                        Message Details
                      </h3>
                      <button
                        onClick={handleCloseModal}
                        className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded p-1 transition-colors duration-200 text-2xl leading-none"
                      >
                        ×
                      </button>
                    </div>

                    <div className="px-6 py-6 max-h-[60vh] overflow-y-auto">
                      {activeMessage && (
                        <>
                          <div className="mb-5">
                            <label className="block text-sm font-medium text-gray-600 mb-1.5">
                              To:
                            </label>
                            <div className="bg-gray-50 border border-gray-200 rounded-md px-3 py-3 text-sm text-gray-800 min-h-[44px] break-words">
                              {activeMessage.to.join(", ")}
                            </div>
                          </div>

                          <div className="mb-5">
                            <label className="block text-sm font-medium text-gray-600 mb-1.5">
                              Message:
                            </label>
                            <div className="bg-gray-50 border border-gray-200 rounded-md px-3 py-3 text-sm text-gray-800 min-h-[100px] whitespace-pre-wrap break-words leading-relaxed">
                              {activeMessage.message}
                            </div>
                          </div>

                          <div className="mb-0">
                            <label className="block text-sm font-medium text-gray-600 mb-1.5">
                              Time:
                            </label>
                            <div className="bg-gray-50 border border-gray-200 rounded-md px-3 py-3 text-sm text-gray-600 min-h-[44px] font-mono">
                              {timeAgo(activeMessage.createdAt)}
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </>
        ),
      },
      inbox: {
        title: "Inbox",
        content: (
          <div className="space-y-4">
            <div className="bg-white rounded-xl shadow-sm">
              <div className="p-4 border-b">
                <h3 className="text-lg font-semibold">
                  Messages {`(${getInboxMsg.length})`}
                </h3>
              </div>
              <div className="divide-y">
                {getInboxMsg.length > 0 ? (
                  getInboxMsg.map((ele, index) => (
                    <div
                      className="p-4 hover:bg-gray-50 cursor-pointer"
                      key={ele._id}
                    >
                      <div
                        className="flex items-center space-x-3"
                        onClick={() => handleOpenModal(ele)}
                      >
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold"></div>
                        <div className="flex-1">
                          <div className="flex justify-between items-center">
                            <h4 className="font-semibold">
                              {ele.to.map((e) => e).join(" , ")}
                            </h4>
                            <span className="text-sm text-gray-500">
                              {timeAgo(ele.createdAt)}
                            </span>
                          </div>
                          <p className="text-gray-600 text-sm">{ele.message}</p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p>No message to Display</p>
                )}
              </div>
            </div>
            {isModalOpen && (
              <div
                className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 transition-all duration-300 ${
                  isModalOpen ? "opacity-100 visible" : "opacity-0 invisible"
                }`}
                onClick={hideModal}
              >
                {/* Modal Container */}
                <div
                  className={`bg-white rounded-xl w-11/12 max-w-lg max-h-[80vh] overflow-hidden shadow-2xl transform transition-all duration-300 ${
                    isModalOpen
                      ? "translate-y-0 scale-100"
                      : "translate-y-8 scale-95"
                  }`}
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Modal Header */}
                  <div className="px-6 py-5 pb-4 border-b border-gray-200 flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-gray-800">
                      Message Details
                    </h3>
                    <button
                      onClick={hideModal}
                      className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded p-1 transition-colors duration-200 text-2xl leading-none"
                    >
                      ×
                    </button>
                  </div>

                  {/* Modal Body */}
                  <div className="px-6 py-6 max-h-[60vh] overflow-y-auto">
                    <div className="mb-5">
                      <label className="block text-sm font-medium text-gray-600 mb-1.5">
                        to:
                      </label>
                      <div className="bg-gray-50 border border-gray-200 rounded-md px-3 py-3 text-sm text-gray-800 min-h-[44px] break-words">
                        {getInboxMsg[msgId].to.map((ele) => (
                          <p>{ele}</p>
                        ))}
                      </div>
                    </div>

                    <div className="mb-5">
                      <label className="block text-sm font-medium text-gray-600 mb-1.5">
                        from:
                      </label>
                      <div className="bg-gray-50 border border-gray-200 rounded-md px-3 py-3 text-sm text-gray-800 min-h-[44px] break-words">
                        {getInboxMsg[msgId].from}
                      </div>
                    </div>

                    <div className="mb-5">
                      <label className="block text-sm font-medium text-gray-600 mb-1.5">
                        Message:
                      </label>
                      <div className="bg-gray-50 border border-gray-200 rounded-md px-3 py-3 text-sm text-gray-800 min-h-[100px] whitespace-pre-wrap break-words leading-relaxed">
                        {getInboxMsg[msgId].message}
                      </div>
                    </div>

                    <div className="mb-0">
                      <label className="block text-sm font-medium text-gray-600 mb-1.5">
                        Time:
                      </label>
                      <div className="bg-gray-50 border border-gray-200 rounded-md px-3 py-3 text-sm text-gray-600 min-h-[44px] font-mono">
                        {timeAgo(getInboxMsg[msgId].createdAt)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ),
      },
      compose: {
        title: "Compose Message",
        content: (
          <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm w-full">
            <div className="space-y-4 w-full">
              {/* TO Section */}
              <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                To
              </label>

              {/* DROPDOWN WRAPPER */}
              <div className="w-full flex flex-col sm:flex-row sm:flex-wrap gap-3 sm:gap-4">
                {/* MEMBER DROPDOWN */}
                <div className="relative w-full sm:w-1/2 lg:w-1/4">
                  <div
                    className="py-2 px-3 rounded-md border border-gray-400 cursor-pointer bg-white flex justify-between items-center"
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  >
                    <span className="text-gray-700 text-sm sm:text-base truncate">
                      {selectedMembers.length === 0
                        ? "Select Members"
                        : `${selectedMembers.length} member(s) selected`}
                    </span>
                    <svg
                      className={`w-4 h-4 transition-transform ${
                        isDropdownOpen ? "rotate-180" : ""
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>

                  {isDropdownOpen && (
                    <>
                      <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-400 rounded-md shadow-lg z-10 max-h-48 sm:max-h-60 overflow-y-auto">
                        {members.length > 0 ? (
                          members.map((member) => (
                            <div
                              key={member._id}
                              className="flex items-center px-3 py-2 hover:bg-gray-100 cursor-pointer"
                              onClick={() => handleMemberToggle(member)}
                            >
                              <input
                                type="checkbox"
                                checked={isMemberSelected(member)}
                                onChange={() => {}}
                                className="mr-2 h-4 w-4 text-blue-600 rounded border-gray-300"
                              />
                              <span className="text-gray-700 text-sm">
                                {member.firstName} {member.lastName}
                              </span>
                            </div>
                          ))
                        ) : (
                          <div className="px-3 py-2 text-gray-500 text-sm">
                            No members
                          </div>
                        )}
                      </div>
                      <div
                        className="flex items-center px-3 py-2 border-b hover:bg-gray-100 cursor-pointer bg-white"
                        onClick={handleSelectAllToggle}
                      >
                        <input
                          type="checkbox"
                          checked={selectedMembers.length === members.length}
                          onChange={() => {}}
                          className="mr-2 h-4 w-4 text-blue-600 rounded border-gray-300"
                        />
                        <span className="text-gray-700 font-medium text-sm">
                          Select All
                        </span>
                      </div>
                    </>
                  )}
                </div>

                {/* FRANCHISE DROPDOWN */}
                <div className="relative w-full sm:w-1/2 lg:w-1/4">
                  <div
                    className="py-2 px-3 rounded-md border border-gray-400 cursor-pointer bg-white flex justify-between items-center"
                    onClick={() =>
                      setIsFranchiseDropdownOpen(!isFranchiseDropdownOpen)
                    }
                  >
                    <span className="text-gray-700 text-sm sm:text-base truncate">
                      {selectedFranchise.length === 0
                        ? "Select Franchises"
                        : `${selectedFranchise.length} franchise(s) selected`}
                    </span>
                    <svg
                      className={`w-4 h-4 transition-transform ${
                        isFranchiseDropdownOpen ? "rotate-180" : ""
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>

                  {isFranchiseDropdownOpen && (
                    <>
                      <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-400 rounded-md shadow-lg z-10 max-h-48 sm:max-h-60 overflow-y-auto">
                        {franchises.length > 0 ? (
                          franchises.map((franchise) => (
                            <div
                              key={franchise._id}
                              className="flex items-center px-3 py-2 hover:bg-gray-100 cursor-pointer"
                              onClick={() => handleFranchiseToggle(franchise)}
                            >
                              <input
                                type="checkbox"
                                checked={isFranchiseSelected(franchise)}
                                onChange={() => {}}
                                className="mr-2 h-4 w-4 text-blue-600 rounded border-gray-300"
                              />
                              <span className="text-gray-700 text-sm">
                                {franchise.franchiseName}
                              </span>
                            </div>
                          ))
                        ) : (
                          <div className="px-3 py-2 text-gray-500 text-sm">
                            No franchises
                          </div>
                        )}
                      </div>
                      <div
                        className="flex items-center px-3 py-2 border-b hover:bg-gray-100 cursor-pointer bg-white"
                        onClick={handleFranchiseSelectAllToggle}
                      >
                        <input
                          type="checkbox"
                          checked={
                            selectedFranchise.length === franchises.length
                          }
                          onChange={() => {}}
                          className="mr-2 h-4 w-4 text-blue-600 rounded border-gray-300"
                        />
                        <span className="text-gray-700 font-medium text-sm">
                          Select All
                        </span>
                      </div>
                    </>
                  )}
                </div>

                {/* DISTRIBUTOR DROPDOWN */}
                <div className="relative w-full sm:w-1/2 lg:w-1/4">
                  <div
                    className="py-2 px-3 rounded-md border border-gray-400 cursor-pointer bg-white flex justify-between items-center"
                    onClick={() => setIsDistDropdownOpen(!isDistDropdownOpen)}
                  >
                    <span className="text-gray-700 text-sm sm:text-base truncate">
                      {selectedDist.length === 0
                        ? "Select Distributors"
                        : `${selectedDist.length} distributor(s) selected`}
                    </span>
                    <svg
                      className={`w-4 h-4 transition-transform ${
                        isDistDropdownOpen ? "rotate-180" : ""
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>

                  {isDistDropdownOpen && (
                    <>
                      <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-400 rounded-md shadow-lg z-10 max-h-48 sm:max-h-60 overflow-y-auto">
                        {distributor.length > 0 ? (
                          distributor.map((member) => (
                            <div
                              key={member._id}
                              className="flex items-center px-3 py-2 hover:bg-gray-100 cursor-pointer"
                              onClick={() => handleDistToggle(member)}
                            >
                              <input
                                type="checkbox"
                                checked={isDistSelected(member)}
                                onChange={() => {}}
                                className="mr-2 h-4 w-4 text-blue-600 rounded border-gray-300"
                              />
                              <span className="text-gray-700 text-sm">
                                {member.distributorName}
                              </span>
                            </div>
                          ))
                        ) : (
                          <div className="px-3 py-2 text-gray-500 text-sm">
                            No Distributors
                          </div>
                        )}
                      </div>
                      <div
                        className="flex items-center px-3 py-2 border-b hover:bg-gray-100 cursor-pointer bg-white"
                        onClick={handleSelectAllDistToggle}
                      >
                        <input
                          type="checkbox"
                          checked={
                            selectedDist.length > 0 &&
                            selectedDist.length === distributor.length
                          }
                          onChange={() => {}}
                          className="mr-2 h-4 w-4 text-blue-600 rounded border-gray-300"
                        />
                        <span className="text-gray-700 font-medium text-sm">
                          Select All
                        </span>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* MESSAGE BOX */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                  Message
                </label>
                <textarea
                  className="w-full p-3 border border-gray-300 rounded-lg h-28 sm:h-32 text-sm sm:text-base resize-none"
                  placeholder="Write your message here..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                ></textarea>
              </div>

              {/* BUTTONS */}
              <div className="flex flex-col sm:flex-row sm:space-x-3 space-y-3 sm:space-y-0">
                <button
                  className="w-full sm:w-auto bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base"
                  onClick={sendMessage}
                >
                  Send Message
                </button>
                <button className="w-full sm:w-auto border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors text-sm sm:text-base">
                  Save Draft
                </button>
              </div>
            </div>
          </div>
        ),
      },
      member: {
        title: "Member",
        content: (
          <>
            <MatrimonialForm />
          </>
        ),
      },
      changePassword: {
        title: "Change Password",
        content: <PasswordChangeComponent currAdmin={currAdmin} />,
      },
      TransactionPassword: {
        title: "Change Transaction Password",
        content: (
          <div className="w-full flex justify-center">
            <TransactionPasswordChangeComponent adminId={currAdmin._id} token={token}/>
            <TransactionPasswordChangeComponentForDist />
          </div>
        ),
      },
    };

    const defaultContent = {
      title:
        activeSection.charAt(0).toUpperCase() +
        activeSection.slice(1).replace(/([A-Z])/g, " $1"),
      content: (
        <div className="bg-white rounded-xl p-4 md:p-6 shadow-sm">
          <p className="text-gray-600 text-sm md:text-base">
            Content for {activeSection.replace(/([A-Z])/g, " $1")} will be
            displayed here.
          </p>
        </div>
      ),
    };

    return contentMap[activeSection] || defaultContent;
  };

  const currentContent = renderContent();

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Mobile menu button */}
      <div className="fixed top-4 left-4 z-50 lg:hidden">
        <button
          onClick={() => setSidebarOpen(true)}
          className="p-2 rounded-lg bg-[#7d0a0a] text-white shadow-lg"
        >
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
        fixed lg:relative 
        top-0 left-0 h-full 
        w-80 max-w-[85vw] 
        bg-white shadow-lg 
        transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        z-50 lg:z-auto
        overflow-y-auto
      `}
      >
        {/* Sidebar Header */}
        <div className="bg-gradient-to-r from-red-700 to-red-800 p-4 md:p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-white/20 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 md:w-6 md:h-6" />
              </div>
              <div>
                <h2 className="text-lg md:text-xl font-semibold">
                  {currAdmin.name}
                </h2>
                <p className="text-blue-100 text-xs md:text-sm">Admin</p>
              </div>
            </div>
            <button
              onClick={closeSidebar}
              className="lg:hidden p-1 rounded-full hover:bg-white/20"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <div className="p-4">
          {/* <p className="text-sm md:text-base font-semibold cursor-pointer text-[#7d0a0a] mb-4">
            Goto Default Distributor
          </p> */}
          {Object.entries(sidebarItems).map(([sectionKey, section]) => {
            const SectionIcon = section.icon;
            const isExpanded = expandedSections[sectionKey];

            return (
              <div key={sectionKey} className="mb-4">
                <button
                  onClick={() => toggleSection(sectionKey)}
                  className="w-full flex items-center justify-between p-2 md:p-3 text-left font-semibold text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <SectionIcon className="w-4 h-4 md:w-5 md:h-5" />
                    <span className="text-sm md:text-base">
                      {section.title}
                    </span>
                  </div>
                  {isExpanded ? (
                    <ChevronDown className="w-4 h-4" />
                  ) : (
                    <ChevronRight className="w-4 h-4" />
                  )}
                </button>

                {isExpanded && (
                  <div className="ml-6 md:ml-8 mt-2 space-y-1">
                    {section.items.map((item) => {
                      const ItemIcon = item.icon;
                      return (
                        <button
                          key={item.id}
                          onClick={() => {
                            setActiveSection(item.id);
                            setSidebarOpen(false); // Close sidebar on mobile when item is selected
                          }}
                          className={`w-full flex items-center space-x-3 p-2 text-left rounded-lg transition-colors ${
                            activeSection === item.id
                              ? "bg-red-100 text-red-700"
                              : "text-gray-600 hover:bg-gray-100"
                          }`}
                        >
                          <ItemIcon className="w-3 h-3 md:w-4 md:h-4" />
                          <span className="text-xs md:text-sm">
                            {item.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-white shadow-sm p-4 lg:p-6">
          <div className="flex items-center justify-between">
            <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-[#7d0a0a] ml-12 lg:ml-0">
              {currentContent.title}
            </h1>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4 lg:p-6 ">
          <div className="max-w-7xl mx-auto">{currentContent.content}</div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
