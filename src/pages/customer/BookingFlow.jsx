import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { 
  FiArrowLeft, 
  FiArrowRight, 
  FiCheck, 
  FiUser, 
  FiScissors, 
  FiShoppingBag, 
  FiMapPin, 
  FiCalendar, 
  FiDollarSign,
  FiPackage,
  FiClock,
  FiEdit2,
  FiPlus,
  FiMinus,
  FiImage,
  FiStar,
  FiX
} from "react-icons/fi";
import { apiCall } from "../../config/api";

const BookingFlow = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  
  // Booking data state
  const [bookingData, setBookingData] = useState({
    // Service selection
    serviceType: 'complete', // 'tailor', 'fabric', 'complete'
    tailorId: searchParams.get('tailorId') || null,
    fabricId: searchParams.get('fabricId') || null,
    
    // Garment details
    garmentType: '',
    quantity: 1,
    design: '',
    instructions: '',
    
    // Measurements
    measurementId: null,
    customMeasurements: {},
    
    // Address
    addressId: null,
    deliveryAddress: {},
    
    // Scheduling
    preferredDate: '',
    preferredTime: '',
    
    // Pricing
    fabricCost: 0,
    tailoringCost: 0,
    totalCost: 0,
    advanceAmount: 0,
    
    // Additional
    notes: ''
  });

  const [availableTailors, setAvailableTailors] = useState([]);
  const [availableFabrics, setAvailableFabrics] = useState([]);
  const [measurements, setMeasurements] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [selectedTailor, setSelectedTailor] = useState(null);
  const [selectedFabric, setSelectedFabric] = useState(null);

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      
      // Fetch available tailors
      try {
        const tailorsResponse = await apiCall('TAILOR_SERVICE', '/api/public/tailors?limit=20&isVerified=true', {
          method: 'GET'
        });
        
        if (tailorsResponse.success && tailorsResponse.data) {
          const transformedTailors = tailorsResponse.data.map(tailor => ({
            _id: tailor._id,
            firstname: tailor.firstname,
            lastname: tailor.lastname,
            shopName: tailor.shopName,
            rating: tailor.rating || 4.0,
            experience: tailor.experience || 0,
            specializations: tailor.specialization || [],
            location: `${tailor.district || tailor.city || 'Unknown'}, ${tailor.state || 'Unknown'}`,
            services: tailor.services || [
              { name: 'Custom Tailoring', price: tailor.basePrice || 2000, duration: '7-10 days' }
            ]
          }));
          setAvailableTailors(transformedTailors);
        }
      } catch (error) {
        console.error('Error fetching tailors:', error);
        setAvailableTailors([]);
      }
      
      // Fetch available fabrics
      try {
        const fabricsResponse = await apiCall('SELLER_SERVICE', '/api/public/products?limit=20&isActive=true', {
          method: 'GET'
        });
        
        if (fabricsResponse.success && fabricsResponse.data) {
          const transformedFabrics = fabricsResponse.data.map(fabric => ({
            _id: fabric._id,
            name: fabric.name,
            price: fabric.price,
            color: fabric.color,
            pattern: fabric.pattern || 'Solid',
            category: fabric.category,
            images: fabric.images ? fabric.images.map(img => img.url || img) : [],
            seller: { 
              name: fabric.seller?.name || 'Unknown Seller'
            }
          }));
          setAvailableFabrics(transformedFabrics);
        }
      } catch (error) {
        console.error('Error fetching fabrics:', error);
        setAvailableFabrics([]);
      }
      
      // Fetch measurements
      try {
        const measurementsResponse = await apiCall('CUSTOMER_SERVICE', '/api/measurements', {
          method: 'GET'
        });
        
        if (measurementsResponse.success && measurementsResponse.data) {
          setMeasurements(measurementsResponse.data);
        } else {
          // Set default measurements if none available
          setMeasurements([
            {
              _id: 'default',
              measurementName: 'Standard Measurements',
              measurements: {
                chest: 42,
                waist: 36,
                shoulder: 18,
                sleeve: 24
              }
            }
          ]);
        }
      } catch (error) {
        console.error('Error fetching measurements:', error);
        setMeasurements([
          {
            _id: 'default',
            measurementName: 'Standard Measurements',
            measurements: {
              chest: 42,
              waist: 36,
              shoulder: 18,
              sleeve: 24
            }
          }
        ]);
      }
      
      // Fetch addresses
      try {
        const addressesResponse = await apiCall('CUSTOMER_SERVICE', '/api/addresses', {
          method: 'GET'
        });
        
        if (addressesResponse.success && addressesResponse.data) {
          setAddresses(addressesResponse.data);
        } else {
          // Set default address if none available
          setAddresses([
            {
              _id: 'default',
              addressLine: 'Please add your address',
              city: 'City',
              state: 'State',
              pincode: '000000',
              landmark: 'Landmark',
              isDefault: true
            }
          ]);
        }
      } catch (error) {
        console.error('Error fetching addresses:', error);
        setAddresses([
          {
            _id: 'default',
            addressLine: 'Please add your address',
            city: 'City',
            state: 'State',
            pincode: '000000',
            landmark: 'Landmark',
            isDefault: true
          }
        ]);
      }
      
      // Set pre-selected items if coming from product/tailor pages
      if (bookingData.tailorId) {
        const tailor = availableTailors.find(t => t._id === bookingData.tailorId);
        if (tailor) setSelectedTailor(tailor);
      }
      
      if (bookingData.fabricId) {
        const fabric = availableFabrics.find(f => f._id === bookingData.fabricId);
        if (fabric) setSelectedFabric(fabric);
      }
      
    } catch (error) {
      console.error('Error fetching initial data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleTailorSelect = (tailor) => {
    setSelectedTailor(tailor);
    setBookingData(prev => ({
      ...prev,
      tailorId: tailor._id,
      tailoringCost: tailor.services[0]?.price || 0
    }));
  };

  const handleFabricSelect = (fabric) => {
    setSelectedFabric(fabric);
    setBookingData(prev => ({
      ...prev,
      fabricId: fabric._id,
      fabricCost: fabric.price
    }));
  };

  const handleMeasurementSelect = (measurement) => {
    setBookingData(prev => ({
      ...prev,
      measurementId: measurement._id
    }));
  };

  const handleAddressSelect = (address) => {
    setBookingData(prev => ({
      ...prev,
      addressId: address._id,
      deliveryAddress: address
    }));
  };

  const calculateTotal = () => {
    const fabricCost = selectedFabric ? selectedFabric.price * bookingData.quantity : 0;
    const tailoringCost = selectedTailor ? selectedTailor.services[0]?.price || 0 : 0;
    const total = fabricCost + tailoringCost;
    const advance = Math.round(total * 0.3); // 30% advance
    
    setBookingData(prev => ({
      ...prev,
      fabricCost,
      tailoringCost,
      totalCost: total,
      advanceAmount: advance
    }));
  };

  useEffect(() => {
    calculateTotal();
  }, [selectedFabric, selectedTailor, bookingData.quantity]);

  const handleSubmitBooking = async () => {
    try {
      setLoading(true);
      
      const finalBookingData = {
        bookingType: bookingData.serviceType,
        tailorId: bookingData.tailorId,
        fabricId: bookingData.fabricId,
        measurementId: bookingData.measurementId,
        addressId: bookingData.addressId,
        description: bookingData.instructions,
        preferredDate: bookingData.preferredDate,
        budget: bookingData.totalCost,
        status: 'pending',
        orderDetails: {
          garmentType: bookingData.garmentType,
          quantity: bookingData.quantity,
          design: bookingData.design,
          instructions: bookingData.instructions
        },
        pricing: {
          fabricCost: bookingData.fabricCost,
          tailoringCost: bookingData.tailoringCost,
          totalAmount: bookingData.totalCost,
          advanceAmount: bookingData.advanceAmount,
          remainingAmount: bookingData.totalCost - bookingData.advanceAmount,
          paymentStatus: 'pending'
        },
        deliveryAddress: bookingData.deliveryAddress,
        timeline: {
          created: new Date().toISOString(),
          estimatedDelivery: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // 14 days from now
        }
      };
      
      const response = await apiCall('CUSTOMER_SERVICE', '/api/bookings', {
        method: 'POST',
        body: finalBookingData
      });
      
      if (response.success) {
        // Navigate to booking confirmation
        navigate('/customer/bookings', { 
          state: { 
            message: 'Booking created successfully!',
            bookingId: response.data._id || response.data.id
          }
        });
      } else {
        console.error('Failed to create booking:', response.message);
        // Show error message to user
        alert('Failed to create booking. Please try again.');
      }
      
    } catch (error) {
      console.error('Error creating booking:', error);
      alert('An error occurred while creating the booking. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { id: 1, title: 'Service Type', icon: FiPackage },
    { id: 2, title: 'Select Tailor', icon: FiScissors },
    { id: 3, title: 'Choose Fabric', icon: FiShoppingBag },
    { id: 4, title: 'Measurements', icon: FiUser },
    { id: 5, title: 'Review & Book', icon: FiCheck }
  ];

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">What would you like to book?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                onClick={() => setBookingData(prev => ({ ...prev, serviceType: 'tailor' }))}
                className={`p-6 border-2 rounded-lg text-left transition-all ${
                  bookingData.serviceType === 'tailor'
                    ? 'border-amber-500 bg-amber-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <FiScissors className="w-8 h-8 text-amber-500 mb-4" />
                <h3 className="font-semibold text-gray-900 mb-2">Tailor Only</h3>
                <p className="text-sm text-gray-600">I have my own fabric, just need tailoring services</p>
              </button>
              
              <button
                onClick={() => setBookingData(prev => ({ ...prev, serviceType: 'fabric' }))}
                className={`p-6 border-2 rounded-lg text-left transition-all ${
                  bookingData.serviceType === 'fabric'
                    ? 'border-amber-500 bg-amber-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <FiShoppingBag className="w-8 h-8 text-amber-500 mb-4" />
                <h3 className="font-semibold text-gray-900 mb-2">Fabric Only</h3>
                <p className="text-sm text-gray-600">I need fabric, will find my own tailor</p>
              </button>
              
              <button
                onClick={() => setBookingData(prev => ({ ...prev, serviceType: 'complete' }))}
                className={`p-6 border-2 rounded-lg text-left transition-all ${
                  bookingData.serviceType === 'complete'
                    ? 'border-amber-500 bg-amber-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <FiPackage className="w-8 h-8 text-amber-500 mb-4" />
                <h3 className="font-semibold text-gray-900 mb-2">Complete Package</h3>
                <p className="text-sm text-gray-600">I need both fabric and tailoring services</p>
              </button>
            </div>
            
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Garment Type
              </label>
              <select
                value={bookingData.garmentType}
                onChange={(e) => setBookingData(prev => ({ ...prev, garmentType: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                <option value="">Select garment type</option>
                <option value="shirt">Shirt</option>
                <option value="pants">Pants</option>
                <option value="suit">Suit</option>
                <option value="dress">Dress</option>
                <option value="saree">Saree</option>
                <option value="kurta">Kurta</option>
              </select>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quantity
                </label>
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button
                    onClick={() => setBookingData(prev => ({ ...prev, quantity: Math.max(1, prev.quantity - 1) }))}
                    className="p-2 hover:bg-gray-100"
                  >
                    <FiMinus className="w-4 h-4" />
                  </button>
                  <span className="px-4 py-2 border-x border-gray-300">{bookingData.quantity}</span>
                  <button
                    onClick={() => setBookingData(prev => ({ ...prev, quantity: prev.quantity + 1 }))}
                    className="p-2 hover:bg-gray-100"
                  >
                    <FiPlus className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Design Description
                </label>
                <input
                  type="text"
                  value={bookingData.design}
                  onChange={(e) => setBookingData(prev => ({ ...prev, design: e.target.value }))}
                  placeholder="Describe your design requirements"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Special Instructions
              </label>
              <textarea
                value={bookingData.instructions}
                onChange={(e) => setBookingData(prev => ({ ...prev, instructions: e.target.value }))}
                placeholder="Any special requirements or instructions..."
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Select a Tailor</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {availableTailors && availableTailors.length > 0 ? availableTailors.map((tailor) => (
                <div
                  key={tailor._id}
                  onClick={() => handleTailorSelect(tailor)}
                  className={`p-6 border-2 rounded-lg cursor-pointer transition-all ${
                    selectedTailor?._id === tailor._id
                      ? 'border-amber-500 bg-amber-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-start space-x-4">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full flex items-center justify-center">
                      <FiUser className="w-8 h-8 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{tailor.firstname} {tailor.lastname}</h3>
                      <p className="text-sm text-gray-600">{tailor.shopName}</p>
                      <div className="flex items-center mt-2">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <FiStar
                              key={i}
                              className={`w-4 h-4 ${
                                i < Math.floor(tailor.rating)
                                  ? 'text-yellow-400 fill-current'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="ml-2 text-sm text-gray-600">{tailor.rating} ({tailor.experience} years exp)</span>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">{tailor.location}</p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {tailor.specializations.slice(0, 2).map((spec, index) => (
                          <span key={index} className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">
                            {spec}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )) : (
                <div className="col-span-2 text-center py-8">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FiScissors className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No tailors found</h3>
                  <p className="text-gray-600 mb-4">No verified tailors are available at the moment</p>
                </div>
              )}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Choose Fabric</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {availableFabrics && availableFabrics.length > 0 ? availableFabrics.map((fabric) => (
                <div
                  key={fabric._id}
                  onClick={() => handleFabricSelect(fabric)}
                  className={`border-2 rounded-lg cursor-pointer transition-all ${
                    selectedFabric?._id === fabric._id
                      ? 'border-amber-500 bg-amber-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="aspect-square bg-gray-100 rounded-t-lg overflow-hidden">
                    <img
                      src={fabric.images[0]}
                      alt={fabric.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900">{fabric.name}</h3>
                    <p className="text-sm text-gray-600">{fabric.category} • {fabric.pattern}</p>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center space-x-2">
                        <div
                          className="w-4 h-4 rounded-full border border-gray-300"
                          style={{ backgroundColor: fabric.color }}
                        ></div>
                        <span className="text-sm text-gray-600">{fabric.color}</span>
                      </div>
                      <span className="font-bold text-gray-900">₹{fabric.price}/m</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">by {fabric.seller.name}</p>
                  </div>
                </div>
              )) : (
                <div className="col-span-3 text-center py-8">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FiShoppingBag className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No fabrics found</h3>
                  <p className="text-gray-600 mb-4">No fabrics are available at the moment</p>
                </div>
              )}
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Select Measurements</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {measurements && measurements.length > 0 ? measurements.map((measurement) => (
                <div
                  key={measurement._id}
                  onClick={() => handleMeasurementSelect(measurement)}
                  className={`p-6 border-2 rounded-lg cursor-pointer transition-all ${
                    bookingData.measurementId === measurement._id
                      ? 'border-amber-500 bg-amber-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <h3 className="font-semibold text-gray-900 mb-4">{measurement.measurementName || 'Measurement'}</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {measurement.measurements && Object.entries(measurement.measurements).map(([key, value]) => (
                      <div key={key} className="text-sm">
                        <span className="text-gray-600 capitalize">{key}:</span>
                        <span className="ml-2 font-medium text-gray-900">{value}"</span>
                      </div>
                    ))}
                    {(!measurement.measurements || Object.keys(measurement.measurements).length === 0) && (
                      <div className="col-span-2 text-sm text-gray-500">
                        No measurements available
                      </div>
                    )}
                  </div>
                </div>
              )) : (
                <div className="col-span-2 text-center py-8">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FiUser className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No measurements found</h3>
                  <p className="text-gray-600 mb-4">Please add your measurements first</p>
                  <button
                    onClick={() => navigate('/customer/measurements')}
                    className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors"
                  >
                    Add Measurements
                  </button>
                </div>
              )}
            </div>
            
            <div className="mt-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Delivery Address</h3>
              <div className="space-y-4">
                {addresses && addresses.length > 0 ? addresses.map((address) => (
                  <div
                    key={address._id}
                    onClick={() => handleAddressSelect(address)}
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      bookingData.addressId === address._id
                        ? 'border-amber-500 bg-amber-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-medium text-gray-900">{address.addressLine}</p>
                        <p className="text-sm text-gray-600">
                          {address.city}, {address.state} - {address.pincode}
                        </p>
                        <p className="text-sm text-gray-500">{address.landmark}</p>
                      </div>
                      {address.isDefault && (
                        <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs">
                          Default
                        </span>
                      )}
                    </div>
                  </div>
                )) : (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <FiMapPin className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No addresses found</h3>
                    <p className="text-gray-600 mb-4">Please add your delivery address first</p>
                    <button
                      onClick={() => navigate('/customer/addresses')}
                      className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors"
                    >
                      Add Address
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Review Your Booking</h2>
            
            {/* Service Summary */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Service Summary</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Service Type:</span>
                  <span className="font-medium text-gray-900 capitalize">{bookingData.serviceType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Garment:</span>
                  <span className="font-medium text-gray-900 capitalize">{bookingData.garmentType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Quantity:</span>
                  <span className="font-medium text-gray-900">{bookingData.quantity}</span>
                </div>
              </div>
            </div>

            {/* Tailor Info */}
            {selectedTailor && (
              <div className="bg-blue-50 rounded-lg p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Selected Tailor</h3>
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full flex items-center justify-center">
                    <FiUser className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{selectedTailor.firstname} {selectedTailor.lastname}</h4>
                    <p className="text-sm text-gray-600">{selectedTailor.shopName}</p>
                    <p className="text-sm text-gray-500">{selectedTailor.location}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Fabric Info */}
            {selectedFabric && (
              <div className="bg-green-50 rounded-lg p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Selected Fabric</h3>
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden">
                    <img
                      src={selectedFabric.images[0]}
                      alt={selectedFabric.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{selectedFabric.name}</h4>
                    <p className="text-sm text-gray-600">{selectedFabric.category} • {selectedFabric.pattern}</p>
                    <p className="text-sm text-gray-500">by {selectedFabric.seller.name}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Pricing */}
            <div className="bg-amber-50 rounded-lg p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Pricing Breakdown</h3>
              <div className="space-y-2">
                {selectedFabric && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Fabric ({bookingData.quantity}m):</span>
                    <span className="font-medium text-gray-900">₹{bookingData.fabricCost}</span>
                  </div>
                )}
                {selectedTailor && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tailoring:</span>
                    <span className="font-medium text-gray-900">₹{bookingData.tailoringCost}</span>
                  </div>
                )}
                <div className="border-t border-amber-200 pt-2">
                  <div className="flex justify-between">
                    <span className="font-semibold text-gray-900">Total:</span>
                    <span className="font-bold text-gray-900">₹{bookingData.totalCost}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Advance (30%):</span>
                    <span className="font-medium text-gray-900">₹{bookingData.advanceAmount}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Delivery Address */}
            {bookingData.deliveryAddress && (
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Delivery Address</h3>
                <div className="flex items-start space-x-2">
                  <FiMapPin className="w-5 h-5 text-gray-500 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">{bookingData.deliveryAddress.addressLine}</p>
                    <p className="text-sm text-gray-600">
                      {bookingData.deliveryAddress.city}, {bookingData.deliveryAddress.state} - {bookingData.deliveryAddress.pincode}
                    </p>
                    <p className="text-sm text-gray-500">{bookingData.deliveryAddress.landmark}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading booking form...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <FiArrowLeft className="w-5 h-5 mr-2" />
              Back
            </button>
            
            <h1 className="text-xl font-semibold text-gray-900">Create Booking</h1>
            
            <div className="text-sm text-gray-500">
              Step {currentStep} of 5
            </div>
          </div>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = currentStep === step.id;
              const isCompleted = currentStep > step.id;
              
              return (
                <div key={step.id} className="flex items-center">
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                    isCompleted
                      ? 'bg-amber-500 border-amber-500 text-white'
                      : isActive
                      ? 'border-amber-500 text-amber-500'
                      : 'border-gray-300 text-gray-400'
                  }`}>
                    {isCompleted ? (
                      <FiCheck className="w-5 h-5" />
                    ) : (
                      <Icon className="w-5 h-5" />
                    )}
                  </div>
                  <div className="ml-3">
                    <p className={`text-sm font-medium ${
                      isActive ? 'text-amber-600' : 'text-gray-500'
                    }`}>
                      {step.title}
                    </p>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`w-16 h-0.5 mx-4 ${
                      isCompleted ? 'bg-amber-500' : 'bg-gray-300'
                    }`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          {renderStepContent()}
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between mt-8">
          <button
            onClick={handlePrevious}
            disabled={currentStep === 1}
            className={`flex items-center px-6 py-3 rounded-lg font-medium transition-colors ${
              currentStep === 1
                ? 'text-gray-400 cursor-not-allowed'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <FiArrowLeft className="w-4 h-4 mr-2" />
            Previous
          </button>

          {currentStep < 5 ? (
            <button
              onClick={handleNext}
              className="flex items-center px-6 py-3 bg-amber-500 text-white rounded-lg font-medium hover:bg-amber-600 transition-colors"
            >
              Next
              <FiArrowRight className="w-4 h-4 ml-2" />
            </button>
          ) : (
            <button
              onClick={handleSubmitBooking}
              disabled={loading}
              className="flex items-center px-6 py-3 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition-colors disabled:opacity-50"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Creating Booking...
                </>
              ) : (
                <>
                  <FiCheck className="w-4 h-4 mr-2" />
                  Confirm Booking
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingFlow;