import { URL } from "../constantes"

const eliminarArchivoSv = async () => {
  console.log("fue eliminado")
  var myHeaders = new Headers()
  myHeaders.append(
    "Authorization",
    `Bearer ${localStorage.getItem("access_token")}`
  )
  myHeaders.append("Content-Type", "application/json")

  let correo = localStorage.getItem("correo")
  correo = btoa(correo)
  let url = `${URL}/delete/${correo}`
  let myInit = {
    method: "GET",
    // headers: {'Content-Type': 'application/json'}
    headers: myHeaders
  }

  let resPost = await fetch(url, myInit)
  let post = await resPost.json()
  if (!resPost.ok) throw Error("HTTP status " + resPost.status)
  console.log(post)

  return post
}

export default eliminarArchivoSv
