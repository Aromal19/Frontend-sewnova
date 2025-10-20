import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  FiTrash2, 
  FiPlus, 
  FiMinus, 
  FiShoppingBag, 
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
  FiArrowLeft,
  FiArrowRight,
  FiCheck,
  FiScissors,
  FiPackage,
  FiUser,
} from "react-icons/fi";
import { useCart } from "../../context/CartContext";
import { useBooking } from "../../context/BookingContext";
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

const Cart = () => {
  const navigate = useNavigate();
  const { items, removeItem, updateQuantity, totals } = useCart();
  const { setSelectedFabric, setServiceType, setCurrentStep } = useBooking();
  const [bookingCache] = useState(new BookingCacheService());
  const [pendingBooking, setPendingBooking] = useState(null);

  useEffect(() => {
    const pending = bookingCache.getPendingBooking();
    setPendingBooking(pending);
  }, []);

  const proceedToCheckout = () => {
    navigate("/customer/checkout");
  };

  const proceedToBooking = () => {
    setServiceType("fabric-tailor");
    setCurrentStep(1);
    navigate("/customer/booking/create");
  };

  const handleBookTailorForFabric = (fabricItem) => {
    setServiceType("fabric-tailor");
    setSelectedFabric(fabricItem.id);
    setCurrentStep(1);
    navigate("/customer/booking/create", { state: { preselectedFabricId: fabricItem.id } });
  };

  if (!items.length) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header onNavigate={navigate} />
        <div className="flex items-center justify-center p-6 flex-1">
          <div className="text-center">
            <div className="w-24 h-24 bg-white rounded-full shadow-lg flex items-center justify-center mx-auto mb-6">
              <FiShoppingBag className="w-12 h-12 text-amber-500" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
            <p className="text-gray-600 mb-8 text-lg">Browse our premium fabrics to add items to your cart</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => navigate("/customer/fabrics")} 
                className="px-8 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors font-semibold flex items-center justify-center"
              >
                <FiShoppingBag className="mr-2" />
                Browse Fabrics
              </button>
              <button 
                onClick={() => navigate("/customer/tailors")} 
                className="px-8 py-3 bg-white text-amber-600 border-2 border-amber-600 rounded-lg hover:bg-amber-50 transition-colors font-semibold flex items-center justify-center"
              >
                <FiScissors className="mr-2" />
                Find Tailors
              </button>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onNavigate={navigate} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Your Shopping Cart</h1>
          <p className="text-gray-600 text-lg">Review your selected items and proceed to checkout</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            {/* Pending Booking */}
            {pendingBooking && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <FiScissors className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-blue-900 mb-1">
                        {pendingBooking.name}
                      </h3>
                      <p className="text-sm text-blue-700 mb-2">
                        {pendingBooking.description}
                      </p>
                      <div className="flex items-center space-x-4 text-xs text-blue-600">
                        <span>Status: Pending</span>
                        <span>₹{pendingBooking.price}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col space-y-2">
                    <button
                      onClick={() => navigate('/customer/booking/create', { state: { resume: true } })}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                    >
                      Continue Order
                    </button>
                    <button
                      onClick={() => {
                        bookingCache.clearBookingProgress();
                        setPendingBooking(null);
                      }}
                      className="px-4 py-2 border border-blue-300 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors text-sm"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}

            {items.map((item) => (
              <div key={`${item.type}-${item.id}`} className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
                <div className="flex items-start space-x-4">
                  <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                    {item.image ? (
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                        <FiShoppingBag className="w-8 h-8 text-gray-400" />
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{item.name}</h3>
                    <p className="text-sm text-gray-500 capitalize mb-3">{item.type}</p>
                    
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="flex items-center space-x-2">
                        <button 
                          onClick={() => updateQuantity(item.id, item.type, (item.quantity || 1) - 1)} 
                          className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          <FiMinus className="w-4 h-4" />
                        </button>
                        <span className="px-4 py-2 border border-gray-300 rounded-lg min-w-[3rem] text-center font-medium">
                          {item.quantity || 1}
                        </span>
                        <button 
                          onClick={() => updateQuantity(item.id, item.type, (item.quantity || 1) + 1)} 
                          className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          <FiPlus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {item.type === "fabric" && (
                      <div className="mt-2">
                        <button
                          onClick={() => handleBookTailorForFabric(item)}
                          className="inline-flex items-center px-4 py-2 border-2 border-amber-600 text-amber-700 rounded-lg hover:bg-amber-50"
                        >
                          <FiScissors className="mr-2" />
                          Book Tailor
                        </button>
                      </div>
                    )}
                  </div>
                  
                  <div className="text-right">
                    <div className="text-2xl font-bold text-gray-900 mb-2">
                      ₹{(item.price || 0) * (item.quantity || 1)}
                    </div>
                    <button 
                      onClick={() => removeItem(item.id, item.type)} 
                      className="text-red-600 hover:text-red-700 inline-flex items-center text-sm font-medium transition-colors"
                    >
                      <FiTrash2 className="w-4 h-4 mr-1" /> 
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Order Summary</h2>
              
              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal ({items.length} items)</span>
                  <span className="font-medium text-gray-900">₹{totals.subtotal}</span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium text-gray-900">Free</span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tax</span>
                  <span className="font-medium text-gray-900">₹0</span>
                </div>
                
                <div className="border-t pt-4">
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Total</span>
                    <span className="text-amber-600">₹{totals.total}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4">
              <button 
                onClick={proceedToCheckout} 
                className="w-full px-6 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors font-semibold text-lg flex items-center justify-center"
              >
                <FiCheck className="mr-2" />
                Proceed to Checkout
              </button>
              
              <button 
                onClick={proceedToBooking} 
                className="w-full px-6 py-3 bg-white text-amber-600 border-2 border-amber-600 rounded-lg hover:bg-amber-50 transition-colors font-semibold text-lg flex items-center justify-center"
              >
                <FiScissors className="mr-2" />
                Book with Tailor
              </button>
            </div>

            {/* Continue Shopping */}
            <div className="text-center">
              <button 
                onClick={() => navigate("/customer/fabrics")} 
                className="text-amber-600 hover:text-amber-700 font-medium flex items-center justify-center mx-auto"
              >
                <FiArrowLeft className="mr-2" />
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Cart;

