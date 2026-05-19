import { createContext, useState } from "react";

export const ShopContext = createContext();

const ShopContextProvider = (props) => {

  const [cartCount, setCartCount] = useState(0);

  const addToCart = () => {
    setCartCount((prev) => prev + 1);
  };

  const value = {
    cartCount,
    addToCart
  };

  return (
    <ShopContext.Provider value={value}>
      {props.children}
    </ShopContext.Provider>
  );
};

export default ShopContextProvider;