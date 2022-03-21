import Modal from "./../UI/modal";
import { useNavigate } from "react-router-dom";
import AuthContext from "../../store/auth-context";
import { useContext, useEffect } from "react";
import classes from "./Profile.module.css";
import useHttp from "../hooks/use-http";
import { getAddress } from "../lib/api";

const retrieveUser = () => {
  const storagedUser = localStorage.getItem("userId");
  return storagedUser;
};
const retrieveName = () => {
  const storagedUser = localStorage.getItem("name");
  return storagedUser;
};

const retrieveAddress = () => {
  const storagedStreet = localStorage.getItem("street");
  const storagedPostal = localStorage.getItem("postal");
  const storagedCity = localStorage.getItem("city");

  if (storagedPostal && storagedCity && storagedStreet) {
    return {
      street: storagedStreet,
      city: storagedCity,
      postal: storagedPostal,
    };
  }
  return null;
};

function Profile() {
  const authCtx = useContext(AuthContext);
  const nameStored = retrieveName();
  const storagedUser = retrieveUser();
  const storagedAddress = retrieveAddress();

  let navigate = useNavigate();

  const {
    data: dataAddress,
    status: statusAddress,
    sendRequest: sendRequestAddress,
    error: errorAddress,
  } = useHttp(getAddress);

  let userAddress;

  if (dataAddress) {
    localStorage.setItem("city", dataAddress.city);
    localStorage.setItem("street", dataAddress.street);
    localStorage.setItem("postal", dataAddress.postal);
    userAddress = dataAddress;
  }

  if (storagedAddress) {
    userAddress = storagedAddress;
  }

  const hideModalHandler = () => {
    navigate("../");
  };

  useEffect(() => {
    if (!storagedAddress) {
      sendRequestAddress(storagedUser);
    }
  }, [sendRequestAddress, storagedUser, storagedAddress]);

  const fetchUserDataHandler = () => {
    sendRequestAddress(storagedUser);
  };

  const navigatePasswordHandler = () => {
    navigate("./change-password");
  };

  const navigateNameHandler = () => {
    navigate("./change-name");
  };

  const navigateAddressHandler = () => {
    navigate("./change-address");
  };

  const navigateOrders = () => {
    navigate("./orders");
  };

  const logoutHandler = () => {
    authCtx.logout();
    navigate("../");
  };

  let contentName = <h1>Please add your name</h1>;
  let contentButton = "Add Name";
  if (nameStored) {
    contentName = <h1>Hello {nameStored}</h1>;
    contentButton = "Change Name";
  }

  let buttons = (
    <div className={classes.actions}>
      <button onClick={navigateNameHandler} className={classes.submit}>
        {contentButton}
      </button>
      <button onClick={navigateOrders} className={classes.submit}>
        {"View Orders"}
      </button>
      <button onClick={navigatePasswordHandler} className={classes.submit}>
        Change Password
      </button>
      <button onClick={navigateAddressHandler} className={classes.submit}>
        Change Address
      </button>
      <button onClick={logoutHandler}>Logout</button>
    </div>
  );

  let content;

  if (
    (statusAddress === "completed" && !errorAddress && dataAddress) ||
    userAddress
  ) {
    content = (
      <div>
        {contentName}
        <h1>Address:</h1>
        <h2>City:{userAddress.city}</h2>
        <h2>Street:{userAddress.street}</h2>
        <h2>Postal:{userAddress.postal}</h2>
        {buttons}
      </div>
    );
  }

  if (statusAddress === "completed" && !errorAddress && !dataAddress) {
    content = (
      <div>
        {contentName}
        <h2>Please add your address</h2>
        {buttons}
      </div>
    );
  }

  if (statusAddress === "completed" && errorAddress) {
    content = (
      <div>
        <h2>Could not load your data</h2>
        <div className={classes.actions}>
          <button
            className={classes.tryagain__button}
            onClick={fetchUserDataHandler}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (statusAddress === "pending") {
    content = <h2>Loading your data...</h2>;
  }

  return (
    <Modal auth={true} onHideModal={hideModalHandler}>
      {content}
    </Modal>
  );
}

export default Profile;
