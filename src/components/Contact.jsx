import { useSnackbar } from "notistack"
import React, { useRef, useState } from "react"
import ReCAPTCHA from "react-google-recaptcha"
import { FormattedMessage, useIntl } from "react-intl"
import close from "../assets/svg/cerrar.svg"
import { URL } from "../constantes"
import "../styles/scss/_contact.scss"

export const Contact = ({ showContact, setShowContact }) => {
  const { enqueueSnackbar } = useSnackbar()
  const intl = useIntl()

  const captcha = useRef(null)

  function onChange(value) {
    captcha.current = value
    console.log("Captcha value:", value)
  }

  const [nombre, setNombre] = useState("")
  const [correo, setCorreo] = useState("")
  const [mensaje, setMensaje] = useState("")

  const [error, setError] = useState(false)

  const validateEmail = (email) => {
    const reg =
      /^[a-zA-Z0-9.!#$%&'+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)$/
    return reg.test(email)
  }

  const handleSubmit = async (event) => {
    if (nombre === "" || correo === "" || mensaje === "") {
      setError(true)
      enqueueSnackbar(
        intl.formatMessage({
          id: "contact.incompleteFields",
          defaultMessage: "Please complete all the fields"
        }),
        {
          variant: "error",
          anchorOrigin: {
            vertical: "top",
            horizontal: "right"
          }
        }
      )
      return
    }
    if (!validateEmail(correo)) {
      setError(true)
      enqueueSnackbar(
        intl.formatMessage({
          id: "contact.validationMail",
          defaultMessage: "Please introduce a valid email"
        }),
        {
          variant: "error",
          anchorOrigin: {
            vertical: "top",
            horizontal: "right"
          }
        }
      )
      return
    }
    if (captcha.current === null) {
      setError(true)
      enqueueSnackbar(
        intl.formatMessage({
          id: "contact.captchaError",
          defaultMessage: "Please complete Captcha"
        }),
        {
          variant: "error",
          anchorOrigin: {
            vertical: "top",
            horizontal: "right"
          }
        }
      )
      return
    }

    setError(false)

    enqueueSnackbar(
      intl.formatMessage({
        id: "contact.alertSuccess",
        defaultMessage: "Message sent"
      }),
      {
        variant: "success",
        action: () => setShowContact(false),
        anchorOrigin: {
          vertical: "top",
          horizontal: "right"
        }
      }
    )

    const datos = {
      nombre: nombre,
      destinatario: correo,
      mensaje: mensaje,
      trecaptcha: captcha.current
    }
    const url = `${URL}sendmail`
    const headers = {
      method: "POST",
      body: JSON.stringify(datos),
      headers: { "Content-type": "application/json;charset=UTF-8" }
    }

    console.log(datos)
    await fetch(url, headers)
      .then((res) => res.json())
      .then((json) => console.log(json))
      .catch((err) => console.log(err))

    return datos
  }

  return (
    <div className={showContact ? "cont-wrapper " : "d-none"}>
      <div
        className={showContact ? "inline-block container-contact" : "d-none"}
        style={{
          border: "1px solid #00B8FF",
          padding: "10px",
          maxWidth: "50% !important"
        }}
      >
        <div>
          <h3
            style={{
              fontSize: "1.5rem",
              padding: ".7em",
              boxShadow: "#ffffff1f 0px 2px 3px 0px",
              borderBottomLeftRadius: 0,
              borderBottomRightRadius: 0
            }}
          >
            <FormattedMessage id="contact.title" defaultMessage="Contact" />
          </h3>

          <img
            src={close}
            className="btn-close-contact"
            onClick={() => {
              setShowContact(false)
            }}
          />
        </div>

        <form className="p-2 form-contact my-3">
          <div className="mb-3">
            <label htmlFor="projectname" className="form-label left">
              <FormattedMessage id="contact.name" defaultMessage="Name" />
            </label>
            <input
              type="text"
              className="form-control-sm w-100 --border-blue"
              id="projectname"
              name="pName"
              maxLength={100}
              onChange={(e) => setNombre(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="projectdescription" className="form-label">
              <FormattedMessage id="contact.email" defaultMessage="Email" />
            </label>
            <input
              type="text"
              className="form-control-sm w-100 --border-blue"
              id="projectdescription"
              name="pDescription"
              maxLength={300}
              onChange={(e) => setCorreo(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="capaName" className="form-label">
              <FormattedMessage id="contact.message" defaultMessage="Message" />
            </label>
            <textarea
              class="form-control"
              aria-label="With textarea"
              className="form-control-sm w-100"
              style={{ height: "100px" }}
              onChange={(e) => setMensaje(e.target.value)}
            ></textarea>
          </div>
        </form>

        <div className="d-flex justify-content-center align-items-center">
          <ReCAPTCHA
            onChange={onChange}
            sitekey="6LfulzApAAAAANw5LdP3MWuK1PzSADmBkrk4osKE"
          />
        </div>

        <div className="p-2">
          <button
            className="__boton-mediano enphasis-button"
            style={{ width: "200px" }}
            onClick={handleSubmit}
          >
            <FormattedMessage id="contact.send" defaultMessage="Send" />
          </button>
        </div>
      </div>
    </div>
  )
}
