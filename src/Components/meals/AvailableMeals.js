import classes from "./AvailableMeals.module.css";
import Card from "../UI/Card";
import MealItem from "./MealItem/MealItem";
import { useRef, useEffect } from "react";
import { fetchMeals } from "../lib/api";
import useHttp from "./../hooks/use-http";

let storagedmeals = [];

function AvailableMeals() {
  const { sendRequest, error, status, data } = useHttp(fetchMeals, true);

  let attemptRef = useRef(0);

  useEffect(() => {
    let timer;

    if (storagedmeals.length === 0 && attemptRef.current <= 5) {
      timer = setTimeout(() => {
        sendRequest();
        attemptRef.current++;
      }, 2000);
    }
    return () => {
      clearTimeout(timer);
    };
  }, [sendRequest, status]);

  useEffect(() => {
    if (status === "completed" && data && !error) {
      storagedmeals = data;
    }
  }, [status, data, error]);

  return (
    <section className={classes.meals}>
      {status === "completed" && error && attemptRef.current >= 5 && (
        <h1 className={classes.error}>Could not load the meals</h1>
      )}
      {storagedmeals.length === 0 && attemptRef.current < 5 && (
        <h1 className={classes.loading}>Loading...</h1>
      )}
      <ul>
        {storagedmeals.map((meal) => (
          <Card key={meal.id}>
            <MealItem
              meal={meal}
              name={meal.name}
              description={meal.description}
              price={meal.price}
            ></MealItem>
          </Card>
        ))}
      </ul>
    </section>
  );
}

export default AvailableMeals;
