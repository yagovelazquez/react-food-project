import Modal from "./../UI/modal";
import React from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../../store/auth-context";
import { useContext, useEffect } from "react";
import classes from "./Profile.module.css";
import useHttp from "../hooks/use-http";
import { getAddress } from "../lib/api";
import { AiFillEdit } from "react-icons/ai";
import { BiNotepad } from "react-icons/bi";
import { IoKeySharp } from "react-icons/io5";
import { IoLogOutOutline } from "react-icons/io5";



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

  let contentName = <span className={classes.nameTitle}>Please add your name</span>;
  if (nameStored) {
    contentName = <span className={classes.nameTitle}> {nameStored}</span>;
  }

  let buttons = (
    <div className={classes.icons}>
      <div onClick={navigateNameHandler} className={classes.icon}>
        <AiFillEdit className={classes.icon__edit}> </AiFillEdit>
        Name
      </div>
      <div onClick={navigateOrders} className={classes.icon}>
        <BiNotepad className={classes.icon__order}></BiNotepad>
        <span>Orders</span>
      </div>
      <div onClick={navigatePasswordHandler} className={classes.icon}>
        <IoKeySharp className={classes.icon__password}></IoKeySharp>

        <span>Password</span>
      </div>
      <div onClick={navigateAddressHandler} className={classes.icon}>
        <AiFillEdit className={classes.icon__edit}> </AiFillEdit>
        <span>Address</span>
      </div>
      <div onClick={logoutHandler} className={classes.icon}>
        <IoLogOutOutline className={classes.icon__logout}></IoLogOutOutline>
        <span>Logout</span>
      </div>
    </div>
  );

  let content;

  if (
    (statusAddress === "completed" && !errorAddress && dataAddress) ||
    userAddress
  ) {
    content = (
      <div className={classes.profile}>
       
        <div className={classes.name__value}>
          <label>
            Name  
          </label>
        {contentName} 
        </div>
       

      
        <div className={classes.addressinfo}>
          <div className={classes.address__span}>
   
        <span>  Address</span>
          </div>
      <div className={classes.address__value}>    
     <label>City:</label>  <span>{userAddress.city}</span>
     </div>
     <div className={classes.address__value}> 
     <label>Street:</label>   <span>{userAddress.street}</span>
     </div>
     <div className={classes.address__value}> 
     <label>Postal:</label>   <span>{userAddress.postal}</span>
     </div>
        </div>
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
