import { TypeOrm } from "../../data-source"
import { Message } from "../@types/types"
import { MessageEntity } from "../database/entities/Message.entity"
import { MessageInterface } from "../interfaces/messageInterface"

export default class MessageModel implements MessageInterface {
  private messageEntity = new MessageEntity()
  private messageRepository = TypeOrm.getRepository(MessageEntity)

  async create(newMessage: Omit<Message, "id" | "createdAt">): Promise<Message> {
    const fieldsToCreate = Object.keys(newMessage)

    for (let createField of fieldsToCreate) {
      const field = createField as keyof typeof this.messageEntity

      if (
        field !== "time" &&
        field !== "createdAt" &&
        field !== "messageId" &&
        field !== "user"
      ) {
        this.messageEntity[field] = newMessage[field]
      }
    }

    this.messageRepository.save(this.messageEntity)

    return this.messageEntity
  }

  async findUserIdMessages(userId: string): Promise<Message[]> {
    const getAllMessagesContainingThisUser = await this.messageRepository.find({
      where: [{ userId: userId }, { sendToId: userId }],
    })

    return getAllMessagesContainingThisUser
  }
}
