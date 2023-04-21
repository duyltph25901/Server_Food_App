import express from 'express'
import api from '../controllers/API'

const route = express.Router()

const initAPIRoute = (app) => {
    route.get('/get-all-user', api.getAllUser)
    route.get('/get-all-product', api.getHomeProduct)

    route.post('/handle-sign-up-user', api.handleSignUpUser)
    route.post('/handle-login-user', api.handleLoginUser)
    route.post('/handle-search-product-by-name', api.handleSearchFoodByName)

    return app.use('/api/v1', route)
}

export default initAPIRoute