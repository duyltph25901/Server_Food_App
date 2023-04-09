import express from 'express'
import { configViewEngine } from './configs/index'
import { initWebRoutes } from './routes/index'

const hostName = '127.0.0.1'
const port = 3000
const app = express()

app.use(express.urlencoded({ extends: true }))
app.use(express.json())

configViewEngine(app)
initWebRoutes(app)

app.listen(port, () => {
    console.log(`Your app is running at http://${hostName}:${port}/`);
})