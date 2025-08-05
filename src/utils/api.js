const API_BASE_URL = 'http://localhost:3000/api';

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

// Helper function to handle token invalidation
const handleTokenInvalidation = () => {
  console.log('Token invalidated, clearing local storage and redirecting to login');
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  localStorage.removeItem('userRole');
  localStorage.removeItem('isAdmin');
  localStorage.removeItem('adminToken');
  
  // Redirect to login page
  window.location.href = '/login';
};

// API functions
export const authAPI = {
  // Login user
  login: async (email, password) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email.toLowerCase(),
        password: password
      }),
    });
    return response.json();
  },

  // Get user role by email
  getUserRole: async (email) => {
    const response = await fetch(`${API_BASE_URL}/auth/get-role`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email.toLowerCase()
      }),
    });
    return response.json();
  },

  // Validate token
  validateToken: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/validate-token`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });
      
      const data = await response.json();
      
      // Check if token is invalidated
      if (response.status === 401 && data.message?.includes('invalidated')) {
        handleTokenInvalidation();
        return { success: false, message: 'Token invalidated' };
      }
      
      return data;
    } catch (error) {
      console.error('Token validation error:', error);
      return { success: false, message: 'Network error' };
    }
  }
};

// Helper function to handle API errors
export const handleAPIError = (error) => {
  console.error('API Error:', error);
  if (error.response) {
    return error.response.data?.message || 'Server error occurred';
  } else if (error.request) {
    return 'Network error. Please check your connection.';
  } else {
    return 'An unexpected error occurred.';
  }
};

// Helper function to check if user is authenticated
export const isAuthenticated = () => {
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');
  return !!(token && user);
};

// Helper function to get current user
export const getCurrentUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

// Helper function to get user role
export const getUserRole = () => {
  return localStorage.getItem('userRole');
};

// Enhanced logout function with proper error handling
export const logout = async () => {
  try {
    const token = localStorage.getItem('token');
    
    // Call backend logout endpoint if token exists
    if (token) {
      const response = await fetch(`${API_BASE_URL}/auth/logout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      
      const data = await response.json();
      
      // Check if token is invalidated during logout
      if (response.status === 401 && data.message?.includes('invalidated')) {
        console.log('Token was already invalidated');
      }
    }
  } catch (error) {
    console.error('Logout API error:', error);
    // Continue with logout even if API call fails
  } finally {
    // Clear all stored data
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('userRole');
    localStorage.removeItem('isAdmin');
    localStorage.removeItem('adminToken');
  }
};

// Helper function to get dashboard route based on role
export const getDashboardRoute = (role) => {
  switch (role) {
    case 'customer':
      return '/customer/landing';
    case 'tailor':
      return '/tailor/dashboard';
    case 'seller':
      return '/seller/dashboard';
    case 'admin':
      return '/admin/dashboard';
    default:
      return '/';
  }
};

// Enhanced fetch wrapper that handles token invalidation
export const authenticatedFetch = async (url, options = {}) => {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        ...getAuthHeaders(),
        ...options.headers
      }
    });
    
    const data = await response.json();
    
    // Check if token is invalidated
    if (response.status === 401 && data.message?.includes('invalidated')) {
      handleTokenInvalidation();
      return { success: false, message: 'Token invalidated' };
    }
    
    return data;
  } catch (error) {
    console.error('Authenticated fetch error:', error);
    return { success: false, message: 'Network error' };
  }
}; 