
import getCapas from './getCapas'
const Pi = 100

//esto pone el porcentaje que es 100 etre el numero de elementos
// export const generarPorcentaje = (indexImage) => {
//   const imagenes = getCapas().map((e)=>{
//     const Ne = e.images.length
//     const Pei = Pi / Ne
//     return({
//       ...e,
//       images: e.images.map(e=>({...e,porcentaje: Pei}))
//     })
//   })
//   localStorage.setItem("capas",JSON.stringify(imagenes))
//   console.log(imagenes)
//   return imagenes
// }

export const generarPorcentaje = (indexCapa) => {
  const capa = getCapas()[indexCapa]

  const Ne = capa.images.length
  const Pei = Pi / Ne

  const totalPorcentajeBarra = capa.images.reduce((previousValue, currentValue) => {
    return previousValue + (currentValue.porcentajeBarra || 50)
  },0)

  capa.images = capa.images.map(imagen=>{

    const porcentaje = ((imagen.porcentajeBarra || 50 )* 100) / totalPorcentajeBarra
    return {
      ...imagen,
      porcentaje: porcentaje,
      porcentajeBarra: imagen.porcentajeBarra || 50,
    }
  })
  
  let capas = getCapas()
  capas[indexCapa] = capa
  localStorage.setItem("capas",JSON.stringify(capas))
  // console.log(capa)
  return capas
}

