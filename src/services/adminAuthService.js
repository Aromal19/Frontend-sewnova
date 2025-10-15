import { apiCall } from '../config/api';

// Admin Authentication Service
export const adminAuthService = {
  // Admin login
  async login(email, password) {
    try {
      const response = await fetch(`${import.meta.env.VITE_ADMIN_SERVICE_URL || 'http://localhost:3007'}/api/admin/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password })
      });

      if (!response.ok) {
        throw new Error(`Login failed: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      if (data.success) {
        // Store admin token
        localStorage.setItem('adminToken', data.data.token);
        localStorage.setItem('adminUser', JSON.stringify(data.data.admin));
        return data;
      } else {
        throw new Error(data.message || 'Login failed');
      }
    } catch (error) {
      console.error('Admin login error:', error);
      throw error;
    }
  },

  // Get admin token
  getAdminToken() {
    return localStorage.getItem('adminToken');
  },

  // Get admin user
  getAdminUser() {
    const adminUser = localStorage.getItem('adminUser');
    return adminUser ? JSON.parse(adminUser) : null;
  },

  // Check if admin is authenticated
  isAuthenticated() {
    const token = this.getAdminToken();
    const user = this.getAdminUser();
    return !!(token && user);
  },

  // Logout admin
  logout() {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
  },

  // Make authenticated admin API calls
  async adminApiCall(endpoint, options = {}) {
    const token = this.getAdminToken();
    
    if (!token) {
      throw new Error('Admin not authenticated');
    }

    const defaultOptions = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        ...options.headers,
      },
    };

    try {
      const response = await fetch(`${import.meta.env.VITE_ADMIN_SERVICE_URL || 'http://localhost:3007'}${endpoint}`, {
        ...defaultOptions,
        ...options,
        headers: {
          ...defaultOptions.headers,
          ...options.headers,
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          // Token expired or invalid, logout admin
          this.logout();
          throw new Error('Admin session expired. Please login again.');
        }
        throw new Error(`API call failed: ${response.status} ${response.statusText}`);
      }

      return response.json();
    } catch (error) {
      console.error('Admin API call error:', error);
      throw error;
    }
  }
};

export default adminAuthService;
