import { Message } from "../../@types/types"
import { ConnectionsInterface } from "../../interfaces/connectionsInterface"
import { MessageInterface } from "../../interfaces/messageInterface"

interface InsertNewPrivateMessageServiceRequest {
  newMessage: Omit<Message, "id" | "fkConnections" | "createdAt">
}

type InsertNewPrivateMessageServiceResponse = Message

export default class InsertNewPrivateMessageService {
  constructor(
    private connectionsInterface: ConnectionsInterface,
    private messageInterface: MessageInterface
  ) {}

  async exec({
    newMessage,
  }: InsertNewPrivateMessageServiceRequest): Promise<InsertNewPrivateMessageServiceResponse> {
    if (!Object.keys(newMessage).length) {
      throw {
        status: 409,
        error: "Invalid new private message format.",
      }
    }

    const getAnConnectionWithThoseIds =
      await this.connectionsInterface.findConnections([
        newMessage.sendToId,
        newMessage.userId, // send from
      ])

    if (!getAnConnectionWithThoseIds) {
      throw {
        status: 404,
        error: "Connection for private message not found.",
      }
    }

    const message = await this.messageInterface.create({
      type: "private-message",
      sendToId: newMessage.sendToId,
      sendToUsername: newMessage.sendToUsername,
      username: newMessage.username,
      userId: newMessage.userId,
      userProfilePic: newMessage.userProfilePic,
      time: newMessage.time || new Date(),
      message: newMessage.message,
      fkConnections: getAnConnectionWithThoseIds.id,
    })

    return message
  }
}
