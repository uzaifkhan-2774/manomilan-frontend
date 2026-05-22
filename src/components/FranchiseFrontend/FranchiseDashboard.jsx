import React, { useEffect, useState } from "react";
import {
  Home,
  Package,
  User,
  Heart,
  Settings,
  Lock,
  Mail,
  MessageSquare,
  Inbox,
  Send,
  Edit3,
  Users2,
  Eye,
  VideoIcon,
  File,
  Pencil,
  Shield,
  Menu,
  X,
  AlertCircle,
  ChevronDown,
  CheckCircle
} from "lucide-react";
import axios from "axios";
import { Suspense } from "react";
// import MemberTable from "../CommonComponents/MemberTable";
const MemberTable = React.lazy(() => import("../CommonComponents/MemberTable"));
import MemberRegistration from "./MemberRegistration";
import { toast } from "react-toastify";
import ReportsUserForFran from "./ReportsUserForFran";
const PasswordChangeComponent = ({ currFranchiseId }) => {
  const [formData, setFormData] = useState({
    otp: "",
    newPassword: "",
  });
  console.log(currFranchiseId)
  const [showPassword, setShowPassword] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
    if (successMessage) setSuccessMessage("");
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.otp) newErrors.otp = "OTP is required";
    if (!formData.newPassword || formData.newPassword.length < 6) {
      newErrors.newPassword = "Password must be at least 8 characters long";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSendOtp = async () => {
    try {
      // Simulate OTP sending
      const response = await axios.post(
        "http://localhost:8000/api/franchise/get-otp",
        { id: currFranchiseId }
      );
      if (response.data.status) {
        toast.success(response.data.message);
        return;
      }
      toast.error(response.data.message);
    } catch (err) {
      alert("Failed to send OTP");
    }
  };

  const handleSubmit = async (e,id) => {
    e.preventDefault();
    if (!validate()) return;
    setIsLoading(true);
    const payload={
          id: currFranchiseId,
          otp: formData.otp,
          newPassword: Number(formData.newPassword),
        }
        console.log(payload)
    try {
      const response = await axios.post(
        "http://localhost:8000/api/franchise/verify-otp-reset-password",
        {
          id: id || currFranchiseId,
          otp: formData.otp,
          newPassword: Number(formData.newPassword),
        }
      );
      console.log(response.data)
      if (response.data?.status) {
        toast.success(response.data.message);
        setSuccessMessage("Password changed successfully!");
        setFormData({ otp: "", newPassword: "" });
        setIsLoading(false)
        return;
      }
      toast.error(response.data.message);
    } catch (err) {
      setErrors({ submit: "Failed to change password. Try again." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-red-900 to-red-700 p-6 text-center">
            <Shield className="w-12 h-12 text-white mx-auto mb-3" />
            <h2 className="text-2xl font-bold text-white">Reset Password</h2>
            <p className="text-red-100 mt-2">Secure your account</p>
          </div>

          <div className="p-6">
            {successMessage && (
              <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="text-green-700">{successMessage}</span>
              </div>
            )}

            {errors.submit && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2">
                <AlertCircle className="w-5 h-5 text-red-600" />
                <span className="text-red-700">{errors.submit}</span>
              </div>
            )}

            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <button
                  onClick={handleSendOtp}
                  className="px-4 py-2 bg-red-900 text-white rounded-lg hover:bg-red-800 flex items-center space-x-2"
                >
                  <Send size={16} />
                  <span>Send OTP</span>
                </button>
              </div>

              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    OTP
                  </label>
                  <input
                    type="text"
                    value={formData.otp}
                    onChange={(e) => handleInputChange("otp", e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none ${
                      errors.otp
                        ? "border-red-300 focus:ring-red-500"
                        : "border-gray-300 focus:ring-red-900"
                    }`}
                    placeholder="Enter OTP"
                  />
                  {errors.otp && (
                    <p className="mt-1 text-sm text-red-600">{errors.otp}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    New Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={formData.newPassword}
                      onChange={(e) =>
                        handleInputChange("newPassword", e.target.value)
                      }
                      className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:outline-none ${
                        errors.newPassword
                          ? "border-red-300 focus:ring-red-500"
                          : "border-gray-300 focus:ring-red-900"
                      }`}
                      placeholder="Enter new password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  {errors.newPassword && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.newPassword}
                    </p>
                  )}
                </div>

                <button
                  onClick={(e)=>handleSubmit(e,currFranchiseId)}
                  disabled={isLoading}
                  className="w-full py-3 bg-red-900 text-white rounded-lg hover:bg-red-800 disabled:bg-red-400 disabled:cursor-not-allowed flex justify-center items-center space-x-2"
                >
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <>
                      <Shield size={18} />
                      <span>Change Password</span>
                    </>
                  )}
                </button>
              </>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const PackageTable = ({ data }) => {
  console.log(data)
  // Combine all package types with a label
  const allPackages = [
    ...(data?.mainPackages?.map((p) => ({ ...p, type: "Main Package" })) || []),
    ...(data?.addOnPackages?.map((p) => ({ ...p, type: "Add-On Package" })) ||
      []),
    ...(data?.vipPackages?.map((p) => ({ ...p, type: "VIP Package" })) || []),
    ...(data?.freepackages?.map((p) => ({ ...p, type: "Free Package" })) || []),
  ];

  return (
    <div className="overflow-scroll md:overflow-hidden">
      <table className="w-full divide-y divide-gray-200">
        <thead style={{ backgroundColor: "#7d0a0a" }}>
          <tr className="text-white text-sm">
            <th className="px-4 py-2 text-left text-md font-medium text-white tracking-wider">
              Package ID
            </th>
            <th className="px-4 py-2 text-left text-md font-medium text-white tracking-wider">
              Address
            </th>
            <th className="px-4 py-2 text-left text-md font-medium text-white tracking-wider">
              Package Type
            </th>
            <th className="px-4 py-2 text-left text-md font-medium text-white tracking-wider">
              MembCost
            </th>
            <th className="px-4 py-2 text-left text-md font-medium text-white tracking-wider">
              Franchise Share
            </th>
            <th className="px-4 py-2 text-left text-md font-medium text-white tracking-wider">
              Status
            </th>
            <th className="px-4 py-2 text-left text-md font-medium text-white tracking-wider">
              Date of Creation
            </th>
          </tr>
        </thead>

        <tbody className="bg-white divide-y divide-gray-200">
          {allPackages.length > 0 ? (
            allPackages.map((pkg, index) => (
              <tr key={pkg._id || index}>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 border-r border-gray-200">
                  {pkg.packageId ?? "-"}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 border-r border-gray-200">
                  {pkg.numberOfAddresses || pkg.NumOfFreeAddress || "-"}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 border-r border-gray-200">
                  {pkg.type ?? "-"}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 border-r border-gray-200">
                  {pkg.memberCost ?? "-"}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 border-r border-gray-200">
                  {pkg.franchiseShare ?? "-"}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 border-r border-gray-200">
                  {pkg.status ?? "-"}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 border-r border-gray-200">
                  {pkg.createdAt
                    ? new Date(pkg.createdAt).toLocaleDateString("en-GB")
                    : "-"}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan="9"
                className="text-center text-gray-500 py-4 text-sm"
              >
                No packages found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

const FranchiseDashboard = () => {
  const token = localStorage.getItem("franchiseToken");
  const [activeSection, setActiveSection] = useState("home");
  const [expandedSections, setExpandedSections] = useState({
    account: true,
    advertiser: true,
    members: true,
    settings: true,
    services: true,
    messageBox: true,
    reports: true,
  });
  const [currFranchiseId, setCurrFranchiseId] = useState(null);
  const [members, setMembers] = useState([]);
  const [messageDistributor, setMessageDistributor] = useState([]);
  const [admin, setAdmin] = useState({});
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedRecipients, setSelectedRecipients] = useState([]);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [message, setMessage] = useState("");
  const [getMessage, setGetMessage] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [msgId, setMsgId] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [activeMessage, setActiveMessage] = useState(null);
  const [userInbox, setUserInbox] = useState([]);
  const [CurrFranchise, setCurrFranchise] = useState({});
  const [balanceEntries, setBalanceEntries] = useState([]);
  const [modalData, setModalData] = useState({
    to: "john.doe@example.com",
    message:
      "Hello! This is a sample message to demonstrate the modal functionality. You can put longer messages here and they will display properly with proper word wrapping and spacing.\n\nThis supports multi-line messages as well.",
    time: "2025-01-28 14:30:45",
  });
  const [getSentMessages, setGetSentMessages] = useState([]);
  function formatDate(isoDate) {
    const date = new Date(isoDate);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }
  // sidebar 
  const [sidebarOpen, setSidebarOpen] = useState(false);
       const closeSidebar = () => {
      setSidebarOpen(false);
    };
    // get all packages table
    const [tableData,setTableData]=useState(null)
    const getPackagesLog=async()=>{
      try {
        const response=await axios.get("http://localhost:8000/api/admin/get-all-packages")
        if(response.data.status){
          setTableData(response.data)
        }
      } catch (error) {
        console.log(error)
      }
    } 
    useEffect(()=>{
  getPackagesLog()
    },[])
  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isModalOpen]);

  // Handle Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isModalOpen) {
        hideModal();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isModalOpen]);
  const showModal = (to, message, time) => {
    if (to || message || time) {
      setModalData({
        to: to || modalData.to,
        message: message || modalData.message,
        time: time || modalData.time,
      });
    }
    setIsModalOpen(true);
  };
  const hideModal = () => {
    setIsModalOpen(false);
  };
  // api calling
  const getAdminFranMemForMsg = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/api/franchise/get-distributor-admin",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const res = response.data;
      if (response.data?.status) {
        setMessageDistributor(res.distributor[0]);
        setAdmin(res.admin[0]);
        setMembers(res?.users);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleMemberToggle = (member) => {
    setSelectedMembers((prev) => {
      const isSelected = prev.some((selected) => selected._id === member._id);
      if (isSelected) {
        return prev.filter((selected) => selected._id !== member._id);
      } else {
        return [...prev, member];
      }
    });
  };

  const handleRecipientToggle = (recipient) => {
    setSelectedRecipients((prev) => {
      const isSelected = prev.some((r) => r._id === recipient._id);
      if (isSelected) {
        return prev.filter((r) => r._id !== recipient._id);
      } else {
        return [...prev, recipient];
      }
    });
  };

  const isRecipientSelected = (recipient) => {
    return selectedRecipients.some((r) => r._id === recipient._id);
  };

  const isMemberSelected = (member) => {
    return selectedMembers.some((selected) => selected._id === member._id);
  };

  const handleSelectAllToggle = () => {
    if (selectedMembers.length === members.length) {
      // Deselect all
      setSelectedMembers([]);
    } else {
      // Select all
      setSelectedMembers(members);
    }
  };

  const sendMessage = async () => {
    const selected = selectedMembers.map((member) => member._id);
    const distAndAdmin = selectedRecipients.map((rec) => rec._id);
    const receiverIds = [...selected, ...distAndAdmin];
    try {
      const res = await axios.post(
        "http://localhost:8000/api/franchise/message/send",
        {
          receiverIds,
          message,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (res.data?.status) {
        toast.success(res.data?.message);
        setSelectedRecipients([]);
        setSelectedMembers([]);
        setMessage("");
        getFranchiseMsg();
        return;
      }
      toast.error(res.data?.message);
      console.log(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const getFranchiseMsg = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/api/franchise/message/replies",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data?.status) {
        setUserInbox(response.data?.data);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const getSentMessagesForFranchise = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/api/franchise/message/get-sendMessages",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data?.status) {
        setGetSentMessages(response.data?.data);
      }
    } catch (error) {
      console.log(error);
    }
  };
  function timeAgo(date) {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);

    let interval = Math.floor(seconds / 31536000);
    if (interval >= 1)
      return interval + " year" + (interval > 1 ? "s" : "") + " ago";

    interval = Math.floor(seconds / 2592000);
    if (interval >= 1)
      return interval + " month" + (interval > 1 ? "s" : "") + " ago";

    interval = Math.floor(seconds / 86400);
    if (interval >= 1)
      return interval + " day" + (interval > 1 ? "s" : "") + " ago";

    interval = Math.floor(seconds / 3600);
    if (interval >= 1)
      return interval + " hour" + (interval > 1 ? "s" : "") + " ago";

    interval = Math.floor(seconds / 60);
    if (interval >= 1)
      return interval + " minute" + (interval > 1 ? "s" : "") + " ago";

    return "Just now";
  }

  const getCurrFranchise = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/api/franchise/get-current-franchise",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data?.status) {
        setCurrFranchise(response.data?.franchise);
        setCurrFranchiseId(response.data?.franchise._id);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getCurrFranchise();
  }, []);

  useEffect(() => {
    getFranchiseeLog();
  }, [CurrFranchise]);
  // points api
  const getFranchiseeLog = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8000/api/franchise/get/franchiseLogs/${CurrFranchise._id}`
      );
      if (response.data?.status) {
        setBalanceEntries(response.data?.franchiseLogs);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAdminFranMemForMsg();
    getFranchiseMsg();
    getSentMessagesForFranchise();
    const interval = setInterval(() => {
      getAdminFranMemForMsg();
      getFranchiseMsg();
      getSentMessagesForFranchise();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleOpenModal = (message) => {
    setActiveMessage(message);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setActiveMessage(null);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && modalVisible) {
        handleCloseModal();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [modalVisible]);

  useEffect(() => {
    document.body.style.overflow = modalVisible ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [modalVisible]);

  const sidebarItems = {
    account: {
      title: "Account",
      icon: User,
      items: [
        { id: "home", label: "Home", icon: Home },
        { id: "profile", label: "Profile", icon: User },
      ],
    },
    advertiser: {
      title: "Advertisers",
      icon: Users2,
      items: [
        { id: "createAdvertiser", label: "Create Advertiser", icon: User },
        { id: "viewAdvertiser", label: "View Advertiser", icon: Eye },
        { id: "packages", label: "Packages", icon: Package },
      ],
    },
    members: {
      title: "Members",
      icon: Users2,
      items: [
        { id: "createMember", label: "Create Member", icon: User },
        { id: "viewMember", label: "View Member", icon: Eye },
        { id: "MemberPackages", label: "Packages", icon: Package },
      ],
    },
    settings: {
      title: "Settings",
      icon: Settings,
      items: [
        { id: "changePassword", label: "Change Password", icon: Lock },
        { id: "changeEmail", label: "Change Email", icon: Mail },
      ],
    },
    services: {
      title: "Services",
      icon: Heart,
      items: [{ id: "advertisement", label: "Advertisement", icon: VideoIcon }],
    },
    messageBox: {
      title: "Message Box",
      icon: MessageSquare,
      items: [
        { id: "inbox", label: `Inbox ( ${userInbox.length} )`, icon: Inbox },
        { id: "sent", label: "Sent", icon: Send },
        { id: "compose", label: "Compose", icon: Edit3 },
      ],
    },
    reports: {
      title: "Reports",
      icon: File,
      items: [
        { id: "memberReports", label: "Member", icon: User },
        { id: "advertiser", label: "Advertiser", icon: User },
      ],
    },
  };

  // change email
  const [updateEmail, setUpdateEmail] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  const changeEmail = async (id) => {
    try {
      const response = await axios.put(
        "http://localhost:8000/api/franchise/change-franchise-email",
        {
          distributorId: currFranchiseId._id || id,
          newEmail: newEmail,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data.status) {
        toast.success(response.data.message);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleEmailUpdate = () => {
    if (updateEmail) {
      if (!validateEmail(newEmail)) {
        toast.warn("Please enter a valid email address");
        return;
      }
      changeEmail(currFranchiseId);
    } else {
      setUpdateEmail(true);
    }
  };

  // profile edit section
    const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState();
  useEffect(() => {
  if (CurrFranchise) {
    setEditedData({
      ownerName: CurrFranchise.ownerName || '',
      franchiseName: CurrFranchise.franchiseName || '',
      distributorUnder: CurrFranchise.distributorUnder || '',
      mobileNumber: CurrFranchise.mobileNumber || '',
      alternateNumber: CurrFranchise.alternateNumber || '',
      email: CurrFranchise.email || '',
      panNumber: CurrFranchise.panNumber || '',
      adharNumber: CurrFranchise.adharNumber || '',
      address: CurrFranchise.address || '',
      location: CurrFranchise.location || '',
    });
  }
}, [CurrFranchise]); 
const handleEditToggle = () => {
  setIsEditing(!isEditing);
  if (!isEditing) {
    setEditedData({
      ownerName: CurrFranchise.ownerName || '',
      franchiseName: CurrFranchise.franchiseName || '',
      distributorUnder: CurrFranchise.distributorUnder || '',
      mobileNumber: CurrFranchise.mobileNumber || '',
      alternateNumber: CurrFranchise.alternateNumber || '',
      email: CurrFranchise.email || '',
      panNumber: CurrFranchise.panNumber || '',
      adharNumber: CurrFranchise.adharNumber || '',
      address: CurrFranchise.address || '',
      location: CurrFranchise.location || '',
    });
  }
};
const handleChange = (e) => {
  const { name, value } = e.target;
  setEditedData(prev => ({
    ...prev,
    [name]: value
  }));
};
const handleSave = async () => {
  try {
    const response = await axios.put(
      `http://localhost:8000/api/franchise/update/${CurrFranchise._id}`,
      editedData, // ✅ send the update data directly
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log(response.data);

    if (response.data.status) {
      setCurrFranchise((prev) => ({
        ...prev,
        ...editedData,
      }));
      setIsEditing(false);
      toast.success("Profile updated successfully!");
    } else {
      toast.error(response.data.message || "Failed to update profile");
    }
  } catch (error) {
    console.error("Error updating profile:", error);
    toast.error("Something went wrong while updating profile");
  }
};

const handleCancel = () => {
  setIsEditing(false);
  setEditedData({
    ownerName: CurrFranchise.ownerName || '',
    franchiseName: CurrFranchise.franchiseName || '',
    distributorUnder: CurrFranchise.distributorUnder || '',
    mobileNumber: CurrFranchise.mobileNumber || '',
    alternateNumber: CurrFranchise.alternateNumber || '',
    email: CurrFranchise.email || '',
    panNumber: CurrFranchise.panNumber || '',
    adharNumber: CurrFranchise.adharNumber || '',
    address: CurrFranchise.address || '',
    location: CurrFranchise.location || '',
  });
};
  const renderContent = () => {
    const contentMap = {
      home: {
        title: "Dashboard Home",
        content: (
          <>
            <div className="space-y-6">
              <h1 className="text-2xl font-semibold">Welcome Back</h1>
              <div className="w-full flex flex-col gap-4 rounded-md p-2 border border-gray-500">
                <div className="flex gap-3">
                  <p className="font-semibold">Account Balance : </p>
                  <p className="text-gray-500 font-semibold">
                    {CurrFranchise.points}
                  </p>
                </div>
                {/* <div className="flex gap-3">
                  <p className="font-semibold">Member Registered By Me : </p>
                  <p className="text-gray-500 font-semibold">1</p>
                </div>
                <div className="flex gap-3">
                  <p className="font-semibold">
                    Advertisers Registered By Me :{" "}
                  </p>
                  <p className="text-gray-500 font-semibold">1</p>
                </div> */}
                <div className="flex gap-3">
                  <p className="font-semibold">
                    Number of Free package subscribed member :{" "}
                  </p>
                  <p className="text-gray-500 font-semibold">1</p>
                </div>
                <div className="flex gap-3">
                  <p className="font-semibold">
                    Number of Main package subscribed member :{" "}
                  </p>
                  <p className="text-gray-500 font-semibold">1</p>
                </div>
                <div className="flex gap-3">
                  <p className="font-semibold">
                    Number of Add-on package subscribed member :{" "}
                  </p>
                  <p className="text-gray-500 font-semibold">1</p>
                </div>
                <div className="flex gap-3">
                  <p className="font-semibold">
                    Number of VIP package subscribed member :{" "}
                  </p>
                  <p className="text-gray-500 font-semibold">1</p>
                </div>
              </div>
              <table className="min-w-full divide-y divide-gray-200">
                <thead style={{ backgroundColor: "#7d0a0a" }}>
                  <tr className="text-white font-semibold">
                    <td>Date</td>
                    <td>Points</td>
                    <td>By</td>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {balanceEntries.length > 0 ? (
                    balanceEntries.map((entry, index) => (
                      <tr className="text-black" key={entry._id}>
                        <td>{formatDate(entry.createdAt)}</td>
                        <td
                          className={`${
                            entry.points > 0 ? "text-green-600" : "text-red-500"
                          }`}
                        >
                          {entry.points}
                        </td>
                        <td>{entry.By}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="7"
                        className="px-6 py-8 text-center text-gray-500"
                      >
                        No data
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </>
        ),
      },
      changePassword: {
        title: "Change Password",
        content: <PasswordChangeComponent currFranchiseId={CurrFranchise._id} />,
      },
      memberReports:{
        title:"Member Reports",
        content:(
          <ReportsUserForFran tokenProp={token}/>
        )
      },
      changeEmail: {
        title: "Change Email",
        content: (
          <div className="w-full gap-5 flex flex-col justify-start items-start">
            <div>
              <div>
                <h2 className="font-semibold text-black">Existing Email:</h2>
                <p className="border-gray-400 border-1 rounded-md p-2 my-3">
                  {CurrFranchise?.email}
                </p>
              </div>
              {updateEmail && (
                <>
                  <h1 className="font-semibold">New Email:</h1>
                  <input
                    type="email"
                    className="p-2 w-full border font border-gray-300 rounded-md"
                    onChange={(e) => setNewEmail(e.target.value)}
                    value={newEmail}
                    placeholder="Enter new email"
                  />
                </>
              )}
            </div>

            <div className="w-1/2 flex justify-end">
              <button
                className="py-2 px-3 font-semibold bg-red-600 text-white rounded-md"
                onClick={handleEmailUpdate}
              >
                Update Email
              </button>
            </div>
          </div>
        ),
      },
      MemberPackages:{
        title:"Member Packages",
        content:(
          //   <div className="overflow-scroll md:overflow-hidden">
          //   <table className="w-full divide-y  divide-gray-200">
          //     <thead style={{ backgroundColor: "#7d0a0a" }}>
          //       <tr className="text-white text-sm">
          //         <th className="px-4 py-2 text-left text-md font-medium text-white tracking-wider">
          //           Package ID
          //         </th>
          //         <th className="px-4 py-2 text-left text-md font-medium text-white tracking-wider">
          //           Address
          //         </th>
          //         <th className="px-4 py-2 text-left text-md font-medium text-white tracking-wider">
          //           Package Type
          //         </th>
          //         <th className="px-4 py-2 text-left text-md font-medium text-white tracking-wider">
          //           MembCost
          //         </th>
          //         <th className="px-4 py-2 text-left text-md font-medium text-white tracking-wider">
          //           DistShare
          //         </th>
          //         <th className="px-4 py-2 text-left text-md font-medium text-white tracking-wider">
          //           Franchise
          //         </th>
          //         <th className="px-4 py-2 text-left text-md font-medium text-white tracking-wider">
          //           Franchise Share
          //         </th>
          //         <th className="px-4 py-2 text-left text-md font-medium text-white tracking-wider">
          //           Status
          //         </th>
          //         <th className="px-4 py-2 text-left text-md font-medium text-white tracking-wider">
          //           Date of Creation
          //         </th>
          //       </tr>
          //     </thead>
          //     <tbody className="bg-white divide-y divide-gray-200">
          //       <tr>
          //         <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 border-r border-gray-200">
          //           1202
          //         </td>
          //         <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 border-r border-gray-200">
          //           5
          //         </td>
          //         <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 border-r border-gray-200">
          //           Main Package
          //         </td>
          //         <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 border-r border-gray-200">
          //           1200
          //         </td>
          //         <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 border-r border-gray-200">
          //           120
          //         </td>
          //         <td className="capitalize px-4 py-4 whitespace-nowrap text-sm text-gray-900 border-r border-gray-200">
          //           manomilan
          //         </td>
          //         <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 border-r border-gray-200">
          //           1200
          //         </td>
          //         <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 border-r border-gray-200">
          //           Active
          //         </td>
          //         <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 border-r border-gray-200">
          //           12/02/2025
          //         </td>
          //       </tr>
          //     </tbody>
          //   </table>
          // </div>
          <PackageTable data={tableData}/>
        )
      },
      subscriptions: {
        title: "My Subscriptions",
        content: (
          <div className="space-y-6">
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold mb-4">
                Active Subscriptions
              </h3>
              <div className="space-y-4">
                <div className="border rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-semibold">Premium Plan</h4>
                      <p className="text-gray-600">Expires: Dec 31, 2025</p>
                    </div>
                    <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                      Active
                    </span>
                  </div>
                </div>
                <div className="border rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-semibold">Premium Plus</h4>
                      <p className="text-gray-600">Expires: Jan 15, 2026</p>
                    </div>
                    <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                      Active
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ),
      },
      subscribedBy: {
        title: "Subscribed By Others",
        content: (
          <div className="space-y-6">
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold mb-4">
                Users Who Subscribed to Your Profile
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border rounded-lg p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                      A
                    </div>
                    <div>
                      <h4 className="font-semibold">Amit Kumar</h4>
                      <p className="text-gray-600 text-sm">Premium Member</p>
                    </div>
                  </div>
                </div>
                <div className="border rounded-lg p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                      P
                    </div>
                    <div>
                      <h4 className="font-semibold">Priya Sharma</h4>
                      <p className="text-gray-600 text-sm">Gold Member</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ),
      },
      packages: {
        title: "Available Packages",
        content: (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl p-6 shadow-sm border-2 border-blue-200">
                <h3 className="text-xl font-semibold mb-4 text-blue-600">
                  Basic
                </h3>
                <p className="text-3xl font-bold mb-4">
                  ₹999<span className="text-lg font-normal">/month</span>
                </p>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>10 Profile
                    Views
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>Basic Matching
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>Email Support
                  </li>
                </ul>
                <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  Choose Plan
                </button>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border-2 border-purple-200">
                <h3 className="text-xl font-semibold mb-4 text-purple-600">
                  Premium
                </h3>
                <p className="text-3xl font-bold mb-4">
                  ₹1999<span className="text-lg font-normal">/month</span>
                </p>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>Unlimited
                    Profile Views
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>Advanced
                    Matching
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>Priority
                    Support
                  </li>
                </ul>
                <button className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition-colors">
                  Choose Plan
                </button>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border-2 border-gold-200">
                <h3 className="text-xl font-semibold mb-4 text-yellow-600">
                  Premium Plus
                </h3>
                <p className="text-3xl font-bold mb-4">
                  ₹2999<span className="text-lg font-normal">/month</span>
                </p>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>Everything in
                    Premium
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>Personal
                    Consultant
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>24/7 Support
                  </li>
                </ul>
                <button className="w-full bg-yellow-600 text-white py-2 rounded-lg hover:bg-yellow-700 transition-colors">
                  Choose Plan
                </button>
              </div>
            </div>
          </div>
        ),
      },
      basicInfo: {
        title: "Basic Information",
        content: (
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  className="w-full p-3 border border-gray-300 rounded-lg"
                  placeholder="Enter your full name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date of Birth
                </label>
                <input
                  type="date"
                  className="w-full p-3 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Gender
                </label>
                <select className="w-full p-3 border border-gray-300 rounded-lg">
                  <option>Male</option>
                  <option>Female</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Height
                </label>
                <input
                  type="text"
                  className="w-full p-3 border border-gray-300 rounded-lg"
                  placeholder="ex 5.8"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Education
                </label>
                <input
                  type="text"
                  className="w-full p-3 border border-gray-300 rounded-lg"
                  placeholder="Your highest education"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Occupation
                </label>
                <input
                  type="text"
                  className="w-full p-3 border border-gray-300 rounded-lg"
                  placeholder="Your profession"
                />
              </div>
            </div>
            <div className="mt-6">
              <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
                Save Changes
              </button>
            </div>
          </div>
        ),
      },
      inbox: {
        title: `Inbox ${getMessage.length}`,
        content: (
          <div className="space-y-4">
            <div className="bg-white rounded-xl shadow-sm">
              <div className="p-4 border-b">
                <h3 className="text-lg font-semibold">Messages</h3>
              </div>
              <div className="divide-y">
                {userInbox.length > 0 ? (
                  userInbox.map((ele, index) => (
                    <div
                      className="p-4 hover:bg-gray-50 cursor-pointer"
                      key={ele._id}
                      onClick={() => showModal(index)}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                          {ele.to.length < 3
                            ? ele.to.map((item) => item.charAt(0)).join("")
                            : ele.to
                                .slice(0, 2)
                                .map((item) => item.charAt(0))
                                .join("")}
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-center">
                            <h4 className="font-semibold line-clamp-1">
                              {ele.to.join(", ")}
                            </h4>
                            <span className="text-sm text-gray-500">
                              {timeAgo(ele.createdAt)}
                            </span>
                          </div>
                          <p className="text-gray-600 text-sm line-clamp-1">
                            {ele.message}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="p-4 text-gray-600">No message to Display</p>
                )}
              </div>
            </div>

            {isModalOpen && (
              <div
                className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 transition-all duration-300 ${
                  isModalOpen ? "opacity-100 visible" : "opacity-0 invisible"
                }`}
                onClick={hideModal}
              >
                <div
                  className="bg-white rounded-xl w-11/12 max-w-lg max-h-[80vh] overflow-hidden shadow-2xl transform transition-all duration-300"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="px-6 py-5 pb-4 border-b border-gray-200 flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-gray-800">
                      Message Details
                    </h3>
                    <button
                      onClick={hideModal}
                      className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded p-1 transition-colors duration-200 text-2xl leading-none"
                    >
                      ×
                    </button>
                  </div>

                  {/* Modal Content */}
                  <div className="px-6 py-6 max-h-[60vh] overflow-y-auto">
                    <div className="mb-5">
                      <label className="block text-sm font-medium text-gray-600 mb-1.5">
                        To:
                      </label>
                      <div className="bg-gray-50 border border-gray-200 rounded-md px-3 py-3 text-sm text-gray-800 min-h-[44px] break-words">
                        {userInbox[msgId]?.to.map((ele, idx) => (
                          <p key={idx}>{ele}</p>
                        ))}
                      </div>
                    </div>

                    <div className="mb-5">
                      <label className="block text-sm font-medium text-gray-600 mb-1.5">
                        From:
                      </label>
                      <div className="bg-gray-50 border border-gray-200 rounded-md px-3 py-3 text-sm text-gray-800 min-h-[44px] break-words">
                        {userInbox[msgId]?.from}
                      </div>
                    </div>

                    <div className="mb-5">
                      <label className="block text-sm font-medium text-gray-600 mb-1.5">
                        Message:
                      </label>
                      <div className="bg-gray-50 border border-gray-200 rounded-md px-3 py-3 text-sm text-gray-800 min-h-[100px] whitespace-pre-wrap break-words leading-relaxed">
                        {userInbox[msgId]?.message}
                      </div>
                    </div>

                    <div className="mb-0">
                      <label className="block text-sm font-medium text-gray-600 mb-1.5">
                        Time:
                      </label>
                      <div className="bg-gray-50 border border-gray-200 rounded-md px-3 py-3 text-sm text-gray-600 min-h-[44px] font-mono">
                        {timeAgo(userInbox[msgId]?.createdAt)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ),
      },
      profile: {
        title: "Profile",
        content: (
          <div className="w-full max-w-2xl mx-auto p-4">
            <div className="bg-white rounded-xl shadow-md p-5 relative">
              {/* Edit Icon */}
              {!isEditing ? (
  <button
    onClick={handleEditToggle}
    className="absolute top-4 right-4 text-gray-600 hover:text-blue-600"
  >
    <Pencil size={20} />
  </button>
) : (
  <div className="absolute top-4 right-4 flex space-x-2">
    <button
      onClick={handleSave}
      className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
    >
      Save
    </button>
    <button
      onClick={handleCancel}
      className="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600 text-sm"
    >
      Cancel
    </button>
  </div>
)}

              <h2 className="text-xl font-semibold mb-6 text-gray-800">
                Franchise Details
              </h2>

              {/* Profile Photo Section */}
              {/* <div className="flex flex-col items-center mb-6">
          <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-gray-300">
            <img
              src={previewImage}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>
        </div> */}

              {/* Details Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { key: "ownerName", label: "Owner Name" },
                  { key: "franchiseName", label: "Franchise Name" },
                  { key: "distributorUnder", label: "Distributor Under" },
                  { key: "mobileNumber", label: "Mobile Number " },
                  { key: "alternateNumber", label: "Alternate Number" },
                  { key: "email", label: "Email" },
                  { key: "panNumber", label: "PAN Number" },
                  { key: "adharNumber", label: "Aadhaar Number" },
                  { key: "address", label: "Address" },
                  { key: "location", label: "City" },
                ].map(({ key, label }) => (
                  <div key={key} className="flex flex-col">
                    <label htmlFor={key} className="text-sm text-gray-600 mb-1">
                      {label}
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        id={key}
                        name={key}
                        disabled={key==="adharNumber" || key==="panNumber" ? true : false}
                        value={editedData[key]}
                        onChange={handleChange}
                        className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    ) : (
                      <p className="text-gray-800 text-sm bg-gray-50 px-3 py-2 rounded-lg">
                        {CurrFranchise[key]}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ),
      },
      compose: {
        title: "Compose Message",
        content: (
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="space-y-4 w-full">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                To
              </label>
              <div className="w-full flex flex-col md:flex-row gap-4 items-start justify-start md:items-center ">
                <div className="relative w-full md:w-1/4">
                  {/* Dropdown trigger */}
                  <div
                    className="py-2 px-3 rounded-md border border-gray-400 cursor-pointer bg-white flex justify-between items-center"
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  >
                    <span className="text-gray-700">
                      {selectedMembers.length === 0
                        ? "Select Members"
                        : `${selectedMembers.length} member(s) selected`}
                    </span>
                    <svg
                      className={`w-4 h-4 transition-transform ${
                        isDropdownOpen ? "rotate-180" : ""
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>

                  {/* Dropdown options */}
                  {isDropdownOpen && (
                    <>
                      <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-400 rounded-md shadow-lg z-10 max-h-60 overflow-y-auto">
                        {members.length > 0 ? (
                          members.map((member) => (
                            <div
                              key={member._id}
                              className="flex items-center px-3 py-2 hover:bg-gray-100 cursor-pointer"
                              onClick={() => handleMemberToggle(member)}
                            >
                              <input
                                type="checkbox"
                                checked={isMemberSelected(member)}
                                onChange={() => {}} // Handled by parent div click
                                className="mr-2 h-4 w-4 text-blue-600 rounded border-gray-300"
                              />
                              <span className="text-gray-700">
                                {member.firstName} {member.lastName}
                              </span>
                            </div>
                          ))
                        ) : (
                          <div className="px-3 py-2 text-gray-500">
                            No members
                          </div>
                        )}
                      </div>
                      <div
                        className="flex items-center px-3 py-2 border-b hover:bg-gray-100 cursor-pointer"
                        onClick={handleSelectAllToggle}
                      >
                        <input
                          type="checkbox"
                          checked={selectedMembers.length === members.length}
                          onChange={() => {}}
                          className="mr-2 h-4 w-4 text-blue-600 rounded border-gray-300"
                        />
                        <span className="text-gray-700 font-medium">
                          Select All
                        </span>
                      </div>
                    </>
                  )}

                  {/* Selected members display (optional) */}
                  {selectedMembers.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {selectedMembers.map((member, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                        >
                          {member.firstName} {member.lastName}
                          <button
                            type="button"
                            className="ml-1 inline-flex items-center justify-center w-4 h-4 rounded-full text-blue-400 hover:bg-blue-200 hover:text-blue-600"
                            onClick={() => handleMemberToggle(member)}
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <div className="w-full md:w-1/2 flex gap-2 items-center justify-center">
                  <input
                    type="checkbox"
                    className="w-4 h-4 accent-[#7d0a0a]"
                    checked={isRecipientSelected(messageDistributor)}
                    onChange={() => handleRecipientToggle(messageDistributor)}
                  />
                  {messageDistributor?.distributorName}
                </div>

                <div className="w-full md:w-1/2 flex gap-2 items-center justify-center">
                  <input
                    type="checkbox"
                    className="w-4 h-4 accent-[#7d0a0a]"
                    checked={isRecipientSelected(admin)}
                    onChange={() => handleRecipientToggle(admin)}
                  />
                  Admin
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message
                </label>
                <textarea
                  className="w-full p-3 border border-gray-300 rounded-lg h-32"
                  placeholder="Write your message here..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                ></textarea>
              </div>
              <div className="flex space-x-3">
                <button
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                  onClick={sendMessage}
                >
                  Send Message
                </button>
                <button className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors">
                  Save Draft
                </button>
              </div>
            </div>
          </div>
        ),
      },
      sent: {
        title: "Sent",
        content: (
          <div className="p-5 overflow-x-hidden bg-gray-100 min-h-screen">
            <div className="hover:bg-gray-50 cursor-pointer space-y-2">
              {getSentMessages.length > 0 ? (
                getSentMessages.map((message) => (
                  <div
                    key={message._id}
                    onClick={() => handleOpenModal(message)}
                    className="border border-gray-500 p-4 rounded-md flex items-center space-x-3 hover:bg-gray-100 transition-colors duration-200"
                  >
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                      {message.to.length < 3
                        ? message.to.map((ele) => ele.charAt(0)).join("")
                        : `${message.to.length}`}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center">
                        <h4 className="font-semibold truncate">
                          {message.to.join(", ")}
                        </h4>
                        <span className="text-sm text-gray-500 whitespace-nowrap ml-2">
                          {timeAgo(message.createdAt)}
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm truncate">
                        {message.message}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-600 py-6 text-sm font-medium">
                  No message to display
                </p>
              )}
            </div>

            {/* Modal Section */}
            {modalVisible && (
              <div
                className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 transition-all duration-300"
                onClick={handleCloseModal}
              >
                <div
                  className="bg-white rounded-xl w-11/12 max-w-lg max-h-[80vh] overflow-hidden shadow-2xl transform transition-all duration-300"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="px-6 py-5 pb-4 border-b border-gray-200 flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-gray-800">
                      Message Details
                    </h3>
                    <button
                      onClick={handleCloseModal}
                      className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded p-1 transition-colors duration-200 text-2xl leading-none"
                    >
                      ×
                    </button>
                  </div>

                  <div className="px-6 py-6 max-h-[60vh] overflow-y-auto">
                    {activeMessage && (
                      <>
                        <div className="mb-5">
                          <label className="block text-sm font-medium text-gray-600 mb-1.5">
                            To:
                          </label>
                          <div className="bg-gray-50 border border-gray-200 rounded-md px-3 py-3 text-sm text-gray-800 min-h-[44px] break-words">
                            {activeMessage.to.join(", ")}
                          </div>
                        </div>

                        <div className="mb-5">
                          <label className="block text-sm font-medium text-gray-600 mb-1.5">
                            Message:
                          </label>
                          <div className="bg-gray-50 border border-gray-200 rounded-md px-3 py-3 text-sm text-gray-800 min-h-[100px] whitespace-pre-wrap break-words leading-relaxed">
                            {activeMessage.message}
                          </div>
                        </div>

                        <div className="mb-0">
                          <label className="block text-sm font-medium text-gray-600 mb-1.5">
                            Time:
                          </label>
                          <div className="bg-gray-50 border border-gray-200 rounded-md px-3 py-3 text-sm text-gray-600 min-h-[44px] font-mono">
                            {timeAgo(activeMessage.createdAt)}
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        ),
      },
      createMember: {
        title: "Create Member",
        content: (
          <>
            <MemberRegistration
              token={token}
              franchiseeName={CurrFranchise.franchiseName}
            />
          </>
        ),
      },
      viewMember: {
        title: "View Member",
        content: (
          <>
            <Suspense fallback={<div>Loading...</div>}>
              <MemberTable
                data={members}
                token={token}
                currFranchiseId={currFranchiseId}
              />
            </Suspense>
          </>
        ),
      },
    };

    // Default content for other sections
    const defaultContent = {
      title:
        activeSection.charAt(0).toUpperCase() +
        activeSection.slice(1).replace(/([A-Z])/g, " $1"),
      content: (
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <p className="text-gray-600">
            Content for {activeSection.replace(/([A-Z])/g, " $1")} will be
            displayed here.
          </p>
        </div>
      ),
    };

    return contentMap[activeSection] || defaultContent;
  };

  const currentContent = renderContent();

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Mobile menu button */}
      <div className="fixed top-4 left-4 z-50 lg:hidden">
        <button
          onClick={() => setSidebarOpen(true)}
          className="p-2 rounded-lg bg-[#7d0a0a] text-white shadow-lg"
        >
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
        fixed lg:relative 
        top-0 left-0 h-full 
        w-80 max-w-[85vw] 
        bg-white shadow-lg 
        transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        z-50 lg:z-auto
        overflow-y-auto
      `}
      >
        {/* Sidebar Header */}
        <div className="bg-gradient-to-r from-red-700 to-red-800 p-4 md:p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-white/20 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 md:w-6 md:h-6" />
              </div>
              <div>
                <h2 className="text-lg md:text-xl font-semibold">
                  {CurrFranchise.ownerName}
                </h2>
                <p className="text-blue-100 text-xs md:text-sm">Franchisee</p>
              </div>
            </div>
            <button
              onClick={closeSidebar}
              className="lg:hidden p-1 rounded-full hover:bg-white/20"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <div className="p-4">
          {Object.entries(sidebarItems).map(([sectionKey, section]) => {
            const SectionIcon = section.icon;
            const isExpanded = expandedSections[sectionKey];

            return (
              <div key={sectionKey} className="mb-4">
                <button
                  onClick={() => toggleSection(sectionKey)}
                  className="w-full flex items-center justify-between p-2 md:p-3 text-left font-semibold text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <SectionIcon className="w-4 h-4 md:w-5 md:h-5" />
                    <span className="text-sm md:text-base">
                      {section.title}
                    </span>
                  </div>
                  {isExpanded ? (
                    <ChevronDown className="w-4 h-4" />
                  ) : (
                    <ChevronRight className="w-4 h-4" />
                  )}
                </button>

                {isExpanded && (
                  <div className="ml-6 md:ml-8 mt-2 space-y-1">
                    {section.items.map((item) => {
                      const ItemIcon = item.icon;
                      return (
                        <button
                          key={item.id}
                          onClick={() => {
                            setActiveSection(item.id);
                            setSidebarOpen(false); // Close sidebar on mobile when item is selected
                          }}
                          className={`w-full flex items-center space-x-3 p-2 text-left rounded-lg transition-colors ${
                            activeSection === item.id
                              ? "bg-red-100 text-red-700"
                              : "text-gray-600 hover:bg-gray-100"
                          }`}
                        >
                          <ItemIcon className="w-3 h-3 md:w-4 md:h-4" />
                          <span className="text-xs md:text-sm">
                            {item.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-white shadow-sm p-4 lg:p-6">
          <div className="flex items-center justify-between">
            <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-[#7d0a0a] ml-12 lg:ml-0">
              {currentContent.title}
            </h1>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4 lg:p-6 ">
          <div className="max-w-7xl mx-auto">{currentContent.content}</div>
        </div>
      </div>
    </div>
  );
};

export default FranchiseDashboard;
