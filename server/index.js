const http = require('http')
const push = require('./push')

http.createServer((request, response)=>{
  response.setHeader('Access-Control-Allow-origin', '*')

  let {url, method} = request

  if(method === 'POST' && url.match(/^\/subscribe\/?/)) {
    let body = []

    request.on('data', chunk=>body.push(chunk)).on('end',() => {

      push.addSubscription(JSON.parse(body.toString()))
      response.end('subscribed')
    })
  }
  else if(url.match(/^\/key\/?/)) {
    response.end(push.get())
  }
  else if(method === 'POST' && url.match(/^\/push\/?/)) {
    let body = []

    request.on('data', chunk=>body.push(chunk)).on('end', () => {
      push.sendNotification(body.toString())
      response.end('push notif sent')
    })
  }
  else {
    response.status = 404
    response.end('not a valid request!')
  }
}).listen(3000, ()=> console.log('server is listening!'))