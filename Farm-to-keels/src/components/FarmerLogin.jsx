import React from "react";

function FarmerLogin() {
  return (
    <div
      className="h-screen flex flex-col items-center justify-center bg-cover bg-center relative"
      style={{ backgroundImage: "url('src/assets/background.jpg')" }}
    >
      {/* Login Form */}
      <div className="flex justify-center items-center h-full">
        <div className="bg-white bg-opacity-50 backdrop-blur-lg p-8 rounded-3xl shadow-lg w-95  max-w-md">
          <h2 className="text-2xl font-bold text-center mb-6">Farmer Login</h2>

          <form className="space-y-4">
            <div>
              <label className="block font-semibold">Username</label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-green-300"
              />
            </div>
            <div>
              <label className="block font-semibold">Password</label>
              <input
                type="password"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-green-300"
              />
            </div>

            <a href="#" className="text-sm text-gray-600 hover:text-blue-800">
              Forgotten password?
            </a>

            <button className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition mt-4">
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default FarmerLogin;
