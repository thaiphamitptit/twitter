import express from 'express'
import { config } from 'dotenv'
import usersRouter from './routes/users.routes'
import mediasRouter from './routes/medias.routes'
import staticRouter from './routes/static.routes'
import { defaultErrorHandler } from './middlewares/errors.middlewares'
import databaseService from './services/database.services'
import { initFolder } from './utils/file'
config()

// connect database
databaseService.connect()

const app = express()
const port = process.env.PORT || 4000

// create folder uploads
initFolder()

app.use(express.json())
app.use('/users', usersRouter)
app.use('/medias', mediasRouter)
app.use('/static', staticRouter)
app.use(defaultErrorHandler)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
