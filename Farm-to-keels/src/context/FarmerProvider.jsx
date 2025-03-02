import React, { createContext, useState, useContext, useEffect } from "react";

// Create the context
const FarmerContext = createContext();

// Create a provider component
export const FarmerProvider = ({ children }) => {
  const [farmer, setFarmer] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for stored farmer data when the app loads
  useEffect(() => {
    const storedFarmer = localStorage.getItem("farmer");
    if (storedFarmer) {
      setFarmer(JSON.parse(storedFarmer));
    }
    setIsLoading(false);
  }, []);

  // Login handler
  const loginFarmer = (farmerData) => {
    setFarmer(farmerData);
    // Store in localStorage for persistence across refreshes
    localStorage.setItem("farmer", JSON.stringify(farmerData));
  };

  // Logout handler
  const logoutFarmer = () => {
    setFarmer(null);
    localStorage.removeItem("farmer");
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
  if (context === undefined) {
    throw new Error("useFarmer must be used within a FarmerProvider");
  }
  return context;
};
