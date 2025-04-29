import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useFarmer } from "../context/FarmerProvider";
import { supabase } from "../services/supabaseClient";

const ViewProduct = () => {
  const { farmer } = useFarmer();
  const queryClient = useQueryClient();

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
      className="min-h-screen flex flex-col items-center bg-cover bg-center p-4 pt-26"
      style={{ backgroundImage: "url('src/assets/background.jpg')" }}
    >
      <div className="bg-white bg-opacity-70 backdrop-blur-lg p-6 rounded-2xl shadow-lg w-full max-w-4xl">
        <h2 className="text-2xl font-bold text-center mb-6">Your Products</h2>

        {products?.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-lg">
              No products found. Add your first product!
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-green-600 text-white">
                  <th className="p-3 text-left">Product</th>
                  <th className="p-3 text-left">Type</th>
                  <th className="p-3 text-left">Quantity (kg)</th>
                  <th className="p-3 text-left">Price (LKR)</th>
                  <th className="p-3 text-left">Location</th>
                  <th className="p-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products?.map((product, index) => (
                  <tr
                    key={product.id}
                    className={`border-b ${
                      index % 2 === 0 ? "bg-gray-50" : "bg-white"
                    } hover:bg-gray-100 transition`}
                  >
                    <td className="p-3">{product.product_name}</td>
                    <td className="p-3">{product.product_type}</td>
                    <td className="p-3">{product.quantity}</td>
                    <td className="p-3">{product.price}</td>
                    <td className="p-3">{product.state}</td>
                    <td className="p-3 flex gap-2">
                      <button
                        onClick={() => handleEdit(product)}
                        className="bg-orange-400 text-white px-3 py-1 rounded-lg hover:bg-orange-500 transition text-sm sm:px-4 sm:py-2 sm:text-base"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-700 transition text-sm sm:px-4 sm:py-2 sm:text-base"
                        disabled={deleteMutation.isLoading}
                      >
                        {deleteMutation.isLoading ? "Deleting..." : "Delete"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal for Editing Product */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center">
          <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">Edit Product</h3>

            <div className="flex flex-col space-y-4 text-left">
              <div>
                <label className="font-semibold">Product</label>
                <input
                  type="text"
                  value={editingProduct.product_name}
                  onChange={(e) =>
                    handleEditChange("product_name", e.target.value)
                  }
                  placeholder="Product Name"
                  className="border p-2 rounded-lg w-full"
                />
              </div>
              <div>
                <label className="font-semibold">Product Type</label>
                <select
                  value={editingProduct.product_type}
                  onChange={(e) =>
                    handleEditChange("product_type", e.target.value)
                  }
                  className="border p-2 rounded-lg w-full"
                >
                  <option value="">Select Product Type</option>
                  <option value="Vegetables">Vegetables</option>
                  <option value="Fruits">Fruits</option>
                </select>
              </div>
              <div>
                <label className="font-semibold">Supply Quantity (Kg)</label>
                <input
                  type="number"
                  value={editingProduct.quantity}
                  onChange={(e) => handleEditChange("quantity", e.target.value)}
                  placeholder="Supply Quantity (Kg)"
                  className="border p-2 rounded-lg w-full"
                />
              </div>
              <div>
                <label className="font-semibold">Average Price (LKR)</label>
                <input
                  type="number"
                  value={editingProduct.price}
                  onChange={(e) => handleEditChange("price", e.target.value)}
                  placeholder="Average Price (LKR)"
                  className="border p-2 rounded-lg w-full"
                />
              </div>

              <div className="flex justify-between pt-4">
                <button
                  onClick={handleUpdate}
                  className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                  disabled={updateMutation.isPending}
                >
                  {updateMutation.isPending ? "Updating..." : "Update"}
                </button>
                <button
                  onClick={() => setEditModalOpen(false)}
                  className="bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
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
