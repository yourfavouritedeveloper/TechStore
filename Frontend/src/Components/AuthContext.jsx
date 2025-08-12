import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [account, setAccount] = useState(null);

  useEffect(() => {
    const savedAccount = localStorage.getItem("account");
    if (savedAccount) {
      setAccount(JSON.parse(savedAccount));
    }
  }, []);

  const login = (accountData) => {
    setAccount(accountData);
    localStorage.setItem("account", JSON.stringify(accountData));
  };

  const logout = () => {
    setAccount(null);
    localStorage.removeItem("account");
  };

  return (
    <AuthContext.Provider value={{ account, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
