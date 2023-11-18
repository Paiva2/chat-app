import { Express } from "express"
import { TypeOrm } from "./data-source"
import http from "node:http"
import express from "express"
import WebSocketConnection from "./websocket"
import userRoutes from "./api/routes/userRoutes"
import cors from "cors"
import Redis from "ioredis"
import "dotenv/config"

export const app: Express = express()

app.use(express.json())
app.use(cors())

const webSocketServer = http.createServer()
const port = process.env.WS_PORT as string

const ws = new WebSocketConnection(webSocketServer, port)

userRoutes(app)

export const redisConn = new Redis()

ws.init()

TypeOrm.initialize()
  .then(() => {
    console.log("TypeORM: Data Source has been initialized!")
  })
  .catch((err) => {
    console.error("TypeORM: Error during Data Source initialization", err)
  })
