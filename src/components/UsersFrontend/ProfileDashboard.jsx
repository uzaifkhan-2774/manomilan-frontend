import React, { useEffect, useState } from "react";
import {
  Home,
  Users,
  UserCheck,
  Package,
  UserX,
  User,
  Heart,
  Phone,
  Settings,
  Lock,
  Mail,
  MessageSquare,
  Inbox,
  Send,
  Edit3,
  Menu,
  X,
  LogOut,
} from "lucide-react";
import MatrimonyCards from "./MatrimonyCards";
import axios from "axios";
import BasicDetails from "./BasicDetails";
import FamilyDetails from "./FamilyDetails";
import { toast } from "react-toastify";
import Expectations from "./Expectations";
import PasswordChangeComponent from './ForgotPasswordUser'
import WorkLocation from "./WorkLocation";
import OtherInfoEdit from "./OtherInfoEdit";
import SubsMatrimonyCards from "./SubsMatrimonyCards";
import BioData from "./BioData.jsx"
const ProfileDashboard = () => {
  // time finder
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

  const token = localStorage.getItem("userToken");
  const [activeSection, setActiveSection] = useState("home");
  const [expandedSections, setExpandedSections] = useState({
    account: true,
    profile: false,
    settings: false,
    services: false,
    messageBox: false,
    logOut:true
  });
  const LogOutBtn = () => {
  const response = confirm("Do you want to log out?");
  if (response) {
    localStorage.removeItem("userToken");
    window.location.href = "/"; // redirect to login or home page
  }
};
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currUser, setCurrUser] = useState({});
  const [reciver, setReciver] = useState({
    distributor: null,
    admin: null,
    distId: null,
    adminId: null,
    franchiseId: null,
  });
  const [whomSend, setWhomSend] = useState({
    franchise: false,
    distributor: false,
    admin: false,
  });
  const [message, setMessage] = useState("");
  const [getMessage, setGetMessage] = useState([]);
  const [userInbox, setUserInbox] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [activeMessage, setActiveMessage] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [msgId, setMsgId] = useState(null);
  const [userId, setUserId] = useState(null);
  const handleOpenModal = (message) => {
    setActiveMessage(message);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setActiveMessage(null);
  };
  const hideModal = () => {
    setIsModalOpen(false);
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

  const getCurrentUser = async () => {
    try {
      const response = await axios.get(
        "https://api.manomilan.com/api/user/getcurrentuser",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response?.data?.status === true) {
        const user = response?.data?.result;
        setCurrUser(user);
        setUserId(user?._id);
        // Fetch packages after setting user
        await packagesAvailable(user._id);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getFranchiseAndDistributor = async () => {
    try {
      if (currUser.franchiseUnder === undefined) {
        return;
      }
      const response = await axios.get(
        `https://api.manomilan.com/api/user/get-franchise-distributor/${currUser.franchiseUnder}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response.data)
      if (response.data?.status) {
        setReciver({
          distributor: response.data?.distributor?.distributorName,
          admin: response.data?.admin[0]?.name,
          distId: response.data?.distributor?._id,
          franchiseId: response.data?.franchise?._id,
          adminId: response.data?.admin[0]?._id,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getCurrentUser();
  }, []);
  useEffect(() => {
    getFranchiseAndDistributor();
  }, [currUser]);

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleSectionClick = (sectionId) => {
    setActiveSection(sectionId);
    // Close sidebar on mobile when item is selected
    if (window.innerWidth < 768) {
      setSidebarOpen(false);
    }
  };

  // mutual matching
  const [matches, setMatches] = useState([]);
  const mutualMatching = async () => {
  const token = localStorage.getItem("userToken");
  try {
    // Fetch subscribed members first
    const subscribedMembers = await getSubscribed();

    const response = await axios.get(
      "https://api.manomilan.com/api/user/mutual-matching",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.data.status) {
      const allMatches = response.data.Matches || [];

      // Filter out subscribed members
      const filteredMatches = allMatches.filter(
        (match) =>
          !subscribedMembers.some(
            (subscribed) => subscribed._id === match._id
          )
      );
      setMatches(filteredMatches);
    }
  } catch (error) {
    console.error("Error fetching mutual matches:", error);
  }
};

// Call mutualMatching when component mounts or as needed
useEffect(() => {
  mutualMatching();
}, []);


  // messages api here
  const sendMessage = async () => {
    const receiverIds = [];
    if (whomSend.franchise && reciver.franchiseId) {
      receiverIds.push(reciver.franchiseId);
    }
    if (whomSend.distributor && reciver.distId) {
      receiverIds.push(reciver.distId);
    }
    if (whomSend.admin && reciver.adminId) {
      receiverIds.push(reciver.adminId);
    }

    if (receiverIds.length === 0) {
      toast.warn("Please select at least one recipient.");
      return;
    }

    if (!message.trim()) {
      toast.warn("Please enter a message.");
      return;
    }

    const payload = {
      receiverIds,
      message,
    };
    try {
      const response = await axios.post(
        "https://api.manomilan.com/api/user/message/send",
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data?.status) {
        toast.success("Message sent successfully!");
        getSentMessages();
      }

      // Optionally reset
      setWhomSend({ franchise: false, distributor: false, admin: false });
      setMessage("");
    } catch (error) {
      console.log(error);
      alert("Something went wrong.");
    }
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

  const getSentMessages = async () => {
    try {
      const response = await axios.get(
        "https://api.manomilan.com/api/user/message/get-sendMessages",
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
  const getInboxMessages = async () => {
    try {
      const response = await axios.get(
        "https://api.manomilan.com/api/user/message/replies",
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
  useEffect(() => {
    getSentMessages();
    getInboxMessages();
  }, []);

  // subscribed member
  const [subscribedMembers,setSubscribedMembers]=useState([])
  const getSubscribed = async () => {
  const token = localStorage.getItem("userToken");
  try {
    const response = await axios.get(
      "https://api.manomilan.com/api/user/getSubscribes",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (response.data.status) {
      setSubscribedMembers(response.data.subscribed || []);
      return response.data.subscribed || []; // Return subscribed members for use in mutualMatching
    }
    return [];
  } catch (error) {
    console.error("Error fetching subscribed members:", error);
    return [];
  }
};

  // packages apis here
  const [availablePackages, setAvailablePackages] = useState([]);
  const packagesAvailable = async (userId) => {
    try {
      const response = await axios.get(
        `https://api.manomilan.com/api/user/get-packages/${userId}`
      );
      console.log(response.data)
      if (response.data.status) {
        setAvailablePackages(response.data?.userPackages);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const sidebarItems = {
    account: {
      title: "Account",
      icon: User,
      items: [
        { id: "home", label: "Home", icon: Home },
        { id: "subscriptions", label: "Subscriptions", icon: Users },
        { id: "subscribedBy", label: "Subscribed By", icon: UserCheck },
        { id: "packages", label: "Packages", icon: Package },
        { id: "biodata", label: "Bio Data", icon: UserX },
      ],
    },
    profile: {
      title: "Profile",
      icon: User,
      items: [
        { id: "basicInfo", label: "Basic Information", icon: User },
        { id: "familyInfo", label: "Family Information", icon: Users },
        { id: "workLocation", label: "Work Information", icon: Phone },
        { id: "expectations", label: "Expectations", icon: Heart },
        { id: "otherInfo", label: "Other Information", icon: Heart },
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
    // services: {
    //   title: "Services",
    //   icon: Heart,
    //   items: [
    //     { id: "marriageServices", label: "Marriage Services", icon: Heart },
    //   ],
    // },
    messageBox: {
      title: "Message Box",
      icon: MessageSquare,
      items: [
        { id: "inbox", label: `Inbox (${userInbox.length})`, icon: Inbox },
        { id: "sent", label: "Sent", icon: Send },
        { id: "compose", label: "Compose", icon: Edit3 },
      ],
    },
    logout:{
      title:"Log Out",
      icon:LogOut,
      items:[
        {id:"logout",label:`Log Out`, icon: LogOut}
      ]
    }
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
        //login email will change accordingly
        "https://api.manomilan.com/api/user/change-user-email",
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
      changeEmail(currUser._id);
    } else {
      setUpdateEmail(true);
    }
  };
  const renderContent = () => {
    const contentMap = {
      home: {
        title: "Dashboard Home",
        content: (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              <div className="bg-gradient-to-r from-red-500 to-red-600 p-4 md:p-6 rounded-xl text-white">
                <h3 className="text-base md:text-lg font-semibold mb-2">
                  Total Matches
                </h3>
                <p className="text-2xl md:text-3xl font-bold">
                  {matches.length}
                </p>
              </div>
              <div className="bg-gradient-to-r from-green-500 to-green-600 p-4 md:p-6 rounded-xl text-white">
                <h3 className="text-base md:text-lg font-semibold mb-2">
                  Balance Subscriptions
                </h3>
                <p className="text-2xl md:text-3xl font-bold">3</p>
                <p className="text-sm md:text-base font-bold">
                  Valid Upto 3 sept 2025
                </p>
              </div>
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-4 md:p-6 rounded-xl text-white">
                <h3 className="text-base md:text-lg font-semibold mb-2">
                  Subscribed By
                </h3>
                <p className="text-2xl md:text-3xl font-bold">24</p>
              </div>
              <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-4 md:p-6 rounded-xl text-white">
                <h3 className="text-base md:text-lg font-semibold mb-2">
                  Express Interest
                </h3>
                <p className="text-2xl md:text-3xl font-bold">89</p>
              </div>
            </div>

            <MatrimonyCards matches={matches} token={token} subscribeIds={false}/>
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
      workLocation:{
        title:"Work Information",
        content:(
          <WorkLocation userId={currUser._id} token={token}/>
        )
      },
      changeEmail:{
        title:"Change Email",
        content:(
          <div className="w-full gap-5 flex flex-col justify-start items-start">
            <div>
              <div>
                <h2 className="font-semibold text-black">Existing Email:</h2>
                <p className="border-gray-400 border-1 rounded-md p-2 my-3">
                  {currUser?.loginEmail}
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
        )
      },
      changePassword: {
        title: "Change Password",
        content: <PasswordChangeComponent currFranchiseId={currUser?._id} />,
      },
      subscriptions: {
        title: "My Subscriptions",
        content: (
          <div className="space-y-6">
            <div className="bg-white rounded-xl p-4 md:p-6 shadow-sm">
              <h3 className="text-lg font-semibold mb-4">
                Active Subscriptions
              </h3>
              <SubsMatrimonyCards token={token} matches={subscribedMembers} subscribeIds={true}/>
            </div>
          </div>
        ),
      },
      subscribedBy: {
        title: "Subscribed By Others",
        content: (
          <div className="space-y-6">
            <div className="bg-white rounded-xl p-4 md:p-6 shadow-sm">
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
            {/* <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {availablePackages.length>0 ? (
                availablePackages.map((pack) => {
                  const isMain = !!pack.franchisePackage.mainPackageId || null;
                  const isVIP = !!pack.franchisePackage.vipPackage || null;
                  const isFree =!!pack.franchisePackage.
freePackage

                  const packageData = isMain
                    ? pack.franchisePackage.mainPackageId
                    : isVIP
                    ? pack.franchisePackage.vipPackage
                    : null;

                  if (!packageData) return null;
                  return (
                    <div
                      key={pack._id}
                      className="bg-white rounded-xl p-4 md:p-6 shadow-sm border-2 border-blue-200"
                    >
                      <h3 className="text-lg md:text-xl font-semibold mb-4 text-blue-600">
                        {packageData.packageName || "Untitled Package"}
                      </h3>
                      <p className="text-2xl md:text-3xl font-bold mb-4">
                        ₹ {packageData.memberCost}
                      </p>
                      <ul className="space-y-2 mb-6">
                        <li className="flex items-center text-sm md:text-base">
                          <span className="text-green-500 mr-2">✓</span> {packageData.numberOfAddresses} {" "}
                          Number of Addresses 
                        </li>
                        <li className="flex items-center text-sm md:text-base">
                          <span className="text-green-500 mr-2">✓</span>Mutual
                          Matching
                        </li>
                        <li className="flex items-center text-sm md:text-base">
                          {packageData.status==="Active"?<span className="text-green-500 mr-2">✓</span>:<span className="text-red-500 mr-2">X</span>}{packageData.status}
                        </li>
                      </ul>
                    </div>
                  );
                })
              ) : (
                <div>No packages to display!</div>
              )}
            </div> */}
          </div>
        ),
      },
      biodata:{
        title:"Bio Data",
        content:(
          <BioData userId={currUser._id} />
        )
      },
      basicInfo: {
        title: "Basic Information",
        content: (
          <div className="bg-white rounded-xl p-4 md:p-6 shadow-sm">
            <BasicDetails />
          </div>
        ),
      },
      familyInfo: {
        title: "Family Information",
        content: (
          <div className="bg-white rounded-xl p-4 md:p-6 shadow-sm">
            <FamilyDetails />
          </div>
        ),
      },
      expectations: { title: "Expectations", content: <Expectations /> },
      otherInfo:{title:"Other Information",content:<OtherInfoEdit/>},
      inbox: {
        title: `Inbox`,
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
                    >
                      <div
                        className="flex items-center space-x-3"
                        onClick={() => {
                          showModal();
                          setMsgId(index);
                        }}
                      >
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                          {ele.to.length < 3
                            ? ele.to.map((ele) => ele.charAt(0))
                            : null}
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-center">
                            <h4 className="font-semibold">
                              {ele.to.map((ele) => ele).join(",")}
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
                        {getMessage[msgId].to.map((ele) => (
                          <p>{ele}</p>
                        ))}
                      </div>
                    </div>

                    <div className="mb-5">
                      <label className="block text-sm font-medium text-gray-600 mb-1.5">
                        from:
                      </label>
                      <div className="bg-gray-50 border border-gray-200 rounded-md px-3 py-3 text-sm text-gray-800 min-h-[44px] break-words">
                        {getMessage[msgId].from}
                      </div>
                    </div>

                    <div className="mb-5">
                      <label className="block text-sm font-medium text-gray-600 mb-1.5">
                        Message:
                      </label>
                      <div className="bg-gray-50 border border-gray-200 rounded-md px-3 py-3 text-sm text-gray-800 min-h-[100px] whitespace-pre-wrap break-words leading-relaxed">
                        {getMessage[msgId].message}
                      </div>
                    </div>

                    <div className="mb-0">
                      <label className="block text-sm font-medium text-gray-600 mb-1.5">
                        Time:
                      </label>
                      <div className="bg-gray-50 border border-gray-200 rounded-md px-3 py-3 text-sm text-gray-600 min-h-[44px] font-mono">
                        {timeAgo(getMessage[msgId].createdAt)}
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
          <div className="bg-white space-y-7 rounded-xl p-4 md:p-6 shadow-sm">
            <div className="w-full flex flex-col md:flex-row gap-4 md:items-center">
              <div className="md:w-1/3 w-full flex flex-col items-center gap-3">
                <div className="w-full space-y-2">
                  <p className="font-semibold">Franchsiee</p>
                  <input
                    type="checkbox"
                    name="franchise"
                    className="w-4 h-4"
                    onClick={() => {
                      setWhomSend((prev) => ({
                        ...prev,
                        franchise: !prev.franchise,
                      }));
                    }}
                  />{" "}
                  <span className="font-semibold">
                    {currUser.franchiseUnder}
                  </span>
                </div>
              </div>
              <div className="md:w-1/3 w-full flex flex-col items-center gap-3">
                <div className="w-full space-y-2">
                  <p className="font-semibold">Distributor</p>
                  <input
                    type="checkbox"
                    name="distributor"
                    className="w-4 h-4"
                    onClick={() => {
                      setWhomSend((prev) => ({
                        ...prev,
                        distributor: !prev.distributor,
                      }));
                    }}
                  />{" "}
                  <span className="font-semibold">{reciver.distributor}</span>
                </div>
              </div>
              <div className="md:w-1/3 w-full flex flex-col items-center gap-3">
                <div className="w-full space-y-2">
                  <p className="font-semibold">Admin</p>
                  <input
                    type="checkbox"
                    name="admin"
                    className="w-4 h-4"
                    onClick={() => {
                      setWhomSend((prev) => ({
                        ...prev,
                        admin: !prev.admin,
                      }));
                    }}
                  />{" "}
                  <span className="font-semibold">Admin</span>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message
                </label>
                <textarea
                  className="w-full p-3 border border-gray-300 rounded-lg h-32 text-sm md:text-base"
                  placeholder="Write your message here..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                ></textarea>
              </div>
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                <button
                  className="bg-[#7d0a0a] text-white px-4 md:px-6 py-2 md:py-3 rounded-lg hover:bg-[#6a0909] transition-colors text-sm md:text-base"
                  onClick={sendMessage}
                >
                  Send Message
                </button>
              </div>
            </div>
          </div>
        ),
      },
      sent: {
        title: "Sent Messages",
        content: (
          <>
  <div className="p-5 overflow-x-hidden bg-gray-100 min-h-screen">
    <div className="hover:bg-gray-50 cursor-pointer space-y-2">
      {getMessage.length > 0 ? (
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
        <div className="text-center text-gray-500 py-10 text-lg font-medium">
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
        <div className="bg-white rounded-xl p-4 md:p-6 shadow-sm">
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
      {/* Sidebar Overlay for Mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`w-80 bg-white shadow-lg fixed h-full overflow-y-auto z-50 transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 md:static md:z-auto`}
      >
        {/* Sidebar Header */}
        <div className="bg-gradient-to-r from-red-700 to-red-800 p-4 md:p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-white/20 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 md:w-6 md:h-6" />
              </div>
              <div>
                <h2 className="text-lg md:text-xl text-white font-semibold">
                  {currUser.firstName}
                </h2>
              </div>
            </div>
            {/* Close button for mobile */}
            <button
              onClick={() => setSidebarOpen(false)}
              className="md:hidden text-white hover:text-gray-200 transition-colors"
            >
              <X className="w-6 h-6" />
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
                  className="w-full flex items-center justify-between p-3 text-left font-semibold text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <SectionIcon className="w-5 h-5" />
                    <span className="text-sm md:text-base">
                      {section.title}
                    </span>
                  </div>
                </button>

                <div className="ml-6 md:ml-8 mt-2 space-y-1">
                  {section.items.map((item) => {
                    const ItemIcon = item.icon;
                    return (
                      <button
                        key={item.id}
                        onClick={() => handleSectionClick(item.id)}
                        className={`w-full flex items-center space-x-3 p-2 text-left rounded-lg transition-colors ${
                          activeSection === item.id
                            ? "bg-red-100 text-red-700"
                            : "text-gray-600 hover:bg-gray-100"
                        }`}
                      >
                        <ItemIcon className="w-4 h-4" />
                        <span className="text-sm">{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col ">
        {/* Mobile Header */}
        <div className="bg-white shadow-sm p-4 md:hidden">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen(true)}
              className="text-gray-700 hover:text-gray-900 transition-colors"
            >
              <Menu className="w-6 h-6" />
            </button>
            <h1 className="text-lg font-semibold text-gray-900 truncate">
              {currentContent.title}
            </h1>
            <div className="w-6 h-6"></div> {/* Placeholder for alignment */}
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-4 md:p-8 overflow-y-auto">
          <div className="max-w-6xl mx-auto">
            {/* Desktop Header */}
            <div className="mb-6 md:mb-8 hidden md:block">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                {currentContent.title}
              </h1>
              <p className="text-gray-600 mt-2">
                Manage your profile and settings
              </p>
            </div>

            {currentContent.content}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileDashboard;
