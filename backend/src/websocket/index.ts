import { faker } from "@faker-js/faker"
import { WebSocketServer, WebSocket } from "ws"
import { randomUUID } from "crypto"
import http from "http"
import "url"
import { redisConn } from "../app"

interface GlobalMessagesStored {
  type: string
  messageId: string
  userId: string
  userProfilePic: string
  username: string
  message: string
  time: string
}
interface CustomWebSocket extends WebSocket {
  id: string
  username: string
  auth: boolean
}

interface PrivateMessageRequest {
  from: { id: string; username: string; profilePic: string | null }
  destiny: {
    to: {
      id: string
      username: string
      profilePic: string | null
    }
  }
  message: string
}

const defaultImg = "https://i.postimg.cc/hjvSCcM3/jOkraDo.png"

export default class WebSocketConnection {
  private server
  private wsServer
  private port
  private connectedUsers: {
    id: string
    username: string
    connection: CustomWebSocket
  }[] = []
  private defaultProfilePic = defaultImg
  private globalMessagesStored = [] as GlobalMessagesStored[]

  constructor(
    server: http.Server<typeof http.IncomingMessage, typeof http.ServerResponse>,
    port: string
  ) {
    this.server = server
    this.wsServer = new WebSocketServer({ server })
    this.port = port
  }

  public init() {
    this.wsServer.on("connection", async (ws: CustomWebSocket) => {
      this.globalMessagesStored = []

      const randomUserId = randomUUID()
      const randomUserName = `User${faker.number.int({ max: 10000 })}`

      const [_, globalMessagesKeys] = await redisConn.scan(
        0,
        "MATCH",
        "global_message*"
      )

      if (globalMessagesKeys.length > 0) {
        for await (let msg of globalMessagesKeys) {
          const message = await redisConn.get(msg)

          if (message) {
            this.globalMessagesStored.push(
              JSON.parse(message) as GlobalMessagesStored
            )
          }
        }
      }

      if (this.globalMessagesStored.length > 0) {
        ws.send(
          JSON.stringify({
            action: "stored_global_msgs",
            data: this.globalMessagesStored,
          })
        )
      }

      ws.on("message", (data) => {
        const { action, data: clientData, ...userProfile } = JSON.parse(String(data))

        switch (action) {
          case "new-message": {
            this.globalChatMessage(
              clientData,
              ws.id,
              ws.username,
              userProfile.user.profilePic ?? this.defaultProfilePic
            )

            break
          }

          case "new-private-message": {
            this.privateChatMessage(ws.id, ws.username, clientData)

            break
          }

          case "get-connected-users": {
            this.getConnectedUsers()
          }

          case "personal-user-id": {
            if (clientData === null) {
              ws.id = randomUserId
              ws.username = randomUserName
              ws.auth = false
            } else {
              ws.id = clientData.id
              ws.username = clientData.username
              ws.auth = true
            }

            this.wsServer.clients.forEach((client) => {
              if (client.readyState === WebSocket.OPEN) {
                if (client["id" as keyof typeof client] === ws.id) {
                  client.send(
                    JSON.stringify({
                      action: "my-personal-id",
                      data: {
                        id: ws.id,
                        username: ws.username,
                        auth: ws.auth,
                      },
                    })
                  )
                }
              }
            })

            const checkIfUserIsAlreadyConnected = this.connectedUsers.find(
              (user) => user.id === ws.id
            )

            if (!checkIfUserIsAlreadyConnected) {
              this.newUserConnection(ws.id, ws.username, ws)
            } else {
              checkIfUserIsAlreadyConnected.id = ws.id
              checkIfUserIsAlreadyConnected.username = ws.username

              this.getConnectedUsers()
            }
          }

          default:
            null
        }
      })

      ws.on("close", () => {
        this.globalChatCloseConnection(ws.id)

        ws.close()
      })

      ws.on("error", console.error)
    })

    this.server.listen(this.port, () => {
      console.log("Websocket running at: " + this.port)
    })
  }

  private async globalChatMessage(
    clientData: WebSocket,
    userId: string,
    username: string,
    profilePic: string
  ) {
    const parsedMessage = String(clientData)

    const newMessage = {
      action: "global-message",
      data: {
        type: "message",
        messageId: randomUUID(),
        userId: userId,
        userProfilePic: profilePic ?? this.defaultProfilePic,
        username,
        message: parsedMessage,
        time: new Date(),
      },
    }

    const REDIS_GLOBAL_MESSAGES_EXP = 24 * 60 * 60 // 1 day

    await redisConn.set(
      `global_message${randomUUID()}`,
      JSON.stringify(newMessage.data),
      "EX",
      REDIS_GLOBAL_MESSAGES_EXP
    )

    this.wsServer.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(newMessage))
      }
    })
  }

  private privateChatMessage(
    myId: string,
    myUsername: string,
    messageInformations: PrivateMessageRequest
  ) {
    const destinationId = messageInformations.destiny.to.id

    const sendToUsername = this.connectedUsers.find(
      (user) => user.id === destinationId
    )

    const newPrivateMessage = JSON.stringify({
      action: "private-message",
      data: {
        type: "private-message",
        messageId: randomUUID(),
        userId: myId,
        username: myUsername,
        sendToId: destinationId,
        sendToUsername: sendToUsername?.username,
        message: messageInformations.message,
        userProfilePic:
          messageInformations.from.profilePic ?? this.defaultProfilePic,
        userProfilePicTo: messageInformations.destiny.to.profilePic,
        time: new Date(),
      },
    })

    this.wsServer.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        const clientId = client["id" as keyof typeof client]

        if (clientId === destinationId || clientId === myId)
          client.send(newPrivateMessage)
      }
    })
  }

  private newUserConnection(
    userId: string,
    username: string,
    newConnection: CustomWebSocket
  ) {
    this.connectedUsers.push({
      id: userId,
      username: username,
      connection: newConnection,
    })

    this.getConnectedUsers()

    const newConnectionMsg = JSON.stringify({
      action: "global-message",
      data: {
        type: "new-connection",
        messageId: randomUUID(),
        userId: userId,
        message: `User has connected: ${username}`,
        time: new Date(),
      },
    })

    this.wsServer.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(newConnectionMsg)
      }
    })
  }

  private globalChatCloseConnection(disconnectedId: string) {
    const getDc = this.connectedUsers.find((conn) => conn.id === disconnectedId)

    this.connectedUsers = this.connectedUsers.filter(
      (user) => user.id !== disconnectedId
    )

    const disconnectionMsg = JSON.stringify({
      action: "global-message",
      data: {
        type: "new-connection",
        messageId: randomUUID(),
        userId: disconnectedId,
        message: `User has disconnected: ${getDc?.username}`,
        time: new Date(),
      },
    })

    this.wsServer.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(disconnectionMsg)

        this.getConnectedUsers()
      }
    })
  }

  private getConnectedUsers() {
    const formatUsersList: { id: string; username: string; auth: boolean }[] = []

    for (let user of this.connectedUsers) {
      formatUsersList.push({
        id: user.id,
        username: user.username,
        auth: user.connection.auth,
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
