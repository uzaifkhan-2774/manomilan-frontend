import React, { useState, useEffect } from "react";
import axios from "axios";
import Select from "react-select";
import { useForm, Controller } from "react-hook-form";

const FamilyDetails = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [cities, setCities] = useState([]);

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    reset,
  } = useForm({
    defaultValues: {
      fathersName: "",
      mothersName: "",
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
      nativeVillage: "",
      nativeCity: "",
    },
  });

  const token = localStorage.getItem("userToken");

 const getcurrentuser = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/user/getcurrentuser', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.data?.status) {
        const data = response.data?.result;
        const brothersCount = data.brothersCount
          ? String(data.brothersCount) === '3+'
            ? '3+'
            : ['0', '1', '2', '3'].includes(String(data.brothersCount))
              ? String(data.brothersCount)
              : ''
          : '';
        const sisters = data.sisters
          ? String(data.sisters) === '3+'
            ? '3+'
            : ['0', '1', '2', '3'].includes(String(data.sisters))
              ? String(data.sisters)
              : ''
          : '';
        const nativeCityString = data.nativeCity
          ? `${data.nativeCity.city}, ${data.nativeCity.state}, ${data.nativeCity.country}`.trim()
          : '';
        // Verify if nativeCityString matches any city in cities
        const matchedCity = cities.find((city) => city.value === nativeCityString);
        reset({
          fathersName: data.fathersName || '',
          mothersName: data.mothersName || '',
          mamkul: data.mamkul || '',
          parentsResidence: data.parentsResidence || '',
          parentsCity: data.parentsCity || '',
          parentsContact: data.parentsContact || '',
          whatsApp: data.whatsApp || '',
          alternateNumber: data.alternateNumber || '',
          brothersCount,
          brothers: brothersCount === '3+' ? String(data.brothers || '') : '',
          sisters,
          sistersExactCount: sisters === '3+' ? String(data.sistersExactCount || '') : '',
          nativeVillage: data.nativeVillage || '',
          nativeCity:nativeCityString || '',
        });
        if (!matchedCity && nativeCityString) {
          setSubmitStatus({
            type: 'warning',
            message: 'Native city not found in available cities list',
          });
        }
      }
    } catch (error) {
      console.error('Error fetching user:', error);
      setSubmitStatus({
        type: 'error',
        message: 'Failed to fetch user data',
      });
    }
  };

  const fetchCities = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/user/get-all-cities');
      if (response.data.status === true) {
        const transformed = response.data.allLocations.map((item) => {
          const cityString = `${item.city}, ${item.stateCountry?.state || ''}, ${item.stateCountry?.country || ''}`.trim();
          return {
            label: cityString,
            value: cityString,
          };
        });
        setCities(transformed || []);
      } else {
        console.error('Failed to fetch Cities:', response.data.message);
        setSubmitStatus({ type: 'error', message: 'Failed to fetch cities' });
      }
    } catch (error) {
      console.error('Error fetching Cities:', error);
      setSubmitStatus({ type: 'error', message: 'Error fetching cities' });
    }
  };

  useEffect(() => {
    if (token) {
      getcurrentuser();
      fetchCities();
    }
  }, []);

  const maxDate = new Date();
  maxDate.setFullYear(maxDate.getFullYear() - 18);
  const maxDateString = maxDate.toISOString().split("T")[0];

  const onSubmit = async (data) => {
    try {
      const newUpdates = {
        fathersName: data.fathersName,
        mothersName: data.mothersName,
        mamkul: data.mamkul,
        parentsResidence: data.parentsResidence,
        parentsCity: data.parentsCity,
        parentsContact: data.parentsContact,
        whatsApp: data.whatsApp,
        alternateNumber: data.alternateNumber,
        brothersCount: data.brothersCount,
        brothers: data.brothers,
        sisters: data.sisters,
        sistersExactCount: data.sistersExactCount,
        nativeVillage: data.nativeVillage,
        nativeCity: data.nativeCity,
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
        await getcurrentuser(); // Refresh form with updated data
      } else {
        setSubmitStatus({ type: "error", message: response.data.message });
      }
    } catch (error) {
      setSubmitStatus({
        type: "error",
        message:
          error.response?.data?.message || "Failed to update family details",
      });
      console.error("Error updating family details:", error);
    }
  };

  const submitLogin = () => {
    // Handle login logic here
    setIsLoggedIn(true);
    setIsRegistered(true);
  };
  return (
    <div>
      <div className="max-w-7xl mx-auto p-6 bg-white">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Family Information Section */}
          <div className="bg-blue-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold text-red-700 mb-4">
              Family Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Father's Name */}
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

              {/* Mother's Name */}
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

              {/* Mamkul */}
              <div>
                <label className="block text-sm font-medium text-red-700 mb-2">
                  Mamkul
                </label>
                <Controller
                  name="mamkul"
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      placeholder="Enter mamkul"
                    />
                  )}
                />
              </div>

              {/* Parents Residence */}
              <div>
                <label className="block text-sm font-medium text-red-700 mb-2">
                  Parents Residence *
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
                      placeholder="Enter address"
                    />
                  )}
                />
                {errors.parentsResidence && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.parentsResidence.message}
                  </p>
                )}
              </div>

              {/* Parents City */}
              <div>
                <label className="block text-sm font-medium text-red-700 mb-2">
                  Parents City *
                </label>
                <Controller
                  name="parentsCity"
                  control={control}
                  rules={{ required: "Parents city is required" }}
                  render={({ field }) => (
                    <Select
                      {...field}
                      options={cities}
                      value={cities.find((city) => city.value === field.value)}
                      onChange={(selectedOption) =>
                        field.onChange(selectedOption.value)
                      }
                      classNamePrefix="react-select"
                      placeholder="Select City"
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
                      className="w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                  )}
                />
                {errors.parentsCity && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.parentsCity.message}
                  </p>
                )}
              </div>

              {/* Parents Contact */}
              <div>
                <label className="block text-sm font-medium text-red-700 mb-2">
                  Parents Contact *
                </label>
                <Controller
                  name="parentsContact"
                  control={control}
                  rules={{
                    required: "Parents contact is required",
                    pattern: {
                      value: /^[6-9]\d{9}$/,
                      message: "Enter a valid 10-digit mobile number",
                    },
                  }}
                  render={({ field }) => (
                    <input
                      {...field}
                      type="tel"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      placeholder="Enter contact number"
                      minLength="10"
                      maxLength="10"
                    />
                  )}
                />
                {errors.parentsContact && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.parentsContact.message}
                  </p>
                )}
              </div>

              {/* WhatsApp */}
              <div>
                <label className="block text-sm font-medium text-red-700 mb-2">
                  WhatsApp Number
                </label>
                <Controller
                  name="whatsApp"
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
                      type="tel"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      placeholder="Enter WhatsApp number"
                      minLength="10"
                      maxLength="10"
                    />
                  )}
                />
                {errors.whatsApp && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.whatsApp.message}
                  </p>
                )}
              </div>

              {/* Alternate Number */}
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
                      type="tel"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      placeholder="Enter alternate number"
                      minLength="10"
                      maxLength="10"
                    />
                  )}
                />
                {errors.alternateNumber && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.alternateNumber.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-red-700 mb-3">
                  Number of Brothers *
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
                  Number of Sister *
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

              {/* Native Village */}
              <div>
                <label className="block text-sm font-medium text-red-700 mb-2">
                  Native Village, Tehsil
                </label>
                <Controller
                  name="nativeVillage"
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      placeholder="Enter native village"
                    />
                  )}
                />
              </div>

              {/* Native City */}
              <div>
              <label className="block text-sm font-medium text-red-700 mb-2">
                Native District / Province
              </label>
              <Controller
                name="nativeCity"
                control={control}
                rules={{ required: "Native city is required" }}
                render={({ field }) => (
                  <Select
                    {...field}
                    options={cities}
                    value={cities.find((city) => city.value === field.value)}
                    onChange={(selectedOption) => field.onChange(selectedOption.value)}
                    classNamePrefix="react-select"
                    placeholder="Select Native City"
                    styles={{
                      control: (base) => ({
                        ...base,
                        border: 'none',
                        boxShadow: 'none',
                        backgroundColor: 'transparent',
                      }),
                      dropdownIndicator: (base) => ({
                        ...base,
                        padding: 4,
                      }),
                      indicatorSeparator: () => ({ display: 'none' }),
                    }}
                    className="w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                )}
              />
              {errors.nativeCity && (
                <p className="text-red-500 text-xs mt-1">{errors.nativeCity.message}</p>
              )}
            </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-center mt-8">
            <button
              type="submit"
              className="bg-red-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-red-700 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
            >
              Submit Registration
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FamilyDetails;
