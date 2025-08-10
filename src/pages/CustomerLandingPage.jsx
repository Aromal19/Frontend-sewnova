import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import { getCurrentUser, isAuthenticated, logout } from "../utils/api";
import { useNavigate } from "react-router-dom";
import { FiSearch, FiMapPin, FiStar, FiHeart, FiShoppingCart, FiUser, FiLogOut, FiMenu, FiX, FiFilter, FiGrid, FiList } from "react-icons/fi";

const CustomerLandingPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState("grid"); // grid or list
  const navigate = useNavigate();

  // Check authentication status on component mount
  useEffect(() => {
    const checkAuth = () => {
      const authenticated = isAuthenticated();
      const currentUser = getCurrentUser();
      
      setIsLoggedIn(authenticated);
      setUser(currentUser);
    };

    checkAuth();

    // Listen for storage changes (when user logs in/out in other tabs)
    const handleStorageChange = (e) => {
      if (e.key === 'user' || e.key === 'token') {
        checkAuth();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleLogout = async () => {
    await logout();
    setUser(null);
    setIsLoggedIn(false);
    navigate('/login');
  };

  const tailors = [
    {
      id: 1,
      name: "James Smith",
      location: "New Delhi",
      rating: 4.8,
      experience: "15 years",
      speciality: "Formal Wear",
      image: "https://randomuser.me/api/portraits/men/32.jpg",
      price: "₹2,500",
      availability: "Available",
      reviews: 127,
      deliveryTime: "3-5 days"
    },
    {
      id: 2,
      name: "Ananya Rao",
      location: "Mumbai",
      rating: 4.9,
      experience: "12 years",
      speciality: "Bridal Wear",
      image: "https://randomuser.me/api/portraits/women/44.jpg",
      price: "₹3,200",
      availability: "Available",
      reviews: 89,
      deliveryTime: "5-7 days"
    },
    {
      id: 3,
      name: "Farbeic Ali",
      location: "Chennai",
      rating: 4.7,
      experience: "18 years",
      speciality: "Casual Wear",
      image: "https://randomuser.me/api/portraits/men/45.jpg",
      price: "₹1,800",
      availability: "Available",
      reviews: 203,
      deliveryTime: "2-4 days"
    },
    {
      id: 4,
      name: "Priya Sharma",
      location: "Bangalore",
      rating: 4.6,
      experience: "10 years",
      speciality: "Western Wear",
      image: "https://randomuser.me/api/portraits/women/68.jpg",
      price: "₹2,800",
      availability: "Available",
      reviews: 156,
      deliveryTime: "4-6 days"
    },
    {
      id: 5,
      name: "Rajesh Kumar",
      location: "Hyderabad",
      rating: 4.5,
      experience: "14 years",
      speciality: "Traditional Wear",
      image: "https://randomuser.me/api/portraits/men/67.jpg",
      price: "₹2,100",
      availability: "Available",
      reviews: 94,
      deliveryTime: "3-5 days"
    },
    {
      id: 6,
      name: "Meera Patel",
      location: "Ahmedabad",
      rating: 4.8,
      experience: "16 years",
      speciality: "Designer Wear",
      image: "https://randomuser.me/api/portraits/women/23.jpg",
      price: "₹4,500",
      availability: "Available",
      reviews: 67,
      deliveryTime: "7-10 days"
    }
  ];

  const fabrics = [
    {
      id: 1,
      name: "Premium Cotton",
      type: "Natural Fiber",
      price: "₹450/m",
      originalPrice: "₹550/m",
      color: "bg-gradient-to-br from-yellow-100 to-amber-200",
      image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=100&h=100&fit=crop&crop=center",
      rating: 4.5,
      vendor: "Cotton Co.",
      reviews: 234,
      discount: "18% OFF"
    },
    {
      id: 2,
      name: "Pure Silk",
      type: "Natural Fiber",
      price: "₹1,200/m",
      originalPrice: "₹1,400/m",
      color: "bg-gradient-to-br from-green-100 to-emerald-200",
      image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=100&h=100&fit=crop&crop=center",
      rating: 4.8,
      vendor: "Silk Paradise",
      reviews: 189,
      discount: "14% OFF"
    },
    {
      id: 3,
      name: "Linen Blend",
      type: "Natural Fiber",
      price: "₹650/m",
      originalPrice: "₹750/m",
      color: "bg-gradient-to-br from-red-100 to-rose-200",
      image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=100&h=100&fit=crop&crop=center",
      rating: 4.3,
      vendor: "Linen Masters",
      reviews: 156,
      discount: "13% OFF"
    },
    {
      id: 4,
      name: "Navy Wool",
      type: "Natural Fiber",
      price: "₹850/m",
      originalPrice: "₹950/m",
      color: "bg-gradient-to-br from-blue-900 to-indigo-900",
      image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=100&h=100&fit=crop&crop=center",
      rating: 4.6,
      vendor: "Wool Masters",
      reviews: 98,
      discount: "11% OFF"
    },
    {
      id: 5,
      name: "Denim Fabric",
      type: "Cotton Blend",
      price: "₹380/m",
      originalPrice: "₹480/m",
      color: "bg-gradient-to-br from-blue-100 to-indigo-200",
      image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=100&h=100&fit=crop&crop=center",
      rating: 4.4,
      vendor: "Denim World",
      reviews: 312,
      discount: "21% OFF"
    },
    {
      id: 6,
      name: "Velvet Silk",
      type: "Luxury Fabric",
      price: "₹1,800/m",
      originalPrice: "₹2,200/m",
      color: "bg-gradient-to-br from-purple-100 to-violet-200",
      image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=100&h=100&fit=crop&crop=center",
      rating: 4.9,
      vendor: "Luxury Fabrics",
      reviews: 78,
      discount: "18% OFF"
    }
  ];

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <FiStar 
        key={i} 
        className={`w-3 h-3 ${i < rating ? "text-amber-400 fill-current" : "text-gray-300"}`} 
      />
    ));
  };

  // Get user's display name
  const getUserDisplayName = () => {
    if (!user) return "";
    
    if (user.firstname && user.lastname) {
      return `${user.firstname} ${user.lastname}`;
    } else if (user.firstname) {
      return user.firstname;
    } else if (user.email) {
      return user.email.split('@')[0];
    }
    
    return "User";
  };

  // Get user's initial for avatar
  const getUserInitial = () => {
    if (!user) return "?";
    
    if (user.firstname) {
      return user.firstname.charAt(0).toUpperCase();
    } else if (user.email) {
      return user.email.charAt(0).toUpperCase();
    }
    
    return "U";
  };

  const filteredTailors = tailors.filter(tailor => 
    tailor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tailor.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tailor.speciality.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredFabrics = fabrics.filter(fabric => 
    fabric.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    fabric.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
    fabric.vendor.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} currentPage="explore" />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <h1 className="text-2xl font-bold text-gray-900">
                  Explore
                </h1>
              </div>
              
              {/* Search Bar */}
              <div className="flex-1 max-w-xl mx-6">
                <div className="relative">
                  <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search tailors, fabrics, or location..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent text-sm"
                  />
                </div>
              </div>
              
              {/* User Display */}
              {isLoggedIn && user ? (
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2 bg-gray-100 px-3 py-1.5 rounded-lg">
                    <div className="w-6 h-6 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-xs">
                        {getUserInitial()}
                      </span>
                    </div>
                    <span className="text-gray-700 font-medium text-sm">{getUserDisplayName()}</span>
                  </div>
                  <button 
                    onClick={handleLogout}
                    className="p-1.5 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all duration-200"
                  >
                    <FiLogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <button 
                  onClick={() => navigate('/login')}
                  className="px-4 py-2 bg-gradient-to-r from-amber-400 to-orange-500 text-white rounded-lg font-medium text-sm hover:from-amber-500 hover:to-orange-600 transition-all duration-200"
                >
                  Sign In
                </button>
              )}
            </div>

            {/* Tabs and Controls */}
            <div className="flex items-center justify-between mt-4">
              {/* Tabs */}
              <div className="flex space-x-1">
                {[
                  { key: "all", label: "All", count: tailors.length + fabrics.length },
                  { key: "tailors", label: "Tailors", count: tailors.length },
                  { key: "fabrics", label: "Fabrics", count: fabrics.length }
                ].map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${
                      activeTab === tab.key
                        ? 'bg-amber-500 text-white'
                        : 'text-gray-600 hover:text-amber-500 hover:bg-amber-50'
                    }`}
                  >
                    {tab.label}
                    <span className={`ml-1 px-1.5 py-0.5 rounded-full text-xs ${
                      activeTab === tab.key ? 'bg-white/20' : 'bg-gray-200'
                    }`}>
                      {tab.count}
                    </span>
                  </button>
                ))}
              </div>

              {/* View Controls */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-lg transition-all duration-200 ${
                    viewMode === "grid" 
                      ? 'bg-amber-500 text-white' 
                      : 'text-gray-500 hover:text-amber-500 hover:bg-amber-50'
                  }`}
                >
                  <FiGrid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-lg transition-all duration-200 ${
                    viewMode === "list" 
                      ? 'bg-amber-500 text-white' 
                      : 'text-gray-500 hover:text-amber-500 hover:bg-amber-50'
                  }`}
                >
                  <FiList className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-4 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            {/* Tailors Section */}
            {(activeTab === "all" || activeTab === "tailors") && (
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                    <span className="mr-2">👔</span>
                    Expert Tailors
                    <span className="ml-2 text-sm text-gray-500 font-normal">
                      ({filteredTailors.length} available)
                    </span>
                  </h2>
                </div>
                
                <div className={`grid gap-4 ${
                  viewMode === "grid" 
                    ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
                    : 'grid-cols-1'
                }`}>
                  {filteredTailors.map((tailor) => (
                    <div key={tailor.id} className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 overflow-hidden">
                      {/* Tailor Image */}
                      <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200">
                        <img
                          src={tailor.image}
                          alt={tailor.name}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-2 right-2">
                          <button className="p-1.5 bg-white/80 backdrop-blur-sm rounded-full text-gray-600 hover:text-red-500 hover:bg-red-50 transition-all duration-200">
                            <FiHeart className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="absolute bottom-2 left-2">
                          <span className="px-2 py-1 bg-green-500 text-white text-xs font-medium rounded-full">
                            {tailor.availability}
                          </span>
                        </div>
                      </div>

                      {/* Tailor Info */}
                      <div className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900 text-sm mb-1">
                              {tailor.name}
                            </h3>
                            <div className="flex items-center text-gray-500 text-xs mb-2">
                              <FiMapPin className="w-3 h-3 mr-1" />
                              {tailor.location}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-bold text-green-600">
                              {tailor.price}
                            </div>
                            <div className="text-xs text-gray-500">
                              starting price
                            </div>
                          </div>
                        </div>

                        {/* Rating and Reviews */}
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center">
                            <div className="flex items-center mr-2">
                              {renderStars(tailor.rating)}
                            </div>
                            <span className="text-xs text-gray-600 font-medium">{tailor.rating}</span>
                            <span className="text-xs text-gray-500 ml-1">({tailor.reviews})</span>
                          </div>
                          <div className="text-xs text-gray-500">
                            {tailor.deliveryTime}
                          </div>
                        </div>

                        {/* Speciality */}
                        <div className="mb-3">
                          <span className="inline-block px-2 py-1 bg-amber-100 text-amber-700 text-xs font-medium rounded">
                            {tailor.speciality}
                          </span>
                        </div>

                        {/* Action Button */}
                        <button className="w-full bg-gradient-to-r from-amber-400 to-orange-500 text-white py-2 px-4 rounded-lg font-medium text-sm hover:from-amber-500 hover:to-orange-600 transition-all duration-200">
                          Book Now
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Fabrics Section */}
            {(activeTab === "all" || activeTab === "fabrics") && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                    <span className="mr-2">🧵</span>
                    Premium Fabrics
                    <span className="ml-2 text-sm text-gray-500 font-normal">
                      ({filteredFabrics.length} available)
                    </span>
                  </h2>
                </div>
                
                <div className={`grid gap-4 ${
                  viewMode === "grid" 
                    ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
                    : 'grid-cols-1'
                }`}>
                  {filteredFabrics.map((fabric) => (
                    <div key={fabric.id} className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 overflow-hidden">
                      {/* Fabric Image */}
                      <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200">
                        <div className={`w-full h-full ${fabric.color} flex items-center justify-center`}>
                          <span className="text-4xl">🧵</span>
                        </div>
                        <div className="absolute top-2 right-2">
                          <button className="p-1.5 bg-white/80 backdrop-blur-sm rounded-full text-gray-600 hover:text-red-500 hover:bg-red-50 transition-all duration-200">
                            <FiHeart className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="absolute top-2 left-2">
                          <span className="px-2 py-1 bg-red-500 text-white text-xs font-medium rounded-full">
                            {fabric.discount}
                          </span>
                        </div>
                      </div>

                      {/* Fabric Info */}
                      <div className="p-4">
                        <div className="mb-2">
                          <h3 className="font-semibold text-gray-900 text-sm mb-1">
                            {fabric.name}
                          </h3>
                          <div className="text-gray-500 text-xs mb-2">
                            {fabric.type} • {fabric.vendor}
                          </div>
                        </div>

                        {/* Rating and Reviews */}
                        <div className="flex items-center mb-3">
                          <div className="flex items-center mr-2">
                            {renderStars(fabric.rating)}
                          </div>
                          <span className="text-xs text-gray-600 font-medium">{fabric.rating}</span>
                          <span className="text-xs text-gray-500 ml-1">({fabric.reviews})</span>
                        </div>

                        {/* Price */}
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-2">
                            <span className="text-lg font-bold text-green-600">
                              {fabric.price}
                            </span>
                            <span className="text-sm text-gray-500 line-through">
                              {fabric.originalPrice}
                            </span>
                          </div>
                        </div>

                        {/* Action Button */}
                        <button className="w-full bg-gradient-to-r from-emerald-400 to-teal-500 text-white py-2 px-4 rounded-lg font-medium text-sm hover:from-emerald-500 hover:to-teal-600 transition-all duration-200 flex items-center justify-center">
                          <FiShoppingCart className="w-4 h-4 mr-2" />
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Empty State */}
            {((activeTab === "tailors" && filteredTailors.length === 0) || 
              (activeTab === "fabrics" && filteredFabrics.length === 0) ||
              (activeTab === "all" && filteredTailors.length === 0 && filteredFabrics.length === 0)) && (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gradient-to-r from-amber-100 to-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FiSearch className="w-8 h-8 text-amber-500" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No results found</h3>
                <p className="text-gray-600 mb-4 text-sm">Try adjusting your search terms or browse all categories</p>
                <button 
                  onClick={() => setSearchQuery("")}
                  className="px-4 py-2 bg-gradient-to-r from-amber-400 to-orange-500 text-white rounded-lg font-medium text-sm hover:from-amber-500 hover:to-orange-600 transition-all duration-200"
                >
                  Clear Search
                </button>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default CustomerLandingPage; 