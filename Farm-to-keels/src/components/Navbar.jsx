import React from "react";

function Navbar() {
  return (
    <nav className="absolute top-0 left-0 w-full flex justify-between items-center px-6 py-4 bg-transparent  md:px-12 z-50">
      {/* Logo */}
      <h1 className="text-xl font-bold text-black md:text-2xl">FarmToKeells</h1>

      {/* Desktop Navigation */}
      <div className="hidden md:flex space-x-6">
        <a href="#" className="text-black font-bold hover:underline">
          About us
        </a>
        <a href="#" className="text-black font-bold hover:underline">
          Contact
        </a>
      </div>

      {/* Mobile Menu Button (Hidden Checkbox) */}
      <div className="md:hidden">
        <input type="checkbox" id="menu-toggle" className="peer hidden" />

        {/* Hamburger Icon */}
        <label
          htmlFor="menu-toggle"
          className="text-black font-bold text-2xl cursor-pointer"
        >
          ☰
        </label>

        {/* Mobile Dropdown Menu */}
        <div className="absolute top-16 right-6 w-48 bg-white text-black font-bold shadow-lg rounded-xl  flex-col items-start peer-checked:flex hidden transition-all duration-300">
          <a href="#" className="w-full py-2 px-4 hover:bg-gray-200">
            About us
          </a>
          <a href="#" className="w-full py-2 px-4 hover:bg-gray-200">
            Contact
          </a>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
