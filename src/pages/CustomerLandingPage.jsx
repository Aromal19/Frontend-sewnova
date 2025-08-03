import React, { useState } from "react";
import Sidebar from "../components/Sidebar";

const CustomerLandingPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const tailors = [
    {
      id: 1,
      name: "James Smith",
      location: "New Delhi",
      rating: 4,
      image: "https://randomuser.me/api/portraits/men/32.jpg",
    },
    {
      id: 2,
      name: "Ananya Rao",
      location: "Mumbai",
      rating: 3,
      image: "https://randomuser.me/api/portraits/women/44.jpg",
    },
    {
      id: 3,
      name: "Farbeic",
      location: "Navyan",
      rating: 5,
      image: "https://randomuser.me/api/portraits/women/68.jpg",
    },
  ];

  const fabrics = [
    {
      id: 1,
      name: "Cotton",
      quantity: "10 g",
      color: "bg-yellow-100",
      image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=100&h=100&fit=crop&crop=center",
    },
    {
      id: 2,
      name: "Silk",
      quantity: "450 g",
      color: "bg-green-100",
      image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=100&h=100&fit=crop&crop=center",
    },
    {
      id: 3,
      name: "Linen",
      quantity: "65 g",
      color: "bg-red-100",
      image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=100&h=100&fit=crop&crop=center",
    },
    {
      id: 4,
      name: "Navy",
      quantity: "550 g",
      color: "bg-blue-900",
      image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=100&h=100&fit=crop&crop=center",
    },
  ];

  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <span key={index} className={index < rating ? "text-amber-500" : "text-gray-300"}>
        ★
      </span>
    ));
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} currentPage="explore" />

      {/* Main Content */}
      <div className="flex-1 flex flex-col scrollbar-hide">
        {/* Header */}
        <header className="bg-gradient-to-br from-white to-gray-50 shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-4xl font-bold text-slate-900">Explore</h1>
            </div>
            <div className="flex items-center space-x-4">
              {/* Search Bar */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search tailors, fabrics, or location..."
                  className="pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent w-80"
                />
                <span className="absolute left-3 top-3 text-gray-400">🔍</span>
              </div>
              <button className="p-3 text-gray-600 hover:text-amber-500 transition-colors">
                <span className="text-xl">⚙️</span>
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex space-x-6 mt-6">
            <button className="px-4 py-2 bg-gradient-to-r from-amber-300 to-amber-400 text-slate-900 rounded-lg font-medium">
              All
            </button>
            <button className="px-4 py-2 text-gray-600 hover:text-amber-500 transition-colors">
              Tailors
            </button>
            <button className="px-4 py-2 text-gray-600 hover:text-amber-500 transition-colors">
              Fabrics
            </button>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-6 bg-gradient-to-br from-gray-50 to-gray-100">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Tailors Column */}
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Tailors</h2>
              <div className="space-y-4">
                {tailors.map((tailor) => (
                  <div key={tailor.id} className="bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                    <div className="flex items-center space-x-4">
                      <img
                        src={tailor.image}
                        alt={tailor.name}
                        className="w-12 h-12 rounded-full border-2 border-amber-400"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold text-slate-900 text-lg">{tailor.name}</h3>
                        <p className="text-gray-600">{tailor.location}</p>
                        <div className="flex items-center mt-1">
                          {renderStars(tailor.rating)}
                        </div>
                      </div>
                      <button className="px-4 py-2 bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-lg hover:from-slate-800 hover:to-slate-700 transition-all duration-300">
                        Book Now
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Fabrics Column */}
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Fabrics</h2>
              <div className="space-y-4">
                {fabrics.map((fabric) => (
                  <div key={fabric.id} className="bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                    <div className="flex items-center space-x-4">
                      <div className={`w-12 h-12 rounded-lg ${fabric.color} border-2 border-amber-400`}></div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-slate-900 text-lg">{fabric.name}</h3>
                        <p className="text-gray-600">{fabric.quantity}</p>
                      </div>
                      <button className="px-4 py-2 bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-lg hover:from-slate-800 hover:to-slate-700 transition-all duration-300">
                        Buy Now
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default CustomerLandingPage; 