import React, { useState } from "react";

const AddProducts = () => {
  const [productType, setProductType] = useState("");
  return (
    <div
      className="h-screen flex flex-col items-center justify-center bg-cover bg-center relative px-4"
      style={{ backgroundImage: "url('src/assets/background.jpg')" }}
    >
      {/* Form Container */}
      <div className="bg-white bg-opacity-80 p-8 rounded-2xl shadow-lg w-full max-w-md text-center">
        <h2 className="text-2xl font-bold mb-6">Add New Product</h2>

        {/* Input Fields */}
        <form className="space-y-4">
          <div className="flex flex-col text-left">
            <label className="font-semibold">Product</label>
            <input
              type="text"
              className="mt-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          </div>

          {/* Product Type Dropdown */}
          <div className="flex flex-col text-left">
            <label className="font-semibold">Product Type</label>
            <select
              value={productType}
              onChange={(e) => setProductType(e.target.value)}
              className="mt-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
            >
              <option value="" disabled>
                Select Product Type
              </option>
              <option value="Vegetables">Vegetables</option>
              <option value="Fruits">Fruits</option>
            </select>
          </div>

          <div className="flex flex-col text-left">
            <label className="font-semibold">Supply Quantity</label>
            <input
              type="number"
              className="mt-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          </div>

          <div className="flex flex-col text-left">
            <label className="font-semibold">Average Price (LKR)</label>
            <input
              type="number"
              className="mt-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          </div>

          <div className="flex flex-col text-left">
            <label className="font-semibold">State</label>
            <input
              type="text"
              className="mt-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-between mt-6">
            <button
              type="reset"
              className="bg-gray-300 hover:bg-gray-400 text-pink-950 font-semibold px-4 py-2 rounded-lg transition"
            >
              Reset
            </button>
            <button
              type="submit"
              className="bg-green-500 hover:bg-green-600 text-white font-semibold px-4 py-2 rounded-lg transition"
            >
              Place
            </button>
          </div>
        </form>

        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="absolute bottom-6 left-6 text-black font-medium hover:underline"
        >
          Back
        </button>
      </div>
    </div>
  );
};

export default AddProducts;
