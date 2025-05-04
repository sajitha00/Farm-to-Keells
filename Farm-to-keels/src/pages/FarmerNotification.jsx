import React, { useState, useEffect } from "react";
import { supabase } from "../services/supabaseClient";
import { useNavigate } from "react-router-dom";
import { useFarmer } from "../context/FarmerProvider";

const FarmerNotification = () => {
  const navigate = useNavigate();
  const { farmer } = useFarmer();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [orderDetails, setOrderDetails] = useState({});

  useEffect(() => {
    if (!farmer?.id) return;

    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch notifications, excluding payment notifications
        const { data: notificationsData, error: notifError } = await supabase
          .from("notifications")
          .select("*")
          .eq("farmer_id", farmer.id)
          .not("message", "ilike", "%Payment of%") // Exclude payment notifications
          .order("created_at", { ascending: false });

        if (notifError) throw notifError;

        setNotifications(notificationsData || []);

        // Fetch order details for each notification
        const orders = notificationsData
          .filter((n) => n.order_id)
          .map((n) => n.order_id);

        if (orders.length > 0) {
          const { data: ordersData, error: ordersError } = await supabase
            .from("orders")
            .select("id, items")
            .in("id", orders);

          if (ordersError) throw ordersError;

          const details = {};
          ordersData.forEach((order) => {
            details[order.id] = order.items;
          });
          setOrderDetails(details);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // Real-time subscription
    const channel = supabase
      .channel(`notifications:${farmer.id}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT", // Only listen for INSERT events
          schema: "public",
          table: "notifications",
          filter: `farmer_id=eq.${farmer.id}`,
        },
        (payload) => {
          // Only add the notification if it's not a payment notification
          if (!payload.new.message.includes("Payment of")) {
            setNotifications((prev) => [payload.new, ...prev]);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [farmer?.id]);

  const markAsRead = async (id) => {
    try {
      const { error } = await supabase
        .from("notifications")
        .update({ is_read: true })
        .eq("id", id);

      if (error) throw error;

      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
      );
    } catch (err) {
      console.error("Error marking notification as read:", err);
    }
  };

  const markAllAsRead = async () => {
    try {
      const { error } = await supabase
        .from("notifications")
        .update({ is_read: true })
        .eq("farmer_id", farmer.id)
        .eq("is_read", false)
        .not("message", "ilike", "%Payment of%"); // Only mark non-payment notifications as read

      if (error) throw error;

      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
    } catch (err) {
      console.error("Error marking all notifications as read:", err);
    }
  };

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  return (
    <div className="min-h-screen flex flex-col items-center bg-green-100 p-4 pt-28">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Notifications</h1>
          <div className="flex gap-2">
            <button
              onClick={markAllAsRead}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
            >
              Mark All as Read
            </button>
            <button
              onClick={() => navigate(-1)}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition"
            >
              Back
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
          </div>
        ) : notifications.length === 0 ? (
          <div className="text-center p-8">
            <p className="text-gray-600 text-lg">No notifications yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 rounded-lg border ${
                  !notification.is_read
                    ? "bg-blue-50 border-blue-200"
                    : "bg-white border-gray-200"
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-medium text-gray-800">
                    New Order Received
                  </h3>
                  <span className="text-sm text-gray-500">
                    {new Date(notification.created_at).toLocaleString()}
                  </span>
                </div>

                {orderDetails[notification.order_id] && (
                  <div className="mt-2">
                    <h4 className="font-medium mb-1">Ordered Items:</h4>
                    <ul className="space-y-2">
                      {orderDetails[notification.order_id].map(
                        (item, index) => (
                          <li key={index} className="flex justify-between">
                            <span>
                              {item.product_name} ({item.quantity}{" "}
                              {item.product_type})
                            </span>
                            <span className="font-medium">
                              LKR {item.price * item.quantity}
                            </span>
                          </li>
                        )
                      )}
                    </ul>
                    <div className="flex justify-between mt-3 pt-2 border-t">
                      <span className="font-medium">Total:</span>
                      <span className="font-medium">
                        LKR{" "}
                        {orderDetails[notification.order_id].reduce(
                          (sum, item) => sum + item.price * item.quantity,
                          0
                        )}
                      </span>
                    </div>
                  </div>
                )}

                <div className="flex justify-end mt-3">
                  <button
                    onClick={() => markAsRead(notification.id)}
                    className="text-sm text-blue-600 hover:text-blue-800 mr-4"
                  >
                    Mark as Read
                  </button>
                  {notification.order_id && (
                    <button
                      onClick={() =>
                        navigate(`/order-details/${notification.order_id}`)
                      }
                      className="text-sm text-green-600 hover:text-green-800"
                    >
                      View Full Order
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FarmerNotification;
