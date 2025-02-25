import React from "react";

const DashboardCard = ({ icon, title, onClick }) => {
  return (
    <div
      className="flex flex-col items-center justify-center p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition cursor-pointer"
      onClick={onClick}
    >
      <img src={icon} alt={title} className="w-16 h-16 mb-3" />
      <p className="text-lg font-semibold">{title}</p>
    </div>
  );
};

export default DashboardCard;
