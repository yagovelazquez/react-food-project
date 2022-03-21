import CartContext from "./cart-context";
import { useReducer } from "react";

const defaultCartState = {
  items: [],
  totalAmount: 0,
  isSubmitting: false,
  isSubmitted: false,
};

const cartReducer = (state, action) => {
  switch (action.type) {
    case "ADD": {
      const existingItemCartIndex = state.items.findIndex(
        (item) => item.id === action.item.id
      );
      const existingItem = state.items[existingItemCartIndex];

      let updateTotalAmount =
        state.totalAmount + action.item.price * action.item.amount;

      let updatedItems;

      if (existingItem) {
        const updatedItem = {
          ...existingItem,
          amount: action.item.amount + existingItem.amount,
        };

        updatedItems = [...state.items];
        updatedItems[existingItemCartIndex] = updatedItem;
      } else {
        updatedItems = state.items.concat(action.item);
      }

      return { items: updatedItems, totalAmount: updateTotalAmount };
    }

    case "REMOVE": {
      const findIndex = state.items.findIndex((item) => item.id === action.id);
      let existingItem = state.items[findIndex];
      const updateTotalAmount = state.totalAmount - existingItem.price;
      let updatedItems;

      if (existingItem.amount === 1) {
        updatedItems = state.items.filter((value) => value.id !== action.id);
      } else {
        updatedItems = [...state.items];
        let updatedItem = { ...existingItem, amount: existingItem.amount - 1 };
        updatedItems[findIndex] = updatedItem;
      }

      return { items: updatedItems, totalAmount: updateTotalAmount };
    }

    case "SETSUBMIT": {
      return { ...state, isSubmitting: action.value };
    }

    case "SETSUBMITED": {
      return { ...state, isSubmitted: action.value };
    }

    case "RESET": {
      return { ...defaultCartState, isSubmitted: true };
    }

    default:
      return defaultCartState;
  }
};

function CartProvider(props) {
  const [cartState, dispatch] = useReducer(cartReducer, defaultCartState);

  const addItemToCartHandler = (item) => {
    dispatch({ type: "ADD", item });
  };
  const removeItemCartHandler = (id) => {
    dispatch({ type: "REMOVE", id });
  };

  const setIsSubmitting = (value) => {
    dispatch({ type: "SETSUBMIT", value });
  };

  const setIsSubmitted = (value) => {
    dispatch({ type: "SETSUBMITED", value });
  };

  const resetCartHandler = () => {
    dispatch({ type: "RESET" });
  };

  const cartContext = {
    items: cartState.items,
    totalAmount: cartState.totalAmount.toFixed(2),
    addItem: addItemToCartHandler,
    removeItem: removeItemCartHandler,
    setIsSubmitting,
    isSubmitting: cartState.isSubmitting,
    setIsSubmitted,
    isSubmitted: cartState.isSubmitted,
    resetCartHandler,
  };

  return (
    <CartContext.Provider value={cartContext}>
      {props.children}
    </CartContext.Provider>
  );
}

export default CartProvider;
