import React, { useState, useEffect, createContext, useContext } from "react";
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("accessToken") || "");
  const [isAdmin, setIsAdmin] = useState(false);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ Auto-detect backend (env first → fallback to Render)
  const BASE_URL =
    import.meta.env.VITE_EXPRESS_API_URL ||
    "https://agrocare-ai-server.onrender.com";

  const tokenBearer = token ? `Bearer ${token}` : "";
  const isLoggedIn = !!token;

  // ✅ Store token and persist login
  const storeTokenInLS = (tokenValue) => {
    setToken(tokenValue);
    localStorage.setItem("accessToken", tokenValue);
  };

  // ✅ Logout user
  const removeTokenFromLS = () => {
    setUserData(null);
    setToken("");
    setIsAdmin(false);
    localStorage.removeItem("accessToken");
  };

  // ✅ Check token validity (auto-refresh check)
  const AuthenticateUser = async () => {
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${BASE_URL}/api/user`, {
        method: "GET",
        headers: { Authorization: tokenBearer },
      });

      const data = await res.json();

      if (res.ok) {
        setUserData(data);
        setIsAdmin(data.isAdmin || false);
      } else {
        console.warn("Session expired or invalid token.");
        removeTokenFromLS();
      }
    } catch (error) {
      console.error("Authentication check failed:", error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Run once when app loads or token changes
  useEffect(() => {
    AuthenticateUser();
  }, [token]);

  // ✅ Expose everything in context
  const contextValue = {
    token,
    isLoggedIn,
    userData,
    isAdmin,
    BASE_URL,
    tokenBearer,
    storeTokenInLS,
    removeTokenFromLS,
    AuthenticateUser,
    loading,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {loading ? (
        <div className="flex h-screen items-center justify-center text-lg">
          Loading...
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
