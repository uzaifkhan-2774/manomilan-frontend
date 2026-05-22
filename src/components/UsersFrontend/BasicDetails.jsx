import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import axios from "axios";
import { SearchableDropdown } from "../CommonComponents/SearchableDDM";
import { toast } from "react-toastify";
const BasicDetails = () => {
  const formatDateToDDMMYYYY = (dateString) => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based
  const year = date.getFullYear();
  return `${year}-${month}-${day}`; // e.g., 30111992
};


  const token = localStorage.getItem("userToken")
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [fieldsLocked, setFieldsLocked] = useState(false);
  const [nationalities, setNationalities] = useState([]);
  const [motherTongues, setMotherTongues] = useState([]);
  const [submitStatus,setSubmitStatus]=useState(null)

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    reset,
  } = useForm({
    defaultValues: {
      firstName: "",
      midname: "",
      lastName: "",
      gender: "",
      dob: "",
      timeOfBirth: "",
      placeOfBirth: "",
      maritalStatus: "Unmarried",
      height: "",
      occupation: "",
      monthlyIncome: "",
      nationality: ["India"],
      caste: "",
      motherTongue: "",
      divyang: "",
      specs: "",
    },
  });

  const getcurrentuser=async()=>{
    try {
      const response = await axios.get("http://localhost:8000/api/user/getcurrentuser",{
        headers:{
          Authorization:`Bearer ${token}`
        }
      })
      if(response.data?.status){
        const data= response.data?.result
        reset({
          firstName: data.firstName || "",
          midname: data.midname || "",
          lastName: data.lastName || "",
          gender: data.gender || "",
          dob: formatDateToDDMMYYYY(data.dob) ||  "",
          timeOfBirth: "",
          placeOfBirth: "",
          maritalStatus: data.maritalStatus || "Unmarried",
          height: data.height || "",
          occupation: data.occupation || "",
          monthlyIncome: data.monthlyIncome || "",
          nationality: [...data.nationality],
          caste: `${data.caste?.caste},${data.caste?.subCaste},${data.caste?.religion}`,
          motherTongue: data.motherTongue,
          divyang: data.divyang || "No",
          specs: data.specs,
        })
      }
      console.log(response.data?.result)
    } catch (error) {
      console.log(error)
    }
  }
  useEffect(()=>{getcurrentuser()},[])

  // Sample data arrays (you can replace these with your actual data)
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

  const occupations = [
    "Government Service",
    "Private Service",
    "Service + Business / Practice",
    "Business",
    "Student / Internship",
    "Not Working",
  ];

  const fetchNationalities = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/api/user/get-all-countries"
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

  const fetchMotherTongue = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/api/admin/get-mother-tongue"
      );
      if (response.data.status === true) {
        setMotherTongues(response.data.result);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchNationalities();
    fetchMotherTongue();
    const interval = setInterval(() => {
      fetchNationalities();
      fetchMotherTongue();
    }, 10000); // every 5 seconds

    return () => clearInterval(interval);
  }, []);

  const maxDate = new Date();
  maxDate.setFullYear(maxDate.getFullYear() - 18);
  const maxDateString = maxDate.toISOString().split("T")[0];

  const onSubmit = async (data) => {
    try {
      // Prepare data for API (split caste if needed)
      const [caste, subCaste, religion] = data.caste ? data.caste.split(",") : [];
      const newUpdates = {
        firstName: data.firstName,
        midname: data.midname,
        lastName: data.lastName,
        gender: data.gender,
        dob: data.dob,
        timeOfBirth: data.timeOfBirth,
        placeOfBirth: data.placeOfBirth,
        maritalStatus: data.maritalStatus,
        height: data.height,
        occupation: data.occupation,
        monthlyIncome: data.monthlyIncome,
        nationality: data.nationality,
        caste: caste ? { caste, subCaste, religion } : undefined,
        motherTongue: data.motherTongue,
        divyang: data.divyang,
        specs: data.specs,
      };

      const response = await axios.put(
        "http://localhost:8000/api/user/editprofile",
        { newUpdates },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.status) {
        setSubmitStatus({ type: "success", message: response.data.message });
        // Optionally refresh user data
        await getcurrentuser();
        toast.success(response.data.message)
      } else {
        setSubmitStatus({ type: "error", message: response.data.message });
      }
    } catch (error) {
      setSubmitStatus({
        type: "error",
        message: error.response?.data?.message || "Failed to update profile",
      });
      console.error("Error updating profile:", error);
    }
  };

  const submitLogin = () => {
    // Handle login logic here
    setIsLoggedIn(true);
    setIsRegistered(true);
  };

  return (
    <div className="max-w-7xl mx-auto p-6 bg-white">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Personal Information Section */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold text-red-700 mb-4">
            Personal Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* First Name */}
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

            {/* Middle Name */}
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
                    placeholder="Enter middle name"
                  />
                )}
              />
              {errors.midname && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.midname.message}
                </p>
              )}
            </div>

            {/* Last Name */}
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

            {/* Gender */}
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
                        className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300"
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
                        disabled
                        checked={field.value === "female"}
                        className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300"
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

            {/* Date of Birth */}
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
                    disabled
                    max={maxDateString}
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

            {/* Time of Birth */}
            <div>
              <label className="block text-sm font-medium text-red-700 mb-2">
                Time of Birth
              </label>
              <Controller
                name="timeOfBirth"
                control={control}
                render={({ field }) => (
                  <input
                    {...field}
                    type="time"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                )}
              />
            </div>

            {/* Place of Birth */}
            <div>
              <label className="block text-sm font-medium text-red-700 mb-2">
                Place of Birth
              </label>
              <Controller
                name="placeOfBirth"
                control={control}
                render={({ field }) => (
                  <input
                    {...field}
                    type="text"
                    placeholder="Enter Village / Town / City Name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                )}
              />
            </div>

            {/* Marital Status */}
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  >
                    <option value="Unmarried">Unmarried</option>
                    <option value="divorced">Divorced</option>
                    <option value="widowed">Widowed</option>
                    <option value="divorceinprocess">Divorce in Process</option>
                  </select>
                )}
              />
              {errors.maritalStatus && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.maritalStatus.message}
                </p>
              )}
            </div>

            {/* Height */}
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

            {/* Occupation */}
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
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

            {/* Monthly Income */}
            <div>
              <label className="block text-sm font-medium text-red-700 mb-2">
                Monthly Income *
              </label>
              <Controller
                name="monthlyIncome"
                control={control}
                rules={{ required: "Monthly income is required" }}
                render={({ field }) => (
                  <input
                    {...field}
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="Enter monthly income"
                  />
                )}
              />
              {errors.monthlyIncome && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.monthlyIncome.message}
                </p>
              )}
            </div>

            {/* Nationality */}
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

            {/* Caste */}
            <div>
              <label className="block text-sm font-medium text-red-700 mb-2">
                Caste *
              </label>
              <Controller
                name="caste"
                control={control}
                rules={{ required: "Caste is required" }}
                render={({ field }) => (
                  <input type="text" disabled
                    {...field}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                )}
              />
              {errors.caste && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.caste.message}
                </p>
              )}
            </div>

            {/* Mother Tongue */}
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
                    <option value="">Select Mother Tongue</option>
                    {motherTongues.map((tongue, index) => (
                      <option key={index} value={tongue.motherTongue}>
                        {tongue.motherTongue}
                      </option>
                    ))}
                  </select>
                )}
              />
              {errors.motherTongue && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.motherTongue.message}
                </p>
              )}
            </div>

            {/* Divyang */}
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
                        id="divyang-yes"
                        value="Yes"
                        checked={field.value === "Yes"}
                        onChange={() => field.onChange("Yes")}
                        className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300"
                      />
                      <label
                        htmlFor="divyang-yes"
                        className="ml-2 text-sm text-red-700"
                      >
                        Yes
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        {...field}
                        type="radio"
                        id="divyang-no"
                        value="No"
                        checked={field.value === "No"}
                        onChange={() => field.onChange("No")}
                        className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300"
                      />
                      <label
                        htmlFor="divyang-no"
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

            {/* Spectacles */}
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
                        className="mr-2 flex-shrink-0 h-4 w-4"
                      />
                      <span className="text-sm">Yes</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        {...field}
                        type="radio"
                        value="no"
                        className="mr-2 flex-shrink-0 h-4 w-4"
                      />
                      <span className="text-sm">No</span>
                    </label>
                  </div>
                )}
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-center mt-8">
          <button
            type="submit"
            className="bg-red-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-red-700 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
          >
            Update Info
          </button>
        </div>
      </form>
    </div>
  );
};

export default BasicDetails;
