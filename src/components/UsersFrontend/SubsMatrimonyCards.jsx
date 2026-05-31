import React, { useEffect, useState } from "react";
import {
  Heart,
  MapPin,
  GraduationCap,
  Calendar,
  User,
  IndianRupee,
  LucideChevronRight,
} from "lucide-react";
import "./BiodataStyle.css";
import axios from "axios";
import { toast } from "react-toastify";

const SubsMatrimonyCards = ({ matches, token,subscribeIds }) => {
  const [currentView, setCurrentView] = useState("cards"); // 'cards' or 'profile'
  const [selectedProfile, setSelectedProfile] = useState(null);

  function calculateAge(dob) {
    const birthDate = new Date(dob);
    const today = new Date();

    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    const dayDiff = today.getDate() - birthDate.getDate();

    // If birthday hasn't occurred yet this year, subtract 1
    if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
      age--;
    }

    return age;
  }

  function cmToFeetInches(cm) {
  const totalInches = cm / 2.54;
  let feet = Math.floor(totalInches / 12);
  let inches = Math.round(totalInches - feet * 12);

  // Handle cases like 5 feet 12 inches → 6 feet 0 inches
  if (inches === 12) {
    feet++;
    inches = 0;
  }

  return `${feet}' ${inches}"`;
}

  const openProfile = (profile) => {
    setSelectedProfile(profile);
    setCurrentView("profile");
  };

  const goHome = () => {
    setCurrentView("cards");
    setSelectedProfile(null);
  };

  const ProfileCard = ({ profile }) => (
    <div
      className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer transform hover:-translate-y-2 overflow-hidden border border-gray-100"
      // onClick={() => openProfile(profile)}
    >
      <div className="relative">
        <img
          src={profile.userPhotoStatus === "Approved" ? `https://api.manomilan.com/upload/${profile.userPhotoOne}`:"https://imgs.search.brave.com/rwE-hC6ESt3hBJZhImPkb-KvU26bLDKVe-OKv1y50-M/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pLnBp/bmltZy5jb20vb3Jp/Z2luYWxzLzE0LzQz/LzU1LzE0NDM1NWQ3/YjM2YzVmNjQ2NDM1/NDIzNzk4MjgxY2U5/LmpwZw"}
          alt={profile.name}
          className="w-full h-70 object-cover"
        />
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full p-2">
          <Heart className="w-5 h-5 text-pink-500" />
        </div>
      </div>

      <div className="p-6">
        <div className="flex justify-between items-start mb-3">
          <div className="space-y-2">
            <p className="text-gray-700 text-3xl font-semibold flex items-center gap-2">
              <User className="w-6 h-6  text-blue-500" />
              {profile.UserId}
            </p>
            <p className="text-gray-600 flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {calculateAge(profile.dob)} Years
            </p>
          </div>
        </div>

        <div className="space-y-2 mb-4">
          <p className="text-gray-700 flex items-center gap-2">
            <LucideChevronRight className="w-4 h-4 text-blue-500" />
            {cmToFeetInches(profile.height)}
          </p>
          <p className="text-gray-700 flex items-center gap-2">
            <LucideChevronRight className="w-4 h-4 text-green-500" />
            {`${profile.caste.subCaste},${profile.caste.caste},${profile.caste.religion}`}
          </p>
          <p className="text-gray-700 flex items-center gap-2">
            <LucideChevronRight className="w-4 h-4 text-green-500" />
            {profile.sect || "Not Mentioned"}
          </p>
          <div className="text-gray-700 flex items-center gap-2">
            <GraduationCap className="w-4 h-4 text-purple-500" />
            {profile.education.map((ele, index) => (
              <p key={index}>{`${ele}`}</p>
            ))}
          </div>
          <p className="text-gray-700 flex items-center gap-2">
            <IndianRupee className="w-4 h-4 text-purple-500" />
            {profile.monthlyIncome}
          </p>
          <p className="text-gray-700 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-purple-500" />
            {profile.workLocation}
          </p>
        </div>

        <div className="flex flex-col gap-2 justify-between w-full">
          <button
            onClick={() => openProfile(profile)}
            className="w-full bg-gradient-to-r from-pink-500 to-rose-500 text-white py-2 px-4 rounded-lg font-medium hover:from-pink-600 hover:to-rose-600 transition-all duration-300 text-sm"
          >
            View Detail Profile
          </button>
          <button className="w-full bg-gradient-to-r from-pink-500 to-rose-500 text-white py-2 px-4 rounded-lg font-medium hover:from-pink-600 hover:to-rose-600 transition-all duration-300 text-sm">
            Express Interest
          </button>
        </div>
      </div>
    </div>
  );

  const CardsPage = () => (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {matches.map((profile, index) => (
            <ProfileCard key={index} profile={profile} />
          ))}
        </div>
      </div>
    </div>
  );

  const ProfilePage = ({ selectedProfile }) => {  
    const image =
      "https://imgs.search.brave.com/rwE-hC6ESt3hBJZhImPkb-KvU26bLDKVe-OKv1y50-M/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pLnBp/bmltZy5jb20vb3Jp/Z2luYWxzLzE0LzQz/LzU1LzE0NDM1NWQ3/YjM2YzVmNjQ2NDM1/NDIzNzk4MjgxY2U5/LmpwZw";
    const handlePrint = () => {
      window.print();
    };

    // subscribe apis from here
    const subscribe = async () => {
  try {
    const response = await axios.post(
      "https://api.manomilan.com/api/user/subscribe",
      {
        subscribeUserId: selectedProfile?._id,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.data?.status || response.status === 200) {
      toast.success(response.data?.message || "Subscribed successfully");
      return;
    }

    toast.error(response.data?.message || "Subscription failed");
  } catch (error) {
    console.log(error);
    toast.error("Something went wrong while subscribing.");
  }
};

function cmToFeetInches(cm) {
  const totalInches = cm / 2.54; // convert cm → inches
  let feet = Math.floor(totalInches / 12);
  let inches = Math.round(totalInches % 12);

  // ✅ Fix: if rounding makes 12 inches, add 1 foot and reset inches to 0
  if (inches === 12) {
    feet += 1;
    inches = 0;
  }

  return `${feet}' ${inches}"`;
}

function capitalizeFirstLetter(str) {
  if (!str) { // Handle empty or null strings
    return "";
  }
  return str.charAt(0).toUpperCase() + str.slice(1);
}

    
    return (
      <div className="min-h-screen bg-gray-50 p-4 lg:p-8">
        <div className="w-full flex gap-6 justify-end py-4">
          <button
            className="text-white  font-semibold text-md bg-[#a01a1a] px-4 py-2 rounded-xl cursor-pointer"
            onClick={() => goHome()}
          >
            Back
          </button>
           
        </div>
        <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#7d0a0a] to-[#a01a1a] text-white px-6 py-4">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold">
                {selectedProfile.firstName}
              </h1>
              <div className="text-right text-sm">
                <p>MatriID : {selectedProfile.UserId}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
            {/* Left Column - Profile Info */}
            <div className="lg:col-span-1">
              {/* Profile Image and Basic Info */}
              <div className="bg-gradient-to-b from-[#7d0a0a] to-[#a01a1a] text-white rounded-lg p-6 mb-6">
                <div className="text-center mb-4">
                  <div className="w-32 h-40 mx-auto mb-4 bg-gray-300 rounded-lg overflow-hidden">
                    <img
                      src={selectedProfile.userPhotoStatus==="Approved"? `https://api.manomilan.com/upload/${selectedProfile.userPhotoOne}` : image}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h2 className="text-xl font-bold mb-2">
                    ID : {selectedProfile.UserId}
                  </h2>
                  <p className="text-white font-bold w-[100%] justify-center flex items-center gap-2">
                    {`${
                      new Date().getFullYear() -
                      new Date(selectedProfile.dob).getFullYear()
                    } years , ${cmToFeetInches(selectedProfile.height)}`}
                  </p>
                  <p className="text-white font-bold w-[100%] justify-center flex items-center gap-2">
                    {`${selectedProfile.caste.subCaste}, ${selectedProfile.caste.caste}, ${selectedProfile.caste.religion}`}
                  </p>
                  <p className="text-white font-bold w-[100%] justify-center flex items-center gap-2">
                    {selectedProfile.sect || null}
                  </p>

                  <p className="text-white font-bold w-[100%] justify-center flex items-center gap-2">
                    {selectedProfile.education &&
                    selectedProfile.education.length > 0
                      ? selectedProfile.education.map((edu) => edu).join(", ")
                      : "N/A"}
                  </p>

                  <p className="text-white font-bold w-[100%] justify-center flex items-center gap-2">
                    {selectedProfile.monthlyIncome}
                  </p>
                  <p className="text-white font-bold w-[100%] justify-center flex items-center gap-2">
                    Work Loc. : {selectedProfile.parentsCity}
                  </p>
                </div>
              </div>

              {/* Partner Preference */}
              <div className="bg-[#7d0a0a]/10 rounded-lg p-4">
                <h3 className="font-bold text-[#7d0a0a] mb-3 pb-2 border-b border-[#7d0a0a]/20">
                  Expectations
                </h3>
                <div className="text-sm space-y-2">
                  <div>
                    <span className="font-medium">Age Diff : </span>{" "}
                    {`${selectedProfile.ageFrom} to ${selectedProfile.ageTo}`}
                  </div>
                  <div>
                    <span className="font-medium">Looking For : </span>{" "}
                    {selectedProfile.expectedMaritalStatus}
                  </div>
                  <div>
                    <span className="font-medium">Height : </span>{" "}
                    {`${cmToFeetInches(selectedProfile.heightFrom)} to ${cmToFeetInches(selectedProfile.heightTo)}`}
                  </div>
                  <div>
                    <span className="font-medium">Nationality : </span> India
                  </div>
                  <div>
                    <span className="font-medium">Occupation : </span>{" "}
                    {selectedProfile.expectedOccupation}
                  </div>
                  <div>
                    <span className="font-medium">Income : </span>{" "}
                    {selectedProfile.expectedMonthlyIncome}
                  </div>
                </div>
              </div>
              <div className="bg-[#7d0a0a]/10 mt-4 rounded-lg p-4">
                <h3 className="font-bold text-[#7d0a0a] mb-3 pb-2 border-b border-[#7d0a0a]/20">
                  Contact Details
                </h3>
                {
                  subscribeIds ? (
                    <div className="text-sm space-y-2">
                  <div>
                    <span className="font-medium">Parents Contact : </span>{" "}
                    {selectedProfile.parentsContact}
                  </div>
                  <div>
                    <span className="font-medium">Whatsapp : </span>{" "}
                    {selectedProfile.whatsApp}
                  </div>
                  <div>
                    <span className="font-medium">Alternate Mobile : </span>{" "}
                    {selectedProfile?.alternateNumber || "Not Provided"}
                  </div>
                  <div>
                    <span className="font-medium">Parents Residence : </span>{" "}
                    {`${selectedProfile.parentsResidence}, ${selectedProfile.parentsCity}`}
                  </div>
                </div>
                  ) : (
                    <p>
                      subscribe to get contact details
                    </p>
                  )
                }
              </div>
              {/* work location */}
              <div className="bg-[#7d0a0a]/10 rounded-lg p-4 mt-2">
                <h3 className="font-bold text-[#7d0a0a] mb-3 pb-2 border-b border-[#7d0a0a]/20">
                  Work Location Details
                </h3>
                <div className="text-sm space-y-2">
                  <div>
                    <span className="font-medium">City : </span>{" "}
                    {`${selectedProfile.workLocation}`}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Detailed Information */}
            <div className="lg:col-span-2 space-y-6">
              {/* Basic Information */}
              <div className="bg-[#7d0a0a]/10 rounded-lg p-4">
                <h3 className="font-bold text-[#7d0a0a] mb-3 pb-2 border-b border-[#7d0a0a]/20">
                  Basic Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Name : </span>{" "}
                    {selectedProfile.firstName} {selectedProfile.midname}{" "}
                    {selectedProfile.lastName}
                  </div>
                  <div>
                    <span className="font-medium">Gender : </span>{" "}
                    {capitalizeFirstLetter(selectedProfile.gender)}
                  </div>
                  <div>
                    <span className="font-medium">Date of Birth : </span>{" "}
                    {new Date(selectedProfile.dob).toLocaleDateString("en-IN")}
                  </div>
                  <div>
                    <span className="font-medium">Age : </span>{" "}
                    {new Date().getFullYear() -
                      new Date(selectedProfile.dob).getFullYear()}
                  </div>
                  <div>
                    <span className="font-medium">Marital Status : </span>{" "}
                    {selectedProfile.maritalStatus}
                  </div>

                  {selectedProfile.maritalStatus?.toLowerCase() !==
                    "unmarried" && (
                    <div>
                      <span className="font-medium">Child (Issue) : </span>
                      <span>{selectedProfile?.children?.length ?? "0"}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Education and Occupation */}
              <div className="bg-[#7d0a0a]/10 rounded-lg p-4">
                <h3 className="font-bold text-[#7d0a0a] mb-3 pb-2 border-b border-[#7d0a0a]/20">
                  Education and Occupation
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Education : </span>
                    {selectedProfile.education &&
                    selectedProfile.education.length > 0
                      ? selectedProfile.education.map((edu) => edu).join(", ")
                      : "N/A"}
                  </div>
                  <div>
                    <span className="font-medium">Occupation : </span>{" "}
                    {selectedProfile.occupation}
                  </div>
                  <div>
                    <span className="font-medium">Monthly Income (RS.) : </span>{" "}
                    {selectedProfile.monthlyIncome}
                  </div>
                </div>
              </div>

              {/* Religious Background */}
              <div className="bg-[#7d0a0a]/10 rounded-lg p-4">
                <h3 className="font-bold text-[#7d0a0a] mb-3 pb-2 border-b border-[#7d0a0a]/20">
                  Social Background
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Caste : </span>{" "}
                    {`${selectedProfile.caste?.subCaste} , ${selectedProfile.caste?.caste} , ${selectedProfile.caste?.religion}`}
                  </div>
                  <div>
                    <span className="font-medium">Mother Tongue : </span>{" "}
                    {selectedProfile.motherTongue}
                  </div>
                  <div>
                    <span className="font-medium">Place of Birth : </span>{" "}
                    {selectedProfile.placeOfBirth || "Not Provided"}
                  </div>
                  <div>
                    <span className="font-medium">Manglik : </span>{" "}
                    {selectedProfile.manglik || "Not Provided"}
                  </div>
                  <div>
                    <span className="font-medium">Time of Birth : </span>{" "}
                    {selectedProfile.timeOfBirth || "Not Provided"}
                  </div>
                </div>
              </div>

              {/* Hobbies and Interests ( visible only for paid members) */}
              <div className="bg-[#7d0a0a]/10 rounded-lg p-4">
                <h3 className="font-bold text-[#7d0a0a] mb-3 pb-2 border-b border-[#7d0a0a]/20">
                  Other Information
                </h3>
                {/* blank for unpaid members */}
                {
                  subscribeIds ? (
                    <div>{'Not Provided'}</div>
                  ) : (
                    <p>This info is visible to subscription paid members</p>
                  )
                }
              </div>

              {/* Family Details */}
              <div className="bg-[#7d0a0a]/10 rounded-lg p-4">
                <h3 className="font-bold text-[#7d0a0a] mb-3 pb-2 border-b border-[#7d0a0a]/20">
                  Family Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Father Name : </span>{" "}
                    {selectedProfile.fathersName}
                  </div>
                  <div>
                    <span className="font-medium">Mother Name : </span>{" "}
                    {selectedProfile.mothersName}
                  </div>
                  <div>
                    <span className="font-medium">Brother(s) : </span>{" "}
                    {selectedProfile.brothers || selectedProfile.brothersCount}
                  </div>
                  <div>
                    <span className="font-medium">Sister(s) : </span>{" "}
                    {selectedProfile.sisters ||
                      selectedProfile.sistersExactCount}
                  </div>
                  <div>
                    <span className="font-medium">Mamkul : </span>{" "}
                    {selectedProfile.mamkul}
                  </div>
                </div>
              </div>

              {/* native details */}
              <div className="bg-[#7d0a0a]/10 rounded-lg p-4">
                <h3 className="font-bold text-[#7d0a0a] mb-3 pb-2 border-b border-[#7d0a0a]/20">
                  Native Location Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Village : </span>{" "}
                    {selectedProfile.nativeVillage}
                  </div>
                  <div>
                    <span className="font-medium">City : </span>{" "}
                    {/* {`${selectedProfile.nativeCity.city},${selectedProfile.nativeCity.state},${selectedProfile.nativeCity.country}`} */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="w-full flex justify-end mt-4 gap-4">
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

  return (
    <div>
      {currentView === "cards" ? (
        <CardsPage />
      ) : (
        <ProfilePage selectedProfile={selectedProfile} />
      )}
    </div>
  );
};

export default SubsMatrimonyCards;
