const setSelectedCapaId = (selectedCapaId) => {
  localStorage.setItem('selectedCapaId', selectedCapaId)
  return selectedCapaId
}

export default setSelectedCapaId
