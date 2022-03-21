import Modal from "./../UI/modal";
import { useNavigate } from "react-router-dom";

import useHttp from "../hooks/use-http";

import useInput from "../hooks/use-input";
import Joi from "joi-browser";
import _ from "lodash";
import React from "react";
import { useEffect } from "react";

import classes from "./ChangeName.module.css";

import { updateAddress } from "../lib/api";

const retrieveUser = () => {
  const storagedUser = localStorage.getItem("userId");
  return storagedUser;
};

function ChangeAddress() {
  const storagedUser = retrieveUser();

  const {
    data: dataAddress,
    status: statusAddress,
    sendRequest: sendRequestAddress,
    error: errorAddress,
  } = useHttp(updateAddress);

  let navigate = useNavigate();

  const schema = {
    street: Joi.string().required().label("Street"),
    postal: Joi.string().required().label("Postal"),
    city: Joi.string().required().label("City"),
  };

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

  const hideModalHandler = () => {
    navigate("../");
  };

  const navigateBackHandler = () => {
    navigate("../profile", { replace: true });
  };

  let content;

  const submitAddressHandler = () => {
    setCityTouched(true);
    setPostalTouched(true);
    setStreetTouched(true);

    if (
      errorStreetMessage ||
      errorCityMessage ||
      errorPostalMessage ||
      !streetValue ||
      !postalValue ||
      !cityValue
    ) {
      return;
    }

    sendRequestAddress({
      userId: storagedUser,
      address: {
        street: streetValue,
        city: cityValue,
        postal: postalValue,
      },
    });
  };

  const delayedSubmitAddressHandler = _.debounce(submitAddressHandler, 500);

  useEffect(() => {
    if (statusAddress === "completed" && dataAddress && !errorAddress) {
      localStorage.setItem("city", dataAddress.address.city);
      localStorage.setItem("street", dataAddress.address.street);
      localStorage.setItem("postal", dataAddress.address.postal);
      navigate("../profile");
    }
  }, [statusAddress, dataAddress, errorAddress, navigate]);

  content = (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        delayedSubmitAddressHandler();
      }}
    >
      {renderCityInput("City", "text")}
      {renderStreetInput("Street", "text")}
      {renderPostalInput("Postal", "text")}

      <div className={classes.actions}>
        <button className={classes.submit}>Update Address</button>
        <button type="button" onClick={navigateBackHandler}>
          Back
        </button>
      </div>
    </form>
  );

  return (
    <Modal auth={true} onHideModal={hideModalHandler}>
      {content}
    </Modal>
  );
}

export default ChangeAddress;
