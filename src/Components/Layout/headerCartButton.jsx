import CartIcon from "../cart/cartIcon";
import classes from "./HeaderCartButton.module.css";
import { useContext } from "react";
import CartContext from "../../store/cart-context";
import { useState, useEffect } from "react";

function HeaderCartButton(props) {
  const cartCtx = useContext(CartContext);

  const [isButtonHighlighted, setisButtonHighlighted] = useState(false);

  const { items } = cartCtx;

  const numberOfCartItems = items.reduce((curNumber, item) => {
    return curNumber + item.amount;
  }, 0);

  const classButtonHighlited = `${classes.button} ${
    isButtonHighlighted ? classes.bump : ""
  }`;

  useEffect(() => {
    if (items.length === 0) {
      return;
    }

    setisButtonHighlighted(true);
    const timer = setTimeout(() => {
      setisButtonHighlighted(false);
    }, 300);

    return () => {
      clearTimeout(timer);
    };
  }, [items]);

  return (
    <button className={classButtonHighlited} onClick={props.onShowCartHandler}>
      <span className={classes.icon}>
        <CartIcon></CartIcon>
      </span>
      <span>Your Cart</span>
      <span className={classes.badge}>{numberOfCartItems}</span>
    </button>
  );
}

export default HeaderCartButton;
