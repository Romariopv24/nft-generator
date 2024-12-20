import { ethers } from "ethers";
import React, { useContext, useEffect, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { useNavigate } from "react-router-dom";
import "../../node_modules/bootstrap/dist/css/bootstrap.min.css";
import logo from "../assets/img/logo.png";
import es from "../assets/img/spain.png";
import en from "../assets/img/united-kingdom.png";
import { ReactComponent as Metamask } from "../assets/svg/metamask.svg";
import { langContext } from "../context/langContext";
import "../styles/scss/_login.scss";
import { Stack } from "@mui/material";
import { AlertLinkNfanst } from "../components/mui-components/modal/AlertLinkNfanst";
import { jwtDecode } from "jwt-decode";
import { enqueueSnackbar, useSnackbar } from "notistack";

const Login = ({ setIsAuth, isAuth }) => {
  const [nombreBotonMT, setNombreBotonMT] = useState("Login with Metamasks");
  const [openModal, setOpenModal] = useState(false);
  const [hovered, setHovered] = useState(null);
  const idioma = useContext(langContext);
  const intl = useIntl();
  const { enqueueSnackbar } = useSnackbar();

  let navigate = useNavigate();

  const handleClose = () => setOpenModal(false);

  async function connectWalletHandler() {
    const tokenFromNFansT = localStorage.getItem("NFansT Token");

    try {
      if (!tokenFromNFansT) {
        console.log("No token", tokenFromNFansT);
        setOpenModal(true);
        return;
      }

      if (typeof window.ethereum !== "undefined" || tokenFromNFansT) {
        setNombreBotonMT("Login with MetaMask");
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();
        const firmaMensaje = await signer.signMessage("To Start Firm Section");
        const myAddress = await signer.getAddress();

        const decoded = jwtDecode(tokenFromNFansT);
        const { wallet } = decoded;
        if (firmaMensaje && myAddress.toLowerCase() === wallet.toLowerCase()) {
          let obj = {
            tokenUser: myAddress,
          };
          localStorage.setItem("metamask", JSON.stringify(obj));
        } else {
          enqueueSnackbar(
            intl.formatMessage({
              id: "alert.metamask.error",
              defaultMessage:
                "Error, Wallet are different, please connect the same wallet",
            }),
            {
              variant: "error",
              anchorOrigin: {
                vertical: "top",
                horizontal: "right",
              },
            }
          );
          setOpenModal(false);
        }
        setIsAuth(true);
        navigate("/");
        setOpenModal(false);
      } else {
        setNombreBotonMT("MetaMask is not installed!");
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    function activatedMetamask() {
      const tokenFromNFansT = localStorage.getItem("NFansT Token");

      if (tokenFromNFansT) {
        connectWalletHandler();
      }
    }

    activatedMetamask();
  }, []);

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
  const isIdiomaFocusNull = idiomaFocus === "null" || idiomaFocus === null;

  return (
    <>
      <Stack
        sx={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          height: "90vh",
          alignContent: "center",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div className="d-flex flex-column align-items-center justify-content-center">
          <img className="logo" alt="logo" src={logo} />
          <div className="formularioLogin ">
            <div className="formFields">
              {/* LOGIN CON METAMASK */}
              <div
                className="loginBlock MetaMask"
                onClick={connectWalletHandler}
              >
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

            <div
              class="d-flex justify-content-center align-items-center"
              style={{ marginTop: "2rem" }}
            >
              <div className="banderas">
                <button
                  onClick={() => {
                    idioma.cambiarIdioma("es-ES");
                  }}
                  style={{
                    borderRadius: "20px",
                    backgroundColor: "transparent",
                  }}
                >
                  <img
                    src={es}
                    alt=""
                    style={{
                      filter:
                        idiomaFocus === "es-ES" || hovered === "es-ES"
                          ? "none"
                          : "grayscale(100%)",
                    }}
                    onMouseEnter={() => setHovered("es-ES")}
                    onMouseLeave={() => setHovered(null)}
                  />
                </button>
                <button
                  onClick={() => {
                    idioma.cambiarIdioma("en-US");
                  }}
                  style={{
                    borderRadius: "20px",
                    backgroundColor: "transparent",
                  }}
                >
                  <img
                    src={en}
                    alt=""
                    style={{
                      filter:
                        isIdiomaFocusNull ||
                        idiomaFocus === "en-US" ||
                        hovered === "en-US" ||
                        !localStorage.getItem("idioma")
                          ? "none"
                          : "grayscale(100%)",
                    }}
                    onMouseEnter={() => setHovered("en-US")}
                    onMouseLeave={() => setHovered(null)}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
      </Stack>
      <AlertLinkNfanst openModal={openModal} handleClose={handleClose} />
    </>
  );
};

export default Login;
