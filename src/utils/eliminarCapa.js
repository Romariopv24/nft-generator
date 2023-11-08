import getSelectedCapaId from './getSelectedCapaId'


const eliminarCapa = () => {
  let id =  getSelectedCapaId()
  let capas = JSON.parse(localStorage.getItem('capas'))
  let capaId = capas.filter(e=>e.id !==id)
  // console.log(capaId)

  if(id != 1){
    // console.log("si")
    localStorage.setItem('capas',JSON.stringify(capaId))
    localStorage.setItem('selectedCapaId',1)
    
  }else{
    // console.log('no')
  }

};

export default eliminarCapa;

