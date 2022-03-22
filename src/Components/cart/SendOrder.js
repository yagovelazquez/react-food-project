import classes from "./SendOrder.module.css";
import React from "react";

import { useContext, useEffect } from "react";
import CartContext from "../../store/cart-context";
import Modal from "../UI/modal";
import { useNavigate, useLocation } from "react-router-dom";
import useHttp from "../hooks/use-http";
import { orderFood } from "../lib/api";
import Labels from './Labels';

const retrieveUserId = () => {
  const userId = localStorage.getItem("userId");
  return userId;
};

function SendOrder() {
  let location = useLocation();
  const userId = retrieveUserId();

  const { sendRequest, error, status, data } = useHttp(orderFood);

  const cartCtx = useContext(CartContext);

  let navigate = useNavigate();
  let address;

  if (location.state) {
    address = location.state;
  }

  useEffect(() => {
    if (!location.state) {
      navigate("../");
    }
  }, [location, navigate]);

  const hideModalHandler = () => {
    if (status === "completed" && !error && data) {
      cartCtx.resetCartHandler();
      navigate("../");
    }
    if ((status === "completed" && error) || status === null) {
      navigate("../");
    }
    if (status === "pending") {
      return;
    }
  };

  const goBackHandler = () => {
    navigate(-1);
  };

  const orderHandler = () => {
    const date = new Date().getTime();
    sendRequest({
      userId: userId,
      address,
      orderContent: {
        items: cartCtx.items,
        totalAmount: cartCtx.totalAmount,
        date,
      },
    });
  };

  let content;

  if (status === "completed" && !error && data) {
    content = <h2>Order made successfully</h2>;
  }

  if (status === "pending") {
    content = <h2>Sending order...</h2>;
  }

  if (status === "completed" && error) {
    content = <h2>{error}</h2>;
  }

  if (status === null && location.state) {
    const labels = [{label: "City", value: address.city}, {label: "Street", value: address.street}, 
    {label: "Postal", value: address.postal}, {label: "Total", value: `$ ${cartCtx.totalAmount}`}] 
   
   
    content = (
      <React.Fragment>
        <Labels labels={labels}></Labels>
        <div className={classes.actions}>
          <button className={classes.submit} onClick={orderHandler}>
            Order
          </button>
          <button onClick={goBackHandler}>Back</button>
          <button onClick={hideModalHandler}>Cancel</button>
        </div>
      </React.Fragment>
    );
  }

  return (
    <Modal auth={true} onHideModal={hideModalHandler}>
      {content}
    </Modal>
  );
}

export default SendOrder;
