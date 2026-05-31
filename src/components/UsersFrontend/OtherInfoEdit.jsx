import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import axios from "axios";
import { toast } from "react-toastify";

const OtherInfoEdit = () => {
  const [sect, setSect] = useState([]);
  const [manglik, setManglik] = useState([]);
  const [foodPref, setFoodPref] = useState([]);
  const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
  const token = localStorage.getItem("token");

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      sect: "",
      manglik: "",
      gotra: "",
      foodPreference: "",
      bloodGroup: "",
      specs: "",
      otherInfo: "",
    },
  });

  // Fetch initial data
  const getSect = async () => {
    try {
      const response = await axios.get(
        "https://api.manomilan.com/api/user/get-sect"
      );
      if (response.data.status === true) {
        setSect(response.data.result || []);
      }
    } catch (error) {
      console.error("Error fetching sect:", error);
      toast.error("Failed to load sect data");
    }
  };

  const getManglik = async () => {
    try {
      const response = await axios.get(
        "https://api.manomilan.com/api/user/get-manglik"
      );
      console.log(response.data);
      if (response.data.status === true) {
        setManglik(response.data.result || []);
      }
    } catch (error) {
      console.error("Error fetching manglik:", error);
      toast.error("Failed to load manglik data");
    }
  };

  // Update the getFoodPref function
  const getFoodPref = async () => {
    try {
      const response = await axios.get(
        "https://api.manomilan.com/api/user/food-choices"
      );
      if (response.data.status === false) {
        const fetched = response.data.result.map((item) => ({
          id: Date.now() + Math.random(),
          name: item.foodPreference || item.name || item,
          type: "foodPreference",
        }));
        setFoodPref(fetched);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getCurrentUser = async () => {
    try {
      const response = await axios.get(
        "https://api.manomilan.com/api/user/getcurrentuser",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data?.status && response.data?.result) {
        const userData = response.data.result;
        
        // Explicitly set form values
        reset({
          sect: userData.sect || "",
          manglik: userData.manglik || "",
          gotra: userData.gotra || "",
          foodPreference: userData.foodPreference || "",
          bloodGroup: userData.bloodGroup || "",
          specs: userData.specs?.toLowerCase() || "", // Normalize specs value
          otherInfo: userData.otherInfo || "",
        }, { 
          shouldValidate: true, // Trigger validation
          shouldDirty: true    // Mark fields as touched
        });

        // Debug log
        console.log('Form reset with values:', {
          sect: userData.sect,
          manglik: userData.manglik,
          foodPreference: userData.foodPreference,
          bloodGroup: userData.bloodGroup,
          specs: userData.specs
        });
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      toast.error("Failed to load user data");
    }
  };

  useEffect(() => {
    getSect();
    getManglik();
    getFoodPref();
    getCurrentUser();
  }, []);

  const onSubmit = async (data) => {
    try {
      const response = await axios.put(
        "https://api.manomilan.com/api/user/special-info-edit",
        { specialInfo: data },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data?.status) {
        toast.success("Special information updated successfully");
        getCurrentUser(); // Refresh data
      } else {
        toast.error(response.data?.message || "Failed to update");
      }
    } catch (error) {
      console.error("Error updating special info:", error);
      toast.error(
        error.response?.data?.message || "Failed to update special information"
      );
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg border-2 border-red-500">
      <h2 className="text-2xl font-semibold text-red-800 mb-6">
        Other Information
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Sect Section */}
        <div>
          <label className="block text-sm font-medium text-red-700 mb-3">
            Sect
          </label>
          <Controller
            name="sect"
            control={control}
            render={({ field }) => (
              <div className="flex flex-wrap gap-4">
                {sect.map((item, index) => (
                  <label key={index} className="flex items-center space-x-2">
                    <input
                      type="radio"
                      {...field}
                      value={item.sect}
                      checked={field.value === item.sect}
                      onChange={(e) => field.onChange(e.target.value)}
                      className="accent-red-600"
                    />
                    <span className="text-sm">{item.sect}</span>
                  </label>
                ))}
              </div>
            )}
          />
        </div>

        {/* Manglik Section */}
        <div>
          <label className="block text-sm font-medium text-red-700 mb-3">
            Manglik
          </label>
          <Controller
            name="manglik"
            control={control}
            render={({ field }) => (
              <div className="flex flex-wrap gap-4">
                {manglik.map((item, index) => (
                  <label key={index} className="flex items-center space-x-2">
                    <input
                      type="radio"
                      {...field}
                      value={item.manglik}
                      checked={field.value === item.manglik}
                      onChange={(e) => field.onChange(e.target.value)}
                      className="accent-red-600"
                    />
                    <span className="text-sm">{item.manglik}</span>
                  </label>
                ))}
              </div>
            )}
          />
        </div>

        {/* Food Preference */}
        <div>
          <label className="block text-sm font-medium text-red-700 mb-3">
            Food Choices
          </label>
          <Controller
            name="foodPreference"
            control={control}
            render={({ field }) => (
              <div className="space-y-3 sm:space-y-0 sm:grid sm:grid-cols-1 lg:grid-cols-1 sm:gap-4">
                <div className="flex items-center">
                  {foodPref.map((ele, index) => (
                    <div className="flex w-full" key={ele.id || index}>
                      <input
                        type="radio"
                        {...field}
                        value={ele.name}
                        checked={field.value === ele.name}
                        onChange={(e) => field.onChange(e.target.value)}
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

        {/* Blood Group */}
        <div>
          <label className="block text-sm font-medium text-red-700 mb-3">
            Blood Group
          </label>
          <Controller
            name="bloodGroup"
            control={control}
            render={({ field }) => (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {bloodGroups.map((group) => (
                  <label key={group} className="flex items-center space-x-2">
                    <input
                      {...field}
                      type="radio"
                      value={group}
                      checked={field.value === group}
                      className="accent-red-600"
                    />
                    <span className="text-sm">{group}</span>
                  </label>
                ))}
              </div>
            )}
          />
        </div>

        {/* Specs */}
        <div>
          <label className="block text-sm font-medium text-red-700 mb-3">
            Spectacles
          </label>
          <Controller
            name="specs"
            control={control}
            render={({ field }) => (
              <div className="flex gap-4">
                <label className="flex items-center space-x-2">
                  <input
                    {...field}
                    type="radio"
                    value="yes"
                    checked={field.value === "yes"}
                    className="accent-red-600"
                  />
                  <span className="text-sm">Yes</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    {...field}
                    type="radio"
                    value="no"
                    checked={field.value === "no"}
                    className="accent-red-600"
                  />
                  <span className="text-sm">No</span>
                </label>
              </div>
            )}
          />
        </div>


        {/* Other Info */}
        <div>
          <label className="block text-sm font-medium text-red-700 mb-2">
            Additional Information About You
          </label>
          <Controller
            name="otherInfo"
            control={control}
            render={({ field }) => (
              <textarea
                {...field}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="Enter Additional information (Max 300 characters), hobbies, achievements, Schooling, relatives, etc."
                rows={4}
                maxLength={300}
              />
            )}
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default OtherInfoEdit;
