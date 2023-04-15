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
    handleAddProduct,
    getDetailsProductScreen,
    getUpdateProductScreen,
    handleUpdateProduct,
    handleSearchProductByName
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
    app.get('/details-product/:id', getDetailsProductScreen)
    app.get('/update-foods/:id', getUpdateProductScreen)

    app.post('/handle-sign-up', handleSignUp)
    app.post('/handle-login', cookieParser(), handleLogin)
    app.post('/handle-log-out', cookieParser(), handleLogOut)
    app.post('/handle-add-category-parent', handleAddCategoryParent)
    app.post('/handle-add-category-child', handleAddCategoryChild)
    app.post('/handle-add-product', upload.single('image'), handleAddProduct)
    app.post('/handle-update-product', upload.single('image'), handleUpdateProduct)
    app.post('/search-products-by-name', handleSearchProductByName)

    return app.use('/login', route)
}

export default initWebRoutes