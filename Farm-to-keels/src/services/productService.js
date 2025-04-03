import { supabase } from "./supabaseClient";

export const addProduct = async (productData) => {
  const { data, error } = await supabase
    .from("products")
    .insert([productData])
    .select();
  
  if (error) throw error;
  return data;
};

export const fetchProductsByFarmer = async (farmerId) => {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("farmer_id", farmerId);
  
  if (error) throw error;
  return data;
};