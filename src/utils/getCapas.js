const getCapas = () => {
  let capas = []

  let localCapas = localStorage.getItem('capas')
  if (localCapas) {
    capas = JSON.parse(localCapas)
  } else {
    localStorage.setItem('capas', JSON.stringify([{
      id: "1",
      name: "Background",
      images: [],
      directory: 'Background',
      required: true,
      rarity_weights: null,
    }]))
    capas = JSON.parse(localStorage.getItem('capas'))
  }
  // console.log({capas, type: typeof capas});
  return capas
}

export default getCapas
