import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import AuthContext from "../../store/auth-context";
import classes from "./headerProfileButton.module.css";
import { FiUser } from "react-icons/fi";


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


      <div className={classes.icon} onClick={profileButtonHandler}>
      <FiUser className={classes.icon__profile}></FiUser>
      Profile
      </div>
  

  
 



  );
}

export default HeaderProfileButton;
