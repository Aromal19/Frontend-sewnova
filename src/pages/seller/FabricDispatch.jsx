import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import deliveryService from '../../services/deliveryService';
import { adminApiService } from '../../services/adminApiService';
import { getCurrentUser } from '../../utils/api';
import { FiPackage, FiTruck, FiCheckCircle, FiClock, FiFilter, FiSearch, FiEdit } from 'react-icons/fi';

const FabricDispatch = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);
  
  const [dispatchForm, setDispatchForm] = useState({
    status: 'pending',
    trackingNumber: '',
    courierName: '',
    estimatedDelivery: '',
    notes: ''
  });

  useEffect(() => {
    loadOrders();
  }, []);

  useEffect(() => {
    filterOrders();
  }, [orders, searchTerm, statusFilter]);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const user = getCurrentUser();
      const vendorId = user?._id || user?.id || user?.userId;

      // Get all orders that include fabric from this vendor
      const response = await adminApiService.getAllOrders({
        page: 1,
        limit: 100,
        sortBy: 'createdAt',
        sortOrder: 'desc'
      });

      if (response.success) {
        const allOrders = response.data.bookings || [];
        
        // Filter for fabric/complete orders from this vendor
        const vendorOrders = allOrders.filter(order => 
          (order.bookingType === 'fabric' || order.bookingType === 'complete') &&
          order.fabricDetails?.sellerId === vendorId
        );

        // Load delivery info for each order
        const ordersWithDelivery = await Promise.all(
          vendorOrders.map(async (order) => {
            try {
              const deliveryResp = await deliveryService.getDeliveryByBooking(order._id);
              return {
                ...order,
                delivery: deliveryResp.success ? deliveryResp.delivery : null
              };
            } catch (err) {
              return { ...order, delivery: null };
            }
          })
        );

        setOrders(ordersWithDelivery);
      }
    } catch (err) {
      console.error('Error loading orders:', err);
    } finally {
      setLoading(false);
    }
  };

  const filterOrders = () => {
    let filtered = orders;

    if (statusFilter !== 'all') {
      filtered = filtered.filter(order => 
        order.delivery?.vendorDispatch?.status === statusFilter
      );
    }

    if (searchTerm) {
      filtered = filtered.filter(order =>
        order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.fabricDetails?.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredOrders(filtered);
  };

  const openDispatchModal = (order) => {
    setSelectedOrder(order);
    const vendorDispatch = order.delivery?.vendorDispatch || {};
    setDispatchForm({
      status: vendorDispatch.status || 'pending',
      trackingNumber: vendorDispatch.trackingNumber || '',
      courierName: vendorDispatch.courierName || '',
      estimatedDelivery: vendorDispatch.estimatedDelivery 
        ? new Date(vendorDispatch.estimatedDelivery).toISOString().split('T')[0]
        : '',
      notes: vendorDispatch.notes || ''
    });
    setShowModal(true);
  };

  const handleDispatchUpdate = async (e) => {
    e.preventDefault();
    
    try {
      // Create delivery record if it doesn't exist
      if (!selectedOrder.delivery) {
        const createResp = await deliveryService.createDelivery(
          selectedOrder._id,
          selectedOrder.customerId._id || selectedOrder.customerId,
          selectedOrder.bookingType,
          selectedOrder.deliveryAddress
        );
        
        if (!createResp.success) {
          alert('Failed to create delivery record');
          return;
        }
        
        selectedOrder.delivery = createResp.delivery;
      }

      // Update vendor dispatch
      const updateResp = await deliveryService.updateVendorDispatch(
        selectedOrder.delivery._id,
        dispatchForm
      );

      if (updateResp.success) {
        alert('Dispatch status updated successfully!');
        setShowModal(false);
        loadOrders();
      }
    } catch (err) {
      console.error('Error updating dispatch:', err);
      alert(err.message || 'Failed to update dispatch status');
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Pending' },
      dispatched: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Dispatched' },
      in_transit: { bg: 'bg-purple-100', text: 'text-purple-800', label: 'In Transit' },
      delivered_to_tailor: { bg: 'bg-green-100', text: 'text-green-800', label: 'Delivered' }
    };
    
    const config = statusConfig[status] || statusConfig.pending;
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex bg-gray-50">
        <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} userRole="seller" />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-500 mx-auto mb-4"></div>
            <p className="text-gray-600 font-medium">Loading fabric orders...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-gray-50">
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} userRole="seller" />
      
      <main className="flex-1 p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-charcoal">Fabric Dispatch Management</h1>
          <p className="text-gray-600 mt-2">Track and update fabric dispatch status to tailors</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-center space-x-4">
            <div className="relative flex-1 max-w-md">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search orders..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="dispatched">Dispatched</option>
              <option value="in_transit">In Transit</option>
              <option value="delivered_to_tailor">Delivered to Tailor</option>
            </select>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold">Order ID</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Fabric</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Tailor</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Tracking</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredOrders.map((order) => (
                <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <span className="font-medium text-charcoal">
                      #{order._id.substring(0, 8).toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-charcoal">{order.fabricDetails?.name}</p>
                      <p className="text-sm text-gray-500">{order.fabricDetails?.type}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-charcoal">{order.tailorDetails?.name}</p>
                      <p className="text-sm text-gray-500">{order.tailorDetails?.location?.city}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {getStatusBadge(order.delivery?.vendorDispatch?.status || 'pending')}
                  </td>
                  <td className="px-6 py-4">
                    {order.delivery?.vendorDispatch?.trackingNumber ? (
                      <div>
                        <p className="text-sm font-medium text-charcoal">
                          {order.delivery.vendorDispatch.trackingNumber}
                        </p>
                        <p className="text-xs text-gray-500">
                          {order.delivery.vendorDispatch.courierName}
                        </p>
                      </div>
                    ) : (
                      <span className="text-sm text-gray-400">Not assigned</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => openDispatchModal(order)}
                      className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors flex items-center space-x-2"
                    >
                      <FiEdit className="w-4 h-4" />
                      <span>Update</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredOrders.length === 0 && (
            <div className="text-center py-12">
              <FiPackage className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No fabric orders found</p>
            </div>
          )}
        </div>

        {/* Dispatch Update Modal */}
        {showModal && selectedOrder && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-6 rounded-t-xl">
                <h2 className="text-2xl font-bold">Update Dispatch Status</h2>
                <p className="text-purple-100 mt-1">Order #{selectedOrder._id.substring(0, 8).toUpperCase()}</p>
              </div>

              <form onSubmit={handleDispatchUpdate} className="p-6 space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Dispatch Status *
                  </label>
                  <select
                    value={dispatchForm.status}
                    onChange={(e) => setDispatchForm({ ...dispatchForm, status: e.target.value })}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="pending">Pending</option>
                    <option value="dispatched">Dispatched</option>
                    <option value="in_transit">In Transit</option>
                    <option value="delivered_to_tailor">Delivered to Tailor</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tracking Number
                  </label>
                  <input
                    type="text"
                    value={dispatchForm.trackingNumber}
                    onChange={(e) => setDispatchForm({ ...dispatchForm, trackingNumber: e.target.value })}
                    placeholder="Enter tracking number"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Courier Name
                  </label>
                  <input
                    type="text"
                    value={dispatchForm.courierName}
                    onChange={(e) => setDispatchForm({ ...dispatchForm, courierName: e.target.value })}
                    placeholder="e.g., Blue Dart, DTDC"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Estimated Delivery to Tailor
                  </label>
                  <input
                    type="date"
                    value={dispatchForm.estimatedDelivery}
                    onChange={(e) => setDispatchForm({ ...dispatchForm, estimatedDelivery: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Notes
                  </label>
                  <textarea
                    value={dispatchForm.notes}
                    onChange={(e) => setDispatchForm({ ...dispatchForm, notes: e.target.value })}
                    rows="3"
                    placeholder="Add any additional notes"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div className="flex items-center space-x-4 pt-4">
                  <button
                    type="submit"
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-semibold hover:from-purple-600 hover:to-pink-600 transition-all"
                  >
                    Update Dispatch
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default FabricDispatch;
