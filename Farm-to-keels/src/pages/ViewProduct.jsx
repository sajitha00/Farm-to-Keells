import React, { useState, useEffect } from "react";
import { supabase } from "../services/supabaseClient"; // Import Supabase client
import { useFarmer } from "../context/FarmerProvider"; // Import Farmer Context

const ViewProducts = () => {
  const { farmer, isLoggedIn } = useFarmer(); // Get farmer data from context
  const [products, setProducts] = useState([]); // State to store products
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

  // Fetch products for the logged-in farmer
  useEffect(() => {
    const fetchProducts = async () => {
      if (!farmer) {
        console.error("Farmer is not defined.");
        return;
      }

      try {
        console.log("Fetching products for farmer ID:", farmer.fid); // Log farmer ID
        const { data, error } = await supabase
          .from("products")
          .select("*")
          .eq("farmer_id", farmer.fid); // Fetch products for the logged-in farmer

        if (error) throw error;

        console.log("Fetched products:", data); // Log fetched products
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error); // Log errors
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [farmer]);

  if (!isLoggedIn) {
    return (
      <p className="text-center text-red-500">
        Please log in to view your products.
      </p>
    );
  }

  if (loading) {
    return <p className="text-center">Loading products...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500">Error: {error}</p>;
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">View Products</h2>

      {products.length === 0 ? (
        <p className="text-center text-gray-500">No products found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-2 border">Product Name</th>
                <th className="px-4 py-2 border">Product Type</th>
                <th className="px-4 py-2 border">Quantity (kg)</th>
                <th className="px-4 py-2 border">Price (LKR)</th>
                <th className="px-4 py-2 border">State</th>
                <th className="px-4 py-2 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 border">{product.product_name}</td>
                  <td className="px-4 py-2 border">{product.product_type}</td>
                  <td className="px-4 py-2 border">{product.quantity}</td>
                  <td className="px-4 py-2 border">{product.price}</td>
                  <td className="px-4 py-2 border">{product.state}</td>
                  <td className="px-4 py-2 border">
                    <button
                      onClick={() =>
                        handleUpdate(product.id, {
                          product_name: "Updated Name",
                          price: 100,
                        })
                      }
                      className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded mr-2"
                    >
                      Update
                    </button>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ViewProducts;
