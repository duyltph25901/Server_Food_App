import {
    getLoginScreen,
    getSignUpScreen,
    getHomePage
} from '../controllers/web'
import express from 'express'

let route = express.Router()

const initWebRoutes = (app) => {
    app.get('/login', getLoginScreen)
    app.get('/sign-up', getSignUpScreen)
    app.get('/', getHomePage)

    return app.use('/login', route)
}

export default initWebRoutes