import dotenv from 'dotenv'
dotenv.config()
import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import morgan from 'morgan'
import routes from './routes/index'
import { createServer } from 'http'
import { Server, Socket } from 'socket.io'


// Middleware
const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cors({
  origin: `${process.env.BASE_URL}`,
  credentials: true
}))
app.use(morgan('dev'))
app.use(cookieParser())

// Socket.io
const http = createServer(app)
export const io = new Server(http, {
  cors: {
    origin: `${process.env.BASE_URL}`,
    credentials: true
  }
})
import { SocketServer } from './config/socket'

io.on("connection", (socket: Socket) => {
  SocketServer(socket)
})

// Routes
app.use('/api', routes)
app.get('/', (req, res) => {
  res.json({
    msg: 'Welcome Dev A.T Viet Nam',
    'blogs-api': 'https://blog-dev-api.herokuapp.com/api/home/blogs'
  })
})

// Database
import './config/database'

// server listenning
const PORT = process.env.PORT || 5000
http.listen(PORT, () => {
  console.log('Server is running on port', PORT)
})