import http from "http"
import { faker } from "@faker-js/faker"
import { WebSocketServer, WebSocket } from "ws"

interface CustomWebSocket extends WebSocketServer {
  id: string
}

export default class WebSocketConnection {
  private server
  private wsServer
  private port
  private connectedUsers: string[] = []

  constructor(
    server: http.Server<typeof http.IncomingMessage, typeof http.ServerResponse>,
    port: string
  ) {
    this.server = server
    this.wsServer = new WebSocketServer({ server })
    this.port = port
  }

  public init() {
    this.wsServer.on("connection", (ws: CustomWebSocket) => {
      const randomUserId = faker.internet.userName()

      this.wsServer.emit("new-user-connection", randomUserId)

      ws.id = randomUserId

      this.getConnectedUsers()

      ws.on("message", (data) => {
        const { action, data: clientData } = JSON.parse(String(data))

        this.wsServer.emit("user-closed-connection", randomUserId)

        switch (action) {
          case "new-message": {
            this.globalChatMessage(clientData, randomUserId)

            break
          }

          case "get-connected-users": {
            this.getConnectedUsers()
          }

          default:
            null
        }
      })

      ws.on("close", () => {
        this.globalChatCloseConnection(randomUserId)
      })

      ws.on("error", console.error)

      console.log(ws.id)
    })

    this.wsServer.on("new-user-connection", (randomUserId) => {
      this.wsServer.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(
            JSON.stringify({
              action: "global-message",
              data: `User has connected: ${randomUserId}`,
            })
          )
        }
      })
    })

    this.server.listen(this.port, () => {
      console.log("Websocket running at: " + this.port)
    })
  }

  private globalChatMessage(clientData: WebSocket, randomUserId: string) {
    this.wsServer.emit("global-message", clientData, randomUserId)

    this.wsServer.on("global-message", (data, randomUserId) => {
      this.wsServer.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          const parsedMessage = String(data)

          client.send(
            JSON.stringify({
              action: "global-message",
              data: `${randomUserId}: ${parsedMessage}`,
            })
          )
        }
      })
    })
  }

  private globalChatCloseConnection(randomUserId: string) {
    this.wsServer.emit("user-closed-connection", randomUserId)

    this.wsServer.on("user-closed-connection", (randomUserId) => {
      this.wsServer.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          this.connectedUsers = this.connectedUsers.filter(
            (user) => user !== randomUserId
          )

          client.send(
            JSON.stringify({
              action: "global-message",
              data: `User has disconnected: ${randomUserId}`,
            })
          )

          this.getConnectedUsers()
        }
      })
    })
  }

  private getConnectedUsers() {
    this.wsServer.emit("get-connected-users")

    this.wsServer.on("get-connected-users", () => {
      this.wsServer.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(
            JSON.stringify({
              action: "get-connected-users",
              data: this.connectedUsers,
            })
          )
        }
      })
    })
  }
}
