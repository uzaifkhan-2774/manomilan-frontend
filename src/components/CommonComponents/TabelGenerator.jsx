import { useEffect, useState } from "react";
import { Search, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { useLocation } from "react-router-dom";

export default function TableGenerator({ data, activeTab }) {
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [displayFranchiseUnderDist, setDisplayFranchiseUnderDist] = useState([]);
  const [singleDist, setSingleDist] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [addModal, setAddModal] = useState(false);
  const [lastTab, setLastTab] = useState(activeTab);
  const [usId, setUsId] = useState(null);
  const [distId, setDistId] = useState(null);
  const [pointsLog, setPointsLog] = useState([]);

  const [addPointsToDist, setAddPointsToDist] = useState({
    distributorId: null,
    points: "",
    givePointsPassword: "",
  });

  const token = location.pathname.includes("admin")
    ? localStorage.getItem("adminToken")
    : localStorage.getItem("distributorToken");

  const dateChanger = (date) => {
    return new Date(date).toLocaleDateString("en-IN");
  };

  const filteredUsers = data.filter((user) =>
    [user._id, user.franchiseName, user.distributorName, user.email]
      .some(val => val?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  useEffect(() => {
    if (activeTab !== lastTab) {
      setShowModal(false);
      setLastTab(activeTab);
    }
  }, [activeTab]);

  const singleDistributor = async (userId) => {
    try {
      const response = await axios.get(
        `https://api.manomilan.com/api/admin/get-single-distributor/${userId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log(response.data)
      if (response.data.status) {
        setSingleDist(response.data?.singleDistributor);
        setDistId(response.data?.singleDistributor?._id);
        setAddPointsToDist(prev => ({
          ...prev,
          distributorId: response.data?.singleDistributor?._id,
        }));
        getPointsLog(response.data?.singleDistributor?._id); // Fetch logs on click
      } else {
        toast.error(response.data?.message || "Something went wrong");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const inactiveDistributor=async(dist)=>{
    const result=confirm("Are you sure to inactivate distributor!")
    if(result){
      try {
        const response = await axios.put("https://api.manomilan.com/api/admin/inactivate-distributor",{
        distributorId : dist._id
      },{
        headers:{
          Authorization:`Bearer ${token}`
        }
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
  }

  const getFranchiseUnderDist = async () => {
    if (distId) {
      try {
        const response = await axios.get(
          `https://api.manomilan.com/api/admin/get-franchise-under/${distId}`
        );
        setDisplayFranchiseUnderDist(response.data?.franchiseUnder || []);
      } catch (error) {
        console.log(error);
      }
    }
  };

  // distributor logs 
  const getPointsLog = async (distributorId = usId) => {
    if (!distributorId) return;
    try {
      const response = await axios.get(
        `https://api.manomilan.com/api/admin/get/pointsLog/${distributorId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data.status) {
        setPointsLog(response.data?.distributorLogs || []);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const addPointsToSinDist = async () => {
    try {
      const response = await axios.post(
        "https://api.manomilan.com/api/admin/give-points-to-distributor",
        addPointsToDist,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log(response.data)
      if (response.data?.status) {
        toast.success(response.data?.message || "Points allotted successfully");
        getPointsLog();
        setAddModal(false); // Close modal only on success
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to allot points");
    }
  };

  useEffect(() => {
    getFranchiseUnderDist();
  }, [distId]);

  return !showModal ? (
    <div className="min-h-screen bg-gray-50 p-4">
      {/* SEARCH BAR */}
      <div className="mb-6">
        <div className="relative max-w-md mx-auto">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search by Name, Address, or Email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-3 py-3 border border-gray-300 rounded-lg w-full"
          />
        </div>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto shadow bg-white rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead style={{ backgroundColor: "#7d0a0a" }}>
            <tr>
              {["Name", "Contact", "Email", "Address","Pin", "Created On", "Status", "Actions"].map(header => (
                <th key={header} className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length ? (
              filteredUsers.map((user, index) => (
                <tr
                  key={user._id}
                  className={`${
                    index % 2 === 0 ? "bg-white" : "bg-gray-50"
                  } hover:bg-red-50 transition-all`}
                >
                  <td className="px-6 py-4">{user.distributorName || user.franchiseName}</td>
                  <td className="px-6 py-4">{user.mobileNumber}</td>
                  <td className="px-6 py-4">{user.email}</td>
                  <td className="px-6 py-4">{user.address}</td>
                  <td className="px-6 py-4">{user.password}</td>
                  <td className="px-6 py-4">{dateChanger(user.createdAt)}</td>
                  <td className="px-6 py-4">Active</td>
                  <td className="px-6 py-4">
                    <button
                      className="p-2 border rounded-2xl hover:bg-[#7d0a0a] hover:text-white"
                      onClick={() => {
                        setShowModal(true);
                        singleDistributor(user._id);
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
                <td colSpan={7} className="text-center py-8 text-gray-500">
                  <Search className="h-10 w-10 mx-auto text-gray-300" />
                  <p>No users found. Adjust your search.</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  ) : (
    // DETAILED VIEW + ADD MODAL
    <div className="p-5">
      {/* BACK BUTTON */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold border-l-4 border-red-500 pl-2">Distributor Profile</h2>
        <button
          className="flex items-center text-red-500 font-semibold gap-2"
          onClick={() => setShowModal(false)}
        >
          <ArrowLeft size={16} /> Back
        </button>
      </div>

      {/* DETAILS + ADD POINTS + MODALS */}
      
      <div className="w-full flex items-start justify-center gap-6">
  <table className="w-[70%] border border-gray-300 rounded-md">
    <tbody>
      <tr>
        <td className="p-2 font-semibold w-[30%] border-b">Owner Name:</td>
        <td className="p-2 border-b">{singleDist.ownerName || "-"}</td>
      </tr>
      <tr>
        <td className="p-2 font-semibold border-b">Address:</td>
        <td className="p-2 border-b">{singleDist.address || "-"}</td>
      </tr>
      <tr>
        <td className="p-2 font-semibold border-b">City / District:</td>
        <td className="p-2 border-b">{singleDist.city || "-"}</td>
      </tr>
      <tr>
        <td className="p-2 font-semibold border-b">State:</td>
        <td className="p-2 border-b">{singleDist.state || "-"}</td>
      </tr>
      <tr>
        <td className="p-2 font-semibold border-b">Country:</td>
        <td className="p-2 border-b">{singleDist.country || "-"}</td>
      </tr>
      <tr>
        <td className="p-2 font-semibold border-b">Contact No.:</td>
        <td className="p-2 border-b">{singleDist.mobileNumber || "-"}</td>
      </tr>
      <tr>
        <td className="p-2 font-semibold border-b">Pan No.:</td>
        <td className="p-2 border-b">{singleDist.panNumber || "-"}</td>
      </tr>
      <tr>
        <td className="p-2 font-semibold">Pin Code:</td>
        <td className="p-2">{singleDist.pincode || "-"}</td>
      </tr>
    </tbody>
  </table>

  <div className="w-[25%] gap-4 space-y-4 flex flex-col items-center">
    <div className="border border-gray-400 w-48 h-48 rounded-md bg-gray-100 flex items-center justify-center text-gray-400">
      <img src={`https://api.manomilan.com/upload/${singleDist.distributorPhoto}`} alt="distributor photo" />
    </div>
    <button className="bg-red-500 text-white px-4 py-2 rounded-md font-semibold hover:bg-red-600 transition" onClick={()=>{inactiveDistributor(singleDist)}}>
      Inactivate
    </button>
  </div>
</div>
<h2 className="text-xl font-semibold mt-8 mb-4 border-l-4 border-red-500 pl-2">
  Points Allotted Log
</h2>

<div className="w-full overflow-x-auto">
  <table className="min-w-full divide-y divide-gray-200 border rounded-md">
    <thead style={{ backgroundColor: "#7d0a0a" }}>
      <tr>
        <th className="text-center px-6 py-3 text-md font-medium text-white uppercase tracking-wider">Date</th>
        <th className="text-center px-6 py-3 text-md font-medium text-white uppercase tracking-wider">Points</th>
        <th className="text-center px-6 py-3 text-md font-medium text-white uppercase tracking-wider">Given By</th>
        <th className="text-center px-6 py-3 text-md font-medium text-white uppercase tracking-wider">To (Distributor)</th>
      </tr>
    </thead>
    <tbody className="bg-white divide-y divide-gray-200">
      {pointsLog.length > 0 ? (
        pointsLog.map((ele) => (
          <tr key={ele._id}>
            <td className="text-center px-6 py-3 text-sm text-gray-900 border-r">{new Date(ele.createdAt).toLocaleDateString("en-IN")}</td>
            <td className={`text-center px-6 py-3 text-sm ${ele.points > 0 ?"text-gray-900":"text-red-500"} border-r border-gray-900`}>{ele.points}</td>
            <td className="text-center px-6 py-3 text-sm text-gray-900 border-r">ADMIN</td>
            <td className="text-center px-6 py-3 text-sm text-gray-900">{singleDist.distributorName || "-"}</td>
          </tr>
        ))
      ) : (
        <tr>
          <td colSpan="4" className="text-center py-4 text-sm text-gray-500">
            No points allotted
          </td>
        </tr>
      )}
    </tbody>
  </table>
</div>
<div className="w-full flex justify-end mt-4">
          <button
            className="px-3 py-2 rounded-md bg-orange-500 text-white font-semibold cursor-pointer"
            onClick={() => setAddModal(!addModal)}
          >
            Add Points
          </button>
        </div>

      {/* ADD MODAL CLOSE BUTTON EXAMPLE */}
      {addModal && (
        <div className="fixed top-0 left-0 h-full w-full bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-5 rounded-md w-[400px] space-y-4 relative">
            <button
              className="absolute top-2 right-2 text-red-500 font-bold"
              onClick={() => setAddModal(false)}
            >
              ✕
            </button>
            <div>
              <label className="block font-semibold">Points</label>
              <input
                type="number"
                className="w-full border p-2 rounded"
                placeholder="Enter Points"
                onChange={(e) =>
                  setAddPointsToDist((prev) => ({
                    ...prev,
                    points: e.target.value,
                  }))
                }
              />
            </div>
            <div>
              <label className="block font-semibold">Transaction Password</label>
              <input
                type="password"
                className="w-full border p-2 rounded"
                placeholder="Enter Password"
                onChange={(e) =>
                  setAddPointsToDist((prev) => ({
                    ...prev,
                    givePointsPassword: e.target.value,
                  }))
                }
              />
            </div>
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded w-full"
              onClick={addPointsToSinDist}
            >
              Submit
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

