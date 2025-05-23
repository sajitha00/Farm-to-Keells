import React, { useState, useEffect } from "react";
import { supabase } from "../services/supabaseClient";
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [farmers, setFarmers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedFarmer, setSelectedFarmer] = useState(null);
  const [farmerProducts, setFarmerProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState([]);

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
    setSelectedProducts([]);
    try {
      const { data, error } = await supabase
        .from("products")
        .select("id, product_name, product_type, quantity, price, state")
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

  const handleProductSelect = (productId, isSelected) => {
    if (isSelected) {
      setSelectedProducts([...selectedProducts, productId]);
    } else {
      setSelectedProducts(selectedProducts.filter((id) => id !== productId));
    }
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedProducts(farmerProducts.map((product) => product.id));
    } else {
      setSelectedProducts([]);
    }
  };

  const handlePlaceOrder = async () => {
    if (selectedProducts.length === 0) {
      alert("Please select at least one product to place an order");
      return;
    }

    const selectedItems = farmerProducts.filter((product) =>
      selectedProducts.includes(product.id)
    );

    // Calculate total amount
    const total = selectedItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    try {
      // 1. Create the order
      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert([
          {
            farmer_id: selectedFarmer.id,
            items: selectedItems,
            total_amount: total,
            status: "pending",
          },
        ])
        .select()
        .single();

      if (orderError) {
        console.error("Order creation error:", orderError);
        throw orderError;
      }

      // 2. Create notification for the farmer
      const { error: notifError } = await supabase
        .from("notifications")
        .insert({
          farmer_id: selectedFarmer.id,
          message: `New order received for ${selectedItems.length} items (Total: LKR ${total})`,
          order_id: order.id,
          type: "order",
        });

      if (notifError) {
        console.error("Notification creation error:", notifError);
        throw notifError;
      }

      alert("Order placed successfully! Farmer has been notified.");
      setSelectedProducts([]);
      setSelectedFarmer(null);
      navigate("/SuperMarketDashboard");
    } catch (err) {
      console.error("Full error details:", err);
      alert(`Failed to place order: ${err.message}`);
    }
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
      style={{
        background: "linear-gradient(to right, #e0f8e9, #c6f6d5)",
      }}
    >
      <div className="max-w-5xl w-full mx-auto bg-white p-6 rounded-2xl shadow-xl">
        {/* Added back button at the top */}
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1 text-green-600 hover:text-green-800 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                clipRule="evenodd"
              />
            </svg>
            Back
          </button>
          <h1 className="text-3xl font-bold text-center flex-1">
            Please Select Your Location
          </h1>
          <div className="w-24"></div> {/* Spacer for balance */}
        </div>

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

      {selectedFarmer && (
        <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md relative max-h-[80vh] overflow-y-auto">
            <button
              onClick={() => {
                setSelectedFarmer(null);
                setFarmerProducts([]);
                setSelectedProducts([]);
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
              <div>
                <div className="flex items-center mb-3">
                  <input
                    type="checkbox"
                    id="selectAll"
                    checked={
                      selectedProducts.length === farmerProducts.length &&
                      farmerProducts.length > 0
                    }
                    onChange={handleSelectAll}
                    className="mr-2 h-4 w-4 text-green-600 rounded focus:ring-green-500"
                  />
                  <label htmlFor="selectAll" className="font-medium">
                    Select All Products
                  </label>
                  <span className="ml-auto text-sm text-gray-600">
                    {selectedProducts.length} selected
                  </span>
                </div>

                <ul className="space-y-3">
                  {farmerProducts.map((product) => (
                    <li
                      key={product.id}
                      className="border p-3 rounded bg-gray-50 shadow-sm"
                    >
                      <div className="flex items-start">
                        <input
                          type="checkbox"
                          checked={selectedProducts.includes(product.id)}
                          onChange={(e) =>
                            handleProductSelect(product.id, e.target.checked)
                          }
                          className="mt-1 mr-2 h-4 w-4 text-green-600 rounded focus:ring-green-500"
                        />
                        <div className="flex-1">
                          <div className="font-bold">
                            {product.product_name}
                          </div>
                          <div>Type: {product.product_type}</div>
                          <div>Quantity: {product.quantity}</div>
                          <div>Price: LKR {product.price}</div>
                          <div>Location: {product.state}</div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="flex gap-4 mt-6">
              <button
                onClick={() => {
                  setSelectedFarmer(null);
                  setFarmerProducts([]);
                  setSelectedProducts([]);
                }}
                className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded transition"
              >
                Close
              </button>
              <button
                onClick={handlePlaceOrder}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded transition"
                disabled={selectedProducts.length === 0}
              >
                {selectedProducts.length > 0
                  ? `Place Order (${selectedProducts.length})`
                  : "Place Order"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewFarmer;
