import React, {useState} from "react";
import "../styles/scss/_capa.scss"
import { ReactComponent as Delete } from '../assets/svg/trash.svg';
import { FormattedMessage, useIntl } from "react-intl";
import getCapas from '../utils/getCapas';
import { obtenerTodo, eliminar } from '../db/CrudDB.js'
import Modal from './Modal';

const Capa = ({ capa, handleOpenModal, setCapas, selectedCapa, requiredRarity, db}) => {

const intl = useIntl();

const [listImagenDB, setlistImagenDB] = useState([]);

async function loadImageFromDB() {
  let result = await obtenerTodo(db, 'images')
  // console.log(result)
  setlistImagenDB(result)
  return result
}

const capaIndex = getCapas().findIndex(capa => capa.id === selectedCapa.id)

//Calculo de rareza con barra dependiente
function handleRangeValue(event, element, isRarity) {
  let capas = getCapas();
  const capaIndex = capas.findIndex(capa => capa.id === selectedCapa.id);
  const imagenes = capas[capaIndex].images;
  const imagen = imagenes.find(e => e.id === element.id);

  // Calcula la diferencia entre el valor actual y el nuevo valor
  const diff = Number(event.target.value) - imagen.porcentajeBarra;

  // Actualiza el estado de la barra para la imagen actual
  imagen.porcentajeBarra = Number(event.target.value);

  // Calcula la suma total de los porcentajes de todas las imágenes
  const totalPorcentaje = imagenes.reduce((total, img) => total + img.porcentajeBarra, 0);

  // Si la suma total excede 100%, redistribuye proporcionalmente
  if (totalPorcentaje > 100) {
    const scaleFactor = 100 / totalPorcentaje;

    // Ajusta todos los valores nuevamente para que la suma sea igual a 100%
    imagenes.forEach(i => {
      i.porcentajeBarra *= scaleFactor;
      i.porcentaje = i.porcentajeBarra;
    });
  }

  // Si la suma total es menor que 100%, redistribuye proporcionalmente
  else if (totalPorcentaje < 100) {
    const remainingDiff = 100 - totalPorcentaje;
    const proportionalDiff = remainingDiff / imagenes.length;

    // Ajusta los valores de todas las imágenes, incluida la imagen actual
    imagenes.forEach(i => {
      i.porcentajeBarra += proportionalDiff;
      i.porcentaje = i.porcentajeBarra;
    });
  }

  localStorage.setItem('capas', JSON.stringify(capas));
  requiredRarity(isRarity);
}

// Función para restablecer todas las barras al valor inicial
function resetAllBars() {
  let capas = getCapas();
  const capaIndex = capas.findIndex(capa => capa.id === selectedCapa.id);
  const imagenes = capas[capaIndex].images;

  // Calcula cuántas imágenes hay
  const numImages = imagenes.length;

  // Calcula el valor inicial para cada imagen
  const initialValue = 100 / numImages;

  // Establece el valor inicial para todas las imágenes
  imagenes.forEach(i => {
    i.porcentajeBarra = initialValue;
    i.porcentaje = i.porcentajeBarra;
  });

  // Actualiza el estado en el almacenamiento local
  localStorage.setItem('capas', JSON.stringify(capas));

  // Llama a la función que verifica la rareza (si es necesario)
  requiredRarity(/* Indica aquí si esRarity es true o false */);
}

//Calculo de rareza con barra independiente
// function handleRangeValue(event, element, isRarity) {
//   let capas = getCapas()
//   const capaIndex = capas.findIndex(capa => capa.id === selectedCapa.id)
//   const imagenes = capas[capaIndex].images
//   // const imagenIndex = imagenes.findIndex(e=>e.id === element.id )
//   const imagen = imagenes.find(e => e.id === element.id)
//   imagen.porcentajeBarra = Number(event.target.value)
//   const totalPorcentajeBarra = imagenes.reduce((previousValue, currentValue) => {
//     return previousValue + currentValue.porcentajeBarra
//   }, 0)
//   console.log({ totalPorcentajeBarra })
//   imagenes.forEach(i => {
//     const porcentaje = (i.porcentajeBarra * 100) / totalPorcentajeBarra
//     i.porcentaje = porcentaje
//   })
//   localStorage.setItem('capas', JSON.stringify(capas))
//   requiredRarity(isRarity)
//   // console.log(capas)
// }

  return (
    <>
      <div className="d-flex justify-content-between align-items-center position-relative">
        <span className="capa-name">{capa.name}</span>


        <div className="position-absolute top-50 start-50 translate-middle">
          <span id="imagesQuantity" className="_image-count">{capa.images.length}</span>
        </div>



              <div className="d-flex justify-content-between align-items-center position-absolute top-50 end-0 translate-middle-y ">
              <div class="form-check form-switch ">
              <Modal classButton="form-check-input capa-name "
                textButton = <FormattedMessage id='form.btn-rarity' defaultMessage='Rarity'/>
                typeButton="checkbox"
                roleButton="switch"
                idButton="flexSwitchCheckDefault"
                variant="primary"
                titleModal=""
                sizeText="fs-5"
                func={loadImageFromDB}>
                <div className='container-rarity' >
                  <button onClick={resetAllBars}>
                    <FormattedMessage id="capas.reset" defaultMessage="Reset Values"/> 
                  </button>
                  {/* <div className='d-flex me-5 container-rarity-top'>
                    <div className="form-check form-switch">
                      <input className="form-check-input" type="checkbox" onClick={() => requiredRarity(!selectedCapa.required)} defaultChecked={selectedCapa.required} />
                      <label className="form-check-label">
                        <FormattedMessage
                          id="form.modal-rarity"
                          defaultMessage="Require rarity"
                        />
                      </label>
                    </div>
                  </div> */}
                  {/*-----------render Imagenes individuales ----------------*/}
                  {
                    getCapas()[capaIndex].images.map(e =>
                      <div className="container-rarity-bottom " key={e.id}>
                        {/*--------- Imagen --------------------*/}
                        <div className="image-rarity-settings-container">
                          <img src={listImagenDB?.filter(a => a.clave === e.id)[0]?.img} alt="" />
                        </div>
                        <div className='container-rarity-info' >
                          <h5>{e.name.slice(0,e.name.indexOf('-'))}</h5>
                          <div className='container-rarity-inputRange'>
                            <input type="range" className="form-range" id="customRange1" min="1" max="100" step="1"
                              onChange={(event) => { handleRangeValue(event, e, selectedCapa.required) }}
                              value={e.porcentajeBarra}
                            />
                            {/* porcentaje sin decimales truncado */}
                            {/* <input type="number"
                            onChange={(event) => { handleRangeValue(event, e, selectedCapa.required) }}
                            placeholder={`${e.porcentaje.toFixed(1)}%`}
                            style={{backgroundColor: "transparent"}} /> */}

                            {/* porcentaje sin decimales redondeado
                            <h5>{`${Math. round(e.porcentaje)}%`}</h5> */}
                          </div>
                          {/* procentaje con decimales */}
                          <h5 className=''>{`${e.porcentaje.toFixed(1)}%`}</h5>

                        </div>
                      </div>)
                  }
                </div>
              </Modal>
              </div>

              <div class="">
              <Delete fill="#ec2d01" className={(selectedCapa.id === capa.id && capa.id !== "1") ? "delete-button-show" : "delete-button-hide"} onClick={handleOpenModal} />
              </div>

              </div>


      </div>




    </>
  );
};

export default Capa;
