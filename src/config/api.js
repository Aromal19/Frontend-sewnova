// API Configuration for SewNova Services
// To configure environment variables, create a .env file in the frontend directory with:
// VITE_CUSTOMER_SERVICE_URL=http://localhost:3001
// VITE_AUTH_SERVICE_URL=http://localhost:3002
// VITE_TAILOR_SERVICE_URL=http://localhost:3003
// VITE_SELLER_SERVICE_URL=http://localhost:3004
// VITE_PAYMENT_SERVICE_URL=http://localhost:3010

const API_CONFIG = {
  // Customer Service (running on port 3002)
  CUSTOMER_SERVICE: import.meta.env.VITE_CUSTOMER_SERVICE_URL || 'http://localhost:3002',
  
  // Auth Service (running on port 3000)
  AUTH_SERVICE: import.meta.env.VITE_AUTH_SERVICE_URL || 'http://localhost:3000',
  
  // Admin Service (running on port 3007)
  ADMIN_SERVICE: import.meta.env.VITE_ADMIN_SERVICE_URL || 'http://localhost:3007',
  
  // Design Service (running on port 3006)
  DESIGN_SERVICE: import.meta.env.VITE_DESIGN_SERVICE_URL || 'http://localhost:3006',
  
  // Other services can be added here
  TAILOR_SERVICE: import.meta.env.VITE_TAILOR_SERVICE_URL || 'http://localhost:3003',
  SELLER_SERVICE: import.meta.env.VITE_SELLER_SERVICE_URL || 'http://localhost:3004',
  PAYMENT_SERVICE: import.meta.env.VITE_PAYMENT_SERVICE_URL || 'http://localhost:3010',
  
  // AI Measurement Service (running on port 8001)
  MEASUREMENT_SERVICE: import.meta.env.VITE_MEASUREMENT_SERVICE_URL || 'http://localhost:8001',
};

// Helper function to get full API URL
export const getApiUrl = (service, endpoint) => {
  const baseUrl = API_CONFIG[service];
  if (!baseUrl) {
    throw new Error(`Unknown service: ${service}`);
  }
  return `${baseUrl}${endpoint}`;
};

// Helper function to make authenticated API calls
export const apiCall = async (service, endpoint, options = {}) => {
  try {
    const url = getApiUrl(service, endpoint);
    let token = localStorage.getItem('token') || localStorage.getItem('accessToken');

    // Decode JWT to check expiry
    const isTokenNearExpiry = (jwtToken) => {
      try {
        if (!jwtToken) return true;
        const parts = jwtToken.split('.');
        if (parts.length !== 3) return true;
        const payload = JSON.parse(atob(parts[1]));
        const now = Math.floor(Date.now() / 1000);
        const safetyWindowSeconds = 30; // refresh if expiring within 30s
        return typeof payload.exp !== 'number' || payload.exp <= (now + safetyWindowSeconds);
      } catch {
        return true;
      }
    };

    // Proactively refresh if no token or token near expiry
    if (!token || isTokenNearExpiry(token)) {
      try {
        const preRefreshResponse = await fetch(`${API_CONFIG.AUTH_SERVICE}/api/auth/refresh-token`, {
          method: 'POST',
          credentials: 'include'
        });
        const preRefreshData = await preRefreshResponse.json();
        if (preRefreshData?.success && preRefreshData?.accessToken) {
          localStorage.setItem('accessToken', preRefreshData.accessToken);
          localStorage.setItem('token', preRefreshData.accessToken);
          token = preRefreshData.accessToken;
        }
      } catch {}
    }

    const defaultOptions = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
        ...options.headers,
      },
    };

    const fetchInit = {
      ...defaultOptions,
      ...options,
      headers: {
        ...defaultOptions.headers,
        ...options.headers,
      },
      credentials: 'include',
    };

    if (fetchInit.body && typeof fetchInit.body !== 'string') {
      fetchInit.body = JSON.stringify(fetchInit.body);
    }

    let response = await fetch(url, fetchInit);

    // If unauthorized, try to refresh access token once and retry
    if (response.status === 401) {
      try {
        const refreshResponse = await fetch(`${API_CONFIG.AUTH_SERVICE}/api/auth/refresh-token`, {
          method: 'POST',
          credentials: 'include'
        });
        const refreshData = await refreshResponse.json();
        if (refreshData?.success && refreshData?.accessToken) {
          localStorage.setItem('accessToken', refreshData.accessToken);
          localStorage.setItem('token', refreshData.accessToken);
          // Retry original request with new token
          const retriedHeaders = {
            ...defaultOptions.headers,
            ...(refreshData.accessToken && { 'Authorization': `Bearer ${refreshData.accessToken}` }),
            ...options.headers,
          };
          response = await fetch(url, {
            ...defaultOptions,
            ...options,
            headers: retriedHeaders,
            credentials: 'include',
          });
        }
      } catch {}
    }

    if (!response.ok) {
      let msg;
      try {
        const errJson = await response.json();
        msg = errJson?.message || errJson?.error || `${response.status} ${response.statusText}`;
      } catch {
        msg = `${response.status} ${response.statusText}`;
      }
      throw new Error(`API call failed: ${msg}`);
    }

    return response.json();
  } catch (error) {
    console.error('apiCall error:', error);
    throw error;
  }
};

export default API_CONFIG; 