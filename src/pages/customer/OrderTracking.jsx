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
  const [trackingData, setTrackingData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadCustomerOrders();
  }, []);

  useEffect(() => {
    if (selectedOrderId) {
      loadTrackingData(selectedOrderId);
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

  const loadTrackingData = async (bookingId) => {
    setError(null);
    try {
      const response = await deliveryService.getDeliveryTracking(bookingId);
      if (response.success) {
        setTrackingData(response.tracking);
      }
    } catch (err) {
      console.error('Error loading tracking data:', err);
      // If no delivery record exists yet, show pending status
      setTrackingData(null);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'delivered':
      case 'delivered_to_tailor':
        return <FiCheckCircle className="w-6 h-6 text-green-500" />;
      case 'out_for_delivery':
      case 'in_transit':
      case 'dispatched':
        return <FiTruck className="w-6 h-6 text-blue-500" />;
      case 'pending':
      case 'ready_for_delivery':
        return <FiClock className="w-6 h-6 text-yellow-500" />;
      default:
        return <FiPackage className="w-6 h-6 text-gray-500" />;
    }
  };

  const getProgressPercentage = () => {
    if (!trackingData) return 0;
    
    const vendorStatus = trackingData.vendorDispatch?.status;
    const tailorStatus = trackingData.tailorDelivery?.status;
    
    if (tailorStatus === 'delivered') return 100;
    if (tailorStatus === 'out_for_delivery') return 80;
    if (tailorStatus === 'ready_for_delivery') return 60;
    if (vendorStatus === 'delivered_to_tailor') return 50;
    if (vendorStatus === 'in_transit') return 30;
    if (vendorStatus === 'dispatched') return 20;
    return 10;
  };

  const selectedOrder = orders.find(o => o._id === selectedOrderId);

  if (loading) {
    return (
      <div className="min-h-screen flex bg-gray-50">
        <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} userRole="customer" />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-500 mx-auto mb-4"></div>
            <p className="text-gray-600 font-medium">Loading tracking information...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-gray-50">
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} userRole="customer" />
      
      <main className="flex-1 p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-charcoal">Order Tracking</h1>
          <p className="text-gray-600 mt-2">Track your order status and delivery updates</p>
        </div>

        {/* Order Selection */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex-1 max-w-md">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Order to Track
              </label>
              <select
                value={selectedOrderId}
                onChange={(e) => setSelectedOrderId(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
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
              className="ml-4 px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors flex items-center space-x-2"
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

        {selectedOrder && (
          <>
            {/* Progress Bar */}
            <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
              <h2 className="text-2xl font-bold text-charcoal mb-6">Delivery Progress</h2>
              
              <div className="relative">
                {/* Progress Bar */}
                <div className="w-full bg-gray-200 rounded-full h-4 mb-8">
                  <div
                    className="bg-gradient-to-r from-purple-500 to-pink-500 h-4 rounded-full transition-all duration-500"
                    style={{ width: `${getProgressPercentage()}%` }}
                  ></div>
                </div>

                {/* Progress Steps */}
                <div className="grid grid-cols-4 gap-4">
                  {/* Step 1: Order Placed */}
                  <div className="text-center">
                    <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-2">
                      <FiCheckCircle className="w-6 h-6 text-white" />
                    </div>
                    <p className="text-sm font-medium text-charcoal">Order Placed</p>
                    <p className="text-xs text-gray-500">Confirmed</p>
                  </div>

                  {/* Step 2: Fabric Dispatch (if applicable) */}
                  {trackingData?.vendorDispatch && (
                    <div className="text-center">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2 ${
                        trackingData.vendorDispatch.status === 'delivered_to_tailor' ? 'bg-green-500' :
                        trackingData.vendorDispatch.status !== 'pending' ? 'bg-blue-500' : 'bg-gray-300'
                      }`}>
                        {getStatusIcon(trackingData.vendorDispatch.status)}
                      </div>
                      <p className="text-sm font-medium text-charcoal">Fabric Dispatch</p>
                      <p className="text-xs text-gray-500 capitalize">
                        {trackingData.vendorDispatch.status.replace(/_/g, ' ')}
                      </p>
                    </div>
                  )}

                  {/* Step 3: Tailoring */}
                  <div className="text-center">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2 ${
                      trackingData?.tailorDelivery?.status === 'ready_for_delivery' ? 'bg-green-500' :
                      trackingData?.tailorDelivery?.status !== 'pending' ? 'bg-blue-500' : 'bg-gray-300'
                    }`}>
                      {getStatusIcon(trackingData?.tailorDelivery?.status || 'pending')}
                    </div>
                    <p className="text-sm font-medium text-charcoal">Tailoring</p>
                    <p className="text-xs text-gray-500 capitalize">
                      {trackingData?.tailorDelivery?.status?.replace(/_/g, ' ') || 'Pending'}
                    </p>
                  </div>

                  {/* Step 4: Delivery */}
                  <div className="text-center">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2 ${
                      trackingData?.tailorDelivery?.status === 'delivered' ? 'bg-green-500' :
                      trackingData?.tailorDelivery?.status === 'out_for_delivery' ? 'bg-blue-500' : 'bg-gray-300'
                    }`}>
                      {getStatusIcon(trackingData?.tailorDelivery?.status || 'pending')}
                    </div>
                    <p className="text-sm font-medium text-charcoal">Delivered</p>
                    <p className="text-xs text-gray-500">
                      {trackingData?.tailorDelivery?.status === 'delivered' ? 'Complete' : 'Pending'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Tracking Details */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              {/* Vendor Dispatch Details */}
              {trackingData?.vendorDispatch && selectedOrder.bookingType !== 'tailor' && (
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-xl font-bold text-charcoal mb-4 flex items-center">
                    <FiTruck className="w-5 h-5 mr-2 text-purple-500" />
                    Fabric Dispatch
                  </h3>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status:</span>
                      <span className="font-semibold text-charcoal capitalize">
                        {trackingData.vendorDispatch.status.replace(/_/g, ' ')}
                      </span>
                    </div>
                    
                    {trackingData.vendorDispatch.trackingNumber && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Tracking Number:</span>
                        <span className="font-semibold text-blue-600">
                          {trackingData.vendorDispatch.trackingNumber}
                        </span>
                      </div>
                    )}
                    
                    {trackingData.vendorDispatch.courierName && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Courier:</span>
                        <span className="font-semibold text-charcoal">
                          {trackingData.vendorDispatch.courierName}
                        </span>
                      </div>
                    )}
                    
                    {trackingData.vendorDispatch.estimatedDelivery && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Est. Delivery to Tailor:</span>
                        <span className="font-semibold text-charcoal">
                          {new Date(trackingData.vendorDispatch.estimatedDelivery).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Tailor Delivery Details */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-charcoal mb-4 flex items-center">
                  <FiPackage className="w-5 h-5 mr-2 text-purple-500" />
                  Tailor Delivery
                </h3>
                
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status:</span>
                    <span className="font-semibold text-charcoal capitalize">
                      {trackingData?.tailorDelivery?.status?.replace(/_/g, ' ') || 'Pending'}
                    </span>
                  </div>
                  
                  {trackingData?.tailorDelivery?.deliveryMethod && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Delivery Method:</span>
                      <span className="font-semibold text-charcoal capitalize">
                        {trackingData.tailorDelivery.deliveryMethod.replace(/_/g, ' ')}
                      </span>
                    </div>
                  )}
                  
                  {trackingData?.tailorDelivery?.trackingNumber && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tracking Number:</span>
                      <span className="font-semibold text-blue-600">
                        {trackingData.tailorDelivery.trackingNumber}
                      </span>
                    </div>
                  )}
                  
                  {trackingData?.tailorDelivery?.courierName && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Courier:</span>
                      <span className="font-semibold text-charcoal">
                        {trackingData.tailorDelivery.courierName}
                      </span>
                    </div>
                  )}
                  
                  {selectedOrder.orderDetails?.deliveryDate && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Expected Delivery:</span>
                      <span className="font-semibold text-red-600">
                        {new Date(selectedOrder.orderDetails.deliveryDate).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Delivery Address */}
            {trackingData?.deliveryAddress && (
              <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
                <h3 className="text-xl font-bold text-charcoal mb-4 flex items-center">
                  <FiMapPin className="w-5 h-5 mr-2 text-purple-500" />
                  Delivery Address
                </h3>
                <div className="text-gray-700">
                  <p>{trackingData.deliveryAddress.street}</p>
                  <p>{trackingData.deliveryAddress.city}, {trackingData.deliveryAddress.state}</p>
                  <p>{trackingData.deliveryAddress.pincode}</p>
                  {trackingData.deliveryAddress.phone && (
                    <p className="mt-2 font-medium">Phone: {trackingData.deliveryAddress.phone}</p>
                  )}
                </div>
              </div>
            )}

            {/* Timeline */}
            {trackingData?.timeline && trackingData.timeline.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-charcoal mb-6">Tracking History</h3>
                
                <div className="space-y-4">
                  {trackingData.timeline.map((event, index) => (
                    <div key={index} className="flex items-start space-x-4 pb-4 border-b border-gray-200 last:border-0">
                      <div className="w-3 h-3 bg-purple-500 rounded-full mt-1.5"></div>
                      <div className="flex-1">
                        <p className="font-semibold text-charcoal capitalize">
                          {event.status.replace(/_/g, ' ')}
                        </p>
                        <p className="text-sm text-gray-600">
                          {new Date(event.timestamp).toLocaleString()}
                        </p>
                        {event.notes && (
                          <p className="text-sm text-gray-700 mt-1">{event.notes}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {!selectedOrderId && orders.length === 0 && (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <FiPackage className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Orders Found</h3>
            <p className="text-gray-600 mb-6">You don't have any orders to track yet.</p>
            <button
              onClick={() => navigate('/customer/fabrics')}
              className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-semibold hover:from-purple-600 hover:to-pink-600 transition-all"
            >
              Start Shopping
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default OrderTracking;
