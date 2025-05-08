import React from "react";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  // Add the following CSS class to the buttons for hover effect
  const buttonStyle =
    "px-8 py-4 bg-green-500 text-white rounded-lg hover:bg-green-500 transition transform hover:scale-105";

  // Add the following CSS class for the 'Click Here' hover effect
  const linkStyle =
    "text-blue-600 hover:underline transition duration-300 ease-in-out";

  return (
    <div
      className="h-screen flex flex-col items-center justify-center bg-cover bg-center relative"
      style={{ backgroundImage: "url('src/assets/background.jpg')" }}
    >
      {/* Main Content */}
      <div className="text-center">
        <h1 className="text-6xl font-extrabold text-black drop-shadow-lg mb-8 ml-1">
          Farm To Keells Super
        </h1>
        <p className="text-2xl text-gray-800 mt-6 font-bold mr-9 ">
          Direct Selling Platform
        </p>

        {/* Buttons */}
        <div className="mt-10 flex space-x-4 justify-center mr-9">
          <button
            onClick={() => navigate("/FarmerRegister")}
            className={buttonStyle}
          >
            Register
          </button>
          <button
            onClick={() => navigate("FarmerLogin")}
            className={buttonStyle}
          >
            Login
          </button>
        </div>

        {/* Admin Link */}
        <p className="mt-8 text-black text-base  font-bold mr-7">
          Are you a Keells Admin?{" "}
          <a
            href="/AdminLogin"
            onClick={() => navigate("AdminLogin")}
            className={linkStyle}
          >
            Click Here
          </a>
        </p>
      </div>
    </div>
  );
}

export default Home;
