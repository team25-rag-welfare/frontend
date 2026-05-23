import { create } from 'zustand';

const useAuthStore = create((set) => ({
  accessToken: localStorage.getItem('access_token') || null,

  isLogin: !!localStorage.getItem('access_token'),

  setAccessToken: (token) => {
    localStorage.setItem('access_token', token);

    set({
      accessToken: token,
      isLogin: true,
    });
  },

  logout: () => {
    localStorage.removeItem('access_token');

    set({
      accessToken: null,
      isLogin: false,
    });
  },
}));

export default useAuthStore;