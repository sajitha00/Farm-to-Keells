import React, { createContext, useState, useContext, useEffect, useCallback } from "react";
import { supabase } from "../services/supabaseClient";

// Create the context
const FarmerContext = createContext();

// Create a provider component
export const FarmerProvider = ({ children }) => {
  const [farmer, setFarmer] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [profileLoading, setProfileLoading] = useState(false);

  // Memoized fetch products function
  const fetchProducts = useCallback(async (farmerId) => {
    if (!farmerId) return;
    
    try {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("farmer_id", farmerId);

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error("Error fetching products:", error);
      setProducts([]);
    }
  }, []);

  // Fetch and update farmer data from Supabase
  const refreshFarmerData = useCallback(async (farmerId) => {
    if (!farmerId) return;
    
    setProfileLoading(true);
    try {
      const { data, error } = await supabase
        .from("farmers")
        .select("*")
        .eq("id", farmerId)
        .single();

      if (error) throw error;
      if (data) {
        setFarmer(data);
        localStorage.setItem("farmer", JSON.stringify(data));
      }
    } catch (error) {
      console.error("Error refreshing farmer data:", error);
    } finally {
      setProfileLoading(false);
    }
  }, []);

  // Check for stored farmer data when the app loads
  useEffect(() => {
    const initializeFarmer = async () => {
      const storedFarmer = localStorage.getItem("farmer");
      if (storedFarmer) {
        const parsedFarmer = JSON.parse(storedFarmer);
        setFarmer(parsedFarmer);
        await fetchProducts(parsedFarmer.id);
        // Refresh farmer data to get latest from DB
        await refreshFarmerData(parsedFarmer.id);
      }
      setIsLoading(false);
    };

    initializeFarmer();
  }, [fetchProducts, refreshFarmerData]);

  // Login handler
  const loginFarmer = async (farmerData) => {
    setFarmer(farmerData);
    localStorage.setItem("farmer", JSON.stringify(farmerData));
    await fetchProducts(farmerData.id);
    // Refresh farmer data to get complete profile
    await refreshFarmerData(farmerData.id);
  };

  // Logout handler
  const logoutFarmer = () => {
    setFarmer(null);
    localStorage.removeItem("farmer");
    setProducts([]);
  };

  // Update farmer profile handler
  const updateFarmerProfile = async (updatedData) => {
    if (!farmer) return null;
    
    setProfileLoading(true);
    try {
      // Update in Supabase
      const { data, error } = await supabase
        .from("farmers")
        .update(updatedData)
        .eq("id", farmer.id)
        .select()
        .single();

      if (error) throw error;

      // Update local state
      const updatedFarmer = { ...farmer, ...data };
      setFarmer(updatedFarmer);
      localStorage.setItem("farmer", JSON.stringify(updatedFarmer));
      return updatedFarmer;
    } catch (error) {
      console.error("Error updating farmer profile:", error);
      throw error;
    } finally {
      setProfileLoading(false);
    }
  };

  return (
    <FarmerContext.Provider
      value={{
        farmer,
        isLoading,
        profileLoading,
        products,
        setProducts,
        loginFarmer,
        logoutFarmer,
        updateFarmerProfile,
        refreshFarmerData,
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