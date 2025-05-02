import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardCard from "../components/DashboardCard";
import { useFarmer } from "../context/FarmerProvider";
import { supabase } from "../services/supabaseClient";

const FarmerDashboard = () => {
  const navigate = useNavigate();
  const { farmer, isLoggedIn, logoutFarmer } = useFarmer();
  const [unreadCount, setUnreadCount] = useState(0); // For order notifications
  const [unreadPaymentCount, setUnreadPaymentCount] = useState(0); // For payment notifications
  const [loading, setLoading] = useState(true);

  const dashboardItems = [
    {
      title: "Place Your Orders",
      icon: "src/assets/order.png",
      path: "/AddProducts",
    },
    {
      title: "View Orders",
      icon: "src/assets/view_order.png",
      path: "/ViewProduct",
    },
    {
      title: "Notifications",
      icon: "src/assets/notofications1.png",
      path: "/FarmerNotification",
      badge: unreadCount > 0 ? unreadCount : null,
    },
    {
      title: "Payments",
      icon: "src/assets/payment.png",
      path: "/FarmerPayments",
      badge: unreadPaymentCount > 0 ? unreadPaymentCount : null, // Add badge for payments
    },
    {
      title: "Manage Profile",
      icon: "src/assets/manageProfile.png",
      path: "/ManageProfile",
    },
    {
      title: "Farmer Guide",
      icon: "src/assets/guide2.png",
      path: "/FarmerGuide",
    },
  ];

  useEffect(() => {
    if (!isLoggedIn || !farmer?.id) return;

    const fetchNotifications = async () => {
      try {
        setLoading(true);

        // Fetch unread order notifications (excluding payment notifications)
        const { data: orderData, error: orderError } = await supabase
          .from("notifications")
          .select("id, is_read")
          .eq("farmer_id", farmer.id)
          .eq("is_read", false)
          .not("message", "ilike", "%Payment of%");

        if (orderError) throw orderError;
        setUnreadCount(orderData.length);

        // Fetch unread payment notifications
        const { data: paymentData, error: paymentError } = await supabase
          .from("notifications")
          .select("id, is_read")
          .eq("farmer_id", farmer.id)
          .eq("is_read", false)
          .ilike("message", "%Payment of%");

        if (paymentError) throw paymentError;
        setUnreadPaymentCount(paymentData.length);
      } catch (err) {
        console.error("Error fetching notifications:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();

    // Real-time subscription for new notifications
    const channel = supabase
      .channel(`notifications:${farmer.id}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "notifications",
          filter: `farmer_id=eq.${farmer.id}`,
        },
        (payload) => {
          // Increment the appropriate count based on the notification type
          if (payload.new.message.includes("Payment of")) {
            setUnreadPaymentCount((prev) => prev + 1);
          } else {
            setUnreadCount((prev) => prev + 1);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [isLoggedIn, farmer?.id]);

  if (!isLoggedIn) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg">Please log in to view your dashboard</p>
      </div>
    );
  }

  const handleLogout = async () => {
    await logoutFarmer();
    navigate("/");
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center bg-cover bg-center p-4 pt-28 pb-20"
      style={{ backgroundImage: "url('src/assets/background.jpg')" }}
    >
      {/* Header */}
      <div className="w-full max-w-4xl mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-800">
          Welcome, <span className="text-gray-800">{farmer.full_name}</span>
        </h1>
        <p className="text-gray-600 font-bold mt-2">
          Access Your farming dashboard
        </p>
      </div>

      {/* Dashboard Cards */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <p>Loading...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-4xl">
          {dashboardItems.map((item, index) => (
            <DashboardCard
              key={index}
              title={item.title}
              icon={item.icon}
              badge={item.badge}
              onClick={() => item.path && navigate(item.path)}
            />
          ))}
        </div>
      )}

      {/* Footer Actions */}
      <div className="fixed bottom-6 right-6 space-x-4">
        <button
          onClick={() => navigate("/Contact")}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
        >
          Help
        </button>
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

export default FarmerDashboard;
