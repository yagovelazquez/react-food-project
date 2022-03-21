import Modal from "../UI/modal";
import { useNavigate, useLocation } from "react-router-dom";
import useHttp from "../hooks/use-http";
import { getOrders } from "../lib/api";
import Table from "./Table";
import React from "react";
import _ from "lodash";
import { Link } from "react-router-dom";
import { useEffect, useRef } from "react";
import classes from "./Orders.module.css";

const retrieveUserId = () => {
  const userId = localStorage.getItem("userId");
  return userId;
};

function Orders() {
  let tableContentArray = [];
  let location = useLocation();
  const storagedUser = retrieveUserId();
  const loadAttemptRef = useRef(0);
  let isLocationState = location.state;

  const getTableValues = (dataOrder) => {
    for (const key in dataOrder) {
      let objeto = {};

      objeto.date = new Date(new Date() + dataOrder[key].orderContent.date)
        .toISOString()
        .replace("-", "/")
        .split("T")[0]
        .replace("-", "/");
      objeto.dateSort = dataOrder[key].orderContent.date;

      const orderDetailArray = dataOrder[key].orderContent.items.map((item) => {
        return {
          ...item,
          price: `$ ${item.price}`,
        };
      });

      objeto.orderDetails = (
        <Link
          to={key}
          state={{ items: orderDetailArray, dataOrders: dataOrder }}
        >
          Details
        </Link>
      );
      objeto.totalAmount = `$ ${dataOrder[key].orderContent.totalAmount}`;
      tableContentArray.push(objeto);
    }
  };

  if (isLocationState) {
    const dataOrderr = location.state;

    getTableValues(dataOrderr);
  }

  let navigate = useNavigate();

  const {
    data: dataOrders,
    status: statusOrders,
    sendRequest: sendRequestOrders,
    error: errorOrders,
  } = useHttp(getOrders);

  const hideModalHandler = () => {
    navigate("../");
  };

  const fetchAddressAgain = () => {
    sendRequestOrders(storagedUser);
  };

  useEffect(() => {
    if (statusOrders === null && !isLocationState) {
      loadAttemptRef.current++;
      sendRequestOrders(storagedUser);
    }
    let timer = setTimeout(() => {
      if (
        !isLocationState &&
        statusOrders === "completed" &&
        errorOrders &&
        loadAttemptRef.current < 4
      ) {
        loadAttemptRef.current++;
        sendRequestOrders(storagedUser);
      }
    }, 1000);

    return () => {
      clearTimeout(timer);
    };
  }, [
    storagedUser,
    sendRequestOrders,
    statusOrders,
    errorOrders,
    isLocationState,
  ]);

  if (dataOrders && !isLocationState) {
    getTableValues(dataOrders);
  }

  const sortedArrays = _.orderBy(tableContentArray, ["dateSort"], ["desc"]);

  const memoizedTableArray = React.useMemo(() => sortedArrays, [sortedArrays]);

  const tableHeader = React.useMemo(
    () => [
      {
        Header: "Date",
        accessor: "date", // accessor is the "key" in the data
      },
      {
        Header: "Order",
        accessor: "orderDetails",
      },
      {
        Header: "Amount",
        accessor: "totalAmount", // accessor is the "key" in the data
      },
    ],
    []
  );

  let content;
  const nagivateBack = () => {
    navigate("../profile");
  };

  if (statusOrders === "completed" && !dataOrders && !errorOrders) {
    content = <h1>You haven't order yet</h1>;
  }

  if (
    (statusOrders === "completed" && dataOrders && !errorOrders) ||
    isLocationState
  ) {
    content = (
      <React.Fragment>
        <Table
          classes={classes}
          header="Orders"
          tableContentArray={memoizedTableArray}
          tableHeader={tableHeader}
        ></Table>
        <div className={classes.actions}>
          <button onClick={nagivateBack}>Back</button>
        </div>
      </React.Fragment>
    );
  }

  if (
    statusOrders === "pending" ||
    (loadAttemptRef.current < 4 && statusOrders === "completed" && errorOrders)
  ) {
    content = <h1>Loading...</h1>;
  }

  if (
    loadAttemptRef.current >= 4 &&
    !dataOrders &&
    errorOrders &&
    statusOrders === "completed"
  ) {
    content = (
      <React.Fragment>
        <h1>Failed to load your orders, please reload the page</h1>
        <button onClick={fetchAddressAgain}>Try again</button>
      </React.Fragment>
    );
  }

  return (
    <Modal onHideModal={hideModalHandler} auth={true}>
      {content}
    </Modal>
  );
}

export default Orders;
