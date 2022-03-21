import React from "react";

const CartContext = React.createContext({
  items: [],
  totalAmount: 0,
  addItem: (item) => {},
  removeItem: (item) => {},
  setIsSubmitting: (item) => {},
  isSubmitting: false,
  setIsSubmitted: (item) => {},
  isSubmitted: false,
  resetCartHandler: (item) => {},
});

export default CartContext;
