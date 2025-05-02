import { supabase } from "./supabaseClient";

export const farmerService = {
  // Register Farmer
  async registerFarmer(farmerData) {
    try {
      const { error } = await supabase.from("farmers").insert([
        {
          full_name: farmerData.fullName,
          email: farmerData.email,
          username: farmerData.username,
          location: farmerData.location,
          phone_number: farmerData.phone,
          password: farmerData.password,
        },
      ]);

      if (error) throw error;
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Login Farmer
  async loginFarmer(username, password) {
    try {
      // Fetch the farmer record from Supabase based on the username
      const { data, error } = await supabase
        .from("farmers")
        .select("*")
        .eq("username", username);

      if (error) throw error;

      // Check if no rows are returned (username doesn't exist)
      if (!data || data.length === 0) {
        throw new Error("Username or password is incorrect.");
      }

      console.log(data);

      // Check if the password matches
      if (data[0].password !== password) {
        throw new Error("Username or password is incorrect.");
      }

      // If everything is correct, return success and the farmer's data
      return { success: true, data: data[0] };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },
};
