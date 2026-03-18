import { create } from "zustand";

/**
 * @typedef {Object} User
 * @property {string} id
 * @property {string} name
 * @property {string} email
 */

/**
 * @typedef {Object} AuthState
 * @property {User | null} user
 * @property {boolean} isAuthenticated
 * @property {(user: User) => void} setUser
 * @property {() => void} clearUser
 */

export const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,

  setUser: (user) =>
    set({
      user,
      isAuthenticated: true,
    }),

  clearUser: () =>
    set({
      user: null,
      isAuthenticated: false,
    }),
}));
