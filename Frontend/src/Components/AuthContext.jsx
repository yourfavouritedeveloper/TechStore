import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [account, setAccount] = useState(null);
  const [token, setToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedAccount = localStorage.getItem("account");
    const savedToken = localStorage.getItem("token");
    const savedRefreshToken = localStorage.getItem("refreshToken");

    if (savedAccount && savedToken && savedRefreshToken) {
      setAccount(JSON.parse(savedAccount));
      setToken(savedToken);
      setRefreshToken(savedRefreshToken);
    }
    setLoading(false);
  }, []);

  const login = (accountData, jwtToken, refreshJwtToken) => {
    setAccount(accountData);
    setToken(jwtToken);
    localStorage.setItem("account", JSON.stringify(accountData));
    localStorage.setItem("token", jwtToken);
    localStorage.setItem("refreshToken", refreshJwtToken);

  };

  const logout = () => {
    setAccount(null);
    setToken(null);
    setRefreshToken(null);
    localStorage.removeItem("account");
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");

  };

  const refreshAccessToken = async () => {
    try {
      if (!refreshToken) return;
      const response = await fetch("http://localhost:8080/api/v1/accounts/refreshToken", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${refreshToken}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) throw new Error("Refresh failed");

      const data = await response.json();
      setToken(data.token);
      localStorage.setItem("token", data.token);
    } catch (error) {
      console.error("Failed to refresh token", error);
      logout(); 
    }
  };

  return (
    <AuthContext.Provider value={{ account, token, refreshToken, login, logout,refreshAccessToken, loading }}>
      {children}
    </AuthContext.Provider>
  );
}
