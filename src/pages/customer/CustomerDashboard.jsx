import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import { 
  FiPlus, 
  FiBarChart2, 
  FiMapPin, 
  FiPackage, 
  FiScissors,
  FiShoppingBag,
  FiUser,
  FiHeart,
  FiTruck,
  FiDollarSign,
  FiCalendar,
  FiTrendingUp,
  FiStar,
  FiClock,
  FiCheckCircle,
  FiAlertCircle,
  FiGrid,
  FiList,
  FiSearch,
  FiFilter
} from "react-icons/fi";

const CustomerDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Mock data for demonstration - replace with API calls
  const [dashboardData, setDashboardData] = useState({
    measurements: [],
    addresses: [],
    bookings: [],
    stats: {
      totalMeasurements: 0,
      totalAddresses: 0,
      totalBookings: 0,
      activeBookings: 0,
      completedBookings: 0,
      totalSpent: 0,
      averageRating: 0
    }
  });

  useEffect(() => {
    // TODO: Replace with actual API calls
    // For now, initialize with empty data
    setDashboardData({
      measurements: [],
      addresses: [],
      bookings: [],
      stats: {
        totalMeasurements: 0,
        totalAddresses: 0,
        totalBookings: 0,
        activeBookings: 0,
        completedBookings: 0,
        totalSpent: 0,
        averageRating: 0
      }
    });
    setLoading(false);
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case "pending": return "bg-yellow-100 text-yellow-700";
      case "confirmed": return "bg-blue-100 text-blue-700";
      case "in_progress": return "bg-purple-100 text-purple-700";
      case "ready_for_delivery": return "bg-indigo-100 text-indigo-700";
      case "completed": return "bg-green-100 text-green-700";
      case "cancelled": return "bg-red-100 text-red-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending": return <FiClock className="w-4 h-4" />;
      case "confirmed": return <FiCheckCircle className="w-4 h-4" />;
      case "in_progress": return <FiPackage className="w-4 h-4" />;
      case "ready_for_delivery": return <FiTruck className="w-4 h-4" />;
      case "completed": return <FiCheckCircle className="w-4 h-4" />;
      case "cancelled": return <FiAlertCircle className="w-4 h-4" />;
      default: return <FiClock className="w-4 h-4" />;
    }
  };

  const getBookingTypeIcon = (type) => {
    switch (type) {
      case "tailor": return "✂️";
      case "fabric": return "🧵";
      case "complete": return "🎯";
      default: return "📦";
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen bg-gray-50">
        <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} currentPage="dashboard" />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} currentPage="dashboard" />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Customer Dashboard</h1>
                <p className="text-gray-600 mt-1">Welcome back! Here's an overview of your account</p>
              </div>
              
              <div className="flex items-center space-x-3">
                <Link
                  to="/customer/measurements"
                  className="flex items-center px-4 py-2 bg-gradient-to-r from-blue-400 to-blue-600 text-white rounded-lg font-medium hover:from-blue-500 hover:to-blue-700 transition-all duration-200"
                >
                  <FiBarChart2 className="w-4 h-4 mr-2" />
                  Add Measurement
                </Link>
                <Link
                  to="/customer/bookings"
                  className="flex items-center px-4 py-2 bg-gradient-to-r from-amber-400 to-orange-500 text-white rounded-lg font-medium hover:from-amber-500 hover:to-orange-600 transition-all duration-200"
                >
                  <FiPlus className="w-4 h-4 mr-2" />
                  New Booking
                </Link>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex space-x-1 mt-6">
              {[
                { key: "overview", label: "Overview", icon: FiGrid },
                { key: "measurements", label: "Measurements", icon: FiBarChart2 },
                { key: "addresses", label: "Addresses", icon: FiMapPin },
                { key: "bookings", label: "Bookings", icon: FiPackage },
                { key: "activity", label: "Activity", icon: FiTrendingUp }
              ].map((tab) => {
                const IconComponent = tab.icon;
                return (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`flex items-center px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${
                      activeTab === tab.key
                        ? 'bg-amber-500 text-white'
                        : 'text-gray-600 hover:text-amber-500 hover:bg-amber-50'
                    }`}
                  >
                    <IconComponent className="w-4 h-4 mr-2" />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-6 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            {/* Overview Tab */}
            {activeTab === "overview" && (
              <div className="space-y-6">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-blue-600 rounded-lg flex items-center justify-center">
                        <FiBarChart2 className="w-6 h-6 text-white" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Measurements</p>
                        <p className="text-2xl font-bold text-gray-900">{dashboardData.stats.totalMeasurements}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-green-600 rounded-lg flex items-center justify-center">
                        <FiMapPin className="w-6 h-6 text-white" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Addresses</p>
                        <p className="text-2xl font-bold text-gray-900">{dashboardData.stats.totalAddresses}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-purple-600 rounded-lg flex items-center justify-center">
                        <FiPackage className="w-6 h-6 text-white" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Active Bookings</p>
                        <p className="text-2xl font-bold text-gray-900">{dashboardData.stats.activeBookings}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-gradient-to-r from-amber-400 to-orange-600 rounded-lg flex items-center justify-center">
                        <FiDollarSign className="w-6 h-6 text-white" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Total Spent</p>
                        <p className="text-2xl font-bold text-gray-900">₹{dashboardData.stats.totalSpent.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Link
                      to="/customer/measurements"
                      className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all duration-200"
                    >
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                        <FiBarChart2 className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Manage Measurements</p>
                        <p className="text-sm text-gray-600">Add or edit your body measurements</p>
                      </div>
                    </Link>

                    <Link
                      to="/customer/addresses"
                      className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50 transition-all duration-200"
                    >
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                        <FiMapPin className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Manage Addresses</p>
                        <p className="text-sm text-gray-600">Update delivery addresses</p>
                      </div>
                    </Link>

                    <Link
                      to="/customer/bookings"
                      className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-amber-300 hover:bg-amber-50 transition-all duration-200"
                    >
                      <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center mr-3">
                        <FiPackage className="w-5 h-5 text-amber-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">View Bookings</p>
                        <p className="text-sm text-gray-600">Track your orders and bookings</p>
                      </div>
                    </Link>
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
                  <div className="space-y-3">
                    {dashboardData.bookings.slice(0, 3).map((booking) => (
                      <div key={booking.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <span className="text-xl">{getBookingTypeIcon(booking.bookingType)}</span>
                          <div>
                            <p className="font-medium text-gray-900 capitalize">
                              {booking.bookingType} booking created
                            </p>
                            <p className="text-sm text-gray-600">
                              Delivery expected: {booking.deliveryDate}
                            </p>
                          </div>
                        </div>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full flex items-center space-x-1 ${getStatusColor(booking.status)}`}>
                          {getStatusIcon(booking.status)}
                          <span className="capitalize">{booking.status.replace('_', ' ')}</span>
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Measurements Tab */}
            {activeTab === "measurements" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Your Measurements</h3>
                  <Link
                    to="/customer/measurements"
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200"
                  >
                    View All
                  </Link>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {dashboardData.measurements.map((measurement) => (
                    <div key={measurement.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-semibold text-gray-900">{measurement.measurementName}</h4>
                        {measurement.isDefault && (
                          <span className="px-2 py-1 bg-amber-100 text-amber-700 text-xs font-medium rounded-full">
                            Default
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-2 capitalize">{measurement.measurementType}</p>
                      <p className="text-xs text-gray-500">Last used: {measurement.lastUsed}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Addresses Tab */}
            {activeTab === "addresses" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Your Addresses</h3>
                  <Link
                    to="/customer/addresses"
                    className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-200"
                  >
                    View All
                  </Link>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {dashboardData.addresses.map((address) => (
                    <div key={address.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-semibold text-gray-900 capitalize">{address.addressType} Address</h4>
                        {address.isDefault && (
                          <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                            Default
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">{address.city}, {address.state}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Bookings Tab */}
            {activeTab === "bookings" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Your Bookings</h3>
                  <Link
                    to="/customer/bookings"
                    className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors duration-200"
                  >
                    View All
                  </Link>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {dashboardData.bookings.map((booking) => (
                    <div key={booking.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-2">
                          <span className="text-xl">{getBookingTypeIcon(booking.bookingType)}</span>
                          <h4 className="font-semibold text-gray-900 capitalize">{booking.bookingType}</h4>
                        </div>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full flex items-center space-x-1 ${getStatusColor(booking.status)}`}>
                          {getStatusIcon(booking.status)}
                          <span className="capitalize">{booking.status.replace('_', ' ')}</span>
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">₹{booking.totalAmount}</p>
                      <p className="text-xs text-gray-500">Delivery: {booking.deliveryDate}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Activity Tab */}
            {activeTab === "activity" && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
                
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <FiBarChart2 className="w-4 h-4 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">New measurement added</p>
                        <p className="text-sm text-gray-600">Casual Wear measurement created</p>
                        <p className="text-xs text-gray-500">2 hours ago</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <FiPackage className="w-4 h-4 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">Booking confirmed</p>
                        <p className="text-sm text-gray-600">Tailor booking #001 confirmed</p>
                        <p className="text-xs text-gray-500">1 day ago</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                        <FiMapPin className="w-4 h-4 text-purple-600" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">Address updated</p>
                        <p className="text-sm text-gray-600">Home address details modified</p>
                        <p className="text-xs text-gray-500">3 days ago</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default CustomerDashboard; 