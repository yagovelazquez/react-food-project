import { useEffect, useState } from "react";
import Joi from "joi-browser";
import classes from "./use-input.module.css";

const useInput = (schema, nameProperty) => {
  const [value, setValue] = useState("");
  const [isTouched, setIsTouched] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const isValueInvalid = isTouched && errorMessage;

  const valueChangeHandler = (event) => {
    setValue(event.target.value);
  };

  const touchHandler = () => {
    setIsTouched(true);
  };

  useEffect(() => {
    const schemaProperty = {
      [nameProperty]: schema[nameProperty],
    };

   
      const { error } = Joi.validate(
        { [nameProperty]: value },
        schemaProperty,
        { abortEarly: false }
      );
      if (error) setErrorMessage(error.details[0].message);
      else setErrorMessage(null);
    


  }, [value, schema, nameProperty, isTouched]);

  const blurHandler = (event) => {
    setIsTouched(true);
  };

  const reset = () => {
    setIsTouched(false);
    setValue("");
  };

  let classInput;

  const renderInput = (label, type, disableInput) => {
    if (isValueInvalid && !disableInput) {
      classInput = `${classes.control} ${classes.invalid}`;
    } else {
      classInput = classes.control;
    }

    return (
      <div className={classInput}>
        <label disabled={false || disableInput} htmlFor={nameProperty}>
          {label}
        </label>
        <input
          onChange={valueChangeHandler}
          onBlur={blurHandler}
          value={value}
          type={type}
          id={nameProperty}
          disabled={false || disableInput}
        />
        {!disableInput && isValueInvalid && (
          <p className={classes.invalid}>{errorMessage}</p>
        )}
      </div>
    );
  };

  return {
    reset,
    value,
    classInput,
    blurHandler,
    valueChangeHandler,
    isValueInvalid,
    errorMessage,
    isTouched,
    touchHandler,
    renderInput,
  };
};

export default useInput;
