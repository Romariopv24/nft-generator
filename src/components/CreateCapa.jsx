import React from "react"
import { useIntl } from "react-intl"
import { ReactComponent as Agregar } from "../assets/svg/plus-circleWhite.svg"
import getCapas from "../utils/getCapas"

const CreateCapa = ({
  createCapaHandle,
  setCapaName,
  capaName,
  setClickedCapa,
  
}) => {
  const intl = useIntl()

  let ArrayIds = getCapas().map((e) => e.id)
  let maxId = Math.max(...ArrayIds) + 1

  function crearAux() {
    let nombre = intl.formatMessage({
      id: "createcapas.layer",
      defaultMessage: "New Layer"
    })
    // return Nombre + '-' + Math.floor((Math.random() * (999 - 0 + 1)) + 0)
    return nombre + "-" + maxId
  }

  const handleAdd = (e) => {
    if (e.key === "Enter" || e.type === "click") {
      try {
        createCapaHandle(capaName || crearAux())
      } catch (error) {
        console.log(error)
      }
      setCapaName("")
      setClickedCapa(true)
    }
  }

  return (
    <div className="d-flex justify-content-between align-items-center">
      <span className="w-100">
        <input
          className="form-control-sm w-100"
          value={capaName}
          placeholder={intl.formatMessage({
            id: "createcapas.layer",
            defaultMessage: "New Layer"
          })}
          onChange={(e) => setCapaName(e.target.value)}
          onKeyDown={handleAdd}
        />
      </span>
      <span className="flex-shrink text-end ps-2">
        <Agregar
          onClick={handleAdd}
          style={{ width: "22px", cursor: "pointer" }}
        />
      </span>
    </div>
  )
}

export default CreateCapa
