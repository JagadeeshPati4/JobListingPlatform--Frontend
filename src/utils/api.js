import axios from 'axios';
import Cookies from 'js-cookie';
const API_URL = 'https://joblistingplatform-backend.onrender.com/api';


// Create an axios instance with defaults
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token in all requests
api.interceptors.request.use(
  (config) => {
    const token = Cookies.get('authToken');
    console.log('authToken',token);
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Authentication endpoints
export const loginUser = async (credentials) => {
  const response = await api.post('/auth/login', credentials);
  return response.data;
};

export const registerUser = async (userData) => {
  console.log('userData',userData);
  const response = await api.post('/auth/register', userData);
  return response;
};

export const logoutUser = async () => {
  // If your backend has a logout endpoint:
  // const response = await api.post('/auth/logout');
  // return response.data;
  
  // If logout is handled client-side only (token removal):
  localStorage.removeItem('token');
  return { success: true };
};

// User profile endpoints
export const getUserProfile = async () => {
  const response = await api.get('/user/profile');
  return response.data;
};

export const updateUserProfile = async (profileData) => {
  const response = await api.put('/user/profile', profileData);
  return response.data;
};

export const updateUser = async (userData) => {
  const response = await api.put('/user', userData);
  return response.data;
};

export const changePassword = async (passwordData) => {
  const response = await api.put('/user/password', passwordData);
  return response.data;
};

// Job endpoints
export const fetchJobs = async (params) => {
  const response = await api.get('/jobs', { params });
  return response.data;
};

export const fetchJobById = async (id) => {
  const response = await api.get(`/jobs/${id}`);
  return response.data;
};

export const createJob = async (jobData) => {
  const response = await api.post('/jobs', jobData);
  return response.data;
};

export const updateJob = async (id, jobData) => {
  const response = await api.put(`/jobs/${id}`, jobData);
  return response.data;
};

export const deleteJob = async (id) => {
  const response = await api.delete(`/jobs/${id}`);
  return response.data;
};

export const addBookmark = async (jobId) => {
  const response = await api.post(`/bookmarks/${jobId}`);
  return response.data;
};
export const getUserdBookmark = async () => {
  const response = await api.get(`/bookmarks/user`);
  return response.data;
};
export const removeBookmark = async (jobId) => {
  const response = await api.delete(`/bookmarks/${jobId}`);
  return response.data;
};

export const checkIfBookmarked = async (jobId) => {
    const response = await api.get(`/bookmarks/check/${jobId}`);
    return response.data; // Ensure backend returns a boolean
  };
  

export const fetchUserJobs = async () => {
  const response = await api.get('/user/jobs');
  return response.data;
};

export const fetchUserBookmarks = async () => {
  const response = await api.get('/user/bookmarks');
  return response.data;
};

// This function was missing - added for dashboard component
export const fetchBookmarkedJobs = async () => {
  const response = await api.get('/user/bookmarks');
  return response.data;
};

// Admin endpoints
export const fetchAllUsers = async () => {
  const response = await api.get('/admin/users');
  return response.data;
};

export const fetchAllJobs = async () => {
  const response = await api.get('/jobs');
  return response.data;
};

export const toggleUserStatus = async (userId, status) => {
  const response = await api.patch(`/admin/users/${userId}/status`, { active: status });
  return response.data;
};

export const toggleJobStatus = async (jobId, status) => {
  const response = await api.patch(`/admin/jobs/${jobId}/status`, { active: status });
  return response.data;
};

export const deleteUser = async (userId) => {
  const response = await api.delete(`/admin/users/${userId}`);
  return response.data;
};

export default api;