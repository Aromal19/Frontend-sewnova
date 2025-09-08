import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  FiArrowLeft, 
  FiHeart, 
  FiShare2, 
  FiStar, 
  FiMapPin, 
  FiPhone, 
  FiMail, 
  FiClock,
  FiCheckCircle,
  FiUser,
  FiAward,
  FiMessageCircle,
  FiCalendar,
  FiDollarSign,
  FiScissors,
  FiImage,
  FiX,
  FiFilter,
  FiSearch
} from "react-icons/fi";
import { apiCall } from "../../config/api";

const TailorDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tailor, setTailor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFavorited, setIsFavorited] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [portfolio, setPortfolio] = useState([]);

  useEffect(() => {
    fetchTailorDetails();
  }, [id]);

  const fetchTailorDetails = async () => {
    try {
      setLoading(true);
      const response = await apiCall('TAILOR_SERVICE', `/api/public/tailors/${id}`, {
        method: 'GET'
      });
      
      if (response.success && response.data) {
        const tailorData = response.data;
        
        // Transform the data to match our component structure
        const transformedTailor = {
          _id: tailorData._id,
          firstname: tailorData.firstname,
          lastname: tailorData.lastname,
          email: tailorData.email,
          phone: tailorData.phone,
          shopName: tailorData.shopName,
          specializations: tailorData.specialization || [],
          experience: tailorData.experience || 0,
          rating: tailorData.rating || 4.0,
          totalReviews: tailorData.totalOrders || 0,
          location: {
            address: tailorData.address || "Address not specified",
            city: tailorData.district || tailorData.city || "Unknown",
            state: tailorData.state || "Unknown",
            pincode: tailorData.pincode || "Unknown",
            coordinates: tailorData.coordinates || { lat: 0, lng: 0 }
          },
          services: tailorData.services || [
            {
              name: "Custom Tailoring",
              price: tailorData.basePrice || 2000,
              duration: "7-10 days",
              description: "Custom tailoring services"
            }
          ],
          availability: tailorData.availability || {
            monday: { start: "09:00", end: "18:00", available: true },
            tuesday: { start: "09:00", end: "18:00", available: true },
            wednesday: { start: "09:00", end: "18:00", available: true },
            thursday: { start: "09:00", end: "18:00", available: true },
            friday: { start: "09:00", end: "18:00", available: true },
            saturday: { start: "10:00", end: "16:00", available: true },
            sunday: { start: "10:00", end: "14:00", available: false }
          },
          portfolio: tailorData.portfolio || [],
          certifications: tailorData.certifications || [],
          languages: tailorData.languages || ["Hindi", "English"],
          responseTime: tailorData.responseTime || "2 hours",
          completionRate: tailorData.completionRate || 95
        };
        
        setTailor(transformedTailor);
        setPortfolio(transformedTailor.portfolio);
        
        // Fetch reviews if available
        try {
          const reviewsResponse = await apiCall('TAILOR_SERVICE', `/api/public/tailors/${id}/reviews`, {
            method: 'GET'
          });
          
          if (reviewsResponse.success && reviewsResponse.data) {
            setReviews(reviewsResponse.data);
          } else {
            // Set empty reviews if none available
            setReviews([]);
          }
        } catch (reviewError) {
          console.error("Error fetching reviews:", reviewError);
          setReviews([]);
        }
      } else {
        setError("Tailor not found");
        console.error("Failed to fetch tailor:", response.message);
      }
    } catch (err) {
      setError("Failed to load tailor details");
      console.error("Error fetching tailor:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleFavorite = () => {
    setIsFavorited(!isFavorited);
    // TODO: API call to add/remove from favorites
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${tailor.firstname} ${tailor.lastname} - ${tailor.shopName}`,
        text: `Check out this amazing tailor: ${tailor.shopName}`,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      // Show toast notification
    }
  };

  const handleBookService = (service) => {
    setSelectedService(service);
    setShowBookingModal(true);
  };

  const handleContact = (method) => {
    if (method === 'phone') {
      window.open(`tel:${tailor.phone}`);
    } else if (method === 'email') {
      window.open(`mailto:${tailor.email}`);
    }
  };

  const getAvailabilityStatus = () => {
    const now = new Date();
    const day = now.toLocaleLowerCase().slice(0, 3);
    const currentTime = now.toTimeString().slice(0, 5);
    
    const todaySchedule = tailor.availability[day];
    if (!todaySchedule || !todaySchedule.available) {
      return { status: 'closed', message: 'Closed today' };
    }
    
    if (currentTime >= todaySchedule.start && currentTime <= todaySchedule.end) {
      return { status: 'open', message: 'Open now' };
    } else {
      return { status: 'closed', message: `Opens at ${todaySchedule.start}` };
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading tailor details...</p>
        </div>
      </div>
    );
  }

  if (error || !tailor) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiX className="w-8 h-8 text-red-500" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Tailor Not Found</h3>
          <p className="text-gray-600 mb-4">{error || "The tailor you're looking for doesn't exist."}</p>
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const availability = getAvailabilityStatus();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <FiArrowLeft className="w-5 h-5 mr-2" />
              Back
            </button>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={handleShare}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <FiShare2 className="w-5 h-5" />
              </button>
              <button
                onClick={handleFavorite}
                className={`p-2 rounded-lg transition-colors ${
                  isFavorited 
                    ? 'text-red-500 bg-red-50' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <FiHeart className={`w-5 h-5 ${isFavorited ? 'fill-current' : ''}`} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Tailor Info */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-start space-x-6">
                <div className="w-24 h-24 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full flex items-center justify-center">
                  <FiUser className="w-12 h-12 text-white" />
                </div>
                
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {tailor.firstname} {tailor.lastname}
                  </h1>
                  <p className="text-xl text-gray-600 mb-4">{tailor.shopName}</p>
                  
                  <div className="flex items-center space-x-6 mb-4">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <FiStar
                          key={i}
                          className={`w-5 h-5 ${
                            i < Math.floor(tailor.rating)
                              ? 'text-yellow-400 fill-current'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                      <span className="ml-2 text-sm text-gray-600">
                        {tailor.rating} ({tailor.totalReviews} reviews)
                      </span>
                    </div>
                    
                    <div className="flex items-center text-sm text-gray-600">
                      <FiAward className="w-4 h-4 mr-1" />
                      {tailor.experience} years experience
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <FiMapPin className="w-4 h-4 mr-1" />
                      {tailor.location.city}, {tailor.location.state}
                    </div>
                    
                    <div className={`flex items-center text-sm px-2 py-1 rounded-full ${
                      availability.status === 'open' 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-red-100 text-red-700'
                    }`}>
                      <FiClock className="w-4 h-4 mr-1" />
                      {availability.message}
                    </div>
                  </div>
                </div>
              </div>

              {/* Specializations */}
              <div className="mt-6">
                <h3 className="font-medium text-gray-900 mb-3">Specializations</h3>
                <div className="flex flex-wrap gap-2">
                  {tailor.specializations.map((spec, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                    >
                      {spec}
                    </span>
                  ))}
                </div>
              </div>

              {/* Contact Info */}
              <div className="mt-6 flex space-x-4">
                <button
                  onClick={() => handleContact('phone')}
                  className="flex items-center px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
                >
                  <FiPhone className="w-4 h-4 mr-2" />
                  Call
                </button>
                <button
                  onClick={() => handleContact('email')}
                  className="flex items-center px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                >
                  <FiMail className="w-4 h-4 mr-2" />
                  Email
                </button>
                <button className="flex items-center px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors">
                  <FiMessageCircle className="w-4 h-4 mr-2" />
                  Message
                </button>
              </div>
            </div>

            {/* Services */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Services & Pricing</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {tailor.services.map((service, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4 hover:border-amber-300 transition-colors">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-medium text-gray-900">{service.name}</h3>
                        <p className="text-sm text-gray-600 mt-1">{service.description}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-gray-900">₹{service.price}</p>
                        <p className="text-sm text-gray-500">{service.duration}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleBookService(service)}
                      className="w-full px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors"
                    >
                      Book Service
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Portfolio */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Portfolio</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {portfolio.map((image, index) => (
                  <div key={index} className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                    <img
                      src={image}
                      alt={`Portfolio ${index + 1}`}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Reviews */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Reviews</h2>
              <div className="space-y-4">
                {reviews.map((review) => (
                  <div key={review._id} className="border-b border-gray-100 pb-4 last:border-b-0">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-medium text-gray-900">{review.customerName}</h4>
                        <p className="text-sm text-gray-500">{review.service}</p>
                      </div>
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <FiStar
                            key={i}
                            className={`w-4 h-4 ${
                              i < review.rating
                                ? 'text-yellow-400 fill-current'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-gray-700">{review.comment}</p>
                    <p className="text-sm text-gray-500 mt-2">{review.date}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Quick Stats</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Response Time</span>
                  <span className="font-medium text-gray-900">{tailor.responseTime}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Completion Rate</span>
                  <span className="font-medium text-gray-900">{tailor.completionRate}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Experience</span>
                  <span className="font-medium text-gray-900">{tailor.experience} years</span>
                </div>
              </div>
            </div>

            {/* Availability */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Availability</h3>
              <div className="space-y-2">
                {Object.entries(tailor.availability).map(([day, schedule]) => (
                  <div key={day} className="flex items-center justify-between text-sm">
                    <span className="capitalize text-gray-600">{day}</span>
                    <span className={`font-medium ${
                      schedule.available ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {schedule.available ? `${schedule.start} - ${schedule.end}` : 'Closed'}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Certifications */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Certifications</h3>
              <div className="space-y-2">
                {tailor.certifications.map((cert, index) => (
                  <div key={index} className="flex items-center text-sm">
                    <FiAward className="w-4 h-4 text-amber-500 mr-2" />
                    <span className="text-gray-700">{cert}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Languages */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Languages</h3>
              <div className="flex flex-wrap gap-2">
                {tailor.languages.map((lang, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm"
                  >
                    {lang}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      {showBookingModal && selectedService && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Book Service</h2>
                <button
                  onClick={() => setShowBookingModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <FiX className="w-6 h-6" />
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-gradient-to-r from-amber-100 to-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FiCalendar className="w-8 h-8 text-amber-500" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Booking Form</h3>
                <p className="text-gray-600">
                  This will integrate with the booking system to schedule your appointment.
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  Service: {selectedService.name} - ₹{selectedService.price}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TailorDetail;