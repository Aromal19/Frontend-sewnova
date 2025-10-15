import React, { useState, useEffect } from "react";
import Sidebar from "../../components/Sidebar";
import TailorProfileCard from "../../components/tailor/TailorProfileCard";
import SimpleChart from "../../components/charts/SimpleChart";
import { 
  FiTrendingUp, 
  FiTrendingDown, 
  FiPackage, 
  FiUsers, 
  FiStar,
  FiPlus,
  FiFilter,
  FiSearch,
  FiDownload,
  FiEye,
  FiEdit,
  FiTrash2,
  FiClock,
  FiCalendar,
  FiScissors,
  FiCheckCircle,
  FiAlertCircle,
  FiMapPin,
  FiPhone,
  FiMail,
  FiLogOut
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { isAuthenticated, logout } from "../../utils/api";

const TailorDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [timeRange, setTimeRange] = useState("7d");

  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate("/login", { replace: true });
    }
  }, [navigate]);

  const handleLogout = async () => {
    await logout();
    navigate("/", { replace: true });
  };

  // Mock data for charts and analytics
  const workloadData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [{
      label: 'Orders',
      data: [8, 12, 15, 10, 18, 22, 16],
      borderColor: '#F26A8D',
      backgroundColor: 'rgba(242, 106, 141, 0.1)',
      tension: 0.4
    }]
  };

  const earningsData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [{
      label: 'Earnings',
      data: [1200, 1900, 3000, 5000, 2000, 3000],
      backgroundColor: '#CDB4DB',
      borderColor: '#CDB4DB',
      borderWidth: 1
    }]
  };

  const orderStatusData = {
    labels: ['Completed', 'In Progress', 'Pending', 'Cancelled'],
    datasets: [{
      data: [45, 25, 20, 10],
      backgroundColor: ['#F26A8D', '#CDB4DB', '#F6E7D7', '#EDFDF6'],
      borderWidth: 0
    }]
  };

  const stats = [
    {
      title: "Total Earnings",
      value: "₹8,450",
      change: "+15.2%",
      trend: "up",
      icon: FiTrendingUp,
      color: "from-coralblush to-pink-500"
    },
    {
      title: "Active Orders",
      value: "24",
      change: "+8.5%",
      trend: "up",
      icon: FiPackage,
      color: "from-lilac to-purple-500"
    },
    {
      title: "Completed Orders",
      value: "156",
      change: "+12.3%",
      trend: "up",
      icon: FiCheckCircle,
      color: "from-champagne to-yellow-500"
    },
    {
      title: "Average Rating",
      value: "4.9",
      change: "+0.3",
      trend: "up",
      icon: FiStar,
      color: "from-mint to-green-500"
    }
  ];

  const currentOrders = [
    {
      id: "#ORD-001",
      customer: "Sarah Johnson",
      service: "Wedding Dress Alteration",
      amount: "₹450",
      status: "in-progress",
      deadline: "2024-01-20",
      priority: "high"
    },
    {
      id: "#ORD-002",
      customer: "Mike Chen",
      service: "Suit Fitting",
      amount: "₹320",
      status: "pending",
      deadline: "2024-01-22",
      priority: "medium"
    },
    {
      id: "#ORD-003",
      customer: "Emma Davis",
      service: "Dress Hemming",
      amount: "₹180",
      status: "completed",
      deadline: "2024-01-18",
      priority: "low"
    },
    {
      id: "#ORD-004",
      customer: "Alex Wilson",
      service: "Blouse Alteration",
      amount: "₹120",
      status: "in-progress",
      deadline: "2024-01-25",
      priority: "medium"
    }
  ];

  const upcomingAppointments = [
    {
      id: 1,
      customer: "Sarah Johnson",
      service: "Wedding Dress Fitting",
      date: "2024-01-20",
      time: "10:00 AM",
      duration: "1 hour"
    },
    {
      id: 2,
      customer: "Mike Chen",
      service: "Suit Measurement",
      date: "2024-01-22",
      time: "2:00 PM",
      duration: "45 min"
    },
    {
      id: 3,
      customer: "Emma Davis",
      service: "Final Fitting",
      date: "2024-01-24",
      time: "11:30 AM",
      duration: "30 min"
    }
  ];

  const recentCompleted = [
    {
      id: "#ORD-005",
      customer: "Lisa Brown",
      service: "Dress Alteration",
      amount: "₹280",
      completedDate: "2024-01-15",
      rating: 5
    },
    {
      id: "#ORD-006",
      customer: "John Smith",
      service: "Suit Tailoring",
      amount: "₹350",
      completedDate: "2024-01-14",
      rating: 5
    },
    {
      id: "#ORD-007",
      customer: "Maria Garcia",
      service: "Blouse Fitting",
      amount: "₹150",
      completedDate: "2024-01-13",
      rating: 4
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
                <h1 className="text-3xl font-bold text-charcoal">Tailor Dashboard</h1>
                <p className="text-gray-600 mt-2">Welcome back! Manage your orders, appointments, and track your performance.</p>
              </div>
              <div className="flex items-center space-x-4">
                <select 
                  value={timeRange} 
                  onChange={(e) => setTimeRange(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-coralblush focus:border-transparent"
                >
                  <option value="7d">Last 7 days</option>
                  <option value="30d">Last 30 days</option>
                  <option value="90d">Last 90 days</option>
                  <option value="1y">Last year</option>
                </select>
                <button className="px-6 py-3 bg-gradient-to-r from-coralblush to-pink-500 text-white rounded-lg font-semibold hover:from-pink-500 hover:to-coralblush transition-all duration-300 shadow-lg flex items-center space-x-2">
                  <FiPlus className="w-4 h-4" />
                  <span>New Order</span>
                </button>
                {/* Logout button */}
                <button
                  onClick={handleLogout}
                  className="flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700 font-medium transition-all duration-200"
                  title="Logout"
                >
                  <FiLogOut className="mr-2" />
                  Logout
                </button>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {stats.map((stat, index) => (
                <div key={index} className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm font-medium">{stat.title}</p>
                      <p className="text-2xl font-bold text-charcoal mt-1">{stat.value}</p>
                      <div className="flex items-center mt-2">
                        {stat.trend === "up" ? (
                          <FiTrendingUp className="w-4 h-4 text-green-500 mr-1" />
                        ) : (
                          <FiTrendingDown className="w-4 h-4 text-red-500 mr-1" />
                        )}
                        <span className={`text-sm font-medium ${
                          stat.trend === "up" ? "text-green-600" : "text-red-600"
                        }`}>
                          {stat.change}
                        </span>
                        <span className="text-gray-500 text-sm ml-1">vs last month</span>
                      </div>
                    </div>
                    <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-lg flex items-center justify-center`}>
                      <stat.icon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </header>

          {/* Tabs */}
          <div className="mb-6">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8">
                {[
                  { id: "overview", label: "Overview" },
                  { id: "orders", label: "Orders" },
                  { id: "appointments", label: "Appointments" },
                  { id: "schedule", label: "Schedule" },
                  { id: "analytics", label: "Analytics" }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-2 px-1 border-b-2 font-medium text-sm ${
                      activeTab === tab.id
                        ? "border-coralblush text-coralblush"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Tab Content */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              {/* Charts Row */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Workload Chart */}
                <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-charcoal">Weekly Workload</h3>
                    <div className="flex items-center space-x-2">
                      <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                        <FiDownload className="w-4 h-4 text-gray-600" />
                      </button>
                      <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                        <FiEye className="w-4 h-4 text-gray-600" />
                      </button>
                    </div>
                  </div>
                  <div className="h-64 bg-gradient-to-br from-coralblush/5 to-lilac/5 rounded-lg p-4">
                    <SimpleChart
                      type="line"
                      data={[8, 12, 15, 10, 18, 22, 16]}
                      labels={['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']}
                      height={200}
                      color="#F26A8D"
                      title=""
                    />
                  </div>
                </div>

                {/* Earnings Chart */}
                <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-charcoal">Monthly Earnings</h3>
                    <div className="flex items-center space-x-2">
                      <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                        <FiFilter className="w-4 h-4 text-gray-600" />
                      </button>
                    </div>
                  </div>
                  <div className="h-64 bg-gradient-to-br from-lilac/5 to-champagne/5 rounded-lg p-4">
                    <SimpleChart
                      type="bar"
                      data={[1200, 1900, 3000, 5000, 2000, 3000]}
                      labels={['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']}
                      height={200}
                      color="#CDB4DB"
                      title=""
                    />
                  </div>
                </div>
              </div>

              {/* Current Orders & Appointments */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Current Orders */}
                <div className="bg-white rounded-xl shadow-lg border border-gray-100">
                  <div className="p-6 border-b border-gray-100">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-charcoal">Current Orders</h3>
                      <button className="text-coralblush hover:text-pink-500 text-sm font-medium">
                        View All
                      </button>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="space-y-4">
                      {currentOrders.map((order, index) => (
                        <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <div className="flex items-center space-x-4">
                            <div className="w-10 h-10 bg-gradient-to-r from-coralblush to-pink-500 rounded-lg flex items-center justify-center">
                              <FiPackage className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <p className="font-medium text-charcoal">{order.id}</p>
                              <p className="text-sm text-gray-600">{order.customer}</p>
                              <p className="text-xs text-gray-500">{order.service}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-medium text-charcoal">{order.amount}</p>
                            <div className="flex items-center space-x-2 mt-1">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                                {order.status}
                              </span>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(order.priority)}`}>
                                {order.priority}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Upcoming Appointments */}
                <div className="bg-white rounded-xl shadow-lg border border-gray-100">
                  <div className="p-6 border-b border-gray-100">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-charcoal">Upcoming Appointments</h3>
                      <button className="text-coralblush hover:text-pink-500 text-sm font-medium">
                        View All
                      </button>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="space-y-4">
                      {upcomingAppointments.map((appointment, index) => (
                        <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <div className="flex items-center space-x-4">
                            <div className="w-10 h-10 bg-gradient-to-r from-champagne to-yellow-500 rounded-lg flex items-center justify-center">
                              <FiCalendar className="w-5 h-5 text-charcoal" />
                            </div>
                            <div>
                              <p className="font-medium text-charcoal">{appointment.customer}</p>
                              <p className="text-sm text-gray-600">{appointment.service}</p>
                              <p className="text-xs text-gray-500">{appointment.date} at {appointment.time}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-gray-600">{appointment.duration}</p>
                            <div className="flex items-center mt-1">
                              <FiClock className="w-3 h-3 text-gray-400 mr-1" />
                              <span className="text-xs text-gray-500">Upcoming</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "orders" && (
            <div className="bg-white rounded-xl shadow-lg border border-gray-100">
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-charcoal">All Orders</h3>
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type="text"
                        placeholder="Search orders..."
                        className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-coralblush focus:border-transparent"
                      />
                    </div>
                    <select className="px-4 py-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-coralblush focus:border-transparent">
                      <option value="">All Status</option>
                      <option value="pending">Pending</option>
                      <option value="in-progress">In Progress</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                    <button className="px-4 py-2 bg-gradient-to-r from-coralblush to-pink-500 text-white rounded-lg font-medium hover:from-pink-500 hover:to-coralblush transition-all duration-300">
                      Export
                    </button>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 font-medium text-gray-700">Order ID</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">Customer</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">Service</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">Amount</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">Deadline</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentOrders.map((order, index) => (
                        <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-3 px-4 font-medium text-charcoal">{order.id}</td>
                          <td className="py-3 px-4 text-gray-700">{order.customer}</td>
                          <td className="py-3 px-4 text-gray-700">{order.service}</td>
                          <td className="py-3 px-4 font-medium text-charcoal">{order.amount}</td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                              {order.status}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-gray-700">{order.deadline}</td>
                          <td className="py-3 px-4">
                            <div className="flex items-center space-x-2">
                              <button className="p-1 hover:bg-gray-100 rounded transition-colors">
                                <FiEye className="w-4 h-4 text-gray-600" />
                              </button>
                              <button className="p-1 hover:bg-gray-100 rounded transition-colors">
                                <FiEdit className="w-4 h-4 text-gray-600" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === "appointments" && (
            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-lg border border-gray-100">
                <div className="p-6 border-b border-gray-100">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-charcoal">Appointment Management</h3>
                    <button className="px-4 py-2 bg-gradient-to-r from-coralblush to-pink-500 text-white rounded-lg font-medium hover:from-pink-500 hover:to-coralblush transition-all duration-300 flex items-center space-x-2">
                      <FiPlus className="w-4 h-4" />
                      <span>Schedule Appointment</span>
                    </button>
                  </div>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {upcomingAppointments.map((appointment, index) => (
                      <div key={index} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-medium text-charcoal">{appointment.customer}</h4>
                          <span className="text-xs bg-coralblush text-white px-2 py-1 rounded-full">
                            {appointment.duration}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{appointment.service}</p>
                        <div className="flex items-center text-sm text-gray-500 mb-3">
                          <FiCalendar className="w-4 h-4 mr-2" />
                          {appointment.date}
                        </div>
                        <div className="flex items-center text-sm text-gray-500 mb-4">
                          <FiClock className="w-4 h-4 mr-2" />
                          {appointment.time}
                        </div>
                        <div className="flex space-x-2">
                          <button className="flex-1 px-3 py-2 bg-coralblush text-white rounded-lg text-sm font-medium hover:bg-pink-500 transition-colors">
                            Confirm
                          </button>
                          <button className="flex-1 px-3 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-300 transition-colors">
                            Reschedule
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "schedule" && (
            <div className="bg-white rounded-xl shadow-lg border border-gray-100">
              <div className="p-6 border-b border-gray-100">
                <h3 className="text-lg font-semibold text-charcoal">Weekly Schedule</h3>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-7 gap-4">
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => (
                    <div key={index} className="text-center">
                      <div className="font-medium text-charcoal mb-2">{day}</div>
                      <div className="bg-gray-50 rounded-lg p-3 min-h-[120px]">
                        <div className="text-sm text-gray-600 mb-2">Jan {15 + index}</div>
                        {index === 0 && (
                          <div className="bg-coralblush text-white text-xs p-2 rounded mb-2">
                            Sarah Johnson<br/>10:00 AM
                          </div>
                        )}
                        {index === 2 && (
                          <div className="bg-lilac text-white text-xs p-2 rounded mb-2">
                            Mike Chen<br/>2:00 PM
                          </div>
                        )}
                        {index === 4 && (
                          <div className="bg-champagne text-charcoal text-xs p-2 rounded mb-2">
                            Emma Davis<br/>11:30 AM
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "analytics" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
                  <h3 className="text-lg font-semibold text-charcoal mb-4">Order Status Distribution</h3>
                  <div className="h-64 bg-gradient-to-br from-mint/5 to-green-500/5 rounded-lg p-4">
                    <SimpleChart
                      type="pie"
                      data={[45, 25, 20, 10]}
                      labels={['Completed', 'In Progress', 'Pending', 'Cancelled']}
                      height={200}
                      color="#EDFDF6"
                      title=""
                    />
                  </div>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
                  <h3 className="text-lg font-semibold text-charcoal mb-4">Customer Satisfaction</h3>
                  <div className="h-64 bg-gradient-to-br from-champagne/5 to-yellow-500/5 rounded-lg p-4">
                    <SimpleChart
                      type="bar"
                      data={[15, 25, 35, 20, 5]}
                      labels={['5★', '4★', '3★', '2★', '1★']}
                      height={200}
                      color="#F6E7D7"
                      title=""
                    />
                  </div>
                </div>
              </div>

              {/* Recent Completed Orders */}
              <div className="bg-white rounded-xl shadow-lg border border-gray-100">
                <div className="p-6 border-b border-gray-100">
                  <h3 className="text-lg font-semibold text-charcoal">Recently Completed Orders</h3>
                </div>
                <div className="p-6">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left py-3 px-4 font-medium text-gray-700">Order ID</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-700">Customer</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-700">Service</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-700">Amount</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-700">Completed Date</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-700">Rating</th>
                        </tr>
                      </thead>
                      <tbody>
                        {recentCompleted.map((order, index) => (
                          <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                            <td className="py-3 px-4 font-medium text-charcoal">{order.id}</td>
                            <td className="py-3 px-4 text-gray-700">{order.customer}</td>
                            <td className="py-3 px-4 text-gray-700">{order.service}</td>
                            <td className="py-3 px-4 font-medium text-charcoal">{order.amount}</td>
                            <td className="py-3 px-4 text-gray-700">{order.completedDate}</td>
                            <td className="py-3 px-4">
                              <div className="flex items-center">
                                {[...Array(5)].map((_, i) => (
                                  <FiStar
                                    key={i}
                                    className={`w-4 h-4 ${
                                      i < order.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                                    }`}
                                  />
                                ))}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
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

export default TailorDashboard; 