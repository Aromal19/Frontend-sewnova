const API_BASE_URL = 'http://localhost:3000/api';

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('accessToken');
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

// Helper function to handle token invalidation
const handleTokenInvalidation = () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('user');
  localStorage.removeItem('userRole');
  window.location.href = '/login';
};

// Refresh access token using refresh token (cookie)
const refreshAccessToken = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/refresh-token`, {
      method: 'POST',
      credentials: 'include',
    });
    const data = await response.json();
    if (data.success && data.accessToken) {
      localStorage.setItem('accessToken', data.accessToken);
      return data.accessToken;
    } else {
      handleTokenInvalidation();
      return null;
    }
  } catch (error) {
    handleTokenInvalidation();
    return null;
  }
};

// Enhanced fetch wrapper that handles token refresh
export const authenticatedFetch = async (url, options = {}) => {
  let response = await fetch(url, {
    ...options,
    headers: {
      ...getAuthHeaders(),
      ...options.headers
    },
    credentials: 'include',
  });
  if (response.status === 401) {
    // Try to refresh token
    const newToken = await refreshAccessToken();
    if (newToken) {
      response = await fetch(url, {
        ...options,
        headers: {
          ...getAuthHeaders(),
          ...options.headers
        },
        credentials: 'include',
      });
    } else {
      return { success: false, message: 'Session expired. Please log in again.' };
    }
  }
  try {
    return await response.json();
  } catch {
    return { success: false, message: 'Network error' };
  }
};

// API functions
export const authAPI = {
  // Login user
  login: async (email, password) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email.toLowerCase(), password }),
      credentials: 'include',
    });
    const data = await response.json();
    if (data.success && data.accessToken) {
      localStorage.setItem('accessToken', data.accessToken);
      if (data.user) localStorage.setItem('user', JSON.stringify(data.user));
    }
    return data;
  },
  // Get user role by email
  getUserRole: async (email) => {
    const response = await fetch(`${API_BASE_URL}/auth/get-role`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email.toLowerCase() }),
    });
    return response.json();
  },
  // Validate token
  validateToken: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/validate-token`, {
        method: 'GET',
        headers: getAuthHeaders(),
        credentials: 'include',
      });
      const data = await response.json();
      if (response.status === 401) {
        handleTokenInvalidation();
        return { success: false, message: 'Token invalidated' };
      }
      return data;
    } catch (error) {
      return { success: false, message: 'Network error' };
    }
  }
};

export const logout = async () => {
  try {
    await fetch(`${API_BASE_URL}/auth/logout`, {
      method: 'POST',
      credentials: 'include',
    });
  } catch {}
  localStorage.removeItem('accessToken');
  localStorage.removeItem('user');
  localStorage.removeItem('userRole');
};

export const isAuthenticated = () => {
  const token = localStorage.getItem('accessToken');
  const user = localStorage.getItem('user');
  return !!(token && user);
};

export const getCurrentUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

export const getUserRole = () => {
  return localStorage.getItem('userRole');
};

export const getDashboardRoute = (role) => {
  switch (role) {
    case 'customer': return '/customer/landing';
    case 'tailor': return '/dashboard/tailor';
    case 'seller': return '/dashboard/seller';
    case 'admin': return '/admin/dashboard';
    default: return '/';
  }
}; 