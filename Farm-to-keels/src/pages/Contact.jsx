import React, { useState } from "react";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    alert("Your inquiry has been sent!");
    setFormData({ name: "", email: "", message: "" });
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
