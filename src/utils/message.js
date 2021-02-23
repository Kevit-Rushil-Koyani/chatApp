const generateMessage = (user, message) => {
    return {
        username: user,
        text: message,
        createdAt: new Date().getTime()
    }
}

module.exports = {
    generateMessage
}