import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../services/supabaseClient";

const SuperMarketNotification = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const username = localStorage.getItem("supermarketUsername");
    if (username === "admin") {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
      setLoading(false);
      return;
    }

    const fetchNotifications = async () => {
      try {
        const { data, error } = await supabase
          .from("notifications")
          .select("id, message, created_at, is_read")
          .ilike("message", "Farmer%has accepted your payment%")
          .order("created_at", { ascending: false });

        if (error) throw error;
        setNotifications(data || []);
      } catch (err) {
        setError("Failed to load notifications. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();

    const channel = supabase
      .channel("supermarket_notifications")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "notifications",
        },
        (payload) => {
          if (
            payload.new.message.includes("Farmer") &&
            payload.new.message.includes("has accepted your payment")
          ) {
            setNotifications((prev) => [payload.new, ...prev]);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

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
    } catch {
      setError("Failed to mark notification as read.");
    }
  };

  const markAllAsRead = async () => {
    try {
      const { error } = await supabase
        .from("notifications")
        .update({ is_read: true })
        .ilike("message", "Farmer%has accepted your payment%")
        .eq("is_read", false);

      if (error) throw error;

      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
    } catch {
      setError("Failed to mark all notifications as read.");
    }
  };

  const deleteNotification = async (id) => {
    try {
      const { error } = await supabase
        .from("notifications")
        .delete()
        .eq("id", id);

      if (error) throw error;

      setNotifications((prev) => prev.filter((n) => n.id !== id));
    } catch {
      setError("Failed to remove notification.");
    }
  };

  const handleBack = () => {
    navigate("/SuperMarketDashboard");
  };

  const handleLogout = () => {
    localStorage.removeItem("supermarketUsername");
    navigate("/");
  };

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 px-4 sm:px-8 bg-gradient-to-br from-green-100 to-green-200">
      <div className="max-w-6xl mx-auto bg-white p-6 rounded-2xl shadow-xl border border-green-300 relative">
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
            {notifications.map((notification) => {
              const match = notification.message.match(
                /Farmer (.+) has accepted your payment of \$(\d+)\./
              );
              const farmerName = match ? match[1] : "Unknown Farmer";
              const amount = match ? match[2] : "Unknown Amount";

              return (
                <div
                  key={notification.id}
                  className={`p-4 rounded-lg border flex flex-col sm:flex-row justify-between sm:items-center ${
                    !notification.is_read
                      ? "bg-blue-50 border-blue-200"
                      : "bg-white border-gray-200"
                  }`}
                >
                  <div>
                    <h3 className="font-medium text-gray-800 mb-1">
                      Payment Accepted
                    </h3>
                    <p className="text-gray-700">Farmer: {farmerName}</p>
                    <p className="text-gray-700">
                      Amount: LKR {(parseInt(amount) * 300).toLocaleString()}{" "}
                      (USD {amount})
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      {new Date(notification.created_at).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex gap-3 mt-3 sm:mt-0">
                    {!notification.is_read && (
                      <button
                        onClick={() => markAsRead(notification.id)}
                        className="text-sm text-blue-600 hover:text-blue-800"
                      >
                        Mark as Read
                      </button>
                    )}
                    <button
                      onClick={() => deleteNotification(notification.id)}
                      className="text-sm text-red-600 hover:text-red-800"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center p-8">
            <p className="text-gray-600 text-lg">
              No payment acceptance notifications yet
            </p>
          </div>
        )}
      </div>

      {/* Logout Button */}
      <div className="fixed bottom-6 right-6">
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
        >
          Log Out
        </button>
      </div>
    </div>
  );
};

export default SuperMarketNotification;
