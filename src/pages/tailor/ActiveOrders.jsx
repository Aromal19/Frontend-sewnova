import React, { useState, useEffect } from "react";
import Sidebar from "../../components/Sidebar";
import { 
  FiPackage, 
  FiClock, 
  FiCheckCircle, 
  FiAlertCircle, 
  FiUser, 
  FiCalendar,
  FiTrendingUp,
  FiEdit,
  FiEye,
  FiMessageSquare,
  FiFilter,
  FiSearch,
  FiTrendingDown,
  FiActivity,
  FiMapPin,
  FiX
} from "react-icons/fi";

const ActiveOrders = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedPriority, setSelectedPriority] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [activeOrders, setActiveOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  // Fetch active orders from backend
  useEffect(() => {
    fetchActiveOrders();
  }, []);

  const fetchActiveOrders = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('accessToken') || localStorage.getItem('token');
      
      const response = await fetch('http://localhost:3002/api/tailor/orders/active', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          // Transform backend data to match component structure
          const transformedOrders = data.data.map(order => transformOrder(order));
          setActiveOrders(transformedOrders);
        }
      } else {
        console.error('Failed to fetch orders:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching active orders:', error);
    } finally {
      setLoading(false);
    }
  };

  // Transform backend order to component format
  const transformOrder = (order) => {
    const customer = order.customerId || {};
    const deliveryDate = new Date(order.orderDetails?.deliveryDate);
    const today = new Date();
    const daysRemaining = Math.ceil((deliveryDate - today) / (1000 * 60 * 60 * 24));
    
    // Calculate priority based on days remaining
    let priority = 'low';
    if (daysRemaining <= 2) priority = 'high';
    else if (daysRemaining <= 5) priority = 'medium';

    return {
      id: `#${order._id.toString().substring(0, 8).toUpperCase()}`,
      _id: order._id,
      customer: `${customer.firstname || ''} ${customer.lastname || ''}`.trim() || 'Unknown Customer',
      service: `${order.orderDetails?.garmentType || 'Custom'} ${order.bookingType === 'complete' ? '(Complete)' : order.bookingType === 'tailor' ? '(Tailoring)' : ''}`,
      amount: `₹${order.pricing?.totalAmount || 0}`,
      status: order.status === 'in_progress' ? 'in-progress' : order.status,
      priority: priority,
      deadline: deliveryDate.toISOString().split('T')[0],
      startDate: order.timeline?.startDate ? new Date(order.timeline.startDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      deliveryDate: deliveryDate.toISOString().split('T')[0],
      daysRemaining: daysRemaining,
      estimatedHours: daysRemaining * 4, // Estimate 4 hours per day
      completedHours: order.status === 'in_progress' ? Math.floor(daysRemaining * 2) : 0,
      progress: order.status === 'completed' ? 100 : order.status === 'in_progress' ? 50 : 0,
      customerPhone: `${customer.countryCode || '+91'} ${customer.phone || ''}`,
      customerEmail: customer.email || '',
      notes: order.orderDetails?.specialInstructions || '',
      designDescription: order.orderDetails?.designDescription || '',
      measurements: order.measurementSnapshot || order.measurementId || {},
      deliveryAddress: order.deliveryAddress || {},
      lastUpdate: calculateTimeAgo(order.updatedAt || order.createdAt),
      pricing: order.pricing,
      payment: order.payment,
      rawOrder: order
    };
  };

  const calculateTimeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    if (seconds < 60) return 'just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    const days = Math.floor(hours / 24);
    return `${days} day${days > 1 ? 's' : ''} ago`;
  };

  const mockOrders = [
    {
      id: "#ORD-001",
      customer: "Sarah Johnson",
      service: "Wedding Dress Alteration",
      amount: "₹450",
      status: "in-progress",
      priority: "high",
      deadline: "2024-01-20",
      startDate: "2024-01-15",
      estimatedHours: 8,
      completedHours: 4,
      progress: 50,
      customerPhone: "+1 (555) 123-4567",
      customerEmail: "sarah.johnson@email.com",
      notes: "Customer requested rush delivery for wedding on Jan 25th",
      lastUpdate: "2 hours ago"
    },
    {
      id: "#ORD-002",
      customer: "Mike Chen",
      service: "Suit Fitting & Alteration",
      amount: "₹320",
      status: "pending",
      priority: "medium",
      deadline: "2024-01-22",
      startDate: "2024-01-18",
      estimatedHours: 6,
      completedHours: 0,
      progress: 0,
      customerPhone: "+1 (555) 234-5678",
      customerEmail: "mike.chen@email.com",
      notes: "Customer prefers evening appointments",
      lastUpdate: "1 day ago"
    },
    {
      id: "#ORD-003",
      customer: "Emma Davis",
      service: "Dress Hemming",
      amount: "₹180",
      status: "in-progress",
      priority: "low",
      deadline: "2024-01-18",
      startDate: "2024-01-16",
      estimatedHours: 3,
      completedHours: 2,
      progress: 67,
      customerPhone: "+1 (555) 345-6789",
      customerEmail: "emma.davis@email.com",
      notes: "Simple hemming job, straightforward",
      lastUpdate: "4 hours ago"
    },
    {
      id: "#ORD-004",
      customer: "Alex Wilson",
      service: "Blouse Alteration",
      amount: "₹120",
      status: "in-progress",
      priority: "medium",
      deadline: "2024-01-25",
      startDate: "2024-01-20",
      estimatedHours: 4,
      completedHours: 2,
      progress: 50,
      customerPhone: "+1 (555) 456-7890",
      customerEmail: "alex.wilson@email.com",
      notes: "Customer wants to keep original buttons",
      lastUpdate: "6 hours ago"
    },
    {
      id: "#ORD-005",
      customer: "Lisa Brown",
      service: "Pants Tailoring",
      amount: "₹280",
      status: "pending",
      priority: "low",
      deadline: "2024-01-19",
      startDate: "2024-01-17",
      estimatedHours: 5,
      completedHours: 0,
      progress: 0,
      customerPhone: "+1 (555) 567-8901",
      customerEmail: "lisa.brown@email.com",
      notes: "Standard tailoring, no rush",
      lastUpdate: "2 days ago"
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "completed": return "bg-green-100 text-green-800";
      case "in-progress": return "bg-blue-100 text-blue-800";
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "cancelled": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high": return "bg-red-100 text-red-800";
      case "medium": return "bg-yellow-100 text-yellow-800";
      case "low": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getProgressColor = (progress) => {
    if (progress >= 80) return "bg-green-500";
    if (progress >= 50) return "bg-yellow-500";
    return "bg-red-500";
  };

  const filteredOrders = activeOrders.filter(order => {
    const matchesStatus = selectedStatus === "all" || order.status === selectedStatus;
    const matchesPriority = selectedPriority === "all" || order.priority === selectedPriority;
    const matchesSearch = order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.service.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.id.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesPriority && matchesSearch;
  });

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const token = localStorage.getItem('accessToken') || localStorage.getItem('token');
      
      const response = await fetch(`http://localhost:3002/api/tailor/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        const data = await response.json();
        console.log('✅ Order status updated:', data);
        // Refresh orders list
        fetchActiveOrders();
      } else {
        console.error('Failed to update order status');
      }
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  const markAsCompleted = (orderId) => {
    updateOrderStatus(orderId, 'completed');
  };

  const markAsInProgress = (orderId) => {
    updateOrderStatus(orderId, 'in_progress');
  };

  const viewOrderDetails = (order) => {
    setSelectedOrder(order);
    setShowDetailsModal(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex bg-gray-50">
        <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} userRole="tailor" />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-500 mx-auto mb-4"></div>
            <p className="text-gray-600 font-medium">Loading active orders...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-gray-50">
      <Sidebar 
        isOpen={sidebarOpen} 
        setIsOpen={setSidebarOpen} 
        userRole="tailor" 
      />
      
      <main className={`flex-1 transition-all duration-500 ease-in-out ${
        sidebarOpen ? 'ml-0' : 'ml-0'
      }`}>
        <div className="p-6">
          {/* Header */}
          <header className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold text-charcoal">Active Orders</h1>
                <p className="text-gray-600 mt-2">Manage your current orders and track progress.</p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <FiTrendingUp className="w-5 h-5 text-green-500" />
                  <span className="text-sm text-gray-600">
                    {filteredOrders.length} active orders
                  </span>
                </div>
                <button className="px-6 py-3 bg-gradient-to-r from-coralblush to-pink-500 text-white rounded-lg font-semibold hover:from-pink-500 hover:to-coralblush transition-all duration-300 shadow-lg flex items-center space-x-2">
                  <FiPackage className="w-4 h-4" />
                  <span>New Order</span>
                </button>
              </div>
            </div>

            {/* Filters */}
            <div className="flex items-center space-x-4 mb-6">
              <div className="relative flex-1 max-w-md">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search orders..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-coralblush focus:border-transparent"
                />
              </div>
              <select 
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-coralblush focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
              <select 
                value={selectedPriority}
                onChange={(e) => setSelectedPriority(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-coralblush focus:border-transparent"
              >
                <option value="all">All Priority</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
          </header>

          {/* Orders Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredOrders.map((order, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
                {/* Order Header */}
                <div className="p-6 border-b border-gray-100">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-coralblush to-pink-500 rounded-lg flex items-center justify-center">
                        <FiPackage className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-charcoal">{order.id}</h3>
                        <p className="text-sm text-gray-600">{order.service}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-charcoal">{order.amount}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                          {order.status.replace('-', ' ')}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(order.priority)}`}>
                          {order.priority}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Customer Info */}
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-lilac to-purple-500 rounded-full flex items-center justify-center">
                      <FiUser className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-charcoal">{order.customer}</p>
                      <p className="text-xs text-gray-500">{order.customerEmail}</p>
                    </div>
                  </div>
                </div>

                {/* Progress Section */}
                <div className="p-6">
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">Progress</span>
                      <span className="text-sm font-medium text-charcoal">{order.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${getProgressColor(order.progress)}`}
                        style={{ width: `${order.progress}%` }}
                      ></div>
                    </div>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-xs text-gray-500">{order.completedHours}/{order.estimatedHours}h</span>
                      <span className="text-xs text-gray-500">Last update: {order.lastUpdate}</span>
                    </div>
                  </div>

                  {/* Timeline */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm">
                      <FiCalendar className="w-4 h-4 text-gray-400 mr-2" />
                      <span className="text-gray-600">Started: {order.startDate}</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <FiClock className="w-4 h-4 text-gray-400 mr-2" />
                      <span className="text-gray-600">Deadline: {order.deadline}</span>
                    </div>
                    {order.daysRemaining !== undefined && (
                      <div className="flex items-center text-sm">
                        <FiClock className={`w-4 h-4 mr-2 ${order.daysRemaining <= 2 ? 'text-red-500' : order.daysRemaining <= 5 ? 'text-yellow-500' : 'text-green-500'}`} />
                        <span className={`font-semibold ${order.daysRemaining <= 2 ? 'text-red-600' : order.daysRemaining <= 5 ? 'text-yellow-600' : 'text-green-600'}`}>
                          {order.daysRemaining} {order.daysRemaining === 1 ? 'day' : 'days'} remaining
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Measurements Preview */}
                  {order.measurements && Object.keys(order.measurements).length > 0 && (
                    <div className="mb-4 p-3 bg-purple-50 rounded-lg border border-purple-200">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-purple-900 flex items-center">
                          <FiActivity className="w-4 h-4 mr-1" />
                          Measurements
                        </span>
                        <button 
                          onClick={() => viewOrderDetails(order)}
                          className="text-xs text-purple-600 hover:text-purple-800"
                        >
                          View All
                        </button>
                      </div>
                      <div className="text-xs text-purple-700">
                        {Object.entries(order.measurements).slice(0, 3).map(([key, value]) => (
                          <div key={key} className="flex justify-between py-1">
                            <span className="capitalize">{key.replace(/_/g, ' ')}:</span>
                            <span className="font-semibold">{value}</span>
                          </div>
                        ))}
                        {Object.keys(order.measurements).length > 3 && (
                          <div className="text-center mt-1 text-purple-600 font-medium">
                            +{Object.keys(order.measurements).length - 3} more
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Notes */}
                  {order.notes && (
                    <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-700">{order.notes}</p>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center space-x-2">
                    {order.status === 'pending' || order.status === 'confirmed' ? (
                      <button 
                        className="flex-1 px-3 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors"
                        onClick={() => markAsInProgress(order._id)}
                      >
                        Start Working
                      </button>
                    ) : (
                      <button 
                        className="flex-1 px-3 py-2 bg-coralblush text-white rounded-lg text-sm font-medium hover:bg-pink-500 transition-colors"
                        onClick={() => viewOrderDetails(order)}
                      >
                        Update Progress
                      </button>
                    )}
                    <button 
                      className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
                      title="View Details"
                      onClick={() => viewOrderDetails(order)}
                    >
                      <FiEye className="w-4 h-4" />
                    </button>
                    {(order.status === 'in-progress' || order.status === 'ready_for_fitting') && (
                      <button 
                        className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-colors"
                        title="Mark Complete"
                        onClick={() => markAsCompleted(order._id)}
                      >
                        <FiCheckCircle className="w-4 h-4" />
                      </button>
                    )}
                    <button 
                      className="p-2 bg-purple-100 text-purple-600 rounded-lg hover:bg-purple-200 transition-colors"
                      title="Contact Customer"
                      onClick={() => window.location.href = `mailto:${order.customerEmail}`}
                    >
                      <FiMessageSquare className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {filteredOrders.length === 0 && (
            <div className="text-center py-12">
              <FiPackage className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No active orders found</h3>
              <p className="text-gray-500 mb-6">
                {searchTerm || selectedStatus !== "all" || selectedPriority !== "all" 
                  ? "Try adjusting your filters or search terms."
                  : "You don't have any active orders at the moment."
                }
              </p>
              <button className="px-6 py-3 bg-gradient-to-r from-coralblush to-pink-500 text-white rounded-lg font-semibold hover:from-pink-500 hover:to-coralblush transition-all duration-300">
                Create New Order
              </button>
            </div>
          )}

          {/* Quick Stats */}
          {filteredOrders.length > 0 && (
            <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-coralblush to-pink-500 rounded-lg flex items-center justify-center">
                    <FiPackage className="w-6 h-6 text-white" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-600">Total Active</p>
                    <p className="text-2xl font-bold text-charcoal">{filteredOrders.length}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center">
                    <FiClock className="w-6 h-6 text-white" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-600">In Progress</p>
                    <p className="text-2xl font-bold text-charcoal">
                      {filteredOrders.filter(o => o.status === 'in-progress').length}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center">
                    <FiAlertCircle className="w-6 h-6 text-white" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-600">High Priority</p>
                    <p className="text-2xl font-bold text-charcoal">
                      {filteredOrders.filter(o => o.priority === 'high').length}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                    <FiTrendingUp className="w-6 h-6 text-white" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-600">Total Value</p>
                    <p className="text-2xl font-bold text-charcoal">
                      ${filteredOrders.reduce((sum, order) => sum + parseFloat(order.amount.replace('$', '')), 0).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Order Details Modal */}
          {showDetailsModal && selectedOrder && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                {/* Modal Header */}
                <div className="sticky top-0 bg-gradient-to-r from-purple-500 to-pink-500 text-white p-6 rounded-t-xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-bold">{selectedOrder.id}</h2>
                      <p className="text-purple-100 mt-1">{selectedOrder.service}</p>
                    </div>
                    <button 
                      onClick={() => setShowDetailsModal(false)}
                      className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                    >
                      <FiX className="w-6 h-6" />
                    </button>
                  </div>
                </div>

                <div className="p-6 space-y-6">
                  {/* Customer & Payment Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Customer Details */}
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                        <FiUser className="w-5 h-5 mr-2 text-purple-500" />
                        Customer Details
                      </h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Name:</span>
                          <span className="font-medium">{selectedOrder.customer}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Email:</span>
                          <span className="font-medium text-blue-600">{selectedOrder.customerEmail}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Phone:</span>
                          <span className="font-medium">{selectedOrder.customerPhone}</span>
                        </div>
                      </div>
                    </div>

                    {/* Payment Details */}
                    <div className="bg-green-50 rounded-lg p-4">
                      <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                        <FiCheckCircle className="w-5 h-5 mr-2 text-green-500" />
                        Payment Details
                      </h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Total Amount:</span>
                          <span className="font-bold text-green-600 text-lg">₹{selectedOrder.pricing?.totalAmount || 0}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Advance Paid:</span>
                          <span className="font-medium text-green-600">₹{selectedOrder.pricing?.advanceAmount || 0}</span>
                        </div>
                        <div className="flex justify-between border-t border-green-200 pt-2">
                          <span className="text-gray-600 font-semibold">Remaining:</span>
                          <span className="font-bold text-red-600">₹{(selectedOrder.pricing?.totalAmount || 0) - (selectedOrder.pricing?.advanceAmount || 0)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Payment Status:</span>
                          <span className="font-medium text-green-600 capitalize">{selectedOrder.payment?.status || 'Pending'}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Timeline & Deadline */}
                  <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                    <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                      <FiClock className="w-5 h-5 mr-2 text-yellow-600" />
                      Timeline & Deadline
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">Started:</p>
                        <p className="font-semibold text-gray-900">{selectedOrder.startDate}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Deadline:</p>
                        <p className="font-semibold text-red-600">{selectedOrder.deadline}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Time Remaining:</p>
                        <p className={`font-bold text-lg ${selectedOrder.daysRemaining <= 2 ? 'text-red-600' : selectedOrder.daysRemaining <= 5 ? 'text-yellow-600' : 'text-green-600'}`}>
                          {selectedOrder.daysRemaining} {selectedOrder.daysRemaining === 1 ? 'day' : 'days'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Design Description */}
                  {selectedOrder.designDescription && (
                    <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                      <h3 className="font-semibold text-gray-900 mb-2">🎨 Design Description</h3>
                      <p className="text-sm text-gray-700">{selectedOrder.designDescription}</p>
                    </div>
                  )}

                  {/* Special Instructions */}
                  {selectedOrder.notes && (
                    <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
                      <h3 className="font-semibold text-gray-900 mb-2">📝 Special Instructions</h3>
                      <p className="text-sm text-gray-700">{selectedOrder.notes}</p>
                    </div>
                  )}

                  {/* Complete Measurements */}
                  {selectedOrder.measurements && Object.keys(selectedOrder.measurements).length > 0 && (
                    <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                      <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                        <FiActivity className="w-5 h-5 mr-2 text-purple-500" />
                        Complete Measurements
                      </h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {Object.entries(selectedOrder.measurements).map(([key, value]) => (
                          <div key={key} className="flex justify-between items-center p-2 bg-white rounded border border-purple-100">
                            <span className="text-sm text-gray-600 capitalize">{key.replace(/_/g, ' ')}:</span>
                            <span className="text-sm font-bold text-purple-700">{value} {typeof value === 'number' ? 'in' : ''}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Delivery Address */}
                  {selectedOrder.deliveryAddress && (
                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                      <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                        <FiMapPin className="w-5 h-5 mr-2 text-gray-600" />
                        Delivery Address
                      </h3>
                      <div className="text-sm text-gray-700">
                        {selectedOrder.deliveryAddress.addressLine && (
                          <p className="font-medium">{selectedOrder.deliveryAddress.addressLine}</p>
                        )}
                        {selectedOrder.deliveryAddress.locality && (
                          <p>{selectedOrder.deliveryAddress.locality}</p>
                        )}
                        <p>
                          {[
                            selectedOrder.deliveryAddress.city,
                            selectedOrder.deliveryAddress.district,
                            selectedOrder.deliveryAddress.state,
                            selectedOrder.deliveryAddress.pincode
                          ].filter(Boolean).join(', ')}
                        </p>
                        {selectedOrder.deliveryAddress.country && (
                          <p>{selectedOrder.deliveryAddress.country}</p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex items-center space-x-3 pt-4 border-t border-gray-200">
                    {selectedOrder.status === 'pending' || selectedOrder.status === 'confirmed' ? (
                      <button 
                        className="flex-1 px-4 py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors"
                        onClick={() => {
                          markAsInProgress(selectedOrder._id);
                          setShowDetailsModal(false);
                        }}
                      >
                        Start Working on This Order
                      </button>
                    ) : null}
                    
                    {(selectedOrder.status === 'in-progress' || selectedOrder.status === 'ready_for_fitting') && (
                      <button 
                        className="flex-1 px-4 py-3 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition-colors flex items-center justify-center space-x-2"
                        onClick={() => {
                          markAsCompleted(selectedOrder._id);
                          setShowDetailsModal(false);
                        }}
                      >
                        <FiCheckCircle className="w-5 h-5" />
                        <span>Mark as Completed</span>
                      </button>
                    )}
                    
                    <button 
                      className="px-4 py-3 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                      onClick={() => setShowDetailsModal(false)}
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default ActiveOrders; 