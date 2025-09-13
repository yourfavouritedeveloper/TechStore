import { createContext, useContext, useState } from "react";

const PurchaseContext = createContext();

export const PurchaseProvider = ({ children }) => {
  const [isPurchase, setIsPurchase] = useState(false);

  return (
    <PurchaseContext.Provider value={{ isPurchase, setIsPurchase }}>
      {children}
    </PurchaseContext.Provider>
  );
};

export const usePurchase = () => useContext(PurchaseContext);
