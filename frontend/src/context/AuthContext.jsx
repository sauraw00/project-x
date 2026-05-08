import { createContext, useContext, useMemo, useState } from "react";
import { api } from "../api/client.js";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem("hn_token"));
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("hn_user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const persistSession = ({ data, headers }) => {
    const authHeader = headers?.authorization;
    const sessionToken = data.token || authHeader?.replace(/^Bearer\s+/i, "");

    if (!sessionToken) {
      throw new Error("Login succeeded, but no JWT token was returned");
    }

    localStorage.setItem("hn_token", sessionToken);
    localStorage.setItem("hn_user", JSON.stringify(data.user));
    api.defaults.headers.common.Authorization = `Bearer ${sessionToken}`;
    setToken(sessionToken);
    setUser(data.user);
  };

  const register = async (payload) => {
    const response = await api.post("/auth/register", payload);
    persistSession(response);
  };

  const login = async (payload) => {
    const response = await api.post("/auth/login", payload);
    persistSession(response);
  };

  const logout = () => {
    localStorage.removeItem("hn_token");
    localStorage.removeItem("hn_user");
    delete api.defaults.headers.common.Authorization;
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
