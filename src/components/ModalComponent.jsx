import React, { useState } from "react";
import ReactDOM from "react-dom";
import { FormattedMessage } from "react-intl";
import "../styles/scss/_modalPortal.scss";

const ModalComponent = (props) => {
  const [isShownModal, setIsShownModal] = useState(false);

  function hideModal() {
    setIsShownModal(false);
  }

  function showModal() {
    setIsShownModal(true);
  }

  function handleClick(e) {
    e.stopPropagation(); // Previene la propagación del evento al botón padre
    showModal();
    props.func();
}

  return (
    <>

      <input
        className={`${props.classButton}`}
        type={`${props.typeButton}`}
        role={`${props.roleButton}`}
        id={`${props.idButton}`}
        onClick={() => {
          showModal();
          props.func();
        }}
      >
      </input> 
        <span onClick={handleClick} class="form-check-label capa-name" >{props.textButton}</span>
   
      {isShownModal &&
        ReactDOM.createPortal(
          <div
            // className={
            //   isShownModal === true
            //     ? "container-modal"
            //     : "container-modal display-none"
            // }
            className={"container-modal"}
          >
            <div
              className="card-modal"
              style={{ border: "1px solid #00B8FF", padding: "10px" }}
            >
              <div className={`header-modal --header-modal ${props.sizeText}`}>
                <div>{props.titleModal}</div>
                <div
                  style={{
                    width: "100%",
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <button onClick={props.resetAllBars}>
                    <FormattedMessage
                      id="capas.reset"
                      defaultMessage="Reset Values"
                    />
                  </button>
                  <div className="cerrar-modal" onClick={() => hideModal()}>
                    Guardar
                    {/* <FormattedMessage id="capas.close-modal-preview" defaultMessage="Close"/> */}
                  </div>
                </div>
              </div>
              <div className="content-modal">
                {props.children}
                {/* {React.Children.map(props.children, (child) => {
                  if (
                    React.isValidElement(child) &&
                    typeof child.type === "function"
                  ) {
                    // return React.cloneElement(child, { hideModal: hideModal });
                    // return React.cloneElement(child, { didCreateForm: ()=>{
                    //   hideModal()
                    // } });
                    return React.cloneElement(child, {
                      didCreateForm: hideModal,
                    });
                  }
                  return child;
                })} */}
              </div>
            </div>
          </div>,
          document.getElementById("modalPortal")
        )}
    </>
  );
};

export default ModalComponent;
