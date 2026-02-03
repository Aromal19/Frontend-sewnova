import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import deliveryService from '../../services/deliveryService';
import { getCurrentUser } from '../../utils/api';
import { adminApiService } from '../../services/adminApiService';
import { FiPackage, FiTruck, FiCheckCircle, FiClock, FiMapPin, FiRefreshCw, FiAlertCircle } from 'react-icons/fi';

const OrderTracking = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [selectedOrderId, setSelectedOrderId] = useState('');
  
  // Tracking State can be: 
  // 1. Array (New System) 
  // 2. Object (Legacy System)
  // 3. Null (None)
  const [trackingInfo, setTrackingInfo] = useState(null); 
  const [error, setError] = useState(null);

  useEffect(() => {
    loadCustomerOrders();
  }, []);

  useEffect(() => {
    if (selectedOrderId) {
      loadTrackingData(selectedOrderId);
    } else {
        setTrackingInfo(null);
    }
  }, [selectedOrderId]);

  const loadCustomerOrders = async () => {
    setLoading(true);
    try {
      const user = getCurrentUser();
      const customerId = user?._id || user?.id || user?.userId;

      const response = await adminApiService.getAllOrders({
        page: 1,
        limit: 100,
        sortBy: 'createdAt',
        sortOrder: 'desc'
      });

      if (response.success) {
        const allOrders = response.data.bookings || [];
        const customerOrders = allOrders.filter(order => 
          order.customerId?._id === customerId || order.customerId === customerId
        );
        
        setOrders(customerOrders);
        
        // Auto-select first order
        if (customerOrders.length > 0 && !selectedOrderId) {
          setSelectedOrderId(customerOrders[0]._id);
        }
      }
    } catch (err) {
      console.error('Error loading orders:', err);
      setError('Failed to load your orders');
    } finally {
      setLoading(false);
    }
  };

  const loadTrackingData = async (orderId) => {
    setError(null);
    setTrackingInfo(null);
    try {
      const response = await deliveryService.getCombinedTracking(orderId);
      
      if (response.isNewSystem) {
          setTrackingInfo({ type: 'NEW', data: response.deliveries });
      } else if (response.success && response.tracking) {
          setTrackingInfo({ type: 'LEGACY', data: response.tracking });
      } else {
          setTrackingInfo(null);
      }
    } catch (err) {
      console.error('Error loading tracking data:', err);
      setTrackingInfo(null);
    }
  };

  const getProgressPercentage = (status) => {
    if (!status) return 0;
    switch (status) {
        case 'DELIVERED': return 100;
        case 'DISPATCHED': return 66;
        case 'CREATED': return 33;
        default: return 0;
    }
  };

  const selectedOrder = orders.find(o => o._id === selectedOrderId);

  // New System Renderer
  const renderNewDeliveryCard = (delivery, index) => {
      const pct = getProgressPercentage(delivery.status);
      return (
        <div key={index} className="bg-white rounded-xl shadow-lg p-6 mb-6 border border-gray-100 animate-fadeIn">
            <div className="flex justify-between items-center mb-4 border-b pb-2">
                <h3 className="font-bold text-lg text-charcoal flex items-center">
                    <FiPackage className="mr-2 text-purple-600"/> 
                    {delivery.deliveryType} Delivery
                </h3>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    delivery.status === 'DELIVERED' ? 'bg-green-100 text-green-700' :
                    delivery.status === 'DISPATCHED' ? 'bg-blue-100 text-blue-700' :
                    'bg-yellow-100 text-yellow-700'
                }`}>
                    {delivery.status}
                </span>
            </div>

            {/* Progress Bar */}
            <div className="mb-6 relative h-2 bg-gray-200 rounded-full mt-4">
                 <div className="absolute top-0 left-0 h-full bg-purple-600 rounded-full transition-all duration-1000" style={{width: `${pct}%`}}></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                    <p className="text-gray-500">Shipped By</p>
                    <p className="font-semibold">{delivery.courierName || 'Pending'}</p>
                </div>
                <div>
                    <p className="text-gray-500">Tracking Info</p>
                    <p className="font-mono text-blue-600">{delivery.trackingId || '-'}</p>
                </div>
                <div>
                     <p className="text-gray-500">Last Update</p>
                     <p>{new Date(delivery.updatedAt).toLocaleDateString()}</p>
                </div>
            </div>
        </div>
      );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex bg-gray-50">
        <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} currentPage="tracking" />
        <main className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-500"></div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-gray-50">
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} currentPage="tracking" />
      
      <main className="flex-1 p-6 transition-all duration-300">
        <div className="mb-8">
            <div className="flex items-center space-x-4 mb-2">
                 <button className="lg:hidden p-2" onClick={() => setSidebarOpen(!sidebarOpen)}><FiTruck /></button>
                 <h1 className="text-3xl font-bold text-charcoal">Order Tracking</h1>
            </div>
          <p className="text-gray-600">Track your order status and delivery updates</p>
        </div>

        {/* Order Selection */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border border-gray-100">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex-1 w-full">
              <label className="block text-sm font-medium text-gray-700 mb-2">Select Order to Track</label>
              <select
                value={selectedOrderId}
                onChange={(e) => setSelectedOrderId(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 bg-gray-50"
              >
                <option value="">-- Select an order --</option>
                {orders.map(order => (
                  <option key={order._id} value={order._id}>
                    #{order._id.substring(0, 8).toUpperCase()} - {order.orderDetails?.garmentType} ({order.status})
                  </option>
                ))}
              </select>
            </div>
            
            <button
              onClick={() => selectedOrderId && loadTrackingData(selectedOrderId)}
              className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-2 shadow-md"
            >
              <FiRefreshCw className="w-5 h-5" />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 flex items-center">
            <FiAlertCircle className="w-5 h-5 mr-2" />
            {error}
          </div>
        )}

        {/* Content Area */}
        {selectedOrder && (
            <div className="space-y-6">
                
                {/* NEW SYSTEM DISPLAY */}
                {trackingInfo?.type === 'NEW' && (
                    <div className="space-y-6">
                        {trackingInfo.data.length === 0 && <p className="text-gray-500 italic">No delivery updates yet. Order is being processed.</p>}
                        {trackingInfo.data.map((delivery, idx) => renderNewDeliveryCard(delivery, idx))}
                    </div>
                )}

                {/* LEGACY SYSTEM DISPLAY */}
                {trackingInfo?.type === 'LEGACY' && (
                     <div className="bg-white rounded-xl shadow-lg p-8 mb-6 border border-gray-100">
                        <h2 className="text-xl font-bold text-charcoal mb-4">Tracking Details (Standard)</h2>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center bg-gray-50 p-4 rounded-lg">
                                <div>
                                    <p className="text-sm text-gray-500">Status</p>
                                    <p className="font-bold text-lg text-blue-800">{trackingInfo.data.status}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm text-gray-500">Tracking Info</p>
                                    <p className="font-semibold">{trackingInfo.data.courierName}</p>
                                    <p className="font-mono text-sm">{trackingInfo.data.trackingId}</p>
                                </div>
                            </div>
                            
                            {/* Simple Timeline for Legacy */}
                            {trackingInfo.data.timeline && (
                                <div className="mt-6 border-l-2 border-gray-200 ml-2 pl-6 space-y-6">
                                    {trackingInfo.data.timeline.map((ev, i) => (
                                        <div key={i} className="relative">
                                            <span className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-purple-600 border-2 border-white"></span>
                                            <p className="font-semibold">{ev.status}</p>
                                            <p className="text-sm text-gray-500">{new Date(ev.timestamp).toLocaleString()}</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                     </div>
                )}

                {/* Fallback layout if no tracking info found */}
                {!trackingInfo && (
                     <div className="bg-white rounded-xl shadow p-8 text-center border border-dashed border-gray-300">
                        <FiPackage className="mx-auto h-12 w-12 text-gray-300 mb-3" />
                         <p className="text-gray-500">Tracking information is not available yet.</p>
                         <p className="text-sm text-gray-400">Order placement confirmed. Check back soon for shipping updates.</p>
                     </div>
                )}
            </div>
        )}
      </main>
    </div>
  );
};

export default OrderTracking;
