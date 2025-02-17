import { useState, useRef, useEffect } from "react";

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
  const dropdownRef = useRef(null);

  // Handle form inputs
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    console.log("Form Submitted:", formData);
  };

  return (
    <div
      className="h-screen flex flex-col items-center justify-center bg-cover bg-center relative"
      style={{ backgroundImage: "url('src/assets/background.jpg')" }}
    >
      {/* Transparent Form Container */}
      <div className="bg-white bg-opacity-80 p-6 rounded-3xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-5 text-gray-900">
          Farmer Registration
        </h2>

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="text"
            name="fullName"
            placeholder="Full Name"
            value={formData.fullName}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
          />
          <input
            type="email"
            name="email"
            placeholder="E-mail Address"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
          />
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
          />

          {/* Location Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <input
              type="text"
              placeholder="Location"
              name="location"
              value={formData.location}
              readOnly
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none cursor-pointer"
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

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
          />
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
          />

          {/* Register Button */}
          <button
            type="submit"
            className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition duration-300"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
}

export default FarmerRegister;
