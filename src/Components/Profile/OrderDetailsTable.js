import { useLocation } from "react-router-dom";
import React from "react";
import Table from "./Table";
import Modal from "../UI/modal";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import classes from "./OrderDetails.module.css";

function OrderDetailsTable() {
  let location = useLocation();
  let navigate = useNavigate();

  let tableContentArray;
  let content;

  useEffect(() => {
    if (!location.state) {
      navigate("../profile/orders");
    }
  }, [location, navigate]);

  const tableHeader = React.useMemo(
    () => [
      {
        Header: "Amount",
        accessor: "amount", // accessor is the "key" in the data
      },
      {
        Header: "Order",
        accessor: "name", // accessor is the "key" in the data
      },
      {
        Header: "Price",
        accessor: "price",
      },
    ],
    []
  );

  const navigateBackHandler = () => {
    navigate("../profile/orders", { state: location.state.dataOrders });
  };

  if (location.state) {
    tableContentArray = location.state.items;
    content = (
      <React.Fragment>
        <Table
          classes={classes}
          header={"Order Details"}
          tableHeader={tableHeader}
          tableContentArray={tableContentArray}
        ></Table>
        <div className={classes.actions}>
          <button onClick={navigateBackHandler}>Back</button>
        </div>
      </React.Fragment>
    );
  }

  return <Modal auth={true}>{content}</Modal>;
}

export default OrderDetailsTable;
