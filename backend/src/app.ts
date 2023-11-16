import { Express } from "express"
import "dotenv/config"
import http from "node:http"
import express from "express"
import WebSocketConnection from "./websocket"
import { TypeOrm } from "./data-source"
import userRoutes from "./api/routes/userRoutes"

export const app: Express = express()

app.use(express.json())

const webSocketServer = http.createServer()
const port = process.env.WS_PORT as string

const ws = new WebSocketConnection(webSocketServer, port)

userRoutes(app)

ws.init()

TypeOrm.initialize()
  .then(() => {
    console.log("TypeORM: Data Source has been initialized!")
  })
  .catch((err) => {
    console.error("TypeORM: Error during Data Source initialization", err)
  })
