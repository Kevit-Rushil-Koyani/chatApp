const users = []

const addUser = ({ id, username, roomname }) => {
    username = username.trim().toLowerCase()
    room = roomname.trim().toLowerCase()

    if (!username || !room) {
        return {
            error: "username and room are required"
        }
    }

    const exitingUsername = users.find((user) => {
        return user.room == room && user.username === username
    })

    if (exitingUsername) {
        return {
            error: "User name already use!"
        }
    }
    const user = { id, username, room }
    users.push(user)
    return { user }

}

const removeUser = (id) => {
    const index = users.findIndex((user) => user.id === id)

    if (index !== -1) {
        return users.splice(index, 1)[0]
    }
}

const findUser = (id) => {
    return users.find((user) => user.id == id);

}

const findUserInRoom = (room) => {
    room = room.trim().toLowerCase()
    return users.filter((user) => user.room == room)
}


module.exports = {
    addUser,
    removeUser,
    findUser,
    findUserInRoom
}