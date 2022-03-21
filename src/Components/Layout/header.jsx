import { Fragment } from "react";
import mealsImage from "./../../img/meals.jpg";
import classes from "./Header.module.css";
import HeaderCartButton from "./headerCartButton";
import HeaderProfileButton from "./headerProfileButton";

function Header(props) {
  return (
    <Fragment>
      <header className={classes.header}>
        <h1>React Meals</h1>
        <HeaderProfileButton></HeaderProfileButton>
        <HeaderCartButton
          onShowCartHandler={props.onShowCartHandler}
        ></HeaderCartButton>
      </header>
      <div className={classes["main-image"]}>
        <img src={mealsImage} alt="A table full of delicious food"></img>
      </div>
    </Fragment>
  );
}

export default Header;
