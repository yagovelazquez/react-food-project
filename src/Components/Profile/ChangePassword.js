import Modal from "./../UI/modal";
import { useNavigate } from "react-router-dom";
import { updateProfile } from "../lib/api";
import useHttp from "../hooks/use-http";
import AuthContext from "../../store/auth-context";
import { useContext } from "react";
import useInput from "../hooks/use-input";
import Joi from "joi-browser";
import _ from "lodash";
import classes from "./ChangePassword.module.css";
import React from "react";

function ChangePassword() {
  const {
    data: dataPassword,
    status: statusPassword,
    sendRequest: sendRequestPassword,
    error: errorPassword,
  } = useHttp(updateProfile);

  const authCtx = useContext(AuthContext);
  let navigate = useNavigate();

  const schema = {
    password: Joi.string().required().min(6).label("Password"),
    oldPassword: Joi.string().required().min(6).label("Old Password"),
  };

  const {
    errorMessage: errorOldPasswordMessage,
    touchHandler: setOldPasswordTouched,
    renderInput: renderOldPasswordInput,
    value: oldPasswordValue,
  } = useInput(schema, "oldPassword");

  const {
    errorMessage: errorPasswordMessage,
    touchHandler: setPasswordTouched,
    renderInput: renderPasswordInput,
    value: passwordValue,
  } = useInput(schema, "password");

  const hideModalHandler = () => {
    navigate("../");
  };

  async function passwordChangeHandler() {
    setPasswordTouched(true);
    setOldPasswordTouched(true);
    const email = localStorage.getItem("email");
    if (
      errorPasswordMessage ||
      !passwordValue ||
      errorOldPasswordMessage ||
      !oldPasswordValue
    ) {
      return;
    }

    sendRequestPassword({
      userData: {
        email,
        oldPassword: oldPasswordValue,
        newPassword: passwordValue,
      },
      login: authCtx.login,
      action: "changePassword",
    });
  }

  const navigateBackHandler = () => {
    navigate("../profile", { replace: true });
  };

  const delayedPasswordChangeHandler = _.debounce(passwordChangeHandler, 500);

  let content;

  if (dataPassword && statusPassword === "completed" && !errorPassword) {
    content = (
      <React.Fragment>
        <h2>Password Changed Successfully!</h2>
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

  if (
    statusPassword === null ||
    errorPassword ||
    (statusPassword === "pending" && !errorPassword && !dataPassword)
  ) {
    content = (
      <form
        onSubmit={(event) => {
          event.preventDefault();
          delayedPasswordChangeHandler();
        }}
      >
        {renderOldPasswordInput("Old Password", "password")}
        {renderPasswordInput("Password", "password")}

        {errorPassword && <p>{errorPassword}</p>}
        {statusPassword === "pending" && !errorPassword && !dataPassword && (
          <h2>Changing password...</h2>
        )}

        <div className={classes.actions}>
          <button className={classes.submit}>Change Password</button>
          <button type="button" onClick={navigateBackHandler}>
            Back
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

export default ChangePassword;
