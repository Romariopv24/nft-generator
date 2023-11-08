import React from "react"

const GenericModal = ({children, show, ...rest}) =>{
    return <div className={show ? "cont-wrapper " : "d-none"} >
    <div className={show ? "inline-block container-pedir-correo" : "d-none"} style={{ border: "1px solid #00B8FF", padding: "10px", ...rest }}>
      {children}
    </div>
  </div>
}

export default GenericModal