import React, { useState } from "react";

const ViewProduct = () => {
  // Sample products data (Replace with Supabase later)
  const [products, setProducts] = useState([
    {
      id: "PROD123",
      product: "Carrots",
      quantity: "100 kg",
      price: "2000 LKR",
      state: "Colombo",
      type: "Vegetable",
    },
    {
      id: "PROD124",
      product: "Tomatoes",
      quantity: "50 kg",
      price: "1500 LKR",
      state: "Gampaha",
      type: "Vegetable",
    },
    {
      id: "PROD125",
      product: "Onions",
      quantity: "75 kg",
      price: "1800 LKR",
      state: "Kandy",
      type: "Vegetable",
    },
  ]);

  // Function to delete a product
  const handleDelete = (id) => {
    const updatedProducts = products.filter((product) => product.id !== id);
    setProducts(updatedProducts);
  };

  // Function to edit a product (simple alert, replace with modal later)
  const handleEdit = (id) => {
    alert(`Edit product with ID: ${id}`);
  };

  return (
    <div
      className="h-screen flex justify-center items-center bg-cover bg-center p-6"
      style={{ backgroundImage: "url('src/assets/background.jpg')" }}
    >
      <div className="bg-white bg-opacity-70 backdrop-blur-lg p-8 rounded-3xl shadow-lg w-full max-w-4xl">
        <h2 className="text-2xl font-bold text-center mb-6">View Products</h2>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-green-600 text-white">
                <th className="p-3 text-left">Product</th>
                <th className="p-3 text-left">Type</th>
                <th className="p-3 text-left">Quantity</th>
                <th className="p-3 text-left">Price</th>
                <th className="p-3 text-left">State</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product, index) => (
                <tr
                  key={product.id}
                  className={`border-b ${
                    index % 2 === 0 ? "bg-gray-50" : "bg-white"
                  } hover:bg-gray-100 transition`}
                >
                  <td className="p-3">{product.product}</td>
                  <td className="p-3">{product.type}</td>
                  <td className="p-3">{product.quantity}</td>
                  <td className="p-3">{product.price}</td>
                  <td className="p-3">{product.state}</td>
                  <td className="p-3 flex gap-2">
                    <button
                      onClick={() => handleEdit(product.id)}
                      className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ViewProduct;
