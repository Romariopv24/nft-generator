import { ethers } from "ethers";
import React, { useContext, useEffect, useState } from "react";
import { FormattedMessage } from "react-intl";
import { useNavigate } from "react-router-dom";
import "../../node_modules/bootstrap/dist/css/bootstrap.min.css";
import logo from "../assets/img/logo.png";
import es from "../assets/img/spain.png";
import en from "../assets/img/united-kingdom.png";
import { ReactComponent as Metamask } from "../assets/svg/metamask.svg";
import { langContext } from "../context/langContext";
import "../styles/scss/_login.scss";

const Login = ({ setIsAuth, isAuth }) => {
  const [nombreBotonMT, setNombreBotonMT] = useState("Login with Metamasks");
  const idioma = useContext(langContext);

  let navigate = useNavigate();

  async function connectWalletHandler() {
    try {
      if (typeof window.ethereum !== "undefined") {
        setNombreBotonMT("Login with MetaMask");
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();
        const firmaMensaje = await signer.signMessage("To Start Firm Section");
        const myAddress = await signer.getAddress();

        if (firmaMensaje) {
          let obj = {
            tokenUser: myAddress,
          };
          localStorage.setItem("metamask", JSON.stringify(obj));
        }

        setIsAuth(true);
        navigate("/");
      } else {
        setNombreBotonMT("MetaMask is not installed!");
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    const metamask = JSON.parse(localStorage.getItem("metamask"));
    if (metamask?.tokenUser) {
      setIsAuth(true);
      navigate("/");
    } else {
      setIsAuth(false);
    }
  }, [isAuth]);

  const idiomaFocus = localStorage.getItem("idioma");
  console.log(idiomaFocus);

  return (
    <>
      <div class="d-flex flex-row-reverse bd-highlight">
        <div className="banderas">
          <button
            onClick={() => {
              idioma.cambiarIdioma("es-ES");
            }}
            style={{
              borderRadius: "20px",
              backgroundColor:
                idiomaFocus === "es-ES" ? "#C8CCE9" : "transparent",
            }}
          >
            <img src={es} alt="" />
          </button>
          <button
            onClick={() => {
              idioma.cambiarIdioma("en-US");
            }}
            style={{
              borderRadius: "20px",
              backgroundColor:
                idiomaFocus === null || idiomaFocus === "en-US"
                  ? "#C8CCE9"
                  : "transparent",
            }}
          >
            <img src={en} alt="" />
          </button>
        </div>
      </div>
      <div className="align-items-center justify-content-center d-flex">
        <img className="logo" src={logo} />
      </div>
      <div className="formularioLogin ">
        <div className="formFields">
          {/* LOGIN CON METAMASK */}
          <div className="loginBlock MetaMask" onClick={connectWalletHandler}>
            <div className="itemContainer">
              <div className="icon">
                <Metamask width={30} height={30} fill="white" />
              </div>
              <a className="text">
                {nombreBotonMT === "Login with Metamasks" ? (
                  <FormattedMessage
                    id="login.metamask"
                    defaultMessage="Login with Metamasks"
                  />
                ) : nombreBotonMT === "Login with MetaMask" ? (
                  <FormattedMessage
                    id="login.metamask"
                    defaultMessage="Login with Metamasks"
                  />
                ) : (
                  <FormattedMessage
                    id="login.metamasknotinstalled"
                    defaultMessage="MetaMask is not installed!"
                  />
                )}
              </a>
            </div>
          </div>
          <div className="mt-5 text-center fw-bold">
            <p class="fs-4">
              <FormattedMessage
                id="login.title"
                defaultMessage="Unlimited NFT Generator!"
              />
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
