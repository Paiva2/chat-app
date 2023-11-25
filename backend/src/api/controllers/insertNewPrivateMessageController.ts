import { Request, Response } from "express"
import { ErrorHandling } from "../@types/types"
import Factory from "./factory"

export default class InsertNewPrivateMessageController {
  public static async handle(req: Request, res: Response) {
    const { newMessage } = req.body

    const { insertNewPrivateMessageService } = Factory.exec()

    try {
      await insertNewPrivateMessageService.exec({
        newMessage,
      })

      return res.status(201).send()
    } catch (e) {
      const error = e as ErrorHandling

      return res.status(error.status).send({ message: error.error })
    }
  }
}
