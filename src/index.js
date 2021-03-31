const express = require('express')
const app = express()
const PORT = 4000
const http = require('http').Server(app)
const db = require('./db')
const middleware = require('./middleware')
const route = require('./apis/routes')
const errHandle = require('./middleware/errHandle')
const io = require('socket.io')(http, {
    cors: {
        origin: 'http://localhost:4001',
    }
})
//init route
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", '*');
    res.header("Access-Control-Allow-Credentials", true);
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header("Access-Control-Allow-Headers", 'Origin,X-Requested-With,Content-Type,Accept,content-type,application/json');
    next();
});
middleware(app)
route(app)
app.use(errHandle)
db.connect()

app.get('/', (req, res) => {
    res.send('manh')
})

io.on('connection', (socket) => {
    console.log('hello')
    socket.on('chat message', data => {
        socket.emit('rep', 'hello client')
    })
})

http.listen(process.env.PORT || PORT, () => {
    console.log(`this app is listen to ${process.env.PORT} port!`)
})