import classes from "./Cart.module.css";
import Modal from "../UI/modal";
import React, { useContext } from "react";
import CartContext from "./../../store/cart-context";
import CartItem from "./CartItem";

import { useNavigate } from "react-router-dom";
import AuthContext from "../../store/auth-context";

function Cart(props) {
  const cartCtx = useContext(CartContext);
  const authCtx = useContext(AuthContext);

  let navigate = useNavigate();

  const addCartHandler = (item) => {
    let itemSelect = { ...item };
    itemSelect.amount = 1;
    cartCtx.addItem(itemSelect);
  };

  const removeCartHandler = (id) => {
    cartCtx.removeItem(id);
  };

  const orderHandler = (event) => {
    props.onHideModal();
    if (authCtx.isLoggedIn) {
      navigate("../checkout");
      return;
    }
    navigate("../login");
  };

  const cartItems = (
    <ul className={classes["cart-items"]}>
      {cartCtx.items.map((item) => {
        return (
          <CartItem
            key={item.id}
            name={item.name}
            price={item.price}
            amount={item.amount}
            onAdd={addCartHandler.bind(null, item)}
            onRemove={removeCartHandler.bind(null, item.id)}
          ></CartItem>
        );
      })}
    </ul>
  );

  const actions = (
    <div className={classes.actions}>
      <button className={classes["button-alt"]} onClick={props.onHideModal}>
        Close
      </button>
      {cartCtx.items.length > 0 && (
        <button onClick={orderHandler} className={classes.button}>
          Order
        </button>
      )}
    </div>
  );

  const modalContent = (
    <React.Fragment>
      <div>
        {cartItems}
        <div className={classes.total}>
          <span>Total Amount</span>
          <span>$ {cartCtx.totalAmount}</span>
        </div>
        {actions}
      </div>
    </React.Fragment>
  );

  return <Modal onHideModal={props.onHideModal}>{modalContent}</Modal>;
}

export default Cart;
