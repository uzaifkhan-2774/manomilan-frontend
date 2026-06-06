import React, { useEffect, useState } from "react";
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
import PackageAllot from "../FranchiseFrontend/PackageAllot";
import FranchiseDetails from "../UsersFrontend/FranchiseDetails";
import { toast } from "react-toastify";
import EditMemberTable from "../AdminFrontend/EditMemberTable";

const MemberTable = ({
  data = [],
  token,
  currFranchiseId,
  currentPage,
  pageSize,
  totalUsers,
  onPageChange,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const pathname = location.pathname;
  // Sample data for the table

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [updatePic, setUpdatePic] = useState(false);
  // const [currentPage, setCurrentPage] = useState(1);
  const [singleUser, setSingleUser] = useState({});
  const [biodata, setBiodata] = useState(false);
  const [detailProfile, setDetailProfile] = useState(false);
  const effectivePageSize = pageSize || 20;
  const effectiveCurrentPage = typeof currentPage === "number" ? currentPage : 0;
  const [updateProfile, setUpdateProfile] = useState(false);
  const [edit, setEdit] = useState(false);
  const [pageInput, setPageInput] = useState("");
  const goToPage = () => {
    const targetPage = Number(pageInput);
    if (
      Number.isInteger(targetPage) &&
      targetPage >= 1 &&
      targetPage <= totalPages
    ) {
      onPageChange?.(targetPage - 1);
    }
  };
  // Filter distributors based on search and status
  // Update the filteredDistributors logic
  const filteredDistributors = data.filter((distributor) => {
    // ----- ADDED: respect statusFilter (Active / Inactive) -----
    if (statusFilter === "Active" && !distributor.ActiveStatus) {
      return false;
    }
    if (statusFilter === "Inactive" && distributor.ActiveStatus) {
      return false;
    }
    if (statusFilter === "divorced" && distributor.maritalStatus) {
      return false;
    }
    // -----------------------------------------------------------

    // Format distributor's DOB to dd/mm/yyyy for display and comparison
    const formattedDob = distributor.dob
      ? new Date(distributor.dob).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        })
      : "";

    const formattedReg = distributor.createdAt
      ? new Date(distributor.createdAt).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        })
      : "";
    // Helper function to validate and parse dates
    const isValidDate = (dateStr) => {
      // Check for dd/mm/yyyy format
      if (/^\d{2}\/\d{2}\/\d{4}$/.test(dateStr)) {
        const [day, month, year] = dateStr.split("/");
        const date = new Date(year, month - 1, day);
        return date && date.getMonth() === month - 1; // Valid date check
      }
      return false;
    };

    // Search conditions
    const searchLower = searchTerm.trim().toLowerCase();
    const matchesSearch =
      distributor.loginEmail
        ?.toLowerCase()
        .trim()
        .includes(searchLower) ||
      distributor.firstName
        ?.toLowerCase()
        .trim()
        .includes(searchLower) ||
      distributor.UserId?.toString().trim().includes(searchTerm.trim()) ||
      distributor.loginNumber?.toString().trim().includes(searchTerm.trim()) ||
      distributor.mamkul?.toString().trim().includes(searchTerm.trim()) ||
      distributor.monthlyIncome
        ?.toString()
        .trim()
        .includes(searchTerm.trim()) ||
      distributor.mothersName?.toString().trim().includes(searchTerm.trim()) ||
      distributor.nativeVillage
        ?.toString()
        .trim()
        .toLowerCase()
        .includes(searchLower) ||
      distributor.parentsCity
        ?.toString()
        .trim()
        .toLowerCase()
        .includes(searchLower) ||
      distributor.parentsContact
        ?.toString()
        .trim()
        .includes(searchTerm.trim()) ||
      distributor.parentsResidence
        ?.toString()
        .trim()
        .includes(searchTerm.trim()) ||
      distributor.placeOfBirth?.toString().trim().includes(searchTerm.trim()) ||
      distributor.workLocation?.toString().trim().includes(searchTerm.trim()) ||
      distributor.motherTongue
        ?.toString()
        .trim()
        .toLowerCase()
        .includes(searchLower) ||
      distributor.franchiseUnder
        ?.toLowerCase()
        .trim()
        .includes(searchLower) ||
      (isValidDate(searchTerm) && formattedDob === searchTerm) ||
      (searchTerm.length >= 2 && formattedDob.includes(searchTerm)) ||
      (isValidDate(searchTerm) && formattedReg === searchTerm) ||
      (searchTerm.length >= 2 && formattedReg.includes(searchTerm));
    return matchesSearch;
  });

  // Pagination
  const totalPages = Math.ceil(filteredDistributors.length / effectivePageSize);
  const startIndex = effectiveCurrentPage * effectivePageSize;
  const paginatedDistributors = filteredDistributors.slice(
    startIndex,
    startIndex + effectivePageSize,
  );
  const [userId, setUserId] = useState(null);

  function cmToFeetInches(cm) {
  const totalInches = cm / 2.54;

  let feet = Math.floor(totalInches / 12);
  let inches = Math.round(totalInches % 12);

  // Handle 12 inches overflow
  if (inches === 12) {
    feet += 1;
    inches = 0;
  }

  return `${feet}' ${inches}"`;
}

  const handleView = async (id) => {
    // Fetch allotted packages first
    await getAllotedPackages(id);

    // Fetch single user details
    let endpoint;
    if (pathname.includes("/admin")) {
      endpoint = `http://127.0.0.1:8000/api/admin/get-single-user/${id}`;
    } else {
      endpoint = `http://127.0.0.1:8000/api/franchise/get-single-user/${id}`;
    }
    try {
      const response = await axios.get(endpoint, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(response.data);
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
        "http://127.0.0.1:8000/api/admin/update-userpfp",
        {
          userId: singleUser._id,
          userStatus: "Approved",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
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
        "http://127.0.0.1:8000/api/admin/update-userpfp",
        {
          userId: singleUser._id,
          userStatus: "Rejected",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
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
    const result = confirm("Do you really want to inactivate member ?");
    if (result) {
      try {
        const response = await axios.post(
          "http://127.0.0.1:8000/api/franchise/inactivate-user",
          {
            userId: singleUser._id,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        if (response.data.status) {
          toast.success(response.data.message);
        }
        console.log(response.data);
      } catch (error) {
        console.log(error);
      }
    }
  };
  const handleEditFrDetails = (distributor) => {
    setUserId(distributor);
    setEdit(true);
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
        `http://127.0.0.1:8000/api/franchise/get-packages/${currFranchiseId}`,
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
      endpoint = "http://127.0.0.1:8000/api/franchise/allot-main-addOnpackage";
    } else {
      endpoint = "http://127.0.0.1:8000/api/franchise/allot-vip-package";
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
        `http://127.0.0.1:8000/api/user/get-packages/${data}`,
      );
      console.log(response.data);
      if (response.data?.status && response.data?.userPackages) {
        // Check if any package has mainPackageId
        const hasMainPackage = response.data.userPackages.some(
          (pkg) => pkg.franchisePackage?.mainPackageId,
        );

        // Sort packages by createdAt to get the latest package
        const latestPackage =
          response.data.userPackages.sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
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
                    {/* <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" /> */}
                    <div className="flex flex-wrap gap-4 items-center">
                      {[
                        { label: "ALL", value: "All" },
                        { label: "Active", value: "Active" },
                        { label: "Inactive", value: "Inactive" },
                        { label: "Incomplete", value: "Pending" },
                        { label: "Divorced", value: "Divorce" },
                        { label: "Widowed", value: "widowed" },
                      ].map((option) => (
                        <label
                          key={option.value}
                          className={`flex items-center gap-2 px-3 py-2 border rounded-lg cursor-pointer transition-all
        ${
          statusFilter === option.value
            ? "border-red-500 bg-red-50"
            : "border-gray-300 hover:bg-gray-100"
        }`}
                        >
                          <input
                            type="radio"
                            name="statusFilter"
                            value={option.value}
                            checked={statusFilter === option.value}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="text-red-500 focus:ring-red-500"
                          />
                          <span className="text-sm font-medium text-gray-700">
                            {option.label}
                          </span>
                        </label>
                      ))}
                    </div>
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
                        Actions
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
                        Franchisee
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">
                        Photo Status
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
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => {
                                handleView(distributor?._id);
                                setBiodata(!biodata);
                              }}
                              className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white hover:opacity-90 transition-opacity"
                              style={{ backgroundColor: "#7d0a0a" }}
                            >
                              <Eye className="w-3 h-3 mr-1" />
                              View
                            </button>
                            {pathname.includes("/franchise" || "/admin") ? (
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
                            ) : (
                              " "
                            )}
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
                              distributor.userPhotoStatus,
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
                              },
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={getStatusBadge(
                              distributor.ActiveStatus ? "Active" : "Inactive",
                            )}
                          >
                            {distributor.ActiveStatus ? "Active" : "Inactive"}
                          </span>
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
                    Showing {filteredDistributors.length === 0 ? 0 : startIndex + 1} to{" "}
                    {Math.min(
                      startIndex + effectivePageSize,
                      filteredDistributors.length,
                    )}{" "}
                    of {filteredDistributors.length} results
                  </div>
                  {/* Pagination Controls */}
                  <div className="mt-4 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
                    <div className="flex items-center gap-2">
                      <button
                        disabled={effectiveCurrentPage === 0}
                        onClick={() => onPageChange?.(effectiveCurrentPage - 1)}
                        className="px-3 py-1 border rounded disabled:opacity-50"
                      >
                        Prev
                      </button>
                      <span className="px-3 py-1">
                        {effectiveCurrentPage + 1} / {totalPages || 1}
                      </span>
                      <button
                        disabled={effectiveCurrentPage >= totalPages - 1}
                        onClick={() => onPageChange?.(effectiveCurrentPage + 1)}
                        className="px-3 py-1 border rounded disabled:opacity-50"
                      >
                        Next
                      </button>
                    </div>
                    <div className="flex items-center gap-2">
                      <label className="text-sm text-gray-700">Go to page</label>
                      <input
                        type="number"
                        min="1"
                        max={totalPages || 1}
                        value={pageInput}
                        onChange={(e) => setPageInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") goToPage();
                        }}
                        className="w-20 px-2 py-1 border rounded"
                      />
                      <button
                        type="button"
                        onClick={goToPage}
                        className="px-3 py-1 border rounded bg-red-600 text-white hover:bg-red-700"
                      >
                        Go
                      </button>
                    </div>
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
      <FranchiseDetails setEdit={setEdit} userId={userId} />
    );
  } else {
    if (detailProfile) {
      return (
        <EditMemberTable
          userId={singleUser._id}
          token={token}
          onClose={() => setDetailProfile(false)}
        />
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
                        ? `http://127.0.0.1:8000/upload/${singleUser.profilePic}${updatePic ? `?t=${updatePic}` : ""}`
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
            {location.pathname.includes("franchise") ? (
              <div className="w-[80%] rounded-md p-4 space-y-4">
                <h1 className="font-semibold text-black">Available Packages</h1>
                <div className="flex flex-wrap gap-2">
                  {allotingPackages.map((pack) => {
                    const isMainPackage = !!pack?.mainPackageId;
                    // Disable all main packages if a main package is already allotted
                    const isAlreadyAllottedMain =
                      allotedPackages?.mainPackageId && isMainPackage;
                    const isHighlighted = allotedPackages?._id === pack._id;

                    return (
                      <div
                        key={pack._id}
                        className={`
                w-1/2 h-1/2 p-4 rounded-sm
                ${
                  isAlreadyAllottedMain
                    ? "pointer-events-none bg-gray-300 opacity-50"
                    : "bg-red-300"
                }
                ${isHighlighted ? "border-4 border-green-500" : ""}
              `}
                      >
                        <p className="font-semibold text-sm">
                          {isMainPackage
                            ? "Main Package"
                            : pack.vipPackage
                              ? "VIP Package"
                              : "Add-on Package"}
                        </p>

                        <h1>
                          Package name:{" "}
                          <span className="font-semibold">
                            {pack?.mainPackageId?.packageName ||
                              pack?.vipPackage?.packageName}
                          </span>
                        </h1>

                        <p>
                          Number of Addresses:{" "}
                          <span>
                            {pack?.mainPackageId?.numberOfAddresses ||
                              pack?.vipPackage?.numberOfAddresses}
                          </span>
                        </p>

                        <p>
                          Member Cost:{" "}
                          <span>
                            {pack?.mainPackageId?.memberCost ||
                              pack?.vipPackage?.memberCost}
                          </span>
                        </p>

                        <div className="w-full flex justify-end">
                          <button
                            className={`px-3 py-1 rounded-md ${
                              isAlreadyAllottedMain
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-red-400 cursor-pointer"
                            }`}
                            onClick={() => {
                              if (isAlreadyAllottedMain) {
                                toast.error(
                                  "Main Package already allotted. Cannot allot again.",
                                );
                                return;
                              }
                              allotPackageToUser(pack);
                            }}
                            disabled={isAlreadyAllottedMain}
                          >
                            Allot Package
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : null}
          </div>
          <div className="w-full flex gap-4">
            <button
              className="px-3 py-1 border border-[#7d0a0a] rounded-md cursor-pointer font-semibold"
              onClick={() => setDetailProfile(!detailProfile)}
            >
              Edit Member Details
            </button>
            {pathname.includes("/admin") ? (
              <button
                className="px-3 py-1 border border-[#7d0a0a] rounded-md cursor-pointer font-semibold"
                onClick={() => setUpdateProfile(!updateProfile)}
              >
                Update Profile Pic
              </button>
            ) : null}
            {pathname.includes("/franchise") ? (
              <>
                <button className="px-3 py-1 border border-[#7d0a0a] rounded-md cursor-pointer font-semibold">
                  Subscribed Members
                </button>
                <button
                  disabled={!singleUser.ActiveStatus}
                  className={`px-3 py-1 border border-[#7d0a0a] rounded-md cursor-pointer font-semibold`}
                  onClick={inactiveUser}
                >
                  Inactivate
                </button>
              </>
            ) : null}
          </div>
          {updateProfile ? (
            <div className="w-full h-svh bg-[rgba(0,0,0,0.5)] fixed top-0 left-0 flex justify-center items-center">
              <div className="w-full  h-1/2 md:w-1/2 md:h-1/2 bg-white rounded-md shadow-md flex flex-col gap-3 justify-center items-center">
                <div className="w-[250px] h-[250px] bg-red-300 rounded-md">
                  <img
                    src={`http://127.0.0.1:8000/upload/${
                      singleUser.profilePic || singleUser.userPhotoOne || ""
                    }`}
                    alt=""
                  />
                </div>
                <div className="flex gap-4">
                  <button
                    className="border border-red-500 px-2 py-1 rounded-md bg-red-500 text-white cursor-pointer"
                    onClick={rejectProfilePic}
                  >
                    Reject
                  </button>
                  <button
                    className="border border-red-500 px-2 py-1 rounded-md bg-red-500 text-white cursor-pointer"
                    onClick={() => setUpdateProfile(!updateProfile)}
                  >
                    Close
                  </button>
                  <button
                    className="border border-green-500 px-2 py-1 rounded-md bg-green-500 text-white cursor-pointer"
                    onClick={() => {
                      updateProfilePic();
                    }}
                  >
                    Accept
                  </button>
                </div>
              </div>
            </div>
          ) : null}
        </>
      );
    }
  }
};

export default MemberTable;
