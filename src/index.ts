import express from 'express'
import usersRouter from './routes/users.routes'
import { defaultErrorHandler } from './middlewares/errors.middlewares'
import databaseService from './services/database.services'

// connect database
databaseService.connect()

const app = express()
const port = 4000

app.use(express.json())
app.use('/users', usersRouter)
app.use(defaultErrorHandler)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
