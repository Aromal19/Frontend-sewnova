import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  FiSearch, 
  FiFilter, 
  FiGrid, 
  FiList, 
  FiHeart, 
  FiUser,
  FiStar,
  FiMapPin,
  FiAward,
  FiClock,
  FiX,
  FiChevronDown,
  FiChevronUp,
  FiScissors,
  FiMessageCircle,
  FiPhone
} from "react-icons/fi";
import { apiCall } from "../../config/api";

const TailorBrowse = () => {
  const navigate = useNavigate();
  const [tailors, setTailors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSpecialization, setSelectedSpecialization] = useState("all");
  const [selectedLocation, setSelectedLocation] = useState("all");
  const [ratingFilter, setRatingFilter] = useState(0);
  const [experienceFilter, setExperienceFilter] = useState({ min: 0, max: 50 });
  const [sortBy, setSortBy] = useState("rating");
  const [viewMode, setViewMode] = useState("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [favoritedItems, setFavoritedItems] = useState(new Set());

  const specializations = [
    "all", "Men's Clothing", "Women's Clothing", "Children's Clothing", 
    "Wedding Dresses", "Formal Wear", "Casual Wear", "Alterations", 
    "Custom Design", "Traditional Wear", "Western Wear"
  ];

  const locations = [
    "all", "Mumbai", "Delhi", "Bangalore", "Chennai", "Kolkata", "Hyderabad", "Pune", "Ahmedabad"
  ];

  const sortOptions = [
    { value: "rating", label: "Highest Rated" },
    { value: "experience", label: "Most Experienced" },
    { value: "reviews", label: "Most Reviews" },
    { value: "newest", label: "Newest First" },
    { value: "price_low", label: "Price: Low to High" },
    { value: "price_high", label: "Price: High to Low" }
  ];

  useEffect(() => {
    fetchTailors();
  }, [searchQuery, selectedSpecialization, selectedLocation, ratingFilter, experienceFilter, sortBy]);

  const fetchTailors = async () => {
    try {
      setLoading(true);
      
      // Build query parameters
      const params = {
        page: 1,
        limit: 50,
        isVerified: true
      };
      
      // Add search query
      if (searchQuery) {
        params.search = searchQuery;
      }
      
      // Add specialization filter
      if (selectedSpecialization !== "all") {
        params.specialization = selectedSpecialization;
      }
      
      // Add location filter
      if (selectedLocation !== "all") {
        params.city = selectedLocation;
      }
      
      // Add rating filter
      if (ratingFilter > 0) {
        params.minRating = ratingFilter;
      }
      
      // Add experience filter
      if (experienceFilter.min > 0) {
        params.minExperience = experienceFilter.min;
      }
      if (experienceFilter.max < 50) {
        params.maxExperience = experienceFilter.max;
      }
      
      // Add sorting
      switch (sortBy) {
        case "rating":
          params.sortBy = "rating";
          params.sortOrder = "desc";
          break;
        case "experience":
          params.sortBy = "experience";
          params.sortOrder = "desc";
          break;
        case "reviews":
          params.sortBy = "totalOrders";
          params.sortOrder = "desc";
          break;
        case "newest":
          params.sortBy = "createdAt";
          params.sortOrder = "desc";
          break;
        case "price_low":
          params.sortBy = "basePrice";
          params.sortOrder = "asc";
          break;
        case "price_high":
          params.sortBy = "basePrice";
          params.sortOrder = "desc";
          break;
      }
      
      const response = await apiCall('TAILOR_SERVICE', '/api/public/tailors', {
        method: 'GET'
      });
      
      if (response.success && response.data) {
        // Transform the data to match our component structure
        const transformedTailors = response.data.map(tailor => ({
          _id: tailor._id,
          firstname: tailor.firstname,
          lastname: tailor.lastname,
          shopName: tailor.shopName,
          email: tailor.email,
          phone: tailor.phone,
          specializations: tailor.specialization || [],
          experience: tailor.experience || 0,
          rating: tailor.rating || 4.0,
          totalReviews: tailor.totalOrders || 0,
          location: {
            city: tailor.district || tailor.city || 'Unknown',
            state: tailor.state || 'Unknown',
            address: tailor.address || 'Address not specified'
          },
          services: tailor.services || [
            { name: 'Custom Tailoring', price: tailor.basePrice || 2000, duration: '7-10 days' }
          ],
          availability: tailor.availability || {
            monday: { start: '09:00', end: '18:00', available: true },
            tuesday: { start: '09:00', end: '18:00', available: true },
            wednesday: { start: '09:00', end: '18:00', available: true },
            thursday: { start: '09:00', end: '18:00', available: true },
            friday: { start: '09:00', end: '18:00', available: true },
            saturday: { start: '10:00', end: '16:00', available: true },
            sunday: { start: '10:00', end: '14:00', available: false }
          },
          responseTime: tailor.responseTime || '2 hours',
          completionRate: tailor.completionRate || 95,
          portfolio: tailor.portfolio || [],
          certifications: tailor.certifications || [],
          languages: tailor.languages || ['Hindi', 'English'],
          createdAt: tailor.createdAt
        }));
        
        setTailors(transformedTailors);
      } else {
        console.error('Failed to fetch tailors:', response.message);
        setTailors([]);
      }
    } catch (error) {
      console.error('Error fetching tailors:', error);
      setTailors([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFavoriteToggle = (tailorId) => {
    const newFavorited = new Set(favoritedItems);
    if (newFavorited.has(tailorId)) {
      newFavorited.delete(tailorId);
    } else {
      newFavorited.add(tailorId);
    }
    setFavoritedItems(newFavorited);
    // TODO: API call to update favorites
  };

  // Booking from tailor discovery is disabled in new flow

  const handleViewDetails = (tailorId) => {
    navigate(`/customer/tailor/${tailorId}`);
  };

  const handleContact = (tailor, method) => {
    if (method === 'phone') {
      window.open(`tel:${tailor.phone}`);
    } else if (method === 'message') {
      // TODO: Open messaging interface
      console.log('Open messaging for:', tailor._id);
    }
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedSpecialization("all");
    setSelectedLocation("all");
    setRatingFilter(0);
    setExperienceFilter({ min: 0, max: 50 });
    setSortBy("rating");
  };

  const getAvailabilityStatus = (tailor) => {
    const now = new Date();
    const dayIndex = now.getDay(); // 0 (Sun) - 6 (Sat)
    const dayKeys = ['sunday','monday','tuesday','wednesday','thursday','friday','saturday'];
    const day = dayKeys[dayIndex];
    const currentTime = now.toTimeString().slice(0, 5);
    
    const todaySchedule = tailor.availability && tailor.availability[day];
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
          <p className="text-gray-600">Loading tailors...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Find Tailors</h1>
              <p className="text-gray-600 mt-1">Discover skilled tailors in your area</p>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <FiFilter className="w-4 h-4 mr-2" />
                Filters
                {showFilters ? <FiChevronUp className="w-4 h-4 ml-2" /> : <FiChevronDown className="w-4 h-4 ml-2" />}
              </button>
              
              <div className="flex items-center border border-gray-300 rounded-lg">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 ${viewMode === "grid" ? 'bg-amber-500 text-white' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  <FiGrid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 ${viewMode === "list" ? 'bg-amber-500 text-white' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  <FiList className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Search and Sort */}
          <div className="flex items-center space-x-4">
            <div className="flex-1 relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search tailors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              />
            </div>
            
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            >
              {sortOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>

          {/* Filters */}
          {showFilters && (
            <div className="mt-6 p-6 bg-gray-50 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Specialization</label>
                  <select
                    value={selectedSpecialization}
                    onChange={(e) => setSelectedSpecialization(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    {specializations.map(spec => (
                      <option key={spec} value={spec}>
                        {spec === "all" ? "All Specializations" : spec}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                  <select
                    value={selectedLocation}
                    onChange={(e) => setSelectedLocation(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    {locations.map(location => (
                      <option key={location} value={location}>
                        {location === "all" ? "All Locations" : location}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Minimum Rating</label>
                  <select
                    value={ratingFilter}
                    onChange={(e) => setRatingFilter(parseFloat(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    <option value={0}>Any Rating</option>
                    <option value={4.0}>4.0+ Stars</option>
                    <option value={4.5}>4.5+ Stars</option>
                    <option value={4.8}>4.8+ Stars</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Experience (years)</label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="number"
                      placeholder="Min"
                      value={experienceFilter.min}
                      onChange={(e) => setExperienceFilter(prev => ({ ...prev, min: parseInt(e.target.value) || 0 }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                    <span className="text-gray-500">-</span>
                    <input
                      type="number"
                      placeholder="Max"
                      value={experienceFilter.max}
                      onChange={(e) => setExperienceFilter(prev => ({ ...prev, max: parseInt(e.target.value) || 50 }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                </div>
                
                <div className="flex items-end">
                  <button
                    onClick={clearFilters}
                    className="w-full px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Clear Filters
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Results */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <p className="text-gray-600">
            Showing {tailors.length} tailor{tailors.length !== 1 ? 's' : ''}
          </p>
        </div>

        {tailors.length > 0 ? (
          <div className={`grid gap-6 ${
            viewMode === "grid" 
              ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
              : 'grid-cols-1'
          }`}>
            {tailors.map((tailor) => {
              const availability = getAvailabilityStatus(tailor);
              
              return (
                <div key={tailor._id} className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200">
                  <div className="p-6">
                    <div className="flex items-start space-x-4 mb-4">
                      <div className="w-16 h-16 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full flex items-center justify-center">
                        <FiUser className="w-8 h-8 text-white" />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-semibold text-gray-900 text-lg">
                              {tailor.firstname} {tailor.lastname}
                            </h3>
                            <p className="text-sm text-gray-600">{tailor.shopName}</p>
                          </div>
                          
                          <button
                            onClick={() => handleFavoriteToggle(tailor._id)}
                            className={`p-2 rounded-full transition-colors ${
                              favoritedItems.has(tailor._id)
                                ? 'bg-red-100 text-red-500'
                                : 'text-gray-400 hover:text-red-500 hover:bg-red-50'
                            }`}
                          >
                            <FiHeart className={`w-4 h-4 ${favoritedItems.has(tailor._id) ? 'fill-current' : ''}`} />
                          </button>
                        </div>
                        
                        <div className="flex items-center space-x-4 mt-2">
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
                            <span className="ml-2 text-sm text-gray-600">
                              {tailor.rating} ({tailor.totalReviews} reviews)
                            </span>
                          </div>
                          
                          <div className="flex items-center text-sm text-gray-600">
                            <FiAward className="w-4 h-4 mr-1" />
                            {tailor.experience} years
                          </div>
                        </div>
                        
                        <div className="flex items-center text-sm text-gray-600 mt-1">
                          <FiMapPin className="w-4 h-4 mr-1" />
                          {tailor.location.city}, {tailor.location.state}
                        </div>
                      </div>
                    </div>

                    {/* Specializations */}
                    <div className="mb-4">
                      <div className="flex flex-wrap gap-1">
                        {tailor.specializations.slice(0, 3).map((spec, index) => (
                          <span key={index} className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">
                            {spec}
                          </span>
                        ))}
                        {tailor.specializations.length > 3 && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                            +{tailor.specializations.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Services */}
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Services</h4>
                      <div className="space-y-1">
                        {tailor.services.slice(0, 2).map((service, index) => (
                          <div key={index} className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">{service.name}</span>
                            <span className="font-medium text-gray-900">₹{service.price}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Availability */}
                    <div className="mb-4">
                      <div className={`flex items-center text-sm px-2 py-1 rounded-full inline-block ${
                        availability.status === 'open' 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-red-100 text-red-700'
                      }`}>
                        <FiClock className="w-3 h-3 mr-1" />
                        {availability.message}
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Response Time:</span>
                        <span className="font-medium text-gray-900">{tailor.responseTime}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Completion Rate:</span>
                        <span className="font-medium text-gray-900">{tailor.completionRate}%</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleViewDetails(tailor._id)}
                        className="flex-1 px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        View Details
                      </button>
                      <button
                        onClick={() => handleFavoriteToggle(tailor._id)}
                        className={`flex-1 px-3 py-2 rounded-lg transition-colors ${
                          favoritedItems.has(tailor._id)
                            ? 'bg-red-100 text-red-600 border border-red-200'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        <FiHeart className={`w-4 h-4 inline mr-1 ${favoritedItems.has(tailor._id) ? 'fill-current' : ''}`} />
                        {favoritedItems.has(tailor._id) ? 'Shortlisted' : 'Shortlist'}
                      </button>
                    </div>

                    {/* Contact Options */}
                    <div className="flex items-center justify-center space-x-4 mt-4 pt-4 border-t border-gray-100">
                      <button
                        onClick={() => handleContact(tailor, 'phone')}
                        className="flex items-center text-sm text-gray-600 hover:text-gray-900 transition-colors"
                      >
                        <FiPhone className="w-4 h-4 mr-1" />
                        Call
                      </button>
                      <button
                        onClick={() => handleContact(tailor, 'message')}
                        className="flex items-center text-sm text-gray-600 hover:text-gray-900 transition-colors"
                      >
                        <FiMessageCircle className="w-4 h-4 mr-1" />
                        Message
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiScissors className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No tailors found</h3>
            <p className="text-gray-600 mb-4">
              Try adjusting your search criteria or filters
            </p>
            <button
              onClick={clearFilters}
              className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TailorBrowse;