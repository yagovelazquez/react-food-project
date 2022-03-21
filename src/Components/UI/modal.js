import { Fragment } from "react";
import classModal from "../Auth/AuthModal.module.css";
import classes from "./Modal.module.css";
import ReactDOM from "react-dom";

const Backdrop = (props) => {
  const { onHideModal } = props;
  if (props.auth) {
    return <div className={classModal.backdrop} onClick={onHideModal} />;
  }

  return <div className={classes.backdrop} onClick={onHideModal} />;
};

const ModalOverlay = (props) => {
  if (props.auth) {
    return (
      <div className={classModal.modal}>
        <div className={classModal.content}>{props.children}</div>
      </div>
    );
  }

  return (
    <div className={classes.modal}>
      <div className={classes.content}>{props.children}</div>
    </div>
  );
};

const modalElement = document.getElementById("overlay");

const Modal = (props) => {
  const { onHideModal } = props;
  return (
    <Fragment>
      {ReactDOM.createPortal(
        <Backdrop auth={props.auth} onHideModal={onHideModal} />,
        modalElement
      )}
      {ReactDOM.createPortal(
        <ModalOverlay auth={props.auth}>{props.children}</ModalOverlay>,
        modalElement
      )}
    </Fragment>
  );
};

export default Modal;
