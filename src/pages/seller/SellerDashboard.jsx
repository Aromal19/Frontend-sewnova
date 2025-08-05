import React, { useState, useEffect } from "react";
import Sidebar from "../../components/Sidebar";
import SellerOrdersTable from "../../components/seller/SellerOrdersTable";
import SellerStatsWidget from "../../components/seller/SellerStatsWidget";
import SellerProfileCard from "../../components/seller/SellerProfileCard";
import SellerProductsTable from "../../components/seller/SellerProductsTable";
import SimpleChart from "../../components/charts/SimpleChart";
import { 
  FiTrendingUp, 
  FiTrendingDown, 
  FiPackage, 
  FiDollarSign, 
  FiUsers, 
  FiStar,
  FiPlus,
  FiFilter,
  FiSearch,
  FiDownload,
  FiEye,
  FiEdit,
  FiTrash2
} from "react-icons/fi";

const SellerDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [timeRange, setTimeRange] = useState("7d");

  // Mock data for charts and analytics
  const salesData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [{
      label: 'Sales',
      data: [1200, 1900, 3000, 5000, 2000, 3000],
      borderColor: '#F26A8D',
      backgroundColor: 'rgba(242, 106, 141, 0.1)',
      tension: 0.4
    }]
  };

  const ordersData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [{
      label: 'Orders',
      data: [12, 19, 3, 5, 2, 3, 8],
      backgroundColor: '#CDB4DB',
      borderColor: '#CDB4DB',
      borderWidth: 1
    }]
  };

  const revenueData = {
    labels: ['Fabric A', 'Fabric B', 'Fabric C', 'Fabric D'],
    datasets: [{
      data: [300, 50, 100, 200],
      backgroundColor: ['#F26A8D', '#CDB4DB', '#F6E7D7', '#EDFDF6'],
      borderWidth: 0
    }]
  };

  const stats = [
    {
      title: "Total Revenue",
      value: "$12,450",
      change: "+12.5%",
      trend: "up",
      icon: FiDollarSign,
      color: "from-coralblush to-pink-500"
    },
    {
      title: "Total Orders",
      value: "156",
      change: "+8.2%",
      trend: "up",
      icon: FiPackage,
      color: "from-lilac to-purple-500"
    },
    {
      title: "Active Customers",
      value: "89",
      change: "+15.3%",
      trend: "up",
      icon: FiUsers,
      color: "from-champagne to-yellow-500"
    },
    {
      title: "Average Rating",
      value: "4.8",
      change: "+0.2",
      trend: "up",
      icon: FiStar,
      color: "from-mint to-green-500"
    }
  ];

  const recentOrders = [
    {
      id: "#ORD-001",
      customer: "Sarah Johnson",
      product: "Silk Fabric",
      amount: "$450",
      status: "completed",
      date: "2024-01-15"
    },
    {
      id: "#ORD-002",
      customer: "Mike Chen",
      product: "Cotton Blend",
      amount: "$320",
      status: "processing",
      date: "2024-01-14"
    },
    {
      id: "#ORD-003",
      customer: "Emma Davis",
      product: "Wool Fabric",
      amount: "$280",
      status: "shipped",
      date: "2024-01-13"
    },
    {
      id: "#ORD-004",
      customer: "Alex Wilson",
      product: "Linen Fabric",
      amount: "$190",
      status: "pending",
      date: "2024-01-12"
    }
  ];

  const topProducts = [
    {
      name: "Premium Silk Fabric",
      sales: 45,
      revenue: "$2,250",
      growth: "+12%"
    },
    {
      name: "Cotton Blend Fabric",
      sales: 38,
      revenue: "$1,900",
      growth: "+8%"
    },
    {
      name: "Wool Blend Fabric",
      sales: 32,
      revenue: "$1,600",
      growth: "+15%"
    },
    {
      name: "Linen Fabric",
      sales: 28,
      revenue: "$1,400",
      growth: "+5%"
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "completed": return "bg-green-100 text-green-800";
      case "processing": return "bg-blue-100 text-blue-800";
      case "shipped": return "bg-purple-100 text-purple-800";
      case "pending": return "bg-yellow-100 text-yellow-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      <Sidebar 
        isOpen={sidebarOpen} 
        setIsOpen={setSidebarOpen} 
        userRole="seller" 
      />
      
      <main className={`flex-1 transition-all duration-500 ease-in-out ${
        sidebarOpen ? 'ml-0' : 'ml-0'
      }`}>
        <div className="p-6">
          {/* Header */}
          <header className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold text-charcoal">Seller Dashboard</h1>
                <p className="text-gray-600 mt-2">Welcome back! Here's what's happening with your business today.</p>
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
                  <span>Add Product</span>
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
                  { id: "products", label: "Products" },
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
                {/* Sales Chart */}
                <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-charcoal">Sales Trend</h3>
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
                      data={[1200, 1900, 3000, 5000, 2000, 3000]}
                      labels={['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']}
                      height={200}
                      color="#F26A8D"
                      title=""
                    />
                  </div>
                </div>

                {/* Orders Chart */}
                <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-charcoal">Weekly Orders</h3>
                    <div className="flex items-center space-x-2">
                      <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                        <FiFilter className="w-4 h-4 text-gray-600" />
                      </button>
                    </div>
                  </div>
                  <div className="h-64 bg-gradient-to-br from-lilac/5 to-champagne/5 rounded-lg p-4">
                    <SimpleChart
                      type="bar"
                      data={[12, 19, 3, 5, 2, 3, 8]}
                      labels={['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']}
                      height={200}
                      color="#CDB4DB"
                      title=""
                    />
                  </div>
                </div>
              </div>

              {/* Recent Orders & Top Products */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Orders */}
                <div className="bg-white rounded-xl shadow-lg border border-gray-100">
                  <div className="p-6 border-b border-gray-100">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-charcoal">Recent Orders</h3>
                      <button className="text-coralblush hover:text-pink-500 text-sm font-medium">
                        View All
                      </button>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="space-y-4">
                      {recentOrders.map((order, index) => (
                        <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <div className="flex items-center space-x-4">
                            <div className="w-10 h-10 bg-gradient-to-r from-coralblush to-pink-500 rounded-lg flex items-center justify-center">
                              <FiPackage className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <p className="font-medium text-charcoal">{order.id}</p>
                              <p className="text-sm text-gray-600">{order.customer}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-medium text-charcoal">{order.amount}</p>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                              {order.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Top Products */}
                <div className="bg-white rounded-xl shadow-lg border border-gray-100">
                  <div className="p-6 border-b border-gray-100">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-charcoal">Top Products</h3>
                      <button className="text-coralblush hover:text-pink-500 text-sm font-medium">
                        View All
                      </button>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="space-y-4">
                      {topProducts.map((product, index) => (
                        <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <div className="flex items-center space-x-4">
                            <div className="w-10 h-10 bg-gradient-to-r from-champagne to-yellow-500 rounded-lg flex items-center justify-center">
                              <span className="text-charcoal font-bold text-sm">{index + 1}</span>
                            </div>
                            <div>
                              <p className="font-medium text-charcoal">{product.name}</p>
                              <p className="text-sm text-gray-600">{product.sales} sales</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-medium text-charcoal">{product.revenue}</p>
                            <p className="text-sm text-green-600">{product.growth}</p>
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
                    <button className="px-4 py-2 bg-gradient-to-r from-coralblush to-pink-500 text-white rounded-lg font-medium hover:from-pink-500 hover:to-coralblush transition-all duration-300">
                      Export
                    </button>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <SellerOrdersTable />
              </div>
            </div>
          )}

          {activeTab === "products" && (
            <div className="bg-white rounded-xl shadow-lg border border-gray-100">
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-charcoal">Product Management</h3>
                  <button className="px-4 py-2 bg-gradient-to-r from-coralblush to-pink-500 text-white rounded-lg font-medium hover:from-pink-500 hover:to-coralblush transition-all duration-300 flex items-center space-x-2">
                    <FiPlus className="w-4 h-4" />
                    <span>Add New Product</span>
                  </button>
                </div>
              </div>
              <div className="p-6">
                <SellerProductsTable />
              </div>
            </div>
          )}

          {activeTab === "analytics" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
                  <h3 className="text-lg font-semibold text-charcoal mb-4">Revenue Distribution</h3>
                  <div className="h-64 bg-gradient-to-br from-mint/5 to-green-500/5 rounded-lg p-4">
                    <SimpleChart
                      type="pie"
                      data={[300, 50, 100, 200]}
                      labels={['Fabric A', 'Fabric B', 'Fabric C', 'Fabric D']}
                      height={200}
                      color="#EDFDF6"
                      title=""
                    />
                  </div>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
                  <h3 className="text-lg font-semibold text-charcoal mb-4">Customer Analytics</h3>
                  <div className="h-64 bg-gradient-to-br from-champagne/5 to-yellow-500/5 rounded-lg p-4">
                    <SimpleChart
                      type="bar"
                      data={[25, 30, 15, 20, 10]}
                      labels={['New', 'Returning', 'VIP', 'Regular', 'Inactive']}
                      height={200}
                      color="#F6E7D7"
                      title=""
                    />
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

export default SellerDashboard; 