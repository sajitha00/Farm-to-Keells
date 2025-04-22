import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../services/supabaseClient";
import { useFarmer } from "../context/FarmerProvider";

const FarmerPayments = () => {
  const navigate = useNavigate();
  const { farmer } = useFarmer();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch payment notifications when farmer.id is available
  useEffect(() => {
    if (!farmer?.id) return;

    const fetchNotifications = async () => {
      const { data, error } = await supabase
        .from("notifications")
        .select("id, message, created_at, is_read")
        .eq("farmer_id", farmer.id)
        .ilike("message", "%Payment of%")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching notifications:", error);
        return;
      }
      setNotifications(data || []);
      setLoading(false);
    };

    fetchNotifications();

    // Real-time subscription for new payment notifications
    const paymentChannel = supabase
      .channel(`payment_notifications:${farmer.id}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "notifications",
          filter: `farmer_id=eq.${farmer.id}`,
        },
        (payload) => {
          if (payload.new.message.includes("Payment of")) {
            setNotifications((prev) => [payload.new, ...prev]);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(paymentChannel);
    };
  }, [farmer?.id]);

  // Remove a notification
  const handleRemoveNotification = async (notificationId) => {
    try {
      const { error } = await supabase
        .from("notifications")
        .delete()
        .eq("id", notificationId);

      if (error) throw error;

      setNotifications((prev) =>
        prev.filter((notification) => notification.id !== notificationId)
      );
    } catch (err) {
      console.error("Error removing notification:", err);
    }
  };

  // Mark all notifications as read
  const markAllAsRead = async () => {
    try {
      const { error } = await supabase
        .from("notifications")
        .update({ is_read: true })
        .eq("farmer_id", farmer.id)
        .ilike("message", "%Payment of%");

      if (error) throw error;

      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
    } catch (err) {
      console.error("Error marking all notifications as read:", err);
    }
  };

  // Navigate back to dashboard
  const handleBack = () => {
    navigate("/FarmerDashboard");
  };

  if (!farmer?.id) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg">Please log in to view your payments</p>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen flex flex-col items-center bg-green-100 p-4 pt-32"
      style={{ backgroundImage: "url('src/assets/background.jpg')" }}
    >
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Payment History</h1>
          <div className="flex gap-2">
            <button
              onClick={markAllAsRead}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
            >
              Mark All as Read
            </button>
            <button
              onClick={handleBack}
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
        ) : notifications.length > 0 ? (
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
                    Payment Received
                  </h3>
                  <span className="text-sm text-gray-500">
                    {new Date(notification.created_at).toLocaleString()}
                  </span>
                </div>
                <p className="text-gray-700">{notification.message}</p>
                <div className="flex justify-end mt-3">
                  <button
                    onClick={() => handleRemoveNotification(notification.id)}
                    className="text-sm text-red-600 hover:text-red-800"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center p-8">
            <p className="text-gray-600 text-lg">
              No payment notifications yet
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FarmerPayments;
