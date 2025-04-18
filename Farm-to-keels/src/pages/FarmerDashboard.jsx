import React from "react";
import { useNavigate } from "react-router-dom";
import DashboardCard from "../components/DashboardCard";
import { useFarmer } from "../context/FarmerProvider";

const FarmerDashboard = () => {
  const navigate = useNavigate();
  const { farmer, isLoggedIn, logoutFarmer } = useFarmer();

  const dashboardItems = [
    {
      title: "Place Your Orders",
      icon: "src/assets/order.png",
      path: "/AddProducts",
    },
    {
      title: "View Orders",
      icon: "src/assets/view_order.png",
      path: "/ViewProduct",
    },
    {
      title: "Notifications",
      icon: "src/assets/notofications1.png",
    },
    {
      title: "Payments",
      icon: "src/assets/payment.png",
    },
    {
      title: "Manage Profile",
      icon: "src/assets/manageProfile.png",
      path: "/ManageProfile",
    },
  ];

  if (!isLoggedIn) {
    return (
      <p className="text-center mt-10 text-lg">
        Please log in to view your profile
      </p>
    );
  }

  // 🔓 Logout Handler
  const handleLogout = () => {
    logoutFarmer(); // Clear farmer context
    navigate("/FarmerLogin"); // Redirect to login page
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-start bg-cover bg-center relative px-4 pt-28 pb-6"
      style={{ backgroundImage: "url('src/assets/background.jpg')" }}
    >
      {/* Greeting */}
      <div className="w-full max-w-4xl mb-6">
        <h1 className="text-2xl font-bold text-gray-800 drop-shadow">
          Welcome, <span className=" text-gray-800">{farmer.full_name}</span>
        </h1>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full max-w-4xl">
        {dashboardItems.map((item, index) => (
          <DashboardCard
            key={index}
            title={item.title}
            icon={item.icon}
            onClick={() => item.path && navigate(item.path)}
          />
        ))}
      </div>

      {/* Logout Button */}
      <button
        onClick={() => handleLogout()}
        className="absolute bottom-6 right-6 bg-red-500 hover:bg-red-600 text-white font-semibold px-4 py-2 rounded-lg transition"
      >
        Log Out
      </button>
    </div>
  );
};

export default FarmerDashboard;
