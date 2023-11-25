import { Message } from "../@types/types"

export interface MessageInterface {
  create(newMessage: Omit<Message, "messageId" | "createdAt">): Promise<Message>

  findUserIdMessages(userId: string): Promise<Message[]>
}
