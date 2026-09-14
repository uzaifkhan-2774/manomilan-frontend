import React, { useEffect, useState } from "react";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import axios from "axios";
import { toast } from "react-toastify";
import Select from "react-select";
import { SearchableDropdown } from "../CommonComponents/SearchableDDM";

/*
  Expectations component
  - Fields and API usages follow RegisterFresh.jsx (use as reference)
  - Submits to same endpoints: GET current user, PUT expectation-edit
  - Uses inline PreferenceSelector (small, re-usable) similar to RegisterFresh's behavior
*/

const PreferenceSelector = ({
  title,
  dropdown1Label,
  dropdown2Label,
  dropdown3Label,
  api1Url,
  api2Url,
  api3Url,
  api1Key,
  api2Key,
  api3Key,
  initialPreferences = [],
  onPreferencesChange = () => {},
}) => {
  const [dropdownData, setDropdownData] = useState([[], [], []]);
  const [selectedValues, setSelectedValues] = useState(["", "", ""]);
  const [prefs, setPrefs] = useState([]);
  const [loading, setLoading] = useState([false, false, false]);
  const [error, setError] = useState("");

  // normalize incoming initialPreferences once
  useEffect(() => {
    if (!Array.isArray(initialPreferences)) {
      setPrefs([]);
      return;
    }
    const normalized = initialPreferences.map((p) => {
      const id = p.id || p._id || `${Date.now()}_${Math.random()}`;
      return {
        id,
        [api1Key]: p[api1Key] ?? p.country ?? p.religion ?? "ANY",
        [api2Key]: p[api2Key] ?? p.state ?? p.caste ?? "ANY",
        [api3Key]: p[api3Key] ?? p.city ?? p.subCaste ?? "ANY",
      };
    });
    setPrefs(normalized);
    // do not call onPreferencesChange here (avoids cycles)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(initialPreferences), api1Key, api2Key, api3Key]);

  const safeGet = (res) => {
    let arr = res?.data?.result ?? res?.data?.data ?? res?.data ?? [];
    return Array.isArray(arr) ? arr : [];
  };

  const fetchData = async (url, index) => {
    if (!url) return;
    setLoading((p) => {
      const c = [...p];
      c[index] = true;
      return c;
    });
    try {
      const res = await axios.get(url);
      const arr = safeGet(res);
      setDropdownData((d) => {
        const copy = [...d];
        copy[index] = arr;
        return copy;
      });
    } catch (err) {
      setError(err.message || "Failed to load");
    } finally {
      setLoading((p) => {
        const c = [...p];
        c[index] = false;
        return c;
      });
    }
  };

  // load api1 options
  useEffect(() => {
    fetchData(api1Url, 0);
  }, [api1Url]);

  // load api2 when first dropdown selection changes to a non-empty value
  useEffect(() => {
    const val = selectedValues[0];
    if (!val) {
      // clear dependent dropdowns when first selection cleared
      setDropdownData((d) => [d[0], [], []]);
      setSelectedValues((s) => [s[0], "", ""]);
      return;
    }
    if (!api2Url) return;

    // pick query param name more robustly
    const param = dropdown1Label?.toLowerCase().includes("religion")
      ? "religion"
      : "country";

    const sep = api2Url.includes("?") ? "&" : "?";
    const url = `${api2Url}${sep}${param}=${encodeURIComponent(val)}`;

    fetchData(url, 1);
  }, [selectedValues[0], api2Url, dropdown1Label]);

  // load api3 when second dropdown selection changes
  useEffect(() => {
    const val1 = selectedValues[0];
    const val2 = selectedValues[1];
    if (!val1 || !val2) {
      setDropdownData((d) => [d[0], d[1], []]);
      return;
    }
    if (!api3Url) return;

    const label2 = (dropdown2Label || "").toLowerCase();
    const sep = api3Url.includes("?") ? "&" : "?";
    let url = "";

    if (label2.includes("caste")) {
      url = `${api3Url}${sep}caste=${encodeURIComponent(
        val2
      )}&religion=${encodeURIComponent(val1)}`;
    } else {
      url = `${api3Url}${sep}state=${encodeURIComponent(
        val2
      )}&country=${encodeURIComponent(val1)}`;
    }

    fetchData(url, 2);
  }, [selectedValues[1], selectedValues[0], api3Url, dropdown2Label]);

  const handleDropdownChange = (index, value) => {
    setSelectedValues((s) => {
      const copy = [...s];
      copy[index] = value;
      if (index === 0) {
        copy[1] = "";
        copy[2] = "";
      } else if (index === 1) {
        copy[2] = "";
      }
      return copy;
    });
  };

  const addPreference = () => {
    const newPref = {
      id: Date.now() + Math.random(),
      [api1Key]: selectedValues[0] || "ANY",
      [api2Key]: selectedValues[1] || "ANY",
      [api3Key]: selectedValues[2] || "ANY",
    };
    const dup = prefs.some(
      (p) =>
        p[api1Key] === newPref[api1Key] &&
        p[api2Key] === newPref[api2Key] &&
        p[api3Key] === newPref[api3Key]
    );
    if (dup) {
      setError("This preference already exists");
      return;
    }
    const updated = [...prefs, newPref];
    setPrefs(updated);
    onPreferencesChange(updated);
    setSelectedValues(["", "", ""]);
    setError("");
  };

  const removePreference = (id) => {
    const updated = prefs.filter((p) => p.id !== id);
    setPrefs(updated);
    // sync parent form arrays (frontend-only handling)
    try {
      onPreferencesChange(Array.isArray(updated) ? updated : []);
    } catch (e) {
      console.error("onPreferencesChange failed:", e);
    }
  };

  // render options using correct apiKey per dropdown index
  const renderOptionValue = (item, idx) => {
    if (idx === 0) return item?.[api1Key] ?? item;
    if (idx === 1) return item?.[api2Key] ?? item;
    return item?.[api3Key] ?? item;
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-4 bg-white">
      {error && <div className="mb-3 text-red-600">{error}</div>}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
        {[0, 1, 2].map((idx) => (
          <div key={idx}>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {idx === 0
                ? dropdown1Label
                : idx === 1
                ? dropdown2Label
                : dropdown3Label}
            </label>
            <select
              value={selectedValues[idx]}
              onChange={(e) => handleDropdownChange(idx, e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
            >
              <option value="">ANY</option>
              {(dropdownData[idx] || []).map((item, i) => {
                const val = renderOptionValue(item, idx);
                return (
                  <option key={i} value={val}>
                    {val}
                  </option>
                );
              })}
            </select>
          </div>
        ))}
        <div>
          <label className="block text-sm font-medium text-transparent mb-2">
            Action
          </label>
          <button
            type="button"
            onClick={addPreference}
            className="w-full bg-red-900 text-white py-2 rounded-md"
          >
            Add Preference
          </button>
        </div>
      </div>

      <div>
        {prefs.length ? (
          <div className="overflow-x-auto border rounded-md">
            <table className="min-w-full">
              <thead className="bg-red-900 text-white">
                <tr>
                  <th className="px-4 py-2 text-left">{dropdown1Label}</th>
                  <th className="px-4 py-2 text-left">{dropdown2Label}</th>
                  <th className="px-4 py-2 text-left">{dropdown3Label}</th>
                  <th className="px-4 py-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {prefs.map((p, idx) => (
                  <tr key={p.id} className="hover:bg-gray-50">
                    <td className="px-4 py-2">{p[api1Key]}</td>
                    <td className="px-4 py-2">{p[api2Key]}</td>
                    <td className="px-4 py-2">{p[api3Key]}</td>
                    <td className="px-4 py-2">
                      <button
                        onClick={() => removePreference(p.id)}
                        className="text-red-600"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-6 text-gray-500 border border-dashed rounded-md">
            No preferences added
          </div>
        )}
      </div>
    </div>
  );
};

const Expectations = ({
  partnerEducationCategories: partnerEducationCategoriesProp,
  expectedNationality: expectedNationalityProp,
  currentStep = 1,
  setCurrentStep = () => {},
  validateStep = async () => true,
}) => {
  const [partnerEducationCategories, setPartnerEducationCategories] = useState(
    partnerEducationCategoriesProp || [
      { name: "ANY", degrees: ["Any Degree"] },
      { name: "Engineering", degrees: ["CS", "IT", "Mechanical"] },
    ]
  );
  const [partnerEducation, setPartnerEducation] = useState([]);
  const [showChildAcceptance, setShowChildAcceptance] = useState(false);
  const [isAnySelected, setIsAnySelected] = useState(false);
  const token =
    localStorage.getItem("token") || localStorage.getItem("userToken");

  const {
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      ageFrom: "",
      ageTo: "",
      heightFrom: "",
      heightTo: "",
      expectedOccupation: "any",
      expectedIncome: "",
      workAbroad: "No",
      divyangPrefer: "No",
      expectedNationality: expectedNationalityProp || [],
      expectedMaritalStatus: "Unmarried",
      childAccepted: "",
      partnerEducation: [],
      religionPreferences: [],
      nativeLocationPreferences: [],
      workingLocationPreferences: [],
    },
    mode: "onChange",
  });

  const {
    fields: religionFields,
    append: appendReligion,
    remove: removeReligion,
    replace: replaceReligion,
  } = useFieldArray({
    control,
    name: "religionPreferences",
  });

  const {
    fields: nativeLocationFields,
    append: appendNativeLocation,
    remove: removeNativeLocation,
    replace: replaceNativeLocation,
  } = useFieldArray({
    control,
    name: "nativeLocationPreferences",
  });

  const {
    fields: workingLocationFields,
    append: appendWorkingLocation,
    remove: removeWorkingLocation,
    replace: replaceWorkingLocation,
  } = useFieldArray({
    control,
    name: "workingLocationPreferences",
  });

  const ageFrom = watch("ageFrom");
  const heightFrom = watch("heightFrom");
  const maritalStatus = watch("expectedMaritalStatus");

  useEffect(() => {
    setShowChildAcceptance(maritalStatus !== "Unmarried");
  }, [maritalStatus]);

  useEffect(() => {
    setIsAnySelected(partnerEducation.some((e) => e.degree === "Any Degree"));
  }, [partnerEducation]);
  const [nationalities, setNationalities] = useState([]);
  const fetchNationalities = async () => {
    try {
      const response = await axios.get(
        "https://api.manomilan.com/api/user/get-all-countries"
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
  useEffect(() => {
    fetchNationalities();
  }, []);
  const expectedNationality = [{ country: "ANY" }, ...nationalities];

  // fetch streams to build partnerEducationCategories (same endpoints as RegisterFresh)
  useEffect(() => {
    const fetchStreams = async () => {
      try {
        const res = await axios.get(
          "https://api.manomilan.com/api/user/get-all-stream"
        );
        if (res.data?.status) {
          const streams = res.data.data || [];
          // fetch degrees per stream
          const categories = await Promise.all(
            streams.map(async (s) => {
              try {
                const r = await axios.post(
                  "https://api.manomilan.com/api/user/get-degree-by-stream",
                  null,
                  { params: { stream: s.stream } }
                );
                const degs = r.data?.data?.map((d) => d.degree) || [];
                return { name: s.stream, degrees: degs };
              } catch (err) {
                return { name: s.stream, degrees: [] };
              }
            })
          );
          setPartnerEducationCategories([
            { name: "ANY", degrees: ["Any Degree"] },
            ...categories,
          ]);
        }
      } catch (err) {
        console.error("fetchStreams err", err);
      }
    };
    fetchStreams();
  }, []);

  const getcurrentuser = async () => {
    if (!token) {
      toast.error("No auth token found, please login");
      return;
    }
    try {
      const res = await axios.get(
        "https://api.manomilan.com/api/user/getcurrentuser",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log(res.data);
      if (res.data?.status) {
        const d = res.data.result || {};
        const normalized = {
          ageFrom: d.ageFrom ?? "",
          ageTo: d.ageTo ? String(d.ageTo) : "",
          heightFrom: d.heightFrom ? String(d.heightFrom) : "",
          heightTo: d.heightTo ? String(d.heightTo) : "",
          expectedOccupation: d.expectedOccupation || "any",
          expectedIncome: d.expectedIncome ? String(d.expectedIncome) : "",
          workAbroad: d.workAbroad || "No",
          divyangPrefer: d.divyangPrefer || "No",
          expectedNationality: Array.isArray(d.expectedNationality)
            ? d.expectedNationality
            : [],
          expectedMaritalStatus: d.expectedMaritalStatus || "Unmarried",
          childAccepted: d.childAccepted || "",
          partnerEducation: Array.isArray(d.expectedEducation)
            ? d.expectedEducation.map((degree) => ({
                degree,
                category: "Specific",
              }))
            : [],
          religionPreferences: Array.isArray(d.expectedReligion)
            ? d.expectedReligion.map((p) => ({
                id: Date.now() + Math.random(),
                ...p,
              }))
            : [],
          nativeLocationPreferences: Array.isArray(d.expectedNativeLocation)
            ? d.expectedNativeLocation.map((p) => ({
                id: Date.now() + Math.random(),
                ...p,
              }))
            : [],
          workingLocationPreferences: Array.isArray(d.expectedWorkingLocation)
            ? d.expectedWorkingLocation.map((p) => ({
                id: Date.now() + Math.random(),
                ...p,
              }))
            : [],
        };
        reset(normalized);
        setPartnerEducation(normalized.partnerEducation || []);
        replaceReligion(normalized.religionPreferences || []);
        replaceNativeLocation(normalized.nativeLocationPreferences || []);
        replaceWorkingLocation(normalized.workingLocationPreferences || []);
      } else {
        toast.error(res.data?.message || "Failed to load profile");
      }
    } catch (err) {
      console.error("getcurrentuser err", err);
      toast.error(err.response?.data?.message || "Failed to fetch user");
    }
  };

  useEffect(() => {
    getcurrentuser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const partnerDegreeToggle = (degree, category) => {
    let updated;

    if (degree === "Any Degree") {
      // Toggle "Any Degree" selection
      if (partnerEducation.some((edu) => edu.degree === "Any Degree")) {
        // Deselect all
        updated = [];
      } else {
        // Select "Any Degree" + all degrees from all categories
        const allDegrees = partnerEducationCategories.flatMap((cat) =>
          cat.degrees.map((deg) => ({
            degree: deg,
            category: cat.name,
          }))
        );

        updated = [{ degree: "Any Degree", category: "ANY" }, ...allDegrees];
      }
    } else {
      // Normal category toggle logic
      const categoryDegrees =
        partnerEducationCategories.find((cat) => cat.name === category)
          ?.degrees || [];

      // Check if all degrees in this category are already selected
      const allCategoryDegreesSelected = categoryDegrees.every((deg) =>
        partnerEducation.some((edu) => edu.degree === deg)
      );

      if (allCategoryDegreesSelected) {
        // Deselect all degrees from this category
        updated = partnerEducation.filter(
          (edu) => !categoryDegrees.includes(edu.degree)
        );
      } else {
        // Select all degrees from this category
        const newDegrees = categoryDegrees.map((deg) => ({
          degree: deg,
          category,
        }));

        updated = [
          ...partnerEducation.filter(
            (edu) => !categoryDegrees.includes(edu.degree)
          ),
          ...newDegrees,
        ];
      }

      // Remove "Any Degree" if not everything is selected anymore
      const allDegrees = partnerEducationCategories.flatMap(
        (cat) => cat.degrees
      );
      const allSelected = allDegrees.every((deg) =>
        updated.some((edu) => edu.degree === deg)
      );

      if (allSelected) {
        updated = [{ degree: "Any Degree", category: "ANY" }, ...updated];
      } else {
        updated = updated.filter((edu) => edu.degree !== "Any Degree");
      }
    }

    setPartnerEducation(updated);
    setValue("partnerEducation", updated);
  };

  const onSubmit = async (formData) => {
    try {
      const payload = {
        expectations: {
          ageFrom: formData.ageFrom,
          ageTo: formData.ageTo,
          heightFrom: formData.heightFrom,
          heightTo: formData.heightTo,
          expectedOccupation: formData.expectedOccupation,
          expectedIncome: formData.expectedIncome,
          workAbroad: formData.workAbroad,
          divyangPrefer: formData.divyangPrefer,
          expectedNationality: formData.expectedNationality,
          expectedMaritalStatus: formData.expectedMaritalStatus,
          childAccepted: formData.childAccepted,
          expectedEducation: (formData.partnerEducation || []).map(
            (e) => e.degree
          ),
          expectedReligion: (formData.religionPreferences || []).map(
            ({ id, ...rest }) => rest
          ),
          expectedNativeLocation: (
            formData.nativeLocationPreferences || []
          ).map(({ id, ...rest }) => rest),
          expectedWorkingLocation: (
            formData.workingLocationPreferences || []
          ).map(({ id, ...rest }) => rest),
        },
      };

      const res = await axios.put(
        "https://api.manomilan.com/api/user/expectation-edit",
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (res.data?.status) {
        toast.success(res.data.message || "Expectations updated");
        await getcurrentuser();
      } else {
        toast.error(res.data?.message || "Update failed");
      }
    } catch (err) {
      console.error("expectation-edit err", err);
      toast.error(
        err.response?.data?.message || "Failed to update expectations"
      );
    }
  };

  // show current partnerEducation selection visually is handled by table buttons above
  return (
    <div className="max-w-6xl mx-auto p-6 bg-white border-4 border-red-500">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <h3 className="text-lg font-semibold text-red-800 mb-4">
          Partner Expectations
        </h3>

        {/* Age/Height grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-red-700 mb-2">
              Age From
            </label>
            <Controller
              name="ageFrom"
              control={control}
              render={({ field }) => (
                <select
                  {...field}
                  className="w-full px-3 py-2 border rounded-md"
                >
                  <option value="">From</option>
                  {Array.from({ length: 21 }, (_, i) => i).map((a) => (
                    <option key={a} value={a}>
                      {a}
                    </option>
                  ))}
                </select>
              )}
            />
          </div>

          <div className="mt-5">
            <label className="block text-sm font-medium text-red-700 mb-2">
              &nbsp;
            </label>
            <Controller
              name="ageTo"
              control={control}
              render={({ field }) => (
                <select
                  {...field}
                  className="w-full px-3 py-2 border rounded-md"
                >
                  <option value="">To</option>
                  {Array.from({ length: 21 }, (_, i) => i).map((a) => (
                    <option
                      key={a}
                      value={a}
                      disabled={ageFrom !== "" && a <= parseInt(ageFrom)}
                    >
                      {a}
                    </option>
                  ))}
                </select>
              )}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-red-700 mb-2">
              Height From
            </label>
            <Controller
              name="heightFrom"
              control={control}
              render={({ field }) => (
                <select
                  {...field}
                  className="w-full px-3 py-2 border rounded-md"
                >
                  <option value="">From</option>
                  {/* generate heights similar to RegisterFresh (short list for brevity) */}
                  {Array.from({ length: 20 }).map((_, i) => {
                    const cm = 137 + i * 3;
                    return (
                      <option key={cm} value={String(cm)}>
                        {cm} cm
                      </option>
                    );
                  })}
                </select>
              )}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-red-700 mb-2">
              Height To
            </label>
            <Controller
              name="heightTo"
              control={control}
              render={({ field }) => (
                <select
                  {...field}
                  className="w-full px-3 py-2 border rounded-md"
                >
                  <option value="">To</option>
                  {Array.from({ length: 20 }).map((_, i) => {
                    const cm = 137 + i * 3;
                    return (
                      <option
                        key={cm}
                        value={String(cm)}
                        disabled={
                          heightFrom && parseInt(cm) < parseInt(heightFrom)
                        }
                      >
                        {cm} cm
                      </option>
                    );
                  })}
                </select>
              )}
            />
          </div>
        </div>

        {/* Occupation / Income / Work abroad / Divyang */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
          <div>
            <label className="block text-sm font-medium text-red-700 mb-2">
              Occupation
            </label>
            <Controller
              name="expectedOccupation"
              control={control}
              render={({ field }) => {
                // Ensure field.value is always an array
                const currentValues = Array.isArray(field.value)
                  ? field.value
                  : [];

                const handleCheckboxChange = (value) => {
                  let updatedValues;

                  if (value === "any") {
                    // If ANY is checked, clear other selections
                    updatedValues = currentValues.includes("any")
                      ? []
                      : ["any"];
                  } else {
                    if (currentValues.includes("any")) {
                      // If ANY was selected, remove it and add the new value
                      updatedValues = [value];
                    } else {
                      // Toggle the selected value
                      updatedValues = currentValues.includes(value)
                        ? currentValues.filter((v) => v !== value)
                        : [...currentValues, value];
                    }
                  }

                  field.onChange(updatedValues);
                };

                const options = [
                  { value: "any", label: "ANY" },
                  { value: "private_service", label: "Private Service" },
                  { value: "government_service", label: "Government Service" },
                  { value: "service_business", label: "Service + Business" },
                  { value: "business", label: "Business" },
                  {
                    value: "student_internship",
                    label: "Student / Internship",
                  },
                  { value: "not_working", label: "Not Working" },
                ];

                return (
                  <div className="space-y-2">
                    {options.map((option) => (
                      <label
                        key={option.value}
                        className="flex items-center space-x-2 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={currentValues.includes(option.value)}
                          onChange={() => handleCheckboxChange(option.value)}
                          className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                        />
                        <span className="text-sm text-gray-700">
                          {option.label}
                        </span>
                      </label>
                    ))}
                  </div>
                );
              }}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-red-700 mb-2">
              Income
            </label>
            <Controller
              name="expectedIncome"
              control={control}
              defaultValue=""
              render={({ field }) => {
                // Ensure we have a string value and handle "any" case
                const value =
                  field.value === "any" ? "any" : String(field.value || "");

                return (
                  <select
                    {...field}
                    value={value}
                    className="w-full px-3 py-2 border rounded-md"
                  >
                    <option value="" disabled>
                      Select Income
                    </option>
                    <option value="any">ANY</option>
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
                );
              }}
            />
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium text-red-700 mb-3">
              Working Abroad?
            </label>
            <Controller
              name="workAbroad"
              control={control}
              render={({ field }) => (
                <div className="flex gap-6">
                  <label className="flex items-center">
                    <input {...field} type="radio" value="Yes" />{" "}
                    <span className="ml-2">Yes</span>
                  </label>
                  <label className="flex items-center">
                    <input {...field} type="radio" value="No" />{" "}
                    <span className="ml-2">No</span>
                  </label>
                </div>
              )}
            />
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium text-red-700 mb-3">
              Prefer Divyang?
            </label>
            <Controller
              name="divyangPrefer"
              control={control}
              render={({ field }) => (
                <div className="flex gap-6">
                  <label className="flex items-center">
                    <input {...field} type="radio" value="Yes" />{" "}
                    <span className="ml-2">Yes</span>
                  </label>
                  <label className="flex items-center">
                    <input {...field} type="radio" value="No" />{" "}
                    <span className="ml-2">No</span>
                  </label>
                </div>
              )}
            />
          </div>
        </div>

        {/* Nationality */}
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

        {/* Marital status & child acceptance */}
        <div className="mt-6">
          <label className="block text-sm font-medium text-red-700 mb-2">
            Marital Status
          </label>
          <Controller
            name="expectedMaritalStatus"
            control={control}
            render={({ field }) => (
              <div className="space-y-3 flex gap-4">
                {[
                  {
                    value: "Unmarried",
                    label: "Unmarried",
                  },
                  {
                    value: "divorced",
                    label: "Divorced",
                  },
                  {
                    value: "widowed",
                    label: "Widowed",
                  },
                  {
                    value: "divorce_in_progress",
                    label: "Divorce in Progress",
                  },
                  {
                    value: "any",
                    label: "ANY",
                  },
                ].map((option) => (
                  <label
                    key={option.value}
                    className="flex items-center space-x-3 cursor-pointer"
                  >
                    <input
                      type="radio"
                      {...field}
                      value={option.value}
                      checked={field.value === option.value}
                      onChange={(e) => {
                        field.onChange(e);
                        setShowChildAcceptance(e.target.value !== "Unmarried");
                      }}
                    />
                    <span className="text-gray-700">{option.label}</span>
                  </label>
                ))}
              </div>
            )}
          />
        </div>

        {showChildAcceptance && (
          <div className="mt-4">
            <label className="block text-sm font-medium text-red-700 mb-3">
              Issue (Child) Accepted?
            </label>
            <Controller
              name="childAccepted"
              control={control}
              render={({ field }) => (
                <div className="flex gap-6">
                  <label className="flex items-center">
                    <input {...field} type="radio" value="Yes" />{" "}
                    <span className="ml-2">Yes</span>
                  </label>
                  <label className="flex items-center">
                    <input {...field} type="radio" value="No" />{" "}
                    <span className="ml-2">No</span>
                  </label>
                </div>
              )}
            />
          </div>
        )}

        {/* Partner Education */}
        <div className="max-w-6xl mx-auto p-6">
          <label className="block text-sm font-medium text-red-700 mb-4">
            Education & Occupation Preferences
          </label>
          <div className="bg-white border border-red-200 rounded-lg overflow-hidden p-4">
            <div className="flex flex-wrap gap-3">
              {partnerEducationCategories.flatMap((cat) =>
                cat.degrees.map((degree) => {
                  const isSelected = partnerEducation.some(
                    (e) => e.degree === degree
                  );
                  return (
                    <button
                      key={`${cat.name}-${degree}`}
                      type="button"
                      onClick={() => partnerDegreeToggle(degree, cat.name)}
                      className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                        isSelected
                          ? "bg-red-600 text-white hover:bg-red-700"
                          : "bg-gray-100 text-gray-700 border hover:bg-red-50"
                      }`}
                    >
                      {degree}
                      {isSelected && <span className="ml-2">✓</span>}
                    </button>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Preferences selectors using PreferenceSelector that talks to the same APIs as RegisterFresh */}
        <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
          <label className="block text-sm font-medium text-red-700 mb-2">
            Religion & Caste
          </label>
          <PreferenceSelector
            title="Religion & Caste Preferences"
            dropdown1Label="Religion"
            dropdown2Label="Caste"
            dropdown3Label="Subcaste"
            api1Url="https://api.manomilan.com/api/user/get-religions"
            api2Url="https://api.manomilan.com/api/user/get-caste-by-religion"
            api3Url="https://api.manomilan.com/api/user/get-subcaste-by-caste"
            api1Key="religion"
            api2Key="caste"
            api3Key="subCaste"
            onPreferencesChange={(prefs) => {
              removeReligion();
              prefs.forEach((pref) => appendReligion(pref));
            }}
            initialPreferences={religionFields}
          />
        </div>

        {/* Native Location Preference */}
        <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
          <label className="block text-sm font-medium text-red-700 mb-2">
            Native Location Preference
          </label>
          <PreferenceSelector
            title="Native Location Preferences"
            dropdown1Label="Country"
            dropdown2Label="State"
            dropdown3Label="City"
            api1Url="https://api.manomilan.com/api/user/get-all-countries"
            api2Url="https://api.manomilan.com/api/user/get-state-by-country"
            api3Url="https://api.manomilan.com/api/user/get-cities-by-state"
            api1Key="country"
            api2Key="state"
            api3Key="city"
            onPreferencesChange={(prefs) => {
              removeNativeLocation();
              prefs.forEach((pref) => appendNativeLocation(pref));
            }}
            initialPreferences={nativeLocationFields}
          />
        </div>

        {/* Working Location Preference */}
        <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
          <label className="block text-sm font-medium text-red-700 mb-2">
            Working Location Preference
          </label>
          <PreferenceSelector
            title="Working Location Preferences"
            dropdown1Label="Country"
            dropdown2Label="State"
            dropdown3Label="City"
            api1Url="https://api.manomilan.com/api/user/get-all-countries"
            api2Url="https://api.manomilan.com/api/user/get-state-by-country"
            api3Url="https://api.manomilan.com/api/user/get-cities-by-state"
            api1Key="country"
            api2Key="state"
            api3Key="city"
            onPreferencesChange={(prefs) => {
              removeWorkingLocation();
              prefs.forEach((pref) => appendWorkingLocation(pref));
            }}
            initialPreferences={workingLocationFields}
          />
        </div>

        <div className="flex justify-center mt-6">
          <button
            type="submit"
            className="bg-red-600 text-white px-6 py-3 rounded-md"
          >
            Submit Expectations
          </button>
        </div>
      </form>
    </div>
  );
};

export default Expectations;
