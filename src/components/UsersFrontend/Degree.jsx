import React, { useState, useEffect } from 'react';
import axios from 'axios';

const StreamDegreeTable = () => {
  const [streams, setStreams] = useState([]);
  const [degreesByStream, setDegreesByStream] = useState({});
  const [selectedEducation, setSelectedEducation] = useState([]);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchStreams = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/user/get-all-stream');
        if (response.data.status) {
          setStreams(response.data.data);
          fetchDegreesForStreams(response.data.data);
        } else {
          setErrors({ education: { message: response.data.message } });
        }
      } catch (err) {
        setErrors({ education: { message: 'Failed to fetch streams: ' + err.message } });
      }
    };
    fetchStreams();
  }, []);

  const fetchDegreesForStreams = async (streams) => {
    const degreesData = {};
    for (const stream of streams) {
      try {
        const response = await axios.post('http://localhost:8000/api/user/get-degree-by-stream', null, {
          params: { stream: stream.stream },
        });
        if (response.data.status) {
          degreesData[stream.stream] = response.data.data;
        }
      } catch (err) {
        console.error(`Failed to fetch degrees for ${stream.stream}:`, err);
      }
    }
    setDegreesByStream(degreesData);
  };

  const handleDegreeToggle = (degree, category) => {
    const isSelected = selectedEducation.some((edu) => edu.degree === degree && edu.category === category);
    if (isSelected) {
      setSelectedEducation(selectedEducation.filter((edu) => !(edu.degree === degree && edu.category === category)));
    } else {
      if (selectedEducation.length >= 5) {
        setErrors({ education: { message: 'You can select up to 5 degrees only' } });
        return;
      }
      setSelectedEducation([...selectedEducation, { degree, category }]);
    }
    setErrors({});
  };

  const educationCategories = streams.map((stream) => ({
    name: stream.stream,
    degrees: (degreesByStream[stream.stream] || []).map((degree) => degree.degree),
  }));

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <span className="text-xl font-bold text-gray-600">
          ( Maximum 5 fields )
        </span>
      </div>

      <div className="bg-white border border-red-200 rounded-lg overflow-hidden mb-4">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-red-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-red-800 border-r border-red-200">
                  Category
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-red-800">
                  Degrees
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-red-200">
              {educationCategories.map((category) => (
                <tr key={category.name} className="hover:bg-red-25">
                  <td className="px-4 py-3 font-medium text-red-700 border-r border-red-200 bg-red-25">
                    {category.name}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-2">
                      {category.degrees.map((degree) => {
                        const isSelected = selectedEducation.some(
                          (edu) => edu.degree === degree && edu.category === category.name
                        );
                        const isDisabled = !isSelected && selectedEducation.length >= 5;

                        return (
                          <button
                            key={degree}
                            type="button"
                            onClick={() => handleDegreeToggle(degree, category.name)}
                            disabled={isDisabled}
                            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                              isSelected
                                ? 'bg-red-600 text-white hover:bg-red-700'
                                : isDisabled
                                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                : 'bg-gray-100 text-gray-700 hover:bg-red-100 hover:text-red-700 border border-gray-300'
                            }`}
                          >
                            {degree}
                            {isSelected ? <span className="ml-1">✓</span> : null}
                          </button>
                        );
                      })}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {errors.education && (
        <p className="text-red-500 text-sm mt-2">
          {errors.education.message || 'Please select at least one degree'}
        </p>
      )}
    </div>
  );
};

export default StreamDegreeTable;