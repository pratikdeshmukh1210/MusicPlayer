const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export const api = {
  // Auth endpoints
  register: async (userData) => {
    const res = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Registration failed');
    return data;
  },

  login: async (credentials) => {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Login failed');
    return data;
  },

  getProfile: async () => {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No token');
    const res = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: getAuthHeaders(),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to fetch user profile');
    return data;
  },

  // Songs & Liked persistence
  toggleLike: async (songId) => {
    const res = await fetch(`${API_BASE_URL}/songs/like`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ songId }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to toggle like');
    return data;
  },

  getLikedSongs: async () => {
    const res = await fetch(`${API_BASE_URL}/songs/liked`, {
      headers: getAuthHeaders(),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to fetch liked songs');
    return data;
  },
};
