import React, { useState, useEffect } from 'react';
import { User, Package, Plus, Minus, Check } from 'lucide-react';

const PackageAllot = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [availablePackages, setAvailablePackages] = useState({
    main: [],
    addOn: []
  });
  const [allottedPackages, setAllottedPackages] = useState({
    main: [],
    addOn: []
  });

  // Mock data - replace with actual API calls
  useEffect(() => {
    // Mock users data
    setUsers([
      { id: 1, name: 'John Doe', email: 'john@example.com', phone: '+1234567890' },
      { id: 2, name: 'Jane Smith', email: 'jane@example.com', phone: '+1234567891' },
      { id: 3, name: 'Mike Johnson', email: 'mike@example.com', phone: '+1234567892' },
      { id: 4, name: 'Sarah Wilson', email: 'sarah@example.com', phone: '+1234567893' }
    ]);

    // Mock available packages
    setAvailablePackages({
      main: [
        { id: 1, name: 'Basic Plan', price: 99, features: ['Feature A', 'Feature B'], status: 'active' },
        { id: 2, name: 'Premium Plan', price: 199, features: ['Feature A', 'Feature B', 'Feature C'], status: 'active' },
        { id: 3, name: 'Enterprise Plan', price: 299, features: ['All Features', 'Priority Support'], status: 'active' }
      ],
      addOn: [
        { id: 4, name: 'Extra Storage', price: 29, features: ['100GB Additional Storage'], status: 'active' },
        { id: 5, name: 'Priority Support', price: 49, features: ['24/7 Support', 'Dedicated Manager'], status: 'active' },
        { id: 6, name: 'Analytics Pro', price: 39, features: ['Advanced Analytics', 'Custom Reports'], status: 'active' }
      ]
    });
  }, []);

  const selectUser = (user) => {
    setSelectedUser(user);
    // Mock allotted packages for selected user (including free package by default)
    setAllottedPackages({
      main: [
        { id: 0, name: 'Free Package', price: 0, features: ['Basic Features'], status: 'active', type: 'free' }
      ],
      addOn: [
        { id: 5, name: 'Priority Support', price: 49, features: ['24/7 Support', 'Dedicated Manager'], status: 'active' }
      ]
    });
  };

  const allocatePackage = (packageItem, type) => {
    const isAlreadyAllotted = allottedPackages[type].some(pkg => pkg.id === packageItem.id);
    if (!isAlreadyAllotted) {
      setAllottedPackages(prev => ({
        ...prev,
        [type]: [...prev[type], packageItem]
      }));
    }
  };

  const removePackage = (packageId, type) => {
    // Don't allow removal of free package
    if (packageId === 0) return;
    
    setAllottedPackages(prev => ({
      ...prev,
      [type]: prev[type].filter(pkg => pkg.id !== packageId)
    }));
  };

  const PackageCard = ({ pkg, type, isAllotted = false, onAllocate, onRemove }) => (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-4 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <h3 className="font-semibold text-gray-800">{pkg.name}</h3>
        <span className="text-lg font-bold" style={{ color: '#7d0a0a' }}>
            {pkg.price === 0 ? 'FREE' : `$${pkg.price}`}
        </span>
      </div>
      
      <div className="mb-4">
        {pkg.features.map((feature, index) => (
          <div key={index} className="flex items-center text-sm text-gray-600 mb-1">
            <Check className="w-4 h-4 mr-2" style={{ color: '#7d0a0a' }} />
            {feature}
          </div>
        ))}
      </div>

      <div className="flex justify-end">
        {isAllotted ? (
          <button
            onClick={() => onRemove(pkg.id, type)}
            disabled={pkg.id === 0}
            className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
              pkg.id === 0 
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                : 'bg-red-100 text-red-700 hover:bg-red-200'
            }`}
          >
            <Minus className="w-4 h-4 mr-1" />
            {pkg.id === 0 ? 'Default' : 'Remove'}
          </button>
        ) : (
          <button
            onClick={() => onAllocate(pkg, type)}
            className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-white hover:opacity-90"
            style={{ backgroundColor: '#7d0a0a' }}
          >
            <Plus className="w-4 h-4 mr-1" />
            Allocate
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen w-full mx-auto bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Package Management Panel */}
          <div className="lg:col-span-2">
            {selectedUser ? (
              <div className="space-y-6">
                {/* Currently Allotted Packages */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-xl font-semibold mb-4 flex items-center" style={{ color: '#7d0a0a' }}>
                    <Package className="w-5 h-5 mr-2" />
                    Allotted Packages for {selectedUser.name}
                  </h2>
                  
                  <div className="mb-6">
                    <h3 className="text-lg font-medium mb-3 text-gray-800">Main Packages</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {allottedPackages.main.map(pkg => (
                        <PackageCard
                          key={pkg.id}
                          pkg={pkg}
                          type="main"
                          isAllotted={true}
                          onRemove={removePackage}
                        />
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-3 text-gray-800">Add-On Packages</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {allottedPackages.addOn.map(pkg => (
                        <PackageCard
                          key={pkg.id}
                          pkg={pkg}
                          type="addOn"
                          isAllotted={true}
                          onRemove={removePackage}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Available Packages */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-xl font-semibold mb-4 text-gray-800">Available Packages</h2>
                  
                  <div className="mb-6">
                    <h3 className="text-lg font-medium mb-3 text-gray-800">Main Packages</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {availablePackages.main
                        .filter(pkg => !allottedPackages.main.some(allotted => allotted.id === pkg.id))
                        .map(pkg => (
                          <PackageCard
                            key={pkg.id}
                            pkg={pkg}
                            type="main"
                            onAllocate={allocatePackage}
                          />
                        ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-3 text-gray-800">Add-On Packages</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {availablePackages.addOn
                        .filter(pkg => !allottedPackages.addOn.some(allotted => allotted.id === pkg.id))
                        .map(pkg => (
                          <PackageCard
                            key={pkg.id}
                            pkg={pkg}
                            type="addOn"
                            onAllocate={allocatePackage}
                          />
                        ))}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-md p-12 text-center">
                <User className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">No User Selected</h3>
                <p className="text-gray-500">Please select a user from the left panel to manage their packages</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PackageAllot;