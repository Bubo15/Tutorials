const homeRouter = require('./routers/home')
const authRouter = require('./routers/auth')
const courseRouter = require('./routers/course')

const { getUserStatus } = require('./controllers/auth')

module.exports = (app) => {
    app.use('/', homeRouter)
    app.use('/', authRouter)
    app.use('/', courseRouter)

    app.get('*', getUserStatus, (req, res) => {
        res.render('404', {
            title: 'Error',
            isLogged: req.isLogged,
            username: req.session.username
        })
    })
} 

