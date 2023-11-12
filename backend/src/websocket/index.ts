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
  private connectedUsers: { id: string; connection: CustomWebSocket }[] = []

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

      ws.id = randomUserId

      this.newUserConnection(ws.id, ws)

      ws.on("message", (data) => {
        const { action, data: clientData } = JSON.parse(String(data))

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
        //console.log("User has disconnected: " + ws.id)

        this.globalChatCloseConnection(ws.id)

        ws.close()
      })

      ws.on("error", console.error)
    })

    this.server.listen(this.port, () => {
      console.log("Websocket running at: " + this.port)
    })
  }

  private globalChatMessage(clientData: WebSocket, randomUserId: string) {
    this.wsServer.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        const parsedMessage = String(clientData)

        client.send(
          JSON.stringify({
            action: "global-message",
            data: `${randomUserId}: ${parsedMessage}`,
          })
        )
      }
    })
  }

  private newUserConnection(userId: string, newConnection: CustomWebSocket) {
    this.connectedUsers.push({ id: userId, connection: newConnection })

    this.getConnectedUsers()

    this.wsServer.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(
          JSON.stringify({
            action: "global-message",
            data: `User has connected: ${userId}`,
          })
        )
      }
    })
  }

  private globalChatCloseConnection(disconnectedId: string) {
    this.connectedUsers = this.connectedUsers.filter(
      (user) => user.id !== disconnectedId
    )

    this.wsServer.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(
          JSON.stringify({
            action: "global-message",
            data: `User has disconnected: ${disconnectedId}`,
          })
        )

        this.getConnectedUsers()
      }
    })
  }

  private getConnectedUsers() {
    this.wsServer.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(
          JSON.stringify({
            action: "get-connected-users",
            data: this.connectedUsers.map((user) => user.id),
          })
        )
      }
    })
  }
}
