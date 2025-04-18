import React from "react";

const DashboardCard = ({ icon, title, onClick, badge }) => {
  return (
    <div className="relative">
      <div
        className="flex flex-col items-center justify-center p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition cursor-pointer"
        onClick={onClick}
      >
        <img src={icon} alt={title} className="w-16 h-16 mb-3" />
        <p className="text-lg font-semibold">{title}</p>
      </div>

      {/* Notification Badge */}
      {badge && (
        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center animate-pulse">
          {badge}
        </span>
      )}
    </div>
  );
};

export default DashboardCard;
