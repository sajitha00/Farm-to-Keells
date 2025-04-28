import React from "react";
import { useNavigate } from "react-router-dom";

const FarmerGuide = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center bg-cover bg-center p-6 pt-32" 
      style={{ backgroundImage: "url('src/assets/background.jpg')" }}>
      
      {/* Main container */}
      <div className="w-full max-w-5xl bg-white bg-opacity-80 backdrop-blur-md p-8 rounded-3xl shadow-2xl">
        
        {/* Title */}
        <h1 className="text-4xl font-bold text-center mb-6 text-gray-800">
          Welcome to the Farmer Guide
        </h1>
        <p className="text-center text-gray-600 mb-10 text-lg">
          Learn about your dashboard features and manage your farming activities easily.
        </p>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card 1 */}
          <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-2xl transition">
            <h2 className="text-2xl font-bold mb-2 text-green-700">🛒 Place Your Orders</h2>
            <p className="text-gray-600">
              Add and list your farm products like vegetables and fruits, so supermarkets can view and place bulk orders.
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-2xl transition">
            <h2 className="text-2xl font-bold mb-2 text-green-700">📋 View Orders</h2>
            <p className="text-gray-600">
              Track all the orders placed by supermarkets for your products. Confirm or prepare the requested quantities.
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-2xl transition">
            <h2 className="text-2xl font-bold mb-2 text-green-700">🔔 Notifications</h2>
            <p className="text-gray-600">
              Receive important alerts when new orders arrive or when supermarkets send you payments for your produce.
            </p>
          </div>

          {/* Card 4 */}
          <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-2xl transition">
            <h2 className="text-2xl font-bold mb-2 text-green-700">💵 Payments</h2>
            <p className="text-gray-600">
              View the payments you have received for completed orders, including payment details and timestamps.
            </p>
          </div>

          {/* Card 5 */}
          <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-2xl transition">
            <h2 className="text-2xl font-bold mb-2 text-green-700">👤 Manage Profile</h2>
            <p className="text-gray-600">
              Update your account information, including your farm location, email, and password for better account security.
            </p>
          </div>

          {/* Card 6 */}
          <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-2xl transition">
            <h2 className="text-2xl font-bold mb-2 text-green-700">📚 Farmer Guide</h2>
            <p className="text-gray-600">
              This guide explains each dashboard function to help you efficiently manage your farming activities online.
            </p>
          </div>
        </div>

        {/* Back Button */}
        <div className="flex justify-center mt-10">
          <button
            onClick={() => navigate("/FarmerDashboard")}
            className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-xl transition"
          >
            ⬅ Back to Dashboard
          </button>
        </div>

      </div>
    </div>
  );
};

export default FarmerGuide;
