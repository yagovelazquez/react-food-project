import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import AuthContext from "../../store/auth-context";
import classes from "./headerProfileButton.module.css";

function HeaderProfileButton() {
  const authCtx = useContext(AuthContext);


  let navigate = useNavigate();

  const profileButtonHandler = (event) => {
    event.preventDefault();
    if (authCtx.isLoggedIn) {
      navigate("profile");
    } else {
      navigate("register");
    }
  };

  return (
    <button className={classes.header__button} onClick={profileButtonHandler}>
      Profile
    </button>
  );
}

export default HeaderProfileButton;
