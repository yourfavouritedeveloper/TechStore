import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [account, setAccount] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedAccount = localStorage.getItem("account");
    const savedToken = localStorage.getItem("token");
    if (savedAccount && savedToken) {
      setAccount(JSON.parse(savedAccount));
      setToken(savedToken);
    }
    setLoading(false);
  }, []);

  const login = (accountData, jwtToken) => {
    setAccount(accountData);
    setToken(jwtToken);
    localStorage.setItem("account", JSON.stringify(accountData));
    localStorage.setItem("token", jwtToken);
  };

  const logout = () => {
    setAccount(null);
    setToken(null);
    localStorage.removeItem("account");
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ account, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}
