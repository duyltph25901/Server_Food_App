import {
    getLoginScreen,
    getSignUpScreen,
    getHomeScreen,
    getCategoryScreen,
    getCategoriesParent,
    getCategoriesChild,
    handleSignUp,
    handleLogin,
    handleLogOut,
    handleAddCategoryParent,
    handleAddCategoryChild,
    getProductScreen,
    handleAddProduct
} from '../controllers/web'
import { requireLoggedIn, upload } from '../functions/middleware'
import express from 'express'
import cookieParser from 'cookie-parser'

let route = express.Router()

const initWebRoutes = (app) => {
    app.get('/login', getLoginScreen)
    app.get('/sign-up', getSignUpScreen)
    app.get('/', cookieParser(), requireLoggedIn, getHomeScreen)
    app.get('/category', getCategoryScreen)
    app.get('/categories-parent', getCategoriesParent)
    app.get('/categories-child', getCategoriesChild)
    app.get('/product', getProductScreen)

    app.post('/handle-sign-up', handleSignUp)
    app.post('/handle-login', cookieParser(), handleLogin)
    app.post('/handle-log-out', cookieParser(), handleLogOut)
    app.post('/handle-add-category-parent', handleAddCategoryParent)
    app.post('/handle-add-category-child', handleAddCategoryChild)
    app.post('/handle-add-product', upload.single('image'), handleAddProduct)

    return app.use('/login', route)
}

export default initWebRoutes