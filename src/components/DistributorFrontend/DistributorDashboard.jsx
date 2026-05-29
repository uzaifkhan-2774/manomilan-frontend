import React, { useEffect, useState } from "react";
import {
  Home,
  Package,
  UserX,
  User,
  Settings,
  Lock,
  Mail,
  MessageSquare,
  Inbox,
  Send,
  Edit3,
  Users2,
  Eye,
  File,
  Video,
  Wallet,
  WalletCards,
  IdCard,
  EyeOff,
  Shield,
  AlertCircle,
  CheckCircle,
  LogOut,
} from "lucide-react";
import FranchiseRegistrationForm from "../FranchiseFrontend/FranchiseRegister";
import GenerateFranchiseTable from "./GenerateFranchiseTable";
import axios from "axios";
import MemberTableDist from "./MemberTableDist";
import { toast } from "react-toastify";
import { Phone, MapPin, Menu,X,ChevronDown } from "lucide-react";
import ReportsUserForDist from "./ReportsUserForDist";

const PasswordChangeComponent = ({ currDistributor }) => {
  const [formData, setFormData] = useState({
    otp: "",
    newPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
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
        "http://localhost:8000/api/distributor/get-otp",
        { id: currDistributor._id }
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setIsLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:8000/api/distributor/verify-otp-reset-password",
        {
          id: currDistributor._id,
          otp: formData.otp,
          newPassword: Number(formData.newPassword),
        }
      );
      if (response.data?.status) {
        toast.success(response.data.message);
        setSuccessMessage("Password changed successfully!");
        setFormData({ otp: "", newPassword: "" });
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
                  onClick={handleSubmit}
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

const TransactionPasswordChangeComponent = () => {
  const [transactionFormData, setTransactionFormData] = useState({
    oldTransactionPassword: "",
    newTransactionPassword: "",
    confirmTransactionPassword: "",
  });

  const [showTransactionPasswords, setShowTransactionPasswords] = useState({
    oldTransaction: false,
    newTransaction: false,
    confirmTransaction: false,
  });

  const [transactionErrors, setTransactionErrors] = useState({});
  const [isTransactionLoading, setIsTransactionLoading] = useState(false);
  const [transactionSuccessMessage, setTransactionSuccessMessage] =
    useState("");

  const handleTransactionInputChange = (field, value) => {
    setTransactionFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear error when user starts typing
    if (transactionErrors[field]) {
      setTransactionErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }

    // Clear success message when user starts typing
    if (transactionSuccessMessage) {
      setTransactionSuccessMessage("");
    }
  };

  const toggleTransactionPasswordVisibility = (field) => {
    setShowTransactionPasswords((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const validateTransactionForm = () => {
    const newTransactionErrors = {};

    if (!transactionFormData.oldTransactionPassword) {
      newTransactionErrors.oldTransactionPassword =
        "Current transaction password is required";
    }

    if (!transactionFormData.newTransactionPassword) {
      newTransactionErrors.newTransactionPassword =
        "New transaction password is required";
    } else if (transactionFormData.newTransactionPassword.length < 6) {
      newTransactionErrors.newTransactionPassword =
        "Transaction password must be at least 6 characters long";
    }

    if (!transactionFormData.confirmTransactionPassword) {
      newTransactionErrors.confirmTransactionPassword =
        "Please confirm your new transaction password";
    } else if (
      transactionFormData.newTransactionPassword !==
      transactionFormData.confirmTransactionPassword
    ) {
      newTransactionErrors.confirmTransactionPassword =
        "Transaction passwords do not match";
    }

    if (
      transactionFormData.oldTransactionPassword ===
        transactionFormData.newTransactionPassword &&
      transactionFormData.oldTransactionPassword
    ) {
      newTransactionErrors.newTransactionPassword =
        "New transaction password must be different from current transaction password";
    }

    setTransactionErrors(newTransactionErrors);
    return Object.keys(newTransactionErrors).length === 0;
  };

  const handleTransactionSubmit = async (e) => {
    e.preventDefault();

    if (!validateTransactionForm()) {
      return;
    }

    setIsTransactionLoading(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Simulate success
      setTransactionSuccessMessage(
        "Transaction password changed successfully!"
      );
      setTransactionFormData({
        oldTransactionPassword: "",
        newTransactionPassword: "",
        confirmTransactionPassword: "",
      });
    } catch (error) {
      setTransactionErrors({
        submit: "Failed to change transaction password. Please try again.",
      });
    } finally {
      setIsTransactionLoading(false);
    }
  };

  const handleForgotTransactionPassword = () => {
    // Simulate forgot transaction password action
    alert("Forgot transaction password link has been sent to your email!");
    console.log("Redirecting to forgot transaction password...");
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Header */}
          <div
            className="bg-gradient-to-r from-red-900 to-red-700 p-6 text-center"
            style={{
              background: `linear-gradient(135deg, #7d0a0a 0%, #a01414 100%)`,
            }}
          >
            <Shield className="w-12 h-12 text-white mx-auto mb-3" />
            <h2 className="text-2xl font-bold text-white">
              Change Transaction Password
            </h2>
            <p className="text-red-100 mt-2">Secure your transactions</p>
          </div>

          {/* Form */}
          <div className="p-6">
            {transactionSuccessMessage && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="text-green-700 font-medium">
                  {transactionSuccessMessage}
                </span>
              </div>
            )}

            {transactionErrors.submit && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-3">
                <AlertCircle className="w-5 h-5 text-red-600" />
                <span className="text-red-700">{transactionErrors.submit}</span>
              </div>
            )}

            <div className="space-y-6">
              {/* Current Transaction Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Transaction Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type={
                      showTransactionPasswords.oldTransaction
                        ? "text"
                        : "password"
                    }
                    value={transactionFormData.oldTransactionPassword}
                    onChange={(e) =>
                      handleTransactionInputChange(
                        "oldTransactionPassword",
                        e.target.value
                      )
                    }
                    className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                      transactionErrors.oldTransactionPassword
                        ? "border-red-300 focus:ring-red-500"
                        : "border-gray-300 focus:ring-red-900"
                    }`}
                    placeholder="Enter your current transaction password"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      toggleTransactionPasswordVisibility("oldTransaction")
                    }
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showTransactionPasswords.oldTransaction ? (
                      <EyeOff size={20} />
                    ) : (
                      <Eye size={20} />
                    )}
                  </button>
                </div>
                {transactionErrors.oldTransactionPassword && (
                  <p className="mt-1 text-sm text-red-600">
                    {transactionErrors.oldTransactionPassword}
                  </p>
                )}
              </div>

              {/* New Transaction Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  New Transaction Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type={
                      showTransactionPasswords.newTransaction
                        ? "text"
                        : "password"
                    }
                    value={transactionFormData.newTransactionPassword}
                    onChange={(e) =>
                      handleTransactionInputChange(
                        "newTransactionPassword",
                        e.target.value
                      )
                    }
                    className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                      transactionErrors.newTransactionPassword
                        ? "border-red-300 focus:ring-red-500"
                        : "border-gray-300 focus:ring-red-900"
                    }`}
                    placeholder="Enter your new transaction password"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      toggleTransactionPasswordVisibility("newTransaction")
                    }
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showTransactionPasswords.newTransaction ? (
                      <EyeOff size={20} />
                    ) : (
                      <Eye size={20} />
                    )}
                  </button>
                </div>
                {transactionErrors.newTransactionPassword && (
                  <p className="mt-1 text-sm text-red-600">
                    {transactionErrors.newTransactionPassword}
                  </p>
                )}
                <p className="mt-1 text-xs text-gray-500">
                  Transaction password must be at least 6 characters long
                </p>
              </div>

              {/* Confirm New Transaction Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm New Transaction Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type={
                      showTransactionPasswords.confirmTransaction
                        ? "text"
                        : "password"
                    }
                    value={transactionFormData.confirmTransactionPassword}
                    onChange={(e) =>
                      handleTransactionInputChange(
                        "confirmTransactionPassword",
                        e.target.value
                      )
                    }
                    className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                      transactionErrors.confirmTransactionPassword
                        ? "border-red-300 focus:ring-red-500"
                        : "border-gray-300 focus:ring-red-900"
                    }`}
                    placeholder="Confirm your new transaction password"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      toggleTransactionPasswordVisibility("confirmTransaction")
                    }
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showTransactionPasswords.confirmTransaction ? (
                      <EyeOff size={20} />
                    ) : (
                      <Eye size={20} />
                    )}
                  </button>
                </div>
                {transactionErrors.confirmTransactionPassword && (
                  <p className="mt-1 text-sm text-red-600">
                    {transactionErrors.confirmTransactionPassword}
                  </p>
                )}
              </div>

              {/* Buttons */}
              <div className="space-y-4">
                <button
                  type="button"
                  onClick={handleTransactionSubmit}
                  disabled={isTransactionLoading}
                  className="w-full py-3 bg-red-900 text-white rounded-lg hover:bg-red-800 disabled:bg-red-400 disabled:cursor-not-allowed transition-colors font-medium flex items-center justify-center space-x-2"
                  style={{
                    backgroundColor: isTransactionLoading
                      ? "#ef4444"
                      : "#7d0a0a",
                  }}
                >
                  {isTransactionLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Changing Transaction Password...</span>
                    </>
                  ) : (
                    <>
                      <Shield size={18} />
                      <span>Change Transaction Password</span>
                    </>
                  )}
                </button>

                {/* <button
                  type="button"
                  onClick={handleForgotTransactionPassword}
                  className="w-full py-3 border-2 border-red-900 text-red-900 rounded-lg hover:bg-red-50 transition-colors font-medium"
                  style={{ borderColor: "#7d0a0a", color: "#7d0a0a" }}
                >
                  Forgot Transaction Password?
                </button> */}
              </div>
            </div>

            {/* Transaction Security Tips */}
            <div className="mt-8 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-semibold text-gray-800 mb-2 flex items-center space-x-2">
                <Shield
                  className="w-4 h-4 text-red-900"
                  style={{ color: "#7d0a0a" }}
                />
                <span>Transaction Security Tips</span>
              </h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Use a strong, unique transaction password</li>
                <li>• Make it different from your login password</li>
                <li>• Include numbers and special characters</li>
                <li>• Never share your transaction password</li>
                <li>• Change it regularly for better security</li>
              </ul>
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
              Admin Share
            </th>
            <th className="px-4 py-2 text-left text-md font-medium text-white tracking-wider">
              Distributor Share
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
                  {pkg.adminShare ?? "-"}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 border-r border-gray-200">
                  {pkg.distributorShare ?? "-"}
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

const DistributorDashboard = () => {
  let user;
  const token = localStorage.getItem("distributorToken");
  const distributorId = localStorage.getItem("distributorId");
  const [activeSection, setActiveSection] = useState("home");
  const [expandedSections, setExpandedSections] = useState({
    account: true,
    franchisee: true,
    settings: true,
    members: true,
    messageBox: true,
    advertiser: true,
    Reports: true,
    Logout:true,
  });
  const [currDistributor, setCurrDistributor] = useState({});
  const [franchises, setFranchises] = useState([]);
  const [members, setMembers] = useState([]);
  // const [selectedFranchise, setSelectedFranchise] = useState("");
  const [message, setMessage] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedRecipients, setSelectedRecipients] = useState([]);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [admin, setAdmin] = useState({});
  const [isFranchiseDropdownOpen, setIsFranchiseDropdownOpen] = useState(false);
  const [selectedFranchise, setSelectedFranchises] = useState([]);
  const [getMessage, setGetMessage] = useState([]);
  const [getInboxMessage, setGetInboxMessage] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [msgId, setMsgId] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [activeMessage, setActiveMessage] = useState(null);
  const [balanceEntries, setBalanceEntries] = useState([]);
  // sidebar 
    const [sidebarOpen, setSidebarOpen] = useState(false);
     const closeSidebar = () => {
    setSidebarOpen(false);
  };
    // logout function 
  const LogOutBtn = () => {
  const response = confirm("Do you want to log out?");
  if (response) {
    localStorage.removeItem("distributorToken");
    window.location.href = "/"; // redirect to login or home page
  }
};
  // api calling
  // get all members
  const getCurrDist = async () => {
    try {
      const response = await axios.post(
        "http://localhost:8000/api/distributor/get-current-distributor",
        {
          distributorId: distributorId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      if (response.data?.status) {
        setCurrDistributor(response.data?.distributor);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getCurrDist();
    getPointsLogOfDist();
  }, []);

  useEffect(() => {
    getPointsLogOfDist();
  }, [currDistributor]);

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

  function formatDate(isoDate) {
    const date = new Date(isoDate);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  const getPointsLogOfDist = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8000/api/distributor/get/pointsLog/${currDistributor._id}`
      );
      if (response.data.status) {
        setBalanceEntries(response.data?.distributorLogs);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getMembers = async () => {
    const payload = { lowerLimit: 0, upperLimit: 10 };
    try {
      const response = await axios.post(
        `http://localhost:8000/api/distributor/get-all-users`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // console.log(response.data)
      if (response.data.status === true) {
  const data = response.data.users;

  if (Array.isArray(data)) {
    setMembers(data);
  } else if (data) {
    setMembers([data]); // if backend sends a single user object
  } else {
    setMembers([]);
  }
}
    } catch (error) {
      console.log(error);
    }
  };
  const hideModal = () => {
    setIsModalOpen(false);
  };
  // get franchises
  const getFranchises = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/api/distributor/get-franchise-admin",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data.status === true) {
        setFranchises(response.data.franchises);
        setAdmin(response.data?.admin[0]);
        return;
      }
      setFranchises([]);
    } catch (error) {
      console.log("something went wrong", error);
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

  const getDistributorInboxMsg = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/api/distributor/message/replies",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data?.status) {
        setGetInboxMessage(response.data?.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getDistributorSentMsg = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/api/distributor/message/get-sendMessages",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data?.status) {
        setGetMessage(response.data?.data);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getDistributorSentMsg();
    getDistributorInboxMsg();
    setInterval(() => {
      getDistributorInboxMsg();
    }, 5000);
  }, []);

  const handleOpenModal = (message) => {
    setActiveMessage(message);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setActiveMessage(null);
  };

  const handleReplyClick = () => {
    if (activeMessage) {
      console.log("Reply to:", activeMessage.to);
      alert(`Reply to: ${activeMessage.to.join(", ")}`);
      handleCloseModal();
    }
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

  const sendMessage = async () => {
    const selected = selectedMembers.map((member) => member._id);
    const fran = selectedFranchise.map((franchise) => franchise._id);
    const admin = selectedRecipients.map((rec) => rec._id);
    const receiverIds = [...selected, ...fran, ...admin];
    console.log(admin, "admin", receiverIds);
    try {
      const res = await axios.post(
        "http://localhost:8000/api/distributor/message/send",
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
        setSelectedFranchises([]);
        setMessage("");
        getDistributorSentMsg();
        return;
      }
      toast.error(res.data?.message);
      console.log(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSaveDraft = () => {
    // Implement draft saving logic (e.g., save to localStorage or backend)
    alert("Draft saved");
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
    console.log(recipient);
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

  // Toggle individual franchise
  const handleFranchiseToggle = (franchise) => {
    setSelectedFranchises((prev) => {
      const isSelected = prev.some((f) => f._id === franchise._id);
      return isSelected
        ? prev.filter((f) => f._id !== franchise._id)
        : [...prev, franchise];
    });
  };

  // Select/Deselect all
  const handleFranchiseSelectAllToggle = () => {
    if (selectedFranchise.length === franchises.length) {
      setSelectedFranchises([]);
    } else {
      setSelectedFranchises(franchises);
    }
  };

  // Check if selected
  const isFranchiseSelected = (franchise) => {
    return selectedFranchise.some((f) => f._id === franchise._id);
  };

  useEffect(() => {
    getMembers();
    getFranchises();
    const interval = setInterval(() => {
      getMembers();
      // getFranchises();
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

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

  // const handleInputChange = (field, value) => {
  //   setUserInfo((prev) => ({
  //     ...prev,
  //     [field]: value,
  //   }));
  // };

  // const handleSave = () => {
  //   setIsEditing(false);
  //   // Here you would typically save to a backend
  //   console.log("Saved user info:", userInfo);
  // };


  const sidebarItems = {
    account: {
      title: "Account",
      icon: User,
      items: [
        { id: "home", label: "Home", icon: Home },
        { id: "profile", label: "Profile", icon: User },
      ],
    },
    franchisee: {
      title: "Franchisee",
      icon: Users2,
      items: [
        { id: "createFranchisee", label: "Create Franchisee", icon: User },
        { id: "viewFranchisee", label: "View Franchisee", icon: Eye },
        // { id: "mainPackage", label: "Main Package", icon: Package },
      ],
    },
    members: {
      title: "Members",
      icon: Users2,
      items: [
        { id: "viewMember", label: "View Member", icon: Eye },
        // { id: "memberPackages", label: "packages", icon: Package },
      ],
    },
    advertiser: {
      title: "Advertiser",
      icon: Users2,
      items: [
        { id: "viewAdvertiser", label: "View Advertiser", icon: Eye },
        { id: "packages", label: "Packages", icon: Package },
        { id: "advertisement", label: "Advertisement", icon: Video },
      ],
    },
    settings: {
      title: "Settings",
      icon: Settings,
      items: [
        { id: "changePassword", label: "Change Password", icon: Lock },
        {
          id: "changeTransactionPassword",
          label: "Change Transaction Password",
          icon: Lock,
        },
        { id: "changeEmail", label: "Change Email", icon: Mail },
      ],
    },
    messageBox: {
      title: "Message Box",
      icon: MessageSquare,
      items: [
        { id: "inbox", label: `Inbox ${getInboxMessage.length}`, icon: Inbox },
        { id: "sent", label: "Sent", icon: Send },
        { id: "compose", label: "Compose", icon: Edit3 },
      ],
    },
    Reports: {
      title: "Reports",
      icon: File,
      items: [
        { id: "member", label: "Member", icon: User },
        { id: "advertiser", label: "Advertiser", icon: User },
      ],
    },
    Logout:{
      title:"Logout",
      icon:LogOut,
      items:[{id:"logout",label:"LogOut",icon:LogOut}]
    }
  };
  // change email 
  const [updateEmail,setUpdateEmail]=useState(false)
  const[newEmail,setNewEmail]=useState("")
  const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};
  const changeEmail=async(id)=>{
    try {
      const response=await axios.put("http://localhost:8000/api/distributor/change-distributor-email",{
      distributorId:currDistributor._id || id, newEmail:newEmail
    },{
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        if(response.data.status){
          toast.success(response.data.message)
        }else{
          toast.error(response.data.message)
        }
    } catch (error) {
      console.log(error)
    }
  }
  const handleEmailUpdate = () => {
  if (updateEmail) {
    if (!validateEmail(newEmail)) {
      toast.warn("Please enter a valid email address");
      return;
    }
    changeEmail(currDistributor?._id);
  } else {
    setUpdateEmail(true);
  }
};

  // update profile api 
  const [isEditing, setIsEditing] = useState(false);
const [userInfo, setUserInfo] = useState({
  ownerName: currDistributor?.ownerName || "",
  email: currDistributor?.email || "", 
  mobileNumber: currDistributor?.mobileNumber || "",
  address: currDistributor?.address || "",
});
useEffect(() => {
  setUserInfo({
    ownerName: currDistributor?.ownerName || "",
    email: currDistributor?.email || "",
    mobileNumber: currDistributor?.mobileNumber || "",
    address: currDistributor?.address || "",
  });
}, [currDistributor]);

 const handleCancel = () => {
  setUserInfo({
    ownerName: currDistributor?.ownerName || "",
    email: currDistributor?.email || "",
    mobileNumber: currDistributor?.mobileNumber || "", 
    address: currDistributor?.address || "",
  });
  setIsEditing(false);
};
const handleInputChange = (field, value) => {
    setUserInfo((prev) => ({
      ...prev,
      [field]: value,
    }));
  };
const handleSave = async () => {
  try {
    const response = await axios.put(
      "http://localhost:8000/api/distributor/edit-profile",
      {
        distributorId: currDistributor?._id,
        updateData: userInfo,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.data?.success) {
      setCurrDistributor(prev => ({...prev, ...userInfo}));
      setIsEditing(false);
      toast.success("Profile updated successfully!");
    } else {
      toast.error(response.data?.message || "Failed to update profile");
    }
  } catch (error) {
    console.error("Error updating profile:", error);
    toast.error("Something went wrong while updating profile");
  }
};
const toggleEdit = () => {
  setIsEditing((prev) => !prev);
};
  // this content have to edit for the dashboard
  const renderContent = () => {
    const contentMap = {
      home: {
        title: "Dashboard Home",
        content: (
          <div className="space-y-6">
            <h1 className="text-2xl font-semibold">
              Welcome Default Distributor
            </h1>
            <div className="w-full flex flex-col gap-4 rounded-md p-2 border border-gray-500">
              <div className="flex gap-3">
                <p className="font-semibold">Franchise Under Me : </p>
                <p className="text-gray-500 font-semibold">
                  {franchises.length}
                </p>
              </div>
              <div className="flex gap-3">
                <p className="font-semibold">Account Balance : </p>
                <p className="text-gray-500 font-semibold">
                  {currDistributor?.points}
                </p>
              </div>
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
                      <td>ADMIN</td>
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
        ),
      },
      memberPackages:{
        title:"Member Packages",
        content:(
          <PackageTable data={tableData}/>
        )
      },
      changeEmail:{
        title:"Change Email",
        content:(
          <div className="w-full gap-5 flex flex-col justify-start items-start">
           <div>
            <div>
              <h2 className="font-semibold text-black">Existing Email:</h2>
              <p className="border-gray-400 border-1 rounded-md p-2 my-3">{currDistributor?.email}</p>
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
        )
      },
      profile: {
        title: "Profile",
        content: (
          <>
            <div className="min-h-screen bg-gray-50 py-8 px-4">
              <div className="max-w-6xl mx-auto">
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                  <div className="flex flex-col lg:flex-row">
                    {/* Left Side - Photo */}
                    <div
                      className="lg:w-1/3 bg-gradient-to-br from-red-900 to-red-700 p-8 flex items-center justify-center"
                      style={{
                        background: `linear-gradient(135deg, #7d0a0a 0%, #a01414 100%)`,
                      }}
                    >
                      <div className="text-center">
                        <div className="relative inline-block">
                          <img
                            src={currDistributor?.distributorPhoto!==""?`http://localhost:8000/upload/${currDistributor?.distributorPhoto}`:"https://imgs.search.brave.com/rwE-hC6ESt3hBJZhImPkb-KvU26bLDKVe-OKv1y50-M/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pLnBp/bmltZy5jb20vb3Jp/Z2luYWxzLzE0LzQz/LzU1LzE0NDM1NWQ3/YjM2YzVmNjQ2NDM1/NDIzNzk4MjgxY2U5/LmpwZw"}
                            alt={currDistributor.ownerName}
                            className="w-48 h-48 rounded-full border-4 border-white shadow-xl object-cover"
                          />
                          <div className="absolute bottom-4 right-4 w-8 h-8 bg-green-500 rounded-full border-4 border-white"></div>
                        </div>
                        <h1 className="text-2xl font-bold text-white mt-6 mb-2">
                          {currDistributor.ownerName}
                        </h1>
                        <p className="text-red-100">Active Now</p>
                      </div>
                    </div>

                    {/* Right Side - Details */}
                    <div className="lg:w-2/3 p-8">
                      <div className="flex justify-between items-center mb-8">
                        <h2 className="text-3xl font-bold text-gray-800">
                          Profile Details
                        </h2>
                        {!isEditing ? (
                          <button
                            onClick={() => setIsEditing(true)}
                            className="flex items-center space-x-2 px-6 py-3 bg-red-900 text-white rounded-lg hover:bg-red-800 transition-colors font-medium"
                            style={{ backgroundColor: "#7d0a0a" }}
                          >
                            <Edit3 size={18} />
                            <span>Edit Profile</span>
                          </button>
                        ) : (
                          <div className="flex space-x-3">
                            <button
                              onClick={handleSave}
                              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                            >
                              Save
                            </button>
                            <button
                              onClick={handleCancel}
                              className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors font-medium"
                            >
                              Cancel
                            </button>
                          </div>
                        )}
                      </div>

                      <div className="space-y-6">
                        {/* Name */}
                        <div className="flex items-center space-x-4 p-4 rounded-lg bg-gray-50">
                          <User
                            className="w-6 h-6 text-red-900"
                            style={{ color: "#7d0a0a" }}
                          />
                          <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-600 mb-1">
                              Full Name
                            </label>
                            {isEditing ? (
                              <input
                                type="text"
                                value={userInfo?.ownerName}
                                onChange={(e) =>
                                  handleInputChange("ownerName", e.target.value)
                                }
                                disabled={!isEditing}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-900"
                                style={{ focusRingColor: "#7d0a0a" }}
                              />
                            ) : (
                              <p className="text-lg text-gray-800 font-medium">
                                {currDistributor?.ownerName}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Email */}
                        <div className="flex items-center space-x-4 p-4 rounded-lg bg-gray-50">
                          <Mail
                            className="w-6 h-6 text-red-900"
                            style={{ color: "#7d0a0a" }}
                          />
                          <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-600 mb-1">
                              Email Address
                            </label>
                            {isEditing ? (
                              <input
                                type="email"
                                value={userInfo?.email}
                                onChange={(e) =>
                                  handleInputChange("email", e.target.value)
                                }
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-900"
                              />
                            ) : (
                              <p className="text-lg text-gray-800">
                                {currDistributor?.email}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Phone */}
                        <div className="flex items-center space-x-4 p-4 rounded-lg bg-gray-50">
                          <Phone
                            className="w-6 h-6 text-red-900"
                            style={{ color: "#7d0a0a" }}
                          />
                          <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-600 mb-1">
                              Phone Number
                            </label>
                            {isEditing ? (
                              <input
                                type="tel"
                                value={userInfo?.mobileNumber}
                                onChange={(e) =>
                                  handleInputChange("mobileNumber", e.target.value)
                                }
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-900"
                              />
                            ) : (
                              <p className="text-lg text-gray-800">
                                {currDistributor?.mobileNumber}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Location */}
                        <div className="flex items-center space-x-4 p-4 rounded-lg bg-gray-50">
                          <MapPin
                            className="w-6 h-6 text-red-900"
                            style={{ color: "#7d0a0a" }}
                          />
                          <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-600 mb-1">
                              Location
                            </label>
                            {isEditing ? (
                              <input
                                type="text"
                                value={userInfo?.address}
                                onChange={(e) =>
                                  handleInputChange("address", e.target.value)
                                }
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-900"
                              />
                            ) : (
                              <p className="text-lg text-gray-800">
                                {currDistributor?.address}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Adhar Number */}
                        <div className="flex items-center space-x-4 p-4 rounded-lg bg-gray-50">
                          <IdCard
                            className="w-6 h-6 text-red-900"
                            style={{ color: "#7d0a0a" }}
                          />
                          <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-600 mb-1">
                              Adhar Number
                            </label>
                            {isEditing ? (
                              <input
                                type="text"
                                required={false}
                                value={currDistributor?.adharNumber}
                                disabled
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-900"
                              />
                            ) : (
                              <p className="text-lg text-gray-800">
                                {currDistributor?.adharNumber}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Pan Number */}
                        <div className="flex items-center space-x-4 p-4 rounded-lg bg-gray-50">
                          <IdCard
                            className="w-6 h-6 text-red-900"
                            style={{ color: "#7d0a0a" }}
                          />
                          <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-600 mb-1">
                              PAN Number
                            </label>
                            {isEditing ? (
                              <input
                                type="text"
                                required={false}
                                value={currDistributor?.panNumber}
                                disabled
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-900"
                              />
                            ) : (
                              <p className="text-lg text-gray-800">
                                {currDistributor?.panNumber}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Bio */}
                        {/* <div className="p-4 rounded-lg bg-gray-50">
                          <label className="block text-sm font-medium text-gray-600 mb-3">
                            Bio
                          </label>
                          {isEditing ? (
                            <textarea
                              value={userInfo.bio}
                              onChange={(e) =>
                                handleInputChange("bio", e.target.value)
                              }
                              rows={4}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-900 resize-none"
                            />
                          ) : (
                            <p className="text-gray-700 leading-relaxed">
                              {userInfo.bio}
                            </p>
                          )}
                        </div> */}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        ),
      },
      changePassword: {
        title: "Change Password",
        content: <PasswordChangeComponent currDistributor={currDistributor} />,
      },
      changeTransactionPassword: {
        title: "Change Transaction Password",
        content: <TransactionPasswordChangeComponent />,
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
        title: "Inbox",
        content: (
          <div className="space-y-4">
            <div className="bg-white rounded-xl shadow-sm">
              <div className="p-4 border-b">
                <h3 className="text-lg font-semibold">Messages</h3>
              </div>
              <div className="divide-y">
                {getInboxMessage.length > 0 ? (
                  getInboxMessage.map((ele, index) => (
                    <div
                      className="p-4 hover:bg-gray-50 cursor-pointer"
                      key={ele._id}
                    >
                      <div
                        className="flex items-center space-x-3"
                        onClick={() => {
                          showModal();
                          setMsgId(index);
                        }}
                      >
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold"></div>
                        <div className="flex-1">
                          <div className="flex justify-between items-center">
                            <h4 className="font-semibold">
                              {ele.to.map((ele) => ele).join(" , ")}
                            </h4>
                            <span className="text-sm text-gray-500">
                              {timeAgo(message.createdAt)}
                            </span>
                          </div>
                          <p className="text-gray-600 text-sm">{ele.message}</p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p>No message to Display</p>
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
                {/* Modal Container */}
                <div
                  className={`bg-white rounded-xl w-11/12 max-w-lg max-h-[80vh] overflow-hidden shadow-2xl transform transition-all duration-300 ${
                    isModalOpen
                      ? "translate-y-0 scale-100"
                      : "translate-y-8 scale-95"
                  }`}
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Modal Header */}
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

                  {/* Modal Body */}
                  <div className="px-6 py-6 max-h-[60vh] overflow-y-auto">
                    <div className="mb-5">
                      <label className="block text-sm font-medium text-gray-600 mb-1.5">
                        to:
                      </label>
                      <div className="bg-gray-50 border border-gray-200 rounded-md px-3 py-3 text-sm text-gray-800 min-h-[44px] break-words">
                        {getInboxMessage[msgId].to.map((ele) => (
                          <p>{ele}</p>
                        ))}
                      </div>
                    </div>

                    <div className="mb-5">
                      <label className="block text-sm font-medium text-gray-600 mb-1.5">
                        from:
                      </label>
                      <div className="bg-gray-50 border border-gray-200 rounded-md px-3 py-3 text-sm text-gray-800 min-h-[44px] break-words">
                        {getInboxMessage[msgId].from}
                      </div>
                    </div>

                    <div className="mb-5">
                      <label className="block text-sm font-medium text-gray-600 mb-1.5">
                        Message:
                      </label>
                      <div className="bg-gray-50 border border-gray-200 rounded-md px-3 py-3 text-sm text-gray-800 min-h-[100px] whitespace-pre-wrap break-words leading-relaxed">
                        {getInboxMessage[msgId].message}
                      </div>
                    </div>

                    <div className="mb-0">
                      <label className="block text-sm font-medium text-gray-600 mb-1.5">
                        Time:
                      </label>
                      <div className="bg-gray-50 border border-gray-200 rounded-md px-3 py-3 text-sm text-gray-600 min-h-[44px] font-mono">
                        {timeAgo(getInboxMessage[msgId].createdAt)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ),
      },
      compose: {
        title: "Compose Message",
        content: (
          <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm w-full">
            <div className="space-y-4 w-full">
              {/* --- To Section --- */}
              <label className="block text-sm font-medium text-gray-700 mb-2">
                To
              </label>
              <div className="w-full flex flex-col md:flex-row gap-4 md:items-center md:justify-center">
                {/* Members Dropdown */}
                <div className="relative w-full md:w-1/4">
                  <div
                    className="py-2 px-3 rounded-md border border-gray-400 cursor-pointer bg-white flex justify-between items-center"
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  >
                    <span className="text-gray-700 text-sm sm:text-base">
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

                  {isDropdownOpen && (
                    <>
                      <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-400 rounded-md shadow-lg z-10 max-h-60 overflow-y-auto">
                        {Array.isArray(members) && members.length > 0 ? (
                          members.map((member) => (
                            <div
                              key={member._id}
                              className="flex items-center px-3 py-2 hover:bg-gray-100 cursor-pointer"
                              onClick={() => handleMemberToggle(member)}
                            >
                              <input
                                type="checkbox"
                                checked={isMemberSelected(member)}
                                onChange={() => {}}
                                className="mr-2 h-4 w-4 text-blue-600 rounded border-gray-300"
                              />
                              <span className="text-gray-700 text-sm sm:text-base">
                                {member.firstName} {member.lastName}
                              </span>
                            </div>
                          ))
                        ) : (
                          <div className="px-3 py-2 text-gray-500 text-sm">
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
                        <span className="text-gray-700 font-medium text-sm sm:text-base">
                          Select All
                        </span>
                      </div>
                    </>
                  )}
                </div>

                {/* Franchises Dropdown */}
                <div className="relative w-full md:w-1/4">
                  <div
                    className="py-2 px-3 rounded-md border border-gray-400 cursor-pointer bg-white flex justify-between items-center"
                    onClick={() =>
                      setIsFranchiseDropdownOpen(!isFranchiseDropdownOpen)
                    }
                  >
                    <span className="text-gray-700 text-sm sm:text-base">
                      {selectedFranchise.length === 0
                        ? "Select Franchises"
                        : `${selectedFranchise.length} franchise(s) selected`}
                    </span>
                    <svg
                      className={`w-4 h-4 transition-transform ${
                        isFranchiseDropdownOpen ? "rotate-180" : ""
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

                  {isFranchiseDropdownOpen && (
                    <>
                      <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-400 rounded-md shadow-lg z-10 max-h-60 overflow-y-auto">
                        {franchises.length > 0 ? (
                          franchises.map((franchise) => (
                            <div
                              key={franchise._id}
                              className="flex items-center px-3 py-2 hover:bg-gray-100 cursor-pointer"
                              onClick={() => handleFranchiseToggle(franchise)}
                            >
                              <input
                                type="checkbox"
                                checked={isFranchiseSelected(franchise)}
                                onChange={() => {}}
                                className="mr-2 h-4 w-4 text-blue-600 rounded border-gray-300"
                              />
                              <span className="text-gray-700 text-sm sm:text-base">
                                {franchise.franchiseName}
                              </span>
                            </div>
                          ))
                        ) : (
                          <div className="px-3 py-2 text-gray-500 text-sm">
                            No franchises
                          </div>
                        )}
                      </div>

                      <div
                        className="flex items-center px-3 py-2 border-b hover:bg-gray-100 cursor-pointer"
                        onClick={handleFranchiseSelectAllToggle}
                      >
                        <input
                          type="checkbox"
                          checked={
                            selectedFranchise.length === franchises.length
                          }
                          onChange={() => {}}
                          className="mr-2 h-4 w-4 text-blue-600 rounded border-gray-300"
                        />
                        <span className="text-gray-700 font-medium text-sm sm:text-base">
                          Select All
                        </span>
                      </div>
                    </>
                  )}
                </div>

                {/* Admin Checkbox */}
                <div className="w-full md:w-1/2 flex items-center gap-2">
                  <input
                    type="checkbox"
                    className="w-4 h-4 accent-[#7d0a0a]"
                    checked={isRecipientSelected(admin)}
                    onChange={() => handleRecipientToggle(admin)}
                  />
                  <span className="text-gray-700 text-sm sm:text-base">
                    Admin
                  </span>
                </div>
              </div>

              {/* --- Message Box --- */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message
                </label>
                <textarea
                  className="w-full p-3 border border-gray-300 rounded-lg h-32 text-sm sm:text-base"
                  placeholder="Write your message here..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                ></textarea>
              </div>

              {/* --- Action Buttons --- */}
              <div className="flex flex-col sm:flex-row gap-3 sm:space-x-3">
                <button
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors w-full sm:w-auto text-sm sm:text-base"
                  onClick={sendMessage}
                >
                  Send Message
                </button>
                <button className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors w-full sm:w-auto text-sm sm:text-base">
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
    <div className="p-5 bg-gray-100 min-h-screen">
      <div className="hover:bg-gray-50 cursor-pointer space-y-2">
        {Array.isArray(getMessage) && getMessage.length > 0 ? (
          getMessage.map((message) => (
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
          <div className="text-center text-gray-500 py-10 text-lg">
            No messages to display
          </div>
        )}
      </div>

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

      logout:{
        title:"LogOut",
        content:(
          <>
            <div>Do You Want to logout?</div>
            <button onClick={()=>LogOutBtn()} className="border-1 px-2 py-1 mt-4 font-bold cursor-pointer rounded-md border-red-500 bg-red-500 text-white ">LogOut</button>
          </>
        )
      },
      createFranchisee: {
        title: "Create Franchisee",
        content: <FranchiseRegistrationForm />,
      },
      viewFranchisee: {
        title: "View Franchisee",
        content: <GenerateFranchiseTable data={franchises} />,
      },
      // mainPackage: {
      //   title: "Main Package",
      //   content: (
      //     <>
      //       <div className="bg-white rounded-xl p-4 md:p-6 shadow-sm flex flex-col gap-4">
      //         {/* table generator  */}
      //         <table className="w-full flex flex-col gap-4 ">
      //           <tbody className="w-full flex flex-col gap-6 md:gap-8">
      //             <tr className="flex flex-col md:flex-row md:items-center gap-2 md:gap-6 w-full">
      //               <td className="font-semibold w-full md:w-1/3">
      //                 Package Name :
      //               </td>
      //               <td className="w-full md:flex-1">
      //                 <input
      //                   type="text"
      //                   placeholder="Enter Name"
      //                   className="w-full border border-gray-400 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
      //                 />
      //               </td>
      //             </tr>
      //             {/* Number of Addresses */}
      //             <tr className="flex flex-col md:flex-row md:items-center gap-2 md:gap-6 w-full">
      //               <td className="font-semibold w-full md:w-1/3">
      //                 Number of Addresses :
      //               </td>
      //               <td className="w-full md:flex-1">
      //                 <input
      //                   type="text"
      //                   placeholder="Enter Count"
      //                   className="w-full border border-gray-400 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
      //                 />
      //               </td>
      //             </tr>

      //             {/* Upper Limit */}
      //             <tr className="flex flex-col md:flex-row md:items-center gap-2 md:gap-6 w-full">
      //               <td className="font-semibold w-full md:w-1/3">
      //                 Member Cost :
      //               </td>
      //               <td className="w-full md:flex-1">
      //                 <input
      //                   type="text"
      //                   placeholder="Enter Limit"
      //                   className="w-full border border-gray-400 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
      //                 />
      //               </td>
      //             </tr>

      //             <tr className="flex flex-col md:flex-row md:items-center gap-2 md:gap-6 w-full">
      //               <td className="font-semibold w-full md:w-1/3">
      //                 Distributor Share :
      //               </td>
      //               <td className="w-full md:flex-1">
      //                 <input
      //                   type="text"
      //                   placeholder="Enter Share"
      //                   className="w-full border border-gray-400 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
      //                 />
      //               </td>
      //             </tr>

      //             {/* Admin Share */}
      //             <tr className="flex flex-col md:flex-row md:items-center gap-2 md:gap-6 w-full">
      //               <td className="font-semibold w-full md:w-1/3">
      //                 Franchise Share :
      //               </td>
      //               <td className="w-full md:flex-1">
      //                 <input
      //                   type="text"
      //                   placeholder="Enter Share"
      //                   className="w-full border border-gray-400 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
      //                 />
      //               </td>
      //             </tr>

      //             <tr className="flex flex-col md:flex-row md:items-center gap-2 md:gap-6 w-full">
      //               <td className="font-semibold w-full md:w-1/3">
      //                 Date of Creation :
      //               </td>
      //               <td className="w-full md:flex-1">
      //                 <input
      //                   type="text"
      //                   placeholder="Enter Share"
      //                   className="w-full border border-gray-400 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
      //                 />
      //               </td>
      //             </tr>

      //             {/* Validity */}
      //             <tr className="flex flex-col md:flex-row md:items-center gap-2 md:gap-6 w-full">
      //               <td className="font-semibold w-full md:w-1/3">
      //                 Enter Validity (in days) :
      //               </td>
      //               <td className="w-full md:flex-1">
      //                 <input
      //                   type="text"
      //                   placeholder="Enter Validity"
      //                   className="w-full border border-gray-400 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
      //                 />
      //               </td>
      //             </tr>
      //           </tbody>
      //         </table>
      //         <div className="w-full text-end">
      //           <button className="border px-3 py-2 rounded-xl font-semibold text-[#7d0a0a] cursor-pointer border-[#7d0a0a]">
      //             Save
      //           </button>
      //         </div>
      //       </div>
      //     </>
      //   ),
      // },
      viewMember: {
        title: "View Members",
        content: <MemberTableDist data={members} />,
      },
      member:{
        title:"Member Reports",
        content:(
          <ReportsUserForDist tokenProp={token}/>
        )
      }
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
                  {currDistributor.ownerName}
                </h2>
                <p className="text-blue-100 text-xs md:text-sm">Distributor</p>
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

export default DistributorDashboard;
