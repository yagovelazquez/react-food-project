import { DUMMY_MEALS, FIREBASE_DOMAIN } from "../../config";
import Modal from "../UI/modal";
import useHttp from "../hooks/use-http";
import classes from "./StartProject.module.css";
import { useNavigate } from "react-router-dom";

function StartProject() {
  let navigate = useNavigate();

  async function populateDb() {
    const response = await fetch(`${FIREBASE_DOMAIN}/meals.json`, {
      method: "POST",
      body: JSON.stringify({
        meals: DUMMY_MEALS,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error();
    }

    const data = await response.json();
    return data;
  }

  const hideModalHandler = () => {
    navigate("/");
  };

  const { data, error, status, sendRequest } = useHttp(populateDb);

  const populatedbHandler = () => {
    sendRequest();
  };

  let content;
  let contentButton;

  if (data && !error && status === "completed") {
    content = <h2>Data base populated successfully!</h2>;
  }

  if (!data & (status === "pending")) {
    content = <h2>Populating db...</h2>;
  }

  if (error && status === "completed") {
    content = (
      <div>
        <h2>{error}</h2>
        <h2>Please, try again</h2>
      </div>
    );
  }

  if (status === null || (error && status === "completed")) {
    contentButton = (
      <button onClick={populatedbHandler} className={classes.button}>
        Populate DB
      </button>
    );
  }

  return (
    <Modal onHideModal={hideModalHandler} auth={true}>
      {content}
      {contentButton}
    </Modal>
  );
}

export default StartProject;
