import React from "react";

function FarmerRegister() {
  return (
    <div
      className="h-screen flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: "url(src/assets/background.jpg)" }}
    >
      {/* Transparent Form Container */}
      <div className="bg-white bg-opacity-70 p-5 pr-5 pl-5 rounded-3xl shadow-lg w-full max-w-md opacity-80">
        <h2 className="text-2xl font-bold text-center mb-4 text-gray-900">
          Farmer Registration
        </h2>

        {/* Registration Form */}
        <form className="space-y-4">
          <input
            type="text"
            placeholder="Full Name"
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none mb-7"
          />
          <input
            type="email"
            placeholder="E-mail Address"
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none mb-7 "
          />
          <input
            type="text"
            placeholder="Username"
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none mb-7"
          />
          <input
            type="text"
            placeholder="Location"
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none mb-7"
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none mb-7"
          />
          <input
            type="password"
            placeholder="Confirm Password"
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none mb-7"
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
