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
      queryClient.invalidateQueries({
        queryKey: ["products", farmer?.id],
      });
      alert("Product added successfully!");
      navigate(-1);
    },
    onError: (error) => {
      console.error("Error adding product:", error);
      alert("Failed to add product. Please try again.");
    },
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
      className="min-h-screen flex flex-col items-center justify-center bg-cover bg-center px-4 pt-32 relative"
      style={{ backgroundImage: "url('src/assets/background.jpg')" }}
    >
      {/* Form Container */}
      <div className="bg-white bg-opacity-80 backdrop-blur-md p-6 md:p-8 rounded-3xl shadow-2xl w-full max-w-md text-center relative">
        <h2 className="text-2xl md:text-3xl font-bold mb-6 text-gray-800">
          Add New Product
        </h2>

        {/* Input Form */}
        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="flex flex-col text-left">
            <label className="font-semibold mb-1">Product Name</label>
            <input
              type="text"
              value={product}
              onChange={(e) => setProduct(e.target.value)}
              className="px-4 py-2.5 border rounded-2xl bg-white focus:outline-none focus:ring-4 focus:ring-green-400"
              required
            />
          </div>

          <div className="flex flex-col text-left">
            <label className="font-semibold mb-1">Product Type</label>
            <select
              value={productType}
              onChange={(e) => setProductType(e.target.value)}
              className="px-4 py-2.5 border rounded-2xl bg-white focus:outline-none focus:ring-4 focus:ring-green-400"
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
            <label className="font-semibold mb-1">Supply Quantity (Kg)</label>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="px-4 py-2.5 border rounded-2xl bg-white focus:outline-none focus:ring-4 focus:ring-green-400"
              required
            />
          </div>

          <div className="flex flex-col text-left">
            <label className="font-semibold mb-1">Average Price (LKR)</label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="px-4 py-2.5 border rounded-2xl bg-white focus:outline-none focus:ring-4 focus:ring-green-400"
              required
            />
          </div>

          <div className="flex flex-col text-left">
            <label className="font-semibold mb-1">State</label>
            <input
              type="text"
              value={state}
              onChange={(e) => setState(e.target.value)}
              className="px-4 py-2.5 border rounded-2xl bg-white focus:outline-none focus:ring-4 focus:ring-green-400"
              required
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between mt-6">
            <button
              type="button"
              onClick={handleReset}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold px-6 py-2 rounded-2xl transition"
              disabled={mutation.isPending}
            >
              Reset
            </button>
            <button
              type="submit"
              className="bg-green-500 hover:bg-green-600 text-white font-bold px-6 py-2 rounded-2xl transition"
              disabled={mutation.isPending}
            >
              {mutation.isPending ? "Adding..." : "Place"}
            </button>
          </div>
        </form>
      </div>

      {/* Proper Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="absolute bottom-8 left-8 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold px-6 py-2 rounded-2xl transition"
        disabled={mutation.isPending}
      >
        ← Back
      </button>
    </div>
  );
};

export default AddProducts;
