const loginCheck = (username, password) => {
    if (username === 'zs' && password === '123') {
        return true
    }
    return false
}

module.exports = {
    loginCheck
}