import { jwtDecode } from "jwt-decode"
import React, { useEffect, useRef, useState } from "react"
import { FormattedMessage, useIntl } from "react-intl"
import "../../node_modules/bootstrap/dist/css/bootstrap.min.css"
import BodyImage from "../components/BodyImage"
import Capas from "../components/Capas"
import Form from "../components/Form"
import { URL } from "../constantes"
import { ConexionDB, agregar, obtenerTodo } from "../db/CrudDB"
import "../styles/scss/app.scss"
import { crearRarityWeights } from "../utils/crearRarityWeights"
import getCapas from "../utils/getCapas"
import getSelectedCapaId from "../utils/getSelectedCapaId"
import getUniqueId from "../utils/getUniqueId"
import setCapa from "../utils/setCapa"
import { useStoreProv } from "../utils/zustand/store"

const Generator = ({
  setLoadingImages,
  setIsActiveModalRegister,
  desLoguearse,
  setName,
  name
}) => {
  const { access_token, setAccess_token, email, signalToken, setSignalToken } =
    useStoreProv()

  const [capas, setCapas] = useState(getCapas())
  const [selectedCapa, setSelectedCapa] = useState(
    getCapas().find((s) => s.id === getSelectedCapaId())
  )
  const [isChangedCapa, setIsChangedCapa] = useState(true)
  const [urlNft, setUrlNft] = useState("")
  const inputProjectName = useRef("")
  const inputProjectDescription = useRef("")
  const maxConvinacion = useRef()
  const inputProjectCollectionSize = useRef(1)
  const [isExisteNombreProject, setIsExisteNombreProject] = useState(null)
  const [db, setDb] = useState(null)
  // console.log("SOY GENERATOR--------------")
  const [listPreview1, setListPreview1] = useState([])
  const [listPreview2, setListPreview2] = useState([])
  const [listPreview3, setListPreview3] = useState([])
  const [isOpenModalPreviewImg, setIsOpenModalPreviewImg] = useState(false)

  async function loadImageFromDBB(setListPreview) {
    const result = await obtenerTodo(db, "images")
    let NewCapa = capas.filter((e) => e.images.length !== 0)
    if (result) {
      let imagenes = NewCapa.map((e) => {
        let index = Math.floor(Math.random() * e.images.length)

        return result.find((db) => db.clave === e.images[index].id)
      })
      console.log({ imagenes })

      setListPreview(imagenes)
      imagenes.length && setIsOpenModalPreviewImg(!isOpenModalPreviewImg)
    }
  }

  const intl = useIntl()

  function requiredRarity(isRarity) {
    console.log("se ejectuta")
    let capas = getCapas()
    const capaIndex = capas.findIndex((capa) => capa.id === selectedCapa.id)
    capas[capaIndex].required = isRarity
    localStorage.setItem("capas", JSON.stringify(capas))
    crearRarityWeights()
    capas = getCapas()
    setSelectedCapa(capas.find((capa) => capa.id === selectedCapa.id))
    setCapas(capas)
  }

  useEffect(() => {
    let newCapa = capas.filter((e) => e.images.length !== 0)
    maxConvinacion.current.innerHTML =
      newCapa.length === 0
        ? "0"
        : newCapa.reduce((result, capa) => result * capa.images.length, 1)
    createConection()
  }, [])

  async function createConection() {
    setDb(await ConexionDB())
  }

  const facebook = JSON.parse(localStorage.getItem("facebook"))
  const google = JSON.parse(localStorage.getItem("google"))
  const metamask = JSON.parse(localStorage.getItem("metamask"))

  const createCapaHandle = (name) => {
    let nombre = getCapas().map((e) => {
      return e.name
    })
    let id = getCapas().map((e) => {
      return e.id
    })
    let maxId = Math.max(...id)
    console.log(maxId)
    let isExiste = nombre.some((e) => e === name)
    if (isExiste) {
      throw Error("el nombre ya existe")
    } else {
      setCapa({
        id: JSON.stringify((maxId += 1)),
        name: name,
        images: [],
        directory: name,
        required: true,
        rarity_weights: null
      })
      setCapas(getCapas())
    }
  }

  const createCapaImageHandle = async (capaId, archivoOriginal, img) => {
    let indexPGN = archivoOriginal.name.lastIndexOf(".")
    let newNombre = archivoOriginal.name.slice(0, indexPGN)
    const nuevaImagen = {
      id: getUniqueId(),
      name: `${newNombre}-${getUniqueId()}.png`,
      dimension: {
        width: img.width,
        height: img.height
      },
      isDiferent: false
    }
    const objImg = {
      clave: nuevaImagen.id,
      name: nuevaImagen.name,
      img: img.image,
      dimension: {
        width: img.width,
        height: img.height
      },
      isDiferent: false
    }
    const objSmallImage = {
      clave: nuevaImagen.id,
      img: img.smallImage
    }

    await agregar(db, "images", objImg)
    await agregar(db, "smallImages", objSmallImage)
    return [nuevaImagen, objSmallImage]
  }

  async function generarObjetoConfigParaElServidor() {
    let obj = getCapas()
      .filter((e) => e.images.length !== 0)
      .map((capa, key) => {
        return {
          id: key,
          name: capa.name,
          directory: capa.directory,
          required: capa.required ? "True" : "False",
          rarity_weights: capa["rarity_weights"] || "None"
        }
      })

    let correo = facebook?.tokenUser || google?.tokenUser || metamask?.tokenUser

    let ObjetoConfig = {
      cb: correo,
      labels: obj
    }
    console.log({ ObjetoConfig })

    // let username =  btoa('usuario');
    // let password =  btoa('pwd')

    var myHeaders = new Headers()
    myHeaders.append(
      "Authorization",
      `Bearer ${localStorage.getItem("access_token")}`
    )
    myHeaders.append("Content-Type", "application/json")

    let url = `${URL}/config`
    let myInit = {
      method: "POST",
      body: JSON.stringify(ObjetoConfig),
      headers: myHeaders
    }

    let resPost = await fetch(url, myInit)
    if (!resPost.ok) {
      // console.log({ resPost })
      throw Error("HTTP status " + resPost.status)
    }
    let post = await resPost.json()
    console.log({ status: `generando objecto config`, ...post })
    return post
  }

  const generarObjIMGParaElServidor = async () => {
    let imagesDB = await obtenerTodo(db, "images")
    let obj = getCapas()
      .filter((e) => e.images.length !== 0)
      .map((capa) => {
        return {
          directory: capa.directory,
          imgs: capa.images.map((e) => ({
            name: e.name,
            b64:
              imagesDB
                .find((element) => element.clave === e.id)
                ?.img.slice(22) || ""
          }))
        }
        // return {
        //   directory: capa.directory,
        //   imgs: capa.images.map(e => ({ name: e.name, b64: e.img.slice(22) }))
        // }
      })
    let correo = facebook?.tokenUser || google?.tokenUser || metamask?.tokenUser
    let objConfig2 = {
      cb: correo,
      data: obj
    }
    // console.log(JSON.stringify(objConfig2))
    console.log({ obj })
    console.log({ objConfig2 })
    var myHeaders = new Headers()
    myHeaders.append(
      "Authorization",
      `Bearer ${localStorage.getItem("access_token")}`
    )
    myHeaders.append("Content-Type", "application/json")

    let url = `${URL}images`
    let myInit = {
      method: "POST",
      body: JSON.stringify(objConfig2),
      headers: myHeaders
    }
    try {
      let resPost = await fetch(url, myInit)
      let post = await resPost.json()
      if (!resPost.ok) throw Error("HTTP status " + resPost.status)
      // console.log(`generando objecto config para las imagenes ${post}`)
      console.log({
        status: `generando objecto config para las imagenes`,
        ...post
      })

      return post
    } catch (e) {
      console.log(e)
      alert(
        intl.formatMessage({
          id: "generator.error-req",
          defaultMessage: "Error in the request, contact support"
        })
      )
    }
  }

  async function generarCombinaciones() {
    let correo = facebook?.tokenUser || google?.tokenUser || metamask?.tokenUser
    //let correo = metamask?.tokenUser

    const collectionSize = inputProjectCollectionSize.current.value
    const name = inputProjectName.current.value.replace(/\s+/g, "")
    const description = inputProjectDescription.current.value

    let url = `${URL}p?cantidad=${Number(
      collectionSize
    )}&nombre=${name}&cb=${correo}&descripcion=${description}`

    var myHeaders = new Headers()
    myHeaders.append(
      "Authorization",
      `Bearer ${localStorage.getItem("access_token")}`
    )
    myHeaders.append("Content-Type", "application/json")

    let myInit = {
      method: "GET",
      headers: myHeaders
    }
    // setTimeout(() => setUrlNft('creando'), 7000)
    console.log(url)
    let resPost = await fetch(url, myInit)
    let post = await resPost.json()

    console.log({ status: `Generar combinaciones`, ...post })

    if (!resPost.ok) throw Error("HTTP status " + resPost.status)
    return post
  }

  async function ValidarSiExisteNombreProjectServidor() {
    const name = inputProjectName.current.value.replace(/\s+/g, "")
    let correo = facebook?.tokenUser || google?.tokenUser || metamask?.tokenUser

    const isNameValid = validacionForm(name)
    if (isNameValid) return { valid: false, message: isNameValid }
    let obj = {
      id: correo,
      nombre_collect: name
    }
    var myHeaders = new Headers()
    myHeaders.append(
      "Authorization",
      `Bearer ${localStorage.getItem("access_token")}`
    )
    myHeaders.append("Content-Type", "application/json")

    let url = `${URL}collect`
    let myInit = {
      method: "POST",
      body: JSON.stringify(obj),
      headers: myHeaders
    }

    let resPost = await fetch(url, myInit)
    if (!resPost.ok) {
      console.log({ resPost })
      throw Error("HTTP status " + resPost.status)
    }
    let post = await resPost.json()
    console.log({ status: `comprovando nombre de proyecto`, ...post })

    if (post.nombre === "existe") {
      return {
        valid: false,
        message: intl.formatMessage({
          id: "generator.existe",
          defaultMessage: "The project name already exists you must rename"
        })
      }
    }
    return { valid: true, message: post.nombre }
  }

  function validacionForm(name) {
    if (name.length === 0) {
      return (
        <FormattedMessage
          id="generator.proyecnareq"
          defaultMessage="Project name is required"
        />
      )
    }

    if (name.length <= 1) {
      return (
        <FormattedMessage
          id="generator.minim-character"
          defaultMessage="The project name must be greater than or equal to 2 characters"
        />
      )
    }
    const cantidadAPedir = Number(inputProjectCollectionSize.current.value)
    const cantidadMax = Number(maxConvinacion.current.innerText)
    if (cantidadAPedir > cantidadMax) {
      return `${intl.formatMessage({
        id: "generator.max-combinations",
        defaultMessage:
          "The creation of your collection cannot be greater than the number of established combinations that is"
      })} ${cantidadMax}`
    }
    if (cantidadAPedir < 1 || cantidadMax === 1)
      return (
        <FormattedMessage
          id="generator.minim-combinations"
          defaultMessage="The creation of your collection cannot be greater than the number of established combinations that is"
        />
      )
    if (cantidadAPedir < 10) {
      return (
        <FormattedMessage
          id="generator.max-combinatios2"
          defaultMessage="Minimun of the total combinations must be 10"
        />
      )
    }
    if (cantidadAPedir > 10000) {
      return (
        <FormattedMessage
          id="generator.min-combinations2"
          defaultMessage="Max of the total combinations must be 10.000"
        />
      )
    }
    if (email.length < 1) {
      return (
        <FormattedMessage
          id="generator.must-have-email"
          defaultMessage="Please introduce your data in the form to generate NFTs"
        />
      )
    }
    return false
  }
  function validarSiExisteCapasConImagenes() {
    //tienen que existe mas de 2 capas minimo
    const message = (
      <FormattedMessage
        id="generator.minim-layers"
        defaultMessage="There must be a minimum of two layers with one image each in order to create the combinations"
      />
    )
    if (capas.length === 1) {
      console.log(1)
      return { valid: false, message }
    }
    // tiene que haber 2 capas con imagenes minimo
    if (capas.length === 2) {
      console.log(2)

      let getimages = capas.map((images) => images.images.length === 0)
      const res = getimages.every((e) => e !== true)
      return { valid: res, message }
    }

    if (capas.length > 2) {
      let getimages = capas.map((images) =>
        images.images.length === 0 ? -1 : 1
      )
      const rta = getimages.reduce(
        (obj, item) => {
          if (item > 0) {
            obj.siTiene += 1
          } else {
            obj.noTiene += 1
          }
          return obj
        },
        {
          siTiene: 0,
          noTiene: 0
        }
      )
      console.log(rta)
      let result = rta["siTiene"] >= 2 ? true : false
      console.log(3)
      return { valid: result, message }
    }
  }

  async function handleSubmit(callback, hash) {
    try {
      const res = await generarObjetoConfigParaElServidor()
      const res1 = await generarObjIMGParaElServidor()
      if (res && res1) {
        if (inputProjectCollectionSize.current.value <= 100)
          setUrlNft("creando")
        generarCombinaciones()
        if (callback && hash)
          callback({ content: "success", type: "success", additional: hash })
      }
    } catch (error) {
      console.log(error.message)
      setUrlNft(false)
    }
  }
  useEffect(function validateToken() {
    setTimeout(() => {
      setSignalToken(true)
    }, 500)
    let interval = null
    if (access_token !== null) {
      const decoded = jwtDecode(access_token)?.exp
      const decoded_time = new Date(decoded * 1000)
      if (signalToken)
        interval = setInterval(() => {
          const currentDate = new Date()
          if (currentDate > decoded_time) {
            setName(null)
            desLoguearse()
            localStorage.clear()
            setAccess_token(null)
            clearInterval(interval)
            setSignalToken(false)
          } else if (currentDate < decoded_time && access_token.length > 0) {
            console.log(currentDate > decoded_time)
            console.log(currentDate)
            console.log(decoded_time)
          }
        }, 3000)
    }

    return () => {
      clearInterval(interval)
    }
  }, [signalToken])

  return (
    <>
      <div className="container-fluid text-white mt-5 position-relative">
        <div className="row">
          <div className="col-lg-3 col-md-4 col-12">
            <Capas
              capas={capas}
              createCapaHandle={createCapaHandle}
              setCapas={setCapas}
              selectedCapa={selectedCapa}
              setSelectedCapa={setSelectedCapa}
              db={db}
              maxConvinacion={maxConvinacion}
              inputProjectCollectionSize={inputProjectCollectionSize}
              requiredRarity={requiredRarity}
            />
          </div>

          <div className="col-lg-6 col-md-4 col-12">
            <BodyImage
              capas={capas}
              setCapas={setCapas}
              createCapaImageHandle={createCapaImageHandle}
              selectedCapa={selectedCapa}
              // setSelectedCapa={setSelectedCapa}
              inputProjectCollectionSize={inputProjectCollectionSize}
              maxConvinacion={maxConvinacion}
              db={db}
              setLoadingImages={setLoadingImages}
              setIsChangedCapa={setIsChangedCapa}
              isChangedCapa={isChangedCapa}
            />
          </div>

          <div className="col-lg-3 col-md-4 col-12">
            <Form
              capas={capas}
              listPreview1={listPreview1}
              listPreview2={listPreview2}
              listPreview3={listPreview3}
              setListPreview1={setListPreview1}
              setListPreview2={setListPreview2}
              setListPreview3={setListPreview3}
              loadImageFromDBB={loadImageFromDBB}
              setIsOpenModalPreviewImg={setIsOpenModalPreviewImg}
              isOpenModalPreviewImg={isOpenModalPreviewImg}
              setCapas={setCapas}
              selectedCapa={selectedCapa}
              setSelectedCapa={setSelectedCapa}
              inputProjectName={inputProjectName}
              inputProjectDescription={inputProjectDescription}
              inputProjectCollectionSize={inputProjectCollectionSize}
              maxConvinacion={maxConvinacion}
              db={db}
              urlNft={urlNft}
              setUrlNft={setUrlNft}
              isExisteNombreProject={isExisteNombreProject}
              setIsExisteNombreProject={setIsExisteNombreProject}
              ValidarSiExisteNombreProjectServidor={
                ValidarSiExisteNombreProjectServidor
              }
              handleSubmit={handleSubmit}
              generarObjIMGParaElServidor={generarObjIMGParaElServidor}
              generarObjetoConfigParaElServidor={
                generarObjetoConfigParaElServidor
              }
              validarSiExisteCapasConImagenes={validarSiExisteCapasConImagenes}
              setIsActiveModalRegister={setIsActiveModalRegister}
            />
          </div>
        </div>
      </div>
    </>
  )
}

export default Generator
