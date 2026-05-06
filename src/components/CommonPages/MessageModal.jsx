import React, { useState, useEffect } from 'react';

export default function MessageModal() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalData, setModalData] = useState({
    to: "john.doe@example.com",
    message: "Hello! This is a sample message to demonstrate the modal functionality. You can put longer messages here and they will display properly with proper word wrapping and spacing.\n\nThis supports multi-line messages as well.",
    time: "2025-01-28 14:30:45"
  });

  const showModal = (to, message, time) => {
    if (to || message || time) {
      setModalData({ 
        to: to || modalData.to, 
        message: message || modalData.message, 
        time: time || modalData.time 
      });
    }
    setIsModalOpen(true);
  };

  const hideModal = () => {
    setIsModalOpen(false);
  };

  const handleReply = () => {
    console.log('Reply to:', modalData.to);
    alert(`Reply to: ${modalData.to}`);
    hideModal();
  };

  // Handle Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isModalOpen) {
        hideModal();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isModalOpen]);

  // Handle body overflow
  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isModalOpen]);

  return (
    <div className="p-5 bg-gray-100 min-h-screen">
      <button 
        onClick={() => showModal()}
        className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-md font-medium transition-colors duration-200 mb-5"
      >
        Show Message Modal
      </button>

      {/* Modal Overlay */}
      {isModalOpen && (
        <div 
          className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 transition-all duration-300 ${
            isModalOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
          }`}
          onClick={hideModal}
        >
          {/* Modal Container */}
          <div 
            className={`bg-white rounded-xl w-11/12 max-w-lg max-h-[80vh] overflow-hidden shadow-2xl transform transition-all duration-300 ${
              isModalOpen ? 'translate-y-0 scale-100' : 'translate-y-8 scale-95'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="px-6 py-5 pb-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-800">Message Details</h3>
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
                <label className="block text-sm font-medium text-gray-600 mb-1.5">To:</label>
                <div className="bg-gray-50 border border-gray-200 rounded-md px-3 py-3 text-sm text-gray-800 min-h-[44px] break-words">
                  {modalData.to}
                </div>
              </div>
              
              <div className="mb-5">
                <label className="block text-sm font-medium text-gray-600 mb-1.5">Message:</label>
                <div className="bg-gray-50 border border-gray-200 rounded-md px-3 py-3 text-sm text-gray-800 min-h-[100px] whitespace-pre-wrap break-words leading-relaxed">
                  {modalData.message}
                </div>
              </div>
              
              <div className="mb-0">
                <label className="block text-sm font-medium text-gray-600 mb-1.5">Time:</label>
                <div className="bg-gray-50 border border-gray-200 rounded-md px-3 py-3 text-sm text-gray-600 min-h-[44px] font-mono">
                  {modalData.time}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end">
              <button 
                onClick={handleReply}
                className="bg-green-500 hover:bg-green-600 text-white px-5 py-2.5 rounded-md text-sm font-medium transition-colors duration-200"
              >
                Reply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}