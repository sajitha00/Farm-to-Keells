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
    { title: "Analytics", icon: "src/assets/analytics.png" },
    { title: "Payments", icon: "src/assets/payment.png" },
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
      className="h-screen flex items-center justify-center bg-cover bg-center p-4"
      style={{ backgroundImage: "url('src/assets/background.jpg')" }} // Replace with your actual image
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-4xl w-full">
        {dashboardItems.map((item, index) => (
          <DashboardCard
            key={index}
            title={item.title}
            icon={item.icon}
            onClick={() => navigate(item.path)}
          />
        ))}
      </div>
      <button
        onClick={() => handleLogout()}
        className="absolute bottom-6 right-6 bg-red-500 hover:bg-red-600 text-white font-semibold px-4 py-2 rounded-lg transition"
      >
        Log Out
      </button>
    </div>
  );
};

export default SuperMarketDashboard;
