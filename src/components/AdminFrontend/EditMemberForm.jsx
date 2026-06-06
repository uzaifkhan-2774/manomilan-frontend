import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import axios from "axios";
import { toast } from "react-toastify";
import PreferenceSelector from "../UsersFrontend/Expectations";

const EditMemberForm = ({ userId, token }) => {
  // States from RegisterFresh
  const [streams, setStreams] = useState([]);
  const [degreesByStream, setDegreesByStream] = useState({});
  const [selectedEducation, setSelectedEducation] = useState([]);
  const [religionPreferences, setReligionPreferences] = useState([]);
  const [nativeLocationPreferences, setNativeLocationPreferences] = useState([]);
  const [workingLocationPreferences, setWorkingLocationPreferences] = useState([]);
  const [selectedCaste, setSelectedCaste] = useState("");
  const [selectedParentCity, setSelectedParentCity] = useState("");
  const [motherTongue, setMotherTongue] = useState([]);
  const [sect, setSect] = useState([]);
  const [manglik, setManglik] = useState([]);
  const [foodPref, setFoodPref] = useState([]);

  const { control, handleSubmit, reset, setValue } = useForm();

  // Fetch all required data
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const [
          userRes,
          streamsRes,
          motherTongueRes,
          sectRes,
          manglikRes,
          foodRes
        ] = await Promise.all([
          axios.get(`http://127.0.0.1:8000/api/admin/get-single-user/${userId}`, {
            headers: { Authorization: `Bearer ${token}` }
          }),
          axios.get("http://127.0.0.1:8000/api/user/get-all-stream"),
          axios.get("http://127.0.0.1:8000/api/admin/get-mother-tongue"),
          axios.get("http://127.0.0.1:8000/api/user/get-sect"),
          axios.get("http://127.0.0.1:8000/api/user/get-manglik"),
          axios.get("http://127.0.0.1:8000/api/user/food-choices")
        ]);

        // Set user data to form
        if (userRes.data?.status) {
          const userData = userRes.data.user;
          reset({
            ...userData,
            height: String(userData.height || ""),
            monthlyIncome: String(userData.monthlyIncome || ""),
            expectedIncome: String(userData.expectedIncome || ""),
            // Add other fields as needed
          });

          // Set preferences
          setReligionPreferences(userData.religionFields || []);
          setNativeLocationPreferences(userData.nativeLocationFields || []);
          setWorkingLocationPreferences(userData.workingLocationFields || []);
          setSelectedEducation(userData.education || []);
        }

        // Set other data
        if (streamsRes.data?.status) {
          setStreams(streamsRes.data.result);
        }
        if (motherTongueRes.data?.status) {
          setMotherTongue(motherTongueRes.data.result);
        }
        if (sectRes.data?.status) {
          setSect(sectRes.data.data);
        }
        if (manglikRes.data?.status) {
          setManglik(manglikRes.data.data);
        }
        if (foodRes.data?.status === false) {
          const fetched = foodRes.data.result.map(item => ({
            id: Date.now() + Math.random(),
            name: item.foodPreference || item.name || item,
            type: "foodPreference"
          }));
          setFoodPref(fetched);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchAllData();
  }, [userId, token, reset]);

  // Submit handler
  const onSubmit = async (data) => {
    try {
      const response = await axios.put(
        `http://127.0.0.1:8000/api/admin/update-user/${userId}`,
        data,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (response.data?.status) {
        toast.success("Member updated successfully");
      } else {
        toast.error(response.data?.message || "Update failed");
      }
    } catch (error) {
      console.error("Update error:", error);
      toast.error("Failed to update member");
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded-lg shadow">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Personal Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Gender */}
          <div>
            <label className="block text-sm font-medium text-red-700 mb-2">
              Gender
            </label>
            <Controller
              name="gender"
              control={control}
              render={({ field }) => (
                <div className="flex gap-4">
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      {...field}
                      value="male"
                      checked={field.value === "male"}
                      className="form-radio text-red-600"
                    />
                    <span className="ml-2">Male</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      {...field}
                      value="female"
                      checked={field.value === "female"}
                      className="form-radio text-red-600"
                    />
                    <span className="ml-2">Female</span>
                  </label>
                </div>
              )}
            />
          </div>

          {/* Rest of your form fields following RegisterFresh structure */}
          {/* ... Add all other fields matching RegisterFresh ... */}
        </div>

        {/* Education & Career */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Fields will be same as RegisterFresh */}
        </div>

        {/* Preferences */}
        <PreferenceSelector 
          title="Religion & Caste"
          dropdown1Label="Religion"
          dropdown2Label="Caste"
          dropdown3Label="Subcaste"
          api1Url="http://127.0.0.1:8000/api/user/get-religions"
          api2Url="http://127.0.0.1:8000/api/user/get-caste-by-religion"
          api3Url="http://127.0.0.1:8000/api/user/get-subcaste-by-caste"
          initialPreferences={religionPreferences}
          onPreferencesChange={(prefs) => setValue("religionFields", prefs)}
        />

        {/* Submit button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-red-600 text-white px-6 py-3 rounded-md"
          >
            Update Member
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditMemberForm;