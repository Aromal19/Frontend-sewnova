  import React, { useState, useEffect } from "react";
  import { useNavigate } from "react-router-dom";
  import Sidebar from "../../components/Sidebar";
  import BookingService from "../../services/bookingService";
  import { 
    FiPlus, 
    FiEdit2, 
    FiTrash2, 
    FiStar, 
    FiPackage, 
    FiScissors,
    FiShoppingBag,
    FiFilter,
    FiSearch,
    FiGrid,
    FiList,
    FiClock,
    FiCheckCircle,
    FiXCircle,
    FiTruck,
    FiTrendingUp,
    FiCalendar,
    FiMapPin,
    FiRefreshCw
  } from "react-icons/fi";

  const CustomerBookings = () => {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [bookings, setBookings] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [editingBooking, setEditingBooking] = useState(null);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [filterStatus, setFilterStatus] = useState("all");
    const [filterType, setFilterType] = useState("all");
    const [viewMode, setViewMode] = useState("grid");
    const navigate = useNavigate();

    // Fetch bookings from API
    useEffect(() => {
      const fetchBookings = async () => {
        try {
          setLoading(true);
          console.log('🔍 Fetching bookings from API...');
          
          // Fetch customer orders (paid bookings)
          const response = await BookingService.getCustomerOrders({
            page: 1,
            limit: 50,
            sortBy: 'createdAt',
            sortOrder: 'desc'
          });
          
          console.log('✅ Bookings fetched successfully:', response);
          
          if (response.success && response.data) {
            setBookings(response.data);
          } else {
            console.warn('⚠️ No bookings data received:', response);
            setBookings([]);
          }
        } catch (error) {
          console.error('❌ Error fetching bookings:', error);
          // Show error message to user
          alert(`Failed to load bookings: ${error.message}`);
          setBookings([]);
        } finally {
          setLoading(false);
        }
      };

      fetchBookings();
    }, []);

    const handleAddBooking = () => {
      setEditingBooking(null);
      setShowForm(true);
    };

    const handleRefreshBookings = async () => {
      try {
        setLoading(true);
        console.log('🔄 Refreshing bookings...');
        
        const response = await BookingService.getCustomerOrders({
          page: 1,
          limit: 50,
          sortBy: 'createdAt',
          sortOrder: 'desc'
        });
        
        if (response.success && response.data) {
          setBookings(response.data);
          console.log('✅ Bookings refreshed successfully');
        }
      } catch (error) {
        console.error('❌ Error refreshing bookings:', error);
        alert(`Failed to refresh bookings: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    const handleEditBooking = (booking) => {
      setEditingBooking(booking);
      setShowForm(true);
    };

    const handleCancelBooking = async (id) => {
      if (window.confirm("Are you sure you want to cancel this booking?")) {
        try {
          console.log('🔄 Cancelling booking:', id);
          await BookingService.cancelBooking(id, 'Cancelled by customer');
          
          // Update local state
          setBookings(bookings.map(b => 
            b.id === id ? { ...b, status: 'cancelled' } : b
          ));
          
          alert('Booking cancelled successfully!');
        } catch (error) {
          console.error("Error cancelling booking:", error);
          alert(`Failed to cancel booking: ${error.message}`);
        }
      }
    };

    const handleFormSubmit = async (bookingData) => {
      try {
        console.log('💾 Saving booking:', bookingData);
        
        if (editingBooking) {
          // Update existing booking
          console.log('🔄 Updating existing booking:', editingBooking.id);
          const response = await BookingService.updateBooking(editingBooking.id, bookingData);
          
          if (response.success) {
            // Update local state
            const updatedBookings = bookings.map(b => 
              b.id === editingBooking.id ? { ...b, ...response.data } : b
            );
            setBookings(updatedBookings);
            alert('Booking updated successfully!');
          } else {
            throw new Error(response.message || 'Failed to update booking');
          }
        } else {
          // Create new booking
          console.log('➕ Creating new booking');
          const response = await BookingService.createBooking(bookingData);
          
          if (response.success) {
            // Add to local state
            const newBooking = {
              id: response.data._id || response.data.id,
              ...response.data,
              status: response.data.status || 'pending'
            };
            setBookings([newBooking, ...bookings]);
            alert('Booking created successfully!');
          } else {
            throw new Error(response.message || 'Failed to create booking');
          }
        }
        
        setShowForm(false);
        setEditingBooking(null);
      } catch (error) {
        console.error("Error saving booking:", error);
        alert(`Failed to save booking: ${error.message}`);
      }
    };

    const filteredBookings = bookings.filter(booking => {
      const matchesSearch = 
        (booking.tailorId?.firstname?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        booking.tailorId?.lastname?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        booking.fabricId?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        booking.orderDetails?.garmentType?.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesStatus = filterStatus === "all" || booking.status === filterStatus;
      const matchesType = filterType === "all" || booking.bookingType === filterType;
      
      return matchesSearch && matchesStatus && matchesType;
    });

    const getBookingTypeIcon = (type) => {
      switch (type) {
        case "tailor": return "✂️";
        case "fabric": return "🧵";
        case "complete": return "🎯";
        default: return "📦";
      }
    };

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
        case "cancelled": return <FiXCircle className="w-4 h-4" />;
        default: return <FiClock className="w-4 h-4" />;
      }
    };

    const getPaymentStatusColor = (status) => {
      switch (status) {
        case "paid": return "bg-green-100 text-green-700";
        case "partial": return "bg-yellow-100 text-yellow-700";
        case "pending": return "bg-red-100 text-red-700";
        default: return "bg-gray-100 text-gray-700";
      }
    };

    if (loading) {
      return (
        <div className="flex h-screen bg-gray-50">
          <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} currentPage="bookings" />
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading bookings...</p>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="flex min-h-screen bg-gray-50">
        {/* Sidebar */}
        <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} currentPage="bookings" />

        {/* Main Content */}
        <div className="flex-1 flex flex-col min-h-screen">
          {/* Header */}
          <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
            <div className="px-6 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">My Bookings</h1>
                  <p className="text-gray-600 mt-1">Track and manage your tailor and fabric bookings</p>
                </div>
                
                <div className="flex items-center space-x-3">
                  <button
                    onClick={handleRefreshBookings}
                    className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-all duration-200"
                  >
                    <FiRefreshCw className="w-4 h-4 mr-2" />
                    Refresh
                  </button>
                  <button
                    onClick={handleAddBooking}
                    className="flex items-center px-4 py-2 bg-gradient-to-r from-amber-400 to-orange-500 text-white rounded-lg font-medium hover:from-amber-500 hover:to-orange-600 transition-all duration-200"
                  >
                    <FiPlus className="w-4 h-4 mr-2" />
                    New Booking
                  </button>
                </div>
              </div>

              {/* Search and Filters */}
              <div className="flex items-center justify-between mt-6">
                <div className="flex items-center space-x-4">
                  {/* Search */}
                  <div className="relative">
                    <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Search bookings..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent"
                    />
                  </div>

                  {/* Status Filter */}
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent"
                  >
                    <option value="all">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="in_progress">In Progress</option>
                    <option value="ready_for_delivery">Ready for Delivery</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>

                  {/* Type Filter */}
                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent"
                  >
                    <option value="all">All Types</option>
                    <option value="tailor">Tailor Only</option>
                    <option value="fabric">Fabric Only</option>
                    <option value="complete">Complete Package</option>
                  </select>
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
          <main className="flex-1 p-6 overflow-y-auto">
            <div className="max-w-7xl mx-auto">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-blue-600 rounded-lg flex items-center justify-center">
                      <FiPackage className="w-6 h-6 text-white" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Total Bookings</p>
                      <p className="text-2xl font-bold text-gray-900">{bookings.length}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-green-600 rounded-lg flex items-center justify-center">
                      <FiCheckCircle className="w-6 h-6 text-white" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Active</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {bookings.filter(b => ['pending', 'confirmed', 'in_progress', 'ready_for_delivery'].includes(b.status)).length}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-purple-600 rounded-lg flex items-center justify-center">
                      <FiTrendingUp className="w-6 h-6 text-white" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Total Value</p>
                      <p className="text-2xl font-bold text-gray-900">
                        ₹{bookings.reduce((sum, b) => sum + b.pricing.totalAmount, 0).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-gradient-to-r from-amber-400 to-orange-600 rounded-lg flex items-center justify-center">
                      <FiCalendar className="w-6 h-6 text-white" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">This Month</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {bookings.filter(b => {
                          const created = new Date(b.timeline.created);
                          const now = new Date();
                          return created.getMonth() === now.getMonth() && created.getFullYear() === now.getFullYear();
                        }).length}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bookings Grid/List */}
              {filteredBookings.length > 0 ? (
                <div className={`grid gap-6 ${
                  viewMode === "grid" 
                    ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
                    : 'grid-cols-1'
                }`}>
                  {filteredBookings.map((booking) => (
                    <div key={booking.id} className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200">
                      {/* Header */}
                      <div className="p-6 border-b border-gray-100">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center space-x-3">
                            <span className="text-2xl">{getBookingTypeIcon(booking.bookingType)}</span>
                            <div>
                              <h3 className="font-semibold text-gray-900 text-lg capitalize">
                                {booking.bookingType} Booking
                              </h3>
                              <div className="text-sm text-gray-600">
                                #{booking.id.toString().padStart(6, '0')}
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <span className={`px-2 py-1 text-xs font-medium rounded-full flex items-center space-x-1 ${getStatusColor(booking.status)}`}>
                              {getStatusIcon(booking.status)}
                              <span className="capitalize">{booking.status.replace('_', ' ')}</span>
                            </span>
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPaymentStatusColor(booking.pricing.paymentStatus)}`}>
                              {booking.pricing.paymentStatus}
                            </span>
                          </div>
                        </div>

                        {/* Order Details */}
                        <div className="space-y-3">
                          <div className="p-3 bg-gray-50 rounded-lg">
                            <p className="text-sm text-gray-600 mb-1">Garment</p>
                            <p className="font-medium text-gray-900">
                              {booking.orderDetails.garmentType} ({booking.orderDetails.quantity})
                            </p>
                          </div>
                          
                          <div className="p-3 bg-gray-50 rounded-lg">
                            <p className="text-sm text-gray-600 mb-1">Design & Instructions</p>
                            <p className="font-medium text-gray-900">{booking.orderDetails.design}</p>
                            <p className="text-sm text-gray-600">{booking.orderDetails.instructions}</p>
                          </div>

                          {/* Service Provider Info */}
                          {booking.tailorId && (
                            <div className="p-3 bg-blue-50 rounded-lg">
                              <p className="text-sm text-blue-600 mb-1">Tailor</p>
                              <p className="font-medium text-blue-900">
                                {booking.tailorId.firstname} {booking.tailorId.lastname}
                              </p>
                              <p className="text-sm text-blue-600">{booking.tailorId.phone}</p>
                            </div>
                          )}

                          {booking.fabricId && (
                            <div className="p-3 bg-green-50 rounded-lg">
                              <p className="text-sm text-green-600 mb-1">Fabric</p>
                              <p className="font-medium text-green-900">
                                {booking.fabricId.name} - {booking.fabricId.color}
                              </p>
                              <p className="text-sm text-green-600">{booking.fabricId.pattern}</p>
                            </div>
                          )}

                          {/* Measurement */}
                          {booking.measurementId && (
                            <div className="p-3 bg-purple-50 rounded-lg">
                              <p className="text-sm text-purple-600 mb-1">Measurement</p>
                              <p className="font-medium text-purple-900">{booking.measurementId.measurementName}</p>
                            </div>
                          )}

                          {/* Pricing */}
                          <div className="p-3 bg-amber-50 rounded-lg">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-sm text-amber-600 mb-1">Total Amount</p>
                                <p className="font-bold text-amber-900 text-lg">₹{booking.pricing.totalAmount}</p>
                              </div>
                              <div className="text-right">
                                <p className="text-sm text-amber-600">Advance</p>
                                <p className="font-medium text-amber-900">₹{booking.pricing.advanceAmount}</p>
                              </div>
                            </div>
                            <div className="mt-2 pt-2 border-t border-amber-200">
                              <p className="text-sm text-amber-600">Remaining: ₹{booking.pricing.remainingAmount}</p>
                            </div>
                          </div>

                          {/* Delivery Info */}
                          <div className="p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center space-x-2">
                              <FiMapPin className="w-4 h-4 text-gray-600" />
                              <div>
                                <p className="text-sm text-gray-600">Delivery Address</p>
                                <p className="font-medium text-gray-900">
                                  {booking.deliveryAddress.addressLine}, {booking.deliveryAddress.city}
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* Timeline */}
                          <div className="p-3 bg-gray-50 rounded-lg">
                            <p className="text-sm text-gray-600 mb-2">Timeline</p>
                            <div className="space-y-1">
                              <div className="flex items-center justify-between text-xs">
                                <span>Created:</span>
                                <span className="font-medium">{booking.timeline.created}</span>
                              </div>
                              {booking.timeline.estimatedDelivery && (
                                <div className="flex items-center justify-between text-xs">
                                  <span>Estimated Delivery:</span>
                                  <span className="font-medium">{booking.timeline.estimatedDelivery}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Footer */}
                      <div className="p-6">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleEditBooking(booking)}
                            className="flex-1 flex items-center justify-center px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                          >
                            <FiEdit2 className="w-4 h-4 mr-2" />
                            Edit
                          </button>
                          
                          {['pending', 'confirmed'].includes(booking.status) && (
                            <button
                              onClick={() => handleCancelBooking(booking.id)}
                              className="flex-1 flex items-center justify-center px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors duration-200"
                            >
                              <FiXCircle className="w-4 h-4 mr-2" />
                              Cancel
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gradient-to-r from-amber-100 to-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FiPackage className="w-8 h-8 text-amber-500" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No bookings found</h3>
                  <p className="text-gray-600 mb-4">
                    {searchQuery || filterStatus !== "all" || filterType !== "all"
                      ? "Try adjusting your search or filters" 
                      : "Get started by creating your first booking"
                    }
                  </p>
                  {!searchQuery && filterStatus === "all" && filterType === "all" && (
                    <button
                      onClick={handleAddBooking}
                      className="px-4 py-2 bg-gradient-to-r from-amber-400 to-orange-500 text-white rounded-lg font-medium hover:from-amber-500 hover:to-orange-600 transition-all duration-200"
                    >
                      <FiPlus className="w-4 h-4 mr-2 inline" />
                      Create First Booking
                    </button>
                  )}
                </div>
              )}
            </div>
          </main>
        </div>

        {/* Booking Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900">
                    {editingBooking ? 'Edit Booking' : 'Create New Booking'}
                  </h2>
                  <button
                    onClick={() => {
                      setShowForm(false);
                      setEditingBooking(null);
                    }}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
              
              <div className="p-6">
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-gradient-to-r from-amber-100 to-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FiPackage className="w-8 h-8 text-amber-500" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Booking Form</h3>
                  <p className="text-gray-600">
                    This form will be integrated with the backend API to create and manage bookings.
                  </p>
                  <p className="text-sm text-gray-500 mt-2">
                    For now, you can manage existing bookings using the edit and cancel functions.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  export default CustomerBookings; 