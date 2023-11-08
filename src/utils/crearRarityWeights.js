import getCapas from "./getCapas"

export async function crearRarityWeights() {  
    let capasConImages = getCapas().filter(e=> e.images.length !== 0)
    let capasSinImages = getCapas().filter(e=> e.images.length === 0)
    
    let newCapa = capasConImages.map(e => {
      const sumaPorcentajes = e.images.map(image => Math.trunc(image.porcentaje)).reduce((total, value )=> {return total + value})
      const rariryWeidhts = JSON.parse(JSON.stringify(e.images.map(image => Math.trunc(image.porcentaje))))
    //  console.log({sumaPorcentajes,rariryWeidhts})
      let obj = {
        ...e,
        'rarity_weights': e.images.map(image => Math.trunc(image.porcentaje)),
        sumaTotal: sumaPorcentajes ,
        restante : 100 - sumaPorcentajes,
        valorMasBajo: e.images.map(image => Math.trunc(image.porcentaje)).sort((a, b) => {return a - b})[0],
      }

      const numeroElements = rariryWeidhts.length
      const valorX = Math.trunc(100 / numeroElements)
      let isSame = rariryWeidhts.every(e=> e === valorX)

      let objAux = {
        ...e,
        indixe : obj['rarity_weights'].findIndex(value => value === obj.valorMasBajo) 
      }

      obj['rarity_weights'].splice(objAux.indixe, 1, obj.restante + obj.valorMasBajo)

      return {
        ...e,
        'rarity_weights': isSame === false ? (e.required === true ? obj['rarity_weights'] :  [100,... obj['rarity_weights']]) : null
      }
      
    })
    const array = [...newCapa,...capasSinImages]
    localStorage.setItem('capas',JSON.stringify(array)) 
    return newCapa
}