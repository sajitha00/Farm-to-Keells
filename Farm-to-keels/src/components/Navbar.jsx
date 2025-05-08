import { Link } from "react-router-dom";
import Contact from "../pages/Contact";

function Navbar() {
  return (
    <nav className="absolute top-0 left-0 w-full flex justify-between items-center px-6 py-4 bg-transparent md:px-12 z-50">
      {/* Logo with Home Navigation */}
      <Link to="/" className="cursor-pointer">
        <h1 className="text-lg font-bold text-black md:text-2xl transition-all duration-300">
          FarmTo<span className="text-green-700">Keells</span>
        </h1>
      </Link>

      {/* Desktop Navigation */}
      <div className="hidden md:flex space-x-6">
        <Link
          to="/AboutUs"
          className="text-black font-bold hover:text-green-600"
        >
          About us
        </Link>
        <Link
          to="/Contact"
          className="text-black font-bold hover:text-green-600"
        >
          Contact
        </Link>
      </div>

      {/* Mobile Menu Button */}
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
        <div className="absolute top-16 right-6 w-48 bg-white text-black font-bold shadow-lg rounded-xl flex-col items-start peer-checked:flex hidden transition-all duration-300">
          <Link to="/AboutUs" className="w-full py-2 px-4 hover:bg-gray-200">
            About us
          </Link>
          <Link to="/Contact" className="w-full py-2 px-4 hover:bg-gray-200">
            Contact
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
