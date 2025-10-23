import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import { customerAPI } from "../../utils/bookingApi";
import { 
  FiPackage, 
  FiClock,
  FiCheckCircle,
  FiTruck,
  FiXCircle,
  FiSearch,
  FiFilter,
  FiCalendar,
  FiMapPin,
  FiDollarSign,
  FiShoppingBag,
  FiScissors,
  FiUser,
  FiPhone,
  FiMail,
  FiEye,
  FiDownload,
  FiStar,
  FiMessageSquare,
  FiRefreshCw
} from "react-icons/fi";

const CustomerOrders = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderDetails, setShowOrderDetails] = useState(false);
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'cards'
  const navigate = useNavigate();

  // Fetch orders on component mount
  useEffect(() => {
    fetchOrders();
  }, []);

  // Function to debug database contents
  const debugDatabase = async () => {
    try {
      console.log('🔍 Debugging database...');
      console.log('🔍 API Base URL:', import.meta.env.VITE_CUSTOMER_SERVICE_URL || 'http://localhost:3002');
      const response = await fetch(`${import.meta.env.VITE_CUSTOMER_SERVICE_URL || 'http://localhost:3002'}/api/bookings/debug/database`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      
      const result = await response.json();
      console.log('🔍 Database debug result:', result);
      alert(`Database Debug (Paid Bookings Focus):\nTotal bookings: ${result.debug.totalBookings}\nTotal PAID bookings: ${result.debug.totalPaidBookings}\nUser bookings: ${result.debug.userBookings}\nUser PAID bookings: ${result.debug.userPaidBookings}\nUser ID: ${result.debug.currentUserId}`);
    } catch (error) {
      console.error('❌ Error debugging database:', error);
    }
  };

  // Function to debug user object
  const debugUser = async () => {
    try {
      console.log('🔍 Debugging user object...');
      const baseUrl = import.meta.env.VITE_CUSTOMER_SERVICE_URL || 'http://localhost:3002';
      const fullUrl = `${baseUrl}/api/bookings/debug-user`;
      console.log('🔍 Debug user URL:', fullUrl);
      
      const response = await fetch(fullUrl, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('🔍 Debug user Response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('🔍 Debug user Error response:', errorText);
        alert(`Debug User Error: ${response.status} - ${errorText}`);
        return;
      }
      
      const result = await response.json();
      console.log('🔍 Debug user result:', result);
      alert(`Debug User:\nStatus: ${response.status}\nSuccess: ${result.success}\nUser Keys: ${result.userKeys?.join(', ')}\nHas User ID: ${result.hasUserId}\nUser ID: ${result.userId}`);
    } catch (error) {
      console.error('🔍 Debug user error:', error);
      alert(`Debug User Error: ${error.message}`);
    }
  };

  // Function to test simple API without authentication
  const testSimpleAPI = async () => {
    try {
      console.log('🧪 Testing simple API (no auth)...');
      const baseUrl = import.meta.env.VITE_CUSTOMER_SERVICE_URL || 'http://localhost:3002';
      const fullUrl = `${baseUrl}/api/bookings/test`;
      console.log('🧪 Simple API URL:', fullUrl);
      
      const response = await fetch(fullUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      console.log('🧪 Simple API Response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('🧪 Simple API Error response:', errorText);
        alert(`Simple API Error: ${response.status} - ${errorText}`);
        return;
      }
      
      const result = await response.json();
      console.log('🧪 Simple API result:', result);
      alert(`Simple API Test:\nStatus: ${response.status}\nSuccess: ${result.success}\nDatabase Connected: ${result.databaseConnected}\nTotal Bookings: ${result.totalBookings}`);
    } catch (error) {
      console.error('🧪 Simple API test error:', error);
      alert(`Simple API Test Error: ${error.message}`);
    }
  };

  // Function to test direct API call
  const testDirectAPI = async () => {
    try {
      console.log('🧪 Testing direct API call...');
      const baseUrl = import.meta.env.VITE_CUSTOMER_SERVICE_URL || 'http://localhost:3002';
      const fullUrl = `${baseUrl}/api/bookings/orders`;
      console.log('🧪 Full URL:', fullUrl);
      
      const response = await fetch(fullUrl, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('🧪 Response status:', response.status);
      console.log('🧪 Response headers:', Object.fromEntries(response.headers.entries()));
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('🧪 Error response:', errorText);
        alert(`API Error: ${response.status} - ${errorText}`);
        return;
      }
      
      const result = await response.json();
      console.log('🧪 Direct API result:', result);
      alert(`Direct API Test:\nStatus: ${response.status}\nData length: ${result.data?.length || 0}\nSuccess: ${result.success}`);
    } catch (error) {
      console.error('🧪 Direct API test error:', error);
      alert(`Direct API Test Error: ${error.message}`);
    }
  };

  // Function to create sample booking data
  const createSampleBooking = async () => {
    try {
      console.log('🔧 Creating sample booking...');
      console.log('🔧 API Base URL:', import.meta.env.VITE_CUSTOMER_SERVICE_URL || 'http://localhost:3002');
      const response = await fetch(`${import.meta.env.VITE_CUSTOMER_SERVICE_URL || 'http://localhost:3002'}/api/bookings/debug/sample`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      
      const result = await response.json();
      console.log('✅ Sample booking created:', result);
      
      if (result.success) {
        // Refresh the orders list
        fetchOrders();
      }
    } catch (error) {
      console.error('❌ Error creating sample booking:', error);
    }
  };

  const fetchOrders = async () => {
    setLoading(true);
    try {
      console.log('🔍 Fetching orders...');
      console.log('🔑 Token available:', !!localStorage.getItem('token'));
      console.log('🔑 Access token available:', !!localStorage.getItem('accessToken'));
      console.log('🌐 Customer Service URL:', import.meta.env.VITE_CUSTOMER_SERVICE_URL || 'http://localhost:3002');
      console.log('📡 Full API URL:', `${import.meta.env.VITE_CUSTOMER_SERVICE_URL || 'http://localhost:3002'}/api/bookings/orders`);
      
      const response = await customerAPI.getOrders();
      console.log('📦 API Response:', response);
      
      if (response && response.data) {
        // Check if response has data property (from backend)
        const bookings = response.data;
        console.log('📋 Raw bookings from /api/bookings/orders:', bookings);
        console.log('📊 Response structure:', {
          success: response.success,
          dataLength: bookings.length,
          pagination: response.pagination,
          filters: response.filters
        });
        
        // The enhanced function already returns formatted booking data
        // No need to filter as it returns all bookings for the user
        console.log('✅ Fetched orders:', bookings.length);
        setOrders(bookings);
      } else if (response && response.bookings) {
        // Fallback for different response structure
        const bookings = response.bookings;
        console.log('📋 Raw bookings (fallback):', bookings);
        
        console.log('✅ Fetched orders (fallback):', bookings.length);
        setOrders(bookings);
      } else {
        console.warn('⚠️ No bookings data found in response:', response);
        setOrders([]);
      }
    } catch (error) {
      console.error("❌ Error fetching orders:", error);
      console.error("❌ Error details:", error.message);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setShowOrderDetails(true);
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      (order.orderDetails?.garmentType?.toLowerCase().includes(searchQuery.toLowerCase()) ||
       order._id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
       order.tailorDetails?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
       order.fabricDetails?.name?.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesStatus = filterStatus === "all" || 
      (filterStatus === "confirmed" && order.status === "confirmed") ||
      (filterStatus === "in_progress" && order.status === "in_progress") ||
      (filterStatus === "completed" && order.status === "completed") ||
      (filterStatus === "delivered" && order.status === "delivered") ||
      (filterStatus === "paid" && order.payment?.status === "paid") ||
      (filterStatus === "pending" && order.payment?.status !== "paid");
    const matchesType = filterType === "all" || order.bookingType === filterType;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const getStatusIcon = (status) => {
    switch (status) {
      case "confirmed": return <FiCheckCircle className="w-5 h-5" />;
      case "in_progress": return <FiRefreshCw className="w-5 h-5" />;
      case "ready_for_fitting": return <FiPackage className="w-5 h-5" />;
      case "completed": return <FiCheckCircle className="w-5 h-5" />;
      case "delivered": return <FiTruck className="w-5 h-5" />;
      default: return <FiClock className="w-5 h-5" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "confirmed": return "bg-blue-100 text-blue-700 border-blue-300";
      case "in_progress": return "bg-purple-100 text-purple-700 border-purple-300";
      case "ready_for_fitting": return "bg-indigo-100 text-indigo-700 border-indigo-300";
      case "completed": return "bg-green-100 text-green-700 border-green-300";
      case "delivered": return "bg-emerald-100 text-emerald-700 border-emerald-300";
      default: return "bg-gray-100 text-gray-700 border-gray-300";
    }
  };

  const getOrderTypeIcon = (type) => {
    switch (type) {
      case "tailor": return <FiScissors className="w-5 h-5" />;
      case "fabric": return <FiShoppingBag className="w-5 h-5" />;
      case "complete": return <FiPackage className="w-5 h-5" />;
      default: return <FiPackage className="w-5 h-5" />;
    }
  };

  const formatDate = (date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatPrice = (price) => {
    return `₹${price?.toLocaleString('en-IN') || 0}`;
  };

  if (loading) {
    return (
      <div className="flex h-screen bg-gray-50">
        <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} userRole="customer" />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-coralblush mx-auto mb-4"></div>
            <p className="text-gray-600 text-lg">Loading your orders...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} userRole="customer" />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
          <div className="px-6 py-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 bg-gradient-to-r from-coralblush to-lilac bg-clip-text text-transparent">
                  My Orders
                </h1>
                <p className="text-gray-600 mt-2">Track and manage all your orders in one place</p>
              </div>
              
              <div className="flex items-center space-x-3">
                {/* View Toggle */}
                <div className="flex items-center bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode('table')}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-all ${
                      viewMode === 'table' 
                        ? 'bg-white text-gray-900 shadow-sm' 
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Table
                  </button>
                  <button
                    onClick={() => setViewMode('cards')}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-all ${
                      viewMode === 'cards' 
                        ? 'bg-white text-gray-900 shadow-sm' 
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Cards
                  </button>
                </div>

                <button
                  onClick={fetchOrders}
                  className="flex items-center px-4 py-2 bg-gradient-to-r from-coralblush to-lilac text-white rounded-lg font-medium hover:shadow-lg transition-all duration-200 transform hover:scale-105"
                >
                  <FiRefreshCw className="w-4 h-4 mr-2" />
                  Refresh
                </button>
              </div>
            </div>

            {/* Search and Filters */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-4 flex-1">
                {/* Search */}
                <div className="relative flex-1 max-w-md">
                  <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search orders by ID, garment type..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-coralblush focus:border-transparent transition-all"
                  />
                </div>

                {/* Order Status Filter */}
                <div className="relative">
                  <FiFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="pl-10 pr-8 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-coralblush focus:border-transparent appearance-none bg-white cursor-pointer"
                  >
                    <option value="all">All Orders</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                    <option value="delivered">Delivered</option>
                    <option value="paid">Paid Orders</option>
                    <option value="pending">Pending Payment</option>
                  </select>
                </div>

                {/* Type Filter */}
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-coralblush focus:border-transparent bg-white cursor-pointer"
                >
                  <option value="all">All Types</option>
                  <option value="tailor">Tailor Only</option>
                  <option value="fabric">Fabric Only</option>
                  <option value="complete">Complete Package</option>
                </select>
              </div>
            </div>
            
            {/* Orders Summary */}
            <div className="mt-6 bg-gradient-to-r from-coralblush to-lilac rounded-lg p-4 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold">Your Orders Summary</h3>
                  <p className="text-sm opacity-90">
                    {filteredOrders.length} order{filteredOrders.length !== 1 ? 's' : ''} found
                    {filterStatus === 'confirmed' && ' (Confirmed bookings only)'}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold">{filteredOrders.length}</div>
                  <div className="text-sm opacity-90">Total Orders</div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-6 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl shadow-md border border-blue-200 p-6 transform transition-all hover:scale-105">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-600 mb-1">Total Orders</p>
                    <p className="text-3xl font-bold text-blue-900">{orders.length}</p>
                  </div>
                  <div className="w-14 h-14 bg-blue-500 rounded-full flex items-center justify-center shadow-lg">
                    <FiPackage className="w-7 h-7 text-white" />
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl shadow-md border border-green-200 p-6 transform transition-all hover:scale-105">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-green-600 mb-1">Paid Orders</p>
                    <p className="text-3xl font-bold text-green-900">
                      {orders.filter(o => o.payment?.status === 'paid').length}
                    </p>
                  </div>
                  <div className="w-14 h-14 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
                    <FiCheckCircle className="w-7 h-7 text-white" />
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl shadow-md border border-red-200 p-6 transform transition-all hover:scale-105">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-red-600 mb-1">Pending Payment</p>
                    <p className="text-3xl font-bold text-red-900">
                      {orders.filter(o => o.payment?.status !== 'paid').length}
                    </p>
                  </div>
                  <div className="w-14 h-14 bg-red-500 rounded-full flex items-center justify-center shadow-lg">
                    <FiXCircle className="w-7 h-7 text-white" />
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl shadow-md border border-amber-200 p-6 transform transition-all hover:scale-105">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-amber-600 mb-1">Total Spent</p>
                    <p className="text-3xl font-bold text-amber-900">
                      {formatPrice(orders.reduce((sum, o) => sum + (o.pricing?.totalAmount || 0), 0))}
                    </p>
                  </div>
                  <div className="w-14 h-14 bg-amber-500 rounded-full flex items-center justify-center shadow-lg">
                    <FiDollarSign className="w-7 h-7 text-white" />
                  </div>
                </div>
              </div>
            </div>

            {/* Orders Display */}
            {filteredOrders.length > 0 ? (
              viewMode === 'table' ? (
                /* Table View */
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gradient-to-r from-coralblush to-lilac text-white">
                      <tr>
                        <th className="px-6 py-4 text-left text-sm font-semibold">Order ID</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold">Type</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold">Garment</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold">Tailor</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold">Status</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold">Payment</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold">Amount</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold">Order Date</th>
                        <th className="px-6 py-4 text-center text-sm font-semibold">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {filteredOrders.map((order, index) => (
                        <tr key={order._id || order.id} className={`hover:bg-gray-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                          {/* Order ID */}
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="w-8 h-8 bg-gradient-to-br from-coralblush to-lilac rounded-lg flex items-center justify-center mr-3">
                                <FiPackage className="w-4 h-4 text-white" />
                              </div>
                              <div>
                                <div className="text-sm font-medium text-gray-900">
                                  #{order._id?.slice(-8).toUpperCase() || order.id?.slice(-8).toUpperCase() || 'N/A'}
                                </div>
                                <div className="text-xs text-gray-500">Booking ID</div>
                              </div>
                            </div>
                          </td>

                          {/* Type */}
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              {getOrderTypeIcon(order.bookingType)}
                              <span className="ml-2 text-sm font-medium text-gray-900 capitalize">
                                {order.bookingType}
                              </span>
                            </div>
                          </td>

                          {/* Garment */}
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-gray-900 capitalize">
                                {order.orderDetails?.garmentType || 'N/A'}
                              </div>
                              <div className="text-xs text-gray-500">
                                Qty: {order.orderDetails?.quantity || 1}
                              </div>
                            </div>
                          </td>

                          {/* Tailor */}
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {order.tailor?.name || order.tailorDetails?.name || 'N/A'}
                              </div>
                              {order.tailor?.location && (
                                <div className="text-xs text-gray-500">
                                  {order.tailor.location.city}, {order.tailor.location.state}
                                </div>
                              )}
                            </div>
                          </td>

                          {/* Status */}
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(order.status)}`}>
                              {getStatusIcon(order.status)}
                              <span className="ml-1 capitalize">{order.status.replace(/_/g, ' ')}</span>
                            </span>
                          </td>

                          {/* Payment */}
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className={`w-3 h-3 rounded-full mr-2 ${
                                order.payment?.status === 'paid' ? 'bg-green-500' : 'bg-red-500'
                              }`}></div>
                              <span className={`text-sm font-medium ${
                                order.payment?.status === 'paid' ? 'text-green-700' : 'text-red-700'
                              }`}>
                                {order.payment?.status === 'paid' ? 'PAID' : 'PENDING'}
                              </span>
                            </div>
                            {order.payment?.method && (
                              <div className="text-xs text-gray-500 capitalize">
                                {order.payment.method}
                              </div>
                            )}
                          </td>

                          {/* Amount */}
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-semibold text-gray-900">
                              {formatPrice(order.pricing?.totalAmount)}
                            </div>
                            {order.pricing?.advanceAmount > 0 && (
                              <div className="text-xs text-green-600">
                                Paid: {formatPrice(order.pricing.advanceAmount)}
                              </div>
                            )}
                          </td>

                          {/* Order Date */}
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {formatDate(order.timeline?.bookingDate || order.createdAt)}
                            </div>
                            {order.orderDetails?.deliveryDate && (
                              <div className="text-xs text-gray-500">
                                Expected: {formatDate(order.orderDetails.deliveryDate)}
                              </div>
                            )}
                          </td>

                          {/* Actions */}
                          <td className="px-6 py-4 whitespace-nowrap text-center">
                            <button
                              onClick={() => handleViewDetails(order)}
                              className="inline-flex items-center px-3 py-2 bg-gradient-to-r from-coralblush to-lilac text-white text-sm font-medium rounded-lg hover:shadow-lg transition-all duration-200 transform hover:scale-105"
                            >
                              <FiEye className="w-4 h-4 mr-1" />
                              View
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Table Footer */}
                <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-700">
                      Showing {filteredOrders.length} of {orders.length} orders
                    </div>
                    <div className="flex items-center space-x-2">
                      <button className="px-3 py-1 text-sm bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
                        Previous
                      </button>
                      <button className="px-3 py-1 text-sm bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
                        Next
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              ) : (
                /* Card View */
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredOrders.map((order) => (
                    <div 
                      key={order._id || order.id} 
                      className="bg-white rounded-xl shadow-md border border-gray-200 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden"
                    >
                      {/* Order Header */}
                      <div className="bg-gradient-to-r from-coralblush to-lilac p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2 text-white">
                            {getOrderTypeIcon(order.bookingType)}
                            <span className="font-semibold capitalize">{order.bookingType} Order</span>
                          </div>
                          <span className={`px-3 py-1 text-xs font-semibold rounded-full flex items-center space-x-1 bg-white border ${getStatusColor(order.status)}`}>
                            {getStatusIcon(order.status)}
                            <span className="capitalize ml-1">{order.status.replace(/_/g, ' ')}</span>
                          </span>
                        </div>
                        <div className="text-white text-sm mt-2 opacity-90">
                          Booking ID: #{order._id?.slice(-8).toUpperCase() || order.id?.slice(-8).toUpperCase() || 'N/A'}
                        </div>
                      </div>

                      {/* Order Body */}
                      <div className="p-5 space-y-4">
                        {/* Garment Details */}
                        <div className="bg-gray-50 rounded-lg p-4">
                          <div className="flex items-start justify-between">
                            <div>
                              <p className="text-xs text-gray-500 mb-1">Garment Type</p>
                              <p className="font-semibold text-gray-900 capitalize text-lg">
                                {order.orderDetails?.garmentType || 'N/A'}
                              </p>
                              <p className="text-sm text-gray-600 mt-1">
                                Quantity: {order.orderDetails?.quantity || 1}
                              </p>
                            </div>
                            <div className="w-12 h-12 bg-gradient-to-br from-coralblush to-lilac rounded-lg flex items-center justify-center">
                              <FiPackage className="w-6 h-6 text-white" />
                            </div>
                          </div>
                        </div>

                        {/* Tailor/Fabric Info */}
                        {order.tailor && (
                          <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                            <div className="flex items-center space-x-2 mb-2">
                              <FiScissors className="w-4 h-4 text-blue-600" />
                              <p className="text-xs font-medium text-blue-600">Tailor</p>
                            </div>
                            <p className="font-semibold text-blue-900">{order.tailor.name || 'N/A'}</p>
                            {order.tailor.location && (
                              <p className="text-sm text-blue-700 mt-1">
                                {order.tailor.location.city}, {order.tailor.location.state}
                              </p>
                            )}
                          </div>
                        )}

                        {order.fabric && (
                          <div className="bg-green-50 rounded-lg p-4 border border-green-100">
                            <div className="flex items-center space-x-2 mb-2">
                              <FiShoppingBag className="w-4 h-4 text-green-600" />
                              <p className="text-xs font-medium text-green-600">Fabric</p>
                            </div>
                            <p className="font-semibold text-green-900">{order.fabric.name || 'N/A'}</p>
                            <p className="text-sm text-green-700 mt-1">
                              {order.fabric.color} - {order.fabric.pattern}
                            </p>
                          </div>
                        )}

                        {/* Payment Status Card */}
                        <div className={`rounded-lg p-4 border-2 ${
                          order.payment?.status === 'paid' 
                            ? 'bg-green-50 border-green-200' 
                            : 'bg-red-50 border-red-200'
                        }`}>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                order.payment?.status === 'paid' ? 'bg-green-500' : 'bg-red-500'
                              }`}>
                                {order.payment?.status === 'paid' ? (
                                  <FiCheckCircle className="w-6 h-6 text-white" />
                                ) : (
                                  <FiXCircle className="w-6 h-6 text-white" />
                                )}
                              </div>
                              <div>
                                <p className="text-sm font-medium text-gray-600">Payment Status</p>
                                <p className={`text-lg font-bold ${
                                  order.payment?.status === 'paid' ? 'text-green-700' : 'text-red-700'
                                }`}>
                                  {order.payment?.status === 'paid' ? 'PAID' : 'PENDING'}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-xs text-gray-600 mb-1">Total Amount</p>
                              <p className="font-bold text-gray-900 text-xl">
                                {formatPrice(order.pricing?.totalAmount)}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Timeline */}
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center space-x-2 text-gray-600">
                            <FiCalendar className="w-4 h-4" />
                            <span>Ordered: {formatDate(order.timeline?.bookingDate || order.createdAt)}</span>
                          </div>
                        </div>
                        {order.orderDetails?.deliveryDate && (
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <FiTruck className="w-4 h-4" />
                            <span>Expected: {formatDate(order.orderDetails.deliveryDate)}</span>
                          </div>
                        )}
                      </div>

                      {/* Order Footer */}
                      <div className="p-5 bg-gray-50 border-t border-gray-200">
                        <button
                          onClick={() => handleViewDetails(order)}
                          className="w-full flex items-center justify-center px-4 py-3 bg-gradient-to-r from-coralblush to-lilac text-white rounded-lg font-medium hover:shadow-lg transition-all duration-200 transform hover:scale-105"
                        >
                          <FiEye className="w-4 h-4 mr-2" />
                          View Details
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )
            ) : (
              <div className="text-center py-16">
                <div className="w-24 h-24 bg-gradient-to-r from-coralblush to-lilac rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <FiPackage className="w-12 h-12 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">No orders found</h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  {searchQuery || filterStatus !== "all" || filterType !== "all"
                    ? "Try adjusting your search or filters to find what you're looking for" 
                    : "You haven't placed any orders yet. Start browsing to create your first order!"
                  }
                </p>
                {!searchQuery && filterStatus === "all" && filterType === "all" && (
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button
                      onClick={() => navigate('/customer/fabrics')}
                      className="px-6 py-3 bg-gradient-to-r from-coralblush to-lilac text-white rounded-lg font-medium hover:shadow-lg transition-all duration-200 transform hover:scale-105"
                    >
                      Start Shopping
                    </button>
                    <button
                      onClick={testSimpleAPI}
                      className="px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:shadow-lg transition-all duration-200 transform hover:scale-105"
                    >
                      Test Simple API
                    </button>
                    <button
                      onClick={debugUser}
                      className="px-6 py-3 bg-orange-600 text-white rounded-lg font-medium hover:shadow-lg transition-all duration-200 transform hover:scale-105"
                    >
                      Debug User
                    </button>
                    <button
                      onClick={testDirectAPI}
                      className="px-6 py-3 bg-purple-600 text-white rounded-lg font-medium hover:shadow-lg transition-all duration-200 transform hover:scale-105"
                    >
                      Test Auth API
                    </button>
                    <button
                      onClick={debugDatabase}
                      className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:shadow-lg transition-all duration-200 transform hover:scale-105"
                    >
                      Debug Database
                    </button>
                    <button
                      onClick={createSampleBooking}
                      className="px-6 py-3 bg-gray-600 text-white rounded-lg font-medium hover:shadow-lg transition-all duration-200 transform hover:scale-105"
                    >
                      Create Sample Order
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Order Details Modal */}
      {showOrderDetails && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-gradient-to-r from-coralblush to-lilac p-6 border-b border-gray-200 z-10">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-white">Order Details</h2>
                  <p className="text-white text-sm mt-1 opacity-90">
                    Order ID: #{selectedOrder._id?.slice(-8).toUpperCase() || 'N/A'}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setShowOrderDetails(false);
                    setSelectedOrder(null);
                  }}
                  className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-all"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            
            {/* Modal Body */}
            <div className="p-6 space-y-6">
              {/* Status & Type */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <p className="text-sm text-gray-600 mb-2">Order Status</p>
                  <div className={`inline-flex items-center space-x-2 px-4 py-2 rounded-full border ${getStatusColor(selectedOrder.status)}`}>
                    {getStatusIcon(selectedOrder.status)}
                    <span className="font-semibold capitalize">{selectedOrder.status.replace(/_/g, ' ')}</span>
                  </div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <p className="text-sm text-gray-600 mb-2">Order Type</p>
                  <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-white border border-gray-300">
                    {getOrderTypeIcon(selectedOrder.bookingType)}
                    <span className="font-semibold capitalize">{selectedOrder.bookingType}</span>
                  </div>
                </div>
              </div>

              {/* Order Details */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center">
                  <FiPackage className="w-5 h-5 mr-2 text-blue-600" />
                  Garment Details
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Garment Type</p>
                    <p className="font-semibold text-gray-900 capitalize">
                      {selectedOrder.orderDetails?.garmentType || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Quantity</p>
                    <p className="font-semibold text-gray-900">{selectedOrder.orderDetails?.quantity || 1}</p>
                  </div>
                  {selectedOrder.orderDetails?.designDescription && (
                    <div className="col-span-2">
                      <p className="text-sm text-gray-600">Design Description</p>
                      <p className="font-medium text-gray-900">{selectedOrder.orderDetails.designDescription}</p>
                    </div>
                  )}
                  {selectedOrder.orderDetails?.specialInstructions && (
                    <div className="col-span-2">
                      <p className="text-sm text-gray-600">Special Instructions</p>
                      <p className="font-medium text-gray-900">{selectedOrder.orderDetails.specialInstructions}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Pricing Breakdown */}
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg p-6 border border-amber-200">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center">
                  <FiDollarSign className="w-5 h-5 mr-2 text-amber-600" />
                  Pricing Details
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-700">Fabric Cost</span>
                    <span className="font-semibold">{formatPrice(selectedOrder.pricing?.fabricCost)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700">Tailoring Cost</span>
                    <span className="font-semibold">{formatPrice(selectedOrder.pricing?.tailoringCost)}</span>
                  </div>
                  {selectedOrder.pricing?.additionalCharges > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-700">Additional Charges</span>
                      <span className="font-semibold">{formatPrice(selectedOrder.pricing.additionalCharges)}</span>
                    </div>
                  )}
                  <div className="border-t border-amber-300 pt-3 flex justify-between">
                    <span className="font-bold text-gray-900 text-lg">Total Amount</span>
                    <span className="font-bold text-amber-900 text-2xl">{formatPrice(selectedOrder.pricing?.totalAmount)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700">Advance Paid</span>
                    <span className="font-semibold text-green-600">{formatPrice(selectedOrder.pricing?.advanceAmount)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700">Remaining</span>
                    <span className="font-semibold text-red-600">{formatPrice(selectedOrder.pricing?.remainingAmount)}</span>
                  </div>
                </div>
              </div>

              {/* Timeline */}
              {selectedOrder.timeline && (
                <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                  <h3 className="font-bold text-gray-900 mb-4 flex items-center">
                    <FiCalendar className="w-5 h-5 mr-2 text-gray-600" />
                    Timeline
                  </h3>
                  <div className="space-y-3">
                    {selectedOrder.timeline.bookingDate && (
                      <div className="flex justify-between">
                        <span className="text-gray-700">Booking Date</span>
                        <span className="font-semibold">{formatDate(selectedOrder.timeline.bookingDate)}</span>
                      </div>
                    )}
                    {selectedOrder.timeline.confirmationDate && (
                      <div className="flex justify-between">
                        <span className="text-gray-700">Confirmation Date</span>
                        <span className="font-semibold">{formatDate(selectedOrder.timeline.confirmationDate)}</span>
                      </div>
                    )}
                    {selectedOrder.orderDetails?.deliveryDate && (
                      <div className="flex justify-between">
                        <span className="text-gray-700">Expected Delivery</span>
                        <span className="font-semibold">{formatDate(selectedOrder.orderDetails.deliveryDate)}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-6 bg-gray-50 border-t border-gray-200 flex items-center justify-end space-x-3">
              <button
                onClick={() => {
                  setShowOrderDetails(false);
                  setSelectedOrder(null);
                }}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-100 transition-all"
              >
                Close
              </button>
              <button
                className="px-6 py-3 bg-gradient-to-r from-coralblush to-lilac text-white rounded-lg font-medium hover:shadow-lg transition-all transform hover:scale-105"
              >
                <FiDownload className="w-4 h-4 inline mr-2" />
                Download Invoice
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerOrders;

