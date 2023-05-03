import express from 'express'
import api from '../controllers/API'

const route = express.Router()

const initAPIRoute = (app) => {
    route.get('/get-all-user', api.getAllUser)
    route.get('/get-all-product', api.getHomeProduct)
    route.get('/get-all-rice', api.getAllRice)
    route.get('/find-user-by-id/:id', api.findUserById)

    route.post('/handle-sign-up-user', api.handleSignUpUser)
    route.post('/handle-login-user', api.handleLoginUser)
    route.post('/handle-search-product-by-name', api.handleSearchFoodByName)
    route.post('/handle-update-phone-number-user', api.handleUpdatePhoneNumber)
    route.post('/handle-update-email-user', api.handleUpdateEmail)
    route.post('/handle-update-password-user', api.handleUpdatePassword)
    route.post('/handle-update-user-info', api.handleUpdateUserInfo)

    return app.use('/api/v1', route)
}

export default initAPIRoute