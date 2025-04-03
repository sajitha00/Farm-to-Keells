import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useFarmer } from "../context/FarmerProvider";
import { supabase } from "../services/supabaseClient";

const ViewProduct = () => {
  const { farmer } = useFarmer();
  const queryClient = useQueryClient();

  // Fetch products from Supabase
  const { data: products, isLoading, error } = useQuery({
    queryKey: ['products', farmer?.id],
    queryFn: async () => {
      if (!farmer?.id) return [];
      
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('farmer_id', farmer.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!farmer?.id
  });

  // Delete product mutation
  const deleteMutation = useMutation({
    mutationFn: async (productId) => {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productId)
        .eq('farmer_id', farmer.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['products', farmer?.id]);
    }
  });

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteMutation.mutateAsync(id);
      } catch (error) {
        console.error('Error deleting product:', error);
        alert('Failed to delete product');
      }
    }
  };

  const handleEdit = (id) => {
    alert(`Edit functionality for product ID: ${id} will be implemented later`);
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
        <div className="text-xl text-red-500">Error loading products: {error.message}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center bg-cover bg-center p-4 pt-26" 
         style={{ backgroundImage: "url('src/assets/background.jpg')" }}>
      
      {/* Main content container */}
      <div className="bg-white bg-opacity-70 backdrop-blur-lg p-6 rounded-2xl shadow-lg w-full max-w-4xl">
        <h2 className="text-2xl font-bold text-center mb-6">Your Products</h2>

        {products?.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-lg">No products found. Add your first product!</p>
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
                        onClick={() => handleEdit(product.id)}
                        className="bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-700 transition text-sm sm:px-4 sm:py-2 sm:text-base"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-700 transition text-sm sm:px-4 sm:py-2 sm:text-base"
                        disabled={deleteMutation.isLoading}
                      >
                        {deleteMutation.isLoading ? 'Deleting...' : 'Delete'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewProduct;