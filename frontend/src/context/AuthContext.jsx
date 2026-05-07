import { createContext, useContext, useMemo, useState } from "react";
import { api } from "../api/client.js";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem("hn_token"));
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("hn_user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const persistSession = (session) => {
    localStorage.setItem("hn_token", session.token);
    localStorage.setItem("hn_user", JSON.stringify(session.user));
    setToken(session.token);
    setUser(session.user);
  };

  const register = async (payload) => {
    const { data } = await api.post("/auth/register", payload);
    persistSession(data);
  };

  const login = async (payload) => {
    const { data } = await api.post("/auth/login", payload);
    persistSession(data);
  };

  const logout = () => {
    localStorage.removeItem("hn_token");
    localStorage.removeItem("hn_user");
    setToken(null);
    setUser(null);
  };

  const updateBookmarks = (bookmarks) => {
    setUser((currentUser) => {
      if (!currentUser) {
        return currentUser;
      }

      const nextUser = { ...currentUser, bookmarks };
      localStorage.setItem("hn_user", JSON.stringify(nextUser));
      return nextUser;
    });
  };

  const value = useMemo(
    () => ({
      isAuthenticated: Boolean(token && user),
      token,
      user,
      register,
      login,
      logout,
      updateBookmarks
    }),
    [token, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
