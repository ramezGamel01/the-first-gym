// localStorage can be blocked (private windows, strict settings), so every call is guarded
export const store = {
  get(key) {
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  },
  set(key, value) {
    try {
      localStorage.setItem(key, value);
    } catch {
      // Settings just won't persist
    }
  },
};
