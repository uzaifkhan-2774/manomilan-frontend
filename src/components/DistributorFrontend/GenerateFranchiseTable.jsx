import { useState, useEffect } from "react";
import { Search, ArrowLeft, X, Watch } from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";

const PackagesModal = ({
  getPackageDetails = [],
  getVIPPackageDetails = [],
  setClickMain,
  franId,
  getFranchisePackages,
}) => {
  const token = localStorage.getItem("distributorToken");
  const [vipPackage, setVipPackage] = useState(false);
  const [mainPackage, setMainPackage] = useState(true);
  const [packageId, setPackageId] = useState(null);
  const [packageType, setPackageType] = useState("main"); // 'main' or 'vip'

  function formatDate(isoDate) {
    const date = new Date(isoDate);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    if (!packageId) {
      toast.error("Please select a package first.");
      return;
    }

    const payload = {
      packageId: packageId,
      franchiseId: franId,
      franchiseShare: data.franchiseShare,
      packageType: packageType, // for logging or API logic if needed
    };

    try {
      const response = await axios.post(
        "http://localhost:8000/api/distributor/give-package-to-franchise",
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data?.status) {
        setClickMain(false);
        toast.success(response.data?.message);
        getFranchisePackages(franId);
        // Optional: Refresh list or state in parent
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to allot package");
    }
  };

  const handleMainSelect = (e) => {
    const selected = getPackageDetails.find(
      (pkg) => pkg._id === e.target.value
    );

    if (selected) {
      setPackageId(selected._id);
      reset({
        mainPackageName: selected.packageName,
        mainMemberCost: selected.memberCost,
        franchiseShare: selected.franchiseeShare,
        mainDateOfCreation: formatDate(selected.createdAt),
        mainValidity: selected.validity,
        mainAdminShare: selected.adminShare,
      });
    }
  };

  const handleVIPSelect = (e) => {
    const selected = getVIPPackageDetails.find(
      (pkg) => pkg._id === e.target.value
    );
    if (selected) {
      setPackageId(selected._id); // ← Fix this line (was missing)
      reset({
        vipPackageName: selected.packageName,
        vipMemberCost: selected.memberCost,
        franchiseShare: selected.franchiseeShare,
        vipDateOfCreation: formatDate(selected.createdAt),
        vipValidity: selected.validity,
        vipAdminShare: selected.adminShare,
      });
    }
  };

  const watchMainMemberCost = watch("mainMemberCost");
  const watchMainFranchiseeShare = watch("mainFranchiseeShare");
  const watchMainAdminShare = watch("mainAdminShare");

  const watchVIPMemberCost = watch("vipMemberCost");
  const watchVIPFranchiseeShare = watch("vipFranchiseeShare");
  const watchVIPAdminShare = watch("vipAdminShare");

  return (
    <div className="w-full h-svh fixed top-0 left-0 bg-[rgba(0,0,0,0.5)] flex justify-center items-center">
      <div className="w-1/2 bg-white rounded-md shadow-md p-4 space-y-4">
        <div className="w-full flex justify-end">
          <X
            className="font-bold text-red-600 cursor-pointer"
            onClick={() => {
              setClickMain(false);
            }}
          />
        </div>
        <h1 className="text-lg font-semibold text-center">Allot Packages</h1>
        <div className="w-full flex gap-4 items-center">
          <button
            className={` ${
              mainPackage ? "bg-[#7d0a0a]" : "bg-gray-500"
            } font-semibold text-white p-1 rounded-md`}
            onClick={() => {
              setMainPackage(true);
              setVipPackage(false);
              setPackageType("main");
              reset();
            }}
          >
            Main Package
          </button>

          <button
            className={`${
              vipPackage ? "bg-[#7d0a0a]" : "bg-gray-500"
            } font-semibold text-white p-1 rounded-md`}
            onClick={() => {
              setVipPackage(true);
              setMainPackage(false);
              setPackageType("vip");
              reset();
            }}
          >
            VIP Package
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          {mainPackage ? (
            <div className="space-y-4">
              <div className="w-full py-1 rounded-md border border-gray-500">
                <select
                  className="w-full outline-0 py-1"
                  onChange={handleMainSelect}
                >
                  <option value="Select Package">--Select package--</option>
                  {getPackageDetails
                    .filter((pkg) => pkg.status === "Active")
                    .map((pkg) => (
                      <option key={pkg._id} value={pkg._id}>
                        {pkg.packageName}
                      </option>
                    ))}
                </select>
              </div>
              <div className="flex gap-4 items-center w-full flex-wrap">
                <div className="flex flex-col gap-2">
                  <label>Package Name</label>
                  <input
                    type="text"
                    disabled
                    {...register("mainPackageName")}
                    className="border border-gray-500 py-1 px-4 rounded-md"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label>Member Cost</label>
                  <input
                    type="text"
                    disabled
                    {...register("mainMemberCost")}
                    className="border border-gray-500 py-1 px-4 rounded-md"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label>Admin Share</label>
                  <input
                    type="text"
                    disabled
                    {...register("mainAdminShare")}
                    className="border border-gray-500 py-1 px-4 rounded-md"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label>Franchisee Share</label>
                  <input
                    type="text"
                    {...register("franchiseShare", {
                      validate: (value) => {
                        const numValue = parseFloat(value);
                        const memberCost = parseFloat(watchMainMemberCost);
                        const adminShare = parseFloat(watchMainAdminShare);

                        if (isNaN(numValue)) return "Enter a valid number";
                        if (numValue >= memberCost)
                          return "Must be less than Member Cost";
                        if (numValue >= adminShare)
                          return "Must be less than Admin Share";
                        return true;
                      },
                    })}
                    className="border border-gray-500 py-1 px-4 rounded-md"
                  />
                  {errors.franchiseShare && (
                    <p className="text-red-600 text-sm">
                      {errors.franchiseShare.message}
                    </p>
                  )}
                </div>
                <div className="flex flex-col gap-2">
                  <label>Date of Creation</label>
                  <input
                    type="text"
                    disabled
                    {...register("mainDateOfCreation")}
                    className="border border-gray-500 py-1 px-4 rounded-md"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label>Validity</label>
                  <input
                    type="text"
                    disabled
                    {...register("mainValidity")}
                    className="border border-gray-500 py-1 px-4 rounded-md"
                  />
                </div>
                <div className="w-full flex justify-end">
                  <button
                    className="border-blue-600 border px-4 py-1 bg-blue-500 text-white rounded-sm cursor-pointer font-semibold"
                    type="submit"
                  >
                    Allot
                  </button>
                </div>
              </div>
            </div>
          ) : null}

          {vipPackage ? (
            <div className="space-y-4">
              <div className="w-full py-1 rounded-md border border-gray-500">
                <select
                  className="w-full outline-0 py-1"
                  onChange={handleVIPSelect}
                >
                  <option value="Select Package">--Select package--</option>
                  {getVIPPackageDetails
                    .filter((pkg) => pkg.status === "Active")
                    .map((pkg) => (
                      <option key={pkg._id} value={pkg._id}>
                        {pkg.packageName}
                      </option>
                    ))}
                </select>
              </div>
              <div className="flex gap-4 items-center w-full flex-wrap">
                <div className="flex flex-col gap-2">
                  <label>Package Name</label>
                  <input
                    type="text"
                    disabled
                    {...register("vipPackageName")}
                    className="border border-gray-500 py-1 px-4 rounded-md"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label>Member Cost</label>
                  <input
                    type="text"
                    disabled
                    {...register("vipMemberCost")}
                    className="border border-gray-500 py-1 px-4 rounded-md"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label>Admin Share</label>
                  <input
                    type="text"
                    disabled
                    {...register("vipAdminShare")}
                    className="border border-gray-500 py-1 px-4 rounded-md"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label>Franchisee Share</label>
                  <input
                    type="text"
                    {...register("franchiseShare", {
                      validate: (value) => {
                        const numValue = parseFloat(value);
                        const memberCost = parseFloat(watchVIPMemberCost);
                        const adminShare = parseFloat(watchVIPAdminShare);

                        if (isNaN(numValue)) return "Enter a valid number";
                        if (numValue >= memberCost)
                          return "Must be less than Member Cost";
                        if (numValue >= adminShare)
                          return "Must be less than Admin Share";
                        return true;
                      },
                    })}
                    className="border border-gray-500 py-1 px-4 rounded-md"
                  />
                  {errors.franchiseShare && (
                    <p className="text-red-600 text-sm">
                      {errors.franchiseShare.message}
                    </p>
                  )}
                </div>
                <div className="flex flex-col gap-2">
                  <label>Date of Creation</label>
                  <input
                    type="text"
                    disabled
                    {...register("vipDateOfCreation")}
                    className="border border-gray-500 py-1 px-4 rounded-md"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label>Validity</label>
                  <input
                    type="text"
                    disabled
                    {...register("vipValidity")}
                    className="border border-gray-500 py-1 px-4 rounded-md"
                  />
                </div>
                <div className="w-full flex justify-end">
                  <button
                    className="border-blue-600 border px-4 py-1 bg-blue-500 text-white rounded-sm cursor-pointer font-semibold"
                    type="submit"
                  >
                    Allot
                  </button>
                </div>
              </div>
            </div>
          ) : null}
        </form>
      </div>
    </div>
  );
};

export default function TableGenerator({ data, activeTab }) {
  const token = localStorage.getItem("distributorToken");
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [addModal, setAddModal] = useState(false);
  const [lastTab, setLastTab] = useState(activeTab);
  const [singleFranchisee, setSingleFranchisee] = useState({});
  const [location, setLocation] = useState({
    city: null,
    state: null,
    country: null,
  });
  const [clickMain, setClickMain] = useState(false);
  const [addPoints, setAddPoints] = useState({
    points: null,
    password: null,
  });
  const [pointsLog, setPointsLog] = useState([]);
  const [franId, setFranId] = useState(null);

  // packages alloting here
  const [getPackageDetails, setGetPackageDetails] = useState([]);
  const [getVIPPackageDetails, setGetVIPPackageDetails] = useState([]);
  const getMainPackagesDetails = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/api/admin/get-main-packages"
      );
      if (response.data.status) {
        setGetPackageDetails(response.data?.existingPackages);
      }
      console.log(response.data);
    } catch (error) {
      console.log(error);
    }
  };
  const getVIPPackagesDetails = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/api/admin/get-vip-packages"
      );
      if (response.data.length > 0) {
        setGetVIPPackageDetails(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (activeTab !== lastTab) {
      setShowModal(false);
      setLastTab(activeTab);
    }
  }, [activeTab]);

  const franchise = async (id) => {
    try {
      const response = await axios.post(
        `http://localhost:8000/api/distributor/get-single-franchise`,
        { franchiseId: id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response.data);
      if (response.data.status) {
        setSingleFranchisee(response.data?.franchise);
        // const loc = response.data?.franchise?.location;
        // const arr = loc.split(",");
        // setLocation({
        //   city: arr[0],
        //   state: arr[1],
        //   country: arr[2],
        // });
        getPointsLog(response.data?.singleDistributor?._id); // Fetch logs on click
      }
    } catch (error) {
      console.log(error);
    }
  };

  function formatDate(isoString) {
    const date = new Date(isoString);
    const day = String(date.getDate()).padStart(2, "0"); // DD
    const month = String(date.getMonth() + 1).padStart(2, "0"); // MM
    const year = date.getFullYear(); // YYYY

    return `${day}-${month}-${year}`;
  }

  const addPointsToFranchisee = async () => {
    try {
      const response = await axios.post(
        "http://localhost:8000/api/distributor/give-points-to-franchise",
        {
          Points: addPoints.points,
          transactionPassword: addPoints.password,
          franchiseId: singleFranchisee._id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data?.status) {
        toast.success(response.data?.message);
        getPointsLog();
        return;
      }
      toast.error(response.data?.message);
    } catch (error) {
      console.log(error);
    }
  };

  // points log for franchise
  const getPointsLog = async (distributorId = franId) => {
    if (!distributorId) return;
    try {
      const response = await axios.get(
        `http://localhost:8000/api/distributor/get/franchiseLogs/${distributorId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data.status) {
        setPointsLog(response.data?.franchiseLogs || []);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // getting the package logs
  const [packagesLogs, setPackagesLogs] = useState([]);
  const [selectedFranchiseId, setSelectedFranchiseId] = useState(null);

  const getFranchisePackages = async (franchiseId) => {
    console.log(franchiseId);
    try {
      const response = await axios.get(
        `http://localhost:8000/api/franchise/get-packages/${franchiseId}`
      );
      console.log(response.data);
      if (response.data.status) {
        setPackagesLogs(response.data.franchisePackages); // update table data
        setSelectedFranchiseId(franchiseId);
      }
    } catch (error) {
      console.log("Fetch error:", error);
    }
  };

  // inactivate franchisee
  const inactivateFranchise = async (franchiseId) => {
    console.log(franchiseId)
    try {
      const res = await axios.put(
        "http://localhost:8000/api/distributor/inactivate-franchise",
        {
          franchiseId: franchiseId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // attach your JWT token here
          },
        }
      );
      if(res.data.status){
        toast.success(res.data.message)
      }else{
        toast.warn(res.data.message)
      }
    } catch (error) {
      console.error("Error inactivating franchise:", error);
    }
  };

  return !showModal ? (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl w-full mx-auto">
        {/* Search Bar */}
        <div className="mb-6 w-full">
          <div className="relative max-w-md mx-auto">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search by Name, Address, or Email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-red-500 focus:border-transparent transition duration-150 ease-in-out"
            />
          </div>
        </div>
        {/* Table Container */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead style={{ backgroundColor: "#7d0a0a" }}>
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Franchise Name
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Address
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Created On
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {data.length > 0 ? (
                  data.map((user, index) => (
                    <tr
                      key={user._id}
                      className={
                        index % 2 === 0
                          ? "bg-white hover:bg-red-50"
                          : "bg-gray-50 hover:bg-red-50"
                      }
                      style={{
                        transition: "background-color 0.15s ease-in-out",
                      }}
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border-r border-gray-200">
                        {user.distributorName
                          ? user.distributorName
                          : user.franchiseName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border-r border-gray-200">
                        {user.mobileNumber}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {user.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {user.address}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatDate(user.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <button
                          className="border-1 p-2 cursor-pointer rounded-2xl hover:bg-[#7d0a0a] hover:text-white transition-all"
                          onClick={() => {
                            setShowModal(!showModal);
                            franchise(user._id);
                            setFranId(user._id);
                            getPointsLog(user._id);
                            getFranchisePackages(user?._id);
                          }}
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="7"
                      className="px-6 py-8 text-center text-gray-500"
                    >
                      <div className="flex flex-col items-center">
                        <Search className="h-12 w-12 mb-4 text-gray-300" />
                        <p className="text-lg font-medium">No users found</p>
                        <p className="text-sm mt-1">
                          Try adjusting your search terms
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        {/* Footer */}
        <div className="mt-8 text-center text-gray-500 text-sm">
          <p>
            Use the search bar above to filter users by ID, name, or email
            address.
          </p>
        </div>
      </div>
    </div>
  ) : (
    <div>
      <div className="w-full space-y-5">
        <h1 className="w-full text-2xl border-red-500 border-l-4 border-b-1 px-3 font-semibold">
          Franchisee Profile
        </h1>
        <div className="w-full flex justify-end">
          <button
            className="flex items-center px-2 py-1 border rounded-md gap-3 font-semibold cursor-pointer text-red-500"
            onClick={() => setShowModal(!showModal)}
          >
            <ArrowLeft size={15} /> Back
          </button>
        </div>
        <div className="w-full flex items-start justify-center">
          <table className="w-[80%]">
            <tbody>
              <tr>
                <td className="p-1 w-[20%] font-semibold">Owner Name : </td>
                <td className={`w-[80%] ${singleFranchisee.Status==="inactive"?"text-red-600":"text-black"}`}>{singleFranchisee?.ownerName || ""}</td>
              </tr>
              <tr>
                <td className="p-1 w-[20%] font-semibold">Email : </td>
                <td className="w-[80%]">{singleFranchisee?.email || ""}</td>
              </tr>
              <tr>
                <td className="p-1 w-[20%] font-semibold">Address : </td>
                <td className="w-[80%]">{singleFranchisee?.address || ""}</td>
              </tr>
              <tr>
                <td className="p-1 w-[20%] font-semibold">
                  City / District :{" "}
                </td>
                <td className="w-[80%]">{location.city || "-"}</td>
              </tr>
              <tr>
                <td className="p-1 w-[20%] font-semibold">State : </td>
                <td className="w-[80%]">{location.state || "-"}</td>
              </tr>
              <tr>
                <td className="p-1 w-[20%] font-semibold">Country : </td>
                <td className="w-[80%]">{location.country || "-"}</td>
              </tr>
              <tr>
                <td className="p-1 w-[20%] font-semibold">Contact No. : </td>
                <td className="w-[80%]">{singleFranchisee?.mobileNumber}</td>
              </tr>
              <tr>
                <td className="p-1 w-[20%] font-semibold">Pan No. : </td>
                <td className="w-[80%]">{singleFranchisee?.panNumber}</td>
              </tr>
              <tr>
                <td className="p-1 w-[20%] font-semibold">Adhar No. : </td>
                <td className="w-[80%]">{singleFranchisee?.adharNumber}</td>
              </tr>
              {/* <tr>
                <td className="p-1 w-[20%] font-semibold">Pin Code : </td>
                <td className="w-[80%]">{singleFranchisee.pin}</td>
              </tr> */}
            </tbody>
          </table>
          <div className="w-[20%] flex flex-col gap-15 items-start space-y-2">
            <div className="border border-gray-500 h-[200px] w-[200px]">
              <img
                src={`http://localhost:8000/upload/${singleFranchisee.franchisePhoto}`}
                alt=""
              />
            </div>
            {/* <button
              className="border-red-500 border-2 px-2 py-1 rounded-md text-white bg-red-500 cursor-pointer"
              onClick={()=>inactivateFranchise(singleFranchisee?._id)}
            >
              Inactivate
            </button> */}
          </div>
        </div>
        <hr />
        <h1 className="w-full text-xl px-3 font-semibold">
          Shares of Main Package
        </h1>
        <div className="w-full">
          <table className="w-full divide-y divide-gray-200">
            <thead style={{ backgroundColor: "#7d0a0a" }}>
              <tr>
                <th className="text-center px-6 py-2 text-md font-medium text-white uppercase tracking-wider">
                  Franchisee Share
                </th>
                <th className="text-center px-6 py-2 text-md font-medium text-white uppercase tracking-wider">
                  Franchisee Name
                </th>

                <th className="text-center px-6 py-2 text-md font-medium text-white uppercase tracking-wider">
                  Date
                </th>
                <th className="text-center px-6 py-2 text-md font-medium text-white uppercase tracking-wider">
                  Member Cost
                </th>
                <th className="text-center px-6 py-2 text-md font-medium text-white uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {packagesLogs.length > 0 ? (
                packagesLogs.map((pack) => (
                  <tr key={pack._id}>
                    <td className="px-6 text-center py-4 whitespace-nowrap text-sm text-gray-900 border-r border-gray-200">
                      {pack.franchiseShare}
                    </td>
                    <td className="px-6 text-center py-4 whitespace-nowrap text-sm text-gray-900 border-r border-gray-200">
                      {singleFranchisee.franchiseName}
                    </td>

                    <td className="px-6 text-center py-4 whitespace-nowrap text-sm text-gray-900 border-r border-gray-200">
                      {formatDate(pack.createdAt)}
                    </td>
                    <td className="px-6 text-center py-4 whitespace-nowrap text-sm text-gray-900 border-r border-gray-200">
                      {pack?.mainPackageId?.memberCost ||
                        pack?.vipPackage?.memberCost}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-900 border-r border-gray-200">
                      <p
                        className={`px-3 py-1 font-semibold border rounded-lg ${
                          pack?.mainPackageId?.status ||
                          pack?.vipPackage?.status === "Active"
                            ? "text-green-500 border-green-500"
                            : "text-red-500 border-red-500"
                        } `}
                      >
                        {pack?.mainPackageId?.status ||
                          pack?.vipPackage?.status}
                      </p>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td>No Packages Given</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="w-full flex justify-end gap-3">
          <button
            className="border border-[#7d0a0a] rounded-md py-1 px-2 font-semibold cursor-pointer"
            onClick={() => {
              setClickMain(!clickMain);
              getMainPackagesDetails();
              getVIPPackagesDetails();
            }}
          >
            Allot Package
          </button>
        </div>
        {clickMain ? (
          <PackagesModal
            getPackageDetails={getPackageDetails}
            getVIPPackageDetails={getVIPPackageDetails}
            setClickMain={setClickMain}
            franId={franId}
            getFranchisePackages={getFranchisePackages}
          />
        ) : null}
        <h1 className="w-full text-xl px-3 font-semibold">
          Points Alloted Log
        </h1>
        <div className="w-full">
          <table className="w-full divide-y divide-gray-200">
            <thead style={{ backgroundColor: "#7d0a0a" }}>
              <tr>
                <th className="text-center px-6 py-2 text-md font-medium text-white uppercase tracking-wider">
                  Date
                </th>
                <th className="text-center px-6 py-2 text-md font-medium text-white uppercase tracking-wider">
                  Points
                </th>
                <th className="text-center px-6 py-2 text-md font-medium text-white uppercase tracking-wider">
                  By
                </th>
                <th className="text-center px-6 py-2 text-md font-medium text-white uppercase tracking-wider">
                  To
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {pointsLog.length > 0 ? (
                pointsLog.map((point) => (
                  <tr key={point._id}>
                    <td className="px-6 text-center py-4 whitespace-nowrap text-sm text-gray-900 border-r border-gray-200">
                      {point.createdAt || "-"}
                    </td>
                    <td className="px-6 text-center py-4 whitespace-nowrap text-sm text-gray-900 border-r border-gray-200">
                      {point.points || "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-900 border-r border-gray-200">
                      {point.By || "-"}
                    </td>
                    <td className="px-6 text-center py-4 whitespace-nowrap text-sm text-gray-900 border-r border-gray-200">
                      {singleFranchisee.franchiseName || "-"}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td>No Points to Display</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="w-full flex justify-end">
          <button
            className="px-3 py-2 rounded-md bg-orange-500 text-white font-semibold cursor-pointer"
            onClick={() => setAddModal(!addModal)}
          >
            Add Points
          </button>
        </div>
      </div>
      {addModal ? (
        <div className="h-svh w-full bg-[rgba(0,0,0,0.5)] fixed top-0 right-0 flex items-center justify-center">
          <div className="w-[500px] h-auto bg-white shadow-md rounded-md flex flex-col gap-5 justify-center items-left p-3">
            <div className="flex w-full justify-end">
              <button
                className="bg-red-500 text-white font-semibold px-3 py-1 rounded-md cursor-pointer"
                onClick={() => setAddModal(!addModal)}
              >
                Close
              </button>
            </div>
            <div>
              <label htmlFor="Points" className="text-lg font-semibold">
                Points :{" "}
              </label>
              <input
                type="text"
                className="border border-gray-500 py-1 px-3 rounded-md"
                placeholder="Enter Points"
                onChange={(e) => {
                  setAddPoints((prev) => ({
                    ...prev,
                    points: e.target.value,
                  }));
                }}
              />
            </div>
            <div>
              <label htmlFor="Points" className="text-lg font-semibold">
                Enter Transaction Password :{" "}
              </label>
              <input
                type="password"
                className="border border-gray-500 py-1 px-3 rounded-md"
                placeholder="Enter Password"
                onChange={(e) => {
                  setAddPoints((prev) => ({
                    ...prev,
                    password: e.target.value,
                  }));
                }}
              />
            </div>
            <button
              className="border p-2 rounded-2xl border-blue-400 bg-blue-400 font-semibold text-white cursor-pointer"
              onClick={() => {
                setAddModal(!addModal);
                addPointsToFranchisee();
              }}
            >
              Add Points
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
