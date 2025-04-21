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
        .select(
          `
          id,
          farmer_id,
          order_date,
          status,
          total_amount,
          items,
          farmers:farmer_id(full_name, phone_number, email, avatar_url)
        `
        )
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

      // Refresh orders after update
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
      className="min-h-screen flex flex-col items-center bg-cover bg-center p-4 pt-24"
      style={{
        background: "linear-gradient(to right, #e0f8e9, #c6f6d5)",
      }}
    >
      <div className="max-w-6xl w-full bg-white p-6 rounded-2xl shadow-2xl relative">
        {/* Back Button */}
        <button
          onClick={() => navigate("/SuperMarketDashboard")}
          className="absolute left-6 top-6 bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-full text-sm font-medium transition duration-200 flex items-center gap-2"
        >
          ← Back to Dashboard
        </button>

        <h1 className="text-3xl font-bold text-center mb-10">Placed Orders</h1>

        {loading ? (
          <div className="text-center text-gray-600 text-lg mt-4">
            Loading orders...
          </div>
        ) : error ? (
          <div className="text-center text-red-500 text-lg mt-4">
            Error: {error}
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center text-gray-600 text-lg mt-4">
            No orders found.
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-gray-200">
            <table className="w-full text-left border-collapse overflow-hidden rounded-xl">
              <thead>
                <tr className="bg-green-600 text-white text-sm">
                  <th className="p-4">Order ID</th>
                  <th className="p-4">Farmer</th>
                  <th className="p-4">Date</th>
                  <th className="p-4">Items</th>
                  <th className="p-4">Total</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr
                    key={order.id}
                    className={`text-sm transition-all duration-300 ${
                      order.status === "completed"
                        ? "bg-green-50"
                        : order.status === "cancelled"
                        ? "bg-red-50"
                        : "bg-white hover:bg-gray-50"
                    }`}
                  >
                    <td className="p-4 font-mono">{order.id.slice(0, 8)}...</td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        {order.farmers?.avatar_url && (
                          <img
                            src={order.farmers.avatar_url}
                            alt={order.farmers.full_name}
                            className="w-10 h-10 rounded-full object-cover border border-gray-300"
                          />
                        )}
                        <div>
                          <div className="font-semibold">
                            {order.farmers?.full_name || "Unknown"}
                          </div>
                          <div className="text-xs text-gray-600">
                            {order.farmers?.email || "No Email"}
                          </div>
                          <div className="text-xs text-gray-600">
                            {order.farmers?.phone_number || "No Contact"}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      {new Date(order.order_date).toLocaleString()}
                    </td>
                    <td className="p-4">
                      <ul className="list-disc pl-4 space-y-1">
                        {order.items.map((item, index) => (
                          <li key={index}>
                            {item.product_name} ({item.quantity} × LKR{" "}
                            {item.price})
                          </li>
                        ))}
                      </ul>
                    </td>
                    <td className="p-4 font-semibold">
                      LKR {order.total_amount}
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          order.status === "completed"
                            ? "bg-green-200 text-green-900"
                            : order.status === "cancelled"
                            ? "bg-red-200 text-red-900"
                            : "bg-yellow-200 text-yellow-900"
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="p-4 space-x-2">
                      {order.status === "pending" && (
                        <>
                          <button
                            onClick={() =>
                              updateOrderStatus(order.id, "completed")
                            }
                            className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-full text-sm transition duration-200"
                          >
                            Complete
                          </button>
                          <button
                            onClick={() =>
                              updateOrderStatus(order.id, "cancelled")
                            }
                            className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-full text-sm transition duration-200"
                          >
                            Cancel
                          </button>
                        </>
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
