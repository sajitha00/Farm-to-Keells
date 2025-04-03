import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addProduct } from "../services/productService";
import { useFarmer } from "../context/FarmerProvider";

const AddProducts = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [productType, setProductType] = useState("");
  const [product, setProduct] = useState("");
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");
  const [state, setState] = useState("");
  const { farmer, isLoggedIn } = useFarmer();

  const mutation = useMutation({
    mutationFn: (productData) => addProduct(productData),
    onSuccess: () => {
      // Invalidate and refetch products for this farmer
      queryClient.invalidateQueries({
        queryKey: ['products', farmer?.id]
      });
      alert("Product added successfully!");
      navigate(-1);
    },
    onError: (error) => {
      console.error("Error adding product:", error);
      alert("Failed to add product. Please try again.");
    }
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!farmer) return;
    
    const productData = {
      farmer_id: farmer.id,
      product_name: product,
      product_type: productType,
      quantity: quantity,
      price: price,
      state: state,
    };

    mutation.mutate(productData);
  };

  const handleReset = () => {
    setProduct("");
    setProductType("");
    setQuantity("");
    setPrice("");
    setState("");
  };

  if (!isLoggedIn) {
    return <p>Please log in to view your profile</p>;
  }

  return (
    <div
      className="h-screen flex flex-col items-center justify-center bg-cover bg-center relative px-4"
      style={{ backgroundImage: "url('src/assets/background.jpg')" }}
    >
      {/* Form Container */}
      <div className="bg-white bg-opacity-80 p-8 rounded-2xl shadow-lg w-full max-w-md text-center">
        <h2 className="text-2xl font-bold mb-6">Add New Product</h2>

        {/* Input Fields */}
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="flex flex-col text-left">
            <label className="font-semibold">Product</label>
            <input
              type="text"
              value={product}
              onChange={(e) => setProduct(e.target.value)}
              className="mt-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
              required
            />
          </div>

          {/* Product Type Dropdown */}
          <div className="flex flex-col text-left">
            <label className="font-semibold">Product Type</label>
            <select
              value={productType}
              onChange={(e) => setProductType(e.target.value)}
              className="mt-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
              required
            >
              <option value="" disabled>
                Select Product Type
              </option>
              <option value="Vegetables">Vegetables</option>
              <option value="Fruits">Fruits</option>
            </select>
          </div>

          <div className="flex flex-col text-left">
            <label className="font-semibold">Supply Quantity (Kg)</label>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="mt-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
              required
            />
          </div>

          <div className="flex flex-col text-left">
            <label className="font-semibold">Average Price (LKR)</label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="mt-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
              required
            />
          </div>

          <div className="flex flex-col text-left">
            <label className="font-semibold">State</label>
            <input
              type="text"
              value={state}
              onChange={(e) => setState(e.target.value)}
              className="mt-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
              required
            />
          </div>
          {/* ... (keep all your existing form fields exactly as they are) ... */}

          {/* Buttons */}
          <div className="flex justify-between mt-6">
            <button
              type="button"
              onClick={handleReset}
              className="bg-gray-300 hover:bg-gray-400 text-pink-950 font-semibold px-4 py-2 rounded-lg transition"
              disabled={mutation.isPending}
            >
              Reset
            </button>
            <button
              type="submit"
              className="bg-green-500 hover:bg-green-600 text-white font-semibold px-4 py-2 rounded-lg transition"
              disabled={mutation.isPending}
            >
              {mutation.isPending ? 'Adding...' : 'Place'}
            </button>
          </div>
        </form>

        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="absolute bottom-6 left-6 bg-gray-300 hover:bg-gray-400 text-pink-950 font-semibold px-4 py-2 rounded-lg transition"
          disabled={mutation.isPending}
        >
          Back
        </button>
      </div>
    </div>
  );
};

export default AddProducts;