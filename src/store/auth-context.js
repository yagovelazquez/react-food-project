import React, { useState, useCallback, useEffect, useRef } from "react";

let logOutTimer;

const AuthContext = React.createContext({
  isLoggedIn: "",
  token: "",
  login: () => {},
  logout: () => {},
});

const calculateRemainingTime = (tokenExpirationDate) => {
  const nowTime = new Date().getTime();

  const tokenTime = new Date(tokenExpirationDate).getTime();

  const remainingTime = tokenTime - nowTime;

  return remainingTime;
};

const retrieveToken = () => {
  const token = localStorage.getItem("token");
  const tokenExpirationDate = localStorage.getItem("expiration");

  const remainingTime = calculateRemainingTime(tokenExpirationDate);

  if (remainingTime <= 60000) {
    localStorage.removeItem("token");
    localStorage.removeItem("expiration");
    localStorage.removeItem("email");
    localStorage.removeItem("name");
    localStorage.removeItem("userId");
    localStorage.removeItem("street");
    localStorage.removeItem("city");
    localStorage.removeItem("postal");
    return null;
  }

  return { token, remainingTime };
};

export const AuthContextProvider = (props) => {
  const tokenData = retrieveToken();
  let tokenRetrieved;

  if (tokenData) {
    tokenRetrieved = tokenData.token;
  }

  const [token, setToken] = useState(tokenRetrieved);

  const isLoggedIn = !!token;

  const logoutHandler = useCallback(() => {
    setToken(null);
    localStorage.removeItem("token");
    localStorage.removeItem("expiration");
    localStorage.removeItem("email");
    localStorage.removeItem("name");
    localStorage.removeItem("userId");
    localStorage.removeItem("street");
    localStorage.removeItem("city");
    localStorage.removeItem("postal");
    clearTimeout(logOutTimer);
  }, []);

  const loginHandler = ({
    token,
    userId,
    tokenExpirationDate,
    displayName,
    email,
  }) => {
    setToken(token);
    localStorage.setItem("userId", userId);
    localStorage.setItem("token", token);
    localStorage.setItem("email", email);
    localStorage.setItem("name", displayName);
    localStorage.setItem("expiration", tokenExpirationDate);

    const remainingTime = calculateRemainingTime(tokenExpirationDate);
    logOutTimer = setTimeout(logoutHandler, remainingTime);
  };

  let firsTimeRef = useRef(true);

  useEffect(() => {
    if (tokenData && firsTimeRef.current) {
      logOutTimer = setTimeout(logoutHandler, tokenData.remainingTime);
    }

    firsTimeRef.current = false;
  }, [tokenData, logoutHandler]);

  const contextValue = {
    isLoggedIn: isLoggedIn,
    token: token,
    login: loginHandler,
    logout: logoutHandler,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
