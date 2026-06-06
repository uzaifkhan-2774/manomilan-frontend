import React, { useState, useEffect, useRef } from "react";
import { useForm, useFieldArray, Controller, useWatch } from "react-hook-form";
import { SearchableDropdown } from "../CommonComponents/SearchableDDM";
import Select from "react-select";
import { useLocation, useNavigate } from "react-router-dom";
import {
  ChevronLeft,
  ChevronRight,
  User,
  GraduationCap,
  Heart,
  Star,
  Plus,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import axios from "axios";
import BiodataProfile from "./BioData";
import { toast } from "react-toastify";

const PreferenceSelector = ({
  title = "Preferences",
  dropdown1Label,
  dropdown2Label,
  dropdown3Label,
  api1Url,
  api2Url,
  api3Url,
  api1Key,
  api2Key,
  api3Key,
  onPreferencesChange = () => {},
}) => {
  const [dropdownData, setDropdownData] = useState([[], [], []]);
  const [selectedValues, setSelectedValues] = useState(["", "", ""]);
  const [preferences, setPreferences] = useState([]);
  const [loading, setLoading] = useState([false, false, false]);
  const [error, setError] = useState("");

  const fetchData = async (url, index) => {
    if (!url) return;
    setLoading((prev) => {
      const copy = [...prev];
      copy[index] = true;
      return copy;
    });
    try {
      const response = await axios.get(url);
      let arr =
        response.data?.result || response.data?.data || response.data || [];
      if (!Array.isArray(arr)) arr = [];
      setDropdownData((prev) => {
        const copy = [...prev];
        copy[index] = arr;
        return copy;
      });
    } catch (err) {
      setError(`Error loading data: ${err.message}`);
    } finally {
      setLoading((prev) => {
        const copy = [...prev];
        copy[index] = false;
        return copy;
      });
    }
  };

  useEffect(() => {
    fetchData(api1Url, 0);
  }, [api1Url]);

  useEffect(() => {
    setDropdownData((prev) => [prev[0], [], []]);
    setSelectedValues((prev) => [prev[0], "", ""]);
    if (!selectedValues[0]) return;
    const label = dropdown1Label.toLowerCase();
    const keyParam = label.includes("religion") ? "religion" : "country";
    const url = `${api2Url}?${keyParam}=${encodeURIComponent(selectedValues[0])}`;
    fetchData(url, 1);
  }, [selectedValues[0], api2Url, dropdown1Label]);

  useEffect(() => {
    if (!selectedValues[1] || !selectedValues[0]) {
      setDropdownData((prev) => [prev[0], prev[1], []]);
      return;
    }
    const label = dropdown2Label.toLowerCase();
    let url = "";
    if (label.includes("caste")) {
      url = `${api3Url}?caste=${encodeURIComponent(selectedValues[1])}&religion=${encodeURIComponent(selectedValues[0])}`;
    } else {
      url = `${api3Url}?state=${encodeURIComponent(selectedValues[1])}&country=${encodeURIComponent(selectedValues[0])}`;
    }
    fetchData(url, 2);
    setSelectedValues((prev) => [prev[0], prev[1], ""]);
  }, [selectedValues[1], selectedValues[0], api3Url, dropdown2Label]);

  const handleDropdownChange = (index, value) => {
    setSelectedValues((prev) => {
      const copy = [...prev];
      copy[index] = value;
      return copy;
    });
  };

  const addPreference = () => {
    const newPreference = {
      id: Date.now(),
      [api1Key]: selectedValues[0] || "ANY",
      [api2Key]: selectedValues[1] || "ANY",
      [api3Key]: selectedValues[2] || "ANY",
    };
    const isDuplicate = preferences.some(
      (pref) =>
        pref[api1Key] === newPreference[api1Key] &&
        pref[api2Key] === newPreference[api2Key] &&
        pref[api3Key] === newPreference[api3Key],
    );
    if (isDuplicate) {
      setError("This preference combination already exists");
      return;
    }
    const updatedPreferences = [...preferences, newPreference];
    setPreferences(updatedPreferences);
    onPreferencesChange(updatedPreferences);
    setSelectedValues(["", "", ""]);
    setError("");
  };

  const removePreference = (id) => {
    const updatedPreferences = preferences.filter((pref) => pref.id !== id);
    setPreferences(updatedPreferences);
    onPreferencesChange(updatedPreferences);
  };

  const dropdownLabels = [dropdown1Label, dropdown2Label, dropdown3Label];
  const apiKeys = [api1Key, api2Key, api3Key];

  return (
    <div className="w-full max-w-6xl mx-auto p-6 bg-white">
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {[0, 1, 2].map((num) => (
          <div key={`dropdown${num}`} className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              {dropdownLabels[num]}
            </label>
            <select
              value={selectedValues[num]}
              onChange={(e) => handleDropdownChange(num, e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              disabled={loading[num]}
            >
              <option value="">ANY</option>
              {(dropdownData[num] || []).map((item, idx) => (
                <option key={idx} value={item?.[apiKeys[num]]}>
                  {item?.[apiKeys[num]] || "Unknown"}
                </option>
              ))}
            </select>
          </div>
        ))}

        <div className="space-y-2 flex flex-col gap-2">
          <label className="block text-sm font-medium text-transparent">
            Action
          </label>
          <button
            type="button"
            onClick={addPreference}
            className="w-full bg-red-900 hover:bg-red-800 text-white px-4 py-2 rounded-md"
          >
            Add Preference
          </button>
        </div>
      </div>

      {/* Preferences Table Always Visible */}
      <div className="mt-8">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Added Preferences ({preferences.length})
        </h3>
        {preferences.length > 0 ? (
          <div className="overflow-x-auto bg-white rounded-lg border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-red-900">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Sr. No.
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    {dropdown1Label}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    {dropdown2Label}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    {dropdown3Label}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {preferences.map((pref, index) => (
                  <tr key={pref.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {index + 1}
                    </td>
                    {apiKeys.map((key) => (
                      <td key={key} className="px-6 py-4 text-sm text-gray-900">
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            pref[key] === "ANY"
                              ? "bg-gray-100 text-gray-600"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {pref[key]}
                        </span>
                      </td>
                    ))}
                    <td className="px-6 py-4 text-sm text-gray-900">
                      <button
                        type="button"
                        onClick={() => removePreference(pref.id)}
                        className="text-red-600 hover:text-red-800"
                        title="Remove preference"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
            <p className="text-gray-500">
              No preferences added yet. Select values and click "Add Preference"
              to get started.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

const MultiStepForm = ({ sendFranhchisee }) => {
  const location = useLocation();
  const pathname = location.pathname;
  const navigate = useNavigate();
  const [gender, setGender] = useState("");
  const [currentStep, setCurrentStep] = useState(1);
  const [fieldsLocked, setFieldsLocked] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showChildModal, setShowChildModal] = useState(false);
  const [childCount, setChildCount] = useState(0);
  const [hasChildren, setHasChildren] = useState(false);
  const [showChildCountModal, setShowChildCountModal] = useState(false);
  const [showChildAcceptance, setShowChildAcceptance] = useState(false);
  const [tempChildCount, setTempChildCount] = useState(0);
  const [showChildDetailsModal, setShowChildDetailsModal] = useState(false);
  //sees the data is submitted or not
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submissionError, setSubmissionError] = useState("");
  const [isRegistered, setIsRegistered] = useState(false); // tracks if user submitted registration
  const [isLoggedIn, setIsLoggedIn] = useState(false); // optional: for login confirmation
  const [religionPreferences, setReligionPreferences] = useState([]);
  const [nativeLocationPreferences, setNativeLocationPreferences] = useState(
    [],
  );
  const [workingLocationPreferences, setWorkingLocationPreferences] = useState(
    [],
  );
  const [selectedCaste, setSelectedCaste] = useState("");
  const [selectedParentCity, setSelectedParentCity] = useState("");
  const [selectedWorkingLocation, setSelectedWorkingLocation] = useState("");
  const [bioDataDetails, setBioDataDetails] = useState({});
  const [motherTongue, setMotherTongue] = useState([]);
  const [sect, setSect] = useState([]);
  const [manglik, setManglik] = useState([]);
  const [foodPref, setFoodPref] = useState([]);

  const [streams, setStreams] = useState([]);
  const [degreesByStream, setDegreesByStream] = useState({});
  const [selectedEducation, setSelectedEducation] = useState([]);
  const [errorsStream, setErrorsStream] = useState({});
  const getting = useRef();
  const loginNum = useRef();
  const loginEm = useRef();
  const pass = useRef();
  const [user, setUser] = useState({});
  const [display, setDisplay] = useState(false);
  useEffect(() => {
    const fetchStreams = async () => {
      try {
        const response = await axios.get(
          "http://127.0.0.1:8000/api/user/get-all-stream",
        );
        if (response.data.status) {
          setStreams(response.data.data);
          fetchDegreesForStreams(response.data.data);
        } else {
          setErrorsStream({ education: { message: response.data.message } });
        }
      } catch (err) {
        setErrorsStream({
          education: { message: "Failed to fetch streams: " + err.message },
        });
      }
    };
    fetchStreams();
  }, []);

  const fetchDegreesForStreams = async (streams) => {
    const degreesData = {};
    for (const stream of streams) {
      try {
        const response = await axios.post(
          "http://127.0.0.1:8000/api/user/get-degree-by-stream",
          null,
          {
            params: { stream: stream.stream },
          },
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

  const educationCategories = streams.map((stream) => ({
    name: stream.stream,
    degrees: (degreesByStream[stream.stream] || []).map(
      (degree) => degree.degree,
    ),
  }));

  const partnerEducationCategories = [
    {
      name: "ANY",
      degrees: [],
    },
    ...streams.map((stream) => ({
      name: stream.stream,
      degrees: (degreesByStream[stream.stream] || []).map(
        (degree) => degree.degree,
      ),
    })),
  ];

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

  const [partnerEducation, setPartnerEducation] = useState([]);

  const partnerDegreeToggle = (degree, categoryName) => {
    if (categoryName === "ANY") {
      const allDegrees = partnerEducationCategories
        .filter((cat) => cat.name !== "ANY")
        .flatMap((cat) => cat.degrees)
        .filter((deg, index, self) => self.indexOf(deg) === index); // Remove duplicates

      const allSelected = allDegrees.every((deg) =>
        partnerEducation.some((edu) => edu.degree === deg),
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

  const removeDegree = (degree) => {
    setSelectedEducation((prev) => prev.filter((edu) => edu.degree !== degree));
  };

  const updateEducationField = (index, field, value) => {
    setSelectedEducation((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
    trigger,
    getValues,
  } = useForm({
    defaultValues: {
      // Login credentials
      loginNumber: "",
      loginEmail: "",
      password: "",

      // Personal Info
      firstName: "",
      midname: "",
      lastName: "",
      gender: "",
      dob: "",
      timeOfBirth: "",
      placeOfBirth: "",
      maritalStatus: "Unmarried",
      children: [],
      height: 163,
      occupation: "Private Service",
      monthlyIncome: "",
      nationality: ["India"],
      caste: "",
      motherTongue: "Marathi",
      divyang: "No",
      mothersName: "",
      fathersName: "",
      mamkul: "",
      parentsResidence: "",
      parentsCity: "",
      parentsContact: "",
      whatsApp: "",
      alternateNumber: "",
      brothersCount: "",
      brothers: "",
      sisters: "",
      sistersExactCount: "",
      otherInfo: "",
      nativeVillage: "",

      // Education & Career
      education: [""],
      companyName: "",
      designation: "",
      candidateNumber: "",
      candidateEmail: "",
      workLocation: "",
      isWorking: true,

      // Expectations
      ageFrom: "0",
      ageTo: "5",
      heightFrom: "137",
      divyangPrefer: "no",
      heightTo: "229",
      expectedEducation: [""],
      expectedOccupation: "Private Service",
      expectedIncome: "",
      workAbroad: "no",
      expectedMaritalStatus: "Unmarried",
      expectedNationality: ["India"],
      childAccepted: "no",
      userPhotoOne: null,
      userPhotoTwo: null,
      userPhotoThree: null,

      // Special info
      sect: "",
      manglik: "",
      foodPreference: "",
      bloodGroup: "",
      specs: "",
      gotra: "",
      userPhoto: null,
    },
  });

  const ageFrom = useWatch({
    control,
    name: "ageFrom",
  });

  const heightFrom = watch("heightFrom");

  const {
    fields: educationFields,
    append: appendEducation,
    remove: removeEducation,
  } = useFieldArray({
    control,
    name: "education",
  });

  const {
    fields: expectedEducationFields,
    append: appendExpectedEducation,
    remove: removeExpectedEducation,
  } = useFieldArray({
    control,
    name: "expectedEducation",
  });

  const {
    fields: childrenFields,
    append: appendChild,
    remove: removeChild,
  } = useFieldArray({
    control,
    name: "children",
  });

  const occupation = watch("occupation");
  const residentialAddress = watch("residentialAddress"); // assuming you have this field

  useEffect(() => {
    if (!occupation) {
      // Set workLocation to residentialAddress when occupation is not selected
      setValue("workLocation", residentialAddress);
    }
  }, [occupation, residentialAddress, setValue]);

  const watchMaritalStatus = watch("maritalStatus");

  const steps = [
    { number: 1, title: "Personal Info", icon: User },
    { number: 2, title: "Education & Career", icon: GraduationCap },
    { number: 3, title: "Expectations", icon: Heart },
    { number: 4, title: "Special Information", icon: Star },
  ];

  const generateHeightOptions = () => {
    const options = [];
    for (let feet = 4; feet <= 7; feet++) {
      for (let inches = 0; inches <= 11; inches++) {
        if (feet === 7 && inches > 6) break; // stop at 7'6"
        const cm = Math.round((feet * 12 + inches) * 2.54);
        options.push({
          label: `${feet}'${inches}"`,
          value: cm,
        });
      }
    }
    return options;
  };

  const heightOptions = generateHeightOptions();

  const handlePreferencesChange = (preferences) => {
    setReligionPreferences(preferences);
  };

  // DDM operations / api calling
  const [nationalities, setNationalities] = useState([]);
  const [cities, setCities] = useState([]);
  const [castes, setCastes] = useState([]);
  const casteOptions = castes.map((ele) => ({
    label: `${ele.subCaste} - ${ele.casteReligion?.caste} - ${ele.casteReligion?.religion}`,
    value: {
      subCaste: ele.subCaste,
      caste: ele.casteReligion?.caste,
      religion: ele.casteReligion?.religion,
    },
  }));

  const fetchDegree = async (degree) => {
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/user/get-degree-by-stream",
      );
      if (response.data.status === true) {
        // console.log(response.data);
        return response.data.data;
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchStreams = async () => {
    try {
      const response = await axios.get(
        "http://127.0.0.1:8000/api/user/get-all-stream",
      );
      if (response.data.status === true) {
        const dataToSave = await Promise.all(
          response.data.data.map(async (ele, index) => {
            const stream = ele.stream;
            const degree = await fetchDegree(stream); // ✅ Await here
            // console.log(stream, degree);
            // return { stream, degree };
          }),
        );
      } else {
        console.log("error in fetching the data");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchNationalities = async () => {
    try {
      const response = await axios.get(
        "http://127.0.0.1:8000/api/user/get-all-countries",
      );
      if (response.data.status === true) {
        setNationalities(response.data.result || []);
      } else {
        console.error("Failed to fetch nationalities:", response.data.message);
      }
    } catch (error) {
      console.error("Error fetching nationalities:", error);
    }
  };

  const fetchCities = async () => {
    try {
      const response = await axios.get(
        "http://127.0.0.1:8000/api/user/get-all-cities",
      );
      if (response.data.status === true) {
        const transformed = response.data.allLocations.map((item) => ({
          label: `${item.city}, ${item.stateCountry?.state || ""}, ${
            item.stateCountry?.country || ""
          }`,
          value: `${item.city}, ${item.stateCountry?.state || ""}, ${
            item.stateCountry?.country || ""
          }`, // or item._id if you want unique IDs
        }));
        setCities(transformed || []);
      } else {
        console.error("Failed to fetch Cities:", response.data.message);
      }
    } catch (error) {
      console.error("Error fetching Cities:", error);
    }
  };

  const fetchCaste = async () => {
    try {
      const response = await axios.get(
        "http://127.0.0.1:8000/api/user/get-all-subcaste",
      );

      if (response.data?.result?.length > 0) {
        setCastes(response.data.result);
      } else {
        console.log("No caste data found");
        setCastes([]);
      }
    } catch (error) {
      console.error("Error fetching caste data:", error);
    }
  };

  const fetchMotherTongue = async () => {
    try {
      const response = await axios.get(
        "http://127.0.0.1:8000/api/admin/get-mother-tongue",
      );
      if (response.data.status === true) {
        setMotherTongue(response.data.result);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getSect = async () => {
    try {
      const response = await axios.get(
        "http://127.0.0.1:8000/api/user/get-sect",
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
        "http://127.0.0.1:8000/api/user/get-manglik",
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
        "http://127.0.0.1:8000/api/user/food-choices",
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

  useEffect(() => {
    fetchNationalities();
    fetchCities();
    fetchCaste();
    fetchStreams();
    fetchMotherTongue();
    getSect();
    getManglik();
    getFoodPref();
    // initial fetch
    const interval = setInterval(() => {
      fetchNationalities();
      fetchCities();
      fetchCaste();
      fetchMotherTongue();
      getSect();
      getManglik();
      getFoodPref();
      // fetchStreams()
    }, 15000); // every 5 seconds

    return () => clearInterval(interval); // cleanup on unmount
  }, []);

  const submittor = async () => {
    const franchiseUnder = sendFranhchisee.franchiseName;
    try {
      if (!isRegistered) {
        // Submit registration
        const payload = {
          loginEmail: loginEm.current.value,
          loginNumber: loginNum.current.value,
          password: pass.current.value,
          franchiseUnder: franchiseUnder,
        };

        const response = await axios.post(
          "http://127.0.0.1:8000/api/user/register",
          payload,
        );
        if (response.data?.status === true) {
          toast.success("Registration successfull");
          console.log(response.data);
          setIsRegistered(true);
          return;
        } else {
          toast.warn("All fields required");
        }
      } else {
        // navigate("/")
        setIsLoggedIn(true);
        toast.success("You can do direct login");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("User already exist with this number or email!");
    }
  };

  const expectedNationality = [{ country: "ANY" }, ...nationalities];
  const occupations = [
    "Government Service",
    "Private Service",
    "Service + Business / Practice",
    "Business",
    "Student / Internship",
    "Not Working",
  ];
  const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

  // const handleChildModal = () => {
  //   if (
  //     ["divorced", "widowed", "divorce in process"].includes(watchMaritalStatus)
  //   ) {
  //     setShowChildModal(true);
  //   }
  // };

  // const generateChildTable = () => {
  //   const children = [];
  //   for (let i = 0; i < childCount; i++) {
  //     children.push({
  //       gender: "",
  //       dob: "",
  //       livesWith: "",
  //     });
  //   }
  //   setValue("children", children);
  //   setShowChildModal(false);
  // };

  const isStep4Complete = () => {
    const requiredFields = [
      "sect",
      "manglik",
      "gotra",
      "foodPreference",
      "bloodGroup",
      "specs",
    ];

    return requiredFields.every((field) => {
      const value = getValues(field); // react-hook-form method
      return value !== undefined && value !== "" && value !== null;
    });
  };

  const validateStep = async (step) => {
    let fieldsToValidate = [];

    switch (step) {
      case 1:
        fieldsToValidate = [
          "loginNumber",
          // "loginEmail",
          "password",
          "firstName",
          "lastName",
          "gender",
          "dob",
          // "timeOfBirth",
          // "placeOfBirth",
          "maritalStatus",
          "children",
          "height",
          "occupation",
          "monthlyIncome",
          "nationality",
          "caste",
          "motherTongue",
          "divyang",
          "mothersName",
          "fathersName",
          "mamkul",
          "parentsResidence",
          "parentsCity",
          "parentsContact",
          "whatsApp",
          "brothersCount",
          "sisters",
          "nativeVillage",
          "nativeCity",
        ];
        break;
      case 2:
        fieldsToValidate = ["education"];
        break;
      case 3:
        fieldsToValidate = [
          "ageFrom",
          "ageTo",
          "heightFrom",
          "heightTo",
          "expectedOccupation",
          "expectedIncome",
          "workAbroad",
          "expectedMaritalStatus",
          "expectedEducation",
          "expectedOccupation",
          "childAccepted",
          "religion",
          "nativeLocation",
          "workingLocation",
        ];
        if (showChildAcceptance) {
          fieldsToValidate.push("childAccepted");
        }
        break;
    }
    const result = await trigger(fieldsToValidate);
    return result;
  };

  // confirmation box when we goto next
  const handleConfirmSave = () => {
    setFieldsLocked(true); // Lock the gender and DOB fields
    setShowConfirmModal(false);
    setCurrentStep(currentStep + 1); // Move to next step after confirmation
  };

  const handleConfirmEdit = () => {
    setShowConfirmModal(false); // Just close the modal, stay on current step
  };

  // api calling
  const onSubmit = async (formData) => {
    try {
      const token = localStorage.getItem("token");
      const formDataToSend = new FormData();

      // Helper function to append nested objects/arrays
      const appendNested = (key, value, parentKey = "") => {
        if (Array.isArray(value)) {
          if (value.length === 0) {
            formDataToSend.append(`${parentKey}${key}`, "");
          } else {
            value.forEach((item, index) => {
              if (typeof item === "object" && item !== null) {
                Object.keys(item).forEach((subKey) => {
                  appendNested(
                    `${key}[${index}][${subKey}]`,
                    item[subKey],
                    `${parentKey}${key}[${index}]`,
                  );
                });
              } else {
                formDataToSend.append(
                  `${parentKey}${key}[${index}]`,
                  item || "",
                );
              }
            });
          }
        } else if (typeof value === "object" && value !== null) {
          Object.keys(value).forEach((subKey) => {
            appendNested(
              `${key}[${subKey}]`,
              value[subKey],
              `${parentKey}${key}`,
            );
          });
        } else {
          formDataToSend.append(
            parentKey + key,
            value === undefined || value === null ? "" : value,
          );
        }
      };

      // Simple fields
      formDataToSend.append("loginNumber", formData.loginNumber || "");
      formDataToSend.append("loginEmail", formData.loginEmail || "");
      formDataToSend.append(
        "franchiseUnder",
        sendFranhchisee?.franchiseName || "",
      );
      formDataToSend.append("password", formData.password || "");
      formDataToSend.append("firstName", formData.firstName || "");
      formDataToSend.append("midname", formData.midname || "");
      formDataToSend.append("lastName", formData.lastName || "");
      formDataToSend.append("gender", formData.gender?.toLowerCase() || "");
      formDataToSend.append("dob", formData.dob || "");
      formDataToSend.append("timeOfBirth", formData.timeOfBirth || "");
      formDataToSend.append("placeOfBirth", formData.placeOfBirth || "");
      formDataToSend.append("maritalStatus", formData.maritalStatus || "");
      formDataToSend.append("height", formData.height?.toString() || "");
      formDataToSend.append("occupation", formData.occupation || "");
      formDataToSend.append(
        "monthlyIncome",
        formData.monthlyIncome?.toString() || "",
      );
      formDataToSend.append("motherTongue", formData.motherTongue || "");
      formDataToSend.append("divyang", formData.divyang || "");
      formDataToSend.append("nativeCity", formData.nativeCity || "");
      formDataToSend.append("mothersName", formData.mothersName || "");
      formDataToSend.append("fathersName", formData.fathersName || "");
      formDataToSend.append("mamkul", formData.mamkul || "");
      formDataToSend.append(
        "parentsResidence",
        formData.parentsResidence || "",
      );
      formDataToSend.append("parentsCity", formData.parentsCity || "");
      formDataToSend.append("parentsContact", formData.parentsContact || "");
      formDataToSend.append("whatsApp", formData.whatsApp || "");
      formDataToSend.append("alternateNumber", formData.alternateNumber || "");
      formDataToSend.append("brothersCount", formData.brothersCount || "");
      formDataToSend.append("brothers", formData.brothers || "");
      formDataToSend.append("sisters", formData.sisters || "");
      formDataToSend.append(
        "sistersExactCount",
        formData.sistersExactCount || "",
      );
      formDataToSend.append("otherInfo", formData.otherInfo || "");
      formDataToSend.append("nativeVillage", formData.nativeVillage || "");
      formDataToSend.append("companyName", formData.companyName || "");
      formDataToSend.append("designation", formData.designation || "");
      formDataToSend.append("candidateNumber", formData.candidateNumber || "");
      formDataToSend.append("candidateEmail", formData.candidateEmail || "");
      formDataToSend.append("workLocation", formData.workLocation || "");
      formDataToSend.append("isWorking", String(formData.isWorking ?? false));
      formDataToSend.append("ageFrom", formData.ageFrom?.toString() || "");
      formDataToSend.append("ageTo", formData.ageTo?.toString() || "");
      formDataToSend.append(
        "heightFrom",
        formData.heightFrom?.toString() || "",
      );
      formDataToSend.append("heightTo", formData.heightTo?.toString() || "");
      formDataToSend.append(
        "expectedOccupation",
        formData.expectedOccupation || "",
      );
      formDataToSend.append(
        "expectedMonthlyIncome",
        Number(formData.expectedIncome) || "",
      );
      formDataToSend.append("workAbroad", formData.workAbroad || "");
      formDataToSend.append(
        "expectedMaritalStatus",
        formData.expectedMaritalStatus || "",
      );
      formDataToSend.append("divyangPrefer", formData.divyangPrefer || "");
      formDataToSend.append("childAccepted", formData.childAccepted || "");
      formDataToSend.append("sect", formData.sect || "");
      formDataToSend.append("manglik", formData.manglik || "");
      formDataToSend.append("foodPreference", formData.foodPreference || "");
      formDataToSend.append("bloodGroup", formData.bloodGroup || "");
      formDataToSend.append("specs", formData.specs || "");
      formDataToSend.append("gotra", formData.gotra || "");
      formDataToSend.append(
        "caste",
        formData.caste && typeof formData.caste === "object"
          ? JSON.stringify(formData.caste)
          : "",
      );
      // Education (array of strings)
      if (Array.isArray(formData.education)) {
        formData.education.forEach((edu, index) => {
          formDataToSend.append(`education[${index}]`, edu.degree || "");
        });
      } else {
        formDataToSend.append("education", "");
      }

      // Expected Education (array of strings)
      if (Array.isArray(formData.expectedEducation)) {
        formData.expectedEducation.forEach((edu, index) => {
          formDataToSend.append(
            `expectedEducation[${index}]`,
            edu.degree || "",
          );
        });
      } else {
        formDataToSend.append("expectedEducation", "");
      }

      // Nationality (array of strings)
      if (Array.isArray(formData.nationality)) {
        formData.nationality.forEach((nat, index) => {
          formDataToSend.append(`nationality[${index}]`, nat || "");
        });
      } else {
        formDataToSend.append("nationality", "");
      }

      // Expected Nationality (array of strings)
      if (Array.isArray(formData.expectedNationality)) {
        formData.expectedNationality.forEach((nat, index) => {
          formDataToSend.append(`expectedNationality[${index}]`, nat || "");
        });
      } else {
        formDataToSend.append("expectedNationality", "");
      }

      // Caste (object with religion, caste, subCaste)

      // Children (array of objects)
      if (Array.isArray(formData.children)) {
        formDataToSend.append("children", JSON.stringify(formData.children));
      } else {
        formDataToSend.append("children", "");
      }

      // Expected Religion (array of objects, JSON string)
      formDataToSend.append(
        "expectedReligion",
        JSON.stringify(
          religionPreferences?.length
            ? religionPreferences.map((item) => ({
                religion: item.religion || "ANY",
                caste: item.caste || "ANY",
                subCaste: item.subCaste || "ANY",
              }))
            : [],
        ),
      );

      // Expected Native Location (array of objects, JSON string)
      formDataToSend.append(
        "expectedNativeLocation",
        JSON.stringify(
          nativeLocationPreferences?.length
            ? nativeLocationPreferences.map((item) => ({
                country: item.country || "ANY",
                state: item.state || "ANY",
                city: item.city || "ANY",
              }))
            : [],
        ),
      );

      // Expected Working Location (array of objects, JSON string)
      formDataToSend.append(
        "expectedWorkingLocation",
        JSON.stringify(
          workingLocationPreferences?.length
            ? workingLocationPreferences.map((item) => ({
                country: item.country || "ANY",
                state: item.state || "ANY",
                city: item.city || "ANY",
              }))
            : [],
        ),
      );

      // Files
      const fileFields = [
        "profilePic",
        "userPhotoOne",
        "userPhotoTwo",
        "userPhotoThree",
        "userPhotoFour",
      ];
      fileFields.forEach((key) => {
        if (formData[key] instanceof File) {
          formDataToSend.append(key, formData[key]);
        } else {
          formDataToSend.append(key, "");
        }
      });

      // Debugging FormData entries
      console.log("FormData entries:");
      for (let [key, value] of formDataToSend.entries()) {
        console.log(`${key}: ${value}`);
      }

      // Submit to backend
      const response = await axios.post(
        "http://127.0.0.1:8000/api/user/register",
        formDataToSend,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        },
      );

      // Handle success
      if (response.data?.status || response.status === 200) {
        toast.success(response.data.message || "User created successfully");
        setIsSubmitted(true);
        setBioDataDetails(response.data?.user);
        setUser(response.data?.user);
        setDisplay(true);
        navigate(`/biodata/${response.data?.user._id}`);
      }
    } catch (error) {
      console.error("Form submission error:", error);
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  useEffect(() => {
    setValue("expectedEducation", partnerEducation);
  }, [partnerEducation, setValue]);

  // Confirmation Modal component (place it before your main form JSX)
  const ConfirmationModal = () => {
    // Get current form values
    const formValues = getValues();
    if (!showConfirmModal) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-2xl">
          <h2 className="text-xl font-semibold text-red-700 mb-4 text-center">
            Confirm Basic Details
          </h2>
          <p className="text-gray-600 mb-6 text-center">
            You won't be allowed to edit the following fields after
            registration. Please edit NOW in case you want to make any changes
            to:
          </p>
          <div>
            <span className="font-medium text-gray-700">Gender:</span>
            <span className="ml-2 text-gray-600 capitalize">
              {formValues.gender || "Not selected"}
            </span>
          </div>
          <div>
            <span className="font-medium text-gray-700">Date of Birth:</span>
            <span className="ml-2 text-gray-600">
              {formValues.dob
                ? new Date(formValues.dob).toLocaleDateString("en-GB")
                : "Not selected"}
            </span>
          </div>
          <div>
            <span className="font-medium text-gray-700">Caste:</span>
            <span className="ml-2 text-gray-600">
              {selectedCaste || "Not selected"}
            </span>
          </div>
          <div className="flex gap-4 justify-center">
            <button
              type="button"
              onClick={handleConfirmEdit}
              className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
            >
              Edit
            </button>
            <button
              type="button"
              onClick={handleConfirmSave}
              className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    );
  };

  const today = new Date();
  const [maxDate, setMaxDate] = useState("");
  useEffect(() => {
    const today = new Date();
    let ageLimit = gender === "male" ? 21 : 18;
    const limitedDate = new Date(
      today.getFullYear() - ageLimit,
      today.getMonth(),
      today.getDate(),
    );
    setMaxDate(limitedDate.toISOString().split("T")[0]);
  }, [gender]);
  // const maxDate = new Date(
  //   today.getFullYear() - 18,
  //   today.getMonth(),
  //   today.getDate()
  // )
  //   .toISOString()
  //   .split("T")[0];

  // this will check is form submitted or not if yes then render userbiodata
  // if (isSubmitted) {
  //   return <BiodataProfile bioDataDetails={bioDataDetails} />;
  // }

  return display ? (
    <BiodataProfile />
  ) : (
    <div className="min-h-screen bg-gradient-to-br py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Step Indicator */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            {steps.map((step) => {
              const Icon = step.icon;
              return (
                <div key={step.number} className="flex flex-col items-center">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 transition-all ${
                      currentStep >= step.number
                        ? "bg-red-600 text-white shadow-lg"
                        : "bg-red-200 text-red-500"
                    }`}
                  >
                    <Icon size={20} />
                  </div>
                  <span
                    className={`text-sm font-medium ${
                      currentStep >= step.number
                        ? "text-red-600"
                        : "text-red-500"
                    }`}
                  >
                    {step.title}
                  </span>
                </div>
              );
            })}
          </div>
          <div className="mt-4 bg-red-200 h-2 rounded-full">
            <div
              className="bg-red-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / 4) * 100}%` }}
            />
          </div>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && currentStep !== 4) {
              e.preventDefault(); // Prevent form submission on Enter unless on step 4
            }
          }}
          className="bg-white rounded-xl shadow-xl p-8"
        >
          {/* Step 1: Personal Info */}
          {currentStep === 1 && (
            <>
              <div className="space-y-6">
                {/* Login Credentials */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-red-700 mb-2">
                      Mobile Number *
                    </label>
                    <Controller
                      name="loginNumber"
                      control={control}
                      rules={{
                        pattern: {
                          value: /^[6-9]\d{9}$/,
                          message: "Enter a valid 10-digit mobile number",
                        },
                        required: "Login number is required",
                      }}
                      render={({ field }) => (
                        <input
                          {...field}
                          type="tel"
                          disabled={isLoggedIn}
                          className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent ${
                            isLoggedIn ? "bg-red-100 cursor-not-allowed" : ""
                          }`}
                          minLength="10"
                          maxLength="10"
                          placeholder="Enter login number"
                          ref={loginNum}
                        />
                      )}
                    />
                    {errors.loginNumber && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.loginNumber.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-red-700 mb-2">
                      Login Email *
                    </label>
                    <Controller
                      name="loginEmail"
                      control={control}
                      rules={{
                        required: "Email is required",
                        pattern: {
                          value: /^\S+@\S+$/i,
                          message: "Invalid email",
                        },
                      }}
                      render={({ field }) => (
                        <input
                          {...field}
                          type="email"
                          disabled={isLoggedIn}
                          className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent ${
                            isLoggedIn ? "bg-red-100 cursor-not-allowed" : ""
                          }`}
                          placeholder="Enter email"
                          ref={loginEm}
                        />
                      )}
                    />
                    {errors.loginEmail && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.loginEmail.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-red-700 mb-2">
                      Pin *
                    </label>
                    <Controller
                      name="password"
                      control={control}
                      rules={{ required: "Pin is required" }}
                      render={({ field }) => (
                        <div className="flex space-x-2">
                          {[0, 1, 2, 3, 4, 5].map((index) => (
                            <input
                              key={index}
                              type="password"
                              maxLength="6"
                              minLength="6"
                              disabled={isLoggedIn}
                              className={`w-10 h-10 text-center border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-lg font-semibold ${
                                isLoggedIn
                                  ? "bg-red-100 cursor-not-allowed"
                                  : ""
                              }`}
                              onChange={(e) => {
                                const value = e.target.value;
                                const currentPassword = field.value || "";
                                const newPassword = currentPassword.split("");
                                newPassword[index] = value;

                                // Fill array to ensure 6 characters
                                while (newPassword.length < 6) {
                                  newPassword.push("");
                                }

                                field.onChange(newPassword.join(""));

                                // Auto-focus next input
                                if (value && index < 5) {
                                  const nextInput =
                                    e.target.parentElement.children[index + 1];
                                  if (nextInput) nextInput.focus();
                                }
                              }}
                              onKeyDown={(e) => {
                                // Handle backspace to go to previous input
                                if (
                                  e.key === "Backspace" &&
                                  !e.target.value &&
                                  index > 0
                                ) {
                                  const prevInput =
                                    e.target.parentElement.children[index - 1];
                                  if (prevInput) prevInput.focus();
                                }
                              }}
                              value={(field.value || "").charAt(index) || ""}
                              ref={pass}
                            />
                          ))}
                        </div>
                      )}
                    />
                    {errors.password && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.password.message}
                      </p>
                    )}
                  </div>

                  {/* Login Button */}
                  <div className="flex justify-center items-center">
                    <button
                      type="button"
                      onClick={submittor}
                      disabled={isLoggedIn}
                      className={`px-6 py-2 rounded-lg font-medium transition-all cursor-pointer ${
                        isLoggedIn
                          ? "bg-green-100 text-green-700 cursor-not-allowed"
                          : isRegistered
                            ? "bg-blue-600 text-white hover:bg-blue-700 shadow-lg hover:shadow-xl"
                            : "bg-red-600 text-white hover:bg-red-700 shadow-lg hover:shadow-xl"
                      }`}
                    >
                      {isLoggedIn
                        ? "✓ Logged In"
                        : isRegistered
                          ? "Login"
                          : "Submit"}
                    </button>
                  </div>
                </div>

                <p className="text-sm text-red-600 font-medium mb-4">
                  Use above credentials for login
                </p>
                <hr className="my-6" />

                {/* Personal Information */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-red-700 mb-2">
                      First Name *
                    </label>
                    <Controller
                      name="firstName"
                      control={control}
                      rules={{ required: "First name is required" }}
                      render={({ field }) => (
                        <input
                          {...field}
                          type="text"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                          placeholder="Enter first name"
                        />
                      )}
                    />
                    {errors.firstName && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.firstName.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-red-700 mb-2">
                      Middle Name *
                    </label>
                    <Controller
                      name="midname"
                      control={control}
                      rules={{ required: "Middle name is required" }}
                      render={({ field }) => (
                        <input
                          {...field}
                          type="text"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                          placeholder="Enter Middle name"
                        />
                      )}
                    />
                    {errors.midname && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.midname.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-red-700 mb-2">
                      Last Name *
                    </label>
                    <Controller
                      name="lastName"
                      control={control}
                      rules={{ required: "Last name is required" }}
                      render={({ field }) => (
                        <input
                          ref={getting}
                          {...field}
                          type="text"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                          placeholder="Enter last name"
                        />
                      )}
                    />
                    {errors.lastName && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.lastName.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-red-700 mb-3">
                      Gender *
                    </label>
                    <Controller
                      name="gender"
                      control={control}
                      rules={{ required: "Gender is required" }}
                      render={({ field }) => (
                        <div className="space-y-2 flex justify-start gap-6">
                          <div className="flex items-center">
                            <input
                              {...field}
                              type="radio"
                              id="male"
                              value="male"
                              disabled={fieldsLocked}
                              checked={field.value === "male"}
                              onChange={(e) => {
                                field.onChange(e);
                                setGender(e.target.value);
                              }}
                              className="h-4 w-4 accent-[#7d0a0a]"
                            />
                            <label
                              htmlFor="male"
                              className="ml-2 text-sm text-red-700"
                            >
                              Male
                            </label>
                          </div>
                          <div className="flex items-center">
                            <input
                              {...field}
                              type="radio"
                              id="female"
                              value="female"
                              disabled={fieldsLocked}
                              checked={field.value === "female"}
                              onChange={(e) => {
                                field.onChange(e);
                                setGender(e.target.value);
                              }}
                              className="h-4 w-4 accent-[#7d0a0a]"
                            />
                            <label
                              htmlFor="female"
                              className="ml-2 text-sm text-red-700"
                            >
                              Female
                            </label>
                          </div>
                        </div>
                      )}
                    />
                    {errors.gender && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.gender.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-red-700 mb-2">
                      Date of Birth *
                    </label>
                    <Controller
                      name="dob"
                      control={control}
                      rules={{ required: "Date of birth is required" }}
                      render={({ field }) => (
                        <input
                          {...field}
                          type="date"
                          disabled={fieldsLocked}
                          max={maxDate}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        />
                      )}
                    />
                    {errors.dob && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.dob.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-red-700 mb-2">
                      Time of Birth
                    </label>
                    <Controller
                      name="timeOfBirth"
                      control={control}
                      // rules={{ required: "Time of birth is required" }}
                      render={({ field }) => (
                        <input
                          {...field}
                          type="time"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        />
                      )}
                    />
                    {errors.timeOfBirth && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.timeOfBirth.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-red-700 mb-2">
                      Place of Birth
                    </label>
                    <Controller
                      name="placeOfBirth"
                      control={control}
                      // rules={{ required: "Place of birth is required" }}
                      render={({ field }) => (
                        <input
                          {...field}
                          type="text"
                          placeholder="Enter Village / Town / City Name"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        />
                      )}
                    />
                    {errors.placeOfBirth && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.placeOfBirth.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-red-700 mb-2">
                      Marital Status *
                    </label>
                    <Controller
                      name="maritalStatus"
                      control={control}
                      rules={{ required: "Marital Status is required" }}
                      render={({ field }) => (
                        <select
                          {...field}
                          onChange={(e) => {
                            field.onChange(e);
                            // Open child modal for these statuses
                            if (
                              [
                                "widowed",
                                "divorced",
                                "divorce in process",
                              ].includes(e.target.value)
                            ) {
                              setShowChildModal(true);
                            }
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        >
                          <option value="Unmarried">Unmarried</option>
                          <option value="divorced">Divorced</option>
                          <option value="widowed">Widowed</option>
                          <option value="divorceinprocess">
                            Divorce in Process
                          </option>
                        </select>
                      )}
                    />
                    {errors.maritalStatus && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.maritalStatus.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-red-700 mb-2">
                      Height *
                    </label>
                    <Controller
                      name="height"
                      control={control}
                      rules={{ required: "Height is required" }}
                      render={({ field }) => (
                        <select
                          {...field}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        >
                          <option value="">Select Height</option>
                          {heightOptions.map((height) => (
                            <option key={height.value} value={height.value}>
                              {height.label}
                            </option>
                          ))}
                        </select>
                      )}
                    />
                    {errors.height && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.height.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-red-700 mb-2">
                      Occupation *
                    </label>
                    <Controller
                      name="occupation"
                      control={control}
                      rules={{ required: "Occupation is required" }}
                      render={({ field }) => (
                        <select
                          {...field}
                          className={`w-full px-3 py-2 border ${
                            errors.occupation
                              ? "border-red-500"
                              : "border-gray-300"
                          } rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent`}
                        >
                          <option value="">Select Occupation</option>
                          {occupations.map((occ) => (
                            <option key={occ} value={occ}>
                              {occ}
                            </option>
                          ))}
                        </select>
                      )}
                    />
                    {errors.occupation && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.occupation.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-red-700 mb-2">
                      Monthly Income ( INR ) *
                    </label>
                    <Controller
                      name="monthlyIncome"
                      control={control}
                      rules={{
                        required: "Monthly income is required",
                        pattern: {
                          message:
                            "Enter a number up to 10,00,000 (comma optional)",
                        },
                      }}
                      render={({ field }) => (
                        <input
                          {...field}
                          type="text"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                          placeholder="Enter Monthly Income"
                        />
                      )}
                    />
                    {errors.monthlyIncome && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.monthlyIncome.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <Controller
                      name="nationality"
                      control={control}
                      rules={{ required: "Nationality is required" }}
                      render={({ field }) => (
                        <SearchableDropdown
                          options={nationalities}
                          selectedValues={field.value || ["India"]}
                          onSelectionChange={field.onChange}
                          placeholder="Select nationality"
                          label="Nationality"
                          maxSelectable={"2"}
                        />
                      )}
                    />
                    {errors.nationality && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.nationality.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-red-700 mb-2">
                      Caste *
                    </label>
                    <Controller
                      name="caste"
                      control={control}
                      rules={{ required: "Caste is required" }}
                      render={({ field }) => (
                        <Select
                          isDisabled={fieldsLocked}
                          options={casteOptions}
                          // IMPORTANT: compare objects by JSON.stringify to find selected
                          value={
                            casteOptions.find(
                              (opt) =>
                                JSON.stringify(opt.value) ===
                                JSON.stringify(field.value),
                            ) || null
                          }
                          onChange={(selectedOption) => {
                            field.onChange(selectedOption.value); // sets entire object { subCaste, caste, religion }
                            setSelectedCaste(selectedOption.label); // your display tracking
                          }}
                          classNamePrefix="react-select"
                          placeholder="Select Caste"
                          styles={{
                            control: (base) => ({
                              ...base,
                              border: "none",
                              boxShadow: "none",
                              backgroundColor: "transparent",
                            }),
                            dropdownIndicator: (base) => ({
                              ...base,
                              padding: 4,
                            }),
                            indicatorSeparator: () => ({ display: "none" }),
                          }}
                          className="w-full px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        />
                      )}
                    />
                    {errors.caste && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.caste.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-red-700 mb-2">
                      Mother Tongue *
                    </label>
                    <Controller
                      name="motherTongue"
                      control={control}
                      rules={{ required: "Mother tongue is required" }}
                      render={({ field }) => (
                        <select
                          {...field}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        >
                          {motherTongue.map((ele, index) => (
                            <option key={index}>{ele.motherTongue}</option>
                          ))}
                        </select>
                      )}
                    />
                    {errors.nationality && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.caste.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-red-700 mb-3">
                      Divyang *
                    </label>
                    <Controller
                      name="divyang"
                      control={control}
                      rules={{ required: "This is required" }}
                      render={({ field }) => (
                        <div className="space-y-2 flex justify-start gap-6">
                          <div className="flex items-center">
                            <input
                              {...field}
                              type="radio"
                              id="yes"
                              value="Yes"
                              checked={field.value === "Yes"}
                              className="h-4 w-4 accent-[#7d0a0a] text-red-600 focus:ring-red-500 border-gray-300"
                            />
                            <label
                              htmlFor="yes"
                              className="ml-2 text-sm text-red-700"
                            >
                              Yes
                            </label>
                          </div>
                          <div className="flex items-center">
                            <input
                              {...field}
                              type="radio"
                              id="no"
                              value="No"
                              checked={field.value === "No"}
                              className="h-4 w-4 accent-[#7d0a0a] text-red-600 focus:ring-red-500 border-gray-300"
                            />
                            <label
                              htmlFor="no"
                              className="ml-2 text-sm text-red-700"
                            >
                              No
                            </label>
                          </div>
                        </div>
                      )}
                    />
                    {errors.divyang && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.divyang.message}
                      </p>
                    )}
                  </div>

                  {/* Spectacles Section */}
                  <div>
                    <label className="block text-sm font-medium text-red-700 mb-3">
                      Spectacles
                    </label>
                    <Controller
                      name="specs"
                      control={control}
                      render={({ field }) => (
                        <div className="space-y-3 sm:space-y-0 sm:flex sm:gap-6">
                          <label className="flex items-center">
                            <input
                              {...field}
                              type="radio"
                              value="yes"
                              className="mr-2 flex-shrink-0 accent-[#7d0a0a] h-4 w-4"
                            />
                            <span className="text-sm">Yes</span>
                          </label>
                          <label className="flex items-center">
                            <input
                              {...field}
                              type="radio"
                              value="no"
                              className="mr-2 flex-shrink-0 accent-[#7d0a0a] h-4 w-4"
                            />
                            <span className="text-sm">No</span>
                          </label>
                        </div>
                      )}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-red-700 mb-2">
                      Father's Name *
                    </label>
                    <Controller
                      name="fathersName"
                      control={control}
                      rules={{ required: "Father's name is required" }}
                      render={({ field }) => (
                        <input
                          {...field}
                          type="text"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                          placeholder="Enter full name"
                        />
                      )}
                    />
                    {errors.fathersName && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.fathersName.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-red-700 mb-2">
                      Mother's Name *
                    </label>
                    <Controller
                      name="mothersName"
                      control={control}
                      rules={{ required: "Mother's name is required" }}
                      render={({ field }) => (
                        <input
                          {...field}
                          type="text"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                          placeholder="Enter full name"
                        />
                      )}
                    />
                    {errors.mothersName && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.mothersName.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-red-700 mb-2">
                      Mamkul *
                    </label>
                    <Controller
                      name="mamkul"
                      control={control}
                      rules={{ required: "Mamkul surname is required" }}
                      render={({ field }) => (
                        <input
                          {...field}
                          type="text"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                          placeholder="Enter Surname"
                        />
                      )}
                    />
                    {errors.mamkul && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.mamkul.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-red-700 mb-2">
                      Parent's Residence *
                    </label>
                    <Controller
                      name="parentsResidence"
                      control={control}
                      rules={{ required: "Parents residence is required" }}
                      render={({ field }) => (
                        <input
                          {...field}
                          type="text"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                          placeholder="Enter Address"
                        />
                      )}
                    />
                    {errors.parentsResidence && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.parentsResidence.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-red-700 mb-2">
                      Parent's City *
                    </label>
                    <Controller
                      name="parentsCity"
                      control={control}
                      rules={{ required: "Parents city is required" }}
                      render={({ field }) => (
                        <Select
                          {...field}
                          disabled={fieldsLocked}
                          options={cities}
                          value={casteOptions.find(
                            (opt) => opt.value === field.value || null,
                          )}
                          onChange={(selectedOption) => {
                            field.onChange(selectedOption.value);
                            setSelectedParentCity(selectedOption.label);
                          }}
                          classNamePrefix="react-select"
                          placeholder="Select City"
                          styles={{
                            control: (base, state) => ({
                              ...base,
                              border: "none",
                              boxShadow: "none", // removes the blue border when focused
                              backgroundColor: "transparent", // optional
                            }),
                            dropdownIndicator: (base) => ({
                              ...base,
                              padding: 4,
                            }),
                            indicatorSeparator: () => ({ display: "none" }), // optional: remove vertical separator
                          }}
                          className="w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        >
                          <option value="">Select City</option>
                          {cities.map((ele, index) => (
                            <option key={index}>
                              {ele.city}, {ele.state}, {ele.country}
                            </option>
                          ))}
                        </Select>
                      )}
                    />
                    {errors.parentsCity && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.parentsCity.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-red-700 mb-2">
                      Parent's Contact *
                    </label>
                    <Controller
                      name="parentsContact"
                      control={control}
                      rules={{
                        pattern: {
                          value: /^[6-9]\d{9}$/,
                          message: "Enter a valid 10-digit mobile number",
                        },
                        required: "Parents Number is required",
                      }}
                      render={({ field }) => (
                        <input
                          {...field}
                          minLength="10"
                          maxLength="10"
                          type="tel"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                          placeholder="Enter Mobile Number"
                        />
                      )}
                    />
                    {errors.parentsContact && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.parentsContact.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-red-700 mb-2">
                      Whatsapp Number *
                    </label>
                    <Controller
                      name="whatsApp"
                      control={control}
                      rules={{
                        pattern: {
                          value: /^[6-9]\d{9}$/,
                          message: "Enter a valid 10-digit mobile number",
                        },
                        required: "Whatsapp Number is required",
                      }}
                      render={({ field }) => (
                        <input
                          {...field}
                          minLength="10"
                          maxLength="10"
                          type="tel"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                          placeholder="Enter Mobile Number"
                        />
                      )}
                    />
                    {errors.whatsApp && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.whatsApp.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-red-700 mb-2">
                      Alternate Number
                    </label>
                    <Controller
                      name="alternateNumber"
                      control={control}
                      rules={{
                        pattern: {
                          value: /^[6-9]\d{9}$/,
                          message: "Enter a valid 10-digit mobile number",
                        },
                      }}
                      render={({ field }) => (
                        <input
                          {...field}
                          minLength="10"
                          maxLength="10"
                          type="tel"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                          placeholder="Enter Mobile Number"
                        />
                      )}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-red-700 mb-3">
                      Number of Brother(s) *
                    </label>
                    <Controller
                      name="brothersCount"
                      control={control}
                      rules={{ required: "This is required" }}
                      render={({ field }) => (
                        <div className="space-y-2">
                          <div className="flex justify-start gap-6 flex-wrap">
                            <div className="flex items-center">
                              <input
                                {...field}
                                type="radio"
                                id="brothers-0"
                                value="0"
                                checked={field.value === "0"}
                                className="h-4 w-4 accent-[#7d0a0a] text-red-600 focus:ring-red-500 border-gray-300"
                              />
                              <label
                                htmlFor="brothers-1"
                                className="ml-2 text-sm text-red-700"
                              >
                                0
                              </label>
                            </div>
                            <div className="flex items-center">
                              <input
                                {...field}
                                type="radio"
                                id="brothers-1"
                                value="1"
                                checked={field.value === "1"}
                                className="h-4 w-4 accent-[#7d0a0a] text-red-600 focus:ring-red-500 border-gray-300"
                              />
                              <label
                                htmlFor="brothers-1"
                                className="ml-2 text-sm text-red-700"
                              >
                                1
                              </label>
                            </div>
                            <div className="flex items-center">
                              <input
                                {...field}
                                type="radio"
                                id="brothers-2"
                                value="2"
                                checked={field.value === "2"}
                                className="h-4 w-4 accent-[#7d0a0a] text-red-600 focus:ring-red-500 border-gray-300"
                              />
                              <label
                                htmlFor="brothers-2"
                                className="ml-2 text-sm text-red-700"
                              >
                                2
                              </label>
                            </div>
                            <div className="flex items-center">
                              <input
                                {...field}
                                type="radio"
                                id="brothers-3"
                                value="3"
                                checked={field.value === "3"}
                                className="h-4 w-4 accent-[#7d0a0a] text-red-600 focus:ring-red-500 border-gray-300"
                              />
                              <label
                                htmlFor="brothers-3"
                                className="ml-2 text-sm text-red-700"
                              >
                                3
                              </label>
                            </div>
                            <div className="flex items-center">
                              <input
                                {...field}
                                type="radio"
                                id="brothers-3plus"
                                value="3+"
                                checked={field.value === "3+"}
                                className="h-4 w-4 accent-[#7d0a0a] text-red-600 focus:ring-red-500 border-gray-300"
                              />
                              <label
                                htmlFor="brothers-3plus"
                                className="ml-2 text-sm text-red-700"
                              >
                                3+
                              </label>
                            </div>
                          </div>

                          {/* Conditional input field for 3+ option */}
                          {field.value === "3+" && (
                            <div className="mt-3">
                              <Controller
                                name="brothers"
                                control={control}
                                rules={{
                                  required:
                                    field.value === "3+"
                                      ? "Please Enter Number"
                                      : false,
                                  min: {
                                    value: 4,
                                    message: "Count should be at least 4",
                                  },
                                }}
                                render={({ field: exactCountField }) => (
                                  <div>
                                    <input
                                      {...exactCountField}
                                      type="text"
                                      id="brothers-exact-count"
                                      min="4"
                                      placeholder="Enter count"
                                      className="w-32 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 text-sm"
                                    />
                                  </div>
                                )}
                              />
                              {errors.brothersCount && (
                                <p className="text-red-500 text-xs mt-1">
                                  {errors.brothersCount.message}
                                </p>
                              )}
                            </div>
                          )}
                        </div>
                      )}
                    />
                    {errors.brothersCount && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.brothersCount.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-red-700 mb-3">
                      Number of Sister(s) *
                    </label>
                    <Controller
                      name="sisters"
                      control={control}
                      rules={{ required: "This is required" }}
                      render={({ field }) => (
                        <div className="space-y-2">
                          <div className="flex justify-start gap-6 flex-wrap">
                            <div className="flex items-center">
                              <input
                                {...field}
                                type="radio"
                                id="sisters-0"
                                value="0"
                                checked={field.value === "0"}
                                className="h-4 w-4 accent-[#7d0a0a] text-red-600 focus:ring-red-500 border-gray-300"
                              />
                              <label
                                htmlFor="sisters-0"
                                className="ml-2 text-sm text-red-700"
                              >
                                0
                              </label>
                            </div>
                            <div className="flex items-center">
                              <input
                                {...field}
                                type="radio"
                                id="sisters-1"
                                value="1"
                                checked={field.value === "1"}
                                className="h-4 w-4 accent-[#7d0a0a] text-red-600 focus:ring-red-500 border-gray-300"
                              />
                              <label
                                htmlFor="sisters-1"
                                className="ml-2 text-sm text-red-700"
                              >
                                1
                              </label>
                            </div>
                            <div className="flex items-center">
                              <input
                                {...field}
                                type="radio"
                                id="sisters-2"
                                value="2"
                                checked={field.value === "2"}
                                className="h-4 w-4 accent-[#7d0a0a] text-red-600 focus:ring-red-500 border-gray-300"
                              />
                              <label
                                htmlFor="sisters-2"
                                className="ml-2 text-sm text-red-700"
                              >
                                2
                              </label>
                            </div>
                            <div className="flex items-center">
                              <input
                                {...field}
                                type="radio"
                                id="sisters-3"
                                value="3"
                                checked={field.value === "3"}
                                className="h-4 w-4 accent-[#7d0a0a] text-red-600 focus:ring-red-500 border-gray-300"
                              />
                              <label
                                htmlFor="sisters-3"
                                className="ml-2 text-sm text-red-700"
                              >
                                3
                              </label>
                            </div>
                            <div className="flex items-center">
                              <input
                                {...field}
                                type="radio"
                                id="sisters-3plus"
                                value="3+"
                                checked={field.value === "3+"}
                                className="h-4 w-4 accent-[#7d0a0a] text-red-600 focus:ring-red-500 border-gray-300"
                              />
                              <label
                                htmlFor="sisters-3plus"
                                className="ml-2 text-sm text-red-700"
                              >
                                3+
                              </label>
                            </div>
                          </div>

                          {/* Conditional input field for 3+ option */}
                          {field.value === "3+" && (
                            <div className="mt-3">
                              <Controller
                                name="sistersExactCount" // Changed from "sisters" to "sistersExactCount"
                                control={control}
                                rules={{
                                  required:
                                    field.value === "3+"
                                      ? "Please Enter Number"
                                      : false,
                                  min: {
                                    value: 4,
                                    message: "Count should be at least 4",
                                  },
                                }}
                                render={({ field: exactCountField }) => (
                                  <div>
                                    <input
                                      {...exactCountField}
                                      type="text"
                                      id="sisters-exact-count"
                                      min="4"
                                      placeholder="Enter count"
                                      className="w-32 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 text-sm"
                                    />
                                  </div>
                                )}
                              />
                              {errors.sistersExactCount && ( // Changed from errors.sisters
                                <p className="text-red-500 text-xs mt-1">
                                  {errors.sistersExactCount.message}
                                </p>
                              )}
                            </div>
                          )}
                        </div>
                      )}
                    />
                    {errors.sisters && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.sisters.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-red-700 mb-2">
                      Native (Village / Town) *
                    </label>
                    <Controller
                      name="nativeVillage"
                      control={control}
                      rules={{ required: "Native place is required" }}
                      render={({ field }) => (
                        <input
                          {...field}
                          type="text"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                          placeholder="Enter Native Address"
                        />
                      )}
                    />
                    {errors.nativeVillage && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.nativeVillage.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-red-700 mb-2">
                      Native City *
                    </label>
                    <Controller
                      name="nativeCity"
                      control={control}
                      rules={{ required: "Native city is required" }}
                      render={({ field }) => (
                        <Select
                          {...field}
                          options={cities}
                          value={casteOptions.find(
                            (opt) => opt.value === field.value || null,
                          )}
                          onChange={(selectedOption) => {
                            field.onChange(selectedOption.value);
                            setSelectedParentCity(selectedOption.label);
                          }}
                          classNamePrefix="react-select"
                          placeholder="Select City"
                          styles={{
                            control: (base, state) => ({
                              ...base,
                              border: "none",
                              boxShadow: "none", // removes the blue border when focused
                              backgroundColor: "transparent", // optional
                            }),
                            dropdownIndicator: (base) => ({
                              ...base,
                              padding: 4,
                            }),
                            indicatorSeparator: () => ({ display: "none" }), // optional: remove vertical separator
                          }}
                          className="w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        >
                          <option value="">Select City</option>
                          {cities.map((ele, index) => (
                            <option key={index}>
                              {ele.city}, {ele.state}, {ele.country}
                            </option>
                          ))}
                        </Select>
                      )}
                    />
                    {errors.nativeCity && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.nativeCity.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>
              <hr className="bg-red-300 mt-4 mb-4" />
              <div className="w-full flex justify-between">
                <button
                  type="button"
                  className="bg-red-200 p-4 rounded-xl flex gap-4 items-center font-semibold text-red-500 cursor-not-allowed"
                >
                  {" "}
                  <ChevronLeft /> Previous
                </button>
                <button
                  type="button"
                  className="bg-red-200 p-4 rounded-xl flex gap-4 items-center font-semibold text-red-500 cursor-pointer"
                  onClick={async () => {
                    const isValid = await validateStep(currentStep);
                    if (!isValid) {
                      toast.warn("Please fill all required fields.");
                      return;
                    }
                    if (currentStep === 1) {
                      setShowConfirmModal(true);
                    } else {
                      setCurrentStep((prev) => prev + 1);
                    }
                  }}
                >
                  {" "}
                  Next
                  <ChevronRight />
                </button>
              </div>
            </>
          )}

          {/* Step 2: Education & Career */}
          {currentStep === 2 && (
            <>
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-red-800 mb-4">
                  Education
                </h3>

                {/* Education */}
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-xl font-bold text-gray-600">
                      ( Maximum 5 )
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
                              Degree
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
                                        edu.category === category.name,
                                    );
                                    const isDisabled =
                                      !isSelected &&
                                      selectedEducation.length >= 5;

                                    return (
                                      <button
                                        key={degree}
                                        type="button"
                                        onClick={() =>
                                          handleDegreeToggle(
                                            degree,
                                            category.name,
                                          )
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

                  {errors.education && (
                    <p className="text-red-500 text-sm mt-2">
                      {errors.education.message ||
                        "Please select at least one degree"}
                    </p>
                  )}
                </div>

                {/* Career Fields */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-red-700 mb-3">
                      Working Abroad *
                    </label>
                    <Controller
                      name="workAbroad"
                      control={control}
                      rules={{ required: "This is required" }}
                      render={({ field }) => (
                        <div className="space-y-2 flex justify-start gap-6">
                          <div className="flex items-center">
                            <input
                              {...field}
                              type="radio"
                              value="Yes"
                              checked={field.value === "Yes"}
                              className="h-4 w-4 accent-[#7d0a0a] text-red-600 focus:ring-red-500 border-gray-300"
                            />
                            <label
                              htmlFor="male"
                              className="ml-2 text-sm text-red-700"
                            >
                              Yes
                            </label>
                          </div>
                          <div className="flex items-center">
                            <input
                              {...field}
                              type="radio"
                              value="No"
                              checked={field.value === "No"}
                              className="h-4 w-4 accent-[#7d0a0a] text-red-600 focus:ring-red-500 border-gray-300"
                            />
                            <label
                              htmlFor="female"
                              className="ml-2 text-sm text-red-700"
                            >
                              No
                            </label>
                          </div>
                        </div>
                      )}
                    />
                    {errors.workAbroad && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.workAbroad.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-red-700 mb-2">
                      Company / Organization *
                    </label>
                    <Controller
                      name="companyName"
                      control={control}
                      rules={{ required: "Company name is required" }}
                      render={({ field }) => (
                        <input
                          {...field}
                          type="text"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                          placeholder="Enter company name"
                        />
                      )}
                    />
                    {errors.companyName && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.companyName.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-red-700 mb-2">
                      Nature of Work / Designation *
                    </label>
                    <Controller
                      name="designation"
                      control={control}
                      rules={{ required: "Designation is required" }}
                      render={({ field }) => (
                        <input
                          {...field}
                          type="text"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                          placeholder="Enter designation"
                        />
                      )}
                    />
                    {errors.designation && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.designation.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-red-700 mb-2">
                      Candidate Number
                    </label>
                    <Controller
                      name="candidateNumber"
                      control={control}
                      render={({ field }) => (
                        <input
                          {...field}
                          type="text"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                          placeholder="Enter Mobile Number"
                        />
                      )}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-red-700 mb-2">
                      Candidate Email
                    </label>
                    <Controller
                      name="candidateEmail"
                      control={control}
                      render={({ field }) => (
                        <input
                          {...field}
                          type="text"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                          placeholder="Enter Valid Email"
                        />
                      )}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-red-700 mb-2">
                      Work Location
                    </label>
                    <Controller
                      name="workLocation"
                      control={control}
                      render={({ field }) => (
                        <Select
                          {...field}
                          disabled={fieldsLocked}
                          options={cities}
                          value={cities.find(
                            (opt) => opt.value === field.value || null,
                          )}
                          onChange={(selectedOption) => {
                            field.onChange(selectedOption.value);
                            setSelectedWorkingLocation(selectedOption.label);
                          }}
                          classNamePrefix="react-select"
                          placeholder="Work location"
                          styles={{
                            control: (base, state) => ({
                              ...base,
                              border: "none",
                              boxShadow: "none", // removes the blue border when focused
                              backgroundColor: "transparent", // optional
                            }),
                            dropdownIndicator: (base) => ({
                              ...base,
                              padding: 4,
                            }),
                            indicatorSeparator: () => ({ display: "none" }), // optional: remove vertical separator
                          }}
                          className="w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        ></Select>
                      )}
                    />
                  </div>
                </div>
              </div>

              <hr className="mt-4 mb-4" />
              <div className="w-full flex justify-between">
                <button
                  type="button"
                  className="bg-red-200 p-4 rounded-xl flex gap-4 items-center font-semibold text-red-500"
                  onClick={() => {
                    setCurrentStep(currentStep - 1);
                  }}
                >
                  <ChevronLeft /> Previous
                </button>
                <button
                  type="button"
                  className="bg-red-200 p-4 rounded-xl flex gap-4 items-center font-semibold text-red-500 cursor-pointer"
                  onClick={async () => {
                    const isValid = await validateStep(currentStep);
                    if (!isValid) {
                      toast.warn("Please fill required fields");
                      return;
                    }
                    setCurrentStep(currentStep + 1);
                  }}
                >
                  Next <ChevronRight />
                </button>
              </div>
            </>
          )}

          {/* Step 3: Expectations */}
          {currentStep === 3 && (
            <>
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-red-800 mb-4">
                  Partner Expectations
                </h3>

                {/* Age Preference */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {/* Age From */}
                  <div>
                    <label className="block text-sm font-medium text-red-700 mb-2">
                      Age Difference
                    </label>
                    <Controller
                      name="ageFrom"
                      control={control}
                      rules={{ required: "Age from is required" }}
                      render={({ field }) => (
                        <select
                          {...field}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        >
                          <option value="">From</option>
                          {Array.from({ length: 31 }, (_, i) => i).map(
                            (age) => (
                              <option key={age} value={age}>
                                {age}
                              </option>
                            ),
                          )}
                        </select>
                      )}
                    />
                    {errors.ageFrom && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.ageFrom.message}
                      </p>
                    )}
                  </div>
                  {/* Age To */}
                  <div className="mt-5">
                    <label className="block text-sm font-medium text-red-700 mb-2"></label>
                    <Controller
                      name="ageTo"
                      control={control}
                      rules={{ required: "Age to is required" }}
                      render={({ field }) => (
                        <select
                          {...field}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        >
                          <option value="">To</option>
                          {Array.from({ length: 31 }, (_, i) => i).map(
                            (age) => (
                              <option
                                key={age}
                                value={age}
                                disabled={
                                  ageFrom !== undefined &&
                                  ageFrom !== "" &&
                                  age <= parseInt(ageFrom)
                                }
                              >
                                {age}
                              </option>
                            ),
                          )}
                        </select>
                      )}
                    />
                    {errors.ageTo && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.ageTo.message}
                      </p>
                    )}
                  </div>

                  {/* Height From */}
                  <div>
                    <label className="block text-sm font-medium text-red-700 mb-2">
                      Height From
                    </label>
                    <Controller
                      name="heightFrom"
                      control={control}
                      rules={{ required: "Height from is required" }}
                      render={({ field }) => (
                        <select
                          {...field}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        >
                          <option value="">From</option>
                          {heightOptions.map((height) => (
                            <option key={height.value} value={height.value}>
                              {height.label}
                            </option>
                          ))}
                        </select>
                      )}
                    />
                    {errors.heightFrom && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.heightFrom.message}
                      </p>
                    )}
                  </div>

                  {/* Height To */}
                  <div>
                    <label className="block text-sm font-medium text-red-700 mb-2">
                      Height To
                    </label>
                    <Controller
                      name="heightTo"
                      control={control}
                      rules={{ required: "Height to is required" }}
                      render={({ field }) => (
                        <select
                          {...field}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        >
                          <option value="">To</option>
                          {heightOptions.map((height) => (
                            <option
                              key={height.value}
                              value={height.value}
                              disabled={
                                heightFrom &&
                                parseInt(height.value) < parseInt(heightFrom)
                              }
                            >
                              {height.label}
                            </option>
                          ))}
                        </select>
                      )}
                    />
                    {errors.heightTo && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.heightTo.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Occupation */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
                  <div>
                    <label className="block text-sm font-medium text-red-700 mb-2">
                      Occupation
                    </label>
                    <Controller
                      name="expectedOccupation"
                      control={control}
                      rules={{ required: "Expected occupation is required" }}
                      render={({ field }) => (
                        <select
                          {...field}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        >
                          <option value="private_service">
                            Private Service
                          </option>
                          <option value="government_service">
                            Government Service
                          </option>
                          <option value="service_business">
                            Service + Business / Practice
                          </option>
                          <option value="business">Business</option>
                          <option value="student_internship">
                            Student / Internship
                          </option>
                          <option value="not_working">Not Working</option>
                          <option value="any">ANY</option>
                        </select>
                      )}
                    />
                    {errors.expectedOccupation && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.expectedOccupation.message}
                      </p>
                    )}
                  </div>

                  {/* Expected Income */}
                  <div>
                    <label className="block text-sm font-medium text-red-700 mb-2">
                      Income
                    </label>
                    <Controller
                      name="expectedIncome"
                      control={control}
                      rules={{ required: "Income is required" }}
                      render={({ field }) => (
                        <select
                          {...field}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        >
                          <option value="">Select Income</option>
                          <option value="">ANY</option>
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
                      )}
                    />
                    {errors.expectedIncome && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.expectedIncome.message}
                      </p>
                    )}
                  </div>
                  {/* Work Abroad Preference */}
                  <div className="mt-6">
                    <label className="block text-sm font-medium text-red-700 mb-3">
                      Do you prefer candidate working abroad?
                    </label>
                    <Controller
                      name="workAbroad"
                      control={control}
                      rules={{
                        required: "Please select work abroad preference",
                      }}
                      render={({ field }) => (
                        <div className="flex gap-6">
                          <label className="flex items-center">
                            <input
                              type="radio"
                              {...field}
                              value="Yes"
                              className="accent-[#7d0a0a] w-4 h-4 text-red-600 bg-gray-100 border-gray-300 focus:ring-red-500"
                            />
                            <span className="ml-2 text-sm text-gray-700">
                              Yes
                            </span>
                          </label>
                          <label className="flex items-center">
                            <input
                              type="radio"
                              {...field}
                              value="No"
                              defaultChecked
                              className="accent-[#7d0a0a] w-4 h-4 text-red-600 bg-gray-100 border-gray-300 focus:ring-red-500"
                            />
                            <span className="ml-2 text-sm text-gray-700">
                              No
                            </span>
                          </label>
                          {/* <label className="flex items-center">
                            <input
                              type="radio"
                              {...field}
                              value="any"
                              className="accent-[#7d0a0a] w-4 h-4 text-red-600 bg-gray-100 border-gray-300 focus:ring-red-500"
                            />
                            <span className="ml-2 text-sm text-gray-700">
                              Any
                            </span>
                          </label> */}
                        </div>
                      )}
                    />
                    {errors.workAbroad && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.workAbroad.message}
                      </p>
                    )}
                  </div>

                  {/* Divyaang */}
                  <div className="mt-6">
                    <label className="block text-sm font-medium text-red-700 mb-3">
                      Do you prefer divyang?
                    </label>
                    <Controller
                      name="divyangPrefer"
                      control={control}
                      rules={{
                        required: "Please select work divyang preference",
                      }}
                      render={({ field }) => (
                        <div className="flex gap-6">
                          <label className="flex items-center">
                            <input
                              type="radio"
                              {...field}
                              value="Yes"
                              className="accent-[#7d0a0a] w-4 h-4 text-red-600 bg-gray-100 border-gray-300 focus:ring-red-500"
                            />
                            <span className="ml-2 text-sm text-gray-700">
                              Yes
                            </span>
                          </label>
                          <label className="flex items-center">
                            <input
                              type="radio"
                              {...field}
                              value="No"
                              defaultChecked
                              className="accent-[#7d0a0a] w-4 h-4 text-red-600 bg-gray-100 border-gray-300 focus:ring-red-500"
                            />
                            <span className="ml-2 text-sm text-gray-700">
                              No
                            </span>
                          </label>
                        </div>
                      )}
                    />
                    {errors.divyangPrefer && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.divyangPrefer.message}
                      </p>
                    )}
                  </div>

                  {/* Nationality - Multi-select */}
                  <div>
                    <Controller
                      name="expectedNationality"
                      control={control}
                      render={({ field }) => (
                        <SearchableDropdown
                          options={expectedNationality}
                          selectedValues={field.value}
                          onSelectionChange={field.onChange}
                          placeholder="Select nationality"
                          label="Nationality"
                        />
                      )}
                    />
                  </div>
                </div>

                {/* Marital Status */}
                <div className="mt-6">
                  <label className="block text-sm font-medium text-red-700 mb-2">
                    Marital Status ( Multiple Choice )
                  </label>
                  <Controller
                    name="expectedMaritalStatus"
                    control={control}
                    defaultValue={[]}
                    rules={{
                      validate: (value) =>
                        value.length > 0 || "Marital status is required",
                    }}
                    render={({ field }) => {
                      const options = [
                        { value: "Unmarried", label: "Unmarried" },
                        { value: "divorced", label: "Divorced" },
                        { value: "widowed", label: "Widowed" },
                        {
                          value: "divorce_in_progress",
                          label: "Divorce in Progress",
                        },
                        { value: "any", label: "ANY" },
                      ];

                      const allOptionsExceptAny = options
                        .filter((o) => o.value !== "any")
                        .map((o) => o.value);

                      return (
                        <div className="space-y-3 flex gap-4 flex-wrap">
                          {options.map((option) => {
                            const isChecked = field.value?.includes(
                              option.value,
                            );

                            return (
                              <label
                                key={option.value}
                                className="flex items-center space-x-2 cursor-pointer"
                              >
                                <input
                                  type="checkbox"
                                  value={option.value}
                                  checked={isChecked}
                                  onChange={(e) => {
                                    let updatedValues = [
                                      ...(field.value || []),
                                    ];

                                    // ===== ANY CLICKED =====
                                    if (option.value === "any") {
                                      if (e.target.checked) {
                                        updatedValues = [
                                          "any",
                                          ...allOptionsExceptAny,
                                        ];
                                      } else {
                                        updatedValues = [];
                                      }
                                    } else {
                                      // ===== NORMAL OPTIONS =====
                                      if (e.target.checked) {
                                        updatedValues.push(option.value);
                                      } else {
                                        updatedValues = updatedValues.filter(
                                          (v) => v !== option.value,
                                        );
                                      }

                                      // remove ANY if user manually changes selections
                                      updatedValues = updatedValues.filter(
                                        (v) => v !== "any",
                                      );

                                      // if all normal options selected -> auto check ANY
                                      const selectedWithoutAny =
                                        updatedValues.filter(
                                          (v) => v !== "any",
                                        );

                                      const isAllSelected =
                                        allOptionsExceptAny.every((v) =>
                                          selectedWithoutAny.includes(v),
                                        );

                                      if (isAllSelected) {
                                        updatedValues.push("any");
                                      }
                                    }

                                    field.onChange(updatedValues);

                                    // Child acceptance logic
                                    const shouldShow = updatedValues.some(
                                      (v) => v !== "Unmarried" && v !== "any",
                                    );

                                    setShowChildAcceptance(shouldShow);
                                  }}
                                  className="w-4 h-4 accent-[#7d0a0a] border-gray-300 focus:ring-red-500"
                                />

                                <span className="text-gray-700">
                                  {option.label}
                                </span>
                              </label>
                            );
                          })}
                        </div>
                      );
                    }}
                  />
                  {errors.expectedMaritalStatus && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.expectedMaritalStatus.message}
                    </p>
                  )}
                </div>

                {/* Child Acceptance - Shows only when marital status is not unmarried */}
                {showChildAcceptance && (
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-red-700 mb-3">
                      Issue (Child) Accepted?
                    </label>
                    <Controller
                      name="childAccepted"
                      control={control}
                      rules={{
                        required: "Please select child acceptance preference",
                      }}
                      render={({ field }) => (
                        <div className="flex gap-6">
                          <label className="flex items-center">
                            <input
                              type="radio"
                              {...field}
                              value="Yes"
                              className="w-4 h-4 text-red-600 bg-gray-100 border-gray-300 focus:ring-red-500"
                            />
                            <span className="ml-2 text-sm text-gray-700">
                              Yes
                            </span>
                          </label>
                          <label className="flex items-center">
                            <input
                              type="radio"
                              {...field}
                              value="No"
                              className="w-4 h-4 text-red-600 bg-gray-100 border-gray-300 focus:ring-red-500"
                            />
                            <span className="ml-2 text-sm text-gray-700">
                              No
                            </span>
                          </label>
                        </div>
                      )}
                    />
                    {errors.childAccepted && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.childAccepted.message}
                      </p>
                    )}
                  </div>
                )}

                {/* partner edu */}
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
                                  {category.name === "ANY" ? (
                                    <button
                                      type="button"
                                      onClick={() =>
                                        partnerDegreeToggle(null, category.name)
                                      }
                                      className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors ${
                                        isAnySelected
                                          ? "bg-red-600 text-white hover:bg-red-700"
                                          : "bg-gray-100 text-gray-700 hover:bg-red-100 hover:text-red-700 border border-gray-300"
                                      }`}
                                    >
                                      ANY
                                      {isAnySelected && (
                                        <span className="ml-1">✓</span>
                                      )}
                                    </button>
                                  ) : (
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
                                    })
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

                {/* Religion & Caste Preference */}
                <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                  <label className="block text-sm font-medium text-red-700 mb-2">
                    Religion & Caste
                  </label>
                  <PreferenceSelector
                    title="Religion & Caste Preferences"
                    dropdown1Label="Religion"
                    dropdown2Label="Caste"
                    dropdown3Label="Subcaste"
                    api1Url="http://127.0.0.1:8000/api/user/get-religions"
                    api2Url="http://127.0.0.1:8000/api/user/get-caste-by-religion"
                    api3Url="http://127.0.0.1:8000/api/user/get-subcaste-by-caste"
                    api1Key="religion"
                    api2Key="caste"
                    api3Key="subCaste"
                    onPreferencesChange={(prefs) =>
                      setReligionPreferences(prefs)
                    }
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                  <label className="block text-sm font-medium text-red-700 mb-2">
                    Native Location Preference
                  </label>
                  <PreferenceSelector
                    title="Native Location Preferences"
                    dropdown1Label="Country"
                    dropdown2Label="State"
                    dropdown3Label="City"
                    api1Url="http://127.0.0.1:8000/api/user/get-all-countries"
                    api2Url="http://127.0.0.1:8000/api/user/get-state-by-country"
                    api3Url="http://127.0.0.1:8000/api/user/get-cities-by-state"
                    api1Key="country"
                    api2Key="state"
                    api3Key="city"
                    onPreferencesChange={(prefs) =>
                      setNativeLocationPreferences(prefs)
                    }
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                  <label className="block text-sm font-medium text-red-700 mb-2">
                    Working Location Preference
                  </label>
                  <PreferenceSelector
                    title="Working Location Preferences"
                    dropdown1Label="Country"
                    dropdown2Label="State"
                    dropdown3Label="City"
                    api1Url="http://127.0.0.1:8000/api/user/get-all-countries"
                    api2Url="http://127.0.0.1:8000/api/user/get-state-by-country"
                    api3Url="http://127.0.0.1:8000/api/user/get-cities-by-state"
                    api1Key="country"
                    api2Key="state"
                    api3Key="city"
                    onPreferencesChange={(prefs) =>
                      setWorkingLocationPreferences(prefs)
                    }
                  />
                </div>

                <div className="md:col-span-4">
                  <Controller
                    name="userPhotoOne"
                    control={control}
                    render={({ field: { onChange, value, ...field } }) => (
                      <div className="space-y-2">
                        <input
                          {...field}
                          type="file"
                          accept="image/*"
                          onChange={(e) => onChange(e.target.files?.[0])}
                          className="hidden"
                          id="photo-upload-one"
                        />
                        <label
                          htmlFor="photo-upload-one"
                          className="inline-block px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 cursor-pointer transition-colors"
                        >
                          Upload Photo
                        </label>
                        <p className="text-red-500 text-sm">
                          Upload a clear, recent photo.
                        </p>
                        {value && (
                          <>
                            <p className="text-green-600 text-sm">
                              Photo selected: {value.name}
                            </p>
                            <p>
                              Photo shall be updated after franchise approval.
                            </p>
                          </>
                        )}
                      </div>
                    )}
                  />
                </div>
              </div>
              <hr className="mt-4 mb-4" />
              <div className="w-full flex justify-between">
                <button
                  type="button"
                  className="bg-red-200 p-4 rounded-xl flex gap-4 items-center font-semibold text-red-500 "
                  onClick={() => {
                    setCurrentStep(currentStep - 1);
                  }}
                >
                  {" "}
                  <ChevronLeft /> Previous
                </button>
                <button
                  type="button"
                  className="bg-red-200 p-4 rounded-xl flex gap-4 items-center font-semibold text-red-500 cursor-pointer"
                  onClick={async () => {
                    const isValid = await validateStep(currentStep);
                    if (!isValid) {
                      toast.warn("please fill required fields");
                      return;
                    }
                    setCurrentStep(currentStep + 1);
                  }}
                >
                  {" "}
                  Next
                  <ChevronRight />
                </button>
              </div>
            </>
          )}

          {/* Step 4: Special Details */}
          {currentStep === 4 && (
            <>
              <div className="space-y-6 p-4">
                <h3 className="text-lg font-semibold text-[#7d0a0a] mb-4 flex items-center">
                  Additional Information ( FREE Extra Photo Upload for Filling
                  Below Info Correctly )
                </h3>

                <div className="space-y-8">
                  {/* Sect Section */}
                  <div>
                    <label className="block text-sm font-medium text-red-700 mb-3">
                      Sect ( Panth )
                    </label>
                    <Controller
                      name="sect"
                      control={control}
                      // rules={{ required: "Sect is required" }}
                      render={({ field }) => (
                        <div className="space-y-3 sm:space-y-0 sm:grid sm:grid-cols-2 lg:grid-cols-1 sm:gap-4">
                          <div className="flex items-center">
                            {sect.map((ele, index) => (
                              <div className="flex w-full" key={index}>
                                <input
                                  {...field}
                                  type="radio"
                                  value={ele.name}
                                  className="mr-2 flex-shrink-0 accent-[#7d0a0a] text-md"
                                />
                                <span className="text-sm">{ele.name}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    />
                    {errors.sect && (
                      <p className="text-red-500 text-xs mt-2">
                        {errors.sect.message}
                      </p>
                    )}
                  </div>

                  {/* Manglik Section */}
                  <div>
                    <label className="block text-sm font-medium text-red-700 mb-3">
                      Manglik
                    </label>
                    <Controller
                      name="manglik"
                      control={control}
                      // rules={{ required: "Manglik status is required" }}
                      render={({ field }) => (
                        <div className="space-y-3 sm:space-y-0 sm:grid sm:grid-cols-1 lg:grid-cols-1 sm:gap-4">
                          <div className="flex items-center">
                            {manglik.map((ele, index) => (
                              <div className="flex w-full " key={index}>
                                <input
                                  key={index}
                                  {...field}
                                  type="radio"
                                  value={ele.name}
                                  className="mr-2 flex-shrink-0 accent-[#7d0a0a] text-md"
                                />
                                <span className="text-sm">{ele.name}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    />
                    {errors.manglik && (
                      <p className="text-red-500 text-xs mt-2">
                        {errors.manglik.message}
                      </p>
                    )}
                  </div>

                  {/* Food Choices Section */}
                  <div>
                    <label className="block text-sm font-medium text-red-700 mb-3">
                      Food Preference
                    </label>
                    <Controller
                      name="foodPreference"
                      control={control}
                      // rules={{ required: "Food preference is required" }}
                      render={({ field }) => (
                        <div className="space-y-3 sm:space-y-0 sm:grid sm:grid-cols-1 lg:grid-cols-1 sm:gap-4">
                          <div className="flex items-center">
                            {foodPref.map((ele, index) => (
                              <div className="flex w-full " key={index}>
                                <input
                                  key={index}
                                  {...field}
                                  type="radio"
                                  value={ele.name}
                                  className="mr-2 flex-shrink-0 accent-[#7d0a0a] text-md"
                                />
                                <span className="text-sm">{ele.name}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    />
                    {errors.foodPreference && (
                      <p className="text-red-500 text-xs mt-2">
                        {errors.foodPreference.message}
                      </p>
                    )}
                  </div>

                  {/* Blood Group Section */}
                  <div>
                    <label className="block text-sm font-medium text-red-700 mb-3">
                      Blood Group
                    </label>
                    <Controller
                      name="bloodGroup"
                      control={control}
                      render={({ field }) => (
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                          {bloodGroups.map((group) => (
                            <label key={group} className="flex items-center">
                              <input
                                {...field}
                                type="radio"
                                value={group}
                                className="mr-2 flex-shrink-0"
                              />
                              <span className="text-sm">{group}</span>
                            </label>
                          ))}
                        </div>
                      )}
                    />
                  </div>

                  <div className="w-1/3">
                    <label className="block text-sm font-medium text-red-700 mb-2">
                      Other Information ( MAX 300 Characters )
                    </label>
                    <Controller
                      name="otherInfo"
                      control={control}
                      render={({ field }) => (
                        <textarea
                          {...field}
                          type="text"
                          maxLength={300}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                          placeholder="Enter Hobbies, Achivements, etc. "
                        />
                      )}
                    />
                  </div>

                  {/* Photo Upload Section */}
                  <div>
                    <Controller
                      name="userPhotoFour"
                      control={control}
                      render={({ field: { onChange, value, ...field } }) => (
                        <div className="space-y-3">
                          <input
                            {...field}
                            type="file"
                            accept="image/*"
                            onChange={(e) => onChange(e.target.files?.[0])}
                            className="hidden"
                            id="photo-upload"
                            disabled={!isStep4Complete()}
                          />
                          <label
                            htmlFor="photo-upload"
                            className="inline-block px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 cursor-pointer transition-colors text-sm"
                          >
                            Upload Photo
                          </label>
                          <p className="text-red-500 text-sm">
                            Upload a clear, recent photo (JPG Max 200kb)
                          </p>
                          {value && (
                            <p className="text-green-600 text-sm">
                              Photo selected: {value.name}
                            </p>
                          )}
                          {/* {!isStep4Complete() && (
                            <p className="text-yellow-600 text-xs mt-1">
                              Please fill all above details before uploading
                              your photo.
                            </p>
                          )} */}
                        </div>
                      )}
                    />
                    <p>Photo shall be updated after franchisee approval.</p>
                  </div>

                  <p className="border-2 border-red-500 w-1/2 p-4 font-bold">
                    Upload Additional Photos After Paying Registration FEES
                  </p>
                  <div className="flex">
                    <div className="md:col-span-4">
                      <Controller
                        name="userPhotoTwo"
                        control={control}
                        render={({ field: { onChange, value, ...field } }) => (
                          <div className="space-y-2">
                            <input
                              {...field}
                              type="file"
                              accept="image/*"
                              onChange={(e) => onChange(e.target.files?.[0])}
                              className="hidden"
                              id="photo-upload-two"
                              disabled={true}
                            />
                            <label
                              htmlFor="photo-upload-two"
                              className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-red-700 cursor-pointer transition-colors"
                            >
                              Upload Photo
                            </label>
                            <p className="text-red-500 text-sm">
                              Upload a clear, recent photo.
                            </p>
                            {value && (
                              <>
                                <p className="text-green-600 text-sm">
                                  Photo selected: {value.name}
                                </p>
                                <p>
                                  Photo shall be updated after franchise
                                  approval.
                                </p>
                              </>
                            )}
                          </div>
                        )}
                      />
                    </div>
                    <div className="md:col-span-4">
                      <Controller
                        name="userPhotoThree"
                        control={control}
                        render={({ field: { onChange, value, ...field } }) => (
                          <div className="space-y-2">
                            <input
                              {...field}
                              type="file"
                              accept="image/*"
                              onChange={(e) => onChange(e.target.files?.[0])}
                              className="hidden"
                              id="photo-upload"
                              disabled
                            />
                            <label
                              htmlFor="photo-upload"
                              className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-red-700 cursor-pointer transition-colors"
                            >
                              Upload Photo
                            </label>

                            {value && (
                              <>
                                <p className="text-green-600 text-sm">
                                  Photo selected: {value.name}
                                </p>
                                <p>
                                  Photo shall be updated after franchise
                                  approval.
                                </p>
                              </>
                            )}
                          </div>
                        )}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <hr className="mt-4 mb-4" />
              <div className="w-full flex justify-between">
                <button
                  type="button"
                  className="bg-red-200 p-4 rounded-xl flex gap-4 items-center font-semibold text-red-500 "
                  onClick={() => {
                    setCurrentStep(currentStep - 1);
                  }}
                >
                  {" "}
                  <ChevronLeft /> Previous
                </button>
                <button
                  type="submit"
                  className="bg-red-200 p-4 rounded-xl flex gap-4 items-center font-semibold text-red-500 cursor-pointer"
                >
                  {" "}
                  Submit
                </button>
              </div>
            </>
          )}

          {/* Show submission error if exists */}
          {submissionError && (
            <>
              <div className="text-red-600 text-sm mt-2">
                Error: {submissionError}
              </div>
            </>
          )}
        </form>

        {/* Child Modal */}
        {showChildModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
              <h3 className="text-lg font-semibold text-red-800 mb-4">
                Do you have children?
              </h3>
              <div className="space-y-4">
                <div className="flex space-x-4">
                  <button
                    type="button"
                    onClick={() => {
                      setHasChildren(false);
                      setChildCount(0);
                      setValue("children", []);
                      setShowChildModal(false);
                    }}
                    className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                  >
                    No
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setHasChildren(true);
                      setShowChildModal(false);
                      setShowChildCountModal(true); // Show the count modal instead
                    }}
                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Yes
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Child Count Modal */}
        {showChildCountModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
              <h3 className="text-lg font-semibold text-red-800 mb-4">
                How many children do you have?
              </h3>
              <div className="space-y-4">
                <div className="flex gap-4 items-center">
                  {[0, 1, 2, 3].map((count) => (
                    <label key={count} className="flex items-center">
                      <input
                        type="radio"
                        name="childCount"
                        value={count}
                        checked={tempChildCount === count}
                        onChange={() => setTempChildCount(count)}
                        className="mr-2"
                      />
                      {count}
                    </label>
                  ))}

                  {/* More than 3 option */}
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="childCount"
                      value="more"
                      checked={tempChildCount > 3}
                      onChange={() => setTempChildCount(4)}
                      className="mr-2"
                    />
                    More than 3
                  </label>
                </div>

                {/* Conditional Text Input for more than 3 */}
                {tempChildCount > 3 && (
                  <div className="mt-2">
                    <input
                      type="number"
                      min="4"
                      max="10"
                      value={tempChildCount}
                      onChange={(e) =>
                        setTempChildCount(parseInt(e.target.value) || 4)
                      }
                      className="w-48 px-3 py-2 border border-red-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      placeholder="Enter number of children"
                    />
                  </div>
                )}
                <div className="flex space-x-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowChildCountModal(false);
                      setHasChildren(false);
                      setTempChildCount(0);
                    }}
                    className="flex-1 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (tempChildCount > 0 && tempChildCount <= 10) {
                        setChildCount(tempChildCount);
                        // Generate children array
                        const children = [];
                        for (let i = 0; i < tempChildCount; i++) {
                          children.push({
                            gender: "",
                            dob: "",
                            livesWith: "",
                          });
                        }
                        setValue("children", children);

                        // If using react-hook-form with useFieldArray, you might need:
                        // children.forEach(() => appendChild({ gender: "", dob: "", livesWith: "" }));

                        setShowChildCountModal(false);
                        setTempChildCount(0);
                        // Open the child details modal immediately after setting the count
                        setShowChildDetailsModal(true);
                      }
                    }}
                    disabled={tempChildCount < 1 || tempChildCount > 10}
                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    Confirm
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Children Details Modal */}
        {showChildDetailsModal && hasChildren && childCount > 0 && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-xl">
                <div className="flex justify-between items-center">
                  <h4 className="text-xl font-semibold text-red-800">
                    Children Details ({childCount}{" "}
                    {childCount === 1 ? "Child" : "Children"})
                  </h4>
                  <button
                    type="button"
                    onClick={() => setShowChildDetailsModal(false)}
                    className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
                  >
                    ×
                  </button>
                </div>
              </div>

              <div className="p-6">
                <div className="space-y-6">
                  {Array.from({ length: childCount }).map((_, index) => (
                    <div
                      key={index}
                      className="grid grid-cols-1 lg:grid-cols-4 gap-4 p-4 border border-red-200 rounded-lg bg-gray-50"
                    >
                      <div>
                        <label className="block text-sm font-medium text-red-700 mb-2">
                          Child {index + 1} - Gender
                        </label>
                        <Controller
                          name={`children.${index}.gender`}
                          control={control}
                          render={({ field }) => (
                            <div className="space-y-2">
                              <label className="flex items-center">
                                <input
                                  {...field}
                                  type="radio"
                                  value="boy"
                                  checked={field.value === "boy"}
                                  onChange={(e) =>
                                    field.onChange(e.target.value)
                                  }
                                  className="mr-2"
                                />
                                Boy
                              </label>
                              <label className="flex items-center">
                                <input
                                  {...field}
                                  type="radio"
                                  value="girl"
                                  checked={field.value === "girl"}
                                  onChange={(e) =>
                                    field.onChange(e.target.value)
                                  }
                                  className="mr-2"
                                />
                                Girl
                              </label>
                            </div>
                          )}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-red-700 mb-2">
                          Date of Birth
                        </label>
                        <Controller
                          name={`children.${index}.dob`}
                          control={control}
                          render={({ field }) => (
                            <input
                              {...field}
                              type="date"
                              max={
                                new Date(Date.now() - 86400000)
                                  .toISOString()
                                  .split("T")[0]
                              } // yesterday's date
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                            />
                          )}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-red-700 mb-2">
                          Lives With
                        </label>
                        <Controller
                          name={`children.${index}.livesWith`}
                          control={control}
                          render={({ field }) => (
                            <select
                              {...field}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                            >
                              <option value="">Select</option>
                              <option value="me">With Me</option>
                              <option value="ex-spouse">With Ex-Spouse</option>
                              <option value="relatives">With Relatives</option>
                            </select>
                          )}
                        />
                      </div>

                      <div className="flex items-end">
                        {childCount > 1 && (
                          <button
                            type="button"
                            onClick={() => {
                              // Update the childCount and reset the form array
                              const newCount = childCount - 1;
                              setChildCount(newCount);

                              // Rebuild the children array without the removed index
                              const currentChildren =
                                getValues("children") || [];
                              const newChildren = currentChildren.filter(
                                (_, i) => i !== index,
                              );

                              // Add empty objects if needed to maintain the count
                              while (newChildren.length < newCount) {
                                newChildren.push({
                                  gender: "",
                                  dob: "",
                                  livesWith: "",
                                });
                              }

                              setValue("children", newChildren);
                            }}
                            className="w-full px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                    </div>
                  ))}

                  <div className="text-center">
                    <button
                      type="button"
                      onClick={() => {
                        const newCount = childCount + 1;
                        setChildCount(newCount);

                        // Add a new empty child object
                        const currentChildren = getValues("children") || [];
                        currentChildren.push({
                          gender: "",
                          dob: "",
                          livesWith: "",
                        });
                        setValue("children", currentChildren);
                      }}
                      className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Add Another Child
                    </button>
                  </div>
                </div>

                <div className="flex justify-end space-x-4 mt-6 pt-4 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => setShowChildDetailsModal(false)}
                    className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowChildDetailsModal(false)}
                    className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Save & Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <ConfirmationModal />
      <p className="text-center mt-4 text-[#ec0a0a]">
        Already have an account ?{" "}
        <span
          className="font-semibold cursor-pointer underline"
          onClick={() => navigate("/")}
        >
          LoginHere
        </span>
      </p>
    </div>
  );
};

export default MultiStepForm;
