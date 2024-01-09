import React, { useState } from "react"
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd"
import ReactDOM from "react-dom"
import { FormattedMessage } from "react-intl"
import { eliminar, obtenerTodo, reiniciar } from "../db/CrudDB.js"
import "../styles/scss/_pedir-correro.scss"
import "../styles/scss/_preview-imgpj.scss"
import eliminarCapa from "../utils/eliminarCapa"
import getCapas from "../utils/getCapas"
import getDatosImg from "../utils/getDatosImg"
import getSelectedCapaId from "../utils/getSelectedCapaId"
import resetLocalStorage from "../utils/resetLocalStorage"
import setSelectedCapaId from "../utils/setSelectedCapaId"
import Capa from "./Capa"
import CreateCapa from "./CreateCapa"
import GenericModal from "./GenericModal"
import ModalChangeName from "./ModalChangeName.jsx"

function Capas({
  capas,
  setCapas,
  createCapaHandle,
  selectedCapa,
  setSelectedCapa,
  db,
  maxConvinacion,
  requiredRarity
}) {
  // console.log("SOY CAPAS---------------")
  const [listImagenDB, setlistImagenDB] = useState([])
  const [isOpenModalPreviewImg, setIsOpenModalPreviewImg] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [showModal2, setShowModal2] = useState(false)

  const reorder = (list, startIndex, endIndex) => {
    const result = [...list]
    const [removed] = result.splice(startIndex, 1)
    result.splice(endIndex, 0, removed)

    localStorage.setItem("capas", JSON.stringify(result))
    return result
  }

  const clickCapaHandler = (capa) => {
    setSelectedCapa(capa)
    setSelectedCapaId(capa.id)
    // console.log(capa)
  }
  //LYEA PERDONEN KAMEHAMEHAQ

  function eliminarCapasHandle() {
    resetLocalStorage()
    setCapas(getCapas())
    setSelectedCapa(getCapas().find((s) => s.id === getSelectedCapaId()))
    maxConvinacion.current.innerText = "0"
    reiniciar(db, "images")
    reiniciar(db, "smallImages")
    setShowModal2(false)
  }

  async function loadImageFromDB() {
    const result = await obtenerTodo(db, "images")
    let NewCapa = capas.filter((e) => e.images.length !== 0)
    if (result) {
      let imagenes = NewCapa.map((e) => {
        let index = Math.floor(Math.random() * e.images.length)

        return result.find((db) => db.clave === e.images[index].id)
      })
      console.log({ imagenes })

      setlistImagenDB(imagenes)
      imagenes.length && setIsOpenModalPreviewImg(!isOpenModalPreviewImg)
    }
  }

  function EliminarImgDeCapasEnDB() {
    let capaId = getSelectedCapaId()
    let IdImag = getCapas()
      .find((e) => e.id === capaId)
      .images.map((e) => e.id)
    // console.log(IdImag)
    for (let i = 0; i < IdImag.length; i++) {
      eliminar(db, "images", IdImag[i])
      eliminar(db, "smallImages", IdImag[i])
    }
  }

  function eliminarCapaHandle() {
    EliminarImgDeCapasEnDB()
    setSelectedCapa(getCapas()[0])
    eliminarCapa()
    setCapas(getCapas())
    setShowModal(false)
    recarcularCombinaciones()
  }

  function recarcularCombinaciones() {
    const newCapas = getDatosImg().newCapasImageDiferent
    let newCapaAux = newCapas.filter((e) => e.images.length !== 0)
    if (newCapaAux.length !== 0) {
      maxConvinacion.current.innerHTML = newCapas.reduce(
        (result, capa) =>
          capa.images.length > 0 ? result * capa.images.length : result,
        1
      )
    } else {
      maxConvinacion.current.innerHTML = 0
    }
  }

  const handleOpenModal = () => {
    setShowModal(true)
  }

  const [capaName, setCapaName] = useState("")
  const [openNewModal, setOpenNewModal] = useState(false)
  const [newCapaName, setNewCapaName] = useState("")
  const [clickCapa, setClickedCapa] = useState(false)

  return (
    <>
      <DragDropContext
        onDragEnd={(result) => {
          const { source, destination } = result
          if (!destination) {
            return
          }
          if (
            source.index === destination.index &&
            source.droppableId === destination.droppableId
          ) {
            return
          }

          setCapas((prevCapas) =>
            reorder(prevCapas, source.index, destination.index)
          )
        }}
      >
        <div className="drag-drop" id="capas">
          <Droppable droppableId="capas">
            {(droppableProvided) => (
              <ul
                {...droppableProvided.droppableProps}
                ref={droppableProvided.innerRef}
                className="capas-container"
              >
                {capas.map((capa, index) => (
                  <>
                    {selectedCapa && selectedCapa?.id && capa && capa.id && (
                      <Draggable
                        key={capa.id}
                        draggableId={capa.id}
                        index={index}
                      >
                        {(draggableProvided) => (
                          <li
                            {...draggableProvided.draggableProps}
                            ref={draggableProvided.innerRef}
                            {...draggableProvided.dragHandleProps}
                            className={`capa ${
                              selectedCapa.id === capa.id && "selected-capa"
                            }`}
                            onClick={(e) => {
                              clickCapaHandler(capa)
                            }}
                          >
                            {/* aqui se llama al componente capa */}

                            <Capa
                              setNewCapaName={setNewCapaName}
                              capa={capa}
                              newCapaName={newCapaName}
                              setOpenNewModal={setOpenNewModal}
                              setCapaName={setCapaName}
                              handleOpenModal={handleOpenModal}
                              setCapas={setCapas}
                              selectedCapa={selectedCapa}
                              requiredRarity={requiredRarity}
                              db={db}
                            />
                          </li>
                        )}
                      </Draggable>
                    )}
                  </>
                ))}
                {droppableProvided.placeholder}
              </ul>
            )}
          </Droppable>
        </div>
        {openNewModal &&
          ReactDOM.createPortal(
            <ModalChangeName
              setNewCapaName={setNewCapaName}
              setOpenNewModal={setOpenNewModal}
              selectedCapa={selectedCapa}
              setCapas={setCapas}
              capas={capas}
            />,
            document.getElementById("modalPortal")
          )}
        <div className="capa capaCreate" id="nuevaCapa">
          <CreateCapa
            setCapaName={setCapaName}
            capaName={capaName}
            createCapaHandle={createCapaHandle}
            clickCapaHandler={setClickedCapa}
          />
        </div>

        <div className="d-flex  flex-nowrap justify-content-evenly align-items-center mt-2">
          <button
            className="__boton-mediano mx-0 color enphasis-button"
            onClick={() => {
              loadImageFromDB()
            }}
            id="visualizar"
          >
            <FormattedMessage
              id="capas.btn-visualize"
              defaultMessage="Visualize"
            />
          </button>
          <button
            className="__boton-mediano mx-0 enphasis-button"
            onClick={() => {
              setShowModal2(true)
            }}
            id="reiniciar"
          >
            <FormattedMessage id="capas.btn-restart" defaultMessage="Restart" />
          </button>
        </div>

        <div className="mt-2 text-center">
          <span>
            <FormattedMessage
              id="capas.message"
              defaultMessage="The order of the layers should go from top to bottom, showing the bottom layer on top and the frontmost layer underneath."
            />
          </span>
        </div>

        {/* <div className="container-preview"> */}
        <div className={isOpenModalPreviewImg ? "cont-wrapper " : "d-none"}>
          <div
            className={
              isOpenModalPreviewImg
                ? "container-preview"
                : "container-preview pointerEvent"
            }
            style={{ border: "1px solid #00B8FF", padding: "10px" }}
          >
            {isOpenModalPreviewImg ? (
              <div className="container-img">
                <div
                  className="eliminar-imagen"
                  onClick={() => {
                    setIsOpenModalPreviewImg(!isOpenModalPreviewImg)
                    setlistImagenDB([])
                  }}
                >
                  <FormattedMessage
                    id="capas.close-modal-preview"
                    defaultMessage="Close"
                  />
                </div>
                {listImagenDB.map((e, index) => (
                  <img key={index} src={e.img} alt="" className="preview-img" />
                ))}
              </div>
            ) : (
              ""
            )}
          </div>
        </div>
      </DragDropContext>

      <GenericModal show={showModal}>
        <div className="p-4">
          <p>
            <FormattedMessage
              id="capas.modal-delete-tittle"
              defaultMessage="Are you sure you want to delete layer?"
            />
          </p>
          <p>
            <FormattedMessage
              id="capas.modal-delete-subTittle"
              defaultMessage="This action can not be undone..."
            />
          </p>
        </div>
        <div className="my-3">
          <button
            className="__boton-mediano-borrar"
            onClick={eliminarCapaHandle}
          >
            <FormattedMessage
              id="capas.modal-delete-btn-remove"
              defaultMessage="Remove"
            />
          </button>
          <button
            className="__boton-mediano enphasis-button"
            onClick={() => setShowModal(false)}
          >
            <FormattedMessage
              id="capas.modal-delete-btn-cancel"
              defaultMessage="Cancel"
            />
          </button>
        </div>
      </GenericModal>

      <GenericModal show={showModal2}>
        <div className="p-4">
          <p>
            <FormattedMessage
              id="capas.alert-restart"
              defaultMessage="Are you sure you want to reset all layers?"
            />
          </p>
          <p>
            <FormattedMessage
              id="capas.modal-delete-subTittle"
              defaultMessage="This action can not be undone..."
            />
          </p>
        </div>
        <div className="my-3">
          <button
            className="__boton-mediano-borrar"
            onClick={eliminarCapasHandle}
            style={{ width: "100px" }}
          >
            <FormattedMessage id="capas.modal-yes" defaultMessage="Yes" />
          </button>
          <button
            className="__boton-mediano enphasis-button"
            onClick={() => setShowModal2(false)}
          >
            <FormattedMessage
              id="capas.modal-delete-btn-cancel"
              defaultMessage="Cancel"
            />
          </button>
        </div>
      </GenericModal>
    </>
  )
}

export default Capas
