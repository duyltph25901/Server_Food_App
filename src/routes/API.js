import express from 'express'
import api from '../controllers/API'

const route = express.Router()

const initAPIRoute = (app) => {
    route.get('/get-all-user', api.getAllUser)

    route.post('/handle-sign-up-user', api.handleSignUpUser)

    return app.use('/api/v1', route)
}

export default initAPIRoute