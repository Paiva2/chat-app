import { randomUUID } from "node:crypto"
import { Message } from "../@types/types"
import { MessageInterface } from "../interfaces/messageInterface"

export default class InMemoryMessage implements MessageInterface {
  private messages = [] as Message[]

  async create(newMessage: Omit<Message, "id" | "createdAt">): Promise<Message> {
    const message = {
      messageId: randomUUID(),
      message: newMessage.message,
      sendToId: newMessage.sendToId,
      sendToUsername: newMessage.sendToUsername,
      time: newMessage.time,
      type: newMessage.type,
      userId: newMessage.userId,
      userProfilePic: newMessage.userProfilePic,
      username: newMessage.username,
      createdAt: new Date(),
      fkConnections: newMessage.fkConnections,
    }

    this.messages.push(message)

    return message
  }

  async findUserIdMessages(userId: string): Promise<Message[]> {
    const getMessages = this.messages.filter(
      (message) => message.userId === userId || message.sendToId === userId
    )

    return getMessages
  }
}
