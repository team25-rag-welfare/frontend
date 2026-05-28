import { create } from 'zustand';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

const useAuthStore = create((set, get) => ({
  accessToken: localStorage.getItem('access_token') || null,
  isLogin: !!localStorage.getItem('access_token'),
  user: null,

  setAccessToken: (token) => {
    localStorage.setItem('access_token', token);
    set({ accessToken: token, isLogin: true });
  },

  fetchProfile: async () => {
    const token = get().accessToken;
    if (!token) return null;
    try {
      const res = await axios.get(`${API_URL}/api/v1/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      set({ user: res.data });
      return res.data;
    } catch (err) {
      if (err.response?.status === 401 || err.response?.status === 403) {
        localStorage.removeItem('access_token');
        set({ accessToken: null, isLogin: false, user: null });
      }
      return null;
    }
  },

  logout: () => {
    localStorage.removeItem('access_token');
    set({ accessToken: null, isLogin: false, user: null });
  },
}));

export default useAuthStore;
