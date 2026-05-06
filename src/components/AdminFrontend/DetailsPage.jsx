import React from 'react'
import { useLocation } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

const DetailsPage = () => {
    const location =useLocation()
    console.log(location)
  return (
    <div>
      <div className="w-full space-y-5">
          <h1 className="w-full text-2xl border-red-500 border-l-4 border-b-1 px-3 font-semibold">
            Distributor Profile
          </h1>
          <div className="w-full flex justify-end">
            <button className="flex  items-center px-2 py-1 border rounded-md gap-3 font-semibold cursor-pointer text-red-500">
              {" "}
              <ArrowLeft size={15} /> Back
            </button>
          </div>
          <div className="w-full flex items-start justify-center">
            <table className="w-[80%]">
              <tr>
                <td className="p-1 w-[20%] font-semibold">Owner Name : </td>
                <td className="w-[80%]">Pratham Mahamune</td>
              </tr>
              <tr>
                <td className="p-1 w-[20%] font-semibold">Address : </td>
                <td className="w-[80%]">Jagganagtbjasdbdjhjhsdbfja</td>
              </tr>
              <tr>
                <td className="p-1 w-[20%] font-semibold">
                  City / District :{" "}
                </td>
                <td className="w-[80%]">Pratham Mahamune</td>
              </tr>
              <tr>
                <td className="p-1 w-[20%] font-semibold">Country : </td>
                <td className="w-[80%]">Pratham Mahamune</td>
              </tr>
              <tr>
                <td className="p-1 w-[20%] font-semibold">State : </td>
                <td className="w-[80%]">Pratham Mahamune</td>
              </tr>
              <tr>
                <td className="p-1 w-[20%] font-semibold">Town : </td>
                <td className="w-[80%]">Pratham Mahamune</td>
              </tr>
              <tr>
                <td className="p-1 w-[20%] font-semibold">Tehasil : </td>
                <td className="w-[80%]">Pratham Mahamune</td>
              </tr>
              <tr>
                <td className="p-1 w-[20%] font-semibold">Contact No. : </td>
                <td className="w-[80%]">Pratham Mahamune</td>
              </tr>
              <tr>
                <td className="p-1 w-[20%] font-semibold">Pan No. : </td>
                <td className="w-[80%]">Pratham Mahamune</td>
              </tr>
              <tr>
                <td className="p-1 w-[20%] font-semibold">Pin Code : </td>
                <td className="w-[80%]">Pratham Mahamune</td>
              </tr>
            </table>
            <div className="w-[20%] space-y-2">
              <div className="border border-gray-500 h-[200px] w-[200px]"></div>
              <button className="border-red-500 border-2 px-2 py-1 rounded-md text-white bg-red-500 cursor-pointer">
                Inactivate
              </button>
            </div>
          </div>
          <hr />
          <h1 className="w-full text-xl px-3 font-semibold">
            Franchise Under Distributor
          </h1>
          <div className="w-full">
            <table className="w-full divide-y  divide-gray-200">
              <thead style={{ backgroundColor: "#7d0a0a" }}>
                <tr>
                  <th className="px-6 py-2 text-left text-md font-medium text-white uppercase tracking-wider">
                    ID
                  </th>
                  <th className="text-center px-6 py-2 text-md font-medium text-white uppercase tracking-wider">
                    Franchisee Name
                  </th>
                  <th className="text-center px-6 py-2 text-md font-medium text-white uppercase tracking-wider">
                    Email
                  </th>
                  <th className="text-center px-6 py-2 text-md font-medium text-white uppercase tracking-wider">
                    Date
                  </th>
                  <th className="text-center px-6 py-2 text-md font-medium text-white uppercase tracking-wider">
                    Last Login Date
                  </th>
                  <th className="text-center px-6 py-2 text-md font-medium text-white uppercase tracking-wider">
                    Status
                  </th>
                  <th className="text-center px-6 py-2 text-md font-medium text-white uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border-r border-gray-200">
                    1202
                  </td>
                  <td className="px-6 text-center py-4 whitespace-nowrap text-sm text-gray-900 border-r border-gray-200">
                    10
                  </td>
                  <td className="px-6 text-center py-4 whitespace-nowrap text-sm text-gray-900 border-r border-gray-200">
                    10
                  </td>
                  <td className="px-6 text-center py-4 whitespace-nowrap text-sm text-gray-900 border-r border-gray-200">
                    12/6/25
                  </td>
                  <td className="px-6 text-center py-4 whitespace-nowrap text-sm text-gray-900 border-r border-gray-200">
                    12/6/25
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-900 border-r border-gray-200">
                    <p className="px-3 py-1 font-semibold border rounded-lg text-red-500 border-red-500">
                      Inactive
                    </p>
                  </td>
                  <td className="px-6 text-center py-4 whitespace-nowrap text-sm text-gray-900 border-r border-gray-200">
                    <button className="border border-blue-500 px-3 py-1 rounded-md text-blue-500 cursor-pointer">
                      View
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <h1 className="w-full text-xl px-3 font-semibold">
            Points Alloted Log
          </h1>
          <div className="w-full">
            <table className="w-full divide-y  divide-gray-200">
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
                <tr>
                  <td className="px-6 text-center py-4 whitespace-nowrap text-sm text-gray-900 border-r border-gray-200">
                    12/6/25
                  </td>
                  <td className="px-6 text-center py-4 whitespace-nowrap text-sm text-gray-900 border-r border-gray-200">
                    12
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-900 border-r border-gray-200">
                    Admin
                  </td>
                  <td className="px-6 text-center py-4 whitespace-nowrap text-sm text-gray-900 border-r border-gray-200">
                    Distributor
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="w-full flex justify-end">
            <button className="px-3 py-2 rounded-md bg-orange-500 text-white font-semibold cursor-pointer">
              Add Points
            </button>
          </div>
        </div>
    </div>
  )
}

export default DetailsPage
