import React from "react";
import { useNavigate } from "react-router-dom";
import DashboardCard from "../components/DashboardCard"; // Adjust path as needed

const SuperMarketDashboard = () => {
  const navigate = useNavigate();

  // Define dashboard options
  const dashboardItems = [
    {
      title: "View Farmer",
      icon: "src/assets/viewfarmer.png",
      path: "/ViewFarmer",
    },
    {
      title: "View Placed Orders",
      icon: "src/assets/vieworder.png",
      path: "/ViewPlacedOrders",
    },
    {
      title: "Analytics",
      icon: "src/assets/analytics.png",
      path: "/Analytics",
    },
    { title: "Payments", icon: "src/assets/payment.png", path: "/Payment" },
    {
      title: "Notifications",
      icon: "src/assets/notofications1.png",
    },
  ];

  const handleLogout = () => {
    navigate("/"); // Redirect to login page
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center bg-cover bg-center p-4 pt-28 pb-20"
      style={{ backgroundImage: "url('src/assets/background.jpg')" }}
    >
      {/* Header */}
      <div className="w-full max-w-4xl mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-800">
          Welcome, <span className="text-gray-800">Keells Admin</span>
        </h1>
        <p className="text-gray-600 font-bold mt-2">
          Access your admin dashboard
        </p>
      </div>

      {/* Dashboard Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-4xl">
        {dashboardItems.map((item, index) => (
          <DashboardCard
            key={index}
            title={item.title}
            icon={item.icon}
            onClick={() => item.path && navigate(item.path)}
          />
        ))}
      </div>

      {/* Footer Actions */}
      <div className="fixed bottom-6 right-6">
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
        >
          Log Out
        </button>
      </div>
    </div>
  );
};

export default SuperMarketDashboard;
