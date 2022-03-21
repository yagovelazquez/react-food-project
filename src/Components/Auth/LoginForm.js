import { useEffect, useContext } from "react";
import classes from "./LoginForm.module.css";

import Modal from "../UI/modal";
import { useNavigate } from "react-router-dom";
import useInput from "../hooks/use-input";
import Joi from "joi-browser";
import _ from "lodash";
import { fetchUser } from "../lib/api";
import useHttp from "../hooks/use-http";
import AuthContext from "../../store/auth-context";

function LoginForm() {
  let navigate = useNavigate();
  const authCtx = useContext(AuthContext);

  const { sendRequest, error, status, data } = useHttp(fetchUser);

  useEffect(() => {
    if (authCtx.isLoggedIn) {
      navigate("../profile");
    }
  }, [authCtx.isLoggedIn, navigate]);

  const schema = {
    password: Joi.string().required().label("Password"),
    email: Joi.string().required().label("Email"),
  };

  const {
    errorMessage: errorPasswordMessage,
    touchHandler: setPasswordTouched,
    renderInput: renderPasswordInput,
    value: passwordValue,
  } = useInput(schema, "password");

  const {
    errorMessage: errorEmailMessage,
    touchHandler: setEmailTouched,
    renderInput: renderEmailInput,
    value: emailValue,
  } = useInput(schema, "email");

  const hideModalHandler = () => {
    navigate("../");
  };

  const switchFormHandler = () => {
    navigate("../register");
  };

  async function submitFormHandler() {
    const action = "loginUser";

    setEmailTouched();
    setPasswordTouched();

    if (
      errorEmailMessage ||
      !emailValue ||
      !passwordValue ||
      errorPasswordMessage
    )
      return;

    sendRequest({
      action,
      userData: {
        email: emailValue,
        password: passwordValue,
      },
      login: authCtx.login,
    });
  }

  const delayedFormSubmit = _.debounce(submitFormHandler, 1000);

  let content;

  if (status === "pending" && !error && !data) {
    content = <h1>Sending request...</h1>;
  }

  if (status === null || error) {
    content = (
      <form
        onSubmit={(event) => {
          event.preventDefault();
          delayedFormSubmit();
        }}
        className={classes.form}
      >
        {renderEmailInput("Email", "text")}
        {renderPasswordInput("Password", "password")}

        <div className={classes.actions}>
          {<button className={classes.submit}>Login</button>}
          <button
            type="button"
            className={classes.toggle}
            onClick={switchFormHandler}
          >
            Create new account
          </button>
        </div>

        {error && <p>{error}</p>}
      </form>
    );
  }

  return (
    <Modal auth={true} onHideModal={hideModalHandler}>
      {content}
    </Modal>
  );
}

export default LoginForm;
