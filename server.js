const fs = require('fs')
const http = require('http')
const fetch = require('node-fetch')
const ws = require('ws')    // another library for two-way communication (web socket)

const readFile = file => new Promise(resolve =>
    fs.readFile(file, 'utf-8', (err, data) => resolve(data)))


const server = http.createServer(async (req, resp) => {
    if (req.url === '/') {
        console.log('client connected')
        resp.end(await readFile('test.html'))
    } else if (req.url === '/client.js') {
        resp.end(await readFile('client.js'))
    } else if (req.url === '/vue.js') {
        resp.end(await readFile('vue.js'))
    } else {
        resp.end()
    }
})
var players = new Array()
let i = 0 
let first 
new ws.Server({ server }).on('connection', client => {      // if web socket request, then it goes here
    if(!(players.length % 2))
    {
        console.log(i)
        players.push(client)
        console.log('first client connected')
        // turn[0]= true
        // first = client
    }    
    else
    {
        console.log(i)
        console.log('second client connected')
        players.push(client)
        let a = i
        players[a-1].send(JSON.stringify({'character1' : 'X', 'character2' : 'O','othercol' : -1,'waiting' : false, 'turn' : true}))
        players[a].send(JSON.stringify({'character1' : 'O', 'character2' : 'X','othercol' : -1,'waiting' : false, 'turn' : false}))
        players[a].on('message', async msg => {
            console.log("Message Recieved:",JSON.parse(msg))
            var temp = JSON.parse(msg)
            players[a-1].send(JSON.stringify({'character1' : 'X', 'character2' : 'O','othercol' : temp,'waiting' : false, 'turn' : true}))
            players[a].send(JSON.stringify({'character1' : 'O', 'character2' : 'X','othercol' : -1,'waiting' : false, 'turn' : false}))
        })
        players[a-1].on('message', async msg => {
            console.log("Message Recieved:",JSON.parse(msg))
            var temp = JSON.parse(msg)
            players[a].send(JSON.stringify({'character1' : 'O', 'character2' : 'X','othercol' : temp,'waiting' : false, 'turn' : true}))
            players[a-1].send(JSON.stringify({'character1' : 'X', 'character2' : 'O','othercol' : -1,'waiting' : false, 'turn' : false}))
        })
    }
    i++
    client.on('close', () => {
        console.log('a client disconnected')
    })
})
server.listen(5000)