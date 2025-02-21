import React, { useState } from "react";
import { farmerService } from "../services/FarmerService";
import { useNavigate } from "react-router-dom";

function FarmerLogin() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Call the loginFarmer method from farmerService
      const result = await farmerService.loginFarmer(
        formData.username,
        formData.password
      );

      if (!result.success) {
        throw new Error(result.error);
      }

      // If login is successful, navigate to the dashboard
      alert("Login successful!");
      // navigate("/dashboard"); // Replace with your dashboard route
    } catch (error) {
      setError(error.message);
      alert(`Login failed: ${error.message}`);
    } finally {
      setLoading(false);
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
          <h2 className="text-2xl font-bold text-center mb-6">Farmer Login</h2>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block font-semibold">Username</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-green-300"
                disabled={loading}
              />
            </div>
            <div>
              <label className="block font-semibold">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-green-300"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-600 hover:text-gray-800"
                  disabled={loading}
                >
                  {showPassword ? "👁️" : "🙈"}
                </button>
              </div>
            </div>

            <a
              href="#"
              className="text-sm text-gray-600 hover:text-blue-800 font-semibold"
            >
              Forgotten password?
            </a>

            <button
              type="submit"
              className={`w-full ${
                loading ? "bg-gray-400" : "bg-green-600 hover:bg-green-700"
              } text-white py-2 rounded-lg transition duration-300`}
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default FarmerLogin;
