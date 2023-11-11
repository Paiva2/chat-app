import { Router, Express } from "express"
import express from "express"
import "dotenv/config"
import http from "node:http"
import WebSocketConnection from "./websocket"
export const app: Express = express()

app.use(express.json())

const route = Router()

const webSocketServer = http.createServer()
const port = process.env.WS_PORT as string

const ws = new WebSocketConnection(webSocketServer, port)

ws.init()

app.use(route)
