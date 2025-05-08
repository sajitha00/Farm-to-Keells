import React, { useState } from "react";
import emailjs from "@emailjs/browser";
import { useNavigate } from "react-router-dom";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!formData.name || !formData.email || !formData.message) {
      setError("Please fill in all fields.");
      setSuccess("");
      return;
    }

    // Email validation (basic regex)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email address.");
      setSuccess("");
      return;
    }

    try {
      await emailjs.send(
        "service_v67v45i", // Replace with your EmailJS Service ID
        "template_ctjhht4", // Replace with your EmailJS Template ID
        {
          name: formData.name,
          email: formData.email,
          message: formData.message,
        },
        "C4aRx3HcJU1ycYJqk" // Replace with your EmailJS Public Key
      );

      setSuccess("Your inquiry has been sent successfully!");
      setError("");
      setFormData({ name: "", email: "", message: "" });
    } catch (err) {
      console.error("Error sending email:", err);
      setError("Failed to send your inquiry. Please try again.");
      setSuccess("");
    }
  };

  const handleBack = () => {
    navigate("/");
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center px-4"
      style={{ backgroundImage: "url('src/assets/background.jpg')" }}
    >
      {/* Main Contact Form Container */}
      <div className="bg-white bg-opacity-20 backdrop-blur-lg p-10 rounded-3xl shadow-2xl w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-black mb-8 drop-shadow">
          Contact Us
        </h2>

        {/* Error or Success Messages */}
        {error && <p className="text-red-600 text-center mb-4">{error}</p>}
        {success && (
          <p className="text-green-600 text-center mb-4">{success}</p>
        )}

        {/* Form */}
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-5 py-3 rounded-2xl border bg-white bg-opacity-70 focus:outline-none focus:ring-4 focus:ring-green-400 placeholder-gray-600 shadow-sm"
              required
            />
          </div>

          <div>
            <input
              type="email"
              name="email"
              placeholder="Your Email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-5 py-3 rounded-2xl border bg-white bg-opacity-70 focus:outline-none focus:ring-4 focus:ring-green-400 placeholder-gray-600 shadow-sm"
              required
            />
          </div>

          <div>
            <textarea
              name="message"
              placeholder="Your Message"
              value={formData.message}
              onChange={handleChange}
              className="w-full px-5 py-3 rounded-2xl border bg-white bg-opacity-70 focus:outline-none focus:ring-4 focus:ring-green-400 placeholder-gray-600 shadow-sm h-32 resize-none"
              required
            ></textarea>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-green-400 to-green-600 hover:from-green-500 hover:to-green-700 text-white font-bold py-3 px-6 rounded-3xl shadow-lg transition duration-300 mb-4"
          >
            Send Inquiry
          </button>
        </form>

        {/* Back Button */}
        <button
          onClick={handleBack}
          className="w-full bg-gradient-to-r from-gray-400 to-gray-600 hover:from-gray-500 hover:to-gray-700 text-white font-bold py-3 px-6 rounded-3xl shadow-lg transition duration-300 mb-4"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
};

export default Contact;
