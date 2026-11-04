import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import ReportsMemberTable from "../AdminFrontend/ReportsMemberTable";

const ReportsUserForFran = ({ tokenProp }) => {
  const token = tokenProp || localStorage.getItem("franchiseToken");
  const [reportsData, setReportsData] = useState([]);
  const [exportData, setExportData] = useState([]);
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
  const [isLoading, setIsLoading] = useState(false);
  const maritalStsOptions = [
    { value: "Unmarried", label: "Unmarried" },
    { value: "divorced", label: "Divorced" },
    { value: "widowed", label: "Widowed" },
    { value: "divorce_in_process", label: "Divorce in Process" },
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

  const memberDropdownRef = useRef(null);
  const franchiseDropdownRef = useRef(null);
  const distDropdownRef = useRef(null);

  const fieldKeyMap = {
    userInformation: {
      Email: "loginEmail",
      "Mobile Number": "loginNumber",
    },
    generalInfo: {
      "First Name": "firstName",
      "Middle Name": "midname",
      "Last Name": "lastName",
      Gender: "gender",
      "Date Of Birth": "dob",
      "Marital Status": "maritalStatus",
      Nationality: "nationality",
    },
    nativeInfo: {
      "District,State,Country": "nativeCity",
    },
    workingInfo: {
      "City,State,Country": "workLocation",
    },
    communityInfo: {
      "Subcaste,Caste,Religion": "caste",
      "Mother Tongue": "motherTongue",
    },
    career: {
      "Education / Degree": "education",
      "Monthly Income": "monthlyIncome",
    },
    health: {
      "Blood Group": "bloodGroup",
      Height: "height",
      "Body Type": "BodyType",
      Complexion: "Complexion",
      "Physical Abnormality": "divyang",
    },
    parentsAddress: {
      "Address Line": "parentsResidence",
      "City,State,Country": "nativeCity",
      "WhatsApp Number": "whatsApp",
      "Alternate Number": "alternateNumber",
    },
    relativesInfo: {
      Mamkul: "mamkul",
    },
    familyMem: {
      "No. of Brothers": "brothersCount",
      "No. of Sisters": "sistersExactCount",
    },
    other: {
      Distributor: "CreatedBy",
      Franchisee: "franchiseUnder",
      Status: "ActiveStatus",
      "Member Id": "UserId",
      "Package Name": "vipMember",
    },
  };

  const handleChange = (prop, value) => {
    setFormData((prev) => ({
      ...prev,
      [prop]: value,
    }));
  };

  const handleCheck = (sectionName, value, checked) => {
    const fieldName = fieldKeyMap[sectionName]?.[value] || value;
    setSelectedColumns((prev) => {
      const existing = prev[sectionName] || [];
      const updated = checked
        ? [...existing, { label: value, field: fieldName }]
        : existing.filter((item) => item.label !== value);
      return {
        ...prev,
        [sectionName]: updated,
      };
    });
  };

  const handleClick = async () => {
    try {
      setIsLoading(true);
      const filters = {
        memberId: formData.memberId || "",
        memberName: formData.memberName || "",
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
        const value = filters[key];
        const isInvalidFilter =
          value === "" ||
          value === undefined ||
          value === null ||
          (typeof value === "string" && value.startsWith("Select ")) ||
          (Array.isArray(value) && value.length === 0);

        if (isInvalidFilter) {
          delete filters[key];
        }
      });

      const selectedEntries = Object.values(selectedColumns).flat();
      const fields = selectedEntries.map((entry) => entry.field);
      const payload = { filters, fields };

      const response = await axios.post(
        "http://127.0.0.1:8000/api/franchise/reports",
        payload,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log(response.data);
      const rawData = response.data?.data || [];
      const flatData = flattenData(rawData);

      setReportsData(rawData);
      setExportData(flatData);
    } catch (error) {
      console.error("API Error:", error);
      toast.error("Failed to fetch reports");
    } finally {
      setIsLoading(false);
    }
  };

  const flattenData = (data) => {
    return data.map((item) => {
      const flatItem = { ...item };

      if (item.caste) {
        flatItem.caste = `${item.caste.religion || ""} - ${item.caste.caste || ""} - ${item.caste.subCaste || ""}`.trim();
        flatItem.caste_religion = item.caste.religion || "";
        flatItem.caste_caste = item.caste.caste || "";
        flatItem.caste_subCaste = item.caste.subCaste || "";
      }

      if (item.nativeCity) {
        flatItem.nativeCity = `${item.nativeCity.city || ""}, ${item.nativeCity.state || ""}, ${item.nativeCity.country || ""}`.replace(/(^[,\s]+|[,\s]+$)/g, "");
        flatItem.nativeCountry = item.nativeCity.country || "";
        flatItem.nativeState = item.nativeCity.state || "";
        flatItem.nativeCityName = item.nativeCity.city || "";
      }

      if (item.workLocation) {
        flatItem.workLocation = `${item.workLocation.city || ""}, ${item.workLocation.state || ""}, ${item.workLocation.country || ""}`.replace(/(^[,\s]+|[,\s]+$)/g, "");
        flatItem.workCountry = item.workLocation.country || "";
        flatItem.workState = item.workLocation.state || "";
        flatItem.workCity = item.workLocation.city || "";
      }

      if (Array.isArray(item.expectedReligion)) {
        flatItem.expectedReligion = item.expectedReligion
          .map(
            (r) =>
              `${r.religion || ""} - ${r.caste || ""} - ${r.subCaste || ""}`
          )
          .join(", ");
      }

      if (Array.isArray(item.expectedNativeLocation)) {
        flatItem.expectedNativeLocation = item.expectedNativeLocation
          .map((loc) => `${loc.city}, ${loc.state}, ${loc.country}`)
          .join("; ");
      }

      if (Array.isArray(item.expectedWorkingLocation)) {
        flatItem.expectedWorkingLocation = item.expectedWorkingLocation
          .map((loc) => `${loc.city}, ${loc.state}, ${loc.country}`)
          .join("; ");
      }

      flatItem.nationality = (item.nationality || []).join(", ");
      flatItem.education = (item.education || []).join(", ");

      return flatItem;
    });
  };

  const handleExport = () => {
    const data = exportData || [];
    if (!Array.isArray(data) || data.length === 0) {
      alert("No data to export.");
      return;
    }

    const selectedEntries = Object.values(selectedColumns).flat();
    if (selectedEntries.length === 0) {
      alert("Please select at least one column to export.");
      return;
    }

    const headers = selectedEntries.map((entry) => entry.label);
    const fieldKeys = selectedEntries.map((entry) => entry.field);
    const rows = data.map((item) => {
      const row = {};
      fieldKeys.forEach((key) => {
        row[key] = item[key] !== undefined && item[key] !== null ? item[key] : "";
      });
      return row;
    });

    const worksheet = XLSX.utils.aoa_to_sheet([headers]);
    XLSX.utils.sheet_add_json(worksheet, rows, {
      origin: "A2",
      skipHeader: true,
    });
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

    setSelectedEducation(updated);
    // original file updated react-hook-form setValue("education", updated) — removed here
  };

  const fetchStreams = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/admin/get-streams");
      if (response.data.status) {
        setStreams(response.data.data);
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
          "http://127.0.0.1:8000/api/admin/get-degrees-by-stream",
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

  const [countriesView, setCountriesView] = useState([]);
  const [statesView, setstatesView] = useState([]);
  const [cityView, setCityView] = useState([]);
  const [religionView, setReligionView] = useState([]);
  const [casteView, setCasteView] = useState([]);
  const [subcasteView, setSubcasteView] = useState([]);
  const [viewdegrees, setViewdegrees] = useState([]);
  const [franchises, setFranchises] = useState([]);
  const [distributor, setDistributor] = useState([]);
  const [motherTongue, setMotherTongue] = useState([]);
  const [sect, setSect] = useState([]);
  const [manglik, setManglik] = useState([]);
  const [foodPref, setFoodPref] = useState([]);
  const [complexion, setComplexions] = useState([]);
  const [bodyType, setBodyType] = useState([]);
  const [familyBg, setFamilyBg] = useState([]);
  const [positions, setPositions] = useState([]);

  const viewCountries = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/admin/get-country");
      setCountriesView(response.data.result || []);
    } catch (error) {
      console.error("Error fetching countries:", error);
    }
  };

  const viewStates = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/admin/get-all-states");
      setstatesView(response.data.allStates || []);
    } catch (error) {
      console.error("Error fetching states:", error);
    }
  };

  const viewCity = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/admin/get-all-cities");
      setCityView(response.data.allLocations || []);
    } catch (error) {
      console.error("Error fetching cities:", error);
    }
  };

  const viewReligion = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/admin/get-religion");
      setReligionView(response.data.result || []);
    } catch (error) {
      console.error("Error fetching religions:", error);
    }
  };

  const viewCaste = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/admin/get-all-castes");
      setCasteView(response.data.result || []);
    } catch (error) {
      console.error("Error fetching castes:", error);
    }
  };

  const viewSubcaste = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/admin/get-all-subcastes");
      setSubcasteView(response.data.result || []);
    } catch (error) {
      console.error("Error fetching subcastes:", error);
    }
  };

  const getFranchises = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/user/get-franchises", {
        headers: { Authorization: `Bearer ${token}` },
      });
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
      const response = await axios.get("http://127.0.0.1:8000/api/admin/get-mother-tongue");
      if (response.data.status === true) setMotherTongue(response.data.result);
    } catch (error) {
      console.log(error);
    }
  };

  const getDistributors = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/admin/get-distributors", {
        headers: { Authorization: `Bearer ${token}` },
      });
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
      const response = await axios.get("http://127.0.0.1:8000/api/admin/get-sect");
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
      const response = await axios.get("http://127.0.0.1:8000/api/user/get-manglik");
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
      const response = await axios.get("http://127.0.0.1:8000/api/user/food-choices");
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
      const response = await axios.get("http://127.0.0.1:8000/api/user/get-complexion");
      if (response.data.status) setComplexions(response.data?.result);
    } catch (error) {
      console.log(error);
    }
  };

  const getBodyType = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/user/get-bodytype");
      if (response.data.status) setBodyType(response.data?.result);
    } catch (error) {
      console.log(error);
    }
  };

  const getFamilyBg = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/user/get-familybg");
      if (response.data.status) setFamilyBg(response.data?.result);
    } catch (error) {
      console.log(error);
    }
  };

  const getPosition = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/user/get-position");
      if (response.data.status) setPositions(response.data?.result);
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
    getManglik();
    getBodyType();
    getComplexion();
    getSect();
    getDistributors();
    getFranchises();
    fetchMotherTongue();
    getFoodPref();
    fetchStreams();
  }, []);

  useEffect(() => {
    if (Array.isArray(streams) && streams.length > 0) {
      fetchDegreesForStreams(streams);
    }
  }, [streams]);

  return (
    <>
      <div className="w-full space-y-4">
        <div className="w-full flex gap-6 items-center border border-gray-500 rounded-md p-4">
          <p className="font-semibold">Search By : </p>
          <input
            type="text"
            className="border border-gray-500 px-2 py-1 rounded-md"
            placeholder="Enter Member Id"
            value={formData.memberId}
            onChange={(e) => handleChange("memberId", e.target.value)}
          />
          <input
            type="text"
            className="border border-gray-500 px-2 py-1 rounded-md"
            placeholder="Enter Member Name"
            value={formData.memberName}
            onChange={(e) => handleChange("memberName", e.target.value)}
          />
          <button
            className="border text-white font-semibold bg-[#7d0a0a] p-1 rounded-md cursor-pointer disabled:opacity-50"
            onClick={handleClick}
            disabled={isLoading}
          >
            {isLoading ? "Searching..." : "Search"}
          </button>
          <button
            className="border text-white font-semibold bg-[#7d0a0a] p-1 rounded-md cursor-pointer disabled:opacity-50"
            onClick={handleExport}
            disabled={isLoading}
          >
            Export To Excel
          </button>
        </div>

        <div className="w-full flex justify-center">
          <div className="flex flex-col gap-2 w-1/2">
            <p className="font-semibold text-lg">Native Location</p>
            <div className="space-x-4">
              <label>Country </label>
              <select
                className="w-1/3 border border-gray-400 rounded-md p-1"
                onChange={(e) => handleChange("nativeCountry", e.target.value)}
              >
                <option value="">Select Country</option>
                {countriesView.map((ele, index) => (
                  <option value={ele.country} key={index}>
                    {ele.country}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-x-10">
              <label>State</label>
              <select
                className="w-1/3 border border-gray-400 rounded-md p-1"
                onChange={(e) => handleChange("nativeState", e.target.value)}
              >
                <option value="">Select State</option>
                {statesView.map((ele, index) => (
                  <option value={ele.state} key={index}>
                    {ele.state}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-x-11">
              <label>City </label>
              <select
                className="w-1/3 border border-gray-400 rounded-md p-1"
                onChange={(e) => handleChange("nativeCity", e.target.value)}
              >
                <option value="">Select City</option>
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
              <label>Country </label>
              <select
                className="w-1/3 border border-gray-400 rounded-md p-1"
                onChange={(e) => handleChange("workingCountry", e.target.value)}
              >
                <option value="">Select Country</option>
                {countriesView.map((ele, index) => (
                  <option value={ele.country} key={index}>
                    {ele.country}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-x-10">
              <label>State</label>
              <select
                className="w-1/3 border border-gray-400 rounded-md p-1"
                onChange={(e) => handleChange("workingState", e.target.value)}
              >
                <option value="">Select State</option>
                {statesView.map((ele, index) => (
                  <option value={ele.state} key={index}>
                    {ele.state}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-x-11">
              <label>City </label>
              <select
                className="w-1/3 border border-gray-400 rounded-md p-1"
                onChange={(e) => handleChange("workingCity", e.target.value)}
              >
                <option value="">Select City</option>
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
              <label>Religion </label>
              <select
                className="w-1/3 border border-gray-400 rounded-md p-1"
                onChange={(e) => handleChange("religion", e.target.value)}
              >
                <option value="">Select Religion</option>
                {religionView.map((ele, index) => (
                  <option value={ele.religion} key={index}>
                    {ele.religion}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-x-10">
              <label>Caste</label>
              <select
                className="w-1/3 border border-gray-400 rounded-md p-1"
                onChange={(e) => handleChange("caste", e.target.value)}
              >
                <option value="">Select Caste</option>
                {casteView.map((ele, index) => (
                  <option value={ele.caste} key={index}>
                    {ele.caste}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-x-3">
              <label>Subcaste </label>
              <select
                className="w-1/3 border border-gray-400 rounded-md p-1"
                onChange={(e) => handleChange("subCaste", e.target.value)}
              >
                <option value="">Select Subcaste</option>
                {subcasteView.map((ele, index) => (
                  <option value={ele.subCaste} key={index}>
                    {ele.subCaste}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-x-4">
              <label>Mother Tongue</label>
              <select
                className="w-1/3 border border-gray-400 rounded-md p-1"
                onChange={(e) => handleChange("motherTongue", e.target.value)}
              >
                <option value="">Select Language</option>
                {motherTongue.map((ele) => (
                  <option key={ele.motherTongue}>{ele.motherTongue}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex flex-col gap-2 w-1/2">
            <p className="font-semibold text-lg">Career</p>
            <div className="space-x-14">
              <label>Education </label>
              <select
                className="w-1/3 border border-gray-400 rounded-md p-1"
                onChange={(e) => handleChange("education", e.target.value)}
              >
                <option value="">Select Education</option>
                {viewdegrees.map((ele, index) => (
                  <option value={ele.degree} key={index}>
                    {ele.degree}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-x-12">
              <label>Occuptaion</label>
              <select
                className="w-1/3 border border-gray-400 rounded-md p-1"
                onChange={(e) => handleChange("occuptaion", e.target.value)}
              >
                <option value="">Select Occupation</option>
                {occupations.map((ele, index) => (
                  <option value={ele} key={index}>
                    {ele}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-x-3">
              <label>Monthly Income </label>
              <select
                className="w-1/3 border border-gray-400 rounded-md p-1"
                onChange={(e) => handleChange("monthlyInc", e.target.value)}
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
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-4">
            <span className="text-xl font-bold text-gray-600">( Maximum 1 field )</span>
          </div>

          <div className="bg-white border border-red-200 rounded-lg overflow-hidden mb-4">
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-red-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-red-800 border-r border-red-200">Category</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-red-800">Degrees</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-red-200">
                  {educationCategories.map((category) => (
                    <tr key={category.name} className="hover:bg-red-25">
                      <td className="px-4 py-3 font-medium text-red-700 border-r border-red-200 bg-red-25">{category.name}</td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-2">
                          {category.degrees.map((degree) => {
                            const isSelected = selectedEducation.some(
                              (edu) => edu.degree === degree && edu.category === category.name
                            );
                            const isDisabled = !isSelected && selectedEducation.length >= 1;

                            return (
                              <button
                                key={degree}
                                type="button"
                                onClick={() => handleDegreeToggle(degree, category.name)}
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
                                {isSelected ? <span className="ml-1">✓</span> : null}
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
              <label>Marital Status </label>
              <select className="w-1/3 border border-gray-400 rounded-md p-1" onChange={(e) => handleChange("maritalSts", e.target.value)}>
                <option value="">Select Status</option>
                {maritalStsOptions.map((ele, index) => (
                  <option value={ele.value} key={index}>
                    {ele.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-x-10 flex">
              <label>Physical Abnormality</label>
              <div className="flex gap-3">
                <input type="radio" name="phyAbnormality" value={"yes"} onChange={(e) => handleChange("phyAbnormality", e.target.value)} /> Yes
                <input type="radio" name="phyAbnormality" value={"no"} onChange={(e) => handleChange("phyAbnormality", e.target.value)} /> No
              </div>
            </div>

            <div className="space-x-26">
              <label>Nationality </label>
              <select className="w-1/3 border border-gray-400 rounded-md p-1" onChange={(e) => handleChange("nationality", e.target.value)}>
                <option value="">Select Nationality</option>
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
              <label>Distributor </label>
              <select className="w-1/3 border border-gray-400 rounded-md p-1" onChange={(e) => handleChange("distributor", e.target.value)}>
                <option value="">Select Distributor</option>
                {distributor.map((ele, index) => (
                  <option value={ele.distributorName} key={index}>
                    {ele.distributorName}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-x-12">
              <label>Franchise</label>
              <select className="w-1/3 border border-gray-400 rounded-md p-1" onChange={(e) => handleChange("franchise", e.target.value)}>
                <option value="">Select Franchise</option>
                {franchises.map((ele, index) => (
                  <option value={ele.franchiseName} key={index}>
                    {ele.franchiseName}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-x-5">
              <label>Package Type</label>
              <select className="w-1/3 border border-gray-400 rounded-md p-1" onChange={(e) => handleChange("packageType", e.target.value)}>
                <option value="">Select Package Type</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            <div className="space-x-17">
              <label>Status </label>
              <select className="w-1/3 border border-gray-400 rounded-md p-1" onChange={(e) => handleChange("status", e.target.value)}>
                <option value="">Select Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            <div className="space-x-5 flex">
              <label>Select Gender</label>
              <div className="flex gap-3">
                <input type="radio" name="gender" value={"male"} onChange={(e) => handleChange("gender", e.target.value)} /> Male
                <input type="radio" name="gender" value={"female"} onChange={(e) => handleChange("gender", e.target.value)} /> Female
              </div>
            </div>
          </div>
        </div>

        <hr />

        <div className="w-full flex">
          <div className="flex flex-col gap-2 w-1/2">
            <p className="font-semibold text-lg">Special</p>

            <div className="space-x-22">
              <label>Sect</label>
              <select className="w-1/3 border border-gray-400 rounded-md p-1" onChange={(e) => handleChange("sect", e.target.value)}>
                <option value="">Select Sect</option>
                {sect.map((ele, index) => (
                  <option value={ele.name} key={index}>
                    {ele.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-x-22">
              <label>Manglik</label>
              <select className="w-1/3 border border-gray-400 rounded-md p-1" onChange={(e) => handleChange("manglik", e.target.value)}>
                <option value="">Select Manglik</option>
                {manglik.map((ele, index) => (
                  <option value={ele.name} key={index}>
                    {ele.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-x-26">
              <label>Food Choices </label>
              <select className="w-1/3 border border-gray-400 rounded-md p-1" onChange={(e) => handleChange("foodChoices", e.target.value)}>
                <option value="">Select Food choices</option>
                {foodPref.map((ele, index) => (
                  <option value={ele.name} key={index}>
                    {ele.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-x-8">
              <label>Blood Group </label>
              <select className="w-1/3 border border-gray-400 rounded-md p-1" onChange={(e) => handleChange("bloodGroup", e.target.value)}>
                <option value="">Select Blood Group</option>
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
              <label>Complexion </label>
              <select className="w-1/3 border border-gray-400 rounded-md p-1" onChange={(e) => handleChange("complexion", e.target.value)}>
                <option value="">Select Complexion</option>
                {complexion.map((ele, index) => (
                  <option value={ele.complexion} key={index}>
                    {ele.complexion}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-x-8">
              <label>Body Type </label>
              <select className="w-1/3 border border-gray-400 rounded-md p-1" onChange={(e) => handleChange("bodyType", e.target.value)}>
                <option value="">Select Body Type</option>
                {bodyType.map((ele, index) => (
                  <option value={ele.bodyType} key={index}>
                    {ele.bodyType}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-x-8">
              <label>Family Background </label>
              <select className="w-1/3 border border-gray-400 rounded-md p-1" onChange={(e) => handleChange("familyBackground", e.target.value)}>
                <option value="">Select Family Background</option>
                {familyBg.map((ele, index) => (
                  <option value={ele.familyBg} key={index}>
                    {ele.familyBg}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-x-8">
              <label>Features </label>
              <select className="w-1/3 border border-gray-400 rounded-md p-1" onChange={(e) => handleChange("features", e.target.value)}>
                <option value="">Select Features</option>
                {distributor.map((ele, index) => (
                  <option value={ele.distributorName} key={index}>
                    {ele.distributorName}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-x-8">
              <label>Height </label>
              <select className="w-1/3 border border-gray-400 rounded-md p-1" onChange={(e) => handleChange("height", e.target.value)}>
                <option value="">Select Height</option>
                {distributor.map((ele, index) => (
                  <option value={ele.distributorName} key={index}>
                    {ele.distributorName}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-x-8">
              <label>Position </label>
              <select className="w-1/3 border border-gray-400 rounded-md p-1" onChange={(e) => handleChange("position", e.target.value)}>
                <option value="">Select Position</option>
                {positions.map((ele, index) => (
                  <option value={ele.position} key={index}>
                    {ele.position}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-x-8">
              <label>VIP Registration </label>
              <select className="w-1/3 border border-gray-400 rounded-md p-1" onChange={(e) => handleChange("vipReg", e.target.value)}>
                <option value="">Select Vip Reg</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </div>
          </div>
        </div>

        <hr />

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
                        onChange={(e) => handleCheck(ele.name, box, e.target.checked)}
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

export default ReportsUserForFran;