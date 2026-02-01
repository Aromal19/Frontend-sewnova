import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import deliveryService from '../../services/deliveryService';
import { adminApiService } from '../../services/adminApiService';
import { FiPackage, FiTruck, FiCheckCircle, FiClock, FiMapPin, FiUser, FiArrowLeft, FiSave } from 'react-icons/fi';

const OrderDeliveryUpdate = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  
  const [booking, setBooking] = useState(null);
  const [delivery, setDelivery] = useState(null);
  
  const [formData, setFormData] = useState({
    status: 'pending',
    deliveryMethod: 'courier',
    trackingNumber: '',
    courierName: '',
    notes: '',
    failureReason: ''
  });

  useEffect(() => {
    loadData();
  }, [bookingId]);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Load booking details
      const bookingResponse = await adminApiService.getOrderById(bookingId);
      if (bookingResponse.success) {
        setBooking(bookingResponse.data);
      }

      // Load delivery details
      try {
        const deliveryResponse = await deliveryService.getDeliveryByBooking(bookingId);
        if (deliveryResponse.success) {
          setDelivery(deliveryResponse.delivery);
          // Pre-fill form with existing data
          const tailorDel = deliveryResponse.delivery.tailorDelivery;
          setFormData({
            status: tailorDel.status || 'pending',
            deliveryMethod: tailorDel.deliveryMethod || 'courier',
            trackingNumber: tailorDel.trackingNumber || '',
            courierName: tailorDel.courierName || '',
            notes: tailorDel.notes || '',
            failureReason: tailorDel.failureReason || ''
          });
        }
      } catch (err) {
        // Delivery record might not exist yet
        console.log('No delivery record found, will create on first update');
      }
    } catch (err) {
      console.error('Error loading data:', err);
      setError('Failed to load order details');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      // If no delivery record exists, create one first
      if (!delivery) {
        const createResponse = await deliveryService.createDelivery(
          bookingId,
          booking.customerId._id || booking.customerId,
          booking.bookingType,
          booking.deliveryAddress
        );
        
        if (createResponse.success) {
          setDelivery(createResponse.delivery);
        }
      }

      // Update tailor delivery status
      const updateResponse = await deliveryService.updateTailorDelivery(
        delivery?._id || delivery?.id,
        formData
      );

      if (updateResponse.success) {
        setSuccess('Delivery status updated successfully!');
        setDelivery(updateResponse.delivery);
        
        // Redirect back to active orders after 2 seconds
        setTimeout(() => {
          navigate('/tailor/active-orders');
        }, 2000);
      }
    } catch (err) {
      console.error('Error updating delivery:', err);
      setError(err.message || 'Failed to update delivery status');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex bg-gray-50">
        <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} userRole="tailor" />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-500 mx-auto mb-4"></div>
            <p className="text-gray-600 font-medium">Loading order details...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-gray-50">
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} userRole="tailor" />
      
      <main className="flex-1 p-6">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate('/tailor/active-orders')}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <FiArrowLeft className="w-5 h-5 mr-2" />
            Back to Active Orders
          </button>
          
          <h1 className="text-3xl font-bold text-charcoal">Update Delivery Status</h1>
          <p className="text-gray-600 mt-2">Manage delivery details for order #{bookingId?.substring(0, 8).toUpperCase()}</p>
        </div>

        {/* Alerts */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}
        
        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700 flex items-center">
            <FiCheckCircle className="w-5 h-5 mr-2" />
            {success}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Order Details Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-charcoal mb-4 flex items-center">
                <FiPackage className="w-5 h-5 mr-2 text-purple-500" />
                Order Details
              </h2>
              
              {booking && (
                <div className="space-y-4">
                  {/* Customer Info */}
                  <div className="pb-4 border-b border-gray-200">
                    <div className="flex items-center mb-2">
                      <FiUser className="w-4 h-4 mr-2 text-gray-500" />
                      <span className="text-sm font-medium text-gray-600">Customer</span>
                    </div>
                    <p className="font-semibold text-charcoal">
                      {booking.customerId?.firstname} {booking.customerId?.lastname}
                    </p>
                    <p className="text-sm text-gray-600">{booking.userEmail}</p>
                    <p className="text-sm text-gray-600">{booking.customerId?.phone}</p>
                  </div>

                  {/* Garment Info */}
                  <div className="pb-4 border-b border-gray-200">
                    <p className="text-sm text-gray-600 mb-1">Garment Type</p>
                    <p className="font-semibold text-charcoal capitalize">
                      {booking.orderDetails?.garmentType}
                    </p>
                  </div>

                  {/* Delivery Address */}
                  {booking.deliveryAddress && (
                    <div>
                      <div className="flex items-center mb-2">
                        <FiMapPin className="w-4 h-4 mr-2 text-gray-500" />
                        <span className="text-sm font-medium text-gray-600">Delivery Address</span>
                      </div>
                      <p className="text-sm text-gray-700">
                        {booking.deliveryAddress.street}<br />
                        {booking.deliveryAddress.city}, {booking.deliveryAddress.state}<br />
                        {booking.deliveryAddress.pincode}
                      </p>
                    </div>
                  )}

                  {/* Deadline */}
                  <div className="pt-4 border-t border-gray-200">
                    <div className="flex items-center mb-2">
                      <FiClock className="w-4 h-4 mr-2 text-gray-500" />
                      <span className="text-sm font-medium text-gray-600">Delivery Deadline</span>
                    </div>
                    <p className="font-semibold text-red-600">
                      {new Date(booking.orderDetails?.deliveryDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Status Timeline */}
            {delivery && delivery.statusHistory && delivery.statusHistory.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg p-6 mt-6">
                <h2 className="text-xl font-bold text-charcoal mb-4">Status History</h2>
                <div className="space-y-3">
                  {delivery.statusHistory
                    .filter(h => h.phase === 'tailor_delivery')
                    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
                    .map((history, index) => (
                      <div key={index} className="flex items-start space-x-3 pb-3 border-b border-gray-100 last:border-0">
                        <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-charcoal capitalize">
                            {history.status.replace(/_/g, ' ')}
                          </p>
                          <p className="text-xs text-gray-500">
                            {new Date(history.timestamp).toLocaleString()}
                          </p>
                          {history.notes && (
                            <p className="text-xs text-gray-600 mt-1">{history.notes}</p>
                          )}
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>

          {/* Delivery Update Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-charcoal mb-6 flex items-center">
                <FiTruck className="w-5 h-5 mr-2 text-purple-500" />
                Delivery Information
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Delivery Status */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Delivery Status *
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="pending">Pending</option>
                    <option value="ready_for_delivery">Ready for Delivery</option>
                    <option value="out_for_delivery">Out for Delivery</option>
                    <option value="delivered">Delivered</option>
                    <option value="failed">Failed Delivery</option>
                  </select>
                </div>

                {/* Delivery Method */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Delivery Method *
                  </label>
                  <select
                    name="deliveryMethod"
                    value={formData.deliveryMethod}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="courier">Courier Service</option>
                    <option value="pickup">Customer Pickup</option>
                    <option value="hand_delivery">Hand Delivery</option>
                  </select>
                </div>

                {/* Tracking Number */}
                {formData.deliveryMethod === 'courier' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tracking Number
                    </label>
                    <input
                      type="text"
                      name="trackingNumber"
                      value={formData.trackingNumber}
                      onChange={handleInputChange}
                      placeholder="Enter tracking number"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                )}

                {/* Courier Name */}
                {formData.deliveryMethod === 'courier' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Courier Name
                    </label>
                    <input
                      type="text"
                      name="courierName"
                      value={formData.courierName}
                      onChange={handleInputChange}
                      placeholder="e.g., Blue Dart, DTDC, FedEx"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                )}

                {/* Failure Reason */}
                {formData.status === 'failed' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Failure Reason *
                    </label>
                    <textarea
                      name="failureReason"
                      value={formData.failureReason}
                      onChange={handleInputChange}
                      required={formData.status === 'failed'}
                      rows="3"
                      placeholder="Explain why the delivery failed"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                )}

                {/* Notes */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Additional Notes
                  </label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    rows="4"
                    placeholder="Add any additional information about the delivery"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                {/* Submit Button */}
                <div className="flex items-center space-x-4 pt-4">
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-semibold hover:from-purple-600 hover:to-pink-600 transition-all duration-300 shadow-lg flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {saving ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        <span>Saving...</span>
                      </>
                    ) : (
                      <>
                        <FiSave className="w-5 h-5" />
                        <span>Update Delivery Status</span>
                      </>
                    )}
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => navigate('/tailor/active-orders')}
                    className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default OrderDeliveryUpdate;
