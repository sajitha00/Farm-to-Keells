import React, { useState } from 'react';

const SRI_LANKAN_DISTRICTS = [
  "Colombo", "Gampaha", "Kalutara", "Kandy", "Matale",
  "Nuwara Eliya", "Galle", "Matara", "Hambantota", "Jaffna",
  "Kilinochchi", "Mannar", "Vavuniya", "Mullaitivu", "Batticaloa",
  "Ampara", "Trincomalee", "Kurunegala", "Puttalam", "Anuradhapura",
  "Polonnaruwa", "Badulla", "Monaragala", "Ratnapura", "Kegalle"
];

// Mock data - replace with your actual data
const MOCK_FARMERS = [
  {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    district: "Colombo",
    products: ["Tomatoes", "Carrots"]
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane@example.com",
    district: "Kandy",
    products: ["Apples", "Bananas"]
  },
  // Add more mock data as needed
];

const ViewFarmers = () => {
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Filter farmers based on district and search term
  const filteredFarmers = MOCK_FARMERS.filter(farmer => {
    const matchesDistrict = !selectedDistrict || farmer.district === selectedDistrict;
    const matchesSearch = !searchTerm || 
      farmer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      farmer.email.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesDistrict && matchesSearch;
  });

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">View Farmers</h1>
      
      {/* Filter Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {/* District Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Filter by District
          </label>
          <select
            value={selectedDistrict}
            onChange={(e) => setSelectedDistrict(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
          >
            <option value="">All Districts</option>
            {SRI_LANKAN_DISTRICTS.map((district) => (
              <option key={district} value={district}>
                {district}
              </option>
            ))}
          </select>
        </div>

        {/* Search Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Search Farmers
          </label>
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
          />
        </div>
      </div>

      {/* Results Count */}
      <div className="mb-4">
        <p className="text-sm text-gray-600">
          Showing {filteredFarmers.length} farmers
          {selectedDistrict && ` in ${selectedDistrict}`}
        </p>
      </div>

      {/* Farmers List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Farmer
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Contact
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                District
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Products
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredFarmers.length > 0 ? (
              filteredFarmers.map((farmer) => (
                <tr key={farmer.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900">{farmer.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                    {farmer.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                    {farmer.district}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-wrap gap-1">
                      {farmer.products.map((product, index) => (
                        <span 
                          key={index}
                          className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded"
                        >
                          {product}
                        </span>
                      ))}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="px-6 py-4 text-center text-gray-500">
                  No farmers found matching your criteria
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ViewFarmers;