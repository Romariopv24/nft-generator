import { useEffect, useState } from "react"
import { URL } from '../constantes'
import {ReactComponent as Closer} from '../assets/svg/close.svg'
import { FormattedMessage } from 'react-intl'

function RegisterUser({ setIsActiveModalRegister, datosUserLS, fetchData, setName }) {
  const [isErrorForm, setIsErrorForm] = useState({ nombreEF: false, correoEF: false });
  const [messageError, setMessageError] = useState();
  const { metamask, google, facebook } = datosUserLS
  const id = facebook?.tokenUser || google?.tokenUser || metamask?.tokenUser
  const nombre = facebook?.nameUser || google?.nameUser
  const correo = facebook?.correo || google?.correo
  const wallet = metamask?.tokenUser
  const [userData, setUserData] = useState({ nombre: nombre || '', correo: correo || '', correob: "", telefono: "", wallet: wallet || "" })

  useEffect(() => {
   esperar()
  }, []);

  async function esperar() {
    try {
      let res = await fetchData()
      // console.log(res)
      if (userData.nombre === "") {   
        if (res) {
          const obj = {
            nombre: res[0].nombre || userData.nombre,
            correo: res[0].correo || userData.correo,
            correob: res[0].correob || userData.correob,
            telefono: res[0].telefono || userData.telefono,
            wallet: res[0].wallet || userData.wallet
          }
          setUserData({ ...obj })
        }
      }
      return res
    } catch (error) {
      console.log(error)
    }
  }

  function validarSiLosDatosRequeridosSonRellenados() {
    const regExpCorrero = /^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i
    const regExpName = /\s+/g

    setIsErrorForm({
      ...isErrorForm,
      correoEF: (!regExpCorrero.test(userData.correo) || userData.correo.length === 0),
      nombreEF: userData.nombre.replace(regExpName, '').length === 0
    })

    if (userData.nombre.length === 0) throw new Error('the name field cannot be empty')
    if (!regExpCorrero.test(userData.correo) || userData.correo.length === 0) throw new Error('the email must be a valid email')

    return { ...userData, id: id }

  }

  async function handlesDatosUser() {
    try {
      const ObjetoUser = validarSiLosDatosRequeridosSonRellenados()
      const res = await submitDatosUser(ObjetoUser)
      if (res.menssage === "actualizado") {
        setIsActiveModalRegister(false)     
      }
      // setUserData({ nombre: "", correo: "", correob: "", telefono: "", wallet: "" })
      console.log(ObjetoUser.nombre)
      setName(ObjetoUser.nombre)
      localStorage.setItem('name', ObjetoUser.nombre);
      console.log(res)
    } catch (error) {
      console.log(error)
      setMessageError({
        nombre: 'the name field cannot be empty',
        correo: 'You must enter a valid email'
      })
    }
  }

  async function submitDatosUser(ObjetoUser) {

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    let url = `${URL}/registrardatos`
    let myInit = {
      method: 'POST',
      body: JSON.stringify(ObjetoUser),
      headers: myHeaders
    }

    let resPost = await fetch(url, myInit,)
    if (!resPost.ok) {
      console.log({ resPost })
      throw Error("HTTP status " + resPost.status)

    }
    let post = await resPost.json()
    // console.log({status:`generando objecto User`,...post})
    return post
  }

  const hanledChange = (e) => {
    const { name, value } = e.target

    setUserData({
      ...userData, [name]: (name === 'telefono' ? '+' + value.replace(/[^\+{1}(\d{1,3})|(\s)(\d+)$]/g, '')
        .replace(/\+/g, '')
        .replace(/\,/g, '')
        : value)
    })
    // console.log(userData)
  }


  return (
    <>
      <div className='FatherboxRegisterBefore'>
        <div className="boxRegister">
        <div className= 'regiterCloser' onClick={()=>setIsActiveModalRegister(false)}>
          <Closer className=''/>
          </div>
          <div className="inputRegister">
            <label className="form-label me-2">
              <FormattedMessage 
              id="registerUser.name" 
              defaultMessage="Name*"
              />
            </label>
            <small className={isErrorForm.nombreEF ? "text-danger" : 'd-none'}>{messageError?.nombre}</small>
            <input type="text" className={isErrorForm.nombreEF ? ' form-control border border-danger' : 'form-control'}
              onChange={hanledChange}
              value={userData?.nombre}
              name={'nombre'}
              required
            />
          </div>

          <div className="inputRegister">
            <label className="form-label me-2">
            <FormattedMessage 
              id="registerUser.email" 
              defaultMessage="Email*"
            />
            </label>
            <small className={isErrorForm.correoEF ? "text-danger" : 'd-none'}>{messageError?.correo}</small>
            <input type="email" className={isErrorForm.correoEF ? 'form-control border border-danger' : 'form-control'}
              onChange={hanledChange}
              value={userData?.correo}
              name={'correo'}
              required
            />
          </div>

          <div className="inputRegister">
            <label className="form-label">
            <FormattedMessage 
              id="registerUser.alternateEmail" 
              defaultMessage="Alternate Email*"
              />
            </label>
            <input type="email" className="form-control"
              onChange={hanledChange}
              value={userData?.correob}
              name={'correob'}
            />
          </div>

          <div className="inputRegister">
            <label className="form-label">
              <FormattedMessage 
                id="registerUser.phone" 
                defaultMessage="Phone"
              />
            </label>
            <input type="text" className="form-control"
              onChange={hanledChange}
              value={userData?.telefono}
              name={'telefono'}
            />
          </div>

          <div className="inputRegister">
            <label className="form-label">
              <FormattedMessage 
              id="registerUser.wallet" 
              defaultMessage="Wallet"
              />
            </label>
            <input type="text" className="form-control"
              readOnly
              onChange={hanledChange}
              value={userData?.wallet}
              name={'wallet'}
            />
          </div>

          <button onClick={handlesDatosUser} className="btn btn-primary w-100 mb-2">
            <FormattedMessage 
              id="registerUser.btn-send" 
              defaultMessage="Send"
            />
          </button>
        </div>
      </div>
    </>
  );
}

export default RegisterUser;