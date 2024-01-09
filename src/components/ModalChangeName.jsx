import React, { useState } from "react"
import { FormattedMessage } from "react-intl"
import { ReactComponent as Close } from "../assets/svg/close-ellipse.svg"
import getCapas from "../utils/getCapas"
import setSelectedCapaId from "../utils/setSelectedCapaId"

export default function ModalChangeName(props) {
  const { capas, setCapas, selectedCapa, setOpenNewModal, setNewCapaName } =
    props

  const [capita, setCapita] = useState("")

  const setNewNameCapa = (e) => {
    const name = e.target.value
    let capas = getCapas()
    const capaIndex = capas.findIndex((capa) => capa.id === selectedCapa.id)
    capas[capaIndex].name = name
    capas[capaIndex].directory = name
    localStorage.setItem("capas", JSON.stringify(capas))
    capas = getCapas()
    setSelectedCapaId(capas.find((capa) => capa.id === selectedCapa.id))
    setCapas(capas)
    setCapita(name)
  }

  return (
    <>
      <div className={"container-modal"}>
        <div
          className="card-modal"
          style={{
            border: "1px solid #00B8FF",
            padding: "10px",
            display: "flex",
            justifyContent: "space-between",
            flexDirection: "column"
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              width: "100%"
            }}
          >
            <label
              htmlFor="capaName"
              style={{
                display: "flex",
                justifyContent: "center",
                height: "2rem",
                width: "100%"
              }}
            >
              <FormattedMessage
                id="form.changelayername"
                defaultMessage="Change Layer Name"
              />
            </label>
            <Close
              style={{ width: "20px", height: "20px" }}
              onClick={() => setOpenNewModal(false)}
            />
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              width: "100%",
              justifyContent: "center",
              alignContent: "center",
              alignItems: "center",
              marginTop: "2rem"
            }}
          >
            <div
              style={{
                width: "50%",
                display: "flex",
                justifyContent: "center",
                flexDirection: "column"
              }}
            >
              <input
                type="text"
                className="form-control-sm w-100"
                id="capaName"
                name="capaName"
                value={capita.replace(" ", "-")}
                onChange={setNewNameCapa}
                style={{ border: "1px solid #00B8FF", marginBottom: "2rem" }}
              />
              <button
                className="__boton-mediano mx-0 color enphasis-button"
                onClick={() => setOpenNewModal(false)}
              >
                <FormattedMessage
                  id="form.changelayerButton"
                  defaultMessage="Change"
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
