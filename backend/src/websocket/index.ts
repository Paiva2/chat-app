import http from "http"
import { faker } from "@faker-js/faker"
import { WebSocketServer, WebSocket } from "ws"

export default class WebSocketConnection {
  private server
  private wsServer
  private port

  constructor(
    server: http.Server<typeof http.IncomingMessage, typeof http.ServerResponse>,
    port: string
  ) {
    this.server = server
    this.wsServer = new WebSocketServer({ server })
    this.port = port
  }

  public init() {
    this.wsServer.on("connection", (ws) => {
      const randomUserId = faker.internet.userName()

      ws.on("error", console.error)

      ws.on("message", (data) => {
        this.wsServer.emit("global-message", data, randomUserId)
      })
    })

    this.wsServer.on("global-message", (data, randomUserId) => {
      this.wsServer.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          const parsedMessage = String(data)

          this.sendMessage(client, randomUserId, parsedMessage)
        }
      })
    })

    this.wsServer.on("close", () => {
      console.log("disconnected")
    })

    this.server.listen(this.port, () => {
      console.log("Websocket running at: " + this.port)
    })
  }

  private sendMessage(client: WebSocket, userId: string, message: String) {
    client.send(`${userId}: ${message}`)
  }
}
