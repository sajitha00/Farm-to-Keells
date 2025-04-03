import React, { createContext, useState, useContext, useEffect } from "react";
import { supabase } from "../services/supabaseClient"; // Import Supabase client

// Create the context
const FarmerContext = createContext();

// Create a provider component
export const FarmerProvider = ({ children }) => {
  const [farmer, setFarmer] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [products, setProducts] = useState([]); // Store products

  // Fetch products from Supabase
  const fetchProducts = async (farmerId) => {
    if (!farmerId) return;
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("farmer_id", farmerId);

    if (error) {
      console.error("Error fetching products:", error);
    } else {
      setProducts(data);
    }
  };

  // Check for stored farmer data when the app loads
  useEffect(() => {
    const storedFarmer = localStorage.getItem("farmer");
    if (storedFarmer) {
      const parsedFarmer = JSON.parse(storedFarmer);
      setFarmer(parsedFarmer);
      fetchProducts(parsedFarmer.id); // Fetch products on login
    }
    setIsLoading(false);
  }, []);

  // Login handler
  const loginFarmer = (farmerData) => {
    setFarmer(farmerData);
    localStorage.setItem("farmer", JSON.stringify(farmerData));
    fetchProducts(farmerData.id); // Fetch products after login
  };

  // Logout handler
  const logoutFarmer = () => {
    setFarmer(null);
    localStorage.removeItem("farmer");
    setProducts([]); // Clear products on logout
  };

  // Update farmer profile handler
  const updateFarmerProfile = (updatedData) => {
    const updatedFarmer = { ...farmer, ...updatedData };
    setFarmer(updatedFarmer);
    localStorage.setItem("farmer", JSON.stringify(updatedFarmer));
    return updatedFarmer;
  };

  return (
    <FarmerContext.Provider
      value={{
        farmer,
        isLoading,
        products,
        setProducts,
        loginFarmer,
        logoutFarmer,
        updateFarmerProfile,
        isLoggedIn: !!farmer,
      }}
    >
      {children}
    </FarmerContext.Provider>
  );
};

// Custom hook to use the farmer context
export const useFarmer = () => {
  const context = useContext(FarmerContext);
  if (!context) {
    throw new Error("useFarmer must be used within a FarmerProvider");
  }
  return context;
};
