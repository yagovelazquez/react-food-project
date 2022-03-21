import classes from "./Checkout.module.css";

import { useState, useEffect } from "react";
import Modal from "../UI/modal";
import { useNavigate } from "react-router-dom";
import { getAddress } from "../lib/api";
import useHttp from "../hooks/use-http";
import React from "react";
import Joi from "joi-browser";
import useInput from "../hooks/use-input";

const retrieveUserId = () => {
  const userId = localStorage.getItem("userId");
  return userId;
};

function Checkout() {
  const storagedId = retrieveUserId();

  const { sendRequest, error, status, data } = useHttp(getAddress);
  const [isChecked, setIsChecked] = useState();

  let navigate = useNavigate();

  const schema = {
    name: Joi.string().required().label("Name"),
    street: Joi.string().required().label("Street"),
    postal: Joi.string().required().label("Postal"),
    city: Joi.string().required().label("City"),
  };

  const getUserData = () => {
    sendRequest(storagedId);
  };

  const {
    errorMessage: errorNameMessage,
    touchHandler: setNameTouched,
    renderInput: renderNameInput,
    value: nameValue,
  } = useInput(schema, "name");

  const {
    errorMessage: errorStreetMessage,
    touchHandler: setStreetTouched,
    renderInput: renderStreetInput,
    value: streetValue,
  } = useInput(schema, "street");

  const {
    errorMessage: errorPostalMessage,
    touchHandler: setPostalTouched,

    renderInput: renderPostalInput,
    value: postalValue,
  } = useInput(schema, "postal");

  const {
    errorMessage: errorCityMessage,
    touchHandler: setCityTouched,

    renderInput: renderCityInput,
    value: cityValue,
  } = useInput(schema, "city");

  const checkOutSubmitHandler = (event) => {
    event.preventDefault();

    setCityTouched(true);
    setNameTouched(true);
    setPostalTouched(true);
    setStreetTouched(true);

    if (!isChecked) {
      if (
        errorCityMessage ||
        errorNameMessage ||
        errorPostalMessage ||
        errorStreetMessage ||
        !cityValue ||
        !postalValue ||
        !streetValue ||
        !nameValue
      ) {
        return;
      }

      const address = {
        name: nameValue,
        city: cityValue,
        street: streetValue,
        postal: postalValue,
      };

      navigate("finish", { state: address });
    }

    getUserData();
  };

  const hideModalHandler = () => {
    navigate("../");
  };

  const cancelHandler = () => {
    navigate("../");
  };

  useEffect(() => {
    if (status === "completed" && !error && data) {
      navigate("finish", { state: data });
    }
  }, [status, error, data, navigate]);

  let content;

  if (status === "completed" && error) {
    content = (
      <React.Fragment>
        <h1>Could not get user data, please try again</h1>
        <div className={classes.actions}>
          <button className={classes.submit} onClick={getUserData}>
            Try again
          </button>
        </div>
      </React.Fragment>
    );
  }

  if (status === "completed" && !error && !data) {
    content = (
      <React.Fragment>
        <h2>You don't have any valid address</h2>
      </React.Fragment>
    );
  }

  const registeringchanges = (event) => {
    setIsChecked(event.target.checked);
  };

  if (status === null || (status === "pending" && !error && !data)) {
    content = (
      <form className={classes.form} onSubmit={checkOutSubmitHandler}>
        <input onChange={registeringchanges} type="checkbox"></input>
        <label htmlFor="useraddress">Use profile address</label>

        {renderNameInput("Name", "text", isChecked)}
        {renderCityInput("City", "text", isChecked)}
        {renderStreetInput("Street", "text", isChecked)}
        {renderPostalInput("Postal", "text", isChecked)}

        <div className={classes.actions}>
          <button className={classes.submit}>Confirm</button>
          <button onClick={cancelHandler} type="button">
            Cancel
          </button>
        </div>
      </form>
    );
  }

  return (
    <Modal auth={true} onHideModal={hideModalHandler}>
      {content}
    </Modal>
  );
}

export default Checkout;
