import React from "react";
import { Link } from "react-router-dom";

const Sidebar = ({ isOpen, setIsOpen, currentPage = "home" }) => {
  const navItems = [
    { key: "home", label: "Home", icon: "🏠", href: "/" },
    { key: "workflow", label: "How It Works", icon: "⚙️", href: "#workflow" },
    { key: "features", label: "Features", icon: "⭐", href: "#features" },
    { key: "tailors", label: "Tailors", icon: "👔", href: "#tailors" },
    { key: "vendors", label: "Vendors", icon: "🪡", href: "#vendors" },
  ];

  return (
    <div className={`${isOpen ? 'w-48' : 'w-12'} bg-gradient-to-b from-slate-900 to-slate-800 p-3 flex flex-col min-h-screen border-r border-slate-700 transition-all duration-300`}>
      {/* Logo */}
      <div className="p-2 border-b border-slate-700 mb-2">
        <div className="flex items-center justify-start">
          <div className="w-6 h-6 bg-gradient-to-r from-amber-300 to-amber-400 rounded-full flex items-center justify-center">
            <span className="text-slate-900 font-bold text-sm">S</span>
          </div>
          {isOpen && <span className="text-white font-bold text-sm ml-2">SewNova</span>}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1">
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.key}>
              <a
                href={item.href}
                className={`w-full flex items-center p-2 rounded-md transition-all duration-300 ${
                  currentPage === item.key
                    ? "bg-gradient-to-r from-amber-300 to-amber-400 text-slate-900 font-semibold"
                    : "text-gray-300 hover:bg-gradient-to-r hover:from-amber-300 hover:to-amber-400 hover:text-slate-900"
                } ${!isOpen ? 'justify-start' : ''}`}
                title={!isOpen ? item.label : ''}
              >
                <span className="text-lg">{item.icon}</span>
                {isOpen && <span className="ml-2 text-sm">{item.label}</span>}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {/* Login Button */}
      <div className="p-2 border-t border-slate-700 mb-2">
        <Link 
          to="/login" 
          className={`w-full flex items-center p-2 bg-gradient-to-r from-amber-300 to-amber-400 text-slate-900 rounded-md font-semibold hover:from-amber-200 hover:to-amber-300 transition-all duration-300 ${!isOpen ? 'justify-start' : ''}`}
          title={!isOpen ? 'Login' : ''}
        >
          <span className="text-lg">🔐</span>
          {isOpen && <span className="ml-2 text-sm">Login</span>}
        </Link>
      </div>

      {/* Toggle Button */}
      <div className="p-2 border-t border-slate-700">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-start p-1 text-gray-300 hover:text-amber-300 transition-all duration-300"
          title={isOpen ? 'Collapse Sidebar' : 'Expand Sidebar'}
        >
          <span className="text-lg">{isOpen ? '←' : '→'}</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar; 