import React, { useState, useEffect } from "react";
import { supabase } from "../services/supabaseClient";
import { useNavigate } from "react-router-dom";

const ViewPlacedOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchOrders = async () => {
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from("orders")
        .select(`
          id,
          farmer_id,
          order_date,
          status,
          total_amount,
          items,
          farmers:farmer_id(full_name, phone_number, email, avatar_url)
        `)
        .order("order_date", { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching orders:", err);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const { error } = await supabase
        .from("orders")
        .update({ status: newStatus })
        .eq("id", orderId);

      if (error) throw error;

      await fetchOrders();
      alert("Order status updated successfully!");
    } catch (err) {
      console.error("Error updating order status:", err);
      alert("Failed to update order status");
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div
      className="min-h-screen flex flex-col items-center bg-gradient-to-r from-green-100 to-green-300 p-4 pt-32"
    >
      {/* Main Container */}
      <div className="w-full max-w-7xl bg-white bg-opacity-80 backdrop-blur-md p-6 md:p-8 rounded-3xl shadow-2xl relative">
        {/* Back Button */}
        <button
          onClick={() => navigate("/SuperMarketDashboard")}
          className="absolute left-4 top-4 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold px-4 py-2 rounded-full text-sm transition flex items-center gap-2"
        >
          ← Back
        </button>

        {/* Title */}
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-8 text-gray-800">
          Placed Orders
        </h1>

        {/* Content */}
        {loading ? (
          <div className="text-center text-gray-600 text-lg">Loading orders...</div>
        ) : error ? (
          <div className="text-center text-red-500 text-lg">Error: {error}</div>
        ) : orders.length === 0 ? (
          <div className="text-center text-gray-600 text-lg">No orders found.</div>
        ) : (
          <div className="overflow-x-auto rounded-2xl shadow-inner">
            <table className="min-w-full text-sm md:text-base border-collapse">
              <thead>
                <tr className="bg-green-600 text-white">
                  <th className="p-2 md:p-4 rounded-tl-2xl">Order ID</th>
                  <th className="p-2 md:p-4">Farmer</th>
                  <th className="p-2 md:p-4">Date</th>
                  <th className="p-2 md:p-4">Items</th>
                  <th className="p-2 md:p-4">Total</th>
                  <th className="p-2 md:p-4">Status</th>
                  <th className="p-2 md:p-4 rounded-tr-2xl">Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr
                    key={order.id}
                    className={`transition ${
                      order.status === "completed"
                        ? "bg-green-50"
                        : order.status === "cancelled"
                        ? "bg-red-50"
                        : "bg-white hover:bg-gray-50"
                    }`}
                  >
                    <td className="p-2 md:p-4 font-mono">{order.id.slice(0, 8)}...</td>
                    <td className="p-2 md:p-4">
                      <div className="flex flex-col md:flex-row md:items-center gap-2">
                        {order.farmers?.avatar_url && (
                          <img
                            src={order.farmers.avatar_url}
                            alt={order.farmers.full_name}
                            className="w-8 h-8 md:w-10 md:h-10 rounded-full object-cover border border-gray-300"
                          />
                        )}
                        <div>
                          <div className="font-semibold">{order.farmers?.full_name || "Unknown"}</div>
                          <div className="text-xs text-gray-500">{order.farmers?.email || "No Email"}</div>
                          <div className="text-xs text-gray-500">{order.farmers?.phone_number || "No Contact"}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-2 md:p-4">{new Date(order.order_date).toLocaleString()}</td>
                    <td className="p-2 md:p-4">
                      <ul className="list-disc pl-4 space-y-1">
                        {order.items.map((item, index) => (
                          <li key={index}>
                            {item.product_name} ({item.quantity} × LKR {item.price})
                          </li>
                        ))}
                      </ul>
                    </td>
                    <td className="p-2 md:p-4 font-bold text-gray-700">
                      LKR {order.total_amount}
                    </td>
                    <td className="p-2 md:p-4">
                      <span
                        className={`px-2 py-1 md:px-3 md:py-1.5 rounded-full text-xs md:text-sm font-semibold ${
                          order.status === "completed"
                            ? "bg-green-200 text-green-800"
                            : order.status === "cancelled"
                            ? "bg-red-200 text-red-800"
                            : "bg-yellow-200 text-yellow-800"
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="p-2 md:p-4">
                      {order.status === "pending" && (
                        <div className="flex flex-col md:flex-row gap-2 md:gap-3">
                          <button
                            onClick={() => updateOrderStatus(order.id, "completed")}
                            className="bg-green-500 hover:bg-green-600 text-white font-semibold px-3 py-1 rounded-full text-xs md:text-sm transition"
                          >
                            Complete
                          </button>
                          <button
                            onClick={() => updateOrderStatus(order.id, "cancelled")}
                            className="bg-red-500 hover:bg-red-600 text-white font-semibold px-3 py-1 rounded-full text-xs md:text-sm transition"
                          >
                            Cancel
                          </button>
                        </div>
                      )}
                    </td>
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

export default ViewPlacedOrders;
