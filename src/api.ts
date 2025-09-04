const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001';

const apiClient = async (endpoint: string, options: RequestInit = {}) => {
  const token = localStorage.getItem('authToken');

  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    (headers as any)['Authorization'] = `Bearer ${token}`;
  }

  const config: RequestInit = {
    ...options,
    headers,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

  if (!response.ok) {
    if (response.status === 401 || response.status === 403) {
      // Token is invalid or expired, log out the user
      localStorage.removeItem('authToken');
      window.location.href = '/login'; // Force redirect to login
    }
    throw new Error(`API error: ${response.statusText}`);
  }

  // For DELETE requests or other methods that might not return a body
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.indexOf('application/json') !== -1) {
    return response.json();
  }
  return;
};

export default apiClient;
