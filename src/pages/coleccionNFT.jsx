import React, { useEffect, useRef, useState } from "react";
import { ReactComponent as Descargar } from "../assets/svg/descargar.svg";
import { ReactComponent as Export } from "../assets/svg/export.svg";
import { ReactComponent as Delete } from "../assets/svg/trash.svg";
import GenericModal from "../components/GenericModal";
import { URL, myHeaders } from "../constantes";
import "../styles/scss/_table-styles.scss";

import dayjs from "dayjs";
import "dayjs/locale/es"; // load on demand
import relativeTime from "dayjs/plugin/relativeTime";

import { FormattedMessage, useIntl } from "react-intl";
import { Link } from "react-router-dom";

dayjs.locale("en"); // use Spanish locale globally
dayjs.extend(relativeTime);

const listWalletPremiun = [
  "0xa54927b7af64DdB3e2c5Ac9cbec38c81EC88Be48",
  "0x7b739a2c9e21e2Ad07eC8898EE89945a93627358",
  "0x63828d59737Aa3744960d6827Ccf457931B84245",
  "0x1A3Bd3C1f6f4c9e73AF91C21dbcB143bf2B2E5Da",
  "0xE6225d9f75CA398F060A2A9B7a3b345e681700dC",
  " 0x278aFeECa694808991f70c3E851449434A13eCff",
];

const ColeccionNFT = () => {
  const [collectall, setCollectall] = useState([]);
  const [showModalEliminar, setShowModalEliminar] = useState(false);
  const [showModalCodigo, setShowModalCodigo] = useState(false);
  const [showModalMessage, setShowModalMessage] = useState(false);
  const [selectedItem, setSelectedItem] = useState();
  const [selectedItemUrl, setSelectedItemUrl] = useState();
  const [isPromiseReady, setIsPromiseReady] = useState(false);
  const [code, setCode] = useState("");
  const [isWalletPremiun, setIsWalletPremiun] = useState(false);

  const intl = useIntl();

  const codeMessage = [
    // 'En unos minutos veras tu colección en artis.market',
    // 'Ha corrido un error inesperado',
    // 'Procesando espere un momento',
    intl.formatMessage({
      id: "colleccionNFT.modal-export-msg-success",
      defaultMessage:
        "In a few minutes you will see your collection on artis.market",
    }),
    intl.formatMessage({
      id: "colleccionNFT.modal-export-msg-error",
      defaultMessage: "You have run an unexpected error",
    }),
    intl.formatMessage({
      id: "colleccionNFT.modal-export-msg-wait",
      defaultMessage: "Processing please wait a moment",
    }),
  ];

  //logica para el fetch
  const getColletionsRef = useRef(getColletions);
  const [isIntervalActive, setIsIntervalActive] = useState(false);
  const [isRequestSent, setIsRequestSent] = useState(false);

  useEffect(() => {
    async function what() {
      localStorage.setItem("noLoop", false);
      const noLoop = localStorage.getItem("noLoop");

      if (collectall.length === 0 && !isPromiseReady) {
        console.log("ah");
        getColletionsRef.current();
        const accounts = await window.ethereum.request({
          method: "eth_accounts",
        });
        let findWallet = listWalletPremiun.find(
          (wallet) => wallet.toLowerCase() === accounts[0].toLowerCase()
        );
        if (findWallet) {
          setIsWalletPremiun(true);
        }
      }

      if (!isIntervalActive) {
        setIsIntervalActive(true);
        const interval = setInterval(() => {
          if (!isRequestSent) {
            setIsRequestSent(true);
            getColletionsRef.current();
            setTimeout(() => setIsRequestSent(false), 5000);
          }
        }, 30000);
        return () => clearInterval(interval);
      }
    }

    what();
  }, [isIntervalActive, isPromiseReady, isRequestSent, collectall.length]);

  async function getColletions() {
    localStorage.setItem("noLoop", true);
    let url = `${URL}collectall`;
    const facebook = JSON.parse(localStorage.getItem("facebook"));
    const google = JSON.parse(localStorage.getItem("google"));
    const metamask = JSON.parse(localStorage.getItem("metamask"));
    let correo =
      facebook?.tokenUser || google?.tokenUser || metamask?.tokenUser;

    let usuario = {
      id: correo,
    };

    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Basic dXN1YXJpbzpwd2Q=");
    myHeaders.append("Content-Type", "application/json");

    let myInit = {
      method: "POST",
      body: JSON.stringify(usuario),
      headers: myHeaders,
    };
    try {
      let resPost = await fetch(url, myInit);
      let post = await resPost.json();
      console.log(post);
      setCollectall(post);
      setIsPromiseReady(true);
      console.log(post);
      console.log("se hizo una solicitud");
    } catch (error) {
      console.log(error);
    }
  }
  //aca termina el fetch

  function date(date) {
    if (isWalletPremiun === true) {
      return intl.formatMessage({
        id: "colleccionNFT.table-column51",
        defaultMessage: "No Deadline",
      });
    }

    console.log("kuek");
    return dayjs(date)
      .add(15, "day")
      .fromNow()
      .replace(
        "in ",
        intl.formatMessage({ id: "colleccionNFT.in", defaultMessage: "in " })
      )
      .replace(
        "days",
        intl.formatMessage({ id: "colleccionNFT.days", defaultMessage: "days" })
      );
  }

  const handleOpenModalEliminar = (item) => {
    setShowModalEliminar(true);
    setSelectedItem(item);
  };

  const handleDelete = async () => {
    if (selectedItem) {
      const res = await fetch(`${URL}/delete/${selectedItem}`, {
        method: "GET",
        headers: myHeaders,
      });
      const jsonres = await res.json();
      if (jsonres) {
        const tempArray = JSON.parse(JSON.stringify(collectall));
        const eliminatedItem = tempArray.findIndex(
          (item) => item._id["$oid"] === selectedItem
        );
        tempArray.splice(eliminatedItem, 1);
        setShowModalEliminar(false);
        setSelectedItem("");
        setCollectall(tempArray);
      }
    }
  };

  const handleOpenModalCodigo = (item) => {
    setShowModalCodigo(true);
    setSelectedItemUrl(item);
  };

  const handleEnviarCode = async () => {
    if (selectedItemUrl) {
      try {
        setShowModalMessage({ state: true, message: codeMessage[2] });
        let res = await setCodigoApi(code, selectedItemUrl);
        setCode("");
        setShowModalMessage({ state: true, message: codeMessage[0] });
        setTimeout(() => setShowModalMessage(false), 3000);
      } catch (error) {
        console.log(error.message);
        setShowModalMessage({ state: true, message: codeMessage[1] });
        setTimeout(() => setShowModalMessage(false), 4000);
      }
    }
  };

  const getDatosForm = (event) => {
    let { name, value } = event.target;
    setCode({ ...code, [name]: value });
  };

  async function setCodigoApi(code, selectedItem) {
    const URL = "https://api.artis.market/item/additems";
    // const URL = 'https://api.artis.market/item/additem'

    let objetoConfig = {
      link: selectedItem,
      category_id: code.categoria,
      collection_id: code.coleccion,
    };
    // console.log(objetoConfig)
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Basic dXN1YXJpbzpwd2Q=");
    myHeaders.append("Content-Type", "application/json");

    let url = `${URL}`;
    let myInit = {
      method: "POST",
      body: JSON.stringify(objetoConfig),
      headers: myHeaders,
    };

    let resPost = await fetch(url, myInit);
    // console.log(resPost)
    if (!resPost.ok) {
      console.log("Error: " + resPost.status);
      throw { message: "An error has occurred" };
    }
    let post = await resPost.json();
    // console.log(post)
    console.log({ status: `Sending Codes`, ...post });
    return post;
  }

  return (
    <>
      {/* tabla pc */}
      <div className="container px-0 text-center my-5 d-none d-md-block border border-white">
        <table className="container my-2 py-1 mx-auto table-pc">
          <thead>
            <tr>
              <th scope="col --max-width" style={{ color: "#00b8ff" }}>
                <FormattedMessage
                  id="colleccionNFT.table-column1"
                  defaultMessage="Name"
                />
              </th>
              <th scope="col --max-width" style={{ color: "#00b8ff" }}>
                <FormattedMessage
                  id="colleccionNFT.table-column2"
                  defaultMessage="Amount"
                />
              </th>
              <th scope="col --max-width" style={{ color: "#00b8ff" }}>
                <FormattedMessage
                  id="colleccionNFT.table-column3"
                  defaultMessage="Download"
                />
              </th>
              <th scope="col --max-width" style={{ color: "#00b8ff" }}>
                <FormattedMessage
                  id="colleccionNFT.table-column4"
                  defaultMessage="Export to NFanst"
                />
              </th>
              <th scope="col --max-width" style={{ color: "#00b8ff" }}>
                <FormattedMessage
                  id="colleccionNFT.table-column5"
                  defaultMessage="Deadline"
                />
              </th>
              <th scope="col --max-width" style={{ color: "#00b8ff" }}>
                <FormattedMessage
                  id="colleccionNFT.table-column6"
                  defaultMessage="Weight"
                />
              </th>
              <th></th>
            </tr>
          </thead>
          {!isPromiseReady ? (
            <thead>
              <tr>
                <th colSpan="5">
                  <h1>
                    {" "}
                    <FormattedMessage
                      id="colleccionNFT.loading"
                      defaultMessage="loading"
                    />{" "}
                  </h1>
                </th>
              </tr>
            </thead>
          ) : (
            <tbody className="my-0">
              {collectall.length ? (
                collectall.map((colletion, key) => (
                  <tr key={key} className="align-middle">
                    <td className="py-2">{colletion.nombre}</td>
                    <td className="py-2">{colletion.cantidad}</td>
                    <td className="py-2">
                      {colletion.url === "En Proceso..." ? (
                        "In process..."
                      ) : colletion.url === "Error al Generar" ? (
                        "Failed, try again"
                      ) : (
                        <a href={colletion.url}>
                          <Descargar style={{ width: "30px" }} fill={"#fff"} />
                        </a>
                      )}
                    </td>
                    <td className="py-2">
                      {colletion.url === "En Proceso..." ? (
                        <Export style={{ width: "32px" }} fill={"#494b50"} />
                      ) : (
                        <Export
                          style={{ width: "32px", cursor: "pointer" }}
                          fill={"#fff"}
                          onClick={() => handleOpenModalCodigo(colletion.url)}
                        />
                      )}
                    </td>
                    <td className="py-2">{date(colletion.fecha.$date)}</td>
                    <td className="py-2">{colletion.peso}</td>
                    <td className="py-2">
                      {colletion.url !== "En Proceso..." && (
                        <Delete
                          width={30}
                          height={30}
                          fill="#ec2d01"
                          style={{ cursor: "pointer" }}
                          onClick={() =>
                            handleOpenModalEliminar(colletion._id["$oid"])
                          }
                        />
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <th colSpan="7">
                    <div className="p-5">
                      <h1 className="mb-3">
                        <FormattedMessage
                          id="colleccionNFT.nocollections"
                          defaultMessage="You don't have collections"
                        />
                      </h1>
                      <Link to={`/`}>
                        <button className="__boton-mediano enphasis-button">
                          <FormattedMessage
                            id="colleccionNFT.go-to-generator"
                            defaultMessage="Create your first collection"
                          />
                        </button>
                      </Link>
                    </div>
                  </th>
                </tr>
              )}
            </tbody>
          )}
        </table>
      </div>

      {/* tablas celulares/tablets */}
      <div
        className="container d-block d-md-none my-5"
        style={{ backgroundColor: "transparent" }}
      >
        {collectall.length < 1 ? (
          <h1 className="my-0 text-center border border-white p-2 rounded-4">
            <FormattedMessage
              id="colleccionNFT.loading"
              defaultMessage="loading"
            />
          </h1>
        ) : collectall.err !== "sin colecciones" ? (
          collectall?.map((colletion, key) => (
            <div
              className="container my-2 py-1 mx-auto table-mobile  border border-white"
              key={key}
            >
              <div className="row py-1 align-items-center justify-content-center">
                <div className="col text-center">
                  <FormattedMessage
                    id="colleccionNFT.table-column1"
                    defaultMessage="name"
                  />
                </div>
                <div className="col text-center py-1">{colletion.nombre}</div>
              </div>
              <div className="row py-1 align-items-center">
                <div className="col text-center py-1">
                  <FormattedMessage
                    id="colleccionNFT.table-column2"
                    defaultMessage="amount"
                  />
                </div>
                <div className="col text-center">{colletion.cantidad}</div>
              </div>
              <div className="row py-1 align-items-center">
                <div className="col text-center py-1">
                  <FormattedMessage
                    id="colleccionNFT.table-column3"
                    defaultMessage="download"
                  />
                </div>
                <div className="col text-center py-1">
                  {colletion.url === "En Proceso..." ? (
                    "In process..."
                  ) : (
                    <a href={colletion.url}>
                      <Descargar style={{ width: "32px" }} fill={"#fff"} />
                    </a>
                  )}
                </div>
              </div>
              <div className="row py-1 align-items-center">
                <div className="col text-center py-1">
                  <FormattedMessage
                    id="colleccionNFT.table-column4"
                    defaultMessage="Export to artis"
                  />
                </div>
                <div className="col text-center py-1">
                  {colletion.url === "En Proceso..." ? (
                    <Export style={{ width: "32px" }} fill={"#494b50"} />
                  ) : (
                    <Export
                      style={{ width: "32px", cursor: "pointer" }}
                      fill={"#fff"}
                      onClick={() => handleOpenModalCodigo(colletion.url)}
                    />
                  )}
                </div>
              </div>
              <div className="row py-1 align-items-center">
                <div className="col text-center py-1">
                  <FormattedMessage
                    id="colleccionNFT.table-column5"
                    defaultMessage="deadline"
                  />
                </div>
                <div className="col text-center py-1">
                  {date(colletion.fecha.$date)}
                </div>
              </div>
              <div className="row py-1 align-items-center">
                <div className="col text-center py-1">
                  <FormattedMessage
                    id="colleccionNFT.table-column6"
                    defaultMessage="Weight"
                  />
                </div>
                <div className="col text-center py-1">{colletion.peso}</div>
              </div>
              <div className="row py-1 align-items-center">
                <div className="col text-center py-1"></div>
                <div className="col text-center py-1">
                  {colletion.url !== "En Proceso..." && (
                    <Delete
                      width={30}
                      height={30}
                      fill="#ec2d01"
                      style={{ cursor: "pointer" }}
                      onClick={() =>
                        handleOpenModalEliminar(colletion._id["$oid"])
                      }
                    />
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <h1 className="my-0 text-center border border-white p-2 rounded-4">
            <FormattedMessage
              id="colleccionNFT.nocollections"
              defaultMessage="You have no collections"
            />
          </h1>
        )}
      </div>

      <GenericModal show={showModalEliminar}>
        <div className="p-4">
          <p>
            <FormattedMessage
              id="colleccionNFT.modal-delete-tittle"
              defaultMessage="Are you sure you want to delete?"
            />
          </p>
          <p>
            <FormattedMessage
              id="colleccionNFT.modal-delete-subTittle"
              defaultMessage="This action can not be undone..."
            />
          </p>

          <button className="__boton-mediano-borrar" onClick={handleDelete}>
            <FormattedMessage
              id="colleccionNFT.modal-delete-btn-remove"
              defaultMessage="Remove"
            />
          </button>
          <button
            className="__boton-mediano"
            onClick={() => setShowModalEliminar(false)}
          >
            <FormattedMessage
              id="colleccionNFT.modal-delete-btn-cancel"
              defaultMessage="Cancel"
            />
          </button>
        </div>
      </GenericModal>

      <GenericModal show={showModalCodigo}>
        <div className="p-4">
          <div className="mb-3">
            <label className="form-label ">
              <FormattedMessage
                id="colleccionNFT.modal-export-category-id"
                defaultMessage="Category id"
              />
            </label>
            <input
              type="text"
              className="form-control --modificadorForm"
              name="categoria"
              value={code?.categoria || ""}
              onChange={(e) => getDatosForm(e)}
            />
          </div>
          <div className="mb-3">
            <label className="form-label ">
              <FormattedMessage
                id="colleccionNFT.modal-export-collection-id"
                defaultMessage="Collection id"
              />
            </label>
            <input
              type="text"
              className="form-control --modificadorForm"
              value={code?.coleccion || ""}
              name="coleccion"
              onChange={(e) => getDatosForm(e)}
            />
          </div>
        </div>
        <button
          className="__boton-mediano-borrar --envair mb-3"
          onClick={handleEnviarCode}
        >
          <FormattedMessage
            id="colleccionNFT.modal-export-btn-send"
            defaultMessage="send"
          />
        </button>
        <button
          className="__boton-mediano mb-3"
          onClick={() => setShowModalCodigo(false)}
        >
          <FormattedMessage
            id="colleccionNFT.modal-export-btn-cancel"
            defaultMessage="cancel"
          />
        </button>
      </GenericModal>

      <GenericModal show={showModalMessage?.state}>
        <div className="p-4">
          <div className="mb-3">
            <h2>{showModalMessage?.message}</h2>
          </div>
        </div>
      </GenericModal>
    </>
  );
};

export default ColeccionNFT;
