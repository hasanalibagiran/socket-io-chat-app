const express = require('express')
const mongoose = require('mongoose')
const ejs = require('ejs')
const socket = require('socket.io')
const { urlencoded } = require('express');
const flash = require("connect-flash")
const session = require("express-session")
const MongoStore = require("connect-mongo")
const methodOverride = require("method-override")
const Message = require('./models/Messages')
const User = require('./models/User')
const pageRoute = require('./routes/pageRoute')
const userRoute = require('./routes/userRoute')



const app = express()
app.set("view engine", "ejs")

//DB Connection
mongoose.connect("mongodb://localhost/chat-db", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(()=>{
    console.log('DB Connected Successfully.')
})

//Global Variable
global.userIN = null
global.users = {}

//Middlewares
app.use(express.static("public"));
app.use(urlencoded({ extended: true }));
app.use(express.json());
app.use(session({
    secret: "my_keyboard_cat",
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({mongoUrl: "mongodb://localhost/chat-db"})
}))
app.use(flash())
app.use((req,res,next)=>{
    res.locals.flashMessages = req.flash()
    next()
})
app.use(methodOverride('_method', {
    methods: ['POST', 'GET']
}))


//ROUTES
app.use('*', (req,res,next)=>{
    userIN = req.session.userID
    next()
})
app.use("/", pageRoute)
app.use("/user", userRoute)



const server = app.listen(3000, ()=>{
    console.log('server listening on port 3000')
})
const io = socket(server)
io.on('connection', (socket)=>{
    socket.handshake.auth = userIN
    users[socket.handshake.auth] = socket
    
    socket.on('message', async(data) => {
        await Message.create({
            message: data.msg,
            sender: socket.handshake.auth,
            receiver: data.user  
        })
        const msg=data.msg
        if(Object.keys(users).includes(data.user)){
            users[data.user].emit('remessage', {message: msg, sender: socket.handshake.auth})
        }  
    })  

    socket.on('disconnect', ()=>{
        delete users[socket.handshake.auth]
    })
           

   
})
    




