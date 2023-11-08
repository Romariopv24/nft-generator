import getCapas from "./getCapas";

const getDatosImg = () => {

  // BUSCANDO LA CANTIDAD DE CONVINACIONES DE IMAGENES EXISTENTE
  let imagenCantidad = getCapas().map(e=>e.images.length)
  const initialValue = 0;
  const cantidadDeCombinaciones = 0
  if(getCapas.length !== 0) {
    cantidadDeCombinaciones = imagenCantidad.reduce(
      (previousValue, currentValue) => currentValue > 0 ? previousValue * currentValue : currentValue, initialValue
    );
  }


  // BUSCANDO LAS DIMENSIONES DE LAS IMAGENES
  const imagenes = getCapas().map(e=>e.images).flat()
  const imagenDimensiones = imagenes.map(e=> e.dimension)
  const isAllDimensionsAreSame = imagenes.every(e=>e.dimension.width === imagenDimensiones[0].width )
  const getImgWithDimesionDifferent = imagenes.filter(e=>e.dimension.width !== imagenDimensiones[0].width )

  const newCapasImageDiferent = getCapas().map(capa=>{ 
    return ({
      ...capa,
      images: capa.images.map(image => ({
        ...image,
        isDiferent: image.dimension.width !== imagenDimensiones[0].width || image.dimension.height !== imagenDimensiones[0].height
      }))
    })
  })

  localStorage.setItem('capas',JSON.stringify(newCapasImageDiferent))
  return {
    numeroDeCombinaciones : cantidadDeCombinaciones, 
    imagenDimension : imagenDimensiones,
    isAllDimensionsAreSame : isAllDimensionsAreSame,
    getImgWithDimesionDifferent : getImgWithDimesionDifferent,
    newCapasImageDiferent : newCapasImageDiferent,
  }
}

export default getDatosImg