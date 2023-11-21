import { useEffect, useLayoutEffect, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import Joyride, { STATUS } from "react-joyride";
import {
  Link,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { Contact } from "./components/Contact";
import GenericModal from "./components/GenericModal";
import { LegalWarning } from "./components/LegalWarning";
import Menu from "./components/Menu";
import RegisterUser from "./components/RegisterUser";
import { URL } from "./constantes";
import FAQs from "./pages/FAQs";
import Login from "./pages/Login";
import Pay from "./pages/Pay";
import ColeccionNFT from "./pages/coleccionNFT";
import Generator from "./pages/generator";
import Terms from "./pages/terms";
import "./styles/scss/_pedir-correro.scss";

function App() {
  const intl = useIntl();
  const [isAuth, setIsAuth] = useState(null);
  const [datosUserLS, setDatosUserLS] = useState({});
  const [isActiveModalRegister, setIsActiveModalRegister] = useState(false);
  const facebook = JSON.parse(localStorage.getItem("facebook"));
  const google = JSON.parse(localStorage.getItem("google"));
  const metamask = JSON.parse(localStorage.getItem("metamask"));
  const [name, setName] = useState(null);
  const [loadingImages, setLoadingImages] = useState({
    cantidadTotal: 0,
    cantidadActual: 0,
    isLoading: false,
  });
  const [show, setShow] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const [showLegalWarning, setShowLegalWarning] = useState(false);
  const [showContact, setShowContact] = useState(false);
  const [steps, _] = useState([
    {
      target: "#capas",
      disableBeacon: true,
      content: (
        <FormattedMessage
          id="tutorial.step1"
          defaultMessage="Here you can organize your layers to change how your final nft will look like."
        />
      ),
    },
    {
      target: "#nuevaCapa",
      content: (
        <FormattedMessage
          id="tutorial.step2"
          defaultMessage="You can assign a name and create a new layer or create it with a temporary name."
        />
      ),
    },
    {
      target: "#visualizar",
      content: (
        <FormattedMessage
          id="tutorial.step3"
          defaultMessage="You can view your nft whenever you want using this button."
        />
      ),
    },
    {
      target: "#reiniciar",
      content: (
        <FormattedMessage
          id="tutorial.step4"
          defaultMessage="If you want to start a new project you can restart it with this button (this will delete all previous settings)."
        />
      ),
    },
    {
      target: "#imagenes",
      content: (
        <FormattedMessage
          id="tutorial.step5"
          defaultMessage="Here you can see all the images you have added to your project."
        />
      ),
    },
    {
      target: "#agregarImagenes",
      content: (
        <FormattedMessage
          id="tutorial.step6"
          defaultMessage="And if you want to add new images drag them here or click to select them."
        />
      ),
    },
    {
      target: "#colecciones",
      content: (
        <FormattedMessage
          id="tutorial.step7"
          defaultMessage="From here you can navigate to your already generated collections."
        />
      ),
    },
    {
      target: "#datos",
      content: (
        <FormattedMessage
          id="tutorial.step8"
          defaultMessage="In this section you can customize the data of your collection."
        />
      ),
    },
    {
      target: "#combinaciones",
      content: (
        <FormattedMessage
          id="tutorial.step9"
          defaultMessage="Here you can see the total possible combinations with the added images."
        />
      ),
    },
    {
      target: "#resolucion",
      content: (
        <FormattedMessage
          id="tutorial.step10"
          defaultMessage="This field allows you to see the supported resolution for the images (it is calculated based on the first image added)."
        />
      ),
    },
    {
      target: "#rareza",
      content: (
        <FormattedMessage
          id="tutorial.step11"
          defaultMessage="In this option you can customize the probability that an image appears in each layer."
        />
      ),
    },
    {
      target: "#generar",
      content: (
        <FormattedMessage
          id="tutorial.step12"
          defaultMessage="With this button you can generate your collection (certain conditions apply)."
        />
      ),
    },
  ]);
  let navigate = useNavigate();

  useEffect(() => {
    setDatosUserLS({ metamask, google, facebook });
    fetchData();
  }, [isAuth]);

  useLayoutEffect(() => {
    if (!JSON.parse(localStorage.getItem("firstVisit"))) {
      setShow(true);

    }
  }, []);

  const location = useLocation().pathname;

  const fetchData = async () => {
    if (
      facebook?.tokenUser ||
      google?.tokenUser ||
      metamask?.tokenUser ||
      location === "/terms&conditions"
    ) {
      try {
        let res = await createFolderUserServer();
        setIsAuth(true);
        return res;
      } catch (error) {
        console.log(error);
      }
    } else {
      setIsAuth(false);
      navigate("/login");
    }
  };

  async function createFolderUserServer() {
    let ObjetoUser = {
      id: facebook?.tokenUser || google?.tokenUser || metamask?.tokenUser,
    };

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    let url = `${URL}user`;
    let myInit = {
      method: "POST",
      body: JSON.stringify(ObjetoUser),
      headers: myHeaders,
    };

    if (location !== "/terms&conditions") {
      let resPost = await fetch(url, myInit);
      if (!resPost.ok) {
        // console.log({ resPost })
        throw Error("HTTP status " + resPost.status);
      }

      let post = await resPost.json();
      if (post.usuario !== "creado") {
        localStorage.setItem("name", post[0].nombre);
        setName(post[0].nombre);
      }
      validarDatosUserDesdeServidor(post);
      return post;
    }
  }

  function validarDatosUserDesdeServidor(res) {
    if (res.usuario === "creado") setIsActiveModalRegister(true);
    console.log(res.nombre);
    if (res[0]?.email === null) {
      setIsActiveModalRegister(true);
    }
    if (res[0]?.email === "") {
      setIsActiveModalRegister(true);
    }
    if (res[0]?.nombre === null) {
      setIsActiveModalRegister(true);
    }
    if (res[0]?.nombre === "") {
      setIsActiveModalRegister(true);
    }
  }

  function desLoguearse() {
    localStorage.setItem("facebook", JSON.stringify(null));
    localStorage.setItem("google", JSON.stringify(null));
    localStorage.setItem("metamask", JSON.stringify(null));
    setIsAuth(false);
  }

  if (isAuth === null) {
    return null;
  }

  const handleJoyride = (data) => {
    const { action, status } = data;

    if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status)) {
      localStorage.setItem("firstVisit", JSON.stringify(true));
      setShow(false);
    }
  };

  console.log(isActiveModalRegister);

  return (
    <>
      <div className="App">
        {loadingImages.isLoading && (
          <div
            className="position-fixed row align-items-center justify-content-center"
            style={{
              width: "100%",
              height: "100vh",
              background: "rgba(0,0,0,0.4)",
              zIndex: "10000",
            }}
          >
            <div className="w-50 bg-dark">
              <h1 className="color-white text-center">
                {loadingImages.cantidadActual} de {loadingImages.cantidadTotal}
              </h1>
              <div className="progress mb-5">
                <div
                  className="progress-bar progress-bar-striped progress-bar-animated"
                  role="progressbar"
                  style={{
                    width: `${
                      (100 / loadingImages.cantidadTotal) *
                      loadingImages.cantidadActual
                    }%`,
                  }}
                  aria-valuenow="75"
                  aria-valuemin="0"
                  aria-valuemax={23}
                ></div>
              </div>
            </div>
          </div>
        )}
        <Menu
          desLoguearse={desLoguearse}
          isAuth={isAuth}
          setIsActiveModalRegister={setIsActiveModalRegister}
          name={name}
          setName={setName}
          setShowVideo={setShowVideo}
        />

        <Routes>
          <Route
            path="/"
            element={
              isAuth && (
                <Generator
                  setIsAuth={setIsAuth}
                  desLoguearse={desLoguearse}
                  setLoadingImages={setLoadingImages}
                />
              )
            }
          />
          {/* <Route path="/tutorial" element={<Tutorial/>} /> */}
          <Route path="/login" element={<Login setIsAuth={setIsAuth} />} />
          <Route path="/coleccion" element={<ColeccionNFT />} />
          <Route path="/pay/:params" element={<Pay />} />
          <Route path="/faqs" element={<FAQs />} />
          <Route path="/terms&conditions" element={<Terms />} />
        </Routes>
      </div>
      {isActiveModalRegister && (
        <RegisterUser
          setIsActiveModalRegister={setIsActiveModalRegister}
          datosUserLS={datosUserLS}
          fetchData={fetchData}
          setName={setName}
        />
      )}

      <Joyride
        run={show}
        steps={steps}
        callback={handleJoyride}
        locale={{
          back: (
            <FormattedMessage
              id="tutorial.modal.btn-back"
              defaultMessage="Back"
            />
          ),
          close: intl.formatMessage({
            id: "tutorial.modal.btn-close",
            defaultMessage: "Close",
          }),
          last: (
            <FormattedMessage
              id="tutorial.modal.btn-last"
              defaultMessage="Finalize"
            />
          ),
          next: (
            <FormattedMessage
              id="tutorial.modal.btn-next"
              defaultMessage="Next"
            />
          ),
          open: intl.formatMessage({
            id: "tutorial.modal.btn-open",
            defaultMessage: "Open",
          }),
          skip: (
            <FormattedMessage
              id="tutorial.modal.btn-skip"
              defaultMessage="Skip"
            />
          ),
        }}
        continuous
        showProgress
        showSkipButton
        styles={{
          options: {
            textColor: "#FFF",
            primaryColor: "#00b8ff",
            backgroundColor: "#00047a",
            arrowColor: "#00047a",
          },
        }}
      />

      <GenericModal show={showVideo}>
        <div className="p-4">
          <iframe
            width="1280"
            height="720"
            src="https://www.youtube.com/embed/LikCPHJDVrY?autoplay=1&rel=0&wmode=transparent"
            frameborder="0"
            allowfullscreen
          />
        </div>
        <div className="my-3">
          <button
            className="__boton-mediano enphasis-button"
            onClick={() => {
              setShowVideo(false);
            }}
          >
            <FormattedMessage
              id="capas.close-modal-preview"
              defaultMessage="Close"
            />
          </button>
        </div>
      </GenericModal>

      <LegalWarning
        showLegalWarning={showLegalWarning}
        setShowLegalWarning={setShowLegalWarning}
      />

      <Contact showContact={showContact} setShowContact={setShowContact} />

      <footer class="text-center text-lg-start  text-muted">
        {/* Copyright */}
        <div class="text-center p-2 d-flex justify-content-center align-items-center">
          <p>
            <span className="p-2">Copyright © 2023 - Fanaticoins LLC</span>/
            <a
              target="_blank"
              style={{ color: "", cursor: "pointer" }}
              className="text-reset fw-bold p-2 links"
              onClick={() => setShowLegalWarning(true)}
            >
              {""}
              <FormattedMessage
                id="footer.legalwarning"
                defaultMessage="Legal warning"
              />
            </a>
            /
            <span
              className="p-2"
              style={{ cursor: "pointer" }}
              onClick={() => {
                setShowContact(true);
              }}
            >
              <FormattedMessage id="footer.contact" defaultMessage="Contact" />
            </span>
            /
            <Link
              target="_blank"
              style={{ textDecoration: "none", color: "white" }}
              to={"/terms&conditions"}
            >
              {" "}
              <FormattedMessage
                id="footer.terms&conditions"
                defaultMessage={"Terms & Conditions"}
              />
            </Link>
          </p>

          {/* <a class="text-reset fw-bold" href="https://mdbootstrap.com/">MDBootstrap.com</a> */}
        </div>
      </footer>
    </>
  );
}

export default App;
