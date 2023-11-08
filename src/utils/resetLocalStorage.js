const resetLocalStorage = () => {
  localStorage.setItem('capas', JSON.stringify([{
    id: "1",
    name: "Background",
    images: [],
    directory: 'Background',
    required: true,
    rarity_weights: null,
  }]))
  localStorage.setItem('selectedCapaId', JSON.parse(1))
  localStorage.setItem('correo', JSON.stringify('')) 
};

export default resetLocalStorage;
