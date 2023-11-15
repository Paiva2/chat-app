import { Express } from "express"
import express from "express"
import "dotenv/config"
import http from "node:http"
import WebSocketConnection from "./websocket"
import userRoutes from "./api/routes/user"

export const app: Express = express()

app.use(express.json())

const webSocketServer = http.createServer()
const port = process.env.WS_PORT as string

const ws = new WebSocketConnection(webSocketServer, port)

userRoutes(app)

ws.init()
