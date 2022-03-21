import classes from "./MealItemForm.module.css";
import Input from "../../UI/Input";
import { useContext, useRef } from "react";
import CartContext from "../../../store/cart-context";

function MealItemForm(props) {
  const cartCtx = useContext(CartContext);
  const inputRef = useRef(0);

  const submitHandler = (event) => {
    event.preventDefault();

    cartCtx.addItem({ ...props.meal, amount: +inputRef.current.value });
    console.log(inputRef.current);
  };

  return (
    <form className={classes.form} onSubmit={submitHandler}>
      <Input
        label="Amount"
        input={{
          ref: inputRef,
          type: "number",
          min: "1",
          max: "5",
          defaultValue: "1",
          step: "1",
          id: "amount",
        }}
      ></Input>
      <button>+ Add</button>
    </form>
  );
}

export default MealItemForm;
