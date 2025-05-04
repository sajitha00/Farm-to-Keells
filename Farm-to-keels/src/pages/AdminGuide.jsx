import React from "react";
import { useNavigate } from "react-router-dom";

const AdminGuide = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center bg-gradient-to-r from-green-100 to-green-300 p-4 pt-32">
      {/* Main container */}
      <div className="w-full max-w-5xl bg-white bg-opacity-80 backdrop-blur-md p-8 rounded-3xl shadow-2xl">
        {/* Title */}
        <h1 className="text-4xl font-bold text-center mb-6 text-gray-800">
          Welcome to the Admin Guide
        </h1>
        <p className="text-center text-gray-600 mb-10 text-lg">
          Learn about your dashboard sections and how to manage the system.
        </p>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card 1 */}
          <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-2xl transition">
            <h2 className="text-2xl font-bold mb-2 text-green-700">
              👩‍🌾 View Farmer
            </h2>
            <p className="text-gray-600">
              Access a list of registered farmers. View their profile details,
              including contact information, farm products, and supply
              capabilities.
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-2xl transition">
            <h2 className="text-2xl font-bold mb-2 text-green-700">
              📦 View Placed Orders
            </h2>
            <p className="text-gray-600">
              Track all orders placed with farmers. View product quantities,
              order statuses, and payment details.
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-2xl transition">
            <h2 className="text-2xl font-bold mb-2 text-green-700">
              📊 Analytics
            </h2>
            <p className="text-gray-600">
              Visualize predicted stock needs for 2025, especially for important
              holiday months like April, August, and December.
            </p>
          </div>

          {/* Card 4 */}
          <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-2xl transition">
            <h2 className="text-2xl font-bold mb-2 text-green-700">
              💵 Payments
            </h2>
            <p className="text-gray-600">
              Manage farmer payments. Enter farmer's PayPal email and securely
              send advance or full payments.
            </p>
          </div>

          {/* Card 5 */}
          <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-2xl transition">
            <h2 className="text-2xl font-bold mb-2 text-green-700">
              🔔 Notifications
            </h2>
            <p className="text-gray-600">
              Receive important alerts about orders, payments, and system
              updates. Stay informed and take action quickly.
            </p>
          </div>

          {/* Card 6 */}
          <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-2xl transition">
            <h2 className="text-2xl font-bold mb-2 text-green-700">
              📚 Admin Guide
            </h2>
            <p className="text-gray-600">
              You are here! This guide explains each dashboard function to help
              you manage Farm-to-Keells efficiently.
            </p>
          </div>
        </div>

        {/* Back Button */}
        <div className="flex justify-center mt-10">
          <button
            onClick={() => navigate("/SuperMarketDashboard")}
            className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-xl transition"
          >
            ⬅ Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminGuide;
