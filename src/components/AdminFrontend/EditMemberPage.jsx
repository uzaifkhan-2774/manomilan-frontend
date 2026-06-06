import React, { useEffect, useState } from "react";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import axios from "axios";
import Select from "react-select";
import { toast } from "react-toastify";
import { SearchableDropdown } from "../CommonComponents/SearchableDDM";

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
        val2,
      )}&religion=${encodeURIComponent(val1)}`;
    } else {
      url = `${api3Url}${sep}state=${encodeURIComponent(
        val2,
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
        p[api3Key] === newPref[api3Key],
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

// Single-page edit form that uses RegisterFresh UI & same APIs (no stepper, no loading screens)
const EditMemberPage = ({ userId: rawUserId, token, onClose = () => {} }) => {
  const uid =
    typeof rawUserId === "string"
      ? rawUserId
      : rawUserId && (rawUserId._id || rawUserId.UserId || rawUserId.id);

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    watch,
    getValues,
    formState: { errors, isDirty }, // added isDirty to track changes
  } = useForm({
    defaultValues: {
      // copy relevant defaults from RegisterFresh
      loginNumber: "",
      loginEmail: "",
      password: "",
      firstName: "",
      midname: "",
      lastName: "",
      gender: "",
      dob: "",
      timeOfBirth: "",
      placeOfBirth: "",
      maritalStatus: "Unmarried",
      children: [],
      height: "",
      occupation: "",
      monthlyIncome: "",
      nationality: ["India"],
      caste: "",
      motherTongue: "",
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
      nativeCity: "",

      education: [],
      companyName: "",
      designation: "",
      candidateNumber: "",
      candidateEmail: "",
      workLocation: "",
      isWorking: true,

      ageFrom: "",
      ageTo: "",
      heightFrom: "",
      heightTo: "",
      expectedOccupation: "",
      expectedIncome: "",
      workAbroad: "No",
      expectedMaritalStatus: "",
      expectedNationality: ["India"],
      childAccepted: "No",
      workAbroadpref: "No", 
      divyangPrefer: "No", 

      sect: "",
      manglik: "",
      foodPreference: "",
      bloodGroup: "",
      specs: "",
      gotra: "",
      userPhotoOne: null,
      userPhotoTwo: null,
      userPhotoThree: null,
      userPhotoFour: null,
    },
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

  // lookups from RegisterFresh (use exact same endpoints)
  const [streams, setStreams] = useState([]);
  const [degreesByStream, setDegreesByStream] = useState({});
  const [nationalities, setNationalities] = useState([]);
  const [cities, setCities] = useState([]);
  const [castes, setCastes] = useState([]);
  const [selectedCaste, setSelectedCaste] = useState("");
  const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

  const casteOptions = castes.map((ele) => ({
    label: `${ele.subCaste} - ${ele.casteReligion?.caste} - ${ele.casteReligion?.religion}`,
    value: {
      subCaste: ele.subCaste,
      caste: ele.casteReligion?.caste,
      religion: ele.casteReligion?.religion,
    },
  }));
  const [motherTongue, setMotherTongue] = useState([]);
  const [sect, setSect] = useState([]);
  const [manglik, setManglik] = useState([]);
  const [foodPref, setFoodPref] = useState([]);
  const [selectedParentCity, setSelectedParentCity] = useState("");
  const [selectedNativeCity, setSelectedNativeCity] = useState("");
  const [selectedWorkingLocation, setSelectedWorkingLocation] = useState("");
  const [showChildModal, setShowChildModal] = useState(false);

  const [childCount, setChildCount] = useState(0);
  const [hasChildren, setHasChildren] = useState(false);
  const [showChildCountModal, setShowChildCountModal] = useState(false);
  const [showChildAcceptance, setShowChildAcceptance] = useState(false);
  const [tempChildCount, setTempChildCount] = useState(0);
  const [showChildDetailsModal, setShowChildDetailsModal] = useState(false);
  // used by UI
  const ageFrom = watch("ageFrom");
  const heightFrom = watch("heightFrom");
  const occupations = [
    "Government Service",
    "Private Service",
    "Service + Business / Practice",
    "Business",
    "Student / Internship",
    "Not Working",
  ];
  // helpers: height options (same generation as RegisterFresh)
  const generateHeightOptions = () => {
    const options = [];
    for (let feet = 4; feet <= 7; feet++) {
      for (let inches = 0; inches <= 11; inches++) {
        if (feet === 7 && inches > 6) break;
        const cm = Math.round((feet * 12 + inches) * 2.54);
        options.push({ label: `${feet}'${inches}"`, value: cm });
      }
    }
    return options;
  };
  const heightOptions = generateHeightOptions();

  // fetch lookup data - same APIs & simple calls (no blocking UI)
  useEffect(() => {
    const fetchAllLookups = async () => {
      try {
        // parallel fetches (endpoints exactly as RegisterFresh)
        const [
          streamsRes,
          natRes,
          citiesRes,
          casteRes,
          motherTongueRes,
          sectRes,
          manglikRes,
          foodRes,
        ] = await Promise.all([
          axios.get("http://127.0.0.1:8000/api/user/get-all-stream"),
          axios.get("http://127.0.0.1:8000/api/user/get-all-countries"),
          axios.get("http://127.0.0.1:8000/api/user/get-all-cities"),
          axios.get("http://127.0.0.1:8000/api/user/get-all-subcaste"),
          axios.get("http://127.0.0.1:8000/api/admin/get-mother-tongue"),
          axios.get("http://127.0.0.1:8000/api/user/get-sect"),
          axios.get("http://127.0.0.1:8000/api/user/get-manglik"),
          axios.get("http://127.0.0.1:8000/api/user/food-choices"),
        ]);

        if (streamsRes?.data?.status) {
          const fetchedStreams =
            streamsRes.data.result || streamsRes.data.data || [];
          setStreams(fetchedStreams);

          // Fetch degrees for each stream (like first function)
          const degreesData = {};
          for (const stream of fetchedStreams) {
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
              } else {
                degreesData[stream.stream] = [];
              }
            } catch (err) {
              console.error(
                `Failed to fetch degrees for ${stream.stream}:`,
                err,
              );
              degreesData[stream.stream] = [];
            }
          }

          setDegreesByStream(degreesData);
        }

        if (natRes?.data?.status)
          setNationalities(natRes.data.result || natRes.data.data || []);
        if (citiesRes?.data?.status) {
          const transformed = (
            citiesRes.data.allLocations ||
            citiesRes.data.result ||
            []
          ).map((item) => ({
            label: `${item.city}, ${item.stateCountry?.state || ""}, ${
              item.stateCountry?.country || ""
            }`,
            value: `${item.city}, ${item.stateCountry?.state || ""}, ${
              item.stateCountry?.country || ""
            }`,
          }));
          setCities(transformed);
        }
        if (casteRes?.data?.result) setCastes(casteRes.data.result);
        if (motherTongueRes?.data?.status)
          setMotherTongue(motherTongueRes.data.result || []);
        if (sectRes?.data?.status)
          setSect(sectRes.data.result || sectRes.data.data || []);
        if (manglikRes?.data?.status)
          setManglik(manglikRes.data.result || manglikRes.data.data || []);
        if (foodRes?.data) {
          if (
            foodRes.data.status === false &&
            Array.isArray(foodRes.data.result)
          ) {
            setFoodPref(
              foodRes.data.result.map((it) => ({
                name: it.foodPreference || it,
              })),
            );
          } else if (Array.isArray(foodRes.data.result)) {
            setFoodPref(
              foodRes.data.result.map((it) => ({
                name: it.foodPreference || it,
              })),
            );
          }
        }
      } catch (err) {
        // keep silent — UI shows fields anyway
        console.error("lookup fetch err", err);
      }
    };

    fetchAllLookups();
    // no deps: run once
  }, []);

  // fetch user data and fill form (single call, fill when available)
  useEffect(() => {
    if (!uid) return;
    const fetchUser = async () => {
      try {
        const res = await axios.get(
          `http://127.0.0.1:8000/api/admin/get-single-user/${uid}`,
          {
            headers: token ? { Authorization: `Bearer ${token}` } : undefined,
          },
        );
        if (res.data?.status) {
          const u = res.data.user || res.data.result || {};
          // map backend fields -> form fields (safe)
          const mapped = {
            loginNumber: u.loginNumber || u.mobile || "",
            loginEmail: u.loginEmail || u.email || "",
            password: "",

            firstName: u.firstName || "",
            midname: u.midname || "",
            lastName: u.lastName || "",
            gender: u.gender || "",
            dob: u.dob ? u.dob.split("T")[0] : u.dob || "",
            timeOfBirth: u.timeOfBirth || "",
            placeOfBirth: u.placeOfBirth || "",
            maritalStatus: u.maritalStatus || "Unmarried",
            children: u.children || [],

            height: u.height ? String(u.height) : u.height || "",
            occupation: u.occupation || "",
            monthlyIncome: u.monthlyIncome ? String(u.monthlyIncome) : "",

            nationality: Array.isArray(u.nationality)
              ? u.nationality
              : u.nationality
                ? [u.nationality]
                : ["India"],
            caste: u.caste || "",
            motherTongue: u.motherTongue || "",
            divyang: u.divyang || "No",
            mothersName: u.mothersName || u.motherName || "",
            fathersName: u.fathersName || u.fatherName || "",
            mamkul: u.mamkul || "",
            parentsResidence: u.parentsResidence || "",
            parentsCity: u.parentsCity || "",
            parentsContact: u.parentsContact ? String(u.parentsContact) : "",
            whatsApp: u.whatsApp ? String(u.whatsApp) : "",
            alternateNumber: u.alternateNumber ? String(u.alternateNumber) : "",
            brothersCount:
              u.brothersCount !== undefined ? String(u.brothersCount) : "",
            brothers: u.brothers || "",
            sisters: u.sisters ? String(u.sisters) : "",
            sistersExactCount: u.sistersExactCount || "",
           
            nativeVillage: u.nativeVillage || "",
            nativeCity: u.nativeCity || "",

            education: Array.isArray(u.education)
              ? u.education
              : u.education
                ? u.education
                : [],
            companyName: u.companyName || "",
            designation: u.designation || "",
            candidateNumber: u.candidateNumber || "",
            candidateEmail: u.candidateEmail || "",
            workLocation: u.workLocation || u.parentsCity || "",

            ageFrom: u.ageFrom ?? "",
            ageTo: u.ageTo ?? "",
            heightFrom: u.heightFrom ? String(u.heightFrom) : "",
            heightTo: u.heightTo ? String(u.heightTo) : "",
            expectedOccupation: u.expectedOccupation || "",
            expectedIncome: u.expectedMonthlyIncome
              ? String(u.expectedMonthlyIncome)
              : u.expectedIncome
                ? String(u.expectedIncome)
                : "",
            workAbroad: u.workAbroad || "No",
            expectedMaritalStatus: u.expectedMaritalStatus || "",
            expectedNationality: Array.isArray(u.expectedNationality)
              ? u.expectedNationality
              : u.expectedNationality
                ? [u.expectedNationality]
                : ["India"],
            childAccepted: u.childAccepted || "No",

            sect: u.sect || "",
            manglik: u.manglik || "",
            foodPreference: u.foodPreference || u.food || "",
            bloodGroup: u.bloodGroup || "",
            specs: u.specs || "",
            gotra: u.gotra || "",
            otherInfo: u.otherInfo || u.otherInformation || "",
          };
          // Reset the form with mapped values
          reset(mapped);

          // --- NEW: ensure education is in the form shape expected by the UI (objects with degree) ---
          if (Array.isArray(u.education)) {
            const normalizedEdu = u.education.map((e) =>
              typeof e === "string" ? { degree: e, category: "" } : e,
            );
            setValue("education", normalizedEdu);
          }

          // --- NEW: populate preference field arrays used by PreferenceSelector ---
          if (Array.isArray(u.expectedReligion) && replaceReligion) {
            const rels = u.expectedReligion.map((it) => ({
              id: it._id || it.id || `${Date.now()}_${Math.random()}`,
              religion: it.religion ?? "ANY",
              caste: it.caste ?? "ANY",
              subCaste: it.subCaste ?? "ANY",
            }));
            replaceReligion(rels);
          }

          if (
            Array.isArray(u.expectedNativeLocation) &&
            replaceNativeLocation
          ) {
            const natives = u.expectedNativeLocation.map((it) => ({
              id: it._id || it.id || `${Date.now()}_${Math.random()}`,
              country: it.country ?? "ANY",
              state: it.state ?? "ANY",
              city: it.city ?? "ANY",
            }));
            replaceNativeLocation(natives);
          }

          if (
            Array.isArray(u.expectedWorkingLocation) &&
            replaceWorkingLocation
          ) {
            const works = u.expectedWorkingLocation.map((it) => ({
              id: it._id || it.id || `${Date.now()}_${Math.random()}`,
              country: it.country ?? "ANY",
              state: it.state ?? "ANY",
              city: it.city ?? "ANY",
            }));
            replaceWorkingLocation(works);
          }

          // Backward-compatible field names
          if (u.religionFields) replaceReligion(u.religionFields);
          if (u.nativeLocationFields)
            replaceNativeLocation(u.nativeLocationFields);
          if (u.workingLocationFields)
            replaceWorkingLocation(u.workingLocationFields);

          // populate expectedEducation server-side array for partner education selection
    if (Array.isArray(u.expectedEducation)) {
  const expEdu = u.expectedEducation
    .map((e) => {
      if (typeof e === "string") return e;

      if (e && typeof e === "object" && typeof e.degree === "string") {
        return e.degree;
      }

      return null; // ignore invalid values
    })
    .filter(Boolean); // remove null/empty values

  setExpectedEducationFromServer(expEdu);
}
        }
      } catch (err) {
        console.error("fetch user err", err);
      }
    };
    fetchUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uid]);

  const onSubmit = async (vals) => {
    if (!uid) return toast.error("User id missing");
    try {
      // keep it simple: send json body, convert numeric strings to numbers where appropriate
      const payload = { ...vals };
      if (payload.height) payload.height = Number(payload.height);
      if (payload.monthlyIncome)
        payload.monthlyIncome = Number(payload.monthlyIncome);
      if (payload.expectedIncome)
        payload.expectedIncome = Number(payload.expectedIncome);

            const  result =  await fetch(`http://127.0.0.1:8000/api/admin/update-user/${uid}`, {method :"PUT",
        headers:{
          "Content-Type" : "application/json",
          "Authorization" : `Bearer ${token}`
        },
        body : JSON.stringify(payload)
      });

      const res = await result.json();
       
  

   if (result?.status === 200 ) {
  toast.success(res.message || "Member updated");
} else {
  toast.error(res.message || "Update failed");
}
    } catch (err) {
      console.error("update err", err);
      toast.error(err.message || "Update failed");
    }
  };
  const [partnerEducation, setPartnerEducation] = useState([]);
  const [expectedEducationFromServer, setExpectedEducationFromServer] =
    useState([]);

  // toggle for partner degree selection (same behaviour as RegisterFresh)
  const partnerDegreeToggle = (degree, categoryName) => {
    if (categoryName === "ANY") {
      const allDegrees = partnerEducationCategories
        .filter((cat) => cat.name !== "ANY")
        .flatMap((cat) => cat.degrees)
        .filter((deg, index, self) => self.indexOf(deg) === index);

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

  // ensure the form's expectedEducation field mirrors partnerEducation
  useEffect(() => {
    setValue("expectedEducation", partnerEducation);
  }, [partnerEducation, setValue]);

  // small helper UI: education categories derived same as RegisterFresh
  const educationCategories = streams.map((stream) => ({
    name: stream.stream,
    degrees: (degreesByStream[stream.stream] || []).map((d) => d.degree || d),
  }));
  // console.log(educationCategories);
  const partnerEducationCategories = [
    { name: "ANY", degrees: [] },
    ...educationCategories,
  ];

  // populate partnerEducation from server-provided expectedEducation once lookups are loaded
  useEffect(() => {
    if (
      !expectedEducationFromServer ||
      expectedEducationFromServer.length === 0
    )
      return;
    // build a map of degree -> stream name for easy lookup (case-insensitive)
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
    if (JSON.stringify(normalized) !== JSON.stringify(partnerEducation)) {
      setPartnerEducation(normalized);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [degreesByStream, expectedEducationFromServer]);

  const isAnySelected = partnerEducationCategories
    .filter((cat) => cat.name !== "ANY")
    .flatMap((cat) => cat.degrees)
    .filter((deg, index, self) => self.indexOf(deg) === index)
    .every((deg) => partnerEducation.some((edu) => edu.degree === deg));
  const expectedNationality = [{ country: "ANY" }, ...nationalities];

  // render - full UI (single page) following RegisterFresh layout & components
  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded-lg shadow">
      <div className="flex justify-between items-center mb-4">
        <button
          type="button"
          className="border border-red-500 bg-red-500 text-white px-3 py-1 rounded-md font-semibold flex items-center"
          onClick={() => onClose()}
        >
          Back
        </button>
        <h3 className="text-lg font-semibold text-red-800">Edit Member</h3>
        <div />
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Basic / personal */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-red-700 mb-2">
              Mobile
            </label>
            <Controller
              name="loginNumber"
              control={control}
              render={({ field }) => (
                <input
                  {...field}
                  className="w-full px-3 py-2 border rounded-md"
                />
              )}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-red-700 mb-2">
              Email
            </label>
            <Controller
              name="loginEmail"
              control={control}
              render={({ field }) => (
                <input
                  {...field}
                  type="email"
                  className="w-full px-3 py-2 border rounded-md"
                />
              )}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-red-700 mb-2">
              First Name
            </label>
            <Controller
              name="firstName"
              control={control}
              render={({ field }) => (
                <input
                  {...field}
                  className="w-full px-3 py-2 border rounded-md"
                />
              )}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-red-700 mb-2">
              Middle Name
            </label>
            <Controller
              name="midname"
              control={control}
              render={({ field }) => (
                <input
                  {...field}
                  className="w-full px-3 py-2 border rounded-md"
                />
              )}
            />
          </div>

            <div>
            <label className="block text-sm font-medium text-red-700 mb-2">
              Last Name
            </label>
            <Controller
              name="lastName"
              control={control}
              render={({ field }) => (
                <input
                  {...field}
                  className="w-full px-3 py-2 border rounded-md"
                />
              )}
            />
          </div>
        </div>

        {/* Gender / DOB / Time */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-red-700 mb-2">
              Gender
            </label>
            <Controller
              name="gender"
              control={control}
              render={({ field }) => (
                <div className="flex gap-4">
                  <label className="flex items-center">
                    <input
                      {...field}
                      type="radio"
                      value="male"
                      checked={field.value === "male"}
                      className="h-4 w-4 accent-[#7d0a0a]"
                    />
                    <span className="ml-2">Male</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      {...field}
                      type="radio"
                      value="female"
                      checked={field.value === "female"}
                      className="h-4 w-4 accent-[#7d0a0a]"
                    />
                    <span className="ml-2">Female</span>
                  </label>
                </div>
              )}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-red-700 mb-2">
              DOB
            </label>
            <Controller
              name="dob"
              control={control}
              render={({ field }) => (
                <input
                  {...field}
                  type="date"
                  className="w-full px-3 py-2 border rounded-md"
                />
              )}
            />
          </div>

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
                  className="w-full px-3 py-2 border rounded-md"
                />
              )}
            />
          </div>

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
                  className="w-full px-3 py-2 border rounded-md"
                />
              )}
            />
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
                      ["widowed", "divorced", "divorce in process"].includes(
                        e.target.value,
                      )
                    ) {
                      setShowChildModal(true);
                    }
                  }}
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
                    errors.occupation ? "border-red-500" : "border-gray-300"
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
              Monthly Income *
            </label>
            <Controller
              name="monthlyIncome"
              control={control}
              rules={{
                required: "Monthly income is required",
                pattern: {
                  message: "Enter a number up to 10,00,000 (comma optional)",
                },
              }}
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
              Mother Tongue
            </label>
            <Controller
              name="motherTongue"
              control={control}
              render={({ field }) => (
                <select
                  {...field}
                  className="w-full px-3 py-2 border rounded-md"
                >
                  <option value="">Select</option>
                  {motherTongue.map((m, i) => (
                    <option key={i} value={m.motherTongue || m}>
                      {m.motherTongue || m}
                    </option>
                  ))}
                </select>
              )}
            />
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
                    <label htmlFor="yes" className="ml-2 text-sm text-red-700">
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
                    <label htmlFor="no" className="ml-2 text-sm text-red-700">
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
              rules={{ required: "Parents recidence is required" }}
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
                  options={cities}
                  value={cities.find((opt) => opt.value === field.value) || null}
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
              Native District *
            </label>
            <Controller
              name="nativeCity"
              control={control}
              rules={{ required: "Native city is required" }}
              render={({ field }) => (
                <Select
                  {...field}
                  options={cities}
                  value={cities.find((opt) => opt.value === field.value) || null}
                  onChange={(selectedOption) => {
                    field.onChange(selectedOption.value);
                    setSelectedNativeCity(selectedOption.label);
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

        {/* Education & Occupation (table from RegisterFresh) */}
        <div>
          <h4 className="text-md font-semibold text-red-700 mb-2">
            Education & Occupation
          </h4>
          <div className="bg-white border border-red-200 rounded-lg p-4 mb-4">
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
                    <tr key={category.name}>
                      <td className="px-4 py-3 font-medium text-red-700 border-r border-red-200">
                        {category.name}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-2">
                          {category.degrees.map((deg) => {
                            const selected = (
                              getValues("education") || []
                            ).some((e) => e.degree === deg);
                            return (
                              <button
                                key={deg}
                                type="button"
                                onClick={() => {
                                  const cur = getValues("education") || [];
                                  const exists = cur.some(
                                    (e) => e.degree === deg,
                                  );
                                  const updated = exists
                                    ? cur.filter((e) => e.degree !== deg)
                                    : [
                                        ...cur,
                                        {
                                          degree: deg,
                                          category: category.name,
                                        },
                                      ];
                                  setValue("education", updated);
                                }}
                                className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
                                  selected
                                    ? "bg-red-600 text-white"
                                    : "bg-gray-100 text-gray-700 border border-gray-300"
                                }`}
                              >
                                {deg}
                                {selected ? " ✓" : ""}
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
                  <div className="flex justify-start items-center gap-6">
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
                    <div className="flex items-center ">
                      <input
                        {...field}
                        type="radio"
                        value="No"
                        checked={field.value === "No"}
                        className="h-4 w-4 accent-[#7d0a0a] text-red-600 focus:ring-red-500 border-gray-300"
                      />
                      <label
                        htmlFor="female"
                        className="ml-2  text-sm text-red-700"
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

        {/* Expectations / Partner Preferences */}
        <div>
          <h4 className="text-md font-semibold text-red-700 mb-2">
            Partner Expectations
          </h4>

          <div className="grid grid-cols-4 md:grid-cols- gap-4">
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
                    {Array.from({ length: 31 }, (_, i) => i).map((age) => (
                      <option key={age} value={age}>
                        {age}
                      </option>
                    ))}
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
                    {Array.from({ length: 31 }, (_, i) => i).map((age) => (
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
                    ))}
                  </select>
                )}
              />
              {errors.ageTo && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.ageTo.message}
                </p>
              )}
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
                    {heightOptions.map((h) => (
                      <option key={h.value} value={h.value}>
                        {h.label}
                      </option>
                    ))}
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
                    {heightOptions.map((h) => (
                      <option
                        key={h.value}
                        value={h.value}
                        disabled={
                          heightFrom && Number(h.value) < Number(heightFrom)
                        }
                      >
                        {h.label}
                      </option>
                    ))}
                  </select>
                )}
              />
            </div>
            {/* Occupation */}
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
                    <option value="private_service">Private Service</option>
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
                    <option value="ANY">ANY</option>
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
                name="workAbroadpref"
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
                      <span className="ml-2 text-sm text-gray-700">Yes</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        {...field}
                        value="No"
                        // defaultChecked
                        className="accent-[#7d0a0a] w-4 h-4 text-red-600 bg-gray-100 border-gray-300 focus:ring-red-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">No</span>
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
                      <span className="ml-2 text-sm text-gray-700">Yes</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        {...field}
                        value="No"
                        // defaultChecked
                        className="accent-[#7d0a0a] w-4 h-4 text-red-600 bg-gray-100 border-gray-300 focus:ring-red-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">No</span>
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

            {/* Marital Status */}
            <div className="mt-6 w-full col-span-3">
              <label className="block text-sm font-medium text-red-700 mb-2">
                Marital Status
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
                        const isChecked = field.value?.includes(option.value);

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
                                let updatedValues = [...(field.value || [])];

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
                                    updatedValues.filter((v) => v !== "any");

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
                        <span className="ml-2 text-sm text-gray-700">Yes</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          {...field}
                          value="No"
                          className="w-4 h-4 text-red-600 bg-gray-100 border-gray-300 focus:ring-red-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">No</span>
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
          </div>
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
                                      partnerDegreeToggle(degree, category.name)
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
              api1Url="http://127.0.0.1:8000/api/user/get-religions"
              api2Url="http://127.0.0.1:8000/api/user/get-caste-by-religion"
              api3Url="http://127.0.0.1:8000/api/user/get-subcaste-by-caste"
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
              api1Url="http://127.0.0.1:8000/api/user/get-all-countries"
              api2Url="http://127.0.0.1:8000/api/user/get-state-by-country"
              api3Url="http://127.0.0.1:8000/api/user/get-cities-by-state"
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
              api1Url="http://127.0.0.1:8000/api/user/get-all-countries"
              api2Url="http://127.0.0.1:8000/api/user/get-state-by-country"
              api3Url="http://127.0.0.1:8000/api/user/get-cities-by-state"
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
        </div>

        {/* Special Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-8 space-x-1">
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
                  <div className="space-y-3 space-x-2 sm:space-y-0 sm:grid sm:grid-cols-2 lg:grid-cols-1 sm:gap-4">
                    <div className="flex items-center">
                      {sect.map((ele, index) => (
                        <div className="flex w-full px-2" key={index}>
                          <input
                            {...field}
                            type="radio"
                            value={ele.sect}
                            className="mr-2 flex-shrink-0 accent-[#7d0a0a] text-md"
                          />
                          <span className="text-sm">{ele.sect}</span>
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
                        <div className="flex w-full px-2" key={index}>
                          <input
                            key={index}
                            {...field}
                            type="radio"
                            value={ele.manglik}
                            className="mr-2 flex-shrink-0 accent-[#7d0a0a] text-md"
                          />
                          <span className="text-sm">{ele.manglik}</span>
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
                        <div className="flex w-full px-2 " key={index}>
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
                      <label key={group} className="flex items-center px-2">
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
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={handleSubmit(onSubmit)}
            disabled={!isDirty}
            className={`px-6 py-3 rounded-md text-white ${
              isDirty
                ? "bg-blue-600 hover:bg-blue-700"
                : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            Update User
          </button>
        </div>
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
                  onClick={() => setShowChildCountModal(false)}
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
                                onChange={(e) => field.onChange(e.target.value)}
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
                                onChange={(e) => field.onChange(e.target.value)}
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
                            const currentChildren = getValues("children") || [];
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
  );
};

export default EditMemberPage;
