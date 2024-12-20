import { Close } from "@mui/icons-material";
import { Box, Button, Modal, Stack } from "@mui/material";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { ethers } from "ethers";
import { closeSnackbar, enqueueSnackbar } from "notistack";
import React, { useEffect, useRef, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { Link, useNavigate } from "react-router-dom";
import { axiosClass } from "../api/api.config.js";
import { ReactComponent as MetamaskLogo } from "../assets/svg/metamask.svg";
import { ReactComponent as Stripe } from "../assets/svg/stripe.svg";
import * as Const from "../constantes";
import { obtenerTodo } from "../db/CrudDB.js";
import pagarConStripe from "../stripe/checkOut.js";
import "../styles/scss/_container-rarity.scss";
import "../styles/scss/_form.scss";
import "../styles/scss/_menu.scss";
import { crearRarityWeights } from "../utils/crearRarityWeights";
import getCapas from "../utils/getCapas";
import getDatosImg from "../utils/getDatosImg";
import { useStoreProv } from "../utils/zustand/store.js";
import GenericModal from "./GenericModal";
import CheckoutForm from "./mui-components/modal/CheckoutForm.jsx";
import MaxcombAdmin from "./mui-components/modal/MaxcombAdmin.jsx";
import SeePrices from "./mui-components/modal/SeePrices.jsx";
import PreviewCollection from "./PreviewCollection";
import { TermsNConditionModal } from "./TermsNConditionModal.jsx";
import { jwtDecode } from "jwt-decode";

// const paqueteDeMil_NFT = Const.PRECIO_PRUEBA_NFTS // 99$
// const paqueteDeCincoMil_NFT = Const.PRECIO_PRUEBA_NFTS // 199$
// const paqueteDeDiezMil_NFT = Const.PRECIO_PRUEBA_NFTS // 299$

const paqueteDeMil_NFT = Const.PRECIO_MIL_NFTS; // 99$
const paqueteDeCincoMil_NFT = Const.PRECIO_CINCO_MIL_NFTS; // 199$
const paqueteDeDiezMil_NFT = Const.PRECIO_DIEZ_MIL_NFTS; // 299$

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
  validarSiExisteCapasConImagenes,
  setIsActiveModalRegister,
}) => {
  const intl = useIntl();

  const mensajeServer = [
    `${intl.formatMessage({
      id: "form.min-dimension",
      defaultMessage:
        "The image resolution is selected from the first image you drag and drop. We expect all images to have the same resolution.",
    })}`,

    `${intl.formatMessage({
      id: "form.max-generate",
      defaultMessage: "this is the maximum number to generate",
    })}`,
  ];

  const nfanstToken = localStorage.getItem("NFansT Token");
  const decoded = jwtDecode(nfanstToken);
  const { role, nft } = decoded;

  const datosImg = getDatosImg();
  const [dimension, setDimension] = useState({ x: 0, y: 0 });
  const [isInputGenerate, setIsInputGenerate] = useState(false);
  const [listImagenDB, setlistImagenDB] = useState([]);
  const [stripePrice, setStripePrice] = useState();
  const [isPremiun, setIspremiun] = useState(false);
  const [message, setMessage] = useState({
    content: "pending",
    type: "pending",
  });
  let imagenDimensiones = datosImg.imagenDimension;
  const facebook = JSON.parse(localStorage.getItem("facebook"));
  const google = JSON.parse(localStorage.getItem("google"));
  const metamask = JSON.parse(localStorage.getItem("metamask"));
  let correo = facebook?.tokenUser || google?.tokenUser || metamask?.tokenUser;
  const {
    typeUser,
    payConfirm,
    setPayConfirm,
    disableCloseButton,
    setDisableCloseButton,
  } = useStoreProv();

  const idioma = localStorage.getItem("idioma");
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
        y: imagenDimensiones[0]?.height || dimension.y,
      });
      // console.log('SOY UNSEFECTO DE FORM')
      inputProjectCollectionSize.current.value = 1;
    }
  }, [imagenDimensiones]);

  const botonGenerate = (condicion) => {
    if (condicion === true) {
      setIsInputGenerate(true);
    }
    if (condicion === false) {
      setIsInputGenerate(false);
    }
  };

  const [checked, setChecked] = useState(false);

  const handleChecked = () => {
    setChecked(!checked);
  };

  // const capaIndex = getCapas().findIndex((capa) => capa.id === selectedCapa.id)

  const setNewNameCapa = (e) => {
    const name = e.target.value;
    let capas = getCapas();
    const capaIndex = capas.findIndex((capa) => capa.id === selectedCapa.id);
    capas[capaIndex].name = name;
    capas[capaIndex].directory = name;
    localStorage.setItem("capas", JSON.stringify(capas));
    capas = getCapas();
    setSelectedCapa(capas.find((capa) => capa.id === selectedCapa.id));
    setCapas(capas);
    // console.log(capas[0].images)
  };

  function handleRangeValue(event, element, isRarity) {
    let capas = getCapas();
    const capaIndex = capas.findIndex((capa) => capa.id === selectedCapa.id);
    const imagenes = capas[capaIndex].images;
    // const imagenIndex = imagenes.findIndex(e=>e.id === element.id )
    const imagen = imagenes.find((e) => e.id === element.id);
    imagen.porcentajeBarra = Number(event.target.value);
    const totalPorcentajeBarra = imagenes.reduce(
      (previousValue, currentValue) => {
        return previousValue + currentValue.porcentajeBarra;
      },
      0
    );
    // console.log({ totalPorcentajeBarra })
    imagenes.forEach((i) => {
      const porcentaje = (i.porcentajeBarra * 100) / totalPorcentajeBarra;
      i.porcentaje = porcentaje;
    });
    localStorage.setItem("capas", JSON.stringify(capas));
    requiredRarity(isRarity);
    // console.log(capas)
  }

  document.addEventListener("onKeyPress", function notDecimals() {
    let onlyNumbers = document.getElementById("collectionsize");
    onlyNumbers.value = Math.trunc(onlyNumbers.value);
  });

  function onlyNumer({ target: { value } }) {
    let newValor = value.replace(/[^0-9]/g, ""); // Remove all non-numeric characters
    if (newValor === "") {
      inputProjectCollectionSize.current.value = "";
    } else if (Number(newValor) > Number(maxConvinacion.current.innerText)) {
      inputProjectCollectionSize.current.value =
        maxConvinacion.current.innerText;
    } else {
      inputProjectCollectionSize.current.value = newValor;
    }
  }

  function requiredRarity(isRarity) {
    let capas = getCapas();
    const capaIndex = capas.findIndex((capa) => capa.id === selectedCapa.id);
    capas[capaIndex].required = isRarity;
    localStorage.setItem("capas", JSON.stringify(capas));
    crearRarityWeights();
    capas = getCapas();
    setSelectedCapa(capas.find((capa) => capa.id === selectedCapa.id));
    setCapas(capas);
  }

  const FreeModal = () => {
    const setSignal = useStoreProv((state) => state.setSignal);

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
                        setListPreview1([]);
                        setListPreview2([]);
                        setListPreview3([]);
                        setSignal(true);
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
                      setUrlNft("");
                      botonGenerate(false);
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
    );
  };

  const stripePromise = loadStripe(Const.STRIPEKEY);

  const PayModal = ({ message, setMessage }) => {
    const [alertShow, setAlertShow] = useState(false);

    const BNBprice = useRef(0);
    const [price, setPrice] = useState(0);
    const [isPriceCalculated, setIsPriceCalculated] = useState(true);
    const [openStripeModal, setOpenStripeModal] = useState(false);
    const [clientSecret, setClientSecret] = useState("");

    useEffect(() => {
      // Create PaymentIntent as soon as the page loads
      if (openStripeModal) {
        const priceString = (price * BNBprice.current).toFixed(2);
        const amount = +priceString;

        axiosClass
          .post("create-payment-intent", { amount })
          .then((res) => {
            setClientSecret(res.data.clientSecret);
          })
          .catch((err) => {
            console.log(err);
          });
      }
    }, [openStripeModal]);

    const appearance = {
      theme: "stripe",
    };
    const options = {
      clientSecret,
      appearance,
    };

    const metodosDePago = [
      {
        nombre: "MetaMask",
        icon: <MetamaskLogo width={60} height={60} />,
        proceso: (e) => startPaymentMetamask(e),
      },
      {
        nombre: "Stripe",
        icon: <Stripe width={90} height={100} />,
        proceso: () => setOpenStripeModal(true),
      },
    ];

    useEffect(() => {
      // if (message.type === "success")
      getBNBPrice();
    }, [message, price]);

    async function procesoStripe() {
      setAlertShow(true);
      setMessage({ content: "pending", type: "pending" });
      setIsPriceCalculated(true);
      window.onbeforeunload = function () {
        return "You must wait for the images to be sent to the server";
      };
      await generarObjetoConfigParaElServidor();
      await generarObjIMGParaElServidor();
      window.onbeforeunload = function () {};
      // pagarConStripe(stripePrice, inputProjectName.current.value.replace(/\s+/g, ''), inputProjectCollectionSize.current.value)
      pagarConStripe({
        precio: stripePrice,
        nombre: inputProjectName.current.value.replace(/\s+/g, ""),
        tamano: inputProjectCollectionSize.current.value,
      });
    }

    const startPaymentMetamask = async (event) => {
      // new line
      event.preventDefault();
      setMessage({ content: "pending", type: "pending" });
      window.onbeforeunload = function () {
        return "You must wait for the images to be sent to the server";
      };
      setIsPriceCalculated(true);
      if (inputProjectName.current.value === "") {
        setMessage({ ...message, content: "noname", type: "error" });
        setAlertShow(true);
        return;
      }

      try {
        if (!window.ethereum) {
          throw new Error("Metamask no está instalada");
        }

        await window.ethereum.send("eth_requestAccounts");
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const chainId = await window.ethereum.request({
          method: "eth_chainId",
          nativeCurrency: {
            name: "BNB",
            symbol: "bnb",
            decimals: 18,
          },
          rpcUrls: ["https://data-seed-prebsc-1-s1.binance.org:8545/"],
        });
        const signer = provider.getSigner();
        ethers.utils.getAddress(Const.WalletAddress);
        if (chainId === "0x61") {
          setAlertShow(true);

          const transactionResponse = await signer.sendTransaction({
            to: Const.WalletAddress,
            value: ethers.utils.parseEther(price.toString()),
            // value: ethers.utils.parseEther('0.0001')
          });
          if (transactionResponse) {
            const transactionConfirmed =
              await signer.provider.waitForTransaction(
                transactionResponse.hash
              );

            if (transactionConfirmed) {
              // setMessage({ ...message, content: "success", type: "success", additional: transactionConfirmed.transactionHash })
              await handleSubmit(
                setMessage,
                transactionConfirmed.transactionHash
              );
              window.onbeforeunload = function () {};
            }
          }
        } else {
          setAlertShow(true);
          setMessage({ ...message, content: "nowallet", type: "error" });
        }
      } catch (error) {
        setAlertShow(true);
        setMessage({ ...message, content: error.code, type: "error" });
        // console.log({ error })
      }
    };

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
          defaultMessage: "Transaction made, with",
        })} hash: ${message.additional}`,
        noname: intl.formatMessage({
          id: "form.pay.noname",
          defaultMessage: "You must give the project a name",
        }),
        nowallet: intl.formatMessage({
          id: "form.pay.nowallet",
          defaultMessage:
            "You must be on the Binance Smart Chain network to make the payment",
        }),
      };

      const styles = {
        error: {
          backgroundColor: "#ff0000b0",
        },
        success: {
          backgroundColor: "green",
          cursor: message.additional ? "pointer" : "default",
        },
        pending: {
          backgroundColor: "transparent",
        },
      };

      const handleTrasactionDetails = () => {
        if (message.additional)
          window.open(
            `https://testnet.bscscan.com/tx/${message.additional}`,
            "_blank"
          );
      };

      return (
        <div
          className={"p-3 fs-7 fw-bolder rounded my-1 bg-opacity-75 text-break"}
          style={styles[message.type]}
          onClick={handleTrasactionDetails}
        >
          {cases[message.content.toString()]}
          <div></div>
        </div>
      );
    };

    const getBNBPrice = async () => {
      // const headers = new Headers({
      //   // "X-CMC_PRO_API_KEY": "afeaa4c1-43e4-4d70-86a2-8c59d8ea7641",
      //   // "Access-Control-Allow-Origin": "*",
      //   Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      //   "Content-Type": "application/json"
      // })

      var myHeaders = new Headers();
      myHeaders.append(
        "Authorization",
        `Bearer ${localStorage.getItem("access_token")}`
      );
      myHeaders.append("Content-Type", "application/json");

      let myInit = {
        method: "POST",
        headers: myHeaders,
      };

      const res = await (await fetch(Const.CMCURL, myInit)).json();
      // const res = { data: { BNB: { quote: { USD: { price: 15000 } } } } }
      if (res) {
        BNBprice.current = res.data?.BNB?.quote.USD.price;
        console.log(res.data?.BNB?.quote?.USD?.price);
        // console.log(res)
        let coleccionSize = inputProjectCollectionSize.current.value;
        // console.log(coleccionSize);
        if (coleccionSize >= 101 && coleccionSize <= 1000) {
          setPrice(99 / BNBprice.current); // cambiar el precio
          setIsPriceCalculated(false);
          setStripePrice(paqueteDeMil_NFT);
          // console.log("llegamo aqui para ejectuar el precio");
        }
        if (coleccionSize > 1000 && coleccionSize <= 5000) {
          setPrice(199 / BNBprice.current);
          setIsPriceCalculated(false);
          setStripePrice(paqueteDeCincoMil_NFT);
        }
        if (coleccionSize > 5000 && coleccionSize <= 10000) {
          setPrice(299 / BNBprice.current);
          setIsPriceCalculated(false);
          setStripePrice(paqueteDeDiezMil_NFT);
        }
        if (coleccionSize >= 10000) {
          // console.log("a la verga")
        }
      }
    };

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
      );
    };

    const setSignal = useStoreProv((state) => state.setSignal);
    const [showTerms, setShowTerms] = useState(false);

    const style = {
      color: "#fff",
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      width: "30%",
      // height: "40%",
      bgcolor: "#1E2235",
      border: "2px solid #000",
      boxShadow: 24,
      p: 4,
    };

    const handleClose = () => {
      setOpenStripeModal(false);
    };

    const closePaymentModal = () => {
      setListPreview1([]);
      setListPreview2([]);
      setListPreview3([]);
      setUrlNft("");
      botonGenerate(false);
      setIsPriceCalculated(false);
      setChecked(false);
    };

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
                  borderBottomRightRadius: 0,
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
                          setListPreview1([]);
                          setListPreview2([]);
                          setListPreview3([]);
                          setSignal(true);
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
                        setUrlNft("");
                        botonGenerate(false);
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
                  borderBottomRightRadius: 0,
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
                    alignItems: "center",
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
                  onClick={closePaymentModal}
                  disabled={disableCloseButton}
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
                  <a
                    target="_blank"
                    style={{ color: "", cursor: "pointer" }}
                    className="text-reset fw-bold p-2 links"
                    onClick={() => setShowTerms(true)}
                  >
                    <FormattedMessage
                      id="form.pay.terms"
                      defaultMessage="I agree to the terms of service and privacy policy"
                    />
                  </a>
                </div>
              </div>
            </>
          )}
        </div>

        <TermsNConditionModal
          showTerms={showTerms}
          setShowTerms={setShowTerms}
        />
        <Modal
          open={openStripeModal}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            {clientSecret && (
              <Elements
                options={{
                  clientSecret,
                  appearance: { theme: "night" },
                  // locale: selectedLanguage === "eng" ? "en" : "es"
                  locale: idioma === null || idioma === "en-US" ? "en" : "es",
                }}
                stripe={stripePromise}
              >
                <Stack alignItems={"end"} sx={{ width: "100%" }}>
                  <Button onClick={handleClose} sx={{ height: "1.5rem" }}>
                    <Close sx={{ color: "white", fontSize: "1.25rem" }} />
                  </Button>
                </Stack>
                <CheckoutForm
                  options={options}
                  handleClose={handleClose}
                  stripePromise={stripePromise}
                  closePaymentModal={closePaymentModal}
                  botonGenerate={botonGenerate}
                />
              </Elements>
            )}
          </Box>
        </Modal>
      </>
    );
  };

  const NameErrorModal = ({ message }) => {
    return (
      <div className="p-4">
        <h3>{message}</h3>
        <button
          className="__boton-mediano"
          onClick={() => {
            botonGenerate(false);
          }}
        >
          <FormattedMessage id="form.btn-close" defaultMessage="Close" />
        </button>
        {message?.props?.defaultMessage ===
          "Please introduce your email to generate NFTs" && (
          <>
            <button
              className="__boton-mediano"
              onClick={() => {
                setIsActiveModalRegister(true);
                botonGenerate(false);
              }}
            >
              <FormattedMessage
                id="form.btn-form"
                defaultMessage="Edit your data"
              />
            </button>
          </>
        )}
      </div>
    );
  };

  const ModalContent = ({
    isInputGenerate,
    inputProjectCollectionSize,
    message,
    setMessage,
  }) => {
    const [show, setShow] = useState(false);

    useEffect(() => {
      if (isInputGenerate) setShow(true);
      else setShow(false);
    }, [isInputGenerate, inputProjectCollectionSize, isExisteNombreProject]);

    const components = {
      free: <FreeModal />,
      pay: <PayModal message={message} setMessage={setMessage} />,
      error: <NameErrorModal message={isExisteNombreProject} />,
    };

    const selectComponent = () => {
      if (typeUser === 1 || typeUser === 2) return components.free;
      if (
        inputProjectCollectionSize.current.value <= 100 &&
        isExisteNombreProject === null
      )
        return components.free;
      if (
        inputProjectCollectionSize.current.value > 100 &&
        isExisteNombreProject === null
      )
        return components.pay;
      return components.error;
    };

    return <>{selectComponent()}</>;
  };

  async function estadoDePeticionDeGenerarNFT() {
    let url = `${Const.URL}collectall`;

    let usuario = {
      id: correo,
    };

    var myHeaders = new Headers();
    myHeaders.append(
      "Authorization",
      `Bearer ${localStorage.getItem("access_token")}`
    );
    myHeaders.append("Content-Type", "application/json");

    let myInit = {
      method: "POST",
      body: JSON.stringify(usuario),
      headers: myHeaders,
    };
    try {
      let resPost = await fetch(url, myInit);
      let post = await resPost.json();
      // console.log(post)
      return post;
    } catch (error) {
      // console.log(error)
    }
  }

  function validarSiImagesTienesDimesionesDiferentes() {
    let capas = getCapas().map((e) => {
      let imagenes = e.images;
      return imagenes;
    });
    let isDiferent = capas.flat().some((e) => e.isDiferent === true);
    return {
      valid: isDiferent,
      message: <FormattedMessage id="from.validdimensions" />,
    };
  }

  const handleGenerate = async () => {
    let isDiferent = validarSiImagesTienesDimesionesDiferentes();
    if (isDiferent.valid === true) {
      setIsExisteNombreProject(isDiferent.message);
      botonGenerate(true);
      return;
    }

    let nogenerar = validarSiExisteCapasConImagenes();
    if (nogenerar.valid === false) {
      setIsExisteNombreProject(nogenerar.message);
      botonGenerate(true);
      return;
    }

    let isPendiente = await estadoDePeticionDeGenerarNFT();
    if (isPendiente[0]?.url) isPendiente = isPendiente.pop();

    // Nueva validación para el usuario de tipo 2
    if (
      typeUser === 2 &&
      Number(inputProjectCollectionSize.current.value) > 11150
    ) {
      setIsExisteNombreProject(
        "For admin, total combinations must be less than or equal to 11.150"
      );
      botonGenerate(true);
      return;
    }

    const res = await ValidarSiExisteNombreProjectServidor();

    if (isPendiente.url === "En Proceso...") {
      setIsExisteNombreProject(
        intl.formatMessage({
          id: "form.pending",
          defaultMessage:
            "At this moment you cannot generate an NFT collection because you already have one in process, at the end of the creation of the collection you will be able to generate another one, keep in mind that if the collection is very large the process may take a while",
        })
      );
      botonGenerate(true);
      return;
    }

    let isPremiun = false;

    const chainId = await window.ethereum.request({ method: "eth_chainId" });
    if (chainId === "0x61") {
      const tokennfanst = localStorage.getItem("NFansT Token");
      const decoded = jwtDecode(tokennfanst);

      const { role, nft } = decoded;
      if (
        typeUser === 1 ||
        typeUser === 2 ||
        payConfirm === true ||
        role === "1001" ||
        nft[0].name === "Unique"
      ) {
        const { valid, message } = await ValidarSiExisteNombreProjectServidor();
        if (valid === false) {
          setIsExisteNombreProject(message);
          botonGenerate(true);
          return;
        } else {
          setIsExisteNombreProject(null);
          botonGenerate(true);
          setIspremiun(!isPremiun);
          await handleSubmit();
          setUrlNft("creando");
        }
      }
    }

    if (res.valid) {
      setIsExisteNombreProject(null);
      if (inputProjectCollectionSize.current.value > 100) {
        botonGenerate(true);
      } else {
        botonGenerate(true);
        await handleSubmit();
      }
    }

    if (!res.valid) {
      setIsExisteNombreProject(res.message);
      botonGenerate(true);
    }
  };

  async function loadImageFromDB() {
    let result = await obtenerTodo(db, "images");
    setlistImagenDB(result);
    return result;
  }

  const [captureValue, setCaptureValue] = useState("");

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
      : "000";

  const [openMuiModal, setOpenMuiModal] = useState(false);
  const [openMaxComb, setOpenMaxComb] = useState(false);
  const navigate = useNavigate();
  const handleOpen = () => setOpenMuiModal(true);
  const handleClose = () => setOpenMuiModal(false);

  useEffect(() => {
    if (payConfirm === true) {
      setDisableCloseButton(true); // Disable the button

      // const alertStripewait = intl.formatMessage({
      //   id: "alert.stripe.wait",
      //   defaultMessage: "Please wait a few seconds to see you Free Collection!"
      // })

      const alertGenerating = intl.formatMessage({
        id: "alert.stripe.generate",
        defaultMessage: "Generating collection, please wait!",
      });

      // const snackbarKey = enqueueSnackbar(alertStripewait, {
      //   variant: "success",
      //   anchorOrigin: {
      //     vertical: "top",
      //     horizontal: "right"
      //   },
      //   persist: true
      // })

      // handleGenerate()
      handleSubmit(setMessage)
        .then((res) => {
          console.log(res);
        })
        .catch((err) => console.log(err))
        .finally(() => {
          setPayConfirm(false);

          closeSnackbar(alertGenerating);

          setDisableCloseButton(false); // Enable the button
          setMessage({ content: "success", type: "success" });
          // enqueueSnackbar(alertGenerating, {
          //   variant: "success",
          //   anchorOrigin: {
          //     vertical: "top",
          //     horizontal: "right"
          //   }
          // })
          navigate("/coleccion");
        });
    }
  }, [payConfirm]);

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
              type="number"
              className="form-control-sm w-100 --border-blue"
              id="collectionsize"
              autoComplete="off"
              name="collectionSize"
              ref={inputProjectCollectionSize}
              onChange={(e) => {
                onlyNumer(e);
              }}
              style={{
                appearance: "textfield", // This removes the arrows
                MozAppearance: "textfield", // This is for Firefox
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
          {role !== "1001" && nft[0].name !== "Unique" && (
            <button
              onClick={(e) => {
                e.preventDefault();
                handleOpen();
              }}
              className="__boton-mediano mx-auto d-block w-30 enphasis-button"
              style={{ marginTop: "2rem" }}
            >
              <FormattedMessage
                id="button.prices.list"
                defaultMessage="Prices List"
              />
            </button>
          )}
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
          if (
            typeUser === 2 &&
            Number(inputProjectCollectionSize.current.value) > 11150
          ) {
            setOpenMaxComb(true);
          } else {
            handleGenerate();
            loadImageFromDBB(setListPreview1);
            loadImageFromDBB(setListPreview2);
            loadImageFromDBB(setListPreview3);
          }
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
          message={message}
          setMessage={setMessage}
          isInputGenerate={isInputGenerate}
          inputProjectCollectionSize={inputProjectCollectionSize}
        />
      </GenericModal>
      <SeePrices openMuiModal={openMuiModal} handleClose={handleClose} />
      <MaxcombAdmin openMaxComb={openMaxComb} setOpenMaxComb={setOpenMaxComb} />
    </>
  );
};

export default Form;
