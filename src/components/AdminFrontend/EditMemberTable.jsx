import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Eye,
  Edit3,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
} from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";
import EditMemberForm from "./EditMemberPage";

const EditMemberTable = ({
  data = [], // <-- default to empty array to avoid undefined.filter errors
  token,
  userId: propUserId, // <- accept userId prop from parent when opening edit
  currFranchiseId,
  currentPage = 0, // safe default
  pageSize = 5,
  totalUsers,
  onPageChange,
  onClose: parentOnClose,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const pathname = location.pathname;

  // If parent passed a userId, render only the edit form (no nested table)
  if (propUserId) {
    return (
      <EditMemberForm
        userId={propUserId}
        token={token}
        onClose={() => {
          // prefer parent-provided onClose (e.g., MemberTable -> setDetailProfile(false))
          if (typeof parentOnClose === "function") {
            parentOnClose();
            return;
          }

          // otherwise navigate to a reasonable parent route instead of history.back
          if (pathname.includes("/admin")) {
            navigate("/admin");
            return;
          }
          if (pathname.includes("/franchise")) {
            navigate("/franchise");
            return;
          }

          // fallback to history back
          try {
            navigate(-1);
          } catch (e) {
            /* ignore */
          }
        }}
      />
    );
  }

  // safe copy of data (ensure array)
  const safeData = Array.isArray(data) ? data : [];

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [updatePic, setUpdatePic] = useState(false);
  const [singleUser, setSingleUser] = useState({});
  const [biodata, setBiodata] = useState(false);
  const [detailProfile, setDetailProfile] = useState(false);
  const itemsPerPage = pageSize || 5;
  const [updateProfile, setUpdateProfile] = useState(false);
  const [edit, setEdit] = useState(false);
  // Filter distributors based on search and status
  // Update the filteredDistributors logic
  const filteredDistributors = useMemo(() => {
    const q = (searchTerm || "").trim().toLowerCase();
    if (!q) return safeData;

    return safeData.filter((distributor) => {
      // Format distributor's DOB to dd/mm/yyyy for display and comparison
      const formattedDob = distributor?.dob
        ? new Date(distributor.dob).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          })
        : "";

      const formattedReg = distributor?.createdAt
        ? new Date(distributor.createdAt).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          })
        : "";

      // Helper function to validate and parse dates
      const isValidDate = (dateStr) => {
        if (!dateStr) return false;
        if (/^\d{2}\/\d{2}\/\d{4}$/.test(dateStr)) {
          const [day, month, year] = dateStr.split("/");
          const date = new Date(year, month - 1, day);
          return date && date.getMonth() === month - 1;
        }
        return false;
      };

      const matchesSearch =
        distributor?.loginEmail?.toLowerCase().includes(q) ||
        distributor?.firstName?.toLowerCase().includes(q) ||
        distributor?.UserId?.toString().toLowerCase().includes(q) ||
        distributor?.loginNumber?.toString().toLowerCase().includes(q) ||
        distributor?.mamkul?.toString().toLowerCase().includes(q) ||
        distributor?.monthlyIncome?.toString().toLowerCase().includes(q) ||
        distributor?.mothersName?.toString().toLowerCase().includes(q) ||
        distributor?.nativeVillage?.toString().toLowerCase().includes(q) ||
        distributor?.parentsCity
          ?.toString()
          .toLowerCase()
          .includes(q) ||
        distributor?.parentsContact?.toString().toLowerCase().includes(q) ||
        distributor?.parentsResidence
          ?.toString()
          .toLowerCase()
          .includes(q) ||
        distributor?.placeOfBirth
          ?.toString()
          .toLowerCase()
          .includes(q) ||
        distributor?.workLocation?.toString().toLowerCase().includes(q) ||
        distributor
          ?.motherTongue?.toString()
          .toLowerCase()
          .includes(q) ||
        distributor?.franchiseUnder?.toLowerCase().includes(q) ||
        (isValidDate(searchTerm) && formattedDob === searchTerm) ||
        (searchTerm.length >= 2 && formattedDob.includes(searchTerm)) ||
        (isValidDate(searchTerm) && formattedReg === searchTerm) ||
        (searchTerm.length >= 2 && formattedReg.includes(searchTerm));

      return matchesSearch;
    });
  }, [safeData, searchTerm]);

  // Pagination - use safe currentPage
  const safeCurrentPage = Number.isInteger(currentPage) ? currentPage : 0;
  const totalPages = Math.ceil(filteredDistributors.length / itemsPerPage) || 1;
  const startIndex = safeCurrentPage * itemsPerPage;
  const paginatedDistributors = useMemo(
    () =>
      filteredDistributors.slice(startIndex, startIndex + itemsPerPage),
    [filteredDistributors, startIndex, itemsPerPage]
  );
  const [userId, setUserId] = useState(null);

  function cmToFeetInches(cm) {
    const totalInches = cm / 2.54;
    const feet = Math.floor(totalInches / 12);
    const inches = Math.round(totalInches % 12);
    return `${feet}' ${inches}"`;
  }

  const handleView = async (id) => {
    // Fetch allotted packages first
    await getAllotedPackages(id);

    // Fetch single user details
    let endpoint;
    if (pathname.includes("/admin")) {
      endpoint = `https://api.manomilan.com/api/admin/get-single-user/${id}`;
    } else {
      endpoint = `https://api.manomilan.com/api/franchise/get-single-user/${id}`;
    }
    try {
      const response = await axios.get(endpoint, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.data?.status) {
        setSingleUser(response.data?.user);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const updateProfilePic = async () => {
    try {
      const response = await axios.put(
        "https://api.manomilan.com/api/admin/update-userpfp",
        {
          userId: singleUser._id,
          userStatus: "Approved",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data.status) {
        // refresh single user from server so UI reflects new profile pic immediately
        try {
          await handleView(singleUser._id);
        } catch (e) {
          console.error("Failed to refresh user after pfp update", e);
        }
        setUpdatePic(Date.now());
        setUpdateProfile(!updateProfile);
        toast.success("Profile photo updated successfully");
        try {
          const { emitEvent } = await import("../../utils/eventBus");
          emitEvent("user:pfp-updated", { userId: singleUser._id });
        } catch (err) {
          console.error("emit failed", err);
        }
      }
      console.log(response.data);
    } catch (error) {
      console.log(error);
    }
  };
  const rejectProfilePic = async () => {
    try {
      const response = await axios.put(
        "https://api.manomilan.com/api/admin/update-userpfp",
        {
          userId: singleUser._id,
          userStatus: "Rejected",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data.stauts) {
        setUpdateProfile(!updateProfile);
        toast.success("Profile Photo rejected");
      }
      console.log(response.data);
    } catch (error) {
      console.log(error);
    }
  };
  const inactiveUser = async () => {
    try {
      const response = await axios.post(
        "https://api.manomilan.com/api/franchise/inactivate-user",
        {
          userId: singleUser._id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data.status) {
        toast.success(response.data.message);
      }
      console.log(response.data);
    } catch (error) {
      console.log(error);
    }
  };
  const handleEditFrDetails = (distributor) => {
    setUserId(distributor);
    setEdit(true);
    // alert(`Editing Us ${distributor._id}`);
  };

  const getStatusBadge = (status) => {
    const baseClasses = "px-3 py-1 rounded-full text-xs font-medium";
    switch (status) {
      case "Active":
        return `${baseClasses} bg-green-100 text-green-800`;
      case "true":
        return `${baseClasses} bg-green-100 text-green-800`;
      case "false":
        return `${baseClasses} bg-red-100 text-green-800`;
      case "Inactive":
        return `${baseClasses} bg-gray-100 text-gray-800`;
      case "Pending":
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      case "Rejected":
        return `${baseClasses} bg-red-100 text-red-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };
  const handlePrint = () => {
    window.print();
  };

  // packages alloting apis
  const [allotingPackages, setAllotingPackages] = useState([]);
  const [allotedPackages, setAllotedPackages] = useState({});
  const packageAlloter = async () => {
    console.log(currFranchiseId);
    try {
      const response = await axios.get(
        `https://api.manomilan.com/api/franchise/get-packages/${currFranchiseId}`
      );
      console.log(response.data);
      if (response.data.status) {
        setAllotingPackages(response.data?.franchisePackages);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const allotPackageToUser = async (data) => {
    let endpoint;
    if (data.vipPackage === undefined) {
      endpoint = "https://api.manomilan.com/api/franchise/allot-main-addOnpackage";
    } else {
      endpoint = "https://api.manomilan.com/api/franchise/allot-vip-package";
    }

    const payload = {
      userId: singleUser?._id,
      franchisePackageId: data?._id,
    };

    // ❗Prevent multiple main packages
    if (data?.mainPackageId && allotedPackages?.mainPackageId) {
      toast.error("Main Package already given to the user");
      return;
    }

    try {
      const response = await axios.post(endpoint, payload);
      console.log(response.data);

      if (response.data?.status) {
        toast.success(response.data?.message);

        // 🛠 Store the package details and retain mainPackageId if applicable
        setAllotedPackages({
          ...response.data.packageDetails,
          mainPackageId: data?.mainPackageId || allotedPackages?.mainPackageId,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getAllotedPackages = async (data) => {
    try {
      const response = await axios.get(
        `https://api.manomilan.com/api/user/get-packages/${data}`
      );
      console.log(response.data);
      if (response.data?.status && response.data?.userPackages) {
        // Check if any package has mainPackageId
        const hasMainPackage = response.data.userPackages.some(
          (pkg) => pkg.franchisePackage?.mainPackageId
        );

        // Sort packages by createdAt to get the latest package
        const latestPackage =
          response.data.userPackages.sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
          )[0] || {};

        setAllotedPackages({
          ...latestPackage.franchisePackage,
          mainPackageId: hasMainPackage
            ? latestPackage.franchisePackage?.mainPackageId || true
            : null,
        });
      } else {
        setAllotedPackages({}); // No packages or invalid response
      }
    } catch (error) {
      console.log(error);
      setAllotedPackages({}); // Reset on error
    }
  };

  useEffect(() => {
    packageAlloter();
  }, []);

  if (!biodata) {
    return !edit ? (
      <div className="min-h-screen p-6">
        <div className="min-h-screen  p-6">
          <div className="max-w-7xl mx-auto">
            {/* Search and Filter Bar */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search by ID, username, or franchise..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ focusRingColor: "#7d0a0a" }}
                  />
                </div>
                <div className="flex gap-3">
                  <div className="relative">
                    <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <select
                      className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white"
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                    >
                      <option value="All">ALL</option>
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                      <option value="Pending">Incomplete</option>
                      <option value="Divorce">Divorced</option>
                      <option value="widowed">Widowed</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead style={{ backgroundColor: "#7d0a0a" }}>
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">
                        ID
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">
                        First Name
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">
                        Last Name
                      </th>
                      <th
                        className={`px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider ${
                          pathname.includes("/franchise") ? "hidden" : "flex"
                        }`}
                      >
                        Franchise Under
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">
                        Profile Status
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">
                        Contact Number
                      </th>
                      <th
                        className={`px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider ${
                          pathname.includes("/franchise") ? "hidden" : "flex"
                        }`}
                      >
                        Password
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">
                        Date of Registration
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {paginatedDistributors.map((distributor, index) => (
                      <tr
                        key={distributor.UserId}
                        className={`${
                          distributor.ActiveStatus === false
                            ? "bg-red-200 text-white"
                            : index % 2 === 0
                            ? "bg-white"
                            : "bg-gray-50"
                        }`}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {distributor.UserId}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {distributor.firstName}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {distributor.lastName}
                          </div>
                        </td>
                        <td
                          className={`px-6 py-4 whitespace-nowrap ${
                            pathname.includes("/franchise") ? "hidden" : "flex"
                          }`}
                        >
                          <div className="text-sm text-gray-900">
                            {distributor.franchiseUnder}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={getStatusBadge(
                              distributor.userPhotoStatus
                            )}
                          >
                            {distributor.userPhotoStatus}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {distributor.loginNumber}
                          </div>
                        </td>
                        <td
                          className={`px-6 py-4 whitespace-nowrap ${
                            pathname.includes("/franchise") ? "hidden" : "flex"
                          }`}
                        >
                          <div className="text-sm text-gray-900">
                            {distributor.password}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {new Date(distributor.createdAt).toLocaleDateString(
                              "en-GB",
                              {
                                day: "2-digit",
                                month: "2-digit",
                                year: "numeric",
                              }
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={getStatusBadge(
                              distributor.ActiveStatus ? "Active" : "Inactive"
                            )}
                          >
                            {distributor.ActiveStatus ? "Active" : "Inactive"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                              <button
                                onClick={() => {
                                  handleEditFrDetails(distributor);
                                }}
                                className="inline-flex items-center px-3 py-1.5 border text-xs font-medium rounded-md text-white hover:opacity-90 transition-opacity"
                                style={{
                                  backgroundColor: "#a51d1d",
                                  borderColor: "#7d0a0a",
                                }}
                              >
                                <Edit3 className="w-3 h-3 mr-1" />
                                Edit
                              </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {/* Pagination */}
              <div className="bg-white px-6 py-4 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-700">
                    Showing {startIndex + 1} to{" "}
                    {Math.min(
                      startIndex + itemsPerPage,
                      filteredDistributors.length
                    )}{" "}
                    of {filteredDistributors.length} results
                  </div>
                  {/* Pagination Controls */}
                  <div className="mt-4 flex justify-center gap-2">
                    <button
                      disabled={currentPage === 0}
                      onClick={() => onPageChange(currentPage - 1)}
                      className="px-3 py-1 border rounded disabled:opacity-50"
                    >
                      Prev
                    </button>
                    <span className="px-3 py-1">
                      {currentPage + 1} / {totalPages}
                    </span>
                    <button
                      disabled={currentPage >= totalPages - 1}
                      onClick={() => onPageChange(currentPage + 1)}
                      className="px-3 py-1 border rounded disabled:opacity-50"
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Empty State */}
            {filteredDistributors.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-500 text-lg mb-2">
                  No members found
                </div>
                <div className="text-gray-400">
                  Try adjusting your search or filter criteria
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    ) : (
      <EditMemberForm
        userId={userId._id}
        token={token}
        onClose={() => setEdit(false)}
      />
    );
  } else {
    if (detailProfile) {
      return (
        <div className="min-h-screen bg-gray-50 p-4 lg:p-8">
          <div className="w-full flex justify-end">
            <button
              className="text-white font-semibold text-md bg-[#a01a1a] px-4 py-2 rounded-xl cursor-pointer mb-8"
              onClick={() => setDetailProfile(!detailProfile)}
            >
              Back
            </button>
          </div>

          <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-[#7d0a0a] to-[#a01a1a] text-white px-6 py-4">
              <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">{singleUser.firstName}</h1>
                <div className="text-right text-sm">
                  <p>MatriID : {singleUser.UserId}</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
              {/* Left Column */}
              <div className="lg:col-span-1">
                {/* Profile Image & Info */}
                <div className="bg-gradient-to-b from-[#7d0a0a] to-[#a01a1a] text-white rounded-lg p-6 mb-6">
                  <div className="text-center mb-4">
                    <div className="w-32 h-40 mx-auto mb-4 bg-gray-300 rounded-lg overflow-hidden">
                      <img
  src={
    singleUser.userPhotoOne
      ? `https://api.manomilan.com/upload/${singleUser.userPhotoOne}${
          updatePic ? `?t=${updatePic}` : ""
        }`
      : "https://imgs.search.brave.com/rwE-hC6ESt3hBJZhImPkb-KvU26bLDKVe-OKv1y50-M/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pLnBp/bmltZy5jb20vb3Jp/Z2luYWxzLzE0LzQz/LzU1LzE0NDM1NWQ3/YjM2YzVmNjQ2NDM1/NDIzNzk4MjgxY2U5LmpwZw"
  }
  alt="Profile"
  className="w-full h-full object-cover"
/>

                    </div>
                    <h2 className="text-xl font-bold mb-2">
                      ID : {singleUser.UserId}
                    </h2>
                    <p className="text-white font-bold">
                      {(() => {
                        const dob = new Date(singleUser.dob);
                        const today = new Date();
                        let age = today.getFullYear() - dob.getFullYear();
                        if (
                          today.getMonth() < dob.getMonth() ||
                          (today.getMonth() === dob.getMonth() &&
                            today.getDate() < dob.getDate())
                        ) {
                          age--;
                        }
                        return `${age} years, ${cmToFeetInches(
                          singleUser.height
                        )}`;
                      })()}
                    </p>
                    <p className="text-white font-bold">
                      {`${singleUser.caste?.subCaste || "N/A"}, ${
                        singleUser.caste?.caste || "N/A"
                      }, ${singleUser.caste?.religion || "N/A"}`}
                    </p>
                    <p className="text-white font-bold">
                      {singleUser.sect || "N/A"}
                    </p>
                    <p className="text-white font-bold">
                      {singleUser.education?.length > 0
                        ? singleUser.education.join(", ")
                        : "N/A"}
                    </p>
                    <p className="text-white font-bold">
                      ₹
                      {singleUser.monthlyIncome?.toLocaleString("en-IN") ||
                        "N/A"}
                    </p>
                    <p className="text-white font-bold">
                      Work Loc. : {singleUser.parentsCity || "N/A"}
                    </p>
                  </div>
                </div>

                {/* Expectations */}
                <div className="bg-[#7d0a0a]/10 rounded-lg p-4">
                  <h3 className="font-bold text-[#7d0a0a] mb-3 pb-2 border-b border-[#7d0a0a]/20">
                    Expectations
                  </h3>
                  <div className="text-sm space-y-2">
                    <p>
                      <span className="font-medium">Age:</span>{" "}
                      {singleUser.ageFrom} to {singleUser.ageTo}
                    </p>
                    <p>
                      <span className="font-medium">Looking For:</span>{" "}
                      {singleUser.expectedMaritalStatus || "N/A"}
                    </p>
                    <p>
                      <span className="font-medium">Height:</span>{" "}
                      {cmToFeetInches(singleUser.heightFrom)} to{" "}
                      {cmToFeetInches(singleUser.heightTo)}
                    </p>
                    <p>
                      <span className="font-medium">Nationality:</span>{" "}
                      {singleUser.expectedNationality?.join(", ") || "N/A"}
                    </p>
                    <p>
                      <span className="font-medium">Occupation:</span>{" "}
                      {singleUser.expectedOccupation || "N/A"}
                    </p>
                    <p>
                      <span className="font-medium">Income:</span> ₹
                      {singleUser.expectedMonthlyIncome?.toLocaleString(
                        "en-IN"
                      ) || "N/A"}
                    </p>
                  </div>
                </div>

                {/* Contact */}
                <div className="bg-[#7d0a0a]/10 mt-4 rounded-lg p-4">
                  <h3 className="font-bold text-[#7d0a0a] mb-3 pb-2 border-b border-[#7d0a0a]/20">
                    Contact Details
                  </h3>
                  <div className="text-sm space-y-2">
                    <p>
                      <span className="font-medium">Parents Contact:</span>{" "}
                      {singleUser.parentsContact || "N/A"}
                    </p>
                    <p>
                      <span className="font-medium">Parents Residence:</span>{" "}
                      {`${singleUser.parentsResidence || ""}, ${
                        singleUser.parentsCity || ""
                      }`}
                    </p>
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="lg:col-span-2 space-y-6">
                {/* Basic Info */}
                <div className="bg-[#7d0a0a]/10 rounded-lg p-4">
                  <h3 className="font-bold text-[#7d0a0a] mb-3 pb-2 border-b border-[#7d0a0a]/20">
                    Basic Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <p>
                      <span className="font-medium">Name:</span>{" "}
                      {`${singleUser.firstName} ${singleUser.midname || ""} ${
                        singleUser.lastName
                      }`}
                    </p>
                    <p>
                      <span className="font-medium">Gender:</span>{" "}
                      {singleUser.gender}
                    </p>
                    <p>
                      <span className="font-medium">DOB: </span>
                      {(() => {
                        const dob = new Date(singleUser.dob);
                        const day = String(dob.getDate()).padStart(2, "0");
                        const month = String(dob.getMonth() + 1).padStart(
                          2,
                          "0"
                        ); // Month is 0-indexed
                        const year = dob.getFullYear();
                        return `${day}/${month}/${year}`;
                      })()}
                    </p>
                    <p>
                      <span className="font-medium">Age:</span>{" "}
                      {new Date().getFullYear() -
                        new Date(singleUser.dob).getFullYear()}
                    </p>
                    <p>
                      <span className="font-medium">Marital Status:</span>{" "}
                      {singleUser.maritalStatus}
                    </p>
                    {singleUser.maritalStatus?.toLowerCase() !==
                      "unmarried" && (
                      <p>
                        <span className="font-medium">Child (Issue):</span>{" "}
                        {singleUser.children?.length || 0}
                      </p>
                    )}
                  </div>
                </div>

                {/* Education */}
                <div className="bg-[#7d0a0a]/10 rounded-lg p-4">
                  <h3 className="font-bold text-[#7d0a0a] mb-3 pb-2 border-b border-[#7d0a0a]/20">
                    Education and Occupation
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <p>
                      <span className="font-medium">Education:</span>{" "}
                      {singleUser.education?.join(", ") || "N/A"}
                    </p>
                    <p>
                      <span className="font-medium">Occupation:</span>{" "}
                      {singleUser.occupation || "N/A"}
                    </p>
                    <p>
                      <span className="font-medium">Monthly Income:</span> ₹
                      {singleUser.monthlyIncome?.toLocaleString("en-IN")}
                    </p>
                  </div>
                </div>

                {/* Social Background */}
                <div className="bg-[#7d0a0a]/10 rounded-lg p-4">
                  <h3 className="font-bold text-[#7d0a0a] mb-3 pb-2 border-b border-[#7d0a0a]/20">
                    Social Background
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <p>
                      <span className="font-medium">Caste:</span>{" "}
                      {`${singleUser.caste?.subCaste}, ${singleUser.caste?.caste}, ${singleUser.caste?.religion}`}
                    </p>
                    <p>
                      <span className="font-medium">Mother Tongue:</span>{" "}
                      {singleUser.motherTongue}
                    </p>
                    <p>
                      <span className="font-medium">Place of Birth:</span>{" "}
                      {singleUser.placeOfBirth || "Not Provided"}
                    </p>
                    <p>
                      <span className="font-medium">Manglik:</span>{" "}
                      {singleUser.manglik || "Not Provided"}
                    </p>
                    <p>
                      <span className="font-medium">Time of Birth:</span>{" "}
                      {singleUser.timeOfBirth || "Not Provided"}
                    </p>
                  </div>
                </div>
                {/* Family Details */}
                <div className="bg-[#7d0a0a]/10 rounded-lg p-4">
                  <h3 className="font-bold text-[#7d0a0a] mb-3 pb-2 border-b border-[#7d0a0a]/20">
                    Family Details
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <p>
                      <span className="font-medium">Brother(s):</span>{" "}
                      {singleUser.brothersCount}
                    </p>
                    <p>
                      <span className="font-medium">Sister(s):</span>{" "}
                      {singleUser.sisters}
                    </p>
                    <p>
                      <span className="font-medium">Mamkul:</span>{" "}
                      {singleUser.mamkul}
                    </p>
                  </div>
                </div>

                {/* Native Location */}
                <div className="bg-[#7d0a0a]/10 rounded-lg p-4">
                  <h3 className="font-bold text-[#7d0a0a] mb-3 pb-2 border-b border-[#7d0a0a]/20">
                    Native Location Details
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <p>
                      <span className="font-medium">Village:</span>{" "}
                      {singleUser.nativeVillage}
                    </p>
                    <p>
                      <span className="font-medium">City:</span>{" "}
                      {`${singleUser.nativeCity?.city}, ${singleUser.nativeCity?.state}, ${singleUser.nativeCity?.country}`}
                    </p>
                  </div>
                </div>

                {/* Work Location */}
                <div className="bg-[#7d0a0a]/10 rounded-lg p-4">
                  <h3 className="font-bold text-[#7d0a0a] mb-3 pb-2 border-b border-[#7d0a0a]/20">
                    Work Location
                  </h3>
                  <p>
                    <span className="font-medium">City:</span>{" "}
                    {singleUser.workLocation || "N/A"}
                  </p>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="bg-[#7d0a0a] text-white text-center py-4">
              <div className="flex justify-center space-x-1 mb-2">
                {[...Array(10)].map((_, i) => (
                  <div
                    key={i}
                    className="w-3 h-3 bg-blue-400 rounded-full"
                  ></div>
                ))}
              </div>
              <p className="text-xs">
                Browse - Login - Search - My Profile - Contact Us - Member
                Success Stories - Help
                <br />© 2019-2022 www.manomilan.com, All Rights Reserved.
              </p>
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
    } else {
      return (
        <>
          <div className="w-full flex justify-end">
            <button
              className="border border-red-500 bg-red-500 text-white px-3 py-1 rounded-md font-semibold flex items-center cursor-pointer"
              onClick={() => setBiodata(!biodata)}
            >
              <ArrowLeft size={16} />
              Back
            </button>
          </div>
          <div className="w-full flex items-center gap-5">
            <div className="md:w-1/3 w-full mt-8 bg-gradient-to-b from-[#7d0a0a] to-[#a01a1a] text-white rounded-lg p-6 mb-6">
              <div className="text-center mb-4">
                <div className="w-32 h-40 mx-auto mb-4 bg-gray-300 rounded-lg overflow-hidden">
                  <img
                    src={
                      singleUser.userPhotoStatus === "Approved"
                        ? `https://api.manomilan.com/upload/${singleUser.userPhotoOne}${updatePic ? `?t=${updatePic}` : ""}`
                        : "https://imgs.search.brave.com/rwE-hC6ESt3hBJZhImPkb-KvU26bLDKVe-OKv1y50-M/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pLnBp/bmltZy5jb20vb3Jp/Z2luYWxzLzE0LzQz/LzU1LzE0NDM1NWQ3/YjM2YzVmNjQ2NDM1/NDIzNzk4MjgxY2U5/LmpwZw"
                    }
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                </div>
                <h2 className="text-xl font-bold mb-2">
                  ID : {singleUser.UserId}
                </h2>
                <p className="text-white font-bold">
                  {(() => {
                    const dob = new Date(singleUser.dob);
                    const today = new Date();
                    let age = today.getFullYear() - dob.getFullYear();
                    if (
                      today.getMonth() < dob.getMonth() ||
                      (today.getMonth() === dob.getMonth() &&
                        today.getDate() < dob.getDate())
                    ) {
                      age--;
                    }
                    return `${age} years, ${cmToFeetInches(singleUser.height)}`;
                  })()}
                </p>
                <p className="text-white font-bold">
                  {`${singleUser.caste?.subCaste || "N/A"}, ${
                    singleUser.caste?.caste || "N/A"
                  }, ${singleUser.caste?.religion || "N/A"}`}
                </p>
                <p className="text-white font-bold">
                  {singleUser.sect || "N/A"}
                </p>
                <p className="text-white font-bold">
                  {singleUser.education?.length > 0
                    ? singleUser.education.join(", ")
                    : "N/A"}
                </p>
                <p className="text-white font-bold">
                  ₹{singleUser.monthlyIncome?.toLocaleString("en-IN") || "N/A"}
                </p>
                <p className="text-white font-bold">
                  Work Loc. : {singleUser.parentsCity || "N/A"}
                </p>
              </div>
            </div>
            
          </div>
          <div className="w-full flex gap-4">
            <button
              className="px-3 py-1 border border-[#7d0a0a] rounded-md cursor-pointer font-semibold"
              onClick={() => setDetailProfile(!detailProfile)}
            >
              View Details
            </button>
            
          </div>
        
        </>
      );
    }
  }
};

export default EditMemberTable;
