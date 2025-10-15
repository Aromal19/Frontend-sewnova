import React, { useState, useEffect } from "react";
import Sidebar from "../../components/Sidebar";
import SimpleChart from "../../components/charts/SimpleChart";
import { 
  FiTrendingUp, 
  FiTrendingDown, 
  FiUsers, 
  FiPackage,
  FiDollarSign,
  FiShoppingBag,
  FiScissors,
  FiPlus,
  FiFilter,
  FiSearch,
  FiDownload,
  FiEye,
  FiEdit,
  FiTrash2,
  FiClock,
  FiCalendar,
  FiCheckCircle,
  FiAlertCircle,
  FiMapPin,
  FiPhone,
  FiMail,
  FiLogOut,
  FiSettings,
  FiBarChart,
  FiGrid,
  FiUserPlus,
  FiUserMinus,
  FiLoader
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { isAuthenticated, logout } from "../../utils/api";
import { adminService, fetchUsersFromServices } from "../../services/adminService";

const AdminDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [timeRange, setTimeRange] = useState("30d");
  
  // Data states
  const [analytics, setAnalytics] = useState(null);
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // User management states
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(10);

  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is authenticated and has admin role
    if (!isAuthenticated()) {
      navigate("/login", { replace: true });
    } else {
      loadDashboardData();
    }
  }, [navigate]);

  useEffect(() => {
    filterUsers();
  }, [users, searchTerm, selectedRole]);

  const loadDashboardData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Load analytics data
      const analyticsData = await adminService.getAnalytics(timeRange);
      setAnalytics(analyticsData.data);
      
      // Load users data
      const usersData = await fetchUsersFromServices();
      if (usersData.success) {
        setUsers(usersData.data.users);
      } else {
        // Fallback to admin service if direct service calls fail
        const adminUsersData = await adminService.getAllUsers({
          page: 1,
          limit: 100
        });
        if (adminUsersData.success) {
          setUsers(adminUsersData.data.users);
        }
      }
    } catch (err) {
      console.error('Error loading dashboard data:', err);
      setError('Failed to load dashboard data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const filterUsers = () => {
    let filtered = users;
    
    if (searchTerm) {
      filtered = filtered.filter(user => 
        user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.firstname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.lastname?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (selectedRole) {
      filtered = filtered.filter(user => user.role === selectedRole);
    }
    
    setFilteredUsers(filtered);
  };

  const handleUserAction = async (action, userId, data = null) => {
    setLoading(true);
    try {
      switch (action) {
        case 'updateStatus':
          await adminService.updateUserStatus(userId, data.status);
          // Update local state
          setUsers(prev => prev.map(user => 
            user.id === userId ? { ...user, status: data.status } : user
          ));
          break;
        case 'delete':
          await adminService.deleteUser(userId);
          // Remove from local state
          setUsers(prev => prev.filter(user => user.id !== userId));
          break;
        default:
          break;
      }
    } catch (err) {
      console.error(`Error performing ${action}:`, err);
      setError(`Failed to ${action} user. Please try again.`);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    logout();
    navigate("/login", { replace: true });
  };

  // Get stats from analytics data or use defaults
  const getStats = () => {
    if (!analytics) {
      return [
        {
          title: "Total Users",
          value: "0",
          change: "0%",
          trend: "up",
          icon: FiUsers,
          color: "from-coralblush to-pink-500"
        },
        {
          title: "Total Orders",
          value: "0",
          change: "0%",
          trend: "up",
          icon: FiPackage,
          color: "from-lilac to-purple-500"
        },
        {
          title: "Total Revenue",
          value: "₹0",
          change: "0%",
          trend: "up",
          icon: FiDollarSign,
          color: "from-champagne to-yellow-500"
        },
        {
          title: "Active Tailors",
          value: "0",
          change: "0",
          trend: "up",
          icon: FiScissors,
          color: "from-mint to-green-500"
        },
        {
          title: "Active Sellers",
          value: "0",
          change: "0",
          trend: "up",
          icon: FiShoppingBag,
          color: "from-blue-500 to-indigo-500"
        },
        {
          title: "Pending Orders",
          value: "0",
          change: "0%",
          trend: "down",
          icon: FiClock,
          color: "from-purple-500 to-pink-500"
        }
      ];
    }

    const overview = analytics.overview || {};
    return [
      {
        title: "Total Users",
        value: overview.totalUsers?.toLocaleString() || "0",
        change: "+12.5%",
        trend: "up",
        icon: FiUsers,
        color: "from-coralblush to-pink-500"
      },
      {
        title: "Total Orders",
        value: overview.totalOrders?.toLocaleString() || "0",
        change: "+8.2%",
        trend: "up",
        icon: FiPackage,
        color: "from-lilac to-purple-500"
      },
      {
        title: "Total Revenue",
        value: `₹${overview.totalRevenue?.toLocaleString() || "0"}`,
        change: "+15.3%",
        trend: "up",
        icon: FiDollarSign,
        color: "from-champagne to-yellow-500"
      },
      {
        title: "Active Tailors",
        value: overview.activeTailors?.toString() || "0",
        change: "+3",
        trend: "up",
        icon: FiScissors,
        color: "from-mint to-green-500"
      },
      {
        title: "Active Sellers",
        value: overview.activeSellers?.toString() || "0",
        change: "+2",
        trend: "up",
        icon: FiShoppingBag,
        color: "from-blue-500 to-indigo-500"
      },
      {
        title: "Pending Orders",
        value: overview.pendingOrders?.toString() || "0",
        change: "-5.2%",
        trend: "down",
        icon: FiClock,
        color: "from-purple-500 to-pink-500"
      }
    ];
  };

  const stats = getStats();

  // Get recent users from filtered data
  const getRecentUsers = () => {
    return filteredUsers
      .sort((a, b) => new Date(b.joinDate || b.createdAt) - new Date(a.joinDate || a.createdAt))
      .slice(0, 3)
      .map(user => ({
        id: user.id || user._id,
        name: user.name || `${user.firstname || ''} ${user.lastname || ''}`.trim() || 'Unknown',
        email: user.email,
        role: user.role,
        status: user.status || 'active',
        joinDate: user.joinDate || user.createdAt,
        lastActive: user.lastActive || user.lastLogin || 'Unknown'
      }));
  };

  const recentUsers = getRecentUsers();

  // Recent orders will be fetched from order service in future implementation
  const recentOrders = [];

  const getStatusColor = (status) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-800";
      case "inactive": return "bg-gray-100 text-gray-800";
      case "suspended": return "bg-red-100 text-red-800";
      case "completed": return "bg-green-100 text-green-800";
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "in-progress": return "bg-blue-100 text-blue-800";
      case "cancelled": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case "customer": return "bg-blue-100 text-blue-800";
      case "tailor": return "bg-purple-100 text-purple-800";
      case "seller": return "bg-green-100 text-green-800";
      case "admin": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      <Sidebar 
        isOpen={sidebarOpen} 
        setIsOpen={setSidebarOpen} 
        userRole="admin" 
      />
      
      <main className={`flex-1 transition-all duration-500 ease-in-out ${
        sidebarOpen ? 'ml-0' : 'ml-0'
      }`}>
        <div className="p-6">
          {/* Header */}
          <header className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold text-charcoal">Admin Dashboard</h1>
                <p className="text-gray-600 mt-2">Welcome back! Monitor your platform, manage users, and track performance.</p>
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
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
                  { id: "designs", label: "Designs" },
                  { id: "analytics", label: "Analytics" },
                  { id: "settings", label: "Settings" }
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
                {/* Revenue Chart */}
                <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-charcoal">Revenue Trend</h3>
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
                      data={analytics?.revenue?.data || [15000, 18000, 22000, 25000, 20000, 25000]}
                      labels={analytics?.revenue?.labels || ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']}
                      height={200}
                      color="#F26A8D"
                      title=""
                    />
                  </div>
                </div>

                {/* User Growth Chart */}
                <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-charcoal">User Growth</h3>
                    <div className="flex items-center space-x-2">
                      <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                        <FiFilter className="w-4 h-4 text-gray-600" />
                      </button>
                    </div>
                  </div>
                  <div className="h-64 bg-gradient-to-br from-lilac/5 to-champagne/5 rounded-lg p-4">
                    <SimpleChart
                      type="bar"
                      data={analytics?.userGrowth?.data || [120, 145, 168, 195]}
                      labels={analytics?.userGrowth?.labels || ['Week 1', 'Week 2', 'Week 3', 'Week 4']}
                      height={200}
                      color="#CDB4DB"
                      title=""
                    />
                  </div>
                </div>
              </div>

              {/* Recent Users & Orders */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Users */}
                <div className="bg-white rounded-xl shadow-lg border border-gray-100">
                  <div className="p-6 border-b border-gray-100">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-charcoal">Recent Users</h3>
                      <button className="text-coralblush hover:text-pink-500 text-sm font-medium">
                        View All
                      </button>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="space-y-4">
                      {recentUsers.map((user, index) => (
                        <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <div className="flex items-center space-x-4">
                            <div className="w-10 h-10 bg-gradient-to-r from-coralblush to-pink-500 rounded-lg flex items-center justify-center">
                              <FiUsers className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <p className="font-medium text-charcoal">{user.name}</p>
                              <p className="text-sm text-gray-600">{user.email}</p>
                              <p className="text-xs text-gray-500">Joined {user.joinDate}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                              {user.role}
                            </span>
                            <p className="text-xs text-gray-500 mt-1">{user.lastActive}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

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
                            <div className="w-10 h-10 bg-gradient-to-r from-champagne to-yellow-500 rounded-lg flex items-center justify-center">
                              <FiPackage className="w-5 h-5 text-charcoal" />
                            </div>
                            <div>
                              <p className="font-medium text-charcoal">{order.id}</p>
                              <p className="text-sm text-gray-600">{order.customer}</p>
                              <p className="text-xs text-gray-500">{order.date}</p>
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
              </div>
            </div>
          )}


          {activeTab === "designs" && (
            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-lg border border-gray-100">
                <div className="p-6 border-b border-gray-100">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-charcoal">Design Management</h3>
                    <button className="px-4 py-2 bg-gradient-to-r from-coralblush to-pink-500 text-white rounded-lg font-medium hover:from-pink-500 hover:to-coralblush transition-all duration-300 flex items-center space-x-2">
                      <FiPlus className="w-4 h-4" />
                      <span>Add Design</span>
                    </button>
                  </div>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Mock design cards */}
                    {[1, 2, 3, 4, 5, 6].map((design) => (
                      <div key={design} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                        <div className="w-full h-32 bg-gradient-to-br from-coralblush/20 to-lilac/20 rounded-lg mb-3"></div>
                        <h4 className="font-medium text-charcoal mb-2">Design {design}</h4>
                        <p className="text-sm text-gray-600 mb-3">Beautiful design description</p>
                        <div className="flex items-center justify-between">
                          <span className="text-lg font-bold text-charcoal">₹{500 + design * 100}</span>
                          <div className="flex space-x-2">
                            <button className="p-1 hover:bg-gray-200 rounded transition-colors">
                              <FiEdit className="w-4 h-4 text-gray-600" />
                            </button>
                            <button className="p-1 hover:bg-gray-200 rounded transition-colors">
                              <FiTrash2 className="w-4 h-4 text-red-600" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "analytics" && (
            <div className="space-y-6">
              {/* Loading State */}
              {loading && (
                <div className="text-center py-8">
                  <FiLoader className="w-8 h-8 text-coralblush animate-spin mx-auto mb-4" />
                  <p className="text-gray-600">Loading analytics...</p>
                </div>
              )}

              {/* Error State */}
              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
                  {error}
                </div>
              )}

              {/* Analytics Content */}
              {!loading && analytics && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
                    <h3 className="text-lg font-semibold text-charcoal mb-4">Order Status Distribution</h3>
                    <div className="h-64 bg-gradient-to-br from-mint/5 to-green-500/5 rounded-lg p-4">
                      <SimpleChart
                        type="pie"
                        data={[
                          analytics.orderStatus?.completed || 0,
                          analytics.orderStatus?.pending || 0,
                          analytics.orderStatus?.inProgress || 0,
                          analytics.orderStatus?.cancelled || 0
                        ]}
                        labels={['Completed', 'Pending', 'In Progress', 'Cancelled']}
                        height={200}
                        color="#EDFDF6"
                        title=""
                      />
                    </div>
                  </div>
                  <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
                    <h3 className="text-lg font-semibold text-charcoal mb-4">User Activity</h3>
                    <div className="h-64 bg-gradient-to-br from-champagne/5 to-yellow-500/5 rounded-lg p-4">
                      <SimpleChart
                        type="bar"
                        data={analytics.orders?.data || [120, 135, 110, 145, 130, 95, 80]}
                        labels={analytics.orders?.labels || ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']}
                        height={200}
                        color="#F6E7D7"
                        title=""
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Top Performers */}
              {!loading && analytics && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
                    <h3 className="text-lg font-semibold text-charcoal mb-4">Top Tailors</h3>
                    <div className="space-y-3">
                      {analytics.topTailors?.map((tailor, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div>
                            <p className="font-medium text-charcoal">{tailor.name}</p>
                            <p className="text-sm text-gray-600">{tailor.orders} orders • Rating: {tailor.rating}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium text-charcoal">₹{tailor.revenue?.toLocaleString()}</p>
                            <p className="text-sm text-gray-600">Revenue</p>
                          </div>
                        </div>
                      )) || (
                        <p className="text-gray-500 text-center py-4">No tailor data available</p>
                      )}
                    </div>
                  </div>
                  <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
                    <h3 className="text-lg font-semibold text-charcoal mb-4">Top Sellers</h3>
                    <div className="space-y-3">
                      {analytics.topSellers?.map((seller, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div>
                            <p className="font-medium text-charcoal">{seller.name}</p>
                            <p className="text-sm text-gray-600">{seller.products} products • {seller.sales} sales</p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium text-charcoal">₹{seller.revenue?.toLocaleString()}</p>
                            <p className="text-sm text-gray-600">Revenue</p>
                          </div>
                        </div>
                      )) || (
                        <p className="text-gray-500 text-center py-4">No seller data available</p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === "settings" && (
            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-lg border border-gray-100">
                <div className="p-6 border-b border-gray-100">
                  <h3 className="text-lg font-semibold text-charcoal">System Settings</h3>
                </div>
                <div className="p-6">
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Platform Name</label>
                      <input
                        type="text"
                        defaultValue="SewNova"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-coralblush focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Admin Email</label>
                      <input
                        type="email"
                        defaultValue="admin@gmail.com"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-coralblush focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Platform Description</label>
                      <textarea
                        rows={3}
                        defaultValue="Your one-stop platform for custom tailoring and fashion design"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-coralblush focus:border-transparent"
                      />
                    </div>
                    <button className="px-6 py-3 bg-gradient-to-r from-coralblush to-pink-500 text-white rounded-lg font-medium hover:from-pink-500 hover:to-coralblush transition-all duration-300">
                      Save Settings
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

export default AdminDashboard; 