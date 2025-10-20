import React, { useState, useEffect, useMemo } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import {
  FiArrowLeft,
  FiArrowRight,
  FiCheck,
  FiUser,
  FiScissors,
  FiShoppingBag,
  FiPackage,
  FiPlus,
  FiMinus,
  FiHome,
  FiMail,
  FiPhone,
  FiMapPin,
  FiStar,
  FiClock,
  FiShield,
  FiHeart,
  FiSearch,
  FiFilter,
  FiShoppingCart,
  FiUser as FiUserIcon,
  FiSettings,
  FiLogOut,
  FiCamera,
} from "react-icons/fi";
import { apiCall } from "../../config/api";
import { useBooking } from "../../context/BookingContext";
import { useCart } from "../../context/CartContext";
import { loadRazorpayScript, createRazorpayInstance, createRazorpayOptions, handleRazorpayError } from "../../utils/razorpay";
import Swal from 'sweetalert2';
import AIMeasurementCapture from "../../components/AIMeasurementCapture";
import DesignSelection from "../../components/DesignSelection";
import EnhancedMeasurementForm from "../../components/EnhancedMeasurementForm";
import BookingCacheService from "../../utils/bookingCache";

// Header Component
const Header = ({ onNavigate }) => (
  <header className="bg-white shadow-lg border-b border-gray-200">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center h-16">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <h1 className="text-2xl font-bold text-gray-900">SewNova</h1>
          </div>
        </div>
        <nav className="hidden md:flex space-x-8">
          <button
            onClick={() => onNavigate('/customer/landing')}
            className="text-gray-700 hover:text-amber-600 px-3 py-2 rounded-md text-sm font-medium flex items-center"
          >
            <FiHome className="mr-2" />
            Home
          </button>
          <button
            onClick={() => onNavigate('/fabrics')}
            className="text-gray-700 hover:text-amber-600 px-3 py-2 rounded-md text-sm font-medium flex items-center"
          >
            <FiShoppingBag className="mr-2" />
            Fabrics
          </button>
          <button
            onClick={() => onNavigate('/tailors')}
            className="text-gray-700 hover:text-amber-600 px-3 py-2 rounded-md text-sm font-medium flex items-center"
          >
            <FiScissors className="mr-2" />
            Tailors
          </button>
        </nav>
        <div className="flex items-center space-x-4">
          <button className="text-gray-700 hover:text-amber-600 p-2">
            <FiShoppingCart className="h-5 w-5" />
          </button>
          <button className="text-gray-700 hover:text-amber-600 p-2">
            <FiUserIcon className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  </header>
);

// Footer Component
const Footer = () => (
  <footer className="bg-gray-900 text-white">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <h3 className="text-lg font-semibold mb-4">SewNova</h3>
          <p className="text-gray-400 mb-4">
            Your trusted partner for premium fabrics and expert tailoring services.
          </p>
          <div className="flex space-x-4">
            <button className="text-gray-400 hover:text-white">
              <FiMail className="h-5 w-5" />
            </button>
            <button className="text-gray-400 hover:text-white">
              <FiPhone className="h-5 w-5" />
            </button>
          </div>
        </div>
        <div>
          <h4 className="text-md font-semibold mb-4">Services</h4>
          <ul className="space-y-2 text-gray-400">
            <li>Custom Tailoring</li>
            <li>Fabric Selection</li>
            <li>Design Consultation</li>
            <li>Measurement Services</li>
          </ul>
        </div>
        <div>
          <h4 className="text-md font-semibold mb-4">Support</h4>
          <ul className="space-y-2 text-gray-400">
            <li>Help Center</li>
            <li>Contact Us</li>
            <li>Size Guide</li>
            <li>Returns & Exchanges</li>
          </ul>
        </div>
        <div>
          <h4 className="text-md font-semibold mb-4">Contact Info</h4>
          <div className="space-y-2 text-gray-400">
            <div className="flex items-center">
              <FiMapPin className="mr-2 h-4 w-4" />
              <span>123 Fashion Street, Mumbai</span>
            </div>
            <div className="flex items-center">
              <FiPhone className="mr-2 h-4 w-4" />
              <span>+91 98765 43210</span>
            </div>
            <div className="flex items-center">
              <FiMail className="mr-2 h-4 w-4" />
              <span>info@sewnova.com</span>
            </div>
          </div>
        </div>
      </div>
      <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
        <p>&copy; 2024 SewNova. All rights reserved.</p>
      </div>
    </div>
  </footer>
);

const BookingFlow = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const { state: bookingState, setServiceType, setCurrentStep: setFlowStep, setSelectedFabric: setCtxSelectedFabric } = useBooking();
  const { items } = useCart();

  // Booking data state
  const [bookingData, setBookingData] = useState({
    // Step 1: Fabric Selection
    selectedFabrics: [],
    
    // Step 2: Cart Review
    cartItems: [],
    
    // Step 3: Service Type Decision
    serviceType: null, // 'fabric-only' or 'fabric-tailor'
    
    // Step 4: Design Selection (for fabric+tailor)
    selectedDesign: null,
    designType: "", // 'custom', 'predefined'
    designInstructions: "",
    
    // Step 5: Tailor Selection (for fabric+tailor)
    tailorId: searchParams.get("tailorId") || null,
    
    // Step 6: Measurements (for fabric+tailor)
    measurementId: null,
    customMeasurements: {},
    
    // Step 7: Confirmation
    garmentType: "",
    quantity: 1,
    addressId: null,
    deliveryAddress: {},
    preferredDate: "",
    preferredTime: "",
    fabricCost: 0,
    tailoringCost: 0,
    totalCost: 0,
    advanceAmount: 0,
    notes: "",
  });

  const [availableTailors, setAvailableTailors] = useState([]);
  const [availableFabrics, setAvailableFabrics] = useState([]);
  const [measurements, setMeasurements] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [selectedTailor, setSelectedTailor] = useState(null);
  const [selectedFabric, setSelectedFabric] = useState(null);
  const [showAIMeasurement, setShowAIMeasurement] = useState(false);
  const [showEnhancedMeasurementForm, setShowEnhancedMeasurementForm] = useState(false);
  const [bookingCache] = useState(new BookingCacheService());
  const [isPaying, setIsPaying] = useState(false);
  const [paymentCompleted, setPaymentCompleted] = useState(false);

  const loadScript = (src) => {
    return new Promise((resolve) => {
      if (document.querySelector(`script[src="${src}"]`)) {
        return resolve(true);
      }
      const script = document.createElement('script');
      script.src = src;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const initiatePayment = async () => {
    try {
      if (!bookingData.addressId && !bookingData.deliveryAddress?._id) {
        alert('Please select a delivery address first.');
        return;
      }

      if (!bookingData.measurementId && (!bookingData.customMeasurements || Object.keys(bookingData.customMeasurements || {}).length === 0)) {
        alert('Please confirm your measurements first.');
        return;
      }

      setIsPaying(true);

      const loaded = await loadScript('https://checkout.razorpay.com/v1/checkout.js');
      if (!loaded) {
        alert('Failed to load payment SDK. Please check your internet connection.');
        setIsPaying(false);
        return;
      }

      const amountToPay = Number(bookingData.totalCost || bookingData.advanceAmount || 0);
      if (!amountToPay || amountToPay <= 0) {
        Swal.fire({
          icon: 'error',
          title: 'Invalid Amount',
          text: 'Please check the payment amount and try again.',
          confirmButtonText: 'OK'
        });
        setIsPaying(false);
        return;
      }

      // 1) Create Razorpay order (without creating booking first)
      const computedBookingType = (bookingData.serviceType === 'fabric-tailor' && bookingData.tailorId) ? 'complete' : 'fabric';
      
      const orderRes = await apiCall(
        "PAYMENT_SERVICE",
        "/api/payments/create-order",
        {
          method: "POST",
          body: { 
            amount: amountToPay, 
            currency: "INR", 
            notes: { 
              source: "booking-flow",
              bookingData: {
                bookingType: computedBookingType,
                tailorId: bookingData.tailorId || undefined,
                fabricId: bookingData.fabricId || undefined,
                measurementId: bookingData.measurementId || undefined,
                measurementSnapshot: (bookingData.customMeasurements && Object.keys(bookingData.customMeasurements).length > 0) ? bookingData.customMeasurements : undefined,
                addressId: bookingData.addressId || bookingData.deliveryAddress?._id,
                orderDetails: {
                  garmentType: bookingData.garmentType || 'other',
                  quantity: bookingData.quantity || 1,
                  designDescription: bookingData.designInstructions || bookingData.selectedDesign?.name || '',
                  specialInstructions: bookingData.notes || '',
                  deliveryDate: bookingData.preferredDate || new Date().toISOString()
                },
                pricing: {
                  fabricCost: bookingData.fabricCost || 0,
                  tailoringCost: bookingData.tailoringCost || 0,
                  totalAmount: amountToPay,
                  advanceAmount: amountToPay
                }
              }
            },
            userId: bookingData.customerId || "507f1f77bcf86cd799439012"
          }
        }
      );

      if (!orderRes?.success || !orderRes?.order?.id || !orderRes?.key) {
        Swal.fire({
          icon: 'error',
          title: 'Payment Order Failed',
          text: 'Could not create payment order. Please try again.',
          confirmButtonText: 'OK'
        });
        setIsPaying(false);
        return;
      }

      // Load Razorpay script and create instance
      try {
        await loadRazorpayScript();
        
        const options = createRazorpayOptions(
          orderRes,
          async function (response) {
            try {
              const verifyRes = await apiCall(
                "PAYMENT_SERVICE",
                "/api/payments/verify",
                {
                  method: "POST",
                  body: {
                    razorpay_order_id: response.razorpay_order_id,
                    razorpay_payment_id: response.razorpay_payment_id,
                    razorpay_signature: response.razorpay_signature
                  }
                }
              );

              if (verifyRes?.success) {
                // Clear booking cache and update UI
                clearBookingCache();
                setPaymentCompleted(true);
                setBookingData(prev => ({
                  ...prev,
                  paymentStatus: 'paid',
                  orderId: verifyRes.paymentId
                }));
                
                // Show success message and redirect
                Swal.fire({
                  icon: 'success',
                  title: 'Payment Successful!',
                  text: 'Your order has been placed successfully.',
                  confirmButtonText: 'View Dashboard',
                  showConfirmButton: true,
                  allowOutsideClick: false
                }).then(() => {
                  // Navigate to success page or dashboard
                  navigate('/dashboard/customer', { 
                    state: { 
                      paymentSuccess: true, 
                      orderId: verifyRes.paymentId,
                      message: 'Payment completed successfully!' 
                    }
                  });
                });
              } else {
                Swal.fire({
                  icon: 'error',
                  title: 'Payment Verification Failed',
                  text: 'Your payment could not be verified. Please try again.',
                  confirmButtonText: 'OK'
                });
              }
            } catch (e) {
              console.error('Payment verification error:', e);
              Swal.fire({
                icon: 'error',
                title: 'Payment Error',
                text: 'There was an error verifying payment. Please try again.',
                confirmButtonText: 'OK'
              });
            } finally {
              setIsPaying(false);
            }
          },
          (error) => {
            console.error('Payment error:', error);
            Swal.fire({
              icon: 'error',
              title: 'Payment Failed',
              text: handleRazorpayError(error),
              confirmButtonText: 'OK'
            });
            setIsPaying(false);
          },
          () => {
            console.log('Payment modal dismissed');
            setIsPaying(false);
          }
        );

        const rzp = await createRazorpayInstance(options);
        rzp.open();
      } catch (error) {
        console.error('Razorpay initialization error:', error);
        alert('Payment system is not available. Please refresh the page and try again.');
        setIsPaying(false);
      }
    } catch (err) {
      alert('Unable to start payment. Please try again.');
      setIsPaying(false);
    }
  };

  useEffect(() => {
    fetchInitialData();
    loadBookingProgress();
  }, []);

  useEffect(() => {
    if (location.state?.fromCheckout) {
      setCurrentStep(2);
      setBookingData((prev) => ({ ...prev, serviceType: "complete" }));
    }
    
    // Handle resume from cart
    if (location.state?.resume) {
      loadBookingProgress();
    }
  }, [location.state]);

  // Load saved booking progress
  const loadBookingProgress = () => {
    const savedProgress = bookingCache.getBookingProgress();
    if (savedProgress) {
      setBookingData(savedProgress);
      setCurrentStep(savedProgress.currentStep || 1);
      
      // Restore selected items
      if (savedProgress.selectedFabric) {
        setSelectedFabric(savedProgress.selectedFabric);
      }
      if (savedProgress.selectedTailor) {
        setSelectedTailor(savedProgress.selectedTailor);
      }
    }
  };

  // Save booking progress
  const saveBookingProgress = () => {
    const progressData = {
      ...bookingData,
      currentStep,
      selectedFabric,
      selectedTailor
    };
    
    bookingCache.saveBookingProgress(progressData);
  };

  // Auto-save on data changes
  useEffect(() => {
    if (bookingData.selectedFabric || bookingData.serviceType) {
      saveBookingProgress();
    }
  }, [bookingData, currentStep, selectedFabric, selectedTailor]);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      let fabricsRaw = [];

      // Fetch tailors
      try {
        const tailorsResponse = await apiCall(
          "TAILOR_SERVICE",
          "/api/public/tailors?limit=20&isVerified=true",
          { method: "GET" }
        );
        if (tailorsResponse.success && tailorsResponse.data) {
          setAvailableTailors(
            tailorsResponse.data.map((t) => ({
              _id: t._id,
              firstname: t.firstname,
              lastname: t.lastname,
              shopName: t.shopName,
              rating: t.rating || 4.0,
              experience: t.experience || 0,
              services: t.services || [
                { name: "Custom Tailoring", price: t.basePrice || 2000 },
              ],
            }))
          );
        }
      } catch {
        setAvailableTailors([]);
      }

      // Fetch fabrics
      try {
        const fabricsResponse = await apiCall(
          "SELLER_SERVICE",
          "/api/public/products?limit=20&isActive=true",
          { method: "GET" }
        );
        if (fabricsResponse.success && fabricsResponse.data) {
          fabricsRaw = fabricsResponse.data;
          setAvailableFabrics(
            fabricsResponse.data.map((f) => ({
              _id: f._id,
              name: f.name,
              price: f.price,
              color: f.color,
              category: f.category,
              images: Array.isArray(f.images) ? f.images.map((img) => (img?.url ? img.url : img)) : [],
              seller: f.seller?.name || "Unknown",
            }))
          );
        }
      } catch {
        setAvailableFabrics([]);
      }

      // If fabric was preselected (from Cart or Tailor profile), set it
      const preselectedId = location.state?.preselectedFabricId || bookingState.selectedFabricId || null;
      if (preselectedId) {
        const match = fabricsRaw?.find((f) => f._id === preselectedId);
        if (match) {
          setSelectedFabric(match);
          setBookingData((p) => ({ ...p, fabricId: match._id, fabricCost: match.price, serviceType: "fabric-tailor" }));
        } else {
          // Fallback to cart items if available with same id shape
          const cartFabric = items.find((it) => it.type === "fabric" && (it._id === preselectedId || it.id === preselectedId));
          if (cartFabric) {
            const candidate = {
              _id: cartFabric._id || cartFabric.id,
              name: cartFabric.name,
              price: cartFabric.price,
              color: cartFabric.color,
              category: cartFabric.category,
              images: Array.isArray(cartFabric.images)
                ? cartFabric.images.map((img) => (img?.url ? img.url : img))
                : cartFabric.image
                ? [cartFabric.image]
                : [],
              seller: cartFabric.seller?.name || cartFabric.seller || "Unknown",
            };
            setSelectedFabric(candidate);
            setBookingData((p) => ({ ...p, fabricId: candidate._id, fabricCost: candidate.price, serviceType: "fabric-tailor" }));
          }
        }
        setServiceType("fabric-tailor");
        setFlowStep(1);
      }

      // Measurements
      try {
        const mRes = await apiCall("CUSTOMER_SERVICE", "/api/measurements", {
          method: "GET",
        });
        if (mRes.success && mRes.data) setMeasurements(mRes.data);
      } catch {
        setMeasurements([
          {
            _id: "default",
            measurementName: "Standard",
            measurements: { chest: 42, waist: 36 },
          },
        ]);
      }

      // Addresses
      try {
        const aRes = await apiCall("CUSTOMER_SERVICE", "/api/addresses", {
          method: "GET",
        });
        if (aRes.success && aRes.data) setAddresses(aRes.data);
      } catch {
        setAddresses([
          {
            _id: "default",
            addressLine: "Add your address",
            city: "City",
            state: "State",
            pincode: "000000",
            isDefault: true,
          },
        ]);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
      saveBookingProgress();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      saveBookingProgress();
    }
  };

  // Clear booking cache when order is confirmed
  const clearBookingCache = () => {
    bookingCache.clearBookingProgress();
  };

  const handleTailorSelect = (t) => {
    setSelectedTailor(t);
    setBookingData((p) => ({
      ...p,
      tailorId: t._id,
      tailoringCost: t.services[0]?.price || 0,
    }));
  };

  const handleFabricSelect = (f) => {
    setSelectedFabric(f);
    setBookingData((p) => ({
      ...p,
      fabricId: f._id,
      fabricCost: f.price,
    }));
  };

  const calculateTotal = () => {
    const fabricCost = selectedFabric
      ? selectedFabric.price * bookingData.quantity
      : 0;
    const tailoringCost = selectedTailor?.services[0]?.price || 0;
    const total = fabricCost + tailoringCost;
    setBookingData((p) => ({
      ...p,
      fabricCost,
      tailoringCost,
      totalCost: total,
      advanceAmount: Math.round(total * 0.3),
    }));
  };

  useEffect(() => {
    calculateTotal();
  }, [selectedFabric, selectedTailor, bookingData.quantity]);

  // Define steps based on the new flow
  const getSteps = () => {
    const baseSteps = [
      { id: 1, title: "Select Fabric", icon: FiShoppingBag, description: "Choose or confirm your fabric" },
      { id: 2, title: "Review Cart", icon: FiShoppingCart, description: "Review your fabric selection" },
    ];

    if (bookingData.serviceType === 'fabric-tailor') {
      return [
        ...baseSteps,
        { id: 3, title: "Select Design", icon: FiPackage, description: "Choose your design preference" },
        { id: 4, title: "Choose Tailor", icon: FiScissors, description: "Select your preferred tailor" },
        { id: 5, title: "Measurements", icon: FiUser, description: "Provide your measurements" },
        { id: 6, title: "Delivery Address", icon: FiHome, description: "Select delivery address" },
        { id: 7, title: "Confirm Order", icon: FiCheck, description: "Review and confirm your order" },
      ];
    } else if (bookingData.serviceType === 'fabric-only') {
      return [
        ...baseSteps,
        { id: 3, title: "Delivery Address", icon: FiHome, description: "Select delivery address" },
        { id: 4, title: "Confirm Order", icon: FiCheck, description: "Review and confirm your order" },
      ];
    }

    return baseSteps;
  };

  const steps = getSteps();

  const cartFabrics = useMemo(() => items.filter((it) => it.type === "fabric"), [items]);

  const renderStepContent = () => {
    const currentStepTitle = steps[currentStep - 1]?.title;
    
    switch (currentStepTitle) {
      case "Select Fabric":
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Choose Your Fabric</h2>
              {selectedFabric ? (
                <p className="text-gray-700">
                  Fabric Selected: <span className="font-semibold">{selectedFabric.name}</span>
                </p>
              ) : (
                <p className="text-gray-600">Select the fabric to continue</p>
              )}
              {selectedFabric && (
                <button
                  onClick={() => { setSelectedFabric(null); setCtxSelectedFabric(null); setBookingData((p) => ({ ...p, fabricId: null, fabricCost: 0 })); }}
                  className="mt-3 inline-flex items-center px-3 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Change Fabric
                </button>
              )}
            </div>
            
            {!selectedFabric && (
            <>
            {cartFabrics.length > 0 && (
              <div className="bg-white rounded-lg shadow-md p-4">
                <h3 className="text-lg font-semibold mb-3">Your Cart Fabrics</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {cartFabrics.map((cf) => (
                    <div key={cf.id} className="border rounded-lg p-3 cursor-pointer hover:shadow" onClick={() => {
                      const candidate = { _id: cf._id || cf.id, name: cf.name, price: cf.price, color: cf.color, category: cf.category, images: Array.isArray(cf.images) ? cf.images.map((img) => (img?.url ? img.url : img)) : (cf.image ? [cf.image] : []) };
                      setSelectedFabric(candidate);
                      setCtxSelectedFabric(candidate._id);
                      setBookingData((p) => ({ ...p, fabricId: candidate._id, fabricCost: candidate.price }));
                    }}>
                      <div className="aspect-w-16 aspect-h-12 mb-2">
                        <img src={(Array.isArray(cf.images) && (cf.images[0]?.url || cf.images[0])) || cf.image || '/placeholder-fabric.jpg'} alt={cf.name} className="w-full h-32 object-cover rounded" />
                      </div>
                      <div className="font-medium">{cf.name}</div>
                      <div className="text-sm text-gray-600">₹{cf.price}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-2">
              {availableFabrics.map((fabric) => (
                <div
                  key={fabric._id}
                  className={`bg-white rounded-lg shadow-md border-2 transition-all duration-200 cursor-pointer hover:shadow-lg ${
                    bookingData.selectedFabrics.some(f => f._id === fabric._id)
                      ? "border-amber-500 shadow-lg"
                      : "border-gray-200"
                  }`}
                  onClick={() => {
                    setSelectedFabric(fabric);
                    setCtxSelectedFabric(fabric._id);
                    setBookingData(prev => ({ ...prev, fabricId: fabric._id, fabricCost: fabric.price }));
                  }}
                >
                  <div className="p-4">
                    <div className="aspect-w-16 aspect-h-12 mb-4">
                      <img
                        src={(Array.isArray(fabric.images) && fabric.images[0]) || fabric.image || '/placeholder-fabric.jpg'}
                        alt={fabric.name}
                        className="w-full h-48 object-cover rounded-lg"
                      />
                    </div>
                    <h3 className="font-semibold text-lg text-gray-900 mb-2">{fabric.name}</h3>
                    <p className="text-gray-600 text-sm mb-2">Color: {fabric.color}</p>
                    <p className="text-gray-600 text-sm mb-2">Category: {fabric.category}</p>
                    <p className="text-gray-600 text-sm mb-3">Seller: {fabric.seller}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-2xl font-bold text-amber-600">₹{fabric.price}</span>
                      {bookingData.fabricId === fabric._id && (
                        <div className="bg-amber-100 text-amber-800 px-2 py-1 rounded-full text-sm font-medium">Selected</div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            </>) }
          </div>
        );

      case "Review Cart":
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Review Your Cart</h2>
              <p className="text-gray-600">Review your fabric selection and choose your service type</p>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold mb-4">Selected Fabrics</h3>
              {selectedFabric ? (
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <img
                      src={(Array.isArray(selectedFabric.images) && (selectedFabric.images[0]?.url || selectedFabric.images[0])) || selectedFabric.image || '/placeholder-fabric.jpg'}
                      alt={selectedFabric.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div>
                      <h4 className="font-medium">{selectedFabric.name}</h4>
                      <p className="text-gray-600 text-sm">{selectedFabric.color} • {selectedFabric.category}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => {
                          if (bookingData.quantity > 1) {
                            setBookingData(prev => ({ ...prev, quantity: prev.quantity - 1 }));
                          }
                        }}
                        className="p-1 rounded-full hover:bg-gray-100"
                      >
                        <FiMinus className="h-4 w-4" />
                      </button>
                      <span className="min-w-[3rem] text-center">{bookingData.quantity} m</span>
                      <button
                        onClick={() => setBookingData(prev => ({ ...prev, quantity: prev.quantity + 1 }))}
                        className="p-1 rounded-full hover:bg-gray-100"
                      >
                        <FiPlus className="h-4 w-4" />
                      </button>
                    </div>
                    <span className="font-semibold">₹{(selectedFabric.price || 0) * (bookingData.quantity || 1)}</span>
                  </div>
                </div>
              ) : bookingData.selectedFabrics.length === 0 ? (
                <p className="text-gray-500">No fabrics selected</p>
              ) : (
                <div className="space-y-4">
                  {bookingData.selectedFabrics.map((fabric, index) => (
                    <div key={fabric._id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <img
                          src={(Array.isArray(fabric.images) && (fabric.images[0]?.url || fabric.images[0])) || fabric.image || '/placeholder-fabric.jpg'}
                          alt={fabric.name}
                          className="w-16 h-16 object-cover rounded"
                        />
                        <div>
                          <h4 className="font-medium">{fabric.name}</h4>
                          <p className="text-gray-600 text-sm">{fabric.color} • {fabric.category}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => {
                              if (fabric.quantity > 1) {
                                const updatedFabrics = [...bookingData.selectedFabrics];
                                updatedFabrics[index].quantity -= 1;
                                setBookingData(prev => ({ ...prev, selectedFabrics: updatedFabrics }));
                              }
                            }}
                            className="p-1 rounded-full hover:bg-gray-100"
                          >
                            <FiMinus className="h-4 w-4" />
                          </button>
                          <span className="min-w-[3rem] text-center">{fabric.quantity} m</span>
                          <button
                            onClick={() => {
                              const updatedFabrics = [...bookingData.selectedFabrics];
                              updatedFabrics[index].quantity += 1;
                              setBookingData(prev => ({ ...prev, selectedFabrics: updatedFabrics }));
                            }}
                            className="p-1 rounded-full hover:bg-gray-100"
                          >
                            <FiPlus className="h-4 w-4" />
                          </button>
                        </div>
                        <span className="font-semibold">₹{fabric.price * fabric.quantity}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold mb-4">Choose Service Type</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  onClick={() => setBookingData(prev => ({ ...prev, serviceType: 'fabric-only' }))}
                  className={`p-6 border-2 rounded-lg text-left transition-all duration-200 ${
                    bookingData.serviceType === 'fabric-only'
                      ? 'border-amber-500 bg-amber-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <FiShoppingBag className="h-8 w-8 text-amber-600" />
                    <div>
                      <h4 className="font-semibold text-lg">Fabric Only</h4>
                      <p className="text-gray-600">Just the fabrics, no tailoring</p>
                    </div>
                  </div>
                </button>
                
                <button
                  onClick={() => setBookingData(prev => ({ ...prev, serviceType: 'fabric-tailor' }))}
                  className={`p-6 border-2 rounded-lg text-left transition-all duration-200 ${
                    bookingData.serviceType === 'fabric-tailor'
                      ? 'border-amber-500 bg-amber-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <FiScissors className="h-8 w-8 text-amber-600" />
                    <div>
                      <h4 className="font-semibold text-lg">Fabric + Tailoring</h4>
                      <p className="text-gray-600">Fabrics with custom tailoring</p>
                    </div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        );

      case "Select Design":
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Choose Your Design</h2>
              <p className="text-gray-600">Select from our curated collection of designs from the database</p>
            </div>
            
            {/* Design Type Selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <button
                onClick={() => setBookingData(prev => ({ ...prev, designType: 'predefined' }))}
                className={`p-6 border-2 rounded-lg text-left transition-all duration-200 ${
                  bookingData.designType === 'predefined'
                    ? 'border-amber-500 bg-amber-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <h3 className="text-xl font-semibold mb-2">Predefined Designs</h3>
                <p className="text-gray-600">Choose from our curated collection of designs</p>
              </button>
              
              <button
                onClick={() => setBookingData(prev => ({ ...prev, designType: 'custom' }))}
                className={`p-6 border-2 rounded-lg text-left transition-all duration-200 ${
                  bookingData.designType === 'custom'
                    ? 'border-amber-500 bg-amber-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <h3 className="text-xl font-semibold mb-2">Custom Design</h3>
                <p className="text-gray-600">Describe your custom design requirements</p>
              </button>
            </div>

            {/* Predefined Design Selection */}
            {bookingData.designType === 'predefined' && (
              <div className="space-y-6">
                <DesignSelection 
                  onDesignSelect={(design) => {
                    console.log('Selected design in booking flow:', design);
                    setBookingData(prev => ({ 
                      ...prev, 
                      selectedDesign: design,
                      designType: 'predefined'
                    }));
                  }}
                  selectedDesignId={bookingData.selectedDesign?._id}
                />
                
                {bookingData.selectedDesign && (
                  <div className="bg-white rounded-lg shadow-md p-6 border-2 border-amber-500">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">
                        Selected Design
                      </h3>
                      <button
                        onClick={() => setBookingData(prev => ({ ...prev, selectedDesign: null }))}
                        className="text-sm text-amber-600 hover:text-amber-800 transition-colors"
                      >
                        Change Selection
                      </button>
                    </div>
                    
                    <div className="flex items-start space-x-4">
                      <img
                        src={bookingData.selectedDesign.image}
                        alt={bookingData.selectedDesign.name}
                        className="w-24 h-32 object-cover rounded-lg"
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/96x128?text=Design+Image';
                        }}
                      />
                      
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 mb-2">
                          {bookingData.selectedDesign.name}
                        </h4>
                        <p className="text-sm text-gray-600 mb-2">
                          {bookingData.selectedDesign.description}
                        </p>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span className="capitalize">{bookingData.selectedDesign.category}</span>
                          <span className="capitalize">{bookingData.selectedDesign.difficulty}</span>
                          {bookingData.selectedDesign.price && (
                            <span className="font-medium text-green-600">
                              ${bookingData.selectedDesign.price}
                            </span>
                          )}
                        </div>
                        {bookingData.selectedDesign.sizeCriteria && bookingData.selectedDesign.sizeCriteria.length > 0 && (
                          <div className="mt-2">
                            <span className="text-xs text-blue-600">
                              Size criteria: {bookingData.selectedDesign.sizeCriteria.join(', ')}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Custom Design Input */}
            {bookingData.designType === 'custom' && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Design Instructions
                </label>
                <textarea
                  value={bookingData.designInstructions}
                  onChange={(e) => setBookingData(prev => ({ ...prev, designInstructions: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  rows={4}
                  placeholder="Describe your custom design requirements..."
                />
              </div>
            )}
          </div>
        );

      case "Choose Tailor":
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Select Your Tailor</h2>
              <p className="text-gray-600">Choose from our verified and experienced tailors</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {availableTailors.map((tailor) => (
                <div
                  key={tailor._id}
                  className={`bg-white rounded-lg shadow-md border-2 transition-all duration-200 cursor-pointer hover:shadow-lg ${
                    bookingData.tailorId === tailor._id
                      ? "border-amber-500 shadow-lg"
                      : "border-gray-200"
                  }`}
                  onClick={() => setBookingData(prev => ({ ...prev, tailorId: tailor._id }))}
                >
                  <div className="p-6">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
                        <FiScissors className="h-6 w-6 text-amber-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">{tailor.shopName}</h3>
                        <p className="text-gray-600">{tailor.firstname} {tailor.lastname}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center space-x-2">
                        <FiStar className="h-4 w-4 text-yellow-500" />
                        <span className="text-sm text-gray-600">{tailor.rating}/5.0</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <FiClock className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-600">{tailor.experience} years experience</span>
                      </div>
                    </div>
                    
                    <div className="border-t pt-4">
                      <div className="flex justify-between items-center">
                        <span className="text-2xl font-bold text-amber-600">₹{tailor.services[0]?.price}</span>
                        {bookingData.tailorId === tailor._id && (
                          <div className="bg-amber-100 text-amber-800 px-2 py-1 rounded-full text-sm font-medium">
                            Selected
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case "Measurements":
        // If we have a selected design with measurement requirements, show enhanced form
        if (bookingData.selectedDesign && bookingData.selectedDesign.measurementDetails && bookingData.selectedDesign.measurementDetails.length > 0) {
          return (
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Your Measurements</h2>
                <p className="text-gray-600">Provide your measurements for the selected design</p>
              </div>

              <EnhancedMeasurementForm
                design={bookingData.selectedDesign}
                onMeasurementSubmit={(measurementData, savedMeasurement) => {
                  console.log('Measurements submitted:', measurementData);
                  console.log('Saved measurement:', savedMeasurement);
                  
                  // Update booking data with measurements
                  setBookingData(prev => ({
                    ...prev,
                    measurementId: savedMeasurement?._id || savedMeasurement?.id,
                    customMeasurements: measurementData
                  }));
                  
                  // Move to next step
                  handleNext();
                }}
                onCancel={() => {
                  setShowEnhancedMeasurementForm(false);
                  // Go back to design selection
                  setCurrentStep(3); // Design selection step
                }}
              />
            </div>
          );
        }

        // Fallback to simple measurement selection for designs without specific requirements
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Your Measurements</h2>
              <p className="text-gray-600">Select your measurements or use AI to generate them</p>
            </div>

            {/* AI Measurement Option */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="bg-blue-100 p-3 rounded-full">
                    <FiCamera className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">AI Body Measurement</h3>
                    <p className="text-sm text-gray-600">Get accurate measurements using AI technology</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowAIMeasurement(true)}
                  className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center space-x-2"
                >
                  <FiCamera className="w-4 h-4" />
                  <span>Start AI Measurement</span>
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {measurements.map((measurement) => (
                <div
                  key={measurement._id}
                  className={`p-6 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                    bookingData.measurementId === measurement._id
                      ? "border-amber-500 bg-amber-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  onClick={() => setBookingData(prev => ({ ...prev, measurementId: measurement._id }))}
                >
                  <h3 className="font-semibold text-lg mb-2">{measurement.measurementName}</h3>
                  <div className="space-y-1">
                    {Object.entries(measurement.measurements || {}).map(([key, value]) => (
                      <div key={key} className="flex justify-between text-sm text-gray-600">
                        <span className="capitalize">{key}:</span>
                        <span>{value}"</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* AI Measurement Modal */}
            {showAIMeasurement && (
              <AIMeasurementCapture
                onMeasurementsGenerated={(measurements, savedMeasurement) => {
                  if (savedMeasurement) {
                    // Refresh measurements list
                    fetchInitialData();
                    setBookingData(prev => ({ 
                      ...prev, 
                      measurementId: savedMeasurement._id || savedMeasurement.id 
                    }));
                  }
                  setShowAIMeasurement(false);
                }}
                onClose={() => setShowAIMeasurement(false)}
                customerId={null} // TODO: Get from auth context when available
              />
            )}
          </div>
        );

      case "Delivery Address":
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Delivery Address</h2>
              <p className="text-gray-600">Choose an address for delivery</p>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => navigate('/customer/addresses')}
                className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 text-sm"
              >
                Manage Addresses
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {addresses.map((addr) => (
                <div
                  key={addr._id}
                  className={`p-6 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                    bookingData.addressId === addr._id
                      ? "border-amber-500 bg-amber-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  onClick={() => setBookingData(prev => ({ ...prev, addressId: addr._id, deliveryAddress: addr }))}
                >
                  <div className="flex items-start space-x-3">
                    <FiMapPin className="mt-1 h-5 w-5 text-amber-600" />
                    <div>
                      <div className="font-semibold text-gray-900">{addr.addressLine || addr.name || 'Address'}</div>
                      <div className="text-sm text-gray-600">{addr.city}, {addr.state} - {addr.pincode}</div>
                      {addr.isDefault && (
                        <div className="mt-1 inline-block text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">Default</div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case "Confirm Order":
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Confirm Your Order</h2>
              <p className="text-gray-600">Review all details before placing your order</p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-6">
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-xl font-semibold mb-4">Order Summary</h3>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium">Fabrics</h4>
                      {bookingData.selectedFabrics.map((fabric) => (
                        <div key={fabric._id} className="flex justify-between text-sm text-gray-600 ml-4">
                          <span>{fabric.name} x {fabric.quantity} m</span>
                          <span>₹{fabric.price * fabric.quantity}</span>
                        </div>
                      ))}
                    </div>
                    
                    {bookingData.serviceType === 'fabric-tailor' && (
                      <>
                        <div>
                          <h4 className="font-medium">Tailoring</h4>
                          <div className="flex justify-between text-sm text-gray-600 ml-4">
                            <span>Custom tailoring</span>
                            <span>₹{selectedTailor?.services[0]?.price || 0}</span>
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="font-medium">Design</h4>
                          <div className="text-sm text-gray-600 ml-4">
                            {bookingData.designType === 'custom' ? (
                              <div>
                                <div>Custom Design</div>
                                {bookingData.designInstructions && (
                                  <div className="mt-1 text-xs text-gray-500">
                                    "{bookingData.designInstructions.substring(0, 50)}..."
                                  </div>
                                )}
                              </div>
                            ) : bookingData.selectedDesign ? (
                              <div>
                                <div>Predefined Design: {bookingData.selectedDesign.name}</div>
                                <div className="text-xs text-gray-500 mt-1">
                                  {bookingData.selectedDesign.category} • {bookingData.selectedDesign.difficulty}
                                </div>
                                {bookingData.selectedDesign.sizeCriteria && bookingData.selectedDesign.sizeCriteria.length > 0 && (
                                  <div className="text-xs text-blue-600 mt-1">
                                    Size criteria: {bookingData.selectedDesign.sizeCriteria.join(', ')}
                                  </div>
                                )}
                              </div>
                            ) : (
                              'No design selected'
                            )}
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="space-y-6">
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-xl font-semibold mb-4">Order Total</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Fabric Cost:</span>
                      <span>₹{bookingData.fabricCost}</span>
                    </div>
                    {bookingData.serviceType === 'fabric-tailor' && (
                      <div className="flex justify-between">
                        <span>Tailoring Cost:</span>
                        <span>₹{bookingData.tailoringCost}</span>
                      </div>
                    )}
                    <div className="border-t pt-2">
                      <div className="flex justify-between font-semibold text-lg">
                        <span>Total:</span>
                        <span>₹{bookingData.totalCost}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-xl font-semibold mb-4">Delivery Address</h3>
                  {bookingData.deliveryAddress && bookingData.deliveryAddress._id ? (
                    <div className="text-sm text-gray-700">
                      <div className="font-medium">{bookingData.deliveryAddress.addressLine || 'Address'}</div>
                      <div>{bookingData.deliveryAddress.city}, {bookingData.deliveryAddress.state} - {bookingData.deliveryAddress.pincode}</div>
                    </div>
                  ) : (
                    <div className="text-sm text-gray-500">No address selected. Please go back and select an address.</div>
                  )}
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {paymentCompleted ? (
                    <div className="w-full py-3 px-6 rounded-lg font-semibold bg-green-100 text-green-800 border border-green-200 text-center">
                      ✅ Payment Completed
                    </div>
                  ) : (
                    <button 
                      onClick={initiatePayment}
                      disabled={isPaying}
                      className={`w-full py-3 px-6 rounded-lg font-semibold transition-colors ${isPaying ? 'bg-amber-300 text-white' : 'bg-amber-600 text-white hover:bg-amber-700'}`}
                    >
                      {isPaying ? 'Processing...' : 'Pay Now'}
                    </button>
                  )}
                  <button 
                    onClick={() => {
                      console.log('Placing order without upfront payment:', bookingData);
                      clearBookingCache();
                    }}
                    className="w-full bg-gray-100 text-gray-800 py-3 px-6 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
                  >
                    Place Order
                  </button>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onNavigate={navigate} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-200 ${
                      currentStep > step.id
                        ? "bg-amber-600 border-amber-600 text-white"
                        : currentStep === step.id
                        ? "bg-amber-100 border-amber-600 text-amber-600"
                        : "bg-white border-gray-300 text-gray-400"
                    }`}
                  >
                    {currentStep > step.id ? (
                      <FiCheck className="h-6 w-6" />
                    ) : (
                      <step.icon className="h-6 w-6" />
                    )}
                  </div>
                  <div className="mt-2 text-center">
                    <p className={`text-sm font-medium ${
                      currentStep >= step.id ? "text-gray-900" : "text-gray-400"
                    }`}>
                      {step.title}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">{step.description}</p>
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-4 ${
                    currentStep > step.id ? "bg-amber-600" : "bg-gray-300"
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
            </div>
          ) : (
            <>
              {renderStepContent()}

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
                <div>
                  {currentStep > 1 && (
                    <button
                      onClick={handlePrevious}
                      className="flex items-center px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      <FiArrowLeft className="mr-2" />
                      Back
                    </button>
                  )}
                </div>
                
                <div className="flex space-x-4">
                  {currentStep < steps.length && (
                    <button
                      onClick={handleNext}
                      className="flex items-center px-6 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
                    >
                      Next
                      <FiArrowRight className="ml-2" />
                    </button>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default BookingFlow;
