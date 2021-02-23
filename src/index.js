const path = require("path")
const http = require("http")
const express = require("express")
const socketio = require("socket.io")
const badWords = require("bad-words")
const { generateMessage } = require("./utils/message")
const { addUser, removeUser, findUser, findUserInRoom } = require("./utils/users")

const app = express()
const server = http.createServer(app)
const io = socketio(server)

const port = process.env.PORT || 5000

const publicDirectoryPath = path.join(__dirname, "../public")

app.use(express.static(publicDirectoryPath))

io.on("connect", (socket) => {

    socket.on("join", (option, callback) => {

        console.log("new User added");
        const { error, user } = addUser({ id: socket.id, ...option })
        if (error) {
            return callback(error)
        }

        socket.join(user.room);

        socket.emit("Welcome", generateMessage("Admin", "Welcome!"))

        socket.broadcast.to(user.room).emit("Welcome", generateMessage("Admin", user.username + " joined"))
        io.to(user.room).emit("roomData", {
            room: user.room,
            users: findUserInRoom(user.room)
        })
        callback()
    })

    socket.on("message", (clientMessage, callback) => {
        const user = findUser(socket.id)

        const filter = new badWords()
        if (filter.isProfane(clientMessage)) {
            return callback("Bad Words is not allowed")
        }
        io.to(user.room).emit("serverMessage", generateMessage(user.username, clientMessage))
        callback()
    })
    socket.on("location", ({ latitude, longitude }, callback) => {
        const user = findUser(socket.id)
        socket.broadcast.emit("serverMessage", generateMessage(user.username, `lat:${latitude} and lng:${longitude}`))
        callback();
    })

    socket.on("disconnect", () => {
        const user = removeUser(socket.id);
        if (user) {
            io.to(user.room).emit("Welcome", generateMessage("Admin", user.username + " has just left"))
            io.to(user.room).emit("roomData", {
                room: user.room,
                users: findUserInRoom(user.room)
            })
        }

    })
})

server.listen(port, () => {
    console.log("Server running on : " + port);
})