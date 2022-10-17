require('dotenv').config()
require('express-async-errors')
const { StatusCodes } = require('http-status-codes')
const express = require('express')
const app = express()

// connectDB && middlewares
const connectDB = require('./db/connect')
const authenticationUser = require('./middleware/authentication')

//routers
const authRouter = require('./routes/auth')

// error handler
const notFoundMiddleware = require('./middleware/not-found')
const errorHandlerMiddleware = require('./middleware/error-handler')

app.use(express.json())
// extra packages

// extra security packages
const helmet = require('helmet')
const cors = require('cors')
const xss = require('xss-clean')
const rateLimiter = require('express-rate-limit')


app.set('trust proxy', 1)
app.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
  })
)
app.use(express.json())
app.use(helmet())
app.use(cors())
app.use(xss())


// routes
app.use('/api/v1/auth', authRouter)
app.get('/', (req, res) => {
  res.send('<h1>API Running</h1><p>Use /api/v1/auth </p>')
})

app.use(notFoundMiddleware)
app.use(errorHandlerMiddleware)

const port = process.env.PORT || 3000

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URL)
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error)
  }
}


start()
