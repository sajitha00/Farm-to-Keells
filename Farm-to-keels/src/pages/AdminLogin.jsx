import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    // Check if username and password are correct
    if (username === "admin" && password === "admin") {
      navigate("/SuperMarketDashboard"); // Redirect to the dashboard
    } else {
      setError("Invalid username or password");
    }
  };

  return (
    <div
      className="h-screen flex flex-col items-center justify-center bg-cover bg-center relative"
      style={{ backgroundImage: "url('src/assets/background.jpg')" }}
    >
      {/* Login Form */}
      <div className="flex justify-center items-center h-full">
        <div className="bg-white bg-opacity-50 backdrop-blur-lg p-8 rounded-3xl shadow-lg w-95 max-w-md">
          <h2 className="text-2xl font-bold text-center mb-6">
            Keells Admin Login
          </h2>

          {error && <p className="text-red-600 text-center mb-2">{error}</p>}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block font-semibold">Admin Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-green-300"
                required
              />
            </div>
            <div>
              <label className="block font-semibold">Admin Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-green-300"
                required
              />
            </div>

            <a
              href="#"
              className="text-sm text-gray-600 hover:text-blue-800 font-semibold"
            >
              Forgotten password?
            </a>

            <button
              type="submit"
              className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition mt-2 mb-2"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AdminLogin;
