import React, { useState, useEffect } from "react";
import { useFarmer } from "../context/FarmerProvider";
import { supabase } from "../services/supabaseClient";

const ManageProfile = () => {
  const { farmer, updateFarmerProfile } = useFarmer();
  const [formData, setFormData] = useState({
    email: "",
    full_name: "",
    location: "",
    phone_number: "",
    address: "",
  });
  const [profileImage, setProfileImage] = useState(null);
  const [previewImage, setPreviewImage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  // Initialize form with farmer data
  useEffect(() => {
    if (farmer) {
      setFormData({
        email: farmer.email || "",
        full_name: farmer.full_name || "",
        location: farmer.location || "",
        phone_number: farmer.phone_number || "",
        address: farmer.address || "",
      });
      // Add cache busting to prevent stale image display
      setPreviewImage(
        farmer.avatar_url ? `${farmer.avatar_url}?${Date.now()}` : ""
      );
    }
  }, [farmer]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate image type
    if (!file.type.match("image.*")) {
      setMessage({
        text: "Please select a valid image file (JPEG, PNG)",
        type: "error",
      });
      return;
    }

    // Validate image size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      setMessage({ text: "Image must be less than 2MB", type: "error" });
      return;
    }

    setProfileImage(file);
    setPreviewImage(URL.createObjectURL(file));
    setMessage({ text: "", type: "" }); // Clear any previous error messages
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ text: "", type: "" });

    try {
      let avatarUrl = farmer.avatar_url || "";

      // Upload new profile image if selected
      if (profileImage) {
        // Delete old image if exists
        if (farmer.avatar_url) {
          const oldImagePath = farmer.avatar_url.split("/").pop();
          try {
            await supabase.storage
              .from("profile-images")
              .remove([oldImagePath]);
          } catch (error) {
            console.warn("Error deleting old image:", error.message);
          }
        }

        // Upload new image with unique filename
        const fileExt = profileImage.name.split(".").pop();
        const fileName = `${farmer.id}-${Date.now()}.${fileExt}`;
        const filePath = `profile-images/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from("profile-images")
          .upload(filePath, profileImage, {
            cacheControl: "3600",
            upsert: false,
          });

        if (uploadError) throw uploadError;

        // Construct the public URL directly
        avatarUrl = `${supabase.storage.url}/object/public/profile-images/${filePath}`;
      }

      // Update profile in database
      const { data, error } = await supabase
        .from("farmers")
        .update({
          full_name: formData.full_name,
          location: formData.location,
          phone_number: formData.phone_number,
          address: formData.address,
          avatar_url: avatarUrl,
        })
        .eq("id", farmer.id)
        .select();

      if (error) throw error;

      // Update context and local storage
      await updateFarmerProfile(data[0]);
      setMessage({ text: "Profile updated successfully!", type: "success" });

      // Force refresh of the image preview
      if (avatarUrl) {
        setPreviewImage(`${avatarUrl}?${Date.now()}`);
      }
    } catch (error) {
      console.error("Profile update error:", error);
      setMessage({
        text: error.message || "Failed to update profile. Please try again.",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center bg-cover bg-center p-4 pt-24"
      style={{ backgroundImage: "url('src/assets/background.jpg')" }}
    >
      <div className="bg-white bg-opacity-70 backdrop-blur-lg p-6 rounded-2xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">
          Change Profile Details
        </h2>

        {message.text && (
          <div
            className={`mb-4 p-3 rounded-lg ${
              message.type === "success"
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Profile Picture Section */}
          <div className="flex flex-col items-center">
            <div className="w-24 h-24 rounded-full bg-gray-200 mb-3 overflow-hidden border-2 border-gray-300">
              {previewImage ? (
                <img
                  src={previewImage}
                  alt="Profile"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "";
                    setPreviewImage("");
                  }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-500">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-12 w-12"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>
              )}
            </div>
            <label className="cursor-pointer bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z"
                  clipRule="evenodd"
                />
              </svg>
              Change Image
              <input
                type="file"
                onChange={handleImageChange}
                accept="image/jpeg, image/png"
                className="hidden"
              />
            </label>
            <p className="text-xs text-gray-500 mt-1">JPEG or PNG, max 2MB</p>
          </div>

          {/* Email (read-only) */}
          <div className="flex flex-col">
            <label className="font-medium mb-1">Email</label>
            <input
              type="email"
              value={formData.email}
              readOnly
              className="p-2 border rounded-lg bg-gray-100"
            />
          </div>

          {/* Name */}
          <div className="flex flex-col">
            <label className="font-medium mb-1">Name</label>
            <input
              type="text"
              name="full_name"
              value={formData.full_name}
              onChange={handleInputChange}
              className="p-2 border rounded-lg focus:ring-2 focus:ring-green-400 focus:border-transparent"
              required
            />
          </div>

          {/* Location */}
          <div className="flex flex-col">
            <label className="font-medium mb-1">Location</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              className="p-2 border rounded-lg focus:ring-2 focus:ring-green-400 focus:border-transparent"
              required
            />
          </div>

          {/* Phone Number */}
          <div className="flex flex-col">
            <label className="font-medium mb-1">Phone Number</label>
            <input
              type="tel"
              name="phone_number"
              value={formData.phone_number}
              onChange={handleInputChange}
              className="p-2 border rounded-lg focus:ring-2 focus:ring-green-400 focus:border-transparent"
              pattern="[0-9]{10}"
              title="Please enter a 10-digit phone number"
            />
          </div>

          {/* Address */}
          <div className="flex flex-col">
            <label className="font-medium mb-1">Address</label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              className="p-2 border rounded-lg focus:ring-2 focus:ring-green-400 focus:border-transparent"
              rows="3"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between pt-4">
            <button
              type="button"
              onClick={() => window.history.back()}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium px-4 py-2 rounded-lg transition flex-1 mr-2"
              disabled={isLoading}
            >
              Back
            </button>
            <button
              type="submit"
              className="bg-green-500 hover:bg-green-600 text-white font-medium px-4 py-2 rounded-lg transition flex-1 ml-2 flex items-center justify-center"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ManageProfile;
