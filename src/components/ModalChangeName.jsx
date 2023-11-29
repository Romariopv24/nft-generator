import React, { useState } from "react"
import { FormattedMessage } from "react-intl"
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
    setCapita(name)
    localStorage.setItem("capas", JSON.stringify(capas))
    capas = getCapas()
    setSelectedCapaId(capas.find((capa) => capa.id === selectedCapa.id))
    setCapas(capas)
  }

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
          <form className="form-capa-name" onSubmit={(e) => e.preventDefault()}>
            <label htmlFor="capaName" className="form-label">
              <FormattedMessage
                id="form.layername"
                defaultMessage="Layer Name"
              />
            </label>
            <input
              type="text"
              className="form-control-sm w-100"
              id="capaName"
              name="capaName"
              value={capita}
              onChange={setNewNameCapa}
            />
          </form>
          <button onClick={() => setOpenNewModal(false)}>
            Change Layer name
          </button>
        </div>
      </div>
    </>
  )
}
