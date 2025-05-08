import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useFarmer } from "../context/FarmerProvider";
import { supabase } from "../services/supabaseClient";
import { useNavigate } from "react-router-dom";

const ViewProduct = () => {
  const { farmer } = useFarmer();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const {
    data: products,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["products", farmer?.id],
    queryFn: async () => {
      if (!farmer?.id) return [];

      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("farmer_id", farmer.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!farmer?.id,
  });

  const deleteMutation = useMutation({
    mutationFn: async (productId) => {
      const { error } = await supabase
        .from("products")
        .delete()
        .eq("id", productId)
        .eq("farmer_id", farmer.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["products", farmer?.id]);
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (updatedProduct) => {
      const { id, ...fieldsToUpdate } = updatedProduct;
      const { error } = await supabase
        .from("products")
        .update(fieldsToUpdate)
        .eq("id", id)
        .eq("farmer_id", farmer.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["products", farmer?.id]);
      setEditModalOpen(false);
      alert("Product updated successfully!");
    },
    onError: () => {
      alert("Failed to update product.");
    },
  });

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await deleteMutation.mutateAsync(id);
      } catch (error) {
        console.error("Error deleting product:", error);
        alert("Failed to delete product");
      }
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setEditModalOpen(true);
  };

  const handleEditChange = (field, value) => {
    setEditingProduct({ ...editingProduct, [field]: value });
  };

  const handleUpdate = () => {
    const updatedProduct = { ...editingProduct };
    delete updatedProduct.state; // Remove state field before updating
    updateMutation.mutate(updatedProduct);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen pt-24 flex justify-center items-start">
        <div className="text-xl">Loading products...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen pt-24 flex justify-center items-start">
        <div className="text-xl text-red-500">
          Error loading products: {error.message}
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen flex flex-col items-center bg-cover bg-center p-6 pt-28"
      style={{ backgroundImage: "url('src/assets/background.jpg')" }}
    >
      <div className="bg-white/80 backdrop-blur-sm p-8 rounded-3xl shadow-xl w-full max-w-4xl">
        <div className="flex justify-between items-center mb-8">
          <button
            onClick={() => navigate("/FarmerDashboard")}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition"
          >
            Back
          </button>
          <h2 className="text-3xl font-bold text-center flex-1 text-green-800">
            Your Products
          </h2>
          <div className="w-24"></div> {/* Spacer for balance */}
        </div>

        {products?.length === 0 ? (
          <div className="text-center py-12 bg-white/50 rounded-2xl">
            <p className="text-lg text-gray-700">
              No products found. Add your first product!
            </p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-gray-100 shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-green-600 text-white">
                    <th className="p-4 text-left font-semibold">Product</th>
                    <th className="p-4 text-left font-semibold">Type</th>
                    <th className="p-4 text-left font-semibold">
                      Quantity (kg)
                    </th>
                    <th className="p-4 text-left font-semibold">Price (LKR)</th>
                    <th className="p-4 text-left font-semibold">Location</th>
                    <th className="p-4 text-left font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products?.map((product, index) => (
                    <tr
                      key={product.id}
                      className={`border-b ${
                        index % 2 === 0 ? "bg-white/70" : "bg-gray-50/70"
                      } hover:bg-gray-100/80 transition duration-150`}
                    >
                      <td className="p-4">{product.product_name}</td>
                      <td className="p-4">{product.product_type}</td>
                      <td className="p-4">{product.quantity}</td>
                      <td className="p-4">{product.price}</td>
                      <td className="p-4">{product.state}</td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(product)}
                            className="bg-orange-400 text-white px-4 py-2 rounded-lg hover:bg-orange-500 transition-all duration-200 transform hover:scale-105 shadow-sm"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(product.id)}
                            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-all duration-200 transform hover:scale-105 shadow-sm"
                            disabled={deleteMutation.isLoading}
                          >
                            {deleteMutation.isLoading
                              ? "Deleting..."
                              : "Delete"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Modal for Editing Product */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center p-4">
          <div className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-md">
            <h3 className="text-2xl font-bold mb-6 text-green-800">
              Edit Product
            </h3>

            <div className="flex flex-col space-y-4">
              <div>
                <label className="font-semibold text-gray-700 block mb-1">
                  Product Name
                </label>
                <input
                  type="text"
                  value={editingProduct.product_name}
                  onChange={(e) =>
                    handleEditChange("product_name", e.target.value)
                  }
                  placeholder="Product Name"
                  className="border border-gray-300 p-3 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                />
              </div>
              <div>
                <label className="font-semibold text-gray-700 block mb-1">
                  Product Type
                </label>
                <select
                  value={editingProduct.product_type}
                  onChange={(e) =>
                    handleEditChange("product_type", e.target.value)
                  }
                  className="border border-gray-300 p-3 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                >
                  <option value="">Select Product Type</option>
                  <option value="Vegetables">Vegetables</option>
                  <option value="Fruits">Fruits</option>
                </select>
              </div>
              <div>
                <label className="font-semibold text-gray-700 block mb-1">
                  Supply Quantity (Kg)
                </label>
                <input
                  type="number"
                  value={editingProduct.quantity}
                  onChange={(e) => handleEditChange("quantity", e.target.value)}
                  placeholder="Supply Quantity (Kg)"
                  className="border border-gray-300 p-3 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                />
              </div>
              <div>
                <label className="font-semibold text-gray-700 block mb-1">
                  Average Price (LKR)
                </label>
                <input
                  type="number"
                  value={editingProduct.price}
                  onChange={(e) => handleEditChange("price", e.target.value)}
                  placeholder="Average Price (LKR)"
                  className="border border-gray-300 p-3 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                />
              </div>

              <div className="flex justify-between pt-6">
                <button
                  onClick={handleUpdate}
                  className="bg-green-500 text-white px-6 py-2.5 rounded-xl hover:bg-green-600 transition-all duration-200 transform hover:scale-105 shadow-sm"
                  disabled={updateMutation.isPending}
                >
                  {updateMutation.isPending ? "Updating..." : "Update"}
                </button>
                <button
                  onClick={() => setEditModalOpen(false)}
                  className="bg-gray-400 text-white px-6 py-2.5 rounded-xl hover:bg-gray-500 transition-all duration-200 transform hover:scale-105 shadow-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewProduct;
