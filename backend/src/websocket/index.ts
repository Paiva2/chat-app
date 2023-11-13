import http from "http"
import { faker } from "@faker-js/faker"
import "url"
import { WebSocketServer, WebSocket } from "ws"
import { Request } from "express"
import { randomUUID } from "crypto"

interface CustomWebSocket extends WebSocketServer {
  id: string
}

export default class WebSocketConnection {
  private server
  private wsServer
  private port
  private connectedUsers: {
    id: string
    username: string
    connection: CustomWebSocket
  }[] = []

  constructor(
    server: http.Server<typeof http.IncomingMessage, typeof http.ServerResponse>,
    port: string
  ) {
    this.server = server
    this.wsServer = new WebSocketServer({ server })
    this.port = port
  }

  public init() {
    this.wsServer.on("connection", (ws: CustomWebSocket, request: Request) => {
      const randomUserId = randomUUID()
      const randomUserName = `User${faker.number.int({ max: 10000 })}`

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

          case "personal-user-id": {
            if (clientData === null) {
              ws.id = randomUserId
            } else {
              ws.id = clientData
            }

            this.wsServer.clients.forEach((client) => {
              if (client.readyState === WebSocket.OPEN) {
                if (client["id" as keyof typeof client] === ws.id) {
                  client.send(
                    JSON.stringify({
                      action: "my-personal-id",
                      data: {
                        id: ws.id,
                        username: randomUserName,
                      },
                    })
                  )
                }
              }
            })

            this.newUserConnection(ws.id, randomUserName, ws)
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
            data: {
              type: "message",
              userId: randomUserId,
              message: parsedMessage,
              time: new Date(),
            },
          })
        )
      }
    })
  }

  private newUserConnection(
    userId: string,
    randomUserName: string,
    newConnection: CustomWebSocket
  ) {
    this.connectedUsers.push({
      id: userId,
      username: randomUserName,
      connection: newConnection,
    })

    this.getConnectedUsers()

    this.wsServer.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(
          JSON.stringify({
            action: "global-message",
            data: {
              type: "new-connection",
              userId: userId,
              message: `User has connected: ${randomUserName}`,
              time: new Date().toISOString(),
            },
          })
        )
      }
    })
  }

  private globalChatCloseConnection(disconnectedId: string) {
    const getDc = this.connectedUsers.find((conn) => conn.id === disconnectedId)

    this.connectedUsers = this.connectedUsers.filter(
      (user) => user.id !== disconnectedId
    )

    this.wsServer.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(
          JSON.stringify({
            action: "global-message",
            data: {
              type: "new-connection",
              userId: disconnectedId,
              message: `User has disconnected: ${getDc?.username}`,
              time: new Date().toISOString(),
            },
          })
        )

        this.getConnectedUsers()
      }
    })
  }

  private getConnectedUsers() {
    const formatUsersList: { id: string; username: string }[] = []

    for (let user of this.connectedUsers) {
      formatUsersList.push({
        id: user.id,
        username: user.username,
      })
    }

    this.wsServer.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(
          JSON.stringify({
            action: "get-connected-users",
            data: formatUsersList,
          })
        )
      }
    })
  }
}
