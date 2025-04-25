import React, { useState } from "react";
import emailjs from "@emailjs/browser";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

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

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center px-4"
      style={{ backgroundImage: "url('src/assets/background.jpg')" }}
    >
      {/* Glassmorphism Form Container */}
      <div className="bg-white bg-opacity-30 backdrop-blur-md p-8 rounded-4xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-black mb-6">
          Inquiries and Support
        </h2>

        {error && <p className="text-red-600 text-center mb-4">{error}</p>}
        {success && (
          <p className="text-green-600 text-center mb-4">{success}</p>
        )}

        <form className="space-y-4" onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg border bg-green-100 bg-opacity-60 focus:outline-none focus:ring-2 focus:ring-green-500 placeholder-black"
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg border bg-green-100 bg-opacity-60 focus:outline-none focus:ring-2 focus:ring-green-500 placeholder-black"
            required
          />

          <textarea
            name="message"
            placeholder="Message"
            value={formData.message}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg border bg-green-100 bg-opacity-60 focus:outline-none focus:ring-2 focus:ring-green-500 placeholder-black h-28 resize-none"
            required
          ></textarea>

          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default Contact;
