// src/pages/FarmerDashboard.jsx
import React from "react";
import DashboardCard from "../components/DashboardCard";

const FarmerDashboard = () => {
  const dashboardItems = [
    { title: "Place Your Orders", icon: "src/assets/order.png" },
    { title: "View Orders", icon: "src/assets/view_order.png" },
    { title: "Notifications", icon: "src/assets/notofications1.png" },
    { title: "Payments", icon: "src/assets/payment.png" },
    { title: "Manage Profile", icon: "src/assets/manageProfile.png" },
  ];

  return (
    <div
      className="h-screen flex flex-col items-center justify-center bg-cover bg-center relative"
      style={{ backgroundImage: "url('src/assets/background.jpg')" }}
    >
      {/* Card Container */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6 p-6 bg-opacity-80">
        {dashboardItems.map((item, index) => (
          <DashboardCard key={index} title={item.title} icon={item.icon} />
        ))}
      </div>

      {/* Logout Button */}
      <button className="absolute bottom-6 right-6 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition">
        Logout
      </button>
    </div>
  );
};

export default FarmerDashboard;
