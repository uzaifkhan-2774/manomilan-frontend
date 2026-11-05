import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";

export default function TableGenerator({ data, activeTab }) {
  let token = null;
  const location = useLocation();
  const dateChanger = (date) => {
    return new Date(date).toLocaleDateString();
  };
  const setLocation = (location) => {
    const locResult = location.split(",");
    const result = {
      city: locResult[0],
      state: locResult[1],
      country: locResult[2],
    };
    return result;
  };
  const [distId, setDistId] = useState(null);

  token = localStorage.getItem("adminToken");

  const [searchTerm, setSearchTerm] = useState("");
  const [displayFranchiseUnderDist, setDisplayFranchiseUnderDist] = useState(
    []
  );
  const [singleDist, setSingleDist] = useState({});
  const [showModal, setShowModal] = useState(false);
  // add points modal
  const [addModal, setAddModal] = useState(false);
  const [lastTab, setLastTab] = useState(activeTab);
  const [usId, setUsId] = useState(null);
  const [pointsLog, setPointsLog] = useState([]);
  useEffect(() => {
    if (activeTab !== lastTab) {
      singleFranchise;
      setShowModal(false);
      setLastTab(activeTab);
    }
  }, [activeTab]);

  // Filter users based on search term
  const filteredUsers = data.filter(
    (user) =>
      user._id.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.franchiseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      // user.distributorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  //show single distributor
  const singleFranchise = async (userId) => {
    try {
      const response = await axios.get(
        `https://api.manomilan.com/api/admin/get-single-franchise/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response.data);
      if (response.data.status) {
        setSingleDist(response.data.singleFranchise);
        setDistId(response.data?.singleFranchise?._id);
        return;
      }
      toast.error(response.data?.message || "something went wrong");
    } catch (error) {
      console.log(error);
    }
  };
  const [addPointsToDist, setAddPointsToDist] = useState({
    distributorId: null,
    points: null,
    givePointsPassword: null,
  });
  const addPointsToSinDist = async () => {
    try {
      const response = await axios.post(
        "https://api.manomilan.com/api/admin/give-points-to-distributor",
        addPointsToDist,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data?.status) {
        getPointsLog();
        toast.success(
          response.data?.message || "Points alloted to distributor"
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getFranchiseUnderDist = async () => {
    try {
      if (distId !== null) {
        const response = await axios.get(
          `https://api.manomilan.com/api/admin/get-franchise-under/${distId}`
        );
        setDisplayFranchiseUnderDist(response.data?.franchiseUnder || []);
      }
      return;
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getFranchiseUnderDist();
  }, [distId]);

  const getPointsLog = async (userId) => {
    try {
      const response = await axios.get(
        `https://api.manomilan.com/api/admin/get/pointsLog/${usId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response.data);
      if (response.data.status) {
        setPointsLog(response.data?.distributorLogs || []);
      }
    } catch (error) {
      console.log(error);
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
        {/* Table Container */}{" "}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead style={{ backgroundColor: "#7d0a0a" }}>
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">
                    {data[0]?.distributorName
                      ? "Distributor Name"
                      : "Franchise Name"}
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
                    Pin
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Created On
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
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user, index) => (
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
                        {user.password}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {dateChanger(user.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {user.status? user.stauts:"Active"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <button
                          className="border-1 p-2 cursor-pointer rounded-2xl hover:bg-[#7d0a0a] hover:text-white transition-all"
                          onClick={() => {
                            setShowModal(!showModal);
                            singleFranchise(user._id);
                            setUsId(user._id);
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
                      colSpan="3"
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
          Franchise Profile
        </h1>
        <div className="w-full flex justify-end">
          <button
            className="flex  items-center px-2 py-1 border rounded-md gap-3 font-semibold cursor-pointer text-red-500"
            onClick={() => setShowModal(!showModal)}
          >
            {" "}
            <ArrowLeft size={15} /> Back
          </button>
        </div>
        <div className="w-full flex items-start justify-center">
          <table className="w-[80%]">
            <tbody>
              <tr>
                <td className="p-1 w-[20%] font-semibold">Franchisee Name : </td>
                <td className="w-[80%]">{singleDist?.franchiseName || ""}</td>
              </tr>
              <tr>
                <td className="p-1 w-[20%] font-semibold">Owner Name : </td>
                <td className="w-[80%]">{singleDist?.ownerName || ""}</td>
              </tr>
              <tr>
                <td className="p-1 w-[20%] font-semibold">Address : </td>
                <td className="w-[80%]">{singleDist.address}</td>
              </tr>
              <tr>
                <td className="p-1 w-[20%] font-semibold">Contact No. : </td>
                <td className="w-[80%]">{singleDist.mobileNumber}</td>
              </tr>
              <tr>
                <td className="p-1 w-[20%] font-semibold">Alternate No. : </td>
                <td className="w-[80%]">{singleDist.alternateNumber}</td>
              </tr>
              <tr>
                <td className="p-1 w-[20%] font-semibold">Pan No. : </td>
                <td className="w-[80%]">{singleDist.panNumber}</td>
              </tr>
            </tbody>
          </table>
          <div className="w-[20%] space-y-2">
            <div className="h-[150px] w-[150px]">
              <img
                src={`https://api.manomilan.com/upload/${singleDist.franchisePhoto}`}
                alt="Franchisee"
              />
            </div>
            {location.pathname.includes("admin") ? null : (
              <button className="border-red-500 border-2 px-2 py-1 rounded-md text-white bg-red-500 cursor-pointer">
                Inactivate
              </button>
            )}
          </div>
        </div>
        <hr />
      </div>
    </div>
  );
}
