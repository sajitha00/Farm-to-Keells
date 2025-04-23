import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../services/supabaseClient";
import { useFarmer } from "../context/FarmerProvider";

const FarmerPayments = () => {
  const navigate = useNavigate();
  const { farmer } = useFarmer();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!farmer?.id) {
      setLoading(false);
      return;
    }

    const fetchNotifications = async () => {
      try {
        const { data, error } = await supabase
          .from("notifications")
          .select("id, message, created_at, is_read, is_accepted")
          .eq("farmer_id", farmer.id)
          .ilike("message", "%Payment of%")
          .order("created_at", { ascending: false });

        if (error) throw error;
        console.log("Fetched notifications:", data);
        setNotifications(data || []);
      } catch (err) {
        console.error("Error fetching notifications:", err);
        setError("Failed to load notifications. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();

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
      setError("Failed to remove notification.");
    }
  };

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
      setError("Failed to mark all notifications as read.");
    }
  };

  const handleAcceptPayment = async (notification) => {
    try {
      console.log("Accepting payment for notification:", notification);

      // Step 1: Update the notification to mark it as accepted
      console.log("Updating notification to mark as accepted...");
      const { error: updateError } = await supabase
        .from("notifications")
        .update({ is_accepted: true, is_read: true })
        .eq("id", notification.id);

      if (updateError) {
        console.error("Update error:", updateError);
        throw new Error(
          `Failed to update notification: ${updateError.message}`
        );
      }

      setNotifications((prev) =>
        prev.map((n) =>
          n.id === notification.id
            ? { ...n, is_accepted: true, is_read: true }
            : n
        )
      );

      // Step 2: Extract amount from the notification message
      const amountMatch = notification.message.match(/Payment of \$(\d+)/);
      const amount = amountMatch ? amountMatch[1] : "unknown";
      console.log("Extracted amount:", amount);

      // Step 3: Fetch the farmer's name
      console.log("Fetching farmer's name for farmer_id:", farmer.id);
      const { data: farmerData, error: farmerError } = await supabase
        .from("farmers")
        .select("full_name")
        .eq("id", farmer.id)
        .single();

      if (farmerError) {
        console.error("Farmer fetch error:", farmerError);
        throw new Error(
          `Failed to fetch farmer's name: ${farmerError.message}`
        );
      }
      if (!farmerData) {
        throw new Error("Farmer not found in the database.");
      }
      const farmerName = farmerData.full_name;
      console.log("Farmer name:", farmerName);

      // Step 4: Create a new notification for the supermarket (without supermarket_id)
      const newNotification = {
        message: `Farmer ${farmerName} has accepted your payment of $${amount}.`,
        created_at: new Date().toISOString(),
        is_read: false,
        is_accepted: false, // Add this to match the schema
        type: "order", // Add this to match the schema
      };
      console.log(
        "Inserting new notification for supermarket:",
        newNotification
      );

      const { error: insertError } = await supabase
        .from("notifications")
        .insert(newNotification);

      if (insertError) {
        console.error("Insert error:", insertError);
        throw new Error(
          `Failed to insert supermarket notification: ${insertError.message}`
        );
      }
      console.log("Created notification for supermarket:", newNotification);
    } catch (err) {
      console.error("Error accepting payment:", err.message);
      setError(err.message || "Failed to accept payment. Please try again.");
    }
  };

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

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen flex flex-col items-center bg-green-100 p-4 pt-32"
      style={{ backgroundImage: "url('/assets/background.jpg')" }}
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
                <div className="flex justify-end mt-3 space-x-3">
                  {!notification.is_accepted ? (
                    <button
                      onClick={() => handleAcceptPayment(notification)}
                      className="text-sm text-green-600 hover:text-green-800 focus:outline-none"
                    >
                      Accept
                    </button>
                  ) : (
                    <span className="text-sm text-green-600">Accepted</span>
                  )}
                  <button
                    onClick={() => handleRemoveNotification(notification.id)}
                    className="text-sm text-red-600 hover:text-red-800 focus:outline-none"
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
