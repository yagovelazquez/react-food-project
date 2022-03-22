import { useContext } from "react";
import classes from "./LoginForm.module.css";

import Modal from "../UI/modal";
import { useNavigate } from "react-router-dom";
import useInput from "../hooks/use-input";
import Joi from "joi-browser";
import _ from "lodash";
import { fetchUser } from "../lib/api";
import useHttp from "../hooks/use-http";
import AuthContext from "../../store/auth-context";

function RegisterForm() {
  let navigate = useNavigate();
  const authCtx = useContext(AuthContext);

  if (authCtx.isLoggedIn) {
    navigate("../profile");
  }

  const { sendRequest, error, status, data } = useHttp(fetchUser);

  const schema = {
    name: Joi.string().required().label("Name"),
    password: Joi.string().required().min(6).label("Password"),
    email: Joi.string()
      .required()
      .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
      .label("Email"),
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
    navigate("../login");
  };

  const submitFormHandler = () => {
    let action = "createUser";

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
  };

  const delayedFormSubmit = _.debounce(submitFormHandler, 1000);

  let content;

  if (data && status === "completed") {
    content = <h2>Successfully account created!</h2>;
  }

  if (status === "pending" && !error && !data) {
    content = <h2>Sending request...</h2>;
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
          {<button className={classes.submit}>Create Account</button>}
          <button
            type="button"
            className={classes.toggle}
            onClick={switchFormHandler}
          >
            Login with existing account
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

export default RegisterForm;
