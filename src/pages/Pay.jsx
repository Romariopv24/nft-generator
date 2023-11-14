import { useEffect, useState } from "react";
import { FormattedMessage } from "react-intl";
import { useNavigate, useParams } from "react-router-dom";
import { ReactComponent as Check } from "../assets/svg/check-circle.svg";
import { URL } from "../constantes";
const bcrypt = require("bcryptjs");

const Pay = () => {
  const [isPay, setIsPay] = useState(false);
  let params = useParams();
  let visual = params.params.split("&&");
  const [id, nombre, cantidad] = visual;
  console.log(id, nombre, cantidad);
  const navegate = useNavigate();

  const facebook = JSON.parse(localStorage.getItem("facebook"));
  const google = JSON.parse(localStorage.getItem("google"));
  const metamask = JSON.parse(localStorage.getItem("metamask"));
  const {
    idHash = "no",
    name = "no",
    qtty = "no",
  } = JSON.parse(localStorage.getItem("pay"));

  useEffect(() => {
    bcrypt.compare(id, idHash, function (err, res) {
      console.log(res);
      bcrypt.compare(nombre, name, function (err, res) {
        console.log(res);
        bcrypt.compare(cantidad, qtty, async function (err, res) {
          console.log(res);
          if (res) {
            setIsPay(res);
            await generarCombinaciones(cantidad, nombre);
          } else {
            navegate("/");
          }
          localStorage.setItem("pay", "vacio");
        });
      });
    });
    console.log(isPay);
    //setTimeout(()=> navegate('/coleccion'),30000)
  }, []);

  //  const generateCollection = async(cantidad,nombre) =>{
  //   let correo = facebook?.tokenUser || google?.tokenUser || metamask?.tokenUser
  //   console.log({correo},{cantidad},{nombre})
  //   let url = `${URL}/p?cantidad=${cantidad}&nombre=${nombre}&cb=${correo}`

  //   const resGet = await fetch(url, {method: "GET", myHeaders})
  //   const res = await resGet.json()
  //   console.log({resGet},{res})
  //  }

  async function generarCombinaciones(cantidad, nombre) {
    let correo =
      facebook?.tokenUser || google?.tokenUser || metamask?.tokenUser;
    console.log({ correo }, { cantidad }, { nombre });

    let url = `${URL}p?cantidad=${cantidad}&nombre=${nombre}&cb=${correo}`;
    let myInit = {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    };
    let resPost = await fetch(url, myInit);
    let post = await resPost.json();

    console.log({ status: `Generar combinaciones`, ...post });
    console.log({ resPost }, { post });

    if (!resPost.ok) throw Error("HTTP status " + resPost.status);
    return post;
  }

  function rediredAtHome() {
    navegate("/coleccion");
  }

  return (
    <>
      {isPay === true ? (
        <div className="d-flex flex-column justify-content-center align-items-center mt-5">
          <h1>
            <FormattedMessage
              id="pay.made"
              defaultMessage="Congratulations, your payment has been successfully completed."
            />
          </h1>
          <Check fill="#20c997" style={{ width: "25%" }} />
          <button className="m-2 p-2 btn btn-primary" onClick={rediredAtHome}>
            <FormattedMessage
              id="pay.btn-collections"
              defaultMessage="See my collections"
            />
          </button>
        </div>
      ) : (
        <div className="d-flex flex-column justify-content-center align-items-center mt-5 ">
          <h1>
            {" "}
            <FormattedMessage
              id="pay.processing"
              defaultMessage="Processing your payment"
            />{" "}
          </h1>
          <div
            className="spinner-grow text-secondary"
            style={{ width: "15rem", height: "15rem" }}
            role="status"
          >
            <span className="visually-hidden">
              {" "}
              <FormattedMessage id="pay.loading" description="Loading..." />
            </span>
          </div>
        </div>
      )}
    </>
  );
};

export default Pay;
