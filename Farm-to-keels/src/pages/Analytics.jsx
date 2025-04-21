import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Analytics = () => {
  const [predictions, setPredictions] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [locations, setLocations] = useState([]);
  const [months, setMonths] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState("All");
  const [selectedMonth, setSelectedMonth] = useState("All");
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const holidayMonths = ["April", "August", "December"];

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/predictions")
      .then((response) => {
        const data = response.data;
        setPredictions(data);
        setFiltered(data);
        setLocations([...new Set(data.map((item) => item.location))]);
        setMonths([...new Set(data.map((item) => item.month))]);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching predictions:", error);
        setLoading(false);
      });
  }, []);

  const handleFilter = (loc, mon) => {
    let result = predictions;
    if (loc !== "All") {
      result = result.filter((item) => item.location === loc);
    }
    if (mon !== "All") {
      result = result.filter((item) => item.month === mon);
    }
    setFiltered(result);
  };

  const handleLocationChange = (value) => {
    setSelectedLocation(value);
    handleFilter(value, selectedMonth);
  };

  const handleMonthChange = (value) => {
    setSelectedMonth(value);
    handleFilter(selectedLocation, value);
  };

  return (
    <div className="min-h-screen pt-24 px-4 sm:px-8 bg-gradient-to-br from-green-100 to-green-200">
      <div className="max-w-6xl mx-auto bg-white p-6 rounded-2xl shadow-xl border border-green-300 relative">
        {/* Back Button */}
        <button
          onClick={() => navigate("/SuperMarketDashboard")}
          className="absolute left-6 top-6 bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-full text-sm font-medium transition duration-200 flex items-center gap-2"
        >
          ← Back to Dashboard
        </button>

        <h1 className="text-3xl font-bold text-center mb-6 text-green-800">
          2025 Demand Predictions (kg)
        </h1>

        {/* Filters */}
        <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 text-gray-700 font-medium">
              Filter by Location:
            </label>
            <select
              className="border border-green-300 p-2 rounded-md shadow-sm w-full focus:outline-none focus:ring-2 focus:ring-green-400"
              value={selectedLocation}
              onChange={(e) => handleLocationChange(e.target.value)}
            >
              <option value="All">All</option>
              {locations.map((loc, index) => (
                <option key={index} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-1 text-gray-700 font-medium">
              Filter by Month:
            </label>
            <select
              className="border border-green-300 p-2 rounded-md shadow-sm w-full focus:outline-none focus:ring-2 focus:ring-green-400"
              value={selectedMonth}
              onChange={(e) => handleMonthChange(e.target.value)}
            >
              <option value="All">All</option>
              {months.map((mon, index) => (
                <option key={index} value={mon}>
                  {mon}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Table */}
        {loading ? (
          <div className="text-center py-10 text-gray-600">
            Loading predictions...
          </div>
        ) : (
          <div className="rounded-xl overflow-hidden shadow-md border border-green-300">
            <table className="min-w-full text-sm text-left bg-white rounded-xl">
              <thead className="bg-green-300 text-gray-800 text-base sticky top-0 z-10">
                <tr>
                  <th className="p-3 border-b">Product</th>
                  <th className="p-3 border-b">Location</th>
                  <th className="p-3 border-b">Month</th>
                  <th className="p-3 border-b">Predicted Quantity (kg)</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((item, index) => (
                  <tr
                    key={index}
                    className={`transition duration-150 ${
                      holidayMonths.includes(item.month)
                        ? "bg-yellow-100 font-semibold"
                        : "hover:bg-green-50"
                    }`}
                  >
                    <td className="p-3 border-b">{item.product}</td>
                    <td className="p-3 border-b">{item.location}</td>
                    <td className="p-3 border-b">{item.month}</td>
                    <td className="p-3 border-b">{item.predicted_quantity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Analytics;
