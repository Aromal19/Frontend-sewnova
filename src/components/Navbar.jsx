import React, { useState } from "react";
import { Link } from "react-router-dom";

const Navbar = ({ currentPage = "home" }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { key: "home", label: "Home", icon: "🏠", href: "/" },
    { key: "workflow", label: "How It Works", icon: "⚙️", href: "#workflow" },
    { key: "features", label: "Features", icon: "⭐", href: "#features" },
    { key: "tailors", label: "Tailors", icon: "👔", href: "#tailors" },
    { key: "vendors", label: "Vendors", icon: "🪡", href: "#vendors" },
  ];

  return (
    <nav className="bg-gradient-to-r from-slate-900 to-slate-800 shadow-lg border-b border-slate-700 fixed w-full top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <div className="w-8 h-8 bg-gradient-to-r from-amber-300 to-amber-400 rounded-full flex items-center justify-center">
                <span className="text-slate-900 font-bold text-sm">S</span>
              </div>
              <span className="text-white font-bold text-lg ml-2">SewNova</span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {navItems.map((item) => (
                <a
                  key={item.key}
                  href={item.href}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 ${
                    currentPage === item.key
                      ? "bg-gradient-to-r from-amber-300 to-amber-400 text-slate-900"
                      : "text-gray-300 hover:bg-gradient-to-r hover:from-amber-300 hover:to-amber-400 hover:text-slate-900"
                  }`}
                >
                  <span className="mr-1">{item.icon}</span>
                  {item.label}
                </a>
              ))}
            </div>
          </div>

          {/* Right side buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Link
              to="/login"
              className="px-4 py-2 bg-gradient-to-r from-amber-300 to-amber-400 text-slate-900 rounded-md text-sm font-medium hover:from-amber-200 hover:to-amber-300 transition-all duration-300"
            >
              Sign In
            </Link>
            <Link
              to="/signup"
              className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-md text-sm font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-300"
            >
              Sign Up
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-300 hover:text-white hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-slate-800 border-t border-slate-700">
            {navItems.map((item) => (
              <a
                key={item.key}
                href={item.href}
                className={`block px-3 py-2 rounded-md text-base font-medium transition-all duration-300 ${
                  currentPage === item.key
                    ? "bg-gradient-to-r from-amber-300 to-amber-400 text-slate-900"
                    : "text-gray-300 hover:bg-gradient-to-r hover:from-amber-300 hover:to-amber-400 hover:text-slate-900"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                <span className="mr-2">{item.icon}</span>
                {item.label}
              </a>
            ))}
            <div className="pt-4 pb-3 border-t border-slate-700">
              <Link
                to="/login"
                className="block px-3 py-2 text-base font-medium text-gray-300 hover:bg-gradient-to-r hover:from-amber-300 hover:to-amber-400 hover:text-slate-900 rounded-md transition-all duration-300"
                onClick={() => setIsMenuOpen(false)}
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                className="block px-3 py-2 text-base font-medium text-gray-300 hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-600 hover:text-white rounded-md transition-all duration-300"
                onClick={() => setIsMenuOpen(false)}
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar; 