import React, { useState } from "react";
import axios from "axios";

const Payment = () => {
  const [email, setEmail] = useState("");
  const [amount, setAmount] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const handlePayment = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus("");

    try {
      const response = await axios.post(
        "http://localhost:5001/api/send-payment",
        {
          email,
          amount,
        }
      );

      if (response.status === 200) {
        setStatus("Payment sent successfully! ✅");
        setEmail("");
        setAmount("");
      }
    } catch (error) {
      console.error("Payment error:", error);
      setStatus(
        "❌ Failed to send payment. Please check the email or try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center p-4">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-green-700 mb-6 text-center">
          Send Payment to Farmer 💸
        </h2>

        <form onSubmit={handlePayment} className="space-y-4">
          <div>
            <label className="block mb-1 font-semibold">Farmer's Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
              placeholder="example@farm.com"
            />
          </div>

          <div>
            <label className="block mb-1 font-semibold">Amount (USD)</label>
            <input
              type="number"
              step="0.01"
              min="1"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
              className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
              placeholder="Enter amount"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-xl transition duration-300"
          >
            {loading ? "Sending..." : "Send Payment"}
          </button>
        </form>

        {status && (
          <div className="mt-4 text-center font-semibold text-sm text-green-700">
            {status}
          </div>
        )}

        <div className="mt-6 text-center">
          <a
            href="/"
            className="text-green-600 hover:underline text-sm font-medium"
          >
            ⬅ Back to Dashboard
          </a>
        </div>
      </div>
    </div>
  );
};

export default Payment;
