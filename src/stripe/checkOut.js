import { v4 as uuidv4 } from 'uuid';
import * as Const from '../constantes'
const URL = 'https://api.stripe.com'

const bcrypt = require('bcryptjs');
const publicKey = Const.PUBLICKEY
const urlLocal = 'http://localhost:3000/'
//const urlServer = 'https://app.nftcreator.market'
//const urlServer = 'http://localhost:3000'
const urlServer = 'https://nftgen.devtop.online'
let unicoID = uuidv4()

async function comprar(id, name, qtty) {
  let unicaURL = `${unicoID}&&${name}&&${qtty}`
  console.log([{unicoID},{name},{qtty}])

   await window.Stripe(publicKey).redirectToCheckout({
    lineItems: [{
      price: id,
      quantity: 1,
    }],
    mode: 'payment',
    successUrl: `${urlServer}/pay/${unicaURL}`,
    cancelUrl: urlServer,
  })
}

export default async function executeBuy({precio, nombre, tamano}) {
  try {
    bcrypt.genSalt(10, function (err, salt) {
      if (err) console.log(err)
      bcrypt.hash(unicoID, salt, function (err, idHash) {
        bcrypt.hash(nombre, salt, function (err, nameHash) {
          bcrypt.hash(tamano, salt, function (err, qttyHash) {
            if (qttyHash && nameHash && idHash) {
              localStorage.setItem('pay', JSON.stringify({ idHash, name: nameHash, qtty: qttyHash }))
              setTimeout(()=>comprar(precio, nombre, tamano),1000)
            }
            if (err) console.log(err)
          });
        });
      });
    });

  } catch (error) {
    console.log(error)
  }
}

// bcrypt.hash(unicoID, salt, function (err, hash) {
//   if (hash) {
//     localStorage.setItem('pay', hash)
//     console.log(hash)
//   }
//   if (err) console.log(err)
// });






