import getCapas from "./getCapas"

const getSelectedCapaId = () => {
  let selectedCapaId = []

  let localSelectedCapaId = localStorage.getItem('selectedCapaId')
  if (localSelectedCapaId) {
    selectedCapaId = localSelectedCapaId
  } else {
    selectedCapaId = getCapas()[0].id
    localStorage.setItem('selectedCapaId', selectedCapaId)

  }
  // console.log({selectedCapaId, type: typeof selectedCapaId});
  return selectedCapaId
}

export default getSelectedCapaId
