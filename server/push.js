const webpush = require('web-push')
const Storage = require('node-storage')
const urlsafebase64 = require('urlsafe-base64')

const vapidKeys = require('./vapid.json')

webpush.setVapidDetails(
  'mailto:example@yourdomain.org',
  vapidKeys.publicKey,
  vapidKeys.privateKey
)
const store = new Storage(`${__dirname}/store.js`)
let subscriptions = store.get('subscriptions') || []
console.log(subscriptions)

module.exports.get = () => urlsafebase64.decode(vapidKeys.publicKey)

module.exports.addSubscription =(subscription) => {
  subscriptions.push(subscription)
  store.put('subscriptions', subscriptions)
}

module.exports.sendNotification =(message) => {
  let promises = []
  subscriptions.forEach((subscription,i) => {
    let p = webpush.sendNotification(subscription, message)
        .catch(err => {
          if(err.statusCode === 410) 
            subscriptions[i]['delete'] = true

            return null
        })
    promises.push(p)
  })

  Promise.all(promises).then(()=>{
    subscriptions = subscriptions.filter((sub)=> !sub.delete)
    store.put('subscriptions', subscriptions)
  })
}