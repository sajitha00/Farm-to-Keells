import { useState, useRef, useEffect } from "react";
import { farmerService } from "../services/FarmerService";

const districts = [
  "Colombo",
  "Gampaha",
  "Kalutara",
  "Kandy",
  "Matale",
  "Nuwara Eliya",
  "Galle",
  "Matara",
  "Hambantota",
  "Jaffna",
  "Kilinochchi",
  "Mannar",
  "Vavuniya",
  "Mullaitivu",
  "Batticaloa",
  "Ampara",
  "Trincomalee",
  "Kurunegala",
  "Puttalam",
  "Anuradhapura",
  "Polonnaruwa",
  "Badulla",
  "Monaragala",
  "Ratnapura",
  "Kegalle",
];

function FarmerRegister() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    username: "",
    location: "",
    password: "",
    confirmPassword: "",
  });

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const dropdownRef = useRef(null);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // Form validation
      if (formData.password !== formData.confirmPassword) {
        throw new Error("Passwords do not match!");
      }

      if (
        !formData.fullName ||
        !formData.email ||
        !formData.username ||
        !formData.location ||
        !formData.password
      ) {
        throw new Error("All fields are required!");
      }

      // Call the service to handle registration
      const result = await farmerService.registerFarmer(formData);

      if (!result.success) {
        throw new Error(result.error);
      }

      // Clear form on success
      setFormData({
        fullName: "",
        email: "",
        username: "",
        location: "",
        password: "",
        confirmPassword: "",
      });

      alert("Registration successful!");
    } catch (error) {
      setError(error.message);
      alert(`Registration failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="h-screen flex flex-col items-center justify-center bg-cover bg-center relative"
      style={{ backgroundImage: "url('src/assets/background.jpg')" }}
    >
      <div className="bg-white bg-opacity-80 p-6 rounded-3xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-5 text-gray-900">
          Farmer Registration
        </h2>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="text"
            name="fullName"
            placeholder="Full Name"
            value={formData.fullName}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
            disabled={loading}
          />

          <input
            type="email"
            name="email"
            placeholder="E-mail Address"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
            disabled={loading}
          />

          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
            disabled={loading}
          />

          <div className="relative" ref={dropdownRef}>
            <input
              type="text"
              placeholder="Location"
              name="location"
              value={formData.location}
              readOnly
              onClick={() => !loading && setIsDropdownOpen(!isDropdownOpen)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none cursor-pointer"
              disabled={loading}
            />

            {isDropdownOpen && (
              <div className="absolute mt-2 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto z-10">
                {districts.map((district, index) => (
                  <div
                    key={index}
                    onClick={() => {
                      setFormData({ ...formData, location: district });
                      setIsDropdownOpen(false);
                    }}
                    className="px-4 py-2 cursor-pointer hover:bg-gray-200"
                  >
                    {district}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
              disabled={loading}
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
              disabled={loading}
            >
              {showPassword ? "👁️" : "🙈"}
            </button>
          </div>

          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
              disabled={loading}
            />

            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
              disabled={loading}
            >
              {showConfirmPassword ? "👁️" : "🙈"}
            </button>
          </div>

          <button
            type="submit"
            className={`w-full ${
              loading ? "bg-gray-400" : "bg-green-500 hover:bg-green-600"
            } text-white py-2 rounded-lg transition duration-300`}
            disabled={loading}
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default FarmerRegister;
