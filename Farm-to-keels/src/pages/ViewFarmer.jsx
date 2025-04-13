import React, { useState, useEffect } from "react";
import { supabase } from "../services/supabaseClient";

const districts = [
  "Colombo",
  "Gampaha",
  "Kalutara",
  "Kandy",
  "Matale",
  "Nuwara Eliya",
  "Galle",
  "Matara",
  "Hambantota",
  "Jaffna",
  "Kilinochchi",
  "Mannar",
  "Vavuniya",
  "Mullaitivu",
  "Batticaloa",
  "Ampara",
  "Trincomalee",
  "Kurunegala",
  "Puttalam",
  "Anuradhapura",
  "Polonnaruwa",
  "Badulla",
  "Monaragala",
  "Ratnapura",
  "Kegalle",
];

const ViewFarmer = () => {
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [farmers, setFarmers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedFarmer, setSelectedFarmer] = useState(null);
  const [farmerProducts, setFarmerProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(false);

  const fetchFarmersByLocation = async () => {
    if (!selectedDistrict) return;

    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from("farmers")
        .select("id, full_name, location, phone_number, email, avatar_url")
        .ilike("location", `%${selectedDistrict}%`);

      if (error) throw error;

      setFarmers(data || []);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching farmers:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchFarmerProducts = async (farmerId) => {
    setProductsLoading(true);
    try {
      const { data, error } = await supabase
        .from("products")
        .select("product_name, product_type, quantity, price, state")
        .eq("farmer_id", farmerId);

      if (error) throw error;

      setFarmerProducts(data || []);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching products:", err);
    } finally {
      setProductsLoading(false);
    }
  };

  const handleFarmerClick = async (farmer) => {
    setSelectedFarmer(farmer);
    await fetchFarmerProducts(farmer.id);
  };

  useEffect(() => {
    if (selectedDistrict) {
      fetchFarmersByLocation();
    } else {
      setFarmers([]);
    }
  }, [selectedDistrict]);
  return (
    <div
      className="min-h-screen flex flex-col items-center bg-cover bg-center p-4 pt-26"
      style={{ backgroundImage: "url('src/assets/background.jpg')" }}
    >
      <div className="max-w-5xl mx-auto bg-white p-6 rounded-2xl shadow-xl">
        <h1 className="text-3xl font-bold text-center mb-6">
          Please Select Your Location
        </h1>

        {/* Filter Section */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
          <select
            value={selectedDistrict}
            onChange={(e) => setSelectedDistrict(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
          >
            <option value="" disabled>
              Select District
            </option>
            {districts.map((district) => (
              <option key={district} value={district}>
                {district}
              </option>
            ))}
          </select>
        </div>

        {/* Loading and Error States */}
        {loading && (
          <div className="text-center text-gray-600 text-lg mt-4">
            Loading farmers...
          </div>
        )}

        {error && (
          <div className="text-center text-red-500 text-lg mt-4">
            Error: {error}
          </div>
        )}

        {/* Results Section */}
        {!loading && !error && farmers.length === 0 ? (
          <div className="text-center text-gray-600 text-lg mt-4">
            {selectedDistrict
              ? "No farmers found in this district."
              : "Please select a district to view farmers."}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="bg-green-600 text-white">
                  <th className="p-3">Farmer Name</th>
                  <th className="p-3">District</th>
                  <th className="p-3">Contact</th>
                  <th className="p-3">Email</th>
                </tr>
              </thead>
              <tbody>
                {farmers.map((farmer, index) => (
                  <tr
                    key={farmer.id}
                    onClick={() => handleFarmerClick(farmer)}
                    className={`border-b cursor-pointer ${
                      index % 2 === 0 ? "bg-gray-50" : "bg-white"
                    } hover:bg-gray-100`}
                  >
                    <td className="p-3 flex items-center gap-2">
                      {farmer.avatar_url && (
                        <img
                          src={farmer.avatar_url}
                          alt={farmer.full_name}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                      )}
                      {farmer.full_name}
                    </td>
                    <td className="p-3">{farmer.location}</td>
                    <td className="p-3">
                      {farmer.phone_number || "Not provided"}
                    </td>
                    <td className="p-3">{farmer.email}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Product Modal */}
      {selectedFarmer && (
        <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md relative max-h-[80vh] overflow-y-auto">
            <button
              onClick={() => {
                setSelectedFarmer(null);
                setFarmerProducts([]);
              }}
              className="absolute top-2 right-3 text-gray-600 hover:text-red-500 text-xl"
            >
              ×
            </button>
            <h3 className="text-xl font-bold mb-4">
              Products by {selectedFarmer.full_name}
            </h3>

            {productsLoading ? (
              <div className="text-center py-4">Loading products...</div>
            ) : farmerProducts.length === 0 ? (
              <div className="text-center py-4 text-gray-500">
                No products found for this farmer.
              </div>
            ) : (
              <ul className="space-y-3">
                {farmerProducts.map((product, idx) => (
                  <li
                    key={idx}
                    className="border p-3 rounded bg-gray-50 shadow-sm"
                  >
                    <div className="font-bold">{product.product_name}</div>
                    <div>Type: {product.product_type}</div>
                    <div>Quantity: {product.quantity}</div>
                    <div>Price: LKR {product.price}</div>
                    <div>Location: {product.state}</div>
                  </li>
                ))}
              </ul>
            )}

            {/* Action Button */}
            <button
              onClick={() =>
                alert(`Order placed with ${selectedFarmer.full_name}!`)
              }
              className="w-full mt-4 bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition"
            >
              Place Order
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewFarmer;
