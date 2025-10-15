import React, { useState } from "react";
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
  FiTrendingDown
} from "react-icons/fi";

const ActiveOrders = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedPriority, setSelectedPriority] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const activeOrders = [
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

  const updateProgress = (orderId, newProgress) => {
    // This would typically update the backend
    console.log(`Updating progress for ${orderId} to ${newProgress}%`);
  };

  const markAsCompleted = (orderId) => {
    // This would typically update the backend
    console.log(`Marking ${orderId} as completed`);
  };

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
                  </div>

                  {/* Notes */}
                  {order.notes && (
                    <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-700">{order.notes}</p>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center space-x-2">
                    <button 
                      className="flex-1 px-3 py-2 bg-coralblush text-white rounded-lg text-sm font-medium hover:bg-pink-500 transition-colors"
                      onClick={() => updateProgress(order.id, order.progress + 10)}
                    >
                      Update Progress
                    </button>
                    <button 
                      className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
                      title="View Details"
                    >
                      <FiEye className="w-4 h-4" />
                    </button>
                    <button 
                      className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-colors"
                      title="Mark Complete"
                      onClick={() => markAsCompleted(order.id)}
                    >
                      <FiCheckCircle className="w-4 h-4" />
                    </button>
                    <button 
                      className="p-2 bg-purple-100 text-purple-600 rounded-lg hover:bg-purple-200 transition-colors"
                      title="Contact Customer"
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
        </div>
      </main>
    </div>
  );
};

export default ActiveOrders; 