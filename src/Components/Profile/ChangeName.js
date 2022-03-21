import Modal from "./../UI/modal";
import { useNavigate } from "react-router-dom";
import { updateProfile } from "../lib/api";
import useHttp from "../hooks/use-http";
import AuthContext from "../../store/auth-context";
import { useContext } from "react";
import useInput from "../hooks/use-input";
import Joi from "joi-browser";
import _ from "lodash";
import React from "react";
import classes from "./ChangeName.module.css";

const retrieveName = () => {
  const nameStored = localStorage.getItem("name");
  return nameStored;
};

function ChangeName() {
  const storedName = retrieveName();

  const {
    data: dataName,
    status: statusName,
    sendRequest: sendRequestName,
    error: errorName,
  } = useHttp(updateProfile);

  const authCtx = useContext(AuthContext);
  let navigate = useNavigate();

  const schema = {
    name: Joi.string().required().label("Name"),
  };

  const {
    errorMessage: errorNameMessage,
    touchHandler: setNameTouched,
    renderInput: renderNameInput,
    value: nameValue,
  } = useInput(schema, "name");

  const hideModalHandler = () => {
    navigate("../");
  };

  const changeNameHandler = () => {
    setNameTouched(true);
    const token = authCtx.token;
    if (errorNameMessage || !nameValue) {
      return;
    }
    sendRequestName({ token, userData: { name: nameValue } });
  };

  const delayedChangeNameHandler = _.debounce(changeNameHandler, 500);

  const navigateBackHandler = () => {
    navigate("../profile", { replace: true });
  };

  let loadingContent = <h2>Adding name...</h2>;
  if (storedName) {
    loadingContent = <h2>Changing name...</h2>;
  }

  let buttonContent = "Add Name";

  if (storedName) {
    buttonContent = "Change Name";
  }

  let content;

  content = (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        delayedChangeNameHandler();
      }}
    >
      {renderNameInput("Name", "text")}

      {errorName && <p>{errorName}</p>}
      {statusName === "pending" && !errorName && !dataName && loadingContent}

      <div className={classes.actions}>
        <button className={classes.submit}>{buttonContent}</button>
        <button type="button" onClick={navigateBackHandler}>
          Back
        </button>
      </div>
    </form>
  );

  if (dataName && statusName === "completed" && !errorName) {
    localStorage.setItem("name", dataName.displayName);
    let contenth1 = <h1>Name changed Succesfully</h1>;

    if (!storedName) {
      contenth1 = <h1>Name added Succesfully</h1>;
    }

    content = (
      <React.Fragment>
        {contenth1}
        <div className={classes.actions}>
          <button
            className={`${classes.actions} ${classes.submit}`}
            onClick={navigateBackHandler}
          >
            Back
          </button>
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

export default ChangeName;
