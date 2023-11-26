import { TypeOrm } from "../../data-source"
import { Message } from "../@types/types"
import { MessageEntity } from "../database/entities/Message.entity"
import { MessageInterface } from "../interfaces/messageInterface"

export default class MessageModel implements MessageInterface {
  private messageEntity = new MessageEntity()
  private messageRepository = TypeOrm.getRepository(MessageEntity)

  async create(newMessage: Omit<Message, "id" | "createdAt">): Promise<Message> {
    const fieldsToCreate = Object.keys(newMessage)

    const message = {} as Message

    for (let createField of fieldsToCreate) {
      const field = createField as keyof typeof this.messageEntity

      if (
        field !== "time" &&
        field !== "createdAt" &&
        field !== "messageId" &&
        field !== "user"
      ) {
        message[field] = newMessage[field]
      }
    }

    await this.messageRepository
      .createQueryBuilder()
      .insert()
      .into(MessageEntity)
      .values([message])
      .execute()

    return this.messageEntity
  }

  async findUserIdMessages(userId: string): Promise<Message[]> {
    const getAllMessagesContainingThisUser = await this.messageRepository.find({
      where: [{ userId: userId }, { sendToId: userId }],
    })

    return getAllMessagesContainingThisUser
  }
}
