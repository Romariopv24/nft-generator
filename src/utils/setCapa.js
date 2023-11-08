const setCapa = (newCapa) => {

  let capas = []

  let localCapas = localStorage.getItem('capas')
  if (localCapas) {
    capas = [...JSON.parse(localCapas), newCapa]
  } else {
    capas.push(newCapa)
  }
  localStorage.setItem('capas', JSON.stringify(capas))

  return newCapa
}

export default setCapa
