import Header from "./Components/Layout/header";

import Cart from "./Components/cart/cart";
import React, { useState, useContext } from "react";

import Meals from "./Components/meals/Meals";

import { Routes, Route, Navigate } from "react-router-dom";
import LoginForm from "./Components/Auth/LoginForm";
import RegisterForm from "./Components/Auth/RegisterForm";
import Profile from "./Components/Profile/Profile";
import AuthContext from "./store/auth-context";
import ChangePassword from "./Components/Profile/ChangePassword";
import ChangeName from "./Components/Profile/ChangeName";
import ChangeAddress from "./Components/Profile/ChangeAddress";

import Checkout from "./Components/cart/Checkout";
import SendOrder from "./Components/cart/SendOrder";
import CartContext from "./store/cart-context";
import Orders from "./Components/Profile/Orders";
import OrderDetailsTable from "./Components/Profile/OrderDetailsTable";
import StartProject from "./Components/projectstart/StartProject";

function App() {
  const [isCartShown, setIsCartShown] = useState(false);

  const cartCtx = useContext(CartContext);

  const authCtx = useContext(AuthContext);

  const showCartHandler = () => {
    setIsCartShown(true);
  };

  const hideCartHandler = () => {
    setIsCartShown(false);
  };

  return (
    <React.Fragment>
      {isCartShown && <Cart onHideModal={hideCartHandler}></Cart>}
      <Header onShowCartHandler={showCartHandler}></Header>

      <Routes>
        <Route path="/login" element={<LoginForm />}></Route>
        <Route path="/startproject" element={<StartProject />}></Route>
        <Route path="/register" element={<RegisterForm />}></Route>
        <Route path="/" element={<Meals />}></Route>
        {!authCtx.isLoggedIn && (
          <React.Fragment>
            <Route
              path="/profile/change-password"
              element={<Navigate to="../login" />}
            ></Route>
            <Route
              path="/profile/change-name"
              element={<Navigate to="../login" />}
            ></Route>
            <Route
              path="/profile/change-address"
              element={<Navigate to="../login" />}
            ></Route>
            <Route path="/profile" element={<Navigate to="../login" />}></Route>
            <Route
              path="/checkout"
              element={<Navigate to="../login" />}
            ></Route>
            <Route
              path="/checkout/finish"
              element={<Navigate to="../login" />}
            ></Route>
            <Route
              path="/profile/orders"
              element={<Navigate to="../login" />}
            ></Route>
            <Route
              path="/profile/orders/:id"
              element={<Navigate to="../login" />}
            ></Route>
          </React.Fragment>
        )}
        {authCtx.isLoggedIn && (
          <React.Fragment>
            <Route path="/profile" element={<Profile />}></Route>
            <Route
              path="/profile/change-password"
              element={<ChangePassword />}
            ></Route>
            <Route path="/profile/change-name" element={<ChangeName />}></Route>
            <Route
              path="/profile/change-address"
              element={<ChangeAddress />}
            ></Route>
            <Route path="/profile/orders" element={<Orders />}></Route>
            <Route
              path="/profile/orders/:id"
              element={<OrderDetailsTable />}
            ></Route>

            {cartCtx.items.length > 0 && (
              <React.Fragment>
                <Route path="/checkout" element={<Checkout />}></Route>
              </React.Fragment>
            )}
            <Route path="/checkout" element={<Navigate to="../" />}></Route>
            <Route path="/checkout/finish" element={<SendOrder />}></Route>
          </React.Fragment>
        )}
      </Routes>
    </React.Fragment>
  );
}

export default App;
