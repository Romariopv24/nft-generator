import React, { useState } from "react";
import ReactDOM from "react-dom";

export default function ModalChangeName(props) {
  const { selectedCapa, setNewNameCapa, setChangeName, changeName } = props;

  const [putoJoseRosales, setPutoJoseRosales] = useState(selectedCapa.name);

  console.log(putoJoseRosales);
  return (
    <>
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
          <input
            type="text"
            // className="form-control-sm w-100"
            id="capaName" //
            // name="capaName"
            value={putoJoseRosales}
            onChange={(e) => setPutoJoseRosales(e.target.value)}
            style={{ color: "black" }}
          />
          <button onClick={() => setChangeName(false)}>
            Change Layer name
          </button>
        </div>
      </div>
    </>
  );
}
