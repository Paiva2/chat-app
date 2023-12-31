import { UserMessages } from "../../@types/types"
import { ConnectionsInterface } from "../../interfaces/connectionsInterface"
import { MessageInterface } from "../../interfaces/messageInterface"
import UserInterface from "../../interfaces/userInterface"

interface GetUserMessagesServiceRequest {
  userId: string
}

type GetUserMessagesServiceResponse = UserMessages[]

export default class GetUserMessagesService {
  constructor(
    private userInterface: UserInterface,
    private connectionsInterface: ConnectionsInterface,
    private messageInterface: MessageInterface
  ) {}

  async exec({
    userId,
  }: GetUserMessagesServiceRequest): Promise<GetUserMessagesServiceResponse> {
    if (!userId) {
      throw {
        status: 403,
        error: "Invalid user id.",
      }
    }

    const getUser = await this.userInterface.findById(userId)

    if (!getUser) {
      throw {
        status: 404,
        error: "User not found.",
      }
    }

    const getUserConnections = await this.connectionsInterface.findUserConnections(
      userId
    )

    if (!getUserConnections.length) {
      return [] as UserMessages[]
    }

    const getUserMessages = await this.messageInterface.findUserIdMessages(
      getUser.id
    )

    let formatMessages = [] as UserMessages[]

    for (const conn of getUserConnections) {
      for (let msg of getUserMessages) {
        if (msg.fkConnections === conn.id && conn.fkUser === userId) {
          const conversationMessages = formatMessages.find(
            (messages) =>
              messages.connections.includes(conn.connectionOne) &&
              messages.connections.includes(conn.connectionTwo)
          )

          if (conversationMessages) {
            conversationMessages?.data.push(msg)
          } else {
            formatMessages.push({
              connectionId: conn.id,
              connections: [conn.connectionOne, conn.connectionTwo],
              data: [msg],
            })
          }
        }
      }
    }

    return formatMessages
  }
}
