import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import "../styles/scss/_login.scss";
import "../../node_modules/bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";
import { ReactComponent as Metamask } from "../assets/svg/metamask.svg";
import logo from "../assets/img/logo.png";

const Login = ({ setIsAuth, isAuth }) => {
  const [nombreBotonMT, setNombreBotonMT] = useState("Login with Metamasks");
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
          console.log(myAddress);
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

  return (
    <>
      <div className="align-items-center justify-content-center d-flex">
        <img className="logo" src={logo}/>
      </div>
      <div className="formularioLogin ">
        <div className="formFields">
          {/* LOGIN CON METAMASK */}
          <div className="loginBlock MetaMask" onClick={connectWalletHandler}>
            <div className="itemContainer">
              <div className="icon">
                <Metamask width={30} height={30} fill="white" />
              </div>
              <a className="text">{nombreBotonMT}</a>
            </div>
          </div>
          <div className="mt-5 text-center fw-bold">
            <p class="fs-4">Unlimited NFT Generator</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
