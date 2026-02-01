import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_DELIVERY_SERVICE_URL || 'http://localhost:3008/api';

// Get auth token from localStorage
const getAuthToken = () => {
    return localStorage.getItem('token');
};

// Create axios instance with auth header
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add auth token to requests
api.interceptors.request.use(
    (config) => {
        const token = getAuthToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Delivery Service API
const deliveryService = {
    // Create delivery record
    createDelivery: async (bookingId, customerId, bookingType, deliveryAddress) => {
        try {
            const response = await api.post('/deliveries', {
                bookingId,
                customerId,
                bookingType,
                deliveryAddress
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    // Get delivery by booking ID
    getDeliveryByBooking: async (bookingId) => {
        try {
            const response = await api.get(`/deliveries/booking/${bookingId}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    // Get customer deliveries
    getCustomerDeliveries: async (customerId) => {
        try {
            const response = await api.get(`/deliveries/customer/${customerId}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    // Get delivery tracking info
    getDeliveryTracking: async (bookingId) => {
        try {
            const response = await api.get(`/deliveries/tracking/${bookingId}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    // Update vendor dispatch status
    updateVendorDispatch: async (deliveryId, data) => {
        try {
            const response = await api.put(`/deliveries/${deliveryId}/vendor-dispatch`, data);
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    // Update tailor delivery status
    updateTailorDelivery: async (deliveryId, data) => {
        try {
            const response = await api.put(`/deliveries/${deliveryId}/tailor-delivery`, data);
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    // Get all deliveries (admin)
    getAllDeliveries: async (filters = {}) => {
        try {
            const params = new URLSearchParams(filters);
            const response = await api.get(`/deliveries/admin/all?${params}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    // Get delivery history
    getDeliveryHistory: async (deliveryId) => {
        try {
            const response = await api.get(`/deliveries/${deliveryId}/history`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    }
};

export default deliveryService;
