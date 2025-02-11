import React from "react";

function Footer() {
  return (
    <footer className="bg-green-900/75 backdrop-blur-3xl text-white py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          {/* Left Section - Brand Name */}
          <h2 className="text-lg font-bold">FarmToKeells</h2>

          {/* Center Section - Navigation Links */}
          <nav className="mt-4 md:mt-0">
            <ul className="flex space-x-6">
              <li>
                <a href="#" className="hover:text-gray-400">
                  Home
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-gray-400">
                  About
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-gray-400">
                  Contact
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-gray-400">
                  Privacy Policy
                </a>
              </li>
            </ul>
          </nav>
        </div>

        {/* Copyright */}
        <div className="mt-6 text-center text-sm text-gray-400">
          &copy; {new Date().getFullYear()} FarmToKeells. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

export default Footer;
