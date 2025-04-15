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
      className="min-h-screen flex flex-col items-center bg-cover bg-center p-4 pt-26"
      style={{ backgroundImage: "url('src/assets/background.jpg')" }}
    >
      <div className="max-w-6xl w-full bg-white p-6 rounded-2xl shadow-xl">
        <h1 className="text-3xl font-bold text-center mb-6">Placed Orders</h1>

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
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="bg-green-600 text-white">
                  <th className="p-3">Order ID</th>
                  <th className="p-3">Farmer</th>
                  <th className="p-3">Date</th>
                  <th className="p-3">Items</th>
                  <th className="p-3">Total</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr
                    key={order.id}
                    className={`border-b ${
                      order.status === "completed"
                        ? "bg-green-50"
                        : order.status === "cancelled"
                        ? "bg-red-50"
                        : "bg-white"
                    }`}
                  >
                    <td className="p-3">{order.id.slice(0, 8)}...</td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        {order.farmers?.avatar_url && (
                          <img
                            src={order.farmers.avatar_url}
                            alt={order.farmers.full_name}
                            className="w-8 h-8 rounded-full object-cover"
                          />
                        )}
                        <div>
                          <div>{order.farmers?.full_name || "Unknown"}</div>
                          <div className="text-sm text-gray-600">
                            {order.farmers?.phone_number || "No contact"}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="p-3">
                      {new Date(order.order_date).toLocaleString()}
                    </td>
                    <td className="p-3">
                      <ul className="list-disc pl-4">
                        {order.items.map((item, index) => (
                          <li key={index}>
                            {item.product_name} ({item.quantity} × LKR{" "}
                            {item.price})
                          </li>
                        ))}
                      </ul>
                    </td>
                    <td className="p-3">LKR {order.total_amount}</td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          order.status === "completed"
                            ? "bg-green-100 text-green-800"
                            : order.status === "cancelled"
                            ? "bg-red-100 text-red-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="p-3 space-x-2">
                      {order.status === "pending" && (
                        <>
                          <button
                            onClick={() =>
                              updateOrderStatus(order.id, "completed")
                            }
                            className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
                          >
                            Complete
                          </button>
                          <button
                            onClick={() =>
                              updateOrderStatus(order.id, "cancelled")
                            }
                            className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
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
