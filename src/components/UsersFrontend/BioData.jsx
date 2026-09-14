import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const BiodataProfile = ({ userId }) => {
  const { id: routeId } = useParams();
  const targetId = userId || routeId;
  const navigate = useNavigate();
  const [bioDataDetails, setBioDataDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const pathname=location.pathname
  useEffect(() => {
    const fetchUser = async () => {
      try {
        let response;
        if (targetId) {
          // admin-style single user endpoint (works when viewing another user)
          response = await axios.get(`https://api.manomilan.com/api/admin/get-single-user/${targetId}`);
          // normalize: res.data.user or res.data.result
          const user = response.data?.user || response.data?.result || response.data;
          setBioDataDetails(user);
        } else {
          // fetch current logged-in user
          response = await axios.get("https://api.manomilan.com/api/user/getcurrentuser", {
            headers: { Authorization: `Bearer ${localStorage.getItem("userToken")}` },
          });
          const user = response.data?.result || response.data || {};
          setBioDataDetails(user);
        }
        setLoading(false);
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
        setError("Failed to load user data. Please try again later.");
        setLoading(false);
      }
    };
    fetchUser();
  }, [targetId]);

  const handlePrint = () => {
    window.print();
  };

  const getAge = (dob) => {
    if (!dob) return "N/A";
    return new Date().getFullYear() - new Date(dob).getFullYear();
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const dob = new Date(dateString);
    const day = String(dob.getDate()).padStart(2, "0");
    const month = String(dob.getMonth() + 1).padStart(2, "0");
    const year = dob.getFullYear();
    return `${day}/${month}/${year}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-lg font-semibold">Loading...</p>
      </div>
    );
  }

  if (error || !bioDataDetails) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-lg font-semibold text-red-600">
          {error || "No user data available."}
        </p>
      </div>
    );
  }

  // Transform education to match expected format (array of objects)
  const normalizedEducation = bioDataDetails.education?.map((edu) => ({
    degree: edu,
  })) || [];

  // Transform expectedEducation to match expected format
  const normalizedExpectedEducation = bioDataDetails.expectedEducation?.map((edu) => ({
    degree: edu,
  })) || [];

  // Extract caste information from expectedReligion if caste is not present
  const casteInfo = bioDataDetails.caste || {
    subCaste: bioDataDetails.expectedReligion?.[0]?.subcaste || "N/A",
    caste: bioDataDetails.expectedReligion?.[0]?.caste || "N/A",
    religion: bioDataDetails.expectedReligion?.[0]?.religion || "N/A",
  };
  
  function cmToFeetInches(cm) {
  const totalInches = cm / 2.54;
  const feet = Math.floor(totalInches / 12);
  const inches = Math.round(totalInches % 12);
  return `${feet}' ${inches}"`;
}

  return (
    <div className="min-h-screen bg-gray-50 p-4 lg:p-8">
      <div className="w-full flex justify-end">
        <button
          className="text-white font-semibold text-md bg-[#a01a1a] px-4 py-2 rounded-xl cursor-pointer mb-8"
          onClick={handlePrint}
        >
          Print
        </button>
      </div>

      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#7d0a0a] to-[#a01a1a] text-white px-6 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">{bioDataDetails.firstName}</h1>
            <div className="text-right text-sm">
              <p>MatriID: {bioDataDetails.UserId || id}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
          {/* Left Column - Profile Info */}
          <div className="lg:col-span-1">
            <div className="bg-gradient-to-b from-[#7d0a0a] to-[#a01a1a] text-white rounded-lg p-6 mb-6">
              <div className="text-center mb-4">
                <div className="w-32 h-40 mx-auto mb-4 bg-gray-300 rounded-lg overflow-hidden">
                  <img
  src={
    bioDataDetails.profilePic
      ? `https://api.manomilan.com/upload/${bioDataDetails.profilePic}`
      : bioDataDetails.userPhotoOne
      ? `https://api.manomilan.com/upload/${bioDataDetails.userPhotoOne}`
      : "https://imgs.search.brave.com/rwE-hC6ESt3hBJZhImPkb-KvU26bLDKVe-OKv1y50-M/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pLnBp/bmltZy5jb20vb3JpZ2luYWxzLzE0LzQz/LzU1LzE0NDM1NWQ3/YjM2YzVmNjQ2NDM1/NDIzNzk4MjgxY2U5LmpwZw"
  }
/>

                </div>
                <h2 className="text-xl font-bold mb-2">ID: {bioDataDetails.UserId || id}</h2>
                <p>{`${getAge(bioDataDetails.dob)} years, ${cmToFeetInches(bioDataDetails.height)} cm`}</p>
                <p>
                  {`${bioDataDetails.caste.subCaste}, ${bioDataDetails.caste.caste}, ${bioDataDetails.caste.religion}`}
                </p>
                <p>{bioDataDetails.sect || "N/A"}</p>
                <p>
                  {normalizedEducation.length > 0
                    ? normalizedEducation.map((edu) => edu.degree).join(", ")
                    : "N/A"}
                </p>
                <p>{bioDataDetails.monthlyIncome || "N/A"}</p>
                <p>Work Loc.: {bioDataDetails.workLocation || "N/A"}</p>
              </div>
            </div>

            {/* Partner Preference */}
            <div className="bg-[#7d0a0a]/10 rounded-lg p-4">
              <h3 className="font-bold text-[#7d0a0a] mb-3 border-b">Expectations</h3>
              <div className="text-sm space-y-2">
                <div>Age: {bioDataDetails.ageFrom} to {bioDataDetails.ageTo}</div>
                <div>Looking For: {bioDataDetails.expectedMaritalStatus || "N/A"}</div>
                <div>Height: {bioDataDetails.heightFrom} to {bioDataDetails.heightTo}</div>
                <div>
                  Nationality: {bioDataDetails.expectedNationality?.join(", ") || "N/A"}
                </div>
                <div>Occupation: {bioDataDetails.expectedOccupation || "N/A"}</div>
                <div>Income: {bioDataDetails.expectedMonthlyIncome || "N/A"}</div>
              </div>
            </div>

            {/* Contact */}
            <div className="bg-[#7d0a0a]/10 mt-4 rounded-lg p-4">
              <h3 className="font-bold text-[#7d0a0a] mb-3 border-b">Contact Details</h3>
              <div className="text-sm space-y-2">
                <div>Parents Contact: {bioDataDetails.parentsContact || "N/A"}</div>
                <div>
                  Residence: {bioDataDetails.parentsResidence || "N/A"}, {bioDataDetails.parentsCity || "N/A"}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Info */}
            <div className="bg-[#7d0a0a]/10 rounded-lg p-4">
              <h3 className="font-bold text-[#7d0a0a] mb-3 border-b">Basic Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  Name: {bioDataDetails.firstName} {bioDataDetails.midname} {bioDataDetails.lastName}
                </div>
                <div>Gender: {bioDataDetails.gender || "N/A"}</div>
                <div>DOB: {formatDate(bioDataDetails.dob)}</div>
                <div>Age: {getAge(bioDataDetails.dob)}</div>
                <div>Marital Status: {bioDataDetails.maritalStatus || "N/A"}</div>
                {bioDataDetails.maritalStatus?.toLowerCase() !== "unmarried" && (
                  <div>Child (Issue): {bioDataDetails.children?.length ?? "0"}</div>
                )}
              </div>
            </div>

            {/* Education and Work */}
            <div className="bg-[#7d0a0a]/10 rounded-lg p-4">
              <h3 className="font-bold text-[#7d0a0a] mb-3 border-b">Education and Occupation</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  Education: {normalizedEducation.length > 0
                    ? normalizedEducation.map((edu) => edu.degree).join(", ")
                    : "N/A"}
                </div>
                <div>Occupation: {bioDataDetails.occupation || "N/A"}</div>
                <div>Monthly Income (Rs.): {bioDataDetails.monthlyIncome || "N/A"}</div>
              </div>
            </div>

            {/* Social */}
            <div className="bg-[#7d0a0a]/10 rounded-lg p-4">
              <h3 className="font-bold text-[#7d0a0a] mb-3 border-b">Social Background</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  Caste: {`${casteInfo.subCaste}, ${casteInfo.caste}, ${casteInfo.religion}`}
                </div>
                <div>Mother Tongue: {bioDataDetails.motherTongue || "N/A"}</div>
                <div>Place of Birth: {bioDataDetails.placeOfBirth || "N/A"}</div>
                <div>Manglik: {bioDataDetails.manglik || "N/A"}</div>
                <div>Time of Birth: {bioDataDetails.timeOfBirth || "N/A"}</div>
              </div>
            </div>

            {/* Hobbies */}
            <div className="bg-[#7d0a0a]/10 rounded-lg p-4">
              <h3 className="font-bold text-[#7d0a0a] mb-3 border-b">Hobbies and Interests</h3>
              <p>{bioDataDetails.otherInfo || " "}</p>
            </div>

            {/* Family */}
            <div className="bg-[#7d0a0a]/10 rounded-lg p-4">
              <h3 className="font-bold text-[#7d0a0a] mb-3 border-b">Family Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>Brothers: {bioDataDetails.brothers || bioDataDetails.brothersCount || "0"}</div>
                <div>Sisters: {bioDataDetails.sisters || bioDataDetails.sistersExactCount || "0"}</div>
                <div>Mamkul: {bioDataDetails.mamkul || "N/A"}</div>
              </div>
            </div>

            {/* Native */}
            <div className="bg-[#7d0a0a]/10 rounded-lg p-4">
              <h3 className="font-bold text-[#7d0a0a] mb-3 border-b">Native Location Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>Village: {bioDataDetails.nativeVillage || "N/A"}</div>
                <div>
                  City: {bioDataDetails.expectedNativeLocation?.[0]?.city || bioDataDetails.nativeCity || "N/A"}
                </div>
              </div>
            </div>

            {/* Work */}
            <div className="bg-[#7d0a0a]/10 rounded-lg p-4">
              <h3 className="font-bold text-[#7d0a0a] mb-3 border-b">Work Location Details</h3>
              <div className="text-sm">
                <div>
                  City: {bioDataDetails.workLocation || bioDataDetails.expectedWorkingLocation?.[0]?.city || "N/A"}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-[#7d0a0a] text-white text-center py-4">
          <p className="text-xs">
            Browse - Login - Search - My Profile - Contact Us - Member Success Stories - Help
            <br />
            © 2019-2022 www.manomilan.com, All Rights Reserved. User Agreement and Terms of Use
          </p>
        </div>
      </div>

      <div className="w-full flex justify-end mt-4 gap-4">
        {
          pathname.includes("/profile")?" ":(
            <button
          className="text-white font-semibold text-md bg-[#a01a1a] px-4 py-2 rounded-xl cursor-pointer"
          onClick={() => navigate("/")}
        >
          Continue
        </button>
          )
        }
        <button
          className="text-white font-semibold text-md bg-[#a01a1a] px-4 py-2 rounded-xl cursor-pointer"
          onClick={handlePrint}
        >
          Print
        </button>
      </div>
    </div>
  );
};

export default BiodataProfile;