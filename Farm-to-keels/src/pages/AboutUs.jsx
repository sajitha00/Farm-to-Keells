import React from "react";
import { useNavigate } from "react-router-dom";

const AboutUs = () => {
  const navigate = useNavigate();

  return (
    <div
      className="min-h-screen flex items-center justify-center px-6 py-12"
      style={{
        background: "linear-gradient(to right, #e0f8e9, #c6f6d5)",
      }}
    >
      <div className="w-full max-w-6xl bg-green rounded-xl shadow-lg p-8 md:p-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-10">
          {/* Text Section */}
          <div className="max-w-md text-center md:text-left">
            <p className="text-red-600 font-semibold tracking-wide uppercase">
              A Bit
            </p>
            <h1 className="text-4xl font-bold text-gray-800 mb-4">About Us</h1>
            <p className="text-gray-600 mb-6">
              We are <strong>Keells Super</strong>, a leading supermarket chain
              in Sri Lanka, powered by the John Keells Group. Our mission is to
              eliminate intermediaries and build a direct farm-to-supermarket
              selling system. This empowers local farmers and ensures freshness
              and fair pricing for everyone.
            </p>

            {/* Button Section */}
            <div className="flex flex-wrap gap-4">
              <a
                href="https://www.keellssuper.com"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-teal-600 text-white px-6 py-3 rounded-lg shadow hover:bg-teal-700 transition"
              >
                Explore More
              </a>
              <button
                onClick={() => navigate(-1)}
                className="bg-green-100 hover:bg-green-200 text-green-800 font-medium px-6 py-3 rounded-lg transition"
              >
                ← Back
              </button>
            </div>
          </div>

          {/* Image Section */}
          <div className="grid grid-cols-2 gap-4">
            <img
              src="src/assets/about1.jpg"
              alt="Farmer hiking"
              className="rounded-xl w-full h-36 object-cover"
            />
            <img
              src="src/assets/about2.jpeg"
              alt="Farmer market"
              className="rounded-xl w-full h-36 object-cover"
            />
            <img
              src="src/assets/about3.jpg"
              alt="Farmland"
              className="rounded-xl w-full h-36 object-cover col-span-2"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
