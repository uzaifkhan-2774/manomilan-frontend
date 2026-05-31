import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import {
  Eye,
  Edit3,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const MemberTable = ({ data }) => {
  const location = useLocation();
  const pathname = location.pathname;

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [gotoPage, setGotoPage] = useState("");
  const itemsPerPage = 20;

  const filteredDistributors = data.filter((distributor) => {
    const matchesSearch =
      distributor.loginEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      distributor.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      distributor.franchiseUnder.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const totalPages = Math.max(1, Math.ceil(filteredDistributors.length / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedDistributors = filteredDistributors.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const handleGoToPage = () => {
    const targetPage = parseInt(gotoPage, 10);
    if (!Number.isInteger(targetPage) || targetPage < 1 || targetPage > totalPages) {
      return;
    }
    setCurrentPage(targetPage);
  };

  React.useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const getStatusBadge = (status) => {
    const baseClasses = "px-3 py-1 rounded-full text-xs font-medium";
    switch (status) {
      case "Active":
        return `${baseClasses} bg-green-100 text-green-800`;
      case "Inactive":
        return `${baseClasses} bg-gray-100 text-gray-800`;
      case "Pending":
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      case "Suspended":
        return `${baseClasses} bg-red-100 text-red-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  return (
    <div className="min-h-screen p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Search and Filter Bar */}
        <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 w-full max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search by email, name, or franchise..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm sm:text-base"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="relative w-full sm:w-auto">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <select
                className="w-full sm:w-auto pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white text-sm sm:text-base"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="All">All Status</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="Pending">Incomplete</option>
              </select>
            </div>
          </div>
        </div>

        {/* Table - Desktop View */}
        <div className="hidden md:block bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead style={{ backgroundColor: "#7d0a0a" }}>
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Username
                  </th>
                  <th
                    className={`px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider ${
                      pathname.includes("/franchise") ? "hidden" : "table-cell"
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
                  <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Registration Date
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
                    className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {distributor.UserId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {distributor.firstName} {distributor.midname}{" "}
                      {distributor.lastName}
                    </td>
                    <td
                      className={`px-6 py-4 whitespace-nowrap text-sm text-gray-900 ${
                        pathname.includes("/franchise") ? "hidden" : "table-cell"
                      }`}
                    >
                      {distributor.franchiseUnder}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={getStatusBadge(distributor.userPhotoStatus)}>
                        {distributor.userPhotoStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {distributor.loginNumber}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(distributor.createdAt).toLocaleDateString()}
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
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Card View - Mobile */}
        <div className="block md:hidden space-y-4">
          {paginatedDistributors.map((distributor) => (
            <div
              key={distributor.UserId}
              className="bg-white p-4 rounded-lg shadow-sm border border-gray-200"
            >
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-semibold text-gray-800">
                  {distributor.firstName} {distributor.lastName}
                </h3>
                <span
                  className={getStatusBadge(
                    distributor.ActiveStatus ? "Active" : "Inactive"
                  )}
                >
                  {distributor.ActiveStatus ? "Active" : "Inactive"}
                </span>
              </div>
              <p className="text-sm text-gray-500 mb-1">
                <strong>ID:</strong> {distributor.UserId}
              </p>
              {!pathname.includes("/franchise") && (
                <p className="text-sm text-gray-500 mb-1">
                  <strong>Franchise:</strong> {distributor.franchiseUnder}
                </p>
              )}
              <p className="text-sm text-gray-500 mb-1">
                <strong>Phone:</strong> {distributor.loginNumber}
              </p>
              <p className="text-sm text-gray-500 mb-1">
                <strong>Photo Status:</strong>{" "}
                <span className={getStatusBadge(distributor.userPhotoStatus)}>
                  {distributor.userPhotoStatus}
                </span>
              </p>
              <p className="text-sm text-gray-500">
                <strong>Registered:</strong>{" "}
                {new Date(distributor.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {filteredDistributors.length > 0 && (
          <div className="bg-white px-6 py-4 border-t border-gray-200 mt-4 rounded-lg shadow-sm flex flex-col sm:flex-row items-center justify-between">
            <div className="text-sm text-gray-700 mb-2 sm:mb-0">
              Showing {startIndex + 1} to{" "}
              {Math.min(startIndex + itemsPerPage, filteredDistributors.length)} of{" "}
              {filteredDistributors.length} results
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2 gap-2">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </button>

                <span className="text-sm text-gray-700">
                  Page {currentPage} of {totalPages}
                </span>

                <button
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={gotoPage}
                  onChange={(e) => setGotoPage(e.target.value.replace(/[^0-9]/g, ""))}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleGoToPage();
                    }
                  }}
                  className="w-16 px-2 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-red-500"
                  placeholder="Page"
                />
                <button
                  type="button"
                  onClick={handleGoToPage}
                  disabled={
                    !gotoPage ||
                    Number(gotoPage) < 1 ||
                    Number(gotoPage) > totalPages
                  }
                  className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                >
                  Go
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {filteredDistributors.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg mb-2">No members found</div>
            <div className="text-gray-400">
              Try adjusting your search or filter criteria
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MemberTable;
