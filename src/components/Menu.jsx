import React, { useContext, useEffect, useState } from "react";
import { FormattedMessage } from "react-intl";
import { Link, useLocation, useNavigate } from "react-router-dom";
import logo from "../assets/img/logo.png";
import es from "../assets/img/spain.png";
import en from "../assets/img/united-kingdom.png";
import { ReactComponent as Back } from "../assets/svg/carpetaEngrane.svg";
import { ReactComponent as Colletion } from "../assets/svg/coleccion+.svg";
import { ReactComponent as Edit } from "../assets/svg/edit.svg";
import { ReactComponent as SignOut } from "../assets/svg/signout.svg";
import { ReactComponent as User } from "../assets/svg/user.svg";
import { listWalletPremiun } from "../constantes";
import { langContext } from "../context/langContext";
import { ConexionDB, reiniciar } from "../db/CrudDB";
import "../styles/scss/_banderas.scss";
import "../styles/scss/_logo.scss";
import "../styles/scss/_menu.scss";
import "../styles/scss/app.scss";
import { useStoreProv } from "../utils/zustand/store";
import { jwtDecode } from "jwt-decode";

const Menu = ({
  desLoguearse,
  isAuth,
  setIsActiveModalRegister,
  name,
  setName,
  setShowVideo,
  setLoading,
}) => {
  const [nameUser, setNameUser] = useState(null);
  const [hovered, setHovered] = useState(null);

  const [db, setDb] = useState(null);
  let location = useLocation();
  const { typeUser } = useStoreProv();
  let navigate = useNavigate();

  useEffect(() => {
    const facebook = JSON.parse(localStorage.getItem("facebook"));
    const google = JSON.parse(localStorage.getItem("google"));
    const metamask = JSON.parse(localStorage.getItem("metamask"));
    setName = localStorage.getItem("name");

    if (metamask?.tokenUser) {
      setNameUser(metamask.tokenUser.substr(0, 20));
    }
    createConection();
  }, [nameUser, location, name]);
  const { access_token, setAccess_token } = useStoreProv();
  const idioma = useContext(langContext);

  //setName = localStorage.getItem('name')

  function showName(name, NameUser) {
    if (name) {
      return name;
    }
    return NameUser;
  }

  function ReiniciarTodo() {
    const idioma = localStorage.getItem("idioma");
    localStorage.clear();
    localStorage.setItem("idioma", idioma);
    reiniciar(db, "images");
    reiniciar(db, "smallImages");
    setNameUser(null);
    setAccess_token(null);
  }

  async function createConection() {
    setDb(await ConexionDB());
  }

  const idiomaFocus = localStorage.getItem("idioma");
  const isIdiomaFocusNull = idiomaFocus === "null" || idiomaFocus === null;

  const allSignOut = () => {
    setName(null);
    desLoguearse();
    ReiniciarTodo();
    navigate("/");
  };

  const signOutBtn = () => {
    desLoguearse();
    setLoading(true);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (access_token) {
        const decoded = jwtDecode(access_token);
        const decoded_time = new Date(decoded.exp * 1000);
        const now = new Date();
        if (now > decoded_time) {
          signOutBtn();
          desLoguearse();
          ReiniciarTodo();
          navigate("/login");
        }
      }
    }, 10000); // Check every 10 seconds

    return () => clearInterval(interval); // Cleanup on component unmount
  }, [access_token, desLoguearse, ReiniciarTodo, navigate]);

  return isAuth ? (
    <div className="d-flex align-items-center my-2 ps-2 pe-1">
      <div className="logo_menu">
        <img src={logo} alt="Logo" />
      </div>
      <div
        style={{
          width: "100%",
          display: "flex",
          justifyContent: !nameUser ? "flex-end" : "center",
          alignItems: "center",
        }}
      >
        {location.pathname !== "/terms&conditons" && nameUser && (
          <span className="me-auto user-button">
            <Edit
              className="edit-icon"
              onClick={() => setIsActiveModalRegister(true)}
            />
            <div className="divider" />
            <span>{showName(name, nameUser)}</span>
            <User className="user-icon" width={30} height={30} />
          </span>
        )}
        {nameUser && (
          <div class="links">
            <FormattedMessage
              id="menu.tutorial"
              defaultMessage="Don't know where to start?  "
            />
            <Link
              className="links"
              style={{ cursor: "pointer" }}
              // target="_blank"
              rel="noopener noreferrer"
              to={"/faqs"}
            >
              <FormattedMessage
                id="menu.video-tutorial"
                defaultMessage=" Watch tutorial video!"
              />
            </Link>
          </div>
        )}

        {typeUser === 2 ? (
          <div>
            <Link to={`/admin`} className=" d-none d-sm-block">
              {" "}
              <button
                className="__boton-mediano enphasis-button"
                id="colecciones"
              >
                Admin
              </button>
            </Link>
            <Link to={`/admin`} className="d-block d-sm-none mx-1">
              <Colletion style={{ width: "35px" }} fill={"#fff"} />
            </Link>
          </div>
        ) : null}

        {location.pathname === "/" && (
          <div>
            <Link to={`/coleccion`} className=" d-none d-sm-block">
              {" "}
              <button
                className="__boton-mediano enphasis-button"
                id="colecciones"
              >
                <FormattedMessage
                  id="menu.collections"
                  defaultMessage="My Collections"
                />
              </button>
            </Link>
            <Link to={`/coleccion`} className="d-block d-sm-none mx-1">
              <Colletion style={{ width: "35px" }} fill={"#fff"} />
            </Link>
          </div>
        )}
        {location.pathname !== "/" && nameUser && (
          <div>
            <Link to={`/`} className=" d-none d-sm-block">
              <button className="__boton-mediano enphasis-button">
                <FormattedMessage
                  id="menu.generateNFT"
                  defaultMessage="Generate NFT"
                />
              </button>
            </Link>
            <Link to={`/`} className=" d-block d-sm-none">
              <Back style={{ width: "40px" }} fill={"#fff"} />
            </Link>
          </div>
        )}

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

        {nameUser ? (
          <button
            onClick={() => {
              allSignOut();
            }}
            className="__boton-signOut enphasis-button d-none d-sm-block "
          >
            <FormattedMessage id="menu.logout" defaultMessage="Sign out" />
            <SignOut
              onClick={() => {
                signOutBtn();
              }}
              className=" d-block d-sm-none mx-1"
              style={{ width: "40px" }}
              fill={"#fff"}
            />
          </button>
        ) : (
          <button
            onClick={() => {
              allSignOut();
            }}
            className="__boton-signOut enphasis-button d-none d-sm-block "
          >
            Login
          </button>
        )}
      </div>
    </div>
  ) : (
    <>
      {/* {location.pathname === "/terms&conditions" ? (
        <div className="d-flex align-items-center my-2 ps-2 pe-1">
          <div className="logo_menu">
            <img src={logo} alt="Logo" />
          </div>
          <div
            style={{
              width: "100%",
              display: "flex",
              justifyContent: !nameUser ? "flex-end" : "center",
              alignItems: "center"
            }}
          >
         <div className="banderas">
  <button
    onClick={() => {
      idioma.cambiarIdioma("es-ES")
    }}
    style={{
      borderRadius: "20px",
      backgroundColor: "transparent"
    }}
  >
    <img 
      src={es} 
      alt="" 
      style={{
        filter: (idiomaFocus === "es-ES" || hovered === "es-ES") ? "none" : "grayscale(100%)"
      }}
      onMouseEnter={() => setHovered("es-ES")}
      onMouseLeave={() => setHovered(null)}
    />
  </button>
  <button
    onClick={() => {
      idioma.cambiarIdioma("en-US")
    }}
    style={{
      borderRadius: "20px",
      backgroundColor: "transparent"
    }}
  >
    <img 
      src={en} 
      alt="" 
      style={{
        filter: (idiomaFocus === "en-US" || hovered === "en-US") ? "none" : "grayscale(100%)"
      }}
      onMouseEnter={() => setHovered("en-US")}
      onMouseLeave={() => setHovered(null)}
    />
  </button>
</div>
            <button
              onClick={() => {
                navigate("/login")
              }}
              className="__boton-signOut enphasis-button d-none d-sm-block "
            >
              Login
            </button>
          </div>
        </div>
      ) : null} */}
    </>
  );
};

export default Menu;
