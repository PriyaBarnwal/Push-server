let subs = document.getElementById('subscribe'),
  unsubs = document.getElementById('unsubscribe'),
  swReg

setSubscribeStatus = (val) =>{
  if (val) {
    document.getElementById('subscribe').className = 'hidden'
    document.getElementById('unsubscribe').className = ''
  } else {
    document.getElementById('subscribe').className = ''
    document.getElementById('unsubscribe').className = 'hidden'
  }
}

let getServerKey =()=> {
  return fetch('http://localhost:3000/key')
    .then((res)=> {
      return res.arrayBuffer()
    })
    .then(key => new Uint8Array(key))
    .catch(console.error)
}

let unsubscribe = () => {
  swReg.pushManager.getSubscription()
    .then(subscription => 
      subscription.unsubscribe()
      .then(setSubscribeStatus(false))
    )
}

let subscribe = () => {
  if(!swReg) console.log('serwice worker registration not found!')

  getServerKey().then(key=> {
    swReg.pushManager.subscribe({userVisibleOnly: true, applicationServerKey: key})
      .then(res => res.toJSON())
      .then(subscription => {

        fetch('http://localhost:3000/subscribe', {method: 'POST', body: JSON.stringify(subscription)})
          .then(setSubscribeStatus(true))
          .catch(unsubscribe)
      })
  })
  .catch(console.error)
}

subs.addEventListener('click', subscribe)
unsubs.addEventListener('click', unsubscribe)

if(navigator.serviceWorker) {
  navigator.serviceWorker.register('sw.js')
    .then(registration => {
      swReg = registration
      swReg.pushManager.getSubscription().then((res)=> setSubscribeStatus(res))
    })
    .catch(console.error)
}

// fetch('http://localhost:3000/push', {method: 'POST'}).then(async(response) => {
//   let a = await response.text()
//   console.log(a)
// }).catch(console.error)