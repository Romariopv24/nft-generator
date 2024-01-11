import { ethers } from "ethers"
import React, { useEffect, useRef, useState } from "react"
import { FormattedMessage, useIntl } from "react-intl"
import { Link } from "react-router-dom"
import { ReactComponent as MetamaskLogo } from "../assets/svg/metamask.svg"
import { ReactComponent as Stripe } from "../assets/svg/stripe.svg"
import * as Const from "../constantes"
import { obtenerTodo } from "../db/CrudDB.js"
import pagarConStripe from "../stripe/checkOut.js"
import "../styles/scss/_container-rarity.scss"
import "../styles/scss/_form.scss"
import "../styles/scss/_menu.scss"
import { crearRarityWeights } from "../utils/crearRarityWeights"
import getCapas from "../utils/getCapas"
import getDatosImg from "../utils/getDatosImg"
import { useStoreSignal } from "../utils/zustand/store.js"
import GenericModal from "./GenericModal"
import PreviewCollection from "./PreviewCollection"

// const paqueteDeMil_NFT = Const.PRECIO_PRUEBA_NFTS // 99$
// const paqueteDeCincoMil_NFT = Const.PRECIO_PRUEBA_NFTS // 199$
// const paqueteDeDiezMil_NFT = Const.PRECIO_PRUEBA_NFTS // 299$

const paqueteDeMil_NFT = Const.PRECIO_MIL_NFTS // 99$
const paqueteDeCincoMil_NFT = Const.PRECIO_CINCO_MIL_NFTS // 199$
const paqueteDeDiezMil_NFT = Const.PRECIO_DIEZ_MIL_NFTS // 299$

const listWalletPremiun = [
  "0xa54927b7af64DdB3e2c5Ac9cbec38c81EC88Be48",
  "0x7b739a2c9e21e2Ad07eC8898EE89945a93627358",
  "0x63828d59737Aa3744960d6827Ccf457931B84245",
  "0xE6225d9f75CA398F060A2A9B7a3b345e681700dC",
  "0x278afeeca694808991f70c3e851449434a13ecff",
  "0xFAC15a040568a8186212AA2e9CC1A5b2886914E1",
  "0xCc2b1442a561B0ab9D04599ae11b0fEc5E946112"
]

const Form = ({
  capas,
  listPreview1,
  listPreview2,
  listPreview3,
  setListPreview1,
  setListPreview2,
  setListPreview3,
  loadImageFromDBB,
  isOpenModalPreviewImg,
  setIsOpenModalPreviewImg,
  setCapas,
  selectedCapa,
  setSelectedCapa,
  inputProjectName,
  inputProjectDescription,
  inputProjectCollectionSize,
  maxConvinacion,
  db,
  urlNft,
  setUrlNft,
  isExisteNombreProject,
  setIsExisteNombreProject,
  ValidarSiExisteNombreProjectServidor,
  handleSubmit,
  generarObjIMGParaElServidor,
  generarObjetoConfigParaElServidor,
  validarSiExisteCapasConImagenes
}) => {
  const intl = useIntl()

  const mensajeServer = [
    `${intl.formatMessage({
      id: "form.min-dimension",
      defaultMessage:
        "The image resolution is selected from the first image you drag and drop. We expect all images to have the same resolution."
    })}`,

    `${intl.formatMessage({
      id: "form.max-generate",
      defaultMessage: "this is the maximum number to generate"
    })}`
  ]

  const datosImg = getDatosImg()
  const [dimension, setDimension] = useState({ x: 0, y: 0 })
  const [isInputGenerate, setIsInputGenerate] = useState(false)
  const [listImagenDB, setlistImagenDB] = useState([])
  const [stripePrice, setStripePrice] = useState()
  const [isPremiun, setIspremiun] = useState(false)
  let imagenDimensiones = datosImg.imagenDimension
  const facebook = JSON.parse(localStorage.getItem("facebook"))
  const google = JSON.parse(localStorage.getItem("google"))
  const metamask = JSON.parse(localStorage.getItem("metamask"))
  let correo = facebook?.tokenUser || google?.tokenUser || metamask?.tokenUser

  useEffect(() => {
    if (
      (dimension.x === 0 ||
        dimension.y === 0 ||
        imagenDimensiones[0] === undefined) &&
      maxConvinacion.current.innerText !== "0"
    ) {
      // console.log(imagenDimensiones[0], dimension, maxConvinacion.current)
      setDimension({
        x: imagenDimensiones[0]?.width || dimension.x,
        y: imagenDimensiones[0]?.height || dimension.y
      })
      // console.log('SOY UNSEFECTO DE FORM')
      inputProjectCollectionSize.current.value = 1
    }
  }, [imagenDimensiones])

  const botonGenerate = (condicion) => {
    if (condicion === true) {
      setIsInputGenerate(true)
    }
    if (condicion === false) {
      setIsInputGenerate(false)
    }
  }

  const [checked, setChecked] = useState(false)

  const handleChecked = () => {
    setChecked(!checked)
  }

  // const capaIndex = getCapas().findIndex((capa) => capa.id === selectedCapa.id)

  const setNewNameCapa = (e) => {
    const name = e.target.value
    let capas = getCapas()
    const capaIndex = capas.findIndex((capa) => capa.id === selectedCapa.id)
    capas[capaIndex].name = name
    capas[capaIndex].directory = name
    localStorage.setItem("capas", JSON.stringify(capas))
    capas = getCapas()
    setSelectedCapa(capas.find((capa) => capa.id === selectedCapa.id))
    setCapas(capas)
    // console.log(capas[0].images)
  }

  function handleRangeValue(event, element, isRarity) {
    let capas = getCapas()
    const capaIndex = capas.findIndex((capa) => capa.id === selectedCapa.id)
    const imagenes = capas[capaIndex].images
    // const imagenIndex = imagenes.findIndex(e=>e.id === element.id )
    const imagen = imagenes.find((e) => e.id === element.id)
    imagen.porcentajeBarra = Number(event.target.value)
    const totalPorcentajeBarra = imagenes.reduce(
      (previousValue, currentValue) => {
        return previousValue + currentValue.porcentajeBarra
      },
      0
    )
    console.log({ totalPorcentajeBarra })
    imagenes.forEach((i) => {
      const porcentaje = (i.porcentajeBarra * 100) / totalPorcentajeBarra
      i.porcentaje = porcentaje
    })
    localStorage.setItem("capas", JSON.stringify(capas))
    requiredRarity(isRarity)
    // console.log(capas)
  }

  document.addEventListener("onKeyPress", function notDecimals() {
    let onlyNumbers = document.getElementById("collectionsize")
    onlyNumbers.value = Math.trunc(onlyNumbers.value)
  })

  function onlyNumer({ target: { value } }) {
    let valueAux = value.replace(/^0{1,}/, "")
    let newValor = valueAux.replaceAll(/[\.A-Za-z.]{0,10}/g, "")
    if (newValor === "") inputProjectCollectionSize.current.value = ""
    // console.log(Number(newValor) > Number(maxConvinacion.current.innerText), Number(newValor), Number(maxConvinacion.current.innerText))
    if (Number(newValor) !== value)
      inputProjectCollectionSize.current.value = newValor
    if (
      Number(newValor) > Number(maxConvinacion.current.innerText) &&
      newValor !== ""
    )
      inputProjectCollectionSize.current.value =
        maxConvinacion.current.innerText
  }

  function requiredRarity(isRarity) {
    let capas = getCapas()
    const capaIndex = capas.findIndex((capa) => capa.id === selectedCapa.id)
    capas[capaIndex].required = isRarity
    localStorage.setItem("capas", JSON.stringify(capas))
    crearRarityWeights()
    capas = getCapas()
    setSelectedCapa(capas.find((capa) => capa.id === selectedCapa.id))
    setCapas(capas)
  }

  const FreeModal = () => {
    const setSignal = useStoreSignal((state) => state.setSignal)

    return (
      <>
        {urlNft === "" ? (
          <div className="">
            <div
              className="spinner-border text-info p-4 m-3"
              role="status"
            ></div>
          </div>
        ) : (
          <>
            <div className="p-4">
              <PreviewCollection
                listPreview1={listPreview1}
                listPreview2={listPreview2}
                listPreview3={listPreview3}
                imgTop1={50}
                imgTop3={50}
              />

              <h5 class="my-text mt-5">
                <FormattedMessage
                  id="form.reqcollections"
                  defaultMessage="Your request is being processed go to collections"
                />
              </h5>

              <div class="mt-4">
                {urlNft && (
                  <Link to={`/coleccion`}>
                    {" "}
                    <button
                      className="__boton-mediano enphasis-button"
                      onClick={() => {
                        setListPreview1([])
                        setListPreview2([])
                        setListPreview3([])
                        setSignal(true)
                      }}
                    >
                      <FormattedMessage
                        id="menu.collections"
                        defaultMessage=" My Collections"
                      />
                    </button>
                  </Link>
                )}
                {urlNft && (
                  <button
                    className="__boton-mediano"
                    onClick={() => {
                      setUrlNft("")
                      botonGenerate(false)
                    }}
                  >
                    <FormattedMessage
                      id="form.success-pay-close"
                      defaultMessage="Close"
                    />
                  </button>
                )}
              </div>
            </div>
          </>
        )}
      </>
    )
  }

  const PayModal = () => {
    const [alertShow, setAlertShow] = useState(false)
    const [message, setMessage] = useState({
      content: "pending",
      type: "pending"
    })
    const BNBprice = useRef(0)
    const [price, setPrice] = useState(0)
    const [isPriceCalculated, setIsPriceCalculated] = useState(true)

    const metodosDePago = [
      {
        nombre: "MetaMask",
        icon: <MetamaskLogo width={60} height={60} />,
        proceso: (e) => startPaymentMetamask(e)
      },
      {
        nombre: "Stripe",
        icon: <Stripe width={90} height={100} />,
        proceso: () => procesoStripe()
      }
    ]

    useEffect(() => {
      // if (message.type === "success")
      getBNBPrice()
    }, [message, price])

    async function procesoStripe() {
      setAlertShow(true)
      setMessage({ content: "pending", type: "pending" })
      setIsPriceCalculated(true)
      window.onbeforeunload = function () {
        return "You must wait for the images to be sent to the server"
      }
      await generarObjetoConfigParaElServidor()
      await generarObjIMGParaElServidor()
      window.onbeforeunload = function () {}
      // pagarConStripe(stripePrice, inputProjectName.current.value.replace(/\s+/g, ''), inputProjectCollectionSize.current.value)
      pagarConStripe({
        precio: stripePrice,
        nombre: inputProjectName.current.value.replace(/\s+/g, ""),
        tamano: inputProjectCollectionSize.current.value
      })
    }

    const startPaymentMetamask = async (event) => {
      // new line
      event.preventDefault()
      setMessage({ content: "pending", type: "pending" })
      window.onbeforeunload = function () {
        return "You must wait for the images to be sent to the server"
      }
      setIsPriceCalculated(true)
      if (inputProjectName.current.value === "") {
        setMessage({ ...message, content: "noname", type: "error" })
        setAlertShow(true)
        return
      }

      try {
        if (!window.ethereum) {
          throw new Error("Metamask no está instalada")
        }

        await window.ethereum.send("eth_requestAccounts")
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const chainId = await window.ethereum.request({
          method: "eth_chainId"
        })
        const signer = provider.getSigner()
        ethers.utils.getAddress(Const.WalletAddress)

        if (chainId === "0x61") {
          setAlertShow(true)

          const transactionResponse = await signer.sendTransaction({
            to: Const.WalletAddress,
            value: ethers.utils.parseEther(price.toString())
            // value: ethers.utils.parseEther('0.0001')
          })
          if (transactionResponse) {
            const transactionConfirmed =
              await signer.provider.waitForTransaction(transactionResponse.hash)

            if (transactionConfirmed) {
              // setMessage({ ...message, content: "success", type: "success", additional: transactionConfirmed.transactionHash })
              await handleSubmit(
                setMessage,
                transactionConfirmed.transactionHash
              )
              window.onbeforeunload = function () {}
            }
          }
        } else {
          setAlertShow(true)
          setMessage({ ...message, content: "nowallet", type: "error" })
        }
      } catch (error) {
        setAlertShow(true)
        setMessage({ ...message, content: error.code, type: "error" })
        console.log({ error })
      }
    }

    const ModalAlerts = ({ message }) => {
      const cases = {
        4001: (
          <FormattedMessage
            id="form.pay.reject"
            defaultMessage="Transaction rejected"
          />
        ),
        "-32603": (
          <FormattedMessage id="form.pay.error" defaultMessage="Error" />
        ), //saldo insuficiente metamask
        pending: (
          <div className="spinner-border text-info" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        ),
        success: `${intl.formatMessage({
          id: "form.pay.success",
          defaultMessage: "Transaction made, with"
        })} hash: ${message.additional}`,
        noname: intl.formatMessage({
          id: "form.pay.noname",
          defaultMessage: "You must give the project a name"
        }),
        nowallet: intl.formatMessage({
          id: "form.pay.nowallet",
          defaultMessage:
            "You must be on the Binance Smart Chain network to make the payment"
        })
      }

      const styles = {
        error: {
          backgroundColor: "#ff0000b0"
        },
        success: {
          backgroundColor: "green",
          cursor: message.additional ? "pointer" : "default"
        },
        pending: {
          backgroundColor: "transparent"
        }
      }

      const handleTrasactionDetails = () => {
        if (message.additional)
          window.open(
            `https://testnet.bscscan.com/tx/${message.additional}`,
            "_blank"
          )
      }

      return (
        <div
          className={"p-3 fs-7 fw-bolder rounded my-1 bg-opacity-75 text-break"}
          style={styles[message.type]}
          onClick={handleTrasactionDetails}
        >
          {cases[message.content.toString()]}
          <div></div>
        </div>
      )
    }

    const getBNBPrice = async () => {
      const headers = new Headers({
        "X-CMC_PRO_API_KEY": "afeaa4c1-43e4-4d70-86a2-8c59d8ea7641",
        "Access-Control-Allow-Origin": "*"
      })

      const res = await (await fetch(Const.CMCURL, headers)).json()
      // const res = { data: { BNB: { quote: { USD: { price: 15000 } } } } }

      if (res) {
        BNBprice.current = res.data?.BNB.quote.USD.price
        let coleccionSize = inputProjectCollectionSize.current.value
        // console.log(coleccionSize);
        if (coleccionSize >= 101 && coleccionSize <= 1000) {
          setPrice(99 / BNBprice.current) // cambiar el precio
          setIsPriceCalculated(false)
          setStripePrice(paqueteDeMil_NFT)
          // console.log("llegamo aqui para ejectuar el precio");
        }
        if (coleccionSize > 1000 && coleccionSize <= 5000) {
          setPrice(199 / BNBprice.current)
          setIsPriceCalculated(false)
          setStripePrice(paqueteDeCincoMil_NFT)
        }
        if (coleccionSize > 5000 && coleccionSize <= 10000) {
          setPrice(299 / BNBprice.current)
          setIsPriceCalculated(false)
          setStripePrice(paqueteDeDiezMil_NFT)
        }
        if (coleccionSize >= 10000) {
          console.log("a la verga")
        }
      }
    }

    const PayOptions = ({ items }) => {
      return (
        <button
          className="metodosDePagoBox"
          onClick={items.proceso}
          disabled={checked === false || isPriceCalculated}
        >
          {items.icon}
          {items.nombre}
        </button>
      )
    }

    const setSignal = useStoreSignal((state) => state.setSignal)

    return (
      <>
        <div className="fs-6 fw-bold">
          {urlNft === "creando" ? (
            <>
              <div
                style={{
                  fontSize: "1.5rem",
                  padding: ".7em",
                  boxShadow: "#ffffff1f 0px 2px 3px 0px",
                  borderBottomLeftRadius: 0,
                  borderBottomRightRadius: 0
                }}
              >
                <FormattedMessage
                  id="form.pay.paymentfree"
                  defaultMessage="You will generate the colecction:"
                />
                <h3 style={{ fontWeight: "bold" }}>{captureValue}</h3>
              </div>

              <div style={{ padding: "1.5em" }}>
                {/* <p className="fw-normal" style={{ fontSize: "1.2rem" }}>
                  <FormattedMessage
                    id="form.pay.freeexceeded"
                    defaultMessage="Free limit exceeded if you want to continue you must pay"
                  />
                </p> */}

                <div className="p-2">
                  <PreviewCollection
                    listPreview1={listPreview1}
                    listPreview2={listPreview2}
                    listPreview3={listPreview3}
                    imgTop1={175}
                    imgTop3={175}
                  />
                </div>

                {/* <p className="fw-bold mt-4" style={{ fontSize: "1.7rem" }}>
                  {price.toFixed(2)} BNB o{" "}
                  {(price * BNBprice.current).toFixed(2)} USD
                </p> */}

                {/* <div
                  className="mb-2"
                  style={{
                    display: "flex",
                    justifyContent: "space-around",
                    alignItems: "center"
                  }}
                >
                  {metodosDePago.map((items, idx) => (
                    <PayOptions key={idx} items={items} />
                  ))}
                </div> */}

                {alertShow && (
                  <ModalAlerts message={message} setAlertShow={setAlertShow} />
                )}

                {/* {message.type === "success" && (
                  <Link to={`/coleccion`}>
                    {" "}
                    <button className="__boton-mediano">
                      <FormattedMessage
                        id="form.success-metamsk-collections"
                        defaultMessage="My Collections"
                      />
                    </button>
                  </Link>
                )} */}

                {/* <button
                  className="__boton-mediano enphasis-button"
                  onClick={() => {
                    setListPreview1([])
                    setListPreview2([])
                    setListPreview3([])
                    setUrlNft("")
                    botonGenerate(false)
                    setIsPriceCalculated(false)
                    setChecked(false)
                  }}
                >
                  <FormattedMessage
                    id="form.success-pay-close"
                    defaultMessage="Close"
                  />
                </button> */}

                <h5 class="my-text mt-5">
                  <FormattedMessage
                    id="form.reqcollections"
                    defaultMessage="Your request is being processed go to collections"
                  />
                </h5>

                {/* <div class="form-check mt-3 w-auto ">
                  <input
                    class="form-check-input"
                    type="checkbox"
                    checked={checked}
                    value={checked}
                    onChange={handleChecked}
                  />
                  <Link
                    to={`/terms&conditions`}
                    target="_blank"
                    class="text-reset text-center links"
                    style={{ fontSize: "15px" }}
                  >
                    <FormattedMessage
                      id="form.pay.terms"
                      defaultMessage="I agree to the terms of service and privacy policy"
                    />
                  </Link>
                </div> */}

                <div class="mt-4">
                  {urlNft && (
                    <Link to={`/coleccion`}>
                      {" "}
                      <button
                        className="__boton-mediano enphasis-button"
                        onClick={() => {
                          setListPreview1([])
                          setListPreview2([])
                          setListPreview3([])
                          setSignal(true)
                        }}
                      >
                        <FormattedMessage
                          id="menu.collections"
                          defaultMessage=" My Collections"
                        />
                      </button>
                    </Link>
                  )}
                  {urlNft && (
                    <button
                      className="__boton-mediano"
                      onClick={() => {
                        setUrlNft("")
                        botonGenerate(false)
                      }}
                    >
                      <FormattedMessage
                        id="form.success-pay-close"
                        defaultMessage="Close"
                      />
                    </button>
                  )}
                </div>
              </div>
            </>
          ) : (
            // <div>
            //   <div
            //     style={{
            //       fontSize: "1.5rem",
            //       boxShadow: "#ffffff1f 0px 2px 3px 0px",
            //       borderBottomLeftRadius: 0,
            //       borderBottomRightRadius: 0,
            //       display: "flex",
            //       justifyContent: "center",
            //       alignItems: "center",
            //       position: "relative"
            //     }}
            //   >
            //     <FormattedMessage
            //       id="form.pay.paymentrequired"
            //       defaultMessage="Usted va a generar la Coleccion: "
            //     />
            //     <div>{captureValue}</div>
            //   </div>

            //   <div>
            //     <PreviewCollection
            //       listPreview1={listPreview1}
            //       listPreview2={listPreview2}
            //       listPreview3={listPreview3}
            //       imgTop1={50}
            //       imgTop3={50}
            //     />
            //   </div>

            //   <h5 class="my-text mt-5">
            //     <FormattedMessage
            //       id="form.reqcollections"
            //       defaultMessage="Your request is being processed go to collections"
            //     />
            //   </h5>

            //   <div class="mt-4">
            //     {urlNft && (
            //       <Link to={`/coleccion`}>
            //         {" "}
            //         <button
            //           className="__boton-mediano enphasis-button"
            //           onClick={() => {
            //             setListPreview1([])
            //             setListPreview2([])
            //             setListPreview3([])
            //           }}
            //         >
            //           <FormattedMessage
            //             id="menu.collections"
            //             defaultMessage=" My Collections"
            //           />
            //         </button>
            //       </Link>
            //     )}
            //     {urlNft && (
            //       <button
            //         className="__boton-mediano"
            //         onClick={() => {
            //           setUrlNft("")
            //           botonGenerate(false)
            //         }}
            //       >
            //         <FormattedMessage
            //           id="form.success-pay-close"
            //           defaultMessage="Close"
            //         />
            //       </button>
            //     )}
            //   </div>
            // </div>
            <>
              <div
                style={{
                  fontSize: "1.5rem",
                  padding: ".7em",
                  boxShadow: "#ffffff1f 0px 2px 3px 0px",
                  borderBottomLeftRadius: 0,
                  borderBottomRightRadius: 0
                }}
              >
                <FormattedMessage
                  id="form.pay.paymentrequired"
                  defaultMessage="Payment Required"
                />
              </div>

              <div style={{ padding: "1.5em" }}>
                <p className="fw-normal" style={{ fontSize: "1.2rem" }}>
                  <FormattedMessage
                    id="form.pay.freeexceeded"
                    defaultMessage="Free limit exceeded if you want to continue you must pay"
                  />
                </p>

                <div className="p-2">
                  <PreviewCollection
                    listPreview1={listPreview1}
                    listPreview2={listPreview2}
                    listPreview3={listPreview3}
                    imgTop1={175}
                    imgTop3={175}
                  />
                </div>

                <p className="fw-bold mt-4" style={{ fontSize: "1.7rem" }}>
                  {price.toFixed(2)} BNB o{" "}
                  {(price * BNBprice.current).toFixed(2)} USD
                </p>

                <div
                  className="mb-2"
                  style={{
                    display: "flex",
                    justifyContent: "space-around",
                    alignItems: "center"
                  }}
                >
                  {metodosDePago.map((items, idx) => (
                    <PayOptions key={idx} items={items} />
                  ))}
                </div>

                {alertShow && (
                  <ModalAlerts message={message} setAlertShow={setAlertShow} />
                )}

                {message.type === "success" && (
                  <Link to={`/coleccion`}>
                    {" "}
                    <button
                      onClick={() => setSignal(true)}
                      className="__boton-mediano"
                    >
                      <FormattedMessage
                        id="form.success-metamsk-collections"
                        defaultMessage="My Collections"
                      />
                    </button>
                  </Link>
                )}

                <button
                  className="__boton-mediano enphasis-button"
                  onClick={() => {
                    setListPreview1([])
                    setListPreview2([])
                    setListPreview3([])
                    setUrlNft("")
                    botonGenerate(false)
                    setIsPriceCalculated(false)
                    setChecked(false)
                  }}
                >
                  <FormattedMessage
                    id="form.success-pay-close"
                    defaultMessage="Close"
                  />
                </button>

                <div class="form-check mt-3 w-auto ">
                  <input
                    class="form-check-input"
                    type="checkbox"
                    checked={checked}
                    value={checked}
                    onChange={handleChecked}
                  />
                  <Link
                    to={`/terms&conditions`}
                    target="_blank"
                    class="text-reset text-center links"
                    style={{ fontSize: "15px" }}
                  >
                    <FormattedMessage
                      id="form.pay.terms"
                      defaultMessage="I agree to the terms of service and privacy policy"
                    />
                  </Link>
                </div>
              </div>
            </>
          )}
        </div>
      </>
    )
  }

  const NameErrorModal = ({ message }) => {
    return (
      <div className="p-4">
        <h3>{message}</h3>
        <button
          className="__boton-mediano"
          onClick={() => {
            botonGenerate(false)
          }}
        >
          <FormattedMessage id="form.btn-close" defaultMessage="Close" />
        </button>
      </div>
    )
  }

  const ModalContent = ({ isInputGenerate, inputProjectCollectionSize }) => {
    const [show, setShow] = useState(false)

    useEffect(() => {
      if (isInputGenerate) setShow(true)
      else setShow(false)
    }, [isInputGenerate, inputProjectCollectionSize, isExisteNombreProject])

    const components = {
      free: <FreeModal />,
      pay: <PayModal />,
      error: <NameErrorModal message={isExisteNombreProject} />
    }

    const selectComponent = () => {
      if (isPremiun) return components.free
      if (
        inputProjectCollectionSize.current.value <= 100 &&
        isExisteNombreProject === null
      )
        return components.free
      if (
        inputProjectCollectionSize.current.value > 100 &&
        isExisteNombreProject === null
      )
        return components.pay
      return components.error
    }

    return <>{selectComponent()}</>
  }

  async function estadoDePeticionDeGenerarNFT() {
    let url = `${Const.URL}collectall`

    let usuario = {
      id: correo
    }

    var myHeaders = new Headers()
    myHeaders.append("Authorization", "Basic dXN1YXJpbzpwd2Q=")
    myHeaders.append("Content-Type", "application/json")

    let myInit = {
      method: "POST",
      body: JSON.stringify(usuario),
      headers: myHeaders
    }
    try {
      let resPost = await fetch(url, myInit)
      let post = await resPost.json()
      console.log(post)
      return post
    } catch (error) {
      console.log(error)
    }
  }

  function validarSiImagesTienesDimesionesDiferentes() {
    let capas = getCapas().map((e) => {
      let imagenes = e.images
      return imagenes
    })
    let isDiferent = capas.flat().some((e) => e.isDiferent === true)
    return {
      valid: isDiferent,
      message: <FormattedMessage id="from.validdimensions" />
    }
  }

  const handleGenerate = async () => {
    let isDiferent = validarSiImagesTienesDimesionesDiferentes()
    if (isDiferent.valid === true) {
      setIsExisteNombreProject(isDiferent.message)
      botonGenerate(true)
      return
    }

    let nogenerar = validarSiExisteCapasConImagenes()
    if (nogenerar.valid === false) {
      setIsExisteNombreProject(nogenerar.message)
      botonGenerate(true)
      return
    }

    let isPendiente = await estadoDePeticionDeGenerarNFT()
    if (isPendiente[0]?.url) isPendiente = isPendiente.pop()

    const res = await ValidarSiExisteNombreProjectServidor()

    if (isPendiente.url === "En Proceso...") {
      setIsExisteNombreProject(
        intl.formatMessage({
          id: "form.pending",
          defaultMessage:
            "At this moment you cannot generate an NFT collection because you already have one in process, at the end of the creation of the collection you will be able to generate another one, keep in mind that if the collection is very large the process may take a while"
        })
      )
      botonGenerate(true)
      return
    }

    let isPremiun = false

    //esto es mio para ver si eres premiun
    const chainId = await window.ethereum.request({ method: "eth_chainId" })
    const accounts = await window.ethereum.request({ method: "eth_accounts" })
    listWalletPremiun.find((wallet) => {
      if (wallet.toLowerCase() === accounts[0]) isPremiun = true
    })

    if (chainId === "0x13881") {
      if (isPremiun) {
        console.log("si eres premieum con tu direccion wallet")
        const { valid, message } = await ValidarSiExisteNombreProjectServidor()
        if (valid === false) {
          console.log(res)
          setIsExisteNombreProject(message)
          botonGenerate(true)
          return
        } else {
          setIsExisteNombreProject(null)
          botonGenerate(true)
          setIspremiun(!isPremiun)
          await handleSubmit()
          setUrlNft("creando")
        }
      }
    }
    //aqui termina si eres premiun

    if (res.valid) {
      setIsExisteNombreProject(null) //cambiar montos
      if (inputProjectCollectionSize.current.value > 100) {
        botonGenerate(true)
      } else {
        botonGenerate(true)
        await handleSubmit()
      }
    }

    if (!res.valid) {
      setIsExisteNombreProject(res.message)
      botonGenerate(true)
    }
  }

  async function loadImageFromDB() {
    let result = await obtenerTodo(db, "images")
    // console.log(result)
    setlistImagenDB(result)
    return result
  }

  const [captureValue, setCaptureValue] = useState("")

  //Number of combinations with the name y the form field
  const combsWithName =
    maxConvinacion &&
    maxConvinacion.current?.innerText <= 99 &&
    maxConvinacion.current?.innerText >= 10
      ? `${captureValue.replace(" ", "-")}-001, ${captureValue.replace(
          " ",
          "-"
        )}-002 ... ${captureValue.replace(" ", "-")}-0${
          maxConvinacion.current?.innerText
        }`
      : maxConvinacion.current?.innerText >= 99
      ? `${captureValue.replace(" ", "-")}-001, ${captureValue.replace(
          " ",
          "-"
        )}-002 ... ${captureValue}-${maxConvinacion.current?.innerText}`
      : maxConvinacion.current?.innerText >= 4
      ? `${captureValue.replace(" ", "-")}-001, ${captureValue.replace(
          " ",
          "-"
        )}-002 ... ${captureValue.replace(" ", "-")}-00${
          maxConvinacion.current?.innerText
        }`
      : maxConvinacion.current?.innerText >= 3
      ? `${captureValue.replace(" ", "-")}-001, ${captureValue.replace(
          " ",
          "-"
        )}-002 , ${captureValue.replace(" ", "-")}-00${
          maxConvinacion.current?.innerText
        }`
      : maxConvinacion.current?.innerText >= 2
      ? `${captureValue.replace(" ", "-")}-001, ${captureValue.replace(
          " ",
          "-"
        )}-002`
      : maxConvinacion.current?.innerText >= 1
      ? `${captureValue.replace(" ", "-")}-001`
      : "000"

  console.log()
  return (
    <>
      <div id="datos">
        <form className="p-2 form-components">
          <div className="mb-3">
            <label htmlFor="projectname" className="form-label">
              <FormattedMessage
                id="form.projectname"
                defaultMessage="Collection's NFT name"
              />
            </label>
            <input
              type="text"
              className="form-control-sm w-100 --border-blue"
              id="projectname"
              name="pName"
              ref={inputProjectName}
              maxLength={100}
              onChange={(e) => setCaptureValue(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="projectname" className="form-label">
              <FormattedMessage
                id="form.exportFormat"
                defaultMessage="Export Format"
              />
            </label>
            <p style={{ fontSize: "14px", margin: 0, marginTop: 0 }}>
              <FormattedMessage
                id="form.recommendedFormat"
                defaultMessage="Recommended Format: png"
              />
            </p>
            <input
              type="text"
              // name="pName"
              readOnly
              value="PNG"
              className="form-control-sm w-100 cursor-denagado --border-blue"
              disabled
              maxLength={100}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="projectname" className="form-label">
              Blockchain
            </label>

            <input
              type="text"
              // name="pName"
              readOnly
              value="ETH, BSC, Polygon... MultiChain"
              className="form-control-sm w-100 cursor-denagado --border-blue"
              disabled
              maxLength={100}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="projectname" className="form-label">
              <FormattedMessage
                id="form.combinationsNumber"
                defaultMessage="Combinations"
              />
            </label>
            <input
              type="text"
              // name="pName"
              readOnly
              value={combsWithName}
              className="form-control-sm w-100 cursor-denagado --border-blue"
              disabled
              maxLength={100}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="projectdescription" className="form-label">
              <FormattedMessage
                id="form.projectdescription"
                defaultMessage="Collection's description"
              />
            </label>
            <input
              type="text"
              className="form-control-sm w-100 --border-blue"
              id="projectdescription"
              name="pDescription"
              ref={inputProjectDescription}
              maxLength={300}
            />
          </div>
          <div className="mb-3" id="combinaciones">
            <label htmlFor="collectionsize" className="form-label">
              <FormattedMessage
                id="form.combinations"
                defaultMessage="Total Combinations: "
              />
              <span ref={maxConvinacion}></span>
            </label>

            {/* interrogacion con el numero de combinaciones */}
            <span className="tooltip-incognito">
              ?<div className="tooltiptext">{mensajeServer[1]}</div>
            </span>

            <input
              type="text"
              className="form-control-sm w-100 --border-blue"
              id="collectionsize"
              autoComplete="off"
              name="collectionSize"
              ref={inputProjectCollectionSize}
              onChange={(e) => {
                onlyNumer(e)
              }}
            />
          </div>
          <div className="row" id="resolucion">
            <label className="form-label">
              <FormattedMessage
                id="form.dimsension"
                defaultMessage="Dimension"
              />
              <span className="tooltip-incognito">
                ?
                <div className="tooltiptext" style={{ width: "200px" }}>
                  {mensajeServer[0]}
                </div>
              </span>
            </label>
            <div className="col">
              <input
                type="text"
                className="form-control-sm w-100 cursor-denagado --border-blue"
                disabled
                value={dimension.x}
              />
            </div>
            <div className="col">
              <input
                type="text"
                className="form-control-sm w-100 cursor-denagado --border-blue"
                disabled
                value={dimension.y}
              />
            </div>
          </div>
        </form>
        {/* <form className="form-capa-name">
          <label htmlFor="capaName" className="form-label">
            <FormattedMessage id="form.layername" defaultMessage="Layer Name" />
          </label>
          <input
            type="text"
            className="form-control-sm w-100"
            id="capaName"
            name="capaName"
            value={selectedCapa.name}
            onChange={setNewNameCapa}
          />
        </form> */}
      </div>

      {/* <div className='mt-1' id='rareza'>
        <Modal classButton="m-auto my-1 w-100 __boton-mediano enphasis-button" 
          textButton = <FormattedMessage id='form.btn-rarity' defaultMessage='Rarity Settings'/>
          variant="primary" 
          titleModal="" 
          sizeText="fs-5"
          func={loadImageFromDB}
        >
          <div className='container-rarity'>
            <div className='d-flex me-5 container-rarity-top'>
              <div className="form-check form-switch">
                <input className="form-check-input" type="checkbox" onClick={() => requiredRarity(!selectedCapa.required)} defaultChecked={selectedCapa.required} />
                <label className="form-check-label">
                  <FormattedMessage 
                    id="form.modal-rarity" 
                    defaultMessage="Require rarity"
                  />
                </label>
              </div>
            </div>
            -----------render Imagenes individuales ----------------
            {
              getCapas()[capaIndex].images.map(e =>
                <div className="container-rarity-bottom " key={e.id}>
                  {/*--------- Imagen --------------------
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
                      porcentaje sin decimales truncado
                      <h5>{`${Math.trunc(e.porcentaje)}%`}</h5>

                       porcentaje sin decimales redondeado
                      <h5>{`${Math. round(e.porcentaje)}%`}</h5>
                    </div>
                    procentaje con decimales
                    <h5 className=''>{`${e.porcentaje.toFixed(2)}%`}</h5>
                    
                  </div>
                </div>)
            }
          </div>
        </Modal>
      </div> */}

      <button
        className="__boton-mediano mx-auto d-block w-100 enphasis-button"
        onClick={() => {
          handleGenerate()
          loadImageFromDBB(setListPreview1)
          loadImageFromDBB(setListPreview2)
          loadImageFromDBB(setListPreview3)
        }}
        disabled={isInputGenerate}
        id="generar"
      >
        <FormattedMessage id="form.btn-generate" defaultMessage="Generate" />
      </button>

      <div className="text-center mt-2">
        <Link to={`/faqs`} className="links">
          <FormattedMessage
            id="form.go-to-faqs"
            defaultMessage="Do you need help? Check FAQs here"
          />
        </Link>
      </div>

      <GenericModal
        show={isInputGenerate}
        style={{ border: "1px solid #00B8FF", padding: "10px" }}
      >
        <ModalContent
          isInputGenerate={isInputGenerate}
          inputProjectCollectionSize={inputProjectCollectionSize}
        />
      </GenericModal>
    </>
  )
}

export default Form
