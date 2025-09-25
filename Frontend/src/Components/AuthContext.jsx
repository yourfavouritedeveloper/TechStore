import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [account, setAccount] = useState(null);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const savedAccount = localStorage.getItem("account");
    if (savedAccount) {
      setAccount(JSON.parse(savedAccount));
    }
    setLoading(false);
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
    <AuthContext.Provider value={{ account, login, logout,loading  }}>
      {children}
    </AuthContext.Provider>
  );
}
