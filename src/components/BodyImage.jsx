import React, { useState, useEffect } from 'react'
import getCapas from '../utils/getCapas'
import '../styles/scss/_body-images.scss'
import { generarPorcentaje } from '../utils/generarRarity'
import getDatosImg from '../utils/getDatosImg'
import { eliminar, obtenerTodo, consultar } from '../db/CrudDB'
import {ReactComponent as Close} from "../assets/svg/close.svg"
import { FormattedMessage } from 'react-intl'

const BodyImage = ({ createCapaImageHandle, selectedCapa, maxConvinacion, setCapas, db, setLoadingImages, isChangedCapa, setIsChangedCapa }) => {

  const [listImagenLocal, setListImagenLocal] = useState([])
  const [listImagenDB, setListImagenDB] = useState([])
  const [img, setImg] = useState("")
  const [listImagenLocalLength, setListImagenLocalLength] = useState(0);
  // console.log("SOY BODYIMAGE---------------")

  useEffect(() => {
    if (listImagenLocal.length !== listImagenLocalLength) {
      // console.log('parte1')
      const capas = getCapas()
      const index = capas.findIndex((s) => { return s.id === selectedCapa.id })
      capas[index].images = listImagenLocal
      localStorage.setItem('capas', JSON.stringify(capas))
      setListImagenLocalLength(listImagenLocal.length)
      const newCapas = getDatosImg().newCapasImageDiferent
      setListImagenLocal(newCapas[index].images)
      let capaIndex = newCapas.findIndex(capa => capa.id === selectedCapa.id)
      generarPorcentaje(capaIndex)
      let newCapaAux = newCapas.filter(e => e.images.length !== 0)
      if (newCapaAux.length !== 0) {
        maxConvinacion.current.innerHTML = newCapaAux
          .reduce((result, capa) => result * capa.images.length, 1)
      } else {
        maxConvinacion.current.innerHTML = 0
      }

    } else if (selectedCapa?.images) {
      // console.log('parte2')

      const capas = getCapas()
      const index = capas.findIndex((s) => { return s.id === selectedCapa.id })
      // setListImagenLocal(capas[index].images)
      if (db) {
        loadImages(capas[index].images)
      }

    }



  }, [selectedCapa, listImagenLocal.length, db])

  async function loadImages(images) {
    setListImagenLocal(images)
    setListImagenLocalLength(images.length)
    loadImageFromDB()
    // setIsChangedCapa(true)

  }

  async function loadImageFromDB() {
    const result = await obtenerTodo(db, 'smallImages')
    setListImagenDB(result)
  }
  async function handleImage(files) {
    const newImages = []
    const newObjImages = []

    for (let i = 0; i < files.length; i++) {
      // console.log({file:files[i]})
      if (files[i].size > 2097152) {
        console.log('the file is larger than 2 MB')
        // esta condicional solo es para saber si son varias imagenes o solo una
        if(files.length === 1){
          return
        } else{
          continue
        }
      }
      console.log(files[i].name)
      if (!files[i].name.includes(".png")) { alert("unsupported file type"); return }
      setLoadingImages({
        cantidadTotal: files.length,
        cantidadActual: i + 1,
        isLoading: true,
      })
      const imageProperties = await getImageProperties(files[i])
      console.log({ smallImage: imageProperties.smallImage })
      const [nuevaImagen, objImg] = await createCapaImageHandle(selectedCapa.id, files[i], imageProperties)
      newImages.push(nuevaImagen)
      newObjImages.push(objImg)
    }

    setLoadingImages({
      cantidadTotal: 0,
      cantidadActual: 0,
      isLoading: false,
    })
    let listImagenLocalAux = [...listImagenLocal, ...newImages]
    let listImagenDBAux = [...listImagenDB, ...newObjImages]
    setListImagenLocal(listImagenLocalAux)
    setListImagenDB(listImagenDBAux)
    setImg(newImages[newImages.length - 1]);
    document.getElementById('inputImagen').value = ""
    setCapas(getCapas())
  }

  // function createImageBase64(file) {
  //   return new Promise(resolve => {
  //     const reader = new FileReader();
  //     if (file) {
  //       reader.readAsDataURL(file);
  //       reader.onloadend = function () {
  //         resolve(reader.result)
  //       };
  //     } else {
  //       resolve("");
  //     }
  //   })
  // }

  function getImageProperties(file) {
    return new Promise(resolve => {
      let reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (e) => {
        //Initiate the JavaScript Image object.
        let image = new Image();
        //Set the Base64 string return from FileReader as source.
        image.src = e.target.result;
        //Validate the File Height and Width.
        image.onload = function () {
          let height = this.height;
          let width = this.width;
          const heightPercent = (height * 100) / width
          const newHeight = (heightPercent * 140) / 100
          var canvas = document.createElement("canvas");
          canvas.style.width = 140 + "px";
          canvas.style.height = newHeight + "px";
          canvas.width = 140;
          canvas.height = newHeight;
          let context = canvas.getContext("2d");
          // context.scale(140/image.width, 140/image.height);
          context.drawImage(image, 0, 0, 140, newHeight);
          resolve({ width, height, image: e.target.result, smallImage: canvas.toDataURL() })
        };
      };
    })
  }

  async function deleteImage() {
    let capas = getCapas()
    let capaIndex = capas.findIndex(capa => capa.id === selectedCapa.id)
    let imageIndex = capas[capaIndex].images.findIndex(capa => capa.id === img.id)
    capas[capaIndex].images.splice(imageIndex, 1)
    await eliminar(db, 'images', img.id)
    await eliminar(db, 'smallImages', img.id)
    localStorage.setItem('capas', JSON.stringify(capas))
    generarPorcentaje(capaIndex)
    let listImagenLocalAux = listImagenLocal.filter(image => image.id !== img.id)
    setListImagenLocal(listImagenLocalAux)
    const result = await obtenerTodo(db, 'smallImages')
    setListImagenDB(result)
    setImg("")
    setCapas(getCapas())
  }

  function generateClassNameCardImg(imagen) {
    if (imagen.isDiferent == true) { return ' card-image card-image-border bg-danger' }
    if (img.id === imagen.id) {
      return "card-image card-image-border"
    } else {
      return "card-image"
    }
  }

  return (
    <>
      <div className="body-images">
        <div className="container-card-image" id='imagenes'>
          {listImagenLocal.map((imagen) => {
            return (
              // <div className={ img.id === imagen.id ? "card-image card-image-border"  :"card-image" } 
              <div className={generateClassNameCardImg(imagen)}
                key={imagen.id}
                onClick={() => { setImg(imagen) }}
              >
                {img.id === imagen.id ? (<div className="eliminar-imagen" onClick={deleteImage}>
                  <Close/>
                </div>) : ""}
                <img src={listImagenDB.find(element => element.clave === imagen.id)?.img || ''} className="item-imagen" alt="" />
                <p className="container-card-image-nombre">{imagen.name.split("-")[0]}</p>
              </div>
            )
          })}

        </div>
        <form className='mt-2'>
          <div className="button-image-agregar" id='agregarImagenes'>
            <p>
              <FormattedMessage
                id='bodyImages.title'
                defaultMessage='Click and drag an Image here!'
              />
            </p>

            <br/>
            <span>
            <FormattedMessage
                id='bodyImages.subtitle'
                defaultMessage='Only images with a weight less than or equal to 2 MB are saved!.'
              />
              </span>
              <br/>
            <span>
            <FormattedMessage
                id='bodyImages.subtitle2'
                defaultMessage='All images in the collection must have the same proportional size.'/>
              </span>
            <input id="inputImagen" type="file" className="file_upload" accept='.png, .jpg, .jpeg, .gif, .bmp' multiple
              onChange={(e) => {
                handleImage(e.target.files)
              }}
            />
            
          </div>
        </form>
      </div>
    </>
  )
}

export default BodyImage
