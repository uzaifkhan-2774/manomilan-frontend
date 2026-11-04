import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import Select from "react-select";
import axios from "axios";
import { toast } from "react-toastify";

const WorkLocation = ({ userId, token: tokenProp }) => {
  const token = tokenProp || localStorage.getItem("token") || localStorage.getItem("userToken");
  const { control, handleSubmit, reset, formState: { errors }, setValue, getValues } = useForm({
    defaultValues: {
      workAbroad: "",
      companyName: "",
      designation: "",
      candidateNumber: "",
      candidateEmail: "",
      workLocation: "",
      education: [],
    },
  });

  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(false);

  // education lookups (to render education categories table)
  const [streams, setStreams] = useState([]);
  const [degreesByStream, setDegreesByStream] = useState({});
  // store expectedEducation values fetched from server (strings)
  const [expectedEducationFromServer, setExpectedEducationFromServer] = useState([]);

  const fetchCities = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/api/user/get-all-cities");
      if (res.data?.status === true) {
        const transformed = (res.data.allLocations || []).map((item) => ({
          label: `${item.city}, ${item.stateCountry?.state || ""}, ${item.stateCountry?.country || ""}`,
          value: `${item.city}, ${item.stateCountry?.state || ""}, ${item.stateCountry?.country || ""}`,
        }));
        setCities(transformed);
      } else {
        setCities([]);
      }
    } catch (err) {
      console.error("fetchCities:", err);
      setCities([]);
    }
  };

  // fetch streams + degrees so we can render the education categories table
  useEffect(() => {
    const fetchStreamsAndDegrees = async () => {
      try {
        const streamsRes = await axios.get("http://127.0.0.1:8000/api/user/get-all-stream");
        const fetchedStreams = streamsRes?.data?.result || streamsRes?.data?.data || [];
        setStreams(fetchedStreams);

        const degreesData = {};
        for (const stream of fetchedStreams) {
          try {
            const response = await axios.post(
              "http://127.0.0.1:8000/api/user/get-degree-by-stream",
              null,
              { params: { stream: stream.stream } }
            );
            if (response.data?.status) degreesData[stream.stream] = response.data.data || [];
            else degreesData[stream.stream] = [];
          } catch (err) {
            degreesData[stream.stream] = [];
          }
        }
        setDegreesByStream(degreesData);
      } catch (err) {
        console.error("fetchStreamsAndDegrees:", err);
      }
    };

    fetchStreamsAndDegrees();
  }, []);

  const fetchUser = async () => {
    if (!userId) return;
    try {
      setLoading(true);
      const res = await axios.get("http://127.0.0.1:8000/api/user/getcurrentuser",{
        headers:{
          Authorization:`Bearer ${token}`
        }
      })
      console.log(res.data)
      const user = res.data?.result || res.data || {};
      // patch form values with existing data (safe checks)
      reset({
        workAbroad: user.workAbroad || user.workAbroad === 0 ? String(user.workAbroad) : (user.workAbroad || ""),
        companyName: user.companyName || "",
        designation: user.designation || "",
        candidateNumber: user.candidateNumber || user.candidateMobile || "",
        candidateEmail: user.candidateEmail || "",
        workLocation: user.workLocation || "",
      });
      // ensure react-select selected value exists
      if (user.workLocation) {
        setValue("workLocation", user.workLocation);
      }

      // collect expected/education degrees from server for preselection
      if (Array.isArray(user.expectedEducation) && user.expectedEducation.length) {
        setExpectedEducationFromServer(
          user.expectedEducation.map((e) => (typeof e === "string" ? e : e.degree || e))
        );
      } else if (Array.isArray(user.education) && user.education.length) {
        setExpectedEducationFromServer(
          user.education.map((e) => (typeof e === "string" ? e : e.degree || e))
        );
      }
    } catch (err) {
      console.error("fetchUser:", err);
      toast.error("Failed to load user work info");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCities();
  }, []);

  useEffect(() => {
    fetchUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  // when degrees lookups are available and server provided expected degrees, normalize and set into form
  useEffect(() => {
    if (!expectedEducationFromServer || expectedEducationFromServer.length === 0) return;

    const degreeToStream = {};
    Object.entries(degreesByStream).forEach(([streamName, degrees]) => {
      (degrees || []).forEach((d) => {
        const degName = (d.degree || d).toString();
        degreeToStream[degName.toLowerCase()] = streamName;
      });
    });

    const normalized = expectedEducationFromServer.map((deg) => {
      const degStr = typeof deg === "string" ? deg : deg.degree || "";
      const match = degreeToStream[degStr.toLowerCase()];
      const category = match || "";
      return { degree: degStr, category };
    });

    // avoid unnecessary updates
    const cur = getValues("education") || [];
    if (JSON.stringify(normalized) !== JSON.stringify(cur)) {
      setValue("education", normalized);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [degreesByStream, expectedEducationFromServer]);

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const newUpdates = {
        companyName: data.companyName || "",
        designation: data.designation || "",
        candidateNumber: data.candidateNumber || "",
        candidateEmail: data.candidateEmail || "",
        workLocation: data.workLocation || "",
        workAbroad: data.workAbroad || "",
      };
      // update user endpoint - uses PUT to /api/user/:id (keeps shape similar to registration)
      const res = await axios.put(
        "http://127.0.0.1:8000/api/user/editprofile",
        { newUpdates },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (res.data?.status || res.status === 200) {
        toast.success("Work information updated");
        // refresh form with server data if returned
        if (res.data.user) reset({
          workAbroad: res.data.user.workAbroad || "",
          companyName: res.data.user.companyName || "",
          designation: res.data.user.designation || "",
          candidateNumber: res.data.user.candidateNumber || "",
          candidateEmail: res.data.user.candidateEmail || "",
          workLocation: res.data.user.workLocation || "",
        });
      } else {
        toast.error(res.data?.message || "Update failed");
      }
    } catch (err) {
      console.error("update work info:", err);
      toast.error(err.response?.data?.message || "Failed to update work info");
    } finally {
      setLoading(false);
    }
  };

  const educationCategories = streams.map((stream) => ({
    name: stream.stream,
    degrees: (degreesByStream[stream.stream] || []).map((d) => d.degree || d),
  }));

  return (
    <>
      <div className="bg-white border border-red-200 rounded-lg p-4 mb-4">
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
                <tr key={category.name}>
                  <td className="px-4 py-3 font-medium text-red-700 border-r border-red-200">{category.name}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-2">
                      {category.degrees.map((deg) => {
                        const selected = (getValues("education") || []).some((e) => e.degree === deg);
                        return (
                          <button
                            key={deg}
                            type="button"
                            onClick={() => {
                              const cur = getValues("education") || [];
                              const exists = cur.some((e) => e.degree === deg);
                              const updated = exists
                                ? cur.filter((e) => e.degree !== deg)
                                : [...cur, { degree: deg, category: category.name }];
                              setValue("education", updated);
                            }}
                            className={`px-3 py-1.5 rounded-lg text-sm font-medium ${selected ? "bg-red-600 text-white" : "bg-gray-100 text-gray-700 border border-gray-300"}`}
                          >
                            {deg}{selected ? " ✓" : ""}
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

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
                    onChange={() => field.onChange("Yes")}
                    className="h-4 w-4 accent-[#7d0a0a] text-red-600 focus:ring-red-500 border-gray-300"
                  />
                  <label className="ml-2 text-sm text-red-700">Yes</label>
                </div>
                <div className="flex items-center">
                  <input
                    {...field}
                    type="radio"
                    value="No"
                    checked={field.value === "No"}
                    onChange={() => field.onChange("No")}
                    className="h-4 w-4 accent-[#7d0a0a] text-red-600 focus:ring-red-500 border-gray-300"
                  />
                  <label className="ml-2 text-sm text-red-700">No</label>
                </div>
              </div>
            )}
          />
          {errors.workAbroad && <p className="text-red-500 text-xs mt-1">{errors.workAbroad.message}</p>}
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
          {errors.companyName && <p className="text-red-500 text-xs mt-1">{errors.companyName.message}</p>}
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
          {errors.designation && <p className="text-red-500 text-xs mt-1">{errors.designation.message}</p>}
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
                type="email"
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
                options={cities}
                value={cities.find((opt) => opt.value === field.value) || null}
                onChange={(selected) => {
                  const v = selected ? selected.value : "";
                  field.onChange(v);
                }}
                classNamePrefix="react-select"
                placeholder="Work location"
                styles={{
                  control: (base) => ({ ...base, border: "none", boxShadow: "none", backgroundColor: "transparent" }),
                  dropdownIndicator: (base) => ({ ...base, padding: 4 }),
                  indicatorSeparator: () => ({ display: "none" }),
                }}
                className="w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            )}
          />
        </div>
      </div>

      <div className="w-full flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="py-2 px-3 font-semibold bg-red-600 text-white rounded-md hover:opacity-95"
        >
          {loading ? "Saving..." : "Save"}
        </button>
      </div>
    </form>
    </>
  );
};

export default WorkLocation;
