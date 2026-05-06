import React, { useState } from 'react';
// import { useAppContext } from '../../Context/UserRegisterContext';

const MultiSelectionTable = ({label1,label2,label3,optionsOne,optionsTwo,optionsThree}) => {
  const [dropdown1, setDropdown1] = useState('');
  const [dropdown2, setDropdown2] = useState('');
  const [dropdown3, setDropdown3] = useState('');
  const [tableData, setTableData] = useState([]);

  const dropdown1Options = optionsOne;
  const dropdown2Options = optionsTwo;
  const dropdown3Options = optionsThree;

  const {formData,setFormData}=useAppContext()

  const handleAdd = () => {
    const newEntry = {
      id: Date.now(),
      dropdown1: dropdown1 || 'ANY',
      dropdown2: dropdown2 || 'ANY',
      dropdown3: dropdown3 || 'ANY'
    };

    setTableData([...tableData, newEntry]);
    setDropdown1('');
    setDropdown2('');

    setDropdown3('');
  };



  const handleRemove = (id) => {
    setTableData(tableData.filter(item => item.id !== id));
  };

  const showAddButton = dropdown1 || dropdown2 || dropdown3;

  return (
    <div className="p-4 sm:p-6 max-w-8xl bg-white">
      {/* Dropdowns Section */}
      <div className="mb-6 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-6 gap-4">
          {/* Dropdown 1 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {label1}
            </label>
            <select
              value={dropdown1}
              onChange={(e) => setDropdown1(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <option value="">Select {label1}</option>
              {dropdown1Options.map((option, index) => (
                <option key={index} value={option}>{option}</option>
              ))}
            </select>
          </div>

          {/* Dropdown 2 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {label2}
            </label>
            <select
              value={dropdown2}
              onChange={(e) => setDropdown2(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <option value="">Select {label2} </option>
              {dropdown2Options.map((option, index) => (
                <option key={index} value={option}>{option}</option>
              ))}
            </select>
          </div>

          {/* Dropdown 3 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {label3}
            </label>
            <select
              value={dropdown3}
              onChange={(e) => setDropdown3(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <option value="">Select {label3}</option>
              {dropdown3Options.map((option, index) => (
                <option key={index} value={option}>{option}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Add Button */}
        {showAddButton && (
          <div className="flex justify-center mt-4">
            <button
              onClick={handleAdd}
              className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-6 rounded-md transition duration-200"
            >
              Add to Table
            </button>
          </div>
        )}
      </div>

      {/* Table Section */}
      {tableData.length > 0 ? (
        <div className="mt-8 overflow-x-auto">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">Generated Table</h2>
          <table className="min-w-full bg-white border border-gray-200 rounded-md shadow-sm text-sm">
            <thead className="bg-[#7d0a0a] text-white font-semibold">
              <tr>
                <th className="px-4 py-3 border">{label1}</th>
                <th className="px-4 py-3 border">{label2}</th>
                <th className="px-4 py-3 border">{label3}</th>
                <th className="px-4 py-3 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {tableData.map((row) => (
                <tr key={row.id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 border">{row.dropdown1}</td>
                  <td className="px-4 py-2 border">{row.dropdown2}</td>
                  <td className="px-4 py-2 border">{row.dropdown3}</td>
                  <td className="px-4 py-2 border">
                    <button
                      onClick={() => handleRemove(row.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="mt-8 text-center text-gray-500">
        </div>
      )}
    </div>
  );
};

export default MultiSelectionTable;
