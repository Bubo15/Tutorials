const User = require('../models/user')

module.exports = userErrorHandler = async (req) => {
    const { username, password, rePassword } = req.body

    let errors = {}

    if (username.length < 5) {
        errors['username'] = 'Username must be least 5 characters'
    } else if(username.length >= 5 && !username.match('^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$')) {
        errors['username'] = 'Username should consist english letters and digits'
    }
    else {
        const user = await User.findOne({ username })
        if (user) {
            errors['username'] = 'Username already exist'
        }
    }

    if(password.length < 5){
        errors['password'] = 'Password must be least 5 characters'
    }

    if(JSON.stringify(password) !== JSON.stringify(rePassword)){
        errors['rePassword'] = 'Passwords do not match'
    }

    return errors
}